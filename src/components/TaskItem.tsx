import { type Dispatch, type SetStateAction } from 'react'
import { type Task } from '../pages/App'
import TaskDetail from './TaskDetail'

type TaskItemType = {
    id: number
    title: string
    description: string
    setOpenDialogEditTask: Dispatch<SetStateAction<boolean>>
    tasks: Task[]
    setTasks: Dispatch<SetStateAction<Task[]>>
}

function TaskItem({ id, title, description, setOpenDialogEditTask, tasks, setTasks }: TaskItemType) {
    async function deleteTask(id: number) {
        if (tasks.length === 0) {
            alert('There are no tasks to delete.')
        } else {
            await fetch('http://localhost:3000/tasks', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id }),
            })
            setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id))
        }
    }

    return (
        <div className='border rounded-lg hover:shadow-md h-1/2 w-full duration-200 gap-0.5 pl-3.5 flex justify-center flex-col border-gray-400/60'>
            <div className='flex justify-between'>
                <div className='flex flex-col'>
                    <h3 className='text-xl'>{title}</h3>
                    <p>{description}</p>
                </div>
                <div className='flex flex-col mr-10'>
                    {tasks.map((task) => (
                        <TaskDetail status={task.status} priority={task.priority} dueDate={task.dueDate!} />
                    ))}
                </div>
            </div>
            <div className='flex gap-3 mt-3 h-1/3'>
                <button
                    className='border-2 bg-red-600 rounded-md text-white px-3 h-3/4 border-black cursor-pointer hover:bg-red-700 duration-200'
                    onClick={() => deleteTask(id)}>
                    Delete
                </button>
                <button
                    className='border-2 cursor-pointer px-3 rounded-md h-3/4 hover:bg-gray-100 duration-200'
                    onClick={() => setOpenDialogEditTask(true)}>
                    Edit
                </button>
            </div>
        </div>
    )
}

export default TaskItem
