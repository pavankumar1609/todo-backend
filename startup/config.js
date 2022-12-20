module.exports = function () {
  if (!process.env.privateKey) {
    throw new Error("FATAL ERROR: privateKey not defined.");
  }
};
