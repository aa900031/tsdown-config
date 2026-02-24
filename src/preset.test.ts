import { describe, expect, it } from 'vitest'
import { vue } from './preset'

describe('preset', () => {
	describe('vue', () => {
		it('shoulde return config right', () => {
			const config = vue()
			expect(config.entry).toBe('src/index.ts')
			expect(config.dts).contains({
				vue: true,
			})
		})
	})
})
