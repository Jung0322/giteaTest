<!--
  목적 : 게시물 등록&수정
  작성자 : khk
  Detail : 시스템관리-공지사항 등록/수정
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <b-row class="mt-3">
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- 게시글 상세 -->
            <y-label
              v-show="!updateMode && !answerMode"
              label="L0000000390"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <!-- 게시글 등록 -->
            <y-label
              v-show="updateMode"
              label="L0000005420"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <!-- 답글 등록 -->
            <y-label
              v-show="answerMode"
              label="L0000005421"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 답글 -->
              <y-btn
                v-show="answerPosb"
                v-if="!answerMode && !updateMode"
                title="L0000004550"
                color="blue"
                @btnClicked="changeAnswerMode"
              />
              <!-- 저장 -->
              <y-btn
                v-if="(editable && updateMode) || (editable && answerMode)"
                title="L0000002474"
                color="orange"
                @btnClicked="btnSave"
              />
              <!-- 수정 -->
              <y-btn
                v-if="!updateMode && !answerMode && editable"
                title="L0000001696"
                color="orange"
                @btnClicked="changeUpdateMode"
              />
              <!-- 삭제 -->
              <y-btn
                v-if="
                  editable && !updateMode && !answerMode && this.bbs.notiNo != 0
                "
                title="L0000001495"
                color="red"
                @btnClicked="btnDelete"
              />
              <!-- 닫기 -->
              <y-btn title="L0000000881" @btnClicked="btnClose" />
            </div>
          </b-col>
        </b-row>
        <b-card>
          <b-row>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              <!-- 제목 -->
              <y-text
                :width="10"
                :editable="updateMode || answerMode"
                :required="true"
                :maxlength="100"
                ui="bootstrap"
                label="L0000002616"
                name="title"
                v-model="bbs.notiTtl"
                v-validate="'required'"
                :state="validateState('title')"
              />
            </b-col>

            <!-- <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              <tinymce
                id="d1"
                required
                v-model="notice.noticeContents"
                :other_options="{elementpath: false, branding: false}"
                :plugins="[]"
              ></tinymce>
            </b-col>-->
          </b-row>
          <b-card>
            <b-row>
              <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
                <vue-editor
                  v-if="updateMode || answerMode"
                  id="d1"
                  v-model="bbs.notiCont"
                  required
                ></vue-editor>
                <div
                  v-if="!updateMode && !answerMode"
                  class="editor-content"
                  :style="{
                    minHeight: '500px',
                    width: '100%',
                    overflow: 'auto',
                  }"
                  v-html="bbs.notiCont"
                />
              </b-col>
            </b-row>
          </b-card>
          <b-row class="mt-3" />
          <b-row v-show="!(taskClassNm === null)">
            <b-col>
              <y-file-upload
                ref="fileupload"
                :attach-file-grp="attachFileGrp"
                :label="attachFileGrp.label"
                :showUploadBtn="attachFileGrp.showUploadBtn"
                :onlyDownload="attachFileGrp.onlyDownload"
                :editable="attachFileGrp.editable"
                :disabled="attachFileGrp.disabled"
                :close="false"
                @closePopup="() => {}"
              ></y-file-upload>
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>
    <b-row class="mt-3" v-show="replyPosb && !updateMode && !answerMode">
      <b-col sm="12">
        <b-card>
          <b-col sm="12" class="px-0">
            <!-- <div slot="buttonGroup" class="float-right mb-1">
               댓글추가
              <y-btn
                title="L0000004253"
                color="orange"
                @btnClicked="btnPopupClickedCallback"
              />
            </div>
             댓글 목록
            <y-data-table
              label="L0000004254"
              ref="dataTable"
              :height="gridOptions.height"
              :headers="gridOptions.header"
              :items="gridOptions.data"
              :popMode="true"
              :editable="reply.replyEditable"
            >
               저장/삭제 
              <el-table-column
                slot="tag"
                label="저장/삭제"
                width="120"
                align="center"
              >
                <template slot-scope="scope">
                  <div v-if="scope.row.replyEditable">
                    저장
                    <y-btn
                      v-if="scope.row.replyEditMode === 'save'"
                      title="L0000002474"
                      color="orange"
                      :showLoading="false"
                      @btnClicked="saveReply(scope)"
                    />
                    수정 
                    <y-btn
                      v-if="scope.row.replyEditMode === 'edit'"
                      title="L0000001696"
                      color="green"
                      :showLoading="false"
                      @btnClicked="changeReplyEditMode(scope)"
                    />
                     삭제 
                    <y-btn
                      v-if="scope.row.regId === '0'"
                      title="L0000001495"
                      color="red"
                      :showLoading="false"
                      @btnClicked="deleteReply(scope)"
                    />
                     :showLoading="false" 버튼 로딩 없앰, 로딩 시 그리드 틀어지는 현상 없애기 위해 적용 
                  </div>
                </template>
              </el-table-column>
            </y-data-table> -->
            <!-- 댓글목록 -->
            <y-auigrid
              ref="yAuiGrid"
              :editable="true"
              :name="gridOptions.name"
              :headers="gridOptions.header"
              :btns="gridOptions.btns"
              :height="gridOptions.height"
              :label="this.$comm.getLangSpecInfoLabel('L0000004254')"
              :useExcelExport="false"
              :enableSorting="true"
              :showRowCheckColumn="true"
              :showGridSetSave="true"
              :useContextMenu="true"
              :enableRightDownFocus="true"
              :showGridCtrl="true"
              :softRemoveRowMode="false"
              :rowHeight="50"
              @cellClick="cellClickHandler"
              @cellEditEnd="cellEditEndHandler"
              @btnPopupClickedCallback="btnPopupClickedCallback"
              @saveRow="saveReply(scope)"
              @deleteRow="deleteReply(scope)"
              @changeRow="changeReplyEditMode(scope)"
            />
          </b-col>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>
