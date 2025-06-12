import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../config/firebaseStorage';

export const uploadProfileImage = async (uri: string, userId: string): Promise<string> => {
  console.log("subir imagenes.");
  
  const response = await fetch(uri);
  const blob = await response.blob();
  const imageRef = ref(storage, `profile/${userId}.jpg`);

  await uploadBytes(imageRef, blob);
  const url = await getDownloadURL(imageRef);
  return url;
};

export const deleteProfileImage = async (userId: string) => {
  const imageRef = ref(storage, `profile/${userId}.jpg`);
  await deleteObject(imageRef);
};