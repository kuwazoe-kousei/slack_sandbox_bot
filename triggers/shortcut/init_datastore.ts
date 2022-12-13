import { Trigger } from "deno-slack-api/types.ts";
import InitDatastoreWorkflow from "../../workflows/init_datastore.ts";

/**
 * Triggers determine when Workflows are executed. A trigger
 * file describes a scenario in which a workflow should be run,
 * such as a user pressing a button or when a specific event occurs.
 * https://api.slack.com/future/triggers
 */
const initDatastoreLinkTrigger: Trigger<
  typeof InitDatastoreWorkflow.definition
> = {
  type: "shortcut",
  name: "SB確保状況初期化",
  description: "サンドボックスの確保状況を初期化するワークフローを起動するトリガーです",
  workflow: "#/workflows/init_datastore_workflow",
  inputs: {
    interactivity: {
      value: "{{data.interactivity}}",
    },
    channel: {
      value: "{{data.channel_id}}",
    },
    user_id: {
      value: "{{data.user_id}}",
    },
    timestamp: {
      value: "{{event_timestamp}}",
    },
  },
};

export default initDatastoreLinkTrigger;
