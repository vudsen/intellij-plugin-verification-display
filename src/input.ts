import * as process from "node:process";
import * as core from '@actions/core'

type Inputs = {
  pluginVerifierResultPath: string
  displayDependencies: boolean
  displayExperimentalApiUsages: boolean
  displayTelemetry: boolean
  displayDeprecatedUsages: boolean
  visitPath?: string
  token: string
}

export default function getInputs(): Inputs {
  if (process.env.NODE_ENV === 'development') {
    return {
      pluginVerifierResultPath: process.env.pluginVerifierResultPath,
      displayDependencies: process.env.displayDependencies === 'true',
      displayExperimentalApiUsages: process.env.displayExperimentalApiUsages === 'true',
      displayTelemetry: process.env.displayTelemetry === 'true',
      displayDeprecatedUsages: process.env.displayDeprecatedUsages === 'true',
      visitPath: undefined,
      token: ''
    }
  } else {
    return {
      pluginVerifierResultPath: core.getInput('plugin-verifier-result-path'),
      displayDependencies: false,
      displayExperimentalApiUsages: false,
      displayTelemetry: false,
      displayDeprecatedUsages: false,
      token: core.getInput('token'),
      visitPath: core.getInput('visit-path'),
    }
  }
}