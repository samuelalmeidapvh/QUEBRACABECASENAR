import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Trophy,
  Clock,
  Layers,
  Sparkles,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
  Users,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Play,
  Pause,
  Award,
  Crown,
  ChevronRight,
  ShieldCheck,
  Flame,
  Zap
} from 'lucide-react';
import { RoomState, Team, DisplayViewMode } from '../types/game';
import { ROUND_NAMES, LOT_PIECES_MAP } from '../data/questionsData';
import { SoundSystem } from '../utils/audio';
import { triggerConfetti } from '../utils/confetti';

interface DisplayViewProps {
  room: RoomState;
  onExitDisplay?: () => void;
}

const MAP_IMAGE_URL = '/assets/aistudio/Mapa_Estrat_gico_SENAR_2027_2030_BSC_4ee0c9a7.png';

const AUTO_CYCLE_MODES: DisplayViewMode[] = [
  'OVERVIEW',
  'RANKING',
  'ROUNDS',
  'PUZZLE',
  'HIGHLIGHTS'
];

export const DisplayView: React.FC<DisplayViewProps> = ({ room, onExitDisplay }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [muted, setMuted] = useState(SoundSystem.isMuted());
  const [elapsedTime, setElapsedTime] = useState('00:00');
  const [countdownNum, setCountdownNum] = useState<number | null>(null);

  // Modo de exibição atual (controlado pelo apresentador ou pelo slideshow local)
  const presenter = room.presenter || {
    viewMode: 'AUTO',
    autoIntervalSeconds: 15,
    isAutoPlaying: true,
    highlightTeamId: undefined,
    countdownValue: null,
    countdownStartedAt: null
  };

  const [localActiveViewIndex, setLocalActiveViewIndex] = useState(0);
  const [slideProgress, setSlideProgress] = useState(0);

  // Determinar qual tela exibir
  const effectiveView: DisplayViewMode = React.useMemo(() => {
    // Se o jogo encerrou, prioriza a Grande Final
    if (room.status === 'GAME_OVER') {
      return 'FINALE';
    }
    // Se o apresentador forçou uma tela específica (diferente de AUTO)
    if (presenter.viewMode && presenter.viewMode !== 'AUTO') {
      return presenter.viewMode;
    }
    // Se está no lobby e não começou, prioriza a Abertura
    if (room.status === 'LOBBY' && !room.matchStartedAt) {
      return 'OPENING';
    }
    // Caso contrário, usa o ciclo automático
    return AUTO_CYCLE_MODES[localActiveViewIndex % AUTO_CYCLE_MODES.length];
  }, [presenter.viewMode, room.status, room.matchStartedAt, localActiveViewIndex]);

  // Ciclo automático da Apresentação (Slideshow)
  useEffect(() => {
    if (presenter.viewMode !== 'AUTO' && !presenter.isAutoPlaying) return;

    const intervalSec = presenter.autoIntervalSeconds || 15;
    const stepMs = 100;
    let accumulatedMs = 0;

    const timer = setInterval(() => {
      accumulatedMs += stepMs;
      const progress = Math.min(100, (accumulatedMs / (intervalSec * 1000)) * 100);
      setSlideProgress(progress);

      if (accumulatedMs >= intervalSec * 1000) {
        accumulatedMs = 0;
        setSlideProgress(0);
        setLocalActiveViewIndex((prev) => (prev + 1) % AUTO_CYCLE_MODES.length);
      }
    }, stepMs);

    return () => clearInterval(timer);
  }, [presenter.viewMode, presenter.isAutoPlaying, presenter.autoIntervalSeconds]);

  // Efeito de Contagem Regressiva Sincronizada (5..4..3..2..1.. COMEÇOU!)
  useEffect(() => {
    if (presenter.countdownValue && presenter.countdownStartedAt) {
      const elapsed = Math.floor((Date.now() - presenter.countdownStartedAt) / 1000);
      const remaining = Math.max(0, presenter.countdownValue - elapsed);
      setCountdownNum(remaining);

      if (remaining > 0) {
        SoundSystem.playTick();
      } else if (remaining === 0) {
        SoundSystem.playLotUnlocked();
        triggerConfetti(3000);
        setTimeout(() => setCountdownNum(null), 2500);
      }
    }
  }, [presenter.countdownValue, presenter.countdownStartedAt, room.serverTime]);

  // Cronômetro Oficial do Servidor em Tempo Real
  useEffect(() => {
    if (!room.matchStartedAt) {
      setElapsedTime('00:00');
      return;
    }

    const updateTimer = () => {
      const now = room.matchEndedAt || (room.isPaused && room.pausedAt ? room.pausedAt : Date.now());
      const diffSec = Math.max(0, Math.floor((now - (room.matchStartedAt || 0)) / 1000));
      const mins = Math.floor(diffSec / 60);
      const secs = diffSec % 60;
      setElapsedTime(`${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [room.matchStartedAt, room.matchEndedAt, room.isPaused, room.pausedAt]);

  // Alternar tela cheia nativa
  const toggleFullscreen = () => {
    SoundSystem.playClick();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const toggleSound = () => {
    const next = SoundSystem.toggleMute();
    setMuted(next);
  };

  const teamsList: Team[] = Object.values(room.teams || {});
  // Ordenação oficial da competição
  teamsList.sort((a, b) => {
    if (a.puzzleCompleted && !b.puzzleCompleted) return -1;
    if (!a.puzzleCompleted && b.puzzleCompleted) return 1;
    if (a.puzzleCompleted && b.puzzleCompleted) {
      return a.totalElapsedSeconds - b.totalElapsedSeconds;
    }
    if (b.placedPieces.length !== a.placedPieces.length) {
      return b.placedPieces.length - a.placedPieces.length;
    }
    if (b.totalCorrect !== a.totalCorrect) {
      return b.totalCorrect - a.totalCorrect;
    }
    return a.totalElapsedSeconds - b.totalElapsedSeconds;
  });

  const totalPlayers = teamsList.reduce((acc, t) => acc + t.players.length, 0);
  const currentRoundMeta = ROUND_NAMES[room.currentRound] || {
    title: `Rodada ${room.currentRound}`,
    subtitle: 'Planejamento Estratégico',
    lotNumber: room.currentRound
  };

  // Cálculo de Destaques
  const teamBestAccuracy = [...teamsList].sort((a, b) => b.totalCorrect - a.totalCorrect)[0];
  const teamMostPieces = [...teamsList].sort((a, b) => b.placedPieces.length - a.placedPieces.length)[0];
  const teamFastest = [...teamsList].filter((t) => t.placedPieces.length > 0).sort((a, b) => a.totalElapsedSeconds - b.totalElapsedSeconds)[0];
  const champion = teamsList.find((t) => t.puzzleCompleted) || (room.status === 'GAME_OVER' ? teamsList[0] : null);

  return (
    <div className="min-h-screen w-full bg-[#04120b] text-white flex flex-col justify-between overflow-x-hidden font-sans select-none relative">
      {/* Luz e Gradiente de Fundo Cinematográfico */}
      <div
        className="fixed inset-0 pointer-events-none opacity-40 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-600/30 via-emerald-950/20 to-black"
        style={{ zIndex: 0 }}
      />

      {/* OVERLAY DE CONTAGEM REGRESSIVA SINCRONIZADA (5..4..3..2..1.. COMEÇOU!) */}
      <AnimatePresence>
        {countdownNum !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl"
          >
            <motion.div
              key={countdownNum}
              initial={{ scale: 0.3, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.8, opacity: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="text-center"
            >
              {countdownNum > 0 ? (
                <div className="flex flex-col items-center">
                  <span className="text-8xl sm:text-[14rem] font-black text-amber-400 font-mono tracking-tighter drop-shadow-[0_0_80px_rgba(245,158,11,0.8)]">
                    {countdownNum}
                  </span>
                  <span className="text-xl sm:text-3xl font-extrabold uppercase tracking-widest text-emerald-300 mt-2">
                    Preparem-se as equipes!
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <span className="text-6xl sm:text-9xl font-black text-emerald-400 tracking-tight drop-shadow-[0_0_100px_rgba(16,185,129,0.9)] animate-pulse">
                    COMEÇOU!
                  </span>
                  <span className="text-xl sm:text-2xl font-bold text-amber-300 mt-4">
                    DESAFIO SENAR 2030 EM ANDAMENTO
                  </span>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER PRINCIPAL DO TELÃO (Legibilidade Máxima a Distância) */}
      <header className="relative z-20 px-6 py-4 bg-gradient-to-r from-[#03110a] via-[#08281a] to-[#03110a] border-b-2 border-emerald-600/60 shadow-2xl flex items-center justify-between gap-4">
        {/* Identificação SENAR e Evento */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-black text-lg tracking-wider shadow-lg shadow-emerald-950/80">
            SENAR
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight uppercase">
                DESAFIO SENAR 2030
              </h1>
              <span className="px-2.5 py-0.5 rounded bg-emerald-950 border border-emerald-500/60 text-emerald-300 font-bold text-xs uppercase tracking-wider">
                RO 2027–2030
              </span>
            </div>
            <p className="text-xs text-emerald-300/80 font-medium">
              Conhecimento que transforma, campo que prospera.
            </p>
          </div>
        </div>

        {/* Informações da Sala & Rodada & Cronômetro Oficial HUD */}
        <div className="flex items-center gap-4">
          {/* Sala */}
          <div className="px-3.5 py-1.5 rounded-xl bg-black/60 border border-emerald-700/80 text-xs">
            <span className="text-emerald-400 font-bold text-[10px] uppercase block">SALA</span>
            <span className="font-mono font-black text-white text-sm">{room.code}</span>
          </div>

          {/* Rodada Atual */}
          <div className="px-3.5 py-1.5 rounded-xl bg-black/60 border border-amber-500/70 text-xs">
            <span className="text-amber-400 font-bold text-[10px] uppercase block">RODADA</span>
            <span className="font-bold text-white text-sm">
              {room.currentRound} de 5
            </span>
          </div>

          {/* Cronômetro Oficial do Servidor (Destaque Gigante) */}
          <div className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 border-2 border-emerald-400 shadow-xl flex items-center gap-2.5">
            <Clock className="w-5 h-5 text-amber-400 animate-spin" />
            <div>
              <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest block">
                CRONÔMETRO OFICIAL
              </span>
              <span className="text-xl sm:text-2xl font-mono font-black text-amber-300 tabular-nums tracking-wider leading-none">
                {elapsedTime}
              </span>
            </div>
          </div>
        </div>

        {/* Controles do Telão (Áudio, Tela Cheia e Voltar) */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleSound}
            title={muted ? 'Ativar Efeitos Sonoros' : 'Silenciar'}
            className="p-2.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-700 text-emerald-300 transition-colors"
          >
            {muted ? <VolumeX className="w-5 h-5 text-rose-400" /> : <Volume2 className="w-5 h-5 text-emerald-400" />}
          </button>

          <button
            onClick={toggleFullscreen}
            title="Alternar Tela Cheia (F11)"
            className="p-2.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-700 text-emerald-300 transition-colors"
          >
            {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          </button>

          {onExitDisplay && (
            <button
              onClick={onExitDisplay}
              className="px-3 py-2 rounded-xl bg-emerald-950 hover:bg-emerald-900 border border-emerald-700 text-emerald-300 text-xs font-bold transition-colors"
            >
              Voltar ao Jogo
            </button>
          )}
        </div>
      </header>

      {/* ÁREA CENTRAL PRINCIPAL — CONTEÚDO BASEADO NO MODO DE VISUALIZAÇÃO */}
      <main className="relative z-10 flex-1 p-6 flex flex-col justify-center">
        {/* =========================================================================
            TELA 1: PAINEL PRINCIPAL (5 ÁREAS INTEGRADAS EM UMA SÓ TELA DE VISÃO GERAL)
           ========================================================================= */}
        {effectiveView === 'OVERVIEW' && (
          <div className="max-w-[1720px] w-full mx-auto grid grid-cols-12 gap-5 h-full items-stretch">
            {/* Coluna Esquerda: Ranking ao Vivo (Área 2) - Largura 7 de 12 */}
            <div className="col-span-12 lg:col-span-7 bg-[#06180f] p-5 rounded-2xl border-2 border-emerald-800/80 shadow-2xl flex flex-col justify-between">
              <div className="flex items-center justify-between pb-3 border-b border-emerald-800/80">
                <div className="flex items-center gap-2.5">
                  <Trophy className="w-6 h-6 text-amber-400" />
                  <h2 className="text-lg font-black text-white uppercase tracking-tight">
                    Classificação Geral ao Vivo
                  </h2>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-400">
                  {teamsList.length} equipes disputando
                </span>
              </div>

              {/* Tabela de Ranking com Destaque para o Top 3 */}
              <div className="space-y-2.5 my-3 flex-1 overflow-y-auto pr-1">
                {teamsList.map((team, idx) => {
                  const rank = idx + 1;
                  const isTop1 = rank === 1;
                  const isTop2 = rank === 2;
                  const isTop3 = rank === 3;
                  const isHighlighted = presenter.highlightTeamId === team.id;

                  return (
                    <motion.div
                      key={team.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-3.5 rounded-xl border-2 flex items-center justify-between gap-3 transition-all ${
                        isHighlighted
                          ? 'ring-4 ring-amber-400 bg-amber-950/40 border-amber-400'
                          : isTop1
                          ? 'bg-gradient-to-r from-amber-950/50 via-amber-900/30 to-[#06180f] border-amber-400/90 shadow-lg'
                          : isTop2
                          ? 'bg-slate-900/50 border-slate-400/80'
                          : isTop3
                          ? 'bg-[#1a1208]/50 border-amber-700/70'
                          : 'bg-black/30 border-emerald-950'
                      }`}
                    >
                      {/* Posição e Identificação */}
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-base shadow-md ${
                            isTop1
                              ? 'bg-amber-400 text-black font-extrabold ring-2 ring-amber-300'
                              : isTop2
                              ? 'bg-slate-300 text-black font-extrabold'
                              : isTop3
                              ? 'bg-amber-700 text-white font-extrabold'
                              : 'bg-emerald-950 text-emerald-400 font-bold border border-emerald-800'
                          }`}
                        >
                          {rank}º
                        </span>

                        <div>
                          <div className="flex items-center gap-2">
                            <div
                              className="w-3.5 h-3.5 rounded-full"
                              style={{ backgroundColor: team.color }}
                            />
                            <span className="text-base font-extrabold text-white">
                              {team.name}
                            </span>
                          </div>
                          <span className="text-xs text-emerald-300/80 font-medium">
                            Capitão: {team.captainName} · {team.players.length} membros
                          </span>
                        </div>
                      </div>

                      {/* Métricas: Acertos, Lotes, Peças e Tempo */}
                      <div className="flex items-center gap-4 text-xs font-mono font-bold">
                        <div className="text-center px-2 py-1 rounded bg-black/40 border border-emerald-900">
                          <span className="text-[10px] text-emerald-400 block font-sans">ACERTOS</span>
                          <span className="text-white text-sm">{team.totalCorrect}</span>
                        </div>

                        <div className="text-center px-2 py-1 rounded bg-black/40 border border-emerald-900">
                          <span className="text-[10px] text-amber-400 block font-sans">LOTES</span>
                          <span className="text-amber-300 text-sm">{team.unlockedLots.length}/5</span>
                        </div>

                        <div className="text-center px-2.5 py-1 rounded bg-emerald-950/80 border border-emerald-600">
                          <span className="text-[10px] text-emerald-400 block font-sans">PEÇAS</span>
                          <span className="text-emerald-200 text-sm">{team.placedPieces.length}/25</span>
                        </div>

                        <div className="text-right min-w-[70px]">
                          <span className="text-[10px] text-amber-400/80 block font-sans">TEMPO</span>
                          <span className="text-amber-300 font-bold text-sm">
                            {Math.floor(team.totalElapsedSeconds / 60)
                              .toString()
                              .padStart(2, '0')}
                            :
                            {(team.totalElapsedSeconds % 60).toString().padStart(2, '0')}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Rodapé da Classificação */}
              <div className="pt-2 border-t border-emerald-900/80 flex items-center justify-between text-xs text-emerald-400/80">
                <span>Critério decisivo: Montagem completa das 25 peças no menor tempo.</span>
                <span className="text-amber-400 font-bold">Meta: 80% de acertos por rodada</span>
              </div>
            </div>

            {/* Coluna Direita: Progresso das Rodadas (Área 3) e Lotes/Puzzle (Área 4) - Largura 5 de 12 */}
            <div className="col-span-12 lg:col-span-5 flex flex-col gap-5 justify-between">
              {/* Linha do Tempo das 5 Rodadas (Área 3) */}
              <div className="bg-[#06180f] p-4 rounded-2xl border-2 border-emerald-800/80 shadow-2xl">
                <div className="flex items-center justify-between pb-2.5 border-b border-emerald-800/80 mb-3">
                  <h3 className="text-sm font-black text-white uppercase flex items-center gap-2">
                    <Layers className="w-4 h-4 text-emerald-400" />
                    Progresso das 5 Rodadas Estratégicas
                  </h3>
                  <span className="text-xs text-emerald-400 font-mono">
                    Lote = 5 peças
                  </span>
                </div>

                <div className="space-y-2">
                  {[1, 2, 3, 4, 5].map((rNum) => {
                    const isCurrent = room.currentRound === rNum;
                    const isPast = room.currentRound > rNum;
                    const meta = ROUND_NAMES[rNum];

                    return (
                      <div
                        key={rNum}
                        className={`p-2.5 rounded-xl border flex items-center justify-between gap-3 text-xs transition-all ${
                          isCurrent
                            ? 'bg-emerald-900/60 border-emerald-400 ring-2 ring-emerald-500/50'
                            : isPast
                            ? 'bg-black/40 border-emerald-900 text-emerald-200'
                            : 'bg-black/20 border-emerald-950 text-emerald-600'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span
                            className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs ${
                              isCurrent
                                ? 'bg-amber-500 text-black'
                                : isPast
                                ? 'bg-emerald-700 text-white'
                                : 'bg-emerald-950 text-emerald-700 border border-emerald-900'
                            }`}
                          >
                            R{rNum}
                          </span>
                          <span className="font-bold text-white text-xs truncate max-w-[220px]">
                            {meta.title.split('—')[1] || meta.title}
                          </span>
                        </div>

                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            isCurrent
                              ? 'bg-amber-400 text-black animate-pulse'
                              : isPast
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-600'
                              : 'text-emerald-700'
                          }`}
                        >
                          {isCurrent ? 'Em Andamento' : isPast ? 'Concluída' : 'Aguardando'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Evolução dos Lotes e Quebra-Cabeça (Área 4) */}
              <div className="bg-[#06180f] p-4 rounded-2xl border-2 border-emerald-800/80 shadow-2xl flex-1 flex flex-col justify-between">
                <div className="flex items-center justify-between pb-2 border-b border-emerald-800/80 mb-2">
                  <h3 className="text-sm font-black text-white uppercase flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    Evolução do Quebra-Cabeça (25 Peças)
                  </h3>
                  <span className="text-xs text-amber-300 font-mono">
                    Grade 5 × 5 Oficial
                  </span>
                </div>

                {/* Prévia dos Lotes das Equipes Líderes */}
                <div className="space-y-2.5 my-auto">
                  {teamsList.slice(0, 4).map((t) => (
                    <div key={t.id} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-extrabold text-white flex items-center gap-1.5">
                          <div
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: t.color }}
                          />
                          {t.name}
                        </span>
                        <span className="font-mono font-bold text-emerald-300">
                          {t.placedPieces.length} / 25 peças ({Math.round((t.placedPieces.length / 25) * 100)}%)
                        </span>
                      </div>
                      {/* Barra de Progresso do Quebra-cabeça */}
                      <div className="w-full h-2.5 bg-black/60 rounded-full overflow-hidden border border-emerald-900">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-500 via-amber-400 to-emerald-400 transition-all duration-700"
                          style={{ width: `${(t.placedPieces.length / 25) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-emerald-900/60 text-[11px] text-emerald-400/80 flex items-center justify-between">
                  <span>5 lotes liberam 5 peças cada conforme aprovação de 80%.</span>
                  <span className="font-bold text-amber-400">Total: 25 peças</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TELA 2: ABERTURA DO EVENTO (IMPACTO INSTITUCIONAL MÁXIMO)
           ========================================================================= */}
        {effectiveView === 'OPENING' && (
          <div className="max-w-5xl w-full mx-auto text-center space-y-6">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.7 }}
              className="inline-block p-4 rounded-3xl bg-emerald-950/80 border-2 border-emerald-500 shadow-2xl mb-2"
            >
              <div className="w-16 h-16 rounded-2xl bg-emerald-600 flex items-center justify-center font-black text-2xl mx-auto shadow-lg">
                SENAR
              </div>
            </motion.div>

            <h1 className="text-4xl sm:text-7xl font-black text-white tracking-tight uppercase leading-tight drop-shadow-2xl">
              DESAFIO SENAR 2030
            </h1>
            <p className="text-xl sm:text-3xl font-extrabold text-emerald-300 tracking-wide max-w-3xl mx-auto drop-shadow-md">
              Conhecimento que transforma, campo que prospera.
            </p>

            {/* Cartões Estatísticos de Abertura */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto pt-4">
              <div className="p-4 rounded-2xl bg-black/50 border border-emerald-700/80">
                <span className="text-xs text-emerald-400 font-bold uppercase tracking-wider block">
                  EQUIPES INSCRITAS
                </span>
                <span className="text-3xl font-black font-mono text-white mt-1 block">
                  {teamsList.length}
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-black/50 border border-emerald-700/80">
                <span className="text-xs text-emerald-400 font-bold uppercase tracking-wider block">
                  PARTICIPANTES CONECTADOS
                </span>
                <span className="text-3xl font-black font-mono text-white mt-1 block">
                  {totalPlayers}
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-black/50 border border-emerald-700/80">
                <span className="text-xs text-emerald-400 font-bold uppercase tracking-wider block">
                  META DE APROVAÇÃO
                </span>
                <span className="text-3xl font-black font-mono text-amber-300 mt-1 block">
                  80%
                </span>
              </div>
            </div>

            <p className="text-xs text-emerald-300/80 italic pt-2">
              Planejamento Estratégico SENAR-AR/RO 2027–2030 · Administração Regional de Rondônia
            </p>
          </div>
        )}

        {/* =========================================================================
            TELA 3: CLASSIFICAÇÃO GERAL EXPANDIDA (RANKING TELEVISIVO)
           ========================================================================= */}
        {effectiveView === 'RANKING' && (
          <div className="max-w-6xl w-full mx-auto bg-[#06180f] p-6 rounded-3xl border-2 border-emerald-600 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b-2 border-emerald-800">
              <div className="flex items-center gap-3">
                <Trophy className="w-8 h-8 text-amber-400" />
                <div>
                  <h2 className="text-2xl font-black text-white uppercase tracking-tight">
                    Classificação Geral da Competição
                  </h2>
                  <p className="text-xs text-emerald-300">
                    Sincronização em tempo real · {teamsList.length} equipes participantes
                  </p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-xl bg-amber-500/20 border border-amber-400 text-amber-300 text-xs font-bold uppercase">
                Ranking Oficial
              </span>
            </div>

            <div className="mt-5 space-y-3">
              {teamsList.map((team, idx) => {
                const rank = idx + 1;
                return (
                  <div
                    key={team.id}
                    className={`p-4 rounded-2xl border-2 flex items-center justify-between transition-all ${
                      rank === 1
                        ? 'bg-amber-950/40 border-amber-400 shadow-xl'
                        : rank === 2
                        ? 'bg-slate-900/40 border-slate-400 shadow-md'
                        : rank === 3
                        ? 'bg-amber-900/30 border-amber-700 shadow-md'
                        : 'bg-black/30 border-emerald-950'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span
                        className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg ${
                          rank === 1
                            ? 'bg-amber-400 text-black'
                            : rank === 2
                            ? 'bg-slate-300 text-black'
                            : rank === 3
                            ? 'bg-amber-700 text-white'
                            : 'bg-emerald-950 text-emerald-400'
                        }`}
                      >
                        {rank}º
                      </span>
                      <div>
                        <span className="text-lg font-black text-white block">
                          {team.name}
                        </span>
                        <span className="text-xs text-emerald-300">
                          Capitão: <strong>{team.captainName}</strong> ({team.players.length} membros)
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 font-mono text-sm">
                      <div className="text-center">
                        <span className="text-[10px] text-emerald-400 block font-sans">ACERTOS</span>
                        <span className="font-bold text-white text-base">{team.totalCorrect}</span>
                      </div>
                      <div className="text-center">
                        <span className="text-[10px] text-amber-400 block font-sans">LOTES</span>
                        <span className="font-bold text-amber-300 text-base">{team.unlockedLots.length}/5</span>
                      </div>
                      <div className="text-center">
                        <span className="text-[10px] text-emerald-400 block font-sans">PEÇAS MONTADAS</span>
                        <span className="font-bold text-emerald-300 text-base">{team.placedPieces.length}/25</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-amber-400 block font-sans">TEMPO TOTAL</span>
                        <span className="font-bold text-amber-300 text-base">
                          {Math.floor(team.totalElapsedSeconds / 60)
                            .toString()
                            .padStart(2, '0')}
                          :
                          {(team.totalElapsedSeconds % 60).toString().padStart(2, '0')}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* =========================================================================
            TELA 4: PROGRESSO DAS RODADAS
           ========================================================================= */}
        {effectiveView === 'ROUNDS' && (
          <div className="max-w-6xl w-full mx-auto bg-[#06180f] p-6 rounded-3xl border-2 border-emerald-600 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b-2 border-emerald-800">
              <div className="flex items-center gap-3">
                <Layers className="w-8 h-8 text-emerald-400" />
                <div>
                  <h2 className="text-2xl font-black text-white uppercase tracking-tight">
                    Linha do Tempo das Cinco Rodadas Estratégicas
                  </h2>
                  <p className="text-xs text-emerald-300">
                    Aprovação mínima de 80% requerida para liberação de cada lote
                  </p>
                </div>
              </div>
              <span className="text-sm font-mono font-bold text-amber-300">
                Rodada Atual: {room.currentRound} de 5
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5 mt-6">
              {[1, 2, 3, 4, 5].map((rNum) => {
                const meta = ROUND_NAMES[rNum];
                const isCurrent = room.currentRound === rNum;
                const isPast = room.currentRound > rNum;

                return (
                  <div
                    key={rNum}
                    className={`p-4 rounded-2xl border-2 flex flex-col justify-between h-64 text-center transition-all ${
                      isCurrent
                        ? 'bg-gradient-to-b from-emerald-950 via-emerald-900 to-[#06180f] border-amber-400 shadow-2xl ring-4 ring-amber-400/30'
                        : isPast
                        ? 'bg-black/50 border-emerald-600/70'
                        : 'bg-black/20 border-emerald-950 opacity-60'
                    }`}
                  >
                    <div>
                      <span
                        className={`inline-block w-8 h-8 rounded-xl font-black text-sm mb-2 pt-1 shadow ${
                          isCurrent
                            ? 'bg-amber-400 text-black'
                            : isPast
                            ? 'bg-emerald-600 text-white'
                            : 'bg-emerald-950 text-emerald-700'
                        }`}
                      >
                        0{rNum}
                      </span>
                      <h3 className="font-extrabold text-sm text-white leading-tight">
                        {meta.title.split('—')[1] || meta.title}
                      </h3>
                      <p className="text-[11px] text-emerald-300/80 mt-1 line-clamp-2">
                        {meta.subtitle}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-emerald-900/80">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          isCurrent
                            ? 'bg-amber-400 text-black animate-pulse'
                            : isPast
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-500'
                            : 'text-emerald-800'
                        }`}
                      >
                        {isCurrent ? 'Em Disputa' : isPast ? 'Lote Conquistado' : 'Bloqueado'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* =========================================================================
            TELA 5: EVOLUÇÃO DO QUEBRA-CABEÇA (25 PEÇAS)
           ========================================================================= */}
        {effectiveView === 'PUZZLE' && (
          <div className="max-w-6xl w-full mx-auto bg-[#06180f] p-6 rounded-3xl border-2 border-emerald-600 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b-2 border-emerald-800">
              <div className="flex items-center gap-3">
                <Sparkles className="w-8 h-8 text-amber-400" />
                <div>
                  <h2 className="text-2xl font-black text-white uppercase tracking-tight">
                    Evolução do Quebra-Cabeça (25 Peças)
                  </h2>
                  <p className="text-xs text-emerald-300">
                    Acompanhamento simultâneo da montagem do Mapa Estratégico pelas equipes
                  </p>
                </div>
              </div>
              <span className="text-sm font-bold text-amber-300 font-mono">
                5 lotes de 5 peças
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6">
              {teamsList.map((t) => (
                <div
                  key={t.id}
                  className="p-4 rounded-2xl bg-black/50 border border-emerald-800/80 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-base font-extrabold text-white flex items-center gap-2">
                      <div
                        className="w-3.5 h-3.5 rounded-full"
                        style={{ backgroundColor: t.color }}
                      />
                      {t.name}
                    </span>
                    <span className="text-xs font-mono font-bold text-amber-300">
                      {t.placedPieces.length}/25 peças
                    </span>
                  </div>

                  {/* Grade 5x5 Miniaturizada */}
                  <div className="grid grid-cols-5 gap-1 aspect-[16/9] bg-black/60 p-1.5 rounded-xl border border-emerald-900">
                    {Array.from({ length: 25 }).map((_, i) => {
                      const isPlaced = t.placedPieces.includes(i);
                      return (
                        <div
                          key={i}
                          className={`rounded-sm transition-all ${
                            isPlaced
                              ? 'bg-emerald-500 shadow-sm shadow-emerald-500/50'
                              : 'bg-emerald-950/40 border border-emerald-900/40'
                          }`}
                        />
                      );
                    })}
                  </div>

                  <div className="flex items-center justify-between text-xs text-emerald-300 pt-1">
                    <span>Lotes: {t.unlockedLots.length}/5</span>
                    <span className="font-bold text-emerald-400">
                      {Math.round((t.placedPieces.length / 25) * 100)}% concluído
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
            TELA 6: DESTAQUES DA COMPETIÇÃO
           ========================================================================= */}
        {effectiveView === 'HIGHLIGHTS' && (
          <div className="max-w-6xl w-full mx-auto bg-[#06180f] p-6 rounded-3xl border-2 border-emerald-600 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b-2 border-emerald-800">
              <div className="flex items-center gap-3">
                <Sparkles className="w-8 h-8 text-amber-400" />
                <div>
                  <h2 className="text-2xl font-black text-white uppercase tracking-tight">
                    Destaques da Competição Estratégica
                  </h2>
                  <p className="text-xs text-emerald-300">
                    Reconhecimento das equipes com maior desempenho no Desafio SENAR 2030
                  </p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-xl bg-amber-500/20 text-amber-300 text-xs font-bold uppercase">
                Mérito Institucional
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
              {/* Destaque 1: Maior Número de Acertos */}
              <div className="p-5 rounded-2xl bg-black/50 border border-emerald-700/80 text-center space-y-2">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400 flex items-center justify-center text-amber-300 mx-auto">
                  <Flame className="w-5 h-5 text-amber-400" />
                </div>
                <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block">
                  MAIOR ACERTO ACUMULADO
                </span>
                <h3 className="text-base font-extrabold text-white">
                  {teamBestAccuracy ? teamBestAccuracy.name : 'Aguardando'}
                </h3>
                <span className="text-2xl font-black font-mono text-emerald-300 block">
                  {teamBestAccuracy ? `${teamBestAccuracy.totalCorrect} acertos` : '0'}
                </span>
              </div>

              {/* Destaque 2: Mais Peças Montadas */}
              <div className="p-5 rounded-2xl bg-black/50 border border-emerald-700/80 text-center space-y-2">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-300 mx-auto">
                  <Layers className="w-5 h-5 text-emerald-400" />
                </div>
                <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block">
                  MAIS PEÇAS ENCAIXADAS
                </span>
                <h3 className="text-base font-extrabold text-white">
                  {teamMostPieces ? teamMostPieces.name : 'Aguardando'}
                </h3>
                <span className="text-2xl font-black font-mono text-amber-300 block">
                  {teamMostPieces ? `${teamMostPieces.placedPieces.length}/25` : '0'}
                </span>
              </div>

              {/* Destaque 3: Mais Rápida na Montagem */}
              <div className="p-5 rounded-2xl bg-black/50 border border-emerald-700/80 text-center space-y-2">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400 flex items-center justify-center text-blue-300 mx-auto">
                  <Zap className="w-5 h-5 text-blue-400" />
                </div>
                <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider block">
                  MAIS ÁGIL NO MAPA
                </span>
                <h3 className="text-base font-extrabold text-white">
                  {teamFastest ? teamFastest.name : 'Aguardando'}
                </h3>
                <span className="text-2xl font-black font-mono text-white block">
                  {teamFastest
                    ? `${Math.floor(teamFastest.totalElapsedSeconds / 60)}m ${teamFastest.totalElapsedSeconds % 60}s`
                    : '--'}
                </span>
              </div>

              {/* Destaque 4: Mais Integrantes Engajados */}
              <div className="p-5 rounded-2xl bg-black/50 border border-emerald-700/80 text-center space-y-2">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-400 flex items-center justify-center text-purple-300 mx-auto">
                  <Users className="w-5 h-5 text-purple-400" />
                </div>
                <span className="text-[11px] font-bold text-purple-400 uppercase tracking-wider block">
                  ENGAJAMENTO DE EQUIPE
                </span>
                <h3 className="text-base font-extrabold text-white">
                  Total de Integrantes
                </h3>
                <span className="text-2xl font-black font-mono text-emerald-300 block">
                  {totalPlayers} pessoas
                </span>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TELA 7: GRANDE FINAL & PREMIAÇÃO (PODIUM & MAPA COMPLETO)
           ========================================================================= */}
        {effectiveView === 'FINALE' && (
          <div className="max-w-6xl w-full mx-auto bg-[#071d15] p-6 rounded-3xl border-2 border-amber-500 shadow-2xl text-center space-y-5">
            <div className="inline-block p-4 rounded-3xl bg-amber-500/20 border-2 border-amber-400 shadow-xl mb-1">
              <Trophy className="w-14 h-14 text-amber-400 animate-bounce" />
            </div>

            <span className="text-xs uppercase font-black tracking-widest text-amber-400 block">
              ENCERRAMENTO OFICIAL DO DESAFIO
            </span>
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              🏆 EQUIPE CAMPEÃ — DESAFIO SENAR 2030
            </h1>

            {champion && (
              <div className="inline-block px-8 py-3 rounded-2xl bg-black/60 border-2 border-amber-400 shadow-xl">
                <span className="text-2xl sm:text-3xl font-black text-amber-300 block">
                  {champion.name}
                </span>
                <span className="text-xs text-emerald-300 mt-1 block">
                  Capitão: {champion.captainName} · Tempo Final Oficial: {Math.floor(champion.totalElapsedSeconds / 60)}m {champion.totalElapsedSeconds % 60}s
                </span>
              </div>
            )}

            {/* Imagem do Mapa Estratégico Completo no Telão */}
            <div className="max-w-3xl mx-auto rounded-2xl overflow-hidden border-2 border-emerald-500 shadow-2xl bg-black">
              <img
                src={MAP_IMAGE_URL}
                alt="Mapa Estratégico SENAR 2027–2030 BSC"
                className="w-full h-auto object-contain"
              />
            </div>

            {/* Mensagem Institucional Oficial */}
            <div className="p-4 rounded-2xl bg-emerald-950/70 border border-emerald-700/60 max-w-3xl mx-auto text-xs sm:text-sm text-emerald-100 italic leading-relaxed">
              “Cada peça representa um conhecimento. Cada desafio fortalece nossa estratégia. Juntos, construímos um SENAR mais integrado e contribuímos para um agro mais forte, competitivo e sustentável em Rondônia.”
            </div>
          </div>
        )}
      </main>

      {/* RODAPÉ DO TELÃO: INDICADORES E BARRA DO MODO APRESENTAÇÃO */}
      <footer className="relative z-20 px-6 py-2.5 bg-[#030d08] border-t border-emerald-900 flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-xs text-emerald-400/80">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 font-semibold text-emerald-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              TRANSMISSÃO AO VIVO
            </span>
            <span>·</span>
            <span>Tela Atual: <strong className="text-white">{effectiveView}</strong></span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span>SENAR Rondônia · FAPERON · Sindicatos dos Produtores Rurais</span>
            <span>Resolução 1080p Full HD</span>
          </div>
        </div>

        {/* Barra de Progresso do Slideshow Automático */}
        {presenter.isAutoPlaying && presenter.viewMode === 'AUTO' && (
          <div className="w-full h-1 bg-black/60 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-400 transition-all duration-150"
              style={{ width: `${slideProgress}%` }}
            />
          </div>
        )}
      </footer>
    </div>
  );
};
