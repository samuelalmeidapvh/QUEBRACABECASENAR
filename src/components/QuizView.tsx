import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, CheckCircle, Users, Crown, AlertCircle, ChevronRight, ChevronLeft, HelpCircle } from 'lucide-react';
import { RoomState, Team, Question } from '../types/game';
import { ROUND_NAMES } from '../data/questionsData';
import { SoundSystem } from '../utils/audio';
import { api } from '../services/api';

interface QuizViewProps {
  room: RoomState;
  myTeam: Team;
  playerId: string;
  isCaptain: boolean;
  isAdmin?: boolean;
}

export const QuizView: React.FC<QuizViewProps> = ({
  room,
  myTeam,
  playerId,
  isCaptain,
  isAdmin
}) => {
  const currentIdx = room.currentQuestionIndex;
  const activeQuestions: any[] = (room as any).activeQuestions || [];
  const currentQuestion: any = activeQuestions[currentIdx];

  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(room.settings.questionTimerSeconds);
  const [submitting, setSubmitting] = useState(false);

  const roundMeta = ROUND_NAMES[room.currentRound] || {
    title: `Rodada ${room.currentRound}`,
    subtitle: 'Planejamento Estratégico SENAR-AR/RO',
    lotNumber: room.currentRound
  };

  // Resposta já confirmada pela equipe nesta pergunta
  const teamConfirmedAnswer = currentQuestion
    ? myTeam.currentRoundAnswers[currentQuestion.id]
    : undefined;

  // Atualizar seleção local se o time já respondeu
  useEffect(() => {
    if (teamConfirmedAnswer !== undefined) {
      setSelectedOption(teamConfirmedAnswer);
    } else {
      // Voto individual prévio
      const myPlayer = myTeam.players.find((p) => p.id === playerId);
      setSelectedOption(myPlayer?.voteIndex ?? null);
    }
  }, [currentIdx, teamConfirmedAnswer, currentQuestion?.id, myTeam.players, playerId]);

  // Contagem regressiva da pergunta pelo horário oficial do servidor
  useEffect(() => {
    if (room.isPaused || !room.questionStartedAt) return;

    const timerDuration = room.settings.questionTimerSeconds;
    const updateCountdown = () => {
      const elapsed = Math.floor((Date.now() - room.questionStartedAt) / 1000);
      const remaining = Math.max(0, timerDuration - elapsed);
      setSecondsRemaining(remaining);

      // Tique sonoro nos últimos 5 segundos
      if (remaining <= 5 && remaining > 0 && !teamConfirmedAnswer) {
        SoundSystem.playTick();
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [room.questionStartedAt, room.isPaused, room.settings.questionTimerSeconds, teamConfirmedAnswer]);

  if (!currentQuestion) {
    return (
      <div className="py-20 text-center text-white">
        <p className="text-lg">Carregando pergunta da rodada...</p>
      </div>
    );
  }

  // Identificar votos dos colegas de equipe por opção
  const votesPerOption: Record<number, string[]> = { 0: [], 1: [], 2: [], 3: [] };
  myTeam.players.forEach((p) => {
    if (p.voteIndex !== undefined && votesPerOption[p.voteIndex]) {
      votesPerOption[p.voteIndex].push(p.name);
    }
  });

  // Manipular clique em opção (Voto ou pré-seleção)
  const handleSelectOption = async (optionIndex: number) => {
    if (teamConfirmedAnswer !== undefined) return; // Já confirmada

    SoundSystem.playClick();
    setSelectedOption(optionIndex);

    // Registra voto em tempo real para toda a equipe visualizar
    try {
      await api.submitVote(room.code, {
        teamId: myTeam.id,
        playerId,
        questionId: currentQuestion.id,
        optionIndex
      });
    } catch (e) {
      // continua com seleção local
    }
  };

  // Confirmação oficial da resposta pelo capitão
  const handleConfirmOfficialAnswer = async () => {
    if (selectedOption === null || teamConfirmedAnswer !== undefined || submitting) return;

    setSubmitting(true);
    SoundSystem.playClick();
    try {
      await api.submitAnswer(room.code, {
        teamId: myTeam.id,
        playerId,
        questionId: currentQuestion.id,
        selectedIndex: selectedOption
      });
      SoundSystem.playSuccess();
    } catch (err: any) {
      alert(err.message || 'Erro ao submeter resposta.');
    } finally {
      setSubmitting(false);
    }
  };

  const timerPercent = Math.max(0, Math.min(100, (secondsRemaining / room.settings.questionTimerSeconds) * 100));
  const isUrgent = secondsRemaining <= 10;
  const isSoloTeam = myTeam.players.length <= 1;
  const canConfirm = isCaptain || isSoloTeam;

  const totalQuestions = activeQuestions.length;
  const questionsAnsweredCount = Object.keys(myTeam.currentRoundAnswers).length;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6">
      {/* Cabeçalho da Rodada */}
      <div className="mb-6 bg-gradient-to-r from-[#0a2318] via-[#0d2f21] to-[#0a2318] p-4 sm:p-5 rounded-2xl border border-emerald-800/70 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-400 bg-amber-950/80 border border-amber-600/50 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Lote #{roundMeta.lotNumber} em disputa
              </span>
              <span className="text-xs text-emerald-300/80">·</span>
              <span className="text-xs text-emerald-300 font-medium">Meta: Mínimo de 80% de acertos</span>
            </div>
            <h1 className="text-lg sm:text-xl font-extrabold text-white mt-1">
              {roundMeta.title}
            </h1>
            <p className="text-xs text-emerald-300/70 mt-0.5">
              {roundMeta.subtitle}
            </p>
          </div>

          {/* Cronômetro da Pergunta */}
          <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
            <div
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border font-mono font-bold transition-colors ${
                isUrgent
                  ? 'bg-rose-950/90 border-rose-500 text-rose-300 animate-pulse'
                  : 'bg-emerald-950/90 border-emerald-600/70 text-emerald-300'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span className="text-sm sm:text-base tabular-nums">
                {secondsRemaining}s
              </span>
            </div>
          </div>
        </div>

        {/* Barra de Progresso do Tempo da Pergunta */}
        <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden mt-4">
          <div
            className={`h-full transition-all duration-1000 ${
              isUrgent ? 'bg-rose-500' : 'bg-emerald-400'
            }`}
            style={{ width: `${timerPercent}%` }}
          />
        </div>
      </div>

      {/* Cartão Central da Pergunta */}
      <motion.div
        key={currentQuestion.id}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#0b241a] rounded-2xl border-2 border-emerald-800/80 shadow-2xl p-5 sm:p-7 relative overflow-hidden"
      >
        {/* Metadados da Questão */}
        <div className="flex items-center justify-between pb-4 border-b border-emerald-800/60 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white text-sm">
              Questão {currentIdx + 1} de {totalQuestions}
            </span>
            <span className="text-emerald-500">·</span>
            <span className="text-emerald-300/90 font-medium">
              Tema: {currentQuestion.topic}
            </span>
          </div>
          <span
            className={`px-2.5 py-0.5 rounded text-[11px] font-semibold border ${
              currentQuestion.difficulty === 'Fácil'
                ? 'bg-emerald-950 text-emerald-300 border-emerald-700/60'
                : currentQuestion.difficulty === 'Médio'
                ? 'bg-amber-950 text-amber-300 border-amber-700/60'
                : 'bg-rose-950 text-rose-300 border-rose-700/60'
            }`}
          >
            {currentQuestion.difficulty}
          </span>
        </div>

        {/* Enunciado */}
        <div className="py-5">
          <h2 className="text-base sm:text-lg font-bold text-white leading-relaxed">
            {currentQuestion.prompt}
          </h2>
        </div>

        {/* 4 Alternativas de Resposta */}
        <div className="space-y-3">
          {currentQuestion.options.map((optionText: string, optIdx: number) => {
            const letter = String.fromCharCode(65 + optIdx); // A, B, C, D
            const isSelected = selectedOption === optIdx;
            const isConfirmed = teamConfirmedAnswer === optIdx;
            const votes = votesPerOption[optIdx] || [];

            return (
              <motion.button
                key={optIdx}
                whileHover={teamConfirmedAnswer === undefined ? { scale: 1.01 } : {}}
                whileTap={teamConfirmedAnswer === undefined ? { scale: 0.99 } : {}}
                onClick={() => handleSelectOption(optIdx)}
                disabled={teamConfirmedAnswer !== undefined}
                className={`w-full text-left p-3.5 sm:p-4 rounded-xl border-2 transition-all flex items-start gap-3.5 relative ${
                  isConfirmed
                    ? 'bg-emerald-900/60 border-emerald-400 text-white shadow-lg shadow-emerald-950/40'
                    : isSelected
                    ? 'bg-emerald-950/90 border-amber-400 text-white shadow-md'
                    : 'bg-black/30 hover:bg-emerald-950/50 border-emerald-900/80 text-emerald-100 hover:border-emerald-700'
                }`}
              >
                {/* Letra da Alternativa */}
                <span
                  className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                    isConfirmed
                      ? 'bg-emerald-500 text-black font-extrabold'
                      : isSelected
                      ? 'bg-amber-500 text-black font-extrabold'
                      : 'bg-emerald-950 border border-emerald-700 text-emerald-300'
                  }`}
                >
                  {letter}
                </span>

                {/* Texto da Opção */}
                <div className="flex-1">
                  <p className="text-xs sm:text-sm font-medium leading-relaxed">
                    {optionText}
                  </p>

                  {/* Votos dos colegas de equipe em tempo real */}
                  {votes.length > 0 && (
                    <div className="flex items-center gap-1.5 mt-2 text-[11px] text-amber-300/90">
                      <Users className="w-3 h-3 text-amber-400" />
                      <span>
                        Sugerido por: <strong>{votes.join(', ')}</strong>
                      </span>
                    </div>
                  )}
                </div>

                {/* Ícone de confirmação */}
                {isConfirmed && (
                  <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 self-center" />
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Zona de Confirmação Oficial do Capitão */}
        <div className="mt-6 pt-5 border-t border-emerald-800/60 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-emerald-300/80 flex items-center gap-2">
            <Crown className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              Capitão Oficial: <strong>{myTeam.captainName}</strong>
              {!isCaptain && !isSoloTeam && ' (Apenas ele pode confirmar a resposta final da equipe)'}
            </span>
          </div>

          <div>
            {teamConfirmedAnswer !== undefined ? (
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-900/60 border border-emerald-500 text-emerald-200 text-xs font-bold">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>Resposta Oficial Confirmada!</span>
              </div>
            ) : canConfirm ? (
              <button
                onClick={handleConfirmOfficialAnswer}
                disabled={selectedOption === null || submitting}
                className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg ${
                  selectedOption !== null && !submitting
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black shadow-amber-500/20 active:scale-95'
                    : 'bg-emerald-950/80 text-emerald-600 border border-emerald-900 cursor-not-allowed'
                }`}
              >
                <CheckCircle className="w-4 h-4" />
                <span>{submitting ? 'Confirmando...' : 'Confirmar Resposta da Equipe'}</span>
              </button>
            ) : (
              <div className="text-xs text-amber-300/80 bg-amber-950/40 border border-amber-700/50 px-3 py-1.5 rounded-lg">
                Seu voto foi registrado! Aguarde o Capitão confirmar.
              </div>
            )}
          </div>
        </div>

        {/* Rodapé Administrativo / Navegação entre Perguntas */}
        <div className="mt-4 pt-3 flex items-center justify-between text-xs text-emerald-400/80">
          <div className="flex items-center gap-1.5">
            <span>Progresso da equipe na rodada:</span>
            <strong className="text-white">
              {questionsAnsweredCount} / {totalQuestions} respondidas
            </strong>
          </div>

          {/* Navegação se admin ou capitão */}
          {isAdmin && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => api.adminAction(room.code, { action: 'PREV_QUESTION', adminPassword: room.settings.adminPassword })}
                disabled={currentIdx === 0}
                className="px-2 py-1 rounded bg-emerald-950 border border-emerald-800 disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4 text-white" />
              </button>
              <button
                onClick={() => api.adminAction(room.code, { action: 'NEXT_QUESTION', adminPassword: room.settings.adminPassword })}
                className="px-3 py-1 rounded bg-emerald-800 hover:bg-emerald-700 text-white font-bold flex items-center gap-1"
              >
                <span>{currentIdx < totalQuestions - 1 ? 'Próxima Questão' : 'Encerrar Rodada'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
