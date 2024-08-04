import React from 'react';
import { useLocation } from 'react-router-dom';

const PaymentResponse: React.FC = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const status = query.get('status');

  return (
    <div>
      {status === 'success' && <h1>Pago realizado con éxito</h1>}
      {status === 'failure' && <h1>El pago falló. Inténtalo de nuevo.</h1>}
      {status === 'pending' && <h1>El pago está pendiente. Te notificaremos cuando se complete.</h1>}
    </div>
  );
};

export default PaymentResponse;