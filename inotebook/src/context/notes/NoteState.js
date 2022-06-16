import { useState } from "react";
import NoteContext from "./NoteContext";

const NoteState = (props) => {
    const initialNotes = [];
    const [notes, setNotes] = useState(initialNotes);
    const host = "http://localhost:5000";

    //fetch all notes function
    const fetchAllNotes = async () => {
        let authtoken = localStorage.getItem('authtoken');
        if (authtoken) {
            const response = await fetch(`${host}/api/notes/fetchallnotes`, {
                method: 'get',
                headers: {
                    'auth-token': localStorage.getItem('authtoken')
                }
            });
            const json = await response.json();
            setNotes(json);
        }
    }

    //add note function
    const addNote = async (title, description, tag) => {
        //api call
        const res = await fetch(`${host}/api/notes/addnote`, {
            method: 'post',
            headers: {
                'content-type': 'application/json',
                'auth-token': localStorage.getItem('authtoken')
            },
            body: JSON.stringify({ title, description, tag })
        });
        let json = await res.json();
        setNotes(notes.concat(json.savedNote));
        return json;
    }

    //delete note function
    const deleteNote = async (id) => {
        //api call
        const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
            method: 'DELETE',
            headers: {
                'content-type': 'application/json',
                'auth-token': localStorage.getItem('authtoken')
            }
        });
        let json = await response.json();
        const newNotes = notes.filter((note) => { return note._id !== id })
        setNotes(newNotes);
        return json;
    }

    //edit note function
    const editNote = async (id, title, description, tag) => {
        //api call
        const res = await fetch(`${host}/api/notes/updatenote/${id}`, {
            method: 'PUT',
            headers: {
                'content-type': 'application/json',
                'auth-token': localStorage.getItem('authtoken')
            },
            body: JSON.stringify({ title, description, tag })
        });
        let json = await res.json();

        let newNotes = JSON.parse(JSON.stringify(notes));

        for (let i = 0; i < newNotes.length; i++) {
            const element = newNotes[i];
            if (element._id === id) {
                newNotes[i].title = title;
                newNotes[i].description = description;
                newNotes[i].tag = tag;
                break;
            }
        }
        setNotes(newNotes);
        return json;
    }

    return (
        <NoteContext.Provider value={{ notes, addNote, deleteNote, editNote, fetchAllNotes }}>
            {props.children}
        </NoteContext.Provider>
    )
}

export default NoteState;