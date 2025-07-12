// background.js

const BASE_URL = "https://email-storage-be.onrender.com";

// Listen for a message from the content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "fetchCredentials") {
    fetch(`${BASE_URL}/edtech/all`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        // Send the data back to the content script
        sendResponse({ success: true, data: data });
      })
      .catch((error) => {
        console.error("Background script fetch error:", error);
        sendResponse({ success: false, error: error.message });
      });

    // Return true to indicate that you will be sending a response asynchronously
    return true;
  }
});
