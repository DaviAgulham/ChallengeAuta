import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Box, Button, TextField, Grid } from '@mui/material';

interface FilterData {
  make: string;
  model: string;
  year?: number;
  price?: number;
}

interface FiltersProps {
  onApplyFilters: (filters: FilterData) => void;
}

const Filters: React.FC<FiltersProps> = ({ onApplyFilters}) => {
  const { register, handleSubmit} = useForm<FilterData>();

  const onSubmit: SubmitHandler<FilterData> = (data) => {
    const filters = {
      ...data,
      year: data.year ? Number(data.year) : undefined,
      price: data.price ? Number(data.price) : undefined,
    };
    onApplyFilters(filters);
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mb: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            {...register('make')}
            label="Make"
            fullWidth
            margin="normal"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            {...register('model')}
            label="Model"
            fullWidth
            margin="normal"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            {...register('year')}
            label="Year"
            type="number"
            fullWidth
            margin="normal"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            {...register('price')}
            label="Price"
            type="number"
            fullWidth
            margin="normal"
          />
        </Grid>
        <Grid item xs={12}>
          <Box display="flex" alignItems="center" gap={2} mt={2}>
            <Button type="submit" variant="contained" color="primary">
              Apply Filters
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Filters;
