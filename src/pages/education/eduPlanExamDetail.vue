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
              <!-- 풀이완료 -->
              <y-btn v-if="popupParam.isResolve" title="L0000003909" @btnClicked="saveExam" />
              <!-- 닫기 -->
              <y-btn title="L0000000881" @btnClicked="closePopup" />
            </div>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
    <b-row v-for="(item, i) in examList" :key="i">
      <b-col sm="1" md="1" lg="1" xl="1" class="col-xxl-1" style="text-align: left;"></b-col>
      <b-col sm="11" md="11" lg="11" xl="11" class="col-xxl-3">
       <!-- "(i + 1)+'번.         ' +item.questionContents" -->
        <y-label
          :width="3"
          :editable="editable"
          :disabled="true"
          ui="bootstrap"
          :label="$comm.getLangSpecInfoLabel('L0000003910', {s1:i+1, s2:item.questionContents})"
          name="questionContents"
        ></y-label>
      </b-col>

      <b-col sm="1" md="1" lg="1" xl="1" class="col-xxl-1"></b-col>

      <b-col sm="9" md="9" lg="9" xl="9" class="col-xxl-9">
        <y-checkbox
          name="answerItems"
          :width="9"
          :editable="editable"
          :comboItems="item.eduQuestionAnswers"
          itemText="answerContents"
          itemValue="eduQuestionAnsNo"
          :disabled="true"
          :stacked="true"
          ui="bootstrap"
          v-model="item.checkData"
          fixwithclass="font-size:11px; padding-top:1.5em;  width:100%;"
        />
      </b-col>
    </b-row>
    <b-row>
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <div slot="buttonGroup" class="float-right mt-3">
             <!--  풀이완료 -->
              <y-btn v-if="popupParam.isResolve" title="L0000003909" @btnClicked="saveExam" />
              <!-- 닫기 -->
              <y-btn title="L0000000881" @btnClicked="closePopup" />
            </div>
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
    checkData: '',
    editable: true,
    examList: [],
  }),
  //* Vue lifecycle: created, mounted, destroyed, etc */
  beforeCreate() {},
  created() {},
  update() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {},
  beforeDestroy() {},
  //* methods */
  methods: {
    init() {
      this.editable = this.$route.meta.editable;
      this.getList();
    },

    getList() {
      this.$http.url = selectConfig.saf.education.eduMaster.getAnswer.url;
      this.$http.type = 'POST';
      this.$http.param = this.popupParam.eduQuestionList;
      this.$http.request(
        _result => {
          this.$_.forEach(_result.data, _item => {
            if (_item.eduQuestionAnswers.length > 0) {
              this.examList.push(_item);
            }
          });
        },
        _error => {
          window.getApp.$emit(
            'APP_REQUEST_ERROR',
            'M0000000016' /* 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요. */
          );
        }
      );
    },

    // 전체 상세
    btnDetailClickedCallback() {},
    // 저장
    btnInsertClickedCallback() {},
    // 삭제
    btnDeleteClickedCallback() {},
    // 닫기
    closePopup(data) {
      this.$emit('closePopup');
    },
    // 풀이완료
    saveExam() {
    },
    getCurrentRow(data) {
    },
  },
};
</script>
<style>
label[for='questionContents'] {
  text-align: left;
}
</style>