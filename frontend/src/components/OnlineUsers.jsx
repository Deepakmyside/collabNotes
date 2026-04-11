function OnlineUsers({ users }) {
    return (
        <div className="flex items-center gap-2 text-gray-400 text-sm">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span>{users} online</span>
        </div>
    )
}

export default OnlineUsers