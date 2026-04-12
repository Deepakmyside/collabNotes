import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../api/axios'
import NoteCard from '../components/NoteCard'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ActionBar from '../components/ActionBar'
import LoginModal from '../components/LoginModal'

function Dashboard() {
    const [notes, setNotes] = useState([])
    const [loading, setLoading] = useState(true)
    const [showLoginModal, setShowLoginModal] = useState(false)
    const [pendingRoomId, setPendingRoomId] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        fetchNotes()
    }, [])

    const fetchNotes = async () => {
        try {
            const token = localStorage.getItem('token')
            if (!token) {
                setNotes([])
                setLoading(false)
                return
            }
            const res = await API.get('/notes')
            setNotes(res.data)
            setLoading(false)
        } catch (err) {
            console.log(err)
            setLoading(false)
        }
    }

    const deleteNote = async (roomId) => {
        try {
            await API.delete(`/notes/${roomId}`)
            setNotes(notes.filter(note => note.roomId !== roomId))
        } catch (err) {
            console.log(err)
        }
    }

    const handleAuthRequired = (roomId = null) => {
        setPendingRoomId(roomId)
        setShowLoginModal(true)
    }

    const handleLoginSuccess = () => {
        setShowLoginModal(false)
        setPendingRoomId(null)
        fetchNotes()
    }

    const isLoggedIn = !!localStorage.getItem('token')

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">

            <Navbar onLoginClick={() => setShowLoginModal(true)} />

            <div className="max-w-5xl mx-auto px-6 py-10 flex-1 w-full">

                {/* Hero / Header */}
                <div className="mb-10 pt-2">
                    <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">
                        {isLoggedIn ? 'Your Workspace' : 'Collaborative Notes'}
                    </h2>
                    <p className="text-gray-500 text-sm">
                        {isLoggedIn
                            ? 'Your notes, all in one place.'
                            : 'Sign in to create and collaborate on notes in real time.'}
                    </p>
                </div>

                <ActionBar
                    onAuthRequired={() => handleAuthRequired(null)}
                    onCreate={async (title) => {
                        try {
                            const res = await API.post('/notes', { title, content: '' })
                            setNotes(prev => [res.data.note, ...prev])
                        } catch (err) {
                            console.log(err)
                        }
                    }}
                    onJoin={async (roomId) => {
                        const token = localStorage.getItem('token')
                        if (!token) {
                            handleAuthRequired(roomId)
                            return
                        }
                        try {
                            await API.post('/notes/join', { roomId })
                            navigate(`/editor/${roomId}`)
                        } catch (err) {
                            console.log(err)
                        }
                    }}
                />

                {/* Notes Grid */}
                {loading ? (
                    <div className="flex items-center gap-2 text-gray-600 text-sm pt-4">
                        <span className="inline-block w-4 h-4 border-2 border-gray-600 border-t-gray-400 rounded-full animate-spin"></span>
                        Loading notes...
                    </div>
                ) : !isLoggedIn ? (
                    <div className="border border-dashed border-[#222] rounded-2xl p-12 text-center mt-4">
                        <p className="text-gray-600 text-sm mb-4">Sign in to see your notes here</p>
                        <button
                            onClick={() => setShowLoginModal(true)}
                            className="text-sm bg-white text-black px-5 py-2.5 rounded-lg font-medium hover:bg-gray-100 transition-all"
                        >
                            Get started
                        </button>
                    </div>
                ) : notes.length === 0 ? (
                    <div className="border border-dashed border-[#222] rounded-2xl p-12 text-center mt-4">
                        <p className="text-gray-600 text-sm">No notes yet — create your first one ↑</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {notes.map(note => (
                            <NoteCard
                                key={note._id}
                                note={note}
                                onDelete={deleteNote}
                            />
                        ))}
                    </div>
                )}
            </div>

            <Footer />

            {/* Login Modal */}
            <LoginModal
                isOpen={showLoginModal}
                onClose={() => {
                    setShowLoginModal(false)
                    setPendingRoomId(null)
                }}
                onSuccess={handleLoginSuccess}
                pendingRoomId={pendingRoomId}
            />
        </div>
    )
}

export default Dashboard