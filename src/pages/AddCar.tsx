import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { db } from '../config/firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { Button, TextField, Typography, Container, Box, Snackbar, Alert } from '@mui/material';
import UploadCarPhoto from '../components/UploadCarPhoto';

interface FormData {
  make: string;
  model: string;
  year: number;
  price: number;
  description: string;
}

const AddCar: React.FC = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>();
  const { role } = useAuth();
  
  // Estados para manejar el feedback
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  const [photoUrl, setPhotoUrl] = useState('');

  if (role !== 'team') {
    return <Typography variant="h6" color="error">Access Denied</Typography>;
  }

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      const newCar = {
        ...data,
        isFavorite: false,
        isReserved: false,
        photoUrl
      };

      await addDoc(collection(db, 'cars'), newCar);
      setSnackbarMessage('Vehículo registrado con éxito');
      setSnackbarSeverity('success');
      reset();
      setPhotoUrl(''); // Reset photoUrl after successful submission
    } catch (error) {
      console.error('Error adding document: ', error);
      setSnackbarMessage('Error al registrar el vehículo');
      setSnackbarSeverity('error');
    } finally {
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom style={{ marginTop: 16 }}>Add a New Car</Typography>
      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <TextField
          {...register('make', { required: 'Make is required' })}
          label="Make"
          fullWidth
          margin="normal"
          error={!!errors.make}
          helperText={errors.make?.message}
        />
        <TextField
          {...register('model', { required: 'Model is required' })}
          label="Model"
          fullWidth
          margin="normal"
          error={!!errors.model}
          helperText={errors.model?.message}
        />
        <TextField
          {...register('year', { 
            required: 'Year is required', 
            valueAsNumber: true,
            min: { value: 1900, message: 'Year must be after 1900' },
            max: { value: new Date().getFullYear(), message: 'Year cannot be in the future' }
          })}
          label="Year"
          fullWidth
          margin="normal"
          type="number"
          error={!!errors.year}
          helperText={errors.year?.message}
        />
        <TextField
          {...register('price', { 
            required: 'Price is required',
            valueAsNumber: true,
            min: { value: 0, message: 'Price must be greater than zero' }
          })}
          label="Price"
          fullWidth
          margin="normal"
          type="number"
          error={!!errors.price}
          helperText={errors.price?.message}
        />
        <TextField
          {...register('description', { required: 'Description is required' })}
          label="Description"
          fullWidth
          margin="normal"
          multiline
          rows={4}
          error={!!errors.description}
          helperText={errors.description?.message}
        />
        <UploadCarPhoto setPhotoUrl={setPhotoUrl} />
        <Button type="submit" variant="contained" color="primary" style={{ marginTop: 16 }}>
          Add Car
        </Button>
      </Box>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AddCar;
