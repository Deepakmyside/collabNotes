const express = require('express')
const { createNote, getAllNotes, getNoteById, updateNote, deleteNote} = require('../controllers/noteController')
const authMiddleware = require('../middleware/authMiddleware')
const router = express.Router()

router.post("/", authMiddleware, createNote)
router.get("/", authMiddleware, getAllNotes)
router.get("/:roomId", authMiddleware, getNoteById)
router.put("/:roomId", authMiddleware, updateNote)
router.delete("/:roomId", authMiddleware, deleteNote)

module.exports = router
