import React, { useEffect, useState } from 'react';
import { getAllAssignments, returnEquipment } from '../services/api';
import { PackageCheck, CheckCircle, RotateCcw, Search, AlertCircle } from 'lucide-react';

const AdminAssignedList = () => {
  const [assignments, setAssignments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [actionSuccess, setActionSuccess] = useState('');
  const [actionError, setActionError] = useState('');

  const fetchAssignments = () => {
    setLoading(true);
    getAllAssignments()
      .then((res) => {
        setAssignments(res.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const handleReturn = async (assignmentId, equipmentName) => {
    setActionSuccess('');
    setActionError('');
    try {
      const res = await returnEquipment(assignmentId);
      setActionSuccess(`SUCCESS: ${equipmentName} returned successfully! Inventory quantity restored.`);
      fetchAssignments();
    } catch (err) {
      setActionError(err.response?.data?.message || 'Failed to return equipment');
    }
  };

  const filtered = assignments.filter((item) => {
    const matchesSearch =
      item.assignmentCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.student?.studentId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.student?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.equipment?.name?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === 'ALL' || item.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      <div>
        <h2 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#fff' }}>ISSUED EQUIPMENT & RETURNS</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Monitor active equipment assignments, track student returns, and restore inventory stock.
        </p>
      </div>

      {actionSuccess && (
        <div className="alert alert-success">
          <CheckCircle size={20} />
          <div>{actionSuccess}</div>
        </div>
      )}

      {actionError && (
        <div className="alert alert-error">
          <AlertCircle size={20} />
          <div>{actionError}</div>
        </div>
      )}

      {/* SEARCH AND FILTER BAR */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
          <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
          <input
            type="text"
            className="form-control"
            placeholder="Search by student name, Student ID, assignment code, or equipment..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: '2.5rem' }}
          />
        </div>

        <select
          className="form-control"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          style={{ width: '180px' }}
        >
          <option value="ALL">All Statuses</option>
          <option value="ISSUED">Currently Issued</option>
          <option value="RETURNED">Returned</option>
        </select>
      </div>

      {/* ASSIGNMENTS TABLE */}
      <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
        {filtered.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            No equipment assignments found matching your filter criteria.
          </div>
        ) : (
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Student Info</th>
                  <th>Equipment Item</th>
                  <th>Qty</th>
                  <th>Issue Time</th>
                  <th>Issued By</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr key={item.id}>
                    <td style={{ fontWeight: '700', color: 'var(--primary)' }}>{item.assignmentCode}</td>
                    <td>
                      <div style={{ fontWeight: '600', color: '#fff' }}>{item.student?.fullName}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>ID: {item.student?.studentId}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: '600' }}>{item.equipment?.name}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>{item.equipment?.sport?.name}</div>
                    </td>
                    <td style={{ fontWeight: '700' }}>{item.quantity}</td>
                    <td style={{ fontSize: '0.85rem' }}>{new Date(item.issueTime).toLocaleString()}</td>
                    <td style={{ fontSize: '0.85rem' }}>{item.issuedByAdmin}</td>
                    <td>
                      <span className={`status-pill ${item.status.toLowerCase()}`}>
                        {item.status}
                      </span>
                    </td>
                    <td>
                      {item.status === 'ISSUED' ? (
                        <button
                          type="button"
                          className="btn-success"
                          onClick={() => handleReturn(item.id, item.equipment?.name)}
                          style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem' }}
                        >
                          <RotateCcw size={14} /> Return
                        </button>
                      ) : (
                        <span style={{ fontSize: '0.8rem', color: 'var(--accent-emerald)', fontStyle: 'italic' }}>
                          Returned {item.returnTime ? `(${new Date(item.returnTime).toLocaleTimeString()})` : ''}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAssignedList;
