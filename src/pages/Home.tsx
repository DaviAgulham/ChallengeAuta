import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where, deleteDoc, doc, Query, QueryConstraint } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';
import { Car } from '../types';
import CarCard from '../components/CarCard';
import Filters from '../components/Filters';
import { Container, Grid, CircularProgress, Typography, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, Box, Collapse } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { addFavorite, removeFavorite } from '../firestore/favorites';

const Home: React.FC = () => {
  const { user, role } = useAuth();
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<any>({});
  const [showFilters, setShowFilters] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedCarId, setSelectedCarId] = useState<string | null>(null);

  const applyFilters = (filters: any) => {
    setFilters(filters);
  };

  const toggleFilters = () => {
    setShowFilters((prevShowFilters) => !prevShowFilters);
  };

  useEffect(() => {
    const fetchCars = async () => {
      setLoading(true);
      try {
        let carQuery: Query<any> = collection(db, 'cars');

        const queryConstraints: QueryConstraint[] = [];
        if (filters.make) {
          queryConstraints.push(where('make', '>=', filters.make), where('make', '<', filters.make + '\uf8ff'));
        }
        if (filters.model) {
          queryConstraints.push(where('model', '>=', filters.model), where('model', '<', filters.model + '\uf8ff'));
        }
        if (filters.year !== undefined) {
          queryConstraints.push(where('year', '==', filters.year));
        }
        if (filters.price !== undefined) {
          queryConstraints.push(where('price', '<=', filters.price));
        }

        if (queryConstraints.length > 0) {
          carQuery = query(carQuery, ...queryConstraints);
        }

        const querySnapshot = await getDocs(carQuery);
        const carList: Car[] = [];
        querySnapshot.forEach((doc) => {
          const carData = doc.data() as Car;
          carData.id = doc.id;
          carList.push(carData);
        });
        setCars(carList);
      } catch (error) {
        console.error('Error fetching cars:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, [filters]);

  const handleDelete = async () => {
    if (selectedCarId) {
      try {
        await deleteDoc(doc(db, 'cars', selectedCarId));
        setCars((prevCars) => prevCars.filter((car) => car.id !== selectedCarId));
        handleClose();
      } catch (error) {
        console.error('Error deleting car:', error);
      }
    }
  };

  const handleOpen = (carId: string) => {
    setSelectedCarId(carId);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedCarId(null);
  };

  const handleToggleFavorite = async (carId: string, isFavorite: boolean) => {
    if (user) {
      if (isFavorite) {
        await removeFavorite(user.uid, carId);
      } else {
        await addFavorite(user.uid, carId);
      }
      setCars((prevCars) =>
        prevCars.map((car) =>
          car.id === carId ? { ...car, isFavorite: !isFavorite } : car
        )
      );
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Car Catalog</Typography>
      <Box mb={2}>
        <Button variant="contained" color="primary" onClick={toggleFilters}>
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </Button>
      </Box>
      <Collapse in={showFilters} timeout="auto" unmountOnExit>
        <Filters onApplyFilters={applyFilters}/>
      </Collapse>
      <Grid container spacing={2}>
        {cars.map((car) => (
          <Grid item xs={12} sm={6} md={4} key={car.id || ''}>
            <CarCard
              id={car.id || ''}
              make={car.make}
              model={car.model}
              year={car.year}
              price={car.price}
              description={car.description}
              isFavorite={car.isFavorite || false}
              isReserved={car.isReserved || false}
              onToggleFavorite={handleToggleFavorite}
            >
              {role === 'team' && (
                <IconButton
                  color="error"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpen(car.id || '');
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              )}
            </CarCard>
          </Grid>
        ))}
      </Grid>

      <Dialog
        open={open}
        onClose={handleClose}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this car?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Home;
