let otpType = null; // "email" or "phone"


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
// 🔁 SHARED REDIRECT LOGIC
// ==============================
function redirectByRole(role) {
    if (role === "admin") {
        window.location.href = "/admin";
    } else {
        window.location.href = "/employee";
    }
}

// ==============================
// 📧 EMAIL OTP
// ==============================
document.getElementById("sendOtp").addEventListener("click", async () => {
    const email = document.getElementById("oEmail").value.trim();

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

    otpType = "email";
    document.getElementById("otpSection").style.display = "block";
    alert("OTP sent to your email");
});


// ==============================
// 📱 MOBILE OTP
// ==============================
document.getElementById("sendMobileOtp").addEventListener("click", async () => {
    const phone = document.getElementById("phone").value.trim();

    if (!phone) {
        alert("Please enter mobile number");
        return;
    }

    const res = await fetch("/auth/request-mobile-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone })
    });

    const data = await res.json();

    if (!res.ok) {
        alert(data.message || "Failed to send OTP");
        return;
    }

    otpType = "phone";
    document.getElementById("otpSection").style.display = "block";
    alert("OTP sent to mobile");
});


// ==============================
// 🔐 VERIFY OTP (EMAIL / MOBILE)
// ==============================
document.getElementById("verifyOtp").addEventListener("click", async () => {
    const otp = document.getElementById("otp").value.trim();

    if (!otp) {
        alert("Please enter OTP");
        return;
    }

    let payload = { otp };

    if (otpType === "email") {
        const email = document.getElementById("oEmail").value.trim();
        if (!email) {
            alert("Email missing");
            return;
        }
        payload.email = email;
    }

    if (otpType === "phone") {
        const phone = document.getElementById("phone").value.trim();
        if (!phone) {
            alert("Phone number missing");
            return;
        }
        payload.phone = phone;
    }

    if (!otpType) {
        alert("Please request OTP first");
        return;
    }

    const res = await fetch("/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (!res.ok) {
        alert(data.message || "OTP verification failed");
        return;
    }

    redirectByRole(data.role);
});

document.getElementById("sendWhatsAppOtp").addEventListener("click", async () => {
    const phone = document.getElementById("phone").value.trim();

    if (!phone) {
        alert("Enter phone number");
        return;
    }

    const res = await fetch("/auth/request-whatsapp-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone })
    });

    const data = await res.json();

    if (!res.ok) {
        alert(data.message);
        return;
    }
    otpType = "phone";
    alert("OTP sent via WhatsApp");
    document.getElementById("otpSection").style.display = "block";
});
