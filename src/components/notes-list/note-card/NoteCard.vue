<template>
  <div class="box" xmlns:v-clipboard="http://www.w3.org/1999/xhtml">
    <article class="media">
      <div class="media-content">
        <div class="content">
          <div id="card-header" class="columns">
            <div id="name-category" class="column is-9">
              <h4 v-if="gistsSelected">
                {{ note.description }}
                <b-icon class="visibility-icon" :icon="note.public ? 'globe' : 'lock'"></b-icon>
              </h4>
              <h3 v-else @click="showUpdateNoteModal(note.name)"><a>{{ note.name }}</a></h3>
            </div>
            <div id="action-buttons" class="column is-3">
              <div class="is-pulled-right">
                <a
                  id="link-note"
                  v-if="gistsSelected"
                  @click="open(note.url)"
                  title="Show on Github"
                >
                  <b-icon icon="github"></b-icon>
                </a>
                <a
                  id="convert-note"
                  v-if="!gistsSelected && githubToken"
                  @click="convertNoteToGist"
                  title="Convert to gist"
                >
                  <b-icon icon="share" size="is-small"></b-icon>
                  <b-icon icon="github"></b-icon>
                </a>
                <a id="open-note" v-if="checkBrowerIsOpen(noteUpdated.pid)" @click="openModal(note.name)" title="open brower">
                  <b-icon icon="opencart"></b-icon>
                </a>
                <a id="update-note" v-if="checkBrowerIsOpen(noteUpdated.pid)" @click="showUpdateNoteModal(note.name)" title="Edit brower">
                  <b-icon icon="pencil"></b-icon>
                </a>
                <a id="delete-note" @click="deleteNoteModal()" title="Delete brower">
                  <b-icon icon="trash"></b-icon>
                </a>
              </div>
            </div>
          </div>
          <p v-if="!gistsSelected">{{ note.description }}</p>

          <div v-if="false">
            <div class="note-file" v-for="(value, key, index) in note.files" :key="index">
              <h4 @click="toggleCollapse(index)">
                <b-icon :icon="collapsed[index] ? 'chevron-down' : 'chevron-up'" ></b-icon>
                {{ value.name }}
                <span class="note-file-small">
                  ({{ value.language }})
                </span>
                <b-tag
                  type="is-dark"
                  v-for="tag in note.tags"
                  :data="tag"
                  :style="'background-color: ' + stringToColour(tag) + ';'"
                  :key="tag.text"
                >{{ tag }}</b-tag>
              </h4>
              <div v-show="!collapsed[index]">
                <editor
                  :code="value.content"
                  :lang="value.language"
                  theme="monokai"
                  width="100%"
                  height="260"
                  :readOnly="true"
                ></editor>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>

    <modal
      :name="note.name"
      :resizable="true"
      :reset="true"
      :adaptive="true"
      height="70%"
      width="700"
      :min-width="700"
      :min-height="550"
    >
      <cn-update-note-modal :note="note"></cn-update-note-modal>
    </modal>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import ColorHash from "color-hash";
import editor from "@/components/editor/Editor";
import UpdateNoteModal from "@/components/modals/update-note-modal/UpdateNoteModal";
import brower from "@/brower/brower";
import { time } from "console";
import { resourceLimits } from "worker_threads";
// import chromDriver from "@/brower/driver";

export default {
  name: "cn-note-card",
  components: {
    "cn-update-note-modal": UpdateNoteModal,
    editor
  },
  props: {
    note: Object
  },
  mounted() {
    this.noteUpdated = { ...this.note };
  },
  data() {
    return {
      updateNoteModalActive: false,
      collapsed: Array(this.note.files.length).fill(true),
      noteUpdated: {
        pid: "",
        name: "",
        description: "",
        files: {},
        updatedAt: null,
        createdAt: null,
        tags: [],
        form: {
          proxy: {},
          cookie: {},
          ua: {},
          'sec-ch-ua': {},
          'ua-language': {},
          'time-zone': {},
          location: {},
          screen: {},
          fonts: {},
          canvas: {},
          'webgl-img': {},
          webgl: {},
          'audio-context': {},
          media: {},
          'client-rects': {},
          'speech_voices': {},
          ssl: {},
          cpu: {},
          memory: {},
          'device-name': {},
          mac: {},
          dnt: {},
          'port-scan': {},
          gpu: {},
          webrtc: {},
        },
      },
    };
  },
  computed: {
    ...mapGetters(["notes", "gistsSelected", "githubToken"])
  },
  methods: {
    ...mapActions(["updateNote", "deleteNote", "convertToGist", "selectGists"]),
    toggleCollapse(index) {
      this.$set(this.collapsed, index, !this.collapsed[index]);
    },
    stringToColour(str) {
      const colorHash = new ColorHash({ lightness: 0.5, saturation: 0.6 });
      return colorHash.hex(str);
    },
    showUpdateNoteModal(name) {
      this.$modal.show(name);
    },
    checkBrowerIsOpen(pid){
      const { execSync  } = require('child_process');
      var result = true;
      if(pid != ""){
        try {
          const res = execSync("tasklist  |findstr main.exe| findstr "+ pid);
          // console.log(res.toString()); // 将结果转换为字符串，并打印出来
          result = false;
        } catch (error) {
          // console.error("出错了",error);
        }
      }
      return result;
    },
    openModal(name) {
      // 用于运行外部程序的 .exe 文件路径
      console.log(name)
      const pid = brower.runExternalExe(this.noteUpdated);
      console.log(pid);
      if(pid){
        this.noteUpdated.pid = pid;
        this.noteUpdated.updatedAt = new Date();
        this.updateNote(this.noteUpdated).then(() => {
            this.$modal.hide(this.noteUpdated.name);
          });
      }

    },
    updateNoteModal() {
      this.updateNote(this.note);
    },
    deleteNoteModal() {
      this.$buefy.dialog.confirm({
        title: this.gistsSelected ? "Delete brower" : "Delete brower",
        message: `Are you sure you want to delete this ${
          this.gistsSelected ? "brower" : "brower"
        } ?`,
        confirmText: "Delete",
        type: "is-danger",
        hasIcon: true,
        onConfirm: () => {
          this.deleteNote(this.note);
        }
      });
    },
    convertNoteToGist() {
      this.convertToGist(this.note)
        .then(() => {
          this.$buefy.dialog.confirm({
            title: "Successful",
            message:
              "Note was converted to gist.<br>Do you want to delete local note ?",
            confirmText: "Delete",
            cancelText: "Keep",
            type: "is-success",
            icon: "check-circle",
            hasIcon: true,
            onConfirm: () => {
              this.deleteNote(this.note);
              this.selectGists(true);
            },
            onCancel: () => {
              this.selectGists(true);
            }
          });
        })
        .catch(() => {
          this.$buefy.dialog.alert({
            title: "Error",
            message: "Note was not converted to gist.<br>Please retry later.",
            type: "is-danger",
            hasIcon: true,
            icon: "times-circle"
          });
        });
    },
    onCopyClipboardSuccess() {
      this.$toast.open({
        message: "Copied",
        position: "is-bottom"
      });
    },
    open(link) {
      this.$electron.shell.openExternal(link);
    },
    exportToCarbon(content) {
      const url =
        "https://carbon.now.sh/?bg=rgba(0,0,0,0)&t=dracula&l=auto&ds=true&wc=true&wa=true&pv=43px&ph=57px&ln=false&code=";
      this.$electron.shell.openExternal(`${url}${encodeURI(content)}`);
    }
  }
};
</script>

<style src="./NoteCard.scss" lang="scss" scoped></style>
