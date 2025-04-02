import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import AdminLayout from './Components/Adminpanel/AdminLayout';
import Login from './Components/Auth/Login'
import Register from './Components/Auth/Register';
import ForgotPassword from './Components/Auth/ForgotPassword';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<AdminLayout />} />
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin/register" element={<Register />} />
        <Route path="/admin/forgotpassword" element={<ForgotPassword />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;