import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SamLogin from './Login1';
import Register from './Register';
import DefaultLayout from './Layouts/DefaultLayout';
import Login from './Login';

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Login/>}/>
      <Route path='/sam' element={<SamLogin/>}/>
      
      <Route path='/register' element={<Register/>}/>
      <Route path='*' element={<DefaultLayout/>}/>


    </Routes>
    </BrowserRouter>
  );
}

export default App;
