import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Camera, X, AlertCircle, Keyboard } from 'lucide-react';

const QRScannerModal = ({ isOpen, onClose, onScanSuccess }) => {
  const [cameraError, setCameraError] = useState(null);
  const [manualId, setManualId] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const scannerRef = useRef(null);

  useEffect(() => {
    let html5QrcodeScanner = null;

    if (isOpen) {
      setCameraError(null);
      setIsScanning(true);

      const elementId = "html5-qr-reader";
      html5QrcodeScanner = new Html5Qrcode(elementId);
      scannerRef.current = html5QrcodeScanner;

      const config = { fps: 10, qrbox: { width: 220, height: 220 } };

      html5QrcodeScanner
        .start(
          { facingMode: "environment" },
          config,
          (decodedText) => {
            // Success scan
            if (html5QrcodeScanner && html5QrcodeScanner.isScanning) {
              html5QrcodeScanner.stop().then(() => {
                onScanSuccess(decodedText);
                onClose();
              }).catch(() => {
                onScanSuccess(decodedText);
                onClose();
              });
            }
          },
          (errorMessage) => {
            // Ignore frame parse errors
          }
        )
        .catch((err) => {
          console.error("Camera access error: ", err);
          setCameraError("Unable to access camera. Please verify camera permissions or enter Student ID manually below.");
          setIsScanning(false);
        });
    }

    return () => {
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop().catch((e) => console.log(e));
      }
    };
  }, [isOpen]);

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!manualId.trim()) return;
    if (scannerRef.current && scannerRef.current.isScanning) {
      scannerRef.current.stop().catch(() => {});
    }
    onScanSuccess(manualId.trim().toUpperCase());
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.85)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem',
    }}>
      <div className="glass-card" style={{ width: '100%', maxWidth: '480px', padding: '1.75rem', position: 'relative' }}>
        <button
          onClick={() => {
            if (scannerRef.current && scannerRef.current.isScanning) {
              scannerRef.current.stop().catch(() => {});
            }
            onClose();
          }}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            background: 'rgba(255, 255, 255, 0.1)',
            border: 'none',
            color: '#fff',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <X size={18} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
          <Camera style={{ color: 'var(--primary)' }} size={24} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: '700' }}>Scan Student QR Code</h3>
        </div>

        {cameraError ? (
          <div className="alert alert-error" style={{ marginBottom: '1.5rem' }}>
            <AlertCircle size={20} />
            <div>{cameraError}</div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
            <div id="html5-qr-reader" style={{
              width: '100%',
              borderRadius: '12px',
              overflow: 'hidden',
              background: '#000',
              border: '2px dashed var(--primary)',
            }}></div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.75rem' }}>
              Position the Student QR Code within the camera box to scan automatically.
            </p>
          </div>
        )}

        <div style={{
          borderTop: '1px solid var(--border-color)',
          paddingTop: '1.25rem',
          marginTop: '1rem',
        }}>
          <form onSubmit={handleManualSubmit}>
            <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>
              <Keyboard size={16} style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }} /> Or Enter Student ID Manually:
            </label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. STU123456"
                value={manualId}
                onChange={(e) => setManualId(e.target.value)}
                style={{ flex: 1 }}
              />
              <button type="submit" className="btn-primary">
                Verify
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default QRScannerModal;
