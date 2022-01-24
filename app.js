require("dotenv").config();
const Express = require('express');
const app = Express();
const dbConnection = require('./db');

app.use(Express.json());

const controllers = require('./controllers');

// app.use(require('./middleware/validate-jwt'));
app.use('/log', controllers.logController);
app.use("/user", controllers.userController);

dbConnection.authenticate()
.then(() => dbConnection.sync())
.then(() => {
    app.listen(3000, () => {
        console.log(`[Server]: App is listening on 3000.`);
    });
})

.catch((err) => {
    console.log(`[server]: Server crashed. Error = ${err}`);
});
