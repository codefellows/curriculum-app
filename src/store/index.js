import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import createSagaMiddleware from 'redux-saga';

import * as watch from './saga.js';
import curriculum from './curriculum.store.js';

const sagaMiddleware = createSagaMiddleware();

const reducers = combineReducers({ curriculum });

const store = configureStore({
  reducer: reducers,
  middleware: [sagaMiddleware, ...getDefaultMiddleware()],
});

sagaMiddleware.run(watch.watchSelectCourse);
sagaMiddleware.run(watch.watchSelectVersion);
sagaMiddleware.run(watch.watchSelectPage);
sagaMiddleware.run(watch.watchOpenDemo);
sagaMiddleware.run(watch.watchInit);
sagaMiddleware.run(watch.watchAssignment);

export default store;
