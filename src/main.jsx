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
import Pricing from './pages/Pricing'
import { Grommet } from 'grommet'


const router = createBrowserRouter([
  {
    path: "/",
    element: <Auth />
  },
  {
    path: "/landing",
    element: <Landing />
  },
  {
    path: "/app",
    element: <App />
  },
  {
    path: "/pricing",
    element: <Pricing />
  }
]);

const customTheme = {
  global: {
    colors: {
      brand: '#FCF6EB',
    }
  },

  formField: {
    border: {
      color: 'grey',
      side: 'all'
    },
    label: {
      weight: 'normal',
      size: '12px',
    }
  },

  button: {
    border: {
      radius: '8px',
    },
    primary: {
      color: '#FCF6EB',
    },
  },
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <FirebaseProvider>
    <AudioMagnament>
      <Grommet theme={customTheme}>
        <RouterProvider router={router} />
      </Grommet>
    </AudioMagnament>
  </FirebaseProvider>
)
