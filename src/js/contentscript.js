let settings = {
    isToggled: undefined,
	links: undefined,
	days: undefined,
	startTime: undefined,
	endTime: undefined
}

const applySettings = (storageSettings) => {
	settings = storageSettings;
	if(settings.isToggled) blockSite();
}

const blockSite = () => {
	const day = new Date().getDay();
	const time = new Date().toLocaleTimeString([], {hour: "2-digit", minute: "2-digit"});
	settings.links.forEach(link => {
		if(link.url.exec(window.location.href) && settings.days.includes(day) && (time >= settings.startTime) && (time <= settings.endTime) && settings.isToggled) {
			browser.runtime.sendMessage({url: browser.runtime.getURL("html/page.html")});
		}
	})
}

const onLoad = async () => {
	const storageSettings = await browser.storage.local.get(settings);
	applySettings(storageSettings);
}

browser.runtime.onMessage.addListener(applySettings);

onLoad();