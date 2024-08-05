import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';
import { useAuth } from '../context/AuthContext';
import {
  Typography,
  Container,
  CircularProgress,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Box,
  Alert,
  IconButton
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

const CarDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [car, setCar] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isReserved, setIsReserved] = useState(false);

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const carDoc = doc(db, 'cars', id || '');
        const carSnap = await getDoc(carDoc);
        if (carSnap.exists()) {
          const carData = carSnap.data();
          setCar(carData);
          setIsReserved(carData.isReserved || false);
        } else {
          setError('No such car!');
        }

        if (user) {
          const userDoc = doc(db, 'users', user.uid);
          const userSnap = await getDoc(userDoc);
          if (userSnap.exists()) {
            const userData = userSnap.data();
            if (userData.favorites && userData.favorites.includes(id)) {
              setIsFavorite(true);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching car details:', error);
        setError('Error fetching car details');
      } finally {
        setLoading(false);
      }
    };

    fetchCar();
  }, [id, user]);

  const handleToggleFavorite = async () => {
    if (!user) return;

    try {
      const userDoc = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userDoc);
      if (userSnap.exists()) {
        const userData = userSnap.data();
        let updatedFavorites = [];

        if (userData.favorites) {
          if (userData.favorites.includes(id)) {
            updatedFavorites = userData.favorites.filter((favId: string) => favId !== id);
            setIsFavorite(false);
          } else {
            updatedFavorites = [...userData.favorites, id];
            setIsFavorite(true);
          }
        } else {
          updatedFavorites = [id];
          setIsFavorite(true);
        }

        await updateDoc(userDoc, { favorites: updatedFavorites });
      }
    } catch (error) {
      console.error('Error updating favorites:', error);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!car) {
    return (
      <Container>
        <Typography variant="h6">Car not found</Typography>
      </Container>
    );
  }

  return (
    <Container>
      <Card sx={{ marginTop: '1rem' }}>
        <CardMedia
          component="img"
          alt={`${car.make} ${car.model}`}
          height="300"
          image={car.photoUrl || 'default-image-url.jpg'}
          title={`${car.make} ${car.model}`}
          sx={{
            height: 'auto',
            maxHeight: 500,
            width: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
          }}
        />
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={10}>
              <Typography variant="h4" gutterBottom>{car.make} {car.model}</Typography>
            </Grid>
            <Grid item xs={2}>
              <IconButton onClick={handleToggleFavorite} color="primary">
                {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
              </IconButton>
            </Grid>
          </Grid>
          <Typography variant="h6">Year: {car.year}</Typography>
          <Typography variant="body1">Price: ${car.price}</Typography>
          <Typography variant="body2">{car.description}</Typography>
          {isReserved && <Typography variant="body2" color="error">This car is reserved</Typography>}
        </CardContent>
      </Card>
    </Container>
  );
};

export default CarDetails;
