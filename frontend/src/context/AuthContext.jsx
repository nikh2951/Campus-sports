import React, { createContext, useContext, useState, useEffect } from 'react';
import { verifyGoogleToken, verifyAdminId, registerStudent, getAuthConfig } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('csms_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [role, setRole] = useState(() => {
    return localStorage.getItem('csms_role') || null;
  });

  const [studentData, setStudentData] = useState(() => {
    const saved = localStorage.getItem('csms_student');
    return saved ? JSON.parse(saved) : null;
  });

  const [adminData, setAdminData] = useState(() => {
    const saved = localStorage.getItem('csms_admin');
    return saved ? JSON.parse(saved) : null;
  });

  const [config, setConfig] = useState({ approvedDomain: 'campus.edu' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    getAuthConfig()
      .then((res) => setConfig(res.data))
      .catch(() => console.log('Using default auth config'));
  }, []);

  const loginWithGoogle = async (idToken, devEmail = null, devName = null) => {
    setLoading(true);
    setError(null);
    try {
      const res = await verifyGoogleToken(idToken, devEmail, devName);
      const data = res.data;

      if (!data.success) {
        setError(data.message);
        setLoading(false);
        return { success: false, message: data.message };
      }

      const userInfo = {
        email: data.email,
        name: data.name,
        picture: data.picture,
      };

      setUser(userInfo);
      localStorage.setItem('csms_user', JSON.stringify(userInfo));

      if (data.registeredStudent && data.student) {
        setStudentData(data.student);
        localStorage.setItem('csms_student', JSON.stringify(data.student));
      } else {
        setStudentData(null);
        localStorage.removeItem('csms_student');
      }

      if (data.admin && data.administrator) {
        setAdminData(data.administrator);
        localStorage.setItem('csms_admin', JSON.stringify(data.administrator));
      } else {
        setAdminData(null);
        localStorage.removeItem('csms_admin');
      }

      setLoading(false);
      return {
        success: true,
        user: userInfo,
        registeredStudent: data.registeredStudent,
        student: data.student,
        isAdmin: data.admin,
        admin: data.administrator,
      };
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Google Authentication failed';
      setError(msg);
      setLoading(false);
      return { success: false, message: msg };
    }
  };

  const loginAdmin = async (adminId) => {
    if (!user || !user.email) {
      return { success: false, message: 'Please complete Google Login first' };
    }
    setLoading(true);
    setError(null);
    try {
      const res = await verifyAdminId(adminId, user.email);
      if (res.data.valid) {
        const adminObj = { adminId, email: user.email, name: user.name };
        setAdminData(adminObj);
        setRole('admin');
        localStorage.setItem('csms_admin', JSON.stringify(adminObj));
        localStorage.setItem('csms_role', 'admin');
        setLoading(false);
        return { success: true };
      } else {
        setError(res.data.message);
        setLoading(false);
        return { success: false, message: res.data.message };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Admin verification failed';
      setError(msg);
      setLoading(false);
      return { success: false, message: msg };
    }
  };

  const handleStudentRegistration = async (formData) => {
    setLoading(true);
    setError(null);
    try {
      const res = await registerStudent({
        ...formData,
        email: user ? user.email : formData.email,
      });

      const student = res.data;
      setStudentData(student);
      setRole('student');
      localStorage.setItem('csms_student', JSON.stringify(student));
      localStorage.setItem('csms_role', 'student');
      setLoading(false);
      return { success: true, student };
    } catch (err) {
      const msg = err.response?.data?.message || 'Student registration failed';
      setError(msg);
      setLoading(false);
      return { success: false, message: msg };
    }
  };

  const selectRole = (selectedRole) => {
    setRole(selectedRole);
    localStorage.setItem('csms_role', selectedRole);
  };

  const logout = () => {
    setUser(null);
    setRole(null);
    setStudentData(null);
    setAdminData(null);
    localStorage.removeItem('csms_user');
    localStorage.removeItem('csms_role');
    localStorage.removeItem('csms_student');
    localStorage.removeItem('csms_admin');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        studentData,
        adminData,
        config,
        loading,
        error,
        setError,
        loginWithGoogle,
        loginAdmin,
        registerStudentProfile: handleStudentRegistration,
        selectRole,
        logout,
        setStudentData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
