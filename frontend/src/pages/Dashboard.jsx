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
    const isLoggedIn = !!localStorage.getItem('token')

    // ── Typewriter: guest hero "together." ──────────────────────────
    const [heroTyped, setHeroTyped] = useState('')
    const [heroDeleting, setHeroDeleting] = useState(false)
    useEffect(() => {
        const full = 'together.'
        let t
        if (!heroDeleting && heroTyped.length < full.length)
            t = setTimeout(() => setHeroTyped(full.slice(0, heroTyped.length + 1)), 110)
        else if (!heroDeleting && heroTyped.length === full.length)
            t = setTimeout(() => setHeroDeleting(true), 2200)
        else if (heroDeleting && heroTyped.length > 0)
            t = setTimeout(() => setHeroTyped(full.slice(0, heroTyped.length - 1)), 55)
        else
            setHeroDeleting(false)
        return () => clearTimeout(t)
    }, [heroTyped, heroDeleting])

    // ── Typewriter: workspace subtitle cycling phrases ───────────────
    const workPhrases = ['all in one place.', 'always in sync.', 'ready when you are.']
    const [workIdx, setWorkIdx] = useState(0)
    const [workTyped, setWorkTyped] = useState('')
    const [workDeleting, setWorkDeleting] = useState(false)
    useEffect(() => {
        const current = workPhrases[workIdx]
        let t
        if (!workDeleting && workTyped.length < current.length)
            t = setTimeout(() => setWorkTyped(current.slice(0, workTyped.length + 1)), 75)
        else if (!workDeleting && workTyped.length === current.length)
            t = setTimeout(() => setWorkDeleting(true), 2000)
        else if (workDeleting && workTyped.length > 0)
            t = setTimeout(() => setWorkTyped(current.slice(0, workTyped.length - 1)), 38)
        else { setWorkDeleting(false); setWorkIdx(i => (i + 1) % workPhrases.length) }
        return () => clearTimeout(t)
    }, [workTyped, workDeleting, workIdx])

    useEffect(() => { fetchNotes() }, [])

    const fetchNotes = async () => {
        try {
            const token = localStorage.getItem('token')
            if (!token) { setNotes([]); setLoading(false); return }
            const res = await API.get('/notes')
            setNotes(res.data)
            setLoading(false)
        } catch (err) {
            console.log(err); setLoading(false)
        }
    }

    const deleteNote = async (roomId) => {
        try {
            await API.delete(`/notes/${roomId}`)
            setNotes(notes.filter(note => note.roomId !== roomId))
        } catch (err) { console.log(err) }
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

    return (
        <div className="min-h-screen text-ink flex flex-col relative overflow-hidden bg-surface">

            {/* ── Background decorations ── */}
            <div className="pointer-events-none select-none fixed inset-0 z-0 overflow-hidden">
                {/* Orb 1 – top-left white/zinc */}
                <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-ink/[0.03] rounded-full blur-[140px]" />
                {/* Orb 2 – bottom-right zinc */}
                <div className="absolute bottom-0 -right-48 w-[500px] h-[500px] bg-edge/[0.5] rounded-full blur-[120px]" />
                {/* Blurred grid layer 1 – fine neutral */}
                <div className="absolute inset-0 opacity-[0.2]" style={{
                    backgroundImage: 'linear-gradient(rgba(160,70,10,0.45) 1px, transparent 1px), linear-gradient(90deg, rgba(160,70,10,0.45) 1px, transparent 1px)',
                    backgroundSize: '60px 60px'
                }} />
                {/* Blurred grid layer 2 – coarse */}
                <div className="absolute inset-0 opacity-[0.14]" style={{
                    backgroundImage: 'linear-gradient(rgba(160,70,10,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(160,70,10,0.7) 1px, transparent 1px)',
                    backgroundSize: '180px 180px'
                }} />
            </div>

            <div className="relative z-10 flex flex-col flex-1">
                <Navbar onLoginClick={() => setShowLoginModal(true)} />

                <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-12">

                    {/* ── Hero ── */}
                    <div className="mb-10 relative">
                        {isLoggedIn ? (
                            <>
                                {/* Penbook decor – workspace */}
                                <div className="hidden sm:block absolute -top-2 right-0 w-20 opacity-[0.65] pointer-events-none select-none"
                                    style={{ filter: '   brightness(1.9) drop-shadow(0 4px 12px rgba(160,70,10,0.7))' }}>
                                    <img src="/penbook.png.png" alt="" className="w-full object-contain" />
                                </div>
                                <h1 className="text-2xl font-bold text-ink tracking-tight mb-1">
                                    Workspace
                                </h1>
                                <p className="text-ink-2 text-sm">
                                    Your notes,{' '}
                                    <span>
                                        {workTyped}
                                        <span className="inline-block w-[2px] h-[0.85em] bg-accent align-middle ml-0.5 animate-pulse" />
                                    </span>
                                </p>
                            </>
                        ) : (
                            <>
                                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-edge bg-surface-2 text-ink-2 text-xs mb-5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                                    Real-time collaboration
                                </div>
                                <h1 className="text-3xl font-bold text-ink tracking-tight mb-3 leading-tight">
                                    Notes that think<br />
                                    <span className="text-ink-2">
                                        {heroTyped}
                                        <span className="inline-block w-[2px] h-[1em] bg-accent align-middle ml-0.5 animate-pulse" />
                                    </span>
                                </h1>
                                <p className="text-ink-4 text-md max-w-sm leading-relaxed">
                                    Create, share and edit notes with your team — live, no setup required.
                                </p>
                            </>
                        )}
                    </div>

                    {/* ── ActionBar ── */}
                    <ActionBar
                        onAuthRequired={() => handleAuthRequired(null)}
                        onCreate={async (title) => {
                            try {
                                const res = await API.post('/notes', { title, content: '' })
                                setNotes(prev => [res.data.note, ...prev])
                            } catch (err) { console.log(err) }
                        }}
                        onJoin={async (roomId) => {
                            if (!localStorage.getItem('token')) {
                                handleAuthRequired(roomId); return
                            }
                            try {
                                await API.post('/notes/join', { roomId })
                                navigate(`/editor/${roomId}`)
                            } catch (err) { console.log(err) }
                        }}
                    />

                    {/* ── Notes area ── */}
                    {loading ? (
                        <div className="flex items-center gap-2.5 text-ink-3 text-sm">
                            <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
                            </svg>
                            Loading…
                        </div>
                    ) : !isLoggedIn ? (
                        /* guests: just hero text + actionbar above */
                        <div className="py-10 text-center">
                            <p className="text-ink-3 text-xs">Sign in to create and view your notes.</p>
                        </div>
                    ) : notes.length === 0 ? (
                        <div className="py-16 text-center">
                            <p className="text-ink-3 text-md">Starting creating notes...!</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {notes.map(note => (
                                <NoteCard key={note._id} note={note} onDelete={deleteNote} />
                            ))}
                        </div>
                    )}
                </main>

                <Footer />

                <LoginModal
                    isOpen={showLoginModal}
                    onClose={() => { setShowLoginModal(false); setPendingRoomId(null) }}
                    onSuccess={handleLoginSuccess}
                    pendingRoomId={pendingRoomId}
                />
            </div>
        </div>
    )
}

export default Dashboard