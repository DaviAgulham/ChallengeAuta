import { db } from "../config/firebaseConfig";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { UserRole } from "../types";

// Asigna un rol a un usuario en Firestore
export const assignRole = async (userId: string, role: UserRole) => { 
  try {
    const userDocRef = doc(db, "users", userId);
    await setDoc(userDocRef, { role }, { merge: true });
  } catch (error) {
    console.error("Error assigning role:", error);
  }
};

// Obtiene el rol del usuario desde Firestore
export const getUserRole = async (userId: string): Promise<UserRole | undefined> => {
  try {
    const userDocRef = doc(db, "users", userId);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      return userDoc.data()?.role as UserRole;
    }
  } catch (error) {
    console.error("Error getting user role:", error);
  }
  return undefined;
};