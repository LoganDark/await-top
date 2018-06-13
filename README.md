# await-top

`await-top` is a library that lets you use top-level await. Don't believe me? Have an example:

```javascript
// test.js

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
```

```javascript
// test-2.js

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
```

Output:

```
Promise: Promise { <pending> }
Hello, World! (await from inside module)
Contents of test.js:
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
Hello, World! (exports)
```

In fact, that exact code is used for `npm test`. Note that the `exports` are printed *after* awaiting the filesystem call, because the Promise does not resolve until after the function has executed.

## Important differences

There is some important differences about `await-top` that make it different from other modules.

- This does not apply globally. You can use regular `require` alongside this module and Node will not complain. `await-top` is very careful to clean up any changes it makes.

  The recommended way to use `await-top`, however, is:

  ```javascript
  require = require('await-top')
  ```
- You must pass `module` to `await-top`'s `require`. This is done to make sure the module resolves to a `.js` file so nothing unexpected happens, such as the `_extensions` function never getting called and the next module imported getting async instead, screwing up the system.
- `await-top`'s `require` returns a `Promise`. You can use `.then()` or `await` it (inside a real async function).
- This module depends heavily on the internal structure of the module-loading system. Specifically, the call signatures of `Module._resolveFilename`, `Module.wrap`, `Module._compile`, and the format of `Module._extensions`. You can read how the `require()` system works at [`loader.js`](https://github.com/nodejs/node/blob/master/lib/internal/modules/cjs/loader.js) and [`helpers.js`](https://github.com/nodejs/node/blob/master/lib/internal/modules/cjs/helpers.js).
