const linkModel = require("../models/linkModel");
const analyticsModel = require("../models/analyticsModel");
const geoip = require("geoip-lite");
const redis = require("../config/redis");

const controller = {
    async redirect(req, res) {
        try {
            const { shortCode } = req.params;

            const verificationUrl = await redis.get(`${shortCode}`);
            if (verificationUrl) {
                setImmediate(async () => {
                    try {
                        const link = await linkModel.findByShortCode(shortCode);
                        if (link) {
                            const ip = req.ip || req.connection.remoteAddress;
                            let country = "Unknown";
                            let city = "Unknown";
                            if (ip === "::1" || ip === "127.0.0.1") {
                                country = "Local";
                                city = "Local";
                            } else {
                                const geo = geoip.lookup(ip);
                                if (geo) {
                                    country = geo.country || "Unknown";
                                    city = geo.city || "Unknown";
                                }
                            }
                            await analyticsModel.create(
                                link.id, ip,
                                req.get("User-Agent") || null,
                                req.get("Referer") || null,
                                country, city
                            );
                        }
                    } catch (err) {
                        console.error("Ошибка сохранения клика:", err);
                    }
                });
                return res.redirect(302, verificationUrl);
            }

            const link = await linkModel.findByShortCode(shortCode);
            if (!link) {
                return res.status(404).json({ error: "Ссылка не найдена" });
            }

            await redis.set(`link:${shortCode}`, link.original_url, {
                EX: 3600
            });

            setImmediate(async () => {
                try {
                    const ip = req.ip || req.connection.remoteAddress;
                    let country = "Unknown";
                    let city = "Unknown";
                    if (ip === "::1" || ip === "127.0.0.1") {
                        country = "Local";
                        city = "Local";
                    } else {
                        const geo = geoip.lookup(ip);
                        if (geo) {
                            country = geo.country || "Unknown";
                            city = geo.city || "Unknown";
                        }
                    }
                    await analyticsModel.create(
                        link.id, ip,
                        req.get("User-Agent") || null,
                        req.get("Referer") || null,
                        country, city
                    );
                } catch (err) {
                    console.error("Ошибка сохранения клика:", err);
                }
            });

            return res.redirect(302, link.original_url);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Ошибка сервера" });
        }
    }
};

module.exports = controller;