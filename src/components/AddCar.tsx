import React from "react";
import { useForm } from "react-hook-form";
import { db } from "../config/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";

const AddCar: React.FC = () => {
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = async (data: any) => {
    try {
      await addDoc(collection(db, "cars"), data);
      reset();
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("make")} placeholder="Make" />
      <input {...register("model")} placeholder="Model" />
      <input {...register("year")} placeholder="Year" />
      <button type="submit">Add Car</button>
    </form>
  );
};

export default AddCar;