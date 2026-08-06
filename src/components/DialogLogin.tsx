import { useState } from 'react'

type DialogLoginProps = {
    openDialogLogin: boolean
}

function Login({ openDialogLogin }: DialogLoginProps) {
    const [user, setUser] = useState<string>('')
    const [password, setPassword] = useState<string>('')

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
        }
    }

    return (
        <div
            className={`bg-black/70 h-screen w-screen flex justify-center items-center absolute ${openDialogLogin ? 'flex' : 'hidden'}`}>
            <div className='bg-gray-50 rounded-md h-1/2 w-1/2 flex justify-center items-center flex-col'>
                <h1 className='text-2xl mb-4'>Log In or Sign In</h1>
                <div className='flex gap-10 flex-col'>
                    <input
                        type='text'
                        placeholder='Username...'
                        className='outline-none bg-gray-500 text-gray-100 px-3 rounded-md text-xl py-5'
                    />
                    <input
                        type='password'
                        placeholder='Password...'
                        className='outline-none bg-gray-500 text-gray-100 px-3 rounded-md text-xl py-5'
                    />
                    <button className='cursor-pointer'>Log In/Sign In</button>
                </div>
            </div>
        </div>
    )
}

export default Login
