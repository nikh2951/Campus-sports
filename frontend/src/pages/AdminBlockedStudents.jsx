import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getBlockedStudents, getAllStudents, blockStudent, unblockStudent } from '../services/api';
import { UserX, ShieldAlert, CheckCircle, Search, Lock, Unlock } from 'lucide-react';

const AdminBlockedStudents = () => {
  const { adminData } = useAuth();
  const [blockedList, setBlockedList] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [blockReason, setBlockReason] = useState('');
  
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchBlocked = () => {
    setLoading(true);
    Promise.all([getBlockedStudents(), getAllStudents()])
      .then(([blockedRes, allRes]) => {
        setBlockedList(blockedRes.data || []);
        setAllStudents(allRes.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchBlocked();
  }, []);

  const handleBlockSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');

    if (!selectedStudentId || !blockReason.trim()) {
      setErrorMsg('Please select a student and provide a block reason.');
      return;
    }

    const adminIdToUse = adminData?.adminId || 'ADM001';

    try {
      await blockStudent(selectedStudentId, blockReason.trim(), adminIdToUse);
      setSuccessMsg(`Student ${selectedStudentId} blocked successfully.`);
      setSelectedStudentId('');
      setBlockReason('');
      fetchBlocked();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to block student');
    }
  };

  const handleUnblock = async (studentId) => {
    setSuccessMsg('');
    setErrorMsg('');
    try {
      await unblockStudent(studentId);
      setSuccessMsg(`Student ${studentId} unblocked successfully.`);
      fetchBlocked();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to unblock student');
    }
  };

  const eligibleToBlock = allStudents.filter((s) => !s.isBlocked);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      <div>
        <h2 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#fff' }}>BLOCKED STUDENT MANAGEMENT</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Restrict equipment issuance to flagged students or reinstate eligible sports privileges.
        </p>
      </div>

      {successMsg && (
        <div className="alert alert-success">
          <CheckCircle size={20} />
          <div>{successMsg}</div>
        </div>
      )}

      {errorMsg && (
        <div className="alert alert-error">
          <ShieldAlert size={20} />
          <div>{errorMsg}</div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
        {/* BLOCK STUDENT FORM */}
        <div className="glass-card">
          <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '1.25rem', color: 'var(--accent-rose)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Lock size={20} /> Block Student
          </h3>

          <form onSubmit={handleBlockSubmit}>
            <div className="form-group">
              <label>Select Student to Block</label>
              <select
                className="form-control"
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                required
              >
                <option value="">-- Choose Student --</option>
                {eligibleToBlock.map((s) => (
                  <option key={s.id} value={s.studentId}>
                    {s.fullName} ({s.studentId}) - {s.branch}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Reason for Blocking *</label>
              <textarea
                className="form-control"
                rows="3"
                placeholder="e.g. Unreturned damaged cricket bat, disciplinary action..."
                value={blockReason}
                onChange={(e) => setBlockReason(e.target.value)}
                required
              ></textarea>
            </div>

            <button type="submit" className="btn-danger" style={{ width: '100%', justifyContent: 'center', padding: '0.75rem' }}>
              <Lock size={16} /> Block Student Privileges
            </button>
          </form>
        </div>

        {/* BLOCKED STUDENTS LIST */}
        <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
          <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#fff' }}>
              Currently Blocked Students ({blockedList.length})
            </h3>
          </div>

          {blockedList.length === 0 ? (
            <div style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              No students are currently blocked.
            </div>
          ) : (
            <div className="table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Reason</th>
                    <th>Blocked Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {blockedList.map((s) => (
                    <tr key={s.id}>
                      <td>
                        <div style={{ fontWeight: '700', color: '#fff' }}>{s.fullName}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--primary)' }}>ID: {s.studentId}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{s.branch}</div>
                      </td>
                      <td style={{ fontSize: '0.85rem', color: '#fca5a5', maxWidth: '200px' }}>
                        {s.blockReason}
                      </td>
                      <td style={{ fontSize: '0.8rem' }}>
                        {s.blockedAt ? new Date(s.blockedAt).toLocaleDateString() : 'N/A'}
                      </td>
                      <td>
                        <button
                          type="button"
                          className="btn-success"
                          onClick={() => handleUnblock(s.studentId)}
                          style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                        >
                          <Unlock size={14} /> Unblock
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminBlockedStudents;
