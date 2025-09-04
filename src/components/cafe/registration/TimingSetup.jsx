import React, { useState } from 'react';
import { Clock, MapPin, Percent, Plus, Trash2 } from 'lucide-react';

const TimingsSetupStep = ({ parlourData = {}, setParlourData = () => {}, setStep = () => {}, navigate = () => {} }) => {
  // Initialize state with default values
  const [timings, setTimings] = useState(parlourData.timings || [{ open: "09:00", close: "17:00" }]);
  const [happyHours, setHappyHours] = useState(parlourData.happyhours || {
    start: "09:00",
    end: "12:00",
    discountPercent: "20"
  });
  const [address, setAddress] = useState(parlourData.address || "");

  const addTimeSlot = () => {
    setTimings([...timings, { open: "09:00", close: "17:00" }]);
  };

  const normalizeTime = (time) => {
    if (!time) return "00:00";
    return time.length === 4 ? `0${time}` : time; // ensures leading zero
  };

  const removeTimeSlot = (index) => {
    if (timings.length > 1) {
      setTimings(timings.filter((_, i) => i !== index));
    }
  };

  const updateTimeSlot = (index, field, value) => {
    const updatedTimings = timings.map((slot, i) => 
      i === index ? { ...slot, [field]: value } : slot
    );
    setTimings(updatedTimings);
  };

  const handleNext = async () => {
    // Validate required fields
    if (!address.trim()) {
      alert('Please enter the parlour address');
      return;
    }

    if (timings.length === 0 || !timings[0].open || !timings[0].close) {
      alert('Please set at least one operating hour');
      return;
    }

    const payload = {
      address: address.trim(),
      timings,
      happyHours: {
        start: happyHours.start,
        end: happyHours.end,
        discountPercent: Number(happyHours.discountPercent)
      }
    };

    try {
      // WARNING: localStorage is not supported in Claude artifacts
      // This will work in your actual development environment
      const token = localStorage.getItem("token");
      
      if (!token) {
        console.error("No authentication token found");
        alert('Authentication token not found. Please login again.');
        return;
      }

      const endpoint = import.meta.env?.VITE_APP_API_URL || "http://localhost:3001";
      
      const res = await fetch(`${endpoint}/api/parlour/setup/${parlourData._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error(`Failed to update parlour: ${res.statusText}`);
      }

      const data = await res.json();
      console.log("Parlour data: ", data);
      
      // Update parlour data with the response
      setParlourData(data.updatedParlour || data);
      
      // Move to next step
      setStep(3);
      
    } catch (err) {
      console.error("Error occurred: ", err);
      alert('Failed to update parlour details. Please try again.');
    }
  };

  const handleBack = () => {
    setStep(1); 
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex items-center justify-center px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      <div className="bg-gray-800/90 backdrop-blur-md p-4 sm:p-8 lg:p-10 xl:p-12 rounded-xl sm:rounded-2xl border border-gray-700 w-full max-w-md sm:max-w-2xl lg:max-w-4xl xl:max-w-6xl shadow-xl">
        
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8 lg:mb-10">
          <Clock className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 text-green-400 mx-auto mb-3 sm:mb-4" />
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold">Setup Parlour Details</h2>
          <p className="text-gray-400 text-sm sm:text-base lg:text-lg mt-2">Step 2: Timings & Happy Hours</p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8 lg:gap-10">
          
          {/* Left Column - Address & Timings */}
          <div className="space-y-6 sm:space-y-8">
            
            {/* Address */}
            <div>
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <MapPin className="w-5 h-5 text-green-400" />
                <label className="text-sm sm:text-base lg:text-lg font-medium">Parlour Address</label>
              </div>
              <textarea
                required
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 lg:py-4 bg-gray-700 border border-gray-600 rounded-lg focus:border-green-500 focus:ring focus:ring-green-500/20 outline-none transition-all text-sm sm:text-base resize-none"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="24 Street, Navi Mumbai, Maharashtra, 400001"
                rows="3"
              />
            </div>

            {/* Operating Hours */}
            <div>
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-green-400" />
                  <label className="text-sm sm:text-base lg:text-lg font-medium">Operating Hours</label>
                </div>
                <button
                  type="button"
                  onClick={addTimeSlot}
                  className="flex items-center gap-1 px-3 py-1.5 bg-green-600 hover:bg-green-700 rounded-md text-xs sm:text-sm transition-all touch-manipulation"
                >
                  <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                  Add Slot
                </button>
              </div>

              <div className="space-y-3 sm:space-y-4">
                {timings.map((slot, index) => (
                  <div key={index} className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-gray-700/50 rounded-lg border border-gray-600">
                    <div className="flex-1 grid grid-cols-2 gap-2 sm:gap-3">
                      <div>
                        <label className="block text-xs sm:text-sm text-gray-400 mb-1">Open</label>
                        <input
                          type="time"
                          className="w-full px-2 sm:px-3 py-1.5 sm:py-2 bg-gray-600 border border-gray-500 rounded focus:border-green-500 focus:ring focus:ring-green-500/20 outline-none transition-all text-xs sm:text-sm"
                          value={slot.open}
                          onChange={(e) => updateTimeSlot(index, 'open', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-xs sm:text-sm text-gray-400 mb-1">Close</label>
                        <input
                          type="time"
                          className="w-full px-2 sm:px-3 py-1.5 sm:py-2 bg-gray-600 border border-gray-500 rounded focus:border-green-500 focus:ring focus:ring-green-500/20 outline-none transition-all text-xs sm:text-sm"
                          value={slot.close}
                          onChange={(e) => updateTimeSlot(index, 'close', e.target.value)}
                        />
                      </div>
                    </div>
                    {timings.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeTimeSlot(index)}
                        className="p-1.5 sm:p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded transition-all touch-manipulation"
                      >
                        <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Happy Hours */}
          <div>
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <Percent className="w-5 h-5 text-green-400" />
              <label className="text-sm sm:text-base lg:text-lg font-medium">Happy Hours</label>
            </div>

            <div className="bg-gray-700/30 p-4 sm:p-6 lg:p-8 rounded-lg border border-gray-600">
              <div className="space-y-4 sm:space-y-6">
                
                {/* Happy Hour Times */}
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs sm:text-sm text-gray-400 mb-2">Start Time</label>
                    <input
                      type="time"
                      className="w-full px-3 py-2 sm:py-2.5 bg-gray-600 border border-gray-500 rounded-lg focus:border-green-500 focus:ring focus:ring-green-500/20 outline-none transition-all text-xs sm:text-sm"
                      value={happyHours.start}
                      onChange={(e) => setHappyHours({ ...happyHours, start: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm text-gray-400 mb-2">End Time</label>
                    <input
                      type="time"
                      className="w-full px-3 py-2 sm:py-2.5 bg-gray-600 border border-gray-500 rounded-lg focus:border-green-500 focus:ring focus:ring-green-500/20 outline-none transition-all text-xs sm:text-sm"
                      value={happyHours.end}
                      onChange={(e) => setHappyHours({ ...happyHours, end: e.target.value })}
                    />
                  </div>
                </div>

                {/* Discount Percentage */}
                <div>
                  <label className="block text-xs sm:text-sm text-gray-400 mb-2">Discount Percentage</label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      className="w-full px-3 py-2 sm:py-2.5 pr-8 bg-gray-600 border border-gray-500 rounded-lg focus:border-green-500 focus:ring focus:ring-green-500/20 outline-none transition-all text-xs sm:text-sm"
                      value={happyHours.discountPercent}
                      onChange={(e) => setHappyHours({ ...happyHours, discountPercent: e.target.value })}
                      placeholder="20"
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs sm:text-sm">%</span>
                  </div>
                </div>

                {/* Happy Hour Preview */}
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 sm:p-4">
                  <h4 className="text-green-400 font-medium text-xs sm:text-sm mb-2">Preview</h4>
                  <p className="text-xs sm:text-sm text-gray-300">
                    <span className="text-green-400 font-medium">{happyHours.discountPercent}% OFF</span> during happy hours
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {happyHours.start} - {happyHours.end}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-8 lg:mt-10">
          <button
            type="button"
            onClick={handleBack}
            className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-3.5 lg:py-4 text-gray-400 hover:text-white border border-gray-600 hover:border-gray-500 rounded-lg font-medium transition-all text-sm sm:text-base touch-manipulation"
          >
            ← Back
          </button>
          
          <button
            type="button"
            onClick={handleNext}
            disabled={!address.trim()}
            className="w-full sm:flex-1 bg-green-600 hover:bg-green-700 active:bg-green-800 disabled:bg-gray-600 disabled:cursor-not-allowed py-3 sm:py-3.5 lg:py-4 rounded-lg font-medium transition-all shadow-lg hover:shadow-green-500/20 text-sm sm:text-base lg:text-lg touch-manipulation transform active:scale-95"
          >
            Next: Add Gaming Assets →
          </button>
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center mt-6 sm:mt-8">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
            <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
          </div>
          <p className="text-xs text-gray-500 ml-3 mt-0.5">Step 2 of 4</p>
        </div>
      </div>
    </div>
  );
};

export default TimingsSetupStep;