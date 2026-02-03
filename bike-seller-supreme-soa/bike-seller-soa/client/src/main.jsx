import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { GoogleOAuthProvider } from '@react-oauth/google';

// Pega aquí tu CLIENT ID real
const CLIENT_ID = "TU_CLIENT_ID_DE_GOOGLE_AQUI.apps.googleusercontent.com"; 

ReactDOM.createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId={CLIENT_ID}>
    <App />
  </GoogleOAuthProvider>,
)