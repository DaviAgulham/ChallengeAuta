import React from "react";
import { useForm } from "react-hook-form";
import { addUnit } from "../firestore/firestoreFunction";
import { Button, TextField, Typography } from "@mui/material";

const AddUnit: React.FC = () => {
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data: any) => {
    await addUnit(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Typography variant="h4">Add Unit</Typography>
      <TextField {...register("make")} label="Make" fullWidth margin="normal" />
      <TextField {...register("model")} label="Model" fullWidth margin="normal" />
      <TextField {...register("year")} label="Year" fullWidth margin="normal" />
      <Button type="submit" variant="contained" color="primary">Add Unit</Button>
    </form>
  );
};

export default AddUnit;