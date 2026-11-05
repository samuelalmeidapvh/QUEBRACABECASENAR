/**
 * Backend Node.js / Express — DESAFIO SENAR 2030
 * Servidor Autorizado, Sincronização em Tempo Real (SSE + REST) e Validação de Regras
 */

import express, { Request, Response } from 'express';
import http from 'http';
import path from 'path';
import fs from 'fs';
import { INITIAL_QUESTIONS, LOT_PIECES_MAP, ROUND_NAMES } from './src/data/questionsData.ts';
import { GameStatus, Question, RoomState, Team, Player, RoomSettings, LeaderboardEntry } from './src/types/game.ts';

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const isDev = process.env.NODE_ENV !== 'production';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos de /public
app.use(express.static(path.resolve(process.cwd(), 'public')));

// Diretório de persistência de dados
const DATA_DIR = path.resolve(process.cwd(), 'data');
const DATA_FILE = path.resolve(DATA_DIR, 'game_store.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// In-Memory state with disk persistence
interface StorageSchema {
  rooms: Record<string, RoomState>;
  questions: Question[];
}

let storage: StorageSchema = {
  rooms: {},
  questions: [...INITIAL_QUESTIONS]
};

// Carregar dados salvos se existirem
function loadPersistedData() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (parsed.rooms) storage.rooms = parsed.rooms;
      if (parsed.questions && Array.isArray(parsed.questions)) storage.questions = parsed.questions;
    }
  } catch (err) {
    console.error('Erro ao ler game_store.json, mantendo padrões:', err);
  }
}

function savePersistedData() {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(storage, null, 2), 'utf-8');
  } catch (err) {
    console.error('Erro ao persistir game_store.json:', err);
  }
}

loadPersistedData();

// Gerenciamento de conexões SSE por sala
const sseClients: Record<string, Response[]> = {};

function broadcastRoom(code: string) {
  const room = storage.rooms[code];
  if (!room) return;

  savePersistedData();

  const sanitized = sanitizeRoomForClient(room);
  const clients = sseClients[code] || [];
  const payload = `data: ${JSON.stringify(sanitized)}\n\n`;

  for (let i = clients.length - 1; i >= 0; i--) {
    try {
      clients[i].write(payload);
    } catch {
      clients.splice(i, 1);
    }
  }
}

// Higieniza perguntas para que o cliente não veja o gabarito antes da conclusão da rodada
function sanitizeRoomForClient(room: RoomState): any {
  if (!room.presenter) {
    room.presenter = {
      viewMode: 'AUTO',
      autoIntervalSeconds: 15,
      isAutoPlaying: true,
      highlightTeamId: undefined,
      countdownValue: null,
      countdownStartedAt: null
    };
  }

  const isPlaying = room.status === 'PLAYING_ROUND';
  const activeQuestions = storage.questions
    .filter((q) => room.activeQuestionIds.includes(q.id))
    .map((q) => {
      if (isPlaying) {
        // Omite correctIndex e justificativa durante a rodada
        const { correctIndex, explanation, ...rest } = q;
        return rest;
      }
      return q;
    });

  return {
    ...room,
    serverTime: Date.now(),
    activeQuestions
  };
}

