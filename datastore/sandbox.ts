import { DefineDatastore, Schema } from "deno-slack-sdk/mod.ts";

const SandboxDatastore = DefineDatastore({
  name: "sandbox",
  primary_key: "id",
  attributes: {
    id: {
      type: Schema.types.string,
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
