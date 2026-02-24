import { describe, expect, it } from 'vitest'
import { customExports } from './exports'

describe('customExports', () => {
	it('should handle null or non-object config values', async () => {
		const exportsObj = {
			'.': null,
		}
		const ctx = {
			pkg: {
				packageJsonPath: '/project/package.json',
			},
			chunks: {
				es: [],
				cjs: [],
			},
		}

		const result = await customExports(exportsObj, ctx as any)
		expect(result['.'] == null).toBe(true)
	})

	it('should process .d chunk types correctly', async () => {
		const exportsObj = {
			'.': {
				import: './dist/index.mjs',
				require: './dist/index.cjs',
			},
		}
		const ctx = {
			pkg: {
				packageJsonPath: '/project/package.json',
			},
			chunks: {
				es: [
					{
						type: 'chunk',
						name: 'index.d',
						isEntry: true,
						outDir: '/project/dist',
						fileName: 'index.d.mts',
					},
				],
				cjs: [
					{
						type: 'chunk',
						name: 'index.d',
						isEntry: true,
						outDir: '/project/dist',
						fileName: 'index.d.cts',
					},
				],
			},
		}

		const result = await customExports(exportsObj, ctx as any)
		expect(result['.'].import).toEqual({
			default: './dist/index.mjs',
			types: './dist/index.d.mts',
		})
		expect(result['.'].require).toEqual({
			default: './dist/index.cjs',
			types: './dist/index.d.cts',
		})
	})

	it('should skip chunks that are not .d type', async () => {
		const exportsObj = {
			'.': {
				import: './dist/index.mjs',
			},
		}
		const ctx = {
			pkg: {
				packageJsonPath: '/project/package.json',
			},
			chunks: {
				es: [
					{
						type: 'chunk',
						name: 'index',
						outDir: '/project/dist',
						fileName: 'index.mjs',
					},
				],
			},
		}

		const result = await customExports(exportsObj, ctx as any)
		// Should remain unchanged since chunk name doesn't end with .d
		expect(result['.'].import).toBe('./dist/index.mjs')
	})

	it('should handle missing chunks correctly', async () => {
		const exportsObj = {
			'.': {
				import: './dist/index.mjs',
				require: './dist/index.cjs',
			},
		}
		const ctx = {
			pkg: {
				packageJsonPath: '/project/package.json',
			},
			chunks: {
				es: [],
				cjs: [],
			},
		}

		const result = await customExports(exportsObj, ctx as any)
		expect(result['.'].import).toBe('./dist/index.mjs')
		expect(result['.'].require).toBe('./dist/index.cjs')
	})

	it('should skip non-string config values', async () => {
		const exportsObj = {
			'.': {
				import: 123,
				require: {},
			},
		}
		const ctx = {
			pkg: {
				packageJsonPath: '/project/package.json',
			},
			chunks: {
				es: [
					{
						type: 'chunk',
						name: 'index.d',
						outDir: '/project/dist',
						fileName: 'index.d.mts',
					},
				],
				cjs: [
					{
						type: 'chunk',
						name: 'index.d',
						outDir: '/project/dist',
						fileName: 'index.d.cts',
					},
				],
			},
		}

		const result = await customExports(exportsObj, ctx as any)
		expect(result['.'].import).toBe(123)
		expect(result['.'].require).toEqual({})
	})

	it('should handle multiple exports correctly', async () => {
		const exportsObj = {
			'.': {
				import: './dist/index.mjs',
				require: './dist/index.cjs',
			},
			'./utils': {
				import: './dist/utils.mjs',
				require: './dist/utils.cjs',
			},
		}
		const ctx = {
			pkg: {
				packageJsonPath: '/project/package.json',
			},
			chunks: {
				es: [
					{
						type: 'chunk',
						name: 'index.d',
						isEntry: true,
						outDir: '/project/dist',
						fileName: 'index.d.mts',
					},
				],
				cjs: [
					{
						type: 'chunk',
						name: 'index.d',
						isEntry: true,
						outDir: '/project/dist',
						fileName: 'index.d.cts',
					},
				],
			},
		}

		const result = await customExports(exportsObj, ctx as any)
		// Both exports get the same index.d chunk since the function applies
		// the first .d chunk found to all exports with matching format
		expect(result['.'].import.types).toBe('./dist/index.d.mts')
		expect(result['./utils'].import.types).toBe('./dist/index.d.mts')
	})

	it('should calculate relative paths correctly with nested directories', async () => {
		const exportsObj = {
			'.': {
				import: './dist/index.mjs',
			},
		}
		const ctx = {
			pkg: {
				packageJsonPath: '/project/packages/core/package.json',
			},
			chunks: {
				es: [
					{
						type: 'chunk',
						name: 'index.d',
						isEntry: true,
						outDir: '/project/packages/core/dist',
						fileName: 'index.d.mts',
					},
				],
			},
		}

		const result = await customExports(exportsObj, ctx as any)
		expect(result['.'].import.types).toBe('./dist/index.d.mts')
	})

	it('should skip chunks that are not of type "chunk"', async () => {
		const exportsObj = {
			'.': {
				import: './dist/index.mjs',
			},
		}
		const ctx = {
			pkg: {
				packageJsonPath: '/project/package.json',
			},
			chunks: {
				es: [
					{
						type: 'asset',
						name: 'index.d',
						outDir: '/project/dist',
						fileName: 'index.d.mts',
					},
				],
			},
		}

		const result = await customExports(exportsObj, ctx as any)
		expect(result['.'].import).toBe('./dist/index.mjs')
	})

	it('should handle chunks array with mixed types', async () => {
		const exportsObj = {
			'.': {
				import: './dist/index.mjs',
				require: './dist/index.cjs',
			},
		}
		const ctx = {
			pkg: {
				packageJsonPath: '/project/package.json',
			},
			chunks: {
				es: [
					{
						type: 'asset',
						name: 'icon.svg',
						outDir: '/project/dist',
						fileName: 'icon.svg',
					},
					{
						type: 'chunk',
						name: 'index.d',
						isEntry: true,
						outDir: '/project/dist',
						fileName: 'index.d.mts',
					},
				],
				cjs: [
					{
						type: 'chunk',
						name: 'index.d',
						isEntry: true,
						outDir: '/project/dist',
						fileName: 'index.d.cts',
					},
				],
			},
		}

		const result = await customExports(exportsObj, ctx as any)
		expect(result['.'].import).toEqual({
			default: './dist/index.mjs',
			types: './dist/index.d.mts',
		})
	})

	it('should preserve original object structure if no .d chunks found', async () => {
		const exportsObj = {
			'.': {
				import: './dist/index.mjs',
			},
		}
		const originalValue = exportsObj['.'].import
		const ctx = {
			pkg: {
				packageJsonPath: '/project/package.json',
			},
			chunks: {
				es: [],
			},
		}

		const result = await customExports(exportsObj, ctx as any)
		expect(result['.'].import).toBe(originalValue)
	})

	it('should handle right types', async () => {
		const exports = {
			'./core': {
				import: './dist/core/index.js',
				require: './dist/core/index.cjs',
			},
			'./svelte': {
				import: './dist/svelte/index.js',
				require: './dist/svelte/index.cjs',
			},
			'./vue': {
				import: './dist/vue/index.js',
				require: './dist/vue/index.cjs',
			},
			'./package.json': './package.json',
		}
		const ctx = {
			pkg: {
				packageJsonPath: '/project/package.json',
			},
			chunks: {
				cjs: [
					{
						fileName: 'core/index.cjs',
						name: 'core/index',
						isEntry: true,
						type: 'chunk',
						outDir: '/project/dist',
					},
					{
						fileName: 'core/index.d.cts',
						name: 'core/index.d',
						isEntry: true,
						type: 'chunk',
						outDir: '/project/dist',
					},
					{
						fileName: 'svelte/index.cjs',
						name: 'svelte/index',
						isEntry: true,
						type: 'chunk',
						outDir: '/project/dist',
					},
					{
						fileName: 'svelte/index.d.cts',
						name: 'svelte/index.d',
						isEntry: true,
						type: 'chunk',
						outDir: '/project/dist',
					},
					{
						fileName: 'svelte/index.svelte.cjs',
						name: 'svelte/index.svelte',
						isEntry: false,
						type: 'chunk',
						outDir: '/project/dist',
					},
					{
						fileName: 'svelte/index.svelte.d.cts',
						name: 'svelte/index.svelte.d',
						isEntry: false,
						type: 'chunk',
						outDir: '/project/dist',
					},
					{
						fileName: 'vue/index.cjs',
						name: 'vue/index',
						isEntry: true,
						type: 'chunk',
						outDir: '/project/dist',
					},
					{
						fileName: 'vue/index.d.cts',
						name: 'vue/index.d',
						isEntry: true,
						type: 'chunk',
						outDir: '/project/dist',
					},
				],
				es: [
					{
						fileName: 'core/index.d.ts',
						name: 'core/index.d',
						isEntry: true,
						type: 'chunk',
						outDir: '/project/dist',
					},
					{
						fileName: 'core/index.js',
						name: 'core/index',
						isEntry: true,
						type: 'chunk',
						outDir: '/project/dist',
					},
					{
						fileName: 'svelte/index.d.ts',
						name: 'svelte/index.d',
						isEntry: true,
						type: 'chunk',
						outDir: '/project/dist',
					},
					{
						fileName: 'svelte/index.js',
						name: 'svelte/index',
						isEntry: true,
						type: 'chunk',
						outDir: '/project/dist',
					},
					{
						fileName: 'svelte/index.svelte.d.ts',
						name: 'svelte/index.svelte.d',
						isEntry: false,
						type: 'chunk',
						outDir: '/project/dist',
					},
					{
						fileName: 'svelte/index.svelte.js',
						name: 'svelte/index.svelte',
						isEntry: false,
						type: 'chunk',
						outDir: '/project/dist',
					},
					{
						fileName: 'vue/index.d.ts',
						name: 'vue/index.d',
						isEntry: true,
						type: 'chunk',
						outDir: '/project/dist',
					},
					{
						fileName: 'vue/index.js',
						name: 'vue/index',
						isEntry: true,
						type: 'chunk',
						outDir: '/project/dist',
					},
				],
			},
		}

		const result = await customExports(exports, ctx as any)

		for (const name of ['core', 'vue', 'svelte']) {
			expect(result[`./${name}`].import).toEqual({
				types: `./dist/${name}/index.d.ts`,
				default: `./dist/${name}/index.js`,
			})
			expect(result[`./${name}`].require).toEqual({
				types: `./dist/${name}/index.d.cts`,
				default: `./dist/${name}/index.cjs`,
			})
		}
	})
})
