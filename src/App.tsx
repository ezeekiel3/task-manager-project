import { useEffect, useState } from 'react'
import DialogCreateTask from './components/DialogCreateTask'
import TaskItem from './components/TaskItem'
import DialogEditTask from './components/DialogEditTask'
import DialogLogin from './components/DialogLogin'
import DarkMode from './components/DarkMode'

export type Task = {
    id: number
    title: string
    description: string
    status: string
    priority: string
    dueDate: string
}

export type User = {
    id: number
    username: string
}

function App() {
    const [tasks, setTasks] = useState<Task[]>([])
    const [openDialogCreateTask, setOpenDialogCreateTask] = useState<boolean>(false)
    const [openDialogEditTask, setOpenDialogEditTask] = useState<boolean>(false)
    const [openDialogLogin, setOpenDialogLogin] = useState<boolean>(false)
    const [titleTask, setTitleTask] = useState<string>('')
    const [descriptionTask, setDescriptionTask] = useState<string>('')
    const [statusTask, setStatusTask] = useState<string>('pending')
    const [priorityTask, setPriorityTask] = useState<string>('medium')
    const [dueDate, setDueDate] = useState<string>('')
    const [authenticated, setAuthenticated] = useState<boolean>(false)
    const [user, setUser] = useState<User | null>(null)
    const [darkMode, setDarkMode] = useState<boolean>(false)

    useEffect(() => {
        async function getTasks() {
            const response = await fetch('http://localhost:3000/me', {
                credentials: 'include',
            })

            const data = await response.json()

            setUser(data.user)

            if (data.authenticated) {
                const response = await fetch('http://localhost:3000/tasks', {
                    credentials: 'include',
                })
                const data = await response.json()
                setTasks(data)
            } else {
                setTasks(JSON.parse(localStorage.getItem('tasks') ?? '[]') as Task[])
            }
            setAuthenticated(data.authenticated)
        }

        getTasks()
    }, [])

    async function logout() {
        fetch('http://localhost:3000/logout', {
            method: 'POST',
            credentials: 'include',
        })
        setAuthenticated(false)
    }

    return (
        <div
            className={`${darkMode ? 'bg-gray-900' : 'bg-gray-50'} h-screen w-screen flex flex-col items-center justify-center`}>
            <div className={`${authenticated ? 'flex' : 'hidden'} flex-col gap-6 mb-10`}>
                <h1
                    className={`text-3xl font-bold ${authenticated ? 'flex' : 'hidden'} ${darkMode ? 'text-gray-200' : 'text-black'}`}>
                    Welcome {user?.username}
                </h1>
                <button
                    className='cursor-pointer bg-black text-white px-3 py-2.5 rounded-md hover:bg-gray-700 duration-200'
                    onClick={() => {
                        logout()
                    }}>
                    Logout
                </button>
            </div>
            <div className={`mb-7 justify-center items-center flex-col gap-3 ${authenticated ? 'hidden' : 'flex'}`}>
                <p className={`${darkMode ? 'text-white' : 'text-black'}`}>Log In to Sync your tasks!!</p>
                <button
                    className='cursor-pointer bg-black text-white px-3 py-2.5 rounded-md hover:bg-gray-700 duration-200'
                    onClick={() => {
                        setOpenDialogLogin(true)
                    }}>
                    Log In/Sign In
                </button>
            </div>
            <div
                className={`${darkMode ? 'bg-blue-950' : 'bg-white'} shadow-sm rounded-xl p-6 flex items-center flex-col gap-10 w-1/3`}>
                <div className='flex flex-row w-full justify-between items-center'>
                    <div className='flex flex-col mr-10'>
                        <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-black'}`}>My Tasks</h1>
                        <p className={`mt-1 ${darkMode ? 'text-gray-200' : 'text-black'}`}>
                            Manage your daily tasks efficiently.
                        </p>
                    </div>
                    <button
                        className='bg-black rounded-lg px-4 py-2.5 text-white cursor-pointer'
                        onClick={() => setOpenDialogCreateTask(true)}>
                        New Task
                    </button>
                </div>
                {tasks.length === 0 ? (
                    <p className={`${darkMode ? 'text-gray-200' : 'text-black'}`}>
                        There are no tasks. Create a new one to get started!
                    </p>
                ) : (
                    <div className='gap-5 flex flex-col w-full overflow-auto'>
                        {tasks.map((task) => (
                            <TaskItem
                                key={task.id}
                                setOpenDialogEditTask={setOpenDialogEditTask}
                                setTasks={setTasks}
                                tasks={tasks}
                                task={task}
                                authenticated={authenticated}
                                darkMode={darkMode}
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
                authenticated={authenticated}
                setTasks={setTasks}
                tasks={tasks}
                darkMode={darkMode}
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
                    authenticated={authenticated}
                    tasks={tasks}
                    setTasks={setTasks}
                />
            ))}
            <DialogLogin openDialogLogin={openDialogLogin} setOpenDialogLogin={setOpenDialogLogin} />
            <DarkMode setDarkMode={setDarkMode} darkMode={darkMode} />
        </div>
    )
}

export default App
