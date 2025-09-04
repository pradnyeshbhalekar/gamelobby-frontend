import React, { useRef, useState, useEffect } from 'react';
import { User, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/userAuthContext'; // make sure this path is correct

const API_URL = import.meta.env.VITE_APP_API_URL;

const UserLoginPage = () => {
  const { login } = useAuth();   // <-- get login function from context
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  
  const [formData, setFormData] = useState({ email: '', password: '', phonenumber: '', name: '' });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [formErrors, setFormErrors] = useState({ email: '', password: '', name: '', phonenumber: '' });

  const debounceTimeout = useRef(null);

  useEffect(() => {
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

    debounceTimeout.current = setTimeout(() => {
      const errors = {};

      if (formData.email && !formData.email.includes('@')) {
        errors.email = 'Please enter a valid email address.';
      } else {
        errors.email = '';
      }

      if (formData.password && formData.password.length < 6) {
        errors.password = 'Password must be at least 6 characters.';
      } else {
        errors.password = '';
      }

      if (!isLogin && (!formData.name || formData.name.trim().length === 0)) {
        errors.name = 'Full Name is required.';
      } else {
        errors.name = '';
      }

      if (!isLogin && (!formData.phonenumber || formData.phonenumber.trim().length === 0)) {
        errors.phonenumber = 'Phone Number is required.';
      } else {
        errors.phonenumber = '';
      }

      setFormErrors(errors);
    }, 500);

    return () => clearTimeout(debounceTimeout.current);
  }, [formData, isLogin]);

  const validateInputs = () => {
    setErrorMsg('');

    if (!formData.email) {
      setErrorMsg('Email is required.');
      return false;
    }
    if (!formData.email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return false;
    }

    if (!formData.password) {
      setErrorMsg('Password is required.');
      return false;
    }
    if (formData.password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return false;
    }

    if (!isLogin) {
      if (!formData.name || formData.name.trim().length === 0) {
        setErrorMsg('Full Name is required.');
        return false;
      }

      if (!formData.phonenumber || formData.phonenumber.trim().length === 0) {
        setErrorMsg('Phone Number is required.');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateInputs()) return;

    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    const endpoint = isLogin
      ? `${API_URL}/api/auth/user/login`
      : `${API_URL}/api/auth/user/register`;

    const payload = isLogin
      ? { email: formData.email, password: formData.password }
      : {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phonenumber: formData.phonenumber,
        };

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      if (data.token) {
        // Instead of manually writing to localStorage here,
        // use the login() method from AuthContext:
        login({ name: data.name, email: data.email, _id: data._id }, data.token);

        setSuccessMsg(isLogin ? 'Login successful! Redirecting...' : 'Registration successful! Redirecting...');

        setTimeout(() => {
          navigate('/user/dashboard'); // Note: remove '/user' if your route is just '/dashboard'
        }, 1500);
      } else {
        setSuccessMsg(isLogin ? 'Login successful!' : 'Registration successful!');
      }
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center px-4">
      <div className="bg-gray-800 p-8 rounded-lg border border-gray-700 w-full max-w-md">
        <div className="text-center mb-8">
          <User className="w-16 h-16 text-blue-400 mx-auto mb-4" />
          <h2 className="text-3xl font-bold">{isLogin ? 'User Login' : 'User Registration'}</h2>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-red-600 rounded text-center font-semibold">{errorMsg}</div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 bg-green-600 rounded text-center font-semibold">{successMsg}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          {!isLogin && (
            <>
              <div>
                <label className="block text-sm font-medium mb-2">Full Name</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter your full name"
                  disabled={loading}
                />
                {formErrors.name && <p className="text-red-400 text-sm mt-1">{formErrors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Phone Number</label>
                <input
                  type="tel"
                  required
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none"
                  value={formData.phonenumber}
                  onChange={(e) => setFormData({ ...formData, phonenumber: e.target.value })}
                  placeholder="Enter your phone number"
                  disabled={loading}
                />
                {formErrors.phonenumber && (
                  <p className="text-red-400 text-sm mt-1">{formErrors.phonenumber}</p>
                )}
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              required
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Enter your email"
              disabled={loading}
            />
            {formErrors.email && <p className="text-red-400 text-sm mt-1">{formErrors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none pr-12"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Enter your password"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                tabIndex={-1}
                disabled={loading}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {formErrors.password && <p className="text-red-400 text-sm mt-1">{formErrors.password}</p>}
          </div>

          <button
            type="submit"
            className={`w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
            disabled={loading}
          >
            {loading ? (isLogin ? 'Logging in...' : 'Registering...') : isLogin ? 'Login' : 'Register'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              if (loading) return;
              setErrorMsg('');
              setSuccessMsg('');
              setIsLogin(!isLogin);
              setFormData({ email: '', password: '', name: '', phonenumber: '' });
              setFormErrors({ email: '', password: '', name: '', phonenumber: '' });
            }}
            className="text-blue-400 hover:text-blue-300"
            disabled={loading}
          >
        {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
          </button>
        </div>

        <button
          onClick={() => navigate('/')}
          className="mt-4 w-full text-gray-400 hover:text-white"
          disabled={loading}
        >
          ← Back to Home
        </button>
      </div>
    </div>
  );
};

export default UserLoginPage;
