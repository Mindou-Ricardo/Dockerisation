const express = require("express");
const cors = require("cors");
const Router = require("./routes/routes");
//const port = 3000;
const port = process.env.PORT || 3000;
const app = express();
app.use(express.json());
app.use(cors());
app.use(Router);

app.listen(port, () => {
  //console.log(`Le serveur est démarré sur: http://localhost:${port}`);
  console.log(`Le serveur est démarré sur: ${port}`);
});
