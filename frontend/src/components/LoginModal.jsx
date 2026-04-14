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

    useEffect(() => {
        if (isOpen) {
            setIsLogin(true)
            setName('')
            setEmail('')
            setPassword('')
            setError('')
        }
    }, [isOpen])

    useEffect(() => {
        const handleKey = (e) => { if (e.key === 'Escape') onClose() }
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
            const body = isLogin ? { email, password } : { name, email, password }

            const res = await API.post(endpoint, body)
            localStorage.setItem('token', res.data.token)

            if (pendingRoomId) {
                try {
                    await API.post('/notes/join', { roomId: pendingRoomId })
                } catch { }
                onClose()
                navigate(`/editor/${pendingRoomId}`)
            } else {
                onClose()
                onSuccess?.()
            }

        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong')
        } finally {
            setLoading(false)
        }
    }

    // 🔥 GOOGLE LOGIN HANDLER
    const handleGoogleLogin = () => {
        if (pendingRoomId) {
            localStorage.setItem('pendingRoomId', pendingRoomId)
        }
        window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/[0.35] backdrop-blur-sm"
            onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
        >
            <div className="w-full max-w-sm bg-surface border border-edge rounded-2xl p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                    <div>
                        <h2 className="text-ink text-base font-semibold mb-0.5">
                            {isLogin ? 'Sign in' : 'Create account'}
                        </h2>
                        <p className="text-ink-2 text-xs">
                            {isLogin ? 'Welcome back to collabNotes' : 'Start collaborating for free'}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-ink-2 hover:text-ink transition-colors text-lg leading-none mt-0.5"
                    >
                        ✕
                    </button>
                </div>

                {/* Tab toggle */}
                <div className="flex p-0.5 bg-surface-3 border border-edge rounded-xl mb-5">
                    <button
                        onClick={() => { setIsLogin(true); setError('') }}
                        className={`flex-1 py-2 rounded-[10px] text-xs font-medium transition-all duration-200 ${isLogin
                            ? 'bg-surface text-ink shadow-sm'
                            : 'text-ink-2 hover:text-ink'
                            }`}
                    >
                        Sign In
                    </button>
                    <button
                        onClick={() => { setIsLogin(false); setError('') }}
                        className={`flex-1 py-2 rounded-[10px] text-xs font-medium transition-all duration-200 ${!isLogin
                            ? 'bg-surface text-ink shadow-sm'
                            : 'text-ink-2 hover:text-ink'
                            }`}
                    >
                        Sign Up
                    </button>
                </div>

                {/* Fields */}
                <div className="flex flex-col gap-2.5 mb-4">
                    {!isLogin && (
                        <input
                            type="text"
                            placeholder="Full name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                            className="w-full bg-surface-2 border border-edge text-ink placeholder-ink-3 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-accent transition-colors"
                        />
                    )}
                    <input
                        type="email"
                        placeholder="Email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                        className="w-full bg-surface-2 border border-edge text-ink placeholder-ink-3 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-accent transition-colors"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                        className="w-full bg-surface-2 border border-edge text-ink placeholder-ink-3 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-accent transition-colors"
                    />
                </div>

                {error && (
                    <div className="mb-4 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                        {error}
                    </div>
                )}

                {/* 🔥 GOOGLE LOGIN BUTTON */}
                <button
                    onClick={handleGoogleLogin}
                    className="w-full flex items-center justify-center gap-2 bg-surface-2 border border-edge text-ink rounded-full h-9 text-xs font-medium hover:border-ink-3 transition-all duration-150 mb-3"
                >
                    <img
                        src="https://www.svgrepo.com/show/475656/google-color.svg"
                        alt="google"
                        className="w-4 h-4"
                    />
                    Continue with Google
                </button>

                {/* Divider */}
                <div className="flex items-center gap-2 mb-3">
                    <div className="flex-1 h-px bg-edge" />
                    <span className="text-ink-3 text-[10px]">OR</span>
                    <div className="flex-1 h-px bg-edge" />
                </div>

                {/* Email Auth */}
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full h-9 rounded-full text-xs font-semibold bg-accent text-accent-fg hover:bg-accent-hover active:scale-[0.98] transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                    {loading ? 'Please wait…' : isLogin ? 'Sign In' : 'Create Account'}
                </button>
            </div>
        </div>
    )
}

export default LoginModal