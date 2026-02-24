import { describe, expect, it } from 'vitest'
import { base, lib, node, vue } from './preset'

describe('preset', () => {
	describe('base', () => {
		it('should return config object', () => {
			const config = base()
			expect(config).toBeDefined()
			expect(config.entry).toBe('src/index.ts')
			expect(config.exports).toBeDefined()
			expect(config.dts).toBeDefined()
		})

		it('should support entry option "shallow"', () => {
			const config = base({ entry: 'shallow' })
			expect(config.entry).toBe('src/*.ts')
		})

		it('should support entry option "all"', () => {
			const config = base({ entry: 'all' })
			expect(config.entry).toBe('src/**/*.ts')
		})

		it('should support custom entry', () => {
			const customEntry = [
				'src/main.ts',
			]
			const config = base({ entry: customEntry })
			expect(config.entry).toBe(customEntry)
		})

		it('should merge overrides config', () => {
			const config = base({}, { platform: 'node' })
			expect(config.platform).toBe('node')
		})
	})

	describe('node', () => {
		it('should return config with node platform', () => {
			const config = node()
			expect(config).toBeDefined()
			expect(config.entry).toBe('src/index.ts')
			expect(config.platform).toBe('node')
		})

		it('should merge overrides config', () => {
			const config = node({}, { entry: 'src/cli.ts' })
			expect(config.entry).toBe('src/cli.ts')
			expect(config.platform).toBe('node')
		})
	})

	describe('lib', () => {
		it('should return config with neutral platform', () => {
			const config = lib()
			expect(config).toBeDefined()
			expect(config.entry).toBe('src/index.ts')
			expect(config.platform).toBe('neutral')
		})

		it('should merge overrides config', () => {
			const config = lib({}, { entry: 'src/lib.ts' })
			expect(config.entry).toBe('src/lib.ts')
			expect(config.platform).toBe('neutral')
		})
	})

	describe('vue', () => {
		it('should return config with vue support', () => {
			const config = vue()
			expect(config).toBeDefined()
			expect(config.entry).toBe('src/index.ts')
			expect(config.platform).toBe('neutral')
			expect(config.dts).toBeDefined()
		})

		it('should have vue option in dts', () => {
			const config = vue()
			expect(config.dts).toHaveProperty('vue', true)
		})

		it('should merge overrides config', () => {
			const config = vue({}, { entry: 'src/components.ts' })
			expect(config.entry).toBe('src/components.ts')
			expect(config.platform).toBe('neutral')
		})
	})
})
