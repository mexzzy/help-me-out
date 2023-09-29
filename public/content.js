// content.js

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === "startTabRecording") {
      // Use getDisplayMedia to capture the current tab
      chrome.tabCapture.capture({ video: true, audio: true }, function (stream) {
        sendResponse({ stream: stream });
      });
      return true; // Keep the message channel open for sendResponse
    }
  });
  