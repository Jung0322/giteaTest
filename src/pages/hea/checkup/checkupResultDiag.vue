<!--
  목적 : 검진결과 상세 - 판정
  Detail : 
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <b-row class="mt-3">
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- 판정 -->
            <y-label
              label="L0000003035"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
          </b-col>
        </b-row>
        <b-card>
          <b-row>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 판정 -->
              <y-select
                :width="8"
                :editable="editable"
                :comboItems="heaDiagnoseCdItems"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                type="save"
                name="heaDiagnoseCd"
                label="L0000003035"
                v-model="checkupResultDiag.heaDiagnoseCd"
                v-validate="'required'"
                :state="validateState('heaDiagnoseCd')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 유해인자 -->
              <y-select
                :width="8"
                :editable="editable"
                :comboItems="hazardCdItems"
                itemText="hazardNmKo"
                itemValue="hazardCd"
                ui="bootstrap"
                type="save"
                name="hazardCd"
                label="L0000002188"
                v-model="checkupResultDiag.hazardCd"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 질환종류 -->
              <y-select
                :width="8"
                :editable="editable"
                :comboItems="heaDiseaseClassCdItems"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                type="save"
                name="heaDiseaseClassCd"
                label="L0000002785"
                v-model="checkupResultDiag.heaDiseaseClassCd"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 질환 -->
              <y-select
                :width="8"
                :editable="editable"
                :comboItems="heaDiseaseCdItems"
                itemText="heaDiseaseNm"
                itemValue="heaDiseaseCd"
                ui="bootstrap"
                type="save"
                name="heaDiseaseCd"
                label="L0000002780"
                v-model="checkupResultDiag.heaDiseaseCd"
                v-validate="'required'"
                :state="validateState('heaDiseaseCd')"
              />
            </b-col>
          </b-row>
          <div class="float-right mt-3">
            <!-- 과거판정데이터 -->
            <!-- <y-btn
              v-if="editable"
              title="L0000000560"
              @btnClicked="btnHistoryClickedCallback"
              @btnClickedErrorCallback="btnClickedErrorCallback"
            /> -->
            <!-- 판정추가 -->
            <y-btn
              v-if="editable"
              :action-url="insertUrl"
              :param="checkupResultDiag"
              :is-submit="isCreateSubmit"
              title="L0000003037"
              color="blue"
              action-type="post"
              beforeSubmit="beforeCreateSubmit"
              @beforeCreateSubmit="beforeCreateSubmit"
              @btnClicked="btnCreateClickedCallback"
              @btnClickedErrorCallback="btnClickedErrorCallback"
            />
          </div>
        </b-card>
      </b-col>
    </b-row>

    <!-- <b-row class="mt-3">
      <b-col sm="12">
        <b-col sm="12" class="px-0">
          <div slot="buttonGroup" class="float-right mb-1">
             삭제 
            <y-btn
              v-if="editable"
              :action-url="deleteUrl"
              :param="deleteResultDiagRows"
              :is-submit="isDeleteSubmit"
              title="L0000001495"
              color="red"
              action-type="delete"
              beforeSubmit="beforeDeleteSubmit"
              @beforeDeleteSubmit="beforeDeleteSubmit"
              @btnClicked="btnDeleteClickedCallback"
              @btnClickedErrorCallback="btnClickedErrorCallback"
            />
          </div>
           판정목록 
          <y-data-table
            ref="dataTable"
            label="L0000003036"
            :rows="3"
            :headers="gridResultDiagHeaderOptions"
            :items="gridResultDiagData"
            v-model="gridResultDiagSelectedRows"
            :popMode="true"
          >
            <el-table-column type="selection" slot="selection" width="55"></el-table-column>
          </y-data-table>
        </b-col>
      </b-col>
    </b-row> -->
    <b-row class="grid-height grid-box">
      <b-col sm="12" class="h100p">
        <y-auigrid
          ref="yAuiGrid"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000003036')"
          :useExcelExport="false"
          :enableCellMerge="true"
          :enableSorting="true"
          :showGridSetSave="true"
          :useContextMenu="true"
          :enableRightDownFocus="true"
          :showGridCtrl="true"
          :showRowCheckColumn="true"
          @btnCheckDelRow="btnCheckDelRow"
        />
      </b-col>
    </b-row>
    <y-dialog :param="popupOptions"></y-dialog>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
