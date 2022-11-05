// import { copySync, existsSync, mkdirSync } from 'fs-extra'
const { copySync, existsSync, mkdirSync } = require('fs-extra')
const { resolve } = require('path')

const treeSitterrPath = resolve(__dirname, "../packages/tree-sitter-clausewitz")
const anycodePath = resolve(__dirname, "../apps/anycode-clausewitz")

if (!existsSync(`${anycodePath}/dist/queries`)) {
    mkdirSync(`${anycodePath}/dist/queries`, { recursive: true })
}
copySync(`${treeSitterrPath}/queries`, `${anycodePath}/dist/queries`, { overwrite: true })
copySync(`${treeSitterrPath}/tree-sitter-clausewitz.wasm`, `${anycodePath}/dist/tree-sitter-clausewitz.wasm`, { overwrite: true })