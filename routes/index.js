import express from "express";

function createSampleMessages() {
  return [
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
}

const messages = createSampleMessages();

export function resetMessages() {
  messages.splice(0, messages.length, ...createSampleMessages());
}

export { messages };

const router = express.Router();

router.get("/", (req, res) => {
  res.render("index", { title: "Mini Messageboard", messages });
});

router.get("/new", (req, res) => {
  res.render("form", {
    title: "New message",
    errors: [],
    messageUser: "",
    messageText: "",
  });
});

router.post("/new", (req, res) => {
  const messageUser = String(req.body.messageUser ?? "").trim();
  const messageText = String(req.body.messageText ?? "").trim();
  const errors = [];

  if (!messageUser) {
    errors.push("Username cannot be empty.");
  }
  if (!messageText) {
    errors.push("Message cannot be empty.");
  }

  if (errors.length > 0) {
    return res.status(400).render("form", {
      title: "New message",
      errors,
      messageUser,
      messageText,
    });
  }

  messages.push({ text: messageText, user: messageUser, added: new Date() });
  res.redirect("/");
});

router.get("/message/:id", (req, res) => {
  const { id } = req.params;
  if (!/^[0-9]+$/.test(id)) {
    return res.status(400).send("Invalid message id");
  }

  const message = messages[Number(id)];
  if (!message) {
    return res.status(404).send("Message not found");
  }

  res.render("message", { title: "Message details", message });
});

export default router;
