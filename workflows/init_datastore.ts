import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { InitDatastoreFunctionDefinition } from "../functions/datastore/init.ts";
import { LoadSandboxFunctionDefinition } from "../functions/datastore/sandbox/load.ts";
import { UpdateTopicSandboxFunctionDefinition } from "../functions/sandbox/update_topic.ts";

/**
 * A Workflow is a set of steps that are executed in order.
 * Each step in a Workflow is a function.
 * https://api.slack.com/future/workflows
 */
const InitDatastoreWorkflow = DefineWorkflow({
  callback_id: "init_datastore_workflow",
  title: "サンドボックスを初期化する",
  description: "サンドボックス確保状態を初期化します。一部のユーザーしか使用できません。",
  input_parameters: {
    properties: {
      interactivity: {
        type: Schema.slack.types.interactivity,
      },
      channel: {
        type: Schema.slack.types.channel_id,
      },
      user_id: {
        type: Schema.slack.types.user_id,
      },
      timestamp: {
        type: Schema.slack.types.timestamp,
      },
    },
    required: ["interactivity", "channel", "user_id", "timestamp"],
  },
});

/**
 * For collecting input from users, we recommend the
 * built-in OpenForm function as a first step.
 * https://api.slack.com/future/functions#open-a-form
 */
const approve = InitDatastoreWorkflow.addStep(
  Schema.slack.functions.OpenForm,
  {
    title: "初期化確認画面",
    interactivity: InitDatastoreWorkflow.inputs.interactivity,
    submit_label: "初期化する",
    description: "初期化を行う場合は、理由を記入してボタンを押下してください。",
    fields: {
      elements: [{
        name: "description",
        title: "初期化理由",
        type: Schema.types.string,
      }],
      required: ["description"],
    },
  },
);

const RunMessage = InitDatastoreWorkflow.addStep(
  Schema.slack.functions.SendMessage,
  {
    channel_id: InitDatastoreWorkflow.inputs.channel,
    message: `<@${InitDatastoreWorkflow.inputs.user_id}> \n承りました。初期化を開始します...`,
  },
);

const Init = InitDatastoreWorkflow.addStep(InitDatastoreFunctionDefinition, {
  user_id: InitDatastoreWorkflow.inputs.user_id,
  timestamp: InitDatastoreWorkflow.inputs.timestamp,
  description: approve.outputs.fields.description,
});

const LoadOpeningSandbox = InitDatastoreWorkflow.addStep(
  LoadSandboxFunctionDefinition,
  {
    status: 1,
  },
);

InitDatastoreWorkflow.addStep(
  UpdateTopicSandboxFunctionDefinition,
  {
    items: LoadOpeningSandbox.outputs.results,
    channel: InitDatastoreWorkflow.inputs.channel,
  },
);

InitDatastoreWorkflow.addStep(Schema.slack.functions.SendMessage, {
  channel_id: InitDatastoreWorkflow.inputs.channel,
  message: Init.outputs.message,
  thread_ts: RunMessage.outputs.message_ts,
});

export default InitDatastoreWorkflow;
