// content.js

// Listen for messages from the extension
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "startScreenRecording") {
    // Handle the screen recording request
    const isAudioChecked = message.audio;

    // Log a message indicating that screen recording has been requested
    console.log("Screen recording requested from React component.");

    // Function to start screen recording
    function startScreenRecording(audioEnabled) {
      const streamConstraints = {
        video: {
          mediaSource: 'screen',
        },
      };

      if (audioEnabled) {
        streamConstraints.audio = true;
      }

      navigator.mediaDevices
        .getDisplayMedia(streamConstraints)
        .then((stream) => {
          const mediaRecorder = new MediaRecorder(stream);
          const recordedChunks = [];

          mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
              recordedChunks.push(event.data);
            }
          };

          mediaRecorder.onstop = () => {
            const recordedBlob = new Blob(recordedChunks, { type: 'video/webm' });
            const url = URL.createObjectURL(recordedBlob);

            // Handle the recorded video URL here (e.g., display it on the page)
            // You can also send it to the extension's background script for further processing or saving

            // Example: Display the recorded video in a <video> element
            const videoElement = document.createElement('video');
            videoElement.src = url;
            videoElement.controls = true;
            document.body.appendChild(videoElement);
          };

          mediaRecorder.start();
        })
        .catch((error) => {
          console.error('Error starting screen recording:', error);
        });
    }

    // Example usage: Start screen recording with audio
    startScreenRecording(isAudioChecked);

    // Send a response if needed
    sendResponse({ result: "Screen recording started" });
  }
});
















// content.js

// Function to request camera permissions
const requestCameraPermission = () => {
  navigator.mediaDevices
    .getUserMedia({ video: true })
    .then((stream) => {
      // Camera permission granted, handle the camera capture stream here
      const videoElement = document.createElement('video');
      videoElement.srcObject = stream;
      videoElement.play();
      
      // You can display the camera feed or handle it as needed
      document.body.appendChild(videoElement);

      // Optionally, you can send a message back to the extension to confirm permission
      chrome.runtime.sendMessage({ permissionGranted: true });
    })
    .catch((error) => {
      console.error('Error accessing camera:', error);

      // Send a message back to the extension to indicate permission denial
      chrome.runtime.sendMessage({ permissionGranted: false });
    });
};

// Function to request audio permissions
const requestAudioPermission = () => {
  navigator.mediaDevices
    .getUserMedia({ audio: true })
    .then((stream) => {
      // Audio permission granted, handle the audio capture stream here
      // You can work with the audio stream as needed
      // For example, you can send it to a server, process audio data, etc.

      // Optionally, you can send a message back to the extension to confirm permission
      chrome.runtime.sendMessage({ permissionGranted: true });
    })
    .catch((error) => {
      console.error('Error accessing microphone:', error);

      // Send a message back to the extension to indicate permission denial
      chrome.runtime.sendMessage({ permissionGranted: false });
    });
};
// Listen for messages from the extension
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'requestCameraPermission') {
    requestCameraPermission();
  } else if (message.action === 'requestAudioPermission') {
    requestAudioPermission();
  }
});
