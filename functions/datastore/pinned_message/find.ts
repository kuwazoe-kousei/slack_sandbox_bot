import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";
import PinnedMessageDatastore from "../../../datastore/pinned_message.ts";
import PinnedMessageType from "../../../types/pinned_message.ts";

/**
 * Functions are reusable building blocks of automation that accept
 * inputs, perform calculations, and provide outputs. Functions can
 * be used independently or as steps in Workflows.
 * https://api.slack.com/future/functions/custom
 */
export const FindPinnedMessageFunctionDefinition = DefineFunction({
  callback_id: "find_pinned_message_function",
  title: "find pinned message function",
  description: "与えられたidからpineed_messageをfindします",
  source_file: "functions/datastore/pinned_message/find.ts",
  input_parameters: {
    properties: {
      id: PinnedMessageType.definition.properties.id,
    },
    required: ["id"],
  },
  output_parameters: {
    properties: {
      item: {
        type: PinnedMessageType,
        description: "取得したアイテム",
      },
      success: {
        type: Schema.types.boolean,
        description: "成功したか否か",
        default: false,
      },
      error_message: {
        type: Schema.types.string,
        description: "エラー文",
        default: "",
      },
    },
    required: ["success"],
  },
});

export default SlackFunction(
  FindPinnedMessageFunctionDefinition,
  async ({ inputs, client }) => {
    let success = false;
    let error_message = null;
    const preLogMessage = "find_pinned_message";

    const getResponse = await client.apps.datastore.get<
      typeof PinnedMessageDatastore.definition
    >({
      datastore: "pinned_message",
      id: inputs.id,
    });

    if (!getResponse.ok) {
      console.log(`${preLogMessage}:error`);
      error_message = `${preLogMessage}:error`;
      return { outputs: { success, error_message } };
    } else {
      success = true;
      console.log(`${preLogMessage}:ok`);
      if (!getResponse.item) {
        console.log(`${preLogMessage}:データがありません`);
        return { outputs: { success } };
      }
      return { outputs: { success, item: getResponse.item } };
    }
  },
);
