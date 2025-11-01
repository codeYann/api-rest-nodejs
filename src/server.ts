import fastify from "fastify";

const app = fastify({
  logger: true,
});

app.get("/", (req, res) => {
  res.send("Hello World");
});

app
  .listen({ port: 3000 })
  .then(() => {
    app.log.info("Server is running on port 3000");
  })
  .catch((err) => {
    app.log.error(err);
    process.exit(1);
  });
