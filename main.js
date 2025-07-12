// main.js

const BASE_URL = "https://email-storage-be.onrender.com";

// This function will run as soon as the popup's HTML is loaded.
document.addEventListener("DOMContentLoaded", () => {
  // Show a loading state (optional but good practice)
  const grid = document.getElementById("credential-grid");
  grid.innerHTML =
    '<p class="text-center col-span-full">Loading credentials...</p>';

  fetchAndDisplayEdTechs();

  // Setup all event listeners that don't depend on dynamic content
  setupStaticEventListeners();

  // Setup event listeners for dynamic content using event delegation
  setupDynamicEventListeners();
});

const fetchAndDisplayEdTechs = async () => {
  try {
    const response = await fetch(`${BASE_URL}/edtech/all`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const edTechs = await response.json();

    const grid = document.getElementById("credential-grid");
    grid.innerHTML = ""; // Clear the loading message

    if (edTechs && edTechs.length > 0) {
      edTechs.forEach((edTech) => {
        const card = createCredentialCard(edTech);
        grid.appendChild(card);
      });
    } else {
      // Display a "no results" message
      document.getElementById("no-results").classList.remove("hidden");
    }
  } catch (error) {
    console.error("Failed to fetch ed-techs:", error);
    const grid = document.getElementById("credential-grid");
    grid.innerHTML = `<p class="text-center col-span-full text-red-500">Failed to load credentials. Please try again later.</p>`;
  }
};

function createCredentialCard(edTech) {
  const cardDiv = document.createElement("div");
  // Map all emails for the search data attribute
  const allEmails = [
    edTech.adminEmail,
    ...edTech.candidates.map((c) => c.email),
  ].join(" ");

  cardDiv.className = `credential-card bg-[var(--card-light)] rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 border-l-4 ${
    edTech.environment === "production"
      ? "border-teal-500"
      : "border-orange-500"
  } relative group`;
  cardDiv.dataset.id = edTech._id;
  cardDiv.dataset.name = edTech.name.toLowerCase();
  cardDiv.dataset.environment = edTech.environment.toLowerCase();
  cardDiv.dataset.email = allEmails.toLowerCase();

  // Map candidates to their HTML structure
  const candidatesHTML = edTech.candidates
    .map(
      (candidate) => `
        <div class="flex items-center text-sm text-[var(--text-secondary-light)]">
            <span class="material-icons text-base mr-3 w-5">email</span>
            <span class="truncate mr-2">${candidate.email}</span>
            <button class="copy-btn ml-auto text-gray-400 hover:text-blue-500 p-1 rounded-full relative has-tooltip">
                <span class="material-icons text-base">content_copy</span>
                <span class="tooltip -top-8 left-1/2 -translate-x-1/2 rounded-md bg-gray-800 px-2 py-1 text-xs text-white">Copy</span>
            </button>
        </div>
        <div class="flex items-center text-sm text-[var(--text-secondary-light)] password-toggle">
            <span class="material-icons text-base mr-3 w-5">lock</span>
            <span class="password-text mr-2" data-password="${candidate.password}">•••••••••</span>
            <button class="password-toggle-btn ml-2 text-gray-400 hover:text-blue-500 p-1 rounded-full">
                <span class="material-icons text-base visibility-on">visibility</span>
                <span class="material-icons text-base visibility-off">visibility_off</span>
            </button>
            <button class="copy-btn ml-auto text-gray-400 hover:text-blue-500 p-1 rounded-full relative has-tooltip">
                <span class="material-icons text-base">content_copy</span>
                <span class="tooltip -top-8 left-1/2 -translate-x-1/2 rounded-md bg-gray-800 px-2 py-1 text-xs text-white">Copy</span>
            </button>
        </div>
    `
    )
    .join('<div class="h-4"></div>'); // Add a little space between candidates

  const environmentBadge = `
        <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
          edTech.environment === "production"
            ? "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200"
            : "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
        } capitalize">
            <span class="material-icons text-sm mr-1.5">${
              edTech.environment === "production" ? "cloud_done" : "science"
            }</span>
            ${edTech.environment}
        </span>
    `;

  cardDiv.innerHTML = `
        <div class="absolute top-4 right-4 flex space-x-2">
            <button class="edit-btn text-gray-400 hover:text-blue-500 opacity-0 group-hover:opacity-100 p-1 rounded-full has-tooltip">
                <span class="material-icons text-base">edit</span>
                <span class="tooltip -top-8 left-1/2 -translate-x-1/2 rounded-md bg-gray-800 px-2 py-1 text-xs text-white">Edit</span>
            </button>
            <button class="delete-btn text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 p-1 rounded-full has-tooltip">
                <span class="material-icons text-base">delete</span>
                <span class="tooltip -top-8 left-1/2 -translate-x-1/2 rounded-md bg-gray-800 px-2 py-1 text-xs text-white">Delete</span>
            </button>
        </div>
        <div class="p-6">
            <h2 class="text-xl font-bold mb-4 text-[var(--text-light)]">${
              edTech.name
            }</h2>
            <div class="space-y-4">
                <div class="flex items-center text-sm text-[var(--text-secondary-light)]">
                    <span class="material-icons text-base mr-3 w-5">person</span>
                    <span class="font-medium text-[var(--text-light)] mr-2 min-w-[5rem]">Admin:</span>
                    <span class="truncate mr-2">${edTech.adminEmail}</span>
                    <button class="copy-btn ml-auto text-gray-400 hover:text-blue-500 p-1 rounded-full relative has-tooltip">
                        <span class="material-icons text-base">content_copy</span>
                        <span class="tooltip -top-8 left-1/2 -translate-x-1/2 rounded-md bg-gray-800 px-2 py-1 text-xs text-white">Copy</span>
                    </button>
                </div>
                <div class="flex items-center text-sm text-[var(--text-secondary-light)] password-toggle">
                    <span class="material-icons text-base mr-3 w-5">lock</span>
                    <span class="font-medium text-[var(--text-light)] mr-2 min-w-[5rem]">Password:</span>
                    <span class="password-text mr-2" data-password="${
                      edTech.adminPassword
                    }">•••••••••••••</span>
                    <button class="password-toggle-btn ml-2 text-gray-400 hover:text-blue-500 p-1 rounded-full">
                        <span class="material-icons text-base visibility-on">visibility</span>
                        <span class="material-icons text-base visibility-off">visibility_off</span>
                    </button>
                    <button class="copy-btn ml-auto text-gray-400 hover:text-blue-500 p-1 rounded-full relative has-tooltip">
                        <span class="material-icons text-base">content_copy</span>
                        <span class="tooltip -top-8 left-1/2 -translate-x-1/2 rounded-md bg-gray-800 px-2 py-1 text-xs text-white">Copy</span>
                    </button>
                </div>
            </div>
            ${
              edTech.candidates.length > 0
                ? `
            <div class="mt-5 border-t border-[var(--border-light)] pt-4">
                <h3 class="text-sm font-semibold mb-3 text-[var(--text-secondary-light)] uppercase tracking-wider">Candidates</h3>
                <div class="space-y-4">${candidatesHTML}</div>
            </div>
            `
                : ""
            }
            <div class="flex items-center justify-between pt-6">
                ${environmentBadge}
                <a class="flex items-center text-blue-500 hover:underline text-sm font-medium dark:text-blue-400" href="${
                  edTech.loginURL
                }" target="_blank">
                    <span>Login URL</span>
                    <span class="material-icons text-sm ml-1">open_in_new</span>
                </a>
            </div>
        </div>
    `;

  return cardDiv;
}

function setupStaticEventListeners() {
  // Theme toggle
  document.getElementById("theme-toggle").addEventListener("click", () => {
    document.documentElement.classList.toggle("dark");
  });

  // Search input
  const searchInput = document.getElementById("searchInput");
  searchInput.addEventListener("input", (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const noResults = document.getElementById("no-results");
    let resultsFound = false;

    document.querySelectorAll(".credential-card").forEach((card) => {
      const name = card.dataset.name || "";
      const email = card.dataset.email || "";
      const environment = card.dataset.environment || "";

      if (
        name.includes(searchTerm) ||
        email.includes(searchTerm) ||
        environment.includes(searchTerm)
      ) {
        card.style.display = "block";
        resultsFound = true;
      } else {
        card.style.display = "none";
      }
    });

    noResults.classList.toggle("hidden", resultsFound);
  });
}

function setupDynamicEventListeners() {
  const credentialGrid = document.getElementById("credential-grid");

  credentialGrid.addEventListener("click", (e) => {
    // Find the button that was clicked, even if the click was on its child (like the icon)
    const copyBtn = e.target.closest(".copy-btn");
    const toggleBtn = e.target.closest(".password-toggle-btn");
    const deleteBtn = e.target.closest(".delete-btn");

    if (copyBtn) {
      handleCopy(copyBtn);
    } else if (toggleBtn) {
      handlePasswordToggle(toggleBtn);
    } else if (deleteBtn) {
      // Placeholder for delete functionality
      const card = deleteBtn.closest(".credential-card");
      const credId = card.dataset.id;
      console.log("Delete button clicked for ID:", credId);
      alert("Delete functionality not yet implemented.");
    }
  });
}

function handleCopy(button) {
  const row = button.closest(".flex");
  const textElement = row.querySelector(".truncate, .password-text");
  if (!textElement) return;

  const textToCopy =
    textElement.dataset.password || textElement.textContent.trim();
  navigator.clipboard.writeText(textToCopy).then(() => {
    const tooltip = button.querySelector(".tooltip");
    if (!tooltip) return;
    const originalText = tooltip.textContent;
    tooltip.textContent = "Copied!";
    setTimeout(() => {
      tooltip.textContent = originalText;
    }, 2000);
  });
}

function handlePasswordToggle(button) {
  const toggle = button.closest(".password-toggle");
  if (!toggle) return;

  const passwordText = toggle.querySelector(".password-text");
  const isVisible = toggle.classList.toggle("visible");

  if (isVisible) {
    passwordText.textContent = passwordText.dataset.password;
  } else {
    passwordText.textContent = "•".repeat(passwordText.dataset.password.length);
  }
}