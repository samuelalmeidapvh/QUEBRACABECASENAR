import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Shield, Play, Pause, RotateCcw, ChevronRight, Settings, Users, BookOpen, Download, Check, AlertCircle, Edit3, X } from 'lucide-react';
import { RoomState, Question, RoomSettings, Team } from '../types/game';
import { api } from '../services/api';
import { SoundSystem } from '../utils/audio';

interface AdminPanelProps {
  room: RoomState;
  onClose: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ room, onClose }) => {
  const [password, setPassword] = useState(room.settings.adminPassword || 'senar2030');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');
  const [activeTab, setActiveTab] = useState<'control' | 'settings' | 'teams' | 'questions'>('control');

  // Configurações editáveis
  const [settingsForm, setSettingsForm] = useState<RoomSettings>({ ...room.settings });
  const [questions, setQuestions] = useState<Question[]>([]);
  const [filterRound, setFilterRound] = useState<number>(1);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [actionSuccess, setActionSuccess] = useState('');

  // Carregar banco de questões ao abrir
  useEffect(() => {
    if (isAuthenticated) {
      api.fetchQuestions().then(setQuestions).catch(() => {});
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === room.settings.adminPassword || password === 'senar2030') {
      setIsAuthenticated(true);
      setAuthError('');
      SoundSystem.playSuccess();
    } else {
      setAuthError('Senha de administrador incorreta.');
      SoundSystem.playError();
    }
  };

  const executeAction = async (action: string, extra: any = {}) => {
    SoundSystem.playClick();
    try {
      await api.adminAction(room.code, {
        action,
        adminPassword: password,
        ...extra
      });
      setActionSuccess(`Ação "${action}" executada com sucesso!`);
      setTimeout(() => setActionSuccess(''), 3000);
    } catch (err: any) {
      alert(err.message || 'Erro ao executar ação administrativa.');
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    await executeAction('UPDATE_SETTINGS', { newSettings: settingsForm });
  };

  const handleToggleApproveQuestion = async (q: Question) => {
    try {
      const updated = await api.updateQuestion(q.id, { approved: !q.approved });
      setQuestions((prev) => prev.map((item) => (item.id === q.id ? updated.question : item)));
      SoundSystem.playClick();
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-full max-w-md bg-[#081f16] p-6 rounded-2xl border-2 border-emerald-600 shadow-2xl text-white"
        >
          <div className="flex items-center justify-between pb-3 border-b border-emerald-800">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-emerald-400" />
              <h2 className="text-lg font-bold">Acesso Administrativo</h2>
            </div>
            <button onClick={onClose} className="p-1 rounded hover:bg-emerald-900 text-emerald-300">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleLogin} className="mt-5 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-emerald-300 mb-1">
                Senha do Supervisor / Administrador:
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite a senha (padrão: senar2030)"
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-emerald-700/80 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
              <span className="text-[11px] text-emerald-400/70 block mt-1">
                Senha padrão inicial: <code className="text-amber-300 font-mono">senar2030</code>
              </span>
            </div>

            {authError && (
              <p className="text-xs text-rose-400 bg-rose-950/50 p-2 rounded border border-rose-800">
                {authError}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-black font-extrabold text-sm uppercase tracking-wider hover:from-emerald-400 hover:to-emerald-500 shadow-lg transition-all"
            >
              Entrar no Painel
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  const teams = Object.values(room.teams || {});

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-5xl h-[90vh] bg-[#071912] rounded-2xl border-2 border-emerald-600 shadow-2xl flex flex-col text-white overflow-hidden"
      >
        {/* Top Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-[#0a261a] to-[#0d3323] border-b border-emerald-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-600/30 border border-emerald-500 flex items-center justify-center text-emerald-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Painel de Controle e Supervisão</h2>
              <p className="text-xs text-emerald-300/80">
                Sala: <strong className="font-mono text-white">{room.code}</strong> · Estado Atual: <strong>{room.status}</strong> · Rodada: {room.currentRound}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {actionSuccess && (
              <span className="text-xs text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded border border-emerald-700">
                {actionSuccess}
              </span>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-emerald-950 hover:bg-emerald-900 border border-emerald-800 text-emerald-300"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Abas do Painel */}
        <div className="flex border-b border-emerald-900 bg-emerald-950/40 px-6 gap-2 pt-2 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('control')}
            className={`px-4 py-2 rounded-t-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'control'
                ? 'bg-[#071912] text-emerald-300 border-t-2 border-x border-emerald-600'
                : 'text-emerald-400/60 hover:text-white'
            }`}
          >
            <Play className="w-3.5 h-3.5" />
            Controle da Competição
          </button>

          <button
            onClick={() => setActiveTab('teams')}
            className={`px-4 py-2 rounded-t-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'teams'
                ? 'bg-[#071912] text-emerald-300 border-t-2 border-x border-emerald-600'
                : 'text-emerald-400/60 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            Equipes ({teams.length})
          </button>

          <button
            onClick={() => setActiveTab('questions')}
            className={`px-4 py-2 rounded-t-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'questions'
                ? 'bg-[#071912] text-emerald-300 border-t-2 border-x border-emerald-600'
                : 'text-emerald-400/60 hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Banco de Perguntas (50)
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 rounded-t-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'settings'
                ? 'bg-[#071912] text-emerald-300 border-t-2 border-x border-emerald-600'
                : 'text-emerald-400/60 hover:text-white'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            Configurações
          </button>
        </div>

        {/* Conteúdo da Aba */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'control' && (
            <div className="space-y-6">
              {/* Botões de Ação Principal */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                <button
                  onClick={() => executeAction('START_MATCH')}
                  className="p-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-black font-extrabold text-sm flex flex-col items-center justify-center gap-1.5 shadow-lg"
                >
                  <Play className="w-6 h-6" />
                  <span>INICIAR DESAFIO</span>
                  <span className="text-[10px] opacity-80">Começar Rodada 1</span>
                </button>

                <button
                  onClick={() => executeAction('NEXT_QUESTION')}
                  className="p-4 rounded-xl bg-amber-600 hover:bg-amber-500 text-black font-extrabold text-sm flex flex-col items-center justify-center gap-1.5 shadow-lg"
                >
                  <ChevronRight className="w-6 h-6" />
                  <span>PRÓXIMA PERGUNTA</span>
                  <span className="text-[10px] opacity-80">Avançar questão</span>
                </button>

                <button
                  onClick={() => executeAction('FINISH_ROUND')}
                  className="p-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-sm flex flex-col items-center justify-center gap-1.5 shadow-lg"
                >
                  <Check className="w-6 h-6" />
                  <span>CONCLUIR RODADA</span>
                  <span className="text-[10px] opacity-80">Calcular 80% e lotes</span>
                </button>

                <button
                  onClick={() => executeAction('GO_TO_PUZZLE')}
                  className="p-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-sm flex flex-col items-center justify-center gap-1.5 shadow-lg"
                >
                  <Settings className="w-6 h-6" />
                  <span>ABRIR QUEBRA-CABEÇA</span>
                  <span className="text-[10px] opacity-80">Liberar montagem</span>
                </button>
              </div>

              {/* Controles Secundários */}
              <div className="p-4 rounded-xl bg-[#092218] border border-emerald-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => executeAction('NEXT_ROUND')}
                    className="px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-600 font-bold text-white flex items-center gap-1.5"
                  >
                    <span>Avançar para Rodada {room.currentRound + 1}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => executeAction('RECOVERY_ROUND')}
                    className="px-4 py-2 rounded-lg bg-amber-700/60 hover:bg-amber-600/80 font-bold text-amber-200 border border-amber-600/50"
                  >
                    Repescagem / Nova Tentativa da Rodada
                  </button>

                  <button
                    onClick={() => executeAction('PAUSE_RESUME')}
                    className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5"
                  >
                    <Pause className="w-4 h-4" />
                    <span>{room.isPaused ? 'Retomar Competição' : 'Pausar Cronômetro'}</span>
                  </button>
                </div>

                <button
                  onClick={() => {
                    if (confirm('Tem certeza que deseja reiniciar a sala e zerar o progresso das equipes?')) {
                      executeAction('RESET_ROOM');
                    }
                  }}
                  className="px-3 py-2 rounded-lg bg-rose-950 hover:bg-rose-900 border border-rose-800 text-rose-300 font-semibold flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reiniciar Sala</span>
                </button>
              </div>

              {/* Status ao Vivo das Equipes */}
              <div>
                <h3 className="text-sm font-bold text-emerald-300 mb-3 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Monitoramento ao Vivo das Equipes
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {teams.map((t) => (
                    <div
                      key={t.id}
                      className="p-3.5 rounded-xl bg-black/40 border border-emerald-800/80 space-y-1.5 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white text-sm">{t.name}</span>
                        <span className="font-mono text-emerald-400 font-bold">
                          {t.placedPieces.length} / 25 peças
                        </span>
                      </div>
                      <p className="text-emerald-400/80 text-[11px]">
                        Capitão: <strong>{t.captainName}</strong> ({t.players.length} jogadores)
                      </p>
                      <div className="flex items-center justify-between text-[11px] pt-1 border-t border-emerald-900">
                        <span>Acertos: {t.totalCorrect}</span>
                        <span className="text-amber-300 font-bold">
                          Lotes: {t.unlockedLots.join(', ') || 'Nenhum'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'teams' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-emerald-300">
                Gerenciamento de Equipes e Capitães
              </h3>
              <div className="space-y-3">
                {teams.map((t) => (
                  <div
                    key={t.id}
                    className="p-4 rounded-xl bg-[#092218] border border-emerald-800 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3.5 h-3.5 rounded-full"
                          style={{ backgroundColor: t.color }}
                        />
                        <span className="text-sm font-bold text-white">{t.name}</span>
                        <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 text-[10px]">
                          {t.players.length} membros
                        </span>
                      </div>
                      <p className="text-emerald-400/80 mt-1">
                        Capitão atual: <strong>{t.captainName}</strong>
                      </p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {t.players.map((p) => (
                          <span
                            key={p.id}
                            className={`px-2 py-0.5 rounded text-[10px] ${
                              p.isCaptain
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 font-bold'
                                : 'bg-black/40 text-emerald-200'
                            }`}
                          >
                            {p.name} {p.isCaptain && '👑'}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Reatribuir Capitão */}
                    <div className="flex items-center gap-2">
                      <select
                        onChange={(e) =>
                          executeAction('ASSIGN_CAPTAIN', {
                            targetTeamId: t.id,
                            newCaptainId: e.target.value
                          })
                        }
                        value={t.captainId}
                        className="px-2.5 py-1.5 rounded-lg bg-black/60 border border-emerald-700 text-white text-xs"
                      >
                        {t.players.map((p) => (
                          <option key={p.id} value={p.id}>
                            Nomear {p.name} Capitão
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'questions' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-emerald-900">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-emerald-400 font-semibold">Filtrar por Rodada:</span>
                  {[1, 2, 3, 4, 5].map((r) => (
                    <button
                      key={r}
                      onClick={() => setFilterRound(r)}
                      className={`px-2.5 py-1 rounded text-xs font-bold transition-colors ${
                        filterRound === r
                          ? 'bg-emerald-500 text-black'
                          : 'bg-emerald-950 text-emerald-300 hover:bg-emerald-900'
                      }`}
                    >
                      Rodada {r}
                    </button>
                  ))}
                </div>

                <span className="text-xs text-emerald-400/80">
                  Mostrando {questions.filter((q) => q.round === filterRound).length} perguntas
                </span>
              </div>

              <div className="space-y-3">
                {questions
                  .filter((q) => q.round === filterRound)
                  .map((q, idx) => (
                    <div
                      key={q.id}
                      className="p-3.5 rounded-xl bg-black/40 border border-emerald-800/80 text-xs space-y-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-amber-400 font-bold mr-2">
                            #{idx + 1} ({q.difficulty})
                          </span>
                          <span className="text-emerald-300 font-semibold">{q.topic}</span>
                          <p className="text-white font-medium mt-1 leading-relaxed">{q.prompt}</p>
                        </div>
                        <button
                          onClick={() => handleToggleApproveQuestion(q)}
                          className={`px-2.5 py-1 rounded text-[10px] font-bold border shrink-0 ${
                            q.approved
                              ? 'bg-emerald-950 text-emerald-300 border-emerald-600'
                              : 'bg-rose-950 text-rose-300 border-rose-600'
                          }`}
                        >
                          {q.approved ? 'Aprovada' : 'Pendente'}
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px] pt-1">
                        {q.options.map((opt, i) => (
                          <div
                            key={i}
                            className={`p-1.5 rounded ${
                              i === q.correctIndex
                                ? 'bg-emerald-900/40 text-emerald-300 border border-emerald-600/60 font-semibold'
                                : 'text-emerald-400/70'
                            }`}
                          >
                            {String.fromCharCode(65 + i)}) {opt}
                          </div>
                        ))}
                      </div>

                      <div className="pt-2 border-t border-emerald-900/60 flex flex-col sm:flex-row sm:items-center justify-between text-[10px] text-emerald-400/70 gap-1">
                        <span>
                          <strong>Documento:</strong> {q.sourceDocument}
                        </span>
                        <span>
                          <strong>Ref:</strong> {q.referenceSection}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <form onSubmit={handleSaveSettings} className="max-w-xl space-y-4 text-xs">
              <div>
                <label className="block text-emerald-300 font-semibold mb-1">
                  Perguntas por Rodada (Padrão: 10):
                </label>
                <input
                  type="number"
                  min={3}
                  max={10}
                  value={settingsForm.questionsPerRound}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, questionsPerRound: parseInt(e.target.value) || 10 })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-black/50 border border-emerald-700 text-white"
                />
                <span className="text-[11px] text-emerald-400/70 block mt-0.5">
                  A regra dos 80% arredondará para cima automaticamente (Ex: 10 perguntas = 8 acertos; 5 perguntas = 4 acertos).
                </span>
              </div>

              <div>
                <label className="block text-emerald-300 font-semibold mb-1">
                  Tempo por Pergunta (Segundos, Padrão: 45s):
                </label>
                <input
                  type="number"
                  min={15}
                  max={180}
                  value={settingsForm.questionTimerSeconds}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, questionTimerSeconds: parseInt(e.target.value) || 45 })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-black/50 border border-emerald-700 text-white"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="allowRecovery"
                  checked={settingsForm.allowRecovery}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, allowRecovery: e.target.checked })
                  }
                  className="w-4 h-4 accent-emerald-500 rounded"
                />
                <label htmlFor="allowRecovery" className="text-white font-medium cursor-pointer">
                  Permitir rodadas de recuperação sem reiniciar o cronômetro geral
                </label>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="showReferenceMap"
                  checked={settingsForm.showReferenceMap}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, showReferenceMap: e.target.checked })
                  }
                  className="w-4 h-4 accent-emerald-500 rounded"
                />
                <label htmlFor="showReferenceMap" className="text-white font-medium cursor-pointer">
                  Disponibilizar botão de imagem de referência aos jogadores
                </label>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-black font-extrabold uppercase tracking-wider text-xs shadow-lg"
                >
                  Salvar Novas Configurações
                </button>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
};
