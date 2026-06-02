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
                <td>
                    <button onclick="deleteLink(${link.id})">Удалить</button>
                    <button onclick="showStats('${link.shortCode}')">Статистика</button>
                </td>
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

async function showStats(shortCode) {
    try {
        const res = await fetch(`${API}/api/links/${shortCode}/analytics`, {
            headers: { "Authorization": `Bearer ${token}` }
        });

        const data = await res.json();
        const content = document.getElementById("stats-content");

        let html = `<p><strong>Короткий код:</strong> ${data.shortCode}</p>`;
        html += `<p><strong>Оригинальный URL:</strong> ${data.originalUrl}</p>`;
        html += `<p><strong>Всего кликов:</strong> ${data.totalClicks}</p>`;

        if (data.clicksByDay.length > 0) {
            html += `<h3>Клики по дням</h3>`;
            html += `<table class="stats-table"><tr><th>День</th><th>Кликов</th></tr>`;
            data.clicksByDay.forEach(row => {
                html += `<tr><td>${row.day.substring(0, 10)}</td><td>${row.count}</td></tr>`;
            });
            html += `</table>`;
        }

        if (data.topCountries.length > 0) {
            html += `<h3>Топ стран</h3>`;
            html += `<table class="stats-table"><tr><th>Страна</th><th>Кликов</th></tr>`;
            data.topCountries.forEach(row => {
                html += `<tr><td>${row.country}</td><td>${row.count}</td></tr>`;
            });
            html += `</table>`;
        }

        content.innerHTML = html;
        document.getElementById("stats-modal").classList.remove("hidden");
    } catch (err) {
        console.error("Ошибка загрузки статистики:", err);
    }
}

function closeStats() {
    document.getElementById("stats-modal").classList.add("hidden");
}

function logout() {
    localStorage.removeItem("token");
    window.location.href = "/";
}

loadLinks();