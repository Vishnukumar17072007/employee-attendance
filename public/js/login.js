document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault(); // stop page reload

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch("/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include", // ✅ VERY IMPORTANT
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.message || "Login failed");
            return;
        }

        // ✅ REDIRECT BASED ON ROLE
        if (data.role === "admin") {
            window.location.href = "/admin";
        } else {
            window.location.href = "/employee";
        }

    } catch (error) {
        alert("Something went wrong");
    }
});
