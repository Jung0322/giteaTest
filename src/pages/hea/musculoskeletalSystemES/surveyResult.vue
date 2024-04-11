<!--
  목적 : 근골격계 단위작업 탭
  Detail : 조사결과
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <!-- 등록 -->
    <!-- <b-row>
      <b-col sm="12">
         조사결과 테이블 
        <b-row>
          <b-col sm="12">
            <b-col sm="12" class="px-0">
              <div slot="buttonGroup" class="float-right mb-1">
                 저장 
                <y-btn
                  v-if="isResearchUser && tabEditable"
                  :isFileRequestPost="true"
                  :action-url="updateUrl"
                  :param="saveData"
                  :is-submit="isEdit"
                  title="L0000002474"
                  color="blue"
                  action-type="PUT"
                  beforeSubmit="beforeSave"
                  @beforeSave="beforeSave"
                  @btnClicked="btnEditClickedCallback"
                  @btnClickedErrorCallback="btnClickedErrorCallback"
                />
              </div>
               조사결과 목록 
              <y-data-table
                ref="dataTableIn"
                :height="gridOptions.height"
                :headers="gridOptions.header"
                :items="gridOptions.data"
                :customExcelDown="true"
                :editable="isResearchUser && tabEditable"
                :useRownum="false"
                label="L0000002643"
                @inputChange="inputChange"
                @gridExcelCustom="gridExcelCustom"
              >
               유해요인조사 대상 
                <el-table-column
                  slot="expand"
                  align="center"
                  min-width="150px"
                  prop="finalValue"
                  :label="$comm.getLangSpecInfoLabel('L0000004379')"
                >
                  <template slot-scope="scope">
                    <y-select
                      :width="12"
                      :comboItems="finalValues"
                      :disabled="true"
                      itemText="codeNm"
                      itemValue="code"
                      ui="bootstrap"
                      v-model="scope.row.finalValue"
                    />
                  </template>
                </el-table-column>
                 조사대상부서 
                <el-table-column
                  slot="expand"
                  prop="deptNm"
                  :label="$comm.getLangSpecInfoLabel('L0000004264')"
                  min-width="130px"
                  align="center"
                  header-align="center"
                >
                  <template slot="header">
                    {{$comm.getLangSpecInfoLabel('L0000004264')}}
                    <b-form-select
                      v-model="deptCd"
                      :options="deptItems"
                      item-text="deptNm"
                      item-value="deptCd"
                      size="sm"
                    />
                  </template>
                  <template slot-scope="scope">{{ scope.row.deptNm }}</template>
                </el-table-column>
              </y-data-table>
              :items="gridOptions.data" 
            </b-col>
          </b-col>
        </b-row>
      </b-col>
    </b-row> -->
    <b-row>
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <b-col sm="12" class="px-0">
              <div slot="buttonGroup" class="float-right mb-1">
                <y-btn
                  v-if="isResearchUser && tabEditable"
                  :isFileRequestPost="true"
                  :action-url="updateUrl"
                  :param="saveData"
                  :is-submit="isEdit"
                  title="L0000002474"
                  color="blue"
                  action-type="PUT"
                  beforeSubmit="beforeSave"
                  @beforeSave="beforeSave"
                  @btnClicked="btnEditClickedCallback"
                  @btnClickedErrorCallback="btnClickedErrorCallback"
                />
              </div>
            </b-col>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
    <b-row class="grid-height grid-box">
      <b-col sm="12" class="h100p">
        <y-auigrid
          :ref="'dataTableItem'"
          :editable="true"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :items="gridOptions.data"
          :height="gridOptions.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000002643')"
          :useExcelExport="false"
          :enableCellMerge="true"
          :enableSorting="true"
          :showGridSetSave="true"
          :useContextMenu="true"
          :enableRightDownFocus="true"
          :showGridCtrl="true"
          :showRowCheckColumn="true"
        />
      </b-col>
    </b-row>
    <y-dialog :param="shiledOptions"></y-dialog>
    <y-dialog :param="popupOptions"></y-dialog>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
