let settings = {
    isToggled: undefined,
	links: undefined,
	days: undefined,
	startTime: undefined,
	endTime: undefined
}

const applySettings = (storageSettings) => {
	if (storageSettings.isToggled) settings = storageSettings; 
}

const blockSite = () => {
	const day = new Date().getDay();
	const time = new Date().toLocaleTimeString([], {hour: "2-digit", minute: "2-digit"});
	console.log(time);
	if(settings.links.includes(window.location.href) && settings.days.includes(day) && (time >= settings.startTime) && (time <= settings.endTime) ) close();
}

const onLoad = async () => {
	const storageSettings = await browser.storage.local.get(settings);
	applySettings(storageSettings);
	console.log(settings);
	blockSite();
}

browser.runtime.onMessage.addListener(applySettings);

onLoad();