const puppeteer = require("puppeteer");
const fs = require("fs");
var { timeout } = require("../tools/tools.js");

(async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto("https://s.weibo.com/top/summary?Refer=top_hot&topnav=1&wvr=6", {
        waitUntil: "networkidle",
    });

    await timeout(1000);

    let BDList = await page.evaluate(() => {
        let list = [...document.querySelectorAll(".wbs-hotrank .data td.td-02 a")];
        return list.map((item) => {
            return {
                title: item.innerHTML.replace("<em>", "").replace("</em>", "").trim(),
                href: item.href,
            };
        });
    });

    console.log("BDList", BDList);
    fs.writeFile(
        "./data/weibo/WBdata.json",
        JSON.stringify(BDList, null, "\t"),
        function (err, data) {
            if (err) {
                throw err;
            }
        },
    );
})();
