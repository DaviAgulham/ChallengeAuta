import React, { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';
import { Car } from '../types';
import CarCard from '../components/CarCard';
import { Container, Grid, CircularProgress, Typography } from '@mui/material';
import { useAuth } from '../context/AuthContext';

const Favorites: React.FC = () => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (user?.uid) {
        try {
          console.log('Fetching favorites for user:', user.uid);

          const userDocRef = doc(db, 'users', user.uid);
          const userDocSnapshot = await getDoc(userDocRef);

          if (!userDocSnapshot.exists()) {
            console.log('User document not found.');
            setFavorites([]);
            setLoading(false);
            return;
          }

          const favoriteCarIds = userDocSnapshot.data()?.favorites || [];
          console.log('Favorite car IDs:', favoriteCarIds);

          if (favoriteCarIds.length === 0) {
            setFavorites([]);
            setLoading(false);
            return;
          }

          const favoriteCars: Car[] = [];
          for (const id of favoriteCarIds) {
            const carDocRef = doc(db, 'cars', id);
            const carDocSnapshot = await getDoc(carDocRef);
            if (carDocSnapshot.exists()) {
              const carData = carDocSnapshot.data() as Car;
              carData.id = carDocSnapshot.id;
              favoriteCars.push(carData);
            }
          }

          setFavorites(favoriteCars);
        } catch (error) {
          console.error('Error fetching favorites:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setFavorites([]);
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [user]);

  const handleToggleFavorite = async (id: string, isFavorite: boolean) => {
    if (!user?.uid) return;

    const userDocRef = doc(db, 'users', user.uid);
    const userDocSnapshot = await getDoc(userDocRef);
    const favoriteCarIds = userDocSnapshot.data()?.favorites || [];

    if (isFavorite) {
      const updatedFavorites = favoriteCarIds.filter((carId: string) => carId !== id);
      await updateDoc(userDocRef, { favorites: updatedFavorites });
    } else {
      await updateDoc(userDocRef, { favorites: [...favoriteCarIds, id] });
    }

    setFavorites((prevFavorites) =>
      prevFavorites.filter((car) => car.id !== id)
    );
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>My Favorites</Typography>
      <Grid container spacing={2}>
        {favorites.length > 0 ? (
          favorites.map((car) => (
            <Grid item xs={12} sm={6} md={4} key={car.id || ''}>
              <CarCard
                id={car.id || ''}
                make={car.make}
                model={car.model}
                year={car.year}
                price={car.price}
                description={car.description}
                isFavorite={true}
                isReserved={car.isReserved || false}
                onToggleFavorite={handleToggleFavorite} 
              />
            </Grid>
          ))
        ) : (
          <Typography variant="h6">No favorites found.</Typography>
        )}
      </Grid>
    </Container>
  );
};

export default Favorites;
