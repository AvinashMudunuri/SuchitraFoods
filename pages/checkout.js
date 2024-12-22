import { useState } from 'react';
import CheckoutSteps from '../components/CheckoutSteps';
import ContactInfo from '../components/ContactInfo';
import ShippingAddress from '../components/ShippingAddress';
import PaymentMethod from '../components/PaymentMethod';
import OrderSummary from '../components/OrderSummary';
import { CheckoutProvider } from '../context/CheckoutContext';

const CheckoutPage = () => {
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  const renderStep = () => {
    switch (activeStep) {
      case 0:
        return <ContactInfo onNext={handleNext} />;
      case 1:
        return <ShippingAddress onNext={handleNext} onBack={handleBack} />;
      case 2:
        return <PaymentMethod onNext={handleNext} onBack={handleBack} />;
      case 3:
        return <OrderSummary />;
      default:
        return null;
    }
  };

  return (
    <CheckoutProvider>
      <CheckoutSteps activeStep={activeStep} />
      {renderStep()}
    </CheckoutProvider>
  );
};

export default CheckoutPage;
