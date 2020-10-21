import { botCache } from "../../mod.ts";
import { botID, cache, getMessage } from "../../deps.ts";

botCache.eventHandlers.reactionAdd = async function (message, emoji, userID) {
  // Update stats in cache
  botCache.stats.reactionsAddedProcessed += 1;

  // Ignore all bot reactions
  if (userID === botID) return;

  // Process reaction collectors.
  botCache.helpers.processReactionCollectors(message, emoji, userID);

  // Convert potentially uncached to fully cached message.
  const fullMessage = cache.messages.get(message.id) ||
    await getMessage(message.channelID, message.id).catch(() => undefined);
  if (!fullMessage) return;

  // These features require the author to be the bot
  if (fullMessage.author.id !== botID) return;

  // Process todo feature
  botCache.helpers.todoReactionHandler(fullMessage, emoji, userID);
};
