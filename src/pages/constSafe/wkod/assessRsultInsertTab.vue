<!--
  목적 : 작업허가서 항목 관리
  Detail : 작업허가서 항목 등록/수정화면
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
          <b-col sm="12">
            <!-- JSA 위험성평가 결과 -->
            <y-label
              label="L0000000121"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
          </b-col>
        </b-row>
        <b-card>
          <b-row>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              <b-row>
                <b-col sm="10" md="10" lg="10" xl="10" class="col-xxl-10">
                  <!-- 작업위험성평가 -->
                  <y-text
                    :width="10"
                    :disabled="true"
                    ui="bootstrap"
                    label="L0000002408"
                    name="assessNm"
                    v-model="assessInfo.assessNm"
                  ></y-text>
                </b-col>
                <b-col sm="2" md="2" lg="2" xl="2" class="col-xxl-2 px-2">
                  <small v-if="!disabled && editable" class="px-2">
                    <!-- 평가조회 -->
                    <el-button type="primary" @click="openDialogPage('S')">{{
                      $comm.getLangSpecInfoLabel('L0000003096')
                    }}</el-button>
                  </small>
                  <small class="px-2">
                    <!-- 상세보기 -->
                    <el-button
                      type="primary"
                      style="background-color: gray"
                      @click="openDialogPage('D')"
                      >{{
                        $comm.getLangSpecInfoLabel('L0000001531')
                      }}</el-button
                    >
                  </small>
                </b-col>
              </b-row>
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>
    <y-dialog :param="popupOptions"></y-dialog>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
export default {
  /* attributes: name, components, props, data */
  name: 'assess-rsult-insert-tab',
  props: {
    disabled: {
      type: Boolean,
      default() {
        return false;
      },
    },
    wkodMaster: {
      type: Object,
      default: {
        assessPlanNo: '',
        assessNm: '',
        wkodStepCd: '',
      },
    },
  },
  data() {
    return {
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '90%',
        top: '10px',
        param: {},
        closeCallback: null,
      },
      assessInfo: {
        assessPlanNo: '',
        assessNm: '',
      },
      popupFlag: '',
      editable: true,
    };
  },
  watch: {},
  //* Vue lifecycle: created, mounted, destroyed, etc */
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
  },
  updated() {},
  mounted() {
    this.init();
  },
  beforeDestroy() {},
  //* methods */
  methods: {
    init() {
      this.editable = this.$route.meta.editable;

      this.assessInfo.assessPlanNo = this.$_.clone(
        this.wkodMaster.assessPlanNo
      );
      this.assessInfo.assessNm = this.$_.clone(this.wkodMaster.assessNm);
    },
    openDialogPage(flag) {
      this.popupFlag = flag;
      if (flag === 'D') {
        if (
          this.wkodMaster.assessPlanNo === 0 ||
          !this.wkodMaster.assessPlanNo
        ) {
          return;
        }
        this.popupOptions.param = {
          assessPlanNo: this.wkodMaster.assessPlanNo,
          assessNm: this.wkodMaster.assessNm,
          totalDivision: 'PROCESS',
        };
        this.popupOptions.target = () =>
          import(`${'@/pages/rsa/jsa/assessTotal/assessTotalJSADialog.vue'}`);
        this.popupOptions.title = 'L0000003050'; // 평가결과집계 상세
      } else {
        this.popupOptions.target = () =>
          import(`${'./assessResultDialog.vue'}`);
        this.popupOptions.title = 'L0000002148'; // 위험성평가 상세
      }

      this.popupOptions.top = '10px';
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closePopup;
    },
    closePopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      if (this.popupFlag !== 'D') {
        if (data !== '') {
          this.wkodMaster.assessPlanNo = data.assessPlanNo;
          this.wkodMaster.assessNm = data.assessNm;
        }
        this.assessInfo.assessNm = this.$_.clone(this.wkodMaster.assessNm);
      }
    },
  },
};
</script>

<style></style>
