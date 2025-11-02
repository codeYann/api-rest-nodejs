import type { FastifyReply, FastifyRequest } from "fastify";
import { logger } from "../logger.js";

export async function checkSessionIdExists(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const sessionId = request.cookies.sessionId;

  if (!sessionId) {
    logger.warn("No sessionId provided in cookies");
    return reply.status(401).send({
      error: "Unauthorized",
    });
  }
}
