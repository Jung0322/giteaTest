<!--
  목적 : 평가계획수립 - 대상노드
  Detail : 평가계획에서 선택된 평가계획별 대상노드 리스트를 조회한다.
  *
  examples:
  *
  -->
<template>
  <div>
    <b-row ref="editBox">
      <b-col sm="12">
        <b-row class="mt-3">
          <b-col sm="12">
            <b-row>
              <b-col sm="12">
                <!-- 가동전점검결과 -->
                <y-label
                  label="L0000003988"
                  icon="user-edit"
                  color-class="cutstom-title-color"
                />
                <div slot="buttonGroup" class="float-right mb-1">
                  <el-tag v-if="noPlanYn === 'Y' && !popupMode" type="danger">
                    <y-label
                      label="개선요청은 점검유형별 저장 결과 저장 후에 가능합니다."
                    ></y-label>
                  </el-tag>
                  <el-dropdown
                    v-if="
                      editable &&
                      safCheckTypeCd !== 'SPC04' &&
                      isComplete &&
                      !popupMode
                    "
                    trigger="click"
                    @command="handleCommand1"
                  >
                    <div>
                      <el-button type="info" slot="title"
                        >{{ reportName + ' 출력' }}
                        <i class="el-icon-arrow-down el-icon--right"></i
                      ></el-button>
                    </div>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item command="excel">EXCEL</el-dropdown-item>
                      <el-dropdown-item command="pdf">PDF</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                  <el-dropdown
                    v-if="
                      editable &&
                      safCheckTypeCd !== 'SPC04' &&
                      isComplete &&
                      !popupMode
                    "
                    trigger="click"
                    @command="handleCommand2"
                  >
                    <div>
                      <el-button type="info" slot="title"
                        >{{ '가동전점검 보고서 출력' }}
                        <i class="el-icon-arrow-down el-icon--right"></i
                      ></el-button>
                    </div>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item command="excel">EXCEL</el-dropdown-item>
                      <el-dropdown-item command="pdf">PDF</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                  <!-- 점검유형별 저장 -->
                  <y-btn
                    v-if="editable && !isComplete && isAdd2 && !popupMode"
                    title="L0000004086"
                    color="orange"
                    @btnClicked="beforeSubEdit"
                    @btnClickedErrorCallback="btnClickedErrorCallback"
                  />
                </div>
              </b-col>
            </b-row>
            <b-card>
              <b-row>
                <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
                  <!-- 점검유형 -->
                  <y-select
                    :width="8"
                    :comboItems="comboCheckTypeItems"
                    :required="true"
                    :editable="editable && !isDisabled"
                    :disabled="isDisabled || typeDisabled || popupMode"
                    itemText="codeNm"
                    itemValue="code"
                    ui="bootstrap"
                    label="L0000004068"
                    name="safCheckTypeCd"
                    v-model="safCheckTypeCd"
                  ></y-select>
                </b-col>
                <!-- 점검수행부서 -->
                <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
                  <y-tree-dept
                    :required="true"
                    :editable="editable && !isComplete"
                    :disabled="popupMode"
                    type="search"
                    label="L0000004852"
                    name="pDeptCd"
                    v-model="pDeptCd"
                  />
                </b-col>
                <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
                  <!-- 점검일 -->
                  <y-datepicker
                    :width="8"
                    :required="true"
                    :editable="editable && !isComplete && !!safCheckTypeCd"
                    :disabled="popupMode"
                    true-value="Y"
                    false-value="N"
                    label="L0000002570"
                    ui="bootstrap"
                    name="chkSchYmd"
                    v-model="chkSchYmd"
                  />
                </b-col>
                <!-- 점검수행자 -->
                <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
                  <y-text
                    :width="8"
                    :required="true"
                    :editable="editable && !isComplete"
                    :disabled="true"
                    rowClass
                    ui="bootstrap"
                    label="L0000004853"
                    name="chkUserNm"
                    v-model="chkUserNm"
                    :appendIcon="
                      safCheckTypeCd
                        ? [{ icon: 'search', callbackName: 'searchUser' }]
                        : null
                    "
                    @searchUser="btnSearchUserClicked"
                  />
                </b-col>
                <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
                  <!-- 점검완료여부 -->
                  <y-select
                    :width="8"
                    :required="true"
                    :disabled="isComplete || popupMode"
                    :comboItems="chkEndYnItems"
                    itemText="codeNm"
                    itemValue="code"
                    ui="bootstrap"
                    label="L0000002568"
                    name="chkEndYn"
                    v-model="chkEndYn"
                  ></y-select>
                </b-col>
                <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
                  <!-- 점검결과요약 -->
                  <y-textarea
                    :width="10"
                    :required="true"
                    :rows="2"
                    :disabled="isComplete || popupMode"
                    :maxlength="500"
                    ui="bootstrap"
                    type="search"
                    label="L0000002538"
                    name="chkResult"
                    v-model="chkResult"
                  ></y-textarea>
                </b-col>
              </b-row>
              <!-- <b-col sm="12" class="px-0">
                <div slot="buttonGroup" class="float-right mb-1">
                  대상 전체선택 
                   <y-btn
                    v-if="editable && !disabled && isAdd2 && isAll"
                    title="L0000004143"
                    color="orange"
                    @btnClicked="allClicked('T')"
                  /> 
                   비대상 전체선택 
                   <y-btn
                    v-if="editable && !disabled && isAdd2 && !isAll"
                    title="L0000004144"
                    color="orange"
                    @btnClicked="allClicked('F')"
                  /> 
                </div>
                 "점검설비별 점검항목"
                <y-data-table
                  ref="dataTable"
                  :height="chkItemResultGridOptions.height"
                  :headers="chkItemResultGridOptions.header"
                  :items="chkItemResultGridOptions.data"
                  v-model="chkItemResultGridOptions.selectValue"
                  :useRownum="false"
                  :use-paging="true"
                  :editable="editable && !isComplete"
                  label="L0000004084"
                  :popMode="true"
                  @tableLinkClicked="tableLinkClicked"
                >
                </y-data-table>
              </b-col> -->
              <b-col sm="12">
                <y-auigrid
                  ref="yAuiGrid"
                  :editable="editable && !isComplete"
                  :name="chkItemResultGridOptions.name"
                  :headers="chkItemResultGridOptions.header"
                  :btns="chkItemResultGridOptions.btns"
                  :height="chkItemResultGridOptions.height"
                  :label="this.$comm.getLangSpecInfoLabel('L0000004084')"
                  :useExcelExport="false"
                  :enableSorting="true"
                  :showGridSetSave="true"
                  :useContextMenu="true"
                  :enableRightDownFocus="true"
                  :showGridCtrl="true"
                  :softRemoveRowMode="false"
                  @cellClick="cellClickHandler"
                />
              </b-col>
              <!-- <b-col sm="12" class="px-0">
                <div slot="buttonGroup" class="float-right mb-1 mt-2">
               추가 
                  <y-btn
                    v-if="editable && !isComplete && safCheckTypeCd"
                    color="blue"
                    title="L0000002892"
                    @btnClicked="openPopup"
                  />
                   제외 
                  <y-btn
                    v-if="editable && !isComplete && isAdd"
                    color="red"
                    title="L0000002620"
                    @btnClicked="btnDeleteFacilityClickedCallback"
                  />
                </div>
                 점검유형별 설비 목록 
                <y-data-table
                  ref="dataTable"
                  :height="gridOptions.height"
                  :headers="gridOptions.header"
                  :items="gridOptions.data"
                  :editable="editable && !isComplete"
                  :useRownum="false"
                  v-model="selectValue"
                  label="L0000004338"
                  :popMode="true"
                >
                  <el-table-column
                    v-if="!isComplete"
                    type="selection"
                    slot="selection"
                    align="center"
                    width="55"
                  ></el-table-column>
                </y-data-table>
              </b-col> -->
              <b-col sm="12">
                <y-auigrid
                  ref="auiGrid"
                  :editable="editable && !isComplete"
                  :name="gridOptions.name"
                  :headers="gridOptions.header"
                  :btns="gridOptions.btns"
                  :height="gridOptions.height"
                  :label="this.$comm.getLangSpecInfoLabel('L0000004338')"
                  :useExcelExport="false"
                  :enableSorting="true"
                  :showGridSetSave="true"
                  :showRowCheckColumn="true"
                  :useContextMenu="true"
                  :enableRightDownFocus="true"
                  :showGridCtrl="true"
                  :softRemoveRowMode="false"
                  @btnAddRow="btnAddRow"
                  @btnDelRow="btnDelRow"
                />
              </b-col>
            </b-card>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
    <y-dialog :param="popupOptions"></y-dialog>
  </div>
