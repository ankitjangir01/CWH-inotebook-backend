import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const loc = useLocation();
  const [userDetails, setUserDetails] = useState({ name: "", email: "", since: "" });
  const navigate = useNavigate();

  const getUserDetails = async () => {
    const res = await fetch(`/api/auth/getuser`, {
      method: 'POST',
      headers: {
        'auth-token': localStorage.getItem('authtoken'),
      }
    });
    let json = await res.json();
    let t = new Date(json.user.date);
    setUserDetails({
      name: json.user.name,
      email: json.user.email,
      since: t.toLocaleDateString()
    })
  }

  const logOut = () => {
    let res = window.confirm("You are about to logout");
    if(res){
      navigate('/login', {replace: true});
      localStorage.removeItem('authtoken');
    }
  }

  const getAuthButtons = () => {
    //if user is logged in, show profile else show login and signup buttons
    if (localStorage.getItem('authtoken')) {
      return (
        <div className="btn-group">
          <button type="button" onClick={getUserDetails} className="btn btn-secondary dropdown-toggle btn-sm" data-bs-toggle="dropdown" data-bs-display="static" aria-expanded="false">
            My Profile
          </button>
          <ul className="dropdown-menu dropdown-menu-lg-end">
            <li className="p-2 mx-2 text-nowrap"><strong>Name: {userDetails.name}</strong></li>
            <li className="p-2 mx-2 text-nowrap">Email: {userDetails.email}</li>
            <li className="p-2 mx-2 text-nowrap">Member since: {userDetails.since}</li>
            <li className="dropdown-item" onClick={logOut}>Logout</li>
          </ul>
        </div>
      )
    }
    else {
      return (
        <form className="d-flex">
          <Link type="button" to='/login' className="btn btn-outline-primary mx-1 btn-sm">Login</Link>
          <Link type="button" to='/signup' className="btn btn-outline-primary mx-1 btn-sm">Sign Up</Link>
        </form>
      );
    }
  }

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark navbar-sticky">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">iNotebook</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className={`nav-link ${loc.pathname === '/' ? "active" : ""}`} aria-current="page" to="/">Home</Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link ${loc.pathname === '/about' ? "active" : ""}`} to="/about">About</Link>
              </li>
              <li className="nav-item dropdown">
                <Link className="nav-link dropdown-toggle" to="/" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  Dropdown
                </Link>
                <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                  <li><Link className="dropdown-item" to="/">Action</Link></li>
                  <li><Link className="dropdown-item" to="/">Another action</Link></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li><Link className="dropdown-item" to="/">Something else here</Link></li>
                </ul>
              </li>
            </ul>
            {getAuthButtons()}
          </div>
        </div>
      </nav>
    </>
  )
}

export default Navbar