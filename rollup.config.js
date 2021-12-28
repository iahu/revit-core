import ttypescript from 'ttypescript'
import commomjs from '@rollup/plugin-commonjs'
import image from '@rollup/plugin-image'
import resolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import multiInput from 'rollup-plugin-multi-input'

/**
 * @type {import('rollup').RollupOptions}
 */
export default {
  input: ['./src/**/*.ts', '!./src/**/*.test.ts', '!./src/renderer', '!./src/data'],
  output: { dir: './dist/esm', format: 'esm', sourcemap: true },
  plugins: [
    resolve(),
    commomjs(),
    typescript({ typescript: ttypescript, tsconfig: './tsconfig.json' }),
    multiInput(),
    image(),
  ],
  external: ['konva', 'bluebird'],
}
