import Toucan from "toucan-js"

addEventListener('fetch', event => {
	const sentry = new Toucan({
		dsn: "...",
		event,
		allowedHeaders: ["user-agent"],
		allowedSearchParams: /(.*)/,
	});

	event.respondWith(handleRequest(event, sentry))
})

/**
 * Respond to the request
 * @param {Event} event
 * @param {Toucan} sentry
 */
async function handleRequest(event, sentry) {
	/** @param {Request} request */
	const request = event.request
	
	try {
		return new Response('Hello worker!', {
			headers: { 'content-type': 'text/plain' },
		})
	}
	catch(e) {
		sentry.captureException(e)

		return new Response('Worker threw exception', {
			headers: { 'content-type': 'text/plain' },
			status: 500
		})
	}
}
