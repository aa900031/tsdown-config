import type { ExportsOptions, RolldownChunk } from 'tsdown'
import * as path from 'node:path'

export const customExports: NonNullable<ExportsOptions['customExports']> = (
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
	return (targetName && chunks.find(chunk => isEntryChunk(chunk) && chunk.name === targetName))
		|| chunks.find(chunk => isEntryChunk(chunk) && chunk.name.endsWith('.d'))
		|| null
}

function isEntryChunk(
	chunk: RolldownChunk,
): chunk is (RolldownChunk & { type: 'chunk' }) {
	return chunk.type === 'chunk' && chunk.isEntry
}
