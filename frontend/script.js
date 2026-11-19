
// ===============================
// LOGIN FUNCTIONALITY
// ===============================

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        const message = document.getElementById("message");
        const loginBtn = document.getElementById("loginBtn");

        loginBtn.disabled = true;
        loginBtn.textContent = "Signing in...";
        message.textContent = "";

        try {

            const response = await fetch(
                "http://localhost:8080/auth/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email: email,
                        password: password
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Invalid email or password"
                );
            }

            // Save JWT Token
            if (!data.token) {
                throw new Error("JWT token not received from server");
            }

            localStorage.setItem("jwtToken", data.token);

            // Success Message
            message.style.color = "green";
            message.textContent =
                "Login successful! Redirecting to dashboard...";

            // Redirect to Dashboard
            setTimeout(() => {
                window.location.href = "dashboard.html";
            }, 1000);

        } catch (error) {

            message.style.color = "red";
            message.textContent = error.message;

        } finally {

            loginBtn.disabled = false;
            loginBtn.textContent = "Sign In";

        }
    });
}


// ===============================
// REGISTRATION FUNCTIONALITY
// ===============================

const registerForm = document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const username = document.getElementById("username").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        const message = document.getElementById("message");
        const registerBtn = document.getElementById("registerBtn");

        registerBtn.disabled = true;
        registerBtn.textContent = "Registering...";
        message.textContent = "";

        try {

            const response = await fetch(
                "http://localhost:8080/auth/register",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        username: username,
                        email: email,
                        password: password
                    })
                }
            );

            const data = await response.text();

            if (!response.ok) {
                throw new Error(
                    data || "Registration failed"
                );
            }

            message.style.color = "green";
            message.textContent =
                "Registration successful! Please login.";

            registerForm.reset();

        } catch (error) {

            message.style.color = "red";
            message.textContent = error.message;

        } finally {

            registerBtn.disabled = false;
            registerBtn.textContent = "Create Account";

        }
    });
}
