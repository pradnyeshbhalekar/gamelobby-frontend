import React, { useState } from 'react';
import { QrCode } from 'lucide-react';
import QRScanner from '../components/user/QRScanner';
import BookingInterface from '../components/user/BookingInterface';
import BookingHistory from '../components/user/BookingHistory';
import { useAuth } from '../context/userAuthContext';


const UserDashboard = ({ navigate, bookings, addBooking }) => {
  const [scannedParlour, setScannedParlour] = useState(null);
  const { user, logout } = useAuth();


  const simulateScan = () => {
    // Simulate scanning a QR code - in real app this would use camera
    const mockParlour = {
      id: 1,
      name: "Gaming Zone Pro",
      isOpen: true,
      assets: [
        { id: 1, type: 'PC', name: 'Gaming PC #1', pricePerHour: 100, games: ['GTA V', 'Call of Duty', 'FIFA 24'] },
        { id: 2, type: 'PS5', name: 'PlayStation 5 #1', pricePerHour: 150, games: ['FIFA 24', 'Spider-Man', 'God of War'] },
        { id: 3, type: 'VR', name: 'VR Setup #1', pricePerHour: 200, games: ['Beat Saber', 'Half-Life Alyx'] }
      ]
    };
    setScannedParlour(mockParlour);
  };

  const handleBookingConfirm = (bookingData) => {
    addBooking(bookingData);
    setScannedParlour(null);
    alert('Booking confirmed!');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Welcome, {user?.name || 'User'}</h1>
            <p className="text-gray-400">Scan QR codes to book gaming sessions</p>
          </div>
        <button
        onClick={() => {
            logout();
            navigate('/');
            }}
            className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg"
          >
            Logout
          </button>
        </div>

        {!scannedParlour ? (
          <div>
            <QRScanner onScan={simulateScan} />
            <BookingHistory bookings={bookings} />
          </div>
        ) : (
          <BookingInterface 
            parlour={scannedParlour}
            onBack={() => setScannedParlour(null)}
            onConfirm={handleBookingConfirm}
          />
        )}
      </div>
    </div>
  );
};

export default UserDashboard;