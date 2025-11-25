

const apiKey = "bltba35d3f170d67097"; // your stack API key
const accessToken = "cs8991dbc60e6ef188b7f61eac"; // delivery token
const environment = "development";
const contentType = "sign_up_page";
const entryUID = "bltee9fd3095a263ea6"; // your entry UID

const url = `https://cdn.contentstack.io/v3/content_types/${contentType}/entries/${entryUID}?environment=${environment}`;

// Function to render JSON RTE to HTML
function renderJsonRTE(node) {
  if (!node) return "";
  if (node.text) return node.text;

  switch (node.type) {
    case "p": return `<p>${node.children.map(renderJsonRTE).join("")}</p>`;
    case "a": return `<a href="${node.attrs?.url}" target="_blank">${node.children.map(renderJsonRTE).join("")}</a>`;
    default:
      return node.children ? node.children.map(renderJsonRTE).join("") : "";
  }
}

// Fetch and render content
fetch(url, {
  headers: {
    api_key: apiKey,
    access_token: accessToken,
  },
})
  .then(res => res.json())
  .then(data => {
    const entry = data.entry;

    // Hero image
    const hero = document.getElementById("hero-image");
    hero.src = entry.hero_image.url;
    hero.alt = entry.hero_image.title;

    // Title + intro
    document.getElementById("title").textContent = entry.title;
    document.getElementById("intro").innerHTML = renderJsonRTE(entry.intro_text);

    // Input placeholders
    document.getElementById("fullname").placeholder = renderJsonRTE(entry.inputs.full_name);
    document.getElementById("email").placeholder = renderJsonRTE(entry.inputs.email);
    document.getElementById("password").placeholder = renderJsonRTE(entry.inputs.password);

    // Button + footer
    document.getElementById("cta").textContent = entry.cta_lable_button;
    document.getElementById("footer").innerHTML = renderJsonRTE(entry.footer_text);
  })
  .catch(err => console.error("Failed to load signup content:", err));

document.getElementById("signup-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const firstName = document.getElementById("fullname").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  localStorage.setItem("user", JSON.stringify({ firstName, email, password }));
  alert(`🎉 Welcome, ${firstName}! You've signed up successfully.`);
  window.location.href = "index.html";
});

