const Twit = require('twit');
const config = require("../config.js")
const T = new Twit(config);

const searchText = '#coding OR #code OR #programming OR #software OR #tech';
const geolocation = '55.963810,-3.188182,10mi'


setInterval(botRetweet, 10*60*1000);
botRetweet();

function botRetweet() {

	const params = {
		q: searchText,
    geocode: geolocation,
		result_type: "recent"
	}

	T.get('search/tweets', params, botGotLatestTweet);

	function botGotLatestTweet (error, data, response) {
		if (error) {
			console.log('Bot could not find latest tweet, : ' + error);
		}
		else {
      // TODO: Consider looping here to retweet all tweets returned (may need to be throttled) consider excluding retweets
      const results = data.statuses;
			const id = {
        // BUG: This will cause undefined error where no data or statuses is returned
				id : results[Math.floor(Math.random()*results.length)].id_str
			}

			T.post('statuses/retweet/:id', id, botRetweeted);

			function botRetweeted(error, response) {
				if (error) {
					console.log('Bot could not retweet, : ' + error);
				}
				else {
					console.log('Bot retweeted : ' + id.id);
				}
			}
		}
	}
};

const followed = function(event){
  const name = event.source.name;
  const twitterHandle = event.source.screen_name;
  newTweet(`Thanks for the follow @${twitterHandle}`)
};

const stream = T.stream("user");
stream.on("follow", followed);

const newTweet = function(text){
  const tweet = {
    status: text
  }
  T.post("statuses/update", tweet)
}
