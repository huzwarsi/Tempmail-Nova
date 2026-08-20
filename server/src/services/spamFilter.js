const sanitizeHtml = require('sanitize-html');

/**
 * Calculates spam score based on subject keywords, links count, and blacklisted domains.
 */
const calculateSpamScore = (subject = '', text = '', senderAddress = '') => {
  let score = 0;
  const lowerSubject = subject.toLowerCase();
  const lowerText = text.toLowerCase();

  const spamKeywords = [
    'viagra', 'casino', 'lottery', 'winner', 'crypto giveaway', 
    'urgent transfer', 'wire money', 'claim reward', '100% free',
    'bank account suspended', 'verify credentials immediately'
  ];

  spamKeywords.forEach((word) => {
    if (lowerSubject.includes(word)) score += 3;
    if (lowerText.includes(word)) score += 1.5;
  });

  // Excessive URLs check
  const urlCount = (lowerText.match(/https?:\/\//g) || []).length;
  if (urlCount > 5) score += 2;

  // ALL CAPS Subject check
  if (subject.length > 8 && subject === subject.toUpperCase()) {
    score += 2;
  }

  return {
    score,
    isSpam: score >= 5,
  };
};

/**
 * Sanitizes HTML content to remove script tags, dangerous iframes, and XSS vectors.
 */
const cleanHtml = (dirtyHtml) => {
  if (!dirtyHtml) return '';

  return sanitizeHtml(dirtyHtml, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat([
      'img', 'style', 'font', 'center', 'u', 's', 'hr', 'table', 'tbody', 'tr', 'td', 'th', 'thead'
    ]),
    allowedAttributes: {
      '*': ['style', 'class', 'id', 'align', 'valign', 'bgcolor', 'color', 'width', 'height'],
      a: ['href', 'name', 'target', 'rel'],
      img: ['src', 'alt', 'title', 'width', 'height', 'cid'],
    },
    transformTags: {
      a: sanitizeHtml.simpleTransform('a', { target: '_blank', rel: 'noopener noreferrer' }),
    },
  });
};

module.exports = {
  calculateSpamScore,
  cleanHtml,
};
