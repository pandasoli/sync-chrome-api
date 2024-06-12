<div align=center>

# non-Async Native Messaging

This is an example of how you can simplify your interactions with the native host.
</div>
<br>

<div align=right>

### How it works
</div>

In the `background.js` we have a `connect()` function.
It creates the port, and two listeners, for messages and errors,
and then it sends a message to test the connection.

The function returns a promise (i.e. an async function that throws errors)
that sets a timer of 100 miliseconds, check if the connection try was done,
if not, sets the timer again.

> This was made because the messages and errors are not received instantly.  
> This is a way of sleep to return the function whenever we want.

<br>

In `chrome.runtime.onMessage` we wait for messages (a string) from the popup.
If it receives `'connect'` it calls the `connect()` function and returns `true`
\- used when we want to return asynchronous - because now we want to wait
the `connect()` function to respond, then we return the error.
