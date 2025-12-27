document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault(); // stop page reload

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const response = await fetch("/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (response.ok) {
        alert("Login successful");
    } else {
        alert(data.message || "Login failed");
    }
});
