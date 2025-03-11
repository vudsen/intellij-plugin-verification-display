declare namespace NodeJS {
  export interface ProcessEnv {
    /**
     * 验证结果的压缩包
     */
    readonly pluginVerifierResultPath: string
    /**
     * 打印依赖项
     */
    readonly displayDependencies: 'true' | 'false'
    /**
     * 打印使用的试验性API
     */
    readonly displayExperimentalApiUsages: 'true' | 'false'
    /**
     * 打印遥测数据
     */
    readonly displayTelemetry: 'true' | 'false'
  }
}