const db = require("../config/db");
require("dotenv").config();
let msg = "";

exports.getIsMe = (req, res) => {
    res.status(200).render("auth/token", {
        title: "Is me?",
        layout: "layouts/main-layout",
    });
};

exports.checkToken = (req, res, next) => {
    req.session.login ? next() : res.redirect("/is_me");
};

exports.postIsMe = async (req, res) => {
    const { token } = req.body;

    try {
        const [rows] = await db.execute(
            "SELECT * FROM tbl_token WHERE token = ? AND is_active = true",
            [token],
        );

        const [result] = await db.execute(
            'SELECT COUNT(*) as amount_logs FROM tbl_logs'
        )

        const amountLogs = result[0].amount_logs

        if (!token) {
            req.flash("error", "PIN harus diisi");
            return res.status(400).redirect("/is_me");
        }

        if (isNaN(token)) {
            req.flash("error", "PIN harus angka");
            return res.status(400).redirect("/is_me");
        }

        if (token.length < 6) {
            req.flash("error", "PIN harus 6 angka");
            return res.status(400).redirect("/is_me");
        }

        if (rows.length > 0) {
            (
                (req.session.login = true),
                (req.session.tokenId = rows[0].id_token),
                (req.session.tokenDesc = rows[0].description_token),
                (req.session.ownerName = rows[0].owner_name),
                (req.session.amountLogs = amountLogs)
            );

            await db.execute(
                "UPDATE tbl_token SET last_used = NOW() WHERE id_token = ?",
                [rows[0].id_token],
            );
            res.status(200).redirect("/me");
        } else {
            req.flash("error", "PIN salah");
            return res.status(400).redirect("/is_me");
        }
    } catch (error) {
        console.log(error)
        res.status(500).render('errors/500', {
            title: '500 | Server Error',
            layout: 'layouts/main-layout'
        })
    }
};

exports.getMe = (req, res) => {
    res.status(200).render("auth/me", {
        title: "Me",
        layout: "layouts/auth-layout",
        tokenDesc: req.session.tokenDesc,
        ownerName: req.session.ownerName,
        amountLogs: req.session.amountLogs,
    });
};

exports.getExit = (req, res) => {
    req.session.destroy();
    res.status(200).redirect("/");
};

exports.getWoi = (req, res) => {
    res.status(200).render("auth/woi", {
        title: "msg",
        layout: "layouts/main-layout",
        msg,
    });
};
