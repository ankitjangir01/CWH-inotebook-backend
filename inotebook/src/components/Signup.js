import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const host = "http://localhost:5000";

const Signup = () => {

    const [credentials, setCredentials] = useState({ name: "", email: "", password: "" });
    const navigate = useNavigate();

    const onChange = (event) => {
        setCredentials({ ...credentials, [event.target.name]: event.target.value });
    }

    const handleSignupBtn = async (e) => {
        e.preventDefault();
        //hit the api for creating new user
        const response = await fetch(`${host}/api/auth/createuser`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify({ name: credentials.name, email: credentials.email, password: credentials.password }),
        });
        let json = await response.json();
        if (json.success) {
            toast.success("Account Created", {autoClose: 1500});
            navigate('/', { replace: true });
        }
        else {
            console.log("sign up failed");
        }
    }

    return (
        <div className='container my-5 w-50 mx-auto'>
            <h2>Create an account on iNotebook</h2>
            <form onSubmit={handleSignupBtn} className='my-5'>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Full name</label>
                    <input type="text" name="name" className="form-control" id="name" onChange={onChange} value={credentials.name} minLength={3} required />
                </div>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input type="email" name="email" className="form-control" id="email" onChange={onChange} value={credentials.email} aria-describedby="emailHelp" required />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" name="password" className="form-control" id="password" onChange={onChange} value={credentials.password} minLength={5} required />
                </div>
                <div className="mb-3">
                    <label htmlFor="cpassword" className="form-label">Confirm Password</label>
                    <input type="password" name="cpassword" className="form-control" id="cpassword" onChange={onChange} required />
                </div>
                <button type="submit" className="btn btn-primary">Sign Up</button>
            </form>
        </div>
    )
}

export default Signup