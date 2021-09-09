const http = require("http");
const path = require("path");
const fse = require("fs-extra");
const multiparty = require("multiparty");

let extension = (filename) =>
  filename.slice(filename.lastIndexOf(".") + 1, filename.length); //提取后缀名
const sever = http.createServer();
const UPLOAD_DIR = path.resolve(__dirname, "..", "target");
const resolvePost = (req) => {
  return new Promise((resolve) => {
    let chunk = "";
    req.on("data", (data) => {
      chunk += data;
    });
    req.on("end", () => {
      resolve(JSON.parse(chunk));
    });
  });
};

// 合并切片
const mergeFileChunk = async (filePath, filehash, finalPath) => {
  const chunkDir = `${UPLOAD_DIR}/${filehash}`;
  const chunkPaths = await fse.readdir(chunkDir);
  console.log("chunkPaths", chunkPaths);
  console.log("filePath", filePath);
  await fse.writeFile(filePath, "");
  chunkPaths.forEach((chunkPath) => {
    fse.appendFileSync(filePath, fse.readFileSync(`${chunkDir}/${chunkPath}`));
    fse.unlinkSync(`${chunkDir}/${chunkPath}`);
  });
  fse.moveSync(filePath, finalPath);
  fse.rmdirSync(chunkDir); // 合并后删除保存切片的目录
};

// 返回已经上传切片名列表
const createUploadedList = async (fileHash) =>
  fse.existsSync(`${UPLOAD_DIR}/${fileHash}`)
    ? await fse.readdir(`${UPLOAD_DIR}/${fileHash}`)
    : [];

sever.on("request", async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  if (req.method === "OPTIONS") {
    res.status = 200;
    res.end();
    return;
  }
  console.log("req.url", req.url);
  if (req.url === "/verify") {
    const data = await resolvePost(req);
    const { fileHash, filename } = data;
    const ext = extension(filename);
    const filePath = `${UPLOAD_DIR}/final/${fileHash}.${ext}`;
    console.log("filePath", filePath);
    if (fse.existsSync(filePath)) {
      console.log("shouldUpload1");
      res.end(
        JSON.stringify({
          shouldUpload: false,
        })
      );
    } else {
      console.log("shouldUpload2");
      res.end(
        JSON.stringify({
          shouldUpload: true,
          uploadedList: await createUploadedList(fileHash),
        })
      );
    }
  }
  if (req.url === "/merge") {
    const data = await resolvePost(req);
    const { filename, filehash } = data;
    const lastName = extension(filename);
    const filePath = `${UPLOAD_DIR}/${filehash}/${filehash}.${lastName}`;
    const finalPath = `${UPLOAD_DIR}/final/${filehash}.${lastName}`;

    await mergeFileChunk(filePath, filehash, finalPath);
    res.end(
      JSON.stringify({
        code: 0,
        message: "file merged success",
      })
    );
  }
  const multipart = new multiparty.Form();

  multipart.parse(req, async (err, fields, files) => {
    if (err) {
      return;
    }
    console.log("files", files);
    console.log("fields", fields);
    const [chunk] = files.chunk;
    const [hash] = fields.hash;
    const [fileHash] = fields.fileHash;
    const chunkDir = `${UPLOAD_DIR}/${fileHash}`;

    //切片目录不存在，创建切片目录
    if (!fse.existsSync(chunkDir)) {
      await fse.mkdirs(chunkDir);
    }

    // fs-extra 专用方法，类似 fs.rename 并且跨平台
    // fs-extra 的 rename 方法 windows 平台会有权限问题
    await fse.move(chunk.path, `${chunkDir}/${hash}`);
    res.end("received file chunk");
  });
});

sever.listen(3000, () => {
  console.log("正在监听 3000 端口");
});