// Criação da sala padrão SENAR2030 se não existir
function getOrCreateDefaultRoom(code: string = 'SENAR2030'): RoomState {
  if (!storage.rooms[code]) {
    const defaultSettings: RoomSettings = {
      questionsPerRound: 10,
      questionTimerSeconds: 45,
      allowRecovery: true,
      showReferenceMap: true,
      adminPassword: 'senar2030'
    };

    const initialRoundQuestions = storage.questions
      .filter((q) => q.round === 1)
      .slice(0, defaultSettings.questionsPerRound)
      .map((q) => q.id);

    storage.rooms[code] = {
      code,
      status: 'LOBBY',
      currentRound: 1,
      currentQuestionIndex: 0,
      questionStartedAt: 0,
      roundStartedAt: 0,
      matchStartedAt: null,
      matchEndedAt: null,
      isPaused: false,
      pausedAt: null,
      settings: defaultSettings,
      teams: {
        'team-alfa': {
          id: 'team-alfa',
          name: 'Equipe AgroForte',
          color: '#10b981', // Verde Esmeralda
          avatar: 'tractor',
          captainId: 'p-1',
          captainName: 'Produtor Carlos',
          players: [
            {
              id: 'p-1',
              name: 'Produtor Carlos',
              avatar: 'tractor',
              isCaptain: true,
              isOnline: true,
              joinedAt: Date.now() - 60000
            }
          ],
          currentRoundAnswers: {},
          roundScores: {},
          unlockedLots: [],
          placedPieces: [],
          puzzleCompleted: false,
          puzzleCompletedAt: null,
          totalCorrect: 0,
          totalAttempts: 0,
          totalElapsedSeconds: 0
        },
        'team-beta': {
          id: 'team-beta',
          name: 'Equipe Campo Vivo',
          color: '#f59e0b', // Dourado
          avatar: 'leaf',
          captainId: 'p-2',
          captainName: 'Engenheira Ana',
          players: [
            {
              id: 'p-2',
              name: 'Engenheira Ana',
              avatar: 'leaf',
              isCaptain: true,
              isOnline: true,
              joinedAt: Date.now() - 40000
            }
          ],
          currentRoundAnswers: {},
          roundScores: {},
          unlockedLots: [],
          placedPieces: [],
          puzzleCompleted: false,
          puzzleCompletedAt: null,
          totalCorrect: 0,
          totalAttempts: 0,
          totalElapsedSeconds: 0
        },
        'team-gama': {
          id: 'team-gama',
          name: 'Equipe Rondônia Rural',
          color: '#3b82f6', // Azul Tecnológico
          avatar: 'sun',
          captainId: 'p-3',
          captainName: 'Técnico Marcos',
          players: [
            {
              id: 'p-3',
              name: 'Técnico Marcos',
              avatar: 'sun',
              isCaptain: true,
              isOnline: true,
              joinedAt: Date.now() - 20000
            }
          ],
          currentRoundAnswers: {},
          roundScores: {},
          unlockedLots: [],
          placedPieces: [],
          puzzleCompleted: false,
          puzzleCompletedAt: null,
          totalCorrect: 0,
          totalAttempts: 0,
          totalElapsedSeconds: 0
        }
      },
      activeQuestionIds: initialRoundQuestions,
      serverTime: Date.now()
    };
    savePersistedData();
  }
  return storage.rooms[code];
}

getOrCreateDefaultRoom('SENAR2030');

// ==========================================
// ROTAS DE API
// ==========================================

// 1. Obter estado da sala
app.get('/api/rooms/:code/state', (req: Request, res: Response) => {
  const code = (req.params.code || '').toUpperCase();
  const room = storage.rooms[code] || getOrCreateDefaultRoom(code);
  res.json(sanitizeRoomForClient(room));
});

// 2. Stream SSE em Tempo Real
app.get('/api/rooms/:code/stream', (req: Request, res: Response) => {
  const code = (req.params.code || '').toUpperCase();
  const room = storage.rooms[code] || getOrCreateDefaultRoom(code);

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders?.();

  if (!sseClients[code]) sseClients[code] = [];
  sseClients[code].push(res);

  // Enviar estado inicial imediatamente
  res.write(`data: ${JSON.stringify(sanitizeRoomForClient(room))}\n\n`);

  req.on('close', () => {
    if (sseClients[code]) {
      sseClients[code] = sseClients[code].filter((c) => c !== res);
    }
  });
});

