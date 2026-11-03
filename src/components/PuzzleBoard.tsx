import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Eye, CheckCircle2, Lock, Sparkles, RefreshCw, Layers } from 'lucide-react';
import { Team, RoomState } from '../types/game';
import { LOT_PIECES_MAP } from '../data/questionsData';
import { SoundSystem } from '../utils/audio';
import { triggerConfetti } from '../utils/confetti';
import { api } from '../services/api';

interface PuzzleBoardProps {
  room: RoomState;
  myTeam: Team;
  onContinueToNextRound?: () => void;
  isAdmin?: boolean;
}

const MAP_IMAGE_URL = '/assets/aistudio/Mapa_Estrat_gico_SENAR_2027_2030_BSC_4ee0c9a7.png';

export const PuzzleBoard: React.FC<PuzzleBoardProps> = ({
  room,
  myTeam,
  onContinueToNextRound,
  isAdmin
}) => {
  const [selectedPieceIndex, setSelectedPieceIndex] = useState<number | null>(null);
  const [showReferenceModal, setShowReferenceModal] = useState(false);
  const [errorSlot, setErrorSlot] = useState<number | null>(null);
  const [justPlacedSlot, setJustPlacedSlot] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Determinar todas as peças desbloqueadas pelos lotes conquistados
  const unlockedPieceIndexes = React.useMemo(() => {
    const list: number[] = [];
    (myTeam.unlockedLots || []).forEach((lotNum) => {
      const pieces = LOT_PIECES_MAP[lotNum] || [];
      pieces.forEach((p) => {
        if (!list.includes(p)) list.push(p);
      });
    });
    return list.sort((a, b) => a - b);
  }, [myTeam.unlockedLots]);

  // Peças desbloqueadas que AINDA NÃO FORAM encaixadas no tabuleiro
  const availableInventoryPieces = React.useMemo(() => {
    return unlockedPieceIndexes.filter((idx) => !myTeam.placedPieces.includes(idx));
  }, [unlockedPieceIndexes, myTeam.placedPieces]);

  // Manipular clique no slot do tabuleiro
  const handleSlotClick = async (slotIndex: number) => {
    // Se o slot já está preenchido, nada a fazer
    if (myTeam.placedPieces.includes(slotIndex)) {
      return;
    }

    // Se nenhuma peça do inventário está selecionada, instrui o jogador
    if (selectedPieceIndex === null) {
      return;
    }

    if (isSubmitting) return;

    // Se a peça selecionada for diferente do slot alvo (validação matemática)
    if (selectedPieceIndex !== slotIndex) {
      SoundSystem.playError();
      setErrorSlot(slotIndex);
      setTimeout(() => setErrorSlot(null), 800);
      return;
    }

    // Peça correta! Enviar para o backend sincronizado
    setIsSubmitting(true);
    try {
      const res = await api.placePiece(room.code, {
        teamId: myTeam.id,
        pieceIndex: selectedPieceIndex,
        targetSlotIndex: slotIndex
      });

      if (res.correct) {
        SoundSystem.playSnap();
        setJustPlacedSlot(slotIndex);
        setSelectedPieceIndex(null);
        setTimeout(() => setJustPlacedSlot(null), 1000);

        if (res.puzzleCompleted) {
          SoundSystem.playVictory();
          triggerConfetti(6000);
        }
      } else {
        SoundSystem.playError();
        setErrorSlot(slotIndex);
        setTimeout(() => setErrorSlot(null), 800);
      }
    } catch (err: any) {
      alert(err.message || 'Erro ao posicionar peça.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePieceSelect = (pieceIndex: number) => {
    SoundSystem.playClick();
    if (selectedPieceIndex === pieceIndex) {
      setSelectedPieceIndex(null);
    } else {
      setSelectedPieceIndex(pieceIndex);
    }
  };

  const totalPieces = 25;
  const placedCount = myTeam.placedPieces.length;
  const isComplete = placedCount === totalPieces || myTeam.puzzleCompleted;

  // Rótulos pedagógicos das linhas do BSC para guiar a montagem
  const rowLabels = [
    'Sociedade & Propósito',
    'Clientes & Resultados',
    'Processos Internos (01–03)',
    'Processos Internos (04–05)',
    'Aprendizado & Impactos'
  ];

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6">
      {/* Top Banner do Desafio de Montagem */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-gradient-to-r from-[#0a2318] via-[#0f3827] to-[#0a2318] border border-emerald-700/50 shadow-xl mb-6">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-400" />
            <h2 className="text-xl font-extrabold text-white tracking-tight">
              Quebra-Cabeça Digital — Mapa Estratégico SENAR 2027–2030
            </h2>
          </div>
          <p className="text-xs text-emerald-300/80 mt-1">
            Encaixe as peças conquistadas nos lotes aprovados para reconstruir o Mapa Estratégico completo.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Indicador de Lotes e Peças */}
          <div className="flex items-center gap-3 px-3.5 py-1.5 rounded-lg bg-emerald-950/80 border border-emerald-700/60 text-xs">
            <div>
              <span className="text-emerald-400 font-semibold block text-[10px]">LOTES CONQUISTADOS</span>
              <span className="font-bold text-white text-sm">{myTeam.unlockedLots.length} / 5</span>
            </div>
            <div className="h-6 w-px bg-emerald-800" />
            <div>
              <span className="text-emerald-400 font-semibold block text-[10px]">PEÇAS ENCAIXADAS</span>
              <span className="font-bold text-emerald-300 text-sm">{placedCount} / 25</span>
            </div>
          </div>

          <button
            onClick={() => {
              SoundSystem.playClick();
              setShowReferenceModal(true);
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-700/40 hover:bg-emerald-600/50 border border-emerald-500/50 text-white text-xs font-semibold transition-all shadow"
          >
            <Eye className="w-4 h-4 text-emerald-300" />
            <span>Ver Mapa de Referência</span>
          </button>
        </div>
      </div>

      {/* Grid Principal: Tabuleiro Central (5x5) e Inventário de Peças */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Coluna Esquerda: Tabuleiro 5x5 Central (Largura 8 de 12) */}
        <div className="lg:col-span-8 flex flex-col items-center">
          <div className="w-full bg-[#06140e] p-3 sm:p-4 rounded-2xl border-2 border-emerald-800/60 shadow-2xl relative">
            {/* Header de perspectiva indicativa */}
            <div className="flex items-center justify-between text-[11px] text-emerald-400/90 mb-2 px-1 font-semibold">
              <span>TABULEIRO OFICIAL (GRADE 5 × 5)</span>
              <span>{placedCount === 25 ? '🏆 100% CONCLUÍDO' : `${25 - placedCount} peças restantes`}</span>
            </div>

            {/* O Tabuleiro 5x5 com proporção 16:9 igual à imagem oficial */}
            <div
              className="relative w-full aspect-[16/9] grid grid-cols-5 grid-rows-5 gap-1 bg-black/60 rounded-xl overflow-hidden p-1 border border-emerald-900/80"
              style={{
                boxShadow: 'inset 0 0 40px rgba(0,0,0,0.8)'
              }}
            >
              {Array.from({ length: 25 }).map((_, slotIdx) => {
                const isPlaced = myTeam.placedPieces.includes(slotIdx);
                const isError = errorSlot === slotIdx;
                const isJustPlaced = justPlacedSlot === slotIdx;
                const col = slotIdx % 5;
                const row = Math.floor(slotIdx / 5);

                // Cálculo exato de porcentagem de background (5x5)
                // Para 5 colunas: posições 0%, 25%, 50%, 75%, 100%
                const bgPosX = col * 25;
                const bgPosY = row * 25;

                return (
                  <div
                    key={slotIdx}
                    onClick={() => handleSlotClick(slotIdx)}
                    className={`relative rounded-md overflow-hidden transition-all duration-200 cursor-pointer select-none flex items-center justify-center ${
                      isPlaced
                        ? 'border border-emerald-500/30'
                        : selectedPieceIndex !== null
                        ? 'border border-dashed border-emerald-400/60 hover:border-emerald-300 hover:bg-emerald-900/30'
                        : 'border border-dashed border-emerald-950 hover:border-emerald-800/60 bg-emerald-950/20'
                    } ${isError ? 'ring-2 ring-rose-500 animate-bounce' : ''} ${
                      isJustPlaced ? 'ring-4 ring-emerald-400 scale-[1.02]' : ''
                    }`}
                  >
                    {isPlaced ? (
                      // Peça Encaixada Corretamente
                      <div
                        className="w-full h-full"
                        style={{
                          backgroundImage: `url(${MAP_IMAGE_URL})`,
                          backgroundSize: '500% 500%',
                          backgroundPosition: `${bgPosX}% ${bgPosY}%`,
                          backgroundRepeat: 'no-repeat'
                        }}
                      />
                    ) : (
                      // Espaço Vazio com Rótulo Sutil da Posição
                      <div className="flex flex-col items-center justify-center p-1 text-center">
                        <span className="text-[10px] font-mono text-emerald-600/70 font-bold">
                          #{slotIdx + 1}
                        </span>
                        {col === 0 && (
                          <span className="text-[8px] text-emerald-400/50 hidden sm:block truncate max-w-[80px]">
                            {rowLabels[row]}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Barra de Status Inferior do Tabuleiro */}
            <div className="mt-3 flex items-center justify-between text-xs text-emerald-300/80 px-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>
                  {selectedPieceIndex !== null
                    ? `Peça #${selectedPieceIndex + 1} selecionada. Clique no espaço correspondente para encaixar!`
                    : 'Selecione uma peça na bandeja ao lado para posicionar.'}
                </span>
              </div>
              <span className="font-mono font-bold text-emerald-400">
                {Math.round((placedCount / 25) * 100)}%
              </span>
            </div>
          </div>
        </div>

        {/* Coluna Direita: Inventário de Peças Liberadas (Largura 4 de 12) */}
        <div className="lg:col-span-4 bg-[#092218] p-4 rounded-2xl border border-emerald-800/60 shadow-xl flex flex-col h-full max-h-[600px]">
          <div className="flex items-center justify-between pb-3 border-b border-emerald-800/50 mb-3">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Bandeja de Peças Conquistadas
              </h3>
              <p className="text-[11px] text-emerald-400/80">
                {availableInventoryPieces.length} peças disponíveis para encaixe
              </p>
            </div>
          </div>

          {/* Lista de Peças no Inventário */}
          <div className="flex-1 overflow-y-auto pr-1">
            {availableInventoryPieces.length === 0 ? (
              <div className="py-12 px-4 text-center text-emerald-400/70 flex flex-col items-center justify-center">
                {myTeam.unlockedLots.length < 5 && placedCount < 25 ? (
                  <>
                    <Lock className="w-10 h-10 text-emerald-600 mb-2 opacity-60" />
                    <p className="text-xs font-semibold text-white">Nenhuma peça pendente na bandeja!</p>
                    <p className="text-[11px] text-emerald-400/70 mt-1 max-w-[200px]">
                      Aprove a próxima rodada de perguntas (mínimo de 80%) para liberar um novo lote de 5 peças.
                    </p>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-12 h-12 text-emerald-400 mb-2" />
                    <p className="text-sm font-bold text-white">Todas as peças foram encaixadas!</p>
                    <p className="text-xs text-emerald-300 mt-1">Mapa Estratégico 100% montado!</p>
                  </>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-3">
                {availableInventoryPieces.map((pieceIdx) => {
                  const isSelected = selectedPieceIndex === pieceIdx;
                  const col = pieceIdx % 5;
                  const row = Math.floor(pieceIdx / 5);
                  const bgPosX = col * 25;
                  const bgPosY = row * 25;

                  return (
                    <motion.div
                      key={pieceIdx}
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => handlePieceSelect(pieceIdx)}
                      className={`relative aspect-[16/9] rounded-lg overflow-hidden cursor-pointer shadow-md transition-all ${
                        isSelected
                          ? 'ring-4 ring-amber-400 scale-105 shadow-amber-500/30'
                          : 'border border-emerald-600/50 hover:border-emerald-400'
                      }`}
                    >
                      {/* Visual da Peça do Mapa */}
                      <div
                        className="w-full h-full"
                        style={{
                          backgroundImage: `url(${MAP_IMAGE_URL})`,
                          backgroundSize: '500% 500%',
                          backgroundPosition: `${bgPosX}% ${bgPosY}%`,
                          backgroundRepeat: 'no-repeat'
                        }}
                      />
                      {/* Tag do Número da Peça */}
                      <div className="absolute bottom-1 right-1 bg-black/80 text-emerald-300 text-[10px] font-mono px-1.5 py-0.5 rounded backdrop-blur">
                        #{pieceIdx + 1}
                      </div>
                      {isSelected && (
                        <div className="absolute inset-0 bg-amber-400/20 border-2 border-amber-400 rounded-lg flex items-center justify-center">
                          <span className="text-[10px] font-bold bg-amber-500 text-black px-2 py-0.5 rounded shadow">
                            SELECIONADA
                          </span>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Lotes Desbloqueados Status Visual */}
          <div className="mt-4 pt-3 border-t border-emerald-800/50">
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block mb-2">
              Status dos 5 Lotes:
            </span>
            <div className="grid grid-cols-5 gap-1.5">
              {[1, 2, 3, 4, 5].map((lotNum) => {
                const isUnlocked = myTeam.unlockedLots.includes(lotNum);
                return (
                  <div
                    key={lotNum}
                    className={`py-1.5 rounded text-center text-[10px] font-bold border transition-colors ${
                      isUnlocked
                        ? 'bg-emerald-600/30 border-emerald-500 text-emerald-200'
                        : 'bg-black/30 border-emerald-950 text-emerald-700/60'
                    }`}
                  >
                    L{lotNum}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Banner de Celebração de Conclusão do Mapa */}
      {isComplete && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-amber-950 via-emerald-900 to-amber-950 border-2 border-amber-500 shadow-2xl text-center"
        >
          <div className="inline-block p-3 rounded-full bg-amber-500/20 border border-amber-400 mb-2">
            <Sparkles className="w-8 h-8 text-amber-400 animate-spin" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            MAPA ESTRATÉGICO SENAR 2027–2030 CONCLUÍDO!
          </h2>
          <p className="text-emerald-200 text-sm max-w-2xl mx-auto mt-2">
            Sua equipe posicionou com maestria todas as 25 peças do Mapa Estratégico.
          </p>
          <div className="mt-4 p-3 rounded-xl bg-black/40 border border-amber-500/30 max-w-xl mx-auto text-xs text-amber-200 italic">
            “Cada peça representa um conhecimento. Cada rodada fortalece nossa estratégia. Juntos, construímos o futuro do SENAR e contribuímos para um agro mais forte, competitivo e sustentável em Rondônia.”
          </div>
        </motion.div>
      )}

      {/* Modal de Referência do Mapa Original em Alta Resolução */}
      <AnimatePresence>
        {showReferenceModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-4xl w-full bg-[#081a13] rounded-2xl border-2 border-emerald-600 shadow-2xl overflow-hidden p-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-emerald-800">
                <div>
                  <h3 className="text-base font-bold text-white">
                    Mapa Estratégico SENAR 2027–2030 BSC (Referência de Montagem)
                  </h3>
                  <p className="text-xs text-emerald-400">
                    Observe as 4 perspectivas e os 5 objetivos estratégicos para orientar o encaixe das peças.
                  </p>
                </div>
                <button
                  onClick={() => setShowReferenceModal(false)}
                  className="px-3 py-1 text-xs font-bold bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg"
                >
                  Fechar
                </button>
              </div>

              <div className="mt-4 rounded-xl overflow-hidden border border-emerald-700/60">
                <img
                  src={MAP_IMAGE_URL}
                  alt="Mapa Estratégico SENAR 2027-2030 BSC Oficial"
                  className="w-full h-auto object-contain"
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
