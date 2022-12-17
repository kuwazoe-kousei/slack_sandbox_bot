import {
  DefineType,
  Schema,
} from "https://deno.land/x/deno_slack_sdk@1.4.3/mod.ts";

const PinnedMessageType = DefineType({
  title: "Pinned Message Type",
  description: "Use for definition type of pinned_message on slack",
  name: "pinned_message",
  type: Schema.types.object,
  properties: {
    id: {
      type: Schema.types.string,
    },
    channel: {
      type: Schema.slack.types.channel_id,
    },
    message_ts: {
      type: Schema.types.string,
      description: "Message time stamp",
    },
  },
  required: [],
});

export default PinnedMessageType;
