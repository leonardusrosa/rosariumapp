import { BookEnrichment } from "@/types/bibliotheca";

export const SAMPLE_ENRICHMENTS: Record<string, BookEnrichment> = {
  "w-1": {
    workId: "w-1",
    synopsis: {
      noSpoilers:
        "Em São Petersburgo, Rodion Raskólnikov, um ex-estudante mergulhado na miséria, formula uma teoria segundo a qual indivíduos extraordinários têm o direito moral de transgredir normas vigentes em nome de um bem maior. Ele comete um assassinato planejado e é consumido pela culpa e pelo cerco psicológico da justiça.",
      readingGuide:
        "Observe como Dostoiévski contrasta o racionalismo utilitarista do século XIX com a psicologia moral e espiritual. Atente para os diálogos entre Raskólnikov e o juiz de instrução Porfíri Petróvitch, marcados pelo jogo de gato e rato psicológico.",
      fullAnalysis:
        "A redenção de Raskólnikov na Sibéria, acompanhada pelo sacrifício evangélico de Sônia Marmeládova, consolida a refutação da teoria do homem superior e a necessidade de expiação espiritual para o restabelecimento do elo humano."
    },
    context:
      "Publicado originalmente em 1866 na revista O Mensageiro Russo, o romance reflete as convulsões sociais da Rússia pós-reforma e a crítica de Dostoiévski ao niilismo e ao racionalismo ocidentalizante.",
    facts: [
      "Dostoiévski escreveu a obra sob intensa pressão financeira para saldar dívidas com credores.",
      "O conceito de homem extraordinário antecipa discussões filosóficas contemporâneas sobre poder e moralidade.",
      "A São Petersburgo retratada possui geografia real com ruas, praças e pontes identificáveis."
    ],
    themes: ["Culpa e Redenção", "Niilismo Russo", "Psicologia do Crime", "Livre-arbítrio"],
    relatedWorkIds: ["w-7", "w-12", "w-9"]
  },
  "w-2": {
    workId: "w-2",
    synopsis: {
      noSpoilers:
        "Santo Agostinho relata a trajetória de sua juventude pagã, seus descaminhos intelectuais e paixões até a dramática conversão ao cristianismo em Milão, estabelecendo os fundamentos da autobiografia introspectiva ocidental.",
      readingGuide:
        "Preste atenção à transição entre a narrativa biográfica (livros I–IX) e a reflexão filosófica sobre memória, tempo e criação (livros X–XIII).",
      fullAnalysis:
        "A obra culmina na célebre reflexão do Livro XI sobre o tempo: 'O que é o tempo? Se ninguém me perguntar, eu sei; se quiser explicá-lo, não sei.' A interioridade da alma torna-se o palco onde Deus é encontrado."
    },
    context:
      "Escrito por volta de 397–400 d.C., durante o bispado de Agostinho em Hipona, o texto articula o neoplatonismo cristão no declínio do Império Romano.",
    facts: [
      "Primeira grande autobiografia psicológica e espiritual da história ocidental.",
      "A famosa cena da figueira em Milão foi impulsionada pela voz misteriosa: 'Tolle, lege' (Toma e lê).",
      "O Livro X contém uma das mais influentes teorias da memória da Antiguidade Tardia."
    ],
    themes: ["Graça e Livre-arbítrio", "Filosofia do Tempo", "Memória e Interioridade"],
    relatedWorkIds: ["w-9", "w-4", "w-6"]
  },
  "w-4": {
    workId: "w-4",
    synopsis: {
      noSpoilers:
        "A jornada alegórica de Dante Alighieri pelos três reinos do além — Inferno, Purgatório e Paraíso — guiado pelo poeta Virgílio e depois por sua musa Beatriz.",
      readingGuide:
        "Observe o esquema rigoroso da terza rima (aba bcb cdc) e o conceito de contrapasso, onde cada castigo reflete poeticamente a natureza do pecado.",
      fullAnalysis:
        "A ascensão ao Empíreo culmina na visão beatífica da Trindade e no encerramento: 'O amor que move o sol e as outras estrelas', fundindo teologia escolástica e paixão poética."
    },
    context:
      "Composta entre 1308 e 1320 no exílio florentino de Dante, a comédia funda a língua literária italiana e sintetiza a cosmovisão medieval.",
    facts: [
      "A obra possui exatos 100 cantos: 1 de introdução e 33 para cada um dos três reinos.",
      "O epíteto 'Divina' foi adicionado por Giovanni Boccaccio décadas após a morte de Dante.",
      "Virgílio guia Dante pelo Inferno e Purgatório, mas por ser pagão não pode ascender ao Paraíso."
    ],
    themes: ["Justiça Divina", "Ordem Cosmológica", "Amor Idealizado", "Política Medieval"],
    relatedWorkIds: ["w-11", "w-2", "w-3"]
  },
  "w-9": {
    workId: "w-9",
    synopsis: {
      noSpoilers:
        "Caderno pessoal de pensamentos, reflexões e exortações éticas do imperador romano Marco Aurélio, escrito para si mesmo durante as campanhas militares no Danúbio.",
      readingGuide:
        "Leia sem pressa, como aforismos cotidianos sobre impermanência, serenidade, controle sobre os próprios julgamentos e dever para com a comunidade.",
      fullAnalysis:
        "A obra consolida o estoicismo tardio: a distinção central entre o que depende de nós (vontade e virtude) e o que não depende (circunstâncias e morte)."
    },
    context:
      "Redigido em grego koiné entre 170 e 180 d.C. nas fronteiras do Império durante as guerras marcomanas e a Peste Antonina.",
    facts: [
      "O texto nunca foi destinado à publicação pública; seu título original grego é 'Para si mesmo'.",
      "Marco Aurélio governou o Império Romano no auge da Pax Romana, sendo o último dos 'Cinco Bons Imperadores'.",
      "O manuscrito sobreviveu por cópias esparsas preservadas no Império Bizantino."
    ],
    themes: ["Estoicismo", "Impermanência", "Dever e Razão", "Autodomínio"],
    relatedWorkIds: ["w-6", "w-2", "w-1"]
  },
  "w-12": {
    workId: "w-12",
    synopsis: {
      noSpoilers:
        "Josef K., bancário respeitado, é detido certa manhã sem motivo aparente e sem ter feito nada de errado. Ele é arrastado por um labirinto judiciário opaco e absurdo.",
      readingGuide:
        "Preste atenção na banalidade burocrática dos tribunais instalados em sótãos sombrios e na parábola 'Diante da Lei' narrada pelo sacerdote na catedral.",
      fullAnalysis:
        "A parábola 'Diante da Lei' revela que a porta da lei foi feita exclusivamente para K., expondo a culpa imanente do indivíduo moderno diante do poder inacessível."
    },
    context:
      "Escrito em Praga em 1914-1915 e publicado postumamente em 1925 por Max Brod, contra a vontade de Kafka expressa em seu testamento.",
    facts: [
      "Kafka instruiu Max Brod a queimar todos os seus manuscritos inéditos, desejo que Brod desobedeceu.",
      "A palavra 'kafkiano' entrou para o vocabulário universal para designar situações burocráticas absurdas e opressivas.",
      "O romance foi publicado inacabado com os capítulos organizados postumamente por Brod."
    ],
    themes: ["Burocracia Absurda", "Alienação Moderna", "Lei e Justiça", "Culpa Inexplicável"],
    relatedWorkIds: ["w-1", "w-5", "w-10"]
  }
};

export function getBookEnrichment(workId: string): BookEnrichment {
  if (SAMPLE_ENRICHMENTS[workId]) {
    return SAMPLE_ENRICHMENTS[workId];
  }

  // Fallback graceful curated enrichment for remaining works
  return {
    workId,
    synopsis: {
      noSpoilers:
        "Obra seminal da tradição literária e filosófica ocidental, oferecendo reflexões atemporais sobre a condição humana, virtude e destino.",
      readingGuide:
        "Recomenda-se leitura atenta ao contexto histórico da edição e às notas de tradução para apreensão plena do vocabulário e forma clássica.",
      fullAnalysis:
        "Estudos acadêmicos destacam a coesão estrutural da narrativa e a profunda ressonância estética entre o propósito do autor e a recepção canônica."
    },
    context: "Texto canônico estabelecido com ampla fortuna crítica na história da literatura e do pensamento clássico.",
    facts: [
      "Obra conservada e reeditada continuamente através dos séculos em múltiplas tradições linguísticas.",
      "Exemplar influente nos cânones universitários e acervos históricos de estudos literários."
    ],
    themes: ["Condição Humana", "Tradição Clássica", "Destino e Razão"],
    relatedWorkIds: ["w-1", "w-4", "w-9"]
  };
}
