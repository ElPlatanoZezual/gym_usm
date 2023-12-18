const app = require("./app");
const database = require("./database");


let PORT = process.env.PORT ?? "8080";

database.run()
    .then(() => {
        let PORT = process.env.PORT;
        app.listen(PORT);
        console.log(`Running on port ${PORT}`); 
    })
    .catch((err) => {
        console.log(err);
        console.log("DB failed to Run. Exiting app.");
    });