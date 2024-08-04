import React, { useState } from 'react';
import { Card, CardContent, Typography, IconButton, CardActionArea, Button, Box } from '@mui/material';
import { Favorite as FavoriteIcon, FavoriteBorder as FavoriteBorderIcon } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { db } from '../config/firebaseConfig';
import { doc, updateDoc, collection, addDoc } from 'firebase/firestore';
import axios from 'axios';

interface CarCardProps {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  description: string;
  isFavorite: boolean;
  isReserved?: boolean;
  children?: React.ReactNode;
  onToggleFavorite: (id: string, isFavorite: boolean) => Promise<void>;
}

const CarCard: React.FC<CarCardProps> = ({
  id,
  make,
  model,
  year,
  price,
  description,
  isFavorite,
  isReserved = false,
  children,
  onToggleFavorite
}) => {
  const { user, role } = useAuth();
  const [favorite, setFavorite] = React.useState(isFavorite);
  const [reserved, setReserved] = useState(isReserved);
  const [preferenceId, setPreferenceId] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleFavoriteToggle = async () => {
    if (user) {
      await onToggleFavorite(id, favorite);
      setFavorite(!favorite);
    } else {
      console.log('User must be logged in to add favorites');
    }
  };

  const handleClick = () => {
    if (!reserved) {
      navigate(`/car/${id}`);
    }
  };

  const createPreference = async () => {
    try {
      const response = await axios.post<{ id: string }>('http://localhost:8080/create-preference', {
        title: "Seña para reservar vehiculo",
        price: 5000,
        quantity: 1,
      });
      setPreferenceId(response.data.id);
      window.location.href = `https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=${response.data.id}`;
    } catch (error) {
      console.error('Error creating preference:', error);
    }
  };

  const handleBuy = () => {
    if (user) {
      createPreference().then(() => {
        localStorage.setItem('reservedCarId', id);
        setReserved(true);
      });
    } else {
      console.log('User must be logged in to reserve');
    }
  };

  const handleTeamReserve = async () => {
    if (user && role === 'team') {
      try {
        const carRef = doc(db, 'cars', id);
        await updateDoc(carRef, { isReserved: true });
        setReserved(true);
        console.log('Car reserved successfully');
      } catch (error) {
        console.error('Error reserving car:', error);
      }
    } else {
      console.log('User must be logged in with team role to reserve');
    }
  };

  const handleContact = async () => {
    if (user) {
      try {
        await addDoc(collection(db, 'queries'), {
          carId: id,
          userId: user.uid,
          status: 'pending',
          timestamp: new Date(),
        });
        alert('Consulta enviada');
      } catch (error) {
        console.error('Error sending query: ', error);
        alert('Error al enviar la consulta');
      }
    } else {
      navigate('/login');
    }
  };

  return (
    <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: reserved ? 'rgba(0, 0, 0, 0.5)' : 'inherit', pointerEvents: reserved ? 'none' : 'auto' }}>
      <CardActionArea onClick={handleClick} sx={{ flexGrow: 1 }}>
        <CardContent>
          <Typography variant="h5">{make} {model}</Typography>
          <Typography variant="subtitle1">{year}</Typography>
          <Typography variant="body2" color="textSecondary">{description}</Typography>
          <Typography variant="h6">${price}</Typography>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <IconButton onClick={(e) => {
              e.stopPropagation();
              handleFavoriteToggle();
            }}>
              {favorite ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
            </IconButton>
            {children}
            {role === 'consumer' && (
              <Button variant="contained" color="secondary" onClick={handleContact}>
                Contactar
              </Button>
            )}
          </div>
        </CardContent>
      </CardActionArea>
      {role === 'consumer' && !reserved && (
        <Box sx={{ padding: '15px', display: 'flex', flexDirection: 'column', gap: 1 }}>
          {preferenceId ? (
            <Button variant="contained" color="primary" onClick={() => window.location.href = `https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=${preferenceId}`}>
              Ir a pagar
            </Button>
          ) : (
            <Button variant="contained" color="primary" onClick={handleBuy}>
              Reservar
            </Button>
          )}
        </Box>
      )}
      {role === 'team' && !reserved && (
        <Box sx={{ padding: '15px', display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Button variant="contained" color="secondary" onClick={handleTeamReserve}>
            Reservar Inmediatamente
          </Button>
        </Box>
      )}
    </Card>
  );
};

export default CarCard;
