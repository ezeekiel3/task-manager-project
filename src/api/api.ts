import express, { type NextFunction } from 'express'
import { eq } from 'drizzle-orm'
import { db } from '../index'
import { tasksTable, usersTable } from '../db/schema'
import cors from 'cors'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const app = express()
const port = 3000

app.use(cors())
app.use(express.json())

app.get('/tasks', async (req, res) => {
    const tasks = await db.select().from(tasksTable)
    res.json(tasks)
})

app.post('/tasks', async (req, res) => {
    const taskAdded = await db
        .insert(tasksTable)
        .values({ title: req.body.title, description: req.body.description, status: req.body.status })
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

app.post('/register', async (err: Error, req: Request, res: Response, next: NextFunction) => {
    // USERNAME AND PASSWORD VALIDATION
    if (req.body!.username < 3) throw new Error('username must be at least 3 characters long')
    if (req.body!.password < 6) throw new Error('password must be at least 6 characters long')

    const hashedPassword = await bcrypt.hash(req.body.password, 10)

    const users = (await db.select({ username: usersTable.username }).from(usersTable)).map((user) => user.username)
    if (users.includes(req.body!.username)) throw new Error('username already exists')

    const userCreated = await db
        .insert(usersTable)
        .values({ username: req.body!.username, password: hashedPassword })
        .returning()

    res.status(201).json(userCreated)
})

app.post('/login', (req, res) => {})

app.post('/logout', () => {})

app.listen(port, () => {
    console.log('running on', port)
})
