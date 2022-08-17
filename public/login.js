const loginForm = document.getElementById("login-form");

function redirectIfLoggedIn() {
  if (localStorage.getItem("user")) {
    window.location.replace("/");
  }
}

redirectIfLoggedIn();

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const { email, password } = event.target.elements;
  const body = { email: email.value, password: password.value };
  const response = await fetch("/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const data = await response.json();
  if (response.status >= 400) {
    alert(data.message);
    return;
  }
  alert("Login Successful");
  localStorage.setItem("user", JSON.stringify(data.data.user));
  window.location.replace("/");
});
