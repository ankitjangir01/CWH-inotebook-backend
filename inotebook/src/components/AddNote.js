import React, { useContext, useState } from 'react';
import NoteContext from '../context/notes/NoteContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddNote = () => {
    const context = useContext(NoteContext);
    const { addNote } = context;
    const [note, setNote] = useState({ title: "", description: "", tag: "" });

    const onChange = (e) => {
        setNote({ ...note, [e.target.name]: e.target.value })
    }

    const clickHandler = async (e) => {
        e.preventDefault();
        const res = await addNote(note.title, note.description, note.tag);
        if(res.success){
            toast.success("Note added", {autoClose: 1500});
        }
        setNote({title: "", description: "", tag: ""});
    }

    return (
        <div>
            <h2>Add New Note</h2>
            <form className='my-5 add-note-form'>
                <div className="row">
                    <div className="mb-3 col">
                        <label htmlFor="title" className="form-label">Title</label>
                        <input type="text" className="form-control" id="title" name="title" onChange={onChange} value={note.title} aria-describedby="emailHelp" />
                    </div>
                    <div className="mb-3 col">
                        <label htmlFor="tag" className="form-label">Tag</label>
                        <input type="text" className="form-control" name="tag" id="tag" onChange={onChange} value={note.tag} />
                    </div>
                </div>
                <div className="mb-3">
                    <label htmlFor="description" className="form-label">Description</label>
                    <textarea type="text" rows={6} className="form-control" name="description" id="description" onChange={onChange} value={note.description} />
                </div>
                <button type="submit" disabled={note.title.length < 3 || note.description.length < 5} className="btn btn-primary" onClick={clickHandler}>Add Note</button>
            </form>
        </div>
    )
}

export default AddNote