import React, { useState, useEffect, useCallback } from 'react';
import { Building2, Plus, Trash2, Gamepad2, Loader2, Search, X } from 'lucide-react';
import { toast } from 'react-toastify';

// Utility function for API calls
const apiFetch = async (url, method = 'GET', body = null, token) => {
  if (!token) throw new Error('No authentication token found');
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
  const options = { method, headers };
  if (body) options.body = JSON.stringify(body);

  console.log(`Making ${method} request to: ${url}`);
  const response = await fetch(url, options);
  
  if (!response.ok) {
    console.error(`Request failed with status ${response.status}: ${url}`);
    // Check if response is JSON or HTML
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const err = await response.json();
      throw new Error(err.message || `Request failed with status ${response.status}`);
    } else {
      // If it's HTML (like a 404 page), don't try to parse as JSON
      const text = await response.text();
      console.error('Non-JSON response:', text.substring(0, 200));
      throw new Error(`Request failed with status ${response.status}. Check if the endpoint exists.`);
    }
  }
  return response.json();
};

// Debounce hook for search
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const AssetsStep = ({ parlourData = { assets: [] }, setParlourData = () => {}, setStep = () => {} }) => {
  const endpoint = import.meta.env.VITE_APP_API_URL || 'http://localhost:3001';
  const [currentAsset, setCurrentAsset] = useState({
    type: 'PC',
    name: '',
    pricing: { regular: '', happyHour: '' },
    games: [],
    specs: '',
  });
  
  // Game search states
  const [gameSearchTerm, setGameSearchTerm] = useState('');
  const [gameSearchResults, setGameSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showGameSearch, setShowGameSearch] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(null);

  const debouncedSearchTerm = useDebounce(gameSearchTerm, 300);

  const assetTypes = ['PC', 'PS5', 'Xbox', 'VR', 'Racing Sim'];


  const searchGames = useCallback(async (searchTerm) => {
    if (!searchTerm.trim()) {
      setGameSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const token = localStorage.getItem('token');
      
      // Use the specific API endpoint you provided
      const searchUrl = `${endpoint}/api/game/search?name=${encodeURIComponent(searchTerm)}`;
      console.log(`Searching games with URL: ${searchUrl}`);
      
      const response = await apiFetch(searchUrl, 'GET', null, token);
      console.log('Game search response:', response);
      
      setGameSearchResults(response || []);
    } catch (error) {
      console.error('Error searching games:', error);
      toast.error(`Search failed: ${error.message}`);
      setGameSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, [endpoint]);

  // Effect to trigger search when debounced term changes
  useEffect(() => {
    if (debouncedSearchTerm && showGameSearch) {
      searchGames(debouncedSearchTerm);
    } else {
      setGameSearchResults([]);
    }
  }, [debouncedSearchTerm, showGameSearch, searchGames]);

  // Validation for adding an asset
  const validateAsset = () => {
    if (!currentAsset.name.trim()) return 'Asset name is required';
    if (parlourData.assets?.some((asset) => asset.name === currentAsset.name.trim())) {
      return 'Asset name already exists';
    }
    if (!currentAsset.pricing.regular || Number(currentAsset.pricing.regular) <= 0) {
      return 'Regular price must be a positive number';
    }
    if (currentAsset.pricing.happyHour && Number(currentAsset.pricing.happyHour) < 0) {
      return 'Happy hour price cannot be negative';
    }
    if (currentAsset.type === 'PC' && !currentAsset.specs.trim()) {
      return 'Specifications are required for PC (e.g., i9, RTX 4090, 32GB RAM)';
    }
    return null;
  };

  // Add game from search results
  const addGameFromSearch = (game) => {
    const gameExists = currentAsset.games.some(g => g.igdbId === game.id);
    if (gameExists) {
      toast.error('Game already added');
      return;
    }

    const gameToAdd = {
      igdbId: game.id,
      title: game.name,
      coverUrl: game.cover?.url ? `https:${game.cover.url.replace('t_thumb', 't_cover_big')}` : null,
      genres: game.genres?.map(g => g.name) || [],
      releaseDate: game.first_release_date ? new Date(game.first_release_date * 1000) : null,
    };

    setCurrentAsset({
      ...currentAsset,
      games: [...currentAsset.games, gameToAdd],
    });

    // Clear search and close dropdown
    setGameSearchTerm('');
    setShowGameSearch(false);
    setGameSearchResults([]);
    toast.success(`${game.name} added successfully`);
  };

  const removeGame = (gameToRemove) => {
    setCurrentAsset({
      ...currentAsset,
      games: currentAsset.games.filter((g) => g.igdbId !== gameToRemove.igdbId),
    });
  };

  const addAsset = () => {
    const error = validateAsset();
    if (error) {
      toast.error(error);
      return;
    }
    setParlourData({
      ...parlourData,
      assets: [...(parlourData.assets || []), { ...currentAsset, id: Date.now() }],
    });
    setCurrentAsset({
      type: 'PC',
      name: '',
      pricing: { regular: '', happyHour: '' },
      games: [],
      specs: '',
    });
    setGameSearchTerm('');
    setShowGameSearch(false);
    setGameSearchResults([]);
    toast.success('Asset added successfully');
  };

  const removeAsset = (id) => {
    setShowConfirmDelete(id);
  };

  const confirmRemoveAsset = () => {
    setParlourData({
      ...parlourData,
      assets: (parlourData.assets || []).filter((asset) => asset.id !== showConfirmDelete),
    });
    setShowConfirmDelete(null);
    toast.success('Asset removed successfully');
  };

  const handleNext = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');

      const assetPromises = (parlourData.assets || []).map(async (asset) => {
        const assetPayload = {
          device: asset.type,
          name: asset.name,
          pricing: {
            regular: Number(asset.pricing.regular),
            happyHour: asset.pricing.happyHour
              ? Number(asset.pricing.happyHour)
              : Number(asset.pricing.regular),
          },
          games: [], // We'll add games separately using the new API
          specs: asset.type === 'PC' ? asset.specs : undefined,
        };

        // Create asset
        const assetResponse = await apiFetch(`${endpoint}/api/parlour/asset`, 'POST', assetPayload, token);
        console.log(`Asset response for ${asset.name}:`, JSON.stringify(assetResponse, null, 2));

        const assetId = assetResponse?._id || assetResponse?.asset?._id;
        if (!assetId) {
          console.error('Asset response structure:', JSON.stringify(assetResponse, null, 2));
          throw new Error(`No valid asset ID returned for ${asset.name}. Response: ${JSON.stringify(assetResponse)}`);
        }

        // Add games using the new API endpoint (one by one)
        if (asset.games?.length > 0) {
          for (const game of asset.games) {
            try {
              const gamePayload = {
                igdbGameId: game.igdbId.toString(),
              };
              const gameResponse = await apiFetch(
                `${endpoint}/api/parlour/asset/${assetId}/game`,
                'POST',
                gamePayload,
                token
              );
              console.log(`Game response for ${game.title}:`, JSON.stringify(gameResponse, null, 2));
            } catch (gameErr) {
              console.error(`Failed to add game ${game.title} for asset ${asset.name}:`, gameErr);
              toast.error(`Failed to add game ${game.title}`);
            }
          }
        }

        return { ...assetResponse, assetId };
      });

      const results = await Promise.all(assetPromises);
      console.log('All asset creation results:', results);
      toast.success('All assets and games added successfully');
      setStep(4);
    } catch (err) {
      console.error('Error in handleNext:', err);
      toast.error(err.message || 'Failed to add assets or games');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setStep(2);
  };

  const formatReleaseDate = (date) => {
    if (!date) return '';
    return new Date(date).getFullYear();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      <div className="container mx-auto max-w-md sm:max-w-2xl lg:max-w-4xl xl:max-w-6xl">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8 lg:mb-10">
          <Gamepad2 className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 text-green-400 mx-auto mb-3 sm:mb-4" />
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold">Add Gaming Assets</h2>
          <p className="text-gray-400 text-sm sm:text-base lg:text-lg mt-2">Step 3: Configure your gaming equipment</p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8">
          {/* Add Asset Form */}
          <div className="bg-gray-800/90 backdrop-blur-md p-4 sm:p-6 lg:p-8 rounded-xl border border-gray-700 shadow-xl">
            <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-4 sm:mb-6 text-green-400">Add New Asset</h3>
            <div className="space-y-4 sm:space-y-5 lg:space-y-6">
              {/* Asset Type */}
              <div>
                <label className="block text-sm sm:text-base font-medium mb-2" htmlFor="asset-type">Asset Type</label>
                <select
                  id="asset-type"
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 lg:py-4 bg-gray-700 border border-gray-600 rounded-lg focus:border-green-500 focus:ring focus:ring-green-500/20 outline-none transition-all text-sm sm:text-base"
                  value={currentAsset.type}
                  onChange={(e) =>
                    setCurrentAsset({
                      ...currentAsset,
                      type: e.target.value,
                      specs: e.target.value === 'PC' ? currentAsset.specs : '',
                    })
                  }
                >
                  {assetTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* Asset Name */}
              <div>
                <label className="block text-sm sm:text-base font-medium mb-2" htmlFor="asset-name">Asset Name</label>
                <input
                  id="asset-name"
                  type="text"
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 lg:py-4 bg-gray-700 border border-gray-600 rounded-lg focus:border-green-500 focus:ring focus:ring-green-500/20 outline-none transition-all text-sm sm:text-base"
                  value={currentAsset.name}
                  onChange={(e) => setCurrentAsset({ ...currentAsset, name: e.target.value })}
                  placeholder="Gaming PC #1"
                />
              </div>

              {/* PC Specifications (Conditional) */}
              {currentAsset.type === 'PC' && (
                <div>
                  <label className="block text-sm sm:text-base font-medium mb-2" htmlFor="specs">Specifications</label>
                  <input
                    id="specs"
                    type="text"
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 lg:py-4 bg-gray-700 border border-gray-600 rounded-lg focus:border-green-500 focus:ring focus:ring-green-500/20 outline-none transition-all text-sm sm:text-base"
                    value={currentAsset.specs}
                    onChange={(e) => setCurrentAsset({ ...currentAsset, specs: e.target.value })}
                    placeholder="e.g., i9, RTX 4090, 32GB RAM"
                  />
                </div>
              )}

              {/* Regular Price */}
              <div>
                <label className="block text-sm sm:text-base font-medium mb-2" htmlFor="regular-price">Regular Price (₹)</label>
                <input
                  id="regular-price"
                  type="number"
                  min="0"
                  step="1"
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 lg:py-4 bg-gray-700 border border-gray-600 rounded-lg focus:border-green-500 focus:ring focus:ring-green-500/20 outline-none transition-all text-sm sm:text-base"
                  value={currentAsset.pricing.regular}
                  onChange={(e) =>
                    setCurrentAsset({
                      ...currentAsset,
                      pricing: { ...currentAsset.pricing, regular: e.target.value },
                    })
                  }
                  placeholder="100"
                />
              </div>

              {/* Happy Hour Price */}
              <div>
                <label className="block text-sm sm:text-base font-medium mb-2" htmlFor="happy-hour-price">Happy Hour Price (₹)</label>
                <input
                  id="happy-hour-price"
                  type="number"
                  min="0"
                  step="1"
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 lg:py-4 bg-gray-700 border border-gray-600 rounded-lg focus:border-green-500 focus:ring focus:ring-green-500/20 outline-none transition-all text-sm sm:text-base"
                  value={currentAsset.pricing.happyHour}
                  onChange={(e) =>
                    setCurrentAsset({
                      ...currentAsset,
                      pricing: { ...currentAsset.pricing, happyHour: e.target.value },
                    })
                  }
                  placeholder="80"
                />
              </div>

              {/* Available Games with Search */}
              <div>
                <label className="block text-sm sm:text-base font-medium mb-2">Available Games</label>
                <div className="relative">
                  <div className="flex gap-2 mb-3 sm:mb-4">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-700 border border-gray-600 rounded-lg focus:border-green-500 focus:ring focus:ring-green-500/20 outline-none transition-all text-sm sm:text-base pl-10"
                        value={gameSearchTerm}
                        onChange={(e) => setGameSearchTerm(e.target.value)}
                        onFocus={() => setShowGameSearch(true)}
                        placeholder="Search games..."
                      />
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      {gameSearchTerm && (
                        <button
                          onClick={() => {
                            setGameSearchTerm('');
                            setShowGameSearch(false);
                            setGameSearchResults([]);
                          }}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Search Results Dropdown */}
                  {showGameSearch && (gameSearchResults.length > 0 || isSearching) && (
                    <div className="absolute z-10 w-full bg-gray-700 border border-gray-600 rounded-lg shadow-xl max-h-64 overflow-y-auto">
                      {isSearching ? (
                        <div className="p-4 text-center">
                          <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2" />
                          <p className="text-sm text-gray-400">Searching games...</p>
                        </div>
                      ) : (
                        gameSearchResults.map((game) => (
                          <button
                            key={game.id}
                            onClick={() => addGameFromSearch(game)}
                            className="w-full p-3 hover:bg-gray-600 text-left flex items-center gap-3 border-b border-gray-600 last:border-b-0"
                          >
                            {game.cover?.url && (
                              <img
                                src={`https:${game.cover.url}`}
                                alt={game.name}
                                className="w-8 h-8 rounded object-cover"
                              />
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{game.name}</p>
                              <p className="text-xs text-gray-400">
                                {game.genres?.map(g => g.name).join(', ')}
                                {game.first_release_date && (
                                  <span className="ml-2">({formatReleaseDate(new Date(game.first_release_date * 1000))})</span>
                                )}
                              </p>
                            </div>
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </div>

                {/* Selected Games */}
                {currentAsset.games.length > 0 && (
                  <div className="space-y-2 max-h-32 sm:max-h-40 overflow-y-auto">
                    {currentAsset.games.map((game) => (
                      <div key={game.igdbId} className="flex justify-between items-center bg-gray-700/50 px-3 py-2 rounded border border-gray-600">
                        <div className="flex items-center gap-2">
                          {game.coverUrl && (
                            <img
                              src={game.coverUrl}
                              alt={game.title}
                              className="w-6 h-6 rounded object-cover"
                            />
                          )}
                          <div>
                            <span className="text-xs sm:text-sm font-medium">{game.title}</span>
                            {game.genres?.length > 0 && (
                              <p className="text-xs text-gray-400">{game.genres.join(', ')}</p>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => removeGame(game)}
                          className="text-red-400 hover:text-red-300 p-1 touch-manipulation"
                          aria-label={`Remove ${game.title}`}
                        >
                          <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Add Asset Button */}
              <button
                type="button"
                onClick={addAsset}
                disabled={
                  !currentAsset.name ||
                  !currentAsset.pricing.regular ||
                  (currentAsset.type === 'PC' && !currentAsset.specs.trim())
                }
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed py-3 sm:py-3.5 rounded-lg font-medium transition-all text-sm sm:text-base touch-manipulation transform active:scale-95"
              >
                Add Asset
              </button>
            </div>
          </div>

          {/* Assets List */}
          <div className="bg-gray-800/90 backdrop-blur-md p-4 sm:p-6 lg:p-8 rounded-xl border border-gray-700 shadow-xl">
            <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-4 sm:mb-6 text-green-400">
              Added Assets ({(parlourData.assets || []).length})
            </h3>
            <div className="space-y-3 sm:space-y-4 max-h-64 sm:max-h-80 lg:max-h-96 overflow-y-auto">
              {(parlourData.assets || []).map((asset) => (
                <div key={asset.id} className="bg-gray-700/50 p-3 sm:p-4 lg:p-5 rounded-lg border border-gray-600">
                  <div className="flex justify-between items-start mb-2 sm:mb-3">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm sm:text-base lg:text-lg">{asset.name}</h4>
                      <p className="text-xs sm:text-sm text-gray-400">
                        {asset.type} • ₹{asset.pricing?.regular}/hour
                        {asset.pricing?.happyHour && (
                          <span className="ml-2 text-green-400">(Happy Hour: ₹{asset.pricing.happyHour})</span>
                        )}
                      </p>
                      {asset.type === 'PC' && asset.specs && (
                        <p className="text-xs sm:text-sm text-gray-400 mt-1">Specs: {asset.specs}</p>
                      )}
                    </div>
                    <button
                      onClick={() => removeAsset(asset.id)}
                      className="text-red-400 hover:text-red-300 p-1 sm:p-1.5 hover:bg-red-500/10 rounded transition-all touch-manipulation"
                      aria-label={`Remove ${asset.name}`}
                    >
                      <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                  </div>
                  {asset.games?.length > 0 && (
                    <div className="text-xs sm:text-sm">
                      <p className="text-gray-400 mb-1 sm:mb-2">Games ({asset.games.length}):</p>
                      <div className="flex flex-wrap gap-1">
                        {asset.games.slice(0, 3).map((game, index) => (
                          <span key={index} className="bg-gray-600 px-2 py-1 rounded text-xs">
                            {game.title}
                          </span>
                        ))}
                        {asset.games.length > 3 && (
                          <span className="text-gray-400 text-xs px-2 py-1">
                            +{asset.games.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            {!(parlourData.assets || []).length && (
              <div className="text-center py-8 sm:py-12">
                <Gamepad2 className="w-12 h-12 sm:w-16 sm:h-16 text-gray-600 mx-auto mb-3 sm:mb-4" />
                <p className="text-gray-400 text-sm sm:text-base">No assets added yet</p>
                <p className="text-gray-500 text-xs sm:text-sm mt-1">Add your first gaming asset to get started</p>
              </div>
            )}
          </div>
        </div>

        {/* Delete Confirmation Dialog */}
        {showConfirmDelete && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-6 rounded-lg shadow-xl max-w-sm w-full">
              <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
              <p className="text-gray-400 mb-6">Are you sure you want to remove this asset?</p>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowConfirmDelete(null)}
                  className="flex-1 bg-gray-600 hover:bg-gray-500 py-2 rounded-lg text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmRemoveAsset}
                  className="flex-1 bg-red-600 hover:bg-red-700 py-2 rounded-lg text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-8 lg:mt-10">
          <button
            onClick={handleBack}
            className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-3.5 lg:py-4 text-gray-400 hover:text-white border border-gray-600 hover:border-gray-500 rounded-lg font-medium transition-all text-sm sm:text-base touch-manipulation"
            disabled={isLoading}
          >
            ← Back
          </button>
          <button
            onClick={handleNext}
            disabled={!(parlourData.assets || []).length || isLoading}
            className="w-full sm:flex-1 bg-green-600 hover:bg-green-700 active:bg-green-800 disabled:bg-gray-600 disabled:cursor-not-allowed py-3 sm:py-3.5 lg:py-4 rounded-lg font-medium transition-all shadow-lg hover:shadow-green-500/20 text-sm sm:text-base lg:text-lg touch-manipulation transform active:scale-95 flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Saving...
              </>
            ) : (
              'Generate QR Code →'
            )}
          </button>
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center mt-6 sm:mt-8">
          <div className="flex items-center gap-2"> 
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full ${i < 3 ? 'bg-green-500' : 'bg-gray-600'}`}
              ></div>
            ))}
          </div>
          <p className="text-xs text-gray-500 ml-3 mt-0.5">Step 3 of 4</p>
        </div>
      </div>
    </div>
  );
};

export default AssetsStep;