const apiKey = 'bltba35d3f170d67097';
const accessToken = 'cs8991dbc60e6ef188b7f61eac';
const environment = 'development';
const entryUID = 'blt3acaa2c850ca1f1c';
const contentType = 'blog_post';

const url = `https://cdn.contentstack.io/v3/content_types/${contentType}/entries/${entryUID}?environment=${environment}`;

// --- Utility: render JSON RTE ---
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

async function fetchAndRender() {
  try {
    const res = await fetch(url, {
      headers: {
        api_key: apiKey,
        access_token: accessToken,
      }
    });

    const data = await res.json();
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

    // --- Author Quotes ---
    const feedbacks = Object.values(entry.feedbacks || {});
    const feedbackSection = document.createElement("section");
    feedbackSection.innerHTML = "<h2>💬 Author Quotes</h2>";
    feedbackSection.id = "feedback-section";

    const feedbackList = document.createElement("div");
    feedbackList.className = "feedback-grid";

    feedbacks.forEach(fb => {
      const card = document.createElement("div");
      card.className = "feedback-card";
      card.innerHTML = `<p>${fb}</p>`;
      feedbackList.appendChild(card);
    });

    if (feedbacks.length) {
      feedbackSection.appendChild(feedbackList);
      document.querySelector("main").appendChild(feedbackSection);
    }

    // --- Latest Books (NEW GROUP FIELD) ---
    const latestBooksContainer = document.getElementById("latest-books-container");
    latestBooksContainer.innerHTML = ""; // clear previous content

    if (entry.group_field_books) {
      const group = entry.group_field_books;

      const bookFields = [
        group.books_suggestions,
        group.book_suggestions_2,
        group.book_suggestions_3
      ].filter(Boolean);

      bookFields.forEach(bookText => {
        const div = document.createElement("div");
        div.className = "book-card";
        div.innerHTML = `<pre>${bookText}</pre>`;
        latestBooksContainer.appendChild(div);
      });
    }

    // Footer
    const footer = document.getElementById("footer");
    footer.textContent = entry.footer || "";

  } catch (err) {
    console.error("Error fetching entry:", err);
    document.getElementById("title").textContent = "Failed to load content.";
  }
}

window.onload = fetchAndRender;
