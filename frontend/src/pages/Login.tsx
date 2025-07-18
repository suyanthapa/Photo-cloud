import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Login :React.FC = () => {

  console.log('API URL:', import.meta.env.VITE_API_URL);


   const apiBaseUrl = import.meta.env.VITE_API_URL;

    const [formData, setFormData] = useState({
        email : '',
        password: ''
    })
    const [ message, setMessage] = useState('');
    const navigate = useNavigate();


    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    

    try{
      
         const res = await axios.post(
          `${apiBaseUrl}/api/auth/login`,
          formData,
          {withCredentials: true}
        );
          setMessage('Login Successfully');
          console.log(res.data);
       
          navigate('/dashboard')
    }
    catch (err: any){
        setMessage(
            err.response?.data?.message ||
            err.response?.data?.error ||
            "Login Failed"
        );
    }};

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-sm bg-white p-8 rounded shadow">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        {message && (
          <p className="mb-4 text-sm text-center text-blue-600">{message}</p>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium">Email</label>
            <input 
                type="email"
                className="w-full px-3 py-2 border rounded" 
                placeholder="you@example.com" 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value } )}
                required
            />
          </div>
          <div className="mb-6">
            <label className="block mb-1 text-sm font-medium">Password</label>
            <input 
                type="password" 
                className="w-full px-3 py-2 border rounded" 
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value } )}
                required
             />
          </div>
          <button 
                type="submit" 
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
            Login
          </button>
        </form>

           {/* Login Redirect */}
        <p className="mt-4 text-sm text-center text-gray-600">
        Does not have an account?{' '}
          <Link to="/register" className="text-blue-600 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
