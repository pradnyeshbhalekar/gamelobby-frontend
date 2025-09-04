import React from 'react';

const StatsPanel = ({ bookings }) => {
  const todayBookings = bookings.filter(booking => 
    booking.date === new Date().toLocaleDateString()
  );

  const totalRevenue = todayBookings.reduce((sum, booking) => sum + booking.total, 0);
  const activeBookings = todayBookings.length; // Simplified for demo

  return (
    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
      <h3 className="text-xl font-semibold mb-6">Today's Stats</h3>
      
      <div className="space-y-4">
        <div className="flex justify-between">
          <span className="text-gray-400">Total Bookings</span>
          <span className="font-semibold">{todayBookings.length}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Active Sessions</span>
          <span className="font-semibold text-green-400">{activeBookings}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Revenue</span>
          <span className="font-semibold text-green-400">₹{totalRevenue}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Walk-ins</span>
          <span className="font-semibold">8</span>
        </div>
      </div>
    </div>
  );
};

export default StatsPanel;