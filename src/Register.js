import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Register() {
  const [data, setData] = useState({
    name: '',
    mail: '',
    mobileno: '',
    password: ''
  });

  const [errors, setErrors] = useState({
    name: '',
    mail: '',
    mobileno: '',
    password: ''
  });
  const naviagte = useNavigate()

  const userRegister = () => {

    axios({
      method: 'post',
      url: 'http://127.0.0.1:8000/user/add_user',
      data: {
        user_name: data.mail,
        password: data.password,
        name: data.name,
        mobile_no: data.mobileno
      }
    }).then(response => {
      console.log("Response:", response?.data?.data);
      localStorage.setItem('token', response?.data?.data?.token);
      localStorage.setItem('Roll', response?.data?.data?.role);
      naviagte('/')

    }).catch(error => {
      console.error("Error:", error);
    });
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    // value=name!='name'?value.trim():value
    setData({ ...data, [name]: value });
    if (value.trim()) {

      switch (name) {
        case 'name':
          setErrors({ ...errors, name: /^[a-zA-Z\s]+$/.test(value) ? '' : 'Name must contain only letters' });
          break;
        case 'mail':
          // You can add email validation logic here
          setErrors({ ...errors, mail: /^\S+@\S+\.\S+$/.test(value) ? '' : 'Invalid email address' });
          break;
        case 'mobileno':
          setErrors({ ...errors, mobileno: value.length === 10 && /^\d+$/.test(value) ? '' : 'Mobile number must be 10 digits' });
          break;
        case 'password':
          setErrors({ ...errors, password: value.length >= 8 && /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value.trim()) ? '' : 'Password must contain at least one letter, one number, and one special character and must be 8 characters long' });
          break;
        default:
          break;

      }
    }
  };

  const buttonDisabled = !data.name || !data.mail || !data.mobileno || !data.password || errors.name || errors.mail || errors.mobileno || errors.password;




  return (


    <div className='container '>

      <div className='card login-card'>
        <div className='card-header text-center'>
          <h4>
            <b> Register Form</b>
          </h4>
          {/* <div class="pull-right"> 
          This div floats to the right. 
      </div> */}
        </div>
        <div className='card-body'>
          <div>
            <label>Name</label>
            <input className='form-control' name='name' value={data.name} onChange={handleChange} />
            {errors.name && <span className="text-danger">{errors.name}</span>}
          </div>

          <div>
            <label>Mail I'd</label>
            <input className='form-control' name='mail' value={data.mail} onChange={handleChange} />
            {errors.mail && <span className="text-danger">{errors.mail}</span>}
          </div>

          <div>
            <label>Mobile No</label>
            <input className='form-control' name='mobileno' value={data.mobileno} onChange={handleChange} />
            {errors.mobileno && <span className="text-danger">{errors.mobileno}</span>}
          </div>

          <div>
            <label>Password</label>
            <input className='form-control' name='password' value={data.password} onChange={handleChange} />
            {errors.password && <span className="text-danger">{errors.password}</span>}

          </div>

          <div className='mt-3 d-flex justify-content-between'>
            {/* <button className='btn'>Back</button> */}
            {/* <div> */}
            <button className={` btn ${buttonDisabled ? 'disabled' : ''}`} style={{ backgroundColor: '#712ef9', color: 'white' }} onClick={userRegister}>Submit</button>

            {/* </div> */}
            {/* <div > */}
              <button type="button" class="btn" onClick={() => naviagte('/')}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-left" viewBox="0 0 16 16">
                  <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"></path>
                </svg>
              </button>

            {/* </div> */}


          </div>
        </div>

      </div>

    </div>
  )
}

export default Register