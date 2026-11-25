import { handleChat } from '../src/server/chat.js'

// Freebuff Sites supplies the ASSETS binding for the built website.
export default {
  async fetch(request, env) {
    const url = new URL(request.url)

    if (url.pathname === '/api/chat') {
      return handleChat(request, env)
    }

    return env.ASSETS.fetch(request)
  },
}
