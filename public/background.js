// background.js

// Find the active tab
chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const activeTab = tabs[0];
    
    // Send a message to the content script to start tab recording
    chrome.tabs.sendMessage(activeTab.id, { action: "startTabRecording" }, function (response) {
      // Handle the response if needed
    });
  });
  