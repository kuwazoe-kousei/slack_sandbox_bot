import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";
import PinnedMessageDatastore from "../../../datastore/pinned_message.ts";
import PinnedMessageType from "../../../types/pinned_message.ts";

/**
 * Functions are reusable building blocks of automation that accept
 * inputs, perform calculations, and provide outputs. Functions can
 * be used independently or as steps in Workflows.
 * https://api.slack.com/future/functions/custom
 */
export const SavePinnedMessageFunctionDefinition = DefineFunction({
  callback_id: "save_pinned_message_function",
  title: "save pinned message function",
  description: "与えられた情報からpineed_messageをsaveします",
  source_file: "functions/datastore/pinned_message/save.ts",
  input_parameters: {
    properties: PinnedMessageType.definition.properties,
    required: ["id", "channel", "message_ts"],
  },
  output_parameters: {
    properties: {
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
  SavePinnedMessageFunctionDefinition,
  async ({ inputs, client }) => {
    let success = false;
    let error_message = null;

    const putResponse = await client.apps.datastore.put<
      typeof PinnedMessageDatastore.definition
    >({
      datastore: "pinned_message",
      item: {
        id: inputs.id,
        channel: inputs.channel,
        message_ts: inputs.message_ts,
      },
    });

    if (!putResponse.ok) {
      console.log(`更新error`);
      error_message = "更新エラー";
      return { outputs: { success, error_message } };
    } else {
      success = true;
      console.log(`更新ok`);
      return { outputs: { success } };
    }
  },
);
