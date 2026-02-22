const POST_WHEN_GREATER_SAVINGS = 180
const POST_URL = "https://evqeecbhtaabqokckktvyhow2y0jvczy.lambda-url.us-east-1.on.aws/"
const PAGES_BACK = 4
const ASSUME_NOT_WATCHED = 2 
const ASSUME_PLAYBACK_SPEED = 2
const UNWATCHED_CACHE_SIZE = PAGES_BACK*ASSUME_NOT_WATCHED

class time_saved_tracker{
	constructor(){
		chrome.storage.local.get("minutes_saved_total").then( (value) => {
			this.total_saved = 0;
			if (!isNaN(value.minutes_saved_total )){
				this.total_saved = value.minutes_saved_total;
			}
		});
		chrome.storage.local.get("minutes_saved_last_post").then( (value) => {
			this.saved_since_post = 0
			if (!isNaN(value.minutes_saved_last_post )){
				this.saved_since_post = value.minutes_saved_last_post;
			}
		}); 
		this.unwatched_cache = [];
		this.most_recent_post_url = null;
	}

	add_unwatched_video(from, punished_video, m_length){
		const suggested_this_count = this.unwatched_cache.filter( (element) => element && (element["suggested_by"] === from )).length;
		const assumed_time_savings = (m_length/ASSUME_PLAYBACK_SPEED)
		if (suggested_this_count < ASSUME_NOT_WATCHED){
			this.unwatched_cache.unshift({"suggested_by":from, "punished_video": punished_video,  "minute_length":assumed_time_savings});
			this.add_time_savings(assumed_time_savings);
		}
		const watched_anyways_index = this.unwatched_cache.findIndex( (element) => element && (element["punished_video"] === from) ) 
		if ( watched_anyways_index != -1 ){
			const naughty_watch_time = this.unwatched_cache[watched_anyways_index]["minute_length"];
			this.add_time_savings(-naughty_watch_time);
        	this.unwatched_cache.splice(watched_anyways_index,1);
		}

		this.unwatched_cache.length = UNWATCHED_CACHE_SIZE;

		if (this.indelible_time_savings() > POST_WHEN_GREATER_SAVINGS){
			if (from != this.most_recent_post_url){
				this.most_recent_post_url = from;
				this.post_saved_time();
			}
		}
	}

	add_time_savings(minutes_saved){
		this.saved_since_post = this.saved_since_post+minutes_saved;
		chrome.storage.local.set({"minutes_saved_last_post": this.saved_since_post})

		this.total_saved = this.total_saved+minutes_saved;
		chrome.storage.local.set({"minutes_saved_total": this.total_saved})
	}


	indelible_time_savings(){
		return this.saved_since_post - this.unwatched_cache.reduce( (accumulator, current_value) => {
			if (current_value){
				return accumulator + current_value["minute_length"];
			}return accumulator
		},0)
	}

	async post_saved_time(){
		const posted_time = this.indelible_time_savings()
		let postBody = new FormData();
		//postBody.append("add_minutes", posted_time);

		const postResponse = await fetch(`${POST_URL}`,{
			method : "POST",
			body: `{"add_minutes": "${posted_time}"}`
			//headers: {'Access-Control-Allow-Origin':'*',
			//'Access-Control-Allow-Methods':'POST'}
		});
        if (postResponse.ok){
        	this.saved_since_post = this.saved_since_post-posted_time;
        	chrome.storage.local.set({"minutes_saved_last_post": this.saved_since_post})
        }else{
        	console.log(postResponse)
        }
	}
}

