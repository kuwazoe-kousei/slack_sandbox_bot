import { DefineDatastore } from "deno-slack-sdk/mod.ts";
import PinnedMessageType from "../types/pinned_message.ts";

const PinnedMessageDatastore = DefineDatastore({
  name: "pinned_message",
  primary_key: "id",
  attributes: PinnedMessageType.definition.properties,
});

export default PinnedMessageDatastore;
