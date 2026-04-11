import { useState } from 'react'
import API from '../api/axios'
import { useNavigate } from 'react-router-dom'

function Login() {
    const [isLogin, setIsLogin] = useState(true)
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const navigate = useNavigate()

    const handleSubmit = async () => {
        try {
            const endpoint = isLogin ? '/auth/login' : '/auth/register'
            const body = isLogin 
                ? { email, password } 
                : { name, email, password }
            
            const res = await API.post(endpoint, body)
            localStorage.setItem('token', res.data.token)
            navigate('/dashboard')
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong')
        }
    }

    return (
        <div className="min-h-screen bg-[#6ba3d8] flex items-center justify-center">
            <div className="bg-[#b7d1dc] border border-[#222] rounded-xl p-8 w-full max-w-md">
                
                <h1 className="text-white text-2xl font-bold mb-2">The Monolith</h1>
                <p className="text-gray-500 text-sm mb-6">
                    {isLogin ? 'Welcome back' : 'Create your account'}
                </p>

                <div className="flex mb-6 bg-[#1a1a1a] rounded-lg p-1">
                    <button
                        onClick={() => setIsLogin(true)}
                        className={`flex-1 py-2 rounded-md text-sm transition-all ${
                            isLogin ? 'bg-white text-black' : 'text-gray-400'
                        }`}
                    >
                        Login
                    </button>
                    <button
                        onClick={() => setIsLogin(false)}
                        className={`flex-1 py-2 rounded-md text-sm transition-all ${
                            !isLogin ? 'bg-white text-black' : 'text-gray-400'
                        }`}
                    >
                        Sign Up
                    </button>
                </div>

                {!isLogin && (
                    <input
                        type="text"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-[#1a1a1a] text-white border border-[#333] rounded-lg px-4 py-3 mb-3 text-sm outline-none focus:border-gray-500"
                    />
                )}

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#1a1a1a] text-white border border-[#333] rounded-lg px-4 py-3 mb-3 text-sm outline-none focus:border-gray-500"
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#1a1a1a] text-white border border-[#333] rounded-lg px-4 py-3 mb-4 text-sm outline-none focus:border-gray-500"
                />

                {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

                <button
                    onClick={handleSubmit}
                    className="w-full bg-white text-black py-3 rounded-lg text-sm font-medium hover:bg-gray-200 transition-all"
                >
                    {isLogin ? 'Sign In' : 'Create Account'}
                </button>
            </div>
        </div>
    )
}

export default Login