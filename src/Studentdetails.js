import axios from 'axios'
import React, { useEffect, useState } from 'react'
import "./style.css"
import DataTable from 'react-data-table-component';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';


function Studentdetails() {

	const [studentDetails, setStudentDetails] = useState()
	const [data, setData] = useState({ name: '', year: "", dept: '', file: '', roll_no: '' })
	const token = localStorage.getItem("token")
	const role = localStorage.getItem('role');
	const [search, setSearch] = useState([''])
	const navigate = useNavigate()

	const fd = new FormData();

	useEffect(() => {
		if (!token) {
			navigate('/')
		}
		else {
			StudentList()
		}

	}, [search])


	const StudentList = () => {
		const url = search == '' ? 'get_stdents' : `student_search/${search}`

		axios({
			method: "GET",
			url: 'http://127.0.0.1:8000/student/' + url,
			headers: {
				"Content-Type": "application/json",
				'Authorization': `bearer ${token}`
			},

		}).then(res => {
			console.log("res", res.data);
			setStudentDetails(res.data)
		}).catch((error) => {
			setStudentDetails()
			console.log("Error", error);
		})
	}

	const deleteStudent=(id)=>{

		Swal.fire({
			title: 'Are you sure to delete?',
			toast:true,
			showCancelButton: true,
			icon:'warning',
			confirmButtonText: 'yes',
			denyButtonText: 'Cancel', 
			confirmButtonColor: '#006eff',
			reverseButtons: true
		  }).then((result) => {
			if (result.isConfirmed) {
			  axios({
				method: "Delete",
				url: 'http://127.0.0.1:8000/student/delete_student/'+id,
				headers: {
					"Content-Type": "application/json",
					'Authorization': `bearer ${token}`
				},
	
			}).then(res => {
				console.log("res", res.data);
				StudentList()
			}).catch((error) => {
				console.log("Error", error);
			})
			}})
		
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
			name: 'Year',
			selector: row => row?.year,
			sortable: true,
		},
		{
			name: 'Department',
			selector: row => row?.dept,
			sortable: true,
		},

		{
			name: 'Image',
			selector: row => (<>
				<div
				// className="image_preview"
				>
					<img src={row.img_url} alt='preview' className="image_preview"
					// style={{ cursor: 'pointer' }}
					/>
				</div>

			</>),
			sortable: true,
		},
		{
			name: "Action",
			selector: row => (<>
				<button className='btn text-danger' onClick={()=>deleteStudent(row?.roll_no)}>
					<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
						<path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
						<path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
					</svg>
				</button>
			</>)
		}


	];

	const [errors, setErrors] = useState()

	const AddData = () => {
		console.log("file", data);
		// fd.append(('name':data.name,'roll_no':data.roll_no,'year':data.year,'dept':data.dept,'file':data.file[0])
		fd.append('name', data.name)
		fd.append('roll_no', data.roll_no)
		fd.append('year', data.year)
		fd.append('dept', data.dept)

		fd.append('file', data.file[0])
		console.log("data", fd);

		axios({
			method: 'Post',
			url: 'http://127.0.0.1:8000/student/add_student',
			data: fd
		}).then(res => {
			console.log("res-ad stu", res);
			StudentList()
			document.getElementById('modal-close').click()
		})
	}


	const handleInputChange = (e, fieldName) => {
		const { value } = e.target;
		if (fieldName == 'file') {
			setData({ ...data, [fieldName]: e.target.files })
		} else {
			setData({ ...data, [fieldName]: value });

		}

		// Clear error message when user starts typing
		setErrors({ ...errors, [fieldName]: '' });

		// Perform validation based on the field name
		switch (fieldName) {
			case 'name':
				if (!/^[a-zA-Z\s]+$/.test(value.trim())) {
					setErrors({ ...errors, name: 'Name must contain only letters' });
				}
				break;
			case 'roll_no':
				if (/\s/.test(value.trim())) {
					setErrors({ ...errors, roll_no: 'Roll number cannot contain spaces' });
				}
				break;
			case 'year':
				if (!/^\d+$/.test(value.trim())) {
					setErrors({ ...errors, year: 'Year must contain only integers' });
				}
				break;
			case 'dept':
				if (!/^[a-zA-Z]+$/.test(value.trim())) {
					setErrors({ ...errors, dept: 'Department must contain only letters' });
				}
				break;
			case 'file':
				if (!value || !value[0]) {
					setErrors({ ...errors, file: 'Please select an image' });
				}
				break;
			default:
				break;
		}
	};

	const buttonDisabled = !data.name || !data.year || !data.dept || !data.file || errors.name || errors.year || errors.file || errors.roll_no;

	return (
		<div className='m-4'>


			<div className='d-flex justify-content-end mb-2'>
				<div className='me-2'>
					<input className='form-control' placeholder='Search' onChange={(e) => setSearch(e.target.value)} />
				</div>
				<div>{role == 1 &&
					<button className='btn btn-success' data-bs-toggle="modal" data-bs-target="#registerForm" >Add</button>
				}
				</div>
			</div>

			<div className='card custum_content'>
				<div className='card-body p-0'>
					<DataTable
						pagination
						columns={columns}
						customStyles={customStyles}
						data={studentDetails}
					/>
				</div>
			</div>

			{/* <div className="modal fade" id='registerForm' tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
				<div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-zoom">
					<div className="modal-content">
						<div className="modal-header">
							<h5 className="modal-title" id="exampleModalLabel">Student Register</h5>
							<button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
						</div>
						<div className="modal-body ">
							<label>Name</label>
							<input type='text' id='name' className='form-control' onChange={(e) => setData({ ...data, 'name': e.target.value })}></input>
							<label>Roll Number</label>
							<input type='text' className='form-control' id='roll_no' onChange={(e) => setData({ ...data, 'roll_no': e.target.value })}></input>
							<label>Year</label>
							<input type='text' className='form-control' id='year' onChange={(e) => setData({ ...data, 'year': e.target.value })}></input>
							<label>Department</label>
							<input type='text' className='form-control' id='dept' onChange={(e) => setData({ ...data, 'dept': e.target.value })}></input>
							<label>Image</label>
							<input type='file' className='form-control' id='file' onChange={(e) => setData({ ...data, 'file': e.target.files })}></input>
						</div>
						<div className='modal-footer'>
							<button className='btn btn-success' onClick={AddData}>Submit</button>
						</div>
					</div>
				</div>
			</div> */}
			<div className="modal fade" id='registerForm' tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
				<div className="modal-dialog modal-small modal-dialog-centered modal-dialog-zoom">
					<div className="modal-content">
						<div className="modal-header">
							<h5 className="modal-title" id="exampleModalLabel">Student Register</h5>
							<button type="button" id='modal-close' className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
						</div>
						<div className="modal-body">
							<div className="">
								<label htmlFor="name" className="form-label">Name</label>
								<input type="text" id="name" className={`form-control ${errors?.name && 'is-invalid'}`} onChange={(e) => handleInputChange(e, 'name')} />
								{errors?.name && <div className="invalid-feedback">{errors?.name}</div>}
							</div>
							<div className="">
								<label htmlFor="roll_no" className="form-label">Roll Number</label>
								<input type="text" id="roll_no" className={`form-control ${errors?.roll_no && 'is-invalid'}`} onChange={(e) => handleInputChange(e, 'roll_no')} />
								{errors?.roll_no && <div className="invalid-feedback">{errors?.roll_no}</div>}
							</div>
							<div className="">
								<label htmlFor="year" className="form-label">Year</label>
								<input type="text" id="year" className={`form-control ${errors?.year && 'is-invalid'}`} onChange={(e) => handleInputChange(e, 'year')} />
								{errors?.year && <div className="invalid-feedback">{errors?.year}</div>}
							</div>
							<div className="">
								<label htmlFor="dept" className="form-label">Department</label>
								<input type="text" id="dept" className={`form-control ${errors?.dept && 'is-invalid'}`} onChange={(e) => handleInputChange(e, 'dept')} />
								{errors?.dept && <div className="invalid-feedback">{errors?.dept}</div>}
							</div>
							<div className="">
								<label htmlFor="file" className="form-label">Image</label>
								<input type="file" id="file" className={`form-control ${errors?.file && 'is-invalid'}`} onChange={(e) => handleInputChange(e, 'file')} />
								{errors?.file && <div className="invalid-feedback">{errors?.file}</div>}
							</div>
						</div>
						<div className="modal-footer">
							<button className={` btn btn-success ${buttonDisabled ? 'disabled' : ''}`} onClick={AddData}>Submit</button>
						</div>
					</div>
				</div>
			</div>

		</div>
	)

}

export default Studentdetails
