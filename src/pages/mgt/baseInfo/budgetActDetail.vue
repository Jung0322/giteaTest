<!--
  목적 : 경영>기준정보>예산계정 관리
  Detail : 예산분류별 계정 관리 등록 화면
  *
  examples: 코드마스터 관리 상세/수정/등록
  *
  -->
<template>
  <b-container fluid>
    <b-row ref="detailBox">
      <b-col sm="12">
        <b-col sm="12" class="px-0">
          <b-row>
            <b-col sm="12">
              <!-- 예산계정 등록 -->
              <y-label
                label="L0000005005"
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
              <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
                <!-- 예산분류 코드 -->
                <y-text
                  :width="8"
                  :editable="editable"
                  :required="true"
                  :disabled="updateMode"
                  :maxlength="codeGroup.codeLength"
                  ui="bootstrap"
                  label="L0000005008"
                  name="code"
                  v-model="codeMaster.code"
                  v-validate="'required'"
                  :state="validateState('code')"
                />
              </b-col>
              <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
                <!-- 예산분류 -->
                <y-text
                  :width="8"
                  :editable="editable"
                  :required="true"
                  :maxlength="30"
                  ui="bootstrap"
                  label="L0000005001"
                  name="codeNm"
                  v-model="codeMaster.codeNm"
                  v-validate="'required'"
                  :state="validateState('codeNm')"
                />
              </b-col>
              <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
                <!-- 사용여부 -->
                <y-switch
                  :width="8"
                  :editable="editable"
                  true-value="Y"
                  false-value="N"
                  ui="bootstrap"
                  label="L0000001439"
                  name="useYn"
                  selectText="L0000001440"
                  unselectText="L0000001063"
                  v-model="codeMaster.useYn"
                />
              </b-col>
              <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
                <!-- 정렬순서 -->
                <y-number
                  :width="8"
                  :editable="editable"
                  :maxlength="5"
                  :hasSeperator="false"
                  :isPositive="true"
                  ui="bootstrap"
                  label="L0000002601"
                  name="sortOrder"
                  v-model="codeMaster.sortOrder"
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
             추가 
            <y-btn
              v-if="editable"
              title="L0000002892"
              color="orange"
              @btnClicked="btnAddItemCheck"
            />
             삭제 
            <y-btn
              v-if="editable"
              title="L0000001495"
              color="red"
              @btnClicked="btnDeleteItemCheck"
            />
          </div>
           예산계정 목록
          <y-data-table
            :key="tempKey"
            label="L0000005007"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            :editable="editable"
            :popMode="true"
            v-model="selectedValue"
          >
            <el-table-column
              align="center"
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
          :editable="editable"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000005007')"
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
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
import { resolve } from 'q';
export default {
  /** attributes: name, components, props, data **/
  name: 'y-code-master-detail',
  props: {
    popupParam: {
      default: {
        codeGroupCd: 'MICS3', // 경영 투자항목관리 분류코드
        codeNm: '', // 대분류 코드명
        code: '', // 대분류 코드
      },
    },
  },
  data() {
    return {
      code: '', // 대분류 코드
      codeNm: '', // 대분류 코드명
      codeGroupCd: 'MICS3', // 대분류 그룹코드
      editable: false, // 수정 가능 여부
      codeMaster: {
        // 대분류 코드 정보
        codeGroupCd: 'MICS3',
        code: '',
        codeNm: '',
        sortOrder: 0,
        useYn: 'Y',
        createUserId: '',
        createUserNm: '',
        createDt: '',
        updateUserId: '',
        updateUserNm: '',
        updateDt: '',
        investItems: [], // 중분류 목록
      },
      codeGroup: {
        codeLength: 5,
      },
      gridOptions: {
        name: 'budgetActDetail',
        btns: [],
        header: [],
        data: [],
        height: '250',
      },
      YAuiGrid: null,
      selectedValue: [], // 체크된 중분류 목록

      createMode: true, // 투자항목 신규등록 여부
      updateMode: false, // 투자항목 수정 여부

      insertUrl: '', // 신규 등록 버튼 /api/manage/codemaster
      editUrl: '', // 저장(수정)버튼 /api/manage/codemaster
      detailUrl: '', // 대분류 코드 정보(중분류 목록 포함) 조회 /api/manage/codemaster/codemaster/{0}/{1}/{2}
      duplicationCheckUrl: '', // 동일 코드(그룹코드, 중분류코드) 존재 체크 /api/manage/codemaster/duplicationCheck/{0}
      mgtBdtClsItems: [], // 예산구분 코드 아이템
      tempKey: null, // 그리드 렌더링 키(키가 바뀔때마다 새로 rendering하는 것을 이용하기 위함)
      deleteList: [], // 삭제할 예산계정 목록
    };
  },
  watch: {
    'popupParam.code': function (newValue, oldValue) {
      // props속성이 변경될 경우
      this.init();
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
    this.mountInit();
  },
  beforeDestory() {},
  methods: {
    init() {
      if (this.popupParam.code) {
        this.code = this.popupParam.code; // 대분류 코드
        this.codeNm = this.popupParam.codeNm; // 대분류 코드명
        this.codeGroupCd = this.popupParam.codeGroupCd;
      }
      this.editable = this.$route.meta.editable;

      this.saveUrl = transactionConfig.mgt.budgetAct.save.url; // 신규 등록 버튼
      this.detailUrl = selectConfig.mgt.budgetAct.detail.url; // 예산분류 코드 및 예산계정 목록 조회
      this.duplicationCheckUrl =
        selectConfig.codeMaster.getDuplicationCheck.url; // 동일 코드(그룹코드, 예산분류코드) 존재 체크

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
    },
    mountInit() {
      const promise1 = this.$comm
        .getComboItems('MGT_BDT_CLS', false)
        .then((_result) => {
          this.mgtBdtClsItems = _result;
          let nowDate = new Date();
          this.tempKey = nowDate.getMilliseconds();
        });
      Promise.all([promise1]).then(() => {
        this.setGridHeader().then(() => {
          this.getDetail(); // 코드 정보 db 조회
        });
      });
    },
    getDetail() {
      // 코드 정보 조회
      if (!this.code) return;
      this.$http.url = this.$format(
        this.detailUrl,
        this.codeGroupCd,
        this.code // 대분류 코드
      );
      this.$http.type = 'get';
      this.$http.request(
        (_result) => {
          this.createMode = false;
          this.updateMode = true;
          this.codeMaster = _result.data.mgtMgBudgetAct;
          this.YAuiGrid.setGridData(_result.data.mgtMgBudgetActMsts);
        },
        (_error) => {
          window.getApp.$emit(
            'APP_REQUEST_ERROR',
            'M0000000016' // 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.
          );
        }
      );
    },
    setGridHeader() {
      return new Promise((resolve) => {
        this.gridOptions.header = [
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000005001'),
            dataField: 'budgetClsCd',
            width: '300',
            renderer: {
              type: 'DropDownListRenderer',
              listFunction: (rowIndex, columnIndex, item, dataField) => {
                return this.mgtBdtClsItems;
              },
              keyField: 'code', // key 에 해당되는 필드명
              valueField: 'codeNm', // value 에 해당되는 필드명
              // disabledFunction: () => {
              //   return this.checkDisabled;
              // },
            },
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000005009'),
            dataField: 'budgetActCd',
            width: '20%',
            style: 'left-align',
            editRenderer: {
              type: 'InputEditRenderer',
            },
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000005010'),
            dataField: 'budgetActNm',
            width: '20%',
            style: 'left-align',
            editRenderer: {
              type: 'InputEditRenderer',
            },
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000002601'),
            dataField: 'sortOrder',
            dataType: 'numeric',
            width: '20%',
            style: 'right-align',
            editRenderer: {
              type: 'InputEditRenderer',
              onlyNumeric: true,
              autoThousandSeparator: true,
            },
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000001439'),
            dataField: 'useYn',
            width: '20%',
            renderer: {
              type: 'CheckBoxEditRenderer',
              editable: true, // 체크박스 편집 활성화 여부(기본값 : false)
              checkValue: 'Y', // true, false 인 경우가 기본
              unCheckValue: 'N',
              checkableFunction: function (
                rowIndex,
                columnIndex,
                value,
                isChecked,
                item,
                dataField
              ) {
                if (value) {
                  return true;
                }
              },
            },
          },
        ];
        resolve();
      });
    },
    btnSave() {
      let promises = [
        { func: this.checkValidation },
        { func: this.checkDuplCodeMaster },
        { func: this.confirm, param: 'M0000000011' }, // 저장하시겠습니까?
        { func: this.saveData },
      ];

      this.$comm.orderedPromise(promises);
    },
    /** validation checking **/
    checkValidation() {
      // 값 유효성 체크
      return new Promise((_resolve) => {
        let stepCheck = true;
        // 대분류 값 입력 체크
        this.$_.forEach(this.codeMaster, (val, key) => {
          val = this.$_.trim(val); // 좌우 공백 제거
          if (val === '' && key === 'code') {
            stepCheck = false;
            window.getApp.$emit('ALERT', {
              title: 'L0000003395', // 안내
              message: 'L0000005020', // 예산분류코드를 입력해주세요.
              type: 'warning', // success / info / warning / error
            });
            return;
          } else if (val === '' && key === 'codeNm') {
            stepCheck = false;
            window.getApp.$emit('ALERT', {
              title: 'L0000003395', // 안내
              message: 'L0000005021', // 예산분류명를 입력해주세요.
              type: 'warning', // success / info / warning / error
            });
            return;
          }
        });
        if (!stepCheck) return;

        // 유효성 검사 체크
        this.$validator
          .validateAll()
          .then((_result) => {
            if (_result) {
              _resolve(true);
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
    checkDuplCodeMaster() {
      // 예산분류 코드 중복 체크
      return new Promise((_resolve) => {
        this.$http.url = this.$format(
          this.detailUrl,
          this.codeGroupCd,
          this.codeMaster.code // 예산분류 코드
        );
        this.$http.type = 'get';
        this.$http.request(
          (_result) => {
            let result = true;
            if (this.createMode && _result.data.mgtMgBudgetAct) {
              // 동일코드(그룹코드, 예산분류코드) 존재 시
              result = false;
              window.getApp.$emit('ALERT', {
                title: 'L0000003395', // 안내
                message: 'M0000001027', // 이미 같은 코드가 존재합니다.
                type: 'warning',
              });
              return;
            }
            if (result) _resolve(true);
          },
          (_error) => {
            window.getApp.$emit('APP_REQUEST_ERROR', _error);
          }
        );
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
            this.codeMaster.createUserId = this.$store.getters.token;
            this.codeMaster.updateUserId = this.$store.getters.token;
            this.$_.forEach(this.YAuiGrid.getGridData(), (item) => {
              item.budgetTypeCd = this.codeMaster.code;

              if (this.code) {
                // 신규등록
                item.createUserId = this.$store.getters.token;
                item.createUserNm = this.$store.getters.name;
                item.createDeptCd = this.$store.getters.deptCd;
                item.createDeptNm = this.$store.getters.deptNm;
                item.createPositionCd = this.$store.getters.positionCd;
                item.createPositionNm = this.$store.getters.positionNm;
              } else {
                // 수정
                item.updateUserId = this.$store.getters.token;
                item.updateUserNm = this.$store.getters.name;
                item.updateDeptCd = this.$store.getters.deptCd;
                item.updateDeptNm = this.$store.getters.deptNm;
                item.updatePositionCd = this.$store.getters.positionCd;
                item.updatePositionNm = this.$store.getters.positionNm;
              }
            });
            // this.codeMaster.investItems = this.gridOptions.data;

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
        let url = this.saveUrl;
        let type = this.code ? 'PUT' : 'POST';
        let mgtMgBudgetAct = {
          mgtMgBudgetAct: this.codeMaster,
          mgtMgBudgetActMsts: this.YAuiGrid.getGridData(),
          deleteMgtMgBudgetActMsts: this.deleteList,
        };

        this.$http.url = url;
        this.$http.type = type;
        this.$http.param = mgtMgBudgetAct;
        this.$http.request(
          (_result) => {
            this.code = this.codeMaster.code;
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
    cellEditEndHandler() {},
    btnAddRow() {
      let row = {
        budgetTypeCd: this.codeMaster.code,
        budgetClsCd: null, // 예산구분 코드
        budgetActCd: '', // 예산계정코드
        budgetActNm: '', // 예산계정명
        sortOrder: 0, // 정렬순서
        useYn: 'Y', // 사용여부
      };
      this.YAuiGrid.addRow(row, 'first');
    },
    btnDelRow() {
      this.deleteList = [];
      let removeData = this.YAuiGrid.getCheckedRowItems();
      if (!removeData || removeData.length === 0) {
        // 체크 항목 미존재 시
        window.getApp.$emit('ALERT', {
          title: 'L0000003395' /* 안내 */,
          message: 'M0000000057' /* 삭제할 항목을 선택해주세요. */,
          type: 'warning',
        });
        return;
      }
      removeData.forEach((item) => {
        if (item.item.budgetActMstNo === undefined) {
          this.YAuiGrid.removeRow(removeData[item.rowIndex].rowIndex);
        } else if (
          item.item.budgetActMstNo !== undefined &&
          item.item.budgetActMstNo !== null &&
          item.item.budgetActMstNo !== ''
        ) {
          this.deleteList.push(item.item);
        }
      });
      for (let i = 0; i < this.deleteList.length; i++) {
        this.YAuiGrid.removeRow(removeData[i].rowIndex);
      }
      // this.gridOptions.data = this.gridOptions.data.filter(
      //   (item) => !this.selectedValue.includes(item)
      // );
      // this.selectedValue.forEach((item) => {
      //   // 예산계정번호를 가지고 있으면서 deleteList에 없을 경우에만 deleteList에 추가함
      //   if (
      //     item.budgetActMstNo &&
      //     this.deleteList.findIndex(
      //       (data) => data.budgetActMstNo === item.budgetActMstNo
      //     ) < 0
      //   ) {
      //     this.deleteList.push(item);
      //   }
      // });
    },
    // 예산계정 행 추가 버튼
    btnAddItemCheck() {
      // this.gridOptions.data 배열에 객체 1개를 추가한다.
      this.gridOptions.data.push({
        budgetClsCd: null, // 예산구분 코드
        budgetActCd: '', // 예산계정코드
        budgetActNm: '', // 예산계정명
        sortOrder: 0, // 정렬순서
        useYn: 'Y', // 사용여부
      });
    },
    // 예산계정 행 삭제 버튼
    btnDeleteItemCheck() {
      if (!this.selectedValue || this.selectedValue.length === 0) {
        // 체크 항목 미존재 시
        window.getApp.$emit('ALERT', {
          title: 'L0000003395' /* 안내 */,
          message: 'M0000000057' /* 삭제할 항목을 선택해주세요. */,
          type: 'warning',
        });
        return;
      }

      this.gridOptions.data = this.gridOptions.data.filter(
        (item) => !this.selectedValue.includes(item)
      );
      this.selectedValue.forEach((item) => {
        // 예산계정번호를 가지고 있으면서 deleteList에 없을 경우에만 deleteList에 추가함
        if (
          item.budgetActMstNo &&
          this.deleteList.findIndex(
            (data) => data.budgetActMstNo === item.budgetActMstNo
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
