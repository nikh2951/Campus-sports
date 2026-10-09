import React, { useEffect, useState } from 'react';
import { getAllEvents, getAllSports, createEvent, updateEvent, deleteEvent } from '../services/api';
import { Calendar, Plus, CheckCircle, AlertCircle, Trash2, Edit3 } from 'lucide-react';

const AdminManageEvents = () => {
  const [events, setEvents] = useState([]);
  const [sports, setSports] = useState([]);

  const [eventName, setEventName] = useState('');
  const [selectedSportId, setSelectedSportId] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [venue, setVenue] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('UPCOMING');

  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  const fetchData = () => {
    Promise.all([getAllEvents(), getAllSports()])
      .then(([evRes, spRes]) => {
        setEvents(evRes.data || []);
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

    if (!eventName.trim() || !eventDate || !venue.trim()) {
      setErr('Event name, date, and venue are required.');
      return;
    }

    try {
      await createEvent({
        eventName: eventName.trim(),
        sportId: selectedSportId ? Number(selectedSportId) : null,
        eventDate: eventDate,
        venue: venue.trim(),
        description: description.trim(),
        status,
      });

      setMsg(`Sports event '${eventName}' created successfully!`);
      setEventName('');
      setEventDate('');
      setVenue('');
      setDescription('');
      fetchData();
    } catch (error) {
      setErr(error.response?.data?.message || 'Failed to create event');
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    setMsg('');
    setErr('');
    try {
      await updateEvent(id, { status: newStatus });
      setMsg(`Event status updated to ${newStatus}`);
      fetchData();
    } catch (error) {
      setErr(error.response?.data?.message || 'Failed to update event status');
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete event '${name}'?`)) return;
    setMsg('');
    setErr('');
    try {
      await deleteEvent(id);
      setMsg(`Event '${name}' deleted.`);
      fetchData();
    } catch (error) {
      setErr(error.response?.data?.message || 'Failed to delete event');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      <div>
        <h2 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#fff' }}>CAMPUS SPORTS EVENTS MANAGEMENT</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Schedule tournaments, update match statuses, and announce university sports events.
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
        {/* ADD EVENT FORM */}
        <div className="glass-card">
          <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '1.25rem', color: 'var(--accent-gold)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Plus size={20} /> Schedule New Event
          </h3>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Event Name *</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Inter-Department Football Trophy 2026"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Associated Sport</label>
              <select
                className="form-control"
                value={selectedSportId}
                onChange={(e) => setSelectedSportId(e.target.value)}
              >
                <option value="">-- General Campus Event --</option>
                {sports.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.category})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Event Date & Time *</label>
              <input
                type="datetime-local"
                className="form-control"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Venue / Location *</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Main Stadium Ground, Indoor Arena Court 2"
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Event Description</label>
              <textarea
                className="form-control"
                rows="3"
                placeholder="Tournament format, eligibility, team registration details..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem', background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}>
              Publish Sports Event
            </button>
          </form>
        </div>

        {/* EVENTS LIST */}
        <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
          <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#fff' }}>Scheduled Events ({events.length})</h3>
          </div>

          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Event Name</th>
                  <th>Venue & Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.map((ev) => (
                  <tr key={ev.id}>
                    <td>
                      <div style={{ fontWeight: '700', color: '#fff' }}>{ev.eventName}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--primary)' }}>{ev.sportName || 'CAMPUS EVENT'}</div>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.85rem' }}>📍 {ev.venue}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                        📅 {new Date(ev.eventDate).toLocaleString()}
                      </div>
                    </td>
                    <td>
                      <select
                        className="form-control"
                        value={ev.status}
                        onChange={(e) => handleStatusChange(ev.id, e.target.value)}
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                      >
                        <option value="UPCOMING">UPCOMING</option>
                        <option value="ONGOING">ONGOING</option>
                        <option value="COMPLETED">COMPLETED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="btn-danger"
                        onClick={() => handleDelete(ev.id, ev.eventName)}
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

export default AdminManageEvents;
