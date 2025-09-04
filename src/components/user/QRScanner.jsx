import React from 'react';
import { QrCode } from 'lucide-react';

const QRScanner = ({ onScan }) => {
  return (
    <div className="text-center py-16">
      <QrCode className="w-24 h-24 text-blue-400 mx-auto mb-6" />
      <h2 className="text-2xl font-bold mb-4">Scan QR Code</h2>
      <p className="text-gray-400 mb-8">Scan the QR code at any gaming parlour to start booking</p>
      <button
        onClick={onScan}
        className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-lg font-medium"
      >
        Simulate QR Scan (Demo)
      </button>
    </div>
  );
};

export default QRScanner;