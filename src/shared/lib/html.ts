const entities: Record<string, string> = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#39;': "'",
  '&apos;': "'",
  '&nbsp;': ' ',
};

/** Превращает HTML-строку (например, summary из TVmaze) в обычный текст. */
export const htmlToText = (html: string | null | undefined): string => {
  if (!html) return '';
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&(amp|lt|gt|quot|#39|apos|nbsp);/g, (entity) => entities[entity])
    .replace(/\s+/g, ' ')
    .trim();
};
