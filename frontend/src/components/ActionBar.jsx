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
      <div className="mb-10 flex items-center gap-3">
        {/* New Note – primary */}
        <button
          onClick={handleNewNote}
          className="group inline-flex items-center gap-1.5 h-9 px-5 rounded-xl text-xs font-semibold bg-accent text-accent-fg hover:bg-accent-hover active:scale-[0.96] transition-all duration-200"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          New Note
        </button>

        {/* Join Session – zinc border */}
        <button
          onClick={handleJoinClick}
          className="group inline-flex items-center gap-1.5 h-9 px-5 rounded-xl text-xs font-medium text-ink-2 border border-edge hover:border-ink-3 hover:text-ink active:scale-[0.96] transition-all duration-200"
        >
          <svg className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
          <span>Join Session</span>
        </button>
      </div>

      {/* ── Create Modal ── */}
      <Modal show={showCreate} onClose={() => { setShowCreate(false); setTitle("") }}>
        <div className="w-full max-w-sm bg-surface border border-edge rounded-2xl p-6 shadow-2xl">
          <h3 className="text-ink text-base font-semibold mb-1">New Note</h3>
          <p className="text-ink-2 text-xs mb-5">Give your note a title to get started</p>

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
            className="w-full bg-surface-2 border border-edge text-ink placeholder-ink-3 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-ink-3 transition-colors mb-4"
          />

          <div className="flex justify-end gap-2">
            <button
              onClick={() => { setShowCreate(false); setTitle("") }}
              className="h-8 px-4 rounded-full text-xs text-ink-2 hover:text-ink transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                if (!title.trim()) return
                onCreate(title); setTitle(""); setShowCreate(false)
              }}
              className="h-8 px-4 rounded-full text-xs font-semibold bg-accent text-accent-fg hover:bg-accent-hover transition-colors"
            >
              Create
            </button>
          </div>
        </div>
      </Modal>

      {/* ── Join Modal ── */}
      <Modal show={showJoin} onClose={() => { setShowJoin(false); setRoomId("") }}>
        <div className="w-full max-w-sm bg-surface border border-edge rounded-2xl p-6 shadow-2xl">
          <h3 className="text-ink text-base font-semibold mb-1">Join a Session</h3>
          <p className="text-ink-2 text-xs mb-5">Paste the room code shared with you</p>

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
            className="w-full bg-surface-2 border border-edge text-ink placeholder-ink-3 rounded-xl px-4 py-2.5 text-sm font-mono outline-none focus:border-ink-3 transition-colors mb-4"
          />

          <div className="flex justify-end gap-2">
            <button
              onClick={() => { setShowJoin(false); setRoomId("") }}
              className="h-8 px-4 rounded-full text-xs text-ink-2 hover:text-ink transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                if (!roomId.trim()) return
                onJoin(roomId); setRoomId(""); setShowJoin(false)
              }}
              className="h-8 px-4 rounded-full text-xs font-semibold bg-accent text-accent-fg hover:bg-accent-hover transition-colors"
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