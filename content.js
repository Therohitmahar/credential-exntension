// content.js

let allCredentials = [];
let suggestionBox = null;

// --- Helper function to create the suggestion box ---
function createSuggestionBox() {
  if (suggestionBox) return;
  suggestionBox = document.createElement("div");
  suggestionBox.id = "cred-suggestion-box";
  document.body.appendChild(suggestionBox);
}

// --- Helper to disable browser autofill ---
function disableNativeAutofill(inputElement) {
  if (inputElement.getAttribute("autocomplete") !== "off") {
    inputElement.setAttribute("autocomplete", "new-password");
  }
  const relatedField = isEmailField(inputElement)
    ? findPasswordField(inputElement)
    : findEmailField(inputElement);
  if (relatedField && relatedField.getAttribute("autocomplete") !== "off") {
    relatedField.setAttribute("autocomplete", "new-password");
  }
}

// --- The complete showSuggestions function ---
function showSuggestions(triggerElement, suggestions) {
  // Ensure the suggestion box element exists in the DOM
  if (!suggestionBox) {
    createSuggestionBox();
  }

  // If there are no suggestions to show, just hide the box and stop.
  if (suggestions.length === 0) {
    hideSuggestions();
    return;
  }

  // Clear any previous suggestions from the box
  suggestionBox.innerHTML = "";

  // Find the primary email field, which we'll need for populating credentials
  const emailField = isEmailField(triggerElement)
    ? triggerElement
    : findEmailField(triggerElement);

  // Loop through each credential data object and build an HTML element for it
  suggestions.forEach((cred) => {
    const item = document.createElement("div");
    item.className = "suggestion-item";
    const envClass = cred.environment === "Test" ? "test" : "production";
    item.innerHTML = `
            <div class="suggestion-email">${cred.email}</div>
            <div class="suggestion-name">${cred.sourceName}</div>
            <div class="suggestion-environment ${envClass}">${cred.environment}</div>
        `;

    // Add the crucial click event listener to each suggestion item
    item.addEventListener("click", () => {
      // When an item is clicked, find the password field at that moment
      const passField = findPasswordField(emailField);

      // Populate the email field if it exists
      if (emailField) {
        emailField.value = cred.email;
        // Dispatch an 'input' event so frameworks like React/Vue detect the change
        emailField.dispatchEvent(new Event("input", { bubbles: true }));
      }

      // Populate the password field if it exists
      if (passField) {
        passField.value = cred.password;
        // Dispatch an 'input' event for the password field as well
        passField.dispatchEvent(new Event("input", { bubbles: true }));
      }

      // Hide the suggestion box after a selection is made
      hideSuggestions();
    });

    // Add the newly created item to the suggestion box
    suggestionBox.appendChild(item);
  });

  // --- Positioning Logic ---
  // Get the position and dimensions of the element that triggered the suggestions
  const rect = triggerElement.getBoundingClientRect();

  const boxWidth = 280; // A fixed width for a consistent look
  const margin = 8; // A small gap between the input field and the box

  // Position the top of the box to align with the top of the input field
  suggestionBox.style.top = `${rect.top + window.scrollY}px`;

  // Position the box so its right edge aligns with the input field's left edge
  suggestionBox.style.left = `${
    rect.left + window.scrollX - boxWidth - margin
  }px`;

  // Set the width of the box
  suggestionBox.style.width = `${boxWidth}px`;
  suggestionBox.style.setProperty("--pointer-top", `${rect.height / 2}px`);
  // Make the box visible
  suggestionBox.style.display = "block";

  // --- Activation for CSS Transitions ---
  // We use a tiny timeout to ensure the browser registers `display: block`
  // before we add the 'active' class, allowing the opacity transition to work.
  setTimeout(() => {
    suggestionBox.classList.add("active");
  }, 10);
}
// ... (rest of the file is identical) ...

// --- Function to hide suggestions ---
function hideSuggestions() {
  if (suggestionBox) {
    // *** KEY CHANGE: Remove the 'active' class ***
    suggestionBox.classList.remove("active");

    // Hide the element after the fade-out transition is complete
    setTimeout(() => {
      suggestionBox.style.display = "none";
    }, 150); // This duration should match the transition time in your CSS
  }
}

// --- NEW ROBUST HELPER for finding the password field ---
function findPasswordField(emailField) {
  const form = emailField.closest("form");
  // This query looks for an input that is either type="password" OR has "password" in its name or id.
  const passwordSelector =
    'input[type="password"], input[name*="password"], input[id*="password"]';

  if (form) {
    return form.querySelector(passwordSelector);
  }
  // Fallback: search the whole document
  return document.querySelector(passwordSelector);
}

// --- NEW ROBUST HELPER for finding the email field ---
function findEmailField(passField) {
  const form = passField.closest("form");
  const emailSelector =
    'input[type="email"], input[name*="email"], input[id*="email"]';

  if (form) {
    return form.querySelector(emailSelector);
  }
  // Fallback
  return document.querySelector(emailSelector);
}

// --- NEW ROBUST HELPER to check if an element is an email field ---
function isEmailField(element) {
  return element.matches(
    'input[type="email"], input[name*="email"], input[id*="email"]'
  );
}

// --- NEW ROBUST HELPER to check if an element is a password field ---
function isPasswordField(element) {
  return element.matches(
    'input[type="password"], input[name*="password"], input[id*="password"]'
  );
}

// --- Main Logic ---

chrome.runtime.sendMessage({ action: "fetchCredentials" }, (response) => {
  const envText = (envName) => (envName === "production" ? "Prod" : "Test");
  if (response && response.success) {
    allCredentials = response.data.flatMap((edTech) => [
      {
        email: edTech.adminEmail,
        password: edTech.adminPassword,
        sourceName: `${edTech.name} (Super admin)`,
        environment: envText(edTech.environment),
      },
      ...edTech.candidates.map((candidate) => ({
        email: candidate.email,
        password: candidate.password,
        sourceName: `${edTech.name} (Candidate)`,
        environment: envText(edTech.environment),
      })),
    ]);
  } else {
    console.error("Failed to get credentials from background:", response.error);
  }
});

document.addEventListener("focusin", (event) => {
  const target = event.target;
  if (isEmailField(target) || isPasswordField(target)) {
    disableNativeAutofill(target);
    showSuggestions(target, allCredentials);
  }
});

document.addEventListener("keyup", (event) => {
  const target = event.target;
  let searchTerm = "";
  let triggerElement = null;

  if (isEmailField(target)) {
    searchTerm = target.value.toLowerCase();
    triggerElement = target;
  } else if (isPasswordField(target)) {
    const emailField = findEmailField(target);
    if (emailField) {
      searchTerm = emailField.value.toLowerCase();
    }
    triggerElement = target;
  }

  if (triggerElement) {
    const filtered = allCredentials.filter(
      (cred) =>
        cred.email.toLowerCase().includes(searchTerm) ||
        cred.sourceName.toLowerCase().includes(searchTerm)
    );
    showSuggestions(triggerElement, filtered);
  }
});

document.addEventListener("click", (event) => {
  const target = event.target;
  if (
    suggestionBox &&
    !suggestionBox.contains(target) &&
    !isEmailField(target) &&
    !isPasswordField(target)
  ) {
    hideSuggestions();
  }
});
