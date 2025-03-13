import {parseVerifyResult} from "../util";

export function parseWithWebLink(unzippedRoot: string, visitPath: string): string {
  const result = parseVerifyResult(unzippedRoot)
  const builder: string[] = [`# 📖 Verification Result
  
  | Version | Summary | Links |
  | ------- | ------- | ------ |
  `]
  for (let verifyResult of result) {
    builder.push('| ')
    builder.push(verifyResult.version)
    builder.push(' | ')
    builder.push(verifyResult.verificationVerdict ?? '-')
    builder.push(' | ')
    builder.push(`[Detail](${visitPath}/${verifyResult.version}/report)`)
    builder.push(' |\n')
  }
  return builder.join('')
}