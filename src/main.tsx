import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Login from './Login'
import App from './pages/App'
import { createBrowserRouter, RouterProvider } from 'react-router'

const router = createBrowserRouter([
    { path: '/', element: <App /> },
    { path: '/login', element: <Login /> },
])

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <RouterProvider router={router} />
    </StrictMode>,
)
