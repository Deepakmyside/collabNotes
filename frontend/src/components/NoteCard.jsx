import { useNavigate } from 'react-router-dom'

function NoteCard({ note, onDelete }) {
    const navigate = useNavigate()

    return (
        <div className="group relative bg-zinc-900/50 border border-zinc-800 rounded-xl p-5 hover:border-zinc-600 hover:bg-zinc-900 transition-all duration-200 cursor-pointer">
            {/* Subtle hover glow */}
            <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{ boxShadow: 'inset 0 0 0 1px rgba(161,161,170,0.08)' }} />

            <div onClick={() => navigate(`/editor/${note.roomId}`)}>
                <h3 className="text-zinc-100 font-medium text-sm mb-2 leading-snug truncate">
                    {note.title || 'Untitled'}
                </h3>
                <p className="text-zinc-500 text-xs leading-relaxed line-clamp-3">
                    {note.content || 'Empty note…'}
                </p>
            </div>

            <div className="flex items-center justify-between mt-5 pt-3 border-t border-zinc-800/80">
                <span className="text-zinc-600 text-xs font-mono">
                    {note.roomId?.slice(0, 8)}…
                </span>
                <button
                    onClick={() => onDelete(note.roomId)}
                    className="text-zinc-600 text-xs hover:text-red-400 transition-colors duration-150 opacity-0 group-hover:opacity-100"
                >
                    Delete
                </button>
            </div>
        </div>
    )
}

export default NoteCard