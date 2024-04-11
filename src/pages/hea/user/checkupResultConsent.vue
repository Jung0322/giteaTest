<!--
  목적 : 결과활용 동의서(팝업)
  작성자 : kckim
  Detail :
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <b-row>
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <div slot="buttonGroup" class="float-right mb-1">
              <y-btn title="L0000000881" @btnClicked="closePopup" />
            </div>
            <y-label
              label="검진결과 활용 동의서"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
          </b-col>
        </b-row>
        <b-card>
          <b-row align="middle">
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              <y-textarea
                :width="12"
                :disabled="true"
                :rows="5"
                ui="bootstrap"
                name="consent"
                v-model="param.consent"
              >
              </y-textarea>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              <y-radio
                :width="12"
                :editable="editable"
                :comboItems="agreeYnItems"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                name="agreeYn"
                v-model="param.agreeYn"
                v-validate="'required'"
                :state="validateState('agreeYn')"
              />
            </b-col>
          </b-row>
          <div class="float-right mt-3">
            <y-btn
              v-if="editable && param.agreeYn === 'Y'"
              :param="param"
              :is-submit="false"
              title="예약등록"
              color="blue"
              action-type="POST"
              beforeSubmit="beforeAgree"
              @beforeAgree="beforeAgree"
              @btnClicked="btnInsertClickedCallback"
              @btnClickedErrorCallback="btnClickedErrorCallback"
            />
            <y-btn title="L0000000881" @btnClicked="closePopup" />
          </div>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {
  name: 'checkup-result-consent',
  props: {
    popupParam: {
      type: Object,
      default: {
        heaCheckupPlanNo: 0,
        heaCheckedOrgNo: 0,
      },
    },
  },
  data() {
    return {
      param: {
        consent: '',
        agreeYn: null,
      },
      baseWidth: 8,
      isAction: false,
      editable: true,
      agreeYnItems: [],
    };
  },
  /** Vue lifecycle: created, mounted, destroyed, etc **/
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
    this.getAgreeYnItems();
  },
  mounted() {},
  beforeDestory() {
    this.init();
  },
  /** methods **/
  methods: {
    /** 초기화 관련 함수 **/
    init() {
      this.param.consent += '제11조(검진자료의 수집·관리 및 통계의 작성)\n';
      this.param.consent +=
        '① 법 제18조에 따른 건강검진자료를 활용한 통계의 작성은 「통계법」을 준용한다.\n';
      this.param.consent +=
        '② 보건복지부장관 및 관계 중앙행정기관의 장은 법 제18조에 따라 개인정보가 포함된 건강검진자료를 활용하려는 경우에는 개인정보의 활용에 관하여 검진대상자의 동의를 받아야 한다.<개정 2010. 3. 15.>\n\n';
      this.param.consent += '제18조(검진자료의 활용) \n';
      this.param.consent +=
        '① 보건복지부장관 및 관계 중앙행정기관의 장은 국가건강검진을 통하여 얻은 검진자료를 다음 각 호의 목적으로 활용할 수 있다.  <개정 2010. 1. 18.>\n';
      this.param.consent += ' 1. 건강정책 수립 및 이를 위한 통계자료의 작성\n';
      this.param.consent += ' 2. 지역사회 건강증진사업\n';
      this.param.consent += ' 3. 만성질환 관리 및 지원 사업\n';
      this.param.consent +=
        ' 4. 국가건강검진 검사항목 및 검진주기의 평가 및 지침 개발\n';
      this.param.consent +=
        ' 5. 국가건강검진제도 개선 및 평가를 위한 연구사업\n';
      this.param.consent +=
        '② 보건복지부장관은 검진자료를 활용하여 건강상태 및 질병에 관한 통계를 생산하여 발표할 수 있다.  <개정 2010. 1. 18.>\n';
      this.param.consent +=
        '③ 제1항에 따라 검진자료를 활용함에 있어서 개인의 사생활의 비밀을 침해하지 아니하도록 정보를 보호하여야 한다.\n';
      this.param.consent +=
        '④ 검진자료의 수집, 관리 및 통계의 작성이나 개인정보 및 사생활 보호 등에 필요한 세부사항은 대통령령으로 정한다.';
    },
    getAgreeYnItems() {
      setTimeout(() => {
        this.agreeYnItems = [
          { code: 'Y', codeNm: '동의합니다' },
          { code: 'N', codeNm: '동의하지 않습니다' },
        ];
      }, 100);
    },
    closePopup() {
      this.$emit('closePopup', {});
    },
    beforeAgree() {
      this.checkValidation();
    },
    checkValidation() {
      this.$validator
        .validateAll()
        .then((_result) => {
          if (_result === true) {
            this.$emit('closePopup', {
              heaCheckupPlanNo: this.popupParam.heaCheckupPlanNo,
              heaCheckedOrgNo: this.popupParam.heaCheckedOrgNo,
            });
          }
            

          // TODO : 전역 성공 메시지 처리
          // 이벤트는 ./event.js 파일에 선언되어 있음
          if (!this.isAction) {
            window.getApp.emit(
              'APP_VALID_ERROR',
              '유효성 검사도중 에러가 발생하였습니다.'
            );
          }
        })
        .catch(() => {
          this.isAction = false;
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
    btnInsertClickedCallback(_result) {
      this.closePopup();
      this.$validator.reset();
      this.isAction = false;
    },
    btnClickedErrorCallback(_result) {
      window.getApp.emit('APP_REQUEST_ERROR', _result);
    },
  },
};
</script>
