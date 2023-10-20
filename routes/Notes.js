const express = require('express');
const { query, validationResult, body } = require("express-validator");
const fetchUser = require('../middlewares/fetchuser');
const notes = require('../models/notes');
const router = express.Router();

router.get('/fetchNote', fetchUser, async (req, res) => {
     try {
          console.log(users);
          let userId = await users.id;


          let fetched_Notes = await notes.find({ user: userId });
          res.send(fetched_Notes);


     } catch (error) {
          console.log("Here is error occured in fetching notes" + error);

          res.status(500).send("Code have some issues in fetching notes part.....");

     }
})
router.post('/addNote', fetchUser, [
     body("title", "Title must not be that much smaller").isLength({ max: 20 }),
     body("Description", "Description must not be that much smaller").isLength({ max: 256 }),], async (req, res) => {
          try {

               const result = validationResult(req);

               if (!result.isEmpty()) {
                    res.status(400).json({ errors: result.array() });
               } else {
                    userId = await users.id;
                    console.log(userId)
                    let { title, Description, tags } = req.body;

                    let note = await new notes({
                         title, Description, tags, user: userId
                    })
                    let savedNote = await note.save();
                    res.json(savedNote);
               }


          } catch (error) {
               console.log("Here is error occured in Adding notes" + error);

               res.status(500).send("Code have some issues in Adding notes part.....");

          }
     })

router.put('/updateNote/:id', fetchUser, [
     body("title", "Title must not be that much smaller").isLength({ max: 20 }),
     body("Description", "Description must not be that much smaller").isLength({ max: 256 }),], async (req, res) => {
          try {

               const result = validationResult(req);

               if (!result.isEmpty()) {
                    res.status(400).json({ errors: result.array() });
               } else {
                    userId = await users.id;
                    let { title, Description, tags } = req.body;
                    let newNote = {};
                    if (title) {
                         newNote.title = title;

                    }
                    if (Description) {
                         newNote.Description = Description;
                    }
                    if (tags) {
                         newNote.tags = tags;
                    }
                    let note = await notes.findById(req.params.id);
                    console.log(note)
                    if (!note) {
                         res.status(404).send("note with that id not found.....");
                    }
                    else {
                         console.log(note.user.toString())
                         if (note.user.toString() !== userId) {
                              res.status(404).send("Not Allowed........");
                         }
                         else {
                              let updated_Note = await notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
                              res.json(updated_Note);

                         }
                    }


               }


          } catch (error) {
               console.log("Here is error occured in updating notes" + error);

               res.status(500).send("Code have some issues in updating notes part.....");

          }
     })
router.delete('/deleteNote/:id', fetchUser, async (req, res) => {
     try {

          const result = validationResult(req);

          if (!result.isEmpty()) {
               res.status(400).json({ errors: result.array() });
          } else {
               userId = await users.id;


               let note = await notes.findById(req.params.id);
               console.log(note)
               if (!note) {
                    res.status(404).send("note with that id not found.....");
               }
               else {

                    if (note.user.toString() !== userId) {
                         res.status(404).send("Not Allowed........");
                    }
                    else {
                         let deleted_Note = await notes.findByIdAndDelete(req.params.id);
                         res.json(deleted_Note);

                    }
               }


          }


     } catch (error) {
          console.log("Here is error occured in updating notes" + error);

          res.status(500).send("Code have some issues in updating notes part.....");

     }
})


module.exports = router;