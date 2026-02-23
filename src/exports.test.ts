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
})
