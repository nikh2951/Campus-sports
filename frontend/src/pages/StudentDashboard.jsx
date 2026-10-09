import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUpcomingEvents, getStudentAssignments, getStudentAchievements, getAllSports } from '../services/api';
import { Trophy, Dumbbell, Calendar, Award, PackageCheck, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

const StudentDashboard = () => {
  const { studentData } = useAuth();
  const [events, setEvents] = useState([]);
  const [myAssignments, setMyAssignments] = useState([]);
  const [myAchievements, setMyAchievements] = useState([]);
  const [sportsCount, setSportsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (studentData?.studentId) {
      Promise.all([
        getUpcomingEvents(),
        getStudentAssignments(studentData.studentId),
        getStudentAchievements(studentData.studentId),
        getAllSports(),
      ])
        .then(([eventsRes, assignRes, achieveRes, sportsRes]) => {
          setEvents(eventsRes.data || []);
          setMyAssignments(assignRes.data || []);
          setMyAchievements(achieveRes.data || []);
          setSportsCount(sportsRes.data?.length || 0);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [studentData]);

  if (!studentData) return null;

  const activeIssuedCount = myAssignments.filter((a) => a.status === 'ISSUED').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* WELCOME BANNER */}
      <div className="glass-card" style={{
        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%)',
        border: '1px solid var(--border-glow)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1.5rem',
      }}>
        <div>
          <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--accent-cyan)', textTransform: 'uppercase', letterSpacing: '1px' }}>
            STUDENT DASHBOARD
          </span>
          <h2 style={{ fontSize: '2rem', fontWeight: '800', color: '#fff', margin: '0.2rem 0' }}>
            Welcome back, {studentData.fullName}!
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            ID: <strong style={{ color: 'var(--primary)' }}>{studentData.studentId}</strong> | {studentData.branch} - Sec {studentData.section}
          </p>
        </div>

        {studentData.isBlocked && (
          <div className="status-pill blocked" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
            <AlertTriangle size={16} /> BLOCKED FROM ISSUING EQUIPMENT
          </div>
        )}
      </div>

      {/* STATS GRID */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon"><Dumbbell /></div>
          <div className="stat-info">
            <div className="value">{sportsCount}</div>
            <div className="label">Available Sports</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
            <PackageCheck />
          </div>
          <div className="stat-info">
            <div className="value">{activeIssuedCount}</div>
            <div className="label">Currently Issued Items</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}>
            <Calendar />
          </div>
          <div className="stat-info">
            <div className="value">{events.length}</div>
            <div className="label">Upcoming Events</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(236, 72, 153, 0.15)', color: '#ec4899' }}>
            <Award />
          </div>
          <div className="stat-info">
            <div className="value">{myAchievements.length}</div>
            <div className="label">My Achievements</div>
          </div>
        </div>
      </div>

      {/* MY ISSUED EQUIPMENT */}
      <div className="glass-card">
        <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <PackageCheck style={{ color: 'var(--primary)' }} /> My Currently Issued Equipment
        </h3>

        {myAssignments.filter((a) => a.status === 'ISSUED').length === 0 ? (
          <p style={{ color: 'var(--text-dim)', fontStyle: 'italic' }}>
            You do not currently have any equipment issued. Visit the Admin counter to request sports equipment!
          </p>
        ) : (
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Assignment Code</th>
                  <th>Equipment</th>
                  <th>Quantity</th>
                  <th>Issue Time</th>
                  <th>Issued By</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {myAssignments.filter((a) => a.status === 'ISSUED').map((item) => (
                  <tr key={item.id}>
                    <td style={{ fontWeight: '700', color: 'var(--primary)' }}>{item.assignmentCode}</td>
                    <td>{item.equipment?.name}</td>
                    <td>{item.quantity}</td>
                    <td>{new Date(item.issueTime).toLocaleString()}</td>
                    <td>{item.issuedByAdmin}</td>
                    <td>
                      <span className="status-pill issued">ISSUED</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* UPCOMING EVENTS PREVIEW */}
      <div className="glass-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calendar style={{ color: 'var(--accent-gold)' }} /> Upcoming Sports Events
          </h3>
          <Link to="/student/events" style={{ fontSize: '0.85rem', fontWeight: '600' }}>View All Events &rarr;</Link>
        </div>

        {events.length === 0 ? (
          <p style={{ color: 'var(--text-dim)' }}>No upcoming sports events scheduled at the moment.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
            {events.slice(0, 3).map((event) => (
              <div key={event.id} style={{
                background: 'rgba(30, 41, 59, 0.6)',
                border: '1px solid var(--border-color)',
                borderRadius: '12px',
                padding: '1.25rem',
              }}>
                <span className="status-pill upcoming" style={{ marginBottom: '0.5rem' }}>
                  {event.sportName || 'CAMPUS EVENT'}
                </span>
                <h4 style={{ fontSize: '1.1rem', fontWeight: '700', margin: '0.4rem 0' }}>{event.eventName}</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>📍 {event.venue}</p>
                <p style={{ fontSize: '0.85rem', color: 'var(--primary)', marginTop: '0.2rem' }}>
                  📅 {new Date(event.eventDate).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
