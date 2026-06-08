import { createApp } from "./app.js";
import { loadConfig } from "./config.js";
import { D1Store } from "./store.js";

export default {
  fetch(request, env) {
    const app = createApp({
      store: new D1Store(env.DB),
      config: loadConfig(env)
    });
    return app.fetch(request);
  }
};
