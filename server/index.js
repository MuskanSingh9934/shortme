import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { URL } from "./models/urlModel.js";
import { generateURL } from "./helper/shortnet.js";
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.send({ message: "server running" }));

app.post("/api/v0/create", async (req, res) => {
  try {
    const { url } = req.body;

    let shortUrl = generateURL();
    while (await URL.findOne({ url: shortUrl })) {
      shortUrl = generateURL();
    }

    const newURL = new URL({
      url: shortUrl,
      redirectURL: url,
      visitors: 0,
    });

    await newURL.save();
    res.send({ message: "URL shortened", shortUrl });
  } catch (error) {
    console.error("Error creating URL:", error);
    res.status(500).send({ message: "Error while processing" });
  }
});

app.get("/:shortURL", async (req, res) => {
  try {
    const shortURL = req.params.shortURL;
    const findUrl = await URL.findOneAndUpdate(
      { url: shortURL },
      { $inc: { visitors: 1 } },
      { new: true }
    );
    if (!findUrl) {
      res.send({ message: "no url found" });
    }
    res.redirect(findUrl.redirectURL);
  } catch (error) {
    res.send({ message: "error while getting" });
  }
});
const URI = process.env.MONGO_URI;
mongoose
  .connect(URI)
  .then(() => {
    app.listen(8080);
    console.log("server is running");
  })
  .catch((error) => {
    console.log(error);
  });
