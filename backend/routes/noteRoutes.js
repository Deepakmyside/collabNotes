const express = require('express')
const { createNote, getAllNotes, getNoteById, updateNote, deleteNote} = require('../controllers/noteController')
const authMiddleware = require('../middleware/authMiddleware')
const router = express.Router()

router.post("/", authMiddleware.optionalAuth, createNote)
router.get("/", authMiddleware.requireAuth, getAllNotes)
router.get("/:roomId", authMiddleware.requireAuth, getNoteById)
router.put("/:roomId", authMiddleware.requireAuth, updateNote)
router.delete("/:roomId", authMiddleware.requireAuth, deleteNote)

module.exports = router
