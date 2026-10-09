import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { UserCheck, ShieldCheck, AlertCircle, Lock } from 'lucide-react';

const StudentRegisterPage = () => {
  const { user, config, registerStudentProfile, error, setError } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState(user?.name || '');
  const [branch, setBranch] = useState('Computer Science (CSE)');
  const [section, setSection] = useState('A');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState(user?.email || '');
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user?.name) setFullName(user.name);
    if (user?.email) setEmail(user.email);
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!fullName.trim() || !phoneNumber.trim() || !email.trim()) {
      setFormError('Please fill out all required fields.');
      return;
    }

    // Phone validation
    const phoneRegex = /^[0-9]{10,15}$/;
    if (!phoneRegex.test(phoneNumber.trim())) {
      setFormError('Please enter a valid 10-15 digit phone number.');
      return;
    }

    // Email domain validation (Must end with @anurag.edu.in)
    const allowedDomain = config?.approvedDomain || 'anurag.edu.in';
    const approvedSuffix = '@' + allowedDomain.toLowerCase().replace('@', '');
    if (!email.toLowerCase().trim().endsWith(approvedSuffix)) {
      setFormError(`Registration failed: College Email must end with ${approvedSuffix}`);
      return;
    }

    setIsSubmitting(true);
    const res = await registerStudentProfile({
      fullName: fullName.trim(),
      branch: branch.trim(),
      section: section.trim(),
      phoneNumber: phoneNumber.trim(),
      email: email.trim(),
    });

    setIsSubmitting(false);

    if (res.success) {
      navigate('/student/dashboard');
    } else {
      setFormError(res.message);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2.5rem 1.5rem',
      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
    }}>
      <div className="glass-card" style={{ maxWidth: '580px', width: '100%', padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '20px',
            background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
            color: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem',
            border: '1px solid rgba(37, 99, 235, 0.2)',
            boxShadow: '0 8px 20px rgba(37, 99, 235, 0.1)',
          }}>
            <UserCheck size={34} />
          </div>

          <h2 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#0f172a' }}>
            STUDENT REGISTRATION
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Complete your profile to generate your official Sports Pass.
          </p>
        </div>

        {(formError || error) && (
          <div className="alert alert-error">
            <AlertCircle size={20} />
            <div>{formError || error}</div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name *</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Sai Nikhilesh"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Branch / Department *</label>
              <select
                className="form-control"
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
              >
                <option value="Computer Science (CSE)">CSE</option>
                <option value="Electronics & Comm (ECE)">ECE</option>
                <option value="Mechanical Engineering (ME)">ME</option>
                <option value="Civil Engineering (CE)">CE</option>
                <option value="Information Tech (IT)">IT</option>
                <option value="Electrical Engineering (EEE)">EEE</option>
              </select>
            </div>

            <div className="form-group">
              <label>Section *</label>
              <select
                className="form-control"
                value={section}
                onChange={(e) => setSection(e.target.value)}
              >
                <option value="A">Section A</option>
                <option value="B">Section B</option>
                <option value="C">Section C</option>
                <option value="D">Section D</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Phone Number *</label>
            <input
              type="tel"
              className="form-control"
              placeholder="e.g. 9876543210"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <label style={{ margin: 0 }}>Verified College Email Address *</label>
              <span className="status-pill available" style={{ fontSize: '0.7rem', padding: '0.15rem 0.5rem' }}>
                <ShieldCheck size={12} /> VERIFIED
              </span>
            </div>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                className="form-control"
                value={email}
                readOnly={true}
                style={{ paddingRight: '2.5rem', background: '#f8fafc', color: '#334155', fontWeight: '600' }}
                required
              />
              <Lock size={16} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>
              Email address is locked to your verified Google authentication identity (@anurag.edu.in).
            </span>
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={isSubmitting}
            style={{ width: '100%', justifyContent: 'center', marginTop: '1.25rem', padding: '0.85rem' }}
          >
            {isSubmitting ? 'Registering...' : 'Register & Generate Sports Pass'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default StudentRegisterPage;
