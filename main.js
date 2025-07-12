// main.js

const themeToggle = document.getElementById("theme-toggle");
const htmlEl = document.documentElement;
themeToggle.addEventListener("click", () => {
  htmlEl.classList.toggle("dark");
});

const searchInput = document.getElementById("searchInput");
const credentialGrid = document.getElementById("credential-grid");
const credentialCards = document.querySelectorAll(".credential-card");
const noResults = document.getElementById("no-results");

searchInput.addEventListener("input", (e) => {
  const searchTerm = e.target.value.toLowerCase();
  let resultsFound = false;
  credentialCards.forEach((card) => {
    const name = card.dataset.name.toLowerCase();
    const email = card.dataset.email.toLowerCase();
    const environment = card.dataset.environment.toLowerCase();
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
  if (resultsFound) {
    noResults.classList.add("hidden");
    credentialGrid.classList.remove("items-center");
  } else {
    noResults.classList.remove("hidden");
    credentialGrid.classList.add("items-center");
  }
});

document.querySelectorAll(".copy-btn").forEach((button) => {
  button.addEventListener("click", (e) => {
    const row = e.currentTarget.closest(".flex");
    const textElement = row.querySelector(".truncate, .password-text");
    const textToCopy = textElement.dataset.password || textElement.textContent;
    navigator.clipboard.writeText(textToCopy).then(() => {
      const tooltip = button.querySelector(".tooltip");
      const originalText = tooltip.textContent;
      tooltip.textContent = "Copied!";
      setTimeout(() => {
        tooltip.textContent = originalText;
      }, 2000);
    });
  });
});

document.querySelectorAll(".password-toggle-btn").forEach((button) => {
  button.addEventListener("click", (e) => {
    const toggle = e.currentTarget.closest(".password-toggle");
    const passwordText = toggle.querySelector(".password-text");
    const isVisible = toggle.classList.toggle("visible");
    if (isVisible) {
      passwordText.textContent = passwordText.dataset.password;
    } else {
      // Use '•' to mask the password, ensuring the length matches
      passwordText.textContent = "•".repeat(
        passwordText.dataset.password.length
      );
    }
  });
});
