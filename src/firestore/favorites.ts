import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

export const addFavorite = async (userId: string, carId: string) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      favorites: arrayUnion(carId)
    });
  } catch (error) {
    console.error('Error adding favorite: ', error);
  }
};

export const removeFavorite = async (userId: string, carId: string) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      favorites: arrayRemove(carId)
    });
  } catch (error) {
    console.error('Error removing favorite: ', error);
  }
};