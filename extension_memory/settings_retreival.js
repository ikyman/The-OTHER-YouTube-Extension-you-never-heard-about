const DEFAULT_PATTERN_SETTINGS = {
    highlight_colour : null,
    remove_pattern : false,
    colourize_points : NaN,
    thumbnail_removal_points : NaN
}


class extension_setting_service{
    constructor(){
        chrome.storage.local.get("punishment_settings").then( (punish_settings) =>{
            this.pattern_settings = punish_settings["patterns"];
            this.channel_settings = punish_settings["channels"];
        });
    }
    getSettingsForPattern(prototype_name){
        if (!this.pattern_settings[prototype_name]){
            throw "Save setting Not Yet Implemented. When Implemented, Call Default Patterns and Save."
        }
        return this.pattern_settings[prototype_name];
    }

}