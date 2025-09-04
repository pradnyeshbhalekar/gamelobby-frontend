import React from 'react';
import { QrCode } from 'lucide-react';

const QRCodeStep = ({ parlourData = {}, generateQRCode = () => ({ parlourId: 'PAR001' }), handleSubmit = () => {} }) => {
  const qrCode = generateQRCode();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex items-center justify-center px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      <div className="bg-gray-800/90 backdrop-blur-md p-4 sm:p-6 lg:p-8 xl:p-10 rounded-xl sm:rounded-2xl border border-gray-700 w-full max-w-md sm:max-w-lg lg:max-w-2xl shadow-xl">
        
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <QrCode className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 text-green-400 mx-auto mb-3 sm:mb-4" />
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold">Registration Complete!</h2>
          <p className="text-gray-400 text-sm sm:text-base lg:text-lg mt-2">Your unique QR code is ready</p>
        </div>

        {/* QR Code Display */}
        <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-lg sm:rounded-xl mb-6 sm:mb-8">
          <div className="bg-gray-200 w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 xl:w-56 xl:h-56 mx-auto flex items-center justify-center rounded-lg">
            <QrCode className="w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 xl:w-40 xl:h-40 text-gray-600" />
          </div>
          <p className="text-gray-800 text-xs sm:text-sm lg:text-base mt-2 sm:mt-3 font-medium">
            Parlour ID: {qrCode.parlourId}
          </p>
        </div>

        {/* Parlour Details */}
        <div className="bg-gray-700/50 p-4 sm:p-5 lg:p-6 rounded-lg sm:rounded-xl mb-6 sm:mb-8 border border-gray-600">
          <h3 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base lg:text-lg text-green-400">Parlour Details:</h3>
          <div className="space-y-2 sm:space-y-3">
            <div className="flex flex-col sm:flex-row sm:justify-between">
              <span className="text-xs sm:text-sm text-gray-400">Name:</span>
              <span className="text-xs sm:text-sm text-gray-300 font-medium">{parlourData.name || 'N/A'}</span>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:justify-between">
              <span className="text-xs sm:text-sm text-gray-400">Gaming Assets:</span>
              <span className="text-xs sm:text-sm text-gray-300 font-medium">
                {parlourData.assets?.length || 0} items
              </span>
            </div>
            
            {parlourData.timings && parlourData.timings.length > 0 && (
              <div className="flex flex-col sm:flex-row sm:justify-between">
                <span className="text-xs sm:text-sm text-gray-400">Operating Hours:</span>
                <div className="text-xs sm:text-sm text-gray-300 font-medium">
                  {parlourData.timings.map((timing, index) => (
                    <div key={index} className="sm:text-right">
                      {timing.open} - {timing.close}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {parlourData.happyhours && (
              <div className="flex flex-col sm:flex-row sm:justify-between">
                <span className="text-xs sm:text-sm text-gray-400">Happy Hours:</span>
                <span className="text-xs sm:text-sm text-gray-300 font-medium">
                  {parlourData.happyhours.start} - {parlourData.happyhours.end} ({parlourData.happyhours.discountPercent}% OFF)
                </span>
              </div>
            )}

            {parlourData.address && (
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                <span className="text-xs sm:text-sm text-gray-400 mb-1 sm:mb-0">Address:</span>
                <span className="text-xs sm:text-sm text-gray-300 font-medium sm:text-right sm:max-w-xs">
                  {parlourData.address}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleSubmit}
          className="w-full bg-green-600 hover:bg-green-700 active:bg-green-800 py-3 sm:py-3.5 lg:py-4 rounded-lg font-medium transition-all shadow-lg hover:shadow-green-500/20 text-sm sm:text-base lg:text-lg touch-manipulation transform active:scale-95"
        >
          Go to Dashboard
        </button>

        {/* Progress Indicator */}
        <div className="flex justify-center mt-6 sm:mt-8">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          </div>
          <p className="text-xs text-gray-500 ml-3 mt-0.5">Step 4 of 4</p>
        </div>
      </div>
    </div>
  );
};

export default QRCodeStep;