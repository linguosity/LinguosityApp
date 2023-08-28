// AuthComponent.jsx
import React, { useState } from 'react';
import { useFirebaseAuth } from './FirebaseContext';
import './AuthComponent.css'; // Importa los estilos CSS

function AuthComponent() {
  const { registerUser, login, loginWithGoogle, error, loading } = useFirebaseAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailSignIn = async () => await login(email, password);
  const handleGoogleSignIn = async () => await loginWithGoogle();
  const handleCreateUser = async () => await registerUser(email, password);

  return (
    <div className="auth-container">
      <h2>Authentication</h2>
      <div className="auth-form">
        {error && <p className="error-message">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className='button-container'>
          <button onClick={handleEmailSignIn}>Log in</button>
          <button onClick={handleCreateUser}>Register</button>
        </div>
        <button className="google-button" onClick={handleGoogleSignIn}>
          Log in with Google
        </button>
      </div>
    </div>
  );
}

export default AuthComponent;
