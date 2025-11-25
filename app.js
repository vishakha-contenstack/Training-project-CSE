const apiKey = 'bltba35d3f170d67097';  // your stack API key
const accessToken = 'cs8991dbc60e6ef188b7f61eac'; // your delivery token
const environment = 'development';
const entryUID = 'blt3acaa2c850ca1f1c';  // homepage entry UID
const contentType = 'blog_post';

const url = `https://cdn.contentstack.io/v3/content_types/${contentType}/entries/${entryUID}?environment=${environment}`;

// --- Utility: render JSON RTE into HTML ---
function renderJsonRTE(node) {
  if (!node) return "";
  if (node.text) return node.text;

  switch (node.type) {
    case "p": return `<p>${node.children.map(renderJsonRTE).join("")}</p>`;
    case "h1": return `<h1>${node.children.map(renderJsonRTE).join("")}</h1>`;
    case "h2": return `<h2>${node.children.map(renderJsonRTE).join("")}</h2>`;
    case "ul": return `<ul>${node.children.map(renderJsonRTE).join("")}</ul>`;
    case "ol": return `<ol>${node.children.map(renderJsonRTE).join("")}</ol>`;
    case "li": return `<li>${node.children.map(renderJsonRTE).join("")}</li>`;
    case "a":
      return `<a href="${node.attrs?.url}" target="_blank">${node.children.map(renderJsonRTE).join("")}</a>`;
    default:
      return node.children ? node.children.map(renderJsonRTE).join("") : "";
  }
}

// --- Fetch entry from Contentstack ---
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
    document.getElementById("title").textContent = entry.title;

    // Featured Image
  const banner = document.getElementById("featured-image");
if (banner && entry.featured_image?.url) {
  banner.src = entry.featured_image.url;
  banner.alt = entry.featured_image.title || "Banner";
} else if (banner) {
  banner.style.display = "none";
}

    // Body
    if (entry.body?.children) {
      const bodyHTML = entry.body.children.map(renderJsonRTE).join("");
      document.getElementById("body").innerHTML = bodyHTML;
    }

    // Feedbacks
    const feedbackContainer = document.createElement("section");
    feedbackContainer.innerHTML = "<h2>💬 Customer Feedback</h2>";
    feedbackContainer.id = "feedback-section";

    // Convert feedback strings into readable text
    const feedbacks = [];
    if (entry.feedbacks) {
      Object.values(entry.feedbacks).forEach(feedbackStr => {
        try {
          // Try to parse if it looks like JSON; otherwise, use plain text
          if (feedbackStr.startsWith("{") || feedbackStr.startsWith("[")) {
            const parsed = JSON.parse(feedbackStr);
            feedbacks.push(...Object.values(parsed));
          } else {
            feedbacks.push(feedbackStr);
          }
        } catch {
          feedbacks.push(feedbackStr);
        }
      });
    }

    // Render feedbacks dynamically
    if (feedbacks.length) {
      const feedbackList = document.createElement("div");
      feedbackList.className = "feedback-grid";

      feedbacks.forEach((fb) => {
        const fbDiv = document.createElement("div");
        fbDiv.className = "feedback-card";
        fbDiv.innerHTML = `<p>${fb}</p>`;
        feedbackList.appendChild(fbDiv);
      });

      feedbackContainer.appendChild(feedbackList);
      document.querySelector("main").appendChild(feedbackContainer);
    }

    // Footer
    const footer = document.getElementById("footer");
    footer.textContent = entry.footer || "";

    // Personalized Greeting (if logged in)
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    if (user) {
      footer.innerHTML += `<br>👋 Welcome back, <strong>${user.first_name}</strong>!`;
    }
  })
  .catch(err => {
    console.error("Error fetching entry:", err);
    document.getElementById("title").textContent = "Failed to load content.";
  });
