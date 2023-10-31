import dbBrowers from "@/datastore-brower";
import converter from "@/converter";
import path from "path";
import { remote } from "electron";
import { Octokit } from "@octokit/rest";
import packageJson from "../../../package";

const getOctokit = ({ githubPersonalAccessToken, githubEnterpriseUrl }) =>
  new Octokit({
    requestMedia: "application/vnd.github.v3+json",
    auth: githubPersonalAccessToken,
    headers: {
      userAgent: "code-browers".concat(packageJson.version),
      "user-agent": "octokit/rest.js v1.2.3",
      mediaType: {
        format: "application/vnd.github.v3+json"
      }
    },
    ...(githubEnterpriseUrl && { baseUrl: githubEnterpriseUrl })
  });

const state = {
  browers: [],
  languageSelected: "all",
  gistsSelected: false,
  isLoading: false
};

const mutations = {
  LOAD_BROWERS(state, browers) {
    state.languageSelected = "all";

    state.browers = browers;
  },
  ADD_BROWER(state, brower) {
    state.browers.push(brower);
  },
  DELETE_BROWER(state, brower) {
    if (state.gistsSelected) {
      state.browers = state.browers.filter(n => n.id !== brower.id);
    } else {
      state.browers = state.browers.filter(n => n._id !== brower._id);
    }
    state.languageSelected = "all";
  },
  SELECT_LANGUAGE(state, language) {
    state.languageSelected = language;
  },
  SELECT_GISTS(state, gistsSelected) {
    state.gistsSelected = gistsSelected;
  },
  SELECT_LOADING(state, loading) {
    state.isLoading = loading;
  }
};

const actions = {
  loadBrowers(store) {
    if (store.state.gistsSelected) {
      if (store.rootState.Settings.settings.githubPersonalAccessToken) {
        store.commit("SELECT_LOADING", true);
        store.commit("LOAD_BROWERS", []);

        const octokit = getOctokit(store.rootState.Settings.settings);

        octokit.gists.list().then(res => {
          const promises = [];

          res.data.forEach(gist => {
            promises.push(octokit.gists.get({ gist_id: gist.id }));
          });

          Promise.all(promises).then(values => {
            const browers = [];

            values.forEach(gistDetailed => {
              browers.push(converter.gistToBrower(gistDetailed.data));
            });

            store.commit("LOAD_BROWERS", browers);
            store.commit("SELECT_LOADING", false);
          });
        });
      } else {
        store.commit("LOAD_BROWERS", []);
      }
    } else {
      store.commit("SELECT_LOADING", true);
      dbBrowers.find({}, (err, browers) => {
        if (!err) {
          store.commit("LOAD_BROWERS", browers);
          actions.writeBrowersToFS(browers);
          store.commit("SELECT_LOADING", false);
        }
      });
    }
  },
  addBrower(store, brower) {
    store.commit("SELECT_LOADING", true);

    const octokit = getOctokit(store.rootState.Settings.settings);

    if (store.state.gistsSelected) {
      octokit.gists.create(brower).then(() => {
        store.dispatch("loadBrowers");
      });
    } else {
      dbBrowers.insert(brower, (err, brower) => {
        if (!err) {
          store.commit("ADD_BROWER", brower);
          store.commit("SELECT_LOADING", false);
        }
      });
      actions.writeFileToFS(brower, false);
    }
  },
  convertToGist(store, brower) {
    const octokit = getOctokit(store.rootState.Settings.settings);
    return octokit.gists.create(converter.browerToGist(brower));
  },
  updateBrower(store, brower) {
    if (store.state.gistsSelected) {
      const octokit = getOctokit(store.rootState.Settings.settings);

      octokit.gists
        .update({
          gist_id: brower.id,
          files: brower.files,
          description: brower.description
        })
        .then(() => store.dispatch("loadBrowers"));
    } else {
      dbBrowers.update({ _id: brower._id }, brower, {}, err => {
        if (!err) {
          store.dispatch("loadBrowers");
        }
      });
      actions.writeFileToFS(brower, true);
    }
  },
  deleteBrower(store, brower) {
    store.commit("SELECT_LOADING", true);

    const octokit = getOctokit(store.rootState.Settings.settings);

    if (store.state.gistsSelected) {
      octokit.gists.delete({ gist_id: brower.id }).then(() => {
        store.commit("DELETE_BROWER", brower);
        store.commit("SELECT_LOADING", false);
      });
    } else {
      dbBrowers.remove({ _id: brower._id }, {}, err => {
        if (!err) {
          store.commit("DELETE_BROWER", brower);
          store.commit("SELECT_LOADING", false);
        }
      });
      actions.deleBrowerFromFS(brower);
    }
  },
  writeBrowersToFS(browers) {
    browers.forEach(brower => {
      actions.writeFileToFS(brower, true);
    });
  },
  writeFileToFS(brower, updateIfExists) {
    const fs = require("fs-extra");
    const browersDir = path.join(remote.app.getPath("userData"), "browers");

    // Create folder for current brower
    const curBrowerDir = path.join(
      browersDir,
      `${brower.name}-${brower.createdAt.getTime()}`
    );
    if (!fs.existsSync(curBrowerDir)) {
      fs.ensureDirSync(curBrowerDir);
    }

    // Write metadata to filesystem
    fs.writeFileSync(
      path.join(curBrowerDir, "metadata.json"),
      JSON.stringify(brower),
      "utf-8"
    );
  },
  deleBrowerFromFS(brower) {
    const fs = require("fs-extra");
    const curBrowerDir = path.join(
      remote.app.getPath("userData"),
      "browers",
      `${brower.name}-${brower.createdAt.getTime()}`
    );
    fs.removeSync(curBrowerDir);
  },
  selectLanguage(store, language) {
    store.commit("SELECT_LANGUAGE", language);
  },
  selectGists(store, gists) {
    store.commit("SELECT_GISTS", gists);
    store.dispatch("loadBrowers");
  }
};

const getters = {
  browers: state => state.browers,
  browerById: state => id => state.browers.find(brower => brower._id === id),
  browerLanguages: state => {
    const map = new Map();

    if (state.browers.length > 0) {
      state.browers.forEach(brower => {
        Object.keys(brower.files).forEach(key => {
          if (map.has(brower.files[key].language)) {
            map.set(
              brower.files[key].language,
              map.get(brower.files[key].language) + 1
            );
          } else {
            map.set(brower.files[key].language, 1);
          }
        });
      });
    }
    return map;
  },
  browerTotalFiles() {
    let total = 0;

    state.browers.forEach(brower => {
      total += Object.keys(brower.files).length;
    });

    return total;
  },
  browerLanguageSelected: state => state.languageSelected,
  browerGistsSelected: state => state.gistsSelected,
  browerIsLoading: state => state.isLoading
};

export default {
  state,
  mutations,
  actions,
  getters
};
