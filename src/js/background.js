browser.runtime.onMessage.addListener(async (message, sender) => {
    browser.tabs.update(sender.tab.id, message);
})
