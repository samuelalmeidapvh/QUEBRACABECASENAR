import React from 'react';
import { motion } from 'motion/react';
import { Trophy, Medal, Download, Printer, Users, CheckCircle, Clock, X, Layers, Flag } from 'lucide-react';
import { RoomState, Team } from '../types/game';
import { SoundSystem } from '../utils/audio';

interface RankingViewProps {
  room: RoomState;
  onClose?: () => void;
}

export const RankingView: React.FC<RankingViewProps> = ({ room, onClose }) => {
  const teamsList: Team[] = Object.values(room.teams || {});

  // Ordenação oficial da competição:
  // 1. Quem montou as 25 peças primeiro (puzzleCompleted)
  // 2. Menor tempo total de conclusão (totalElapsedSeconds)
  // 3. Mais acertos acumulados (totalCorrect)
  // 4. Menor número de tentativas (totalAttempts)
  teamsList.sort((a, b) => {
    if (a.puzzleCompleted && !b.puzzleCompleted) return -1;
    if (!a.puzzleCompleted && b.puzzleCompleted) return 1;
    if (a.puzzleCompleted && b.puzzleCompleted) {
      return a.totalElapsedSeconds - b.totalElapsedSeconds;
    }
    // Se nenhum terminou ainda, mais peças encaixadas tem prioridade
    if (b.placedPieces.length !== a.placedPieces.length) {
      return b.placedPieces.length - a.placedPieces.length;
    }
    // Desempate por mais acertos
    if (b.totalCorrect !== a.totalCorrect) {
      return b.totalCorrect - a.totalCorrect;
    }
    return a.totalElapsedSeconds - b.totalElapsedSeconds;
  });

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleDownloadCsv = () => {
    SoundSystem.playClick();
    window.open(`/api/export/${room.code}/csv`, '_blank');
  };

  const handlePrint = () => {
    SoundSystem.playClick();
    window.print();
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6">
      {/* Top Header do Ranking */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-gradient-to-r from-[#071d14] via-[#0d2f21] to-[#071d14] border border-emerald-700/60 shadow-xl mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-400/60 flex items-center justify-center text-amber-300">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              Placar e Classificação Geral
            </h1>
            <p className="text-xs text-emerald-300/80">
              Desafio SENAR 2030 · Sala: <strong className="text-white font-mono">{room.code}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadCsv}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-700/60 text-emerald-200 text-xs font-bold transition-colors"
            title="Baixar planilha CSV oficial do ranking"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Exportar CSV</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-700/60 text-emerald-200 text-xs font-bold transition-colors"
            title="Imprimir relatório da partida"
          >
            <Printer className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">Imprimir</span>
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-700/60 text-emerald-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Critérios de Desempate */}
      <div className="mb-4 px-4 py-2.5 rounded-xl bg-black/40 border border-emerald-900/60 text-[11px] text-emerald-300/80 flex flex-wrap items-center justify-between gap-2">
        <span>
          <strong>Critérios Oficiais:</strong> 1º Montagem das 25 peças · 2º Menor tempo total · 3º Acertos nas rodadas
        </span>
        <span className="text-emerald-400 font-mono">
          Total de Equipes: {teamsList.length}
        </span>
      </div>

      {/* Tabela de Classificação */}
      <div className="bg-[#092218] rounded-2xl border border-emerald-800/70 shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-emerald-950/90 text-emerald-300 border-b border-emerald-800/80 uppercase font-bold text-[10px] tracking-wider">
                <th className="py-3.5 px-4 text-center w-14">Pos.</th>
                <th className="py-3.5 px-4">Equipe / Capitão</th>
                <th className="py-3.5 px-3 text-center">Integrantes</th>
                <th className="py-3.5 px-3 text-center">Acertos</th>
                <th className="py-3.5 px-3 text-center">Lotes</th>
                <th className="py-3.5 px-3 text-center">Peças Montadas</th>
                <th className="py-3.5 px-4 text-center">Tempo Total</th>
                <th className="py-3.5 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-900/40">
              {teamsList.map((team, idx) => {
                const rank = idx + 1;
                const isChampion = rank === 1 && team.puzzleCompleted;

                return (
                  <motion.tr
                    key={team.id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className={`transition-colors ${
                      isChampion
                        ? 'bg-amber-500/10 hover:bg-amber-500/15'
                        : rank <= 3
                        ? 'bg-emerald-950/30 hover:bg-emerald-950/60'
                        : 'hover:bg-emerald-950/40'
                    }`}
                  >
                    {/* Posição */}
                    <td className="py-3.5 px-4 text-center font-black">
                      {rank === 1 ? (
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-500 text-black font-extrabold shadow-md">
                          1º
                        </span>
                      ) : rank === 2 ? (
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-300 text-slate-900 font-extrabold shadow-md">
                          2º
                        </span>
                      ) : rank === 3 ? (
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-700 text-white font-extrabold shadow-md">
                          3º
                        </span>
                      ) : (
                        <span className="font-mono text-emerald-400/80 font-bold">
                          {rank}º
                        </span>
                      )}
                    </td>

                    {/* Nome e Capitão */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-3.5 h-3.5 rounded-full shrink-0"
                          style={{ backgroundColor: team.color }}
                        />
                        <div>
                          <span className="font-bold text-white text-sm block">
                            {team.name}
                          </span>
                          <span className="text-[11px] text-emerald-300/70">
                            Capitão: {team.captainName}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Integrantes */}
                    <td className="py-3.5 px-3 text-center">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-black/30 border border-emerald-900 text-white font-mono font-semibold">
                        <Users className="w-3 h-3 text-emerald-400" />
                        {team.players.length}
                      </span>
                    </td>

                    {/* Acertos */}
                    <td className="py-3.5 px-3 text-center font-mono font-bold text-white">
                      {team.totalCorrect}
                    </td>

                    {/* Lotes Desbloqueados */}
                    <td className="py-3.5 px-3 text-center font-mono">
                      <span className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-700/60 text-emerald-300 font-bold">
                        {team.unlockedLots.length} / 5
                      </span>
                    </td>

                    {/* Peças Encaixadas */}
                    <td className="py-3.5 px-3 text-center">
                      <span className="inline-flex items-center gap-1 font-mono font-bold text-white">
                        <Layers className="w-3 h-3 text-emerald-400" />
                        {team.placedPieces.length} / 25
                      </span>
                    </td>

                    {/* Tempo Total */}
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-amber-300">
                      <div className="flex items-center justify-center gap-1">
                        <Clock className="w-3 h-3 text-amber-400/70" />
                        <span>{formatTime(team.totalElapsedSeconds)}</span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 text-right">
                      {team.puzzleCompleted ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-400 text-amber-300 font-bold text-[10px] uppercase tracking-wide">
                          <Trophy className="w-3 h-3 text-amber-400" />
                          Mapa Concluído
                        </span>
                      ) : team.placedPieces.length > 0 ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-900/50 border border-emerald-700 text-emerald-300 text-[10px]">
                          Em Montagem
                        </span>
                      ) : (
                        <span className="text-[10px] text-emerald-400/60">
                          Em Desafio
                        </span>
                      )}
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
