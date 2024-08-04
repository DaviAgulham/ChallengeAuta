import { db } from "../config/firebaseConfig";
import { collection, addDoc, getDocs, query, where, deleteDoc, doc } from "firebase/firestore";

export const addUnit = async (unit: any) => {
  try {
    const docRef = await addDoc(collection(db, "units"), unit);
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};

// Obtener todas las unidades
export const getUnits = async () => {
  const querySnapshot = await getDocs(collection(db, "units"));
  const units: any[] = [];
  querySnapshot.forEach((doc) => {
    units.push({ id: doc.id, ...doc.data() });
  });
  return units;
};

// Eliminar una unidad
export const deleteUnit = async (id: string) => {
  try {
    await deleteDoc(doc(db, "units", id));
    console.log("Document successfully deleted!");
  } catch (e) {
    console.error("Error removing document: ", e);
  }
};

// Obtener unidades por filtro
export const getUnitsByFilter = async (filters: any) => {
  const q = query(collection(db, "units"), ...filters);
  const querySnapshot = await getDocs(q);
  const units: any[] = [];
  querySnapshot.forEach((doc) => {
    units.push({ id: doc.id, ...doc.data() });
  });
  return units;
};
