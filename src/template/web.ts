import {parseVerifyResult} from "../util";

function highlightCompatible(text?: string): string {
  if (!text) {
    return '-'
  }
  const pos = text.indexOf('Compatible')
  if (pos === -1) {
    return '❌ ' + text
  }
  return '✅ ' + text
}

export function parseWithWebLink(unzippedRoot: string, visitPath: string): string {
  const result = parseVerifyResult(unzippedRoot)
  const builder: string[] = ["# 📖 Verification Result\n\n| Version | Summary | Links |\n| ------- | ------- | ------ |\n"]
  for (let verifyResult of result) {
    builder.push('| ')
    builder.push(verifyResult.version)
    builder.push(' | ')
    builder.push(highlightCompatible(verifyResult.verificationVerdict?.trim()))
    builder.push(' | ')
    builder.push(`[Detail](${visitPath}/${verifyResult.version}/report)`)
    builder.push(' |\n')
  }
  return builder.join('')
}