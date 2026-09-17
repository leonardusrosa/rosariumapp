import type { DailyLiturgyData, LiturgyItem, VestmentColor } from '@shared/liturgyTypes';

const memoryCache = new Map<string, DailyLiturgyData>();

function cleanHtml(raw: string): string {
  if (!raw) return '';
  return raw
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&#8211;/gi, '–')
    .replace(/&#8220;/gi, '“')
    .replace(/&#8221;/gi, '”')
    .replace(/&#8217;/gi, '’')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

function detectVestmentColor(entryContentSnippet: string): { color: VestmentColor; label: string } {
  const snippet = entryContentSnippet.toLowerCase();

  // Check explicit color codes in HTML spans/styles
  if (snippet.includes('#339966') || snippet.includes('verde') || snippet.includes('depois de pentecostes')) {
    return { color: 'green', label: 'Verde' };
  }
  if (snippet.includes('#ff0000') || snippet.includes('vermelho') || snippet.includes('mártir') || snippet.includes('martires')) {
    return { color: 'red', label: 'Vermelho' };
  }
  if (snippet.includes('#800080') || snippet.includes('#993366') || snippet.includes('roxo') || snippet.includes('quaresma') || snippet.includes('advento')) {
    return { color: 'violet', label: 'Roxo' };
  }
  if (snippet.includes('#000000') && (snippet.includes('defuntos') || snippet.includes('réquiem') || snippet.includes('preto'))) {
    return { color: 'black', label: 'Preto' };
  }
  return { color: 'white', label: 'Branco' };
}

export function parseLiturgyHtml(html: string, date: string, sourceUrl?: string): DailyLiturgyData {
  // Isolate entry-content if available
  const entryMatch = html.match(/<div[^>]*class="[^"]*entry-content[^"]*"[^>]*>([\s\S]*?)<\/div>/i);
  const content = entryMatch ? entryMatch[1] : html;

  // 1. Title
  let title = '';
  // Check center H1 inside entry-content (for Saints feasts)
  const innerH1 = content.match(/<h1[^>]*style="[^"]*text-align:\s*center[^"]*"[^>]*>([\s\S]*?)<\/h1>/i);
  if (innerH1) {
    title = cleanHtml(innerH1[1]);
  } else {
    // Check main article title or post title
    const mainTitle = html.match(/<h1[^>]*class="[^"]*entry-title[^"]*"[^>]*>([\s\S]*?)<\/h1>/i)
      || html.match(/<title>([\s\S]*?)<\/title>/i);
    if (mainTitle) {
      title = cleanHtml(mainTitle[1]).replace(/–\s*Irmandade.*$/i, '').trim();
    }
  }

  // 2. Class & Rubrics
  let liturgicalClass = '';
  const classMatch = content.match(/<p style="text-align:\s*center"><span[^>]*style="[^"]*color:\s*(#[0-9a-fA-F]{3,6})[^"]*"[^>]*><strong>([\s\S]*?)<\/strong><\/span><\/p>/i)
    || content.match(/(F(?:esta|éria|eria)\s+de\s+[1234]ª\s+Classe[^<\n]*)/i);

  if (classMatch) {
    liturgicalClass = cleanHtml(classMatch[2] || classMatch[1]);
  }

  // If title was just a generic date, use liturgical class or title
  if (!innerH1 && liturgicalClass) {
    title = liturgicalClass.replace(/^F(?:esta|éria|eria)\s+de\s+[1234]ª\s+Classe\s*–\s*/i, '');
  }
  if (!title) {
    title = 'Santa Missa Tradicional';
  }

  const { color: vestmentColor, label: colorLabel } = detectVestmentColor(content.slice(0, 2000));

  // 3. Spiritual Commentary (Dom Gaspar Lefebvre)
  let commentary = '';
  const commentaryMatch = content.match(/<p style="text-align:\s*justify"><span style="color:\s*#000000">([\s\S]*?)<\/span><\/p>/i);
  if (commentaryMatch) {
    commentary = cleanHtml(commentaryMatch[1]);
  }

  // 4. Missal pages & Mass time
  let missalPages = '';
  const pagesMatch = content.match(/Páginas\s+.*?do Missal Quotidiano[^<.]*/i);
  if (pagesMatch) {
    missalPages = cleanHtml(pagesMatch[0]);
  }

  // 5. Sections (Introito, Coleta, etc.)
  const sections: LiturgyItem[] = [];
  const h3Regex = /<h3[^>]*>([\s\S]*?)<\/h3>([\s\S]*?)(?=<h3|$|<hr\s*\/?>\s*<h2|id="comments"|class="comments-area")/gi;
  let sectionMatch: RegExpExecArray | null;

  while ((sectionMatch = h3Regex.exec(content)) !== null) {
    const rawH3 = sectionMatch[1];
    const blockContent = sectionMatch[2];

    const rawTitle = cleanHtml(rawH3.replace(/<a[\s\S]*?<\/a>/gi, ''));
    // Filter out non-liturgical headings
    if (/coment|compartilh|relacionad|deixe um|leia mais/i.test(rawTitle)) {
      continue;
    }

    const audioMatch = rawH3.match(/href="(https?:\/\/[^"]+(?:ccwatershed\.org|download\/|audio)[^"]*)"/i)
      || blockContent.match(/href="(https?:\/\/[^"]+(?:ccwatershed\.org|download\/|audio)[^"]*)"/i);
    const audioUrl = audioMatch ? audioMatch[1] : undefined;

    let sectionTitle = rawTitle;
    let sectionReference = '';

    const refMatch = rawTitle.match(/\(([^)]+)\)?/);
    if (refMatch) {
      sectionReference = refMatch[1];
      sectionTitle = rawTitle.replace(/\([^)]*\)?/, '').trim();
    }

    // Extract Latin and Portuguese table cells
    let latin = '';
    let portuguese = '';

    const cells: string[] = [];
    const tdRegex = /<td[^>]*>([\s\S]*?)<\/td>/gi;
    let tdMatch: RegExpExecArray | null;
    while ((tdMatch = tdRegex.exec(blockContent)) !== null) {
      cells.push(cleanHtml(tdMatch[1]));
    }

    if (cells.length >= 2) {
      latin = cells[0];
      portuguese = cells[1];
    } else if (cells.length === 1) {
      portuguese = cells[0];
    }

    if (latin || portuguese) {
      sections.push({
        id: `sec-${sections.length + 1}-${sectionTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
        title: sectionTitle,
        reference: sectionReference || undefined,
        latin,
        portuguese,
        audioUrl
      });
    }
  }

  return {
    date,
    title,
    liturgicalClass: liturgicalClass || 'Missa Tridentina',
    vestmentColor,
    colorLabel,
    commentary: commentary || undefined,
    missalPages: missalPages || undefined,
    sourceUrl,
    sections
  };
}

export async function fetchDailyLiturgy(dateStr: string): Promise<DailyLiturgyData> {
  const cached = memoryCache.get(dateStr);
  if (cached) return cached;

  const [year, month, day] = dateStr.split('-');
  const primaryUrl = `https://irmandadedocarmo.org/${year}/${month}/${day}/liturgia-diaria-${day}-${month}-${year}/`;

  try {
    const res = await fetch(primaryUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 RosariumApp/1.0',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      },
      signal: AbortSignal.timeout(10000)
    });

    if (res.ok) {
      const html = await res.text();
      const parsed = parseLiturgyHtml(html, dateStr, primaryUrl);
      if (parsed.sections.length > 0) {
        memoryCache.set(dateStr, parsed);
        return parsed;
      }
    }
  } catch (err) {
    console.warn(`[LiturgyParser] Fetch failed for ${dateStr}:`, err);
  }

  // Fallback: Check RSS feed
  try {
    const feedRes = await fetch('https://irmandadedocarmo.org/category/liturgia-diaria/feed/', {
      headers: { 'User-Agent': 'Mozilla/5.0 RosariumApp/1.0' },
      signal: AbortSignal.timeout(8000)
    });

    if (feedRes.ok) {
      const feedXml = await feedRes.text();
      const datePattern = `${day}[/-]${month}[/-]${year}`;
      const itemRegex = new RegExp(`<item>[\\s\\S]*?<title>[^<]*?${datePattern}[\\s\\S]*?<content:encoded><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/content:encoded>[\\s\\S]*?<\\/item>`, 'i');
      const itemMatch = feedXml.match(itemRegex);

      if (itemMatch && itemMatch[1]) {
        const parsed = parseLiturgyHtml(itemMatch[1], dateStr, primaryUrl);
        if (parsed.sections.length > 0) {
          memoryCache.set(dateStr, parsed);
          return parsed;
        }
      }
    }
  } catch (err) {
    console.warn(`[LiturgyParser] Feed search failed for ${dateStr}:`, err);
  }

  return getOfflineFallbackLiturgy(dateStr);
}

function getOfflineFallbackLiturgy(dateStr: string): DailyLiturgyData {
  return {
    date: dateStr,
    title: 'Missa do Domingo — XIV Depois de Pentecostes',
    liturgicalClass: 'Féria de 4ª Classe – Missa do Domingo',
    vestmentColor: 'green',
    colorLabel: 'Verde',
    commentary: 'Dois senhores disputam-se o domínio do homem: o espírito e a carne. O espírito do mundo e o Espírito de Deus. Dois senhores querem mandar. E categoricamente diz o Evangelho: Ninguém pode servir a dois senhores.',
    missalPages: 'Páginas 652 a 656 do Missal Quotidiano (D. Gaspar Lefebvre, 1963)',
    sections: [
      {
        id: 'introito',
        title: 'Introito',
        reference: 'Sl 83, 10-11 | ib., 2-3',
        latin: 'Protéctor noster, áspice, Deus, et réspice in fáciem Christi tui: quia mélior est dies una in átriis tuis super mília. Ps. Quam dilécta tabernácula tua, Dómine virtútum! concupíscit, et déficit ánima mea in átria Dómini. ℣. Glória Patri...',
        portuguese: 'Volvei o olhar para nós, ó Deus, nosso protetor, e contemplai a face de vosso Ungido. É melhor um só dia em vossos átrios que mil, longe de Vós. Sl. Como são amáveis vossos tabernáculos, Senhor dos exércitos! Desfalece a minha alma, suspirando pelos átrios do Senhor ℣. Glória ao Pai...'
      },
      {
        id: 'coleta',
        title: 'Coleta',
        latin: 'Custódi, Dómine, quǽsumus, Ecclésiam tuam propitiatióne perpétua: et quia sine te lábitur humána mortálitas; tuis semper auxíliis et abstrahátur a nóxiis et ad salutária dirigátur. Per D.N.',
        portuguese: 'Senhor, guardai a vossa Igreja com vossa constante misericórdia, e porque sem Vós a fraqueza humana desfalece, com o vosso auxílio afastai-a sempre do que é nocivo e conduzi-a para o que é salutar. Por N. S.'
      },
      {
        id: 'epistola',
        title: 'Epístola',
        reference: 'Gl 5, 16-24',
        latin: 'Léctio Epístolæ beáti Pauli Apóstoli ad Gálatas.\nFratres: Spíritu ambuláte, et desidéria carnis non perficiétis. Caro enim concupíscit advérsus spíritum, spíritus autem advérsus carnem: hæc enim sibi ínvicem adversántur, ut non quæcúmque vultis, illa faciátis.',
        portuguese: 'Leitura da Epístola de São Paulo Apóstolo aos Gálatas.\nIrmãos: Andai segundo o Espírito e não satisfareis os desejos da carne. Porque a carne tem desejos contrários ao espírito, e o espírito à carne: pois estas coisas são contrárias entre si, para que não façais tudo o que quereis.'
      },
      {
        id: 'evangelho',
        title: 'Evangelho',
        reference: 'Mt 6, 24-33',
        latin: 'Sequéntia sancti Evangélii secúndum Matthǽum.\nIn illo témpore: Dixit Iesus discípulis suis: Nemo potest duóbus dóminis servíre: aut enim unum ódio habébit, et álterum díliget: aut unum sustinébit, et álterum contémnet. Non potéstis Deo servíre et mammónæ.',
        portuguese: 'Sequência do Santo Evangelho segundo Mateus.\nNaquele tempo, disse Jesus a seus discípulos: Ninguém pode servir a dois senhores. Porque, ou há de aborrecer a um e amar o outro, ou há de acomodar-se a este e desprezar àquele. Não podeis servir a Deus e às riquezas.'
      }
    ]
  };
}
