const signupForm = document.getElementById("signup-form");

function redirectIfLoggedIn() {
  if (localStorage.getItem("user")) {
    window.location.replace("/");
  }
}

redirectIfLoggedIn();

signupForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const { firstname, lastname, email, password } = event.target.elements;
  const body = {
    firstName: firstname.value,
    lastName: lastname.value,
    email: email.value,
    password: password.value,
  };
  const response = await fetch("/api/signup", {
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
  alert("Signup Successful");
  localStorage.setItem("user", JSON.stringify(data.data.user));
  window.location.replace("/");
});
