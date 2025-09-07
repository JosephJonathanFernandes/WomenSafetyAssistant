const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());

app.post("/sos", async (req, res) => {
  try {
    console.log(req.body); // see what you get
    res.status(200).json({ success: true, message: "SOS alert sent!" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));
