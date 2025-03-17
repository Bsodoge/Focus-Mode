if(typeof browser === "undefined") browser = chrome;

let isToggled = false;
let optionsToggled = false;
let links = [];
let displayLinks = [];
let days = [];
let startTime = new Date().toLocaleTimeString([], {hour: "2-digit", minute: "2-digit"});
let endTime = new Date().toLocaleTimeString([], {hour: "2-digit", minute: "2-digit"});
let settings = {
    isToggled,
    links,
    days,
    startTime,
    displayLinks,
    endTime
}

const applySettings = (storageSettings) => {
	settings = storageSettings;
	if(settings.isToggled) blockSite();
}

const blockSite = () => {
	const day = new Date().getDay();
	const time = new Date().toLocaleTimeString([], {hour: "2-digit", minute: "2-digit"});
	settings.links.forEach(link => {
		let reg = new RegExp(link.url);
		if(reg.exec(window.location.href) && settings.days.includes(day) && (time >= settings.startTime) && (time <= settings.endTime) && settings.isToggled) {
			browser.runtime.sendMessage({url: browser.runtime.getURL("html/page.html")});
		}
	})
}

const onLoad = async () => {
	const storageSettings = await browser.storage.local.get(settings);
	console.log(storageSettings);
	applySettings(storageSettings);
}

console.log("before");

browser.runtime.onMessage.addListener(applySettings);

onLoad();

console.log("after");
