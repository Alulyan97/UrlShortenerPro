const linkModel = require("../models/linkModel");
const analyticsModel = require("../models/analyticsModel");
const geoip = require("geoip-lite");

const controller = {
    async redirect (req, res) {
        try {
            const { shortCode } = req.params;

            const link = await linkModel.findByShortCode(shortCode);

            if(!link) {
                return res.status(404).json({ error: "Ссылка не найдена"});
            }

            setImmediate(async () => {
                try{
                    const ip = req.ip || req.connection.remoteAddress;
                    let country = "Unknown";
                    let city = "Unknown";

                    if (ip === "::1" || ip === "127.0.0.1") {
                        country = "Local";
                        city = "local";
                    } else {
                        const geo = geoip.lookup(ip);
                        if(geo){
                            country = geo.country || "Unknown";
                            city = geo.city || "Unknown";
                        }
                    }
                    await analyticsModel.create(
                        link.id,
                        ip,
                        req.get("User-Agent") || null,
                        req.get("Referer") || null,
                        country,
                        city
                    );
            } catch (err) {
                    console.error("Ошибка сохранения клика:", err);
                        }
            })

            return res.redirect(302, link.original_url);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Ошибка сервера" });
        }
    }
}

module.exports = controller;