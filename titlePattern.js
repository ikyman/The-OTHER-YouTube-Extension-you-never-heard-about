class abstract_TitlePattern{
    findPattern(text_span){
        const videoTitle = text_span.innerHTML;
	  	const allCapsTitle= videoTitle.toUpperCase();
        console.log(allCapsTitle);
        console.log(this.regEx)
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
        const unitsOfTime = ["SECONDS","MINUTES","HOURS", "SEC", "MIN", "SECS", "MINS"]; 
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

        this.regEx = "\\s+IN (LESS THAN|FEWER THAN|UNDER|JUST|\\s*)" + "\\s*" + "[1-9][0-9]*" + "(:[0-9]*|\\s*)" + "\\s*" + uotRegexString + "\\s*" + "(OR LESS|OR FEWER|OR UNDER|\\s*)";
    }
}

class dotDotDot extends abstract_TitlePattern{
    constructor(){
        super()
        this.regEx = "\\.\\.\\.|\u{2026}";
    }
}

class howWhy extends abstract_TitlePattern{
    constructor(){
        super()
        this.regEx = "(HOW|WHY)+\\s+";
    }
}