/**
 * Tipos e Modelos de Dados — DESAFIO SENAR 2030
 * Conhecimento que transforma, campo que prospera.
 */

export type GameStatus =
  | 'LOBBY'
  | 'PLAYING_ROUND'
  | 'ROUND_FEEDBACK'
  | 'PUZZLE_STAGE'
  | 'GAME_OVER';

export interface Question {
  id: string;
  round: number;
  topic: string;
  prompt: string;
  options: [string, string, string, string];
  correctIndex: number; // Sanitized on client until round ends
  explanation: string;
  sourceDocument: string;
  referenceSection: string;
  difficulty: 'Fácil' | 'Médio' | 'Difícil';
  approved: boolean;
}

export type ClientQuestion = Omit<Question, 'correctIndex'>;

export interface Player {
  id: string;
  name: string;
  avatar: string;
  isCaptain: boolean;
  isOnline: boolean;
  joinedAt: number;
  voteIndex?: number; // Temporary vote in current question
}

export interface RoundScore {
  round: number;
  correctCount: number;
  totalCount: number;
  percentage: number;
  passed: boolean;
  unlockedLot: number;
  submittedAt: number;
  answers: Array<{
    questionId: string;
    selectedIndex: number;
    correctIndex: number;
    isCorrect: boolean;
    explanation: string;
    sourceDocument: string;
    referenceSection: string;
  }>;
}

export interface Team {
  id: string;
  name: string;
  color: string;
  avatar: string;
  captainId: string;
  captainName: string;
  players: Player[];
  // Current active round answers
  currentRoundAnswers: Record<string, number>; // questionId -> selectedIndex
  roundScores: Record<number, RoundScore>; // roundNumber -> score
  unlockedLots: number[]; // e.g. [1, 2, 3]
  // Puzzle piece placement: maps pieceIndex (0..24) to target slot index
  placedPieces: number[]; // array of piece indexes correctly placed (0..24)
  puzzleCompleted: boolean;
  puzzleCompletedAt: number | null;
  totalCorrect: number;
  totalAttempts: number;
  totalElapsedSeconds: number;
}

export interface RoomSettings {
  questionsPerRound: number; // default 10 (or 5 for short match)
  questionTimerSeconds: number; // default 45s
  allowRecovery: boolean; // allow retry if failed round
  showReferenceMap: boolean; // reference map popup available
  adminPassword: string;
}

export interface RoomState {
  code: string;
  status: GameStatus;
  currentRound: number; // 1..5
  currentQuestionIndex: number; // 0..questionsPerRound-1
  questionStartedAt: number; // timestamp
  roundStartedAt: number;
  matchStartedAt: number | null;
  matchEndedAt: number | null;
  isPaused: boolean;
  pausedAt: number | null;
  settings: RoomSettings;
  teams: Record<string, Team>;
  activeQuestionIds: string[]; // question IDs for current round
  serverTime: number;
  presenter?: PresenterState;
}

export type DisplayViewMode =
  | 'AUTO'
  | 'OVERVIEW'
  | 'OPENING'
  | 'RANKING'
  | 'ROUNDS'
  | 'PUZZLE'
  | 'HIGHLIGHTS'
  | 'ROUND_RESULT'
  | 'FINALE';

export interface PresenterState {
  viewMode: DisplayViewMode;
  autoIntervalSeconds: number; // default 15
  isAutoPlaying: boolean;
  highlightTeamId?: string;
  countdownValue?: number | null;
  countdownStartedAt?: number | null;
}

export interface LeaderboardEntry {
  rank: number;
  teamId: string;
  teamName: string;
  color: string;
  avatar: string;
  playersCount: number;
  currentRound: number;
  totalCorrect: number;
  lotsUnlockedCount: number;
  piecesPlacedCount: number;
  puzzleCompleted: boolean;
  totalElapsedSeconds: number;
  statusText: string;
}
