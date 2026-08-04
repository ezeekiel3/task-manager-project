import express from 'express'
import { eq } from 'drizzle-orm'
import { db } from '../index'
import { tasksTable, usersTable } from '../db/schema'
import cors from 'cors'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import cookieParser from 'cookie-parser'

const app = express()
const port = 3000

app.use(cookieParser())
app.use(cors())
app.use(express.json())

app.get('/tasks', async (req, res) => {
    const tasks = await db.select().from(tasksTable)
    res.json(tasks)
})

app.post('/tasks', async (req, res) => {
    const taskAdded = await db
        .insert(tasksTable)
        .values({
            title: req.body.title,
            description: req.body.description,
            status: req.body.status,
            userId: req.body.userId,
        })
        .returning()
    res.status(201).json(taskAdded)
})

app.delete('/tasks', async (req, res) => {
    const deletedTask = await db.delete(tasksTable).where(eq(tasksTable.id, req.body.id)).returning()
    res.status(200).json(deletedTask)
})

app.patch('/tasks', async (req, res) => {
    const updatedTask = await db.update(tasksTable).set(req.body).where(eq(tasksTable.id, req.body.id)).returning()
    res.json(updatedTask)
})

app.post('/register', async (req, res) => {
    try {
        // USERNAME AND PASSWORD VALIDATION
        if (!req.body.username || req.body.username.length < 3) {
            return res.status(400).json({ error: 'username must be at least 3 characters long' })
        }
        if (!req.body.password || req.body.password.length < 6) {
            return res.status(400).json({ error: 'password must be at least 6 characters long' })
        }

        const users = (await db.select({ username: usersTable.username }).from(usersTable)).map((user) => user.username)
        if (users.includes(req.body!.username)) {
            return res.status(400).json({ error: 'username already exists' })
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10)

        await db.insert(usersTable).values({ username: req.body.username, password: hashedPassword })

        res.status(201).json({ username: req.body.username })
    } catch (error: any) {
        res.status(500).json({ error: 'Internal Server Error' })
    }
})

app.post('/login', async (req, res) => {
    try {
        // USERNAME AND PASSWORD VALIDATION
        if (!req.body.username || req.body.username.length < 3) {
            return res.status(400).json({ error: 'username must be at least 3 characters long' })
        }
        if (!req.body.password || req.body.password.length < 6) {
            return res.status(400).json({ error: 'password must be at least 6 characters long' })
        }

        const [user] = await db.select().from(usersTable).where(eq(usersTable.username, req.body.username))

        if (!user) {
            return res.status(400).json({ error: 'Invalid username or password' })
        } else {
            const isValid = await bcrypt.compare(req.body.password, user.password)
            if (!isValid) {
                return res.status(401).json({ error: 'password is invalid' })
            }

            const token = jwt.sign({ id: user.id, username: user.username }, process.env.SECRET_JWT!, {
                expiresIn: '1h',
            })
            res.status(201)
                .cookie('access_token', token, { httpOnly: true, sameSite: 'strict', maxAge: 1000 * 60 * 60 })
                .json({ id: user.id, username: user.username, token: token })
        }
    } catch (error: any) {
        res.status(500).json({ error: 'Internal Server Error' })
    }
})

app.post('/logout', () => {})

app.listen(port, () => {
    console.log('running on', port)
})
