import React, { useContext, useEffect, useRef, useState } from 'react';
import NoteContext from '../context/notes/NoteContext';
import AddNote from './AddNote';
import NoteItem from './NoteItem';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const Notes = () => {
    const context = useContext(NoteContext);
    const navigate = useNavigate();
    const { notes, fetchAllNotes, editNote } = context;
    const [note, setNote] = useState({ id: "", title: "", description: "", tag: "" });

    useEffect(() => {
        //if user not logged in then do not render the notes and redirect to login page
        if (localStorage.getItem('authtoken')) {
            const temp = process.env.MONGO_URI;
            console.log(temp)
            return () => {
                fetchAllNotes();
            }
        }
        else{
            navigate('/login');
        }
    }, [])  

    const ref = useRef(null);
    const refCloseModal = useRef(null);

    const updateNote = (currentNote) => {
        //currentNote is clicked note which is coming from updateNote function which is defined in context
        ref.current.click();  //togge is bootstrap function to show or hide modal
        setNote({ id: currentNote._id, title: currentNote.title, description: currentNote.description, tag: currentNote.tag });
    }

    const onChange = (e) => {
        setNote({ ...note, [e.target.name]: e.target.value })
    }

    const clickHandler = async (e) => {
        let res = await editNote(note.id, note.title, note.description, note.tag);
        //use the flag success
        if (res.success) {
            toast.success("Note Updated", { autoClose: 1500 });
        }
        refCloseModal.current.click();
    }

    return (
        <>
            <AddNote />
            {/* bootstrap modal */}
            <button type="button" ref={ref} className="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#exampleModal">
                launch modal    {/* button is hidden with class d-none but being clicked by the ref.current.click() in updateNote function */}
            </button>

            <div className="modal fade" id="exampleModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Edit Note</h5>
                        </div>
                        <div className="modal-body">
                            {/* same form as add note in the modal body */}
                            <form className='my-3 add-note-form'>
                                <div className="row">
                                    <div className="mb-3 col">
                                        <label htmlFor="title" className="form-label">Title</label>
                                        <input type="text" className="form-control" id="title" name="title" onChange={onChange} value={note.title} aria-describedby="emailHelp" />
                                    </div>
                                    <div className="mb-3 col">
                                        <label htmlFor="tag" className="form-label">Tag</label>
                                        <input type="text" className="form-control" name="tag" id="tag" value={note.tag} onChange={onChange} />
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="description" className="form-label">Description</label>
                                    <textarea type="text" rows={6} className="form-control" name="description" value={note.description} id="description" onChange={onChange} />
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" ref={refCloseModal} className="btn btn-secondary" data-bs-dismiss="modal" >Cancel</button>
                            <button type="button" disabled={note.title.length < 3 || note.description.length < 5} className="btn btn-primary" onClick={clickHandler}>Update Note</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className='container my-5'>
                <h2>Your Notes</h2>
                <div className="all-notes row my-1">
                    <div className="container my-3 mx-3">
                        {notes.length === 0 && "no notes to display, please add some"}
                    </div>
                    {
                        Array.from(notes).map((note) => {
                            return <NoteItem key={note._id} updateNote={updateNote} note={note} />
                        })
                    }
                </div>
            </div>
        </>
    )
}

export default Notes;