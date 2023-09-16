import React from 'react'
import ReactDOM from 'react-dom/client'
import './styles/index.css'
import { FirebaseProvider } from './context/FirebaseContext.jsx'
import { AudioMagnament } from './context/AudioMagnament.jsx'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import App from './pages/App.jsx'
import Landing from './pages/Landing.jsx'
import Auth from './pages/Auth'


const router = createBrowserRouter([
  {
    path: "/",
    element: <Landing />
  },
  {
    path: "/login",
    element: <Auth />
  },
  {
    path: "/app",
    element: <App />
  }
]);


ReactDOM.createRoot(document.getElementById('root')).render(
  <FirebaseProvider>
    <AudioMagnament>
      <RouterProvider router={router} />
    </AudioMagnament>
  </FirebaseProvider>
)
