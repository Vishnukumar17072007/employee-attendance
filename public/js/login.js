// ==============================
// 🔐 PASSWORD LOGIN (OLD LOGIC)
// ==============================
document.getElementById("passwordLoginForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("pEmail").value;
    const password = document.getElementById("pPassword").value;

    try {
        const res = await fetch("/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (!res.ok) {
            alert(data.message || "Login failed");
            return;
        }

        redirectByRole(data.role);

    } catch {
        alert("Something went wrong");
    }
});


// ==============================
// 🔑 OTP LOGIN (NEW LOGIC)
// ==============================
document.getElementById("sendOtp").addEventListener("click", async () => {
    const email = document.getElementById("oEmail").value;

    const res = await fetch("/auth/request-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
    });

    if (res.ok) {
        alert("OTP sent");
        document.getElementById("otpSection").style.display = "block";
    }
});

document.getElementById("verifyOtp").addEventListener("click", async () => {
    const email = document.getElementById("oEmail").value;
    const otp = document.getElementById("otp").value;

    const res = await fetch("/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, otp })
    });

    const data = await res.json();

    if (!res.ok) {
        alert(data.message);
        return;
    }

    redirectByRole(data.role);
});


// ==============================
// 🔁 SHARED REDIRECT LOGIC
// ==============================
function redirectByRole(role) {
    if (role === "admin") {
        window.location.href = "/admin";
    } else {
        window.location.href = "/employee";
    }
}