// 3. Entrar na sala / Criar ou selecionar equipe
app.post('/api/rooms/:code/join', (req: Request, res: Response) => {
  const code = (req.params.code || '').toUpperCase();
  const { playerName, teamId, newTeamName, teamColor, teamAvatar, playerId: reqPlayerId } = req.body;

  const room = storage.rooms[code] || getOrCreateDefaultRoom(code);
  const playerId = reqPlayerId || `p-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  let targetTeamId = teamId;

  // Criar nova equipe se solicitado
  if (!targetTeamId && newTeamName) {
    targetTeamId = `team-${Date.now().toString(36)}`;
    room.teams[targetTeamId] = {
      id: targetTeamId,
      name: newTeamName.trim(),
      color: teamColor || '#10b981',
      avatar: teamAvatar || 'tractor',
      captainId: playerId,
      captainName: playerName.trim(),
      players: [],
      currentRoundAnswers: {},
      roundScores: {},
      unlockedLots: [],
      placedPieces: [],
      puzzleCompleted: false,
      puzzleCompletedAt: null,
      totalCorrect: 0,
      totalAttempts: 0,
      totalElapsedSeconds: 0
    };
  }

  const team = room.teams[targetTeamId];
  if (!team) {
    res.status(404).json({ error: 'Equipe não encontrada.' });
    return;
  }

  // Verificar limite de 10 participantes
  const existingPlayerIndex = team.players.findIndex((p) => p.id === playerId);
  if (existingPlayerIndex === -1 && team.players.length >= 10) {
    res.status(400).json({ error: 'Equipe já atingiu o limite máximo de 10 participantes.' });
    return;
  }

  // Se não houver capitão, definir este jogador
  const isCaptain = team.players.length === 0 || team.captainId === playerId;
  if (isCaptain) {
    team.captainId = playerId;
    team.captainName = playerName.trim();
  }

  if (existingPlayerIndex >= 0) {
    team.players[existingPlayerIndex].name = playerName.trim();
    team.players[existingPlayerIndex].isOnline = true;
  } else {
    team.players.push({
      id: playerId,
      name: playerName.trim(),
      avatar: team.avatar,
      isCaptain,
      isOnline: true,
      joinedAt: Date.now()
    });
  }

  broadcastRoom(code);
  res.json({
    success: true,
    playerId,
    teamId: targetTeamId,
    isCaptain,
    room: sanitizeRoomForClient(room)
  });
});

// 4. Registrar voto de membro da equipe
app.post('/api/rooms/:code/vote', (req: Request, res: Response) => {
  const code = (req.params.code || '').toUpperCase();
  const { teamId, playerId, questionId, optionIndex } = req.body;

  const room = storage.rooms[code];
  if (!room || !room.teams[teamId]) {
    res.status(404).json({ error: 'Sala ou equipe não encontrada.' });
    return;
  }

  const team = room.teams[teamId];
  const player = team.players.find((p) => p.id === playerId);
  if (player) {
    player.voteIndex = optionIndex;
    broadcastRoom(code);
  }

  res.json({ success: true });
});

// 5. Confirmar resposta oficial (Capitão da equipe ou jogador solo)
app.post('/api/rooms/:code/answer', (req: Request, res: Response) => {
  const code = (req.params.code || '').toUpperCase();
  const { teamId, playerId, questionId, selectedIndex } = req.body;

  const room = storage.rooms[code];
  if (!room || !room.teams[teamId]) {
    res.status(404).json({ error: 'Sala ou equipe não encontrada.' });
    return;
  }

  if (room.status !== 'PLAYING_ROUND') {
    res.status(400).json({ error: 'A rodada não está ativa no momento.' });
    return;
  }

  const team = room.teams[teamId];
  // Validação: capitão ou único membro
  const isCaptain = team.captainId === playerId || team.players.length <= 1;
  if (!isCaptain) {
    res.status(403).json({ error: 'Apenas o Capitão pode confirmar a resposta oficial da equipe!' });
    return;
  }

  // Registrar resposta
  team.currentRoundAnswers[questionId] = selectedIndex;

  // Limpar votos temporários
  team.players.forEach((p) => (p.voteIndex = undefined));

  broadcastRoom(code);
  res.json({ success: true, teamAnswers: team.currentRoundAnswers });
});

// 6. Encaixar peça do quebra-cabeça
app.post('/api/rooms/:code/puzzle/place', (req: Request, res: Response) => {
  const code = (req.params.code || '').toUpperCase();
  const { teamId, pieceIndex, targetSlotIndex } = req.body;

  const room = storage.rooms[code];
  if (!room || !room.teams[teamId]) {
    res.status(404).json({ error: 'Sala ou equipe não encontrada.' });
    return;
  }

  const team = room.teams[teamId];

  // Verificar se a peça pertence a um lote já desbloqueado
  let isPieceUnlocked = false;
  for (const lotNum of team.unlockedLots) {
    const piecesInLot = LOT_PIECES_MAP[lotNum] || [];
    if (piecesInLot.includes(pieceIndex)) {
      isPieceUnlocked = true;
      break;
    }
  }

  if (!isPieceUnlocked) {
    res.status(400).json({
      success: false,
      error: 'Esta peça pertence a um lote ainda não conquistado pela sua equipe!'
    });
    return;
  }

  // Validação matemática: a peça só encaixa no seu slot de origem (0..24)
  if (pieceIndex !== targetSlotIndex) {
    res.json({
      success: false,
      correct: false,
      message: 'Posição incorreta! A peça retornou ao seu inventário.'
    });
    return;
  }

  // Se correta, adiciona às peças posicionadas se ainda não estiver
  if (!team.placedPieces.includes(pieceIndex)) {
    team.placedPieces.push(pieceIndex);
  }

  // Verificar se o mapa de 25 peças foi totalmente concluído
  if (team.placedPieces.length === 25 && !team.puzzleCompleted) {
    team.puzzleCompleted = true;
    team.puzzleCompletedAt = Date.now();
    const elapsed = room.matchStartedAt ? Math.round((Date.now() - room.matchStartedAt) / 1000) : 0;
    team.totalElapsedSeconds = elapsed;
  }

  broadcastRoom(code);

  res.json({
    success: true,
    correct: true,
    placedPiecesCount: team.placedPieces.length,
    puzzleCompleted: team.puzzleCompleted,
    message: team.puzzleCompleted
      ? 'PARABÉNS! MAPA ESTRATÉGICO SENAR 2027–2030 CONCLUÍDO COM SUCESSO!'
      : 'Peça encaixada com sucesso no Mapa Estratégico!'
  });
});

// 7. Ações Administrativas de Controle da Partida
app.post('/api/rooms/:code/action', (req: Request, res: Response) => {
  const code = (req.params.code || '').toUpperCase();
  const {
    action,
    adminPassword,
    newSettings,
    targetTeamId,
    newTeamId,
    newCaptainId,
    targetPlayerId,
    teamData,
    playerData,
    playerName
  } = req.body;

  const room = storage.rooms[code] || getOrCreateDefaultRoom(code);

  // Verificar senha de administrador
  if (adminPassword !== room.settings.adminPassword && adminPassword !== 'senar2030') {
    res.status(401).json({ error: 'Senha de administrador inválida.' });
    return;
  }

  const now = Date.now();

  switch (action) {
    case 'START_MATCH': {
      room.status = 'PLAYING_ROUND';
      room.currentRound = 1;
      room.currentQuestionIndex = 0;
      room.matchStartedAt = now;
      room.roundStartedAt = now;
      room.questionStartedAt = now;
      room.isPaused = false;

      // Selecionar perguntas da Rodada 1
      const roundQuestions = storage.questions
        .filter((q) => q.round === 1)
        .slice(0, room.settings.questionsPerRound);
      room.activeQuestionIds = roundQuestions.map((q) => q.id);

      // Zerar respostas ativas
      Object.values(room.teams).forEach((t) => {
        t.currentRoundAnswers = {};
      });
      break;
    }

    case 'NEXT_QUESTION': {
      if (room.currentQuestionIndex < room.activeQuestionIds.length - 1) {
        room.currentQuestionIndex += 1;
        room.questionStartedAt = now;
      } else {
        // Se já era a última pergunta, encerra a rodada
        finishCurrentRound(room);
      }
      break;
    }

    case 'PREV_QUESTION': {
      if (room.currentQuestionIndex > 0) {
        room.currentQuestionIndex -= 1;
        room.questionStartedAt = now;
      }
      break;
    }

    case 'FINISH_ROUND': {
      finishCurrentRound(room);
      break;
    }

    case 'GO_TO_PUZZLE': {
      room.status = 'PUZZLE_STAGE';
      break;
    }

    case 'NEXT_ROUND': {
      if (room.currentRound < 5) {
        room.currentRound += 1;
        room.status = 'PLAYING_ROUND';
        room.currentQuestionIndex = 0;
        room.roundStartedAt = now;
        room.questionStartedAt = now;

        const roundQuestions = storage.questions
          .filter((q) => q.round === room.currentRound)
          .slice(0, room.settings.questionsPerRound);
        room.activeQuestionIds = roundQuestions.map((q) => q.id);

        Object.values(room.teams).forEach((t) => {
          t.currentRoundAnswers = {};
        });
      } else {
        room.status = 'GAME_OVER';
        room.matchEndedAt = now;
      }
      break;
    }

    case 'RECOVERY_ROUND': {
      // Repete a rodada atual para equipes que não atingiram 80%
      room.status = 'PLAYING_ROUND';
      room.currentQuestionIndex = 0;
      room.questionStartedAt = now;
      break;
    }

    case 'PAUSE_RESUME': {
      room.isPaused = !room.isPaused;
      room.pausedAt = room.isPaused ? now : null;
      break;
    }

    case 'RESET_ROOM': {
      room.status = 'LOBBY';
      room.currentRound = 1;
      room.currentQuestionIndex = 0;
      room.matchStartedAt = null;
      room.matchEndedAt = null;
      room.isPaused = false;
      Object.values(room.teams).forEach((t) => {
        t.currentRoundAnswers = {};
        t.roundScores = {};
        t.unlockedLots = [];
        t.placedPieces = [];
        t.puzzleCompleted = false;
        t.puzzleCompletedAt = null;
        t.totalCorrect = 0;
        t.totalAttempts = 0;
        t.totalElapsedSeconds = 0;
      });
      break;
    }

    case 'UPDATE_SETTINGS': {
      if (newSettings) {
        room.settings = { ...room.settings, ...newSettings };
        // Atualizar perguntas ativas da rodada conforme nova contagem
        const roundQuestions = storage.questions
          .filter((q) => q.round === room.currentRound)
          .slice(0, room.settings.questionsPerRound);
        room.activeQuestionIds = roundQuestions.map((q) => q.id);
      }
      break;
    }

    case 'ASSIGN_CAPTAIN': {
      if (targetTeamId && newCaptainId && room.teams[targetTeamId]) {
        const team = room.teams[targetTeamId];
        const newCap = team.players.find((p) => p.id === newCaptainId);
        if (newCap) {
          team.captainId = newCap.id;
          team.captainName = newCap.name;
          team.players.forEach((p) => (p.isCaptain = p.id === newCap.id));
        }
      }
      break;
    }

    case 'CREATE_TEAM': {
      if (teamData && teamData.name) {
        const newId = `team-${Date.now().toString(36)}`;
        room.teams[newId] = {
          id: newId,
          name: teamData.name.trim(),
          color: teamData.color || '#10b981',
          avatar: teamData.avatar || 'tractor',
          captainId: '',
          captainName: 'Aguardando Capitão',
          players: [],
          currentRoundAnswers: {},
          roundScores: {},
          unlockedLots: [],
          placedPieces: [],
          puzzleCompleted: false,
          puzzleCompletedAt: null,
          totalCorrect: 0,
          totalAttempts: 0,
          totalElapsedSeconds: 0
        };
      }
      break;
    }

    case 'EDIT_TEAM': {
      if (targetTeamId && room.teams[targetTeamId] && teamData) {
        const team = room.teams[targetTeamId];
        if (teamData.name && teamData.name.trim()) team.name = teamData.name.trim();
        if (teamData.color) team.color = teamData.color;
        if (teamData.avatar) team.avatar = teamData.avatar;
      }
      break;
    }

    case 'DELETE_TEAM': {
      if (targetTeamId && room.teams[targetTeamId]) {
        delete room.teams[targetTeamId];
      }
      break;
    }

    case 'EDIT_PLAYER': {
      if (targetTeamId && targetPlayerId && room.teams[targetTeamId] && playerData) {
        const team = room.teams[targetTeamId];
        const player = team.players.find((p) => p.id === targetPlayerId);
        if (player && playerData.name && playerData.name.trim()) {
          player.name = playerData.name.trim();
          if (player.isCaptain || team.captainId === player.id) {
            team.captainName = player.name;
          }
        }
      }
      break;
    }

    case 'DELETE_PLAYER': {
      if (targetTeamId && targetPlayerId && room.teams[targetTeamId]) {
        const team = room.teams[targetTeamId];
        team.players = team.players.filter((p) => p.id !== targetPlayerId);
        if (team.captainId === targetPlayerId) {
          if (team.players.length > 0) {
            team.captainId = team.players[0].id;
            team.captainName = team.players[0].name;
            team.players[0].isCaptain = true;
          } else {
            team.captainId = '';
            team.captainName = 'Aguardando Capitão';
          }
        }
      }
      break;
    }

    case 'TRANSFER_PLAYER': {
      if (targetTeamId && newTeamId && targetPlayerId && room.teams[targetTeamId] && room.teams[newTeamId]) {
        const fromTeam = room.teams[targetTeamId];
        const toTeam = room.teams[newTeamId];
        const pIndex = fromTeam.players.findIndex((p) => p.id === targetPlayerId);
        if (pIndex !== -1 && toTeam.players.length < 10) {
          const [player] = fromTeam.players.splice(pIndex, 1);
          player.isCaptain = toTeam.players.length === 0;
          toTeam.players.push(player);
          if (player.isCaptain) {
            toTeam.captainId = player.id;
            toTeam.captainName = player.name;
          }
          if (fromTeam.captainId === targetPlayerId) {
            if (fromTeam.players.length > 0) {
              fromTeam.captainId = fromTeam.players[0].id;
              fromTeam.captainName = fromTeam.players[0].name;
              fromTeam.players[0].isCaptain = true;
            } else {
              fromTeam.captainId = '';
              fromTeam.captainName = 'Aguardando Capitão';
            }
          }
        }
      }
      break;
    }

    case 'ADD_PLAYER_TO_TEAM': {
      if (targetTeamId && room.teams[targetTeamId]) {
        const nameToUse = (playerName || playerData?.name || '').trim();
        if (nameToUse) {
          const team = room.teams[targetTeamId];
          if (team.players.length < 10) {
            const newPid = `p-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
            const isCap = team.players.length === 0 || !team.captainId;
            team.players.push({
              id: newPid,
              name: nameToUse,
              avatar: team.avatar,
              isCaptain: isCap,
              isOnline: true,
              joinedAt: Date.now()
            });
            if (isCap) {
              team.captainId = newPid;
              team.captainName = nameToUse;
            }
          }
        }
      }
      break;
    }

    case 'SET_PRESENTER_VIEW': {
      if (!room.presenter) {
        room.presenter = {
          viewMode: 'AUTO',
          autoIntervalSeconds: 15,
          isAutoPlaying: true,
          highlightTeamId: undefined,
          countdownValue: null,
          countdownStartedAt: null
        };
      }
      if (req.body.viewMode) {
        room.presenter.viewMode = req.body.viewMode;
        if (req.body.viewMode !== 'AUTO') {
          room.presenter.isAutoPlaying = false;
        }
      }
      break;
    }

    case 'TOGGLE_AUTO_PRESENTATION': {
      if (!room.presenter) {
        room.presenter = {
          viewMode: 'AUTO',
          autoIntervalSeconds: 15,
          isAutoPlaying: true,
          highlightTeamId: undefined,
          countdownValue: null,
          countdownStartedAt: null
        };
      }
      room.presenter.isAutoPlaying = Boolean(req.body.isAutoPlaying);
      if (req.body.autoIntervalSeconds) {
        room.presenter.autoIntervalSeconds = Number(req.body.autoIntervalSeconds);
      }
      if (room.presenter.isAutoPlaying) {
        room.presenter.viewMode = 'AUTO';
      }
      break;
    }

    case 'HIGHLIGHT_TEAM': {
      if (!room.presenter) {
        room.presenter = {
          viewMode: 'AUTO',
          autoIntervalSeconds: 15,
          isAutoPlaying: true,
          highlightTeamId: undefined,
          countdownValue: null,
          countdownStartedAt: null
        };
      }
      room.presenter.highlightTeamId = req.body.targetTeamId || undefined;
      break;
    }

    case 'TRIGGER_COUNTDOWN': {
      if (!room.presenter) {
        room.presenter = {
          viewMode: 'AUTO',
          autoIntervalSeconds: 15,
          isAutoPlaying: true,
          highlightTeamId: undefined,
          countdownValue: null,
          countdownStartedAt: null
        };
      }
      const count = req.body.countdownValue !== undefined ? req.body.countdownValue : 5;
      room.presenter.countdownValue = count;
      room.presenter.countdownStartedAt = Date.now();
      break;
    }
  }

  broadcastRoom(code);
  res.json({ success: true, room: sanitizeRoomForClient(room) });
});

