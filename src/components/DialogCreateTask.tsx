import { type Dispatch, type SetStateAction } from 'react'
import type { Task } from '../App'

type DialogCreateTaskProps = {
    openDialogCreateTask: boolean
    setOpenDialogCreateTask: Dispatch<SetStateAction<boolean>>
    titleTask: string
    descriptionTask: string
    setTitleTask: Dispatch<SetStateAction<string>>
    setDescriptionTask: Dispatch<SetStateAction<string>>
    statusTask: string
    setStatusTask: Dispatch<SetStateAction<string>>
    priorityTask: string
    setPriorityTask: Dispatch<SetStateAction<string>>
    dueDate: string
    setDueDate: Dispatch<SetStateAction<string>>
    authenticated: boolean
    setTasks: Dispatch<SetStateAction<Task[]>>
    tasks: Task[]
    darkMode: boolean
}

function DialogCreateTask({
    openDialogCreateTask,
    setOpenDialogCreateTask,
    titleTask,
    descriptionTask,
    setTitleTask,
    setDescriptionTask,
    statusTask,
    setStatusTask,
    priorityTask,
    setPriorityTask,
    dueDate,
    setDueDate,
    authenticated,
    setTasks,
    tasks,
    darkMode,
}: DialogCreateTaskProps) {
    async function handleSubmitTask(
        task: string,
        description: string,
        statusTask: string,
        priorityTask: string,
        dueDateTask: string,
    ) {
        let id: number
        if (authenticated) {
            const response = await fetch('http://localhost:3000/tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    title: task,
                    description: description,
                    status: statusTask,
                    priority: priorityTask,
                    dueDate: dueDateTask,
                }),
            })
            id = (await response.json()).id as number
        } else {
            const localTasks = JSON.parse(localStorage.getItem('tasks') ?? 'null') as Task[] | null
            const nextId = (localTasks?.at(-1)?.id ?? -1) + 1
            localStorage.setItem(
                'tasks',
                JSON.stringify([
                    ...tasks,
                    {
                        id: nextId,
                        title: task,
                        description: description,
                        priority: priorityTask,
                        status: statusTask,
                        dueDate: dueDateTask,
                    },
                ]),
            )
            id = nextId
        }
        setTasks([
            ...tasks,
            {
                id,
                title: task,
                description: description,
                priority: priorityTask,
                status: statusTask,
                dueDate: dueDateTask,
            },
        ])
    }

    return (
        <div
            className={`${openDialogCreateTask ? 'flex' : 'hidden'} absolute bg-black/70 h-full w-full justify-center items-center`}>
            <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-100'} shadow-md rounded-lg w-1/3 flex-col p-6`}>
                <div className='h-full w-full'>
                    <h2 className={`text-2xl ${darkMode ? 'text-white' : 'text-black'}`}>Create Task</h2>
                    <p className={`mt-1 ${darkMode ? 'text-white' : 'text-black'}`}>Add a new task to your list.</p>
                </div>
                <div className='flex mt-5 gap-5 flex-col'>
                    <div>
                        <p className={`text-xl mb-2 ${darkMode ? 'text-white' : 'text-black'}`}>Title</p>
                        <input
                            type='text'
                            className='bg-gray-200 text-lg outline-none p-2 border-lg w-2/3 rounded-lg focus:border-gray-400 border-3 border-gray-400/0 duration-200'
                            placeholder='Title...'
                            onChange={(e) => setTitleTask(e.target.value)}
                        />
                    </div>
                    <div>
                        <p className={`text-xl mb-2 ${darkMode ? 'text-white' : 'text-black'}`}>Description</p>
                        <textarea
                            placeholder='Description...'
                            className='bg-gray-200 resize-none text-lg border-lg rounded-lg w-2/3 outline-none p-2 focus:border-gray-400 border-3 border-gray-400/0'
                            onChange={(e) => setDescriptionTask(e.target.value)}></textarea>
                    </div>
                    <div className='flex-col flex gap-3 w-1/4'>
                        <label htmlFor='Status' className={`text-xl w-full ${darkMode ? 'text-white' : 'text-black'}`}>
                            Status
                        </label>
                        <select
                            onChange={(e) => setStatusTask(e.target.value)}
                            id='Status'
                            className={`w-full py-3 rounded-md text-lg hover:bg-gray-500 duration-200 px-3 focus:bg-gray-500 ${darkMode ? 'text-white' : 'text-black'}`}>
                            <option value='pending'>Pending</option>
                            <option value='in_progress'>In Progress</option>
                            <option value='completed'>Completed</option>
                        </select>
                    </div>
                    <div className='flex-col flex gap-3 w-1/4'>
                        <label
                            htmlFor='Priority'
                            className={`text-xl w-full ${darkMode ? 'text-white' : 'text-black'}`}>
                            Priority
                        </label>
                        <select
                            onChange={(e) => setPriorityTask(e.target.value)}
                            id='Priority'
                            className={`w-full py-3 rounded-md text-lg hover:bg-gray-500 duration-200 px-3 focus:bg-gray-500 ${darkMode ? 'text-white' : 'text-black'}`}>
                            <option value='low'>Low</option>
                            <option value='medium'>Medium</option>
                            <option value='high'>High</option>
                        </select>
                    </div>
                    <div className='flex-col flex gap-3 w-1/4'>
                        <label
                            htmlFor='due_date'
                            className={`text-xl w-full ${darkMode ? 'text-white' : 'text-black'}`}>
                            Due Date
                        </label>
                        <input
                            type='date'
                            onChange={(e) => setDueDate(e.target.value)}
                            className={`${darkMode ? 'text-white' : 'text-black'}`}
                        />
                    </div>
                </div>
                <div className='flex flex-row-reverse gap-4 mt-10'>
                    <button
                        className='bg-black text-white text-xl px-3 py-1 rounded-md cursor-pointer hover:bg-black/80 duration-200'
                        onClick={() => {
                            handleSubmitTask(titleTask, descriptionTask, statusTask, priorityTask, dueDate)
                            setOpenDialogCreateTask(false)
                        }}>
                        Save
                    </button>
                    <button
                        className='bg-white border-2 text-xl px-3 py-1 border-black/80 rounded-md cursor-pointer hover:bg-gray-100 duration-200'
                        onClick={() => setOpenDialogCreateTask(false)}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    )
}

export default DialogCreateTask
