let fs = require ( 'fs' )

console.log ( await Promise.resolve ( 'Hello, World! (await from inside module)' ) )

module.exports = 'Hello, World! (exports)'

console.log (
	'Contents of test.js:\n%s',
	await new Promise (
		(
			accept,
			reject
		) => {
			fs.readFile (
				__dirname + '/test.js',
				'utf8',
				(
					err,
					data
				) => {
					if ( err ) {
						reject ( err )
					} else {
						accept ( data )
					}
				}
			)
		}
	)
)