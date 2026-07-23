import { ess } from "./extension_memory/settings_retreival.js";

const write_time_savings = async () => {
	chrome.storage.local.get("minutes_saved_total").then( (value) =>{
			document.getElementById("time_saved").innerHTML = value.minutes_saved_total;
		}
	)
}

const get_punishment_settings = async () => {
	let punished_table = document.getElementById("punish_settings_table")
	chrome.storage.local.get("punishment_settings").then( (punish_settings) =>{
		if (isObjectEmpty(punish_settings)){
			return;
		}
		if (punish_settings["patterns"].length){
			let patterns_title = document.createElement("tr");
			patterns_title.innerHTML("Patterns");
			punished_table.append(patterns_title);
		}
		for (let i = 0; i < punish_settings["patterns"].length; ++i){
			console.log(punish_settings["patterns"][i])
		}
	})
}

const isObjectEmpty = (objectName) => {
	return Object.keys(objectName).length === 0;
}

const create_punish_table_row = () => {

}

const set_default_punishment_colour = () => {
	console.log("TODO: connect default punishment colour value to chrome.storage");
}

const button_event_handlers = async() => {
    //document.getElementById("add_row").addEventListener('click', make_url_row);
    document.getElementById("default-punishment-colour").addEventListener('click', set_default_punishment_colour);
    document.getElementById("save-punish-settings").addEventListener('click', save_url_saves);
}

document.addEventListener('DOMContentLoaded', button_event_handlers);
document.addEventListener('DOMContentLoaded', write_time_savings);
document.addEventListener('DOMContentLoaded', get_punishment_settings);
