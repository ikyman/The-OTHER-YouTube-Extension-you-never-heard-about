const removeThumbnail = (ytRec)=>{
	ytRec.thumbnail_elem.before(ytRec.timestamp_elem)
	ytRec.timestamp_elem.style.display = "flex";
	ytRec.timestamp_elem.style.alignItems = "center";
	ytRec.thumbnail_elem.remove()
}

const colourizeVideo = (ytVideo, colour) => {
	ytVideo.yt_lockup_view_model.style.backgroundColor = colour;
}

const dotdotdot = (videoTitleAllCaps)=>{
	const regEx = "\\.\\.\\.|\u{1F600}";

	return (videoTitleAllCaps.search(regEx) != -1)
}

// Callback function to execute when mutations are observed
const punishNaughtyClickbait = (mutationsList, observer) => {
	for (const mutation of mutationsList) {
		for (const added_node of mutation.addedNodes) {
			if (!added_node.nodeType || added_node.nodeType !== Node.ELEMENT_NODE) {
				continue;
			}

			let ytRec = new RecommendedVideo(added_node);

			if (!ytRec.isComplete()){
				continue;
			}

			console.log(ytRec.title_elem)
			console.log(ytRec.title_elem.innerHTML)
			
	  		const videoTitle = ytRec.title_elem.innerHTML;
	  		const allCapsTitle= videoTitle.toUpperCase();

			let shouldBePunished = false;
			shouldBePunished = shouldBePunished || xMinPattern.hasPattern(ytRec.title_elem);

			shouldBePunished = shouldBePunished || dotdotdot(allCapsTitle);

			if (shouldBePunished){
				const video_length = ytRec.getVideoLength()

				const corrected_punished_url = ytRec.title_elem.parentElement.href.split("&")[0]

				chrome.runtime.sendMessage(`{"suggested_by": "${window.location.href}", "punished_video": "${corrected_punished_url}", "minute_length": "${video_length}"}`, (response) => {
    				console.log("Response from background:", response);
				});
				colourizeVideo(ytRec, 'darkolivegreen')
				removeThumbnail(ytRec);
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
const xMinPattern = new inXMinutesOrLess()
if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', addAntiClickbaitObserver);
} else {
	addAntiClickbaitObserver();
}






