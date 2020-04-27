import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import superagent from 'superagent';
import getTitle from 'get-title-markdown';

const proxy = process.env.REACT_APP_GITHUB_PROXY;
const sampleManifest = require('./manifest.json');

// Async Actions
// With RTK, these are exported and callable by components
// They end up dispatching the appropriate "extraReducer.fulfilled"
// When finished

export const getCourses = createAsyncThunk(
  'curriculum/getCoursesStatus',
  async (thunkAPI) => {
    const url = `${proxy}/repos`;
    const response = await superagent.post(url);
    const courseRepos = JSON.parse(response.text);
    return courseRepos;
  },
);

export const getDemoFiles = createAsyncThunk(
  'curriculum/getDemoFilesStatus',
  async ({ demoMode, demoFolder, repo, version }, thunkAPI) => {
    if (demoMode && demoFolder && repo && version) {
      const url = `${proxy}/tree`;
      const path = demoFolder;
      const selections = { repo, version, path };
      const response = await superagent.post(url).send(selections);
      const tree = JSON.parse(response.text);
      return tree;
    }
  },
);

export const getMarkdown = createAsyncThunk(
  'curriculum/getMarkdownStatus',
  async ({ repo, version, file }, thunkAPI) => {
    if (repo && version && file) {
      const url = `${proxy}/content`;
      const selections = { repo, version, file };
      const response = await superagent.post(url).send(selections);
      const rawMarkdown = response.text;
      return rawMarkdown;
    }
  },
);

export const getManifest = createAsyncThunk(
  'curriculum/getManifestStatus',
  async ({ repo, version }, thunkAPI) => {
    return sampleManifest;
    if (repo && version) {
      const url = `${proxy}/manifest`;
      const selections = { repo, version };
      const response = await superagent.post(url).send(selections);
      const manifest = JSON.parse(response.text);
      return manifest;
    }
  },
);

export const getVersions = createAsyncThunk(
  'curriculum/getVersionsStatus',
  async ({ repo }, thunkAPI) => {
    const url = `${proxy}/releases`;
    const selections = { repo };
    const response = await superagent.post(url).send(selections);
    const versions = JSON.parse(response.text);
    return versions;
  },
);

const curriculum = createSlice({
  name: 'curriculum',
  initialState: {
    markdown: '',      // The content of the current .md file
    repositories: [],  // All valid repositories
    versions: [],      // All published versions of the current repo
    pages: [],         // The contents of manifest.json
    demoFiles: {files:{}},     // The "tree" of the demo folder
    demoMode: false,   // Demo mode or Content mode
    demoFolder: '',    // The relative path to the demos folder
    classInfo: {},     // Info about the current class day
    title: '',         // App Title
    repo: '',          // Currently Active Repository
    version: '',       // Currently Active Version of the Repository
    file: '',          // Currently Active markdown file
  },
  reducers: {
    setState(state, action) {
      state[action.node] = action.payload;
    },
    setMarkdown(state, action) {
      state.markdown = action.payload;
    },
    setVersions(state, action) {
      state.versions = action.payload;
    },
    setPages(state, action) {
      state.pages = action.payload;
    },
    setDemoFiles(state, action) {
      state.demoFiles = action.payload;
    },
    setDemoFolder(state, action) {
      state.demoFolder = action.payload;
    },
    setClass(state, action) {
      state.class = action.payload;
    },
    setTitle(state, action) {
      state.title = action.payload;
    },
    setRepo(state, action) {
      state.repo = action.payload;
    },
    setVersion(state, action) {
      state.version = action.payload;
    },
    setFile(state, action) {
      state.file = action.payload;
    },
    selectCourse(state, action) {
      const repo = action.payload;
      state.title = repo.split('/').pop();
      state.version = '';
      state.file = '';
      state.markdown = '';
      state.pages = [];
      console.log('setting', repo);
      state.repo = repo;
    },
    selectVersion(state,action) {
      const version = action.payload;
      state.title = `${state.repo.split('/').pop()} @ ${version}`;
      state.version = action.payload;
      state.file = '';
      state.markdown = '';
      state.pages = [];
    },
    selectPage(state, action) {
      state.file = action.payload;
      state.demoMode = false;
    },
    openDemo(state,action) {
      state.demoMode = true;
      state.demoFolder = action.payload;
    },
  },
  extraReducers: {
    [getCourses.fulfilled]: (state,action) => {
      state.repositories = action.payload;
    },
    [getDemoFiles.fulfilled]: (state, action) => {
      state.demoFiles = action.payload;
    },
    [getMarkdown.fulfilled]: (state, action) => {
      state.title = getTitle(action.payload);
      state.markdown = action.payload;
    },
    [getVersions.fulfilled]: (state, action) => {
      state.versions = action.payload;
    },
    [getManifest.fulfilled]: (state, action) => {
      state.pages = action.payload;
    },
  },
});

// Core Action Creators - State Movers
export const {
  setMarkdown,
  setRepositories,
  setVersions,
  setVersion,
  setPages,
  setDemoFiles,
  setDemoFolder,
  setClass,
  setTitle,
  setRepo,
  setFile,
  selectCourse,
  selectVersion,
  selectPage,
  openDemo,
} = curriculum.actions;


export default curriculum.reducer;
