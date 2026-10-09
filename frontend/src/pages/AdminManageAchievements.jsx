import React, { useEffect, useState } from 'react';
import { getAllAchievements, getAllStudents, getAllSports, createAchievement, deleteAchievement } from '../services/api';
import { Award, Plus, CheckCircle, AlertCircle, Trash2, Medal } from 'lucide-react';

const AdminManageAchievements = () => {
  const [achievements, setAchievements] = useState([]);
  const [students, setStudents] = useState([]);
  const [sports, setSports] = useState([]);

  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [selectedSportId, setSelectedSportId] = useState('');
  const [title, setTitle] = useState('');
  const [competition, setCompetition] = useState('');
  const [achievementDate, setAchievementDate] = useState(new Date().toISOString().split('T')[0]);
  const [position, setPosition] = useState('1st Place (Gold Medal)');
  const [description, setDescription] = useState('');

  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  const fetchData = () => {
    Promise.all([getAllAchievements(), getAllStudents(), getAllSports()])
      .then(([acRes, stRes, spRes]) => {
        setAchievements(acRes.data || []);
        setStudents(stRes.data || []);
        setSports(spRes.data || []);
      })
      .catch(console.error);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    setErr('');

    if (!selectedStudentId || !title.trim() || !competition.trim() || !achievementDate) {
      setErr('Student, title, competition, and date are required.');
      return;
    }

    try {
      await createAchievement({
        studentId: selectedStudentId,
        sportId: selectedSportId ? Number(selectedSportId) : null,
        title: title.trim(),
        competition: competition.trim(),
        achievementDate,
        position,
        description: description.trim(),
      });

      setMsg(`Achievement '${title}' awarded to student ${selectedStudentId}!`);
      setTitle('');
      setCompetition('');
      setDescription('');
      fetchData();
    } catch (error) {
      setErr(error.response?.data?.message || 'Failed to record achievement');
    }
  };

  const handleDelete = async (id, titleText) => {
    if (!window.confirm(`Are you sure you want to remove achievement '${titleText}'?`)) return;
    setMsg('');
    setErr('');
    try {
      await deleteAchievement(id);
      setMsg(`Achievement '${titleText}' removed.`);
      fetchData();
    } catch (error) {
      setErr(error.response?.data?.message || 'Failed to delete achievement');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      <div>
        <h2 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#fff' }}>STUDENT ACHIEVEMENTS MANAGEMENT</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Record inter-college tournament medals, state/national honors, and athletic awards.
        </p>
      </div>

      {msg && (
        <div className="alert alert-success">
          <CheckCircle size={20} />
          <div>{msg}</div>
        </div>
      )}

      {err && (
        <div className="alert alert-error">
          <AlertCircle size={20} />
          <div>{err}</div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
        {/* ADD ACHIEVEMENT FORM */}
        <div className="glass-card">
          <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '1.25rem', color: '#ec4899', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Plus size={20} /> Award Student Achievement
          </h3>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Select Recipient Student *</label>
              <select
                className="form-control"
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                required
              >
                <option value="">-- Choose Registered Student --</option>
                {students.map((s) => (
                  <option key={s.id} value={s.studentId}>
                    {s.fullName} ({s.studentId}) - {s.branch}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Achievement Title *</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Gold Medalist in 100m Sprint"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Competition / Tournament *</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. State Inter-University Sports Meet 2026"
                value={competition}
                onChange={(e) => setCompetition(e.target.value)}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label>Position / Award</label>
                <select
                  className="form-control"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                >
                  <option value="1st Place (Gold Medal)">1st Place (Gold)</option>
                  <option value="2nd Place (Silver Medal)">2nd Place (Silver)</option>
                  <option value="3rd Place (Bronze Medal)">3rd Place (Bronze)</option>
                  <option value="Champion">Tournament Champion</option>
                  <option value="Runner Up">Runner Up</option>
                  <option value="MVP / Best Player">MVP / Best Player</option>
                </select>
              </div>

              <div className="form-group">
                <label>Award Date *</label>
                <input
                  type="date"
                  className="form-control"
                  value={achievementDate}
                  onChange={(e) => setAchievementDate(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Sport (Optional)</label>
              <select
                className="form-control"
                value={selectedSportId}
                onChange={(e) => setSelectedSportId(e.target.value)}
              >
                <option value="">-- General Sports Award --</option>
                {sports.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                className="form-control"
                rows="2"
                placeholder="Citation or achievement details..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem', background: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)' }}>
              Award & Save Achievement
            </button>
          </form>
        </div>

        {/* ACHIEVEMENTS LIST */}
        <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
          <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#fff' }}>Recorded Achievements ({achievements.length})</h3>
          </div>

          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Recipient</th>
                  <th>Award & Competition</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {achievements.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div style={{ fontWeight: '700', color: '#fff' }}>{item.student?.fullName}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--primary)' }}>ID: {item.student?.studentId}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: '700', color: 'var(--accent-gold)' }}>🏆 {item.title}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.competition} ({item.position})</div>
                    </td>
                    <td style={{ fontSize: '0.8rem' }}>{item.achievementDate}</td>
                    <td>
                      <button
                        type="button"
                        className="btn-danger"
                        onClick={() => handleDelete(item.id, item.title)}
                        style={{ padding: '0.35rem 0.6rem', fontSize: '0.75rem' }}
                      >
                        <Trash2 size={12} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminManageAchievements;
