import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import API from '../api/axios'
import socket from '../socket/socket'
import OnlineUsers from '../components/OnlineUsers'

function Editor() {
    const { roomId } = useParams()
    console.log('roomId:', roomId)
    const navigate = useNavigate()
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [onlineUsers, setOnlineUsers] = useState([1])
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        fetchNote()
        socket.connect()
        socket.emit('join-room', roomId)

        socket.on('note-change', ({ content, title }) => {
            if (content !== undefined) setContent(content)
            if (title !== undefined) setTitle(title)
        })

        socket.on('room-users', (count) => {
              console.log('room-users received:', count)
            setOnlineUsers(count)
        })

        return () => {
            socket.off('note-change')
            socket.off('room-users')
            socket.disconnect()
        }
    }, [roomId])

    const fetchNote = async () => {
        try {
            const res = await API.get(`/notes/${roomId}`)
            setTitle(res.data.title)
            setContent(res.data.content)
        } catch (err) {
            console.log(err)
        }
    }

    const handleContentChange = (e) => {
        setContent(e.target.value)
        socket.emit('note-change', { roomId, content: e.target.value, title })
    }

    const handleTitleChange = (e) => {
        setTitle(e.target.value)
        socket.emit('note-change', { roomId, content, title: e.target.value })
    }

    const saveNote = async () => {
        setSaving(true)
        try {
            await API.put(`/notes/${roomId}`, { title, content })
            navigate('/dashboard')
        } catch (err) {
            console.log(err)
        }
        setSaving(false)
    }
    
    const shareNote = () => {
        const link = `${window.location.origin}/editor/${roomId}`
        navigator.clipboard.writeText(link)
        alert('Link  copied!')
    }
    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
            
            <div className="border-b border-[#222] px-6 py-3 flex items-center justify-between">
                <button
                    onClick={() => navigate('/dashboard')}
                    className="text-gray-400 text-sm hover:text-white transition-all"
                >
                    ← Back
                </button>
                <div className="flex items-center gap-4">
                    <OnlineUsers users={onlineUsers} />
                    
                    <button 
                    onClick={shareNote}
                    className='border border-[#333] text-gray-300 px-4 py-2 rounded-lg text-sm hover:border-gray-500 transition-all'>Share</button>

                    <button
                        onClick={saveNote}
                        className="bg-white text-black px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-all"
                    >
                        {saving ? 'Saving...' : 'Save'}
                    </button>
                </div>
            </div>

            <div className="max-w-3xl mx-auto w-full px-6 py-8 flex flex-col flex-1">
                <input
                    type="text"
                    value={title}
                    onChange={handleTitleChange}
                    placeholder="Untitled"
                    className="bg-transparent text-3xl font-bold text-white outline-none mb-6 placeholder-gray-700"
                />
                <textarea
                    value={content}
                    onChange={handleContentChange}
                    placeholder="Start writing..."
                    className="bg-transparent text-gray-300 outline-none flex-1 resize-none text-base leading-relaxed placeholder-gray-700"
                />
            </div>
        </div>
    )
}

export default Editor