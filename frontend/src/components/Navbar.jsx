import { useNavigate } from 'react-router-dom'

function Navbar() {
    const navigate = useNavigate()

    const logout = () => {
        localStorage.removeItem('token')
        navigate('/')
    }

    return (
        <div className="border-b border-[#222] px-6 py-4 flex items-center justify-between">
            
            {/* Left */}
            <div 
                className="flex items-center gap-2 cursor-pointer" 
                onClick={() => navigate('/dashboard')}
            >
                <img src="./favicon.svg" alt="logo" className="w-9 h-9" />
                <h1 className="text-white font-bold text-lg">collab Notes</h1>
            </div>

            {/* Right */}
            <div className="flex items-center gap-4">
                <span className="text-sm text-gray-400">Deepak</span>
                <button
                    onClick={logout}
                    className="text-gray-400 text-sm hover:text-white transition-all"
                >
                    Logout
                </button>
            </div>
        </div>
    )
}

export default Navbar