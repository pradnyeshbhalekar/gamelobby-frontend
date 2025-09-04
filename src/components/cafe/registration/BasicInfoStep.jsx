import React, { useState } from 'react';
import { Building2 } from 'lucide-react';

const endpoint = import.meta.env.VITE_APP_API_URL;
const BasicInfoStep = ({ parlourData = {}, setParlourData = () => {}, setStep = () => {}, navigate = () => {} }) => {

  const [loading,setLoading] = useState(false)
  const [error,setError] = useState("")



  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    setError('')
    try{
      const response = await fetch(
        `${endpoint}/api/auth/parlour/register`,{
          method:"POST",
          headers:{"Content-Type":"application/json"},
          body: JSON.stringify({
            name:parlourData.name,
            email:parlourData.email,
            password:parlourData.password,
            phonenumber:parlourData.phone,
            location:parlourData.address
          }),
        }
      );
      const data = await response.json();

      if(!response.ok){
        throw new Error(data.message || "Failed to register parlour")
      }
      console.log(data)
      console.log(data.token)
      if (data.token){
        localStorage.setItem("token",data.token)
      }
      setParlourData(data)
      setStep(2);
    }catch(err){
      setError(err.message)
    }finally{
      setLoading(false)
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex items-center justify-center px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      <div className="bg-gray-800/90 backdrop-blur-md p-4 sm:p-8 lg:p-10 xl:p-12 rounded-xl sm:rounded-2xl border border-gray-700 w-full max-w-md sm:max-w-2xl lg:max-w-4xl xl:max-w-5xl shadow-xl">
        
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8 lg:mb-10">
          <Building2 className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 text-green-400 mx-auto mb-3 sm:mb-4" />
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold">Register Parlour</h2>
          <p className="text-gray-400 text-sm sm:text-base lg:text-lg mt-2">Step 1: Basic Information</p>
        </div>

        {/* Form Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          
          {/* Parlour Name */}
          <div className="col-span-1 lg:col-span-2">
            <label className="block text-sm sm:text-base font-medium mb-2">Parlour Name</label>
            <input
              type="text"
              required
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 lg:py-4 bg-gray-700 border border-gray-600 rounded-lg focus:border-green-500 focus:ring focus:ring-green-500/20 outline-none transition-all text-sm sm:text-base"
              value={parlourData.name || ''}
              onChange={(e) => setParlourData({ ...parlourData, name: e.target.value })}
              placeholder="Gaming Zone Pro"
            />
          </div>

          {/* Email */}
          <div className="col-span-1">
            <label className="block text-sm sm:text-base font-medium mb-2">Email</label>
            <input
              type="email"
              required
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 lg:py-4 bg-gray-700 border border-gray-600 rounded-lg focus:border-green-500 focus:ring focus:ring-green-500/20 outline-none transition-all text-sm sm:text-base"
              value={parlourData.email || ''}
              onChange={(e) => setParlourData({ ...parlourData, email: e.target.value })}
              placeholder="owner@gamingzone.com"
            />
          </div>

          {/* Password */}
          <div className="col-span-1">
            <label className="block text-sm sm:text-base font-medium mb-2">Password</label>
            <input
              type="password"
              required
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 lg:py-4 bg-gray-700 border border-gray-600 rounded-lg focus:border-green-500 focus:ring focus:ring-green-500/20 outline-none transition-all text-sm sm:text-base"
              value={parlourData.password || ''}
              onChange={(e) => setParlourData({ ...parlourData, password: e.target.value })}
              placeholder="Create a strong password"
            />
          </div>

          {/* Phone */}
          <div className="col-span-1">
            <label className="block text-sm sm:text-base font-medium mb-2">Phone Number</label>
            <input
              type="tel"
              required
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 lg:py-4 bg-gray-700 border border-gray-600 rounded-lg focus:border-green-500 focus:ring focus:ring-green-500/20 outline-none transition-all text-sm sm:text-base"
              value={parlourData.phone || ''}
              onChange={(e) => setParlourData({ ...parlourData, phone: e.target.value })}
              placeholder="+91 9876543210"
            />
          </div>

          {/* Empty div for spacing on large screens */}
          <div className="hidden lg:block"></div>

          {/* Address */}
          <div className="col-span-1 lg:col-span-2">
            <label className="block text-sm sm:text-base font-medium mb-2">Address</label>
            <textarea
              required
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 lg:py-4 bg-gray-700 border border-gray-600 rounded-lg focus:border-green-500 focus:ring focus:ring-green-500/20 outline-none transition-all text-sm sm:text-base resize-none"
              value={parlourData.address || ''}
              onChange={(e) => setParlourData({ ...parlourData, address: e.target.value })}
              placeholder="Street, City, State, PIN"
              rows="3"
            />
          </div>

          {/* Buttons */}
          <div className="col-span-1 lg:col-span-2 flex flex-col gap-3 sm:gap-4 mt-4 sm:mt-6 lg:mt-8">
            <button
              type="button"
              onClick={handleSubmit}
              className="w-full bg-green-600 hover:bg-green-700 active:bg-green-800 py-3 sm:py-3.5 lg:py-4 xl:py-5 rounded-lg font-medium transition-all shadow-lg hover:shadow-green-500/20 text-sm sm:text-base lg:text-lg touch-manipulation transform active:scale-95"
            >
              Next: Setup Timings & Hours
            </button>

            <p className="text-center text-gray-400 text-xs sm:text-sm lg:text-base">
              Have your cafe already registered?{" "}
              <button
                type="button"
                onClick={() => navigate("/cafe/login")}
                className="text-green-500 hover:underline hover:text-green-400 transition touch-manipulation"
              >
                Login
              </button>
            </p>

            <button
              type="button"
              onClick={() => navigate('/')}
              className="w-full text-gray-400 hover:text-white transition-all py-2 sm:py-2.5 lg:py-3 text-xs sm:text-sm lg:text-base touch-manipulation"
            >
              ← Back to Home
            </button>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center mt-6 sm:mt-8">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
            <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
            <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
          </div>
          <p className="text-xs text-gray-500 ml-3 mt-0.5">Step 1 of 4</p>
        </div>
      </div>
    </div>
  );
};

export default BasicInfoStep;