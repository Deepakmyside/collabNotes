import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import API from '../api/axios'
import socket from '../socket/socket'
import OnlineUsers from '../components/OnlineUsers'

function Editor() {
    const { roomId } = useParams()
    const navigate = useNavigate()
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [onlineUsers, setOnlineUsers] = useState([1])
    const [saving, setSaving] = useState(false)
    const [copied, setCopied] = useState(false)
    const [savedFlash, setSavedFlash] = useState(false)

    useEffect(() => {
        fetchNote()
        socket.connect()
        socket.emit('join-room', roomId)

        socket.on('note-change', ({ content, title }) => {
            if (content !== undefined) setContent(content)
            if (title !== undefined) setTitle(title)
        })

        socket.on('room-users', (count) => setOnlineUsers(count))

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
        } catch (err) { console.log(err) }
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
        const token = localStorage.getItem('token')
        if (!token) {
            localStorage.setItem('redirectAfterLogin', `/dashboard`)
            navigate('/')
            return
        }
        setSaving(true)
        try {
            await API.put(`/notes/${roomId}`, { title, content })
            setSavedFlash(true)
            setTimeout(() => { setSavedFlash(false); navigate('/') }, 1000)
        } catch (err) { console.log(err) }
        setSaving(false)
    }

    const copyRoomId = () => {
        navigator.clipboard.writeText(roomId)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="min-h-screen bg-black text-white flex flex-col">

            {/* ── Top bar ── */}
            <header className="sticky top-0 z-40 border-b border-zinc-800/60 bg-black/80 backdrop-blur-xl">
                <div className="px-6 h-14 flex items-center justify-between gap-4">

                    {/* Left: back */}
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center gap-1.5 text-zinc-500 hover:text-zinc-200 text-xs transition-colors duration-150 shrink-0"
                    >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                        Back
                    </button>

                    {/* Center: room pill */}
                    <button
                        onClick={copyRoomId}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-zinc-800 hover:border-zinc-600 bg-zinc-900/60 hover:bg-zinc-800/60 transition-all duration-150 group"
                    >
                        <span className="text-zinc-500 text-xs">Room</span>
                        <span className="text-zinc-300 text-xs font-mono">{roomId?.slice(0, 10)}…</span>
                        <span className={`text-xs transition-colors duration-150 ${copied ? 'text-green-400' : 'text-zinc-600 group-hover:text-zinc-400'}`}>
                            {copied ? '✓' : '⎘'}
                        </span>
                    </button>

                    {/* Right */}
                    <div className="flex items-center gap-3 shrink-0">
                        <OnlineUsers users={onlineUsers} />

                        <button
                            onClick={saveNote}
                            disabled={saving}
                            className={`h-8 px-4 rounded-full text-xs font-semibold transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed ${
                                savedFlash
                                    ? 'bg-green-500 text-white'
                                    : 'bg-white text-black hover:bg-zinc-100 active:scale-[0.97]'
                            }`}
                        >
                            {savedFlash ? '✓ Saved' : saving ? 'Saving…' : 'Save'}
                        </button>
                    </div>
                </div>
            </header>

            {/* ── Editor body ── */}
            <main className="flex-1 max-w-3xl mx-auto w-full px-6 py-10 flex flex-col">
                <input
                    type="text"
                    value={title}
                    onChange={handleTitleChange}
                    placeholder="Untitled"
                    className="bg-transparent text-2xl font-bold text-zinc-100 outline-none mb-6 placeholder-zinc-700 tracking-tight w-full"
                />
                <div className="w-8 h-px bg-zinc-800 mb-6" />
                <textarea
                    value={content}
                    onChange={handleContentChange}
                    placeholder="Start writing…"
                    className="bg-transparent text-zinc-400 text-sm leading-7 outline-none flex-1 resize-none placeholder-zinc-700 w-full"
                />
            </main>
        </div>
    )
}

export default Editor