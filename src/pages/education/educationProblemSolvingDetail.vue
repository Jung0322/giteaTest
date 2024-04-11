<!--
  목적 : 교육계획 등록-> 교육계획탭
  Detail : 교육 문제 상세화면
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <b-row>
      <!-- 교육 문제 상세 -->
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 다시풀기 -->
              <y-btn
                v-if="updateMode && this.status !== 'Y'"
                title="L0000004686"
                color="blue"
                @btnClicked="resetQuestion"
              />
              <!-- 풀이완료 -->
              <y-btn
                title="L0000003909"
                v-if="editable && !updateMode && !completeMode"
                :action-url="insertUrl"
                :param="examList"
                :is-submit="isCreateSubmit"
                color="orange"
                action-type="post"
                beforeSubmit="beforeCreateSubmit"
                @beforeCreateSubmit="beforeCreateSubmit"
                @btnClicked="btnCreateClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!-- 풀이완료 -->
              <y-btn
                title="L0000003909"
                v-if="editable && !updateMode && completeMode"
                :action-url="editUrl"
                :param="examList"
                :is-submit="isCreateSubmit"
                color="orange"
                action-type="post"
                beforeSubmit="beforeCreateSubmit"
                @beforeCreateSubmit="beforeCreateSubmit"
                @btnClicked="btnCreateClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!-- 닫기 -->
              <y-btn title="L0000000881" @btnClicked="closePopup" />
            </div>
          </b-col>
        </b-row>
      </b-col>
    </b-row>

    <b-row>
      <b-col
        sm="1"
        md="1"
        lg="1"
        xl="1"
        class="col-xxl-1"
        style="text-align: left"
      ></b-col>
      <b-col
        sm="11"
        md="11"
        lg="11"
        xl="11"
        class="col-xxl-3"
        style="text-align: left"
      >
        <y-label
          v-if="updateMode"
          :label="this.score"
          style="font-size: 18px; color: red"
        />
      </b-col>
    </b-row>

    <b-row v-for="(item, i) in examList" :key="i">
      <b-col
        sm="1"
        md="1"
        lg="1"
        xl="1"
        class="col-xxl-1"
        style="text-align: left"
      ></b-col>
      <b-col sm="11" md="11" lg="11" xl="11" class="col-xxl-3">
        <y-label
          :width="3"
          :editable="editable"
          :disabled="updateMode"
          ui="bootstrap"
          :label="i + 1 + '번.         ' + item.questionContents"
          name="questionContents"
        ></y-label>
      </b-col>
      <b-col sm="1" md="1" lg="1" xl="1" class="col-xxl-1"></b-col>
      <b-col sm="9" md="9" lg="9" xl="9" class="col-xxl-9">
        <y-checkbox
          name="answerItems"
          :width="9"
          :editable="editable"
          :disabled="updateMode"
          :comboItems="item.eduQuestionAnswers"
          itemText="answerContents"
          itemValue="eduQuestionAnsNo"
          :stacked="true"
          ui="bootstrap"
          v-model="item.selectData"
          fixwithclass="font-size:13px; padding-top:1.5em;  width:100%;"
        />
      </b-col>
    </b-row>
    <b-row>
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <div slot="buttonGroup" class="float-right mt-3"></div>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
export default {
  /* attributes: name, components, props, data */
  name: 'edu-plan-exam-add',
  props: {
    popupParam: {
      type: Object,
      default: {
        isResolve: false,
        questionList: [],
        userId: '',
      },
    },
  },
  data: () => ({
    eduMaster: {
      examNm: '',
      answer: [],
    },
    gridOptions: {
      header: [],
      data: [],
      height: 200,
      selectedItems: [],
    },
    isCreateSubmit: false,
    score: '',
    updateMode: false,
    completeMode: false,
    status: '',
    selectData: '',
    editable: true,
    examList: [],
    insertUrl: '',
    editUrl: '',
  }),
  //* Vue lifecycle: created, mounted, destroyed, etc */
  beforeCreate() {},
  created() {},
  update() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
  },
  mounted() {
    this.init();
  },
  beforeDestroy() {},
  //* methods */
  methods: {
    init() {
      this.getChkAnswer();
      this.getChkQuestionYmd();
      this.getScore();

      this.editable = this.$route.meta.editable;
      this.insertUrl =
        transactionConfig.saf.education.eduMasterMobile.insert.url;

      this.editUrl = transactionConfig.saf.education.eduMasterMobile.edit.url;
      this.getList();
    },

    getChkAnswer() {
      this.$http.url =
        selectConfig.saf.education.eduMaster.getMobileQuestionChk.url;
      this.$http.type = 'GET';
      this.$http.param = {
        safEduMstNo: this.popupParam.safEduMstNo,
        userId: this.popupParam.userId,
      };
      this.$http.request(
        (_result) => {
          this.status = _result.data;
        },
        (_error) => {
          window.getApp.$emit(
            'APP_REQUEST_ERROR',
            'M0000000016' // 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.
          );
        }
      );
    },

    getScore() {
      this.$http.url =
        selectConfig.saf.education.eduMaster.getMobileQuestionScore.url;
      this.$http.type = 'GET';
      this.$http.param = {
        safEduMstNo: this.popupParam.safEduMstNo,
        userId: this.popupParam.userId,
      };
      this.$http.request(
        (_result) => {
          this.score = '점수 : ' + _result.data;
        },
        (_error) => {
          window.getApp.$emit(
            'APP_REQUEST_ERROR',
            'M0000000016' // 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.
          );
        }
      );
    },

    getChkQuestionYmd() {
      this.$http.url = this.$http.url = this.$format(
        selectConfig.saf.education.eduMaster.getMobileQuestionYmdChk.url,
        this.popupParam.safEduMstNo
      );
      this.$http.type = 'GET';
      this.$http.param = {};
      this.$http.request(
        (_result) => {
          if (_result.data.checkCnt === 0) {
            window.getApp.$emit('ALERT', {
              title: 'L0000003395', // 안내
              message:
                '이 과정의 교육 기간은 ' + _result.data.ymd + '까지입니다.',
              type: 'warning', // success / info / warning / error
            });
            this.updateMode = true;
            this.completeMode = true;
            this.status = 'Y';
          }
        },
        (_error) => {
          window.getApp.$emit(
            'APP_REQUEST_ERROR',
            'M0000000016' // 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.
          );
        }
      );
    },
    getList() {
      this.$http.url =
        selectConfig.saf.education.eduMaster.getMobileQuestion.url;
      this.$http.param = {
        safEduMstNo: this.popupParam.safEduMstNo,
        userId: this.popupParam.userId,
      };
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          if (_result.data.length > 0) {
            this.$_.forEach(_result.data, (_item) => {
              _item['userId'] = this.popupParam.userId;
              if (_item.eduQuestionAnswers.length > 0) {
                this.examList.push(_item);
              }
            });
          } else {
            window.getApp.$emit('ALERT', {
              title: 'L0000003395',
              message: 'M0000001155', // 문제가 존재하지 않는 교육입니다
              type: 'warning', // success / info / warning / error
            });
            this.closePopup();
          }

          if (_result.data[0].selectData !== 0) {
            this.updateMode = true;
            if (this.popupParam.eduEvalPntSec !== '0') {
              this.completeMode = true;
              this.status = 'Y';
            }
          }
        },
        (_error) => {
          window.getApp.$emit(
            'APP_REQUEST_ERROR',
            'M0000000016' // 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.
          );
        }
      );
    },
    beforeCreateSubmit() {
      this.updateMode = false;
      this.$validator
        .validateAll()
        .then((_result) => {
          if (_result) {
            window.getApp.$emit('CONFIRM', {
              title: 'L0000003321',
              message: 'M0000001156', // 제출 하시겠습니까?
              type: 'info',
              confirmCallback: () => {
                this.$_.forEach(this.examList, (_item) => {
                  _item.updateUserId = this.$store.getters.token;
                });
                this.isCreateSubmit = true;
              },
            });
          } else if (!_result) {
            window.getApp.$emit('ALERT', {
              title: 'L0000003395',
              message: 'M0000000005', // 필수입력값을 입력해주세요.
              type: 'warning', // success / info / warning / error
            });
          }
        })
        .catch(() => {
          window.getApp.$emit(
            'APP_VALID_ERROR',
            'M0000000004' // 유효성 검사 중 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.
          );
        });
    },
    btnClickedErrorCallback(_result) {
      window.getApp.emit('APP_REQUEST_ERROR', _result);
    },

    btnCreateClickedCallback(_result) {
      if (this.status === 'N') {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: 'M0000001157', // 정상적으로 제출되었으며, 문제풀이가 완료되었습니다
          type: 'success',
        });
      } else {
        if (String(_result.data) === '100') {
          window.getApp.$emit('ALERT', {
            title: 'L0000003395',
            message:
              'M0000001158', // 정상적으로 제출되었으며, 100점 만점으로 문제풀이가 완료되었습니다
            type: 'success',
          });
        } else {
          window.getApp.$emit('ALERT', {
            title: 'L0000003395',
            message:
              'M0000001159', // 정상적으로 제출되었으며, 오답이 있어 문제 재풀이가 필요합니다
            type: 'success',
          });
        }
      }
      this.closePopup();
    },

    resetQuestion() {
      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321', // 확인
        message: 'M0000001160', // 문제를 다시 푸시겠습니까?
        type: 'info',
        confirmCallback: () => {
          this.$_.forEach(this.examList, (_item) => {
            _item.selectData = 0;
          });
          this.updateMode = false;
          this.completeMode = true;
        },
      });
    },

    // 닫기
    closePopup(data) {
      this.$emit('closePopup');
    },
  },
};
</script>
<style>
label[for='questionContents'] {
  text-align: left;
}
</style>
