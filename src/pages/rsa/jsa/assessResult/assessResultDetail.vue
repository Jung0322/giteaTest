<!--
  목적 : 위험성평가 결과 상세
  Detail : 위험성평가 결과 상세 화면
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <!-- 검색 -->
    <b-row ref="searchBox">
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- 위험성평가 상세정보 -->
            <y-label label="L0000002149" icon="user-edit" color-class="cutstom-title-color" />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 닫기 -->
              <y-btn v-if="!popupParam.apprFlag" title="L0000000881" @btnClicked="closePopup" />
            </div>
          </b-col>
        </b-row>
        <b-card header-class="default-card" body-class="default-body-card" class="py-0">
          <b-row>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 평가명 -->
              <y-text
                :width="8"
                :disabled="true"
                ui="bootstrap"
                label="L0000003081"
                name="assessNm"
                v-model="assess.assessNm"
              ></y-text>
            </b-col>
          </b-row>
        </b-card>
        <b-row class="mt-3"></b-row>
        <el-tabs type="border-card" v-model="tabIndex" @tab-click="tabClick">
          <el-tab-pane v-for="(item, i) in tabItems" :key="i" stretch class="default-tab-pane">
            <span slot="label">
              <i class="el-icon-date"></i>
              {{ $comm.getLangSpecInfoLabel(item.title) }}
            </span>
          </el-tab-pane>
          <keep-alive>
            <component :is="component" v-if="component" :disabled="disabled" :assess.sync="assess" />
          </keep-alive>
        </el-tabs>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
export default {
  /* attributes: name, components, props, data */
  name: 'assess-action-detail',
  props: {
    popupParam: {
      type: Object,
      default: {
        assessPlanNo: 0,
        deptCd: '',
        assessNm: '',
        processCd: '',
        assessStatus: '',
        assessTypeNo: 0,
        assessTypeNm: '',
        bizApprStepCd: '',
      },
    },
  },
  data() {
    return {
      assess: {
        assessPlanNo: 0,
        deptCd: '',
        assessNm: '',
        processCd: '',
        paneName: '',
        assessStatus: '',
        assessTypeNo: 0,
        assessTypeNm: '',
      },
      tabItems: [
        {
          title: 'L0000000120',
          url: './assessResultJSATab',
        }, // jsa
      ],
      tabIndex: 0,
      component: null,
      processCdItems: [],
      disabled: false,
    };
  },
  watch: {
    tabIndex() {
      this.loadComponent();
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
      this.assess = this.popupParam;

      // this.getProcessCdItems();
      if (
        !(
          this.popupParam.bizApprStepCd === 'BAPSG' ||
          this.popupParam.bizApprStepCd === 'BAPSD' ||
          !this.popupParam.bizApprStepCd
        )
      ) {
        this.disabled = true;
      }
    },
    loadComponent() {
      var path = this.tabItems[this.tabIndex].url;

      this.component = () => import(`${path}`);
    },
    closePopup() {
      this.$emit('closePopup', {});
    },
    tabClick(tab) {
      var nowDate = new Date();
      this.assess.paneName = tab.paneName + nowDate.getMilliseconds();
    },
    getProcessCdItems() {
      this.$http.url = selectConfig.rsa.riskAssessDept.list.url;
      this.$http.type = 'get';
      this.$http.param = {
        assessPlanNo: this.assess.assessPlanNo,
        processCd: this.assess.processCd,
      };
      this.$http.request(
        _result => {
          _result.data.splice(0, 0, { processCd: null, processNm: this.$comm.getLangSpecInfoLabel('L0000002519') }); // 전체
          this.processCdItems = _result.data;
        },
        _error => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    btnClickedErrorCallback(_result) {
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    /**
     * 사용자의 입력을 받는다.
     */
  },
};
</script>

<style>
</style>
