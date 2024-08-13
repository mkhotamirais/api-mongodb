const badRequest = (res, message) => res.status(400).json({ message });
const conflict = (res, message) => res.status(409).json({ message });
const unauthorized = (res, status) =>
  res.status(401).json({ message: status === "no token" ? "anda tidak login" : "username atau password salah" });
const forbidden = (res) => res.status(403).json({ message: "Forbidden" });
// const internalServerError = (res, message) => res.status(500).json({ message });

const noContent = (res) => res.status(204).json({ message: "no content" });
const ok = (res, message, data) => res.status(200).json({ message, data });
const created = (res, message, data) => res.status(201).json({ message, data });

module.exports = { badRequest, ok, created, conflict, unauthorized, noContent, forbidden };
