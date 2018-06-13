const Module = require ( 'module' ).Module
const _path = require ( 'path' )
const fs = require ( 'fs' )

module.exports = function require (
	path,
	parent
) {
	if ( !parent ) {
		throw new TypeError ( 'await-top is installed, please pass "module" to require()' )
	}

	const filename = _path.extname (
		Module._resolveFilename (
			path,
			parent,
			false
		)
	)

	if ( filename !== '.js' ) {
		throw new TypeError ( '"filename" must have the extension ".js"' )
	}

	const oldWrap = Module.wrap

	Module.wrap = ( script ) => {
		Module.wrap = oldWrap

		return Module.wrap ( script ).replace (
			/^\(function/,
			'(async function'
		)
	}

	const oldJsExt = Module._extensions[ '.js' ]
	let compiled,
	    childModule

	Module._extensions[ '.js' ] = (
		module,
		filename
	) => {
		Module._extensions[ '.js' ] = oldJsExt

		let content = fs.readFileSync (
			filename,
			'utf8'
		)

		if ( content.charCodeAt ( 0 ) === 0xFEFF ) {
			content = content.slice ( 1 )
		}

		childModule = module
		compiled = module._compile (
			content,
			filename
		)
	}

	Module._load (
		path,
		module,
		false
	)

	return ( async () => {
		await compiled

		return childModule.exports
	} ) ()
}