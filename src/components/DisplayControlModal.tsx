import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Tv,
  ExternalLink,
  Copy,
  Check,
  Play,
  Pause,
  Timer,
  Trophy,
  Layers,
  Sparkles,
  QrCode,
  X,
  Volume2,
  Maximize,
  ArrowRight
} from 'lucide-react';
import { RoomState, DisplayViewMode } from '../types/game';
import { api } from '../services/api';
import { SoundSystem } from '../utils/audio';
import { getQrCodeSvgUrl } from '../utils/qrcode';

interface DisplayControlModalProps {
  room: RoomState;
  onClose: () => void;
}

export const DisplayControlModal: React.FC<DisplayControlModalProps> = ({ room, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [countdownRunning, setCountdownRunning] = useState(false);

  const presenter = room.presenter || {
    viewMode: 'AUTO',
    autoIntervalSeconds: 15,
    isAutoPlaying: true,
    highlightTeamId: undefined,
    countdownValue: null,
    countdownStartedAt: null
  };

  // URL de transmissão do Telão
  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : '';
  const displayUrl = `${currentOrigin}/?mode=display&room=${room.code}`;
  const qrCodeUrl = getQrCodeSvgUrl(displayUrl, 180);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(displayUrl);
    setCopied(true);
    SoundSystem.playClick();
    setTimeout(() => setCopied(false), 2500);
  };

  const handleOpenWindow = () => {
    SoundSystem.playClick();
    window.open(displayUrl, '_blank', 'noopener,noreferrer');
  };

  const handleSetView = async (mode: DisplayViewMode) => {
    SoundSystem.playClick();
    await api.adminAction(room.code, {
      action: 'SET_PRESENTER_VIEW',
      adminPassword: room.settings.adminPassword,
      viewMode: mode
    });
  };

  const handleToggleAuto = async () => {
    SoundSystem.playClick();
    await api.adminAction(room.code, {
      action: 'TOGGLE_AUTO_PRESENTATION',
      adminPassword: room.settings.adminPassword,
      isAutoPlaying: !presenter.isAutoPlaying,
      autoIntervalSeconds: presenter.autoIntervalSeconds || 15
    });
  };

  const handleSetInterval = async (seconds: number) => {
    SoundSystem.playClick();
    await api.adminAction(room.code, {
      action: 'TOGGLE_AUTO_PRESENTATION',
      adminPassword: room.settings.adminPassword,
      isAutoPlaying: presenter.isAutoPlaying,
      autoIntervalSeconds: seconds
    });
  };

  const handleTriggerCountdown = async () => {
    if (countdownRunning) return;
    setCountdownRunning(true);
    SoundSystem.playClick();
    await api.adminAction(room.code, {
      action: 'TRIGGER_COUNTDOWN',
      adminPassword: room.settings.adminPassword,
      countdownValue: 5
    });
    setTimeout(() => setCountdownRunning(false), 7000);
  };

  const handleHighlightTeam = async (teamId: string) => {
    SoundSystem.playClick();
    await api.adminAction(room.code, {
      action: 'HIGHLIGHT_TEAM',
      adminPassword: room.settings.adminPassword,
      targetTeamId: teamId === 'NONE' ? '' : teamId
    });
  };

  const viewModes: Array<{ id: DisplayViewMode; label: string; icon: any }> = [
    { id: 'AUTO', label: 'Modo Apresentação Automática', icon: Play },
    { id: 'OVERVIEW', label: 'Painel Central (5 Áreas)', icon: Tv },
    { id: 'OPENING', label: 'Tela de Abertura do Evento', icon: Sparkles },
    { id: 'RANKING', label: 'Classificação Geral (Ranking)', icon: Trophy },
    { id: 'ROUNDS', label: 'Progresso das 5 Rodadas', icon: Layers },
    { id: 'PUZZLE', label: 'Evolução do Quebra-Cabeça (25 Peças)', icon: Layers },
    { id: 'HIGHLIGHTS', label: 'Destaques da Competição', icon: Sparkles },
    { id: 'FINALE', label: 'Grande Final & Premiação', icon: Trophy }
  ];

  const teams = Object.values(room.teams || {});

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/90 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-4xl bg-[#071d15] rounded-3xl border-2 border-emerald-500 shadow-2xl text-white overflow-hidden my-auto"
      >
        {/* Header do Modal */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-[#0a2c1f] via-[#0d3b2a] to-[#0a2c1f] border-b border-emerald-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-300 shadow-lg">
              <Tv className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black tracking-tight text-white">
                  MODO TELÃO & TRANSMISSÃO AO VIVO
                </h2>
                <span className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-600 text-[10px] text-emerald-300 font-bold uppercase tracking-wider">
                  Ao Vivo
                </span>
              </div>
              <p className="text-xs text-emerald-300/80 mt-0.5">
                Central de projeção em TVs, telões e projetores para eventos presenciais do SENAR-RO
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-emerald-950 hover:bg-emerald-900 border border-emerald-800 text-emerald-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Corpo do Controle */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Seção 1: Links de Acesso Rápido e QR Code */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center p-4 rounded-2xl bg-black/40 border border-emerald-800/80">
            {/* Informações e Botão de Abertura */}
            <div className="md:col-span-8 space-y-3">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                Endereço Exclusivo de Transmissão (Somente Leitura):
              </span>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-black/60 border border-emerald-700/80 font-mono text-xs text-emerald-300 overflow-hidden">
                <span className="truncate flex-1 select-all">{displayUrl}</span>
                <button
                  onClick={handleCopyLink}
                  title="Copiar link"
                  className="px-2.5 py-1 rounded-lg bg-emerald-950 hover:bg-emerald-900 border border-emerald-700 text-emerald-200 text-xs font-bold flex items-center gap-1 shrink-0 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copiado!' : 'Copiar'}</span>
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 pt-1">
                <button
                  onClick={handleOpenWindow}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-black font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-emerald-950/50 transition-all active:scale-95"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Abrir Telão em Nova Janela</span>
                </button>

                <button
                  onClick={handleTriggerCountdown}
                  disabled={countdownRunning}
                  className="px-4 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 text-amber-300 font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 transition-all disabled:opacity-50"
                >
                  <Timer className="w-4 h-4 text-amber-400" />
                  <span>{countdownRunning ? 'Contando (5s)...' : 'Iniciar Contagem (5..1)'}</span>
                </button>
              </div>
            </div>

            {/* QR Code de Projeção */}
            <div className="md:col-span-4 flex flex-col items-center justify-center p-3 rounded-xl bg-[#05160f] border border-emerald-900 text-center">
              <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider mb-2 flex items-center gap-1">
                <QrCode className="w-3.5 h-3.5" />
                Acesso Rápido via QR Code
              </span>
              <div className="w-28 h-28 bg-white p-1 rounded-lg shadow-md flex items-center justify-center overflow-hidden">
                <img
                  src={qrCodeUrl}
                  alt="QR Code do Telão"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-[10px] text-emerald-400/70 mt-1">
                Aponte a câmera para abrir no dispositivo
              </span>
            </div>
          </div>

          {/* Seção 2: Controle do Apresentador (Seleção de Tela) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-emerald-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Controle do Apresentador — Selecionar Tela Exibida
              </h3>
              <span className="text-xs text-emerald-400/80">
                Visualização Atual: <strong className="text-white font-mono">{presenter.viewMode}</strong>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
              {viewModes.map((v) => {
                const IconComponent = v.icon;
                const isActive = presenter.viewMode === v.id;

                return (
                  <button
                    key={v.id}
                    onClick={() => handleSetView(v.id)}
                    className={`p-3 rounded-xl text-left text-xs font-semibold border transition-all flex flex-col justify-between gap-2 ${
                      isActive
                        ? 'bg-emerald-600 text-black border-emerald-400 shadow-lg font-extrabold'
                        : 'bg-black/30 hover:bg-emerald-950/60 border-emerald-900/80 text-emerald-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <IconComponent className={`w-4 h-4 ${isActive ? 'text-black' : 'text-emerald-400'}`} />
                      {isActive && (
                        <span className="text-[9px] uppercase px-1.5 py-0.2 rounded bg-black/30 text-white font-bold">
                          Ativa
                        </span>
                      )}
                    </div>
                    <span className="leading-tight">{v.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Seção 3: Modo Apresentação Automática & Destaques */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {/* Slideshow Automático */}
            <div className="p-4 rounded-xl bg-black/40 border border-emerald-800/80 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <Play className="w-4 h-4 text-emerald-400" />
                  Apresentação Automática (Slideshow)
                </span>
                <button
                  onClick={handleToggleAuto}
                  className={`px-3 py-1 rounded-full text-xs font-bold uppercase transition-colors ${
                    presenter.isAutoPlaying
                      ? 'bg-emerald-500 text-black'
                      : 'bg-emerald-950 text-emerald-400 border border-emerald-700'
                  }`}
                >
                  {presenter.isAutoPlaying ? 'Ligada' : 'Pausada'}
                </button>
              </div>
              <p className="text-[11px] text-emerald-300/70">
                Alterna suavemente entre Ranking, Rodadas, Lotes e Destaques sem intervenção manual.
              </p>
              <div className="flex items-center gap-2 pt-1">
                <span className="text-[11px] text-emerald-400">Tempo por tela:</span>
                {[10, 15, 30].map((sec) => (
                  <button
                    key={sec}
                    onClick={() => handleSetInterval(sec)}
                    className={`px-2.5 py-1 rounded text-[11px] font-bold ${
                      presenter.autoIntervalSeconds === sec
                        ? 'bg-amber-500 text-black'
                        : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    }`}
                  >
                    {sec}s
                  </button>
                ))}
              </div>
            </div>

            {/* Destaque de Equipe */}
            <div className="p-4 rounded-xl bg-black/40 border border-emerald-800/80 space-y-3 text-xs">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-amber-400" />
                Destacar Equipe Específica no Telão
              </span>
              <p className="text-[11px] text-emerald-300/70">
                Dá destaque visual tridimensional e foca a atenção na equipe selecionada.
              </p>
              <select
                value={presenter.highlightTeamId || 'NONE'}
                onChange={(e) => handleHighlightTeam(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-black/70 border border-emerald-700 text-white text-xs outline-none"
              >
                <option value="NONE">Nenhuma equipe destacada (Padrão)</option>
                {teams.map((t) => (
                  <option key={t.id} value={t.id}>
                    ⭐ Destacar: {t.name} (Capitão: {t.captainName})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Rodapé do Modal */}
        <div className="p-4 bg-[#05150e] border-t border-emerald-900 flex items-center justify-between text-xs text-emerald-400/80">
          <span>O telão opera em modo somente-leitura e não altera dados da partida.</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold"
          >
            Fechar Controle
          </button>
        </div>
      </motion.div>
    </div>
  );
};
