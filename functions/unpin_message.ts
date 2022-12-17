import {
  DefineFunction,
  Schema,
  SlackFunction,
} from "https://deno.land/x/deno_slack_sdk@1.4.3/mod.ts";
import PinnedMessageType from "../types/pinned_message.ts";

export const UnpinMessageFunctionDefinition = DefineFunction({
  callback_id: "unpin_message_function",
  title: "unpin message function",
  source_file: "functions/unpin_message.ts",
  description: "指定されたメッセージをUnPinします。",
  input_parameters: {
    properties: {
      message_ts: PinnedMessageType.definition.properties.message_ts,
      channel: PinnedMessageType.definition.properties.channel,
    },
    required: ["message_ts", "channel"],
  },
  output_parameters: {
    properties: {
      success: {
        type: Schema.types.boolean,
        description: "無事にUnPinを終えたか",
      },
    },
    required: ["success"],
  },
});

export default SlackFunction(
  UnpinMessageFunctionDefinition,
  async ({ inputs, client }) => {
    const setTopic = await client.pins.remove({
      channel: inputs.channel,
      timestamp: inputs.message_ts,
    });
    if (!setTopic.ok) {
      console.log("UnPinダメ！！");
      return { outputs: { success: false } };
    }
    console.log("UnPin完了！");
    return { outputs: { success: true } };
  },
);
