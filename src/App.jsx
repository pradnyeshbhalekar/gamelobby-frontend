import { Routes, Route } from 'react-router-dom'
import { ToastContainer, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Required for styling

import Home from './pages/Home'
import UserLoginPage from './pages/UserLoginPage'
import UserDashboard from './pages/UserDashboard'
import PrivateRoute from './context/PrivateRoute';
import CafeRegisterPage from './pages/CafeRegisterPage';
import CafeLoginPage from './pages/CafeLoginPage';
import Dashboard from './pages/CafeDashboard'
import { useState } from 'react';
import AssetEditPage from './pages/EditAsset';

function App() {
  const [step, setStep] = useState('login');

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/user/login" element={<UserLoginPage />} />
        <Route path='/cafe/register' element={<CafeRegisterPage/>}/>
        <Route path='/cafe/login' element={<CafeLoginPage setStep={setStep} />} />
        <Route path='/cafe/dashboard' element={<Dashboard/>}/>
        <Route path="/assets/:id/edit" element={<AssetEditPage />}/>

        <Route
          path="/user/dashboard"
          element={
            <PrivateRoute>
              <UserDashboard />
            </PrivateRoute>
          }
        />
      </Routes>

      {/* Toast notifications available globally */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Bounce}
      />
    </>
  );
}

export default App;
