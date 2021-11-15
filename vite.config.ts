import { defineConfig } from 'vite'
import path from 'path'
import babel from '@rollup/plugin-babel'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    babel({
      extensions: ['.ts', '.js'],
      plugins: [
        ['@babel/plugin-proposal-decorators', { legacy: true }],
        ['@babel/plugin-proposal-class-properties', { loose: true }],
      ],
    }),
  ],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'MyLib',
    },
    rollupOptions: {
      // 确保外部化处理那些你不想打包进库的依赖
      external: ['vue'],
      output: {
        // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
  resolve: {
    alias: {
      '@actions': path.resolve(__dirname, './src/actions'),
      '@api': path.resolve(__dirname, './src/api'),
      '@shapes': path.resolve(__dirname, './src/shapes'),
      '@input': path.resolve(__dirname, './src/input'),
    },
  },
})
