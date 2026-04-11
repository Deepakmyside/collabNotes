function OnlineUsers({ users }) {
    return (
        <div className="flex items-center gap-2">
            {users.map((userId, index) => (
                <div
                    key={index}
                    className="w-7 h-7 rounded-full bg-[#333] border border-[#444] flex items-center justify-center text-xs text-white"
                    title={userId}
                >
                    {index + 1}
                </div>
            ))}
        </div>
    )
}

export default OnlineUsers