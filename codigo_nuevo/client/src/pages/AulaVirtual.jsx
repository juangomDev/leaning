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
    <div className="bg-slate-900 text-slate-100 font-sans antialiased h-screen flex flex-col overflow-hidden selection:bg-brand-500 selection:text-white">
      {/* ================= TOP ROOM BAR ================= */}
      <header className="h-16 bg-slate-950 border-b border-slate-800 px-4 sm:px-6 flex items-center justify-between shrink-0 z-30">
        <div className="flex items-center gap-4">
          <Link
            to="/dashboard"
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
            title="Volver al Dashboard"
          >
            <i className="fa-solid fa-arrow-left"></i>
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white text-xs shadow-md shadow-brand-500/30">
              <i className="fa-solid fa-graduation-cap"></i>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xs sm:text-sm font-bold text-white truncate max-w-[200px] sm:max-w-none">
                  Algoritmos & Estructuras de Datos
                </h1>
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 text-[10px] font-extrabold tracking-wide uppercase border border-red-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping"></span> En Vivo
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Profesor: Ing. Carlos Mendoza · Sesión #4</p>
            </div>
          </div>
        </div>

        {/* Center: Timer & Status */}
        <div className="hidden md:flex items-center gap-4">
          <div className="flex items-center gap-2 bg-slate-900 px-3.5 py-1.5 rounded-xl border border-slate-800 text-xs font-mono font-bold text-slate-200">
            <i className="fa-solid fa-clock text-brand-400"></i>
            <span>{formatTimer(seconds)}</span>
            <span className="text-slate-500 text-[10px]">/ 60:00</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span> Grabando clase
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-3 py-1 rounded-xl">
            <i className="fa-solid fa-wifi text-[10px]"></i> Conexión HD
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 text-slate-300 hover:text-white rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors"
            title="Abrir/Cerrar Chat"
          >
            <i className="fa-solid fa-comments text-sm"></i>
          </button>
          <button
            onClick={handleLeave}
            className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
          >
            <i className="fa-solid fa-phone-slash text-xs"></i> Salir
          </button>
        </div>
      </header>

      {/* ================= CLASSROOM BODY ================= */}
      <div className="flex-1 flex min-h-0 relative">
        {/* Main Stage */}
        <div className="flex-1 flex flex-col min-w-0 bg-slate-950 p-3 sm:p-5 relative overflow-hidden">
          <div className="flex-1 rounded-3xl overflow-hidden relative border border-slate-800/80 shadow-2xl bg-[#0b0f19] flex items-center justify-center">
            {whiteboardMode ? (
              /* Digital Whiteboard */
              <div className="w-full h-full bg-white text-slate-900 p-6 flex flex-col justify-between select-none">
                <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                  <div className="flex items-center gap-3">
                    <span className="font-extrabold text-sm text-slate-800 flex items-center gap-2">
                      <i className="fa-solid fa-pen-ruler text-brand-600"></i> Pizarra Colaborativa Activa
                    </span>
                    <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded font-mono text-slate-500">
                      Sincronizada en tiempo real
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs">
                      <i className="fa-solid fa-rotate-left"></i>
                    </button>
                    <button className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs">
                      <i className="fa-solid fa-rotate-right"></i>
                    </button>
                  </div>
                </div>

                <div className="flex-1 flex items-center justify-center p-8">
                  <div className="max-w-md text-center space-y-3 font-mono text-xs text-slate-500">
                    <p className="text-brand-600 font-bold text-base">class Nodo {'{'}</p>
                    <p className="pl-4">int valor;</p>
                    <p className="pl-4">Nodo* izquierdo;</p>
                    <p className="pl-4">Nodo* derecho;</p>
                    <p className="text-brand-600 font-bold text-base">{'}'};</p>
                    <div className="w-32 h-1 bg-brand-500 rounded-full mx-auto my-2"></div>
                    <p className="text-emerald-600 font-bold">✓ Punteros enlazados correctamente</p>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-2 pt-3 border-t border-slate-200">
                  <span className="text-xs font-semibold text-slate-500">Herramientas:</span>
                  <button className="px-3 py-1 bg-brand-600 text-white rounded-lg text-xs font-bold">Lápiz</button>
                  <button className="px-3 py-1 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg text-xs">Marcador</button>
                  <button className="px-3 py-1 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg text-xs">Texto</button>
                  <button className="px-3 py-1 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg text-xs">Borrador</button>
                </div>
              </div>
            ) : (
              /* Video Stream */
              <div className="w-full h-full relative">
                <img
                  src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1400&q=80"
                  alt="Profesor compartiendo pantalla"
                  className="w-full h-full object-cover"
                />

                {/* Overlay Tutor Tag */}
                <div className="absolute top-4 left-4 flex items-center gap-2 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700/60 text-xs">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
                    alt="Carlos"
                    className="w-5 h-5 rounded-full object-cover"
                  />
                  <span className="font-bold text-white">Ing. Carlos Mendoza</span>
                  <span className="text-[10px] text-emerald-400 font-semibold">(Profesor)</span>
                </div>

                {/* Student Camera Inset (PiP) */}
                <div className="absolute bottom-4 right-4 w-44 sm:w-56 aspect-video bg-slate-800 rounded-2xl overflow-hidden border-2 border-slate-700 shadow-2xl">
                  {cameraOn ? (
                    <img
                      src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80"
                      alt="Tú"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-900 text-slate-500 text-xs">
                      <i className="fa-solid fa-video-slash text-lg"></i>
                    </div>
                  )}
                  <div className="absolute bottom-2 left-2 flex items-center gap-1.5 bg-black/60 px-2 py-0.5 rounded-md text-[10px] font-semibold text-white">
                    <span>Tú</span>
                    {!micOn && <i className="fa-solid fa-microphone-slash text-red-400 text-[9px]"></i>}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ================= BOTTOM CONTROL DOCK ================= */}
          <div className="pt-3 flex items-center justify-center gap-2 sm:gap-3 shrink-0">
            {/* Mic */}
            <button
              onClick={() => setMicOn(!micOn)}
              className={`w-11 h-11 rounded-2xl flex items-center justify-center text-sm font-bold shadow-lg transition-all ${
                micOn ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-red-600 text-white'
              }`}
              title={micOn ? 'Silenciar Micrófono' : 'Activar Micrófono'}
            >
              <i className={`fa-solid ${micOn ? 'fa-microphone' : 'fa-microphone-slash'}`}></i>
            </button>

            {/* Camera */}
            <button
              onClick={() => setCameraOn(!cameraOn)}
              className={`w-11 h-11 rounded-2xl flex items-center justify-center text-sm font-bold shadow-lg transition-all ${
                cameraOn ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-red-600 text-white'
              }`}
              title={cameraOn ? 'Apagar Cámara' : 'Encender Cámara'}
            >
              <i className={`fa-solid ${cameraOn ? 'fa-video' : 'fa-video-slash'}`}></i>
            </button>

            {/* Screen Share */}
            <button
              onClick={() => setScreenShareOn(!screenShareOn)}
              className={`w-11 h-11 rounded-2xl flex items-center justify-center text-sm font-bold shadow-lg transition-all ${
                screenShareOn ? 'bg-brand-600 text-white' : 'bg-slate-800 text-white hover:bg-slate-700'
              }`}
              title="Compartir Pantalla"
            >
              <i className="fa-solid fa-arrow-up-from-bracket"></i>
            </button>

            {/* Whiteboard Toggle */}
            <button
              onClick={() => setWhiteboardMode(!whiteboardMode)}
              className={`w-11 h-11 rounded-2xl flex items-center justify-center text-sm font-bold shadow-lg transition-all ${
                whiteboardMode ? 'bg-purple-600 text-white' : 'bg-slate-800 text-white hover:bg-slate-700'
              }`}
              title="Pizarra Digital"
            >
              <i className="fa-solid fa-pen-ruler"></i>
            </button>

            {/* Raise Hand */}
            <button
              onClick={() => setHandRaised(!handRaised)}
              className={`w-11 h-11 rounded-2xl flex items-center justify-center text-sm font-bold shadow-lg transition-all ${
                handRaised ? 'bg-amber-500 text-white' : 'bg-slate-800 text-white hover:bg-slate-700'
              }`}
              title="Levantar la Mano"
            >
              <i className="fa-solid fa-hand"></i>
            </button>

            {/* End Call */}
            <button
              onClick={handleLeave}
              className="w-11 h-11 rounded-2xl bg-red-600 hover:bg-red-700 text-white flex items-center justify-center text-sm font-bold shadow-lg transition-all"
              title="Finalizar Llamada"
            >
              <i className="fa-solid fa-phone-slash"></i>
            </button>
          </div>
        </div>

        {/* ================= RIGHT SIDEBAR ================= */}
        {sidebarOpen && (
          <aside className="w-80 sm:w-96 bg-slate-950 border-l border-slate-800 flex flex-col shrink-0 animate-fadeIn">
            {/* Sidebar Tabs */}
            <div className="flex border-b border-slate-800">
              <button
                onClick={() => setSidebarTab('chat')}
                className={`flex-1 py-3 text-xs font-bold transition-all border-b-2 ${
                  sidebarTab === 'chat'
                    ? 'border-brand-500 text-brand-400 font-extrabold'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <i className="fa-solid fa-comments mr-1.5"></i> Chat en Vivo
              </button>
              <button
                onClick={() => setSidebarTab('participantes')}
                className={`flex-1 py-3 text-xs font-bold transition-all border-b-2 ${
                  sidebarTab === 'participantes'
                    ? 'border-brand-500 text-brand-400 font-extrabold'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <i className="fa-solid fa-users mr-1.5"></i> Participantes (2)
              </button>
            </div>

            {/* Tab: Chat */}
            {sidebarTab === 'chat' ? (
              <div className="flex-1 flex flex-col min-h-0">
                <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
                  {chatMessages.map((msg, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-2xl max-w-[85%] ${
                        msg.isTutor
                          ? 'bg-slate-800 text-slate-200 mr-auto border border-slate-700/60'
                          : 'bg-brand-600 text-white ml-auto'
                      }`}
                    >
                      <div className="flex justify-between items-center gap-2 mb-1">
                        <span className="font-bold text-[11px] opacity-90">{msg.sender}</span>
                        <span className="text-[9px] opacity-60">{msg.time}</span>
                      </div>
                      <p className="leading-relaxed">{msg.text}</p>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-800 flex gap-2">
                  <input
                    type="text"
                    value={newMsg}
                    onChange={(e) => setNewMsg(e.target.value)}
                    placeholder="Escribe un mensaje..."
                    className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-500"
                  />
                  <button
                    type="submit"
                    className="p-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold"
                  >
                    <i className="fa-solid fa-paper-plane"></i>
                  </button>
                </form>
              </div>
            ) : (
              /* Tab: Participantes */
              <div className="flex-1 p-4 space-y-3 overflow-y-auto text-xs">
                <div className="p-3 bg-slate-900 rounded-2xl border border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
                      alt="Carlos"
                      className="w-9 h-9 rounded-xl object-cover"
                    />
                    <div>
                      <p className="font-bold text-white">Ing. Carlos Mendoza</p>
                      <span className="text-[10px] text-brand-400 font-semibold">Tutor Principal</span>
                    </div>
                  </div>
                  <div className="flex gap-2 text-slate-400 text-xs">
                    <i className="fa-solid fa-microphone text-emerald-400"></i>
                    <i className="fa-solid fa-video text-emerald-400"></i>
                  </div>
                </div>

                <div className="p-3 bg-slate-900 rounded-2xl border border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img
                      src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80"
                      alt="Tú"
                      className="w-9 h-9 rounded-xl object-cover"
                    />
                    <div>
                      <p className="font-bold text-white">Tú (Alejandro Silva)</p>
                      <span className="text-[10px] text-emerald-400 font-semibold">Estudiante</span>
                    </div>
                  </div>
                  <div className="flex gap-2 text-slate-400 text-xs">
                    <i className={`fa-solid ${micOn ? 'fa-microphone text-emerald-400' : 'fa-microphone-slash text-red-400'}`}></i>
                    <i className={`fa-solid ${cameraOn ? 'fa-video text-emerald-400' : 'fa-video-slash text-red-400'}`}></i>
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
