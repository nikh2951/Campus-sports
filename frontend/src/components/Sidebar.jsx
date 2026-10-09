import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Dumbbell,
  Calendar,
  Award,
  UserCheck,
  QrCode,
  PackageCheck,
  UserX,
  PlusCircle,
  Shield,
} from 'lucide-react';

const Sidebar = () => {
  const { role } = useAuth();

  return (
    <aside style={{
      width: '260px',
      background: 'rgba(15, 23, 42, 0.95)',
      borderRight: '1px solid var(--border-color)',
      padding: '1.5rem 1rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem',
      minHeight: 'calc(100vh - 75px)',
    }}>
      <div style={{
        padding: '0.5rem 0.75rem',
        fontSize: '0.75rem',
        fontWeight: '700',
        color: 'var(--text-dim)',
        textTransform: 'uppercase',
        letterSpacing: '1px',
        marginBottom: '0.5rem',
      }}>
        {role === 'admin' ? 'Administrative Menu' : 'Student Navigation'}
      </div>

      {role === 'student' && (
        <>
          <NavLink to="/student/dashboard" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <LayoutDashboard size={18} /> Dashboard
          </NavLink>
          <NavLink to="/student/sports" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <Dumbbell size={18} /> Sports & Equipment
          </NavLink>
          <NavLink to="/student/events" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <Calendar size={18} /> Upcoming Events
          </NavLink>
          <NavLink to="/student/achievements" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <Award size={18} /> Achievements
          </NavLink>
          <NavLink to="/student/profile" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <UserCheck size={18} /> My Profile & QR
          </NavLink>
        </>
      )}

      {role === 'admin' && (
        <>
          <NavLink to="/admin/dashboard" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <LayoutDashboard size={18} /> Dashboard
          </NavLink>
          <NavLink to="/admin/assign-equipment" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <QrCode size={18} /> Scan & Assign Equipment
          </NavLink>
          <NavLink to="/admin/assigned-list" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <PackageCheck size={18} /> Issued Equipment & Returns
          </NavLink>
          <NavLink to="/admin/blocked-students" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <UserX size={18} /> Blocked Students
          </NavLink>
          <NavLink to="/admin/manage-sports" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <Dumbbell size={18} /> Manage Sports
          </NavLink>
          <NavLink to="/admin/manage-inventory" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <PlusCircle size={18} /> Manage Inventory
          </NavLink>
          <NavLink to="/admin/manage-events" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <Calendar size={18} /> Event Management
          </NavLink>
          <NavLink to="/admin/manage-achievements" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <Award size={18} /> Achievements Management
          </NavLink>
        </>
      )}

      <style>{`
        .sidebar-link {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          padding: 0.8rem 1rem;
          color: var(--text-muted);
          font-weight: 500;
          font-size: 0.95rem;
          border-radius: var(--radius-md);
          transition: var(--transition-fast);
          text-decoration: none;
        }

        .sidebar-link:hover {
          background: rgba(30, 41, 59, 0.8);
          color: #fff;
        }

        .sidebar-link.active {
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(37, 99, 235, 0.1) 100%);
          color: var(--primary);
          border-left: 4px solid var(--primary);
          font-weight: 600;
        }
      `}</style>
    </aside>
  );
};

export default Sidebar;
