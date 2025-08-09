export const registerUser = (req, res) => {
  try {
    console.log("API is working");
    res.send("welcome to server")
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
};


