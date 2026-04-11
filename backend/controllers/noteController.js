const Note = require('../models/Note')
const { create } = require('../models/User')


const createNote = async (req, res) => {
       try {
        const { title, content} = req.body
        const roomId = `room_${Date.now()}_${Math.floor(Math.random() * 10000)}`

        const note = await Note.create({
             title,
             content,
             owner:req.user.id,
             collaborators: [],
             roomId
            })
         res.status(201).json({note})

    } catch (error) {
         console.log(error)
         res.status(500).json({ message: 'Server error', error})
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
        console.log(error)
        res.status(500).json({message:"Server error", error})
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
        console.log(error)
        res.status(500).json({message: 'Server error', error})
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
        console.log(error)
        res.status(500).json({message: "Server error", error})
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
        console.log(error)
        res.status(500).json({ message: 'Server error', error})
    }
}

module.exports = { createNote, updateNote, getAllNotes, getNoteById, deleteNote }