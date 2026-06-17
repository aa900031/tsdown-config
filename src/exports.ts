import type { ExportsOptions, RolldownChunk } from 'tsdown'
import * as path from 'node:path'

export const customExports: Extract<
	ExportsOptions['customExports'],
	(...args: any[]) => any
> = (
	exports,
	ctx,
) => {
	const formats = [['import', 'es'], ['require', 'cjs']]
	const pkgRoot = path.dirname(ctx.pkg.packageJsonPath)

	for (const [output, config] of Object.entries(exports)) {
		if (config == null || typeof config !== 'object')
			continue

		const typeChunkName = path.join(output, 'index.d')

		for (const [name, format] of formats) {
			const configValue = config[name]
			const chunks = (ctx.chunks as any)[format]
			if (typeof configValue !== 'string' || chunks == null)
				continue

			const typeChunk = findTypeChunk(chunks, typeChunkName)
			if (typeChunk) {
				exports[output][name] = {
					types: `./${path.relative(pkgRoot, path.join(typeChunk.outDir, typeChunk.fileName))}`,
					default: configValue,
				}
			}
		}
	}

	return exports
}

function findTypeChunk(
	chunks: RolldownChunk[],
	targetName: string,
): RolldownChunk | null {
	// First try exact match (e.g., "core/index.d" for output "./core" with src/core/index.ts)
	const exactMatch = chunks.find(chunk => isEntryChunk(chunk) && chunk.name === targetName)
	if (exactMatch)
		return exactMatch

	// For flat entries (e.g., "kit.d" for output "./kit" with src/kit.ts),
	// extract the base name from the path and look for it with .d suffix
	const baseName = targetName.split('/')[0]
	if (baseName !== 'index') {
		const flatMatch = chunks.find(chunk => isEntryChunk(chunk) && chunk.name === `${baseName}.d`)
		if (flatMatch)
			return flatMatch
	}

	// Fallback: use the first .d chunk found (for cases with single entry point used by multiple exports)
	return chunks.find(chunk => isEntryChunk(chunk) && chunk.name.endsWith('.d')) || null
}

function isEntryChunk(
	chunk: RolldownChunk,
): chunk is (RolldownChunk & { type: 'chunk' }) {
	return chunk.type === 'chunk' && chunk.isEntry
}
