require = require ( './index' )

console.log (
	'Promise: %O',
	require (
		'./test-2',
		module
	).then (
		( x ) => {
			console.log ( x )
		}
	)
)