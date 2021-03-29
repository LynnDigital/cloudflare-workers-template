import Toucan from "toucan-js"
import { Router } from "tiny-request-router"

const createResponse = (body, json = true, code = 200) => {
	return new Response(json ? JSON.stringify(body) : body, {
		status: code,
		headers: {
			'content-type': 'application/json',
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Methods": "GET,POST,PUT,PATCH,POST,DELETE,OPTIONS",
			"Access-Control-Max-Age": "86400",
			// "Access-Control-Allow-Headers": "",
		}
	})
}

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
			return createResponse({message: 'Hello World'})
		})

		/**
		 * Empty options required for pre-flight requests
		 * CORS fails if this is not here
		 */
		router.options('*', async (params, request) => {
			return createResponse('', false)
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
