import fs from "node:fs";
import getInputs from "./input";
import path from "node:path";
import {VerifyResult} from "./template/basic";

function safeReadFile(filePath: string): string | undefined {
  if (fs.existsSync(filePath)) {
    return fs.readFileSync(filePath, { encoding: "utf8" });
  }
}

function parseVersion(root: string, ideVersion: string): VerifyResult {
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

export function parseVerifyResult(unzippedRoot: string): VerifyResult[] {
  const results: VerifyResult[] = []
  for (let entry of fs.readdirSync(unzippedRoot)) {
    results.push(parseVersion(path.join(unzippedRoot, entry), entry))
  }
  return results
}