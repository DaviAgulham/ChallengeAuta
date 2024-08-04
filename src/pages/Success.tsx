import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { db } from '../config/firebaseConfig';
import { doc, updateDoc } from 'firebase/firestore';

const Success: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const updateCarStatus = async () => {
      // Obtén el ID del auto desde el localStorage
      const carId = localStorage.getItem('reservedCarId');
      if (carId) {
        try {
          // Actualiza el estado del auto en Firestore
          const carRef = doc(db, 'cars', carId);
          await updateDoc(carRef, { isReserved: true });
          console.log('Car status updated successfully');
          navigate('/');
        } catch (error) {
          console.error('Error updating car status in Firestore:', error);
        }
      } else {
        console.error('Car ID not found');
      }
    };

    updateCarStatus();
  }, [searchParams, navigate]);

  return <div>Processing your payment...</div>;
};

export default Success;
