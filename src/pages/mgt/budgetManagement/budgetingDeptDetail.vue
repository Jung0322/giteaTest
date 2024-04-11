<!--
  목적 : 경영>SHE예산 관리>예산편성 관리>대상부서지정 팝업
  Detail : 예산편성 관리 대상부서지정 팝업화면
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
              <!-- 예산편성 대상부서지정 -->
              <y-label
                label="L0000005045"
                icon="user-edit"
                color-class="cutstom-title-color"
              />
              <div slot="buttonGroup" class="float-right mb-1">
                <!-- 저장 -->
                <y-btn
                  v-if="editable"
                  title="L0000002474"
                  color="orange"
                  @btnClicked="btnSave"
                />
                <!-- 닫기 -->
                <y-btn title="L0000000881" @btnClicked="btnClosePopup" />
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
                  label="L0000000829"
                  type="year"
                  name="year"
                  :default="budgetAct.year"
                  v-model="budgetAct.year"
                  v-validate="'required'"
                  :state="validateState('year')"
                ></y-datepicker>
              </b-col>
              <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
                <!-- 사업장 -->
                <y-plant
                  type="edit"
                  :editable="editable"
                  name="plantCd"
                  v-model="budgetAct.plantCd"
                  v-validate="'required'"
                  :state="validateState('plantCd')"
                ></y-plant>
              </b-col>
            </b-row>
          </b-card>
        </b-col>
      </b-col>
    </b-row>
    <b-row class="grid-height grid-box">
      <b-col sm="12" class="h100p">
        <!-- 예산편성 부서 -->
        <y-auigrid
          ref="yAuiGrid"
          :editable="editable"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000005046')"
          :useExcelExport="false"
          :enableSorting="true"
          :showGridSetSave="true"
          :useContextMenu="true"
          :enableRightDownFocus="true"
          :showRowCheckColumn="true"
          :showGridCtrl="true"
          :softRemoveRowMode="false"
          @btnAddRow="btnAddRow"
          @btnDelRow="btnDelRow"
          @cellEditEnd="cellEditEndHandler"
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
  name: 'budgeting-dept-detail',
  props: {
    popupParam: {
      default: {
        budgetActNo: 0, // 예산편성번호
      },
    },
  },
  data() {
    return {
      editable: false, // 수정 가능 여부
      budgetAct: {
        // 예산편성
        budgetActNo: 0, // 예산편성번호
        year: null, // 년도
        plantCd: null, // 사업장코드
        createUserId: null, // 등록자ID
        createDt: null, // 등록일시
        updateUserId: null, // 수정자ID
        updateDt: null, // 수정일시
        createDeptNm: null, // 등록자부서명
        createDeptCd: null, // 등록자부서코드
        updateDeptNm: null, // 수정자부서명
        updateDeptCd: null, // 수정자부서코드
        createPositionNm: null, // 등록자직위명
        createPositionCd: null, // 등록자직위코드
        updatePositionNm: null, // 수정자직위명
        updatePositionCd: null, // 수정자직위코드
        mgtBudgetActDepts: [], // 예산편성부서 목록
        deleteMgtBudgetActDepts: [], // 예산편성부서 삭제목록
      },
      gridOptions: {
        header: [],
        data: [],
        btns: [],
        height: '450',
      },
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
      budgetActNo: 0, // 예산편성번호 (저장 후 지정됨)
      YAuiGrid: null,
    };
  },
  watch: {
    'budgetAct.year': {
      handler: function (newVal, oldVal) {
        if (!this.budgetActNo) {
          this.getDetailByYearPlant();
        }
      },
    },
    'budgetAct.plantCd': {
      handler: function (newVal, oldVal) {
        if (!this.budgetActNo) {
          this.getDetailByYearPlant();
        }
      },
    },
  },
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;
  },
  beforeDestory() {},
  methods: {
    init() {
      this.editable = this.$route.meta.editable;

      this.budgetAct.year = this.$comm.getThisYear();

      // 그리드 헤더 설정

      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001415'),
          dataField: 'plantNm',
          width: '33%',
          style: 'left-align',
          editRenderer: {
            type: 'InputEditRenderer',
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000927'),
          dataField: 'deptNm',
          width: '33%',
          style: 'left-align',
          editRenderer: {
            type: 'InputEditRenderer',
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001360'),
          dataField: 'remark',
          width: '34%',
          style: 'left-align',
          editRenderer: {
            type: 'InputEditRenderer',
          },
        },
      ];

      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000002892'),
          color: 'orange',
          btnClicked: 'btnAddRow',
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001495'),
          color: 'red',
          btnClicked: 'btnDelRow',
        },
      ];

      if (this.popupParam.budgetActNo) {
        this.budgetAct.budgetActNo = this.popupParam.budgetActNo;
        this.getDetail();
      }
    },
    getDetail() {
      this.$http.url = this.$format(
        selectConfig.mgt.budgetManagement.budgetAct.get.url,
        'N'
      );
      this.$http.type = 'GET';
      this.$http.param = {
        budgetActNo: this.budgetAct.budgetActNo,
      };
      this.$http.request(
        (_result) => {
          if (_result.data) {
            this.budgetAct = this.$_.clone(_result.data);
            this.YAuiGrid.setGridData(
              this.$_.clone(this.budgetAct.mgtBudgetActDepts)
            );
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    getDetailByYearPlant() {
      // 사업장/년도 중 한개라도 없을 경우 return
      if (!this.budgetAct.year || !this.budgetAct.plantCd) return;

      this.$http.url = this.$format(
        selectConfig.mgt.budgetManagement.budgetAct.get.url,
        'Y'
      );
      this.$http.type = 'GET';
      this.$http.param = {
        year: this.budgetAct.year,
        plantCd: this.budgetAct.plantCd,
      };
      this.$http.request(
        (_result) => {
          if (_result.data.budgetActNo) {
            this.budgetAct = this.$_.clone(_result.data);
            this.YAuiGrid.setGridData(
              this.$_.clone(this.budgetAct.mgtBudgetActDepts)
            );
          } else {
            this.budgetAct.budgetActNo = 0;
            this.YAuiGrid.setGridData([]);
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    btnSave() {
      let promises = [
        { func: this.checkValidation },
        { func: this.confirm, param: 'M0000000011' }, // 저장하시겠습니까?
        { func: this.saveData },
      ];

      this.$comm.orderedPromise(promises);
    },
    /** validation checking **/
    checkValidation() {
      // 값 유효성 체크
      return new Promise((_resolve) => {
        // 유효성 검사 체크
        this.$validator
          .validateAll()
          .then((_result) => {
            if (_result) {
              if (!this.YAuiGrid.getGridData() === 0) {
                window.getApp.$emit('ALERT', {
                  title: 'L0000003395', // 안내
                  message: 'L0000005138', // 대상부서를 한건이상 등록해주세요.
                  type: 'warning',
                });
                return;
              }

              _resolve(true);
            } else {
              // 년도 유효성 체크
              if (!this.budgetAct.execDt) {
                window.getApp.$emit('ALERT', {
                  title: 'L0000003395', // 안내
                  message: 'M0000001449', // 연도를 선택해주세요.
                  type: 'info',
                });
                return;
              }

              // 사업장 유효성 체크
              if (!this.budgetAct.execDt) {
                window.getApp.$emit('ALERT', {
                  title: 'L0000003395', // 안내
                  message: 'M0000000066', // 사업장을 선택하세요.
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
            if (this.budgetAct.budgetActNo) {
              this.budgetAct.updateUserId = this.$store.getters.token;
              this.budgetAct.updateDeptCd = this.$store.getters.deptCd;
              this.budgetAct.updateDeptNm = this.$store.getters.deptNm;
              this.budgetAct.updatePositionCd = this.$store.getters.positionCd;
              this.budgetAct.updatePositionNm = this.$store.getters.positionNm;
            } else {
              this.budgetAct.createUserId = this.$store.getters.token;
              this.budgetAct.createDeptCd = this.$store.getters.deptCd;
              this.budgetAct.createDeptNm = this.$store.getters.deptNm;
              this.budgetAct.createPositionCd = this.$store.getters.positionCd;
              this.budgetAct.createPositionNm = this.$store.getters.positionNm;
            }

            this.budgetAct.mgtBudgetActDepts = this.YAuiGrid.getGridData();
            this.budgetAct.deleteMgtBudgetActDepts = this.deleteList;

            _resolve(true);
          },
          cancelCallback: () => {
            _resolve(false);
          },
        });
      });
    },
    saveData() {
      return new Promise((_resolve) => {
        let url = transactionConfig.mgt.budgetManagement.budgetAct.save.url;
        let type = this.budgetAct.budgetActNo ? 'PUT' : 'POST';

        this.$http.url = url;
        this.$http.type = type;
        this.$http.param = this.budgetAct;
        this.$http.request(
          (_result) => {
            this.budgetAct = this.$_.clone(_result.data);
            this.budgetActNo = this.budgetAct.budgetActNo;
            this.getDetail();

            window.getApp.$emit('ALERT', {
              title: 'L0000003395', // 안내
              message: 'M0000000006', // 저장되었습니다.
              type: 'success',
            });

            this.deleteList = [];

            _resolve(true);
          },
          (_error) => {
            window.getApp.$emit('APP_REQUEST_ERROR', _error);
          }
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

    /** Button Event **/
    // 예산편성 대상부서 팝업
    btnAddRow() {
      this.popupOptions.top = '10px';
      this.popupOptions.width = '60%';
      this.popupOptions.target = () =>
        import(`${'@/pages/baseInfo/deptManage/deptSearchPopup.vue'}`);
      this.popupOptions.title = 'L0000001293'; // '부서 선택';
      this.popupOptions.visible = true;
      this.popupOptions.param = {
        plantCd: this.budgetAct.plantCd,
        multiple: true,
        isSubDeptSelection: false,
      };

      this.popupOptions.closeCallback = this.closeDeptPopup;
    },
    closeDeptPopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;

      if (data && data !== 'CLOSE') {
        const gridData = this.YAuiGrid.getGridData();

        this.$_.forEach(data, (dept) => {
          let idx = this.$_.findIndex(
            gridData,
            (u) => u.deptCd === dept.deptCd
          );
          if (idx < 0) {
            const newObj = {
              plantCd: dept.plantCd,
              plantNm: dept.plantNm,
              deptCd: dept.deptCd,
              deptNm: dept.deptNm,
              procStepCd: 'MBS01', // 편성 (대상부서 지정 팝업에서는 편성으로 고정)
              stateCd: 'STATE1', // 미작성 (대상부서 지정 팝업에서는 미작성상태로 고정)
              stepCd: 'BAPSB', // 결재상태 (결재요청전)
              remark: '',
            };
            gridData.push(newObj);
            this.YAuiGrid.addRow(newObj);
          }
        });
        this.budgetAct.mgtBudgetActDepts = gridData;
      }
    },
    cellEditEndHandler() {},
    // 예산계정 행 삭제 버튼
    btnDelRow() {
      const selectedRows = this.YAuiGrid.getCheckedRowItemsAll();
      if (selectedRows.length <= 0) {
        // 체크 항목 미존재 시
        window.getApp.$emit('ALERT', {
          title: 'L0000003395' /* 안내 */,
          message: 'M0000000057' /* 삭제할 항목을 선택해주세요. */,
          type: 'warning',
        });
        return;
      }

      let isProceeding = false;

      this.$_.forEach(selectedRows, (item) => {
        isProceeding = isProceeding || item.stateCd !== 'STATE1'; // 삭제 선택한 항목중 미작성건이 아닌 경우
      });
      // 선택한 항목중 미작성건이 아닌 경우 삭제불가
      if (isProceeding) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395' /* 안내 */,
          message: 'L0000005077' /* 금액이 편성되어 삭제할 수 없습니다. */,
          type: 'warning',
        });
        return;
      }
      let gridData = this.YAuiGrid.getGridData();

      this.$_.forEach(selectedRows, (item) => {
        gridData = this.$_.reject(gridData, { deptCd: item.deptCd });
      });
      console.log('22', gridData);

      this.YAuiGrid.setGridData(gridData);

      selectedRows.forEach((item) => {
        // 예산편성관리번호를 가지고 있으면서 deleteList에 없을 경우에만 deleteList에 추가함
        if (
          item.budgetActNo &&
          item.budgetActDeptNo &&
          this.deleteList.findIndex(
            (data) =>
              data.budgetActNo === item.budgetActNo &&
              data.budgetActDeptNo === item.budgetActDeptNo
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
    /** /Button Event **/
  },
};
</script>
