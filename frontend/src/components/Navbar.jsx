import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Trophy, LogOut, User, ShieldCheck } from 'lucide-react';

const Navbar = () => {
  const { user, role, studentData, adminData, logout } = useAuth();

  return (
    <header className="top-navbar">
      <div className="nav-brand">
        <Trophy className="brand-icon" style={{ color: '#3b82f6' }} size={28} />
        <span>CAMPUS SPORTS</span>
      </div>

      {user && (
        <div className="nav-user">
          <div className="user-badge">
            <img
              src={user.picture || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
              alt={user.name}
              className="avatar"
              onError={(e) => {
                e.target.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.name);
              }}
            />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span className="user-name">{user.name}</span>
              {role && (
                <span className={`role-tag ${role}`}>
                  {role === 'admin' ? (
                    <><ShieldCheck size={12} style={{ display: 'inline', marginRight: 4 }} /> ADMIN</>
                  ) : (
                    <><User size={12} style={{ display: 'inline', marginRight: 4 }} /> {studentData?.studentId || 'STUDENT'}</>
                  )}
                </span>
              )}
            </div>
          </div>

          <button className="btn-secondary" onClick={logout} style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      )}
    </header>
  );
};

export default Navbar;
