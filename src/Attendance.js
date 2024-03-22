import axios from 'axios'
import React, { useEffect, useState } from 'react'
import "./style.css"
import DataTable from 'react-data-table-component';


function Attendance() {

	const [attendanceDetails, setAttendanceDetails] = useState()
	const token = localStorage.getItem("token")

	useEffect(() => {
		getData()
	}, [])

	const getData = () => {
		axios({
			method: "GET",
			url: 'http://127.0.0.1:8000/attendance/get_attendance',
			headers: {
				"Content-Type": "application/json",
				'Authorization': `bearer ${token}`
			},

		}).then(res => {
			console.log("res", res.data);
			setAttendanceDetails(res.data)
		}).catch((error) => {
			console.log("Error", error);
		})
	}

	const customStyles = {
		headCells: {
			style: {
				fontWeight: '501',
				fontSize: '15px',
				color: 'Blue'
			},
		},
		cells: {
			style: {
				fontSize: '12px',

			},
		},
	};

	const columns = [

		{
			name: 'Name',
			selector: row => row?.name,
			sortable: true,
		},
		{
			name: 'Roll Number',
			selector: row => row?.roll_no,
			sortable: true,
		},
		{
			name: 'Date',
			selector: row => row?.date,
			sortable: true,
		},
		{
			name: 'Time',
			selector: row => row?.time,
			sortable: true,
		},

		// {
		// name: 'Action',
		// selector: row => row,
		// sortable: true,
		// },


	];

	const OpenCamera = () => {
		axios({
			method: 'POST',
			url: 'http://127.0.0.1:8000/attendance/add_attendance/',
			// data:{
			// 'flag':true
			// }

		}).then(res => {
			console.log("res - att", res?.data);
			getData()
		})
	}
	const closeCamera = () => {
		axios({
			method: 'POST',
			url: 'http://127.0.0.1:8000/attendance/stop_loop/',
			// data:{
			// 'flag':true
			// }

		}).then(res => {
			console.log("res - att", res?.data);
			getData()
		})
	}

	const role = localStorage.getItem('role');
	return (
		<div className='mt-4 card custum_content'>
			<div className='card-body p-0'>
				<DataTable
					pagination
					columns={columns}
					customStyles={customStyles}
					data={attendanceDetails}
				/>



			</div>
			{role == 1 &&
				<div className='card-footer'>
					<button className='btn btn-primary me-2' onClick={OpenCamera}>Start</button>
				</div>
			}

		</div>
	)
}

export default Attendance
