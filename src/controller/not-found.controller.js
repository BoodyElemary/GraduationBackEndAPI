exports.notFound = (req, res) => {
  res.status(404);
  res.json({ message: "Not found" });
};
