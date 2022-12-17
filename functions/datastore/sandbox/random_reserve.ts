import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";
import SandboxDatastore from "../../../datastore/sandbox.ts";

/**
 * Functions are reusable building blocks of automation that accept
 * inputs, perform calculations, and provide outputs. Functions can
 * be used independently or as steps in Workflows.
 * https://api.slack.com/future/functions/custom
 */
export const RandomReserveSandboxFunctionDefinition = DefineFunction({
  callback_id: "random_reserve_sandbox_function",
  title: "random reserve sandbox function",
  description: "サンドボックスの空きから1つランダムに取得、確保します",
  source_file: "functions/datastore/sandbox/random_reserve.ts",
  input_parameters: {
    properties: {
      user_id: {
        type: Schema.slack.types.user_id,
      },
      due_date: {
        type: Schema.slack.types.date,
      },
      timestamp: {
        type: Schema.slack.types.timestamp,
      },
      description: {
        type: Schema.types.string,
      },
    },
    required: ["user_id", "due_date", "timestamp", "description"],
  },
  output_parameters: {
    properties: {
      completed: {
        type: Schema.types.boolean,
        description: "正常に処理が完了したか",
      },
      message: {
        type: Schema.types.string,
        description: "エラー文",
      },
    },
    required: ["completed", "message"],
  },
});

export default SlackFunction(
  RandomReserveSandboxFunctionDefinition,
  async ({ client, inputs }) => {
    let completed = false;
    let message = "正常に確保が完了しました。\n";
    let target_item = null;

    const getResponse = await client.apps.datastore.query<
      typeof SandboxDatastore.definition
    >({
      datastore: "sandbox",
      expression: "#status = :status_kind",
      expression_attributes: { "#status": "status" },
      expression_values: { ":status_kind": 1 },
    });

    if (!getResponse.ok) {
      console.log(`取得error`);
      message = "取得エラー";
      return { outputs: { completed, message } };
    } else {
      if (!getResponse.items.length) {
        message = "空いているSBがありません。";
        return { outputs: { completed, message } };
      }
      target_item = getResponse.items[0];
      console.log(`取得ok`);
    }

    const user = await client.users.info({
      user: inputs.user_id,
    });
    const putResponse = await client.apps.datastore.put<
      typeof SandboxDatastore.definition
    >({
      datastore: "sandbox",
      item: {
        id: target_item.id,
        name: target_item.name,
        user_id: inputs.user_id,
        user_name: user.user.profile.display_name,
        description: inputs.description,
        due_date: inputs.due_date,
        status: 2,
        server_branch: "",
        client_branch: "",
        updated_at: inputs.timestamp,
      },
    });

    if (!putResponse.ok) {
      message = "更新中エラー";
      console.log(`更新error`);
      return { outputs: { completed, message } };
    } else {
      completed = true;
      message += `${target_item.name}を確保しました！`;
      console.log(`更新ok`);
    }

    return { outputs: { completed, message } };
  },
);
