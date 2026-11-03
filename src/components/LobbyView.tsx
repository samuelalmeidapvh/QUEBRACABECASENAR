import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Users, Play, Crown, Plus, Check, Shield, HelpCircle, Trophy, Sparkles, Layers, Tractor, Leaf, Sun } from 'lucide-react';
import { RoomState, Team } from '../types/game';
import { SoundSystem } from '../utils/audio';

interface LobbyViewProps {
  room: RoomState;
  myTeam: Team | null;
  playerId: string;
  isCaptain: boolean;
  onJoinTeam: (params: {
    playerName: string;
    teamId?: string;
    newTeamName?: string;
    teamColor?: string;
    teamAvatar?: string;
  }) => Promise<void>;
  onStartGame?: () => void;
  onOpenHowToPlay: () => void;
  onOpenRanking: () => void;
  onOpenAdmin: () => void;
  isAdmin?: boolean;
}

const AVAILABLE_COLORS = [
  '#10b981', // Verde Esmeralda (SENAR)
  '#059669', // Verde Floresta
  '#f59e0b', // Dourado Agro
  '#3b82f6', // Azul Tecnológico
  '#8b5cf6', // Roxo Inovação
  '#ec4899', // Rosa Campo
  '#14b8a6', // Turquesa
  '#f97316'  // Laranja Solar
];

