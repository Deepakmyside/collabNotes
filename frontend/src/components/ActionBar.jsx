import { useState } from "react"

function ActionBar({ onCreate, onJoin, onAuthRequired }) {
  const [title, setTitle] = useState("")
  const [roomId, setRoomId] = useState("")
  const [showCreate, setShowCreate] = useState(false)
  const [showJoin, setShowJoin] = useState(false)

  const isLoggedIn = !!localStorage.getItem('token')

  const handleNewNote = () => {
    if (!isLoggedIn) { onAuthRequired?.(); return }
    setShowCreate(true)
  }

  const handleJoinClick = () => {
    if (!isLoggedIn) { onAuthRequired?.(); return }
    setShowJoin(true)
  }

  const Modal = ({ show, onClose, children }) => {
    if (!show) return null
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
        onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      >
        {children}
      </div>
    )
  }

  return (
    <>
      <div className="mb-10 flex items-center gap-2">
        {/* New Note */}
        <button
          onClick={handleNewNote}
          className="h-9 px-4 rounded-full text-xs font-semibold bg-white text-black hover:bg-zinc-100 active:scale-[0.97] transition-all duration-150"
        >
          + New Note
        </button>

        {/* Join Note */}
        <button
          onClick={handleJoinClick}
          className="h-9 px-4 rounded-full text-xs font-medium text-zinc-300 border border-zinc-700 hover:border-zinc-500 hover:text-zinc-100 active:scale-[0.97] transition-all duration-150"
        >
          Join Session
        </button>
      </div>

      {/* ── Create Modal ── */}
      <Modal show={showCreate} onClose={() => { setShowCreate(false); setTitle("") }}>
        <div className="w-full max-w-sm bg-zinc-900 border border-zinc-700/60 rounded-2xl p-6 shadow-2xl">
          <h3 className="text-zinc-100 text-base font-semibold mb-1">New Note</h3>
          <p className="text-zinc-500 text-xs mb-5">Give your note a title to get started</p>

          <input
            type="text"
            placeholder="e.g. Meeting notes, Ideas…"
            value={title}
            autoFocus
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') { setShowCreate(false); setTitle("") }
              if (e.key === 'Enter' && title.trim()) {
                onCreate(title); setTitle(""); setShowCreate(false)
              }
            }}
            className="w-full bg-black border border-zinc-700 text-zinc-100 placeholder-zinc-600 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-zinc-500 transition-colors mb-4"
          />

          <div className="flex justify-end gap-2">
            <button
              onClick={() => { setShowCreate(false); setTitle("") }}
              className="h-8 px-4 rounded-full text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                if (!title.trim()) return
                onCreate(title); setTitle(""); setShowCreate(false)
              }}
              className="h-8 px-4 rounded-full text-xs font-semibold bg-white text-black hover:bg-zinc-100 transition-colors"
            >
              Create
            </button>
          </div>
        </div>
      </Modal>

      {/* ── Join Modal ── */}
      <Modal show={showJoin} onClose={() => { setShowJoin(false); setRoomId("") }}>
        <div className="w-full max-w-sm bg-zinc-900 border border-zinc-700/60 rounded-2xl p-6 shadow-2xl">
          <h3 className="text-zinc-100 text-base font-semibold mb-1">Join a Session</h3>
          <p className="text-zinc-500 text-xs mb-5">Paste the room code shared with you</p>

          <input
            type="text"
            placeholder="Room code…"
            value={roomId}
            autoFocus
            onChange={(e) => setRoomId(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') { setShowJoin(false); setRoomId("") }
              if (e.key === 'Enter' && roomId.trim()) {
                onJoin(roomId); setRoomId(""); setShowJoin(false)
              }
            }}
            className="w-full bg-black border border-zinc-700 text-zinc-100 placeholder-zinc-600 rounded-xl px-4 py-2.5 text-sm font-mono outline-none focus:border-zinc-500 transition-colors mb-4"
          />

          <div className="flex justify-end gap-2">
            <button
              onClick={() => { setShowJoin(false); setRoomId("") }}
              className="h-8 px-4 rounded-full text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                if (!roomId.trim()) return
                onJoin(roomId); setRoomId(""); setShowJoin(false)
              }}
              className="h-8 px-4 rounded-full text-xs font-semibold bg-white text-black hover:bg-zinc-100 transition-colors"
            >
              Join
            </button>
          </div>
        </div>
      </Modal>
    </>
  )
}

export default ActionBar