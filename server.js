require("dotenv").config();
const app = require("./src/app");
const cors = require("cors");
app.use(cors());


app.listen(3003, () =>{
    console.log("Server running on PORT 3003")
});