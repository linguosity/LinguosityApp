// AuthComponent.jsx
import React, { useState } from 'react';
import { useFirebaseAuth } from '../context/FirebaseContext';
import '../styles/AuthComponent.css'; // Importa los estilos CSS
import OnboardingScreen from './OnBoarding';



function AuthComponent() {
  const { registerUser, login, loginWithGoogle, error, loading } = useFirebaseAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailSignIn = async () => await login(email, password);
  const handleGoogleSignIn = async () => await loginWithGoogle();
  const handleCreateUser = async () => await registerUser(email, password);


const [showOnboarding, setShowOnboarding] = useState(true);

const closeOnboarding = () => {
  setShowOnboarding(false);
};

  return (
    <>
    <div className="main-container">
    <div>
    {showOnboarding && <OnboardingScreen onClose={closeOnboarding} />}
    </div>
    <div className="auth-container">
      <div className="auth-form">
        <img src="https://uploads-ssl.webflow.com/643f1edf85eba707f45ddfc3/646255f5e004cd49868bd0df_linguosity_logo.svg" alt="Linguosity logo" />
        <h2>Linguosity</h2>
        {error && <p className="error-message">{error}</p>}
        <h5 className="email-heading">Email</h5>
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
        <div class="box">
          <hr class="line"/>
            <h4 className="login-with"><span>Or login with</span></h4>
          <hr class="line"/>
        </div>
        <button className="google-button" onClick={handleGoogleSignIn}>
          Sign-in with Google
        </button>
        <h4 className="have-account">Don't have account?</h4>
        <div className='sign-up'>
          <button onClick={handleCreateUser}>Sign up</button>
        </div>
      </div>
    </div>
    </div>
    </>
  );
}

export default AuthComponent;
