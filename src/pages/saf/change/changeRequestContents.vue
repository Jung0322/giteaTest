<!--
  목적 : 변경관리 > 요청내용
  Detail : 요청내용
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
            <!-- 내용 -->
            <y-textarea
              :disabled="disabled"
              :width="10"
              :editable="editable"
              :maxlength="1300"
              :required="true"
              ui="bootstrap"
              label="L0000000810"
              name="chngContents"
              v-model="change.chngContents"
              v-validate="'required'"
              :state="validateState('chngContents')"
            />
          </b-col>
          <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
            <!-- 변경 후 기대효과 -->
            <y-checkbox
              :width="10"
              :editable="editable"
              :disabled="disabled"
              :comboItems="benefitItems"
              itemText="codeNm"
              itemValue="code"
              ui="bootstrap"
              name="chngEffectCds"
              label="L0000001218"
              v-model="change.chngEffectCds"
            />
          </b-col>
          <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
            <!-- 관련근거법령 -->
            <y-textarea
              :disabled="disabled"
              :width="10"
              :editable="editable"
              :maxlength="1300"
              ui="bootstrap"
              label="L0000000566"
              name="chngRefLaw"
              v-model="change.chngRefLaw"
            />
          </b-col>
          <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
            <!-- 팀장의견 -->
            <y-textarea
              :disabled="disabled"
              :width="10"
              :editable="editable"
              :maxlength="1300"
              ui="bootstrap"
              label="L0000003026"
              name="chkOpinion"
              v-model="change.chkOpinion"
            />
          </b-col>
        </b-row>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
export default {
  /* attributes: name, components, props, data */
  name: 'y-change-request-contents',
  props: {
    disabled: false,
    change: {
      type: Object,
      default: {
        safChngNo: 0,
        chngStepCd: '',
        chngContents: '',
        chkOpinion: '',
        chngEffectCds: [],
        changeEffects: [],
        chngRefLaw: '',
      },
    },
  },
  data: () => ({
    benefitItems: [],
    editable: false,
  }),
  watch: {
    'change.chngEffectCds': {
      handler: function(newValue, oldValue) {
        this.$_.forEach(this.change.chngEffectCds, item => {
          if (
            this.$_.findIndex(this.change.changeEffects, {
              chngEffectCd: item,
            }) === -1
          ) {
            this.change.changeEffects.splice(0, 0, {
              chngEffectCd: item,
            });
          }
        });
        let deleteData = this.$_.clone(this.change.changeEffects);
        this.$_.forEach(this.change.changeEffects, item => {
          if (
            this.$_.indexOf(this.change.chngEffectCds, item.chngEffectCd) === -1
          ) {
            deleteData = this.$_.reject(deleteData, {
              chngEffectCd: item.chngEffectCd,
            });
          }
        });
        this.change.changeEffects = deleteData;
      },
      deep: true,
    },
  },
  //* Vue lifecycle: created, mounted, destroyed, etc */
  beforeCreate() {},
  created() {},
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

      // 변경 후 기대효과
      this.$comm.getComboItems('SAF_CHNG_EFFECT').then(_result => {
        this.benefitItems = _result;
      });
    },
    /**
     * 필수입력값 유효성 검사
     */
    validateState(ref) {
      if (
        this.veeBag[ref] &&
        (this.veeBag[ref].dirty || this.veeBag[ref].validated)
      ) {
        return !this.errors.has(ref);
      }
      return null;
    },
    /** end button 관련 이벤트 **/
  },
};
</script>