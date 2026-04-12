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
            className="group relative flex flex-col bg-zinc-900/60 border border-zinc-800/80 rounded-2xl overflow-hidden hover:border-zinc-700 hover:bg-zinc-900/80 transition-all duration-200 cursor-pointer"
            style={{ boxShadow: '0 1px 0 0 rgba(255,255,255,0.03) inset' }}
        >
            {/* Top strip */}
            <div className="flex items-center justify-between px-4 pt-4 pb-3">
                {/* File icon */}
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700/60 flex-shrink-0">
                    <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                </div>
                {/* Room code badge */}
                <span className="text-zinc-600 text-[10px] font-mono bg-zinc-800/70 px-2 py-0.5 rounded-md border border-zinc-800">
                    #{note.roomId?.slice(0, 6)}
                </span>
            </div>

            {/* Title + preview */}
            <div
                className="flex-1 px-4 pb-4"
                onClick={() => navigate(`/editor/${note.roomId}`)}
            >
                <h3 className="text-zinc-100 font-semibold text-sm mb-1.5 leading-snug line-clamp-1">
                    {note.title || 'Untitled'}
                </h3>
                <p className="text-zinc-500 text-xs leading-relaxed line-clamp-3 min-h-[3rem]">
                    {note.content || 'No content yet — click to start writing.'}
                </p>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-4 py-2.5 border-t border-zinc-800/60 bg-zinc-900/40">
                <span className="text-zinc-600 text-[10px]">
                    {timeAgo(note.updatedAt || note.createdAt)}
                </span>
                <button
                    onClick={(e) => { e.stopPropagation(); onDelete(note.roomId) }}
                    className="cursor-pointer text-[10px] text-zinc-700 hover:text-red-400 transition-colors duration-150 opacity-0 group-hover:opacity-100"
                >
                    Delete
                </button>
            </div>
        </div>
    )
}

export default NoteCard