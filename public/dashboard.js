/* global localStorage, window, document, fetch */

const API = "";
const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "/";
}

async function createLink() {
    const url = document.getElementById("original-url").value;
    
    try {
        const res = await fetch(`${API}/api/links`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ originalUrl: url })
        });
        
        const data = await res.json();
        
        if (res.ok) {
            document.getElementById("new-link").classList.remove("hidden");
            document.getElementById("short-url").href = data.link.shortUrl;
            document.getElementById("short-url").textContent = data.link.shortUrl;
            loadLinks();
        } else {
            document.getElementById("create-error").textContent = data.message || "Ошибка";
        }
    } catch (err) {
        document.getElementById("create-error").textContent = "Ошибка соединения";
    }
}

async function loadLinks() {
    try {
        const res = await fetch(`${API}/api/links`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        
        const data = await res.json();
        const tbody = document.getElementById("links-body");
        tbody.innerHTML = "";
        
        data.links.forEach(link => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${link.shortCode}</td>
                <td>${link.originalUrl.substring(0, 50)}...</td>
                <td><a href="${link.shortUrl}" target="_blank">${link.shortUrl}</a></td>
                <td><button onclick="deleteLink(${link.id})">Удалить</button></td>
            `;
            tbody.appendChild(tr);
        });
    } catch (err) {
        console.error("Ошибка загрузки ссылок:", err);
    }
}

async function deleteLink(id) {
    try {
        await fetch(`${API}/api/links/${id}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${token}` }
        });
        loadLinks();
    } catch (err) {
        console.error("Ошибка удаления:", err);
    }
}

function logout() {
    localStorage.removeItem("token");
    window.location.href = "/";
}

loadLinks();