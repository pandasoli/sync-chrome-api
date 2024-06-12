/** @type {(chrome.runtime.Port|null)} */
let port = null

function connect() {
	const port = chrome.runtime.connectNative('com.elisoli.chrome.echo')

	let connected = false
	let err = null

	const onMsg = msg => msg === 'test' && (connected = true)
	const onDisco = () => err = chrome.runtime.lastError.message

	port.onMessage.addListener(onMsg)
	port.onDisconnect.addListener(onDisco)

	port.postMessage('test')

	return new Promise((resolve, reject) => {
		const time = 100

		const foo = () => {
			if (!connected && err === null)
				return setTimeout(foo, time)

			port.onMessage.removeListener(onMsg)
			port.onDisconnect.removeListener(onDisco)

			if (connected) resolve([port, 'Connected'])
			else reject([null, err])
		}

		setTimeout(foo, time)
	})
}

chrome.runtime.onMessage.addListener((msg, _, send) => {
	switch (msg) {
		case 'connect':
			if (port)
				return send("There's alredy an open connection")

			connect()
			.then(([port_, err]) => {
				port = port_
				send(err)
			})
			.catch(([_, err]) => {
				send(err)
			})

			return true

		case 'disconnect':
			if (port === null)
				return send("There's no open connection")

			port.disconnect()
			port = null
			break

		default:
			if (port === null)
				return send("There's no open connection")

			const foo = msg => {
				port.onMessage.removeListener(foo)
				send(msg)
			}
			port.onMessage.addListener(foo)

			try {
				port.postMessage(msg)
				return true
			}
			catch (e) {
				port.onMessage.removeListener(foo)
				send(e.toString())
			}
	}
})
