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

document.getElementById("sendOtp").addEventListener("click", async () => {
    const email = document.getElementById("oEmail").value;

    if (!email) {
        alert("Please enter email");
        return;
    }

    const res = await fetch("/auth/request-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
    });

    const data = await res.json();

    if (!res.ok) {
        alert(data.message || "Failed to send OTP");
        return;
    }

    alert("OTP sent to your email");
    document.getElementById("otpSection").style.display = "block";
});
