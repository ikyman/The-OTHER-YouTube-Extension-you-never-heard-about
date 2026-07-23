//import { DEFAULT_PATTERN_SETTINGS } from "../PunishmentTracker";

class extension_setting_service{
    constructor(){
        if (extension_setting_service.instance) {
            return extension_setting_service.instance;
        }
        extension_setting_service.instance = this;
        chrome.storage.local.get("punishment_settings").then( (punish_settings) =>{
            this.pattern_settings = punish_settings["patterns"];
            this.channel_settings = punish_settings["channels"];
        });
    }
    getSettingsForPattern(prototype_name){
        if (!this.pattern_settings[prototype_name]){
            this.setSettingsForPattern(prototype_name, DEFAULT_PATTERN_SETTINGS);
        }
        return this.pattern_settings[prototype_name];
    }

    setSettingsForPattern(prototype_name, pattern_settings){
        this.pattern_settings[prototype_name] = pattern_settings;
        chrome.storage.local.set({"punishment_settings" : this.pattern_settings });
    }
}

const extension_setting_service_singleton = new extension_setting_service();

export { extension_setting_service_singleton as esss }