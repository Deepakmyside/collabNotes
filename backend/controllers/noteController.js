const Note = require('../models/Note')

const createNote = async (req, res) => {
       try {
           const userId = req.user?.id

        const { title, content} = req.body
        const roomId = Math.random().toString(36).substring(2, 8).toUpperCase()
       
        const note = await Note.create({
             title,
             content,
             owner: userId || null ,      /* null because new user(guest user ) can also create Note */
             collaborators: [],
             roomId
            })
         res.status(201).json({note})

    } catch (error) {
         console.error("Create Note Error", error)
         res.status(500).json({ message: 'Unable to create note'})
        }
}


const getAllNotes = async (req, res) => {
    try{
        const userId = req.user?.id
        if(!userId){
            return res.status(200).json([])
         }
         
        const note = await Note.find({
            $or: [
                { owner: userId},
                {collaborators: userId}
            ]
        })
         
        res.status(200).json(note)
    
    }catch (error) {
        console.error("Get Notes Error",error)
        res.status(500).json({message:"Unable to fetch notes"})
    }
}

const getNoteById = async (req, res) => {
    try{
        const userId = req.user?.id

        const note = await Note.findOne({ roomId: req.params.roomId})
        if(!note) {
            return res.status(404).json({ message:'Note not found or deleted '})
        }

        res.status(200).json(note)
    } catch (error) {
        console.error("Get NoteById error",error)
        res.status(500).json({message:"Unable to fetch note"})
    }
}

const updateNote = async (req, res) => {
    try {
        const userId = req.user?.id

        const note = await Note.findOne({ roomId: req.params.roomId})
        if(!note) {
            return res.status(404).json({ message: 'Note not found'})
        }
// comparing ids
// converting from object mongoid to string (jwt se compare krna h aur woh string h )
        const isOwner = note.owner?.toString() === userId
        const isCollaborator = (note.collaborators || []).map(id => id.toString()).includes(userId)

        if(!isOwner && !isCollaborator) {
            return res.status(403).json({ message: 'Access denied, Invalid Credentials'})
        }
        note.title = req.body.title || note.title
        note.content = req.body.content || note.content

        await note.save()

        res.status(200).json(note)

    } catch (error) {
        console.error("Update Note Error",error)
        res.status(500).json({message:"Unable to update note"})
    }
}

const deleteNote = async (req, res) => {
    try{
          const userId = req.user?.id

        const note = await Note.findOne({ roomId: req.params.roomId})
        if(!note) {
            return res.status(404).json({message: 'Note not found'})
        }
         const isOwner = note.owner?.toString() === userId
         if(!isOwner) {
            return res.status(403).json({ message: 'Only owner can delete this note'})
         }

         await note.deleteOne({ roomId: req.params.roomId})

         res.status(200).json({ message: "Note deleted succesfully"})

    } catch (error) {
        console.error("Delete Note Error",error)
        res.status(500).json({ message: "Unable to delete note"})
    }
}

const joinRoom = async (req, res)  => {
    try {
        const userId = req.user?.id
        const { roomId} = req.body
     
         if(!userId){
            return res.status(401).json({
                message:"Please login to join room"
            })
         }

        const note = await Note.findOne({ roomId})
        if(!note) {
            return res.status(404).json({
                message: "Room not found- check your room ID" })
        }
            const isOwner = note.owner?.toString() === userId
            const isCollaborator = (note.collaborators || []).map(id => id.toString()).includes(userId)

           if( isOwner || isCollaborator) {
            return res.status(200).json({ message: "Already in room", roomId: note.roomId})
           }

           note.collaborators.push(userId)
           await note.save()

           res.status(200).json({ message: "Joined successfully", roomId: note.roomId})
    
      }catch(error){
        console.error("Join Room Error", error);

        res.status(500).json({
            message: "Unable to join room"
        })

      }
      
}

module.exports = { createNote, updateNote, getAllNotes, getNoteById, deleteNote, joinRoom }