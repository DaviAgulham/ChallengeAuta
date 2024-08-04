import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';

const UserProfile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div>
      {user ? (
        <div>
          <h1>Welcome, {user.displayName ?? 'User'}</h1>
          <p>Email: {user.email ?? 'No email available'}</p>
        </div>
      ) : (
        <h1>Please log in</h1>
      )}
    </div>
  );
};

export default UserProfile;