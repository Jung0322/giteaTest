<!--
  목적 : 작업허가서 확인 항목
  Detail : 작업허가서 확인항목 Tab
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <!-- 등록 -->
    <b-row>
      <b-col sm="12">
        <b-card>
          <b-row>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              <b-row>
                <!-- 유해위험요인 -->
                <b-col sm="8">
                  <y-textarea
                    :width="9"
                    :maxlength="150"
                    :disabled="true"
                    :editable="editable"
                    label="L0000002179"
                    ui="bootstrap"
                    name="handleChemContent"
                    v-model="handleChemContent"
                  />
                </b-col>
                <b-col sm="4" v-if="!disabled&&editable">
                  <!-- 추가/삭제 -->
                  <y-btn title="L0000002893" @btnClicked="openPopup()" />
                </b-col>
              </b-row>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12 mb-3">
              <!-- 보호구 -->
              <y-checkbox
                :width="10"
                :comboItems="wkodSpeCdsItems"
                :disabled="disabled || authDuringAppr"
                :editable="editable"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                name="wkodSpeCdsItems"
                label="L0000001259"
                v-model="wkodMaster.wkodSpeCds"
              />
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              <!-- 보호구 기타 -->
              <y-text
                :width="10"
                :maxlength="30"
                :disabled="disabled || authDuringAppr"
                :editable="editable"
                ui="bootstrap"
                label="L0000001260"
                name="spmEtc"
                v-model="wkodMaster.spmEtc"
              ></y-text>
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
export default {
  /* attributes: name, components, props, data */
  name: 'confirmed-item',
  props: {
    authDuringAppr: {
      type: Boolean,
      default() {
        return false;
      }
    },
    disabled: {
      type: Boolean,
      default() {
        return false;
      }
    },
    wkodMaster: {
      type: Object,
      default: {
        wkodNo: '',
        wkodStepCd: '',
        bizApprStepCd: '',
        handleChemContent: '',
        spmEtc: '',
        wkodSpeCds: [],
        selectHandleChemContentRow: [],
      },
    },
  },
  data() {
    return {
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '80%',
        top: '50px',
        param: {},
        closeCallback: null,
      },
      handleChemContent: '',
      searchUrl: '',
      editable: true,
      wkodSpeCdsItems: [],
    };
  },
  watch: {
    handleChemContent: {
      handler: function(newValue, oldValue) {
        this.wkodMaster.handleChemContent = this.$_.clone(
          this.handleChemContent
        );
      },
      deep: true,
    },
    'wkodMaster.handleChemContent': {
      handler: function(newValue, oldValue) {
        this.handleChemContent = this.$_.clone(
          this.wkodMaster.handleChemContent
        );
      },
      deep: true,
    },
    'wkodMaster.bizApprStepCd'() {
      if (this.wkodMaster.bizApprStepCd === 'BAPSA') this.editable = false;
    },
  },
  //* Vue lifecycle: created, mounted, destroyed, etc */
  beforeCreate() {},
  created() {
    this.init();
  },
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
  },
  updated() {},
  mounted() {},
  beforeDestroy() {},
  //* methods */
  methods: {
    init() {
      this.editable = this.$route.meta.editable;
      if (this.wkodMaster.bizApprStepCd === 'BAPSA') this.editable = false;

      this.getWkodSpeCdsItems();
    },
    getList() {},
    getWkodSpeCdsItems() {
      // 판정 항목 조회
      this.$http.url = this.$format(
        selectConfig.codeMaster.getSelect.url,
        'SAF_WKOD_SPE'
      );
      this.$http.type = 'get';
      this.$http.request(
        _result => {
          this.wkodSpeCdsItems = _result.data;
        },
        _error => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    openPopup() {
      this.popupOptions.param = {
        wkodNo: this.wkodMaster.wkodNo,
        selectHandleChemContentRow: this.wkodMaster.selectHandleChemContentRow,
      };
      this.popupOptions.target = () => import(`${'@/pages/constSafe/wkod/hazardDialog.vue'}`);
      this.popupOptions.title = 'L0000002187'; // 유해위험요인검색
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closePopup;
    },
    closePopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;

      if (!data) return;
      var i = 0;
      this.wkodMaster.selectHandleChemContentRow = data;
      this.handleChemContent = '';
      this.wkodMaster.selectHandleChemContentRow.forEach(data => {
        if (i === 0) {
          i++;
          this.handleChemContent = data.riskHazardNm;
        } else {
          this.handleChemContent += ' ,' + data.riskHazardNm;
        }
      });
    },
    btnSearchClickedCallback(_result) {
      // this.getList();
      // window.getApp.$emit('APP_REQUEST_SUCCESS', '조회 버튼이 클릭되었습니다.');
    },
    btnClickedErrorCallback(_result) {
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
  },
};
</script>

<style>
</style>
