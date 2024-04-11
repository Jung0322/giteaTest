<template>
  <b-container fluid>
    <b-row>
      <b-col sm="12">
          <!-- <input v-show="false" type="submit" /> -->
          <input
          v-show="false"
          type="file"
          :ref="'file_open_icon'"
          :multiple="true"
          v-on:change="setFile()"
          />
          <el-button
          v-show="editable && !disabled"
          type="primary"
          size="mini"
          icon="el-icon-folder-opened"
          @click.stop="linkClicked()"
          />
          <!-- 닫기 -->
          <y-btn style="float: right;" title="L0000000881" @btnClicked="btnClosePopup" />
      </b-col>
      <b-col :sm="12" class="attach-file-column-list">
        <div
          v-for="(file, index) in rowFiles"
          :key="'file_' + index"
          class="ui-bordered text-left el-upload-list__item"
        >
          <ul class="el-upload-list el-upload-list--text">
            <li class="el-upload-list__item is-success">
              <a
                class="el-upload-list__item-name"
                @click.stop="onDocumentDownload(file)"
              >
                <i class="el-icon-paperclip"></i>
                {{ file.name }} ({{ getFileSizeTextByRound(file) }})
              </a>
              <label class="el-upload-list__item-status-label">
                <i
                  :class="{
                    'el-icon-upload-success': true,
                    'el-icon-circle-check': true,
                    'el-icon-check': true,
                  }"
                ></i>
              </label>
              <i
                v-if="editable && !disabled"
                class="el-icon-close"
                @click="deleteFile(file)"
              ></i>
            </li>
          </ul>
        </div>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
