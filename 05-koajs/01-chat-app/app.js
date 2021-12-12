const path = require("path");
const Koa = require("koa");
const app = new Koa();

app.use(require("koa-static")(path.join(__dirname, "public")));
app.use(require("koa-bodyparser")());

const Router = require("koa-router");
const router = new Router();

let clients = [];

router.get("/subscribe", async (ctx, next) => {
  const message = await new Promise(res => {
    clients.push(res);
  });
  ctx.body = message;
});

router.post("/publish", async (ctx, next) => {
  try {
    if (ctx.request.body.message) {
      for await (const client of clients) {
        client(ctx.request.body.message);
      }
      clients = [];
    }
    ctx.response.status = 200;
    ctx.response.body = "OK";
  } catch (error) {
    ctx.throw("Bad Request", 400);
  }
});

app.use(router.routes());

module.exports = app;
