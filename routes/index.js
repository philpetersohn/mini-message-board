import express from "express";

const messages = [
  {
    text: "Hi there!",
    user: "Amando",
    added: new Date(),
  },
  {
    text: "Hello World!",
    user: "Charles",
    added: new Date(),
  },
];

const router = express.Router();

router.get("/", (req, res) => {
  res.render("index", { title: "Mini Messageboard", messages });
});

router.get("/new", (req, res) => {
  res.render("form", { title: "New message" });
});

router.post("/new", (req, res) => {
  const { messageText, messageUser } = req.body;
  messages.push({ text: messageText, user: messageUser, added: new Date() });
  res.redirect("/");
});

router.get("/message/:id", (req, res) => {
  const message = messages[Number(req.params.id)];
  if (!message) {
    return res.status(404).send("Message not found");
  }

  res.render("message", { title: "Message details", message });
});

export default router;
