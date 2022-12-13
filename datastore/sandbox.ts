import { DefineDatastore, Schema } from "deno-slack-sdk/mod.ts";

//{{status}}
//1→空き
//2→確保済み
//3→使用不可
const SandboxDatastore = DefineDatastore({
  name: "sandbox",
  primary_key: "name",
  attributes: {
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
      type: Schema.types.number,
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
});

export default SandboxDatastore;
