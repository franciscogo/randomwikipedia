const nodeFetch = require('node-fetch');
const Twit = require('twit');

const limitTweet = (extract) => `${extract.slice(0, 120)}...`;

const attachParamsToUrl = (url, params) => {
  let urlParams = '';
  Object.keys(params).forEach((key) => {
    urlParams += `&${key}=${params[key]}`;
  });
  return `${url}${urlParams}`;
};

const getRandomArticle = async (url) => {
  try {
    const request = await nodeFetch(url);
    const json = await request.json();
    return json.query.random[0].id;
  } catch (error) {
    return error;
  }
};

const loadDataForArticle = async (id, url) => {
  try {
    const request = await nodeFetch(url);
    const json = await request.json();
    return json.query.pages[id];
  } catch (error) {
    return error;
  }
};

const createTweet = async (article) => {
  const { title, extract, fullurl } = article;
  const tweetFixed = limitTweet(extract);
  const tweet = `#RandomWikipedia\n\n${title}\n\n${tweetFixed}\n\n${fullurl}`;
  return tweet;
};

const twit = new Twit({
  consumer_key: process.env.twitter_consumer_key,
  consumer_secret: process.env.twitter_consumer_secret,
  access_token: process.env.twitter_access_token,
  access_token_secret: process.env.twitter_access_token_secret,
});

module.exports = {
  limitTweet,
  attachParamsToUrl,
  getRandomArticle,
  loadDataForArticle,
  createTweet,
  twit,
};
