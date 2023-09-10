import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/index.css'
import { FirebaseProvider } from './context/FirebaseContext.jsx'
import { AudioMagnament } from './context/AudioMagnament.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
    <FirebaseProvider>
      <AudioMagnament>
        <App />
      </AudioMagnament>
    </FirebaseProvider>
)
