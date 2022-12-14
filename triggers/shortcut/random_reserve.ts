import { Trigger } from "deno-slack-api/types.ts";
import RandomReserveWorkflow from "../../workflows/random_reserve.ts";

/**
 * Triggers determine when Workflows are executed. A trigger
 * file describes a scenario in which a workflow should be run,
 * such as a user pressing a button or when a specific event occurs.
 * https://api.slack.com/future/triggers
 */
const randomReserveLinkTrigger: Trigger<
  typeof RandomReserveWorkflow.definition
> = {
  type: "shortcut",
  name: "SB確保",
  description: "SB確保ワークフローを起動するためのトリガーです。",
  workflow: "#/workflows/reserve_workflow",
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

export default randomReserveLinkTrigger;
