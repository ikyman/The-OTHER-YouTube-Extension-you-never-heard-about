console.log("=== YouTube Anti-Clickbait Extension LOADED ===");

const uglyify = (ytVideo) => {
	ytVideo.style.backgroundColor = 'darkolivegreen';
	const thumbnails = ytVideo.getElementsByClassName("yt-lockup-view-model__content-image");
	if (thumbnails.length !== 1){
		console.error("Assuption off! I thought Each youtube video had only a single thumbnail!")
		console.log(thumbnails);
		return;
	}

	let timestamp;
	for (const thumbnail of thumbnails){
		timestamp = thumbnail.getElementsByTagName("yt-thumbnail-badge-view-model")[0];
		thumbnail.before(timestamp);
		timestamp.style.display = "flex";
		timestamp.style.alignItems = "center";
		thumbnail.remove();
	}
}

const inXMinutesOrLess = (videoTitleAllCaps) => {
	const unitsOfTime = ["SECONDS","MINUTES","HOURS"]; // Not finished! I suspect that anything longer than "Hours" is not "all x explained in x minutes or less",
	// & is instead "how x was built in less than 3 weeks"
	const uotSingulars = unitsOfTime.map( (uot) => {return "A " + uot.slice(0,-1)} );

	let uotRegexString = "("
	for (const pluralUot of unitsOfTime){
		uotRegexString += (pluralUot +"|");
	}
	for (const singleUot of uotSingulars){
		uotRegexString += (singleUot +"|");
	} 
	uotRegexString = uotRegexString.slice(0,-1) + ")";

	const spelledOutNumbers = {} // Unimplemented: Rare is the lazy clickbait that spells out the number

	const regEx = "IN (LESS THAN|FEWER THAN|UNDER|\\s*)" + "\\s*" + "[1-9][0-9]*" + "\\s*" + uotRegexString + "\\s*" + "(OR LESS|OR FEWER|OR UNDER|\\s*)";

	//How to prevent "in 9 minutes" from triggering: We don't. From cursory (2 minute) research, "in 9 minutes" is the same as "in 9 minutes or less".
	return (videoTitleAllCaps.search(regEx) != -1)
}

const dotdotdot = (videoTitleAllCaps)=>{
	const regEx = "\\.\\.\\.|\u{1F600}";

	return (videoTitleAllCaps.search(regEx) != -1)
}

// Callback function to execute when mutations are observed
const punishNaughtyClickbait = (mutationsList, observer) => {
	for (const mutation of mutationsList) {
		for (const ytRec of mutation.addedNodes) {
			if (!ytRec.nodeType || ytRec.nodeType !== Node.ELEMENT_NODE) {
				continue;
			}
			//const textContainer = ytRec.getElementsByClassName("yt-lockup-metadata-view-model__text-container"); <= May be useful to keep track of; has both the title information, the channel name, and view count.
			const textContainer = ytRec.getElementsByClassName("yt-lockup-metadata-view-model__heading-reset");
			if (textContainer.length !== 1){
				console.error("Assuption off! I thought I was only dealing with on Youtube Video at a time!!")
				console.log(textContainer);
				return;
			}
	  		const titleSpans= textContainer[0].getElementsByTagName("span");
			if (titleSpans.length !== 1){
				console.error("Assuption off! More than 1 span in a Thumbnail!")
				console.log(titleSpans);
				return;
			}
	  		const videoTitle = titleSpans[0].innerHTML;
	  		const allCapsTitle= videoTitle.toUpperCase();

			let shouldBePunished = false;
			shouldBePunished = shouldBePunished || inXMinutesOrLess(allCapsTitle);

			shouldBePunished = shouldBePunished || dotdotdot(allCapsTitle);

			if (shouldBePunished){
				let timestamp = ytRec.getElementsByTagName("yt-thumbnail-badge-view-model")[0].getElementsByTagName("div")[0];
				const timestamp_list = timestamp.textContent.split(":")
				let video_length = +timestamp_list.at(-2);
				if (timestamp_list.length ===3) {
					video_length += +timestamp_list.at(-3)*60;
				}

				const corrected_punished_url = titleSpans[0].parentElement.href.split("&")[0]

				chrome.runtime.sendMessage(`{"suggested_by": "${window.location.href}", "punished_video": "${corrected_punished_url}", "minute_length": "${video_length}"}`, (response) => {
    				console.log("Response from background:", response);
				});

				uglyify(ytRec);
			}
		}
	}
};

const channelNoThanks = {

}

// Select the node that will be observed for mutations
function addAntiClickbaitObserver(){
	/* Copied from https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver, 
	 * which in turn was copied from a blog-post
	 */
	const recommendationsList = document.querySelector("#items.ytd-watch-next-secondary-results-renderer");
	
	if (!recommendationsList) {
		console.log("Recommendations list not found, retrying...");
		setTimeout(addAntiClickbaitObserver, 1000);
		return;
	}

	// Options for the observer (which mutations to observe)
	const config = { childList: true };

	// Create an observer instance linked to the callback function
	const observer = new MutationObserver(punishNaughtyClickbait);

	// Start observing the target node for configured mutations
	observer.observe(recommendationsList, config);
	console.log("Anti-clickbait observer started!");
	console.log(recommendationsList);
}

// Run when DOM is ready
if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', addAntiClickbaitObserver);
} else {
	addAntiClickbaitObserver();
}






