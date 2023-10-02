// Function to request camera and audio permissions
const requestCameraAndAudioPermissions = () => {
  chrome.permissions.request(
    {
      permissions: ['camera', 'microphone'],
    },
    (granted) => {
      if (granted) {
        console.log('Camera and microphone permissions granted.');
      } else {
        console.error('Camera and microphone permissions denied.');
      }
    }
  );
};

// Function to check if camera and audio permissions are granted
const checkCameraAndAudioPermissions = () => {
  chrome.permissions.contains(
    {
      permissions: ['camera', 'microphone'],
    },
    (result) => {
      if (result) {
        console.log('Camera and microphone permissions are granted.');
      } else {
        console.error('Camera and microphone permissions are not granted.');
      }
    }
  );
};
