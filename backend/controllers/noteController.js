const Note = require('../models/Note')
const { create } = require('../models/User')


const createNote = async (req, res) => {
       try {
        const { title, content} = req.body
        const roomId = Math.random().toString(36).substring(2, 8).toUpperCase()

        const note = await Note.create({
             title,
             content,
             owner:req.user.id,
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

        const note = await Note.find({
            $or: [
                { owner: req.user.id},
                {collaborators: req.user.id}
            ]
        })

        res.status(200).json(note)
    
    }catch (error) {
        console.errror("Get Notes Error",error)
        res.status(500).json({message:"Unable to fetch notes"})
    }
}

const getNoteById = async (req, res) => {
    try{
     
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
        const note = await Note.findOne({ roomId: req.params.roomId})
        if(!note) {
            return res.status(404).json({ message: 'Note not found'})
        }
// comparing ids
// converting from object mongoid to string (jwt se compare krna h aur woh string h )
        const isOwner = note.owner.toString() === req.user.id
        const isCollaborator = (note.collaborators || []).map(id => id.toString()).includes(req.user.id)

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
        const note = await Note.findOne({ roomId: req.params.roomId})
        if(!note) {
            return res.status(404).json({message: 'Note not found'})
        }
         const isOwner = note.owner.toString() === req.user.id
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
        const { roomId} = req.body
        const note = await Note.findOne({ roomId})
        if(!note) {
            return res.status(404).json({
                message: "Room not found- check your room ID" })
        }
            const isOwner = note.owner.toString() === req.user.id
            const isCollaborator = (note.collaborators || []).map(id => id.toString()).includes(req.user.id)

           if( isOwner || isCollaborator) {
            return res.status(200).json({ message: "Already in room", roomId: note.roomId})
           }

           note.collaborators.push(req.user.id)
           await note.save()

           res.status(200).json({ message: "Joined successfully", roomId: note.roomId})
    
      }catch(error){
        console.error("Join Room Error", error);

        res.status(500).json({
            message: "Unable to join room"
        })

      }
      
}

module.exports = { createNote, updateNote, getAllNotes, getNoteById, deleteNote }