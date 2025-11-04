const apiKey = 'bltba35d3f170d67097';  
const accessToken = 'cs8991dbc60e6ef188b7f61eac'; 
const environment = 'development';
const entryUID = 'bltef90f4f2a313bc65'; 
const contentType = 'tutorial_page';

const url = `https://cdn.contentstack.io/v3/content_types/${contentType}/entries/${entryUID}?environment=${environment}`;

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
    case "a": return `<a href="${node.attrs?.url}" target="_blank">${node.children.map(renderJsonRTE).join("")}</a>`;
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

    document.getElementById('title').textContent = entry.title;

    const img = document.getElementById('featured-image');
    if (entry.featured_image?.url) {
      img.src = entry.featured_image.url;
      img.alt = entry.featured_image.title || entry.title;
    } else {
      img.style.display = 'none';
    }

    // ✅ Correct field name here
    if (entry.json_body?.children) {
      document.getElementById('body').innerHTML =
        entry.json_body.children.map(renderJsonRTE).join("");
    } else {
      document.getElementById('body').textContent = "No content available.";
    }

    document.getElementById('footer').textContent = entry.footer || "";
  })
  .catch(err => {
    console.error("Failed to fetch entry:", err);
    document.getElementById('title').textContent = "Failed to load tutorial.";
  });
