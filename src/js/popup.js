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
const specialChars = {
	".": "\.",
	"+": "\+",
	"*": ".*",
	"?": "\?",
	"^": "\^",
	"$": "\$",
	"(": "\(",
	")": "\)",
	"[": "\[",
	"]": "\]",
	"{": "\{",
	"}": "\}",
	"|": "\|",
	"/": "\/"
}

const buttonToggle = document.getElementById("button");
const linkInputButton = document.getElementById("link-submit");
const linkInput = document.getElementById("input-link")
const listContainer = document.getElementById("link-list");
const daysContainer = document.getElementById("days-container");
const startInput = document.getElementById("start");
const endInput = document.getElementById("end");

const addLink = (link) => {
    if (links.includes(link)){
        return;
    }
    displayLinks.push(link);
    link = convertToRegex(link);
    if (!links.includes(link)) {
        links.push(link);
        listLinks();
        setSettings();
    }
    linkInput.value = "";
}
const changeButtonText = () => {
    if (!isToggled) {
        buttonToggle.innerText = "Activate";
        buttonToggle.classList.remove('active');
        return;
    } 
    buttonToggle.innerText = "Deactivate";
    buttonToggle.classList.add('active')
}

const removeLink = (container) => {
    links = links.filter((link, id) => id != container.getAttribute("id"));
    displayLinks = displayLinks.filter((link, id) => id != container.getAttribute("id"));
    container.remove();
    setSettings();
}

const listLinks = () => {
    while(listContainer.hasChildNodes()){
        listContainer.removeChild(listContainer.firstChild);
    }
    displayLinks.forEach((link, index) => {
        const container = document.createElement("div");
        const span = document.createElement("span");
        const button = document.createElement("button");
        container.setAttribute("id", index);
        button.innerText = "Remove";
        span.classList.add("link-container");
        button.classList.add("remove-button");
        button.addEventListener("click", () => removeLink(container));
        span.innerText = link;
        container.append(span);
        container.append(button);
        listContainer.append(container);
    });
}

const setSettings = () => {
    settings = {
        isToggled,
        links,
        days,
        startTime,
        displayLinks,
        endTime
    }
    browser.storage.local.set(settings);
}

const onOpen = () => {
    browser.storage.local.get(settings).then((storageSettings) => {
        isToggled = storageSettings.isToggled;
        links = storageSettings.links;
        days = storageSettings.days;
        startTime = storageSettings.startTime;
        endTime = storageSettings.endTime;
        displayLinks = storageSettings.displayLinks;
        changeButtonText();
        listLinks();
        changeTimeText();
        changeButtonState();
        settings = storageSettings;
        browser.tabs.query({ active: true, currentWindow: true }, sendMessage);
    });
}

const sendMessage = (tabs) => {
    browser.tabs.sendMessage(tabs[0].id, settings);
}

const toggleExtension = (tabs) => {
    isToggled = !isToggled;
    changeButtonText();
    setSettings();
    sendMessage(tabs);
}

const changeButtonState = () => {
    daysContainer.childNodes.forEach((child) => {
        if(days.includes(parseInt(child.id))) child.classList.add("active");
    })
}

const handleDay = (button) => {
    givenDay = parseInt(button.target.id);
    if(days.includes(givenDay)){
        days = days.filter((day) => day != givenDay);
        button.target.classList.remove("active");
        setSettings();
        return;
    }
    button.target.classList.add("active");
    days.push(givenDay);
    setSettings();
}

const handleTime = (input) => {
    if(input.target.id === "start") startTime = input.target.value;
    if(input.target.id === "end") endTime = input.target.value;
    setSettings();
}

const changeTimeText = () => {
    startInput.value = startTime;
    endInput.value = endTime;
}

const convertToRegex = (url) => {
	for (const key in specialChars) {
		if(url.includes(key)) url = url.replaceAll(key, specialChars[key]);
	}
	return new RegExp(url);
}

buttonToggle.addEventListener("click", () => browser.tabs.query({active: true, currentWindow: true}, toggleExtension));
linkInputButton.addEventListener("click", () => addLink(linkInput.value));
daysContainer.childNodes.forEach((child) => child.addEventListener("click", handleDay));
startInput.addEventListener("change", handleTime);
endInput.addEventListener("change", handleTime);

onOpen();