export default {
  /* attributes: name, components, props, data */
  name: 'grid-file-upload',
  props: {
    popupParam: {
      type: Object,
      default: function () {
        return {};
      },
    },
    accept: {
      type: String,
      default: '',
    },
  },
  data: () => ({
    editable: false,
    disabled: true,

    rowFiles: [],
    saveData: {
      files: [],
    },
  }),
  computed: {},
  watch: {},
  //* Vue lifecycle: created, mounted, destroyed, etc */
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  updated() {},
  mounted() {},
  beforeDestroy() {},
  //* methods */
  methods: {
    init() {
      if (!this.saveData.files) {
        this.saveData.files = [];
      }
      this.editable = this.popupParam.editable;
      this.disabled = this.popupParam.disabled;

      this.rowFiles = this.$_.cloneDeep(this.popupParam.rowFiles);
      this.saveData = this.$_.cloneDeep(this.popupParam.files) || { files: [] };
    },
    linkClicked() {
      // 탐색창 open
      this.$refs['file_open_icon'].click();
    },
    setFile() {
      const files = this.$refs['file_open_icon'].files;
      if (files && files.length > 0) {
        let saveFiles = {};
        let uploadFiles = this.saveData.files;
        if (uploadFiles && uploadFiles.length > 0) {
          if (this.$_.findIndex(uploadFiles, { status: 'ready' }) === -1) {
            saveFiles = {
              status: 'ready',
              name: '',
              size: '',
              percentage: 0,
              uid: Date.now() + this.tempIndex++,
              raw: [],
            };
          } else {
            saveFiles = this.$_.find(uploadFiles, { status: 'ready' });
          }
        } else {
          saveFiles = {
            status: 'ready',
            name: '',
            size: '',
            percentage: 0,
            uid: Date.now() + this.tempIndex++,
            raw: [],
          };
        }
        this.$_.forEach(files, (file) => {
          file.tempId = this.popupParam.tempId;
          file.addDate = Date.now();

          if (!saveFiles.name) {
            saveFiles.name = file.name;
            saveFiles.size = file.size;
          }

          saveFiles.raw.push(file);
          this.rowFiles.push(file);
        });

        if (!uploadFiles) {
          this.saveData.files.push(saveFiles);
        } else if (this.$_.findIndex(uploadFiles, { status: 'ready' }) === -1) {
          this.saveData.files.push(saveFiles);
        } else {
          this.saveData.files.splice(
            this.$_.findIndex(uploadFiles, { status: 'ready' }, 1)
          );
          this.saveData.files.push(saveFiles);
        }
      }
      this.$refs['file_open_icon'].value = '';
    },
    deleteFile(file) {
      // 저장되지 않은 첨부파일 삭제 시
      let readyFiles = this.$_.filter(this.saveData.files, { status: 'ready' });
      let index = -1;
      let isDelete = false;
      this.$_.forEach(readyFiles, (readyFile) => {
        // index = readyFile.raw.indexOf(file);
        index = readyFile.raw.findIndex(f => f.tempId === file.tempId && f.name === file.name && f.addDate === file.addDate);
        if (index > -1) {
          // 저장할 데이터에서 삭제
          readyFile.raw.splice(readyFile.raw.indexOf(file), 1);
          this.rowFiles.splice(this.rowFiles.indexOf(file), 1);
          isDelete = true;
          return false;
        }
      });
      // 저장 된 데이터가 삭제된 경우
      if (!isDelete) {
        window.getApp.$emit('CONFIRM', {
          title: '확인',
          message: '파일을 삭제 하시겠습니까?',
          type: 'info',
          confirmCallback: () => {
            this.$http.url = this.$format(
              transactionConfig.attachFile.delete.url,
              file.fileNo
            );
            this.$http.type = 'DELETE';
            this.$http.request(
              (_result) => {
                // 목록에서 보여지고 있는 데이터에서 삭제
                this.rowFiles.splice(this.rowFiles.indexOf(file), 1);
                this.btnCallback();
              },
              (_error) => {
                window.getApp.$emit('APP_REQUEST_ERROR', _error);
              }
            );
          },
          // 취소 callback 함수
          cancelCallback: () => {},
        });
      }
    },
    getFileSizeTextByRound(file) {
      let size = file.size;
      if (!size && size !== 0) {
        size = file.fileSize;
      }
      return this.$comm.bytesToSize(size);
    },
    onDocumentDownload: function (_item) {
      if (!_item.fileNo) {
        return;
      }
      if (this.$_.includes(this.accept, 'image')) {
        if (_item.fileNo) {
          this.$http.url = selectConfig.attachFile.image64.url;
          this.$http.type = 'GET';
          this.$http.param = { fileNo: _item.fileNo }; // 해당 컴포넌트는 공정안전자료에서 사용하지 않기 때문에 taskFlag는 주지 않는다. 210629 jkl
          this.$http.request(
            (_result) => {
              this.dialogImageUrl =
                'data:' + _item.contentType + ';base64,' + _result.data;
              this.downFile = _item;
              if (this.dialogImageUrl) {
                this.dialogVisible = true;
              }
            },
            (_error) => {
              if (_error.data === 'nofile') {
                window.getApp.$emit('APP_REQUEST_ERROR', _error);
              }
            }
          );
        }
      } else {
        this.download(_item);
      }
    },
    download(_item) {
      if (!_item) {
        _item = this.downFile;
      }
      let thisVue = this;
      let accept = this.$comm.getAccept(_item.fileExt);
      this.$http.url = selectConfig.attachFile.file64.url; // BASE64를 UTF-8인코딩한 바이트로 다운받음 (그렇지 않으면 FRONT에서 JSON이 깨짐)
      this.$http.type = 'GET';
      this.$http.param = { fileNo: _item.fileNo, taskFlag: '' };
      this.$http.request(
        (_result) => {
          var url = window.URL || window.webkitURL;
          let link = document.createElement('a');
          var blob = thisVue.$comm.base64ToBlob(_result.data, accept);
          if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(blob, _item.fileOrgNm);
          } else {
            let link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = _item.fileOrgNm;
            link.click();
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    
    btnCallback() {
      this.$emit('callBack', {
        saveData: this.saveData,
        rowFiles: this.rowFiles,
      });
    },
    btnClosePopup() {
      this.$emit('closePopup', {
        saveData: this.saveData,
        rowFiles: this.rowFiles,
      });
    }
  },
};
</script>
<style>
.grid_attach_list-ul {
  list-style-type: none;
  padding-left: 15px;
}
.grid_attach_list-li {
  padding-bottom: 5px;
}
.grid_attach_list-li {
  padding-bottom: 5px;
}
.attach-file-column-list {
  max-height: 125px;
  min-height: 30vh;
  overflow-y: auto;
  margin-top: 20px;
}
.el-upload-list__item:first-child {
  margin-top: 0px !important;
}
.el-upload-list__item {
  padding-bottom: 5px;
}
</style>
