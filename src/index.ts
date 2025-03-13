import getInputs from "./input";
import * as core from '@actions/core'
import * as github from "@actions/github";
import parseAsMarkdown from "./template/basic";
import {parseWithWebLink} from "./template/web";


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

  let markdown: string
  if (input.visitPath) {
    markdown = parseWithWebLink(input.pluginVerifierResultPath, input.visitPath)
  } else {
    markdown = parseAsMarkdown(input.pluginVerifierResultPath)
  }

  await replyMarkdown(input.token, markdown)
  if (process.env.NODE_ENV === 'development') {
    console.log(markdown)
  }
}


main().catch(e => {
  core.setFailed(e)
  throw e
})