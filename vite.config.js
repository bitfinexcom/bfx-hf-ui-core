import { defineConfig } from 'vite'
import path from 'path'
import fs from 'fs'
import react from '@vitejs/plugin-react'
import svgrPlugin from 'vite-plugin-svgr'
import vitePluginRequire from 'vite-plugin-require'
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'
// You don't need to add this to deps, it's included by @esbuild-plugins/node-modules-polyfill
import rollupNodePolyFill from 'rollup-plugin-node-polyfills'

import { dependencies } from './package.json'

// Fixed an issue related to react-virtualized bogus import:
// import { bpfrpt_proptype_WindowScroller } from '../WindowScroller.js'
const reactVirtualized = () => {
  const WRONG_CODE = `import { bpfrpt_proptype_WindowScroller } from "../WindowScroller.js";`
  return {
    name: 'my:react-virtualized',
    configResolved() {
      const file = require
        .resolve('react-virtualized')
        .replace(
          path.join('dist', 'commonjs', 'index.js'),
          path.join('dist', 'es', 'WindowScroller', 'utils', 'onScroll.js'),
        )
      const code = fs.readFileSync(file, 'utf-8')
      const modified = code.replace(WRONG_CODE, '')
      fs.writeFileSync(file, modified)
    },
  }
}

// To support code splitting
function renderChunks(deps) {
  const chunks = {}
  Object.keys(deps).forEach((key) => {
    if (['react', 'react-router-dom', 'react-dom'].includes(key)) return
    chunks[key] = [key]
  })
  return chunks
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [reactVirtualized(), react(), svgrPlugin(), vitePluginRequire()],
  resolve: {
    alias: {
      // This Rollup aliases are extracted from @esbuild-plugins/node-modules-polyfill, 
      // see https://github.com/remorses/esbuild-plugins/blob/master/node-modules-polyfill/src/polyfills.ts
      util: 'rollup-plugin-node-polyfills/polyfills/util',
      sys: 'util',
      // events: 'rollup-plugin-node-polyfills/polyfills/events',
      stream: 'rollup-plugin-node-polyfills/polyfills/stream',
      path: 'rollup-plugin-node-polyfills/polyfills/path',
      querystring: 'rollup-plugin-node-polyfills/polyfills/qs',
      punycode: 'rollup-plugin-node-polyfills/polyfills/punycode',
      url: 'rollup-plugin-node-polyfills/polyfills/url',
      // string_decoder: 'rollup-plugin-node-polyfills/polyfills/string-decoder',
      http: 'rollup-plugin-node-polyfills/polyfills/http',
      https: 'rollup-plugin-node-polyfills/polyfills/http',
      os: 'rollup-plugin-node-polyfills/polyfills/os',
      assert: 'rollup-plugin-node-polyfills/polyfills/assert',
      constants: 'rollup-plugin-node-polyfills/polyfills/constants',
      _stream_duplex:
        'rollup-plugin-node-polyfills/polyfills/readable-stream/duplex',
      _stream_passthrough:
        'rollup-plugin-node-polyfills/polyfills/readable-stream/passthrough',
      _stream_readable:
        'rollup-plugin-node-polyfills/polyfills/readable-stream/readable',
      _stream_writable:
        'rollup-plugin-node-polyfills/polyfills/readable-stream/writable',
      _stream_transform:
        'rollup-plugin-node-polyfills/polyfills/readable-stream/transform',
      timers: 'rollup-plugin-node-polyfills/polyfills/timers',
      console: 'rollup-plugin-node-polyfills/polyfills/console',
      vm: 'rollup-plugin-node-polyfills/polyfills/vm',
      zlib: 'rollup-plugin-node-polyfills/polyfills/zlib',
      tty: 'rollup-plugin-node-polyfills/polyfills/tty',
      domain: 'rollup-plugin-node-polyfills/polyfills/domain',
      buffer: 'rollup-plugin-node-polyfills/polyfills/buffer-es6',
      process: 'rollup-plugin-node-polyfills/polyfills/process-es6',
      crypto: 'crypto-browserify',
      events: 'events',
    },
  },
  server: {
    open: true,
    port: 3000,
  },
  esbuild: {
    loader: 'jsx',
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
        // '.ts': 'tsx',
      },
    },
    include: ['./src'],
  },
  assetsInclude: ['src/public', '**/*.md'],
  define: {
    // Node.js global to browser globalThis
    global: 'globalThis',
    // Enable esbuild polyfill plugins
    plugins: [
      NodeGlobalsPolyfillPlugin({
        buffer: true,
      }),
    ],
    // Needed so the app won't crash when trying to access process.env
    'process.env': {},
  },
  build: {
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-router-dom', 'react-dom'],
          ...renderChunks(dependencies),
        },
      },
      plugins: [
        // Enable rollup polyfills plugin
        // used during production bundling
        rollupNodePolyFill(),
      ],
    },
    commonjsOptions: {
      include: [/src/, /node_modules/],
    },
  },
})
