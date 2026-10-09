import React, { useEffect, useState } from 'react';
import { getAllSports, getAllEquipment, createEquipment, updateEquipment } from '../services/api';
import { Package, Plus, CheckCircle, AlertCircle, Edit2 } from 'lucide-react';

const AdminManageInventory = () => {
  const [sports, setSports] = useState([]);
  const [equipmentList, setEquipmentList] = useState([]);

  const [selectedSportId, setSelectedSportId] = useState('');
  const [equipmentName, setEquipmentName] = useState('');
  const [totalQty, setTotalQty] = useState(10);

  const [editingId, setEditingId] = useState(null);
  const [editTotalQty, setEditTotalQty] = useState(0);

  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  const fetchData = () => {
    Promise.all([getAllSports(), getAllEquipment()])
      .then(([sRes, eqRes]) => {
        setSports(sRes.data || []);
        setEquipmentList(eqRes.data || []);
        if (sRes.data?.length > 0 && !selectedSportId) {
          setSelectedSportId(sRes.data[0].id);
        }
      })
      .catch(console.error);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    setErr('');

    if (!selectedSportId || !equipmentName.trim() || totalQty < 0) {
      setErr('Please fill out all equipment details correctly.');
      return;
    }

    try {
      await createEquipment(selectedSportId, {
        name: equipmentName.trim(),
        totalQuantity: Number(totalQty),
        availableQuantity: Number(totalQty),
        active: true,
      });

      setMsg(`Equipment '${equipmentName}' added to inventory successfully!`);
      setEquipmentName('');
      setTotalQty(10);
      fetchData();
    } catch (error) {
      setErr(error.response?.data?.message || 'Failed to add equipment');
    }
  };

  const handleUpdateQty = async (id) => {
    setMsg('');
    setErr('');
    try {
      await updateEquipment(id, { totalQuantity: Number(editTotalQty) });
      setMsg('Equipment total stock updated successfully!');
      setEditingId(null);
      fetchData();
    } catch (error) {
      setErr(error.response?.data?.message || 'Failed to update stock');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      <div>
        <h2 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#fff' }}>MANAGE SPORTS EQUIPMENT INVENTORY</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Add new sports gear, update stock quantities, and view live inventory levels.
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
        {/* ADD EQUIPMENT FORM */}
        <div className="glass-card">
          <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '1.25rem', color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Plus size={20} /> Add New Equipment Item
          </h3>

          <form onSubmit={handleAddSubmit}>
            <div className="form-group">
              <label>Associated Sport *</label>
              <select
                className="form-control"
                value={selectedSportId}
                onChange={(e) => setSelectedSportId(e.target.value)}
                required
              >
                {sports.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.category})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Equipment Item Name *</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Leather Cricket Ball Box, Match Football..."
                value={equipmentName}
                onChange={(e) => setEquipmentName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Total Quantity Stock *</label>
              <input
                type="number"
                min="0"
                className="form-control"
                value={totalQty}
                onChange={(e) => setTotalQty(parseInt(e.target.value) || 0)}
                required
              />
            </div>

            <button type="submit" className="btn-success" style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}>
              Add to Inventory
            </button>
          </form>
        </div>

        {/* INVENTORY TABLE */}
        <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
          <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#fff' }}>Current Inventory ({equipmentList.length})</h3>
          </div>

          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Equipment Item</th>
                  <th>Sport</th>
                  <th>Total</th>
                  <th>Available</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {equipmentList.map((eq) => (
                  <tr key={eq.id}>
                    <td style={{ fontWeight: '700', color: '#fff' }}>{eq.name}</td>
                    <td>{eq.sport?.name}</td>
                    <td>
                      {editingId === eq.id ? (
                        <input
                          type="number"
                          min="0"
                          className="form-control"
                          value={editTotalQty}
                          onChange={(e) => setEditTotalQty(parseInt(e.target.value) || 0)}
                          style={{ width: '70px', padding: '0.2rem 0.5rem' }}
                        />
                      ) : (
                        <span>{eq.totalQuantity}</span>
                      )}
                    </td>
                    <td style={{ fontWeight: '700', color: eq.availableQuantity > 0 ? 'var(--accent-emerald)' : 'var(--accent-rose)' }}>
                      {eq.availableQuantity}
                    </td>
                    <td>
                      {editingId === eq.id ? (
                        <button
                          type="button"
                          className="btn-primary"
                          onClick={() => handleUpdateQty(eq.id)}
                          style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
                        >
                          Save
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="btn-secondary"
                          onClick={() => {
                            setEditingId(eq.id);
                            setEditTotalQty(eq.totalQuantity);
                          }}
                          style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
                        >
                          <Edit2 size={12} /> Edit
                        </button>
                      )}
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

export default AdminManageInventory;
