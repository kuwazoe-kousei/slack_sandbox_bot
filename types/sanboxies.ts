import {
  DefineType,
  Schema,
} from "https://deno.land/x/deno_slack_sdk@1.4.3/mod.ts";
import SandboxType from "./sandbox.ts";

//sandboxの配列型
const SandboxiesType = DefineType({
  title: "Sandboxies Type",
  description: "Use for definition type of sandboxies on slack",
  name: "sandboxies",
  type: Schema.types.array,
  items: {
    type: SandboxType,
  },
});

export default SandboxiesType;
