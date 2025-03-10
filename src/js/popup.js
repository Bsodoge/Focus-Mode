let isToggled = false;
let optionsToggled = false;
let settings = {
    isToggled,
}

const buttonToggle = document.getElementById("button");

const changeButtonText = () => {
    if (!isToggled) {
        buttonToggle.innerText = "Activate";
        buttonToggle.classList.remove('activated');
        return;
    } 
    buttonToggle.innerText = "Deactivate";
    buttonToggle.classList.add('activated')
}

const setSettings = () => {
    settings = {
        isToggled,
    }
    browser.storage.local.set(settings);
}

const onOpen = () => {
    browser.storage.local.get(settings).then((storageSettings) => {
        isToggled = storageSettings.isToggled;
        changeButtonText();
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

buttonToggle.addEventListener("click", () => browser.tabs.query({active: true, currentWindow: true}, toggleExtension));

onOpen();