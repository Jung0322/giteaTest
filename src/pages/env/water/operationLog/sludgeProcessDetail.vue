<!--
  목적 : 운영일지 기본정보
  작성자 : etg
  Detail : 운영일지 기본정보 상세,등록,수정
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <!-- 등록 -->

    <b-row class="mt-3" ref="insertBox">
      <b-col sm="12">
        <b-col sm="12" class="px-0">
          <div slot="buttonGroup" class="float-right mb-1">
            <!-- 저장 -->
            <y-btn
              :action-url="editUrl"
              :param="sludgeProcess"
              :is-submit="isEdit"
              title="L0000002474"
              color="orange"
              action-type="PUT"
              beforeSubmit="beforeEdit"
              @beforeEdit="beforeEdit"
              @btnClicked="btnUpdateClickedCallback"
              @btnClickedErrorCallback="btnClickedErrorCallback"
            />
            <!-- 닫기 -->
            <y-btn title="L0000000881" @btnClicked="closePopup" />
          </div>
          <!-- 슬러지 처리시설 -->
          <y-label
            label="L0000001728"
            icon="user-edit"
            color-class="cutstom-title-color"
          />
        </b-col>
      </b-col>
    </b-row>

    <b-row ref="insertBox">
      <b-col sm="12">
        <b-card>
          <b-row>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 슬러지 발생량(kg) -->
              <y-number
                :width="8"
                :editable="editable && !disabled"
                ui="bootstrap"
                label="L0000001725"
                name="amtSludgeGen"
                :maxlength="9"
                v-model="sludgeProcess.amtSludgeGen"
                :required="true"
                v-validate="'required'"
                :state="validateState('amtSludgeGen')"
              ></y-number>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 슬러지 처리량(kg) -->
              <y-number
                :width="8"
                :editable="editable && !disabled"
                ui="bootstrap"
                label="L0000001727"
                :maxlength="9"
                name="amtSludgeTx"
                v-model="sludgeProcess.amtSludgeTx"
                :required="true"
                v-validate="'required'"
                :state="validateState('amtSludgeTx')"
              ></y-number>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 슬러지 보관량(kg) -->
              <y-number
                :width="8"
                :editable="editable && !disabled"
                ui="bootstrap"
                label="L0000001726"
                :maxlength="9"
                name="amtSludgeSto"
                v-model="sludgeProcess.amtSludgeSto"
                :required="true"
                v-validate="'required'"
                :state="validateState('amtSludgeSto')"
              ></y-number>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 함수율(%) -->
              <y-number
                :width="8"
                :editable="editable && !disabled"
                ui="bootstrap"
                label="L0000003172"
                :maxlength="9"
                name="sludgeMc"
                v-model="sludgeProcess.sludgeMc"
                :required="true"
                v-validate="'required'"
                :state="validateState('sludgeMc')"
              ></y-number>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 보관장소 -->
              <y-text
                :width="8"
                :editable="editable && !disabled"
                ui="bootstrap"
                label="L0000001248"
                name="sludgeStoPo"
                :maxlength="50"
                v-model="sludgeProcess.sludgeStoPo"
                :required="true"
                v-validate="'required'"
                :state="validateState('sludgeStoPo')"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 위탁처리업소 -->
              <y-text
                :width="8"
                :editable="editable && !disabled"
                ui="bootstrap"
                label="L0000002112"
                name="sludgeTxPo"
                :maxlength="50"
                v-model="sludgeProcess.sludgeTxPo"
                :required="true"
                v-validate="'required'"
                :state="validateState('sludgeTxPo')"
              ></y-text>
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
  name: 'sludge-process',
  props: {
    popupParam: {
      paramMeasureYmd: '',
      paramEwtrCleanFacNo: 0,
      paramPlantCd: '',
      paramDeptCd: '',
    },
  },
  data() {
    return {
      sludgeProcess: {
        sludgeTxPo: '',
        amtSludgeGen: 0,
        amtSludgeTx: 0,
        sludgeMc: 0,
        measureYmd: null,
        ewtrCleanFacNo: null,
        amtSludgeSto: '',
        sludgeStoPo: '',
      },
      gridOptions: {
        header: [],
        data: [],
        height: 300,
      },
      detailUrl: '',
      editUrl: '',
      isSaveDisable: true,
      editable: true,
      isEdit: false,
      isUpdate: false,
    };
  },
  computed: {},
  watch: {},
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
    /** 초기화 관련 함수 **/
    init() {
      this.editable = this.$route.meta.editable;
      this.detailUrl = selectConfig.env.water.operationLog.dailyReport.get.url;

      this.editUrl =
        transactionConfig.env.water.operationLog.sludgeProcess.edit.url;

      if (
        this.popupParam.paramMeasureYmd &&
        this.popupParam.paramEwtrCleanFacNo > 0 &&
        this.popupParam.paramDeptCd
      ) {
        this.getDetail();
      }
    },
    inputValidate() {
      this.$validator.validateAll().then((result) => {
        if (result) {
          window.getApp.$emit('sludge-invalid');
        } else window.getApp.$emit('sludge-valid');
      });
    },
    getDetail() {
      this.$http.url = this.detailUrl;
      this.$http.param = {
        plantCd: !this.popupParam.paramPlantCd
          ? ''
          : this.popupParam.paramPlantCd,
        measureYmd: this.popupParam.paramMeasureYmd,
        ewtrCleanFacNo: this.popupParam.paramEwtrCleanFacNo,
        deptCd: this.popupParam.paramDeptCd,
      };

      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.sludgeProcess = this.$_.clone(_result.data);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    beforeEdit() {
      this.$validator
        .validateAll()
        .then((_result) => {
          if (_result) {
            window.getApp.$emit('CONFIRM', {
              title: 'L0000003321', // '확인',
              message: 'M0000000011', // '저장하시겠습니까?',
              type: 'info',
              confirmCallback: () => {
                this.sludgeProcess.updateUserId = this.$store.getters.token;
                this.sludgeProcess.createUserId = this.$store.getters.token;
                this.sludgeProcess.ewtrCleanFacNo =
                  this.popupParam.paramEwtrCleanFacNo;
                this.sludgeProcess.measureYmd = this.popupParam.paramMeasureYmd;

                this.isEdit = true;
              },
            });
          } else if (!_result) {
            window.getApp.$emit('ALERT', {
              title: 'L0000003395', // '안내',
              message: 'M0000000005', // '필수 입력값을 입력해 주세요.',
              type: 'warning', // success / info / warning / error
            });
          }
        })
        .catch(() => {
          window.getApp.$emit(
            'APP_VALID_ERROR',
            'M0000000004' // '유효성 검사 중 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.'
          );
        });
    },
    btnUpdateClickedCallback(_result) {
      this.isUpdate = false;
      this.isEdit = false;
      if (this.isSaveSludgeProcess) {
        this.$emit('callbackSaveOperationLog', { isSaveSludgeProcess: true });
      } else {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // '안내',
          message: 'M0000000006', // '저장되었습니다.',
          type: 'success',
        });
      }
      this.getDetail();
      this.$emit('getDetail');
    },
    btnClickedErrorCallback(_result) {
      this.isUpdate = false;
      this.isEdit = false;
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    validateState(ref) {
      if (
        this.veeBag[ref] &&
        (this.veeBag[ref].dirty || this.veeBag[ref].validated)
      ) {
        return !this.errors.has(ref);
      }
      return null;
    },
    closePopup() {
      this.$emit('closePopup', {});
    },
  },
};
</script>
