import React, { useEffect, useState } from 'react';
import { getSportsByCategory, getEquipmentBySport } from '../services/api';
import { Dumbbell, ShieldAlert, CheckCircle } from 'lucide-react';

const StudentSports = () => {
  const [activeTab, setActiveTab] = useState('OUTDOOR');
  const [sports, setSports] = useState([]);
  const [selectedSport, setSelectedSport] = useState(null);
  const [equipmentList, setEquipmentList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getSportsByCategory(activeTab)
      .then((res) => {
        setSports(res.data || []);
        if (res.data && res.data.length > 0) {
          setSelectedSport(res.data[0]);
        } else {
          setSelectedSport(null);
          setEquipmentList([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [activeTab]);

  useEffect(() => {
    if (selectedSport?.id) {
      getEquipmentBySport(selectedSport.id)
        .then((res) => setEquipmentList(res.data || []))
        .catch((err) => console.error(err));
    }
  }, [selectedSport]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      <div>
        <h2 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#fff' }}>CAMPUS SPORTS & INVENTORY</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Explore indoor and outdoor sports facilities and check live equipment stock availability.
        </p>
      </div>

      {/* TABS */}
      <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
        <button
          className={`btn-secondary ${activeTab === 'OUTDOOR' ? 'active-tab' : ''}`}
          onClick={() => setActiveTab('OUTDOOR')}
          style={{
            background: activeTab === 'OUTDOOR' ? 'var(--primary)' : 'rgba(30, 41, 59, 0.6)',
            borderColor: activeTab === 'OUTDOOR' ? 'var(--primary)' : 'var(--border-color)',
            color: '#fff',
          }}
        >
          OUTDOOR SPORTS
        </button>
        <button
          className={`btn-secondary ${activeTab === 'INDOOR' ? 'active-tab' : ''}`}
          onClick={() => setActiveTab('INDOOR')}
          style={{
            background: activeTab === 'INDOOR' ? 'var(--primary)' : 'rgba(30, 41, 59, 0.6)',
            borderColor: activeTab === 'INDOOR' ? 'var(--primary)' : 'var(--border-color)',
            color: '#fff',
          }}
        >
          INDOOR GAMES
        </button>
      </div>

      {/* SPORTS PILLS */}
      {sports.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
          {sports.map((sport) => (
            <button
              key={sport.id}
              onClick={() => setSelectedSport(sport)}
              style={{
                padding: '0.6rem 1.25rem',
                borderRadius: '20px',
                fontSize: '0.9rem',
                fontWeight: '600',
                background: selectedSport?.id === sport.id ? 'rgba(59, 130, 246, 0.25)' : 'rgba(30, 41, 59, 0.6)',
                border: selectedSport?.id === sport.id ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                color: selectedSport?.id === sport.id ? '#fff' : 'var(--text-muted)',
                cursor: 'pointer',
                transition: 'var(--transition-fast)',
              }}
            >
              {sport.name}
            </button>
          ))}
        </div>
      )}

      {/* SELECTED SPORT DETAILS & EQUIPMENT LIST */}
      {selectedSport ? (
        <div className="glass-card">
          <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
            <span className="status-pill active" style={{ marginBottom: '0.4rem' }}>{selectedSport.category}</span>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#fff' }}>{selectedSport.name}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.2rem' }}>{selectedSport.description}</p>
          </div>

          <h4 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1rem', color: 'var(--accent-cyan)' }}>
            Available Equipment Stock ({equipmentList.length})
          </h4>

          {equipmentList.length === 0 ? (
            <p style={{ color: 'var(--text-dim)', fontStyle: 'italic' }}>
              No equipment listed for this sport currently.
            </p>
          ) : (
            <div className="table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Equipment Name</th>
                    <th>Total Inventory</th>
                    <th>Currently Available</th>
                    <th>Availability Status</th>
                  </tr>
                </thead>
                <tbody>
                  {equipmentList.map((item) => (
                    <tr key={item.id}>
                      <td style={{ fontWeight: '600', color: '#fff' }}>{item.name}</td>
                      <td>{item.totalQuantity} units</td>
                      <td style={{ fontWeight: '700', color: item.availableQuantity > 0 ? 'var(--accent-emerald)' : 'var(--accent-rose)' }}>
                        {item.availableQuantity} units
                      </td>
                      <td>
                        {item.availableQuantity > 0 ? (
                          <span className="status-pill available"><CheckCircle size={14} /> IN STOCK</span>
                        ) : (
                          <span className="status-pill issued"><ShieldAlert size={14} /> OUT OF STOCK</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        <div className="glass-card" style={{ textAlign: 'center', padding: '3rem' }}>
          <Dumbbell size={48} style={{ color: 'var(--text-dim)', marginBottom: '1rem' }} />
          <p style={{ color: 'var(--text-muted)' }}>No sports found in this category.</p>
        </div>
      )}
    </div>
  );
};

export default StudentSports;
