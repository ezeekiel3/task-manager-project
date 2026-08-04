import { pgTable, integer, varchar, text, timestamp, serial } from 'drizzle-orm/pg-core'

export const usersTable = pgTable('users', {
    id: serial('id').primaryKey(),
    username: varchar({ length: 12 }).notNull().unique(),
    password: text('password').notNull(),
    createdAt: timestamp().notNull().defaultNow(),
})

export const tasksTable = pgTable('tasks', {
    id: serial('id').primaryKey(),
    title: varchar({ length: 100 }).notNull(),
    description: text('description'),
    status: varchar({ length: 20 }).default('pending'),
    priority: varchar({ length: 10 }).default('medium'),
    dueDate: timestamp('due_date'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
    userId: integer('user_id')
        .notNull()
        .references(() => usersTable.id),
})
