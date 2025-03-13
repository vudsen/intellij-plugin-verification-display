import {parseVerifyResult} from "../util";

export type VerifyResult = {
  version: string
  compatibilityProblems?: string
  verificationVerdict?: string
  dependencies?: string
  experimentalApiUsages?: string
  telemetry?: string
  deprecatedUsages?: string
}


const CLASS_PATTERN = /[\w$]+(\.[\w$]+)+((\([\w$ .,]+\))? : [\w$]+(\.[\w$]+)*)?/g
function quoteJavaClass(text: string): string[] {
  const builder: string[] = []
  let result: RegExpExecArray | null = null
  let head = 0
  while ((result = CLASS_PATTERN.exec(text))) {
    const pos = result.index
    builder.push(text.substring(head, pos))
    builder.push(`\`${result[0]}\``)
    head = pos + result[0].length
  }
  if (head < text.length) {
    builder.push(text.substring(head))
  }
  return builder
}

function splitLines(text: string[]): string[] {
  const builder: string[] = []
  if (text.length === 0) {
    return []
  }
  builder.push('- 🐞 ')
  for (let i = 0; i < text.length; i++) {
    const string = text[i]
    const pos = string.indexOf('\n')
    if (pos < 0) {
      builder.push(string)
      continue
    }
    builder.push(string.slice(0, pos))
    if (pos < string.length - 1 || i < text.length - 1) {
      builder.push('\n- 🐞 ')
      builder.push(string.slice(pos + 1))
    }
  }
  return builder
}



/**
 * 将验证结果解析为 markdown
 * @param unzippedRoot 验证输出的文件
 */
export default function parseAsMarkdown(unzippedRoot: string): string {
  const result = parseVerifyResult(unzippedRoot)
  const builder: string[] = ['# Plugin Verifier Check Result']

  for (let verifyResult of result) {
    builder.push(`\n\n## ${verifyResult.version}\n\n**Summary:** ${verifyResult.verificationVerdict}`)
    builder.push('\n\n### Compatibility Problems\n\n')
    if (verifyResult.compatibilityProblems) {
      builder.push(...splitLines(quoteJavaClass(verifyResult.compatibilityProblems)))
    } else {
      builder.push('✅ No compatibility problems found.')
    }
  }
  return builder.join('')
}