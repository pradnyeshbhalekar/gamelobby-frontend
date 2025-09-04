import React from 'react';
import { QrCode } from 'lucide-react';

const QRCodeDisplay = () => {
  return (
    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
      <h3 className="text-xl font-semibold mb-6">Your QR Code</h3>
      
      <div className="text-center">
        <div className="bg-white p-4 rounded-lg mb-4 inline-block">
          <QrCode className="w-32 h-32 text-gray-800" />
        </div>
        <p className="text-sm text-gray-400 mb-4">
          Customers scan this to book sessions
        </p>
        <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm">
          Download QR Code
        </button>
      </div>
    </div>
  );
};

export default QRCodeDisplay;