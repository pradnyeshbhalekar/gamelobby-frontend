import React from 'react';
import { Power, PowerOff } from 'lucide-react';

const StatusControls = ({ parlourStatus, toggleStatus, togglePrebooking, currentUser }) => {
  return (
    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
      <h3 className="text-xl font-semibold mb-6">Parlour Status</h3>
      
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium">Parlour Status</h4>
            <p className="text-sm text-gray-400">Open/Close your parlour</p>
          </div>
          <button
            onClick={toggleStatus}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              parlourStatus.isOpen 
                ? 'bg-green-600 hover:bg-green-700 text-white' 
                : 'bg-red-600 hover:bg-red-700 text-white'
            }`}
          >
            {parlourStatus.isOpen ? (
              <>
                <Power className="w-4 h-4" />
                Open
              </>
            ) : (
              <>
                <PowerOff className="w-4 h-4" />
                Closed
              </>
            )}
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium">Pre-booking</h4>
            <p className="text-sm text-gray-400">Allow next day bookings</p>
          </div>
          <button
            onClick={togglePrebooking}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              parlourStatus.prebookingEnabled 
                ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                : 'bg-gray-600 hover:bg-gray-500 text-white'
            }`}
          >
            {parlourStatus.prebookingEnabled ? 'Enabled' : 'Disabled'}
          </button>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-gray-700">
        <h4 className="font-medium mb-3">Operating Hours</h4>
        <p className="text-gray-400">{currentUser?.openTime} - {currentUser?.closeTime}</p>
      </div>
    </div>
  );
};

export default StatusControls;