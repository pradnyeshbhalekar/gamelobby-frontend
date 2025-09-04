import React, { useState } from 'react';
import BasicInfoStep from '../components/cafe/registration/BasicInfoStep';
import AssetsStep from '../components/cafe/registration/AssetStep';
import QRCodeStep from '../components/cafe/registration/QRCodeStep';
import { useNavigate } from 'react-router-dom';
import TimingsSetup from '../components/cafe/registration/TimingSetup';
const CafeRegisterPage = ({  addParlour, setCurrentUser }) => {
  const navigate = useNavigate()
  const [step, setStep] = useState(1);
  const [parlourData, setParlourData] = useState({
    name: '', 
    email: '', 
    password: '', 
    phone: '', 
    address: '',
    openTime: '09:00', 
    closeTime: '23:00',
    assets: []
  });



  const handleSubmit = () => {
    const newParlour = {
      ...parlourData,
      id: Date.now(),
      isOpen: true,
      prebookingEnabled: false,

    };
    addParlour(newParlour);
    setCurrentUser({ type: 'parlour', ...newParlour });
    navigate('parlourDashboard');
  };

  const stepProps = {
    parlourData,
    setParlourData,
    step,
    setStep,
    navigate,
    handleSubmit,

  };

  return (
    <div>
      {step === 1 && <BasicInfoStep {...stepProps} />}
      {step === 2 && <TimingsSetup {...stepProps}/>}
      {step === 3 && <AssetsStep {...stepProps} />}
      {step === 4 && <QRCodeStep {...stepProps} />}
    </div>
  );
};

export default CafeRegisterPage;


