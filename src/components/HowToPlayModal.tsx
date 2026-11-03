import React from 'react';
import { motion } from 'motion/react';
import { HelpCircle, CheckCircle2, Layers, Clock, Users, X, Trophy, ShieldCheck } from 'lucide-react';
import { SoundSystem } from '../utils/audio';

interface HowToPlayModalProps {
  onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-2xl bg-[#082218] rounded-2xl border-2 border-emerald-600 shadow-2xl p-6 text-white max-h-[85vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between pb-4 border-b border-emerald-800">
          <div className="flex items-center gap-2.5">
            <HelpCircle className="w-6 h-6 text-emerald-400" />
            <div>
              <h2 className="text-lg font-bold">Como Jogar — Desafio SENAR 2030</h2>
              <p className="text-xs text-emerald-300/80">Regras e Dinâmica da Competição Estratégica</p>
            </div>
          </div>
          <button
            onClick={() => {
              SoundSystem.playClick();
              onClose();
            }}
            className="p-1 rounded-lg hover:bg-emerald-900 text-emerald-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-5 space-y-4 text-xs leading-relaxed text-emerald-100">
          {/* Card 1: Equipes e Capitão */}
          <div className="p-3.5 rounded-xl bg-black/40 border border-emerald-800/80 flex items-start gap-3">
            <Users className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-white text-sm">1. Equipes e Papel do Capitão</h3>
              <p className="mt-1">
                As equipes são compostas de 1 a 10 participantes. Todos os integrantes podem visualizar as questões e votar em tempo real. O <strong>Capitão</strong> é o responsável por confirmar a resposta oficial da equipe.
              </p>
            </div>
          </div>

          {/* Card 2: Regra dos 80% */}
          <div className="p-3.5 rounded-xl bg-black/40 border border-amber-600/60 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-amber-300 text-sm">2. Regra de Aprovação: Mínimo de 80%</h3>
              <p className="mt-1">
                Para conquistar o lote de peças da rodada, a equipe deve alcançar aproveitamento mínimo de 80% (ex: no mínimo <strong>8 acertos em 10 perguntas</strong>). Caso reprovada, o lote correspondente permanece bloqueado até eventual repescagem.
              </p>
            </div>
          </div>

          {/* Card 3: 5 Rodadas Progressivas */}
          <div className="p-3.5 rounded-xl bg-black/40 border border-emerald-800/80 flex items-start gap-3">
            <Layers className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-white text-sm">3. As Cinco Rodadas Estratégicas</h3>
              <ul className="mt-1.5 space-y-1 list-disc list-inside text-emerald-200">
                <li><strong>Rodada 1:</strong> Identidade e Direcionadores Estratégicos (Lote 1: 5 peças).</li>
                <li><strong>Rodada 2:</strong> Mapa Estratégico e Balanced Scorecard BSC (Lote 2: 5 peças).</li>
                <li><strong>Rodada 3:</strong> Cadeia de Valor do SENAR-AR/RO (Lote 3: 5 peças).</li>
                <li><strong>Rodada 4:</strong> Estrutura Organizacional, Governança e Competências (Lote 4: 5 peças).</li>
                <li><strong>Rodada 5:</strong> Segurança Jurídica, Integridade e RLC 2024 (Lote 5: 5 peças).</li>
              </ul>
            </div>
          </div>

          {/* Card 4: Quebra-Cabeça de 25 peças */}
          <div className="p-3.5 rounded-xl bg-black/40 border border-emerald-800/80 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-white text-sm">4. Montagem Digital do Mapa Estratégico (25 Peças)</h3>
              <p className="mt-1">
                Cada lote aprovado libera 5 peças no tabuleiro de 5×5. Selecione a peça na sua bandeja e clique no espaço correto no tabuleiro oficial do SENAR-RO.
              </p>
            </div>
          </div>

          {/* Card 5: Cronômetro e Vencedor */}
          <div className="p-3.5 rounded-xl bg-black/40 border border-emerald-800/80 flex items-start gap-3">
            <Trophy className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-white text-sm">5. Definição da Equipe Campeã</h3>
              <p className="mt-1">
                Vence a equipe que conseguir conquistar todos os lotes e posicionar corretamente as <strong>25 peças no menor tempo total</strong> registrado pelo servidor!
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-emerald-800 flex justify-end">
          <button
            onClick={() => {
              SoundSystem.playClick();
              onClose();
            }}
            className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold uppercase tracking-wider text-xs"
          >
            Entendido, Vamos Jogar!
          </button>
        </div>
      </motion.div>
    </div>
  );
};
