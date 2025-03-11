import * as StreamZip from "node-stream-zip";
import getInputs from "./input";
import * as core from '@actions/core'
import * as path from "node:path";
import * as fs from "node:fs";
import * as os from "node:os";
import * as github from "@actions/github";
import parseAsMarkdown, {VerifyResult} from "./template";

function safeReadFile(filePath: string): string | undefined {
  if (fs.existsSync(filePath)) {
    return fs.readFileSync(filePath, { encoding: "utf8" });
  }
}

async function parseVersion(root: string, ideVersion: string): Promise<VerifyResult> {
  const input = getInputs()
  let base = path.join(root, 'plugins')
  const groupIds = fs.readdirSync(base)
  if (groupIds.length !== 1) {
    throw new Error('Plugin has multiply group id? We are currently not supported');
  }
  base = path.join(base, groupIds[0])
  const versions = fs.readdirSync(base)
  if (versions.length !== 1) {
    throw new Error('Plugin has multiply version? We are currently not supported');
  }
  base = path.join(base, versions[0])
  return {
    version: ideVersion,
    compatibilityProblems: safeReadFile(path.join(base, 'compatibility-problems.txt')),
    verificationVerdict: safeReadFile(path.join(base, 'verification-verdict.txt')),
    dependencies: input.displayDependencies ? safeReadFile(path.join(base, 'dependencies.txt')) : undefined,
    experimentalApiUsages: input.displayExperimentalApiUsages ? safeReadFile(path.join(base, 'experimental-api-usages.txt')) : undefined,
    telemetry: input.displayTelemetry ? safeReadFile(path.join(base, 'telemetry.txt')) : undefined,
    deprecatedUsages: input.displayDeprecatedUsages ? safeReadFile(path.join(base, 'deprecated-usages.txt')) : undefined,
  }
}

async function parseResult(unzippedRoot: string): Promise<VerifyResult[]> {
  const results: VerifyResult[] = []
  for (let entry of fs.readdirSync(unzippedRoot)) {
    results.push(await parseVersion(path.join(unzippedRoot, entry), entry))
  }
  return results
}

async function replyMarkdown(token: string, markdown: string) : Promise<void> {
  const octokit = github.getOctokit(token)
  await octokit.rest.issues.createComment({
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    issue_number: github.context.issue.number,
    body: markdown,
  })
}

async function main() {
  const input = getInputs()

  const zip = new StreamZip.async({ file: input.pluginVerifierResultPath })
  const root = path.join(os.tmpdir(), fs.mkdtempSync('pluginVerifier', { encoding: 'utf-8' }))
  if (process.env.NODE_ENV === 'development') {
    console.log(`Created a temporary dir on: ${root}`)
  }
  await zip.extract(null, root);
  await zip.close()

  const markdown = parseAsMarkdown(await parseResult(root))


  if (process.env.NODE_ENV === 'development') {
    console.log(markdown)
    fs.rmSync(root, { recursive: true })
  } else {
    await replyMarkdown(input.token, markdown)
  }
}


main().catch(e => {
  core.setFailed(e)
  throw e
})