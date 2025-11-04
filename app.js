const apiKey = 'bltba35d3f170d67097';  // your API key
const accessToken = 'cs8991dbc60e6ef188b7f61eac'; // your delivery token
const environment = 'development';
const entryUID = 'blt3acaa2c850ca1f1c'; 
const contentType = 'blog_post';

const url = `https://cdn.contentstack.io/v3/content_types/${contentType}/entries/${entryUID}?environment=${environment}`;

// ✅ Utility: Render JSON RTE into HTML
function renderJsonRTE(node) {
  if (!node) return "";

  // If it's plain text
  if (node.text) return node.text;

  switch (node.type) {
    case "p":
      return `<p>${node.children.map(renderJsonRTE).join("")}</p>`;
    case "h1":
      return `<h1>${node.children.map(renderJsonRTE).join("")}</h1>`;
    case "h2":
      return `<h2>${node.children.map(renderJsonRTE).join("")}</h2>`;
    case "ul":
      return `<ul>${node.children.map(renderJsonRTE).join("")}</ul>`;
    case "ol":
      return `<ol>${node.children.map(renderJsonRTE).join("")}</ol>`;
    case "li":
      return `<li>${node.children.map(renderJsonRTE).join("")}</li>`;
    case "a":
      return `<a href="${node.attrs?.url}" target="_blank">${node.children.map(renderJsonRTE).join("")}</a>`;
    default:
      if (node.children) return node.children.map(renderJsonRTE).join("");
      return "";
  }
}

fetch(url, {
  headers: {
    api_key: apiKey,
    access_token: accessToken,
  }
})
  .then(res => res.json())
  .then(data => {
    const entry = data.entry;

    // Title
    document.getElementById('title').textContent = entry.title;

    // Featured Image
    const img = document.getElementById('featured-image');
    if (entry.featured_image && entry.featured_image.url) {
      img.src = entry.featured_image.url;
      img.alt = entry.featured_image.title || entry.title;
    } else {
      img.style.display = 'none';
    }

    // Body (render JSON RTE properly)
    if (entry.body && entry.body.children) {
      const bodyHTML = entry.body.children.map(renderJsonRTE).join("");
      document.getElementById('body').innerHTML = bodyHTML;
    } else {
      document.getElementById('body').textContent = "No content available.";
    }

    // Footer
    document.getElementById('footer').textContent = entry.footer || "";
  })
  .catch(err => {
    console.error('Failed to fetch entry:', err);
    document.getElementById('title').textContent = 'Failed to load blog post.';
  });

  // Personalized greeting if user is signed up
// Personalized greeting if user is logged in
const user = JSON.parse(localStorage.getItem("user"));
const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
const footer = document.getElementById("footer");

if (user && isLoggedIn) {
  footer.innerHTML = `👋 Hey <strong>${user.firstName}</strong>! Welcome back to your Contentstack world 🚀
    <br><button id="logout-btn" class="logout-btn">Logout</button>`;
} else if (user && !isLoggedIn) {
  footer.innerHTML = `👋 Hi <strong>${user.firstName}</strong>! You’re signed up but not logged in. <a href="login.html">Log in here</a>`;
} else {
  footer.innerHTML = `👋 Hey there! <a href="login.html">Log in</a> or <a href="signup.html">Sign up</a> to personalize your experience.`;
}

// Logout functionality
const logoutBtn = document.getElementById("logout-btn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("isLoggedIn");
    alert("👋 You’ve been logged out!");
    window.location.reload();
  });
}


