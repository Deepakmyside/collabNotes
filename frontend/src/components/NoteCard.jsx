import { useNavigate } from 'react-router-dom'

function NoteCard({ note, onDelete }) {
    const navigate = useNavigate()

    return (
        <div className="bg-[#111] border border-[#222] rounded-xl p-5 hover:border-[#444] transition-all cursor-pointer">
            <div onClick={() => navigate(`/editor/${note.roomId}`)}>
                <h3 className="text-white font-medium mb-2">{note.title}</h3>
                <p className="text-gray-500 text-sm line-clamp-2">
                    {note.content || 'Empty note...'}
                </p>
            </div>
            <div className="flex justify-end mt-4">
                <button
                    onClick={() => onDelete(note.roomId)}
                    className="text-gray-600 text-xs hover:text-red-500 transition-all"
                >
                    Delete
                </button>
            </div>
        </div>
    )
}

export default NoteCard