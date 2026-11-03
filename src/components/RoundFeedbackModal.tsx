import React, { useState } from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, XCircle, Award, BookOpen, Layers, ArrowRight, RotateCcw, AlertTriangle } from 'lucide-react';
import { RoomState, Team, RoundScore } from '../types/game';
import { ROUND_NAMES } from '../data/questionsData';
import { SoundSystem } from '../utils/audio';
import { triggerConfetti } from '../utils/confetti';
import { api } from '../services/api';

interface RoundFeedbackModalProps {
  room: RoomState;
  myTeam: Team;
  isAdmin?: boolean;
}

export const RoundFeedbackModal: React.FC<RoundFeedbackModalProps> = ({
  room,
  myTeam,
  isAdmin
}) => {
  const currentRound = room.currentRound;
  const scoreData: RoundScore | undefined = myTeam.roundScores[currentRound];
  const roundMeta = ROUND_NAMES[currentRound] || {
    title: `Rodada ${currentRound}`,
    subtitle: 'Planejamento Estratégico',
    lotNumber: currentRound
  };

  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(null);

  if (!scoreData) {
    return (
      <div className="max-w-4xl mx-auto py-16 text-center text-white">
        <p className="text-base text-emerald-300">Aguardando consolidação dos resultados da rodada pelo servidor...</p>
      </div>
    );
  }

  const { correctCount, totalCount, percentage, passed, answers } = scoreData;
  const minRequired = Math.ceil(totalCount * 0.8);

  const handleGoToPuzzle = async () => {
    SoundSystem.playClick();
    if (isAdmin) {
      await api.adminAction(room.code, { action: 'GO_TO_PUZZLE', adminPassword: room.settings.adminPassword });
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      {/* Banner de Resultado da Rodada */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`p-6 sm:p-8 rounded-2xl border-2 shadow-2xl relative overflow-hidden ${
          passed
            ? 'bg-gradient-to-br from-[#09291b] via-[#0d3b27] to-[#09291b] border-emerald-500 text-white'
            : 'bg-gradient-to-br from-[#2a0e10] via-[#3a1518] to-[#2a0e10] border-rose-500 text-white'
        }`}
      >
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div
              className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${
                passed
                  ? 'bg-emerald-500/20 border-2 border-emerald-400 text-emerald-300'
                  : 'bg-rose-500/20 border-2 border-rose-400 text-rose-300'
              }`}
            >
              {passed ? (
                <Award className="w-9 h-9 text-amber-300 animate-bounce" />
              ) : (
                <AlertTriangle className="w-9 h-9 text-rose-400" />
              )}
            </div>

            <div>
              <span className="text-xs uppercase font-extrabold tracking-wider px-2.5 py-0.5 rounded bg-black/40 border border-white/20">
                Resultado da {roundMeta.title.split('—')[0]}
              </span>
              <h1 className="text-2xl sm:text-3xl font-black mt-1">
                {passed ? 'RODADA APROVADA!' : 'RODADA NÃO APROVADA'}
              </h1>
              <p className="text-xs sm:text-sm text-white/80 mt-1">
                {passed
                  ? `Parabéns! Sua equipe conquistou o LOTE 0${roundMeta.lotNumber} com 5 novas peças do Mapa Estratégico!`
                  : `Aproveitamento de ${percentage}%. Eram necessários no mínimo 80% (${minRequired} acertos de ${totalCount}).`}
              </p>
            </div>
          </div>

          {/* Placar Numérico de Aproveitamento */}
          <div className="flex sm:flex-col items-center justify-center px-6 py-3 rounded-xl bg-black/50 border border-white/20 text-center shrink-0">
            <span className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-white">
              {percentage}%
            </span>
            <span className="text-xs text-white/70 font-semibold mt-0.5">
              {correctCount} de {totalCount} acertos
            </span>
          </div>
        </div>

        {/* Botão de Transição para o Quebra-Cabeça */}
        <div className="mt-6 pt-5 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs text-white/70">
            {passed
              ? 'As 5 peças correspondentes a este lote foram adicionadas à sua bandeja de montagem.'
              : 'O lote correspondente permanece bloqueado até eventual repescagem configurada pelo administrador.'}
          </span>

          <button
            onClick={handleGoToPuzzle}
            className="w-full sm:w-auto px-6 py-3 rounded-xl font-extrabold text-sm uppercase tracking-wider flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-black shadow-lg shadow-emerald-900/50 transition-all active:scale-95"
          >
            <Layers className="w-4 h-4" />
            <span>Ir para Montagem do Quebra-Cabeça</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>

      {/* Relatório Pedagógico Detalhado das Questões com Fontes Documentais */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-emerald-400" />
            Gabarito e Justificativas com Base Documental
          </h2>
          <span className="text-xs text-emerald-400/80">
            {correctCount} acertos · {totalCount - correctCount} erros
          </span>
        </div>

        <div className="space-y-3">
          {answers.map((item, idx) => {
            const isExpanded = expandedQuestionId === item.questionId;
            return (
              <div
                key={item.questionId}
                className={`rounded-xl border transition-all overflow-hidden ${
                  item.isCorrect
                    ? 'bg-[#092218] border-emerald-800/80'
                    : 'bg-[#210c0e] border-rose-900/80'
                }`}
              >
                <button
                  onClick={() =>
                    setExpandedQuestionId(isExpanded ? null : item.questionId)
                  }
                  className="w-full text-left p-3.5 sm:p-4 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    {item.isCorrect ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    ) : (
                      <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                    )}
                    <div>
                      <span className="text-xs font-bold text-white block">
                        Questão {idx + 1}
                      </span>
                      <span className="text-xs text-white/70 line-clamp-1">
                        {item.explanation}
                      </span>
                    </div>
                  </div>

                  <span className="text-xs text-emerald-400 underline shrink-0">
                    {isExpanded ? 'Ocultar' : 'Ver Detalhes'}
                  </span>
                </button>

                {isExpanded && (
                  <div className="px-4 pb-4 pt-1 border-t border-white/10 text-xs space-y-2 bg-black/20">
                    <p className="text-emerald-100 font-medium">
                      <strong>Justificativa Oficial:</strong> {item.explanation}
                    </p>
                    <div className="p-2.5 rounded-lg bg-emerald-950/60 border border-emerald-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px]">
                      <div>
                        <span className="text-emerald-400 font-bold">Documento de Origem: </span>
                        <span className="text-white">{item.sourceDocument}</span>
                      </div>
                      <div>
                        <span className="text-amber-400 font-bold">Referência: </span>
                        <span className="text-amber-200">{item.referenceSection}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
