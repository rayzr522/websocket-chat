import { Server } from 'socket.io'
import express from 'express'
import { createServer } from 'http'
import sirv from 'sirv'
import { RedisClient } from 'redis'
import { promisify } from 'util'

const app = express()
const server = createServer(app)
const io = new Server(server)

const redisClient = new RedisClient()
const get = promisify(redisClient.get).bind(redisClient)
const set = promisify(redisClient.set).bind(redisClient)

const getHistory = async () => {
    const currentMessages = (await get('messages')) || '[]'
    return JSON.parse(currentMessages)
}

const backfill = async (socket) => {
    const history = await getHistory()
    socket.emit('messages', history)
}

io.on('connection', async (socket) => {
    socket.on('message', async ({ content, user }) => {
        const message = { content, user, timestamp: Date.now() }
        io.emit('messages', [message])

        const history = await getHistory()
        await set('messages', JSON.stringify(history.concat(message)))
    })

    await backfill(socket)
})

app.use(
    sirv('public', {
        brotli: true,
        dev: process.env.NODE_ENV === 'development',
    })
)

const port = parseInt(process.env.NODE_PORT || '3001', 10)

server.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`)
})