</template>

<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
export default {
  /* attributes: name, components, props, data */
  name: 'insp-bef-oper-result-info-item',
  props: {
    popupMode: false,
    infoItemProps: {
      type: Object,
      default: function () {
        return {
          safCheckTypeCd: '',
          safFacilityCd: '',
          chkUserNm: '',
          chkSchYmd: '',
          plantCd: '',
          pDeptCd: '',
          chkResult: '',
          chkEndYn: 'N',
          safFacilChkNo: 0,
          typeInfoList: null,
          forEachFacilityList: [],
        };
      },
    },
    isComplete: {
      type: Boolean,
      default: function () {
        return false;
      },
    },
    research: {
      type: Boolean,
      default: function () {
        return false;
      },
    },
    /**
     * 무계획 결과등록 여부
     */
    noPlanYn: {
      type: String,
      default: 'Y',
    },
  },
  data: () => ({
    editable: false,
    gridOptions: {
      name: 'inspBefOperResultInfoItem',
      btns: [],
      header: [],
      data: [],
      height: '180',
    },
    chkItemResultGridOptions: {
      name: 'inspBefOperResultInfoItemChk',
      header: [],
      data: [],
      selectValue: [],
      height: '400',
    },
    YAuiGrid: null,
    AuiGrid: null,
    popupOptions: {
      target: null,
      title: '',
      visible: false,
      width: '85%',
      top: '50px',
      param: {},
      closeCallback: null,
    },
    saveUrl: '',
    isSave: false,
    searchUrl: '',
    chkEndYnItems: [],
    comboCheckTypeItems: [], // 점검종류
    comboCheckYearItems: [],
    comboYNChkItems: [],
    selectValue: [],
    actionType: 'POST',
    isAll: true,
    safCheckTypeCd: '',
    safCheckTypeNm: '',
    chkResult: '',
    chkEndYn: '',
    chkUserId: [],
    chkUserNm: '',
    chkSchYmd: '',
    pDeptCd: '',
    typeDisabled: false,
    count: 0,
    name: '',
  }),
  computed: {
    isAdd2() {
      return (
        this.chkItemResultGridOptions.data.length > 0 && this.safCheckTypeCd
      );
    },
    isAdd() {
      return this.gridOptions.data.length > 0;
    },
    reportName() {
      this.name = '';
      if (this.safCheckTypeCd === 'SPC01') this.name = '공장 가동전점검';
      else if (this.safCheckTypeCd === 'SPC02') this.name = '고정기기류';
      else this.name = '회전기기류';
      return this.name;
    },
    /**
     * 비활성화 여부
     */
    isDisabled() {
      return (
        this.noPlanYn !== 'Y' || (this.noPlanYn === 'Y' && this.isComplete)
      );
    },
  },
  watch: {
    safCheckTypeCd: {
      handler: function (newValue, oldValue) {
        if (this.safCheckTypeCd) {
          this.count = 0;
          this.getData();
        } else {
          this.chkItemResultGridOptions.data = [];
        }
      },
    },
    infoItemProps: {
      handler: function (newValue, oldValue) {
        if (this.infoItemProps.safCheckTypeCd) {
          this.safCheckTypeCd = this.infoItemProps.safCheckTypeCd;
          this.chkUserNm = this.infoItemProps.chkUserNm;
          this.chkSchYmd = this.infoItemProps.chkSchYmd;
          this.pDeptCd = this.infoItemProps.pDeptCd;
          this.chkEndYn = this.infoItemProps.chkEndYn;
          this.chkResult = this.infoItemProps.chkResult;
          this.AuiGrid.setGridData(this.infoItemProps.forEachFacilityList);
          setTimeout(() => {
            this.getData();
          }, 200);
          this.typeDisabled = true;
        } else {
          this.safCheckTypeCd = null;
          this.chkUserNm = '';
          this.chkSchYmd = '';
          this.pDeptCd = '';
          this.chkEndYn = null;
          this.chkResult = '';
          this.chkItemResultGridOptions.data = [];
          this.gridOptions.data = [];
          this.typeDisabled = false;
        }
        this.$comm
          .getComboItems('SAF_PREOPERATION_CHECK', false)
          .then((_result) => {
            if (this.infoItemProps.typeInfoList) {
              this.$_.forEach(this.infoItemProps.typeInfoList, (item) => {
                if (item.safCheckTypeCd !== this.safCheckTypeCd) {
                  const findIndex = this.$_.findIndex(_result, {
                    code: item.safCheckTypeCd,
                  });
                  if (findIndex !== -1) {
                    _result.splice(findIndex, 1);
                  }
                }
              });
            }
            this.comboCheckTypeItems = _result;
          });
      },
    },
    isComplete: {
      handler: function (newValue, oldValue) {
        this.setHeader();
      },
    },
  },
  //* Vue lifecycle: created, mounted, destroyed, etc */
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;
    this.AuiGrid = this.$refs.auiGrid;
  },
  beforeDestroy() {},
  //* methods */
  methods: {
    init() {
      this.editable = this.$route.meta.editable;
      // Url Setting
      this.subInsertUrl = transactionConfig.saf.befInspPlan.insert.sub.url;
      this.searchUrl = selectConfig.saf.befInspResult.items.result.url;

      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003725'),
          dataField: 'facilityMgrNum',
          width: '20%',
          editable: false,
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001597'),
          dataField: 'safFacilityTypeNm',
          width: '20%',
          editable: false,
          style: 'left-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001618'),
          dataField: 'safFacilityCd',
          width: '20%',
          editable: false,
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001596'),
          dataField: 'facilityNm',
          width: '20%',
          editable: false,
          style: 'left-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002549'),
          dataField: 'deptNm',
          width: '20%',
          editable: false,
        },
      ];
      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000002892'),
          color: 'blue',
          btnClicked: 'btnAddRow',
          visible: this.editable && !this.isComplete && !this.popupMode,
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000002620'),
          color: 'red',
          btnClicked: 'btnDelRow',
          visible: this.editable && !this.isComplete && !this.popupMode,
        },
      ];
      this.chkEndYnItems.push({
        code: null,
        codeNm: this.$comm.getLangSpecInfoLabel('L0000003394'),
      });
      this.chkEndYnItems.push({
        code: 'Y',
        codeNm: this.$comm.getLangSpecInfoLabel('L0000002039'),
      });
      this.chkEndYnItems.push({
        code: 'N',
        codeNm: this.$comm.getLangSpecInfoLabel('L0000003563'),
      });

      this.comboYNChkItems.push({
        code: 'Y',
        codeNm: 'Yes',
      });
      this.comboYNChkItems.push({
        code: 'N',
        codeNm: 'No',
      });
      this.comboYNChkItems.push({
        code: 'A',
        codeNm: 'N/A',
      });
      this.$comm
        .getComboItems('SAF_PREOPERATION_CHECK', false)
        .then((_result) => {
          if (this.infoItemProps && this.infoItemProps.typeInfoList) {
            this.$_.forEach(this.infoItemProps.typeInfoList, (item) => {
              const findIndex = this.$_.findIndex(_result, { code: item });
              if (findIndex !== -1) {
                _result.splice(findIndex, 1);
              }
            });
          }
          this.comboCheckTypeItems = _result;
        });

      // 그리드 헤더 설정
      this.$comm.getComboItems('SAF_PREOPERATION_YEAR').then((_result) => {
        this.comboCheckYearItems = _result;
        this.setHeader();
      });
    },
    setHeader() {
      this.chkItemResultGridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002584'),
          dataField: 'safFacilityCheckItemNo',
          width: '30%',
          editable: false,
          style: 'left-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004081'),
          dataField: 'chkYmd',
          width: '15%',
          editable: false,
          renderer: {
            type: 'DropDownListRenderer',
            listFunction: (rowIndex, columnIndex, item, dataField) => {
              return this.comboCheckYearItems;
            },
            keyField: 'code', // key 에 해당되는 필드명
            valueField: 'codeNm', // value 에 해당되는 필드명
            // disabledFunction: () => {
            //   return this.checkDisabled;
            // },
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002536'),
          dataField: 'chkResult',
          width: '15%',
          editable: false,
          renderer: {
            type: 'DropDownListRenderer',
            listFunction: (rowIndex, columnIndex, item, dataField) => {
              return this.comboYNChkItems;
            },
            keyField: 'code', // key 에 해당되는 필드명
            valueField: 'codeNm', // value 에 해당되는 필드명
            // disabledFunction: () => {
            //   return this.checkDisabled;
            // },
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000264'),
          dataField: 'improvement',
          width: '20%',
          editable: false,
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {},
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001360'),
          dataField: 'remark',
          width: '20%',
        },
      ];
    },
    getData() {
      if (
        this.infoItemProps.safFacilChkNo &&
        this.infoItemProps.safFacilChkNo > 0
      ) {
        this.$http.url = this.infoItemProps.safCheckTypeCd
          ? selectConfig.saf.befInspResult.items.result.url
          : selectConfig.saf.befInspResult.items.url;
        this.$http.type = 'GET';
        this.$http.param = {
          safFacilChkNo: this.infoItemProps.safFacilChkNo,
          plantCd: this.infoItemProps.plantCd,
          safCheckTypeCd: this.safCheckTypeCd,
          noPlanYn: this.noPlanYn,
        };
        this.$http.request(
          (_result) => {
            this.chkItemResultGridOptions.data = _result.data;
            this.YAuiGrid.setGridData(_result.data);
            this.chkItemResultGridOptions.data.map((item) => {
              item.checkYn = 'Y';
              item.safFacilityCheckItemNo =
                item.safFacilityCheckItemNo.trimStart();
              return item;
            });
            if (_result.data) {
              if (_result.data.length > 0) {
                this.safCheckTypeNm = _result.data[0].safCheckTypeNm;
              } else {
                this.$http.url = this.$format(
                  selectConfig.codeMaster.get.url,
                  'SAF_PREOPERATION_CHECK',
                  this.safCheckTypeCd
                );
                this.$http.type = 'GET';
                this.$http.request(
                  (_result) => {
                    this.safCheckTypeNm = _result.data.codeNm;
                    this.count++;
                    if (this.count === 1) {
                      window.getApp.$emit('ALERT', {
                        title: 'L0000003395',
                        message: 'M0000001602', // 등록된 점검항목이 없습니다.
                        type: 'warning', // success / info / warning / error
                      });
                      return;
                    }
                  },
                  (_error) => {
                    window.getApp.$emit('APP_REQUEST_ERROR', _error);
                  }
                );
              }
            }
          },
          (_error) => {
            window.getApp.$emit('APP_REQUEST_ERROR', _error);
          }
        );
      }
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
    beforeSubEdit() {
      let flag = true;
      this.$_.forEach(this.YAuiGrid.getGridData(), (_item) => {
        if (!_item.chkYmd) {
          window.getApp.$emit('ALERT', {
            title: 'L0000003395', // 안내
            message: 'M0000001606', // 점검시기를 선택하세요.
            type: 'warning', // success / info / warning / error
          });
          flag = false;
          return;
        }
      });
      if (!this.chkSchYmd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // 안내
          message: 'M0000001603', // 점검일을 선택하세요.
          type: 'warning', // success / info / warning / error
        });
        return;
      }
      if (!this.pDeptCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // 안내
          message: 'M0000001604', // 점검수행부서를 선택하세요.
          type: 'warning', // success / info / warning / error
        });
        return;
      }
      if (!this.chkUserNm) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // 안내
          message: 'M0000001605', // 점검수행자를 선택하세요.
          type: 'warning', // success / info / warning / error
        });
        return;
      }
      if (!this.chkEndYn) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // 안내
          message: 'M0000001264', // 점검완료여부를 선택하세요.
          type: 'warning', // success / info / warning / error
        });
        return;
      }
      if (!this.chkResult) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // 안내
          message: 'M0000000708', // 점검결과요약을 입력해주세요.
          type: 'warning', // success / info / warning / error
        });
        return;
      }

      if (flag) {
        window.getApp.$emit('CONFIRM', {
          title: 'L0000003321',
          message: 'M0000000011', // 저장하시겠습니까?
          // TODO : 필요시 추가하세요.
          type: 'info', // success / info / warning / error
          // 확인 callback 함수
          confirmCallback: () => {
            this.$http.url = this.subInsertUrl;
            this.$http.type = 'POST';
            this.$http.param = {
              safCheckTypeCd: this.safCheckTypeCd,
              chkSchYmd: this.chkSchYmd,
              chkUserNm: this.chkUserNm,
              pDeptCd: this.pDeptCd,
              chkResult: this.chkResult,
              chkEndYn: this.chkEndYn,
              safFacilChkNo: this.infoItemProps.safFacilChkNo,
              forEachFacilList: this.AuiGrid.getGridData(),
              forEachTypeList: this.YAuiGrid.getGridData(),
              kind: 'result',
            };
            this.$http.request(
              (_result) => {
                if (!_result.data) return;
                this.btnEditSubClickedCallback();
              },
              (_error) => {
                window.getApp.$emit('APP_REQUEST_ERROR', _error);
              }
            );
          },
          cancelCallback: () => {},
        });
      }
    },
    cellClickHandler(event) {
      if (!this.editable) return;

      this.popupOptions.param = {
        safImprActNo: 0, // data ? data.safImprActNo : 0, << 무조건 신규등록만 되도록
        imprClassCd: 'ICL17',
        refTableId: event.item ? event.item.safFacilChkNo : 0,
        refKey: event.item ? event.item.safFacilSysNo : 0,
        imprRqstContents: event.item
          ? '[ 점검항목 ] ' + event.item.safFacilityCheckItemNo
          : '',
      };

      // 개선요청
      if (event.dataField === 'improvement') {
        // 무조건 등록만 뜨도록 수정
        this.popupOptions.title = 'L0000004216'; /* 개선요청일괄등록 */
        this.popupOptions.target = () =>
          import(`${'../../impr/actionRequestBatch.vue'}`);
        this.popupOptions.visible = true;
        this.popupOptions.closeCallback = this.closePopup;
      }
    },
    tableLinkClicked(header, data) {
      let flag = '';

      if (!this.editable) return;

      this.popupOptions.param = {
        safImprActNo: 0, // data ? data.safImprActNo : 0, << 무조건 신규등록만 되도록
        imprClassCd: 'ICL17',
        refTableId: data ? data.safFacilChkNo : 0,
        refKey: data ? data.safFacilSysNo : 0,
        imprRqstContents: data
          ? '[ 점검항목 ] ' + data.safFacilityCheckItemNo
          : '',
      };

      // 개선요청
      if (header.name === 'improvement') {
        // 무조건 등록만 뜨도록 수정
        this.popupOptions.title = 'L0000004216'; /* 개선요청일괄등록 */
        this.popupOptions.target = () =>
          import(`${'../../impr/actionRequestBatch.vue'}`);
      }
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closePopup;
    },
    closePopup() {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.getData();
    },
    btnEditSubClickedCallback(_result) {
      window.getApp.$emit('ALERT', {
        title: 'L0000003395',
        message: 'M0000000006',
        type: 'success', // success / info / warning / error
      });
      this.getSubDetail();
    },
    getSubDetail() {
      this.isItems = true;
      this.$http.url = selectConfig.saf.befInspResult.forEachType.url;
      this.$http.type = 'GET';
      this.$http.param = {
        safFacilChkNo: this.infoItemProps.safFacilChkNo,
      };
      this.$http.request(
        (_result) => {
          this.typeInfoList = [];
          this.typeInfoList.push({
            safCheckTypeCd: null,
            safFacilChkNo: this.infoItemProps.safFacilChkNo,
          });

          let typeInfoList = [];
          if (this.$_.clone(_result.data).length > 0) {
            typeInfoList = this.$_.clone(_result.data);
          } else {
            typeInfoList = [
              {
                safCheckTypeCd: null,
                safFacilChkNo: this.popupParam.safFacilChkNo,
              },
            ];
          }
          let inspBefItemView = {
            typeInfoList: typeInfoList,

            safFacilChkNo: this.infoItemProps.safFacilChkNo,
            // safFacilityCd: data.safFacilityCd ? data.safFacilityCd : null,
            plantCd: this.infoItemProps.plantCd,
          };

          this.$emit('editItemCd', {
            safCheckTypeCd: this.safCheckTypeCd,
            safCheckTypeNm: this.safCheckTypeNm,
            inspBefItemView: inspBefItemView,
          });
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    btnAddRow() {
      this.popupOptions.target = () =>
        import(`${'../../baseInfo/facility/facilityMstPopup.vue'}`);
      this.popupOptions.title = 'L0000003680';
      // 설비 추가
      this.popupOptions.param = {
        multiple: true,
        plantCd: this.infoItemProps.plantCd,
      };
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closeFacilityPopup;
    },
    btnDelRow() {
      let removeData = this.AuiGrid.getCheckedRowItems();
      if (!removeData || removeData.length === 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: 'M0000000092',
          // 설비목록에서 설비를 한개이상 선택하세요.
          type: 'warning', // success / info / warning / error
        });
        return;
      }
      for (let i = 0; i < removeData.length; i++) {
        this.AuiGrid.removeRow(removeData[i].rowIndex);
      }
    },
    openPopup() {
      this.popupOptions.target = () =>
        import(`${'../../baseInfo/facility/facilityMstPopup.vue'}`);
      this.popupOptions.title = 'L0000003680';
      // 설비 추가
      this.popupOptions.param = {
        multiple: true,
        plantCd: this.infoItemProps.plantCd,
      };
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closeFacilityPopup;
    },
    closeFacilityPopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      if (data === 'CLOSE') return;
      // 데이터의 타입이 배열이 아닌 알 수 없는값으로 표기 될 시에 배열로 초기화
      if (!this.gridOptions.data) this.gridOptions.data = [];

      this.$_.forEach(data, (facility) => {
        // 점검설비 목록에 선택되어져 온 설비를 바인딩한다.
        let index = this.$_.findIndex(this.AuiGrid.getGridData(), {
          safFacilityCd: facility.safFacilityCd,
        });
        // 팝업창에서 선택한 값이 기존에 없는 값이라면 점검설비목록에 추가한다.
        if (index === -1) {
          let row = {
            safFacilityTypeNm: facility.safFacilityTypeNm,
            processNms: facility.processNms,
            safFacilityCd: facility.safFacilityCd,
            facilityNm: facility.facilityNm,
            facilityMgrNum: facility.facilityMgrNum,
            deptNm: facility.deptNm,
          };
          this.AuiGrid.addRow(row, 'first');
        } else {
          // 기존에 있는 데이터의 경우에는 데이터를 추가하지 않고 그대로 놔둔다.
        }
      });
    },
    btnDeleteFacilityClickedCallback(_result) {
      if (this.selectValue.length <= 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: 'M0000000092',
          // 설비목록에서 설비를 한개이상 선택하세요.
          type: 'warning', // success / info / warning / error
        });
        return;
      } else {
        this.$_.forEach(this.selectValue, (item) => {
          this.gridOptions.data = this.$_.reject(this.gridOptions.data, {
            safFacilityCd: item.safFacilityCd,
          });
        });
        this.isItems = false;
      }
    },
    btnSearchUserClicked(row) {
      if (!this.editable) return;
      // 선택한 row와 헤더의 명칭을 저장한다.
      this.data = row;

      this.popupOptions.target = () =>
        import(`${'@/pages/manage/user/userSearch.vue'}`);
      this.popupOptions.param = {
        multiple: true,
        plantCd: this.infoItemProps.plantCd,
      };
      this.popupOptions.title = 'L0000001466'; // 사용자검색
      this.popupOptions.visible = true;
      this.popupOptions.width = '70%';
      this.popupOptions.top = '100px';
      this.popupOptions.closeCallback = this.closePopupSearchUser;
    },
    closePopupSearchUser(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      let i = 0;
      if (data.users) {
        this.chkUserNm = '';
        this.chkUserId = [];
        this.$_.forEach(data.users, (_item) => {
          if (data.users.length - 1 === i) {
            this.chkUserNm += _item.userNm;
          } else {
            this.chkUserNm += _item.userNm + ', ';
            i++;
          }
          this.chkUserId.push(_item.userId);
        });
      }
    },
    allClicked(data) {
      if (data === 'T') {
        this.$_.forEach(this.chkItemResultGridOptions.data, (_item) => {
          _item.checkYn = 'Y';
        });
        this.isAll = false;
      } else if (data === 'F') {
        this.$_.forEach(this.chkItemResultGridOptions.data, (_item) => {
          _item.checkYn = 'N';
        });
        this.isAll = true;
      }
    },
    btnClickedErrorCallback(_result) {
      this.isSave = false;
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    handleCommand1(command) {
      if (command === 'excel') {
        this.btnExcelPrintClicked1();
      } else if (command === 'pdf') {
        this.btnPdfPrintClicked1();
      }
    },
    btnPdfPrintClicked1() {
      let facilityNames = '';
      let i = 0;
      if (this.gridOptions.data.length > 0) {
        this.$_.forEach(this.gridOptions.data, (_item) => {
          if (this.gridOptions.data.length - 1 === i) {
            facilityNames += _item.facilityNm;
          } else {
            facilityNames += _item.facilityNm + ', ';
            i++;
          }
        });
      }
      let thisVue = this;
      let _comm = this.$comm;
      this.$http.url =
        selectConfig.saf.befInspResult.items.result.print.preStart.url;
      this.$http.type = 'GET';
      this.$http.param = {
        safFacilChkNo: this.infoItemProps.safFacilChkNo,
        plantCd: this.infoItemProps.plantCd,
        safCheckTypeCd: this.safCheckTypeCd,
        chkUserNm: facilityNames,
        reportName: this.name,
      };
      this.$http.request(
        (_result) => {
          let fileOrgNm = this.name + '_' + this.$comm.getToday() + '.pdf';
          var url = window.URL || window.webkitURL;
          let link = document.createElement('a');
          var blob = thisVue.$comm.base64ToBlob(_result.data);
          if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(blob, fileOrgNm);
          } else {
            let link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = fileOrgNm;
            link.click();
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    btnExcelPrintClicked1() {
      let facilityNames = '';
      let i = 0;
      if (this.gridOptions.data.length > 0) {
        this.$_.forEach(this.gridOptions.data, (_item) => {
          if (this.gridOptions.data.length - 1 === i) {
            facilityNames += _item.facilityNm;
          } else {
            facilityNames += _item.facilityNm + ', ';
            i++;
          }
        });
      }
      let thisVue = this;
      let _comm = this.$comm;
      this.$http.url =
        selectConfig.saf.befInspResult.items.result.print.preStart.excel.url;
      this.$http.type = 'GET';
      this.$http.param = {
        safFacilChkNo: this.infoItemProps.safFacilChkNo,
        plantCd: this.infoItemProps.plantCd,
        safCheckTypeCd: this.safCheckTypeCd,
        chkUserNm: facilityNames,
        reportName: this.name,
      };
      this.$http.request(
        (_result) => {
          let fileOrgNm = this.name + '_' + this.$comm.getToday() + '.xlsx';
          var url = window.URL || window.webkitURL;
          let link = document.createElement('a');
          var blob = thisVue.$comm.base64ToBlob(_result.data);
          if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(blob, fileOrgNm);
          } else {
            let link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = fileOrgNm;
            link.click();
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    handleCommand2(command) {
      if (command === 'excel') {
        this.btnExcelPrintClicked2();
      } else if (command === 'pdf') {
        this.btnPdfPrintClicked2();
      }
    },
    btnPdfPrintClicked2() {
      let facilityNames = '';
      let i = 0;
      if (this.gridOptions.data.length > 0) {
        this.$_.forEach(this.gridOptions.data, (_item) => {
          if (this.gridOptions.data.length - 1 === i) {
            facilityNames += _item.facilityNm;
          } else {
            facilityNames += _item.facilityNm + ', ';
            i++;
          }
        });
      }
      let thisVue = this;
      let _comm = this.$comm;
      this.$http.url =
        selectConfig.saf.befInspResult.items.result.print.preStartReport.url;
      this.$http.type = 'GET';
      this.$http.param = {
        safFacilChkNo: this.infoItemProps.safFacilChkNo,
        plantCd: this.infoItemProps.plantCd,
        safCheckTypeCd: this.safCheckTypeCd,
        chkSchYmd: this.chkSchYmd,
        facilityNames: facilityNames,
        chkUserNm: this.chkUserNm,
      };
      this.$http.request(
        (_result) => {
          let fileOrgNm = '가동전점검보고서_' + this.$comm.getToday() + '.pdf';
          var url = window.URL || window.webkitURL;
          let link = document.createElement('a');
          var blob = thisVue.$comm.base64ToBlob(_result.data);
          if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(blob, fileOrgNm);
          } else {
            let link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = fileOrgNm;
            link.click();
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    btnExcelPrintClicked2() {
      let facilityNames = '';
      let i = 0;
      if (this.gridOptions.data.length > 0) {
        this.$_.forEach(this.gridOptions.data, (_item) => {
          if (this.gridOptions.data.length - 1 === i) {
            facilityNames += _item.facilityNm;
          } else {
            facilityNames += _item.facilityNm + ', ';
            i++;
          }
        });
      }
      let thisVue = this;
      let _comm = this.$comm;
      this.$http.url =
        selectConfig.saf.befInspResult.items.result.print.preStartReport.excel.url;
      this.$http.type = 'GET';
      this.$http.param = {
        safFacilChkNo: this.infoItemProps.safFacilChkNo,
        plantCd: this.infoItemProps.plantCd,
        safCheckTypeCd: this.safCheckTypeCd,
        chkSchYmd: this.chkSchYmd,
        facilityNames: facilityNames,
        chkUserNm: this.chkUserNm,
      };
      this.$http.request(
        (_result) => {
          let fileOrgNm = '가동전점검보고서_' + this.$comm.getToday() + '.xlsx';
          var url = window.URL || window.webkitURL;
          let link = document.createElement('a');
          var blob = thisVue.$comm.base64ToBlob(_result.data);
          if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(blob, fileOrgNm);
          } else {
            let link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = fileOrgNm;
            link.click();
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    /** end button 관련 이벤트 **/
  },
};
</script>
<style scope>
.chkItemRslt label {
  padding-top: 0;
}
</style>
