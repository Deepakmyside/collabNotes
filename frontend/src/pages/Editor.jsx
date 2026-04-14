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
    const [loading, setLoading]= useState(true)

    useEffect(() => {
        fetchNote()
        socket.connect()
        console.log('Socket connected:', socket.id)
        socket.emit('join-room', roomId)
        console.log('joining room:', roomId)

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
        } catch (err) { console.log(err) 

        }finally {
        setLoading(false)
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
     if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="text-ink-2 text-sm">Loading note...</div>
    </div>
)
    return (
        <div className="min-h-screen text-ink flex flex-col bg-surface">

            {/* ── Top bar ── */}
            <header className="sticky top-0 z-40 border-b border-edge backdrop-blur-xl" style={{ background: 'var(--color-panel)' }}>
                <div className="px-4 sm:px-6 h-14 flex items-center justify-between gap-2 sm:gap-4">

                    {/* Left: back */}
                    <button
                        onClick={() => navigate('/')}
                        className="cursor-pointer flex items-center gap-1.5 text-ink-2 hover:text-ink text-xs transition-colors duration-150 shrink-0"
                    >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                        <span className="hidden sm:inline">Back</span>
                    </button>

                    {/* Center: room pill — full on sm+, icon-only on mobile */}
                    <button
                        onClick={copyRoomId}
                        className="cursor-pointer flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-full border border-edge hover:border-ink-3 bg-surface-2 hover:bg-surface-3 transition-all duration-150 group min-w-0"
                        title={copied ? 'Copied!' : 'Copy room code'}
                    >
                        {/* Label + code: visible sm+ only */}
                        <span className="hidden sm:inline text-ink-2 text-xs shrink-0">Room</span>
                        <span className="hidden sm:inline text-ink text-xs font-mono truncate max-w-[120px]">{roomId?.slice(0, 10)}…</span>

                        {/* Copy icon — always visible */}
                        <span className={`text-xs transition-colors duration-150 ${copied ? 'text-amber-500' : 'text-ink-2 group-hover:text-ink'}`}>
                            {copied ? (
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            ) : (
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                            )}
                        </span>

                        {/* Mobile: show short code next to icon */}
                        <span className="sm:hidden text-ink-2 text-[10px] font-mono">{roomId?.slice(0, 6)}</span>
                    </button>

                    {/* Right */}
                    <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                        {/* Online users — hide on mobile to save space */}
                        <span className="hidden sm:flex">
                            <OnlineUsers users={onlineUsers} />
                        </span>

                        <button
                            onClick={saveNote}
                            disabled={saving}
                            className={`cursor-pointer h-8 px-3 sm:px-4 rounded-full text-xs font-semibold transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed ${
                                savedFlash
                                    ? 'bg-green-500 text-white'
                                    : 'bg-accent text-accent-fg hover:bg-accent-hover active:scale-[0.97]'
                            }`}
                        >
                            {savedFlash ? '✓ Saved' : saving ? 'Saving…' : 'Save'}
                        </button>
                    </div>
                </div>
            </header>

            {/* ── Editor body — full-bleed writing surface ── */}
            <main className="flex-1 flex flex-col bg-surface-2">
                <div className="max-w-3xl mx-auto w-full px-5 sm:px-8 flex-1 flex flex-col py-8 sm:py-10">

                    {/* Title */}
                    <input
                        type="text"
                        value={title}
                        onChange={handleTitleChange}
                        placeholder="Untitled"
                        className="cursor-text bg-transparent text-xl sm:text-2xl font-bold text-ink outline-none placeholder-ink-3 tracking-tight w-full pb-6 sm:pb-7"
                    />

                    {/* Separator */}
                    <div className="border-t border-edge mb-6 sm:mb-7" />

                    {/* Content */}
                    <textarea
                        value={content}
                        onChange={handleContentChange}
                        placeholder="Start writing…"
                        className="cursor-text flex-1 bg-transparent text-ink-1 text-md leading-7 outline-none resize-none placeholder-ink-3 w-full min-h-[60vh]"
                    />
                </div>
            </main>
        </div>
    )
}

export default Editor