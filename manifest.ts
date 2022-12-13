import { Manifest } from "deno-slack-sdk/mod.ts";
import SandboxDatastore from "./datastore/sandbox.ts";
import { InitDatastoreFunctionDefinition } from "./functions/datastore/init.ts";
import InitDatastoreWorkflow from "./workflows/init_datastore.ts";

/**
 * The app manifest contains the app's configuration. This
 * file defines attributes like app name and description.
 * https://api.slack.com/future/manifest
 */
export default Manifest({
  name: "slack_sandbox_bot",
  description: "サンドボックスを健気に管理してくれる可愛い子です。",
  icon: "assets/default_new_app_icon.png",
  workflows: [InitDatastoreWorkflow],
  functions: [InitDatastoreFunctionDefinition],
  outgoingDomains: [],
  datastores: [SandboxDatastore],
  botScopes: [
    "commands",
    "chat:write",
    "chat:write.public",
    "datastore:read",
    "datastore:write",
    "users:read",
    "channels:manage",
    "groups:write",
  ],
});
