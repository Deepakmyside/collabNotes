import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../api/axios'
import NoteCard from '../components/NoteCard'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ActionBar from '../components/ActionBar'

function Dashboard() {
    const [notes, setNotes] = useState([])
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        fetchNotes()
    }, [])

    const fetchNotes = async () => {
        try {

            const token = localStorage.getItem('token')

            if(!token) {
                setNotes([])
                setLoading(false)
            }
            
            const res = await API.get('/notes')
            setNotes(res.data)
            setLoading(false)
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
    console.log("API base:", API.defaults.baseURL)

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
            
            <Navbar />

            <div className="max-w-5xl mx-auto px-6 py-8 flex-1 w-full">
                
                {/* Header */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-1">Workspace</h2>
                    <p className="text-gray-500 text-sm">Your thoughts, one place at a time</p>
                </div>

          <ActionBar 
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

                    if(!token){
                        localStorage.setItem('redirectAfterLogin', `/editor/${roomId}`)
                        navigate('/')
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

                {loading ? (
                    <p className="text-gray-500 text-sm">Loading...</p>
                ) : notes.length === 0 ? (
                    <p className="text-gray-500 text-sm">
                        No notes yet — create your first note 🚀
                    </p>
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
        </div>
    )
}

export default Dashboard