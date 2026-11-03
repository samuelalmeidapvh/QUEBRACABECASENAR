import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { LobbyView } from './components/LobbyView';
import { QuizView } from './components/QuizView';
import { RoundFeedbackModal } from './components/RoundFeedbackModal';
import { PuzzleBoard } from './components/PuzzleBoard';
import { RankingView } from './components/RankingView';
import { AdminPanel } from './components/AdminPanel';
import { HowToPlayModal } from './components/HowToPlayModal';
import { VictoryModal } from './components/VictoryModal';
import { DisplayView } from './components/DisplayView';
import { RoomState, Team } from './types/game';
import { api } from './services/api';

export default function App() {
  const [isDisplayMode, setIsDisplayMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const hasParam = params.get('mode') === 'display' || params.get('display') === 'true';
      const hasPath = window.location.pathname.startsWith('/display');
      return hasParam || hasPath;
    }
    return false;
  });

  // Código da sala (permite URL query ?room=CODIGO ou path /display/CODIGO)
  const [roomCode, setRoomCode] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const match = window.location.pathname.match(/\/display\/([A-Za-z0-9_-]+)/);
      if (match && match[1]) return match[1].toUpperCase();

      const params = new URLSearchParams(window.location.search);
      const queryRoom = params.get('room');
      if (queryRoom) return queryRoom.toUpperCase();
      const saved = localStorage.getItem('senar_room_code');
      if (saved) return saved.toUpperCase();
    }
    return 'SENAR2030';
  });

  const [playerId, setPlayerId] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('senar_player_id');
      if (saved) return saved;
      const created = `p-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      localStorage.setItem('senar_player_id', created);
      return created;
    }
    return 'p-1';
  });

  const [teamId, setTeamId] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('senar_team_id');
    }
    return null;
  });

  const [room, setRoom] = useState<RoomState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modais
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [showRanking, setShowRanking] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);

  // Sincronização em tempo real (SSE + Fallback Polling)
  useEffect(() => {
    setLoading(true);
    const unsubscribe = api.subscribe(roomCode, (state) => {
      setRoom(state);
      setLoading(false);
      setError(null);
    });

    return () => {
      unsubscribe();
    };
  }, [roomCode]);

  // Identificar a equipe do jogador atual
  const myTeam: Team | null = React.useMemo(() => {
    if (!room || !room.teams) return null;
    // 1. Pelo teamId registrado
    if (teamId && room.teams[teamId]) {
      return room.teams[teamId];
    }
    // 2. Ou buscando o jogador nos arrays de cada equipe
    for (const t of Object.values(room.teams)) {
      if (t.players.some((p) => p.id === playerId)) {
        return t;
      }
    }
    return null;
  }, [room, teamId, playerId]);

  // Determinar se o jogador atual é o capitão da sua equipe
  const isCaptain = Boolean(
    myTeam && (myTeam.captainId === playerId || myTeam.players.length <= 1)
  );

  // Encontrar equipe campeã quando houver
  const championTeam: Team | null = React.useMemo(() => {
    if (!room) return null;
    const teams = Object.values(room.teams || {});
    // Primeiro que concluiu as 25 peças do quebra-cabeça
    const winner = teams.find((t) => t.puzzleCompleted);
    if (winner) return winner;
    if (room.status === 'GAME_OVER' && teams.length > 0) {
      // Ordenado por acertos e tempo
      const sorted = [...teams].sort((a, b) => {
        if (b.placedPieces.length !== a.placedPieces.length) {
          return b.placedPieces.length - a.placedPieces.length;
        }
        return b.totalCorrect - a.totalCorrect;
      });
      return sorted[0];
    }
    return null;
  }, [room]);

  // Ação de entrar ou criar equipe
  const handleJoinTeam = async (params: {
    playerName: string;
    teamId?: string;
    newTeamName?: string;
    teamColor?: string;
    teamAvatar?: string;
  }) => {
    const res = await api.joinRoom(roomCode, {
      ...params,
      playerId
    });

    if (res.teamId) {
      setTeamId(res.teamId);
      localStorage.setItem('senar_team_id', res.teamId);
    }
    if (res.playerId) {
      setPlayerId(res.playerId);
      localStorage.setItem('senar_player_id', res.playerId);
    }
  };

  const handleStartGame = async () => {
    if (!room) return;
    await api.adminAction(room.code, {
      action: 'START_MATCH',
      adminPassword: room.settings.adminPassword
    });
  };

  if (loading && !room) {
    return (
      <div className="min-h-screen bg-[#071912] flex flex-col items-center justify-center text-white">
        <div className="w-12 h-12 rounded-xl bg-emerald-600 flex items-center justify-center font-black text-xl mb-4 animate-pulse">
          SENAR
        </div>
        <h2 className="text-xl font-bold tracking-tight">DESAFIO SENAR 2030</h2>
        <p className="text-xs text-emerald-300/80 mt-1">
          {isDisplayMode ? 'Iniciando Modo Telão Full HD...' : 'Conectando aos servidores de Rondônia...'}
        </p>
      </div>
    );
  }

  if (error || !room) {
    return (
      <div className="min-h-screen bg-[#071912] flex flex-col items-center justify-center text-white p-4">
        <div className="max-w-md p-6 rounded-2xl bg-rose-950/60 border border-rose-800 text-center">
          <h2 className="text-lg font-bold text-rose-300">Erro de Conexão</h2>
          <p className="text-xs text-rose-200 mt-2">{error || 'Não foi possível carregar a sala.'}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 rounded-lg bg-emerald-600 text-black font-bold text-xs"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  // Renderização Dedicada do Modo Telão (1080p 16:9)
  if (isDisplayMode) {
    return (
      <DisplayView
        room={room}
        onExitDisplay={() => {
          setIsDisplayMode(false);
          if (typeof window !== 'undefined') {
            const url = new URL(window.location.href);
            url.searchParams.delete('mode');
            url.searchParams.delete('display');
            const newPath = url.pathname.startsWith('/display') ? '/' : url.pathname;
            window.history.pushState({}, '', newPath + (url.search ? url.search : ''));
          }
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#061710] via-[#092218] to-[#04100b] text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-black">
      {/* Header Institucional Superior */}
      <Header
        room={room}
        myTeam={myTeam}
        onOpenHowToPlay={() => setShowHowToPlay(true)}
        onOpenRanking={() => setShowRanking(true)}
        onOpenAdmin={() => setShowAdmin(true)}
        onOpenDisplay={() => setIsDisplayMode(true)}
      />

      {/* Main Viewport baseado no estado da máquina de estados do jogo */}
      <main className="flex-1 flex flex-col">
        {room.status === 'LOBBY' && (
          <LobbyView
            room={room}
            myTeam={myTeam}
            playerId={playerId}
            isCaptain={isCaptain}
            onJoinTeam={handleJoinTeam}
            onStartGame={handleStartGame}
            onOpenHowToPlay={() => setShowHowToPlay(true)}
            onOpenRanking={() => setShowRanking(true)}
            onOpenAdmin={() => setShowAdmin(true)}
            isAdmin={true}
          />
        )}

        {room.status === 'PLAYING_ROUND' && (
          myTeam ? (
            <QuizView
              room={room}
              myTeam={myTeam}
              playerId={playerId}
              isCaptain={isCaptain}
              isAdmin={true}
            />
          ) : (
            <div className="max-w-md mx-auto my-auto p-6 text-center text-white">
              <p className="text-sm">A rodada já está em andamento. Entre em uma equipe para participar:</p>
              <button
                onClick={() => handleJoinTeam({ playerName: 'Participante', teamId: 'team-alfa' })}
                className="mt-3 px-4 py-2 bg-emerald-600 text-black font-bold text-xs rounded-xl"
              >
                Ingressar na Equipe AgroForte
              </button>
            </div>
          )
        )}

        {room.status === 'ROUND_FEEDBACK' && (
          myTeam ? (
            <RoundFeedbackModal
              room={room}
              myTeam={myTeam}
              isAdmin={true}
            />
          ) : (
            <div className="max-w-md mx-auto my-auto p-6 text-center text-white">
              <p className="text-sm">Aguardando início da montagem de peças...</p>
            </div>
          )
        )}

        {room.status === 'PUZZLE_STAGE' && (
          myTeam ? (
            <PuzzleBoard
              room={room}
              myTeam={myTeam}
              isAdmin={true}
            />
          ) : (
            <div className="max-w-md mx-auto my-auto p-6 text-center text-white">
              <p className="text-sm">Selecione uma equipe para acessar o quebra-cabeça.</p>
            </div>
          )
        )}

        {room.status === 'GAME_OVER' && (
          <div className="py-8">
            <RankingView room={room} />
          </div>
        )}
      </main>

      {/* Rodapé Institucional */}
      <footer className="py-4 border-t border-emerald-950 bg-[#040e0a] text-center text-[11px] text-emerald-400/60">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            SENAR Rondônia · FAPERON · Sindicatos dos Produtores Rurais de Rondônia
          </span>
          <span className="text-emerald-500/80">
            Planejamento Estratégico 2027–2030 · Conhecimento que transforma, campo que prospera
          </span>
        </div>
      </footer>

      {/* Modais Globais */}
      {showHowToPlay && (
        <HowToPlayModal onClose={() => setShowHowToPlay(false)} />
      )}

      {showRanking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-5xl my-auto">
            <RankingView room={room} onClose={() => setShowRanking(false)} />
          </div>
        </div>
      )}

      {showAdmin && (
        <AdminPanel room={room} onClose={() => setShowAdmin(false)} />
      )}

      {/* Modal de Vitória quando uma equipe conclui o mapa */}
      {championTeam && championTeam.puzzleCompleted && (
        <VictoryModal
          room={room}
          championTeam={championTeam}
          onOpenRanking={() => {
            setShowRanking(true);
          }}
          onClose={() => {
            // fecha modal sem resetar vitória
          }}
        />
      )}
    </div>
  );
}
