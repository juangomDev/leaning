import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export const AulaVirtual = () => {
  const navigate = useNavigate();

  // Classroom Controls
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);
  const [screenShareOn, setScreenShareOn] = useState(false);
  const [whiteboardMode, setWhiteboardMode] = useState(false);
  const [handRaised, setHandRaised] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarTab, setSidebarTab] = useState('chat'); // 'chat' | 'participantes'

  // Chat State
  const [chatMessages, setChatMessages] = useState([
    { sender: 'Carlos Mendoza (Tutor)', text: '¡Hola Alejandro! Empecemos con el ejercicio 3 de árboles binarios.', time: '16:02', isTutor: true },
    { sender: 'Tú', text: '¡Hola profesor! Listo, ya tengo el compilador abierto.', time: '16:03', isTutor: false },
  ]);
  const [newMsg, setNewMsg] = useState('');

  // Live Timer
  const [seconds, setSeconds] = useState(1122); // 18m 42s
  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMsg.trim()) return;
    setChatMessages([
      ...chatMessages,
      {
        sender: 'Tú',
        text: newMsg,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isTutor: false,
      },
    ]);
    setNewMsg('');
  };

  const handleLeave = () => {
    if (window.confirm('¿Seguro que deseas salir del aula virtual?')) {
      navigate('/dashboard/clases');
    }
  };

  return (
    <div className="classroom-root">
      {/* ================= TOP ROOM BAR ================= */}
      <header className="classroom-header">
        <div className="classroom-header-left">
          <Link
            to="/dashboard"
            className="classroom-back-btn"
            title="Volver al Dashboard"
          >
            <i className="fa-solid fa-arrow-left"></i>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '2rem', height: '2rem', borderRadius: 'var(--radius-lg)', backgroundColor: 'var(--color-brand-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.75rem' }}>
              <i className="fa-solid fa-graduation-cap"></i>
            </div>
            <div>
              <div className="classroom-title-badge">
                <h1 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#ffffff', margin: 0 }}>
                  Algoritmos & Estructuras de Datos
                </h1>
                <span className="classroom-badge-live">
                  <span style={{ width: '0.375rem', height: '0.375rem', borderRadius: '9999px', backgroundColor: '#f87171' }}></span> En Vivo
                </span>
              </div>
              <p style={{ fontSize: '11px', color: '#94a3b8', margin: 0 }}>Profesor: Ing. Carlos Mendoza · Sesión #4</p>
            </div>
          </div>
        </div>

        {/* Center: Timer & Status */}
        <div className="classroom-header-center">
          <div className="classroom-timer">
            <i className="fa-solid fa-clock" style={{ color: '#60a5fa' }}></i>
            <span>{formatTimer(seconds)}</span>
            <span style={{ color: '#64748b', fontSize: '10px' }}>/ 60:00</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.75rem', color: '#94a3b8' }}>
            <span style={{ width: '0.5rem', height: '0.5rem', borderRadius: '9999px', backgroundColor: '#ef4444' }}></span> Grabando clase
          </div>
        </div>

        {/* Right actions */}
        <div className="classroom-header-right">
          <div className="classroom-connection-badge">
            <i className="fa-solid fa-wifi" style={{ fontSize: '10px' }}></i> Conexión HD
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="classroom-back-btn"
            title="Abrir/Cerrar Chat"
          >
            <i className="fa-solid fa-comments" style={{ fontSize: '0.875rem' }}></i>
          </button>
          <button
            onClick={handleLeave}
            className="classroom-btn-leave"
          >
            <i className="fa-solid fa-phone-slash" style={{ fontSize: '0.75rem' }}></i> Salir
          </button>
        </div>
      </header>

      {/* ================= CLASSROOM BODY ================= */}
      <div className="classroom-body">
        {/* Main Stage */}
        <div className="classroom-main-stage">
          <div className="classroom-canvas-wrapper">
            {whiteboardMode ? (
              /* Digital Whiteboard */
              <div style={{ width: '100%', height: '100%', backgroundColor: '#ffffff', color: '#0f172a', padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', userSelect: 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '1rem', borderBottom: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ fontWeight: 800, fontSize: '0.875rem', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <i className="fa-solid fa-pen-ruler" style={{ color: 'var(--color-brand-600)' }}></i> Pizarra Colaborativa Activa
                    </span>
                    <span style={{ fontSize: '10px', backgroundColor: '#f1f5f9', padding: '0.125rem 0.5rem', borderRadius: 4, fontFamily: 'monospace', color: '#64748b' }}>
                      Sincronizada en tiempo real
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button style={{ padding: '0.375rem', borderRadius: 'var(--radius-lg)', border: '1px solid #e2e8f0', background: 'transparent', cursor: 'pointer', fontSize: '0.75rem' }}>
                      <i className="fa-solid fa-rotate-left"></i>
                    </button>
                    <button style={{ padding: '0.375rem', borderRadius: 'var(--radius-lg)', border: '1px solid #e2e8f0', background: 'transparent', cursor: 'pointer', fontSize: '0.75rem' }}>
                      <i className="fa-solid fa-rotate-right"></i>
                    </button>
                  </div>
                </div>

                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
                  <div style={{ maxWidth: '28rem', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontFamily: 'monospace', fontSize: '0.75rem', color: '#64748b' }}>
                    <p style={{ color: 'var(--color-brand-600)', fontWeight: 700, fontSize: '1rem', margin: 0 }}>class Nodo {'{'}</p>
                    <p style={{ paddingLeft: '1rem', margin: 0 }}>int valor;</p>
                    <p style={{ paddingLeft: '1rem', margin: 0 }}>Nodo* izquierdo;</p>
                    <p style={{ paddingLeft: '1rem', margin: 0 }}>Nodo* derecho;</p>
                    <p style={{ color: 'var(--color-brand-600)', fontWeight: 700, fontSize: '1rem', margin: 0 }}>{'}'};</p>
                    <div style={{ width: '8rem', height: 4, backgroundColor: 'var(--color-brand-500)', borderRadius: 9999, margin: '0.5rem auto' }}></div>
                    <p style={{ color: '#059669', fontWeight: 700, margin: 0 }}>✓ Punteros enlazados correctamente</p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', paddingTop: '0.75rem', borderTop: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>Herramientas:</span>
                  <button className="btn btn-primary btn-sm">Lápiz</button>
                  <button className="btn btn-secondary btn-sm">Marcador</button>
                  <button className="btn btn-secondary btn-sm">Texto</button>
                  <button className="btn btn-secondary btn-sm">Borrador</button>
                </div>
              </div>
            ) : (
              /* Video Stream */
              <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                <img
                  src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1400&q=80"
                  alt="Profesor compartiendo pantalla"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />

                {/* Overlay Tutor Tag */}
                <div className="classroom-tutor-overlay">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
                    alt="Carlos"
                    style={{ width: '1.25rem', height: '1.25rem', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <span style={{ fontWeight: 700, color: '#ffffff' }}>Ing. Carlos Mendoza</span>
                  <span style={{ fontSize: '10px', color: '#34d399', fontWeight: 600 }}>(Profesor)</span>
                </div>

                {/* Student Camera Inset (PiP) */}
                <div className="classroom-pip-camera">
                  {cameraOn ? (
                    <img
                      src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80"
                      alt="Tú"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0f172a', color: '#64748b' }}>
                      <i className="fa-solid fa-video-slash" style={{ fontSize: '1.125rem' }}></i>
                    </div>
                  )}
                  <div className="classroom-pip-tag">
                    <span>Tú</span>
                    {!micOn && <i className="fa-solid fa-microphone-slash" style={{ color: '#f87171', fontSize: '9px' }}></i>}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ================= BOTTOM CONTROL DOCK ================= */}
          <div className="classroom-dock">
            {/* Mic */}
            <button
              onClick={() => setMicOn(!micOn)}
              className={`classroom-dock-btn ${micOn ? '' : 'btn-danger'}`}
              title={micOn ? 'Silenciar Micrófono' : 'Activar Micrófono'}
            >
              <i className={`fa-solid ${micOn ? 'fa-microphone' : 'fa-microphone-slash'}`}></i>
            </button>

            {/* Camera */}
            <button
              onClick={() => setCameraOn(!cameraOn)}
              className={`classroom-dock-btn ${cameraOn ? '' : 'btn-danger'}`}
              title={cameraOn ? 'Apagar Cámara' : 'Encender Cámara'}
            >
              <i className={`fa-solid ${cameraOn ? 'fa-video' : 'fa-video-slash'}`}></i>
            </button>

            {/* Screen Share */}
            <button
              onClick={() => setScreenShareOn(!screenShareOn)}
              className={`classroom-dock-btn ${screenShareOn ? 'active-blue' : ''}`}
              title="Compartir Pantalla"
            >
              <i className="fa-solid fa-arrow-up-from-bracket"></i>
            </button>

            {/* Whiteboard Toggle */}
            <button
              onClick={() => setWhiteboardMode(!whiteboardMode)}
              className={`classroom-dock-btn ${whiteboardMode ? 'active-purple' : ''}`}
              title="Pizarra Digital"
            >
              <i className="fa-solid fa-pen-ruler"></i>
            </button>

            {/* Raise Hand */}
            <button
              onClick={() => setHandRaised(!handRaised)}
              className={`classroom-dock-btn ${handRaised ? 'active-amber' : ''}`}
              title="Levantar la Mano"
            >
              <i className="fa-solid fa-hand"></i>
            </button>

            {/* End Call */}
            <button
              onClick={handleLeave}
              className="classroom-dock-btn btn-danger"
              title="Finalizar Llamada"
            >
              <i className="fa-solid fa-phone-slash"></i>
            </button>
          </div>
        </div>

        {/* ================= RIGHT SIDEBAR ================= */}
        {sidebarOpen && (
          <aside className="classroom-sidebar">
            {/* Sidebar Tabs */}
            <div className="classroom-sidebar-nav">
              <button
                onClick={() => setSidebarTab('chat')}
                className={`classroom-sidebar-tab-btn ${sidebarTab === 'chat' ? 'active' : ''}`}
              >
                <i className="fa-solid fa-comments"></i> Chat en Vivo
              </button>
              <button
                onClick={() => setSidebarTab('participantes')}
                className={`classroom-sidebar-tab-btn ${sidebarTab === 'participantes' ? 'active' : ''}`}
              >
                <i className="fa-solid fa-users"></i> Participantes (2)
              </button>
            </div>

            {/* Tab: Chat */}
            {sidebarTab === 'chat' ? (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                <div className="classroom-chat-stream">
                  {chatMessages.map((msg, index) => (
                    <div
                      key={index}
                      className={`classroom-msg-card ${msg.isTutor ? 'from-tutor' : 'from-me'}`}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                        <span style={{ fontWeight: 700, fontSize: '11px', opacity: 0.9 }}>{msg.sender}</span>
                        <span style={{ fontSize: '9px', opacity: 0.6 }}>{msg.time}</span>
                      </div>
                      <p style={{ margin: 0, lineHeight: 1.5 }}>{msg.text}</p>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSendMessage} className="classroom-chat-form">
                  <input
                    type="text"
                    value={newMsg}
                    onChange={(e) => setNewMsg(e.target.value)}
                    placeholder="Escribe un mensaje..."
                    className="classroom-chat-input"
                  />
                  <button
                    type="submit"
                    className="classroom-chat-send"
                  >
                    <i className="fa-solid fa-paper-plane"></i>
                  </button>
                </form>
              </div>
            ) : (
              /* Tab: Participantes */
              <div style={{ flex: 1, padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', overflowY: 'auto', fontSize: '0.75rem' }}>
                <div className="classroom-participant-card">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
                      alt="Carlos"
                      style={{ width: '2.25rem', height: '2.25rem', borderRadius: 'var(--radius-xl)', objectFit: 'cover' }}
                    />
                    <div>
                      <p style={{ fontWeight: 700, color: '#ffffff', margin: 0 }}>Ing. Carlos Mendoza</p>
                      <span style={{ fontSize: '10px', color: '#60a5fa', fontWeight: 600 }}>Tutor Principal</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', color: '#94a3b8' }}>
                    <i className="fa-solid fa-microphone" style={{ color: '#34d399' }}></i>
                    <i className="fa-solid fa-video" style={{ color: '#34d399' }}></i>
                  </div>
                </div>

                <div className="classroom-participant-card">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                    <img
                      src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80"
                      alt="Tú"
                      style={{ width: '2.25rem', height: '2.25rem', borderRadius: 'var(--radius-xl)', objectFit: 'cover' }}
                    />
                    <div>
                      <p style={{ fontWeight: 700, color: '#ffffff', margin: 0 }}>Tú (Alejandro Silva)</p>
                      <span style={{ fontSize: '10px', color: '#34d399', fontWeight: 600 }}>Estudiante</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', color: '#94a3b8' }}>
                    <i className={`fa-solid ${micOn ? 'fa-microphone' : 'fa-microphone-slash'}`} style={{ color: micOn ? '#34d399' : '#f87171' }}></i>
                    <i className={`fa-solid ${cameraOn ? 'fa-video' : 'fa-video-slash'}`} style={{ color: cameraOn ? '#34d399' : '#f87171' }}></i>
                  </div>
                </div>
              </div>
            )}
          </aside>
        )}
      </div>
    </div>
  );
};
