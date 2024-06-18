/** @type {(chrome.runtime.Port|null)} */
let port = null

const connect = () => new Promise(resolve => {
	const port = chrome.runtime.connectNative('com.elisoli.chrome.echo')

	const onMsg = msg => {
		if (msg !== 'test') return

		port.onMessage.removeListener(onMsg)
		port.onDisconnect.removeListener(onDisco)
		resolve([ port, 'Connected' ])
	}

	const onDisco = () => {
		port.onMessage.removeListener(onMsg)
		port.onDisconnect.removeListener(onDisco)
		resolve([ null, chrome.runtime.lastError.message ])
	}

	port.onMessage.addListener(onMsg)
	port.onDisconnect.addListener(onDisco)
	port.postMessage('test')
})

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
