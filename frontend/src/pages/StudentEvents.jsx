import React, { useEffect, useState } from 'react';
import { getAllEvents } from '../services/api';
import { Calendar, MapPin, Clock, Tag } from 'lucide-react';

const StudentEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllEvents()
      .then((res) => {
        setEvents(res.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      <div>
        <h2 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#fff' }}>CAMPUS SPORTS EVENTS</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Stay updated on upcoming tournaments, matches, and athletic meets.
        </p>
      </div>

      {events.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '3rem' }}>
          <Calendar size={48} style={{ color: 'var(--text-dim)', marginBottom: '1rem' }} />
          <p style={{ color: 'var(--text-muted)' }}>No sports events scheduled at the moment.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {events.map((event) => (
            <div key={event.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span className="status-pill upcoming">
                    <Tag size={12} /> {event.sportName || 'GENERAL'}
                  </span>
                  <span className={`status-pill ${event.status.toLowerCase()}`}>
                    {event.status}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#fff', marginBottom: '0.5rem' }}>
                  {event.eventName}
                </h3>

                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                  {event.description}
                </p>
              </div>

              <div style={{
                borderTop: '1px solid var(--border-color)',
                paddingTop: '0.85rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.4rem',
                fontSize: '0.85rem',
                color: 'var(--text-main)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <MapPin size={16} style={{ color: 'var(--primary)' }} />
                  <span><strong>Venue:</strong> {event.venue}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Clock size={16} style={{ color: 'var(--accent-cyan)' }} />
                  <span><strong>Date & Time:</strong> {new Date(event.eventDate).toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentEvents;
