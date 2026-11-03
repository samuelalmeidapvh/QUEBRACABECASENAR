/**
 * BANCO DE PERGUNTAS OFICIAL — DESAFIO SENAR 2030
 * 50 Questões fundamentadas rigorosamente nos documentos institucionais do SENAR-AR/RO:
 * - Mapa Estratégico SENAR 2027–2030 BSC
 * - Cadeia de Valor do SENAR-AR/RO
 * - Estatuto Social do SENAR-RO
 * - Regimento Interno do SENAR-AR/RO (2017)
 * - Organograma SENAR-AR/RO 2024
 * - Regulamento de Licitações e Contratos (RLC - Resolução nº 30/2024/CD de 02/05/2024)
 */

import { Question } from '../types/game';

export const INITIAL_QUESTIONS: Question[] = [
  // ==========================================
  // RODADA 1: IDENTIDADE E DIRECIONADORES ESTRATÉGICOS (10 QUESTÕES)
  // ==========================================
  {
    id: 'r1_q01',
    round: 1,
    topic: 'Propósito Institucional',
    prompt: 'Qual é o Propósito explícito definido no Planejamento Estratégico SENAR 2027–2030?',
    options: [
      'Transformar vidas e fortalecer o campo, criando oportunidades para que as pessoas prosperem por meio do conhecimento, do trabalho e do desenvolvimento sustentável.',
      'Executar unicamente programas de assistência financeira subsidiada aos sindicatos rurais de Rondônia.',
      'Promover a fiscalização tributária e arrecadação de contribuições compulsórias dos produtores rurais.',
      'Substituir os órgãos estaduais na gestão de crédito rural e regularização fundiária.'
    ],
    correctIndex: 0,
    explanation: 'Conforme expresso no Mapa Estratégico SENAR 2027–2030, o Propósito é: "Transformar vidas e fortalecer o campo, criando oportunidades para que as pessoas prosperem por meio do conhecimento, do trabalho e do desenvolvimento sustentável".',
    sourceDocument: 'Mapa Estratégico SENAR 2027–2030 BSC',
    referenceSection: 'Quadro Central Superior - Propósito',
    difficulty: 'Fácil',
    approved: true
  },
  {
    id: 'r1_q02',
    round: 1,
    topic: 'Lema Institucional',
    prompt: 'Qual é a mensagem do lema estratégico em destaque no Mapa Estratégico SENAR 2027–2030?',
    options: [
      'Juntos, fortalecendo o produtor rural de Rondônia.',
      'Inovação sem limites para a agropecuária industrial.',
      'Pioneirismo no campo e liderança na exportação.',
      'Apoio exclusivo ao grande agronegócio da Amazônia.'
    ],
    correctIndex: 0,
    explanation: 'No canto superior direito do Mapa Estratégico destaca-se: "JUNTOS, FORTALECENDO O PRODUTOR RURAL DE RONDÔNIA".',
    sourceDocument: 'Mapa Estratégico SENAR 2027–2030 BSC',
    referenceSection: 'Cabeçalho Superior Direito',
    difficulty: 'Fácil',
    approved: true
  },
  {
    id: 'r1_q03',
    round: 1,
    topic: 'Horizonte Temporal',
    prompt: 'Qual é o período de vigência estabelecido para o Planejamento Estratégico institucional do SENAR?',
    options: [
      '2027 a 2030.',
      '2023 a 2026.',
      '2025 a 2028.',
      '2026 a 2032.'
    ],
    correctIndex: 0,
    explanation: 'O Mapa Estratégico delimita formalmente o ciclo quadriênio 2027–2030 com o título "MAPA ESTRATÉGICO SENAR 2027-2030".',
    sourceDocument: 'Mapa Estratégico SENAR 2027–2030 BSC',
    referenceSection: 'Título Principal',
    difficulty: 'Fácil',
    approved: true
  },
  {
    id: 'r1_q04',
    round: 1,
    topic: 'Direcionamento Central',
    prompt: 'Qual frase sintetiza a atuação institucional expressa no subtítulo do Mapa Estratégico SENAR 2027–2030?',
    options: [
      'Conhecimento, tecnologia e pessoas por um agro mais forte e sustentável.',
      'Produtividade máxima a qualquer custo ecológico.',
      'Gestão corporativa tradicional para o mercado global.',
      'Educação exclusivamente remota para jovens rurais.'
    ],
    correctIndex: 0,
    explanation: 'O subtítulo oficial abaixo do título do Mapa declara: "Conhecimento, tecnologia e pessoas por um agro mais forte e sustentável".',
    sourceDocument: 'Mapa Estratégico SENAR 2027–2030 BSC',
    referenceSection: 'Subtítulo do Cabeçalho',
    difficulty: 'Fácil',
    approved: true
  },
  {
    id: 'r1_q05',
    round: 1,
    topic: 'Resultados para a Sociedade',
    prompt: 'Entre os Resultados para a Sociedade estipulados no Mapa Estratégico 2027–2030, qual destes está expressamente previsto?',
    options: [
      'Aumento da produtividade e renda no campo.',
      'Monopólio na distribuição de maquinários agrícolas.',
      'Substituição total da mão de obra familiar por automação.',
      'Extinção das pequenas propriedades rurais.'
    ],
    correctIndex: 0,
    explanation: 'Os 4 Resultados para a Sociedade são: 1) Produtores rurais mais capacitados; 2) Aumento da produtividade e renda no campo; 3) Mais qualidade de vida para as famílias rurais; 4) Agro de Rondônia mais competitivo e sustentável.',
    sourceDocument: 'Mapa Estratégico SENAR 2027–2030 BSC',
    referenceSection: 'Faixa Resultados para a Sociedade',
    difficulty: 'Médio',
    approved: true
  },
  {
    id: 'r1_q06',
    round: 1,
    topic: 'Competitividade e Sustentabilidade',
    prompt: 'De acordo com o Mapa Estratégico, como deve ser o Agro de Rondônia alcançado através dos resultados institucionais?',
    options: [
      'Mais competitivo e sustentável.',
      'Dependente prioritariamente de incentivos fiscais externos.',
      'Direcionado unicamente para o mercado interno local.',
      'Baseado apenas em monoculturas extensivas.'
    ],
    correctIndex: 0,
    explanation: 'O 4º resultado social destacado é expressamente: "Agro de Rondônia mais competitivo e sustentável".',
    sourceDocument: 'Mapa Estratégico SENAR 2027–2030 BSC',
    referenceSection: 'Perspectiva Sociedade / Resultados',
    difficulty: 'Médio',
    approved: true
  },
  {
    id: 'r1_q07',
    round: 1,
    topic: 'Público Alvo',
    prompt: 'Na Perspectiva Clientes do Planejamento Estratégico SENAR 2027–2030, quem são os destinatários diretos declarados?',
    options: [
      'Produtores Rurais e Sociedade.',
      'Apenas grandes exportadores de grãos multinacionais.',
      'Exclusivamente empresas fornecedoras de insumos químicos.',
      'Apenas entidades do setor público metropolitano.'
    ],
    correctIndex: 0,
    explanation: 'Na aba da Perspectiva Clientes está indicado textualmente: "Produtores Rurais e Sociedade".',
    sourceDocument: 'Mapa Estratégico SENAR 2027–2030 BSC',
    referenceSection: 'Perspectiva Clientes',
    difficulty: 'Fácil',
    approved: true
  },
  {
    id: 'r1_q08',
    round: 1,
    topic: 'Capacitação Rural',
    prompt: 'Qual impacto positivo direto é apontado no Mapa para o desenvolvimento dos trabalhadores e produtores rurais?',
    options: [
      'Produtores rurais mais capacitados.',
      'Diminuição dos cursos de formação presencial.',
      'Concentração da capacitação apenas na capital.',
      'Cobrança obrigatória de taxas de matrícula nos cursos do SENAR.'
    ],
    correctIndex: 0,
    explanation: 'O primeiro resultado para a sociedade listado é "Produtores rurais mais capacitados", fortalecendo a formação no campo.',
    sourceDocument: 'Mapa Estratégico SENAR 2027–2030 BSC',
    referenceSection: 'Resultados para a Sociedade',
    difficulty: 'Fácil',
    approved: true
  },
  {
    id: 'r1_q09',
    round: 1,
    topic: 'Dimensão Familiar no Campo',
    prompt: 'O Mapa Estratégico destaca uma dimensão humanizada de impacto social rural expressa em:',
    options: [
      'Mais qualidade de vida para as famílias rurais.',
      'Incentivo à migração da juventude rural para os centros urbanos.',
      'Redução dos investimentos em promoção social e saúde rural.',
      'Restrição de atendimento a famílias sem registro patronal.'
    ],
    correctIndex: 0,
    explanation: 'O Mapa contempla expressamente: "Mais qualidade de vida para as famílias rurais", integrando trabalho, saúde e promoção social.',
    sourceDocument: 'Mapa Estratégico SENAR 2027–2030 BSC',
    referenceSection: 'Resultados para a Sociedade',
    difficulty: 'Fácil',
    approved: true
  },
  {
    id: 'r1_q10',
    round: 1,
    topic: 'Resultados e Impactos da Base',
    prompt: 'Na faixa inferior de "Resultados e Impactos" do Mapa Estratégico 2027–2030, quais são os cinco eixos sintetizados?',
    options: [
      'Produtividade Sustentável, Desenvolvimento Humano, Inovação, Competitividade do Campo e Qualidade de Vida.',
      'Rentabilidade Bancária, Automação Máxima, Fiscalização, Sanção e Subsídios.',
      'Arrecadação Externa, Burocracia, Vendas de Imóveis, Lucro Comercial e Patrocínios.',
      'Importação de Máquinas, Redução de Quadro, Centralização em Brasília e Restrição.'
    ],
    correctIndex: 0,
    explanation: 'A barra verde inferior de Resultados e Impactos contém exatamente: Produtividade Sustentável, Desenvolvimento Humano, Inovação, Competitividade do Campo e Qualidade de Vida.',
    sourceDocument: 'Mapa Estratégico SENAR 2027–2030 BSC',
    referenceSection: 'Barra Inferior de Resultados e Impactos',
    difficulty: 'Médio',
    approved: true
  },

  // ==========================================
  // RODADA 2: MAPA ESTRATÉGICO E BALANCED SCORECARD (BSC) (10 QUESTÕES)
  // ==========================================
  {
    id: 'r2_q01',
    round: 2,
    topic: 'Arquitetura do Balanced Scorecard',
    prompt: 'Quais são as quatro perspectivas fundamentais que estruturam o Mapa Estratégico SENAR 2027–2030 no modelo BSC adaptado?',
    options: [
      'Perspectiva Sociedade, Perspectiva Clientes, Perspectiva Processos Internos e Perspectiva Aprendizado e Crescimento.',
      'Perspectiva Acionistas, Perspectiva Vendas, Perspectiva Estoque e Perspectiva Auditoria.',
      'Perspectiva Governamental, Perspectiva Bancária, Perspectiva Tributária e Perspectiva Sindical.',
      'Perspectiva Internacional, Perspectiva de Crédito, Perspectiva Jurídica e Perspectiva de Custos.'
    ],
    correctIndex: 0,
    explanation: 'No modelo BSC público/social do SENAR-RO, as quatro perspectivas verticais são: 1. Sociedade; 2. Clientes; 3. Processos Internos; 4. Aprendizado e Crescimento.',
    sourceDocument: 'Mapa Estratégico SENAR 2027–2030 BSC',
    referenceSection: 'Colunas e Faixas Laterais Esquerdas',
    difficulty: 'Fácil',
    approved: true
  },
  {
    id: 'r2_q02',
    round: 2,
    topic: 'Objetivo Estratégico 01',
    prompt: 'Qual é o enunciado do Objetivo Estratégico 01 (Processos Internos)?',
    options: [
      'Fortalecer e ampliar a assistência técnica rural, a promoção social, a capacitação e a formação profissional por meio de uma gestão ágil, moderna e de qualidade nos resultados.',
      'Extinguir atendimentos técnicos presenciais priorizando apenas manuais impressos.',
      'Subdelegar as ações de formação rural para escolas urbanas particulares.',
      'Reduzir a atuação em campo para economizar recursos operacionais.'
    ],
    correctIndex: 0,
    explanation: 'O Objetivo 01 é: "Fortalecer e ampliar a assistência técnica rural, a promoção social, a capacitação e a formação profissional por meio de uma gestão ágil, moderna e de qualidade nos resultados".',
    sourceDocument: 'Mapa Estratégico SENAR 2027–2030 BSC',
    referenceSection: 'Objetivo Estratégico 01 - Processos Internos',
    difficulty: 'Médio',
    approved: true
  },
  {
    id: 'r2_q03',
    round: 2,
    topic: 'Objetivo Estratégico 02',
    prompt: 'O que preconiza o Objetivo Estratégico 02 da Perspectiva Processos Internos?',
    options: [
      'Aperfeiçoar a Gestão Integrada Institucional e o fortalecimento do Marketing e da Comunicação.',
      'Eliminar os canais de comunicação com a sociedade para evitar questionamentos.',
      'Restringir o marketing institucional a eventos esportivos urbanos.',
      'Contratar agências internacionais sem integração com os planos do SENAR.'
    ],
    correctIndex: 0,
    explanation: 'O Objetivo 02 detalha: "Aperfeiçoar a Gestão Integrada Institucional e o fortalecimento do Marketing e da Comunicação".',
    sourceDocument: 'Mapa Estratégico SENAR 2027–2030 BSC',
    referenceSection: 'Objetivo Estratégico 02 - Processos Internos',
    difficulty: 'Médio',
    approved: true
  },
  {
    id: 'r2_q04',
    round: 2,
    topic: 'Objetivo Estratégico 03',
    prompt: 'Qual é o foco estabelecido no Objetivo Estratégico 03 (Excelência na Gestão)?',
    options: [
      'Gerir com excelência os recursos financeiros e humanos, os processos operacionais com foco no aumento da maturidade de gestão.',
      'Aumentar o endividamento bancário para financiar novas sedes de luxo.',
      'Descontinuar avaliações de desempenho de colaboradores.',
      'Eliminar controles orçamentários internos.'
    ],
    correctIndex: 0,
    explanation: 'O Objetivo 03 prevê: "Gerir com excelência os recursos financeiros e humanos, os processos operacionais com foco no aumento da maturidade de gestão".',
    sourceDocument: 'Mapa Estratégico SENAR 2027–2030 BSC',
    referenceSection: 'Objetivo Estratégico 03 - Processos Internos',
    difficulty: 'Médio',
    approved: true
  },
  {
    id: 'r2_q05',
    round: 2,
    topic: 'Objetivo Estratégico 04',
    prompt: 'Como está formulado o Objetivo Estratégico 04 na temática de tecnologia?',
    options: [
      'Viabilizar uma arquitetura de TI moderna, integrada e de inteligência estratégica de dados.',
      'Manter sistemas manuais em papel para evitar custos com servidores.',
      'Terceirizar todos os dados do agronegócio sem controle de segurança da informação.',
      'Desconectar escritórios regionais da sede.'
    ],
    correctIndex: 0,
    explanation: 'O Objetivo 04 prevê textualmente: "Viabilizar uma arquitetura de TI moderna, integrada e de inteligência estratégica de dados".',
    sourceDocument: 'Mapa Estratégico SENAR 2027–2030 BSC',
    referenceSection: 'Objetivo Estratégico 04 - Processos Internos',
    difficulty: 'Fácil',
    approved: true
  },
  {
    id: 'r2_q06',
    round: 2,
    topic: 'Objetivo Estratégico 05',
    prompt: 'Qual o compromisso formal do Objetivo Estratégico 05 em relação à conformidade e integridade?',
    options: [
      'Garantir a segurança jurídica, a integridade da gestão e assegurar a conformidade legal, ética e operacional da organização.',
      'Flexibilizar as normas licitatórias sem prestação de contas.',
      'Isentar os gestores da observância das resoluções do Conselho Deliberativo.',
      'Suspender os canais de controle interno e auditoria.'
    ],
    correctIndex: 0,
    explanation: 'O Objetivo 05 determina expressamente: "Garantir a segurança jurídica, a integridade da gestão e assegurar a conformidade legal, ética e operacional da organização".',
    sourceDocument: 'Mapa Estratégico SENAR 2027–2030 BSC',
    referenceSection: 'Objetivo Estratégico 05 - Processos Internos',
    difficulty: 'Fácil',
    approved: true
  },
  {
    id: 'r2_q07',
    round: 2,
    topic: 'Base para a Execução da Estratégia',
    prompt: 'Na Perspectiva Aprendizado e Crescimento, qual dos seguintes elementos compõe a "Base para a Execução da Estratégia"?',
    options: [
      'Pessoas mais capacitadas e engajadas.',
      'Redução contínua dos treinamentos internos.',
      'Substituição de lideranças a cada seis meses.',
      'Proibição do uso de dados e métricas digitais.'
    ],
    correctIndex: 0,
    explanation: 'Na Perspectiva Aprendizado e Crescimento, o primeiro pilar da base é: "Pessoas mais capacitadas e engajadas".',
    sourceDocument: 'Mapa Estratégico SENAR 2027–2030 BSC',
    referenceSection: 'Perspectiva Aprendizado e Crescimento',
    difficulty: 'Fácil',
    approved: true
  },
  {
    id: 'r2_q08',
    round: 2,
    topic: 'Inovação e Melhoria Contínua',
    prompt: 'Como o Aprendizado e Crescimento posiciona o aprimoramento contínuo dos processos no SENAR?',
    options: [
      'Inovação e cultura de melhoria contínua.',
      'Conservadorismo processual imutável.',
      'Eliminação de métodos ágeis de trabalho.',
      'Manutenção restrita de modelos obsoletos.'
    ],
    correctIndex: 0,
    explanation: 'O segundo pilar da base para execução da estratégia é explicitamente "Inovação e cultura de melhoria contínua".',
    sourceDocument: 'Mapa Estratégico SENAR 2027–2030 BSC',
    referenceSection: 'Perspectiva Aprendizado e Crescimento',
    difficulty: 'Fácil',
    approved: true
  },
  {
    id: 'r2_q09',
    round: 2,
    topic: 'Competências e Conhecimento',
    prompt: 'No quarto pilar do Aprendizado e Crescimento do Mapa, qual é a diretriz para a qualificação profissional interna?',
    options: [
      'Conhecimento e desenvolvimento de competências.',
      'Desvalorização de qualificações técnicas acadêmicas.',
      'Congelamento do plano de capacitação da equipe técnica.',
      'Terceirização integral das funções estratégicas.'
    ],
    correctIndex: 0,
    explanation: 'O pilar visualizado com o capelo acadêmico no mapa é: "Conhecimento e desenvolvimento de competências".',
    sourceDocument: 'Mapa Estratégico SENAR 2027–2030 BSC',
    referenceSection: 'Perspectiva Aprendizado e Crescimento',
    difficulty: 'Fácil',
    approved: true
  },
  {
    id: 'r2_q10',
    round: 2,
    topic: 'Causa e Efeito no BSC',
    prompt: 'No modelo BSC do SENAR 2027–2030, como se dá a relação causal entre as perspectivas?',
    options: [
      'O Aprendizado e Crescimento capacita e viabiliza os Processos Internos, gerando entregas de valor aos Clientes e impacto para a Sociedade.',
      'A Sociedade impõe lucros que compram o aprendizado, sem passar por processos.',
      'Os Processos Internos existem independentemente das pessoas e sem foco nos clientes rurais.',
      'Os Clientes realizam a gestão financeira sem qualquer atuação do SENAR.'
    ],
    correctIndex: 0,
    explanation: 'A lógica do BSC é ascendente/causal: bases sólidas de pessoas e tecnologia alimentam processos excelentes, que entregam valor aos clientes rurais, gerando o impacto supremo desejado para a sociedade e o agro.',
    sourceDocument: 'Mapa Estratégico SENAR 2027–2030 BSC',
    referenceSection: 'Relações de Causa e Efeito do Mapa',
    difficulty: 'Difícil',
    approved: true
  },

  // ==========================================
  // RODADA 3: CADEIA DE VALOR DO SENAR-AR/RO (10 QUESTÕES)
  // ==========================================
  {
    id: 'r3_q01',
    round: 3,
    topic: 'Alçada Decisória',
    prompt: 'Conforme a Cadeia de Valor do SENAR-AR/RO, quais instâncias compõem a Alçada Decisória superior?',
    options: [
      'Conselho Administrativo, Conselho Fiscal, Presidência e Superintendência.',
      'Assembleia Legislativa, Ministério Público, Tribunal de Justiça e Prefeituras.',
      'Gerência DAF, Coordenação de Transporte e Almoxarifado.',
      'Cooperativas de Crédito e Fornecedores Privados de Combustível.'
    ],
    correctIndex: 0,
    explanation: 'No topo da Cadeia de Valor, a Alçada Decisória é composta por: Conselho Administrativo, Conselho Fiscal, Presidência e Superintendência.',
    sourceDocument: 'Cadeia de Valor do SENAR-AR/RO',
    referenceSection: 'Alçada Decisória (Topo)',
    difficulty: 'Fácil',
    approved: true
  },
  {
    id: 'r3_q02',
    round: 3,
    topic: 'Processos de Gestão',
    prompt: 'Quais são os quatro Processos de Gestão identificados na Cadeia de Valor?',
    options: [
      'Gerir Orçamento, Gerir o Planejamento Estratégico, Gerir Riscos e Gerir Inovação.',
      'Comprar Imóveis, Vender Ações, Cobrar Multas e Abrir Franquias.',
      'Fabricar Ração, Vender Fertilizantes, Arrendar Fazendas e Exportar Carne.',
      'Realizar Concursos Políticos, Editar Jornais, Fiscalizar Portos e Auditar Bancos.'
    ],
    correctIndex: 0,
    explanation: 'Na faixa de Processos de Gestão da Cadeia de Valor constam exatamente 4 processos: Gerir Orçamento, Gerir o Planejamento Estratégico, Gerir Riscos e Gerir Inovação.',
    sourceDocument: 'Cadeia de Valor do SENAR-AR/RO',
    referenceSection: 'Processos de Gestão',
    difficulty: 'Médio',
    approved: true
  },
  {
    id: 'r3_q03',
    round: 3,
    topic: 'Processos Finalísticos',
    prompt: 'Quais são os processos que compõem o núcleo dos Processos Finalísticos da Cadeia de Valor do SENAR-AR/RO?',
    options: [
      'Elaborar Plano Anual de Trabalho (01), Ofertar Formação Profissional Rural e Técnica (02), Executar Promoção Social e Saúde (03) e Prestar ATeG (04).',
      'Gerir Contratos Bancários, Realizar Leilões Judiciais e Cobrar Pedágios.',
      'Licenciar Desmatamentos, Fiscalizar Fronteiras e Registrar Veículos de Carga.',
      'Administrar Feiras Comerciais Urbanas e Revender Tratores Importados.'
    ],
    correctIndex: 0,
    explanation: 'Os Processos Finalísticos numerados são: 01 Elaborar o Plano Anual de Trabalho; 02 Ofertar Formação Profissional Rural e Formação Técnica; 03 Executar ações de Promoção Social e Saúde; 04 Prestar Assistência Técnica e Gerencial (ATeG).',
    sourceDocument: 'Cadeia de Valor do SENAR-AR/RO',
    referenceSection: 'Processos Finalísticos (Itens 01 a 04)',
    difficulty: 'Médio',
    approved: true
  },
  {
    id: 'r3_q04',
    round: 3,
    topic: 'Processos de Suporte',
    prompt: 'Quantos e quais grupos compõem a base dos Processos de Suporte na Cadeia de Valor?',
    options: [
      '11 áreas de apoio numeradas de 05 a 15: Compras, Inovação, Contratos, Contábil, Jurídica, Arrecadação, Pessoas, TIC, Financeira, Comunicação e Dados.',
      'Apenas 2 áreas de suporte: Segurança Patrimonial e Portaria.',
      '5 áreas exclusivas: Empréstimos, Câmbio, Investimentos, Seguros e Logística Externa.',
      'Nenhum processo de suporte existe na Cadeia de Valor do SENAR-AR/RO.'
    ],
    correctIndex: 0,
    explanation: 'A Cadeia de Valor discrimina 11 processos de suporte nos itens 05 a 15: Gestão de Compras, Inovação, Contratos, Contábil, Jurídica, Arrecadação, Pessoas, TIC, Financeira, Comunicação e Dados.',
    sourceDocument: 'Cadeia de Valor do SENAR-AR/RO',
    referenceSection: 'Processos de Suporte (Itens 05 a 15)',
    difficulty: 'Difícil',
    approved: true
  },
  {
    id: 'r3_q05',
    round: 3,
    topic: 'Entradas da Cadeia de Valor',
    prompt: 'No fluxo de Entradas à esquerda da Cadeia de Valor, quais normas e instrumentos fundamentam as operações?',
    options: [
      'Lei nº 8.315/1991, Decretos nº 566/1992 e nº 9.274/2018, Regulamentos do CD, Regimentos Internos e Instruções de Serviços.',
      'Código Comercial de 1850 e Tratados Internacionais Marítimos.',
      'Decretos Municipais de Porto Velho sobre Trânsito Urbano.',
      'Regulamento Interno da Bovespa e Normas da CVM.'
    ],
    correctIndex: 0,
    explanation: 'A barra lateral esquerda de Entradas lista: Lei nº 8.315, de 23/12/91; Decretos nº 566/92 e nº 9.274/18; Regulamentos do CD; Regimentos Internos e Instruções de Serviços.',
    sourceDocument: 'Cadeia de Valor do SENAR-AR/RO',
    referenceSection: 'Faixa Lateral Esquerda - Entradas',
    difficulty: 'Médio',
    approved: true
  },
  {
    id: 'r3_q06',
    round: 3,
    topic: 'Partes Interessadas',
    prompt: 'Quais partes interessadas institucionais estão mapeadas na base da Cadeia de Valor?',
    options: [
      'Governo, Órgãos de Controle, Federação (FAPERON), Sindicatos, Empresas e Associações/Prefeituras.',
      'Bancos Internacionais, Fundos de Hedge e Bolsas de Mercadorias de Chicago.',
      'Partidos Políticos, Clubes de Futebol e Agências de Turismo.',
      'Exclusivamente empresas multinacionais de defensivos agrícolas.'
    ],
    correctIndex: 0,
    explanation: 'A base inferior de Partes Interessadas identifica: Governo, Órgãos de Controle, Federação, Sindicatos, Empresas e Associações/Prefeituras.',
    sourceDocument: 'Cadeia de Valor do SENAR-AR/RO',
    referenceSection: 'Rodapé - Partes Interessadas',
    difficulty: 'Fácil',
    approved: true
  },
  {
    id: 'r3_q07',
    round: 3,
    topic: 'Valor Público',
    prompt: 'Qual é a definição exata de Valor Público consagrada na Cadeia de Valor do SENAR-AR/RO?',
    options: [
      'Capacitar, fomentar o desenvolvimento econômico e promover a qualidade de vida do campo.',
      'Distribuir dividendos em dinheiro aos associados da entidade.',
      'Maximizar o faturamento tributário sobre os municípios rurais.',
      'Construir estradas federais asfaltadas no estado de Rondônia.'
    ],
    correctIndex: 0,
    explanation: 'No bloco superior direito de "Valor Público" consta textualmente: "Capacitar, fomentar o desenvolvimento econômico e promover a qualidade de vida do campo".',
    sourceDocument: 'Cadeia de Valor do SENAR-AR/RO',
    referenceSection: 'Quadro Superior Direito - Valor Público',
    difficulty: 'Fácil',
    approved: true
  },
  {
    id: 'r3_q08',
    round: 3,
    topic: 'Saídas e Beneficiários',
    prompt: 'Quem são os destinatários primários representados no bloco de Saídas da Cadeia de Valor?',
    options: [
      'Produtores, Trabalhadores Rurais e suas famílias, além do fomento a lideranças do CNA Jovem.',
      'Comerciantes e importadores das capitais do Sudeste.',
      'Funcionários públicos federais aposentados.',
      'Indústrias automobilísticas e montadoras urbanas.'
    ],
    correctIndex: 0,
    explanation: 'O bloco de Saídas destaca os ícones de: "Produtores, Trabalhadores Rurais e suas famílias" e o fomento às "lideranças do CNA Jovem".',
    sourceDocument: 'Cadeia de Valor do SENAR-AR/RO',
    referenceSection: 'Bloco de Saídas à Direita',
    difficulty: 'Fácil',
    approved: true
  },
  {
    id: 'r3_q09',
    round: 3,
    topic: 'Assistência Técnica e Gerencial',
    prompt: 'Na Cadeia de Valor, a prestação da ATeG (Assistência Técnica e Gerencial) está classificada em qual categoria de processos?',
    options: [
      'Processos Finalísticos (Processo nº 04).',
      'Processos de Suporte Básico.',
      'Processos de Alçada Decisória Política.',
      'Processos Exclusivos de Entrada Normativa.'
    ],
    correctIndex: 0,
    explanation: 'A ATeG é o item 04 do macrobloco de "Processos Finalísticos", gerando valor direto nas propriedades rurais atendidas.',
    sourceDocument: 'Cadeia de Valor do SENAR-AR/RO',
    referenceSection: 'Processos Finalísticos - Item 04',
    difficulty: 'Médio',
    approved: true
  },
  {
    id: 'r3_q10',
    round: 3,
    topic: 'Formação Técnica e Rede e-Tec',
    prompt: 'Na Cadeia de Valor, associada à oferta de Formação Técnica (Processos Finalísticos), qual rede de educação profissional se destaca?',
    options: [
      'Rede e-Tec (Educação a Distância e Semipresencial Técnica).',
      'Rede Básica Municipal de Ensino Fundamental.',
      'Sistema de Franquias de Idiomas Internacionais.',
      'Plataforma Aberta de Jogos Eletrônicos Comerciais.'
    ],
    correctIndex: 0,
    explanation: 'Abaixo de "Ofertar Formação Técnica" no processo finalístico 02 está destacada a inserção da "Rede e-Tec" no ecossistema de educação profissional do SENAR.',
    sourceDocument: 'Cadeia de Valor do SENAR-AR/RO',
    referenceSection: 'Processos Finalísticos - Item 02 (Rede e-Tec)',
    difficulty: 'Médio',
    approved: true
  },

  // ==========================================
  // RODADA 4: ESTRUTURA ORGANIZACIONAL, GOVERNANÇA E COMPETÊNCIAS (10 QUESTÕES)
  // ==========================================
  {
    id: 'r4_q01',
    round: 4,
    topic: 'Natureza Jurídica',
    prompt: 'Segundo o Estatuto Social e o Regimento Interno, qual é a natureza jurídica do SENAR-RO?',
    options: [
      'Associação civil, sem fins lucrativos, com autonomia patrimonial, administrativa e financeira, filiada ao SENAR Nacional.',
      'Empresa pública de capital misto voltada para exploração de minérios.',
      'Fundação pública governamental com dotação do orçamento federal direto.',
      'Autarquia especial com poder judicante e forças de segurança próprias.'
    ],
    correctIndex: 0,
    explanation: 'Conforme os Arts. 1º e 2º do Estatuto Social e Art. 1º do Regimento Interno, o SENAR-RO é uma associação civil, sem fins lucrativos, integrante do Sistema S, com sede e foro em Porto Velho/RO.',
    sourceDocument: 'Estatuto Social do SENAR-RO / Regimento Interno',
    referenceSection: 'Título I - Natureza Jurídica e Finalidade (Art. 1º e 2º)',
    difficulty: 'Fácil',
    approved: true
  },
  {
    id: 'r4_q02',
    round: 4,
    topic: 'Presidência do Conselho Administrativo',
    prompt: 'Quem exerce de forma nata a Presidência do Conselho Administrativo do SENAR-AR/RO?',
    options: [
      'O Presidente da Federação da Agricultura e Pecuária do Estado de Rondônia (FAPERON).',
      'O Governador do Estado de Rondônia.',
      'O Secretário Municipal de Obras de Porto Velho.',
      'O Presidente do Banco Central do Brasil.'
    ],
    correctIndex: 0,
    explanation: 'Nos termos do Art. 9º, I, do Estatuto Social e Art. 6º do Regimento Interno, o Presidente da FAPERON é o Presidente nato do Conselho Administrativo.',
    sourceDocument: 'Estatuto Social do SENAR-RO / Regimento Interno',
    referenceSection: 'Estatuto Art. 9º, I e Regimento Interno Art. 6º',
    difficulty: 'Fácil',
    approved: true
  },
  {
    id: 'r4_q03',
    round: 4,
    topic: 'Composição do Conselho Fiscal Regional',
    prompt: 'Como é constituído o Conselho Fiscal Regional do SENAR-AR/RO?',
    options: [
      'Composto por 3 membros efetivos e igual número de suplentes (2 indicados pela FAPERON e 1 pelo SENAR Nacional).',
      'Composto por 12 deputados estaduais de Rondônia.',
      'Composto exclusivamente por diretores da rede bancária pública.',
      'Composto por 1 único auditor independente sem suplentes.'
    ],
    correctIndex: 0,
    explanation: 'Conforme Art. 19 do Estatuto Social e Art. 12 do Regimento Interno, o Conselho Fiscal é composto por 3 membros efetivos e 3 suplentes (2 da FAPERON e 1 do SENAR Nacional).',
    sourceDocument: 'Estatuto Social Art. 19 / Regimento Interno Art. 12',
    referenceSection: 'Capítulo do Conselho Fiscal Regional',
    difficulty: 'Médio',
    approved: true
  },
  {
    id: 'r4_q04',
    round: 4,
    topic: 'Papel da Superintendência',
    prompt: 'Qual é o papel institucional da Superintendência do SENAR-AR/RO na governança corporativa?',
    options: [
      'É o órgão de execução da administração, responsável por dirigir, ordenar e controlar as atividades técnicas e administrativas.',
      'É o órgão legislativo responsável por aprovar o orçamento estadual do agronegócio.',
      'É um conselho honorário sem poderes executivos ou administrativos.',
      'É a comissão de jurados para julgamento de litígios civis entre produtores.'
    ],
    correctIndex: 0,
    explanation: 'Conforme Art. 17 do Estatuto Social e Art. 15 do Regimento Interno, a Superintendência é o órgão executivo da administração, dirigida por Superintendente indicado pelo Presidente do Conselho.',
    sourceDocument: 'Estatuto Social Art. 17 / Regimento Interno Art. 9º e 15',
    referenceSection: 'Capítulo da Superintendência',
    difficulty: 'Fácil',
    approved: true
  },
  {
    id: 'r4_q05',
    round: 4,
    topic: 'Gerências do Organograma 2024',
    prompt: 'No Organograma SENAR-AR/RO 2024, quais são as três Gerências estruturadas sob a Superintendência?',
    options: [
      'Gerência DAF (Administrativo e Financeiro), Gerência DETEC (Departamento Técnico) e Gerência ATeG (Assistência Técnica e Gerencial).',
      'Gerência de Mineração, Gerência de Exportação Portuária e Gerência Imobiliária.',
      'Gerência de Pavimentação, Gerência de Combustíveis e Gerência Fiscal.',
      'Gerência de Saúde Hospitalar, Gerência de Turismo e Gerência de Varejo.'
    ],
    correctIndex: 0,
    explanation: 'No Organograma Oficial SENAR-AR/RO 2024 aprovado, existem 3 Gerências: Gerência DAF, Gerência DETEC e Gerência ATeG.',
    sourceDocument: 'Organograma SENAR-AR/RO 2024',
    referenceSection: 'Nível Gerencial Superior',
    difficulty: 'Médio',
    approved: true
  },
  {
    id: 'r4_q06',
    round: 4,
    topic: 'Assessorias da Superintendência (Organograma 2024)',
    prompt: 'Quais assessorias estratégicas assessoram diretamente a Superintendência no Organograma SENAR-AR/RO 2024?',
    options: [
      'Assessoria Jurídica, Assessoria de Controle Interno, Assessoria de Comunicação e Assessoria Especial.',
      'Assessoria Parlamentar Externa e Assessoria de Imprensa Esportiva.',
      'Assessoria Militar e Assessoria Consular Internacional.',
      'Assessoria Cambial e Assessoria de Fusões Empresariais.'
    ],
    correctIndex: 0,
    explanation: 'O bloco de Assessorias do Organograma 2024 lista textualmente: Jurídica, Controle Interno, Comunicação e Especial.',
    sourceDocument: 'Organograma SENAR-AR/RO 2024',
    referenceSection: 'Bloco de Assessorias',
    difficulty: 'Médio',
    approved: true
  },
  {
    id: 'r4_q07',
    round: 4,
    topic: 'Significado da CQPLAINT',
    prompt: 'No Organograma SENAR-AR/RO 2024, a que se refere a legenda da coordenadoria CQPLAINT?',
    options: [
      'Coordenadoria de Controle de Qualidade, Gestão e Acompanhamento do Planejamento Estratégico, Inovação e Tecnologia.',
      'Comissão de Queixas e Processos Licitatórios de Ativos e Imóveis Não Tombados.',
      'Central de Qualificação Profissional para Logística Agroindustrial e Internacional.',
      'Conselho de Quotas de Produção de Laticínios e Agropecuária Integrada.'
    ],
    correctIndex: 0,
    explanation: 'A legenda oficial do Organograma 2024 define CQPLAINT como: "Coordenadoria de Controle de Qualidade, Gestão e Acompanhamento do Planejamento Estratégico, Inovação e Tecnologia".',
    sourceDocument: 'Organograma SENAR-AR/RO 2024',
    referenceSection: 'Nota de Rodapé - Legendas',
    difficulty: 'Difícil',
    approved: true
  },
  {
    id: 'r4_q08',
    round: 4,
    topic: 'Destinação de Recursos das Atividades-Fim',
    prompt: 'Qual percentual mínimo da arrecadação líquida deve ser aplicado nas atividades-fim (Formação Profissional Rural e Promoção Social) segundo o Regimento Interno?',
    options: [
      'No mínimo 80% (oitenta por cento).',
      'No máximo 25% (vinte e cinco por cento).',
      'Exatamente 50% (cinquenta por cento).',
      'Apenas 10% (dez por cento).'
    ],
    correctIndex: 0,
    explanation: 'Nos termos do Art. 16, I, do Regimento Interno SENAR-AR/RO, 80% da arrecadação líquida é destinada às atividades de formação profissional rural e promoção social (e 20% para despesas de custeio e investimentos).',
    sourceDocument: 'Regimento Interno SENAR-AR/RO 2017',
    referenceSection: 'Capítulo V - Dos Recursos (Art. 16, I)',
    difficulty: 'Médio',
    approved: true
  },
  {
    id: 'r4_q09',
    round: 4,
    topic: 'Regime Jurídico dos Empregados',
    prompt: 'Qual é o regime jurídico aplicável aos colaboradores do quadro permanente do SENAR-AR/RO?',
    options: [
      'Consolidação das Leis do Trabalho (CLT), com admissão em cargo de provimento efetivo mediante processo seletivo.',
      'Regime estatutário com estabilidade após 3 anos conforme Lei Federal nº 8.112.',
      'Contratação militar com regime disciplinar de caserna.',
      'Trabalho voluntário não remunerado exclusivo.'
    ],
    correctIndex: 0,
    explanation: 'O Art. 27 do Estatuto Social e os Arts. 17 e 18 do Regimento Interno fixam o regime da CLT para os empregados permanentes, com admissão por processo seletivo de provas ou títulos.',
    sourceDocument: 'Estatuto Social Art. 27 / Regimento Interno Art. 17 e 18',
    referenceSection: 'Do Pessoal e Regime Jurídico',
    difficulty: 'Fácil',
    approved: true
  },
  {
    id: 'r4_q10',
    round: 4,
    topic: 'Remuneração de Membros dos Conselhos',
    prompt: 'De acordo com o Estatuto Social do SENAR-RO (Art. 38), qual é a regra quanto à remuneração dos membros dos Conselhos?',
    options: [
      'O Presidente do Conselho Administrativo, seus membros e os do Conselho Fiscal não serão remunerados pelo exercício do mandato.',
      'Recebem salários fixos equivalentes aos de desembargadores do tribunal.',
      'Recebem bonificação percentual sobre a receita total de exportações do estado.',
      'Têm direito a gratificações mensais vitalícias após um mandato.'
    ],
    correctIndex: 0,
    explanation: 'O Art. 38 do Estatuto Social estipula expressamente: "O Presidente do Conselho Administrativo, membros deste, e do Conselho Fiscal não serão remunerados".',
    sourceDocument: 'Estatuto Social do SENAR-RO',
    referenceSection: 'Título IV - Disposições Gerais (Art. 38)',
    difficulty: 'Médio',
    approved: true
  },

  // ==========================================
  // RODADA 5: SEGURANÇA JURÍDICA, INTEGRIDADE E CONFORMIDADE (RLC 2024) (10 QUESTÕES)
  // ==========================================
  {
    id: 'r5_q01',
    round: 5,
    topic: 'Princípios da Licitação e Contratação',
    prompt: 'Segundo o Art. 2º do Regulamento de Licitações e Contratos (RLC - Resolução nº 30/2024/CD), quais princípios e diretrizes orientam a aplicação do regulamento?',
    options: [
      'Seleção da proposta mais vantajosa, transparência, isonomia, ética, integridade, eficiência, sustentabilidade ambiental, econômica e inovação.',
      'Preferência discricionária por amigos de infância dos gestores e sigilo das notas fiscais.',
      'Contratação obrigatória da empresa de menor porte independentemente da qualidade técnica.',
      'Arbitramento de preços com base exclusiva em tabelas informais sem memórias de cálculo.'
    ],
    correctIndex: 0,
    explanation: 'O Art. 2º do RLC enumera expressamente a seleção da proposta mais vantajosa e garantia da transparência, isonomia, ética, integridade, legitimidade, eficiência, celeridade, bem como estímulo à inovação e à sustentabilidade.',
    sourceDocument: 'Regulamento de Licitações e Contratos (RLC - Resolução nº 30/2024/CD)',
    referenceSection: 'Capítulo I - Da Licitação (Art. 2º)',
    difficulty: 'Fácil',
    approved: true
  },
  {
    id: 'r5_q02',
    round: 5,
    topic: 'Modalidades de Licitação',
    prompt: 'Quais são as modalidades de licitação admitidas no Art. 6º do Regulamento de Licitações do SENAR?',
    options: [
      'Concorrência, Concurso, Leilão, Pregão, Convite e Diálogo Competitivo.',
      'Tomada de Preços, Carta Convite Extraordinária e Pregão Presencial Obrigatório.',
      'Apenas Pregão Eletrônico, sendo proibida qualquer outra forma.',
      'Leilão Judicial e Sorteio Lotérico.'
    ],
    correctIndex: 0,
    explanation: 'O Art. 6º do RLC lista taxativamente seis modalidades: I - concorrência; II - concurso; III - leilão; IV - pregão; V - convite; VI - diálogo competitivo.',
    sourceDocument: 'Regulamento de Licitações e Contratos (RLC - Resolução nº 30/2024/CD)',
    referenceSection: 'Capítulo IV - Modalidades, Limites e Critérios (Art. 6º)',
    difficulty: 'Médio',
    approved: true
  },
  {
    id: 'r5_q03',
    round: 5,
    topic: 'Limites da Modalidade Convite',
    prompt: 'Conforme o Art. 7º do RLC consolidado pela Resolução 30/2024/CD, qual é o limite de valor para Convite em compras e demais serviços?',
    options: [
      'Até R$ 826.000,00.',
      'Até R$ 50.000,00.',
      'Até R$ 2.465.000,00.',
      'Até R$ 10.000.000,00.'
    ],
    correctIndex: 0,
    explanation: 'O Art. 7º, II, "a" do RLC estabelece para compras e demais serviços na modalidade convite o limite de até R$ 826.000,00 (acima desse valor aplica-se a concorrência).',
    sourceDocument: 'Regulamento de Licitações e Contratos (RLC - Resolução nº 30/2024/CD)',
    referenceSection: 'Artigo 7º, Inciso II, alínea a',
    difficulty: 'Difícil',
    approved: true
  },
  {
    id: 'r5_q04',
    round: 5,
    topic: 'Dispensa por Valor - Bens e Serviços',
    prompt: 'Qual é o limite atualizado de dispensa de licitação em função do valor para aquisição de bens e serviços comuns (Art. 12, I)?',
    options: [
      'Até o valor de R$ 92.000,00.',
      'Até o valor de R$ 17.600,00.',
      'Até o valor de R$ 330.000,00.',
      'Até o valor de R$ 1.000.000,00.'
    ],
    correctIndex: 0,
    explanation: 'O Art. 12, I do RLC estabelece dispensa de licitação para aquisição de bens e serviços até o valor de R$ 92.000,00 (noventa e dois mil reais).',
    sourceDocument: 'Regulamento de Licitações e Contratos (RLC - Resolução nº 30/2024/CD)',
    referenceSection: 'Capítulo V - Dos Casos de Dispensa e Inexigibilidade (Art. 12, I)',
    difficulty: 'Médio',
    approved: true
  },
  {
    id: 'r5_q05',
    round: 5,
    topic: 'Dispensa por Valor - Engenharia e Arquitetura',
    prompt: 'Para obras, serviços de engenharia, arquitetura ou manutenção automotiva, até que valor a licitação pode ser dispensada (Art. 12, II)?',
    options: [
      'Até o valor de R$ 166.000,00.',
      'Até o valor de R$ 92.000,00.',
      'Até o valor de R$ 500.000,00.',
      'Não há dispensa de licitação para engenharia em hipótese alguma.'
    ],
    correctIndex: 0,
    explanation: 'O Art. 12, II do RLC prevê dispensa na contratação de obras e serviços de engenharia e/ou arquitetura ou manutenção de veículos até R$ 166.000,00 (cento e sessenta e seis mil reais).',
    sourceDocument: 'Regulamento de Licitações e Contratos (RLC - Resolução nº 30/2024/CD)',
    referenceSection: 'Artigo 12, Inciso II',
    difficulty: 'Difícil',
    approved: true
  },
  {
    id: 'r5_q06',
    round: 5,
    topic: 'Inexigibilidade de Licitação',
    prompt: 'Em qual situação legal ocorre a Inexigibilidade de licitação com base no Art. 13 do RLC?',
    options: [
      'Quando houver inviabilidade de competição, como fornecedor exclusivo ou serviços técnicos especializados com profissional de notória especialização.',
      'Sempre que o gestor preferir não publicar edital para ganhar tempo.',
      'Exclusivamente quando o valor do contrato ultrapassar R$ 10 milhões.',
      'Quando a contratação for realizada com empresas estrangeiras sem sede no país.'
    ],
    correctIndex: 0,
    explanation: 'O Art. 13 do RLC estipula que a licitação é inexigível quando houver inviabilidade de competição (fornecedor/representante exclusivo, serviços técnicos de notória especialização, etc.).',
    sourceDocument: 'Regulamento de Licitações e Contratos (RLC - Resolução nº 30/2024/CD)',
    referenceSection: 'Artigo 13, Caput e Incisos',
    difficulty: 'Fácil',
    approved: true
  },
  {
    id: 'r5_q07',
    round: 5,
    topic: 'Fomento a Programas de Integridade',
    prompt: 'O Art. 22 do RLC faculta a exigência de implantação de Programa de Integridade pelo licitante vencedor em qual prazo após a celebração contratual?',
    options: [
      'No prazo de 6 (seis) meses, contados a partir da celebração do contrato.',
      'No prazo improrrogável de 48 horas após a homologação.',
      'Apenas após o término da vigência de 10 anos do contrato.',
      'No prazo de 5 anos.'
    ],
    correctIndex: 0,
    explanation: 'Conforme Art. 22 do RLC (redação da Resolução 30/2024), editais podem prever a implantação de programa de integridade pelo vencedor no prazo de 6 (seis) meses.',
    sourceDocument: 'Regulamento de Licitações e Contratos (RLC - Resolução nº 30/2024/CD)',
    referenceSection: 'Capítulo VII - Fomento à Integridade (Art. 22)',
    difficulty: 'Médio',
    approved: true
  },
  {
    id: 'r5_q08',
    round: 5,
    topic: 'Prazo Máximo de Vigência Contratual',
    prompt: 'Qual é o prazo determinado padrão que os contratos do SENAR não podem ultrapassar, inclusive com eventuais prorrogações (Art. 33)?',
    options: [
      'Limite máximo de 10 (dez) anos (ressalvados casos com investimento de até 35 anos).',
      'Limite improrrogável de 12 (doze) meses.',
      'Prazo indeterminado automático em todos os contratos de compras.',
      'Prazo máximo de 2 anos sem qualquer possibilidade de aditivo.'
    ],
    correctIndex: 0,
    explanation: 'O Art. 33 do RLC fixa que os contratos não poderão ultrapassar o limite de 10 anos (ou até 35 anos nos contratos com investimento que gerem benfeitorias revertidas ao contratante).',
    sourceDocument: 'Regulamento de Licitações e Contratos (RLC - Resolução nº 30/2024/CD)',
    referenceSection: 'Capítulo IX - Dos Contratos (Art. 33)',
    difficulty: 'Médio',
    approved: true
  },
  {
    id: 'r5_q09',
    round: 5,
    topic: 'Garantia de Execução Contratual',
    prompt: 'Quando prevista no edital, a quanto fica limitada a prestação de garantia do contrato segundo o Art. 34 do RLC?',
    options: [
      'Limitada a até 30% (trinta por cento) do valor do contrato.',
      'Obrigatória em 100% do valor do contrato em espécie.',
      'Limitada a no máximo 1% do patrimônio líquido do contratado.',
      'É vedada a exigência de qualquer modalidade de garantia.'
    ],
    correctIndex: 0,
    explanation: 'O Art. 34 do RLC prevê que a prestação de garantia contratual, quando prevista no edital, será limitada a até 30% do valor do contrato (em caução em dinheiro, fiança bancária ou seguro-garantia).',
    sourceDocument: 'Regulamento de Licitações e Contratos (RLC - Resolução nº 30/2024/CD)',
    referenceSection: 'Artigo 34, Caput',
    difficulty: 'Médio',
    approved: true
  },
  {
    id: 'r5_q10',
    round: 5,
    topic: 'Impedimento Nacional de Licitar',
    prompt: 'Nas hipóteses graves de fraude, falsidade ideológica ou conduta inidônea na licitação (Art. 41), qual é a sanção aplicável?',
    options: [
      'Impedimento do direito de licitar com abrangência nacional, por prazo mínimo de 4 anos e máximo de 6 anos.',
      'Advertência verbal sem registro em cadastro.',
      'Multa simbólica de um salário mínimo e contratação imediata.',
      'Suspensão local de apenas 30 dias restrita à cidade de Porto Velho.'
    ],
    correctIndex: 0,
    explanation: 'O Art. 41 do RLC prevê penalidade de impedimento de licitar com abrangência nacional, por prazo mínimo de 4 (quatro) anos e máximo de 6 (seis) anos, nos casos de declaração falsa, fraude ou conduta inidônea.',
    sourceDocument: 'Regulamento de Licitações e Contratos (RLC - Resolução nº 30/2024/CD)',
    referenceSection: 'Artigo 41 (Redação Resolução nº 30/2024/CD)',
    difficulty: 'Difícil',
    approved: true
  }
];

