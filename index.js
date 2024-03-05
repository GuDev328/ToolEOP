const fs = require("fs");
const path = require("path");
const { createWorker } = require("tesseract.js");
const cors = require("cors");

const express = require("express");

const app = express();
app.use(cors());
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post("/", (req, res) => {
    try {
        const base64Data = req.body.link;
        console.log(req.body);
        const imagePath = path.join(__dirname, "image.png");

        const data = base64Data.replace(/^data:image\/\w+;base64,/, "");
        const buffer = Buffer.from(data, "base64");
        fs.writeFileSync(imagePath, buffer);

        const worker = createWorker();

        (async () => {
            await worker.load();
            await worker.loadLanguage("eng");
            await worker.initialize("eng");
            const {
                data: { text },
            } = await worker.recognize(imagePath);
            res.status(200).json(text);
            await worker.terminate();
        })();
    } catch (error) {
        console.log(error);
    }
});

app.post("hey", (req, res) => {
    return res.send("Ready");
});

app.listen(3285, () => {
    console.log(`Port 3285`);
});
