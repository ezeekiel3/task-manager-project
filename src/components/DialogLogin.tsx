import { useState, type Dispatch, type SetStateAction } from 'react'

type DialogLoginProps = {
    openDialogLogin: boolean
    setOpenDialogLogin: Dispatch<SetStateAction<boolean>>
}

function login({ openDialogLogin, setOpenDialogLogin }: DialogLoginProps) {
    const [displayError, setDisplayError] = useState<string>('')
    const [dialogRegister, setDialogRegister] = useState<boolean>(false)
    const [user, setUser] = useState<string>('')
    const [password, setPassword] = useState<string>('')

    async function login(userText: string, passwordText: string) {
        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
                username: userText,
                password: passwordText,
            }),
        })

        const jsonResponse = await response.json()

        if (!response.ok) {
            setDisplayError(jsonResponse.error)
            return
        }

        setDisplayError('')
        setUser('')
        setPassword('')
        setOpenDialogLogin(false)
        window.location.reload()
    }

    async function register(userText: string, passwordText: string) {
        const response = await fetch('http://localhost:3000/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: userText,
                password: passwordText,
            }),
        })

        const jsonResponse = await response.json()

        if (!response.ok) {
            setDisplayError(jsonResponse.error)
            return
        }

        setDisplayError('')
        setDialogRegister(false)
    }

    return (
        <div
            className={`bg-black/70 h-screen w-screen flex justify-center items-center absolute ${openDialogLogin ? 'flex' : 'hidden'}`}>
            <div className='bg-gray-50 rounded-xl h-3/4 w-1/3 flex justify-center items-center flex-col'>
                <div className={`mb-4 w-8/12 flex ${dialogRegister ? 'justify-between' : 'justify-end'}`}>
                    <svg
                        onClick={() => setDialogRegister(false)}
                        className={`${dialogRegister ? 'flex' : 'hidden'} cursor-pointer`}
                        xmlns='http://www.w3.org/2000/svg'
                        height='40px'
                        viewBox='0 -960 960 960'
                        width='40px'
                        fill='#000000'>
                        <path d='m287-446.67 240 240L480-160 160-480l320-320 47 46.67-240 240h513v66.66H287Z' />
                    </svg>
                    <svg
                        className='cursor-pointer'
                        onClick={() => {
                            setOpenDialogLogin(false)
                            setDialogRegister(false)
                            setDisplayError('')
                        }}
                        xmlns='http://www.w3.org/2000/svg'
                        height='40px'
                        viewBox='0 -960 960 960'
                        width='40px'
                        fill='#000000'>
                        <path d='m251.33-204.67-46.66-46.66L433.33-480 204.67-708.67l46.66-46.66L480-526.67l228.67-228.66 46.66 46.66L526.67-480l228.66 228.67-46.66 46.66L480-433.33 251.33-204.67Z' />
                    </svg>
                </div>
                <div className='bg-blue-600/10 rounded-lg p-3 mb-6'>
                    <svg
                        xmlns='http://www.w3.org/2000/svg'
                        height='40px'
                        viewBox='0 -960 960 960'
                        width='40px'
                        fill='#0000F5'>
                        <path d='M242.57-100q-25.71 0-44.14-18.43T180-162.57v-391.89q0-25.9 18.43-44.23t44.14-18.33h62.3v-87.85q0-72.9 51.14-124.01Q407.15-880 480.09-880t123.99 51.12q51.05 51.11 51.05 124.01v87.85h62.3q25.71 0 44.14 18.33T780-554.46v391.89q0 25.71-18.43 44.14T717.43-100H242.57Zm0-50.26h474.86q5.39 0 8.85-3.46t3.46-8.85v-391.89q0-5.39-3.46-8.85t-8.85-3.46H242.57q-5.39 0-8.85 3.46t-3.46 8.85v391.89q0 5.39 3.46 8.85t8.85 3.46ZM528.5-309.83q20.01-19.83 20.01-47.86 0-27.41-20.12-48.37-20.13-20.96-48.5-20.96-28.38 0-48.39 20.96t-20.01 48.7q0 27.74 20.12 47.55Q451.74-290 480.11-290q28.38 0 48.39-19.83ZM355.13-617.02h249.74v-87.85q0-52.03-36.39-88.45-36.4-36.42-88.39-36.42t-88.47 36.42q-36.49 36.42-36.49 88.45v87.85ZM230.26-150.26v-416.51 416.51Z' />
                    </svg>
                </div>
                <h1 className='text-2xl mb-2 font-sans'>
                    {dialogRegister ? 'Create Your Account' : 'Log In or Sign In'}
                </h1>
                <p className='font-sans text-gray-900/80'>
                    {dialogRegister
                        ? 'Welcome! Please complete the fields!'
                        : 'Welcome back! Please enter your details.'}
                </p>
                <div className='flex gap-6 flex-col w-10/12 mt-8'>
                    <div className='flex flex-col gap-2'>
                        <p className='font-bold'>Username</p>
                        <input
                            type='text'
                            placeholder='Enter Your Username'
                            className='outline-none px-4 border border-black/20 shadow-sm rounded-md text-xl py-1'
                            onChange={(e) => setUser(e.target.value)}
                        />
                    </div>
                    <div className='flex flex-col gap-2'>
                        <p className='font-bold'>Password</p>
                        <input
                            type='password'
                            placeholder='Enter your Password'
                            className='outline-none px-4 rounded-md text-xl py-1 border-black/20 shadow-sm border'
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <p className={`bg-red-300 ${dialogRegister ? 'hidden' : 'flex'}`}>{displayError}</p>
                    <p className={`bg-red-300 ${dialogRegister ? 'flex' : 'hidden'}`}>{displayError}</p>
                    <button
                        className='cursor-pointer mt-2 bg-blue-700/85 rounded-md py-3 text-white font-sans hover:bg-blue-600 duration-200'
                        onClick={() => {
                            if (!dialogRegister) {
                                login(user, password)
                            } else {
                                register(user, password)
                            }
                        }}>
                        {dialogRegister ? 'Sign Up' : 'Log In/Sign In'}
                    </button>
                </div>
                <div
                    className={`justify-center items-center flex-col mt-4 gap-2 ${dialogRegister ? 'hidden' : 'flex'}`}>
                    <p className='text-sm font-bold'>or</p>
                    <div className='flex w-full justify-center items-center flex-row gap-1.5'>
                        <p className='text-lg'>Don't have an account?</p>
                        <button
                            className='text-blue-600 cursor-pointer font-bold hover:text-blue-500 duration-200'
                            onClick={() => {
                                setDialogRegister(true)
                                setDisplayError('')
                                setUser('')
                                setPassword('')
                            }}>
                            Sign Up
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default login
