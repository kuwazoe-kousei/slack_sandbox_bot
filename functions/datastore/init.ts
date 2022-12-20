import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";
import SandboxDatastore from "../../datastore/sandbox.ts";

/**
 * Functions are reusable building blocks of automation that accept
 * inputs, perform calculations, and provide outputs. Functions can
 * be used independently or as steps in Workflows.
 * https://api.slack.com/future/functions/custom
 */
export const InitDatastoreFunctionDefinition = DefineFunction({
  callback_id: "init_datastore_function",
  title: "init datastore function",
  description: "サンドボックスの確保状態を初期化します",
  source_file: "functions/datastore/init.ts",
  input_parameters: {
    properties: {
      user_id: {
        type: Schema.slack.types.user_id,
      },
      timestamp: {
        type: Schema.slack.types.timestamp,
      },
      description: {
        type: Schema.types.string,
      },
    },
    required: ["user_id", "timestamp", "description"],
  },
  output_parameters: {
    properties: {
      completed: {
        type: Schema.types.boolean,
        description: "正常に初期化が完了したか",
      },
      message: {
        type: Schema.types.string,
        description: "スレに返答する内容",
      },
    },
    required: ["completed", "message"],
  },
});

export default SlackFunction(
  InitDatastoreFunctionDefinition,
  async ({ inputs, client }) => {
    const sandboxName = [
      "sb01",
      "sb02",
      "sb03",
      "sb04",
      "sb05",
      "sb06",
      "sb07",
      "sb08",
      "sb09",
      "sb10",
      "sb11",
      "sb12",
      "sb13",
      "sb14",
      "sb15",
      "sb16",
      "sb17",
      "sb18",
      "sb19",
      "sb20",
      "sb21",
      "sb22",
      "sb23",
      "sb24",
      "sb25",
      "sb26",
      "sb27",
      "sb28",
      "sb29",
      "sb30",
      "sb31",
      "sb32",
    ];
    let index = 1;
    let completed = true;
    let message = "正常に初期化されました！";
    const date = "2099-01-01";

    for (const element of sandboxName) {
      const putResponse = await client.apps.datastore.put<
        typeof SandboxDatastore.definition
      >({
        datastore: "sandbox",
        item: {
          id: index,
          name: element,
          user_id: "",
          user_name: "",
          description: inputs.description,
          due_date: date,
          status: 1,
          server_branch: "",
          client_branch: "",
          updated_at: inputs.timestamp,
        },
      });

      if (!putResponse.ok) {
        completed = false;
        message = "エラーが発生しました...";
        console.log(`${index} : error`);
        break;
      } else {
        console.log(`${index} : ok`);
        index++;
      }
    }

    return { outputs: { completed, message } };
  },
);
