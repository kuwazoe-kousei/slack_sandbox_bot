import {
  DefineFunction,
  Schema,
  SlackFunction,
} from "https://deno.land/x/deno_slack_sdk@1.4.3/mod.ts";
import SandboxiesType from "../../types/sanboxies.ts";

export const UpdateTopicSandboxFunctionDefinition = DefineFunction({
  callback_id: "update_topic_sandbox_function",
  title: "update topic sandbox function",
  source_file: "functions/sandbox/update_topic.ts",
  description: "引数のsandboxアイテムからトピックを更新します",
  input_parameters: {
    properties: {
      items: {
        type: SandboxiesType,
        description: "使用するsandboxの配列型",
      },
      channel: {
        type: Schema.slack.types.channel_id,
        description: "トピックを変更するchannelID",
      },
    },
    required: ["items", "channel"],
  },
  output_parameters: {
    properties: {
      success: {
        type: Schema.types.boolean,
        description: "無事にトピックの更新が完了したか",
      },
    },
    required: ["success"],
  },
});

export default SlackFunction(
  UpdateTopicSandboxFunctionDefinition,
  async ({ inputs, client }) => {
    const topic_message = `空いているSB:${inputs.items.length}個\n`;
    // let topic_message = `空いているSB:${inputs.items.length}個\n`;
    // const message = inputs.items.sort((a, b) => a.id - b.id);
    // message.map((item) => {
    //   topic_message += `${item.name}\n`;
    // });
    const setTopic = await client.conversations.setTopic({
      channel: inputs.channel,
      topic: topic_message,
    });
    if (!setTopic.ok) {
      console.log("ダメ！！");
      return { outputs: { success: false } };
    }
    console.log("完了！");
    return { outputs: { success: true } };
  },
);
