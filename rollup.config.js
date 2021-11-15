import typescript from '@rollup/plugin-typescript'
import multiInput from 'rollup-plugin-multi-input'
import image from '@rollup/plugin-image'

/**
 * @type {import('rollup').RollupOptions}
 */
export default {
  input: ['./src/**/*.ts', '!./src/**/*.test.ts', '!./src/renderer', '!./src/data'],
  output: { dir: './dist/esm', format: 'esm', sourcemap: true },
  plugins: [typescript({ tsconfig: './tsconfig.json' }), multiInput(), image()],
  external: ['konva', 'rxjs'],
}
