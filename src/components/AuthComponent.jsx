// AuthComponent.jsx
import React, { useState } from 'react';
import { useFirebaseAuth } from '../context/FirebaseContext';
import '../styles/AuthComponent.css'; // Importa los estilos CSS


function AuthComponent() {
  const { registerUser, login, loginWithGoogle, error, loading } = useFirebaseAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailSignIn = async () => await login(email, password);
  const handleGoogleSignIn = async () => await loginWithGoogle();
  const handleCreateUser = async () => await registerUser(email, password);

  return (
    <div className="auth-container">
      <img width="25" src="https://uploads-ssl.webflow.com/643f1edf85eba707f45ddfc3/646255f5e004cd49868bd0df_linguosity_logo.svg" alt="Linguosity logo" className="logo-image" />
      <h2>Login to Linguosity</h2>
      <div className="auth-form">
        {error && <p className="error-message">{error}</p>}
        <h5>Email</h5>
        <input
          type="email"
          placeholder=""
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <h5>Password</h5>
        <input
          type="password"
          placeholder=""
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className='button-container'>
          <button onClick={handleEmailSignIn}>Log in</button>
        </div>
        <h4 className="login-with"><span>Or login with</span></h4>
        <button className="google-button" onClick={handleGoogleSignIn}>
          Google
        </button>
        <h4 className="have-account">Don't have account?</h4>
        <div className='sign-up'>
          <button onClick={handleCreateUser}>Sign up</button>
        </div>
      </div>
    </div>
  );
}

export default AuthComponent;