// Lot to pieces map: 5 lots x 5 pieces each = 25 pieces on a 5x5 board
// Balanced distribution across board perspectives and rows
export const LOT_PIECES_MAP: Record<number, number[]> = {
  1: [0, 6, 12, 18, 24], // Lot 1 (Main diagonal & anchors)
  2: [1, 7, 13, 19, 20], // Lot 2
  3: [2, 8, 14, 15, 21], // Lot 3
  4: [3, 9, 10, 16, 22], // Lot 4
  5: [4, 5, 11, 17, 23]  // Lot 5
};

export const ROUND_NAMES: Record<number, { title: string; subtitle: string; lotNumber: number }> = {
  1: {
    title: 'Rodada 1 — Identidade e Direcionadores Estratégicos',
    subtitle: 'Propósito institucional, lema, missão, visão e resultados para o produtor rural',
    lotNumber: 1
  },
  2: {
    title: 'Rodada 2 — Mapa Estratégico e Balanced Scorecard (BSC)',
    subtitle: 'Perspectivas Sociedade, Clientes, Processos Internos e Aprendizado e Crescimento',
    lotNumber: 2
  },
  3: {
    title: 'Rodada 3 — Cadeia de Valor do SENAR-AR/RO',
    subtitle: 'Alçada decisória, processos de gestão, finalísticos, suporte e valor público',
    lotNumber: 3
  },
  4: {
    title: 'Rodada 4 — Estrutura Organizacional, Governança e Competências',
    subtitle: 'Estatuto, Regimento Interno, Conselhos, Superintendência e Organograma 2024',
    lotNumber: 4
  },
  5: {
    title: 'Rodada 5 — Segurança Jurídica, Integridade e Conformidade',
    subtitle: 'Regulamento de Licitações e Contratos (RLC - Resolução nº 30/2024/CD)',
    lotNumber: 5
  }
};
