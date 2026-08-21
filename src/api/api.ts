import express from 'express'
import { eq } from 'drizzle-orm'
import { db } from '../index'
import { tasksTable, usersTable } from '../db/schema'
import cors from 'cors'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import cookieParser from 'cookie-parser'
import { z } from 'zod'

const app = express()
const port = 3000

app.use(cookieParser())
app.use(
    cors({
        origin: 'http://localhost:5173',
        credentials: true,
    }),
)
app.use(express.json())

export const registerSchema = z.object({
    username: z
        .string()
        .min(3, 'Username must be at least 3 characters long')
        .max(12, 'Username must be at most 12 characters long'),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
})

export const loginSchema = z.object({
    username: z.string().min(3).max(12),
    password: z.string().min(3).max(12),
})

export const createTaskSchema = z.object({
    title: z.string().min(1),
    description: z.string().optional(),
    status: z.enum(['pending', 'in_progress', 'completed']),
    priority: z.enum(['low', 'medium', 'high']),
    dueDate: z.string().nullable(),
})

app.get('/tasks', async (req, res) => {
    const tasks = await db.select().from(tasksTable)
    res.json(tasks)
})

app.get('/me', async (req, res) => {
    const token = req.cookies.access_token

    if (!token) {
        return res.status(401).json({ authenticated: false })
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET!) as { id: number; username: string }

        return res.status(200).json({
            authenticated: true,
            user: {
                id: payload.id,
                username: payload.username,
            },
        })
    } catch {
        return res.status(401).json({ authenticated: false })
    }
})

app.post('/tasks', async (req, res) => {
    const token = req.cookies.access_token
    const data = createTaskSchema.parse(req.body)

    if (!token) {
        return res.status(401).json({ authenticanted: false })
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET!) as { id: number; username: string }

        const [taskAdded] = await db
            .insert(tasksTable)
            .values({
                title: data.title,
                description: data.description,
                status: data.status,
                priority: data.priority,
                dueDate: data.dueDate || null,
                userId: payload.id,
            })
            .returning()
        return res.status(201).json(taskAdded)
    } catch (error) {
        console.log('ERROR AL AGREGAR TAREA', error)
        return res.status(400).json({ error: 'internal server error' })
    }
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
        const data = registerSchema.parse(req.body)

        const users = (await db.select({ username: usersTable.username }).from(usersTable)).map((user) => user.username)
        if (users.includes(data.username)) {
            return res.status(400).json({ error: 'username already exists' })
        }

        const hashedPassword = await bcrypt.hash(data.password, 10)

        await db.insert(usersTable).values({ username: data.username, password: hashedPassword })

        res.status(201).json({ username: data.username })
    } catch (error: any) {
        res.status(500).json({ error: 'Internal Server Error' })
    }
})

app.post('/login', async (req, res) => {
    try {
        const data = loginSchema.parse(req.body)

        const [user] = await db.select().from(usersTable).where(eq(usersTable.username, data.username))

        if (!user) {
            return res.status(401).json({ error: 'Invalid username or password' })
        } else {
            const isValid = await bcrypt.compare(data.password, user.password)
            if (!isValid) {
                return res.status(401).json({ error: 'password is invalid' })
            }

            const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET!, {
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

app.post('/logout', (req, res) => {
    res.clearCookie('access_token').json({ message: 'Logout successful' })
})

app.listen(port, () => {
    console.log('running on', port)
})

export type CreateTask = z.infer<typeof createTaskSchema>
