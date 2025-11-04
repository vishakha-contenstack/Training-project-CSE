const form = document.getElementById("login-form");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = document.getElementById("email-input").value.trim();
  const password = document.getElementById("password-input").value;

  // Get stored user data
  const storedUser = JSON.parse(localStorage.getItem("user"));

  if (!storedUser) {
    alert("⚠️ No user found! Please sign up first.");
    window.location.href = "signup.html";
    return;
  }

  // Validate credentials
  if (email === storedUser.email && password === storedUser.password) {
    alert(`🎉 Welcome back, ${storedUser.firstName}!`);
    // Optionally store a flag to indicate login status
    localStorage.setItem("isLoggedIn", "true");
    window.location.href = "index.html"; // redirect to homepage
  } else {
    alert("❌ Invalid email or password. Please try again!");
  }
});
