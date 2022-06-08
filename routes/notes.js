const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const Note = require('../models/Note');
const { body, validationResult } = require('express-validator');


//ROUTE-1: get all the notes using: GET "api/notes/fetchallnotes"  -----------login required
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const note = await Note.find({ user: req.user.id });
        res.json(note);
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send("internal server error");
    }
});

//ROUTE-2: add new note using: POST "api/notes/addnote"  ----------------login required
router.post('/addnote', fetchuser, [
    body('title', 'name must be at least 3 characters long').isLength({ min: 3 }),
    body('description', 'description must be longer than 5 characters').isLength({ min: 5 })
], async (req, res) => {
    try {
        const { title, description, tag } = req.body;
        //if there are errors do not proceed further
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const note = new Note({
            title, description, tag, user: req.user.id
        })
        //.save() function returns a promise
        const savedNote = await note.save();
        res.json({ savedNote });
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send("internal server error");
    }

});

//ROUTE-3: update an existing note using: PUT "api/notes/updatenote"  ----------------login required
router.put('/updatenote/:id', fetchuser, async (req, res) => {
    try {
        const { title, description, tag } = req.body;

        //defining new note and entering the values based on if user want to update the values or not
        //i.e. if title is entered it means user want to update the title, hence we will update the title of newNote as entered title
        const newNote = {};
        if (title) { newNote.title = title };
        if (description) { newNote.description = description };
        if (tag) { newNote.tag = tag };

        //find the note to be updated and update it
        let note = await Note.findById(req.params.id);
        if (!note) {
            return res.status(404).send("Note not found");
        }
        //if logged in user is not same as the note owner then console log not allowed
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("not allowed to update");
        }

        //update the note with newNote
        note = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true });
        res.json({ note });
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send("internal server error");
    }

});

//ROUTE-4: delete an existing note using: DELETE "api/notes/deletenote"  ----------------login required
router.delete('/deletenote/:id', fetchuser, async (req, res) => {
    try {
        //find the note to be deleted and delete it
        let note = await Note.findById(req.params.id);
        if (!note) {
            return res.status(404).send("Note not found");
        }
        //if logged in user is not same as the note owner then console log not allowed
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("not allowed to update");
        }

        //delete the note
        note = await Note.findByIdAndDelete(req.params.id);
        res.json({ "Success": "Note has been deleted" });
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send("internal server error");
    }

});


module.exports = router;