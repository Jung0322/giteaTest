<!--
  목적 : 위험성평가 > 기준정보 > 작업 관리 > 작업단계 탭
  작성자 : kga
  Detail :
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <!-- 작업단계 상세 -->
    <b-row>
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <el-tag v-if="!jobStep.jobStepId" size="medium" type="info">
              <!-- 작업단계상세 정보가 등록되어야 유해위험요인을 등록할 수 있습니다. -->
              <i class="el-icon-info"></i> {{$comm.getLangSpecInfoLabel('L0000002386')}}
            </el-tag>
            <div slot="buttonGroup" class="float-right mb-1">
              <y-btn title="L0000000881" @btnClicked="btnClosePopup" />
            </div>
          </b-col>
        </b-row>
        <el-tabs type="border-card" v-model="tabIndex">
          <el-tab-pane v-for="(item, i) in tabItems" :key="i" stretch class="default-tab-pane">
            <span slot="label">
              <i class="el-icon-date"></i>
              {{ $comm.getLangSpecInfoLabel(item.title) }}
            </span>
          </el-tab-pane>
          <keep-alive>
            <component
              v-if="component"
              :is="component"
              :jobStepProp="jobStep"
              :jobStepId="jobStep.jobStepId"
              @addRiskTab="addRiskTab"
            />
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
  name: 'y-job-step-popup',
  props: {
    popupParam: {
      type: Object,
      default: {
        jobStep: null,
      },
    },
  },
  data() {
    return {
      tabItems: [],
      tabIndex: 0,
      component: null,
      jobStep: null,
    }
  },
  watch: {
    tabIndex() {
      this.loadComponent();
    },
  },
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  /** methods **/
  methods: {
    /** 초기화 관련 함수 **/
    init() {
      this.editable = this.$route.meta.editable;
      this.jobStep = this.popupParam.jobStep;
      if (this.jobStep.jobStepId) {
        this.tabItems = [
          { title: 'L0000002385', url: './jobStepDetail' }, // 작업단계상세
          { title: 'L0000002179', url: './jobRiskHazard' }, // 유해위험요인
        ];
      } else {
        this.tabItems = [
          { title: 'L0000002385', url: './jobStepDetail' }, // 작업단계상세
        ];
      }
    },
    addRiskTab(stepId) {
      this.jobStep.jobStepId = stepId
      this.tabItems = [
        { title: 'L0000002385', url: './jobStepDetail' }, // 작업단계상세
        { title: 'L0000002179', url: './jobRiskHazard' }, // 유해위험요인
      ]
    },
    // 탭
    loadComponent() {
      var path = this.tabItems[this.tabIndex].url;
      this.component = () => import(`${path}`);
    },
    // 닫기
    btnClosePopup() {
      // 부모창에 값 전달
      this.$emit('closePopup', { success: true });
    },
  },
};
</script>