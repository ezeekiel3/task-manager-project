import { useState } from 'react'
import { useNavigate } from 'react-router'

function Login() {
    const [user, setUser] = useState<string>('')
    const [password, setPassword] = useState<string>('')

    const navigate = useNavigate()

    async function login(userText: string, passwordText: string) {
        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: userText,
                password: passwordText,
            }),
        })

        const data = await response.json()

        if (response.ok) {
            navigate('/app')
        }
    }

    return (
        <div className='bg-gray-300 h-screen w-screen flex justify-center items-center'>
            <div className='bg-gray-200 h-1/3 w-1/3 flex flex-col rounded-md shadow-md'>
                <h1>Your Tasks App!</h1>
                <div className='flex gap-10 flex-col'>
                    <input
                        type='text'
                        onChange={(e) => setUser(e.target.value)}
                        className='bg-gray-700 text-white'
                        placeholder='User...'
                    />
                    <input
                        type='password'
                        onChange={(e) => setPassword(e.target.value)}
                        className='bg-gray-700 text-white'
                        placeholder='Password...'
                    />
                    <button onClick={() => login(user, password)} className='cursor-pointer'>
                        Sign In
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Login
