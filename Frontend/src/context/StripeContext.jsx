import { createContext, useContext, useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';

const StripeContext = createContext(null);

export const useStripeContext = () => {
  const context = useContext(StripeContext);
  if (!context) {
    throw new Error('useStripeContext must be used within StripeProvider');
  }
  return context;
};

export const StripeProvider = ({ children }) => {
  const [stripePromise, setStripePromise] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
    
    if (publishableKey) {
      const stripe = loadStripe(publishableKey);
      setStripePromise(stripe);
    } else {
      console.warn('VITE_STRIPE_PUBLISHABLE_KEY is not set');
    }
    
    setLoading(false);
  }, []);

  const value = {
    stripePromise,
    loading
  };

  return (
    <StripeContext.Provider value={value}>
      {children}
    </StripeContext.Provider>
  );
};

