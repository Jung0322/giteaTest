<!--
  목적 : 경영>SHE예산 관리>예산편성 관리>예산계정 팝업
  Detail : 예산편성 관리 예산계정 팝업화면
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <b-row ref="detailBox">
      <b-col sm="12">
        <b-col sm="12" class="px-0">
          <b-row>
            <b-col sm="12">
              <!-- 대상부서별 예산계정상세 -->
              <y-label
                label="L0000005069"
                icon="user-edit"
                color-class="cutstom-title-color"
              />
              <div slot="buttonGroup" class="float-right mb-1">
                <!-- 결재요청 -->
                <y-btn
                  v-if="apprBtn"
                  title="L0000003418"
                  color="black"
                  @btnClicked="btnAppr"
                />
                <!-- 임시저장 -->
                <y-btn
                  v-if="saveBtn"
                  title="L0000004986"
                  color="orange"
                  @btnClicked="btnSave"
                />
                <!-- 삭제 -->
                <y-btn
                  v-if="deleteBtn"
                  title="L0000001495"
                  color="red"
                  @btnClicked="btnDelete"
                />
                <!-- 닫기 -->
                <y-btn
                  v-if="!popupParam.apprFlag"
                  title="L0000000881"
                  @btnClicked="btnClosePopup"
                />
              </div>
            </b-col>
          </b-row>
          <b-card>
            <b-row>
              <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
                <!-- 년도 -->
                <y-datepicker
                  :width="8"
                  :editable="editable"
                  :disabled="true"
                  label="L0000000829"
                  type="year"
                  name="year"
                  :default="budgetActDept.year"
                  v-model="budgetActDept.year"
                  v-validate="'required'"
                  :state="validateState('year')"
                ></y-datepicker>
              </b-col>
              <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
                <!-- 사업장 -->
                <y-plant
                  type="edit"
                  :editable="editable"
                  :disabled="true"
                  name="plantCd"
                  v-model="budgetActDept.plantCd"
                  v-validate="'required'"
                  :state="validateState('plantCd')"
                ></y-plant>
              </b-col>
              <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
                <!-- 대상부서 -->
                <y-tree-dept
                  :width="8"
                  :editable="editable"
                  :disabled="true"
                  label="L0000000927"
                  :plantCd="budgetActDept.plantCd"
                  v-model="budgetActDept.deptCd"
                  v-validate="'required'"
                  :state="validateState('deptCd')"
                />
              </b-col>
            </b-row>
          </b-card>
        </b-col>
      </b-col>
    </b-row>

    <!-- <b-row class="mt-3">
      <b-col sm="12">
        <b-col sm="12" class="px-0">
          <div slot="buttonGroup" class="float-right mb-1">
             행추가 
            <y-btn
              v-if="editable && !disabled"
              title="L0000003226"
              color="orange"
              @btnClicked="btnAddItem"
            />
             행삭제 
            <y-btn
              v-if="editable && !disabled"
              title="L0000003225"
              color="red"
              @btnClicked="btnDeleteItem"
            />
          </div>
           대상부서별 예산계정 
          <y-data-table
            :key="tempKey"
            label="L0000005070"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            :editable="editable && !disabled"
            :popMode="true"
            :useRownum="false"
            v-model="selectedValue"
          >
            <el-table-column
              v-if="editable && !disabled"
              key="selection"
              align="center"
              type="selection"
              slot="selection"
              width="55"
            ></el-table-column>
             예산분류 
            <el-table-column
              key="budgetTypeCd_1"
              prop="budgetTypeCd"
              :label="$comm.getLangSpecInfoLabel('L0000005001')"
              min-width="150px"
              align="center"
              sortable="true"
              header-align="center"
              class-name="default-td"
              slot="expand"
            >
              <template slot-scope="scope">
                <y-select
                  :editable="editable && !disabled"
                  :comboItems="budgetTypeItems"
                  itemText="codeNm"
                  itemValue="code"
                  :hasBottomMargin="false"
                  rowClass
                  size="sm"
                  ui="bootstrap"
                  v-model="scope.row['budgetTypeCd']"
                  @datachange="
                    (val) => {
                      (scope.row['budgetTypeCd'] = val),
                        datachange('budgetTypeCd', scope);
                    }
                  "
                  @text="
                    (val) => {
                      inputText(val, 'budgetTypeCd', scope);
                    }
                  "
                />
              </template>
            </el-table-column>
             예산구분 
            <el-table-column
              key="budgetClsCd_1"
              prop="budgetClsCd"
              :label="$comm.getLangSpecInfoLabel('L0000005004')"
              min-width="150px"
              align="center"
              sortable="true"
              header-align="center"
              class-name="default-td"
              slot="expand"
            >
              <template slot-scope="scope">
                <y-select
                  :editable="editable && !disabled"
                  :comboItems="budgetClsItems"
                  itemText="codeNm"
                  itemValue="code"
                  :hasBottomMargin="false"
                  rowClass
                  size="sm"
                  ui="bootstrap"
                  v-model="scope.row['budgetClsCd']"
                  @datachange="
                    (val) => {
                      (scope.row['budgetClsCd'] = val),
                        datachange('budgetClsCd', scope);
                    }
                  "
                  @text="
                    (val) => {
                      inputText(val, 'budgetClsCd', scope);
                    }
                  "
                />
              </template>
            </el-table-column>
            예산계정 
            <el-table-column
              key="budgetActMstNo_1"
              prop="budgetActMstNo"
              :label="$comm.getLangSpecInfoLabel('L0000005003')"
              min-width="150px"
              align="center"
              sortable="true"
              header-align="center"
              class-name="default-td"
              slot="expand"
            >
              <template slot-scope="scope">
                <y-select
                  :editable="editable && !disabled"
                  :comboItems="scope.row['budgetActItems']"
                  itemText="budgetActNm"
                  itemValue="budgetActMstNo"
                  :hasBottomMargin="false"
                  rowClass
                  size="sm"
                  ui="bootstrap"
                  v-model="scope.row['budgetActMstNo']"
                  @text="
                    (val) => {
                      inputText(val, 'budgetActMstNo', scope);
                    }
                  "
                />
              </template>
            </el-table-column>
          </y-data-table>
        </b-col>
      </b-col>
    </b-row> -->
    <b-row class="grid-height grid-box">
      <b-col sm="12" class="h100p">
        <y-auigrid
          ref="yAuiGrid"
          :editable="editable"
          :name="gridOptionss.name"
          :headers="gridOptionss.header"
          :btns="gridOptionss.btns"
          :height="gridOptionss.height"
          :showRowCheckColumn="true"
          :label="this.$comm.getLangSpecInfoLabel('L0000005070')"
          :useExcelExport="false"
          :enableSorting="true"
          :showGridSetSave="true"
          :softRemoveRowMode="false"
          @btnAddRow="btnAddRow"
          @deleteRow="deleteRow"
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
  /** attributes: name, components, props, data **/
  name: 'budgeting-dept-act-mst-detail',
  props: {
    popupParam: {
      default: {
        budgetActDeptNo: 0, // 예산편성부서번호
        budgetActNo: 0, // 예산편성번호
        apprFlag: false, // 결재요청 여부
        readonly: false,
        deptCd: null, // 대상부서 (현황에서 팝업 호출시)
      },
    },
    flag: false,
  },
  data() {
    return {
      editable: false, // 수정 가능 여부
      budgetActDept: {
        // 예산편성 대상부서
        year: null, // 년도
        budgetActDeptNo: 0, // 예산계정편성부서번호
        budgetActNo: 0, // 예산편성번호
        plantCd: null, // 사업장코드
        plantNm: null, // 사업장
        deptCd: null, // 대상부서코드
        deptNm: null, // 대상부서
        procStepCd: null, // 단계 (MGT_BUDGET_STEP)
        stateCd: null, // 상태 (COM_STATE)
        stepCd: null, // 결재상태
        apprRqstNo: null, // 결재요청번호
        remark: null, // 비고
        mgtBudgetActDeptItems: [], // 대상부서별 예산계정 목록
        deleteMgtBudgetActDeptItems: [], // 대상부서별 예산계정 삭제 목록
      },
      gridOptions: {
        header: [],
        data: [],
        height: '450',
      },
      gridOptionss: {
        name: 'budgetingDeptActMstDetail',
        btns: [],
        header: [],
        data: [],
        height: '450',
      },
      YAuiGrid: null,
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '90%',
        top: '10px',
        param: {},
        closeCallback: null,
      },
      selectedValue: [], // 체크된 중분류 목록
      tempKey: null, // 그리드 렌더링 키(키가 바뀔때마다 새로 rendering하는 것을 이용하기 위함)
      deleteList: [], // 삭제할 대상부서 목록
      budgetTypeItems: [], // 예산 분류 아이템
      budgetClsItems: [], // 예산 구분 아이템
      budgetActItems: [], // 예산 계정 아이템
      disabled: false,
      checkDisabled: false,
    };
  },
  computed: {
    apprState() {
      return (
        this.budgetActDept.stepCd === 'BAPSA' ||
        this.budgetActDept.stepCd === 'BAPSG'
      );
    },
    apprBtn() {
      // 결재요청버튼 권한
      return (
        this.editable &&
        !this.disabled &&
        !this.popupParam.apprFlag &&
        this.budgetActDept.budgetActDeptNo &&
        this.budgetActDept.budgetActNo &&
        this.budgetActDept.stateCd !== 'STATE1'
      );
    },
    saveBtn() {
      // 저장버튼 권한
      return this.editable && !this.disabled;
    },
    deleteBtn() {
      // 삭제버튼 권한
      return (
        this.editable &&
        !this.disabled &&
        !this.popupParam.apprFlag &&
        this.budgetActDept.budgetActDeptNo &&
        this.budgetActDept.budgetActNo
      );
    },
  },
  watch: {},
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;
    this.mountedInit();
  },
  beforeDestory() {},
  methods: {
    init() {
      this.editable = this.$route.meta.editable;
      if (this.popupParam.apprRqstNo === 0) {
        this.checkDisabled = false;
      } else {
        this.checkDisabled = true;
      }
      
      // 예산분류 (기준정보) promise는 해당함수 시행후에 resolve가 되어야 다음으로 진행하는 부분 속도 때문에 다음걸로 바로넘어가는것 방지하기위해 사용함
      // 예산구분 (MGT_BDT_CLS)
      this.$comm.getComboItems('MGT_BDT_CLS', false).then((_result) => {
        this.budgetClsItems = this.$_.clone(_result); // 예산 구분 아이템

        let nowDate = new Date();
        this.tempKey = nowDate.getMilliseconds();
      });

      this.gridOptions.header = [
        {
          text: 'L0000005036',
          name: 'orgAmt',
          width: '150px',
          type: 'number',
          maxlength: 15,
          hasSeperator: true,
        }, // 편성금액(원)
      ];
      this.gridOptionss.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000003226'),
          color: 'orange',
          btnClicked: 'btnAddRow',
          visible: !this.checkDisabled
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000003225'),
          color: 'red',
          btnClicked: 'deleteRow',
          visible: !this.checkDisabled
        },
      ];
    },
    mountedInit() {
      // 예산계정 (기준정보)
      const promise1 = this.getComboItems('budgetActMst');
      const promise2 = this.getComboItems('budgetType');
      Promise.all([promise1, promise2]).then(() => {        
        this.setGridHeader().then(() => {
          if (
            this.popupParam.readonly &&
        this.popupParam.year &&
        this.popupParam.plantCd &&
        this.popupParam.deptCd
          ) {
            // 읽기모드 팝업시 년도, 사업장, 대상부서코드로 조회
            this.budgetActDept.year = this.popupParam.year;
            this.budgetActDept.plantCd = this.popupParam.plantCd;
            this.budgetActDept.deptCd = this.popupParam.deptCd;
            this.getDetailByStatInfo();
          }
          if (this.popupParam.budgetActNo && this.popupParam.budgetActDeptNo) {
            this.budgetActDept.budgetActNo = this.popupParam.budgetActNo;
            this.budgetActDept.budgetActDeptNo = this.popupParam.budgetActDeptNo;
            this.getDetail();
          }
        });
      });
    },
    btnAddRow() {
      let row = {
        budgetTypeCd: null, // 예산분류코드
        budgetTypeNm: '1', // 예산분류
        budgetClsCd: null, // 예산구분코드
        budgetClsNm: '1', // 예산구분
        budgetActMstNo: null, // 예산계정번호
        budgetActCd: null, // 예산계정코드
        budgetActNm: '1', // 예산계정
        orgAmt: 0, // 편성금액(원)
      };
      this.YAuiGrid.addRow(row, 'last');
    },
    deleteRow() {
      let removeData = this.YAuiGrid.getCheckedRowItems();
      if (removeData.length === 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // '안내',
          message: 'M0000001614', // 선택된 항목이 없습니다.
          type: 'warning',
        });
        return;
      }
      
      for (let i = 0; i < removeData.length; i++) {
        this.YAuiGrid.removeRow(removeData[i].rowIndex);
      }
    },
    setGridHeader() {
      return new Promise(resovle => {
        this.gridOptionss.header = [
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000005001'), 
            dataField: 'budgetTypeCd', 
            width: '300', 
            renderer: {
              type: "DropDownListRenderer",
              listFunction: (rowIndex, columnIndex, item, dataField) => {
                return this.budgetTypeItems;
              },
              // list: this.budgetTypeItems,
              keyField: "code", // key 에 해당되는 필드명
              valueField: "codeNm", // value 에 해당되는 필드명
              descendants: ["budgetActMstNo"], // 자손 필드들
              descendantDefaultValues: [this.$comm.getLangSpecInfoLabel('L0000003394')], // 변경 시 자손들에게 기본값 지정
              // disabledFunction: function (rowIndex, columnIndex, value, item, dataField) {
              //   console.log(item)
              //   return item.budgetTypeNm === '안전' ? true : false;
              // }
              disabledFunction: () => {
                return this.checkDisabled;
              },
            }
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000005004'), 
            dataField: 'budgetClsCd', 
            width: '300', 
            renderer: {
              type: "DropDownListRenderer",
              listFunction: (rowIndex, columnIndex, item, dataField) => {
                return this.budgetClsItems;
              },
              keyField: "code", // key 에 해당되는 필드명
              valueField: "codeNm", // value 에 해당되는 필드명
              disabledFunction: () => {
                return this.checkDisabled;
              },
            }
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000005003'), 
            dataField: 'budgetActMstNo', 
            width: '300', 
            renderer: {
              type: "DropDownListRenderer",
              listFunction: (rowIndex, columnIndex, item, dataField) => {
                item.budgetActItems = this.budgetActItems.filter(
                  (items) => items.budgetTypeCd === item.budgetTypeCd
                );

                return item.budgetActItems;
              },
              keyField: "budgetActMstNo", // key 에 해당되는 필드명
              valueField: "budgetActNm", // value 에 해당되는 필드명
              disabledFunction: () => {
                return this.checkDisabled;
              },
            }
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000005036'), 
            dataField: 'orgAmt', 
            width: '300', 
            editable: !this.checkDisabled,
            editRenderer: {
              type: 'InputEditRenderer', 
            }, 
          },
        ];
        resovle();
      });
    },
    getDetail() {
      this.$http.url = this.$format(
        selectConfig.mgt.budgetManagement.budgetAct.budgetActDept.get.url,
        this.budgetActDept.budgetActDeptNo,
        this.budgetActDept.budgetActNo
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          if (_result.data) {
            this.budgetActDept = this.$_.clone(_result.data);
            this.gridOptions.data = this.$_.clone(
              this.budgetActDept.mgtBudgetActDeptItems
            );
            this.gridOptions.data = this.gridOptions.data.map((row) => {
              let rowData = row;

              rowData.budgetActItems = this.$_.cloneDeep(this.budgetActItems);

              if (rowData.budgetTypeCd) {
                rowData.budgetActItems = this.$_.cloneDeep(
                  this.budgetActItems
                ).filter((item) => item.budgetTypeCd === rowData.budgetTypeCd);

                rowData.budgetActItems.splice(0, 0, {
                  budgetActMstNo: null,
                  budgetActNm: this.$comm.getLangSpecInfoLabel('L0000003394'), // 선택하세요
                });
              }

              return rowData;
            });
            this.YAuiGrid.setGridData(this.gridOptions.data);

            // 결재중/결재완료일 경우 수정 불가능 (결재요청/결재완료창)
            // 읽기모드일 경우 수정 불가능
            if (this.apprState && !this.popupParam.apprFlag) {
              this.disabled = true;
            }
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    getDetailByStatInfo() {
      this.$http.url =
        selectConfig.mgt.budgetManagement.budgetAct.budgetActDept.getByStat.url;
      this.$http.type = 'GET';
      this.$http.param = {
        year: this.budgetActDept.year,
        plantCd: this.budgetActDept.plantCd,
        deptCd: this.budgetActDept.deptCd,
      };
      this.$http.request(
        (_result) => {
          if (_result.data) {
            this.budgetActDept = this.$_.clone(_result.data);
            this.gridOptions.data = this.$_.clone(
              this.budgetActDept.mgtBudgetActDeptItems
            );

            this.gridOptions.data = this.gridOptions.data.map((row) => {
              let rowData = row;

              rowData.budgetActItems = this.$_.cloneDeep(this.budgetActItems);

              if (rowData.budgetTypeCd) {
                rowData.budgetActItems = this.$_.cloneDeep(
                  this.budgetActItems
                ).filter((item) => item.budgetTypeCd === rowData.budgetTypeCd);

                rowData.budgetActItems.splice(0, 0, {
                  budgetActMstNo: null,
                  budgetActNm: this.$comm.getLangSpecInfoLabel('L0000003394'), // 선택하세요
                });
              }

              return rowData;
            });
            this.YAuiGrid.setGridData(this.gridOptions.data);
            this.disabled = true;
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    getComboItems(type) {
      const url =
        type === 'budgetType'
          ? selectConfig.mgt.budgetAct.list.url
          : selectConfig.mgt.budgetAct.budgetActMsts.url;

      // 예산 분류 아이템 조회일 경우 useYn 추가
      if (type === 'budgetType') {
        this.$http.param = {
          useYn: 'Y',
        };
      }

      return new Promise((resolve, reject) => {
        this.$http.url = url;
        this.$http.type = 'GET';
        this.$http.request(
          (_result) => {
            if (_result.data) {
              if (type === 'budgetType') {
                // 예산분류 목록       
                this.$comm.getComboItems('MICS3', false).then((_result) => {
                  this.$_.forEach(_result, item => {
                    if (item.useYn === 'Y') {
                      this.budgetTypeItems.push(item)
                    }                    
                  });
                });

              } else {
                // 예산계정 목록
                this.budgetActItems = this.$_.clone(_result.data);
                this.budgetActItems.splice(0, 0, {
                  budgetActMstNo: null,
                  budgetActNm: this.$comm.getLangSpecInfoLabel('L0000003394'), // 선택하세요
                });
              }

              let nowDate = new Date();
              this.tempKey = nowDate.getMilliseconds();

              resolve();
            }
          },
          (_error) => {
            window.getApp.$emit('APP_REQUEST_ERROR');
            reject(_error);
          }
        );
      });
    },
    btnSave() {
      let promises = [
        { func: this.checkValidation },
        { func: this.confirm, param: 'M0000000011' }, // 저장하시겠습니까?
        { func: this.saveData },
      ];

      this.$comm.orderedPromise(promises);
    },
    btnDelete() {
      let promises = [
        { func: this.checkValidation, param: 'delete' },
        { func: this.confirm, param: 'M0000000012' }, // 삭제하시겠습니까?
        { func: this.deleteData },
      ];

      this.$comm.orderedPromise(promises);
    },
    btnAppr() {
      // MG-BD-01
      let promises = [
        { func: this.checkValidation },
        { func: this.confirm, param: 'M0000000250' }, // 결재요청 하기 전 입력된 값을 저장합니다. 진행하시겠습니까?
        { func: this.saveData, param: 'appr' },
        { func: this.apprData },
      ];

      this.$comm.orderedPromise(promises);
    },
    /** validation checking **/
    checkValidation(flag) {
      // 값 유효성 체크
      return new Promise((_resolve) => {
        if (flag === 'delete') {
          // 삭제일 경우
          // 예산계정중 한건이라도 집행되었을 경우 삭제불가
          let execCnt = this.YAuiGrid.getGridData().filter(
            (row) => row.execYn === 'Y'
          ).length; // 집행중인 건수

          if (execCnt > 0) {
            window.getApp.$emit('ALERT', {
              title: 'L0000003395', // 안내
              message: 'L0000005112', // 예산집행중인 계정이 있어 삭제할 수 없습니다.
              type: 'info',
            });
            return;
          }

          _resolve(true);
        } else {
          // 저장/결재요청전 저장일 경우
          // 유효성 검사 체크
          this.$validator
            .validateAll()
            .then((_result) => {
              if (_result) {
                let saveFlag = true;

                if (!this.YAuiGrid.getGridData() || !this.YAuiGrid.getGridData().length) {
                  window.getApp.$emit('ALERT', {
                    title: 'L0000003395', // 안내
                    message: 'L0000005271', // 대상부서별 예산계정 정보를 등록해주세요.
                    type: 'info',
                  });
                  return;
                }
                this.YAuiGrid.getGridData().every((item, idx) => {
                  // 예산분류 유효성 체크
                  if (!item.budgetTypeCd) {
                    window.getApp.$emit('ALERT', {
                      title: 'L0000003395', // 안내
                      message: this.$comm.getLangSpecInfoLabel('L0000005324', {
                        s1: idx + 1,
                      }), // {s1}행의 예산분류를 선택해주세요.
                      type: 'warning',
                    });
                    saveFlag = false;
                    return false;
                  }

                  // 예산구분 유효성 체크
                  if (!item.budgetClsCd) {
                    window.getApp.$emit('ALERT', {
                      title: 'L0000003395', // 안내
                      message: this.$comm.getLangSpecInfoLabel('L0000005325', {
                        s1: idx + 1,
                      }), // {s1}행의 예산구분을 선택해주세요.
                      type: 'warning',
                    });
                    saveFlag = false;
                    return false;
                  }

                  // 예산계정 유효성 체크
                  if (!item.budgetActMstNo || item.budgetActMstNo === '선택하세요') {
                    window.getApp.$emit('ALERT', {
                      title: 'L0000003395', // 안내
                      message: this.$comm.getLangSpecInfoLabel('L0000005326', {
                        s1: idx + 1,
                      }), // {s1}행의 예산계정을 선택해주세요.
                      type: 'warning',
                    });
                    saveFlag = false;
                    return false;
                  }

                  // 편성금액 유효성 체크
                  if (!item.orgAmt) {
                    window.getApp.$emit('ALERT', {
                      title: 'L0000003395', // 안내
                      message: this.$comm.getLangSpecInfoLabel('L0000005327', {
                        s1: idx + 1,
                      }), // {s1}행의 편성금액을 입력해주세요.
                      type: 'warning',
                    });
                    saveFlag = false;
                    return false;
                  }

                  return true;
                });

                if (!saveFlag) {
                  return;
                }

                _resolve(true);
              } else {
                // 년도 유효성 체크
                if (!this.budgetActDept.execDt) {
                  window.getApp.$emit('ALERT', {
                    title: 'L0000003395', // 안내
                    message: 'M0000001449', // 연도를 선택해주세요.
                    type: 'info',
                  });
                  return;
                }

                // 사업장 유효성 체크
                if (!this.budgetActDept.execDt) {
                  window.getApp.$emit('ALERT', {
                    title: 'L0000003395', // 안내
                    message: 'M0000000066', // 사업장을 선택하세요.
                    type: 'info',
                  });
                  return;
                }

                // 대상부서 유효성 체크
                if (!this.budgetActDept.execDt) {
                  window.getApp.$emit('ALERT', {
                    title: 'L0000003395', // 안내
                    message: 'M0000001308', // 대상부서를 선택해주세요.
                    type: 'info',
                  });
                  return;
                }
              }
            })
            .catch((e) => {
              window.getApp.$emit(
                'APP_VALID_ERROR',
                'M0000000876' // 유효성 검사도 에러가 발생하였습니다.
              );
            });
        }
      });
    },
    confirm(msg) {
      // 저장
      return new Promise((_resolve) => {
        window.getApp.$emit('CONFIRM', {
          title: 'L0000003321', // 확인
          message: msg,
          type: 'info',
          confirmCallback: () => {
            this.budgetActDept.mgtBudgetActDeptItems = this.YAuiGrid.getGridData();
            this.budgetActDept.deleteMgtBudgetActDeptItems = this.deleteList;

            // 예산편성부서계정 작성자 정보 저장
            this.budgetActDept.mgtBudgetActDeptItems.map((item) => {
              item.createUserId = this.$store.getters.token;
              item.createDeptCd = this.$store.getters.deptCd;
              item.createDeptNm = this.$store.getters.deptNm;
              item.createPositionCd = this.$store.getters.positionCd;
              item.createPositionNm = this.$store.getters.positionNm;

              item.updateUserId = this.$store.getters.token;
              item.updateDeptCd = this.$store.getters.deptCd;
              item.updateDeptNm = this.$store.getters.deptNm;
              item.updatePositionCd = this.$store.getters.positionCd;
              item.updatePositionNm = this.$store.getters.positionNm;

              return item;
            });

            // 상태
            this.budgetActDept.stateCd =
              this.budgetActDept.stateCd === 'STATE1'
                ? 'STATE2'
                : this.budgetActDept.stateCd; // 미작성일 경우 작성중으로 변경

            if (this.budgetActDept.budgetActNo) {
              this.budgetActDept.updateUserId = this.$store.getters.token;
              this.budgetActDept.updateDeptCd = this.$store.getters.deptCd;
              this.budgetActDept.updateDeptNm = this.$store.getters.deptNm;
              this.budgetActDept.updatePositionCd =
                this.$store.getters.positionCd;
              this.budgetActDept.updatePositionNm =
                this.$store.getters.positionNm;
            } else {
              this.budgetActDept.createUserId = this.$store.getters.token;
              this.budgetActDept.createDeptCd = this.$store.getters.deptCd;
              this.budgetActDept.createDeptNm = this.$store.getters.deptNm;
              this.budgetActDept.createPositionCd =
                this.$store.getters.positionCd;
              this.budgetActDept.createPositionNm =
                this.$store.getters.positionNm;
            }

            _resolve(true);
          },
          cancelCallback: () => {
            _resolve(false);
          },
        });
      });
    },
    saveData(flag) {
      return new Promise((_resolve) => {
        let url =
          transactionConfig.mgt.budgetManagement.budgetAct.budgetActDept.save
            .url;
        let type = this.budgetActDept.budgetActDeptNo ? 'PUT' : 'POST';

        this.$http.url = url;
        this.$http.type = type;
        this.$http.param = this.budgetActDept;
        this.$http.request(
          (_result) => {
            this.budgetActDept = this.$_.clone(_result.data);
            this.getDetail();

            if (flag !== 'appr') {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395', // 안내
                message: 'M0000000006', // 저장되었습니다.
                type: 'success',
              });
            }

            this.deleteList = [];

            _resolve(true);
          },
          (_error) => {
            window.getApp.$emit('APP_REQUEST_ERROR', _error);
          }
        );
      });
    },
    deleteData() {
      return new Promise((_resolve) => {
        this.$http.url = this.$format(
          transactionConfig.mgt.budgetManagement.budgetAct.budgetActDept.delete
            .url,
          this.budgetActDept.budgetActDeptNo,
          this.budgetActDept.budgetActNo
        );
        this.$http.type = 'DELETE';
        this.$http.request(
          (_result) => {
            window.getApp.$emit('ALERT', {
              title: 'L0000003395', // 안내
              message: 'M0000000007', // 삭제되었습니다.
              type: 'success',
            });

            this.btnClosePopup();

            _resolve(true);
          },
          (_error) => {
            window.getApp.$emit('APP_REQUEST_ERROR', _error);
          }
        );
      });
    },
    apprData() {
      return new Promise((_resolve) => {
        this.popupOptions.target = () =>
          import(`${'@/pages/manage/appr/comApprRequest.vue'}`);
        this.popupOptions.title = 'L0000003418'; // 결재요청
        this.popupOptions.visible = true;
        this.popupOptions.closeCallback = this.closeApprPop;
        this.popupOptions.width = '80%';
        this.popupOptions.param = {
          apprBizCd: 'MG-BD-01',
          apprRqstNo: this.budgetActDept.apprRqstNo,
          apprParams: {
            budgetActDeptNo: this.budgetActDept.budgetActDeptNo,
            budgetActNo: this.budgetActDept.budgetActNo,
          },
        };
      });
    },
    closeApprPop(data) {
      if (data.resultFlag) {
        this.budgetActDept.apprRqstNo = data.apprRqstNo;
        this.budgetActDept.stepCd = 'BAPSA'; // 결재중
        this.disabled = true;
      }
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
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

    /** Button Event **/
    // 예산편성 대상부서 팝업
    btnAddItem() {
      let row = {
        budgetTypeCd: null, // 예산분류코드
        budgetTypeNm: null, // 예산분류
        budgetClsCd: null, // 예산구분코드
        budgetClsNm: null, // 예산구분
        budgetActMstNo: null, // 예산계정번호
        budgetActCd: null, // 예산계정코드
        budgetActNm: null, // 예산계정
        orgAmt: 0, // 편성금액(원)
        budgetActItems: this.$_.cloneDeep(this.budgetActItems), // 예산계정 목록
      };

      this.gridOptions.data.push(row);
    },
    closeDeptPopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;

      if (data && data !== 'CLOSE') {
        let budgetActDepts = this.gridOptions.data;

        data.forEach((dept) => {
          let budgetActDept = {
            plantCd: dept.plantCd,
            plantNm: dept.plantNm,
            deptCd: dept.deptCd,
            deptNm: dept.deptNm,
            procStepCd: 'MBS01', // 편성 (대상부서 지정 팝업에서는 편성으로 고정)
            stateCd: 'STATE1', // 미작성 (대상부서 지정 팝업에서는 미작성상태로 고정)
            remark: '',
          };

          // 중복체크후 push
          if (
            budgetActDepts.findIndex((item) => item.deptCd === dept.deptCd) < 0
          ) {
            budgetActDepts.push(budgetActDept);
          }
        });
      }
    },
    // 예산계정 행 삭제 버튼
    btnDeleteItem() {
      if (!this.selectedValue || this.selectedValue.length === 0) {
        // 체크 항목 미존재 시
        window.getApp.$emit('ALERT', {
          title: 'L0000003395' /* 안내 */,
          message: 'M0000000057' /* 삭제할 항목을 선택해주세요. */,
          type: 'warning',
        });
        return;
      }

      let isProceeding = false;

      this.selectedValue.forEach((item) => {
        isProceeding = isProceeding || item.budgetExecNo; // 삭제 선택한 항목중 미작성건이 아닌 경우
      });

      // 선택한 항목중 미작성건이 아닌 경우 삭제불가
      if (isProceeding) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395' /* 안내 */,
          message: 'L0000005113' /* 예산이 집행되어 삭제할 수 없습니다. */,
          type: 'warning',
        });
        return;
      }

      this.gridOptions.data = this.gridOptions.data.filter(
        (item) => !this.selectedValue.includes(item)
      );

      this.selectedValue.forEach((item) => {
        // 예산편성관리번호를 가지고 있으면서 deleteList에 없을 경우에만 deleteList에 추가함
        if (
          item.budgetActDeptNo &&
          item.budgetActDeptItemNo &&
          this.deleteList.findIndex(
            (data) =>
              data.budgetActDeptNo === item.budgetActDeptNo &&
              data.budgetActDeptItemNo === item.budgetActDeptItemNo
          ) < 0
        ) {
          this.deleteList.push(item);
        }
      });
    },
    btnClosePopup() {
      // 부모창에 값 전달
      this.$emit('closePopup', { success: true });
    },
    datachange(headerName, scope) {
      let rowData = scope.row;

      rowData.budgetActItems = this.$_.cloneDeep(this.budgetActItems);

      if (rowData.budgetTypeCd) {
        rowData.budgetActItems = rowData.budgetActItems.filter(
          (item) => item.budgetTypeCd === rowData.budgetTypeCd
        );

        rowData.budgetActItems.splice(0, 0, {
          budgetActMstNo: null,
          budgetActNm: this.$comm.getLangSpecInfoLabel('L0000003394'), // 선택하세요
        });
      }

      if (rowData.budgetClsCd) {
        rowData.budgetActItems = rowData.budgetActItems.filter(
          (item) => item.budgetClsCd === rowData.budgetClsCd
        );

        rowData.budgetActItems.splice(0, 0, {
          budgetActMstNo: null,
          budgetActNm: this.$comm.getLangSpecInfoLabel('L0000003394'), // 선택하세요
        });
      }

      if (
        rowData.budgetActItems.findIndex(
          (item) => item.budgetActMstNo === rowData.budgetActMstNo
        ) < 0
      ) {
        rowData.budgetActMstNo = null;
      }

      let nowDate = new Date();
      this.tempKey = nowDate.getMilliseconds();
    },
    inputText(text, headerName, scope) {
      let rowData = scope.row;
      let budgetActMst = null;

      switch (headerName) {
        case 'budgetTypeCd':
          rowData.budgetTypeNm = text;
          break;
        case 'budgetClsCd':
          rowData.budgetClsNm = text;
          break;
        case 'budgetActMstNo':
          rowData.budgetActNm = text;
          budgetActMst = rowData.budgetActItems.find(
            (item) => item.budgetActMstNo === rowData.budgetActMstNo
          );
          if (budgetActMst) {
            rowData.budgetActCd = budgetActMst.budgetActCd;
          }
          break;
      }
    },
    /** /Button Event **/
  },
};
</script>
