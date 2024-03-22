import React, { useEffect, useState } from 'react'
import "./style.css"
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function Login() {
	const naviagte=useNavigate()
	const[userName,setUserName]=useState()
	const[password,setPassword]=useState()
	const [status,SetStatus]=useState(true)
	const [error,setError]=useState()

	useEffect(()=>{
		console.log("hi");

	},[])

	const login =()=>{
		console.log(userName,password);
		axios({
			method: 'post',
			url: 'http://127.0.0.1:8000/user/login', 
			data: {
				username: userName, 
				password: password
			}
			}).then(response => {
				console.log("Response:", response);
				localStorage.setItem('token', response?.data?.data?.token);
				localStorage.setItem('role', response?.data?.data?.role);
				localStorage.setItem('userName', response?.data?.data?.name);

				naviagte('/dashboard')

			}).catch(error => {
				console.error("Error:", error);
				setError(true)
			});
	}


	return (
<div className='container'>
	<div className='card login-card'>
		<div className='card-header d-flex justify-content-center'><h4>Login</h4></div>
		<div className='card-body'>
			{error&&<div className='text-center'><span className='text-danger'><b>Invalid Credential</b> </span></div>}
			<label><i>Username</i></label>
			<input className='form-control form-group' onChange={(e) => setUserName(e.target.value)} />
			<label><i>Password</i></label>
			<div className='input-group'>
				<input name='password' type={status ? 'password' : 'text'} className='form-control eye_part' onChange={(e) => setPassword(e.target.value)} />
				<button style={{ color:'black',borderColor:'#712ef9'}} onClick={() => SetStatus(!status)} className='btn'>
					{!status ?
						<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className={"bi bi-slash"} viewBox="0 0 16 16">
							<path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z" />
							<path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0" />
						</svg> :
						<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-slash" viewBox="0 0 16 16">
							<path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7 7 0 0 0-2.79.588l.77.771A6 6 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755q-.247.248-.517.486z" />
							<path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829" />
							<path d="M3.35 5.47q-.27.24-.518.487A13 13 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7 7 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12z" />
						</svg>}
				</button>
			</div>
			<div className='mt-3 text-center'>
	<button className={`btn mb-2 ${userName&&password?'':'disabled'}`} style={{ backgroundColor: '#712ef9', color: 'white' }} onClick={login}>Sign In</button>
	<div>
		<a href='/register'>Sign up</a>
	</div>
</div>
	</div>
	</div>
</div>

	)
}

export default Login
