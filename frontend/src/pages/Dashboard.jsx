import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../api/axios'
import NoteCard from '../components/NoteCard'

function Dashboard() {
    const [notes, setNotes] = useState([])
    const [title, setTitle] = useState('')
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        fetchNotes()
    }, [])

    const fetchNotes = async () => {
        try {
            const res = await API.get('/notes')
            setNotes(res.data)
            setLoading(false)
        } catch (err) {
            console.log(err)
        }
    }

    const createNote = async () => {
        if (!title.trim()) return
        try {
            const res = await API.post('/notes', { title, content: '' })
            navigate(`/editor/${res.data.note.roomId}`)
        } catch (err) {
            console.log(err)
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

    const logout = () => {
        localStorage.removeItem('token')
        navigate('/')
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white">
            
            <div className="border-b border-[#222] px-6 py-4 flex items-center justify-between">
                   <div className="flex items-center gap-2">
                    <img src="/favicon.svg" alt="logo" className="w-9 h-9" />
                <h1 className="text-white font-bold text-lg ">collab Notes</h1>
                </div>
                <button
                    onClick={logout}
                    className="text-gray-400 text-sm hover:text-white transition-all"
                >
                    Logout
                </button>
            </div>

            <div className="max-w-5xl mx-auto px-6 py-8">
                
                <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-1">Workspace</h2>
                    <p className="text-gray-500 text-sm">Your thoughts, one place at a time</p>
                </div>

                <div className="flex gap-3 mb-8">
                    <input
                        type="text"
                        placeholder="Note title..."
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="flex-1 bg-[#111] border border-[#222] rounded-lg px-4 py-3 text-sm text-white outline-none focus:border-gray-500"
                    />
                    <button
                        onClick={createNote}
                        className="bg-white text-black px-6 py-3 rounded-lg text-sm font-medium hover:bg-gray-200 transition-all"
                    >
                        New Note
                    </button>
                </div>

                {loading ? (
                    <p className="text-gray-500 text-sm">Loading...</p>
                ) : notes.length === 0 ? (
                    <p className="text-gray-500 text-sm">No notes yet — create one above</p>
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
        </div>
    )
}

export default Dashboard