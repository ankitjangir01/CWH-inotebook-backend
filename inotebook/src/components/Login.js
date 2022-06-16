import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const host = "http://localhost:5000";

const Login = () => {

    const [credentials, setCredentials] = useState({ email: "", password: "" });
    let navigate = useNavigate();   //react-router-dom useNavigate hook to redirect to pages

    const handleLoginBtn = async (e) => {
        e.preventDefault();
        //api call to login
        const response = await fetch(`${host}/api/auth/login`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: await JSON.stringify({ email: credentials.email, password: credentials.password })
        });
        let json = await response.json();
        if (json.success) {
            //if login success then save the auth token and redirect
            localStorage.setItem('authtoken', json.authToken);
            toast.success("Login Success", { autoClose: 1500 });
            navigate('/', { replace: true });     //navigate to '/', replace true replaces the page with specified one, it means we can not go back to login page
        }
        else {
            toast.error("Invalid User", { autoClose: 1500 });
        }
    }

    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value })
    }

    return (
        <div className="container my-5 w-50 mx-auto">
            <h2>Login to your account</h2>
            <p>or sign up if you haven't yet</p>
            <div className='my-5'>
                {/* login form */}
                <form onSubmit={handleLoginBtn}>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email address</label>
                        <input type="email" name="email" className="form-control col-6" id="email" onChange={onChange} value={credentials.email} aria-describedby="emailHelp" />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input type="password" name="password" className="form-control" id="password" onChange={onChange} value={credentials.password} />
                    </div>
                    <button type="submit" className="btn btn-primary">Login</button>
                </form>
            </div>
        </div>
    )
}

export default Login