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
              :param="inspectionHist"
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
          <!-- 지도점검 사항 -->
          <y-label
            label="L0000002757"
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
              <!-- 단속기관 -->
              <y-text
                :width="8"
                :editable="editable && !disabled"
                ui="bootstrap"
                label="L0000000868"
                name="regulator"
                v-model="inspectionHist.regulator"
                :required="true"
                v-validate="'required'"
                :state="validateState('regulator')"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 단속기관 점검자 -->
              <y-text
                :width="8"
                :editable="editable && !disabled"
                ui="bootstrap"
                label="L0000000869"
                name="regulatorWorker"
                v-model="inspectionHist.regulatorWorker"
                :required="true"
                v-validate="'required'"
                :state="validateState('regulatorWorker')"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 위반사항 -->
              <y-textarea
                :width="8"
                :editable="editable && !disabled"
                ui="bootstrap"
                label="L0000002109"
                name="violation"
                v-model="inspectionHist.violation"
              ></y-textarea>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 조치사항 -->
              <y-textarea
                :width="8"
                :editable="editable && !disabled"
                ui="bootstrap"
                label="L0000002679"
                name="action"
                v-model="inspectionHist.action"
              ></y-textarea>
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
  name: 'inspection-process',
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
      inspectionHist: {
        ewtrinspectionHistNo: 0,
        measureYmd: '',
        ewtrCleanFacNo: 0,
        regulator: '',
        regulatorWorker: '',
        violation: '',
        action: '',
        createUserId: null,
        createDt: null,
        updateUserId: null,
        updateDt: null,
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
    init() {
      this.editable = this.$route.meta.editable;
      this.detailUrl = selectConfig.env.water.facility.guided.get.url;

      this.editUrl = transactionConfig.env.water.facility.guided.edit.url;

      if (
        this.popupParam.paramMeasureYmd &&
        this.popupParam.paramEwtrCleanFacNo > 0 &&
        this.popupParam.paramDeptCd
      ) {
        this.getDetail();
      }
    },
    // inputValidate() {
    //   this.$validator.validateAll().then((result) => {
    //     if (!result) {
    //       window.getApp.$emit('inspection-invalid');
    //     } else window.getApp.$emit('inspection-valid');
    //   });
    // },
    getDetail() {
      this.$http.url = this.$format(
        this.detailUrl,
        this.popupParam.paramMeasureYmd,
        this.popupParam.paramEwtrCleanFacNo,
        this.popupParam.paramPlantCd,
        this.popupParam.paramDeptCd
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          if (_result.data !== '') {
            this.inspectionHist = this.$_.clone(_result.data);
          }
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
                this.inspectionHist.createUserId = this.$store.getters.token;
                this.inspectionHist.ewtrCleanFacNo =
                  this.popupParam.paramEwtrCleanFacNo;
                this.inspectionHist.measureYmd =
                  this.popupParam.paramMeasureYmd;
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
      this.isEdit = false;
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // '안내',
        message: 'M0000000006', // '저장되었습니다.',
        type: 'success',
      });
      this.getDetail();
      this.$emit('getDetail');
    },
    btnClickedErrorCallback(_result) {
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
    btnEditClickedCallback(_result) {
      this.isEdit = false;
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // '안내',
        message: 'M0000000006', // '저장되었습니다.',
        type: 'success',
      });
    },
    closePopup() {
      this.$emit('closePopup', {});
    },
  },
};
</script>
