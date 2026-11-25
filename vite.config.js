
import { defineConfig, loadEnv } from 'vite'
import { handleChat } from './src/server/chat.js'

function chatApiPlugin(env) {
  return {
    name: 'uniquery-chat-api',
    configureServer(server) {
      server.middlewares.use('/api/chat', async (req, res) => {
        if (req.method !== 'POST' && req.method !== 'GET') {
          res.statusCode = 405
          res.setHeader('content-type', 'application/json; charset=utf-8')
          res.end(JSON.stringify({ error: 'Method not allowed' }))
          return
        }

        try {
          const chunks = []

          if (req.method === 'POST') {
            for await (const chunk of req) chunks.push(chunk)
          }

          const request = new Request('http://127.0.0.1/api/chat', {
            method: req.method,
            headers: {
              'content-type':
                req.headers['content-type'] || 'application/json',
            },
            body:
              req.method === 'POST'
                ? Buffer.concat(chunks)
                : undefined,
          })

          const response = await handleChat(request, env)

          res.statusCode = response.status
          response.headers.forEach((value, key) => {
            res.setHeader(key, value)
          })

          res.end(await response.text())
        } catch (error) {
          console.error('[chat api]', error)
          res.statusCode = 500
          res.setHeader('content-type', 'application/json; charset=utf-8')
          res.end(JSON.stringify({ error: 'Server error' }))
        }
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    server: {
      host: '0.0.0.0',
      port: 5173,
      allowedHosts: ['uniquery-ai.onrender.com'],
    },

    build: {
      rollupOptions: {
        input: {
          main: 'index.html',
          chat: 'chat.html',
        },
      },
    },

    plugins: [chatApiPlugin(env)],
  }
})
