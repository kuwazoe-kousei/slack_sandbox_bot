import { Manifest } from "deno-slack-sdk/mod.ts";
import PinnedMessageDatastore from "./datastore/pinned_message.ts";
import SandboxDatastore from "./datastore/sandbox.ts";
import { InitDatastoreFunctionDefinition } from "./functions/datastore/init.ts";
import { FindPinnedMessageFunctionDefinition } from "./functions/datastore/pinned_message/find.ts";
import { SavePinnedMessageFunctionDefinition } from "./functions/datastore/pinned_message/save.ts";
import { LoadSandboxFunctionDefinition } from "./functions/datastore/sandbox/load.ts";
import { RandomReserveSandboxFunctionDefinition } from "./functions/datastore/sandbox/random_reserve.ts";
import { UpdateTopicSandboxFunctionDefinition } from "./functions/sandbox/update_topic.ts";
import { UnpinMessageFunctionDefinition } from "./functions/unpin_message.ts";
import PinnedMessageType from "./types/pinned_message.ts";
import SandboxiesType from "./types/sanboxies.ts";
import SandboxType from "./types/sandbox.ts";
import InitDatastoreWorkflow from "./workflows/init_datastore.ts";
import RandomReserveWorkflow from "./workflows/random_reserve.ts";

/**
 * The app manifest contains the app's configuration. This
 * file defines attributes like app name and description.
 * https://api.slack.com/future/manifest
 */
export default Manifest({
  name: "slack_sandbox_bot",
  description: "サンドボックスを健気に管理してくれる可愛い子です。",
  icon: "assets/default_new_app_icon.png",
  workflows: [RandomReserveWorkflow, InitDatastoreWorkflow],
  functions: [
    InitDatastoreFunctionDefinition,
    RandomReserveSandboxFunctionDefinition,
    LoadSandboxFunctionDefinition,
    UpdateTopicSandboxFunctionDefinition,
    UnpinMessageFunctionDefinition,
    FindPinnedMessageFunctionDefinition,
    SavePinnedMessageFunctionDefinition,
  ],
  outgoingDomains: [],
  datastores: [SandboxDatastore, PinnedMessageDatastore],
  types: [SandboxType, SandboxiesType, PinnedMessageType],
  botScopes: [
    "commands",
    "chat:write",
    "chat:write.public",
    "datastore:read",
    "datastore:write",
    "users:read",
    "channels:manage",
    "groups:write",
    "im:write",
    "mpim:write",
    "pins:write",
  ],
});
