import {
  DefineType,
  Schema,
} from "https://deno.land/x/deno_slack_sdk@1.4.3/mod.ts";

//{{status}}
//1→空き
//2→確保済み
//3→使用不可
const SandboxType = DefineType({
  title: "Sandbox Type",
  description: "Use for definition type of sandbox on slack",
  name: "sandbox",
  type: Schema.types.object,
  properties: {
    id: {
      type: Schema.types.integer,
    },
    name: {
      type: Schema.types.string,
    },
    user_id: {
      type: Schema.types.string,
    },
    user_name: {
      type: Schema.types.string,
    },
    description: {
      type: Schema.types.string,
    },
    due_date: {
      type: Schema.slack.types.date,
    },
    status: {
      type: Schema.types.integer,
    },
    server_branch: {
      type: Schema.types.string,
    },
    client_branch: {
      type: Schema.types.string,
    },
    updated_at: {
      type: Schema.slack.types.timestamp,
    },
  },
  required: [],
});

export default SandboxType;
