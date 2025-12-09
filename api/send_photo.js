import { IncomingForm } from "formidable";
import fs from "fs";
import fetch from "node-fetch";

export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end("Method Not Allowed");

  const form = new IncomingForm();
  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).end(err.message);

    const photo = fs.readFileSync(files.photo.filepath);
    const formData = new FormData();
    formData.append("chat_id", process.env.CHAT_ID);
    formData.append("photo", new Blob([photo]), "foto.jpg");
    formData.append("caption", fields.caption || "");

    await fetch(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendPhoto`, {
      method: "POST",
      body: formData
    });

    res.json({ success: true });
  });
             }
