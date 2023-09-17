import { useEffect, useState } from 'react';
import { localStorageAuthKey, useFirebase } from '../context/FirebaseContext';
import '../styles/Auth.css';
import { useNavigate, useSearchParams } from 'react-router-dom';
import createCheckoutSession from '../lib/createCheckoutSession';

export default function Auth() {
  const { registerUser, login, loginWithGoogle, error, loading } = useFirebase();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  useEffect(() => {
    const credential = localStorage.getItem(localStorageAuthKey);

    if (credential) {
      navigate('/app')
    }
  }, [])
  
  const handleEmailSignIn = async () => {
    const result = await login(email, password)
    if (result.success) {
      if(searchParams.get("from") === 'pricing' && searchParams.get("plan") !== "free") {
        createCheckoutSession(searchParams.get("plan"), result.email)
      } else {
        navigate('/app')
      }
    }
  };
  
  const handleGoogleSignIn = async () => {
    const result = await loginWithGoogle()
    if (result.success) {
      if(searchParams.get("from") === 'pricing' && searchParams.get("plan") !== "free") {
        console.log('from ifif')
        createCheckoutSession(searchParams.get("plan"), result.email)
      } else {
        navigate('/app')
      }
    }
  };
  
  const handleCreateUser = async () => {
    const result = await registerUser(email, password)
    if (result.success) {
      if(searchParams.get("from") === 'pricing' && searchParams.get("plan") !== "free") {
        createCheckoutSession(searchParams.get("plan"), result.email)
      } else {
        navigate('/app')
      }
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <img src="https://uploads-ssl.webflow.com/643f1edf85eba707f45ddfc3/646255f5e004cd49868bd0df_linguosity_logo.svg" alt="Linguosity logo" />
        <h2>Login to Linguosity</h2>
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
        <div className="box">
          <hr className="line"/>
            <h4 className="login-with"><span>Or login with</span></h4>
          <hr className="line"/>
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
  );
}

