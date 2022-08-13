import logo from './logo.svg';
import './App.css';
import {Route , BrowserRouter, Routes, Navigate} from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import BookingCar from './pages/BookingCar'
import 'antd/dist/antd.css';
import UserBookings from './pages/UserBookings';
import AddCar from './pages/AddCar';
import AdminHome from './pages/AdminHome';
import EditCar from './pages/EditCar';


function App() {
  return (
    <div className="App">

       

      <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/booking/:carid' element={<BookingCar />} />
        <Route path='/userbookings' element={<UserBookings />} />
        <Route path='/addcar' element={<AddCar/>}/>
        <Route path='/editcar/:carid' element={<EditCar/>}/>
        <Route path='/admin' element={<AdminHome />} />
        
        </Routes>
      </BrowserRouter>

    </div>
  );
}



export default App;


export function ProtectedRoute(props)
{
  if(localStorage.getItem('user'))
  {
    return <Route {...props}/>
  }
  else{
    return <Navigate to='/login'/>
  }

}