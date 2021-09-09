const puppeteer = require("puppeteer");
const fs = require("fs");
var { timeout } = require("../tools/tools.js");

(async () => {
    var data = [];
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto("https://www.baidu.com", { waitUntil: "networkidle" });
    var input = await page.$("#kw");
    await page.type("heheda", { delay: 20 });
    await timeout(1000);
    // var submit = await page.$("[type='submit']");
    // await submit.click();                //第二类点击事件
    await page.click("[type='submit']"); //第一类点击事件
    for (let i = 0; i < 2; i++) {
        await timeout(2000);
        let BDList = await page.evaluate(() => {
            let list = [...document.querySelectorAll("#container.sam_newgrid .c-container .t a")];
            return list.map((item) => {
                return {
                    title: item.innerHTML.replace("<em>", "").replace("</em>", "").trim(),
                    href: item.href,
                };
            });
        });
        await page.click(".wrapper_new .sam_newgrid~#page .n:last-of-type");
        data.push(BDList);
    }
    console.log("data", data);
    fs.writeFile(
        "./data/yiqing/BDdata.json",
        JSON.stringify(data, null, "\t"),
        function (err, data) {
            if (err) {
                throw err;
            }
        },
    );
})();
