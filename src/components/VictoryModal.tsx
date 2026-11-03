import React from 'react';
import { motion } from 'motion/react';
import { Trophy, Clock, Award, Users, Download, X, Layers, Sparkles } from 'lucide-react';
import { Team, RoomState } from '../types/game';
import { SoundSystem } from '../utils/audio';

interface VictoryModalProps {
  room: RoomState;
  championTeam: Team;
  onOpenRanking: () => void;
  onClose: () => void;
}

const MAP_IMAGE_URL = '/assets/aistudio/Mapa_Estrat_gico_SENAR_2027_2030_BSC_4ee0c9a7.png';

export const VictoryModal: React.FC<VictoryModalProps> = ({
  room,
  championTeam,
  onOpenRanking,
  onClose
}) => {
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleDownloadCsv = () => {
    SoundSystem.playClick();
    window.open(`/api/export/${room.code}/csv`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-4xl bg-[#071912] rounded-3xl border-2 border-amber-500 shadow-2xl overflow-hidden p-6 sm:p-8 text-white text-center my-auto"
      >
        {/* Ícone de Troféu */}
        <div className="inline-flex p-4 rounded-2xl bg-amber-500/20 border-2 border-amber-400 mb-3 shadow-lg shadow-amber-500/20">
          <Trophy className="w-12 h-12 text-amber-400 animate-bounce" />
        </div>

        <span className="text-xs uppercase font-black tracking-widest text-amber-400 block">
          COMPETIÇÃO ESTRATÉGICA CONCLUÍDA
        </span>

        <h1 className="text-2xl sm:text-4xl font-black tracking-tight mt-1">
          🏆 EQUIPE CAMPEÃ — DESAFIO SENAR 2030
        </h1>

        <div className="mt-3 inline-block px-5 py-2 rounded-xl bg-black/60 border border-amber-500/50">
          <span className="text-lg sm:text-xl font-extrabold text-amber-300">
            {championTeam.name}
          </span>
          <span className="text-xs text-emerald-300 block">
            Capitão: {championTeam.captainName} · Tempo Final Oficial: {formatTime(championTeam.totalElapsedSeconds)}
          </span>
        </div>

        {/* Imagem Completa do Mapa Estratégico Oficial */}
        <div className="mt-6 rounded-2xl overflow-hidden border-2 border-emerald-600 shadow-2xl bg-black">
          <img
            src={MAP_IMAGE_URL}
            alt="Mapa Estratégico SENAR 2027-2030 BSC Oficial"
            className="w-full h-auto object-contain"
          />
        </div>

        {/* Mensagem Final Oficial do Game */}
        <div className="mt-6 p-4 rounded-2xl bg-emerald-950/70 border border-emerald-700/60 max-w-2xl mx-auto text-xs sm:text-sm text-emerald-100 italic leading-relaxed">
          “Cada peça representa um conhecimento. Cada rodada fortalece nossa estratégia. Juntos, construímos o futuro do SENAR e contribuímos para um agro mais forte, competitivo e sustentável em Rondônia.”
        </div>

        {/* Botões de Ação */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => {
              SoundSystem.playClick();
              onOpenRanking();
            }}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold text-xs uppercase tracking-wider shadow-lg flex items-center gap-2"
          >
            <Award className="w-4 h-4" />
            <span>Ver Placar Geral Completo</span>
          </button>

          <button
            onClick={handleDownloadCsv}
            className="px-5 py-3 rounded-xl bg-emerald-950 hover:bg-emerald-900 border border-emerald-700 text-emerald-200 font-bold text-xs flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Exportar Relatório CSV</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold text-xs"
          >
            Fechar
          </button>
        </div>
      </motion.div>
    </div>
  );
};
