require("dotenv").config();
const app = require("./src/app");


app.listen(3003, () =>{
    console.log("Server running on PORT 3003")
});