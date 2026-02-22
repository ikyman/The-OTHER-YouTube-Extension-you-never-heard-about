


let tst = new time_saved_tracker();
let ess = new extension_setting_service();
// background.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	const req_parsed = JSON.parse(request);

	if (req_parsed["punished_video"]){
		tst.add_unwatched_video(req_parsed["suggested_by"], req_parsed["punished_video"], req_parsed["minute_length"])
	}else if(req_parsed["request_type"] === "get_pattern_settings"){
		sendResponse(ess.getSettingsForPattern(req_parsed["pattern_name"]))
	}
})