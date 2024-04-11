<!--
  목적 : 시스템 > 게시판관리 > 게시판생성관리 > 상세페이지
  Detail : 게시판마스터 CRUD
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <b-row class="mt-3" ref="detailBox">
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- 게시판 생성 -->
            <y-label
              label="L0000000398"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 저장 -->
              <y-btn
                v-if="editable"
                title="L0000002474"
                color="orange"
                @btnClicked="btnSaveBoardMaster"
              />
              <!-- 삭제 -->
              <y-btn
                v-if="editable && boardMaster.bbsNo"
                title="L0000001495"
                color="red"
                @btnClicked="btnDeleteBoardMaster"
              />
              <!-- 닫기 -->
              <y-btn title="L0000000881" @btnClicked="btnClosePopup" />
            </div>
          </b-col>
        </b-row>
        <b-card>
          <b-row>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              <!-- 게시판명 -->
              <y-text
                :width="10"
                ui="bootstrap"
                label="L0000000401"
                name="bbsNm"
                :required="true"
                v-model="boardMaster.bbsNm"
                :editable="editable"
                v-validate="'required'"
                :state="validateState('bbsNm')"
              />
            </b-col>
          </b-row>
          <b-row>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              <!-- 게시판소개 -->
              <y-textarea
                :width="10"
                ui="bootstrap"
                label="L0000000404"
                name="bbsInstr"
                v-model="boardMaster.bbsInstr"
                :editable="editable"
              ></y-textarea>
            </b-col>
          </b-row>
          <b-row>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 답글작성가능여부 -->
              <y-switch
                :width="8"
                :editable="editable"
                true-value="Y"
                false-value="N"
                ui="bootstrap"
                label="L0000000899"
                name="radioValue"
                selectText="L0000003644"
                unselectText="L0000003645"
                v-model="boardMaster.answerPosbYn"
              ></y-switch>
            </b-col>
            <!-- 댓글가능여부 -->
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <y-switch
                :width="8"
                :editable="editable"
                true-value="Y"
                false-value="N"
                ui="bootstrap"
                label="L0000000943"
                name="radioValue"
                selectText="L0000003644"
                unselectText="L0000003645"
                v-model="boardMaster.replyPosbYn"
              ></y-switch>
            </b-col>
          </b-row>
          <b-row>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 파일첨부가능여부 -->
              <y-switch
                :width="8"
                :editable="editable"
                true-value="Y"
                false-value="N"
                ui="bootstrap"
                label="L0000003033"
                name="radioValue"
                selectText="L0000003644"
                unselectText="L0000003645"
                v-model="fileYn"
              ></y-switch>
            </b-col>
          </b-row>
          <!-- 파일첨부가능여부가 Y 일때 표시됨 -->
          <b-row v-if="fileYn === 'Y'">
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 첨부파일구분 -->
              <y-select
                :width="8"
                :editable="editable"
                :comboItems="attachSettings"
                itemText="taskClassDesc"
                itemValue="taskClassNm"
                ui="bootstrap"
                label="L0000002848"
                name="taskClassNm"
                v-model="boardMaster.taskClassNm"
              ></y-select>
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
export default {
  name: 'boardMaster-detail',
  props: {
    popupParam: {
      type: Object,
      default: {
        taskClassNm: null,
      },
    },
  },
  data() {
    return {
      boardMaster: {},
      fileYn: 'N',
      url: {
        insert: transactionConfig.manage.board.insert.url,
        update: transactionConfig.manage.board.edit.url,
        delete: transactionConfig.manage.board.delete.url,
        code: selectConfig.manage.attachSetting.list.url,
      },
      attachSettings: [], // 첨부파일설정 코드 리스트
      editable: true,
    };
  },
  watch: {
    popupParam() {
      this.initModel(this.popupParam);
    },
    fileYn() {
      if (this.fileYn === 'N') {
        this.boardMaster.taskClassNm = null;
      }
    },
  },
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
  },
  mounted() {
    this.init();
  },
  /** methods **/
  methods: {
    init() {
      this.getAttachSettings();
      // this.boardMaster = this.popupParam; // 초기 모델 설정

      this.editable = this.$route.meta.editable;
      this.initModel(this.popupParam);
    },
    initModel(model) {
      if (!model.bbsNo) {
        this.boardMaster = {
          bbsNo: null,
          bbsNm: '',
          bbsInstr: '',
          tmplId: '',
          replyPosbYn: 'N',
          useYn: 'Y',
          readAuthPosbYn: 'N',
          answerPosbYn: 'N',
          taskClassNm: null,
          createUserId: '',
          updateUserId: '',
        };
        this.fileYn = 'N';
      } else {
        this.boardMaster = this.popupParam;
        this.fileYn =
          this.boardMaster.taskClassNm !== '' && this.boardMaster.taskClassNm
            ? 'Y'
            : 'N';
      }
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
    // 버튼 이벤트
    btnSaveBoardMaster() {
      this.$validator
        .validateAll()
        .then((_result) => {
          if (!_result) {
            window.getApp.$emit('ALERT', {
              title: 'L0000003395', // 안내
              message: 'M0000001070', // 게시판명을입력해주세요
              type: 'warning',
            });
          } else {
            // 등록자 및 수정자 세팅
            this.boardMaster.createUserId = this.$store.getters.token;
            this.boardMaster.updateUserId = this.$store.getters.token;

            this.$http.url = this.url.insert;
            this.$http.type = 'POST';
            this.$http.param = this.boardMaster;
            this.$http.request(
              (_result) => {
                this.boardMaster = _result.data;
                window.getApp.$emit('ALERT', {
                  title: 'L0000003395', // 안내
                  message: 'M0000000006', // 저장되었습니다.
                  type: 'success',
                });
              },
              (_error) => {
                window.getApp.$emit('APP_REQUEST_ERROR', _error);
              }
            );
          }
          return _result;
        })
        .catch(() => {
          return false;
        });
    },
    btnDeleteBoardMaster() {
      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321', // 확인
        message: 'M0000000012', // 삭제하시겠습니까?
        type: 'info', // success / info / warning / error
        // 확인 callback 함수
        confirmCallback: this.delBoardMaster,
      });
    },
    // 첨부파일 설정 코드 리스트 (콤보박스)
    getAttachSettings() {
      this.$http.url = this.url.code;
      this.$http.type = 'GET';
      this.$http.param = {
        taskClassNm: 'BOARD',
      };
      this.$http.request(
        (_result) => {
          this.attachSettings = this.$_.clone(_result.data);
          this.attachSettings.splice(0, 0, {
            taskClassNm: null,
            taskClassDesc: this.$comm.getLangSpecInfoLabel('L0000004578'), // 선택하세요
          });
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    delBoardMaster() {
      this.$http.url = this.url.delete;
      this.$http.type = 'DELETE';
      this.$http.param = {
        data: this.boardMaster,
      };
      this.$http.request(
        (_result) => {
          this.initModel({});
          window.getApp.$emit('ALERT', {
            title: 'L0000003395', // 안내
            message: 'M0000000007', // 삭제되었습니다.
            type: 'success',
          });
          this.btnClosePopup();
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    // 팝업 닫기
    btnClosePopup() {
      // 부모창에 값 전달
      this.$emit('closePopup', { success: true });
    },
  },
};
</script>
