import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { InitDatastoreFunctionDefinition } from "../functions/datastore/init.ts";
import { FindPinnedMessageFunctionDefinition } from "../functions/datastore/pinned_message/find.ts";
import { SavePinnedMessageFunctionDefinition } from "../functions/datastore/pinned_message/save.ts";
import { LoadSandboxFunctionDefinition } from "../functions/datastore/sandbox/load.ts";
import { OutputSandboxStateFunctionDefinition } from "../functions/sandbox/output_sandbox_state.ts";
import { UpdateTopicSandboxFunctionDefinition } from "../functions/sandbox/update_topic.ts";
import { UnpinMessageFunctionDefinition } from "../functions/unpin_message.ts";

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

const idForPinnedMessage = "pinned_message from init_datastore_workflow";

// 1:フォームオープン
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

// 2:初期メッセージ送信
const sendRunMessage = InitDatastoreWorkflow.addStep(
  Schema.slack.functions.SendMessage,
  {
    channel_id: InitDatastoreWorkflow.inputs.channel,
    message: `<@${InitDatastoreWorkflow.inputs.user_id}> \n承りました。初期化を開始します...`,
  },
);

// 3:Datastore初期化
const Init = InitDatastoreWorkflow.addStep(InitDatastoreFunctionDefinition, {
  user_id: InitDatastoreWorkflow.inputs.user_id,
  timestamp: InitDatastoreWorkflow.inputs.timestamp,
  description: approve.outputs.fields.description,
});

// 4:オープンしているサンドボックスを全て取得
const loadOpeningSandbox = InitDatastoreWorkflow.addStep(
  LoadSandboxFunctionDefinition,
  {
    status: 1,
  },
);

// 5:トピックを更新
InitDatastoreWorkflow.addStep(
  UpdateTopicSandboxFunctionDefinition,
  {
    items: loadOpeningSandbox.outputs.results,
    channel: InitDatastoreWorkflow.inputs.channel,
  },
);

// 6:完了のメッセージを1のスレッドとして送信
InitDatastoreWorkflow.addStep(Schema.slack.functions.SendMessage, {
  channel_id: InitDatastoreWorkflow.inputs.channel,
  message: Init.outputs.message,
  thread_ts: sendRunMessage.outputs.message_ts,
});

// 7:ピン状態の既存メッセージを取得
const findPinnedMessage = InitDatastoreWorkflow.addStep(
  FindPinnedMessageFunctionDefinition,
  {
    id: idForPinnedMessage,
  },
);

// 8:7で取得できたら取得したアイテムをUnPin
if (findPinnedMessage.outputs.item) {
  InitDatastoreWorkflow.addStep(
    UnpinMessageFunctionDefinition,
    {
      channel: InitDatastoreWorkflow.inputs.channel,
      message_ts: findPinnedMessage.outputs.item.message_ts,
    },
  );
}

// 9:状態メッセージを送信
const sendCompletedMessage = InitDatastoreWorkflow.addStep(
  Schema.slack.functions.SendMessage,
  {
    channel_id: InitDatastoreWorkflow.inputs.channel,
    message: "各サンドボックス状況↓",
  },
);

const stateMessage = InitDatastoreWorkflow.addStep(
  OutputSandboxStateFunctionDefinition,
  {
    items: loadOpeningSandbox.outputs.results,
  },
);

const sendStateMessage = InitDatastoreWorkflow.addStep(
  Schema.slack.functions.SendMessage,
  {
    channel_id: InitDatastoreWorkflow.inputs.channel,
    message: stateMessage.outputs.message,
    thread_ts: sendCompletedMessage.outputs.message_ts,
  },
);

// 10:状態メッセージを次UnPinするためにDatastoreにSave
InitDatastoreWorkflow.addStep(
  SavePinnedMessageFunctionDefinition,
  {
    id: idForPinnedMessage,
    channel: InitDatastoreWorkflow.inputs.channel,
    message_ts: sendStateMessage.outputs.message_ts,
  },
);

// 11:状態メッセージをPin留め
InitDatastoreWorkflow.addStep(
  Schema.slack.functions.AddPin,
  {
    channel_id: InitDatastoreWorkflow.inputs.channel,
    message: sendStateMessage.outputs.message_ts,
  },
);

export default InitDatastoreWorkflow;
