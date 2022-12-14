import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";
import SandboxDatastore from "../../../datastore/sandbox.ts";
import SandboxiesType from "../../../types/sanboxies.ts";

/**
 * Functions are reusable building blocks of automation that accept
 * inputs, perform calculations, and provide outputs. Functions can
 * be used independently or as steps in Workflows.
 * https://api.slack.com/future/functions/custom
 */
export const LoadSandboxFunctionDefinition = DefineFunction({
  callback_id: "load_sandbox_function",
  title: "load sandbox function",
  description: "渡されたプロパティからSB環境の情報を返します。",
  source_file: "functions/datastore/sandbox/load.ts",
  input_parameters: {
    properties: {
      status: {
        type: Schema.types.integer,
      },
      except_user_id: {
        type: Schema.slack.types.user_id,
      },
      over_due: {
        type: Schema.types.boolean,
        default: false,
      },
    },
    required: ["status"],
  },
  output_parameters: {
    properties: {
      results: {
        type: SandboxiesType,
        description: "hogehoge",
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
  LoadSandboxFunctionDefinition,
  async ({ inputs, client }) => {
    let success = false;
    let error_message = null;

    const getResponse = await client.apps.datastore.query<
      typeof SandboxDatastore.definition
    >({
      datastore: "sandbox",
      expression: "#status = :status_kind",
      expression_attributes: { "#status": "status" },
      expression_values: { ":status_kind": inputs.status },
    });

    if (!getResponse.ok) {
      console.log(`取得error`);
      error_message = "取得エラー";
      return { outputs: { success, error_message } };
    } else {
      if (!getResponse.items.length) {
        error_message = "対象のSBが存在しません。";
        return { outputs: { success, error_message } };
      }
      success = true;
      console.log(`取得ok`);
      return { outputs: { success, results: getResponse.items } };
    }
  },
);
