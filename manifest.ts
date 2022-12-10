import { Manifest } from "deno-slack-sdk/mod.ts";
import SandboxDataStore from "./datastore/sandbox.ts";
import GreetingWorkflow from "./workflows/greeting_workflow.ts";

/**
 * The app manifest contains the app's configuration. This
 * file defines attributes like app name and description.
 * https://api.slack.com/future/manifest
 */
export default Manifest({
  name: "slack_sandbox_bot",
  description: "サンドボックスを健気に管理してくれる可愛い子です。",
  icon: "assets/default_new_app_icon.png",
  workflows: [GreetingWorkflow],
  outgoingDomains: [],
  datastores: [SandboxDataStore],
  botScopes: ["commands", "chat:write", "chat:write.public"],
});
