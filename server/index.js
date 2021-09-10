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
const setMembers = promisify(redisClient.smembers).bind(redisClient)
const setAdd = promisify(redisClient.sadd).bind(redisClient)

const getHistory = async () => {
    const members = await setMembers('messages')
    return members.map((message) => JSON.parse(message))
}

const backfill = async (socket) => {
    const history = await getHistory()
    socket.emit('messages', history)
}

io.on('connection', async (socket) => {
    socket.on('message', async ({ content, user }) => {
        const message = { content, user, timestamp: Date.now() }
        io.emit('messages', [message])
        await setAdd('messages', JSON.stringify(message))
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
