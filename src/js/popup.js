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
    if (validateLink(link)){
        return;
    }
    let id = self.crypto.randomUUID();
    displayLinks.push(
        {   
            id: id,
            url: link
        }
    );
    link = convertToRegex(link);
    if (!links.includes(link)) {
        links.push(
            {   
                id: id,
                url: link
            }
        );
        listLinks();
        setSettings();
    }
    linkInput.value = "";
}

const validateLink = (givenLink) => {
    return displayLinks.some((link) => link.url === givenLink) || givenLink == null || givenLink.match(/^ *$/) !== null;
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

const removeLink = (givenId, container) => {
    links = links.filter((link) => link.id != givenId);
    displayLinks = displayLinks.filter((link) => link.id != givenId);
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
        button.innerText = "Remove";
        span.classList.add("link-container");
        button.classList.add("remove-button");
        button.addEventListener("click", () => removeLink(link.id, container));
        span.innerText = link.url;
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
document.body.addEventListener("keydown", (e) => { if(e.key === "Enter") linkInputButton.click() });
daysContainer.childNodes.forEach((child) => child.addEventListener("click", handleDay));
startInput.addEventListener("change", handleTime);
endInput.addEventListener("change", handleTime);

onOpen();