<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
// import tinymce from 'vue-tinymce-editor';
import { VueEditor } from 'vue2-editor';
export default {
  name: 'bbs-detail',
  components: {
    // tinymce, // <- Important part
    VueEditor,
  },
  props: {
    popupParam: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      editable: false,
      disabled: false,
      updateMode: false,
      answerMode: false,
      replyMode: false,
      // 게시글
      bbs: {},
      reply: {},

      url: {
        insert: '',
        edit: '',
        delete: '',
        updateCnt: '',
        replyInsert: '',
        replyedit: '',
        replyDelete: '',
      },

      gridOptions: {
        header: [],
        data: [],
        btns: [],
        height: 350,
      },

      // 첨부파일 그룹
      attachFileGrp: {},
      taskClassNm: null,

      // 게시판 관리에서 설정한 댓글 가능 여부
      replyPosb: false,
      // 게시판 관리에서 설정한 답글 작성 여부
      answerPosb: false,
      // 게시판 관리에서 설정한 열람 권한 설정 여부
      readAuthPosb: false,
      // auigrid
      YAuiGrid: null,

      // 답글 버튼 라벨
      btnLabel: '',
    };
  },
  watch: {
    popupParam() {
      this.initModel();
    },
  },
  beforeMount() {
    window.addEventListener('resize', this.resizeGrid);
    this.initModel();
    this.setGridHeader();
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;
    this.init();
  },
  methods: {
    init() {
      this.resizeGrid();
      // this.initModel();
    },
    initModel() {
      this.replyPosb = this.popupParam.replyPosbYn === 'Y';
      this.answerPosb = this.popupParam.answerPosbYn === 'Y';
      if (this.popupParam.bbs.notiNo === 0) {
        this.bbs = {
          bbsNo: this.popupParam.bbs.bbsNo,
          notiNo: 0,
          notiTtl: '',
          notiCont: '',
          notierName: '',
          replyYn: 'N',
          searchCnt: '',
          useYn: 'Y',
          notiYn: 'N',
          notiBeginDt: null,
          notiEndDt: null,
          createUserId: this.$store.getters.token,
          createDt: null,
          updateUserId: this.$store.getters.token,
          updateDt: null,
          parentNotiNo: null, // 추후 답글 기능시 필요
          notiLevel: 0, // 게시물 순서 (상위 게시물 + 1)
          plantCd: '',
          lookYn: 'N', // 게시글 상위 고정 기능 같음
          lookFromDate: null,
          lookToDate: null,
          taskClassNm: null,
        };
        this.taskClassNm = this.popupParam.taskClassNm;
        this.updateMode = true;
        this.answerMode = false;
        this.disabled = false;
        this.setAttachFile();
      } else {
        this.bbs = this.popupParam.bbs;
        this.taskClassNm = this.popupParam.taskClassNm;
        this.updateMode = false;
        this.answerMode = false;
        this.disabled = true;
        // 첨부파일 설정
        this.setAttachFile();
        this.updateSearchCnt();
        this.$emit('callBack', { title: 'L0000000390' }); /* 게시글 상세 */
      }

      this.reply = {
        notiId: this.bbs.notiNo,
        replyNo: 0,
        wrierName: '',
        replyCont: '',
        useYn: 'Y',
        createUserId: this.$store.getters.token,
        createDt: null,
        updateUserId: this.$store.getters.token,
        updateDt: null,
      };

      this.url.insert = this.$format(
        transactionConfig.board.insert.url,
        this.bbs.bbsNo
      );
      this.url.edit = this.$format(
        transactionConfig.board.edit.url,
        this.bbs.bbsNo
      );
      this.url.updateCnt = this.$format(
        transactionConfig.board.updateCnt.url,
        this.bbs.bbsNo
      );
      this.url.delete = this.$format(
        transactionConfig.board.delete.url,
        this.bbs.bbsNo
      );
      this.url.replyInsert = this.$format(
        transactionConfig.board.replyInsert.url,
        this.reply.notiId
      );
      this.url.replyEdit = this.$format(
        transactionConfig.board.replyEdit.url,
        this.reply.notiId
      );
      this.url.replyDelete = this.$format(
        transactionConfig.board.replyDelete.url,
        this.reply.notiId
      );
      this.getReplyList();
      this.setAttachFile();

      if (
        this.bbs.createUserId === this.$store.getters.token ||
        this.$store.getters.token === 'system'
      ) {
        this.editable = this.$route.meta.editable;
      } else {
        this.editable = false;
      }
    },
    setGridHeader() {
      let mythis = this;
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000810'),
          dataField: 'replyCont',
          width: '50%',
          style: 'left-align',
          maxlength: 500,
          sortable: false,
        } /* 내용 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002355'),
          dataField: 'wrierName',
          width: '10%',
          sortable: false,
        } /* 작성자 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002352'),
          dataField: 'updateDt',
          width: '20%',
        } /* 작성일 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000005782'),
          dataField: '',
          width: '10%',

          renderer: {
            type: 'ButtonRenderer',
            labelText: mythis.btnLabel,
            onClick: (event) => {
              console.log('event', event);
              this.openMultiFileUpload(event);
            },
            visibleFunction: function (
              rowIndex,
              columnIndex,
              value,
              item,
              dataField
            ) {
              console.log('item', item);
              console.log('v', value);
              let headerInfo = {
                headerText: this.$comm.getLangSpecInfoLabel('L0000005782'),
                dataField: '',
                width: '10%',
              };
              if (item.replyNo > 0) {
                this.YAuiGrid.setColumnPropByDataField();
                mythis.btnLabel = '저장';
              } else {
                mythis.btnLabel = '수정';
              }
            },
          },
        } /* 저장/수정 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001495'),
          dataField: '',
          width: '10%',
          renderer: {
            type: 'ButtonRenderer',
            labelText: '삭제',
            onClick: (event) => {
              this.openMultiFileUpload(event);
            },
          },
        } /* 삭제 */,
      ];
      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000004253'),
          color: 'orange',
          btnClicked: 'btnPopupClickedCallback',
        }, // 댓글추가
      ];
    },
    // initModel 끝
    setAttachFile() {
      this.attachFileGrp = {
        taskClassNm: this.taskClassNm,
        taskKey: this.bbs.notiNo,
        createUserId: this.$store.getters.token,
        onlyDownload: this.disabled,
        showUploadBtn: false,
        disabled: this.disabled,
        editable:
          (this.editable && this.updateMode) ||
          (this.editable && this.answerMode),
        label: 'L0000003030' /* 파일업로드 */,
      };
    },

    // 답글
    changeAnswerMode() {
      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321' /* 확인 */,
        message: 'M0000000139', // '답글 작성을 하시겠습니까?',
        type: 'info', // success / info / warning / error
        // 확인 callback 함수
        confirmCallback: () => {
          let parentNotiNo = this.bbs.notiNo;
          let notiLevel = this.bbs.notiLevel;
          this.bbs.notiNo = 0;
          this.initModel();
          this.bbs.notiLevel = parseInt(notiLevel, 10) + 1;
          this.bbs.parentNotiNo = parentNotiNo;
          this.updateMode = false;
          this.answerMode = true;
          this.$emit('callBack', { title: 'L0000005422' }); /* 답글 작성 */
        },
      });
    },

    // 수정
    changeUpdateMode() {
      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321' /* 확인 */,
        message: 'M0000000060', // '수정하시겠습니까?',
        type: 'info', // success / info / warning / error
        // 확인 callback 함수
        confirmCallback: () => {
          this.disabled = false;
          this.updateMode = true;
          this.setAttachFile();
          this.$emit('callBack', { title: 'L0000005423' }); /* 게시물 수정 */
        },
      });
    },
    updateSearchCnt() {
      this.$http.url = this.url.updateCnt;
      this.$http.type = 'PUT';
      this.$http.param = this.bbs;
      this.$http.request();
    },
    btnSave() {
      this.$http.url = this.bbs.notiNo !== 0 ? this.url.edit : this.url.insert;
      this.$http.type = this.bbs.notiNo !== 0 ? 'PUT' : 'POST';
      this.$http.param = this.bbs;
      this.$http.request(
        (_result) => {
          // 신규 등록일 경우만 파일 키 삽입
          if (this.bbs.notiNo === 0) {
            this.bbs = _result.data;
            this.attachFileGrp.taskKey = this.bbs.notiNo;
            this.$refs.fileupload.submitUpload();
          } else {
            this.bbs = _result.data;
          }
          window.getApp.$emit('ALERT', {
            title: 'L0000003395' /* 안내 */,
            message: 'M0000000006', // '저장되었습니다.',
            type: 'success',
          });
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    btnDelete() {
      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321' /* 확인 */,
        message: 'M0000000012', // '삭제하시겠습니까?',
        type: 'info',
        // 확인 callback 함수
        confirmCallback: () => {
          this.$http.url = this.url.delete;
          this.$http.type = 'DELETE';
          this.$http.param = { data: this.bbs };
          this.$http.request(
            (_result) => {
              this.initModel({});
              window.getApp.$emit('ALERT', {
                title: 'L0000003395' /* 안내 */,
                message: 'M0000000007', // '삭제되었습니다.',
                type: 'success',
              });
              this.btnClose();
            },
            (_error) => {
              window.getApp.$emit('APP_REQUEST_ERROR', _error);
            }
          );
        },
        // 취소 callback 함수
        cancelCallback: () => {
          return;
        },
      });
    },

    btnClose() {
      // 댓글 작성 중 닫기 버튼 클릭 시  저장안한 작성중이던 댓글 행 한줄 삭제
      if (this.replyMode) {
        this.replyMode = false;
        this.gridOptions.data.splice(this.gridOptions.data.length - 1, 1);
      }
      // 부모창에 값 전달
      this.$emit('closePopup', { success: true });
    },

    validateState(_ref) {
      if (
        this.veeBag[_ref] &&
        (this.veeBag[_ref].dirty || this.veeBag[_ref].validated)
      ) {
        return !this.errors.has(_ref);
      }
      return null;
    },

    btnPopupClickedCallback() {
      console.log('1111', this.replyMode);
      const gridData = this.YAuiGrid.getGridData();
      console.log('gridData', gridData);
      if (!this.replyMode) {
        this.reply = {
          notiId: this.bbs.notiNo,
          replyNo: 0,
          wrierName: '',
          replyCont: '',
          useYn: 'Y',
          createUserId: this.$store.getters.token,
          createDt: null,
          updateUserId: this.$store.getters.token,
          updateDt: null,
          regId: '1',
          replyEditable: true,
          replyEditMode: 'save',
        };
        this.YAuiGrid.addRow(this.reply, 'last');
        this.replyMode = true;
      } else {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395' /* 안내 */,
          message: 'M0000000140', // '작성중인 댓글이 있습니다.',
          type: 'info',
        });
      }
    },

    getReplyList() {
      this.$http.url = this.$format(
        selectConfig.board.replylist.url,
        this.reply.notiId
      );
      this.$http.param = null;
      this.$http.type = 'get';
      this.$http.request(
        (_result) => {
          this.YAuiGrid.setGridData(this.$_.clone(_result.data));
          this.$_.forEach(_result.data, (_item) => {
            const hasAuth =
              _item.createUserId === this.$store.getters.token ||
              this.$store.getters.token === 'system';
            _item['regId'] = '0';
            _item['replyEditable'] = hasAuth;
            _item['replyEditMode'] = hasAuth ? 'edit' : 'none';
          });
        },
        (_error) => {
          window.getApp.$emit(
            'APP_REQUEST_ERROR',
            'L0000005408', // '작업 중 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.' +
            _error
          );
        }
      );
    },
    changeReplyEditMode(data) {
      data.row.replyEditMode = 'save';
    },
    saveReply(data) {
      this.$http.url =
        data.row.replyNo !== 0 ? this.url.replyEdit : this.url.replyInsert;
      this.$http.type = data.row.replyNo !== 0 ? 'PUT' : 'POST';
      this.$http.param = data.row;
      this.$http.request(
        (_result) => {
          this.reply = _result.data;
          data.row.regId = '0';
          data.row.replyEditMode = 'edit';
          this.reply.replyEditable = false;
          this.replyMode = false;
          this.initModel({});
          window.getApp.$emit('ALERT', {
            title: 'L0000003395' /* 안내 */,
            message: 'M0000000533', // '댓글이 저장되었습니다.',
            type: 'success',
          });
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    deleteReply(data) {
      this.$http.url = this.url.replyDelete;
      this.$http.type = 'DELETE';
      this.$http.param = { data: data.row };
      this.$http.request(
        (_result) => {
          this.initModel({});
          window.getApp.$emit('ALERT', {
            title: 'L0000003395' /* 안내 */,
            message: 'M0000000007', // '삭제되었습니다.',
            type: 'success',
          });
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
      this.gridOptions.data.splice(data.$index, 1);
    },
    resizeGrid() {
      let _height = window.innerHeight - 335;
      if (window.innerHeight < 500) {
        _height = 250;
      }

      this.YAuiGrid.resize(null, _height);
    },
    cellClickHandler(event) {},
    cellEditEndHandler(event) {},
  },
};
</script>
