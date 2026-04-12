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
        <div className="border-b border-[#1a1a1a] px-6 py-4 flex items-center justify-between sticky top-0 z-40 bg-[#0a0a0a]/80 backdrop-blur-md">

            {/* Logo */}
            <div
                className="flex items-center gap-2 cursor-pointer select-none"
                onClick={() => navigate('/')}
            >
                <img src="./favicon.svg" alt="logo" className="w-8 h-8" />
                <span className="text-white font-semibold text-base tracking-tight">collab<span className="text-gray-400">Notes</span></span>
            </div>

            {/* Right */}
            <div className="flex items-center gap-3">
                {token ? (
                    <button
                        onClick={logout}
                        className="text-sm text-gray-400 hover:text-white border border-[#222] hover:border-[#444] px-4 py-2 rounded-lg transition-all"
                    >
                        Log out
                    </button>
                ) : (
                    <button
                        onClick={onLoginClick}
                        className="text-sm bg-white text-black px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-all"
                    >
                        Sign in
                    </button>
                )}
            </div>
        </div>
    )
}

export default Navbar