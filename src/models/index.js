import global from "./global";
import models from "./models";
import { createModel } from "../utils/dva";

export default [global, ...models].map(createModel);
