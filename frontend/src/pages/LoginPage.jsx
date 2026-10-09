import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { Trophy, AlertCircle, Info, ShieldCheck } from 'lucide-react';

const LoginPage = () => {
  const { loginWithGoogle, config, error, setError } = useAuth();
  const navigate = useNavigate();

  const rawClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '863615578552-683sp9fjgvctntinelkve3pc170kgvg4.apps.googleusercontent.com';
  const isGoogleConfigured = rawClientId && rawClientId.trim().length > 10 && !rawClientId.includes('placeholder');

  const handleGoogleSuccess = async (credentialResponse) => {
    setError(null);
    const res = await loginWithGoogle(credentialResponse.credential);
    if (res.success) {
      navigate('/role-select');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      padding: '2rem 1.5rem',
      background: `linear-gradient(135deg, rgba(248, 250, 252, 0.92) 0%, rgba(241, 245, 249, 0.96) 100%), url('https://images.unsplash.com/photo-1541252260730-0412e8e2108e?w=1600&auto=format&fit=crop&q=80') center/cover no-repeat fixed`,
    }}>
      <div className="glass-card" style={{
        maxWidth: '480px',
        width: '100%',
        padding: '3rem 2.5rem',
        textAlign: 'center',
        background: 'rgba(255, 255, 255, 0.88)',
        backdropFilter: 'blur(25px)',
        border: '1px solid rgba(255, 255, 255, 0.95)',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.06)',
      }}>
        {/* ICON HEADER */}
        <div style={{
          width: '76px',
          height: '76px',
          borderRadius: '24px',
          background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
          border: '1px solid rgba(37, 99, 235, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.5rem',
          boxShadow: '0 8px 20px rgba(37, 99, 235, 0.1)',
        }}>
          <Trophy size={42} style={{ color: '#2563eb' }} />
        </div>

        <h1 style={{
          fontSize: '2.2rem',
          fontWeight: '800',
          letterSpacing: '-0.8px',
          color: '#0f172a',
          marginBottom: '0.4rem',
        }}>
          CAMPUS SPORTS
        </h1>
        
        <p style={{
          fontSize: '0.82rem',
          fontWeight: '700',
          letterSpacing: '2px',
          color: '#0284c7',
          textTransform: 'uppercase',
          marginBottom: '2.25rem',
        }}>
          ONE CAMPUS. EVERY SPORT. ONE TEAM.
        </p>

        {/* DOMAIN POLICY INFO BADGE */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: '#f0fdf4',
          border: '1px solid #bbf7d0',
          padding: '0.5rem 1rem',
          borderRadius: '20px',
          fontSize: '0.82rem',
          fontWeight: '600',
          color: '#166534',
          marginBottom: '2rem',
        }}>
          <ShieldCheck size={16} /> Approved College Email Domain: <strong>@anurag.edu.in</strong>
        </div>

        {/* OAUTH ERROR OR DOMAIN FAILURE DISPLAY */}
        {error && (
          <div className="alert alert-error" style={{ textAlign: 'left', marginBottom: '1.5rem' }}>
            <AlertCircle size={20} style={{ flexShrink: 0 }} />
            <div style={{ fontSize: '0.88rem' }}>{error}</div>
          </div>
        )}

        {!isGoogleConfigured && !error && (
          <div className="alert alert-warning" style={{ textAlign: 'left', marginBottom: '1.5rem' }}>
            <Info size={20} style={{ flexShrink: 0 }} />
            <div style={{ fontSize: '0.85rem' }}>
              <strong>Google OAuth Setup Required:</strong><br />
              Please set <code>VITE_GOOGLE_CLIENT_ID</code> in frontend <code>.env</code> file with a valid Google Cloud OAuth Client ID for <code>http://localhost:5173</code>.
            </div>
          </div>
        )}

        {/* PRIMARY GOOGLE LOGIN BUTTON */}
        <div style={{ display: 'flex', justifyContent: 'center', margin: '1rem 0 2rem' }}>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setError('Google Sign-In popup was closed or authentication failed.')}
            useOneTap={false}
            theme="outline"
            size="large"
            shape="pill"
            text="continue_with"
            width="320"
          />
        </div>

        <div style={{
          fontSize: '0.8rem',
          color: '#94a3b8',
          borderTop: '1px solid #f1f5f9',
          paddingTop: '1.25rem',
        }}>
          University Sports Department & Equipment Issuance System
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
