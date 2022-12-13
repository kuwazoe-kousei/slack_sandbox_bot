import {
  DefineFunction,
  Schema,
  SlackAPI,
  SlackFunction,
} from "deno-slack-sdk/mod.ts";
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
      text_for_topic: {
        type: Schema.types.string,
        description: "トピック用文章",
      },
    },
    required: ["completed", "message", "text_for_topic"],
  },
});

export default SlackFunction(
  InitDatastoreFunctionDefinition,
  async ({ token, inputs }) => {
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
    const client = SlackAPI(token, {});
    const user = await client.users.info({
      user: inputs.user_id,
    });

    let text_for_topic = "空いているSB\n";
    let index = 0;
    let completed = true;
    let message = "正常に初期化されました！";
    const date = new Date();
    const formatted_date = date.getFullYear() + "-" +
      (date.getMonth() + 1).toString().padStart(2, "0") +
      "-" +
      date.getDate().toString().padStart(2, "0");

    for (const element of sandboxName) {
      const putResponse = await client.apps.datastore.put<
        typeof SandboxDatastore.definition
      >({
        datastore: "sandbox",
        item: {
          name: element,
          user_id: inputs.user_id,
          user_name: user.user.profile.display_name,
          description: inputs.description,
          due_date: formatted_date,
          status: 1,
          server_branch: "",
          client_branch: "",
          updated_at: inputs.timestamp,
        },
      });

      index++;
      if (!putResponse.ok) {
        completed = false;
        message = "エラーが発生しました...";
        console.log(`${index} : error`);
        break;
      } else {
        text_for_topic += `${putResponse.item.name}\n`;
        console.log(`${index} : ok`);
      }
    }

    return { outputs: { completed, message, text_for_topic } };
  },
);
