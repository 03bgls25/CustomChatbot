const ApiV1Controller = require("./apiv1");
module.exports = function (app){
    app.use("/apiv1", ApiV1Controller)
    return app;
}
