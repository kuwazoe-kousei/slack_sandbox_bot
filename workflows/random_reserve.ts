import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { LoadSandboxFunctionDefinition } from "../functions/datastore/sandbox/load.ts";
import { RandomReserveSandboxFunctionDefinition } from "../functions/datastore/sandbox/random_reserve.ts";
import { UpdateTopicSandboxFunctionDefinition } from "../functions/sandbox/update_topic.ts";

/**
 * A Workflow is a set of steps that are executed in order.
 * Each step in a Workflow is a function.
 * https://api.slack.com/future/workflows
 */
const RandomReserveWorkflow = DefineWorkflow({
  callback_id: "reserve_workflow",
  title: "サンドボックス確保",
  description: "フォームに従い、サンドボックスを確保します。",
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
    required: ["interactivity"],
  },
});
/**
 * For collecting input from users, we recommend the
 * built-in OpenForm function as a first step.
 * https://api.slack.com/future/functions#open-a-form
 */
const inputForm = RandomReserveWorkflow.addStep(
  Schema.slack.functions.OpenForm,
  {
    title: "サンドボックスを確保する",
    interactivity: RandomReserveWorkflow.inputs.interactivity,
    submit_label: "確保",
    description: "SB番号は空いている番号から自動で確保できます",
    fields: {
      elements: [
        {
          name: "description",
          title: "用途",
          type: Schema.types.string,
        },
        {
          name: "due_date",
          title: "期限(最低限の予約にご協力下さい)",
          type: Schema.slack.types.date,
        },
      ],
      required: ["description", "due_date"],
    },
  },
);

const RunMessage = RandomReserveWorkflow.addStep(
  Schema.slack.functions.SendMessage,
  {
    channel_id: RandomReserveWorkflow.inputs.channel,
    message: `<@${RandomReserveWorkflow.inputs.user_id}> \n承りました。確保を開始します...`,
  },
);

const RandomReserve = RandomReserveWorkflow.addStep(
  RandomReserveSandboxFunctionDefinition,
  {
    user_id: RandomReserveWorkflow.inputs.user_id,
    due_date: inputForm.outputs.fields.due_date,
    timestamp: RandomReserveWorkflow.inputs.timestamp,
    description: inputForm.outputs.fields.description,
  },
);

const LoadOpeningSandbox = RandomReserveWorkflow.addStep(
  LoadSandboxFunctionDefinition,
  {
    status: 1,
  },
);

RandomReserveWorkflow.addStep(Schema.slack.functions.SendMessage, {
  channel_id: RandomReserveWorkflow.inputs.channel,
  message: RandomReserve.outputs.message,
  thread_ts: RunMessage.outputs.message_ts,
});

RandomReserveWorkflow.addStep(
  UpdateTopicSandboxFunctionDefinition,
  {
    items: LoadOpeningSandbox.outputs.results,
    channel: RandomReserveWorkflow.inputs.channel,
  },
);
export default RandomReserveWorkflow;
