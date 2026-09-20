import React from 'react';

interface PasswordStrengthMeterProps {
  password: string;
}

export const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({ password }) => {
  const calculateScore = (pwd: string): number => {
    if (!pwd) return 0;
    let score = 0;
    if (pwd.length >= 6) score++;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd) || /[^A-Za-z0-9]/.test(pwd)) score++;
    return score;
  };

  const score = calculateScore(password);

  if (!password) return null;

  const getLabel = () => {
    switch (score) {
      case 1:
        return { text: 'Débil', color: 'text-red-500' };
      case 2:
        return { text: 'Aceptable', color: 'text-amber-500' };
      case 3:
        return { text: 'Buena', color: 'text-blue-500' };
      case 4:
        return { text: 'Excelente', color: 'text-emerald-500' };
      default:
        return { text: 'Muy corta', color: 'text-slate-400' };
    }
  };

  const { text, color } = getLabel();

  return (
    <div className="space-y-1.5 pt-1">
      <div className="flex gap-1.5 h-1.5 w-full">
        <div
          className={`flex-1 rounded-full transition-all duration-300 ${
            score >= 1 ? (score === 1 ? 'bg-red-500' : 'bg-emerald-500') : 'bg-slate-200'
          }`}
        />
        <div
          className={`flex-1 rounded-full transition-all duration-300 ${
            score >= 2 ? (score === 2 ? 'bg-amber-500' : 'bg-emerald-500') : 'bg-slate-200'
          }`}
        />
        <div
          className={`flex-1 rounded-full transition-all duration-300 ${
            score >= 3 ? (score === 3 ? 'bg-blue-500' : 'bg-emerald-500') : 'bg-slate-200'
          }`}
        />
        <div
          className={`flex-1 rounded-full transition-all duration-300 ${
            score >= 4 ? 'bg-emerald-500' : 'bg-slate-200'
          }`}
        />
      </div>
      <div className="flex justify-between items-center text-[10px]">
        <span className="text-slate-500">Seguridad de contraseña:</span>
        <span className={`font-bold ${color}`}>{text}</span>
      </div>
    </div>
  );
};
