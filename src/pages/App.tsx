import { useEffect, useState } from 'react'
import DialogCreateTask from '../components/DialogCreateTask'
import TaskItem from '../components/TaskItem'
import DialogEditTask from '../components/DialogEditTask'

export type Task = {
    id: number
    title: string
    description: string
    status: string
    priority: string
    dueDate: string | null
}

// ARREGLAR EL FORMATO DE DUEDATE

function App() {
    const [tasks, setTasks] = useState<Task[]>([])
    const [openDialogCreateTask, setOpenDialogCreateTask] = useState<boolean>(false)
    const [openDialogEditTask, setOpenDialogEditTask] = useState<boolean>(false)
    const [titleTask, setTitleTask] = useState<string>('')
    const [descriptionTask, setDescriptionTask] = useState<string>('')
    const [statusTask, setStatusTask] = useState<string>('Pending')
    const [priorityTask, setPriorityTask] = useState<string>('medium')
    const [dueDate, setDueDate] = useState<string>('')

    useEffect(() => {
        async function getTasks() {
            const response = await fetch('http://localhost:3000/tasks')
            const data = await response.json()

            setTasks(data)
        }

        getTasks()
    }, [tasks])

    return (
        <div className='bg-gray-50 h-screen w-screen flex items-center justify-center'>
            <div className='bg-white shadow-sm rounded-xl p-6 flex h-1/2 items-center flex-col gap-10 w-1/3'>
                <div className='flex flex-row w-full justify-between items-center'>
                    <div className='flex flex-col mr-10'>
                        <h1 className='text-3xl font-bold'>My Tasks</h1>
                        <p className='mt-1'>Manage your daily tasks efficiently.</p>
                    </div>
                    <button
                        className='bg-black rounded-lg px-4 h-2/3 text-white cursor-pointer'
                        onClick={() => setOpenDialogCreateTask(true)}>
                        New Task
                    </button>
                </div>
                {tasks.length === 0 ? (
                    <p>There are no tasks. Create a new one to get started!</p>
                ) : (
                    <div className='gap-5 flex flex-col w-full h-full'>
                        {tasks.map((task) => (
                            <TaskItem
                                key={task.id}
                                id={task.id}
                                title={task.title}
                                description={task.description}
                                setOpenDialogEditTask={setOpenDialogEditTask}
                                setTasks={setTasks}
                                tasks={tasks}
                            />
                        ))}
                    </div>
                )}
            </div>
            <DialogCreateTask
                openDialogCreateTask={openDialogCreateTask}
                setOpenDialogCreateTask={setOpenDialogCreateTask}
                titleTask={titleTask}
                setTitleTask={setTitleTask}
                descriptionTask={descriptionTask}
                setDescriptionTask={setDescriptionTask}
                statusTask={statusTask}
                setStatusTask={setStatusTask}
                priorityTask={priorityTask}
                setPriorityTask={setPriorityTask}
                dueDate={dueDate}
                setDueDate={setDueDate}
            />
            {tasks.map((task) => (
                <DialogEditTask
                    idTask={task.id}
                    titleTask={titleTask}
                    setTitleTask={setTitleTask}
                    descriptionTask={descriptionTask}
                    setDescriptionTask={setDescriptionTask}
                    openDialogEditTask={openDialogEditTask}
                    setOpenDialogEditTask={setOpenDialogEditTask}
                    statusTask={statusTask}
                    setStatusTask={setStatusTask}
                    setPriorityTask={setPriorityTask}
                    priorityTask={priorityTask}
                    dueDate={dueDate}
                    setDueDate={setDueDate}
                />
            ))}
        </div>
    )
}

export default App
