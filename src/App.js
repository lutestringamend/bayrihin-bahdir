import Parse from 'parse/dist/parse.min.js';
import { DEV_PARSE_APP_ID, DEV_PARSE_JS_KEY } from './constants/parse';

import { Provider } from "react-redux";
import rootReducer from "./redux/reducers";
import { configureStore } from "@reduxjs/toolkit";
import Init from './pages/Init';
const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

const PARSE_APPLICATION_ID = DEV_PARSE_APP_ID;
const PARSE_HOST_URL = 'https://parseapi.back4app.com/';
const PARSE_JAVASCRIPT_KEY = DEV_PARSE_JS_KEY;
Parse.initialize(PARSE_APPLICATION_ID, PARSE_JAVASCRIPT_KEY);
Parse.serverURL = PARSE_HOST_URL;



function App() {
  return (
    <Provider store={store}>
        <Init />
      </Provider>
   
  );
}

export default App;