// Finalizar rodada e calcular pontuações e aprovação com regra dos 80%
function finishCurrentRound(room: RoomState) {
  room.status = 'ROUND_FEEDBACK';
  const roundQuestions = storage.questions.filter((q) => room.activeQuestionIds.includes(q.id));
  const totalQuestions = roundQuestions.length;
  // Regra de aprovação: mínimo de 80% com arredondamento para cima
  const minRequiredCorrect = Math.ceil(totalQuestions * 0.8);
  const lotToUnlock = room.currentRound;

  Object.values(room.teams).forEach((team) => {
    let correctCount = 0;
    const answersReview = roundQuestions.map((q) => {
      const selected = team.currentRoundAnswers[q.id];
      const isCorrect = selected === q.correctIndex;
      if (isCorrect) correctCount++;

      return {
        questionId: q.id,
        selectedIndex: selected !== undefined ? selected : -1,
        correctIndex: q.correctIndex,
        isCorrect,
        explanation: q.explanation,
        sourceDocument: q.sourceDocument,
        referenceSection: q.referenceSection
      };
    });

    const percentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
    const passed = correctCount >= minRequiredCorrect;

    // Se aprovado, desbloqueia o lote da rodada
    if (passed && !team.unlockedLots.includes(lotToUnlock)) {
      team.unlockedLots.push(lotToUnlock);
      team.unlockedLots.sort((a, b) => a - b);
    }

    team.roundScores[room.currentRound] = {
      round: room.currentRound,
      correctCount,
      totalCount: totalQuestions,
      percentage,
      passed,
      unlockedLot: passed ? lotToUnlock : 0,
      submittedAt: Date.now(),
      answers: answersReview
    };

    team.totalCorrect = Object.values(team.roundScores).reduce((acc, s) => acc + s.correctCount, 0);
    team.totalAttempts += 1;
    if (room.matchStartedAt) {
      team.totalElapsedSeconds = Math.round((Date.now() - room.matchStartedAt) / 1000);
    }
  });
}

