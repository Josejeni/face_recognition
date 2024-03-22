import React, { useState,useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';


function Dashboard() {
  const [selectedItem, setSelectedItem] = useState('dashboard')
  const navigate = useNavigate()
	const token = localStorage.getItem("token")
	const userName = localStorage.getItem("userName")

  
  useEffect(()=>{
    if(!token){
      navigate('/')
    }
  },[])


  return (
    <>
    <div className='dashboard-header p-2'>
    <header>Welcome </header>
    </div>
      <div className='img'>
      </div>
    </>


  );
}

export default Dashboard;
