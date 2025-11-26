// document.addEventListener("DOMContentLoaded", async () => {
//   const apiKey = "bltba35d3f170d67097";
//   const previewToken = "cs3bb50ffa002b1cd154243af0"; 
//   const environment = "development";
//   const locale = "en-us"; // Adjust to your locale

//   const entryUID = document.querySelector("main").dataset.entryUid;
//   const contentType = "author_page";

//   const url = `https://preview.contentstack.io/v3/content_types/${contentType}/entries/${entryUID}?environment=${environment}&locale=${locale}`;

//   try {
//     const res = await fetch(url, {
//       headers: {
//         "api_key": apiKey,
//         "authorization": `Bearer ${previewToken}` // <- MUST be Bearer
//       }
//     });

//     if (!res.ok) throw new Error(`HTTP error ${res.status}`);

//     const data = await res.json();
//     const entry = data.entry;

//     if (!entry) {
//       document.getElementById("personalized-output").innerHTML = "<p>Entry not found.</p>";
//       return;
//     }

//     // Render title + intro
//     document.getElementById("author-title").textContent = entry.title;
//     document.getElementById("author-intro").textContent = entry.intro_text;

//     // Render personalized field (genre variants)
//     const output = document.getElementById("personalized-output");
//     if (entry.genre_variants) {
//       const values = Object.values(entry.genre_variants);
//       output.innerHTML = values.map(v => `<p>${v}</p>`).join("");
//     } else {
//       output.innerHTML = "";
//     }

//   } catch (err) {
//     console.error("Error fetching preview entry:", err);
//     document.getElementById("personalized-output").innerHTML = "<p>Error loading content.</p>";
//   }
// });

document.addEventListener("DOMContentLoaded", async () => {
  // Get the entry UID from the main element
  const entryUID = document.querySelector("main").dataset.entryUid;

  try {
    // Fetch data from the backend proxy
    const res = await fetch(`/api/author/${entryUID}`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);

    const data = await res.json();
    const entry = data.entry;

    if (!entry) {
      document.getElementById("personalized-output").innerHTML = "<p>Entry not found.</p>";
      return;
    }

    // Render the author title and intro
    document.getElementById("author-title").textContent = entry.title || "";
    document.getElementById("author-intro").textContent = entry.intro_text || "";

    // Render personalized field (genre variants)
    const output = document.getElementById("personalized-output");
    if (entry.genre_variants) {
      const values = Object.values(entry.genre_variants);
      output.innerHTML = values.map(v => `<p>${v}</p>`).join("");
    } else {
      output.innerHTML = "";
    }

  } catch (err) {
    console.error("Error fetching entry via proxy:", err);
    document.getElementById("personalized-output").innerHTML = "<p>Error loading content.</p>";
  }
});

