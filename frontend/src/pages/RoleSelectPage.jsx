import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { User, ShieldCheck, ArrowRight, KeyRound, AlertCircle, X } from 'lucide-react';

const RoleSelectPage = () => {
  const { user, studentData, selectRole, loginAdmin, error, setError } = useAuth();
  const navigate = useNavigate();

  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminId, setAdminId] = useState('');
  const [adminError, setAdminError] = useState('');

  const handleStudentSelect = () => {
    selectRole('student');
    if (studentData && studentData.studentId) {
      navigate('/student/dashboard');
    } else {
      navigate('/student/register');
    }
  };

  const handleAdminModalOpen = () => {
    setAdminError('');
    setShowAdminModal(true);
  };

  const handleAdminVerify = async (e) => {
    e.preventDefault();
    if (!adminId.trim()) {
      setAdminError('Please enter your Admin ID');
      return;
    }
    const res = await loginAdmin(adminId.trim());
    if (res.success) {
      setShowAdminModal(false);
      navigate('/admin/dashboard');
    } else {
      setAdminError(res.message || 'Invalid Admin ID or Email');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2.5rem 1.5rem',
      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
    }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '2.2rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.5rem' }}>
          SELECT YOUR PORTAL ROLE
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
          Verified Identity: <strong style={{ color: 'var(--primary)' }}>{user?.email}</strong>
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '2rem',
        maxWidth: '780px',
        width: '100%',
      }}>
        {/* STUDENT ROLE CARD */}
        <div
          className="glass-card"
          onClick={handleStudentSelect}
          style={{
            cursor: 'pointer',
            textAlign: 'center',
            padding: '2.75rem 2rem',
            background: '#ffffff',
            boxShadow: '0 15px 40px rgba(0, 0, 0, 0.05)',
          }}
        >
          <div style={{
            width: '68px',
            height: '68px',
            borderRadius: '22px',
            background: 'rgba(5, 150, 105, 0.1)',
            color: 'var(--accent-emerald)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem',
            border: '1px solid rgba(5, 150, 105, 0.25)',
          }}>
            <User size={38} />
          </div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '0.5rem', color: '#0f172a' }}>STUDENT</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.75rem', minHeight: '40px' }}>
            Access student dashboard, digital QR sports pass, view sports equipment stock, upcoming events, and achievements.
          </p>
          <button className="btn-success" style={{ width: '100%', justifyContent: 'center' }}>
            Continue as Student <ArrowRight size={18} />
          </button>
        </div>

        {/* ADMIN ROLE CARD */}
        <div
          className="glass-card"
          onClick={handleAdminModalOpen}
          style={{
            cursor: 'pointer',
            textAlign: 'center',
            padding: '2.75rem 2rem',
            background: '#ffffff',
            boxShadow: '0 15px 40px rgba(0, 0, 0, 0.05)',
          }}
        >
          <div style={{
            width: '68px',
            height: '68px',
            borderRadius: '22px',
            background: 'rgba(217, 119, 6, 0.1)',
            color: 'var(--accent-gold)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem',
            border: '1px solid rgba(217, 119, 6, 0.25)',
          }}>
            <ShieldCheck size={38} />
          </div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '0.5rem', color: '#0f172a' }}>ADMINISTRATOR</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.75rem', minHeight: '40px' }}>
            Scan student QR passes, issue and return equipment, manage inventory, block/unblock students, & schedule events.
          </p>
          <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)' }}>
            Continue as Admin <ArrowRight size={18} />
          </button>
        </div>
      </div>

      {/* ADMIN VERIFICATION MODAL */}
      {showAdminModal && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(15, 23, 42, 0.4)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem',
        }}>
          <div className="glass-card" style={{ maxWidth: '440px', width: '100%', padding: '2rem', background: '#ffffff', position: 'relative' }}>
            <button
              onClick={() => setShowAdminModal(false)}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: '#f1f5f9',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <X size={16} />
            </button>

            <h3 style={{ fontSize: '1.35rem', fontWeight: '800', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0f172a' }}>
              <KeyRound style={{ color: 'var(--accent-gold)' }} size={22} /> Administrator Verification
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              Enter your Admin ID to authorize administrative operations. (Default Admin ID: <strong>ADM001</strong>)
            </p>

            {adminError && (
              <div className="alert alert-error">
                <AlertCircle size={18} />
                <div>{adminError}</div>
              </div>
            )}

            <form onSubmit={handleAdminVerify}>
              <div className="form-group">
                <label>Admin ID</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. ADM001"
                  value={adminId}
                  onChange={(e) => setAdminId(e.target.value)}
                  autoFocus
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowAdminModal(false)}
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ flex: 1, justifyContent: 'center', background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)' }}
                >
                  Verify Admin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoleSelectPage;
