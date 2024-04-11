<!--
  목적 : 시스템관리-공지사항
  작성자 : khk
  Detail : 시스템관리-공지사항 등록/수정
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <!-- <b-form-row> -->
    <b-row class="mt-3">
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- 공지사항 등록 -->
            <y-label
              label="L0000000555"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 미리보기 -->
              <y-btn title="L0000001061" color="black" @btnClicked="preview" />
              <!-- 저장 -->
              <y-btn
                v-if="editable && updateMode"
                :action-url="editUrl"
                :param="notice"
                :is-submit="isUpdateSubmit"
                title="L0000002474"
                color="orange"
                action-type="put"
                beforeSubmit="beforeUpdateSubmit"
                @beforeUpdateSubmit="beforeUpdateSubmit"
                @btnClicked="btnUpdateClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!-- 저장 -->
              <y-btn
                v-if="editable && !updateMode"
                :action-url="insertUrl"
                :param="notice"
                :is-submit="isCreateSubmit"
                title="L0000002474"
                color="orange"
                action-type="post"
                beforeSubmit="beforeCreateSubmit"
                @beforeCreateSubmit="beforeCreateSubmit"
                @btnClicked="btnCreateClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!-- 삭제 -->
              <y-btn
                v-if="editable && updateMode"
                title="L0000001495"
                color="red"
                @btnClicked="btnDeleteClicked"
              />
              <!-- 닫기 -->
              <y-btn title="L0000000881" @btnClicked="btnClosePopup" />
            </div>
          </b-col>
        </b-row>
        <b-card>
          <b-row>
            <b-col sm="8" md="8" lg="8" xl="8" class="col-xxl-8">
              <!-- 제목 -->
              <y-text
                :width="10"
                :editable="editable"
                :required="true"
                :maxlength="100"
                ui="bootstrap"
                label="L0000002616"
                name="noticeTitle"
                v-model="notice.noticeTitle"
                v-validate="'required'"
                :state="validateState('noticeTitle')"
              />
            </b-col>
            <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4"></b-col>
            <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
              <!-- 공지분류 -->
              <y-select
                :width="8"
                :editable="editable"
                :required="true"
                :comboItems="comNoticeClassCdItems"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                name="comNoticeClassCd"
                label="L0000000553"
                v-model="notice.comNoticeClassCd"
                v-validate="'required'"
                :state="validateState('comNoticeClassCd')"
              ></y-select>
            </b-col>
            <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
              <!-- 팝업공지여부 -->
              <y-switch
                :width="8"
                :editable="editable"
                true-value="Y"
                false-value="N"
                ui="bootstrap"
                label="L0000003039"
                name="popupYn"
                selectText="L0000003392"
                unselectText="L0000003393"
                v-model="notice.popupYn"
              />
            </b-col>
            <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
              <!-- 팝업공지기간 -->
              <y-datepicker
                :width="8"
                :editable="editable"
                :required="notice.popupYn === 'Y'"
                :disabled="notice.popupYn !== 'Y'"
                :range="true"
                label="L0000003038"
                name="popupStartEndYmd"
                v-model="popupStartEndYmd"
                v-validate="notice.popupYn === 'Y' ? 'required' : ''"
                :state="validateState('popupStartEndYmd')"
              />
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              <vue-editor
                id="d1"
                v-model="notice.noticeContents"
                required
              ></vue-editor>
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
        </b-card>
      </b-col>
    </b-row>
    <!-- </b-form-row> -->
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
// import tinymce from 'vue-tinymce-editor';
import { VueEditor } from 'vue2-editor';
export default {
  /** attributes: name, components, props, data **/
  name: 'notice',
  components: {
    // tinymce, // <- Important part
    VueEditor,
  },
  props: {
    popupParam: {
      type: Object,
      default: {
        noticeNo: 0,
      },
    },
  },
  data() {
    return {
      notice: {
        noticeNo: 0,
        comNoticeClassCd: null,
        comNoticeClassNm: '',
        noticeTitle: '',
        noticeContents: '<h1>Html For Editor</h1>',
        popupYn: 'N',
        popupStartYmd: null,
        popupEndYmd: null,
        popupPeriod: null,
        createUserId: '',
        createUserNm: '',
        createDt: '',
        updateUserId: '',
        updateUserNm: '',
        updateDt: '',
      },

      editable: false,
      updateMode: false,
      isCreateSubmit: false,
      isUpdateSubmit: false,

      popupStartEndYmd: [],
      comNoticeClassCdItems: [],

      insertUrl: '',
      editUrl: '',
      deleteUrl: '',
      searchUrl: '',
      detailUrl: '',

      textHtml: '테스트 내용',
    };
  },
  watch: {
    popupStartEndYmd: function (newValue, oldValue) {
      if (this.popupStartEndYmd.length === 2) {
        this.notice.popupStartYmd = this.popupStartEndYmd[0];
        this.notice.popupEndYmd = this.popupStartEndYmd[1];
        this.notice.popupPeriod =
          this.notice.popupStartYmd + '~' + this.notice.popupEndYmd;
      }
    },
  },
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {
    $('.mce-menubar').hide();
    $('#d1_ifr').css('height', '250px');
  },
  beforeDestory() {},
  methods: {
    init() {
      this.editable = this.$route.meta.editable;

      // 선택항목 설정
      this.$comm.getComboItems('COM_NOTICE_CLASS', false).then((_result) => {
        this.comNoticeClassCdItems = _result;
      });

      this.insertUrl = transactionConfig.manage.notice.insert.url;
      this.editUrl = transactionConfig.manage.notice.edit.url;
      this.deleteUrl = transactionConfig.manage.notice.delete.url;
      this.searchUrl = selectConfig.manage.notice.list.url;
      this.detailUrl = selectConfig.manage.notice.get.url;

      if (this.popupParam.noticeNo !== 0) {
        this.getDetail();
      }
    },
    getDetail() {
      this.$http.url = this.$format(this.detailUrl, this.popupParam.noticeNo);
      this.$http.type = 'get';
      this.$http.request(
        (_result) => {
          this.updateMode = true;
          this.notice = _result.data;
          this.popupStartEndYmd = [];
          if (this.notice.popupYn === 'Y') {
            this.popupStartEndYmd.push(this.notice.popupStartYmd);
            this.popupStartEndYmd.push(this.notice.popupEndYmd);
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    beforeUpdateSubmit() {
      this.$validator
        .validateAll()
        .then((_result) => {
          if (_result) {
            window.getApp.$emit('CONFIRM', {
              title: 'L0000003321', // 확인
              message: 'M0000000011', // 저장하시겠습니까?
              type: 'info',
              confirmCallback: () => {
                this.notice.updateUserId = this.$store.getters.token;
                this.isUpdateSubmit = true;
              },
            });
          }
        })
        .catch(() => {
          window.getApp.$emit(
            'APP_VALID_ERROR',
            'M0000000005' // 필수 입력값을 입력해 주세요.
          );
        });
    },
    beforeCreateSubmit() {
      this.notice.noticeNo = 0;
      this.updateMode = false;
      this.$validator
        .validateAll()
        .then((_result) => {
          if (_result) {
            window.getApp.$emit('CONFIRM', {
              title: 'L0000003321', // 확인
              message: 'M0000000011', // 저장 하시겠습니까?
              type: 'info',
              confirmCallback: () => {
                this.notice.createUserId = this.$store.getters.token;
                this.isCreateSubmit = true;
              },
            });
          }
        })
        .catch(() => {
          window.getApp.$emit(
            'APP_VALID_ERROR',
            'M0000000005' // 필수 입력값을 입력해 주세요.
          );
        });
    },
    btnUpdateClickedCallback(_result) {
      this.isUpdateSubmit = false;

      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // 안내
        message: 'M0000000006', // 저장되었습니다.
        type: 'success',
      });
      this.getDetail();
    },
    btnCreateClickedCallback(_result) {
      this.isCreateSubmit = false;
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // 안내
        message: 'M0000000006', // 저장되었습니다.
        type: 'success',
      });
      this.popupParam.noticeNo = _result.data;
      this.getDetail();
    },
    btnClickedErrorCallback(_result) {
      this.isCreateSubmit = false;
      this.isUpdateSubmit = false;
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },

    btnDeleteClicked() {
      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321', // 확인
        message: 'M0000000012', // 삭제하시겠습니까?
        type: 'info',
        confirmCallback: () => {
          this.$http.url = this.$format(
            this.deleteUrl,
            this.popupParam.noticeNo
          );
          this.$http.type = 'delete';
          this.$http.request(
            (_result) => {
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
      });
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
    btnClosePopup() {
      // 부모창에 값 전달
      this.$emit('closePopup', { success: true });
    },
    preview() {
      // let tempnoticeContents = this.$_.clone(this.notice.noticeContents).replaceAll('<pre class="ql-syntax" spellcheck="false">', '').replaceAll('</pre>', '').replaceAll('&lt;', '<').replaceAll('&gt;', '>')
      this.$notify({
        title: this.notice.noticeTitle,
        message: this.notice.noticeContents,
        dangerouslyUseHTMLString: true,
        customClass: 'y-el-notice_notification',
        duration: 20000,
        type: 'success',
      });
    },
  },
};
</script>