export default {
  /* attributes: name, components, props, data */
  name: 'survey-result',
  props: {
    tabEditable: false,
    // planMode: {
    //   type: Boolean,
    //   default: function () {
    //     return false;
    //   },
    // },
    plan: {
      type: Object,
      default: function () {
        return {
          planMode: false,
        };
      },
    },
    muscResearch: {
      type: Object,
      default: function () {
        return {
          muscResearchNo: 0,
          muscResearchUnitNo: 0,
        };
      },
    },
    tabParam: {
      type: Object,
      default: function () {
        return {
          imprClassCd: 'ICL14',
          refTableId: 0,
          editable: true,
          editable2: true,
          detailCheck: false,
          plantCd: '',
        };
      },
    },
    paneName: {
      type: String,
      default: function () {
        return '';
      },
    },
    allDept: {
      type: Boolean,
      default: function () {
        return false;
      },
    },
  },
  data() {
    return {
      surveyResult: {
        muscResearchRsltNo: 0,
        muscResearchUnitNo: 0,
        workNm: '',
        muscResearchChklistNo: 0,
        workTime: 0,
        workCnt: 0,
        totExposureTime: 0,
        finalValue: '',
        workUnitNm: '',
      },
      gridOptions: {
        name: 'surveyResult',
        btns: [],
        // 조사결과
        header: [],
        data: [],
        alldata: [],
        height: '400',
      },
      YAuiGrid: null,
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '1000px',
        top: '10px',
        param: {},
        closeCallback: null,
      },
      saveData: {
        list: '',
        taskClassNm: 'HEA_MUSC_RESEARCH_RSLT',
        files: [],
      },
      shiledOptions: {
        target: null,
        title: '',
        visible: false,
        width: '60%',
        top: '10px',
        param: {},
        closeCallback: null,
      },
      deptItems: [],
      deptCd: '',
      muscResearchRsltNo: 0,
      finalValue: '',
      totExposureTime: 0,
      total: 0,
      workCnt: 0,
      workTime: 0,
      workNm: '',
      muscResearchChklistNo: 0,
      selectedValue: [],
      updateUrl: '',
      searchUrl: '',
      excelDownUrl: '',
      finalValues: [],
      isEdit: false,
      editable: false,
      researchUsers: [],
    };
  },
  computed: {
    /**
     * 2021-12-17 lhj
     *
     * 단위작업 조사담당자일 경우 쓰기권한 추가
     */
    isResearchUser() {
      return (
        this.editable ||
        this.researchUsers.findIndex(
          (user) => user === this.$store.getters.token
        ) > -1
      );
    },
  },
  watch: {
    paneName() {
      this.getList();
    },
    deptCd() {
      let filterData = this.$_.clone(this.gridOptions.alldata);
      if (!this.deptCd) {
        this.YAuiGrid.setGridData(this.$_.clone(this.gridOptions.alldata));
      } else {
        if (this.deptCd) {
          filterData = this.$_.filter(filterData, {
            deptCd: this.deptCd,
          });
        }
        // this.gridOptions.data = filterData;
        this.YAuiGrid.setGridData(filterData);
      }
    },
    'gridOptions.data': {
      handler: function (val, oldVal) {
        let temp = this.$refs['dataTableItem'].getSaveFiles();
        if (temp) {
          this.saveData.files = temp.files;
        }
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
    this.YAuiGrid = this.$refs.dataTableItem;
  },
  beforeDestroy() {},
  //* methods */
  methods: {
    init() {
      this.editable = this.$route.meta.editable;
      // Url Setting
      this.searchUrl = selectConfig.hea.surveyResult.list.url;
      this.updateUrl = transactionConfig.hea.survey.edit.url;
      this.excelDownUrl = selectConfig.hea.surveyResult.excel.url;
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004379'),
          dataField: 'finalValue',
          width: '14%',
          editable: false,
          renderer: {
            type: 'DropDownListRenderer',
            listFunction: (rowIndex, columnIndex, item, dataField) => {
              item.totExposureTime = item.workCnt * item.workTime;
              if (item.totExposureTime > item.total) {
                item.finalValue = 'O';
              } else {
                item.finalValue = 'X';
              }
              return this.finalValues;
            },
            keyField: 'code',
            valueField: 'codeNm',
            disabledFunction: function (
              rowIndex,
              columnIndex,
              value,
              item,
              dataField
            ) {
              return true;
            },
          },
        },
        // {
        //   text: '조사부서명',
        //   name: 'deptNm',
        //   width: '130px',
        //   align: 'center',
        // },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000875'),
          dataField: 'unitWorkNm',
          width: '12%',
          editable: false,
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002389'),
          dataField: 'workNm',
          width: '14%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001285'),
          dataField: 'muscResearchChklistNo',
          width: '12%',
          editable: false,
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002403'),
          dataField: 'workTime',
          width: '12%',
          dataType: 'numeric',
          style: 'right-align',
          editRenderer: {
            type: 'InputEditRenderer',
            onlyNumeric: true, // 0~9만 입력가능
            maxlength: 4,
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002447'),
          dataField: 'workCnt',
          width: '12%',
          dataType: 'numeric',
          style: 'right-align',
          editRenderer: {
            type: 'InputEditRenderer',
            onlyNumeric: true, // 0~9만 입력가능
            maxlength: 3,
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002864'),
          dataField: 'totExposureTime',
          width: '12%',
          editable: false,
          disabled: true,
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002842'),
          dataField: 'files',
          width: '12%',
          editable: false,
          renderer: {
            type: 'ButtonRenderer',
            labelText: '상세 보기',
            onClick: (event) => {
              this.openMultiFileUpload(event);
            },
          },
        } /* 첨부자료 */,
        // {
        //   text: 'L0000002864', // 총노출시간
        //   name: 'totExposureTime',
        //   width: '120px',
        //   align: 'right',
        //   type: 'number',
        //   hasSeperator: true,
        //   disabled: true,
        // },
        // {
        //   text: '최종평가',
        //   name: 'finalValue',
        //   width: '80px',
        //   align: 'center',
        // },

        // {
        //   text: 'L0000001490', // 사진
        //   name: 'files',
        //   width: '180px',
        //   align: 'center',
        //   type: 'attach',
        //   keyText: 'muscResearchRsltNo',
        //   accept: 'image/*',
        // },
      ];
      // this.gridOptions.btns = [
      //   {
      //     title: this.$comm.getLangSpecInfoLabel('L0000002474'),
      //     color: 'oragne',
      //     btnClicked: 'updateRowClicked'
      //   },
      // ]
      // this.totExposureTime.Vue.filter('comma', val => String(val).replace(/\B(?=(\d{3})+(?!\d))/g, ','));
      this.finalValues.push({
        code: 'X',
        codeNm: this.$comm.getLangSpecInfoLabel('L0000004380'),
      }); // 비대상
      this.finalValues.push({
        code: 'O',
        codeNm: this.$comm.getLangSpecInfoLabel('L0000002650'),
      }); // 조사대상
      this.getList();
    },
    getList() {
      if (!this.muscResearch || !this.muscResearch.muscResearchNo) {
        //  || this.muscSurvey.no === 0
        return;
      }
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = {
        muscResearchNo: this.muscResearch.muscResearchNo,
        deptCd: this.allDept ? null : this.$store.getters.deptCd,
      };

      this.$http.request(
        (_result) => {
          this.gridOptions.data = this.$_.clone(_result.data);
          this.YAuiGrid.setGridData(this.$_.clone(_result.data));
          this.gridOptions.alldata = this.$_.clone(_result.data);
          this.researchUsers = this.$_.uniq(
            this.$_.cloneDeep(this.gridOptions.data).map((user) => {
              return user.researchUserId;
            })
          );
          this.deptItems = [];
          let deptItemsTemp = [];
          this.$_.forEach(this.gridOptions.data, (item) => {
            deptItemsTemp.push({
              value: item.deptCd,
              text: item.deptNm,
            });
          });
          this.deptItems = this.$_.uniqWith(deptItemsTemp, this.$_.isEqual);
          this.deptItems.splice(0, 0, {
            value: '',
            text: this.$comm.getLangSpecInfoLabel('L0000002519'),
          }); // 전체
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },

    openMultiFileUpload(event) {
      const saveData = this.YAuiGrid.getSaveDataObj();

      this.popupOptions.target = () =>
        import('@/pages/common/attachFile/gridAttachFileUpload.vue');
      this.popupOptions.title = 'L0000002843';
      this.popupOptions.visible = true;
      this.popupOptions.top = '10%';
      this.popupOptions.width = '30%';
      this.popupOptions.param = {
        editable: this.editable,
        disabled: !this.tabParam.editable2,
        rowIndex: event.rowIndex,
        tempId: event.item.tempId || event.item.muscResearchRsltNo,
        rowFiles: event.item.files,
        files: saveData,
      };
      this.popupOptions.customCallBack = this.setSaveFiles;
      this.popupOptions.closeCallback = this.closeMultiFilePopup;
    },
    closeMultiFilePopup(params) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.setSaveFiles(params);
    },
    setSaveFiles(params) {
      if ((params || null) !== null) {
        console.log('params.saveData', params.saveData);
        if ((params.saveData || null) !== null) {
          const rowIndex = this.popupOptions.param.rowIndex;
          this.YAuiGrid.setCellValue(rowIndex, 'files', params.rowFiles);
          this.YAuiGrid.setSaveFiles(params.saveData);
        }
      }
    },
    /**
     * header : 헤더 정보
     * data : 클릭한 col의 row 정보
     */
    updateRowClicked() {
      this.beforeSave();
    },
    beforeSave(scope) {
      this.$validator
        .validateAll()
        .then((_result) => {
          if (_result) {
            let isIng = true;
            // 보호구 추가여부
            if (this.YAuiGrid.getGridData().length === 0) {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395', // '안내',
                message: 'M0000000463', // 저장할 단위작업을 선택해주세요.
                type: 'warning',
              });
              isIng = false;
              return;
            } else {
              this.$_.forEach(this.YAuiGrid.getGridData(), (item) => {
                if (!item.workNm) {
                  window.getApp.$emit('ALERT', {
                    title: 'L0000003395', // '안내',
                    message: 'M0000000464', // 작업명을 입력해 주세요.
                    type: 'warning',
                  });
                  isIng = false;
                  return false;
                } else if (!item.workTime || String(item.workTime) === '0') {
                  window.getApp.$emit('ALERT', {
                    title: 'L0000003395', // '안내',
                    message: 'M0000000465', // 작업시간을 입력해 주세요.
                    type: 'warning',
                  });
                  isIng = false;
                  return false;
                } else if (!item.workCnt || String(item.workCnt) === '0') {
                  window.getApp.$emit('ALERT', {
                    title: 'L0000003395', // '안내',
                    message: 'M0000000466', // 작업횟수를 입력해 주세요.
                    type: 'warning',
                  });
                  isIng = false;
                  return false;
                }
              });
            }

            if (isIng) {
              window.getApp.$emit('CONFIRM', {
                title: 'L0000003321', // '확인',
                message: 'M0000000011', // 저장하시겠습니까?
                type: 'info',
                // 확인 callback 함수
                confirmCallback: () => {
                  let gridData = [];
                  gridData = this.$_.map(
                    this.YAuiGrid.getGridData(),
                    (item) => {
                      item.updateUserId = this.$store.getters.token;
                      item.tempId = item.tempId
                        ? item.tempId
                        : item.muscResearchRsltNo;

                      return item;
                    }
                  );

                  this.saveData.list = JSON.stringify(gridData);
                  const data = this.YAuiGrid.getSaveFiles();
                  this.saveData.files = this.$_.clone(data.files);

                  this.isEdit = true;
                },
                cancelCallback: () => {
                  this.isEdit = false;
                },
              });
            }
          } else {
            window.getApp.$emit('ALERT', {
              title: 'L0000003395', // '안내',
              message: 'M0000000467', // 보호구를 입력해주세요.
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
    // 수정
    btnEditClickedCallback(_result) {
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // '안내',
        message: 'M0000000006', // 저장되었습니다.
        type: 'success',
      });
      this.getList();
      this.plan.planMode = true;
      this.isEdit = false;
    },

    /** button 관련 이벤트 **/
    /**
     *  버튼 http 통신 중 error 발생 callback
     * _result : error return하는 데이터
     */
    btnClickedErrorCallback(_result) {
      this.isEdit = false;
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    inputChange(data) {
      data.row.totExposureTime = data.row.workCnt * data.row.workTime;
      if (data.row.totExposureTime > data.row.total) {
        data.row.finalValue = 'O';
      } else {
        data.row.finalValue = 'X';
      }
    },
    gridExcelCustom() {
      let thisVue = this;
      let _comm = this.$comm;
      this.$http.url = this.excelDownUrl;
      this.$http.type = 'GET';
      this.$http.param = {
        muscResearchNo: this.muscResearch.muscResearchNo,
        deptCd: this.allDept ? null : this.$store.getters.deptCd,
      };
      this.$http.request(
        (_result) => {
          let fileOrgNm = '조사결과.xls';
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
