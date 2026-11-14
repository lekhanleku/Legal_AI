const liveNewsService = require('../services/liveNewsService');
const { getBaselineArticles } = require('../data/courtNewsBaseline');

class Article {
  /**
   * Fetch live articles, utilizing liveNewsService caching & RSS fallbacks
   */
  static async fetchLiveArticles(category = 'all', forceRefresh = false) {
    if (typeof liveNewsService.getArticles === 'function') {
      return await liveNewsService.getArticles(category, forceRefresh);
    }
    return Article.getBaselineArticles(category);
  }

  /**
   * Get baseline authoritative legal articles
   */
  static getBaselineArticles(category = 'all') {
    const baseline = getBaselineArticles();
    if (!category || category === 'all') return baseline;
    return baseline.filter(a => (a.category || '').toLowerCase() === category.toLowerCase());
  }

  /**
   * Find article by identifier or title slug
   */
  static async findById(id) {
    const articles = await Article.fetchLiveArticles('all', false);
    return articles.find(a => String(a.id) === String(id) || a.guid === id) || null;
  }
}

module.exports = Article;

