import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getAllSports, getEquipmentBySport, getStudentByStudentId, assignEquipment } from '../services/api';
import QRScannerModal from '../components/QRScannerModal';
import { QrCode, CheckCircle, AlertTriangle, UserCheck, Dumbbell, ShieldAlert } from 'lucide-react';

const AdminAssignEquipment = () => {
  const { adminData, user } = useAuth();
  const [sports, setSports] = useState([]);
  const [selectedSportId, setSelectedSportId] = useState('');
  const [equipmentList, setEquipmentList] = useState([]);
  const [selectedEquipmentId, setSelectedEquipmentId] = useState('');
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const [studentId, setStudentId] = useState('');
  const [student, setStudent] = useState(null);
  const [studentLoading, setStudentLoading] = useState(false);
  const [studentError, setStudentError] = useState('');

  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    getAllSports()
      .then((res) => {
        setSports(res.data || []);
        if (res.data?.length > 0) {
          setSelectedSportId(res.data[0].id);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    if (selectedSportId) {
      getEquipmentBySport(selectedSportId)
        .then((res) => {
          setEquipmentList(res.data || []);
          if (res.data?.length > 0) {
            setSelectedEquipmentId(res.data[0].id);
            setSelectedEquipment(res.data[0]);
          } else {
            setSelectedEquipmentId('');
            setSelectedEquipment(null);
          }
        })
        .catch((err) => console.error(err));
    }
  }, [selectedSportId]);

  const handleEquipmentChange = (eqId) => {
    setSelectedEquipmentId(eqId);
    const item = equipmentList.find((e) => e.id === Number(eqId));
    setSelectedEquipment(item || null);
  };

  const handleScanSuccess = async (scannedStudentId) => {
    setStudentId(scannedStudentId);
    setStudentError('');
    setStudent(null);
    setStudentLoading(true);
    try {
      const res = await getStudentByStudentId(scannedStudentId);
      setStudent(res.data);
      setStudentLoading(false);
    } catch (err) {
      setStudentError(err.response?.data?.message || `Student not found with ID: ${scannedStudentId}`);
      setStudentLoading(false);
    }
  };

  const handleManualSearch = async (e) => {
    e.preventDefault();
    if (!studentId.trim()) return;
    handleScanSuccess(studentId.trim());
  };

  const handleConfirmAssignment = async () => {
    setSubmitError('');
    setSubmitSuccess('');

    if (!student) {
      setSubmitError('Please scan or select a verified student.');
      return;
    }

    if (student.isBlocked) {
      setSubmitError(`CANNOT ISSUE: Student ${student.fullName} is BLOCKED. Reason: ${student.blockReason}`);
      return;
    }

    if (!selectedEquipment) {
      setSubmitError('Please select equipment to issue.');
      return;
    }

    if (quantity > selectedEquipment.availableQuantity) {
      setSubmitError(`Requested quantity (${quantity}) exceeds available stock (${selectedEquipment.availableQuantity}).`);
      return;
    }

    setIsSubmitting(true);
    const adminIdToUse = adminData?.adminId || 'ADM001';

    try {
      const res = await assignEquipment({
        studentId: student.studentId,
        equipmentId: selectedEquipment.id,
        quantity: Number(quantity),
        adminId: adminIdToUse,
      });

      const assignment = res.data;
      setSubmitSuccess(`SUCCESS! ${quantity} unit(s) of ${selectedEquipment.name} issued to ${student.fullName} (${student.studentId}). Assignment Code: ${assignment.assignmentCode}`);
      
      // Refresh equipment stock
      getEquipmentBySport(selectedSportId).then((r) => {
        setEquipmentList(r.data || []);
        const updatedEq = r.data?.find((e) => e.id === selectedEquipment.id);
        if (updatedEq) setSelectedEquipment(updatedEq);
      });

      setStudent(null);
      setStudentId('');
      setIsSubmitting(false);
    } catch (err) {
      setSubmitError(err.response?.data?.message || 'Failed to issue equipment');
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      <div>
        <h2 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#fff' }}>ASSIGN EQUIPMENT VIA QR SCANNING</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Select sports equipment, scan the student's digital QR pass, and verify eligibility before issuing.
        </p>
      </div>

      {submitSuccess && (
        <div className="alert alert-success">
          <CheckCircle size={20} />
          <div>{submitSuccess}</div>
        </div>
      )}

      {submitError && (
        <div className="alert alert-error">
          <ShieldAlert size={20} />
          <div>{submitError}</div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2rem' }}>
        {/* STEP 1: EQUIPMENT SELECTION FORM */}
        <div className="glass-card">
          <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '1.25rem', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Dumbbell size={20} /> 1. Select Sport & Equipment
          </h3>

          <div className="form-group">
            <label>Sport Category</label>
            <select
              className="form-control"
              value={selectedSportId}
              onChange={(e) => setSelectedSportId(e.target.value)}
            >
              {sports.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.category})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Equipment Item</label>
            <select
              className="form-control"
              value={selectedEquipmentId}
              onChange={(e) => handleEquipmentChange(e.target.value)}
            >
              {equipmentList.map((eq) => (
                <option key={eq.id} value={eq.id}>
                  {eq.name} (Available: {eq.availableQuantity} / Total: {eq.totalQuantity})
                </option>
              ))}
            </select>
          </div>

          {selectedEquipment && (
            <div style={{
              background: 'rgba(30, 41, 59, 0.6)',
              padding: '1rem',
              borderRadius: '12px',
              border: '1px solid var(--border-color)',
              marginBottom: '1.25rem',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Selected Item:</span>
                <strong style={{ color: '#fff' }}>{selectedEquipment.name}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginTop: '0.4rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Current Available Stock:</span>
                <strong style={{ color: selectedEquipment.availableQuantity > 0 ? 'var(--accent-emerald)' : 'var(--accent-rose)' }}>
                  {selectedEquipment.availableQuantity} units
                </strong>
              </div>
            </div>
          )}

          <div className="form-group">
            <label>Quantity to Issue</label>
            <input
              type="number"
              min="1"
              max={selectedEquipment?.availableQuantity || 1}
              className="form-control"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
            />
          </div>
        </div>

        {/* STEP 2: STUDENT SCANNING & VERIFICATION */}
        <div className="glass-card">
          <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '1.25rem', color: 'var(--accent-gold)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <QrCode size={20} /> 2. Scan & Verify Student
          </h3>

          <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
            <button
              type="button"
              className="btn-primary"
              onClick={() => setIsScannerOpen(true)}
              style={{ width: '100%', justifyContent: 'center', padding: '0.85rem', fontSize: '1rem' }}
            >
              <QrCode size={20} /> SCAN STUDENT QR CODE (CAMERA)
            </button>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '0.5rem' }}>
              Requests browser camera access to scan student digital QR pass.
            </p>
          </div>

          <form onSubmit={handleManualSearch} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <input
              type="text"
              className="form-control"
              placeholder="Or enter Student ID (e.g. STU123456)"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              style={{ flex: 1 }}
            />
            <button type="submit" className="btn-secondary">Lookup</button>
          </form>

          {studentError && (
            <div className="alert alert-error">
              <AlertTriangle size={18} />
              <div>{studentError}</div>
            </div>
          )}

          {student && (
            <div style={{
              background: 'rgba(30, 41, 59, 0.8)',
              border: student.isBlocked ? '2px solid var(--accent-rose)' : '2px solid var(--accent-emerald)',
              borderRadius: '14px',
              padding: '1.25rem',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <h4 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#fff' }}>{student.fullName}</h4>
                {student.isBlocked ? (
                  <span className="status-pill blocked">BLOCKED</span>
                ) : (
                  <span className="status-pill available"><CheckCircle size={12} /> ELIGIBLE</span>
                )}
              </div>

              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                <div><strong>Student ID:</strong> <span style={{ color: 'var(--primary)' }}>{student.studentId}</span></div>
                <div><strong>Branch & Sec:</strong> {student.branch} - Sec {student.section}</div>
                <div><strong>Phone:</strong> {student.phoneNumber}</div>
                <div><strong>Email:</strong> {student.email}</div>
              </div>

              {student.isBlocked && (
                <div style={{
                  marginTop: '0.75rem',
                  padding: '0.6rem',
                  background: 'rgba(244, 63, 94, 0.2)',
                  borderRadius: '8px',
                  color: '#fca5a5',
                  fontSize: '0.85rem',
                }}>
                  🛑 <strong>BLOCK REASON:</strong> {student.blockReason || 'Blocked by admin'}
                </div>
              )}

              <button
                type="button"
                className="btn-success"
                onClick={handleConfirmAssignment}
                disabled={student.isBlocked || isSubmitting || !selectedEquipment || selectedEquipment.availableQuantity < quantity}
                style={{ width: '100%', justifyContent: 'center', marginTop: '1.25rem', padding: '0.75rem' }}
              >
                {isSubmitting ? 'Processing Assignment...' : 'Confirm & Issue Equipment'}
              </button>
            </div>
          )}
        </div>
      </div>

      <QRScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScanSuccess={handleScanSuccess}
      />
    </div>
  );
};

export default AdminAssignEquipment;
