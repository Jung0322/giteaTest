<!--
  목적 : 등록/접수/조치결과 - 발생내용
  Detail : 발생내용
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <!-- 등록 -->
    <b-row>
      <b-col sm="12">
          <b-row>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
              <y-textarea
                :width="10"
                :maxlength="600"
                :required="true"
                :disabled="disabled"
                :editable="editable"
                ui="bootstrap"
                label="사고개요"
                name="contents"
                v-model="accidentDetail.contents"
                v-validate="'required'"
                :state="validateState('contents')"
              />
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
              <y-textarea
                :width="10"
                :maxlength="600"
                :disabled="disabled"
                :editable="editable"
                ui="bootstrap"
                label="사고원인"
                name="provReason"
                v-model="accidentDetail.provReason"
              />
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
              <y-textarea
                :width="10"
                :maxlength="600"
                :disabled="disabled"
                :editable="editable"
                ui="bootstrap"
                label="비상조치 내용 및 평가"
                name="bgnMeas"
                v-model="accidentDetail.bgnMeas"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-select
                :width="8"
                :comboItems="comboCauTypeItems"
                :disabled="disabled"
                :required="true"
                :editable="editable"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                label="원인유형"
                name="cauTypeCd"
                v-model="accidentDetail.cauTypeCd"
                v-validate="'required'"
                :state="validateState('cauTypeCd')"
              >
              </y-select>
              <!-- <y-radio
                :width="10"
                :comboItems="comboCauTypeItems"
                :required="true"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                label="원인유형"
                name="cauTypeCd"
                v-model="accidentDetail.cauTypeCd"
                v-validate="'required'"
                :state="validateState('contents')"
              /> -->
            </b-col>
            <b-col v-if="isEtc" sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-text
              :width="8"
              :maxlength="50"
              :disabled="disabled"
              :editable="editable"
              ui="bootstrap"
              label="원인유형 기타"
              name="cauTypeEtc"
              v-model="accidentDetail.cauTypeEtc"
              />
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
  name: 'y-accident-contents',
  props: {
    accidentDetail: { 
      type: Object,
      default: {
        safAccidentNo: 0,
        contents: '', // 사고발생내용
        provReason: '', // 추정원인
        cauTypeCd: null, // 원인유형코드
        cauTypeEtc: '', // 원인유형기타
        bgnMeas: '', // 초기대책
        accidentStepCd: '',
      },
    },
  },
  data () {
    return {
      tempCauTypeCd: '',
      comboCauTypeItems: [], // 원인유형
      searchUrl: '',
      isEtc: false,
      disabled: false,
      editable: true,
    }
  },
  watch: {
    'accidentDetail.safAccidentNo': function (newValue, oldValue) {
      this.getList();
    },
    'tempCauTypeCd': function (newValue, oldValue) {
      if (newValue === 'CAU13')
      {
        this.isEtc = true;
      }
      else
      {
        this.isEtc = false;
      }
    },
    'accidentDetail.cauTypeCd': function (newValue, oldValue) {
      this.tempCauTypeCd = this.$_.clone(this.accidentDetail.cauTypeCd);
      // if (newValue === 'CAU13')
      // {
      //   this.isEtc = true;
      // }
      // else
      // {
      //   this.isEtc = false;
      // }
    },
  },
  //* Vue lifecycle: created, mounted, destroyed, etc */
  beforeCreate () {
  },
  created () {
  },
  beforeMount () {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted () {
  },
  beforeDestroy () {
  },
  //* methods */
  methods: {
    init () {
      this.editable = this.$route.meta.editable;
      this.disabled = (this.accidentDetail.accidentStepCd === 'ACCS4');
      // Url Setting
      this.searchUrl = selectConfig.saf.accident.get.url;
      setTimeout(() => {
        this.tempCauTypeCd = this.$_.clone(this.accidentDetail.cauTypeCd);
      }, 300);

      this.getComboItems('SAF_CAU_TYPE'); // 원인유형
      // this.getList();
    },
    /**
     * 공통 마스터 정보 조회 (원인유형)
     * codeGroupCd : 마스터 테이블 codeGroupCd 정보
     */
    getComboItems (codeGroupCd) {
      this.$http.url = this.$format(selectConfig.codeMaster.getSelect.url, codeGroupCd);
      this.$http.type = 'GET';
      this.$http.request((_result) => {
        if (codeGroupCd === 'SAF_CAU_TYPE')
        {
          this.comboCauTypeItems = this.$_.clone(_result.data);
          this.comboCauTypeItems.splice(0, 0, { 'code': null, 'codeNm': '선택하세요' });
          // this.accidentDetail.cauTypeCd = this.accidentDetail.cauTypeCd ? this.accidentDetail.cauTypeCd : '';
        }
      }, (_error) => {
        window.getApp.$emit('APP_REQUEST_ERROR', _error);
      });
    },
    /** 안전점검결과 목록 조회 **/
    getList () {
      if (!this.accidentDetail.safAccidentNo) return;
      this.$http.url = this.$format(this.searchUrl, this.accidentDetail.safAccidentNo);
      this.$http.type = 'GET';
      this.$http.request((_result) => {
        setTimeout(() => {
          this.accidentDetail = this.$_.clone(_result.data);
          this.tempCauTypeCd = this.$_.clone(this.accidentDetail.cauTypeCd);
        }, 500);
      }, (_error) => {
        window.getApp.$emit('APP_REQUEST_ERROR', _error);
      });
    },
    /**
     * 필수입력값 유효성 검사
     */
    validateState (ref) {
      if (this.veeBag[ref] && (this.veeBag[ref].dirty || this.veeBag[ref].validated)) {
        return !this.errors.has(ref);
      }
      return null;
    },
    /** button 관련 이벤트 **/
    /** end button 관련 이벤트 **/
  }
};
</script>