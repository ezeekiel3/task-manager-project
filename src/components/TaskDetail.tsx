type TaskDetailType = {
    status: string
    priority: string
    dueDate: string
}

function TaskDetail({ status, priority, dueDate }: TaskDetailType) {
    return (
        <div className='flex flex-col'>
            <div className='flex flex-row gap-1'>
                <h4 className='font-bold text-gray-700/85'>Status:</h4>
                <p
                    className={`font-bold ${status === 'Pending' ? 'text-orange-400' : status === 'in progress' ? 'text-yellow-400' : 'text-green-500'}`}>
                    {status}
                </p>
            </div>
            <div className='flex flex-row gap-1'>
                <h4 className='font-bold text-gray-700/85'>Priority:</h4>
                <p
                    className={`font-bold ${priority === 'medium' ? 'text-yellow-400' : priority === 'high' ? 'text-red-500' : 'text-black'}`}>
                    {priority}
                </p>
            </div>
            <div className={`flex-row gap-1 ${dueDate === null ? 'hidden' : 'flex'}`}>
                <h4 className='font-bold text-gray-700/85'>Due Date:</h4>
                <p className='font-bold'>{dueDate}</p>
            </div>
        </div>
    )
}

export default TaskDetail
