import { useState, useEffect } from 'react';
import { signInWithGoogle, logout, subscribeToAuthChanges } from '../firebase/authService';
import type { User } from 'firebase/auth';

export const AuthBlock = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  if (user) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '14px', fontWeight: 'bold' }}>{user.displayName}</div>
          <div style={{ fontSize: '12px', color: 'gray' }}>Студент</div>
        </div>
        {user.photoURL && (
          <img 
            src={user.photoURL} 
            alt="Avatar" 
            style={{ width: '35px', height: '35px', borderRadius: '50%' }} 
          />
        )}
        <button onClick={logout} style={{ padding: '4px 8px', cursor: 'pointer' }}>Вийти</button>
      </div>
    );
  }

  return (
    <button 
      onClick={signInWithGoogle}
      style={{
        backgroundColor: '#4285F4',
        color: 'white',
        padding: '8px 16px',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer'
      }}
    >
      Увійти через Google
    </button>
  );
};