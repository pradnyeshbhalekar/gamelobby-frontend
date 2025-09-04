import React, { useState, useEffect } from 'react';
import { Search, Plus, Trash, Save, ChevronLeft, Loader2, Monitor, Gamepad2, IndianRupeeIcon, Tag, Cpu } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';

const AssetEditPage = () => {
  const navigate = useNavigate();
  const [asset, setAsset] = useState({
    name: '',
    device: '',
    specs: '',
    pricing: { regular: '', happyHour: '' },
    games: []
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showGameSearch, setShowGameSearch] = useState(false);

  const { id } = useParams();

  // Load existing asset data
  useEffect(() => {
    if (!id) return;

    const fetchAsset = async () => {
      try {
        const res = await fetch(`http://localhost:3001/api/parlour/assets/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('cafeToken')}`,
            'Content-Type': 'application/json'
          }
        });
        if (!res.ok) throw new Error('Failed to fetch asset');

        const data = await res.json();
        const assetFound = data.assets?.find(a => a._id === id);
        if (!assetFound) throw new Error('Asset not found');
        // Normalize game data and pricing to match state structure
        setAsset({
          ...assetFound,
          pricing: {
            regular: assetFound.pricing?.regular || '',
            happyHour: assetFound.pricing?.happyHour || ''
          },
          games: assetFound.games.map(game => ({
            id: game._id,
            title: game.title,
            coverUrl: game.coverUrl
          }))
        });
      } catch (err) {
        console.error("Error occurred:", err);
      }
    };

    fetchAsset();
  }, [id]);

  const handleInputChange = (field, value) => {
    if (field.startsWith('pricing.')) {
      const pricingField = field.split('.')[1];
      setAsset(prev => ({
        ...prev,
        pricing: { ...prev.pricing, [pricingField]: value }
      }));
    } else {
      setAsset(prev => ({ ...prev, [field]: value }));
    }
  };

  const searchGames = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    
    setIsSearching(true);
    try {
      const response = await fetch(`http://localhost:3001/api/game/search?name=${encodeURIComponent(query)}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('cafeToken')}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Search API response:', data);
      // Handle direct array response
      const games = Array.isArray(data) ? data : [];
      setSearchResults(games.map(game => ({
        id: game.id,
        title: game.name,
        coverUrl: game.cover && game.cover.url ? `https:${game.cover.url}` : null
      })));
    } catch (error) {
      console.error('Error searching games:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const addGameToAsset = async (game) => {
    try {
      const response = await fetch(`http://localhost:3001/api/parlour/asset/${id}/game`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('cafeToken')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          igdbGameId: game.id.toString()
        })
      });

      if (response.ok) {
        // Add game to local state
        setAsset(prev => ({
          ...prev,
          games: [...prev.games.filter(g => g.id !== game.id), {
            id: game.id,
            title: game.title,
            coverUrl: game.coverUrl
          }]
        }));
        setSearchQuery('');
        setSearchResults([]);
        setShowGameSearch(false);
      } else {
        throw new Error('Failed to add game');
      }
    } catch (error) {
      console.error('Error adding game to asset:', error);
      alert('Error adding game. Please try again.');
    }
  };

  const removeGameFromAsset = (gameId) => {
    setAsset(prev => ({
      ...prev,
      games: prev.games.filter(game => game.id !== gameId)
    }));
  };

  const saveAsset = async () => {
    setIsSaving(true);
    try {
      const payload = {
        ...asset,
        games: asset.games.map(game => game.id)
      };
      console.log('Saving asset with payload:', payload);
      const response = await fetch(`http://localhost:3001/api/parlour/assets/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('cafeToken')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server error response:', errorData);
        throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
      }
      alert('Asset updated successfully!');
    } catch (error) {
      console.error('Error saving asset:', error);
      alert(`Error saving asset: ${error.message}. Please try again.`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6" style={{ backgroundColor: '#111827' }}>
      <div className="max-w-4xl mx-auto">
        <div className="rounded-lg shadow-sm border border-gray-600 p-8" style={{ backgroundColor: '#1F2937' }}>
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>
            <h1 className="text-3xl font-bold text-white">Edit Asset</h1>
            <button
              onClick={saveAsset}
              disabled={isSaving}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>

          <div className="space-y-6">
            {/* Asset Name */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                <Tag className="w-4 h-4" />
                Asset Name
              </label>
              <input
                type="text"
                value={asset.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-4 py-3 border border-gray-500 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-white"
                style={{ backgroundColor: '#374151' }}
                placeholder="Enter asset name"
              />
            </div>

            {/* Specifications */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                <Cpu className="w-4 h-4" />
                Specifications
              </label>
              <textarea
                value={asset.specs}
                onChange={(e) => handleInputChange('specs', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-500 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none text-white"
                style={{ backgroundColor: '#374151' }}
                placeholder="Enter detailed specifications (e.g., CPU, GPU, RAM, Storage)"
              />
            </div>

            {/* Pricing */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                <IndianRupeeIcon className="w-4 h-4" />
                Regular Pricing
              </label>
              <input
                type="text"
                value={asset.pricing.regular}
                onChange={(e) => handleInputChange('pricing.regular', e.target.value)}
                className="w-full px-4 py-3 border border-gray-500 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-white"
                style={{ backgroundColor: '#374151' }}
                placeholder="Enter regular pricing (e.g., ₹150/hour)"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                <IndianRupeeIcon className="w-4 h-4" />
                Happy Hour Pricing
              </label>
              <input
                type="text"
                value={asset.pricing.happyHour}
                onChange={(e) => handleInputChange('pricing.happyHour', e.target.value)}
                className="w-full px-4 py-3 border border-gray-500 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-white"
                style={{ backgroundColor: '#374151' }}
                placeholder="Enter happy hour pricing (e.g., ₹100/hour)"
              />
            </div>

            {/* Games Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                  <Gamepad2 className="w-4 h-4" />
                  Available Games
                </label>
                <button
                  onClick={() => setShowGameSearch(!showGameSearch)}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Game
                </button>
              </div>

              {/* Game Search */}
              {showGameSearch && (
                <div className="mb-6 p-4">
                  <div className="relative mb-4 bg-[#374151] rounded-lg">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        searchGames(e.target.value);
                      }}
                      className="w-full pl-10 pr-4 py-3 bg-[#374151] rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                      placeholder="Search for games to add..."
                    />
                  </div>

                  {isSearching && (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                      <span className="ml-2 text-gray-300">Searching games...</span>
                    </div>
                  )}

                  {searchResults.length > 0 && (
                    <div className="max-h-60 overflow-y-auto space-y-2">
                      {searchResults.map((game) => (
                        <div
                          key={game.id}
                          className="flex items-center justify-between p-3 bg-[#374151] rounded-lg border hover:shadow-sm transition-shadow"
                        >
                          <div className="flex items-center gap-3">
                            {game.coverUrl && (
                              <img
                                src={game.coverUrl}
                                alt={game.title}
                                className="w-12 h-16 object-cover rounded"
                              />
                            )}
                            <div>
                              <h4 className="font-medium text-white">{game.title}</h4>
                              <p className="text-sm text-gray-500">ID: {game.id}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => addGameToAsset(game)}
                            disabled={asset.games.some(g => g.id === game.id)}
                            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                          >
                            {asset.games.some(g => g.id === game.id) ? 'Added' : 'Add'}
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Current Games */}
              <div className="space-y-2">
                {asset.games.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Gamepad2 className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>No games added yet. Click "Add Game" to search and add games.</p>
                  </div>
                ) : (
                  asset.games.map((game) => (
                    <div
                      key={game.id}
                      className="flex items-center justify-between p-4 bg-[#374151] rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        {game.coverUrl && (
                          <img
                            src={game.coverUrl}
                            alt={game.title}
                            className="w-10 h-14 object-cover rounded"
                          />
                        )}
                        <div>
                          <h4 className="font-medium text-white">{game.title}</h4>
                          <p className="text-sm text-gray-500">Game ID: {game.id}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => removeGameFromAsset(game.id)}
                        className="text-red-600 hover:text-red-700 p-1 rounded transition-colors"
                        title="Remove game"
                      >
                        <Trash className="w-5 h-5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetEditPage;