import React from 'react';
import { User, Building2, Monitor, GamepadIcon, RectangleGoggles, Car } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '../context/userAuthContext';


const HomePage = () => {
    const { token } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
    if (token) {
      navigate('/user/dashboard');
    }
  }, [token, navigate]);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 text-blue-400">GAMELOBBY</h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Book your gaming sessions at the best gaming parlours in your area. 
            Experience VR, PS5, PC gaming, and racing simulators.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="bg-gray-800 p-8 rounded-lg border border-gray-700 hover:border-blue-500 transition-colors">
            <div className="text-center">
              <User className="w-16 h-16 text-blue-400 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold mb-4">Book as User</h2>
              <p className="text-gray-400 mb-6">Find and book gaming sessions at nearby parlours</p>
              <button 
                onClick={() => navigate('/user/login')}
                className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-lg font-medium transition-colors w-full"
              >
                Login as User
              </button>
            </div>
          </div>

          <div className="bg-gray-800 p-8 rounded-lg border border-gray-700 hover:border-green-500 transition-colors">
            <div className="text-center">
              <Building2 className="w-16 h-16 text-green-400 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold mb-4">Register Gaming Parlour</h2>
              <p className="text-gray-400 mb-6">List your gaming parlour and manage bookings</p>
              <button 
                onClick={() => navigate('/cafe/register')}
                className="bg-green-600 hover:bg-green-700 px-8 py-3 rounded-lg font-medium transition-colors w-full"
              >
                Register Parlour
              </button>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <h3 className="text-2xl font-semibold mb-8 text-gray-200">Features</h3>
          <div className="grid md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="text-center">
              <Monitor className="w-12 h-12 text-purple-400 mx-auto mb-3" />
              <h4 className="font-medium mb-2">PC Gaming</h4>
              <p className="text-sm text-gray-400">High-end gaming PCs</p>
            </div>
            <div className="text-center">
              <GamepadIcon className="w-12 h-12 text-red-400 mx-auto mb-3" />
              <h4 className="font-medium mb-2">Console Gaming</h4>
              <p className="text-sm text-gray-400">PS5, Xbox Series X</p>
            </div>
            <div className="text-center">
              <RectangleGoggles className="w-12 h-12 text-cyan-400 mx-auto mb-3" />
              <h4 className="font-medium mb-2">VR Experience</h4>
              <p className="text-sm text-gray-400">Immersive VR gaming</p>
            </div>
            <div className="text-center">
              <Car className="w-12 h-12 text-orange-400 mx-auto mb-3" />
              <h4 className="font-medium mb-2">Racing Sim</h4>
              <p className="text-sm text-gray-400">Professional racing setup</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;