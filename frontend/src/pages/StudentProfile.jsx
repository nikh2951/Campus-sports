import React from 'react';
import { useAuth } from '../context/AuthContext';
import StudentQRCard from '../components/StudentQRCard';
import { UserCheck, Mail, Phone, BookOpen, Layers, ShieldCheck, AlertTriangle } from 'lucide-react';

const StudentProfile = () => {
  const { studentData } = useAuth();

  if (!studentData) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h2 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#fff' }}>STUDENT PROFILE & DIGITAL PASS</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Your verified campus sports profile and scannable equipment issuance QR code.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        gap: '2rem',
        alignItems: 'start',
      }}>
        {/* PROFILE DETAILS CARD */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.25rem' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent-cyan) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: '1.5rem',
              fontWeight: '800',
            }}>
              {studentData.fullName.charAt(0)}
            </div>

            <div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#fff' }}>{studentData.fullName}</h3>
              <span className="status-pill available" style={{ marginTop: '0.25rem' }}>
                <ShieldCheck size={12} /> VERIFIED STUDENT
              </span>
            </div>
          </div>

          {studentData.isBlocked && (
            <div className="alert alert-error" style={{ marginBottom: '1.5rem' }}>
              <AlertTriangle size={20} />
              <div>
                <strong>BLOCKED PROFILE:</strong> {studentData.blockReason || 'Blocked by sports administration'}
              </div>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <UserCheck style={{ color: 'var(--primary)' }} size={20} />
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'block', textTransform: 'uppercase' }}>Student ID</span>
                <span style={{ fontSize: '1.1rem', fontWeight: '700', color: '#fff' }}>{studentData.studentId}</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <Mail style={{ color: 'var(--accent-cyan)' }} size={20} />
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'block', textTransform: 'uppercase' }}>Verified Email</span>
                <span style={{ fontSize: '0.95rem', fontWeight: '600', color: '#fff' }}>{studentData.email}</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <Phone style={{ color: 'var(--accent-emerald)' }} size={20} />
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'block', textTransform: 'uppercase' }}>Phone Number</span>
                <span style={{ fontSize: '0.95rem', fontWeight: '600', color: '#fff' }}>{studentData.phoneNumber}</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <BookOpen style={{ color: 'var(--accent-gold)' }} size={20} />
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'block', textTransform: 'uppercase' }}>Branch / Department</span>
                <span style={{ fontSize: '0.95rem', fontWeight: '600', color: '#fff' }}>{studentData.branch}</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <Layers style={{ color: '#ec4899' }} size={20} />
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'block', textTransform: 'uppercase' }}>Section</span>
                <span style={{ fontSize: '0.95rem', fontWeight: '600', color: '#fff' }}>Section {studentData.section}</span>
              </div>
            </div>
          </div>
        </div>

        {/* QR CARD */}
        <div>
          <StudentQRCard student={studentData} />
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
