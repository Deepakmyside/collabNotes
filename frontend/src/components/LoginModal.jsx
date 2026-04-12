import { useState, useEffect } from 'react'
import API from '../api/axios'
import { useNavigate } from 'react-router-dom'

function LoginModal({ isOpen, onClose, onSuccess, pendingRoomId }) {
    const [isLogin, setIsLogin] = useState(true)
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    // Reset form when modal opens
    useEffect(() => {
        if (isOpen) {
            setIsLogin(true)
            setName('')
            setEmail('')
            setPassword('')
            setError('')
        }
    }, [isOpen])

    // Close on Escape
    useEffect(() => {
        const handleKey = (e) => {
            if (e.key === 'Escape') onClose()
        }
        if (isOpen) window.addEventListener('keydown', handleKey)
        return () => window.removeEventListener('keydown', handleKey)
    }, [isOpen, onClose])

    if (!isOpen) return null

    const handleSubmit = async () => {
        if (!email || !password || (!isLogin && !name)) {
            setError('Please fill in all fields')
            return
        }
        setLoading(true)
        setError('')
        try {
            const endpoint = isLogin ? '/auth/login' : '/auth/register'
            const body = isLogin
                ? { email, password }
                : { name, email, password }

            const res = await API.post(endpoint, body)
            localStorage.setItem('token', res.data.token)

            // If there was a pending room join, handle it
            if (pendingRoomId) {
                try {
                    await API.post('/notes/join', { roomId: pendingRoomId })
                } catch (err) {
                    console.log(err)
                }
                onClose()
                navigate(`/editor/${pendingRoomId}`)
            } else {
                onClose()
                if (onSuccess) onSuccess()
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong')
        } finally {
            setLoading(false)
        }
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleSubmit()
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}
            onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
        >
            <div
                className="bg-[#111] border border-[#222] rounded-2xl p-8 w-full max-w-md relative"
                style={{
                    animation: 'modalIn 0.2s ease-out',
                    boxShadow: '0 25px 60px rgba(0,0,0,0.8)'
                }}
            >
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-600 hover:text-gray-300 transition-colors text-xl leading-none"
                    aria-label="Close"
                >
                    ×
                </button>

                {/* Header */}
                <div className="mb-6">
                    <h2 className="text-white text-2xl font-bold mb-1">Welcome to collabNotes</h2>
                    <p className="text-gray-500 text-sm">
                        {isLogin ? 'Sign in to continue' : 'Create an account to get started'}
                    </p>
                </div>

                {/* Tab toggle */}
                <div className="flex mb-6 bg-[#0a0a0a] rounded-lg p-1 border border-[#222]">
                    <button
                        onClick={() => { setIsLogin(true); setError('') }}
                        className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${
                            isLogin
                                ? 'bg-white text-black'
                                : 'text-gray-500 hover:text-gray-300'
                        }`}
                    >
                        Sign In
                    </button>
                    <button
                        onClick={() => { setIsLogin(false); setError('') }}
                        className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${
                            !isLogin
                                ? 'bg-white text-black'
                                : 'text-gray-500 hover:text-gray-300'
                        }`}
                    >
                        Sign Up
                    </button>
                </div>

                {/* Fields */}
                {!isLogin && (
                    <input
                        type="text"
                        placeholder="Full name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="w-full bg-[#0a0a0a] text-gray-200 border border-[#2a2a2a] rounded-lg px-4 py-3 mb-3 text-sm outline-none focus:border-[#444] transition-colors"
                    />
                )}

                <input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full bg-[#0a0a0a] text-gray-200 border border-[#2a2a2a] rounded-lg px-4 py-3 mb-3 text-sm outline-none focus:border-[#444] transition-colors"
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full bg-[#0a0a0a] text-gray-200 border border-[#2a2a2a] rounded-lg px-4 py-3 mb-4 text-sm outline-none focus:border-[#444] transition-colors"
                />

                {error && (
                    <p className="text-red-400 text-sm mb-4 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                        {error}
                    </p>
                )}

                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full bg-white text-black py-3 rounded-lg text-sm font-semibold hover:bg-gray-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Create Account'}
                </button>
            </div>

            <style>{`
                @keyframes modalIn {
                    from { opacity: 0; transform: scale(0.96) translateY(8px); }
                    to   { opacity: 1; transform: scale(1)    translateY(0); }
                }
            `}</style>
        </div>
    )
}

export default LoginModal
