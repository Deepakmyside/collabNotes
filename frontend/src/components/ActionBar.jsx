import { useState } from "react"

function ActionBar({ onCreate, onJoin, onAuthRequired }) {
  const [title, setTitle] = useState("")
  const [roomId, setRoomId] = useState("")
  const [showCreate, setShowCreate] = useState(false)
  const [showJoin, setShowJoin] = useState(false)

  const isLoggedIn = !!localStorage.getItem('token')

  const handleNewNote = () => {
    if (!isLoggedIn) {
      onAuthRequired?.()
      return
    }
    setShowCreate(true)
  }

  const handleJoinClick = () => {
    if (!isLoggedIn) {
      onAuthRequired?.()
      return
    }
    setShowJoin(true)
  }

  return (
    <div className="mb-8 flex gap-3">

      {/* New Note Button */}
      <button
        onClick={handleNewNote}
        className="bg-white text-black px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-100 transition-all"
      >
        + New Note
      </button>

      {/* Join Note Button */}
      <button
        onClick={handleJoinClick}
        className="bg-[#111] border border-[#222] px-5 py-2.5 rounded-lg text-sm text-gray-300 hover:border-[#444] hover:text-white transition-all"
      >
        Join Note
      </button>

      {/* Create Modal */}
      {showCreate && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
          style={{ backdropFilter: 'blur(4px)' }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowCreate(false) }}
        >
          <div className="bg-[#111] p-6 rounded-2xl w-[90%] max-w-sm border border-[#222]"
               style={{ boxShadow: '0 25px 60px rgba(0,0,0,0.8)', animation: 'modalIn 0.2s ease-out' }}>

            <h3 className="text-white text-lg font-semibold mb-1">New Note</h3>
            <p className="text-gray-500 text-sm mb-4">Give your note a title to get started</p>

            <input
              type="text"
              placeholder="e.g. Meeting notes, Ideas..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') setShowCreate(false)
                if (e.key === 'Enter' && title.trim()) {
                  onCreate(title)
                  setTitle("")
                  setShowCreate(false)
                }
              }}
              autoFocus
              className="w-full bg-[#0a0a0a] border border-[#2a2a2a] text-gray-200 px-4 py-3 rounded-lg text-sm mb-4 outline-none focus:border-[#444] transition-colors"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowCreate(false)}
                className="text-gray-500 text-sm px-4 py-2 hover:text-white transition-colors"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  if (!title.trim()) return
                  onCreate(title)
                  setTitle("")
                  setShowCreate(false)
                }}
                className="bg-white text-black px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition-all"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Join Modal */}
      {showJoin && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
          style={{ backdropFilter: 'blur(4px)' }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowJoin(false) }}
        >
          <div className="bg-[#111] p-6 rounded-2xl w-[90%] max-w-sm border border-[#222]"
               style={{ boxShadow: '0 25px 60px rgba(0,0,0,0.8)', animation: 'modalIn 0.2s ease-out' }}>

            <h3 className="text-white text-lg font-semibold mb-1">Join a Note</h3>
            <p className="text-gray-500 text-sm mb-4">Enter the room code shared with you</p>

            <input
              type="text"
              placeholder="Paste room code..."
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') setShowJoin(false)
                if (e.key === 'Enter' && roomId.trim()) {
                  onJoin(roomId)
                  setRoomId("")
                  setShowJoin(false)
                }
              }}
              autoFocus
              className="w-full bg-[#0a0a0a] border border-[#2a2a2a] text-gray-200 px-4 py-3 rounded-lg text-sm mb-4 outline-none focus:border-[#444] transition-colors font-mono"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowJoin(false)}
                className="text-gray-500 text-sm px-4 py-2 hover:text-white transition-colors"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  if (!roomId.trim()) return
                  onJoin(roomId)
                  setRoomId("")
                  setShowJoin(false)
                }}
                className="bg-white text-black px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition-all"
              >
                Join
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.96) translateY(8px); }
          to   { opacity: 1; transform: scale(1)    translateY(0); }
        }
      `}</style>
    </div>
  )
}

export default ActionBar