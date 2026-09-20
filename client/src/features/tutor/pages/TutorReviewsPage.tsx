import React, { useState, useEffect } from 'react';
import { tutorService, TutorReview } from '../services/tutorService';

export const TutorReviewsPage: React.FC = () => {
  const [reviews, setReviews] = useState<TutorReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyingId, setReplyingId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const data = await tutorService.getReviews();
      setReviews(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleSendReply = async (reviewId: string) => {
    if (!replyText.trim()) return;
    await tutorService.replyToReview(reviewId, replyText);
    setReplyingId(null);
    setReplyText('');
    fetchReviews();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Reseñas y Valoraciones</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Opiniones y retroalimentación de los alumnos que han tomado clases contigo
        </p>
      </div>

      {/* Analytics Summary Card */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
        {/* Rating Score */}
        <div className="text-center sm:border-r border-slate-100 sm:pr-6">
          <div className="text-4xl sm:text-5xl font-black text-slate-900">4.9</div>
          <div className="flex items-center justify-center gap-1 text-amber-400 text-sm my-1">
            <i className="fa-solid fa-star"></i>
            <i className="fa-solid fa-star"></i>
            <i className="fa-solid fa-star"></i>
            <i className="fa-solid fa-star"></i>
            <i className="fa-solid fa-star"></i>
          </div>
          <span className="text-xs font-semibold text-slate-400">Basado en {reviews.length} opiniones</span>
        </div>

        {/* Rating Breakdown Bars */}
        <div className="sm:col-span-2 space-y-1.5 text-xs">
          <div className="flex items-center gap-3">
            <span className="font-bold text-slate-600 w-6">5 ★</span>
            <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-amber-400 rounded-full" style={{ width: '85%' }}></div>
            </div>
            <span className="text-[10px] text-slate-400 font-bold w-8 text-right">85%</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-bold text-slate-600 w-6">4 ★</span>
            <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-amber-400 rounded-full" style={{ width: '12%' }}></div>
            </div>
            <span className="text-[10px] text-slate-400 font-bold w-8 text-right">12%</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-bold text-slate-600 w-6">3 ★</span>
            <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-amber-400 rounded-full" style={{ width: '3%' }}></div>
            </div>
            <span className="text-[10px] text-slate-400 font-bold w-8 text-right">3%</span>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 space-y-6">
        <h2 className="text-base font-black text-slate-900 pb-3 border-b border-slate-100">
          Muro de Comentarios
        </h2>

        <div className="space-y-6 divide-y divide-slate-100">
          {reviews.map((rev) => (
            <div key={rev.id} className="pt-6 first:pt-0 space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={rev.studentAvatar}
                    alt={rev.studentName}
                    className="w-11 h-11 rounded-2xl object-cover border border-slate-200"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{rev.studentName}</h4>
                    <p className="text-[11px] text-purple-700 font-semibold">{rev.subject}</p>
                    <span className="text-[10px] text-slate-400">{rev.date}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-amber-400 text-xs">
                  {[...Array(rev.rating)].map((_, i) => (
                    <i key={i} className="fa-solid fa-star"></i>
                  ))}
                </div>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed italic bg-slate-50/70 p-3.5 rounded-2xl border border-slate-100">
                "{rev.comment}"
              </p>

              {/* Tutor Reply */}
              {rev.reply ? (
                <div className="ml-6 p-3.5 rounded-2xl bg-purple-50/70 border border-purple-100 text-xs space-y-1">
                  <p className="font-bold text-purple-900 flex items-center gap-1.5">
                    <i className="fa-solid fa-reply"></i> Tu Respuesta:
                  </p>
                  <p className="text-purple-800 text-[11px] leading-relaxed">{rev.reply}</p>
                </div>
              ) : replyingId === rev.id ? (
                <div className="ml-6 space-y-2">
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    rows={2}
                    placeholder="Escribe una respuesta cordial para este estudiante..."
                    className="w-full px-3 py-2 rounded-xl border border-purple-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setReplyingId(null)}
                      className="px-3 py-1 rounded-lg text-slate-500 hover:text-slate-700 text-xs font-semibold"
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSendReply(rev.id)}
                      className="px-3.5 py-1.5 rounded-lg bg-purple-600 text-white font-bold text-xs hover:bg-purple-700 transition-colors"
                    >
                      Publicar Respuesta
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setReplyingId(rev.id);
                      setReplyText('');
                    }}
                    className="text-xs font-bold text-purple-700 hover:text-purple-900 flex items-center gap-1"
                  >
                    <i className="fa-solid fa-reply text-[10px]"></i>
                    <span>Responder al alumno</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
