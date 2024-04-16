<!--
  목적 : 위험성평가 > 작업위험성평가 > 평가 계획 상세 > 평가대상 작업 탭
  작성자 : kyh
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <!-- 검색 결과 테이블 -->
    <b-row class="mt-3">
      <b-col sm="12">
        <b-row>
          <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
            <!-- 위험성평가 사용자 그룹 -->
            <y-select
              :editable="editable && apprMode"
              :width="8"
              :comboItems="userGrpItems"
              itemText="grpNm"
              itemValue="eduGrpNo"
              ui="bootstrap"
              label="L0000005832"
              name="grpNm"
              v-model="eduGrpNo"
            ></y-select>
          </b-col>
          <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
            <!-- 사용자 그룹 추가 -->
            <y-btn
              v-if="editable && apprMode"
              title="L0000005833"
              color="orange"
              @btnClicked="addUserGrp"
            />
          </b-col>

          <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
            <!-- 내부평가자 목록 -->
            <y-auigrid
              ref="yAuiGrid1"
              :editable="editable && apprMode"
              :name="gridOptions1.name"
              :headers="gridOptions1.header"
              :btns="gridOptions1.btns"
              :height="gridOptions1.height"
              :label="this.$comm.getLangSpecInfoLabel('L0000004988')"
              :useExcelExport="false"
              :enableCellMerge="true"
              :enableSorting="true"
              :showGridSetSave="true"
              :useContextMenu="true"
              :enableRightDownFocus="true"
              :showGridCtrl="true"
              :showRowCheckColumn="true"
              @addRow1="addRow1"
              @deleteRow1="deleteRow1"
              @cellEditEnd="cellEditEndHandler"
            />
          </b-col>

          <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
            <!-- 외부평가자 목록 -->
            <y-auigrid
              ref="yAuiGrid2"
              :editable="editable && apprMode"
              :name="gridOptions2.name"
              :headers="gridOptions2.header"
              :btns="gridOptions2.btns"
              :height="gridOptions2.height"
              :label="this.$comm.getLangSpecInfoLabel('L0000004989')"
              :useExcelExport="false"
              :enableCellMerge="true"
              :enableSorting="true"
              :showGridSetSave="true"
              :useContextMenu="true"
              :enableRightDownFocus="true"
              :showGridCtrl="true"
              :showRowCheckColumn="true"
              @addRow2="addRow2"
              @deleteRow2="deleteRow2"
              @cellEditEnd="cellEditEndHandler2"
            />
          </b-col>
        </b-row>
      </b-col>
    </b-row>
    <y-dialog :param="popupOptions"></y-dialog>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