// 8. Obter todas as perguntas (Painel Administrativo)
app.get('/api/questions', (req: Request, res: Response) => {
  res.json({ questions: storage.questions });
});

// 9. Atualizar pergunta (Painel Administrativo)
app.post('/api/questions/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const updatedData = req.body;

  const idx = storage.questions.findIndex((q) => q.id === id);
  if (idx === -1) {
    res.status(404).json({ error: 'Pergunta não encontrada.' });
    return;
  }

  storage.questions[idx] = { ...storage.questions[idx], ...updatedData };
  savePersistedData();

  res.json({ success: true, question: storage.questions[idx] });
});

// 10. Exportação do Relatório da Partida em CSV
app.get('/api/export/:code/csv', (req: Request, res: Response) => {
  const code = (req.params.code || '').toUpperCase();
  const room = storage.rooms[code];

  if (!room) {
    res.status(404).send('Sala não encontrada.');
    return;
  }

  const teams = Object.values(room.teams);
  // Ordenar equipes por: 1. Quebra-cabeça concluído, 2. Menor tempo, 3. Mais acertos
  teams.sort((a, b) => {
    if (a.puzzleCompleted && !b.puzzleCompleted) return -1;
    if (!a.puzzleCompleted && b.puzzleCompleted) return 1;
    if (a.puzzleCompleted && b.puzzleCompleted) {
      return a.totalElapsedSeconds - b.totalElapsedSeconds;
    }
    return b.totalCorrect - a.totalCorrect;
  });

  let csv = 'Posicao;Equipe;Capitao;Integrantes;RodadaAtual;AcertosTotais;LotesDesbloqueados;PecasMontadas;QuebraCabecaConcluido;TempoTotalSegundos\n';
  teams.forEach((t, i) => {
    csv += `${i + 1};"${t.name}";"${t.captainName}";${t.players.length};${room.currentRound};${t.totalCorrect};${t.unlockedLots.length};${t.placedPieces.length};${t.puzzleCompleted ? 'SIM' : 'NÃO'};${t.totalElapsedSeconds}\n`;
  });

  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="Ranking_Desafio_SENAR_2030_${code}.csv"`);
  res.send('\uFEFF' + csv);
});

// Integração com Vite em desenvolvimento e produção
async function setupVite() {
  if (isDev) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Desafio SENAR 2030 rodando em http://localhost:${PORT}`);
  });
}

setupVite();
