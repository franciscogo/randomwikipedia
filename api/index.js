const {
  getRandomArticle, attachParamsToUrl, loadDataForArticle, createTweet, twit,
} = require('../lib/util');

const WIKIPEDIA_URL = 'https://en.wikipedia.org/w/api.php?origin=*';

const paramsForRandomArticles = {
  action: 'query',
  format: 'json',
  list: 'random',
  rnlimit: '1',
  rnnamespace: '0',
};

const paramsForDataArticle = {
  action: 'query',
  format: 'json',
  prop: 'info|extracts&inprop=url',
  exintro: '1',
  explaintext: '1',
  redirects: '1',
};

const execute = async () => {
  try {
    const buildRequestArticleUrl = await attachParamsToUrl(WIKIPEDIA_URL, paramsForRandomArticles);
    const articleId = await getRandomArticle(buildRequestArticleUrl);
    const paramsForArticleMeta = { ...paramsForDataArticle, pageids: articleId };
    const buildRequestArticleMeta = await attachParamsToUrl(WIKIPEDIA_URL, paramsForArticleMeta);
    const article = await loadDataForArticle(articleId, buildRequestArticleMeta);
    const tweet = await createTweet(article);
    await twit.post('statuses/update', { status: tweet });
    return tweet;
  } catch (error) {
    return error;
  }
};

module.exports = async (req, res) => {
  try {
    await execute();
    return res.json({
      statusCode: 200,
      body: JSON.stringify({
        message: 'Done!',
      }),
    });
  } catch (error) {
    return res.json({
      status: 400,
      body: JSON.stringify({
        message: error,
      }),
    });
  }
};
