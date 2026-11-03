import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Shield,
  Play,
  Pause,
  RotateCcw,
  ChevronRight,
  Settings,
  Users,
  BookOpen,
  Download,
  Check,
  AlertCircle,
  Edit3,
  X,
  Trash2,
  Edit2,
  Plus,
  UserPlus,
  Crown,
  Sparkles,
  Tv
} from 'lucide-react';
import { RoomState, Question, RoomSettings, Team, Player } from '../types/game';
import { api } from '../services/api';
import { SoundSystem } from '../utils/audio';
import { DisplayControlModal } from './DisplayControlModal';

const AVAILABLE_TEAM_COLORS = [
  '#10b981', // Verde Esmeralda (SENAR)
  '#059669', // Verde Floresta
  '#f59e0b', // Dourado Agro
  '#3b82f6', // Azul Tecnológico
  '#8b5cf6', // Roxo Inovação
  '#ec4899', // Rosa Campo
  '#14b8a6', // Turquesa
  '#f97316'  // Laranja Solar
];

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
  const [showDisplayControl, setShowDisplayControl] = useState(false);

  // Estados para Gestão Completa de Equipes e Participantes
  const [showNewTeamModal, setShowNewTeamModal] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamColor, setNewTeamColor] = useState(AVAILABLE_TEAM_COLORS[0]);

  const [editingTeam, setEditingTeam] = useState<{ id: string; name: string; color: string } | null>(null);

  const [addingPlayerToTeamId, setAddingPlayerToTeamId] = useState<string | null>(null);
  const [newPlayerName, setNewPlayerName] = useState('');

  const [editingPlayer, setEditingPlayer] = useState<{ teamId: string; playerId: string; name: string } | null>(null);

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
            <button
              onClick={() => setShowDisplayControl(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold text-xs shadow-lg shadow-amber-950/40 transition-transform active:scale-95"
              title="Abrir Central de Transmissão e Modo Telão"
            >
              <Tv className="w-4 h-4" />
              <span>ABRIR MODO TELÃO</span>
            </button>
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
              {/* Banner Central de Transmissão & Modo Telão */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-amber-950/70 via-emerald-950/80 to-slate-900 border-2 border-amber-500/60 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl shadow-amber-950/20">
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-amber-500/20 border border-amber-500 flex items-center justify-center text-amber-400 shrink-0">
                    <Tv className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-white tracking-wide">
                        CENTRAL DO MODO TELÃO & TRANSMISSÃO AO VIVO
                      </h3>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase">
                        1080p Full HD
                      </span>
                    </div>
                    <p className="text-xs text-emerald-200/80 mt-0.5">
                      Projeção sincronizada para telões e TVs com timeline das 5 rodadas, quebra-cabeça 25 peças, destaques e pódio.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setShowDisplayControl(true)}
                  className="w-full md:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-900/40 transition-transform active:scale-95 shrink-0"
                >
                  <Tv className="w-4 h-4" />
                  <span>GERENCIAR TELÃO & TRANSMISSÃO</span>
                </button>
              </div>

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
            <div className="space-y-5">
              {/* Topo do Menu Equipes */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-emerald-900">
                <div>
                  <h3 className="text-sm font-bold text-emerald-300 flex items-center gap-2">
                    <Users className="w-4 h-4 text-emerald-400" />
                    Gerenciamento de Equipes e Participantes
                  </h3>
                  <p className="text-xs text-emerald-400/70 mt-0.5">
                    {teams.length} equipes cadastradas · {teams.reduce((acc, t) => acc + t.players.length, 0)} participantes totais
                  </p>
                </div>

                <button
                  onClick={() => {
                    SoundSystem.playClick();
                    setShowNewTeamModal(true);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-black text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Cadastrar Nova Equipe</span>
                </button>
              </div>

              {/* Formulário de Criação de Nova Equipe */}
              <AnimatePresence>
                {showNewTeamModal && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-4 rounded-xl bg-black/60 border-2 border-emerald-500/80 shadow-xl overflow-hidden"
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-emerald-800 mb-3">
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        <Plus className="w-4 h-4 text-emerald-400" />
                        Cadastrar Nova Equipe
                      </span>
                      <button
                        onClick={() => setShowNewTeamModal(false)}
                        className="text-emerald-400 hover:text-white"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="block text-emerald-300 font-semibold mb-1">
                          Nome da Equipe:
                        </label>
                        <input
                          type="text"
                          value={newTeamName}
                          onChange={(e) => setNewTeamName(e.target.value)}
                          placeholder="Ex: Equipe AgroFronteira"
                          className="w-full px-3 py-2 rounded-lg bg-black/50 border border-emerald-700 text-white text-xs focus:ring-1 focus:ring-emerald-400 outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-emerald-300 font-semibold mb-1">
                          Cor da Equipe:
                        </label>
                        <div className="flex items-center gap-2 pt-1">
                          {AVAILABLE_TEAM_COLORS.map((c) => (
                            <button
                              key={c}
                              type="button"
                              onClick={() => setNewTeamColor(c)}
                              className={`w-6 h-6 rounded-full transition-transform ${
                                newTeamColor === c
                                  ? 'scale-125 ring-2 ring-white shadow'
                                  : 'opacity-70 hover:opacity-100'
                              }`}
                              style={{ backgroundColor: c }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setShowNewTeamModal(false)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-950 text-emerald-300 text-xs font-semibold hover:bg-emerald-900"
                      >
                        Cancelar
                      </button>
                      <button
                        type="button"
                        onClick={async () => {
                          if (!newTeamName.trim()) {
                            alert('Informe o nome da equipe.');
                            return;
                          }
                          await executeAction('CREATE_TEAM', {
                            teamData: { name: newTeamName.trim(), color: newTeamColor }
                          });
                          setNewTeamName('');
                          setShowNewTeamModal(false);
                        }}
                        className="px-4 py-1.5 rounded-lg bg-emerald-500 text-black text-xs font-bold hover:bg-emerald-400 shadow"
                      >
                        Salvar Equipe
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Lista das Equipes Cadastradas */}
              <div className="space-y-4">
                {teams.length === 0 ? (
                  <div className="py-8 text-center text-emerald-400/60 text-xs">
                    Nenhuma equipe cadastrada no momento. Clique em "Cadastrar Nova Equipe" acima.
                  </div>
                ) : (
                  teams.map((t) => {
                    const isEditingThisTeam = editingTeam?.id === t.id;
                    const isAddingPlayer = addingPlayerToTeamId === t.id;
                    const isFull = t.players.length >= 10;

                    return (
                      <div
                        key={t.id}
                        className="p-4 rounded-xl bg-[#092218] border border-emerald-800/80 shadow-md space-y-3"
                      >
                        {/* Linha de Cabeçalho da Equipe */}
                        {isEditingThisTeam ? (
                          <div className="p-3 rounded-lg bg-black/50 border border-amber-500/70 space-y-3">
                            <span className="text-xs font-bold text-amber-300 block">
                              Alterar Informações da Equipe
                            </span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                              <div>
                                <label className="text-emerald-300 font-semibold block mb-1">
                                  Nome da Equipe:
                                </label>
                                <input
                                  type="text"
                                  value={editingTeam.name}
                                  onChange={(e) =>
                                    setEditingTeam({ ...editingTeam, name: e.target.value })
                                  }
                                  className="w-full px-3 py-1.5 rounded bg-black border border-emerald-700 text-white text-xs outline-none"
                                />
                              </div>
                              <div>
                                <label className="text-emerald-300 font-semibold block mb-1">
                                  Cor:
                                </label>
                                <div className="flex gap-2 pt-1">
                                  {AVAILABLE_TEAM_COLORS.map((c) => (
                                    <button
                                      key={c}
                                      type="button"
                                      onClick={() =>
                                        setEditingTeam({ ...editingTeam, color: c })
                                      }
                                      className={`w-5 h-5 rounded-full transition-transform ${
                                        editingTeam.color === c
                                          ? 'scale-125 ring-2 ring-white'
                                          : 'opacity-70 hover:opacity-100'
                                      }`}
                                      style={{ backgroundColor: c }}
                                    />
                                  ))}
                                </div>
                              </div>
                            </div>
                            <div className="flex justify-end gap-2 pt-1">
                              <button
                                onClick={() => setEditingTeam(null)}
                                className="px-3 py-1 rounded bg-emerald-950 text-emerald-300 text-xs font-semibold"
                              >
                                Cancelar
                              </button>
                              <button
                                onClick={async () => {
                                  if (!editingTeam.name.trim()) return;
                                  await executeAction('EDIT_TEAM', {
                                    targetTeamId: t.id,
                                    teamData: {
                                      name: editingTeam.name.trim(),
                                      color: editingTeam.color
                                    }
                                  });
                                  setEditingTeam(null);
                                }}
                                className="px-3.5 py-1 rounded bg-amber-500 text-black text-xs font-bold hover:bg-amber-400"
                              >
                                Salvar Alterações
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-emerald-900/70">
                            <div className="flex items-center gap-2.5">
                              <div
                                className="w-4 h-4 rounded-full shadow"
                                style={{ backgroundColor: t.color }}
                              />
                              <div>
                                <span className="text-sm font-extrabold text-white">
                                  {t.name}
                                </span>
                                <span className="ml-2 px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 text-[10px] font-mono font-semibold border border-emerald-800">
                                  {t.players.length}/10 membros
                                </span>
                                {t.captainName && (
                                  <span className="ml-2 text-[11px] text-amber-300/90 font-medium">
                                    👑 Capitão: <strong>{t.captainName}</strong>
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Botões de Ação da Equipe */}
                            <div className="flex items-center gap-1.5 self-end sm:self-center">
                              {/* Botão Adicionar Participante */}
                              <button
                                onClick={() => {
                                  SoundSystem.playClick();
                                  setAddingPlayerToTeamId(isAddingPlayer ? null : t.id);
                                  setNewPlayerName('');
                                }}
                                disabled={isFull}
                                title={isFull ? 'Equipe atingiu o limite de 10 participantes' : 'Adicionar Participante'}
                                className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 border transition-colors ${
                                  isFull
                                    ? 'bg-black/30 text-emerald-700 border-emerald-950 cursor-not-allowed'
                                    : 'bg-emerald-950/80 hover:bg-emerald-900 text-emerald-200 border-emerald-700/60'
                                }`}
                              >
                                <UserPlus className="w-3.5 h-3.5 text-emerald-400" />
                                <span className="hidden md:inline">Adicionar Participante</span>
                              </button>

                              {/* Botão Alterar Equipe */}
                              <button
                                onClick={() => {
                                  SoundSystem.playClick();
                                  setEditingTeam({ id: t.id, name: t.name, color: t.color });
                                }}
                                title="Alterar Nome e Cor da Equipe"
                                className="px-2.5 py-1 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-700/60 text-emerald-200 text-xs font-semibold flex items-center gap-1 transition-colors"
                              >
                                <Edit2 className="w-3.5 h-3.5 text-amber-400" />
                                <span className="hidden md:inline">Alterar</span>
                              </button>

                              {/* Botão Excluir Equipe */}
                              <button
                                onClick={async () => {
                                  SoundSystem.playClick();
                                  const confirmMsg = t.players.length > 0
                                    ? `Tem certeza que deseja excluir a equipe "${t.name}"?\nOs ${t.players.length} participantes e todo o progresso associado serão removidos permanentemente.`
                                    : `Tem certeza que deseja excluir a equipe "${t.name}"?`;
                                  if (window.confirm(confirmMsg)) {
                                    await executeAction('DELETE_TEAM', { targetTeamId: t.id });
                                  }
                                }}
                                title="Excluir Equipe"
                                className="px-2.5 py-1 rounded-lg bg-rose-950/80 hover:bg-rose-900 border border-rose-800 text-rose-300 text-xs font-semibold flex items-center gap-1 transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                                <span className="hidden md:inline">Excluir</span>
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Formulário Inline de Adição de Participante */}
                        {isAddingPlayer && (
                          <div className="p-3 rounded-lg bg-black/40 border border-emerald-600/70 flex flex-col sm:flex-row items-center gap-2">
                            <input
                              type="text"
                              value={newPlayerName}
                              onChange={(e) => setNewPlayerName(e.target.value)}
                              placeholder="Nome do novo participante..."
                              className="flex-1 w-full px-3 py-1.5 rounded bg-black/70 border border-emerald-700 text-white text-xs outline-none focus:ring-1 focus:ring-emerald-400"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  if (newPlayerName.trim()) {
                                    executeAction('ADD_PLAYER_TO_TEAM', {
                                      targetTeamId: t.id,
                                      playerName: newPlayerName.trim()
                                    });
                                    setNewPlayerName('');
                                    setAddingPlayerToTeamId(null);
                                  }
                                }
                              }}
                            />
                            <div className="flex items-center gap-2 self-end sm:self-center">
                              <button
                                onClick={() => setAddingPlayerToTeamId(null)}
                                className="px-2.5 py-1 rounded bg-emerald-950 text-emerald-300 text-xs"
                              >
                                Cancelar
                              </button>
                              <button
                                onClick={async () => {
                                  if (!newPlayerName.trim()) {
                                    alert('Digite o nome do participante.');
                                    return;
                                  }
                                  await executeAction('ADD_PLAYER_TO_TEAM', {
                                    targetTeamId: t.id,
                                    playerName: newPlayerName.trim()
                                  });
                                  setNewPlayerName('');
                                  setAddingPlayerToTeamId(null);
                                }}
                                className="px-3 py-1 rounded bg-emerald-500 text-black text-xs font-bold hover:bg-emerald-400 shadow"
                              >
                                Confirmar Adição
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Lista de Participantes da Equipe */}
                        <div className="space-y-2">
                          <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block">
                            Participantes ({t.players.length}/10):
                          </span>

                          {t.players.length === 0 ? (
                            <div className="text-[11px] text-emerald-400/60 italic py-1">
                              Nenhum participante vinculado a esta equipe ainda. Clique em "Adicionar Participante".
                            </div>
                          ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {t.players.map((p) => {
                                const isEditingPlayer =
                                  editingPlayer?.teamId === t.id && editingPlayer?.playerId === p.id;

                                return (
                                  <div
                                    key={p.id}
                                    className={`p-2.5 rounded-lg border flex items-center justify-between gap-2 text-xs transition-colors ${
                                      p.isCaptain
                                        ? 'bg-amber-950/30 border-amber-600/50'
                                        : 'bg-black/30 border-emerald-900/80 hover:border-emerald-800'
                                    }`}
                                  >
                                    {isEditingPlayer ? (
                                      <div className="flex items-center gap-1.5 w-full">
                                        <input
                                          type="text"
                                          value={editingPlayer.name}
                                          onChange={(e) =>
                                            setEditingPlayer({
                                              ...editingPlayer,
                                              name: e.target.value
                                            })
                                          }
                                          className="flex-1 px-2 py-1 rounded bg-black border border-amber-400 text-white text-xs outline-none"
                                        />
                                        <button
                                          onClick={async () => {
                                            if (!editingPlayer.name.trim()) return;
                                            await executeAction('EDIT_PLAYER', {
                                              targetTeamId: t.id,
                                              targetPlayerId: p.id,
                                              playerData: { name: editingPlayer.name.trim() }
                                            });
                                            setEditingPlayer(null);
                                          }}
                                          title="Salvar Nome"
                                          className="p-1 rounded bg-emerald-600 hover:bg-emerald-500 text-black font-bold"
                                        >
                                          <Check className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                          onClick={() => setEditingPlayer(null)}
                                          title="Cancelar"
                                          className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-white"
                                        >
                                          <X className="w-3.5 h-3.5" />
                                        </button>
                                      </div>
                                    ) : (
                                      <>
                                        <div className="flex items-center gap-1.5 truncate">
                                          <span className="font-semibold text-white truncate">
                                            {p.name}
                                          </span>
                                          {p.isCaptain && (
                                            <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-extrabold text-[10px] border border-amber-500/40 shrink-0">
                                              👑 Capitão
                                            </span>
                                          )}
                                        </div>

                                        <div className="flex items-center gap-1 shrink-0">
                                          {/* Tornar Capitão (se não for) */}
                                          {!p.isCaptain && (
                                            <button
                                              onClick={() =>
                                                executeAction('ASSIGN_CAPTAIN', {
                                                  targetTeamId: t.id,
                                                  newCaptainId: p.id
                                                })
                                              }
                                              title="Tornar este participante o Capitão da equipe"
                                              className="p-1 rounded bg-emerald-950 hover:bg-amber-950 border border-emerald-800 hover:border-amber-600 text-amber-300 text-[10px] font-bold"
                                            >
                                              <Crown className="w-3 h-3" />
                                            </button>
                                          )}

                                          {/* Alterar Participante */}
                                          <button
                                            onClick={() => {
                                              SoundSystem.playClick();
                                              setEditingPlayer({
                                                teamId: t.id,
                                                playerId: p.id,
                                                name: p.name
                                              });
                                            }}
                                            title="Alterar Nome do Participante"
                                            className="p-1 rounded bg-emerald-950 hover:bg-emerald-900 border border-emerald-800 text-emerald-300"
                                          >
                                            <Edit2 className="w-3 h-3 text-amber-400" />
                                          </button>

                                          {/* Excluir Participante */}
                                          <button
                                            onClick={async () => {
                                              SoundSystem.playClick();
                                              if (
                                                window.confirm(
                                                  `Tem certeza que deseja excluir o participante "${p.name}" da equipe "${t.name}"?`
                                                )
                                              ) {
                                                await executeAction('DELETE_PLAYER', {
                                                  targetTeamId: t.id,
                                                  targetPlayerId: p.id
                                                });
                                              }
                                            }}
                                            title="Excluir Participante da Equipe"
                                            className="p-1 rounded bg-rose-950/80 hover:bg-rose-900 border border-rose-800 text-rose-300"
                                          >
                                            <Trash2 className="w-3 h-3 text-rose-400" />
                                          </button>
                                        </div>
                                      </>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
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

      {/* Modal de Controle do Modo Telão */}
      {showDisplayControl && (
        <DisplayControlModal
          room={room}
          onClose={() => setShowDisplayControl(false)}
        />
      )}
    </div>
  );
};
