import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, HelpCircle, Trophy, Shield, Copy, Check, Users, Tv } from 'lucide-react';
import { SoundSystem } from '../utils/audio';
import { RoomState, Team } from '../types/game';

interface HeaderProps {
  room: RoomState | null;
  myTeam: Team | null;
  onOpenHowToPlay: () => void;
  onOpenRanking: () => void;
  onOpenAdmin: () => void;
  onOpenDisplay?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  room,
  myTeam,
  onOpenHowToPlay,
  onOpenRanking,
  onOpenAdmin,
  onOpenDisplay
}) => {
  const [muted, setMuted] = useState(SoundSystem.isMuted());
  const [copied, setCopied] = useState(false);
  const [elapsedTime, setElapsedTime] = useState('00:00');

  const toggleSound = () => {
    const next = SoundSystem.toggleMute();
    setMuted(next);
  };

  const copyCode = () => {
    if (!room) return;
    navigator.clipboard.writeText(room.code);
    setCopied(true);
    SoundSystem.playClick();
    setTimeout(() => setCopied(false), 2000);
  };

  // Timer geral da partida em tempo real
  useEffect(() => {
    if (!room || !room.matchStartedAt) {
      setElapsedTime('00:00');
      return;
    }

    const updateTimer = () => {
      const now = room.matchEndedAt || (room.isPaused && room.pausedAt ? room.pausedAt : Date.now());
      const diffSec = Math.max(0, Math.floor((now - (room.matchStartedAt || 0)) / 1000));
      const mins = Math.floor(diffSec / 60);
      const secs = diffSec % 60;
      setElapsedTime(
        `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
      );
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [room?.matchStartedAt, room?.matchEndedAt, room?.isPaused, room?.pausedAt]);

  return (
    <header className="sticky top-0 z-40 bg-gradient-to-r from-[#071912] via-[#0d2a1f] to-[#071912] border-b border-emerald-900/60 shadow-xl backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
        {/* Brand Zone */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-950/50 text-white font-black text-sm tracking-wider">
            SENAR
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-white tracking-tight whitespace-nowrap">
                DESAFIO SENAR 2030
              </span>
              <span className="hidden sm:inline-block text-xs font-semibold text-emerald-400 bg-emerald-950/70 border border-emerald-700/50 px-2 py-0.5 rounded">
                RO 2027–2030
              </span>
            </div>
            <p className="text-[11px] text-emerald-300/80 hidden md:block">
              Conhecimento que transforma, campo que prospera
            </p>
          </div>
        </div>

        {/* Informações da Sala & Cronômetro */}
        {room && (
          <div className="flex items-center gap-2 md:gap-4 text-xs">
            {/* Código da Sala */}
            <button
              onClick={copyCode}
              title="Clique para copiar o código da sala"
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-950/80 hover:bg-emerald-900/80 border border-emerald-700/60 text-emerald-200 transition-colors"
            >
              <span className="text-emerald-400 font-semibold">SALA:</span>
              <span className="font-mono font-bold tracking-wider text-white">{room.code}</span>
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-emerald-400/70" />}
            </button>

            {/* Cronômetro Oficial do Servidor */}
            {room.matchStartedAt && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900/80 border border-amber-600/40 text-amber-300 font-mono font-bold">
                <span className="text-[10px] text-amber-400/80 font-sans uppercase">TEMPO:</span>
                <span className="tabular-nums">{elapsedTime}</span>
              </div>
            )}

            {/* Status da Minha Equipe */}
            {myTeam && (
              <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-md bg-emerald-900/40 border border-emerald-700/40 text-white">
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: myTeam.color }}
                />
                <span className="font-semibold max-w-[130px] truncate">{myTeam.name}</span>
                <span className="text-emerald-400/60">·</span>
                <span className="text-emerald-300 flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {myTeam.players.length}/10
                </span>
              </div>
            )}
          </div>
        )}

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button
            onClick={toggleSound}
            aria-label={muted ? 'Ativar som' : 'Desativar som'}
            className="p-2 rounded-lg bg-emerald-950/70 hover:bg-emerald-900 border border-emerald-800/60 text-emerald-200 transition-colors"
            title={muted ? 'Ativar Efeitos Sonoros' : 'Silenciar'}
          >
            {muted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>

          <button
            onClick={onOpenHowToPlay}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-950/70 hover:bg-emerald-900 border border-emerald-800/60 text-emerald-200 text-xs font-medium transition-colors"
            title="Como Jogar e Regras"
          >
            <HelpCircle className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">Regras</span>
          </button>

          <button
            onClick={onOpenRanking}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-semibold transition-colors"
            title="Placar e Classificação ao Vivo"
          >
            <Trophy className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">Ranking</span>
          </button>

          {onOpenDisplay && (
            <button
              onClick={onOpenDisplay}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 text-xs font-semibold transition-colors shadow-sm"
              title="Abrir Modo Telão / Transmissão ao Vivo"
            >
              <Tv className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">Telão</span>
            </button>
          )}

          <button
            onClick={onOpenAdmin}
            className="p-2 rounded-lg bg-emerald-950/70 hover:bg-emerald-900 border border-emerald-800/60 text-emerald-300 transition-colors"
            title="Painel Administrativo"
          >
            <Shield className="w-4 h-4 text-emerald-400" />
          </button>
        </div>
      </div>
    </header>
  );
};
