import { DefineDatastore } from "deno-slack-sdk/mod.ts";
import SandboxType from "../types/sandbox.ts";

const SandboxDatastore = DefineDatastore({
  name: "sandbox",
  primary_key: "name",
  attributes: SandboxType.definition.properties,
});

export default SandboxDatastore;
