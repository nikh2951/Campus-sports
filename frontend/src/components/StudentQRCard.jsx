import React, { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Download, Shield, Sparkles } from 'lucide-react';

const StudentQRCard = ({ student }) => {
  const qrRef = useRef(null);

  const downloadQR = () => {
    const svgElement = qrRef.current.querySelector('svg');
    if (!svgElement) return;

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width + 40;
      canvas.height = img.height + 40;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 20, 20);

      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = `QR_${student.studentId}_SportsID.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  if (!student) return null;

  return (
    <div className="qr-card-container">
      <div style={{
        position: 'absolute',
        top: '1rem',
        right: '1rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.4rem',
        background: 'rgba(59, 130, 246, 0.2)',
        padding: '0.3rem 0.75rem',
        borderRadius: '20px',
        fontSize: '0.75rem',
        fontWeight: '700',
        color: '#60a5fa',
        border: '1px solid rgba(59, 130, 246, 0.4)',
      }}>
        <Sparkles size={14} /> OFFICIAL SPORTS PASS
      </div>

      <div style={{ textAlign: 'center', marginTop: '1rem' }}>
        <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#fff' }}>{student.fullName}</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
          {student.branch} - Sec {student.section}
        </p>
      </div>

      <div className="qr-box" ref={qrRef}>
        <QRCodeSVG
          value={student.studentId}
          size={180}
          bgColor={"#ffffff"}
          fgColor={"#0f172a"}
          level={"H"}
          includeMargin={true}
        />
      </div>

      <div style={{
        textAlign: 'center',
        background: 'rgba(15, 23, 42, 0.8)',
        padding: '0.6rem 1.25rem',
        borderRadius: '12px',
        border: '1px solid var(--border-color)',
        marginBottom: '1.25rem',
      }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '1px', display: 'block' }}>
          STUDENT IDENTIFICATION TOKEN
        </span>
        <span style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--primary)', letterSpacing: '1px' }}>
          {student.studentId}
        </span>
      </div>

      <button className="btn-primary" onClick={downloadQR} style={{ width: '100%', justifyContent: 'center' }}>
        <Download size={18} /> Download Sports QR Pass
      </button>
    </div>
  );
};

export default StudentQRCard;
