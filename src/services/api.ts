/**
 * Cliente de API e Sincronização em Tempo Real (SSE + Fallback Polling)
 */

import { RoomState, Question } from '../types/game';

type StateCallback = (state: RoomState) => void;

class GameApiService {
  private eventSource: EventSource | null = null;
  private currentCode: string | null = null;
  private callbacks: StateCallback[] = [];
  private pollInterval: any = null;

  public subscribe(roomCode: string, onUpdate: StateCallback): () => void {
    const code = roomCode.toUpperCase();
    this.callbacks.push(onUpdate);

    if (this.currentCode !== code || !this.eventSource) {
      this.initConnection(code);
    }

    return () => {
      this.callbacks = this.callbacks.filter((cb) => cb !== onUpdate);
      if (this.callbacks.length === 0) {
        this.disconnect();
      }
    };
  }

  private initConnection(code: string) {
    this.disconnect();
    this.currentCode = code;

    // 1. Fetch estado inicial imediatamente
    this.fetchState(code).catch(() => {});

    // 2. Conectar SSE para atualizações instantâneas
    try {
      this.eventSource = new EventSource(`/api/rooms/${code}/stream`);

      this.eventSource.onmessage = (event) => {
        try {
          const roomState: RoomState = JSON.parse(event.data);
          this.notify(roomState);
        } catch (e) {
          console.error('Falha ao decodificar evento SSE:', e);
        }
      };

      this.eventSource.onerror = () => {
        // Se SSE falhar temporariamente, manter polling de contingência
        this.startFallbackPolling(code);
      };
    } catch {
      this.startFallbackPolling(code);
    }
  }

  private startFallbackPolling(code: string) {
    if (this.pollInterval) return;
    this.pollInterval = setInterval(async () => {
      try {
        const state = await this.fetchState(code);
        if (state) this.notify(state);
      } catch {
        // silencia erros intermitentes
      }
    }, 2500);
  }

  private disconnect() {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
      this.pollInterval = null;
    }
    this.currentCode = null;
  }

  private notify(state: RoomState) {
    this.callbacks.forEach((cb) => cb(state));
  }

  public async fetchState(code: string): Promise<RoomState> {
    const res = await fetch(`/api/rooms/${code.toUpperCase()}/state`);
    if (!res.ok) throw new Error('Não foi possível obter o estado da sala.');
    const state = await res.json();
    this.notify(state);
    return state;
  }

  public async joinRoom(
    code: string,
    payload: {
      playerName: string;
      teamId?: string;
      newTeamName?: string;
      teamColor?: string;
      teamAvatar?: string;
      playerId?: string;
    }
  ) {
    const res = await fetch(`/api/rooms/${code.toUpperCase()}/join`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Erro ao ingressar na sala.');
    return data;
  }

  public async submitVote(
    code: string,
    payload: {
      teamId: string;
      playerId: string;
      questionId: string;
      optionIndex: number;
    }
  ) {
    await fetch(`/api/rooms/${code.toUpperCase()}/vote`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  }

  public async submitAnswer(
    code: string,
    payload: {
      teamId: string;
      playerId: string;
      questionId: string;
      selectedIndex: number;
    }
  ) {
    const res = await fetch(`/api/rooms/${code.toUpperCase()}/answer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Erro ao enviar resposta.');
    return data;
  }

  public async placePiece(
    code: string,
    payload: {
      teamId: string;
      pieceIndex: number;
      targetSlotIndex: number;
    }
  ) {
    const res = await fetch(`/api/rooms/${code.toUpperCase()}/puzzle/place`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Erro ao posicionar peça.');
    return data;
  }

  public async adminAction(code: string, payload: any) {
    const res = await fetch(`/api/rooms/${code.toUpperCase()}/action`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Erro ao executar ação administrativa.');
    return data;
  }

  public async fetchQuestions(): Promise<Question[]> {
    const res = await fetch('/api/questions');
    if (!res.ok) throw new Error('Erro ao listar perguntas.');
    const data = await res.json();
    return data.questions || [];
  }

  public async updateQuestion(id: string, updatedData: Partial<Question>) {
    const res = await fetch(`/api/questions/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Erro ao atualizar pergunta.');
    return data;
  }
}

export const api = new GameApiService();
