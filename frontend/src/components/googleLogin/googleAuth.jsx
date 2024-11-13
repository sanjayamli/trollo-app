import React from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { toast } from 'react-toastify';
import api from "../../services/api";
const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
console.log(clientId,'clientid')

const GoogleLoginButton = () => {
  const handleGoogleLogin = async (response) => {
    const { credential } = response;

    try {
      const res = await api.post('/users/google-login', { tokenId: credential });
      const { token } = res.data;
      
      localStorage.setItem('token', token);
      
      window.location.href = '/tasks'; 
    } catch (error) {
      console.error("Google login error:", error);
      toast.error("Google login failed.");
    }
  };

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <GoogleLogin
        onSuccess={handleGoogleLogin}
        onError={() => toast.error("Google login failed.")}
        useOneTap
      />
    </GoogleOAuthProvider>
  );
};

export default GoogleLoginButton;
