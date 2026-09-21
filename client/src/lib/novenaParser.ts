export interface NovenaDay {
  dayNumber: number;
  title: string;
  content: string;
}

export interface NovenaData {
  isNovena: boolean;
  totalDays: number;
  initialPrayers?: string;
  days: NovenaDay[];
  closingPrayers?: string;
}

interface DayPattern {
  num: number;
  regex: RegExp;
}

const DAY_PATTERNS: DayPattern[] = [
  { num: 1, regex: /(?:^|\n)\s*(?:[•\-\*]\s*)?(?:1[º°ªa]?\s*Dia|Dia\s*1|Primeiro\s*Dia)\b[^\n]*/i },
  { num: 2, regex: /(?:^|\n)\s*(?:[•\-\*]\s*)?(?:2[º°ªa]?\s*Dia|Dia\s*2|Segundo\s*Dia)\b[^\n]*/i },
  { num: 3, regex: /(?:^|\n)\s*(?:[•\-\*]\s*)?(?:3[º°ªa]?\s*Dia|Dia\s*3|Terceiro\s*Dia)\b[^\n]*/i },
  { num: 4, regex: /(?:^|\n)\s*(?:[•\-\*]\s*)?(?:4[º°ªa]?\s*Dia|Dia\s*4|Quarto\s*Dia)\b[^\n]*/i },
  { num: 5, regex: /(?:^|\n)\s*(?:[•\-\*]\s*)?(?:5[º°ªa]?\s*Dia|Dia\s*5|Quinto\s*Dia)\b[^\n]*/i },
  { num: 6, regex: /(?:^|\n)\s*(?:[•\-\*]\s*)?(?:6[º°ªa]?\s*Dia|Dia\s*6|Sexto\s*Dia)\b[^\n]*/i },
  { num: 7, regex: /(?:^|\n)\s*(?:[•\-\*]\s*)?(?:7[º°ªa]?\s*Dia|Dia\s*7|S[eé]timo\s*Dia)\b[^\n]*/i },
  { num: 8, regex: /(?:^|\n)\s*(?:[•\-\*]\s*)?(?:8[º°ªa]?\s*Dia|Dia\s*8|Oitavo\s*Dia)\b[^\n]*/i },
  { num: 9, regex: /(?:^|\n)\s*(?:[•\-\*]\s*)?(?:9[º°ªa]?\s*Dia|Dia\s*9|Nono\s*Dia)\b[^\n]*/i },
];

const CLOSING_PATTERN = /(?:^|\n)\s*(?:[•\-\*]\s*)?(?:Oraç(?:ão|ões)\s+Fina(?:l|is)|Conclusão|Oraç(?:ão|ões)\s+para\s+todos\s+os\s+dias(?:\s+depois)?)\b[^\n]*/i;

export function parseNovena(content: string): NovenaData | null {
  if (!content || typeof content !== 'string') return null;

  const matches: Array<{ num: number; index: number; rawHeader: string }> = [];

  for (const pattern of DAY_PATTERNS) {
    const match = pattern.regex.exec(content);
    if (match) {
      const leadingNewline = match[0].startsWith('\n') ? 1 : 0;
      matches.push({
        num: pattern.num,
        index: match.index + leadingNewline,
        rawHeader: match[0].trim()
      });
    }
  }

  // Require at least 2 distinct days to qualify as a structured Novena
  if (matches.length < 2) return null;

  // Sort by appearance in text
  matches.sort((a, b) => a.index - b.index);

  const initialPrayers = content.slice(0, matches[0].index).trim();
  const days: NovenaDay[] = [];

  // Check for closing prayer section after the last day
  const lastMatch = matches[matches.length - 1];
  const remainingText = content.slice(lastMatch.index);
  const closingMatch = CLOSING_PATTERN.exec(remainingText);

  let closingPrayers: string | undefined = undefined;
  let closingCutoffIndex = content.length;

  if (closingMatch && closingMatch.index > 0) {
    closingCutoffIndex = lastMatch.index + closingMatch.index + (closingMatch[0].startsWith('\n') ? 1 : 0);
    closingPrayers = content.slice(closingCutoffIndex).trim();
  }

  for (let i = 0; i < matches.length; i++) {
    const curr = matches[i];
    const next = matches[i + 1];
    const endIndex = next ? next.index : closingCutoffIndex;
    const dayText = content.slice(curr.index, endIndex).trim();

    const lines = dayText.split('\n');
    const dayTitle = lines[0].replace(/^[•\-\*\t\s]+/, '').trim();
    const dayBody = lines.slice(1).join('\n').trim();

    days.push({
      dayNumber: curr.num,
      title: dayTitle,
      content: dayBody
    });
  }

  return {
    isNovena: true,
    totalDays: days.length,
    initialPrayers: initialPrayers.length > 0 ? initialPrayers : undefined,
    days,
    closingPrayers: closingPrayers && closingPrayers.length > 0 ? closingPrayers : undefined
  };
}
