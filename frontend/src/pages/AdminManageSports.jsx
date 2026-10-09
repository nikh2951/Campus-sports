import React, { useEffect, useState } from 'react';
import { getAllSports, createSport } from '../services/api';
import { Dumbbell, Plus, CheckCircle, AlertCircle } from 'lucide-react';

const AdminManageSports = () => {
  const [sports, setSports] = useState([]);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('OUTDOOR');
  const [description, setDescription] = useState('');

  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  const fetchSports = () => {
    getAllSports().then((res) => setSports(res.data || [])).catch(console.error);
  };

  useEffect(() => {
    fetchSports();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    setErr('');

    if (!name.trim()) {
      setErr('Sport name is required');
      return;
    }

    try {
      await createSport({
        name: name.trim(),
        category,
        description: description.trim(),
        active: true,
      });
      setMsg(`Sport '${name}' added successfully!`);
      setName('');
      setDescription('');
      fetchSports();
    } catch (error) {
      setErr(error.response?.data?.message || 'Failed to create sport');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      <div>
        <h2 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#fff' }}>MANAGE SPORTS & CATEGORIES</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Add new sports and organize indoor and outdoor campus games.
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
        <div className="glass-card">
          <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '1.25rem', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Plus size={20} /> Add New Sport
          </h3>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Sport Name *</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Lawn Tennis, Archery, Swimming..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Category *</label>
              <select
                className="form-control"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="OUTDOOR">OUTDOOR SPORTS</option>
                <option value="INDOOR">INDOOR GAMES</option>
              </select>
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                className="form-control"
                rows="3"
                placeholder="Facility details, rules, court details..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}>
              Create Sport Entry
            </button>
          </form>
        </div>

        <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
          <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#fff' }}>Existing Sports ({sports.length})</h3>
          </div>

          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Sport Name</th>
                  <th>Category</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {sports.map((s) => (
                  <tr key={s.id}>
                    <td style={{ fontWeight: '700', color: '#fff' }}>{s.name}</td>
                    <td>
                      <span className={`status-pill ${s.category === 'INDOOR' ? 'upcoming' : 'active'}`}>
                        {s.category}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{s.description || 'N/A'}</td>
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

export default AdminManageSports;
