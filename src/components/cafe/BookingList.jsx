import React from 'react';

const BookingsList = ({ bookings }) => {
  return (
    <div className="mt-8 bg-gray-800 p-6 rounded-lg border border-gray-700">
      <h3 className="text-xl font-semibold mb-6">Recent Bookings</h3>
      
      <div className="space-y-4">
        {bookings.map((booking) => (
          <div key={booking.id} className="bg-gray-700 p-4 rounded-lg">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium">Booking #{booking.id}</h4>
                <p className="text-sm text-gray-400">{booking.date} at {booking.time}</p>
                <p className="text-sm text-gray-400">{booking.items.length} items booked</p>
                <div className="mt-2">
                  {booking.items.map((item, idx) => (
                    <div key={idx} className="text-xs text-gray-500">
                      {item.asset.name} - {item.game} ({item.hours}h, {item.players}p)
                    </div>
                  ))}
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-green-400">₹{booking.total}</p>
                <span className="bg-blue-600 px-2 py-1 rounded text-xs">Active</span>
              </div>
            </div>
          </div>
        ))}
        
        {bookings.length === 0 && (
          <p className="text-gray-400 text-center py-8">No bookings yet</p>
        )}
      </div>
    </div>
  );
};

export default BookingsList;