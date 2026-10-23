// Simple AI sentiment analysis using keyword scoring
const positiveWords = [
  'excellent', 'great', 'good', 'amazing', 'wonderful', 'fantastic', 'helpful',
  'clear', 'best', 'love', 'perfect', 'outstanding', 'brilliant', 'superb',
  'satisfied', 'happy', 'enjoyed', 'interesting', 'engaging', 'knowledgeable'
];

const negativeWords = [
  'bad', 'poor', 'terrible', 'awful', 'boring', 'slow', 'confusing', 'worst',
  'hate', 'difficult', 'unclear', 'disappointing', 'useless', 'waste', 'hard',
  'unhelpful', 'monotonous', 'dull', 'ineffective', 'unprepared'
];

function analyzeSentiment(text) {
  if (!text) return { sentiment: 'neutral', score: 0, keywords: [] };

  const words = text.toLowerCase().split(/\W+/);
  let score = 0;
  const keywords = [];

  words.forEach(word => {
    if (positiveWords.includes(word)) { score++; keywords.push(word); }
    if (negativeWords.includes(word)) { score--; keywords.push(word); }
  });

  const sentiment = score > 0 ? 'positive' : score < 0 ? 'negative' : 'neutral';
  return { sentiment, score, keywords: [...new Set(keywords)] };
}

function generateSummary(feedbacks) {
  if (!feedbacks.length) return 'No feedback available.';

  const total = feedbacks.length;
  const avgRating = (feedbacks.reduce((s, f) => s + f.rating, 0) / total).toFixed(1);
  const positive = feedbacks.filter(f => f.sentiment === 'positive').length;
  const negative = feedbacks.filter(f => f.sentiment === 'negative').length;

  const allKeywords = feedbacks.flatMap(f => f.keywords || []);
  const keywordFreq = allKeywords.reduce((acc, k) => { acc[k] = (acc[k] || 0) + 1; return acc; }, {});
  const topKeywords = Object.entries(keywordFreq).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([k]) => k);

  let summary = `Based on ${total} responses, average rating is ${avgRating}/5. `;
  summary += `${Math.round((positive / total) * 100)}% positive, ${Math.round((negative / total) * 100)}% negative feedback. `;
  if (topKeywords.length) summary += `Key themes: ${topKeywords.join(', ')}.`;

  return summary;
}

module.exports = { analyzeSentiment, generateSummary };
