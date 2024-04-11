<!--
  목적 : 법적 인허가 대상
  Detail : 법적 인허가 대상 화면
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
            <!-- 법적 인허가 대상 사전확인(각 항목 당 1개 이상 필수 체크) 공사(작업)내용이 아래의 작업을 포함하는지 반드시 확인하여 주시기 바랍니다. -->
            <y-label
              label="L0000001211"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
          </b-col>
        </b-row>
        <b-card>
          <b-row v-for="(OriginTarget, i) in OriginTargets" :key="i">
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              <y-label :label="OriginTarget.grpNm" :fieldable="true" />
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              <y-checkbox
                :width="12"
                :editable="editable"
                :disabled="constUpdateMod"
                :comboItems="OriginTarget.comboItems"
                itemText="itmNm"
                itemValue="itmCd"
                ui="bootstrap"
                :name="i + 'constLegalLcns'"
                v-model="OriginTarget.constLegalLcns"
              />
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
  /* attributes: name, components, props, data */
  name: 'const-safe-origin-target',
  props: {
    constUpdateMod: false,
    constSafe: {
      type: Object,
      default: {
        constNo: '',
        bizApprStepCd: '',
        constLegalLcns: [],
      },
    },
  },
  data() {
    return {
      editable: true,
      OriginTargets: [],
      searchUrl: '',
    };
  },
  watch: {
    OriginTargets: {
      handler: function(val, oldVal) {
        // 법적 인허가 대상 항목들이 있는 경우에만 담는다.
        if (this.OriginTargets && this.OriginTargets.length > 0) {
          // 새로 담기 위해 기존에 있던 데이터는 날린다.
          if (
            this.constSafe.constLegalLcns &&
            this.constSafe.constLegalLcns.length > 0
          ) {
            this.constSafe.constLegalLcns.splice(
              0,
              this.constSafe.constLegalLcns.length
            );
          }
          // OriginTargets안에 constLegalLcns 항목들을 구분코드와 항목코드로 집어넣는다.
          if (!this.constSafe.constLegalLcns) {
            this.constSafe.constLegalLcns = [];
          }
          this.$_.forEach(this.OriginTargets, target => {
            this.$_.forEach(target.constLegalLcns, legalLcn => {
              this.constSafe.constLegalLcns.splice(0, 0, {
                itmCd: legalLcn,
                grpCd: target.grpCd,
              });
            });
          });
        }
      },
      deep: true,
    },
    'constSafe.bizApprStepCd'() {
      if (this.constSafe.bizApprStepCd === 'BAPSA') this.editable = false;
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
      if (this.constSafe.bizApprStepCd === 'BAPSA') this.editable = false;
      // Url Setting
      this.searchUrl = selectConfig.saf.wkodMaster.getLegalLcns.url;

      this.getList();
    },
    getList() {
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = {
        constNo: this.constSafe.constNo,
      };
      this.$http.request(
        _result => {
          this.$_.forEach(_result.data, item => {
            item.constLegalLcns = this.$_.map(item.constLegalLcns, 'itmCd');
          });

          this.OriginTargets = this.$_.clone(_result.data);
        },
        _error => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    btnClickedErrorCallback(_result) {
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    /** end button 관련 이벤트 **/
  },
};
</script>

<style>
</style>
