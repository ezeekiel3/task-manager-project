import { type Dispatch, type SetStateAction } from 'react'
import { type Task } from '../App'
import TaskDetail from './TaskDetail'

type TaskItemProps = {
    task: Task
    setOpenDialogEditTask: Dispatch<SetStateAction<boolean>>
    tasks: Task[]
    setTasks: Dispatch<SetStateAction<Task[]>>
    authenticated: boolean
    darkMode: boolean
}

function TaskItem({ setOpenDialogEditTask, tasks, setTasks, task, authenticated, darkMode }: TaskItemProps) {
    async function deleteTask(id: number) {
        if (authenticated) {
            await fetch('http://localhost:3000/tasks', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id }),
            })
            setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id))
        } else {
            setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id))
            localStorage.setItem('tasks', JSON.stringify(tasks))
        }
    }

    return (
        <div
            className={`border ${darkMode ? 'bg-gray-950' : ''} rounded-lg hover:shadow-md w-full duration-200 gap-0.5 px-3.5 py-2.5 flex justify-center flex-col border-gray-400/60`}>
            <div className='flex justify-between'>
                <div className='flex flex-col'>
                    <h3 className={`text-xl ${darkMode ? 'text-white' : 'text-black'}`}>{task.title}</h3>
                    <p className={`${darkMode ? 'text-white' : 'text-black'}`}>{task.description}</p>
                </div>
                <div className='flex flex-col mr-10'>
                    <TaskDetail status={task.status} priority={task.priority} dueDate={task.dueDate!} />
                </div>
            </div>
            <div className='flex gap-3 items-center mt-3'>
                <button
                    className='border-2 bg-red-600 rounded-md text-center text-white px-3 border-black cursor-pointer hover:bg-red-700 duration-200'
                    onClick={() => deleteTask(task.id)}>
                    Delete
                </button>
                <button
                    className={`${darkMode ? 'text-white hover:bg-gray-700' : 'text-black hover:bg-gray-100'} border-2 cursor-pointer px-3 text-center rounded-md duration-200`}
                    onClick={() => setOpenDialogEditTask(true)}>
                    Edit
                </button>
            </div>
        </div>
    )
}

export default TaskItem
