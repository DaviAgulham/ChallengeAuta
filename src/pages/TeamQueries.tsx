import React, { useEffect, useState } from 'react';
import { db } from '../config/firebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { Container, Card, CardContent, Typography, CircularProgress } from '@mui/material';
import { Query, Car } from '../types';

const TeamQueries: React.FC = () => {
  const [queries, setQueries] = useState<Query[]>([]);
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQueriesAndCars = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'queries'));
        const fetchedQueries: Query[] = [];
        const carIds: Set<string> = new Set();

        querySnapshot.forEach((doc) => {
          const queryData = doc.data() as Query;
          queryData.id = doc.id;
          fetchedQueries.push(queryData);
          carIds.add(queryData.carId);
        });

        setQueries(fetchedQueries);

        const carPromises = Array.from(carIds).map(async (carId) => {
          const carDoc = await getDocs(query(collection(db, 'cars'), where('id', '==', carId)));
          return carDoc.docs.map((doc) => doc.data() as Car);
        });

        const carResults = await Promise.all(carPromises);
        setCars(carResults.flat());
      } catch (error) {
        console.error('Error fetching queries and cars: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQueriesAndCars();
  }, []);

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Consultas de Usuarios</Typography>
      {queries.map((query) => {
        const car = cars.find((car) => car.id === query.carId);
        return (
          <Card key={query.id} style={{ marginBottom: '16px' }}>
            <CardContent>
              <Typography variant="h6">Consulta</Typography>
              <Typography variant="body1">Usuario ID: {query.userId}</Typography>
              <Typography variant="body1">Estado: {query.status}</Typography>
              <Typography variant="body2">Fecha: {new Date(query.timestamp).toLocaleString()}</Typography>
              {car && (
                <>
                  <Typography variant="h6">Información del Auto</Typography>
                  <Typography variant="body1">{car.make} {car.model}</Typography>
                  <Typography variant="body2">Año: {car.year}</Typography>
                  <Typography variant="body2">Precio: ${car.price}</Typography>
                  <Typography variant="body2">Descripción: {car.description}</Typography>
                </>
              )}
            </CardContent>
          </Card>
        );
      })}
    </Container>
  );
};

export default TeamQueries;