import * as process from "node:process";
import * as core from '@actions/core'

type Inputs = {
  pluginVerifierResultPath: string
  displayDependencies: boolean
  displayExperimentalApiUsages: boolean
  displayTelemetry: boolean
  displayDeprecatedUsages: boolean
}

export default function getInputs(): Inputs {
  if (process.env.NODE_ENV === 'development') {
    return {
      pluginVerifierResultPath: process.env.pluginVerifierResultPath,
      displayDependencies: process.env.displayDependencies === 'true',
      displayExperimentalApiUsages: process.env.displayExperimentalApiUsages === 'true',
      displayTelemetry: process.env.displayTelemetry === 'true',
      displayDeprecatedUsages: process.env.displayDeprecatedUsages === 'true',
    }
  } else {
    return {
      pluginVerifierResultPath: core.getInput('plugin-verifier-result-path'),
      displayDependencies: false,
      displayExperimentalApiUsages: false,
      displayTelemetry: false,
      displayDeprecatedUsages: false,
    }
  }
}