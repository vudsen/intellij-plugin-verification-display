import * as StreamZip from "node-stream-zip";
import getInputs from "./input";
import * as core from '@actions/core'
import * as path from "node:path";
import * as fs from "node:fs";
import * as os from "node:os";
import parseAsMarkdown, {VerifyResult} from "./template";



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
    compatibilityProblems: fs.readFileSync(path.join(base, 'compatibility-problems.txt'), {encoding: 'utf8'}),
    verificationVerdict: fs.readFileSync(path.join(base, 'verification-verdict.txt'), {encoding: 'utf8'}),
    dependencies: input.displayDependencies ? undefined : fs.readFileSync(path.join(base, 'dependencies.txt'), {encoding: 'utf8'}),
    experimentalApiUsages: input.displayExperimentalApiUsages ? undefined : fs.readFileSync(path.join(base, 'experimental-api-usages.txt'), {encoding: 'utf8'}),
    telemetry: input.displayTelemetry ? undefined : fs.readFileSync(path.join(base, 'telemetry.txt'), {encoding: 'utf8'}),
    deprecatedUsages: input.displayDeprecatedUsages ? undefined : fs.readFileSync(path.join(base, 'deprecated-usages.txt'), {encoding: 'utf8'}),
  }
}

async function parseResult(unzippedRoot: string): Promise<VerifyResult[]> {
  const results: VerifyResult[] = []
  for (let entry of fs.readdirSync(unzippedRoot)) {
    results.push(await parseVersion(path.join(unzippedRoot, entry), entry))
  }
  return results
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

  console.log(parseAsMarkdown(await parseResult(root)));
  if (process.env.NODE_ENV === 'development') {
    fs.rmSync(root, { recursive: true })
  }
}


main().catch(e => {
  core.setFailed(e)
  throw e
})