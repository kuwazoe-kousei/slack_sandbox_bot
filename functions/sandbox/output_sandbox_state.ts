import {
  DefineFunction,
  Schema,
  SlackFunction,
} from "https://deno.land/x/deno_slack_sdk@1.4.3/mod.ts";
import SandboxiesType from "../../types/sanboxies.ts";

export const OutputSandboxStateFunctionDefinition = DefineFunction({
  callback_id: "output_sandbox_state_function",
  title: "output sandbox state function",
  source_file: "functions/sandbox/output_sandbox_state.ts",
  description: "引数のsandboxアイテムから状態文を生成します。",
  input_parameters: {
    properties: {
      items: {
        type: SandboxiesType,
        description: "使用するsandboxの配列型",
      },
    },
    required: ["items"],
  },
  output_parameters: {
    properties: {
      message: {
        type: Schema.types.string,
      },
    },
    required: ["message"],
  },
});

export default SlackFunction(
  OutputSandboxStateFunctionDefinition,
  ({ inputs }) => {
    let topic_message = `空いているSB:${inputs.items.length}個\n`;
    const message = inputs.items.sort((a, b) => a.id - b.id);
    message.map((item) => {
      topic_message +=
        `${item.name}/${item.due_date}/${item.user_name}/${item.description}\n`;
    });

    return { outputs: { message: topic_message } };
  },
);
