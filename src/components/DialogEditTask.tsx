import { type Dispatch, type SetStateAction } from 'react'
import type { Task } from '../App'

type DialogEditTaskType = {
    idTask: number
    openDialogEditTask: boolean
    setOpenDialogEditTask: Dispatch<SetStateAction<boolean>>
    titleTask: string
    statusTask: string
    setTitleTask: Dispatch<SetStateAction<string>>
    descriptionTask: string
    setDescriptionTask: Dispatch<SetStateAction<string>>
    setStatusTask: Dispatch<SetStateAction<string>>
    priorityTask: string
    setPriorityTask: Dispatch<SetStateAction<string>>
    dueDate: string
    setDueDate: Dispatch<SetStateAction<string>>
    authenticated: boolean
    tasks: Task[]
    setTasks: Dispatch<SetStateAction<Task[]>>
}

function DialogEditTask({
    idTask,
    openDialogEditTask,
    setOpenDialogEditTask,
    titleTask,
    statusTask,
    setTitleTask,
    setStatusTask,
    descriptionTask,
    setDescriptionTask,
    priorityTask,
    setPriorityTask,
    dueDate,
    setDueDate,
    authenticated,
    tasks,
    setTasks,
}: DialogEditTaskType) {
    async function editTask(editingTask: Task) {
        if (authenticated) {
            await fetch('http://localhost:3000/tasks', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editingTask),
            })
        } else {
            const updatedTasks = tasks.map((task) => {
                if (task.id === editingTask.id) {
                    return editingTask
                }

                return task
            })

            setTasks(updatedTasks)
            localStorage.setItem('tasks', JSON.stringify(updatedTasks))
        }
    }

    return (
        <div
            className={`${openDialogEditTask ? 'flex' : 'hidden'} absolute bg-black/70 h-full w-full justify-center items-center`}>
            <div className='bg-gray-100 shadow-md rounded-lg w-1/3 flex-col p-6'>
                <div className='h-full w-full'>
                    <h2 className='text-2xl'>Edit Task</h2>
                    <p className='mt-1'>Modify your task details.</p>
                </div>
                <div className='flex mt-5 gap-5 flex-col'>
                    <div>
                        <p className='text-2xl mb-2'>Title</p>
                        <input
                            type='text'
                            className='bg-gray-200 text-xl outline-none p-3 border-lg w-2/3 rounded-lg focus:border-gray-400 border-3 border-gray-400/0 duration-200'
                            placeholder='Title...'
                            onChange={(e) => setTitleTask(e.target.value)}
                        />
                    </div>
                    <div>
                        <p className='text-2xl mb-2'>Description</p>
                        <textarea
                            name=''
                            id=''
                            placeholder='Description...'
                            className='bg-gray-200 resize-none text-xl border-lg rounded-lg w-2/3 outline-none p-2 focus:border-gray-400 border-3 border-gray-400/0'
                            onChange={(e) => setDescriptionTask(e.target.value)}></textarea>
                    </div>
                    <div className='flex-col flex gap-3 w-1/4'>
                        <label htmlFor='Status' className='text-xl w-full'>
                            Status
                        </label>
                        <select
                            onChange={(e) => setStatusTask(e.target.value)}
                            name=''
                            id='Status'
                            className='w-full py-3 rounded-md text-lg hover:bg-gray-200 duration-200 px-3 focus:bg-gray-200'>
                            <option value='pending'>Pending</option>
                            <option value='in_progress'>In Progress</option>
                            <option value='completed'>Completed</option>
                        </select>
                    </div>
                    <div className='flex-col flex gap-3 w-1/4'>
                        <label htmlFor='Priority' className='text-xl w-full'>
                            Priority
                        </label>
                        <select
                            onChange={(e) => setPriorityTask(e.target.value)}
                            name=''
                            id='Priority'
                            className='w-full py-3 rounded-md text-lg hover:bg-gray-200 duration-200 px-3 focus:bg-gray-200'>
                            <option value='low'>Low</option>
                            <option value='medium'>Medium</option>
                            <option value='high'>High</option>
                        </select>
                    </div>
                    <div className='flex-col flex gap-3 w-1/4'>
                        <label htmlFor='due_date' className='text-xl w-full'>
                            Due Date
                        </label>
                        <input type='date' onChange={(e) => setDueDate(e.target.value)} />
                    </div>
                </div>
                <div className='flex flex-row-reverse gap-4 mt-10'>
                    <button
                        className='bg-black text-white text-xl px-3 py-1 rounded-md cursor-pointer hover:bg-black/80 duration-200'
                        onClick={() => {
                            editTask({
                                id: idTask,
                                title: titleTask,
                                description: descriptionTask,
                                status: statusTask,
                                priority: priorityTask,
                                dueDate: dueDate,
                            })
                            setOpenDialogEditTask(false)
                        }}>
                        Save
                    </button>
                    <button
                        className='bg-white border-2 text-xl px-3 py-1 border-black/80 rounded-md cursor-pointer hover:bg-gray-100 duration-200'
                        onClick={() => setOpenDialogEditTask(false)}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    )
}

export default DialogEditTask
