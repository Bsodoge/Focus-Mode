let isToggled = false;

let settings = {
    isToggled
}

const applySettings = (storageSettings) => {
	if (storageSettings.isToggled) console.log("Hi"); 
}

const onLoad = () => {
	browser.storage.local.get(settings).then((storageSettings) => {
		applySettings(storageSettings);
	});
}

browser.runtime.onMessage.addListener(applySettings);