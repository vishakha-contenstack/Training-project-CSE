// live-preview.js
window.ContentstackLivePreview.init({
  stackDetails: {
    apiKey: "bltba35d3f170d67097",
    environment: "development",
    region: "us"
  },
  enable: true,
  ssr: false,
  mode: "live"
});

// Re-fetch content when entry changes
window.ContentstackLivePreview.onEntryChange(() => {
  console.log("Entry changed → Re-fetching...");
  fetchAndRender(); // we will define this next
});
