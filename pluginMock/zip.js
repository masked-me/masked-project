const compressing = require("compressing");

(async () => {
  console.log("0");
  await compressing.zip.uncompress("./service.zip", "./newzip");
  console.log("1");
  await compressing.zip.compressDir("./newzip", "./newzip.zip");
  console.log("2");
})();
