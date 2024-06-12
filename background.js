let port = null

function connect() {
	const port = chrome.runtime.connectNative('com.elisoli.chrome.echoa')

	let connected = false
	let err = null

	port.onMessage.addListener(msg =>
		msg === 'test' && (connected = true)
	)

	port.onDisconnect.addListener(() =>
		err = chrome.runtime.lastError.message
	)

	port.postMessage('test')

	return new Promise((resolve, reject) => {
		const time = 100

		const foo = () => {
			if (!connected && err === null)
				return setTimeout(foo, time)

			if (connected) resolve([port, 'Connected'])
			else reject([null, err])
		}

		setTimeout(foo, time)
	})
}

chrome.runtime.onMessage.addListener(async (msg, _, send) => {
	switch (msg) {
		case 'connect':
			if (port)
				return send("There's alredy an open connection")

			try {
				[port, err] = await connect()
				console.log('after await')
				send(err)
			}
			catch (e) {
				console.log('inside catch')
				send(e[1])
			}
			console.log('end')
			break

		case 'disconnect':
			if (port === null)
				return send("There's no open connection")

			port.disconnect()
			break

		default:
			if (port === null)
				return send("There's no open connection")

			port.postMessage(msg)
	}
})
