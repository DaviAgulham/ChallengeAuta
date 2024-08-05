import React, { useState } from 'react';
import { storage } from '../config/firebaseConfig';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { Button, LinearProgress } from '@mui/material';

interface UploadCarPhotoProps {
  setPhotoUrl: (url: string) => void;
}

const UploadCarPhoto: React.FC<UploadCarPhotoProps> = ({ setPhotoUrl }) => {
  const [progress, setProgress] = useState(0);

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const storageRef = ref(storage, `car-photos/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(progress);
      },
      (error) => {
        console.error('Upload failed:', error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setPhotoUrl(downloadURL);
        });
      }
    );
  };

  return (
    <div>
      <input
        accept="image/*"
        style={{ display: 'none' }}
        id="upload-photo"
        type="file"
        onChange={handleUpload}
      />
      <label htmlFor="upload-photo">
        <Button variant="contained" component="span" color="primary" style={{ marginBottom: 8 }}>
          Upload Photo
        </Button>
      </label>
      {progress > 0 && <LinearProgress variant="determinate" value={progress} />}
    </div>
  );
};

export default UploadCarPhoto;
