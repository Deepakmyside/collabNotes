import { useState } from "react"

function ActionBar({ onCreate, onJoin }) {
  const [title, setTitle] = useState("")
  const [roomId, setRoomId] = useState("")
  const [showCreate, setShowCreate] = useState(false)
  const [showJoin, setShowJoin] = useState(false)

  return (
    <div className="mb-8 flex gap-3">
      
      {/* New Note Button */}
      <button
        onClick={() => setShowCreate(true)}
        className="bg-white text-black px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-200 transition-all"
      >
        + New Note
      </button>

      {/* Join Note Button */}
      <button
        onClick={() => setShowJoin(true)}
        className="bg-[#111] border border-[#222] px-5 py-2.5 rounded-lg text-sm text-white hover:border-gray-500 transition-all"
      >
        Join Note
      </button>

      {/* Create Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-[#111] p-6 rounded-xl w-[90%] max-w-sm border border-[#222]">
            
            <h3 className="text-lg font-semibold mb-4">Create New Note</h3>

            <input
              type="text"
              placeholder="Enter note title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-[#222] px-4 py-2.5 rounded-lg text-sm mb-4 outline-none focus:border-gray-500"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowCreate(false)}
                className="text-gray-400 text-sm hover:text-white"
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
                className="bg-white text-black px-4 py-2 rounded-lg text-sm hover:bg-gray-200"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Join Modal */}
      {showJoin && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-[#111] p-6 rounded-xl w-[90%] max-w-sm border border-[#222]">
            
            <h3 className="text-lg font-semibold mb-4">Join Note</h3>

            <input
              type="text"
              placeholder="Enter note code..."
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-[#222] px-4 py-2.5 rounded-lg text-sm mb-4 outline-none focus:border-gray-500"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowJoin(false)}
                className="text-gray-400 text-sm hover:text-white"
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
                className="bg-white text-black px-4 py-2 rounded-lg text-sm hover:bg-gray-200"
              >
                Join
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default ActionBar