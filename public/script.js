/* global localStorage, window, document, fetch */

const API = "";

function showTab(tab) {
    document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
    document.querySelectorAll(".form").forEach(f => f.classList.remove("active"));
    
    if (tab === "login") {
        document.querySelectorAll(".tab")[0].classList.add("active");
        document.getElementById("login-form").classList.add("active");
    } else {
        document.querySelectorAll(".tab")[1].classList.add("active");
        document.getElementById("register-form").classList.add("active");
    }
}

document.getElementById("register-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("reg-email").value;
    const password = document.getElementById("reg-password").value;
    
    try {
        const res = await fetch(`${API}/api/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });
        
        const data = await res.json();
        
        if (res.ok) {
            localStorage.setItem("token", data.token);
            window.location.href = "/dashboard";
        } else {
            document.getElementById("reg-error").textContent = data.message || "Ошибка регистрации";
        }
    } catch (err) {
        document.getElementById("reg-error").textContent = "Ошибка соединения";
    }
});

document.getElementById("login-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;
    
    try {
        const res = await fetch(`${API}/api/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });
        
        const data = await res.json();
        
        if (res.ok) {
            localStorage.setItem("token", data.token);
            window.location.href = "/dashboard";
        } else {
            document.getElementById("login-error").textContent = data.message || "Неверные данные";
        }
    } catch (err) {
        document.getElementById("login-error").textContent = "Ошибка соединения";
    }
});