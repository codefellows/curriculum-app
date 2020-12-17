import { createSlice, current } from '@reduxjs/toolkit';

const curriculum = createSlice({
  name: 'curriculum',
  initialState: {
    markdown: '',      // The content of the current .md file
    repositories: [],  // All valid repositories
    versions: [],      // All published versions of the current repo
    pages: [],         // The contents of manifest.json
    demoFiles: { files: {} },     // The "tree" of the demo folder
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

    init(state, action) { },

    assignment(state, action) { },

    setError(state, action) {
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
      state.title = `${state.pages.overview.title} @ ${state.version}`;
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
    selectVersion(state, action) {
      state.version = action.payload;
      state.file = '';
      state.markdown = '';
      state.pages = [];
    },
    selectPage(state, action) {

      const { moduleNumber, classNumber, assignment } = action.payload;

      state.demoMode = false;

      console.log(action);

      if (action.payload.path) {
        state.file = action.payload;
      }
      else if (moduleNumber && classNumber && assignment) {
        const moduleObject = current(state)?.pages?.modules.filter(entry => entry.module === moduleNumber)[0] || {};
        const classObject = moduleObject.classes ? moduleObject.classes.filter(entry => entry.class === classNumber)[0] : {};
        const fileObject = classObject?.assignments ? classObject.assignments[assignment] : {};
        state.file = fileObject;
      }

    },
    openDemo(state, action) {
      state.demoMode = true;
      state.demo = action.payload;
    },
  },
});

// Core Action Creators - State Movers
export const {
  init,
  assignment,
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
