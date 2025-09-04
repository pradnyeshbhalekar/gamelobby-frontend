import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';

const BookingInterface = ({ parlour, onBack, onConfirm }) => {
  const [selectedBooking, setSelectedBooking] = useState({});

  const addToBooking = (asset) => {
    setSelectedBooking({
      ...selectedBooking,
      [asset.id]: {
        asset,
        hours: selectedBooking[asset.id]?.hours || 1,
        players: selectedBooking[asset.id]?.players || 1,
        game: selectedBooking[asset.id]?.game || asset.games[0]
      }
    });
  };

  const updateBooking = (assetId, field, value) => {
    setSelectedBooking({
      ...selectedBooking,
      [assetId]: {
        ...selectedBooking[assetId],
        [field]: value
      }
    });
  };

  const removeFromBooking = (assetId) => {
    const newBooking = {...selectedBooking};
    delete newBooking[assetId];
    setSelectedBooking(newBooking);
  };

  const confirmBooking = () => {
    const bookingData = {
      id: Date.now(),
      parlour: parlour.name,
      items: Object.values(selectedBooking),
      total: Object.values(selectedBooking).reduce((sum, item) => 
        sum + (item.asset.pricePerHour * item.hours), 0),
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString()
    };
    onConfirm(bookingData);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">{parlour.name}</h2>
            <div className="flex items-center gap-2 mt-2">
              {parlour.isOpen ? (
                <>
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <span className="text-green-400">Open</span>
                </>
              ) : (
                <>
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <span className="text-red-400">Closed</span>
                </>
              )}
            </div>
          </div>
          <button
            onClick={onBack}
            className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg"
          >
            Back to Scan
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div>
          <h3 className="text-xl font-semibold mb-4">Available Gaming Assets</h3>
          <div className="space-y-4">
            {parlour.assets.map(asset => (
              <div key={asset.id} className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-medium">{asset.name}</h4>
                    <p className="text-sm text-gray-400">{asset.type}</p>
                    <p className="text-green-400 font-semibold">₹{asset.pricePerHour}/hour</p>
                  </div>
                  <button
                    onClick={() => addToBooking(asset)}
                    className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm"
                  >
                    Add
                  </button>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Available Games:</p>
                  <div className="flex flex-wrap gap-1">
                    {asset.games.map((game, index) => (
                      <span key={index} className="bg-gray-700 px-2 py-1 rounded text-xs">
                        {game}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4">Your Booking</h3>
          {Object.keys(selectedBooking).length === 0 ? (
            <div className="bg-gray-800 p-8 rounded-lg border border-gray-700 text-center">
              <p className="text-gray-400">No items selected yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {Object.values(selectedBooking).map((item, index) => (
                <div key={index} className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-medium">{item.asset.name}</h4>
                    <button
                      onClick={() => removeFromBooking(item.asset.id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Game</label>
                      <select
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:border-blue-500 focus:outline-none"
                        value={item.game}
                        onChange={(e) => updateBooking(item.asset.id, 'game', e.target.value)}
                      >
                        {item.asset.games.map(game => (
                          <option key={game} value={game}>{game}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">Hours</label>
                        <input
                          type="number"
                          min="1"
                          max="8"
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:border-blue-500 focus:outline-none"
                          value={item.hours}
                          onChange={(e) => updateBooking(item.asset.id, 'hours', parseInt(e.target.value))}
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">Players</label>
                        <input
                          type="number"
                          min="1"
                          max="4"
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:border-blue-500 focus:outline-none"
                          value={item.players}
                          onChange={(e) => updateBooking(item.asset.id, 'players', parseInt(e.target.value))}
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center pt-2 border-t border-gray-700">
                      <span className="text-sm text-gray-400">Subtotal:</span>
                      <span className="font-semibold text-green-400">
                        ₹{item.asset.pricePerHour * item.hours}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              
              <div className="bg-gray-700 p-4 rounded-lg">
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span>Total:</span>
                  <span className="text-green-400">
                    ₹{Object.values(selectedBooking).reduce((sum, item) => 
                      sum + (item.asset.pricePerHour * item.hours), 0)}
                  </span>
                </div>
              </div>
              
              <button
                onClick={confirmBooking}
                className="w-full bg-green-600 hover:bg-green-700 py-3 rounded-lg font-medium transition-colors"
              >
                Confirm Booking
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingInterface;