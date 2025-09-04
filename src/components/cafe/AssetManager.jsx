import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Get parlour ID from JWT token
function getParlourId() {
  const token = localStorage.getItem('cafeToken');
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.id;
  } catch (err) {
    console.error('Invalid token:', err);
    return null;
  }
}

const AssetsManager = () => {
  const navigate = useNavigate()
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const parlourId = getParlourId();
    if (!parlourId) {
      console.log('No parlour ID found');
      setLoading(false);
      return;
    }

    const fetchAssets = async () => {
      try {
        const res = await fetch(`http://localhost:3001/api/parlour/assets/${parlourId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('cafeToken')}`,
          },
        });

        const data = await res.json();
        console.log(data)
        setAssets(Array.isArray(data.assets) ? data.assets : []);
      } catch (err) {
        console.error('Error fetching assets:', err);
        setAssets([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAssets();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-8 text-gray-400">
        Loading assets...
      </div>
    );
  }

  return (
    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold">Gaming Assets</h3>
        <button className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-sm">
          <Plus className="w-4 h-4 inline mr-2" />
          Add Asset
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {assets.length > 0 ? (
          assets.map((asset) => (
            <div key={asset._id} className="bg-gray-700 p-4 rounded-lg">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-medium">{asset.name}</h4>
                  <p className="text-sm text-gray-400">{asset.device}</p>
                  <p className="text-green-400 font-semibold">₹{asset.pricing?.regular}/hr</p>
                </div>
                <div className="flex gap-2">
                  <button className="text-gray-400 hover:text-white" onClick={()=>navigate(`/assets/${asset._id}/edit`)}>
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="text-red-400 hover:text-red-300">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="text-sm">
                <p className="text-gray-400 mb-1">Status:</p>
                <span className="bg-green-600 px-2 py-1 rounded text-xs">Available</span>
              </div>
              <div className="mt-2 text-sm">
                <p className="text-gray-400 mb-1">Games: {asset.games.length}</p>
                <div className="flex flex-wrap gap-1">
                  {asset.games.slice(0, 2).map((game, index) => (
                    <span key={index} className="bg-gray-600 px-2 py-1 rounded text-xs">
                      {game.title}
                    </span>
                  ))}
                  {asset.games.length > 2 && (
                    <span className="text-gray-400 text-xs">
                      +{asset.games.length - 2}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 col-span-full text-gray-400">
            No assets added yet
          </div>
        )}
      </div>
    </div>
  );
};

export default AssetsManager;