export const LobbyView: React.FC<LobbyViewProps> = ({
  room,
  myTeam,
  playerId,
  isCaptain,
  onJoinTeam,
  onStartGame,
  onOpenHowToPlay,
  onOpenRanking,
  onOpenAdmin,
  isAdmin
}) => {
  const [playerName, setPlayerName] = useState('');
  const [selectedTeamId, setSelectedTeamId] = useState<string>('team-alfa');
  const [isCreatingTeam, setIsCreatingTeam] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const [selectedColor, setSelectedColor] = useState(AVAILABLE_COLORS[0]);
  const [joining, setJoining] = useState(false);
  const [joinError, setJoinError] = useState('');

  const teams = Object.values(room.teams || {});

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim()) {
      setJoinError('Por favor, informe seu nome ou apelido para ingressar.');
      return;
    }

    if (isCreatingTeam && !newTeamName.trim()) {
      setJoinError('Informe o nome da nova equipe que deseja criar.');
      return;
    }

    setJoining(true);
    setJoinError('');
    SoundSystem.playClick();

    try {
      if (isCreatingTeam) {
        await onJoinTeam({
          playerName: playerName.trim(),
          newTeamName: newTeamName.trim(),
          teamColor: selectedColor,
          teamAvatar: 'tractor'
        });
      } else {
        await onJoinTeam({
          playerName: playerName.trim(),
          teamId: selectedTeamId
        });
      }
      SoundSystem.playSuccess();
    } catch (err: any) {
      setJoinError(err.message || 'Erro ao entrar na equipe.');
      SoundSystem.playError();
    } finally {
      setJoining(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 sm:py-12">
      {/* Hero Central Impactante */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-950/90 border border-emerald-600/60 text-emerald-300 text-xs font-semibold mb-4 shadow-lg"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Planejamento Estratégico SENAR-AR/RO 2027–2030</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight"
        >
          DESAFIO SENAR 2030
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-base sm:text-xl text-emerald-300 font-medium mt-2 max-w-2xl mx-auto"
        >
          Conhecimento que transforma, campo que prospera.
        </motion.p>

        {/* 4 Botões Rápidos de Acesso */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
          <button
            onClick={onOpenHowToPlay}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-700/60 text-emerald-200 text-xs font-bold transition-all shadow"
          >
            <HelpCircle className="w-4 h-4 text-emerald-400" />
            <span>Como Jogar</span>
          </button>

          <button
            onClick={onOpenRanking}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold transition-all shadow"
          >
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>Ranking ao Vivo</span>
          </button>

          <button
            onClick={onOpenAdmin}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-700/60 text-emerald-200 text-xs font-bold transition-all shadow"
          >
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>Painel Administrativo</span>
          </button>
        </div>
      </div>

      {/* Grid de Formação de Equipes / Entrada */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Coluna Esquerda: Formulário de Ingresso (5 de 12) */}
        <div className="lg:col-span-5 bg-[#092218] p-6 rounded-2xl border-2 border-emerald-700/70 shadow-2xl">
          <div className="flex items-center justify-between pb-4 border-b border-emerald-800">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-400" />
              {myTeam ? 'Você já está conectado' : 'Ingressar na Competição'}
            </h2>
            <span className="text-xs text-emerald-400 font-mono">Sala {room.code}</span>
          </div>

          {myTeam ? (
            <div className="mt-5 space-y-4">
              <div className="p-4 rounded-xl bg-black/40 border border-emerald-700/60">
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: myTeam.color }}
                  />
                  <div>
                    <h3 className="font-extrabold text-white text-base">{myTeam.name}</h3>
                    <p className="text-xs text-emerald-300/80">
                      Capitão: <strong>{myTeam.captainName}</strong>
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-emerald-900 text-xs text-emerald-200 space-y-1.5">
                  <span className="font-semibold block text-emerald-400">
                    Integrantes da Equipe ({myTeam.players.length}/10):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {myTeam.players.map((p) => (
                      <span
                        key={p.id}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1 ${
                          p.id === playerId
                            ? 'bg-emerald-600 text-black font-bold'
                            : 'bg-emerald-950 text-emerald-200 border border-emerald-800'
                        }`}
                      >
                        {p.name} {p.isCaptain && '👑'}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Botão de Iniciar Jogo (Se admin ou capitão) */}
              {isAdmin && (
                <button
                  onClick={onStartGame}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-black font-black uppercase tracking-wider text-sm shadow-xl flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  <Play className="w-5 h-5" />
                  <span>INICIAR DESAFIO OFICIAL</span>
                </button>
              )}

              {!isAdmin && (
                <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-800/80 text-xs text-emerald-300 text-center">
                  <div className="inline-block p-2 rounded-full bg-emerald-500/20 mb-2">
                    <Sparkles className="w-5 h-5 text-emerald-400 animate-spin" />
                  </div>
                  <p className="font-bold text-white text-sm">Aguardando Início pelo Administrador</p>
                  <p className="mt-1 text-emerald-400/80">
                    O supervisor iniciará oficialmente a 1ª rodada de perguntas para todas as equipes simultaneamente.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleJoin} className="mt-5 space-y-4">
              {/* Nome do Participante */}
              <div>
                <label className="block text-xs font-bold text-emerald-300 uppercase tracking-wider mb-1.5">
                  Seu Nome ou Apelido:
                </label>
                <input
                  type="text"
                  required
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="Ex: Carlos Oliveira"
                  className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-emerald-700/80 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
              </div>

              {/* Alternar entre entrar em equipe existente ou criar nova */}
              <div className="flex rounded-xl bg-black/40 p-1 border border-emerald-900 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setIsCreatingTeam(false)}
                  className={`flex-1 py-2 rounded-lg transition-colors ${
                    !isCreatingTeam
                      ? 'bg-emerald-600 text-black font-extrabold shadow'
                      : 'text-emerald-300/70 hover:text-white'
                  }`}
                >
                  Equipes Existentes
                </button>
                <button
                  type="button"
                  onClick={() => setIsCreatingTeam(true)}
                  className={`flex-1 py-2 rounded-lg transition-colors ${
                    isCreatingTeam
                      ? 'bg-emerald-600 text-black font-extrabold shadow'
                      : 'text-emerald-300/70 hover:text-white'
                  }`}
                >
                  + Nova Equipe
                </button>
              </div>

              {isCreatingTeam ? (
                <div className="space-y-3 pt-1">
                  <div>
                    <label className="block text-xs font-semibold text-emerald-300 mb-1">
                      Nome da Nova Equipe:
                    </label>
                    <input
                      type="text"
                      value={newTeamName}
                      onChange={(e) => setNewTeamName(e.target.value)}
                      placeholder="Ex: Equipe AgroInovação"
                      className="w-full px-4 py-2 rounded-xl bg-black/50 border border-emerald-700 text-white text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-emerald-300 mb-1.5">
                      Cor da Equipe:
                    </label>
                    <div className="flex gap-2">
                      {AVAILABLE_COLORS.map((color) => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => setSelectedColor(color)}
                          className={`w-7 h-7 rounded-full transition-transform ${
                            selectedColor === color
                              ? 'scale-125 ring-2 ring-white shadow-lg'
                              : 'opacity-70 hover:opacity-100'
                          }`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-semibold text-emerald-300 mb-1.5">
                    Selecione sua Equipe:
                  </label>
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {teams.map((t) => {
                      const isFull = t.players.length >= 10;
                      const isSelected = selectedTeamId === t.id;

                      return (
                        <div
                          key={t.id}
                          onClick={() => !isFull && setSelectedTeamId(t.id)}
                          className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                            isSelected
                              ? 'bg-emerald-950 border-emerald-400 text-white shadow'
                              : 'bg-black/30 border-emerald-900/80 text-emerald-200 hover:border-emerald-700'
                          } ${isFull ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          <div className="flex items-center gap-2.5">
                            <div
                              className="w-3.5 h-3.5 rounded-full"
                              style={{ backgroundColor: t.color }}
                            />
                            <div>
                              <span className="font-bold text-xs block">{t.name}</span>
                              <span className="text-[11px] text-emerald-400/70">
                                Capitão: {t.captainName}
                              </span>
                            </div>
                          </div>

                          <div className="text-right">
                            <span className="text-xs font-mono font-bold">
                              {t.players.length}/10
                            </span>
                            {isFull && (
                              <span className="block text-[10px] text-rose-400 font-bold">
                                LOTADA
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {joinError && (
                <p className="text-xs text-rose-400 bg-rose-950/60 p-2.5 rounded-lg border border-rose-800">
                  {joinError}
                </p>
              )}

              <button
                type="submit"
                disabled={joining}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-black font-extrabold text-sm uppercase tracking-wider shadow-lg transition-all active:scale-95 disabled:opacity-50"
              >
                {joining ? 'Entrando...' : 'Confirmar e Ingressar na Sala'}
              </button>
            </form>
          )}
        </div>

        {/* Coluna Direita: Painel das Equipes Conectadas na Sala (7 de 12) */}
        <div className="lg:col-span-7 bg-[#092218] p-6 rounded-2xl border border-emerald-800/80 shadow-2xl">
          <div className="flex items-center justify-between pb-4 border-b border-emerald-800">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-emerald-400" />
                Equipes Inscritas no Desafio
              </h2>
              <p className="text-xs text-emerald-300/80 mt-0.5">
                {teams.length} equipes participantes conectadas
              </p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-md bg-emerald-950 border border-emerald-700 text-emerald-300 font-mono">
              Aproveitamento Mínimo: 80%
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
            {teams.map((t) => (
              <div
                key={t.id}
                className="p-4 rounded-xl bg-black/40 border border-emerald-900/90 shadow hover:border-emerald-700 transition-all space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3.5 h-3.5 rounded-full"
                      style={{ backgroundColor: t.color }}
                    />
                    <h3 className="font-bold text-white text-sm">{t.name}</h3>
                  </div>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300">
                    {t.players.length}/10 vagas
                  </span>
                </div>

                <div className="text-xs text-emerald-300/90 flex items-center gap-1.5">
                  <Crown className="w-3.5 h-3.5 text-amber-400" />
                  <span>
                    Capitão: <strong>{t.captainName}</strong>
                  </span>
                </div>

                <div className="pt-2 border-t border-emerald-900/60">
                  <span className="text-[10px] text-emerald-400/80 font-semibold block mb-1">
                    Integrantes da equipe:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {t.players.map((p) => (
                      <span
                        key={p.id}
                        className="px-2 py-0.5 rounded bg-emerald-950/70 text-[10px] text-emerald-200 border border-emerald-800/60"
                      >
                        {p.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Dica da Estratégia */}
          <div className="mt-6 p-4 rounded-xl bg-emerald-950/40 border border-emerald-700/40 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <p className="text-xs text-emerald-200/90 leading-relaxed">
              <strong>Como funciona a disputa:</strong> São 5 rodadas progressivas abordando a identidade institucional, o Mapa Estratégico BSC, a Cadeia de Valor, a Governança e o Regulamento de Licitações (RLC). Cada rodada aprovada (mínimo de 80%) libera 5 peças para o quebra-cabeça digital. Vence a equipe que montar o mapa completo no menor tempo!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
