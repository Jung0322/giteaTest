<!--
  목적 : 사업장 select box
  작성자 : kdh
  Detail :
  *
  examples:
  *
  -->
<template>
  <form
    :ref="'form_' + scope.$index"
    method="post"
    enctype="multipart/form-data"
    name
  >
    <b-row>
      <b-col sm="2" v-if="editable && !disabled">
        <input v-show="false" type="submit" />
        <input
          v-show="false"
          type="file"
          :ref="'file_' + scope.$index"
          :multiple="true"
          v-on:change="setFile(scope)"
        />
        <el-button
          v-if="editable && !disabled"
          type="primary"
          size="mini"
          icon="el-icon-folder-opened"
          @click.stop="linkClicked(scope)"
        />
      </b-col>
      <b-col :sm="setSm" class="attach-file-column-list">
        <div
          v-for="(file, index) in scope.row.files.slice(0, 3)"
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
                @click="deleteFile(scope, file)"
              ></i>
            </li>
          </ul>
        </div>
        <div v-if="scope.row.files && scope.row.files.length > 3">
          <el-popover
            placement="bottom"
            title="첨부파일 리스트"
            width="400"
            trigger="click"
          >
            <el-button slot="reference" type="text" icon="el-icon-more-outline"
              >(+{{ scope.row.files.length - 3 }})</el-button
            >
            <div
              v-for="(file, index) in scope.row.files"
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
                    @click="deleteFile(scope, file)"
                  ></i>
                </li>
              </ul>
            </div>
          </el-popover>
        </div>
        <!-- 파일 뷰어 -->
        <el-dialog
          :visible.sync="dialogVisible"
          :append-to-body="true"
          :show-close="false"
        >
          <b-row>
            <b-col sm="12">
              <div class="float-right mb-1">
                <y-btn
                  title="파일 다운로드"
                  color="blue"
                  @btnClicked="download"
                />
                <y-btn title="L0000000881" @btnClicked="closePreview" />
              </div>
            </b-col>
            <b-col sm="12">
              <img width="100%" :src="dialogImageUrl" alt />
            </b-col>
          </b-row>
        </el-dialog>
      </b-col>
    </b-row>
  </form>
</template>

<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
export default {
  name: 'y-attach-column',
  props: {
    editable: {
      type: Boolean,
      default: true,
    },
    scope: {
      type: Object,
    },
    // 사용 여부
    disabled: {
      type: Boolean,
      default: false,
    },
    saveData: {
      type: Object,
      default: function () {
        return {
          files: [],
          tempId: [],
        };
      },
    },
    keyText: {
      type: String,
      default: '',
    },
    accept: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      tempIndex: 1,
      dialogImageUrl: '',
      downFile: 0,
      dialogVisible: false,
    };
  },
  computed: {
    setSm() {
      if (this.editable && !this.disabled) {
        return '10';
      } else {
        return '12';
      }
    },
  },
  watch: {},
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {},
  beforeDestory() {},
  methods: {
    init() {},
    linkClicked(scope) {
      // 탐색창 open
      this.$refs['file_' + scope.$index].click();
    },
    setFile(scope) {
      if (!this.saveData.files) {
        this.saveData.files = [];
      }
      let files = this.$refs['file_' + scope.$index].files;
      // 확장자 확인
      if (this.accept && files && files.length > 0) {
        let accepts = this.accept.split(',');
        let acceptType = [];
        this.$_.forEach(accepts, (acc) => {
          let acceptArray = acc.split('/');
          if (acceptArray && acceptArray.length === 2) {
            acceptType.push({
              type: acceptArray[0],
              ext: acceptArray[1],
            });
          }
        });
        if (!this.checkAccept(acceptType, files)) {
          window.getApp.$emit('ALERT', {
            title: '안내',
            message:
              '첨부가 불가능한 확장자입니다. 안 맞는 파일은 업로드 되지 않습니다. 확장자를 맞추어 주세요',
            type: 'warning', // success / info / warning / error
          });
          return;
        }
      }

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
          if (scope.row.tempId) {
            file.tempId = scope.row.tempId;
          } else {
            file.tempId = scope.row[this.keyText];
          }

          if (!saveFiles.name) {
            saveFiles.name = file.name;
            saveFiles.size = file.size;
          }

          saveFiles.raw.push(file);
          scope.row.files.push(file);
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
      this.$refs['file_' + scope.$index].value = '';
    },
    deleteFile(scope, file) {
      // 저장되지 않은 첨부파일 삭제 시
      let readyFiles = this.$_.filter(this.saveData.files, { status: 'ready' });
      let index = -1;
      let isDelete = false;
      this.$_.forEach(readyFiles, (readyFile) => {
        index = readyFile.raw.indexOf(file);
        if (index > -1) {
          // 저장할 데이터에서 삭제
          readyFile.raw.splice(readyFile.raw.indexOf(file), 1);
          // 목록에서 보여지고 있는 데이터에서 삭제
          scope.row.files.splice(scope.row.files.indexOf(file), 1);
          // scope.row[this.keyText].splice(scope.row[this.keyText].indexOf(file), 1);
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
                scope.row.files.splice(scope.row.files.indexOf(file), 1);
                // scope.row[this.keyText].splice(scope.row[this.keyText].indexOf(file), 1);
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
    /** /기타 function **/
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
              if (_error.data === 'nofile')
                window.getApp.$emit('APP_REQUEST_ERROR', _error);
            }
          );
        }
      } else {
        this.download(_item);
      }
    },
    checkAccept(acceptType, files) {
      let index = 0;
      let returnVal = true;
      let loopFiles = [];

      this.$_.forEach(files, (uploadFile) => {
        if (!returnVal) {
          loopFiles.push(uploadFile);
        } else {
          let fileType = files[index].type;
          let type = fileType.split('/')[0];
          let ext = fileType.split('/')[1];

          let haveAccept = this.$_.filter(acceptType, { type: type });
          if (!haveAccept) {
            // 올라 온 파일 중에 확장자가 내가 지정한 확장자에 맞지 않는 경우 uploadFiles에서 없애고
            // 알람창을 띄울 수 있도록 returnVal은 false로 던져준다.
            // 파일이 한꺼번에 여러개 올라 올 수 있음으로 재귀 호출 해 확장자가 맞지 않은 파일은 uploadFiles에서 없앤다.
            returnVal = false;
          } else {
            if (this.$_.findIndex(haveAccept, { ext: '*' }) === -1) {
              // 올라 온 파이 중에 내가 설정한 확장자가 모든(*)으로 표시가 되어져 있지 않다면 설정한 확장자의 텍스트 값을 비교
              if (this.$_.findIndex(haveAccept, { ext: ext }) === -1) {
                returnVal = false;
                return false;
              }
            }
          }
        }
        index++;
      });
      if (!returnVal) {
        this.checkAccept(acceptType, loopFiles);
      }
      return returnVal;
    },
    download(_item) {
      if (!_item) {
        _item = this.downFile;
      }
      let thisVue = this;
      let accept = this.$comm.getAccept(_item.fileExt);
      let _comm = this.$comm;
      this.$http.url = selectConfig.attachFile.file64.url; // BASE64를 UTF-8인코딩한 바이트로 다운받음 (그렇지 않으면 FRONT에서 JSON이 깨짐)
      this.$http.type = 'GET';
      this.$http.param = { fileNo: _item.fileNo };
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
    closePreview() {
      this.dialogVisible = false;
    },
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
  min-height: 40px;
  overflow-y: auto;
}
.el-upload-list__item:first-child {
  margin-top: 0px !important;
}
.el-upload-list__item {
  padding-bottom: 5px;
}
</style>
