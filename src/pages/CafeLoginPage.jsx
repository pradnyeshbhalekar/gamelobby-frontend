import React, { useState } from 'react';
import { LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast, Slide } from 'react-toastify';

const API_URL = import.meta.env.VITE_APP_API_URL;

const CafeLoginPage = ({  setStep }) => {
    const navigate = useNavigate()
    const [loading,setLoading] = useState(false)


    const endpoint = `${API_URL}/api/auth/parlour/login`




  const [loginData, setLoginData] = React.useState({
    email: '',
    password: '',
  });

  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true)
    const payload = {
        email : loginData.email,
        password:loginData.password
    }
    try{
        console.log('starting to fetch')
        const response = await fetch(endpoint,{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body: JSON.stringify(payload)
        })
        const data = await response.json()
        console.log("completed fetching...",response)
        
        if(!response.ok){
            throw new Error(data.message || 'Invalid credientials')
        }
        toast.success('Login successful!', { transition: Slide });

        localStorage.setItem('cafeToken',data.token)

        setStep && setStep('dashboard')
        navigate('/cafe/dashboard')


    }catch(err){
        console.error('error occured',err)
        toast.error(`Login Failed, try again ${err.message}`,{transition:Slide})
    }finally{
        setLoading(false)
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex items-center justify-center px-6 py-10">
      <div className="bg-gray-800/90 backdrop-blur-md p-10 rounded-2xl border border-gray-700 w-full max-w-md shadow-xl">
        {/* Header */}
        <div className="text-center mb-10">
          <LogIn className="w-20 h-20 text-green-400 mx-auto mb-4" />
          <h2 className="text-4xl font-bold">Login</h2>
          <p className="text-gray-400 text-lg mt-2">Welcome back!</p>
        </div>



        {/* Form */}
        <form className="flex flex-col gap-6" onSubmit={handleLogin}>
          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              required
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg 
                         focus:border-green-500 focus:ring focus:ring-green-500/20 
                         outline-none transition-all"
              value={loginData.email}
              onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
              placeholder="owner@gamingzone.com"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              required
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg 
                         focus:border-green-500 focus:ring focus:ring-green-500/20 
                         outline-none transition-all"
              value={loginData.password}
              onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
              placeholder="Enter your password"
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 py-3 rounded-lg font-medium 
                       transition-all shadow-lg hover:shadow-green-500/20"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          {/* Register Link */}
          <p className="text-center text-gray-400">
            Don’t have an account?{" "}
            <button
              type="button"
              onClick={() => {
                setStep && setStep('register'); 
                navigate('/cafe/register');     
              }}
              className="text-green-500 hover:underline hover:text-green-400 transition"
            >
              Register
            </button>
          </p>

          {/* Back to Home */}
          <button
            type="button"
            onClick={() => navigate('/')}
            className="w-full text-gray-400 hover:text-white transition-all"
          >
            ← Back to Home
          </button>
        </form>
      </div>
    </div>
  );
};

export default CafeLoginPage;
