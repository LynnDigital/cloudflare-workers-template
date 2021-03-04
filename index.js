import Toucan from "toucan-js"
import { Router } from "tiny-request-router"

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
	const router = new Router()
	
	try {

		router.get('*', async (params, request) => {
			return new Response('Hello worker!', {
				headers: { 'content-type': 'text/plain' },
			})
		})

		const match = router.match(request.method, url.pathname)
		if (match) {
			response = match.handler(match.params, request)
		}
		else {
			response = new Response('Endpoint Not Found', {
				status: 404
			})
		}
	}
	catch(e) {
		sentry.captureException(e)

		return new Response('Worker threw exception', {
			headers: { 'content-type': 'text/plain' },
			status: 500
		})
	}
}
