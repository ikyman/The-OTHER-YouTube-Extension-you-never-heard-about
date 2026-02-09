class abstract_TitlePattern{
    findPattern(text_span){
        const videoTitle = text_span.innerHTML;
	  	const allCapsTitle= videoTitle.toUpperCase();
        return allCapsTitle.search(this.regEx);
    }

    hasPattern(text_span){
        return ( this.findPattern(text_span) !== -1)

    }

    removePattern(text_span){


    }
}

class inXMinutesOrLess extends abstract_TitlePattern{
    constructor(){
        super();
        const unitsOfTime = ["SECONDS","MINUTES","HOURS"]; 
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

        this.regEx = "IN (LESS THAN|FEWER THAN|UNDER|\\s*)" + "\\s*" + "[1-9][0-9]*" + "\\s*" + uotRegexString + "\\s*" + "(OR LESS|OR FEWER|OR UNDER|\\s*)";
    }
}