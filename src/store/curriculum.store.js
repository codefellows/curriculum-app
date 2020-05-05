import { createSlice } from '@reduxjs/toolkit';

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
    error: '',         // Any Error Messages
  },
  reducers: {

    init(state, action) {},

    setError( state, action) {
      console.warn('ERROR', action.payload);
      state.error = action.payload;
    },
    setRepositories(state, action) {
      state.repositories = action.payload;
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
      state.classInfo = action.payload;
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
      state.repo = repo;
      state.title = repo.split('/').pop();
      state.version = '';
      state.file = '';
      state.markdown = '';
      state.pages = [];
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
});

// Core Action Creators - State Movers
export const {
  init,
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
