import { useNavigate } from 'react-router-dom'

function Navbar({ onLoginClick }) {
    const navigate = useNavigate()
    const token = localStorage.getItem('token')

    const logout = () => {
        localStorage.removeItem('token')
        navigate('/', { replace: true })
        window.location.reload()
    }

    return (
                    <header className="sticky top-0 z-40 border-b border-zinc-800/60 backdrop-blur-xl" style={{ background: 'rgba(17,17,19,0.8)' }}>
            <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">

                {/* Logo */}
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 select-none group"
                >
                    <img src="./favicon.svg" alt="logo" className="w-5 h-5 opacity-90" />
                    <span className="text-sm font-semibold text-zinc-100 tracking-tight group-hover:text-white transition-colors">
                        collabNotes
                    </span>
                </button>

                {/* Right */}
                <div className="flex items-center gap-2">
                    {token ? (
                        <button
                            onClick={logout}
                            className="h-8 px-4 rounded-full text-xs font-medium text-zinc-400 border border-zinc-700 hover:border-zinc-500 hover:text-zinc-200 transition-all duration-200"
                        >
                            Log out
                        </button>
                    ) : (
                        <button
                            onClick={onLoginClick}
                            className="h-8 px-4 rounded-full text-xs font-semibold bg-zinc-200 text-zinc-900 hover:bg-zinc-300 transition-all duration-200"
                        >
                            Sign in
                        </button>
                    )}
                </div>
            </div>
        </header>
    )
}

export default Navbar