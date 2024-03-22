import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "./style1.css"

function SamLogin() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [status, SetStatus] = useState();

  const login = () => {
    axios
      .post('http://127.0.0.1:8000/user/login', {
        username: userName,
        password: password
      })
      .then(response => {
        localStorage.setItem('token', response?.data?.data?.token);
        localStorage.setItem('role', response?.data?.data?.role);
        navigate('/dashboard');
      })
      .catch(error => {
        setError(true);
      });
  };

  return (
    <div className='container'>
      <div className='login-card'>
        <div className='card-header'>
          <h4>Login</h4>
        </div>
        <div className='card-body'>
          {error && (
            <div className='text-danger'>
              <b>Invalid Credential</b>
            </div>
          )}
          <label>Username</label>
          <input
            className='form-control'
            type='text'
            value={userName}
            onChange={e => setUserName(e.target.value)}
          />
          <label>Password</label>
          <div className='input-group'>
            <input
              className='form-control eye_part'
              type='password'
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <button className='btn btn-secondary' onClick={() => SetStatus(!status)}>
              Toggle
            </button>
          </div>
          <div className='mt-3'>
            <button
              className='btn btn-primary btn-block'
              disabled={!userName || !password}
              onClick={login}
            >
              Sign In
            </button>
            <div>
              <a href='/register'>Sign up</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SamLogin;
