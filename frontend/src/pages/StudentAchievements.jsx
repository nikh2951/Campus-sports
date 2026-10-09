import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getStudentAchievements } from '../services/api';
import { Award, Trophy, Medal, Calendar, CheckCircle } from 'lucide-react';

const StudentAchievements = () => {
  const { studentData } = useAuth();
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (studentData?.studentId) {
      getStudentAchievements(studentData.studentId)
        .then((res) => {
          setAchievements(res.data || []);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [studentData]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      <div>
        <h2 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#fff' }}>MY SPORTS ACHIEVEMENTS</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Your verified sports honors, medals, and tournament awards.
        </p>
      </div>

      {achievements.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '3.5rem' }}>
          <Trophy size={56} style={{ color: 'var(--text-dim)', marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '0.5rem' }}>No Achievements Logged Yet</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Participate in campus sports events to earn official recognition and medals on your profile!
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {achievements.map((item) => (
            <div key={item.id} className="glass-card" style={{ borderLeft: '4px solid var(--accent-gold)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span className="status-pill upcoming" style={{ background: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b' }}>
                  <Medal size={14} /> {item.position || 'AWARD'}
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                  {item.achievementDate}
                </span>
              </div>

              <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#fff', marginBottom: '0.4rem' }}>
                {item.title}
              </h3>

              <p style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--primary)', marginBottom: '0.6rem' }}>
                🏆 {item.competition}
              </p>

              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                {item.description}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentAchievements;
