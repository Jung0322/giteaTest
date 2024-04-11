<!--
  목적 : 검진결과 상세 - 검사항목
  Detail : 
  examples:
  -->
<template>
  <b-container fluid>
    <b-row class="mt-3">
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- 검진 항목 -->
            <y-label
              label="L0000000347"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
          </b-col>
        </b-row>
        <b-card>
          <b-row>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 항목종류 -->
              <y-select
                :width="8"
                :editable="editable"
                :comboItems="heaTestClassCdItems"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                type="save"
                name="heaTestClassCd"
                label="L0000003210"
                v-model="testItemResult.heaTestClassCd"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 항목 -->
              <y-select
                :width="8"
                :editable="editable"
                :comboItems="heaTestItemCdItems"
                itemText="heaTestItemNm"
                itemValue="heaTestItemCd"
                ui="bootstrap"
                type="save"
                name="heaTestItemCd"
                label="L0000003199"
                v-model="testItemResult.heaTestItemCd"
                v-validate="'required'"
                :state="validateState('heaTestItemCd')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 결과값 -->
              <y-text
                :width="8"
                :editable="editable"
                :maxlength="30"
                ui="bootstrap"
                name="charResult"
                label="L0000000408"
                v-model="testItemResult.charResult"
                v-validate="'required'"
                :state="validateState('charResult')"
              />
            </b-col>
          </b-row>
          <div class="float-right mt-3">
            <!-- 항목추가 -->
            <y-btn
              v-if="editable"
              :action-url="insertUrl"
              :param="testItemResult"
              :is-submit="isCreateSubmit"
              title="L0000003211"
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
              :param="deleteItemResultRows"
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
            항목 결과 목록 
          <y-data-table
            ref="dataTable"
            label="L0000000348"
            :rows="3"
            :headers="gridItemResultHeaderOptions"
            :items="gridItemResultData"
            v-model="gridItemResultSelectedRows"
            :popMode="true"
          >
            <el-table-column
              type="selection"
              slot="selection"
              width="55"
            ></el-table-column>
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
          :label="this.$comm.getLangSpecInfoLabel('L0000000348')"
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
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
export default {
  name: 'test-item-result',
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
      testItemResult: {
        heaCheckupPlanNo: 0,
        userId: '',
        heaCheckupOrgTestItemNo: 0,
        heaCheckupOrgNo: 2,
        heaCheckupOrgNm: '',
        heaTestClassCd: null,
        heaTestClassNm: '',
        heaTestItemCd: null,
        heaTestItemNm: '',
        year: '',
        heaCheckupTypeCd: 'A',
        heaCheckupTypeNm: '',
        unit: '',
        heaResultTypeCd: '',
        heaResultTypeNm: '',
        numResult: '',
        charResult: '',
        prev1YearResult: '',
        prev2YearResult: '',
        createUserId: '',
        updateUserId: '',
      },
      gridOptions: {
        name: 'testItemResultChecup',
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

      gridItemResultData: [],
      gridItemResultHeaderOptions: [],
      gridItemResultSelectedRows: [],
      deleteItemResultRows: [],

      heaTestClassCdItems: [],
      heaTestItemCdItems: [],

      insertUrl: '',
      deleteUrl: '',
      searchUrl: '',

      compResultDiag: null,
      compItemResult: null,
    };
  },
  computed: {},
  watch: {
    'testItemResult.heaTestClassCd': function (newValue, oldValue) {
      this.getHeaTestItemCdItems();
    },
    'testItemResult.heaTestItemCd': function (newValue, oldValue) {
      this.getTestItem();
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
    this.init();
  },
  /** methods **/
  methods: {
    /** 초기화 관련 함수 **/
    init() {
      this.editable = this.$route.meta.editable;

      this.testItemResult.heaCheckupPlanNo = this.popupParam.heaCheckupPlanNo;
      this.testItemResult.userId = this.popupParam.userId;
      // 선택항목 설정
      setTimeout(() => {
        this.getHeaTestClassCdItems();
      }, 200);

      // 그리드 헤더 설정
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003210'),
          dataField: 'heaTestClassNm',
          width: '20%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003210'),
          dataField: 'heaTestClassNm',
          style: 'left-align',
          width: '30%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002518'),
          dataField: 'prev1YearResult',
          style: 'left-align',
          width: '15%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002495'),
          dataField: 'prev2YearResult',
          style: 'left-align',
          width: '15%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000405'),
          dataField: 'charResult',
          style: 'left-align',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000870'),
          dataField: 'unit',
          style: 'left-align',
          width: '10%',
        },
      ];

      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001495'),
          color: 'red',
          btnClicked: 'btnCheckDelRow',
        },
      ];

      this.searchUrl = selectConfig.hea.testItemResult.list.url;
      this.insertUrl = transactionConfig.hea.testItemResult.insert.url;
      this.deleteUrl = transactionConfig.hea.testItemResult.multiDelete.url;

      this.getItemResultList();
    },
    /** /초기화 관련 함수 **/

    getItemResultList() {
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = this.testItemResult;
      this.$http.request(
        (_result) => {
          this.gridItemResultData = _result.data;
          this.YAuiGrid.setGridData(_result.data);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    getHeaTestClassCdItems() {
      this.$http.url = this.$format(
        selectConfig.codeMaster.getSelect.url,
        'HEA_TEST_CLASS'
      );
      this.$http.type = 'get';
      this.$http.request(
        (_result) => {
          _result.data.splice(0, 0, {
            code: null,
            codeNm: this.$comm.getLangSpecInfoLabel('L0000003394'),
          }); // 선택하세요
          this.heaTestClassCdItems = _result.data;
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    getHeaTestItemCdItems() {
      this.$http.url = selectConfig.hea.testItem.list.url;
      this.$http.type = 'get';
      this.$http.param = {
        heaTestClassCd: this.testItemResult.heaTestClassCd,
        useYn: 'Y',
      };
      this.$http.request(
        (_result) => {
          _result.data.splice(0, 0, {
            heaTestItemCd: null,
            heaTestItemNm: this.$comm.getLangSpecInfoLabel('L0000003394'), // 선택하세요
          });
          this.heaTestItemCdItems = _result.data;
          this.testItemResult.heaTestItemCd = null;
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    getTestItem() {
      this.$http.url = this.$format(
        selectConfig.hea.testItem.get.url,
        this.testItemResult.heaTestItemCd
      );
      this.$http.type = 'get';
      this.$http.request(
        (_result) => {
          this.testItemResult.heaResultTypeCd = _result.data.heaResultTypeCd;
          this.testItemResult.heaResultTypeNm = _result.data.heaResultTypeNm;
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },

    /** /Call API service **/
    btnCheckDelRow() {
      let checkingData = this.YAuiGrid.getCheckedRowItemsAll();
      if (checkingData.length > 0) {
        window.getApp.$emit('CONFIRM', {
          title: 'L0000003321', // '확인',
          message: 'M0000000012', // 삭제하시겠습니까?
          type: 'info',
          // 확인 callback 함수
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
                this.getItemResultList();
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
          },
        });
      } else {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // '안내',
          message: 'M0000001035', // 선택된 검진항목 결과가 없습니다. 목록 앞단에 선택박스를 확인하세요.
          type: 'warning',
        });
      }
    },
    /** validation checking(필요없으면 지워주세요) **/
    beforeDeleteSubmit() {
      if (this.gridItemResultSelectedRows.length > 0) {
        window.getApp.$emit('CONFIRM', {
          title: 'L0000003321', // '확인',
          message: 'M0000000012', // 삭제하시겠습니까?
          type: 'info',
          // 확인 callback 함수
          confirmCallback: () => {
            this.deleteItemResultRows = {
              data: Object.values(
                this.$_.clone(this.gridItemResultSelectedRows)
              ),
            };
            this.isDeleteSubmit = true;
          },
        });
      } else {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // '안내',
          message: 'M0000001035', // 선택된 검진항목 결과가 없습니다. 목록 앞단에 선택박스를 확인하세요.
          type: 'warning',
        });
      }
    },

    beforeCreateSubmit() {
      // 검사항목 데이터가 그리드에 있는지 확인
      var heaTestItemCds = this.$_.map(
        this.YAuiGrid.getGridData(),
        'heaTestItemCd'
      );
      if (
        this.$_.indexOf(heaTestItemCds, this.testItemResult.heaTestItemCd) > -1
      ) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // '안내',
          message: 'M0000000441', // 이미 같은 검사항목이 존재합니다.
          type: 'warning',
        });
        return;
      }
      if (this.testItemResult.heaResultTypeCd === 'N') {
        if (isNaN(this.testItemResult.charResult)) {
          window.getApp.$emit('ALERT', {
            title: 'L0000003395', // '안내',
            message: '수치형 항목종류는 숫자만 입력가능합니다.', // 수치형 항목종류는 숫자만 입력가능합니다.
            type: 'warning',
          });
          return;
        }
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
                this.testItemResult.createUserId = this.$store.getters.token;
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
    /** /validation checking **/

    /** Component Events, Callbacks (버튼 제외) **/

    /** /Component, Callbacks (버튼 제외) **/

    /** Button Event **/
    btnDeleteClickedCallback(_result) {
      this.isDeleteSubmit = false;
      this.getItemResultList();
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // 안내
        message: 'M0000000007', // '삭제되었습니다.',
        type: 'success',
      });
    },
    btnCreateClickedCallback(_result) {
      this.isCreateSubmit = false;
      this.getItemResultList();
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // '안내',
        message: 'M0000000006', // 저장되었습니다.
        type: 'success',
      });
    },
    /**
     * 버튼 에러 처리용 공통함수
     */
    btnClickedErrorCallback(_result) {
      this.isCreateSubmit = false;
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
