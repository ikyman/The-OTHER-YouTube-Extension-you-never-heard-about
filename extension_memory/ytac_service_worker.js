
import { time_saved_tracker } from './count_time_saved.js';
import { esss } from './settings_retreival.js';


let tst = new time_saved_tracker();
// background.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	const req_parsed = {}//JSON.parse(request);

	if (req_parsed["punished_video"]){
		tst.add_unwatched_video(req_parsed["suggested_by"], req_parsed["punished_video"], req_parsed["minute_length"])
	}else if(req_parsed["request_type"] === "get_pattern_settings"){
		sendResponse(esss.getSettingsForPattern(req_parsed["pattern_name"]))
	}else if(req_parsed["request_type"] === "set_pattern_settings"){
		sendResponse(esss.setSettingsForPattern(req_parsed["pattern_name"]))
	}
})