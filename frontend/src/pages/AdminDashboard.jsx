import React, { useEffect, useState } from 'react';
import { getDashboardStats } from '../services/api';
import { Users, Dumbbell, Package, PackageCheck, Calendar, UserX, ArrowRight, QrCode } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalSports: 0,
    totalEquipment: 0,
    availableEquipment: 0,
    issuedEquipment: 0,
    upcomingEvents: 0,
    blockedStudents: 0,
  });

  useEffect(() => {
    getDashboardStats()
      .then((res) => setStats(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#fff' }}>ADMINISTRATIVE DASHBOARD</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Live metrics and operations for Campus Sports Department.
          </p>
        </div>

        <Link to="/admin/assign-equipment" className="btn-primary">
          <QrCode size={18} /> Quick Scan & Assign Equipment
        </Link>
      </div>

      {/* STATS CARDS */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon"><Users /></div>
          <div className="stat-info">
            <div className="value">{stats.totalStudents}</div>
            <div className="label">Registered Students</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(6, 182, 212, 0.15)', color: '#06b6d4' }}>
            <Dumbbell />
          </div>
          <div className="stat-info">
            <div className="value">{stats.totalSports}</div>
            <div className="label">Active Sports</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
            <Package />
          </div>
          <div className="stat-info">
            <div className="value">{stats.availableEquipment} / {stats.totalEquipment}</div>
            <div className="label">Available Equipment Units</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(236, 72, 153, 0.15)', color: '#ec4899' }}>
            <PackageCheck />
          </div>
          <div className="stat-info">
            <div className="value">{stats.issuedEquipment}</div>
            <div className="label">Currently Issued Items</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}>
            <Calendar />
          </div>
          <div className="stat-info">
            <div className="value">{stats.upcomingEvents}</div>
            <div className="label">Upcoming Events</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(244, 63, 94, 0.15)', color: '#f43f5e' }}>
            <UserX />
          </div>
          <div className="stat-info">
            <div className="value">{stats.blockedStudents}</div>
            <div className="label">Blocked Students</div>
          </div>
        </div>
      </div>

      {/* QUICK ACTIONS GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
        <div className="glass-card">
          <h3 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '0.5rem', color: 'var(--primary)' }}>
            Equipment Issuance
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
            Scan student QR passes using your webcam or mobile camera to issue equipment instantly with automated inventory validation.
          </p>
          <Link to="/admin/assign-equipment" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
            Open Scanner <ArrowRight size={16} />
          </Link>
        </div>

        <div className="glass-card">
          <h3 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '0.5rem', color: 'var(--accent-emerald)' }}>
            Returns & Assignment History
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
            Track currently issued sports gear, verify student returns, and restore stock back to the university inventory.
          </p>
          <Link to="/admin/assigned-list" className="btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
            Manage Returns <ArrowRight size={16} />
          </Link>
        </div>

        <div className="glass-card">
          <h3 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '0.5rem', color: 'var(--accent-rose)' }}>
            Blocked Students Portal
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
            Manage blacklisted or blocked students with documented reasons, preventing unauthorized equipment issuance.
          </p>
          <Link to="/admin/blocked-students" className="btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
            View Blocked List <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
