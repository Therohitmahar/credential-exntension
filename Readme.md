# Credential Storage - Chrome Extension
![Extension Popup Screenshot](images/icon128.png)

A browser extension to securely fetch, manage, and autofill credentials directly from a centralized backend, enhancing productivity and centralizing access management for development teams.

This extension provides two main functionalities:

1.  **A Popup UI:** A comprehensive dashboard to view, search, and manage all credentials.
2.  **Content Script Injection:** An intelligent autofill suggestion box that appears on specified login pages, allowing for one-click login.

## Features

- **Centralized Credential Management:** Fetches all credentials from a single backend source (`https://email-storage-be.onrender.com`).
- **Dynamic Popup Interface:**
  - Dark/Light mode theme toggle.
  - Real-time search by name, email, or environment.
  - One-click copy for usernames and passwords.
  - Password visibility toggle.
  - Dynamic rendering of credential cards, including separate sections for admin and candidate accounts.
- **Intelligent In-Page Suggestions:**
  - Automatically injects a suggestion box on pages with `/login` in the URL.
  - Triggers on both email and password field focus.
  - Disables native browser autofill to prevent conflicts.
  - Custom-styled dark theme suggestion box with a pointer for a native feel.
  - Fills both email and password fields upon selection.

## Tech Stack

- **Frontend:** HTML5, CSS3, JavaScript (ES6+)
- **Styling:** Tailwind CSS (via CDN script for development)
- **Platform:** Chrome Extension (Manifest V3)
- **Core APIs:** `chrome.storage`, `chrome.runtime`, `fetch` API

## Getting Started

Follow these instructions to get the extension up and running on your local machine for development and testing purposes.

### Prerequisites

- Google Chrome browser

### Installation

1.  **Clone the Repository:**

    ```bash
    git clone https://github.com/Therohitmahar/credential-exntension.git
    ```

    (Or, if you received a `.zip` file, unzip it to a permanent location.)

2.  **Open Chrome Extensions:**
    Navigate to `chrome://extensions` in your Chrome browser.

3.  **Enable Developer Mode:**
    In the top-right corner of the Extensions page, toggle the "Developer mode" switch to **ON**.

4.  **Load the Extension:**

    - Click the **"Load unpacked"** button that appears.
    - In the file selection dialog, navigate to and select the root folder of this project (the one containing `manifest.json`).

5.  **Done!**
    The "Credential Storage" extension icon should now appear in your Chrome toolbar. You may need to click the puzzle piece icon and "pin" it to make it permanently visible.

## How to Use

### Popup View

- Click the extension icon in the Chrome toolbar to open the main dashboard.
- Use the search bar to filter credentials.
- Click the copy or visibility icons on any credential card to interact with it.

### In-Page Suggestions

- Navigate to any website with a login form (specifically, a URL containing `/login`).
- Click on either the email or password input field.
- A suggestion box will appear to the left of the input field.
- Click on any suggestion to automatically fill both the email and password fields.

## Project Structure
