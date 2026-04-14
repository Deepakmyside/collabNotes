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
        <header className="sticky top-0 z-40 border-b border-edge backdrop-blur-xl" style={{ background: 'var(--color-panel)' }}>
            <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">

                {/* Logo */}
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 select-none group"
                >
                    <img src="./favicon.svg" alt="logo" className="w-7 h-7 opacity-90" />
                    <span className="text-sm font-semibold text-ink tracking-tight group-hover:text-ink transition-colors">
                        collabNotes
                    </span>
                </button>

                {/* Right */}
                <div className="flex items-center gap-2">
                    {token ? (
                        <button
                            onClick={logout}
                            className="h-8 px-4 rounded-full text-xs font-medium text-ink-2 border border-edge hover:border-ink-3 hover:text-ink transition-all duration-200"
                        >
                            Log out
                        </button>
                    ) : (
                        <button
                            onClick={onLoginClick}
                            className="h-8 px-4 rounded-full text-xs font-semibold bg-accent text-accent-fg hover:bg-accent-hover transition-all duration-200"
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