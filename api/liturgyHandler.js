// Parser and fetcher for Daily Liturgy on Vercel Serverless
const memoryCache = new Map();

function cleanHtml(raw) {
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

function detectVestmentColor(htmlSnippet, textSnippet) {
  const lowerHtml = (htmlSnippet || '').toLowerCase();
  const lowerText = (textSnippet || '').toLowerCase();

  if (lowerHtml.includes('#ff0000') || lowerHtml.includes('red') || lowerText.includes('mártir') || lowerText.includes('martires')) {
    return { color: 'red', label: 'Vermelho' };
  }
  if (lowerHtml.includes('#339966') || lowerHtml.includes('green') || lowerText.includes('verde') || lowerText.includes('depois de pentecostes')) {
    return { color: 'green', label: 'Verde' };
  }
  if (lowerHtml.includes('#800080') || lowerHtml.includes('#993366') || lowerText.includes('roxo') || lowerText.includes('quaresma') || lowerText.includes('advento')) {
    return { color: 'violet', label: 'Roxo' };
  }
  if (lowerText.includes('defuntos') || lowerText.includes('réquiem') || lowerText.includes('preto')) {
    return { color: 'black', label: 'Preto' };
  }
  return { color: 'white', label: 'Branco' };
}

export function parseLiturgyHtml(html, date, sourceUrl) {
  let title = '';
  const titleMatch = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i) || html.match(/<title>([\s\S]*?)<\/title>/i);
  if (titleMatch) {
    title = cleanHtml(titleMatch[1]).replace(/–\s*Irmandade.*$/i, '').replace(/Liturgia Diária\s*–\s*/i, '').trim();
  }
  if (!title) title = 'Santa Missa Tradicional';

  let liturgicalClass = '';
  const classMatch = html.match(/<(?:strong|span|p)[^>]*style="[^"]*color:\s*(#[0-9a-fA-F]{3,6})[^"]*"[^>]*>([\s\S]*?F(?:esta|éria|eria|olga)[^<]*)<\/(?:strong|span|p)>/i)
    || html.match(/(F(?:esta|éria|eria)\s+de\s+[1234]ª\s+Classe[^<\n]*)/i);
  
  const classColorCode = classMatch ? classMatch[1] || '' : '';
  if (classMatch) {
    liturgicalClass = cleanHtml(classMatch[2] || classMatch[1]);
  }

  const { color: vestmentColor, label: colorLabel } = detectVestmentColor(classColorCode + html.slice(0, 3000), liturgicalClass + ' ' + title);

  let commentary = '';
  const commentaryMatch = html.match(/<p style="text-align:\s*justify"><span style="color:\s*#000000">([\s\S]*?)<\/span><\/p>/i);
  if (commentaryMatch) {
    commentary = cleanHtml(commentaryMatch[1]);
  }

  let missalPages = '';
  const pagesMatch = html.match(/Páginas\s+.*?do Missal Quotidiano[^<.]*/i);
  if (pagesMatch) {
    missalPages = cleanHtml(pagesMatch[0]);
  }

  const sections = [];
  const h3Regex = /<h3[^>]*>([\s\S]*?)<\/h3>([\s\S]*?)(?=<h3|$|<hr\s*\/?>\s*<h2)/gi;
  let sectionMatch;

  while ((sectionMatch = h3Regex.exec(html)) !== null) {
    const rawH3 = sectionMatch[1];
    const blockContent = sectionMatch[2];

    const audioMatch = rawH3.match(/href="(https?:\/\/[^"]+\.(?:mp3|wav|ogg|download\/)[^"]*)"/i)
      || blockContent.match(/href="(https?:\/\/[^"]+(?:ccwatershed\.org|audio)[^"]*)"/i);
    const audioUrl = audioMatch ? audioMatch[1] : undefined;

    const sectionTitleFull = cleanHtml(rawH3.replace(/<a[\s\S]*?<\/a>/gi, ''));
    let sectionTitle = sectionTitleFull;
    let sectionReference = '';

    const refMatch = sectionTitleFull.match(/\(([^)]+)\)/);
    if (refMatch) {
      sectionReference = refMatch[1];
      sectionTitle = sectionTitleFull.replace(/\([^)]+\)/, '').trim();
    }

    let latin = '';
    let portuguese = '';

    const cells = [];
    const tdRegex = /<td[^>]*>([\s\S]*?)<\/td>/gi;
    let tdMatch;
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
        id: `sec-${sections.length + 1}-${sectionTitle.toLowerCase().replace(/\s+/g, '-')}`,
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

export async function fetchDailyLiturgy(dateStr) {
  const cached = memoryCache.get(dateStr);
  if (cached) return cached;

  const [year, month, day] = dateStr.split('-');
  const primaryUrl = `https://irmandadedocarmo.org/${year}/${month}/${day}/liturgia-diaria-${day}-${month}-${year}/`;

  try {
    const res = await fetch(primaryUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 RosariumApp/1.0',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      }
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
    console.warn(`[Liturgy] Vercel fetch error:`, err);
  }

  return {
    date: dateStr,
    title: 'Missa Tradicional',
    liturgicalClass: 'Missa Tridentina',
    vestmentColor: 'green',
    colorLabel: 'Verde',
    commentary: 'Liturgia tradicional conforme as rubricas do Missale Romanum de 1962.',
    sections: []
  };
}