export default {
  /* attributes: name, components, props, data */
  name: 'rsaPlanDetailList',
  props: {
    Planmgmt: {
      type: Object,
      default: () => ({
        assessPlanNo: 0,
        plantCd: '', // 사업장 코드
        assessYear: '',
        assessTypeCd: '',
        regRegdemCd: '',
        assessNm: '',
        assessDt: null,
        assessDesc: '',
        riskType: '',
        planmgmtDeptList: [],
        internalList: [], // 내부평가자 목록
        externalList: [], // 외부평가자 목록
      }),
    },

    deptListLoad: false,
    updateMode: false,
    deptReLoad: false,
    apprMode: false,
  },
  data() {
    return {
      // Planmgmt: {
      assessPlanNo: 0,
      assessLeaderId: '', // 평가리더ID
      assessLeaderNm: '', // 평가리더명
      internalList: [], // 내부평가자 목록
      externalList: [], // 외부평가자 목록
      // },
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '90%',
        top: '10px',
        param: {},
        closeCallback: null,
      },
      gridOptions1: {
        header: [],
        data: [],
        height: '500',
      },
      gridOptions2: {
        header: [],
        data: [],
        height: '500',
      },
      editable: true,
      selectedValues1: [], // 내부평가자 목록
      selectedValues2: [], // 외부평가자 목록
      rsaAssessTypeItems: [],
      deleteValue: null,
      deleteUrl: '',
      isDelete: false,
      selectedValue1: [],
      selectedValue2: [],
      detailUrl: '',
      teamTypeItems: [],
      userGrpItems: [],
      getUrl: '',
      tempUserGrp: [],
      eduGrpNo: 0,
      YAuiGrid1: null,
      YAuiGrid2: null,
    };
  },
  watch: {
    deptListLoad() {
      this.Planmgmt.internalList = this.YAuiGrid1.getGridData();
      this.Planmgmt.externalList = this.YAuiGrid2.getGridData();
    },

    eduGrpNo: {
      handler: function (val, oldVal) {
        this.tempUserGrp = [];
        if (this.eduGrpNo !== null && this.eduGrpNo !== undefined) {
          this.getUserGrp();
        }
      },
      deep: true,
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
    this.YAuiGrid1 = this.$refs.yAuiGrid1;
    this.YAuiGrid2 = this.$refs.yAuiGrid2;
  },
  beforeDestroy() {},
  //* methods */
  methods: {
    /** 초기화 관련 함수 **/
    init() {
      this.editable = this.$route.meta.editable;
      this.getUrl = selectConfig.saf.education.eduGroup.get.url;
      this.$comm.getComboItems('RSA_ASSESS_TYPE', false).then((_result) => {
        this.rsaAssessTypeItems = _result;
      });
      this.$comm
        .getComboItems('RSA_ASSESS_TEAM_TYPE', false)
        .then((_result) => {
          this.teamTypeItems = _result;
        });
      this.deleteUrl = transactionConfig.rsa.planmgmtdeptlist2.delete.url;
      this.detailUrl = selectConfig.rsa.planmgmt2.get2.url;

      this.setHeader();
      this.getList();

      this.getUserGrpList();
    },
    getUserGrp() {
      this.$http.url = this.$format(this.getUrl, this.eduGrpNo);
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.$_.forEach(_result.data.eduGroupUsers, (item) => {
            let tempItem = {
              deptCd: item.deptCd,
              deptNm: item.deptNm,
              positionNm: item.positionNm,
              positionCd: item.positionCd,
              userId: item.userId,
              userNm: item.userNm,
              remarks: null,
              innerYn: 'Y',
              teamType: null,
            };
            this.tempUserGrp.push(tempItem);
          });
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', 'M0000000016');
        }
      );
    },
    // 외부평가자
    cellEditEndHandler2(data) {
      let tempGridData = this.YAuiGrid2.getGridData();
      this.Planmgmt.externalList = tempGridData;
    },
    // 내부평가자
    cellEditEndHandler(data) {
      let tempGridData = this.YAuiGrid1.getGridData();
      if (data.item.teamType === 'RAT01') {
        this.$_.forEach(tempGridData, (item, index) => {
          if (item.teamType === 'RAT01' && item.raterNm === data.item.raterNm) {
            if (item.index !== 0) {
              tempGridData.splice(index, 1); // 현재 위치에서 아이템을 삭제하고,
              tempGridData.unshift(item); // 삭제한 아이템을 배열의 맨 앞으로 추가
            }
          } else {
            item.teamType = 'RAT02';
          }
        });
      }
      this.Planmgmt.internalList = tempGridData;
      this.YAuiGrid1.setGridData(tempGridData);
    },

    addUserGrp() {
      let tempGridData = this.YAuiGrid1.getGridData();

      if (!this.tempUserGrp || this.tempUserGrp.length === 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395' /* 안내 */,
          message: 'L0000006031' /* 사용자그룹을 먼저 선택해주세요. */,
          type: 'warning',
        });
        return false;
      } else {
        this.$_.forEach(this.tempUserGrp, (item) => {
          if (
            this.$_.findIndex(tempGridData, {
              raterId: item.userId,
            }) === -1
          ) {
            let tempItem = {
              deptCd: item.deptCd,
              deptNm: item.deptNm,
              positionNm: item.positionNm,
              positionCd: item.positionCd,
              raterId: item.userId,
              raterNm: item.userNm,
              remarks: null,
              innerYn: 'Y',
              teamType: null,
            };
            tempGridData.push(tempItem);

            this.$_.forEach(tempGridData, (item, index) => {
              if (item.teamType === 'RAT01') {
                // 해당 item을 gridOptions1.data의 맨 앞으로 옮깁니다.
                tempGridData.splice(index, 1); // 해당 item을 삭제
                tempGridData.unshift(item); // 삭제한 item을 배열의 맨 앞으로 삽입

                // 나머지 item들의 teamType을 'RAT01'로 수정합니다.
                tempGridData.forEach((otherItem) => {
                  if (otherItem !== item) {
                    otherItem.teamType = 'RAT02';
                  }
                });
              }
            });

            this.Planmgmt.internalList = tempGridData;
            this.YAuiGrid1.setGridData(tempGridData);
          }
        });
      }
    },
    setHeader() {
      this.$comm
        .getComboItems('RSA_ASSESS_TEAM_TYPE', false)
        .then((_result) => {
          this.teamTypeItems = _result;

          // 그리드 헤더 설정
          this.gridOptions1.header = [
            // 구분
            {
              headerText: this.$comm.getLangSpecInfoLabel('L0000000686'),
              dataField: 'teamType',
              width: 130,
              renderer: {
                type: 'DropDownListRenderer',
                listFunction: () => {
                  return this.teamTypeItems;
                },
                keyField: 'code', // key 에 해당되는 필드명
                valueField: 'codeNm', // value 에 해당되는 필드명
                disabledFunction: () => {
                  return !this.editable && this.apprMode;
                },
              },
            },
            {
              // 소속
              headerText: this.$comm.getLangSpecInfoLabel('L0000001662'),
              dataField: 'deptNm',
              width: 130,
              editable: false,
            },
            {
              // 직책
              headerText: this.$comm.getLangSpecInfoLabel('L0000002772'),
              dataField: 'positionNm',
              width: 130,
              editable: false,
            },
            // 성명
            {
              headerText: this.$comm.getLangSpecInfoLabel('L0000001630'),
              dataField: 'raterNm',
              width: 130,
              editable: false,
            },

            {
              // 비고
              headerText: this.$comm.getLangSpecInfoLabel('L0000001360'),
              dataField: 'remarks',
              width: 400,
              type: 'text',
            },
          ];
        });

      this.gridOptions2.header = [
        // 성명
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001630'),
          dataField: 'raterNm',
          width: 130,
          type: 'text',
        },
        {
          // 소속
          headerText: this.$comm.getLangSpecInfoLabel('L0000001662'),
          dataField: 'deptNm',
          width: 130,
          type: 'text',
        },
        {
          // 직책
          headerText: this.$comm.getLangSpecInfoLabel('L0000002772'),
          dataField: 'positionNm',
          width: 130,
          type: 'text',
        },
        {
          // 비고
          headerText: this.$comm.getLangSpecInfoLabel('L0000001360'),
          dataField: 'remarks',
          width: 530,
          type: 'text',
        },
      ];

      // 그리드 버튼 설정
      this.gridOptions1.btns = [
        // 추가
        {
          title: this.$comm.getLangSpecInfoLabel('L0000002892'),
          color: 'orange',
          btnClicked: 'addRow1',
        },

        // 삭제
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001495'),
          color: 'red',
          btnClicked: 'deleteRow1',
        },
      ];
      this.gridOptions2.btns = [
        // 추가
        {
          title: this.$comm.getLangSpecInfoLabel('L0000002892'),
          color: 'orange',
          btnClicked: 'addRow2',
        },

        // 삭제
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001495'),
          color: 'red',
          btnClicked: 'deleteRow2',
        },
      ];
    },
    getUserGrpList() {
      this.$http.url = selectConfig.saf.education.eduGroup.list.url;
      this.$http.type = 'GET';
      this.$http.param = {
        plantCd: this.$store.getters.plantCd,
        grpType: 'EGT01',
      };
      this.$http.request(
        (_result) => {
          this.userGrpItems = this.$_.clone(_result.data);
          this.userGrpItems.splice(0, 0, {
            eduGroup: null,
            grpNm: this.$comm.getLangSpecInfoLabel('L0000003394'),
          }); // 선택하세요
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', 'M0000000016');
        }
      );
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
    btnSearchUserClicked(_item) {
      this.popupOptions.target = () =>
        import(`${'../../manage/user/userSearch.vue'}`);
      this.popupOptions.title = 'L0000001466'; // 사용자검색
      this.popupOptions.visible = true;
      this.popupOptions.width = '60%';
      this.popupOptions.top = '100px';
      this.popupOptions.param = {
        plantCd: this.Planmgmt.plantCd,
      };
      this.popupOptions.closeCallback = this.closePopupSearchUser;
    },
    closePopupSearchUser(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;

      if (data.user) {
        this.Planmgmt.assessLeaderId = data.user.userId;
        this.Planmgmt.assessLeaderNm = data.user.userNm;
        this.assessLeaderId = data.user.userId;
        this.assessLeaderNm = data.user.userNm;
      }
    },
    closePopupSearchUser1(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      let tempGridData = this.YAuiGrid1.getGridData();

      this.$_.forEach(data.users, (item) => {
        if (
          this.$_.findIndex(tempGridData, {
            raterId: item.userId,
          }) === -1
        ) {
          let tempItem = {
            deptCd: item.deptCd,
            deptNm: item.deptNm,
            positionNm: item.positionNm,
            positionCd: item.positionCd,
            raterId: item.userId,
            raterNm: item.userNm,
            remarks: null,
            innerYn: 'Y',
            teamType: null,
          };
          tempGridData.push(tempItem);
        }
      });
      this.$_.forEach(tempGridData, (item, index) => {
        if (item.teamType === 'RAT01') {
          // 해당 item을 gridOptions1.data의 맨 앞으로 옮깁니다.
          tempGridData.splice(index, 1); // 해당 item을 삭제
          tempGridData.unshift(item); // 삭제한 item을 배열의 맨 앞으로 삽입

          // 나머지 item들의 teamType을 'RAT01'로 수정합니다.
          tempGridData.forEach((otherItem) => {
            if (otherItem !== item) {
              otherItem.teamType = 'RAT02';
            }
          });
        }
      });

      this.Planmgmt.internalList = this.gridOptions1.data;
      this.YAuiGrid1.setGridData(tempGridData);
    },
    addRow1() {
      this.popupOptions.target = () =>
        import(`${'../../manage/user/userSearch.vue'}`);
      this.popupOptions.title = 'L0000001466'; // 사용자검색
      this.popupOptions.visible = true;
      this.popupOptions.width = '60%';
      this.popupOptions.top = '100px';
      this.popupOptions.param = {
        multiple: true,
        plantCd: this.Planmgmt.plantCd,
      };
      this.popupOptions.closeCallback = this.closePopupSearchUser1;
    },
    addRow2() {
      let tempGridData = this.YAuiGrid2.getGridData();
      let tempItem = {
        deptCd: '',
        deptNm: '',
        positionNm: '',
        positionCd: '',
        raterId: '',
        raterNm: '',
        remarks: '',
        innerYn: 'N',
      };
      tempGridData.push(tempItem);
      this.YAuiGrid2.setGridData(tempGridData);
    },
    deleteRow1() {
      let selectedValue1 = this.YAuiGrid1.getCheckedRowItemsAll();
      let tempGridData = this.YAuiGrid1.getGridData();
      if (selectedValue1 && selectedValue1.length > 0) {
        this.$_.forEach(selectedValue1, (item) => {
          tempGridData = this.$_.reject(tempGridData, item);
        });
        this.Planmgmt.internalList = tempGridData;
      } else {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395' /* 안내 */,
          message:
            ' 최소 한개 이상 선택하세요.' /* 최소 한개 이상 선택하세요. */,
          type: 'warning',
        });
        return false;
      }
      this.YAuiGrid1.setGridData(tempGridData);
      this.Planmgmt.internalList = tempGridData;
    },
    deleteRow2() {
      let selectedValue = this.YAuiGrid2.getCheckedRowItemsAll();
      let tempGridData = this.YAuiGrid2.getGridData();
      if (selectedValue && selectedValue.length > 0) {
        this.$_.forEach(selectedValue, (item) => {
          tempGridData = this.$_.reject(tempGridData, item);
        });
      } else {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395' /* 안내 */,
          message:
            '최소 한개 이상 선택하세요.' /* 최소 한개 이상 선택하세요. */,
          type: 'warning',
        });
        return false;
      }
      this.YAuiGrid2.setGridData(tempGridData);
      this.Planmgmt.externalList = tempGridData;
    },

    getList() {
      if (!this.Planmgmt.assessPlanNo || this.Planmgmt.assessPlanNo === 0) {
        return;
      }

      this.$http.url = this.$format(this.detailUrl, this.Planmgmt.assessPlanNo);
      this.$http.type = 'GET';

      this.$http.request(
        (_result) => {
          console.log('_result: ', _result);
          this.Planmgmt.internalList = _result.data.internalList;
          this.Planmgmt.assessLeaderId = _result.data.assessLeaderId;
          this.Planmgmt.assessLeaderNm = _result.data.assessLeaderNm;

          if (this.Planmgmt.internalList !== null) {
            const externalList = [];

            for (let i = this.Planmgmt.internalList.length - 1; i >= 0; i--) {
              const item = this.Planmgmt.internalList[i];
              if (item && item.innerYn === 'N') {
                externalList.unshift(item);
                this.Planmgmt.internalList.splice(i, 1);
              }
            }

            this.Planmgmt.externalList = externalList;
            this.$_.forEach(this.Planmgmt.internalList, (item, index) => {
              if (item.teamType === 'RAT01') {
                // 해당 item을 internalList의 맨 앞으로 옮깁니다.
                this.Planmgmt.internalList.splice(index, 1); // 해당 item을 삭제
                this.Planmgmt.internalList.unshift(item); // 삭제한 item을 배열의 맨 앞으로 삽입

                // 나머지 item들의 teamType을 'RAT02'로 설정합니다.
                this.Planmgmt.internalList.forEach((otherItem) => {
                  if (otherItem !== item) {
                    otherItem.teamType = 'RAT02';
                  }
                });
              }
            });

            this.gridOptions1.data = this.Planmgmt.internalList;
            this.gridOptions2.data = this.Planmgmt.externalList;
            console.log(
              'this.Planmgmt.internalList: ',
              this.Planmgmt.internalList
            );
            this.YAuiGrid1.setGridData(this.Planmgmt.internalList);
            this.YAuiGrid2.setGridData(this.Planmgmt.externalList);
          }

          if (
            this.Planmgmt.assessStepCd === 'STATE4' ||
            this.Planmgmt.assessStepCd === 'STATE3'
          ) {
            // 결재중, 결재완료인 경우
            this.editable = false;
          } else if (this.Planmgmt.apprRqstStatus === '진행') {
            this.editable = false;
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    btnPopupInsertClicked(data) {
      if (!this.Planmgmt.assessYear) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // 안내
          // 평가기간을 선택해주세요.
          message: 'L0000005154',
          type: 'warning', // success / info / warning / error
        });
        return false;
      }
      if (!this.Planmgmt.assessTypeCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // 안내
          // 분류를 선택해주세요.
          message: 'M0000001516',
          type: 'warning', // success / info / warning / error
        });
        return false;
      }
      let tempYear;
      let rsaYear;
      if (Array.isArray(this.Planmgmt.assessYear)) {
        tempYear = new Date(this.Planmgmt.assessYear[0]);
        rsaYear = tempYear.getFullYear();
      } else {
        rsaYear = this.Planmgmt.assessYear;
      }
      this.$_.forEach(this.rsaAssessTypeItems, (item) => {
        if (item.code === this.Planmgmt.assessTypeCd) {
          this.Planmgmt.assessTypeNm = item.codeNm;
        }
      });

      this.popupOptions.top = '10px';
      this.popupOptions.width = '60%';
      this.popupOptions.target = () => import(`${'./planOperationPopup.vue'}`);
      this.popupOptions.title = 'L0000005905'; // '평가대상 작업 신규등록';
      this.popupOptions.visible = true;

      this.popupOptions.param = {
        mainDeptCd: this.Planmgmt.mainDeptCd, // 평가팀 부서코드
        mainDeptNm: this.Planmgmt.mainDeptNm, // 평가팀 부서명
        assessTypeCd: this.Planmgmt.assessTypeCd, // 분류코드
        assessTypeNm: this.Planmgmt.assessTypeNm, // 분류명
        year: rsaYear, // 년도
        userId: this.$store.getters.token, // 평가담당자
        userNm: this.$store.getters.name, // 평가담당자명
        multiple: true,
      };
      this.popupOptions.closeCallback = this.closePopupUsage;
    },
    closePopupUsage(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;

      if (data && data.length) {
        this.gridOptions.data = data;
      }
    },
    deleteRow() {
      if (!this.selectedValues || !this.selectedValues.length) {
        this.$comm.alertWarning('M0000001614'); // 선택된 항목이 없습니다.
        return;
      }

      this.$_.forEach(this.selectedValues, (item) => {
        this.gridOptions.data.splice(
          this.$_.findIndex(this.gridOptions.data, {
            workNm: item.workNm,
          }),
          1
        );
      });
    },
    beforeDelete() {
      if (!this.selectedValues || !this.selectedValues.length) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // '안내',
          message: 'M0000001614', // 선택된 항목이 없습니다.
          type: 'warning',
        });
        return;
      }
      if (this.selectedValues.assessFinishYn === '완료') {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // '안내',
          message: 'M0000000057', // 평가완료여부가 완료인상태는 삭제가 불가합니다.
          type: 'warning',
        });
        return;
      }
      let filterValues = [];
      this.$_.forEach(this.selectedValues, (item) => {
        if (item.assessDeptNo !== 0) {
          let saveIdx = this.$_.findIndex(this.selectedValues, {
            deptCd: item.deptCd,
          });
          filterValues.push(this.selectedValues[saveIdx]);
        }
      });
      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321', // '확인',
        message: 'M0000000012', // 삭제하시겠습니까?
        type: 'info',
        confirmCallback: () => {
          this.deleteValue = {
            data: Object.values(this.$_.clone(this.selectedValues)),
          };
          this.isDelete = true;
        },
        // 취소 callback 함수
        cancelCallback: () => {},
      });
    },
    // 삭제
    btnDeleteClickedCallback(_result) {
      this.$_.forEach(this.selectedValues, (item) => {
        this.gridOptions.data.splice(
          this.$_.findIndex(this.gridOptions.data, {
            deptCd: item.deptCd,
          }),
          1
        );
      });

      this.isDelete = false;
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // '안내',
        message: 'M0000000007', // 삭제되었습니다.
        type: 'success',
      });
    },
    btnClickedErrorCallback(_result) {
      this.isDelete = false;
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
  },
};
</script>
