document.addEventListener("DOMContentLoaded", () => {
    const logoutBtn = document.getElementById("logout");

    if (!logoutBtn) {
        console.error("Logout button not found");
        return;
    }

    logoutBtn.addEventListener("click", async () => {
        try {
            const res = await fetch("/auth/logout", {
                method: "POST",
                credentials: "include"
            });

            if (res.ok) {
                window.location.replace("/login");
            } else {
                alert("Logout failed");
            }
        } catch (err) {
            alert("Something went wrong");
        }
    });
});
