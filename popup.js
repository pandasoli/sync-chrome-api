const $text_input = document.getElementById('text')
const $err_label = document.getElementById('err')
const $send_btn = document.getElementById('send')
const $connect_btn = document.getElementById('connect')
const $disconnect_btn = document.getElementById('disconnect')

$connect_btn.addEventListener('click', () => {
	$err_label.innerText = 'Connecting...'

	chrome.runtime.sendMessage('connect')
	.then(err => {
		console.log('[$connect_btn.click]', err)
		err && ($err_label.innerText = err)
	})
})

$send_btn.addEventListener('click', () =>
	chrome.runtime.sendMessage($text_input.value)
	.then(err =>
		err && ($err_label.innerText = err)
	)
)

$disconnect_btn.addEventListener('click', () =>
	chrome.runtime.sendMessage('disconnect')
	.then(err =>
		err && ($err_label.innerText = err)
	)
)
