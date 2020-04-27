import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';

import curriculum from './curriculum.store.js';

const reducers = combineReducers({ curriculum });

const store = configureStore({ reducer: reducers });

export default store;