export default {
  name: 'checkup-result-diag',
  props: {
    popupParam: {
      type: Object,
      default: {
        heaCheckupPlanNo: 0,
        userId: '',
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
      checkupResultDiag: {
        heaCheckupPlanNo: 0,
        userId: '',
        heaDiagnoseCd: null,
        heaDiagnoseNm: '',
        heaDiseaseClassCd: null,
        heaDiseaseClassNm: '',
        heaDiseaseCd: null,
        heaDiseaseNm: '',
        hazardCd: null,
        hazardNmKo: '',
        hazardNmEn: '',
        createUserId: '',
        updateUserId: '',
      },
      gridOptions: {
        name: 'checkypResultDiag',
        btns: [],
        header: [],
        data: [],
        height: '300',
        selectedValue: [],
      },
      YAuiGrid: null,
      editable: false,
      isCreateSubmit: false,
      isDeleteSubmit: false,

      gridResultDiagData: [],
      gridResultDiagHeaderOptions: [],
      gridResultDiagSelectedRows: [],
      deleteResultDiagRows: [],

      heaDiagnoseCdItems: [],
      heaDiseaseClassCdItems: [],
      heaDiseaseCdItems: [],
      hazardCdItems: [],
      deleteRows: [],

      insertUrl: '',
      deleteUrl: '',
      searchUrl: '',
    };
  },
  computed: {},
  watch: {
    'checkupResultDiag.heaDiseaseClassCd': function (newValue, oldValue) {
      this.getHeaDiseaseCdItems();
    },
  },
  /** Vue lifecycle: created, mounted, destroyed, etc **/
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;
  },
  beforeDestory() {
    // this.init();
  },
  /** methods **/
  methods: {
    /** 초기화 관련 함수 **/
    init() {
      this.editable = this.$route.meta.editable;

      this.checkupResultDiag.heaCheckupPlanNo =
        this.popupParam.heaCheckupPlanNo;
      this.checkupResultDiag.userId = this.popupParam.userId;

      // 선택항목 설정
      setTimeout(() => {
        this.getHeaDiagnoseCdItems();
        this.getHeaDiseaseClassCdItems();
        this.getHeaDiseaseCdItems();
        this.getHazardCdItems();
      }, 200);

      // 그리드 헤더 설정
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003035'),
          dataField: 'heaDiagnoseNm',
          width: '15%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002785'),
          dataField: 'heaDiseaseClassNm',
          width: '45%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002780'),
          dataField: 'heaDiseaseNm',
          width: '20%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002188'),
          dataField: 'hazardNmKo',
          width: '20%',
        },
      ];

      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001495'),
          color: 'red',
          btnClicked: 'btnCheckDelRow',
        },
      ];
      this.searchUrl = selectConfig.hea.checkupResultDiag.list.url;
      this.insertUrl = transactionConfig.hea.checkupResultDiag.insert.url;
      this.deleteUrl = transactionConfig.hea.checkupResultDiag.multiDelete.url;

      this.getResultDiag();
      this.getResultDiagList();
    },
    /** /초기화 관련 함수 **/
    getResultDiag() {
      this.$http.url = this.searchUrl;
      this.$http.type = 'get';
      this.$http.param = this.checkupResultDiag;
      this.$http.request(
        (_result) => {
          this.gridResultDiagData = _result.data;
          this.YAuiGrid.setGridData(_result.data);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    getResultDiagList() {
      this.$http.url = this.searchUrl;
      this.$http.type = 'get';
      this.$http.param = this.checkupResultDiag;
      this.$http.request(
        (_result) => {
          this.gridResultDiagData = _result.data;
          this.YAuiGrid.setGridData(_result.data);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    getHeaDiagnoseCdItems() {
      this.$http.url = this.$format(
        selectConfig.codeMaster.getSelect.url,
        'HEA_DIAGNOSE'
      );
      this.$http.type = 'get';
      this.$http.request(
        (_result) => {
          _result.data.splice(0, 0, {
            code: null,
            codeNm: this.$comm.getLangSpecInfoLabel('L0000003394'),
          }); // 선택하세요
          this.heaDiagnoseCdItems = _result.data;
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    getHeaDiseaseClassCdItems() {
      this.$http.url = this.$format(
        selectConfig.codeMaster.getSelect.url,
        'HEA_DISEASE_CLASS'
      );
      this.$http.type = 'get';
      this.$http.request(
        (_result) => {
          _result.data.splice(0, 0, {
            code: null,
            codeNm: this.$comm.getLangSpecInfoLabel('L0000003394'),
          }); // 선택하세요
          this.heaDiseaseClassCdItems = _result.data;
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    getHeaDiseaseCdItems() {
      this.$http.url = selectConfig.hea.disease.list.url;
      this.$http.type = 'get';
      this.$http.param = {
        heaDiseaseClassCd: this.checkupResultDiag.heaDiseaseClassCd,
      };
      this.$http.request(
        (_result) => {
          _result.data.splice(0, 0, {
            heaDiseaseCd: null,
            heaDiseaseNm: this.$comm.getLangSpecInfoLabel('L0000003394'), // 선택하세요
          });
          this.heaDiseaseCdItems = _result.data;
          this.checkupResultDiag.heaDiseaseCd = null;
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    getHazardCdItems() {
      this.$http.url = selectConfig.hea.hazard.list.url;
      this.$http.type = 'get';
      this.$http.request(
        (_result) => {
          _result.data.splice(0, 0, {
            hazardCd: null,
            hazardNmKo: this.$comm.getLangSpecInfoLabel('L0000003394'), // 선택하세요
          });
          this.hazardCdItems = _result.data;
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    btnCheckDelRow() {
      let checkingData = this.YAuiGrid.getCheckedRowItemsAll();
      if (checkingData.length > 0) {
        window.getApp.$emit('CONFIRM', {
          title: 'L0000003321', // '확인',
          message: 'M0000000012', // 삭제하시겠습니까?
          type: 'info',
          confirmCallback: () => {
            this.deleteRows = [];
            checkingData.forEach((item) => {
              this.deleteRows.push(item);
            });
            this.$http.url = this.deleteUrl;
            this.$http.type = 'DELETE';
            this.$http.param = {
              data: Object.values(this.$_.clone(this.deleteRows)),
            };
            this.$http.request(
              (_result) => {
                this.getResultDiagList();
                window.getApp.$emit('ALERT', {
                  title: 'L0000003395', // '안내',
                  message: 'M0000000007', // 삭제되었습니다.
                  type: 'success',
                });
              },
              (_error) => {
                window.getApp.$emit('APP_REQUEST_ERROR', _error);
              }
            );
            // this.deleteResultDiagRows = {
            //   data: Object.values(
            //     this.$_.clone(this.gridResultDiagSelectedRows)
            //   ),
            // };
            // this.isDeleteSubmit = true;
          },
        });
      } else {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // '안내',
          message: 'M0000000428', // 선택된 판정정보가 없습니다. 목록 앞단에 선택박스를 확인하세요.
          type: 'info',
        });
      }
    },
    /** validation checking(필요없으면 지워주세요) **/
    beforeDeleteSubmit() {
      if (this.gridResultDiagSelectedRows.length > 0) {
        window.getApp.$emit('CONFIRM', {
          title: 'L0000003321', // '확인',
          message: 'M0000000012', // 삭제하시겠습니까?
          type: 'info',
          confirmCallback: () => {
            this.deleteResultDiagRows = {
              data: Object.values(
                this.$_.clone(this.gridResultDiagSelectedRows)
              ),
            };
            this.isDeleteSubmit = true;
          },
        });
      } else {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // '안내',
          message: 'M0000000428', // 선택된 판정정보가 없습니다. 목록 앞단에 선택박스를 확인하세요.
          type: 'info',
        });
      }
    },

    beforeCreateSubmit() {
      // (판정, 질환) 데이터가 그리드에 있는지 확인
      var userHeaDiagnoseCds = this.$_.partition(this.YAuiGrid.getGridData(), {
        heaDiagnoseCd: this.checkupResultDiag.heaDiagnoseCd,
      })[0];
      var heaDiseaseCds = this.$_.map(userHeaDiagnoseCds, 'heaDiseaseCd');
      if (
        this.$_.indexOf(heaDiseaseCds, this.checkupResultDiag.heaDiseaseCd) > -1
      ) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // '안내',
          message: 'M0000000429', // 이미 같은 판정에 질환이 존재합니다.
          type: 'warning', // success / info / warning / error
        });
        return;
      }

      this.$validator
        .validateAll()
        .then((_result) => {
          if (_result) {
            window.getApp.$emit('CONFIRM', {
              title: 'L0000003321', // '확인',
              message: 'M0000000011', // 저장하시겠습니까?
              type: 'info',
              // 확인 callback 함수
              confirmCallback: () => {
                this.checkupResultDiag.heaCheckupPlanNo =
                  this.popupParam.heaCheckupPlanNo;
                this.checkupResultDiag.userId = this.popupParam.userId;
                this.checkupResultDiag.createUserId = this.$store.getters.token;
                this.checkupResultDiag.updateUserId = this.$store.getters.token;
                this.isCreateSubmit = true;
              },
            });
          } else {
            window.getApp.$emit('ALERT', {
              title: 'L0000003395', // '안내',
              message: 'M0000000005', // '필수 입력값을 입력해 주세요.',
              type: 'warning',
            });
          }
        })
        .catch(() => {
          this.isCreateSubmit = false;
          window.getApp.$emit(
            'APP_VALID_ERROR',
            'M0000000881' // 유효성 검사도중 에러가 발생하였습니다.
          );
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
    closePopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
    },
    /** /validation checking **/

    /** Component Events, Callbacks (버튼 제외) **/

    /** /Component, Callbacks (버튼 제외) **/

    /** Button Event **/
    btnDeleteClickedCallback(_result) {
      this.isDeleteSubmit = false;
      this.getResultDiagList();
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // '안내',
        message: 'M0000000007', // 삭제되었습니다.
        type: 'success',
      });
    },
    btnCreateClickedCallback(_result) {
      this.isCreateSubmit = false;
      this.getResultDiagList();
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // '안내',
        message: 'M0000000006', // 저장되었습니다.
        type: 'success',
      });
    },
    btnHistoryClickedCallback(_result) {
      this.popupOptions.param = {
        heaCheckupPlanNo: this.checkupResultDiag.heaCheckupPlanNo,
        userId: this.checkupResultDiag.userId,
      };
      this.popupOptions.target = () =>
        import(`${'./diagnoseResultHistory.vue'}`);
      this.popupOptions.title = 'L0000000560'; // 과거판정데이터
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closePopup;
    },
    /**
     * 버튼 에러 처리용 공통함수
     */
    btnClickedErrorCallback(_result) {
      this.isCreateSubmit = false;
      this.isDeleteSubmit = false;
      window.getApp.$emit(
        'APP_REQUEST_ERROR',
        'M0000000016' // 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.
      );
    },
    /** /Button Event **/

    /** 기타 function **/

    /** /기타 function **/
  },
};
</script>
