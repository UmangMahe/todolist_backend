const express = require('express')
const router = express.Router();
const auth = require('../../../../middleware/auth');
const ErrorHandler = require('../../../../errors/ErrorHandler');
const NotesMaster = require('../../../../models/NotesMaster');
const Notes = require('../../../../models/Notes');

// @desc    Get Notes
// @route   GET /api/notes

router.get('/', [auth.verifyToken, auth.verifyUser], async (req, res) => {

    const { id } = req.user;
    try {
        await NotesMaster.findOneAndUpdate({ userId: id }, {}, { upsert: true, new: true }).populate({
            path: 'notes',
            select: { title: 1, createdAt: 1, updatedAt: 1 }
        }).then(data => {
            const { userId, ...notesInfo } = data.toObject()
            return res.status(200).json({
                message: 'All Notes',
                notes: notesInfo.notes
            })
        })
    }
    catch (err) {
        const message = ErrorHandler(err)
        return res.status(400).send(message)
    }
})

// @desc    Add a Note
// @route   PUT /api/notes/add

router.put('/add', [auth.verifyToken, auth.verifyUser], async (req, res) => {

    const { note } = req.fields
    if (!note) return res.status(400).send({
        error: 'Please input a Note'
    })

    const { id } = req.user;
    try {
        await NotesMaster.findOneAndUpdate({ userId: id }, {}, { upsert: true, new: true }).then(async notesMaster => {
            if (notesMaster) {
                const { _id } = notesMaster
                await Notes.create({
                    notesMasterId: _id,
                    title: note
                }).then(async note => {
                    await NotesMaster.findOneAndUpdate({ userId: id }, { $push: { notes: note._id } }).then(_ => {
                        const { notesMasterId, ...noteInfo } = note.toObject()
                        return res.status(200).json({
                            message: 'Added note successfully',
                            note: noteInfo
                        })
                    })
                })
            }
        })
    }

    catch (err) {
        const message = ErrorHandler(err)
        return res.status(400).send(message)
    }



})

// @desc    Edit a Note
// @route   PATCH /api/notes/edit?id=

router.patch('/edit', [auth.verifyToken, auth.verifyUser], async (req, res) => {

    const {id: noteId} = req.query
    const { title } = req.fields

    if (!title) return res.status(400).send({
        error: 'Please input a Note'
    })
    if (!noteId) return res.status(400).send({
        error: 'Please enter Note Id'
    })

    const { id } = req.user;

    try {
        await NotesMaster.findOne({ $and: [{ notes: { "$in": noteId } }, { userId: id }] }).then(async data => {
            if (data) {
                const { _id } = data
                await Notes.findOneAndUpdate({ $and: [{ _id: noteId }, { notesMasterId: _id }] }, { title }, { new: true }).then(updated => {
                    const {notesMasterId, ...noteInfo} = updated.toObject()
                    return res.status(200).json({
                        message: 'Note Updated',
                        note: noteInfo
                    })
                })
            }
            else {
                return res.status(400).json({
                    message: 'Note not found'
                })
            }
        })
    }
    catch (err) {
        const message = ErrorHandler(err)
        return res.status(400).send(message)
    }
})

// @desc    Delete a Note
// @route   DELETE /api/notes/delete?id=

router.delete('/delete', [auth.verifyToken, auth.verifyUser], async(req, res)=>{
    const {id}= req.user
    const {id: noteId} = req.query

    if (!noteId) return res.status(400).send({
        error: 'Please enter Note Id'
    })

    try {
        await NotesMaster.findOne({ $and: [{ notes: { "$in": noteId } }, { userId: id }] }).then(async data => {
            if (data) {
                const { _id } = data
                await Notes.findOneAndDelete({_id: noteId}).then(async deleted => {
                    if(deleted){
                        const {notesMasterId, ...noteInfo} = deleted.toObject()
                        await NotesMaster.findByIdAndUpdate(_id, {$pull: {notes: deleted._id}}, {new: true}).then(_=>{
                            return res.status(200).json({
                                message: 'Note Deleted',
                                note: noteInfo
                            })
                        })
                    }
                    else return res.status(400).json({
                        message: 'Error deleting note'
                    })
                })
            }
            else {
                return res.status(400).json({
                    message: 'Note not found'
                })
            }
        })
    }
    catch (err) {
        const message = ErrorHandler(err)
        return res.status(400).send(message)
    }

})


module.exports = router