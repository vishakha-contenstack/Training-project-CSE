// Grab the signup form
const form = document.querySelector("form");

form.addEventListener("submit", (e) => {
  e.preventDefault(); // stop default refresh

  // Get form values
  const firstName = document.getElementById("firstname-input").value.trim();
  const email = document.getElementById("email-input").value.trim();
  const password = document.getElementById("password-input").value;
  const repeatPassword = document.getElementById("repeat-password-input").value;

  // Simple validation
  if (!firstName || !email || !password || !repeatPassword) {
    alert("⚠️ Please fill out all fields!");
    return;
  }

  if (password !== repeatPassword) {
    alert("❌ Passwords do not match!");
    return;
  }

  // Save data to localStorage
  const user = {
    firstName,
    email,
    password, // ⚠️ NOTE: don’t store real passwords like this in production
    createdAt: new Date().toISOString(),
  };

  localStorage.setItem("user", JSON.stringify(user));

  // Confirmation
  alert(`🎉 Welcome aboard, ${firstName}!`);

  // Redirect to homepage
  window.location.href = "index.html";
});

const logoutBtn = document.getElementById("logout-btn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("user");
    alert("👋 You’ve been logged out!");
    window.location.reload();
  });
}

