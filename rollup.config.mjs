import typescript from '@rollup/plugin-typescript'
import nodeResolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import terser from '@rollup/plugin-terser'
import { defineConfig } from 'rollup'
import replace from 'rollup-plugin-replace'

if (process.env.NODE_ENV === undefined) {
  process.env.NODE_ENV = 'development'
}

export default defineConfig({
    input: 'src/index.ts',
    output: {
      file: 'dist/bundle.js',
      format: 'es',
      compact: true,
      sourcemapFile: 'dist/sourcemap.json',
      sourcemap: true,
      sourcemapIgnoreList: relativeSourcePath => {
        return relativeSourcePath.includes('node_modules')
      }
    },
    plugins: [
      replace({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
        sourcemap: true
      }),
      typescript(),
      commonjs(),
      nodeResolve(),
      terser(),
    ],
  }
)