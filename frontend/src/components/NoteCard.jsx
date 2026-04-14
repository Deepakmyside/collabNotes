import { useNavigate } from 'react-router-dom'

function NoteCard({ note, onDelete }) {
    const navigate = useNavigate()

    const timeAgo = (dateStr) => {
        if (!dateStr) return ''
        const diff = Date.now() - new Date(dateStr).getTime()
        const m = Math.floor(diff / 60000)
        if (m < 1) return 'just now'
        if (m < 60) return `${m}m ago`
        const h = Math.floor(m / 60)
        if (h < 24) return `${h}h ago`
        return `${Math.floor(h / 24)}d ago`
    }

    return (
        <div
            className="group relative flex flex-col bg-surface-2 border border-edge rounded-2xl overflow-hidden hover:border-ink-2  transition-all duration-200 cursor-pointer"
            style={{ boxShadow: '0 1px 0 0 rgba(28,25,23,0.04) inset' }}
        >
            {/* Top strip */}
            <div className="flex items-center justify-between px-4 pt-4 pb-3">
                {/* File icon */}
              
                {/* Room code badge */}
                <span className="text-ink-3 text-[10px] font-mono bg-surface px-2 py-0.5 rounded-md border border-edge">
                    #{note.roomId?.slice(0, 6)}
                </span>
            </div>

            {/* Title + preview */}
            <div
                className="flex-1 px-4 pb-4"
                onClick={() => navigate(`/editor/${note.roomId}`)}
            >
                <h3 className="text-ink font-semibold text-sm mb-1.5 leading-snug line-clamp-1">
                    {note.title || 'Untitled'}
                </h3>
                <p className="text-ink text-xs leading-relaxed line-clamp-3 min-h-[3rem]">
                    {note.content || 'No content yet — click to start writing.'}
                </p>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-4 py-2.5 border-t border-edge bg-surface-2">
                <span className="text-ink-3 text-[10px]">
                    {timeAgo(note.updatedAt || note.createdAt)}
                </span>
                <button
                    onClick={(e) => { e.stopPropagation(); onDelete(note.roomId) }}
                    className="cursor-pointer text-[10px] text-ink-3 hover:text-red-500 transition-colors duration-150 opacity-0 group-hover:opacity-100"
                >
                    Delete
                </button>
            </div>
        </div>
    )
}

export default NoteCard