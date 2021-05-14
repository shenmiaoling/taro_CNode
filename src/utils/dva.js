import { create } from "dva-core";
import { createLogger } from "redux-logger";
import produce from "immer";
import createLoading from "dva-loading";
let app;
let store;
let dispatch;
let registered;

function createApp(opt) {
  // opt.onAction = [createLogger()];
  app = create(opt);
  app.use(createLoading({}));

  if (!global.registered) {
    opt.models.forEach((model) => app.model(model));
  }
  global.registered = true;
  app.start();

  store = app._store;
  app.getStore = () => store;

  app.use({
    onError(err) {
      console.log(err);
    },
  });

  dispatch = store.dispatch;
  app.dispatch = dispatch;

  return app;
}

function createModel(model) {
  if (model.reducers) {
    let _reducers = {};
    let reducerKeys = Object.keys(model.reducers);

    reducerKeys.forEach((key) => {
      let reducerFns = model.reducers[key];
      _reducers[key] = function (state, action) {
        return produce(state, function (draft) {
          reducerFns(draft, action);
        });
      };
    });
    model.reducers = _reducers;
  }

  return model;
}

function getDispatch() {
  return app.dispatch;
}

export { createApp, createModel, getDispatch };
