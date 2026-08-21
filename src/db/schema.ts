import { pgTable, pgEnum, integer, varchar, text, timestamp, serial, date } from 'drizzle-orm/pg-core'

export const statusEnum = pgEnum('status', ['pending', 'in_progress', 'completed'])

export const priorityEnum = pgEnum('priority', ['low', 'medium', 'high'])

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
    status: statusEnum('status').default('pending').notNull(),
    priority: priorityEnum('priority').default('medium').notNull(),
    dueDate: date('due_date'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
    userId: integer('user_id')
        .notNull()
        .references(() => usersTable.id),
})
