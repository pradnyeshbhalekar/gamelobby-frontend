import React, { useState } from 'react';
import StatusControls from '../components/cafe/StatusControl';
import QRCodeDisplay from '../components/cafe/QRCodeDisplay';
import StatsPanel from '../components/cafe/StatsPanel'
import AssetsManager from '../components/cafe/AssetManager';
import BookingsList from '../components/cafe/BookingList';

const ParlourDashboard = ({ currentUser, navigate, bookings = [] }) => {
  const [parlourStatus, setParlourStatus] = useState({
    isOpen: currentUser?.isOpen || true,
    prebookingEnabled: currentUser?.prebookingEnabled || false
  });

  const toggleStatus = () => {
    setParlourStatus({
      ...parlourStatus,
      isOpen: !parlourStatus.isOpen
    });
  };

  const togglePrebooking = () => {
    setParlourStatus({
      ...parlourStatus,
      prebookingEnabled: !parlourStatus.prebookingEnabled
    });
  };

  const parlourBookings = bookings.filter(
    booking => booking.parlour === currentUser?.name
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">{currentUser?.name}</h1>
            <p className="text-gray-400">Manage your gaming parlour</p>
          </div>
          <button
            onClick={() => navigate('home')}
            className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg"
          >
            Logout
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          <StatusControls 
            parlourStatus={parlourStatus}
            toggleStatus={toggleStatus}
            togglePrebooking={togglePrebooking}
            currentUser={currentUser}
          />
          <QRCodeDisplay />
          <StatsPanel bookings={parlourBookings} />
        </div>

        <AssetsManager assets={currentUser?.assets || []} />
        <BookingsList bookings={parlourBookings} />
      </div>
    </div>
  );
};

export default ParlourDashboard;
