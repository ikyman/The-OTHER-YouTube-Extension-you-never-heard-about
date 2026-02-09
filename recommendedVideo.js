

class RecommendedVideo {
    constructor (yt_lockup_view_model){
        this.yt_lockup_view_model = yt_lockup_view_model;
        const thumbnails = this.yt_lockup_view_model.getElementsByClassName("yt-lockup-view-model__content-image");
        if (thumbnails.length !== 1){
            console.error("Assuption off! I thought Each youtube video had only a single thumbnail!")
            console.log(thumbnails);
            return;
        }
        this.thumbnail_elem = thumbnails[0];
        this.timestamp_elem = this.thumbnail_elem.getElementsByTagName("yt-thumbnail-badge-view-model")[0];

        const textContainer = this.yt_lockup_view_model.getElementsByClassName("yt-lockup-metadata-view-model__heading-reset");
        if (textContainer.length !== 1){
            console.error("Assumption off! I thought I was only dealing with on Youtube Video at a time!!")
            console.log(textContainer);
            return;
        }
        const titleSpans= textContainer[0].getElementsByTagName("span");
        if (titleSpans.length !== 1){
            console.error("Assumption off! More than 1 span in a Thumbnail!")
            console.log(titleSpans);
            return;
        }

        this.title_elem = titleSpans[0];
    }

    isComplete(){
        return !(this.yt_lockup_view_model === null || this.thumbnail_elem === null || this.timestamp_elem === null || this.title_elem === null)
    }

    getVideoLength(){
        let timestamp = this.timestamp_elem.getElementsByTagName("div")[0];
        const timestamp_list = timestamp.textContent.split(":")
        let video_length = +timestamp_list.at(-2);
        if (timestamp_list.length ===3) {
            video_length += +timestamp_list.at(-3)*60;
        }
        return video_length;
    }
}
