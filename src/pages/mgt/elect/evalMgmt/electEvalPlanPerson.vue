<!--
  목적 : SHE경영 관리>법정선임자 관리>법정선임자 평가 관리>평가계획 관리>평가계획 상세
  Detail : 평가계획 관리 상세 팝업 대상자 탭 화면
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <b-row ref="detailBox">
      <b-col sm="12">
        <b-col sm="12" class="px-0">
          <b-card>
            <!-- <b-row>
              <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
                <b-col sm="12" class="px-0">
                  <div slot="buttonGroup" class="float-right mb-1">
                     대상자 추가 
                    <y-btn
                      v-if="gridEditable"
                      title="L0000005172"
                      color="orange"
                      @btnClicked="btnUserAdd"
                    />
                     행삭제 
                    <y-btn
                      v-if="gridEditable"
                      title="L0000003225"
                      color="red"
                      @btnClicked="btnRowDelete"
                    />
                  </div>
                   평가 대상자 목록 
                  <y-data-table
                    :key="tabKey"
                    ref="dataTable"
                    :editable="gridEditable"
                    :height="gridOptions.height"
                    :headers="gridOptions.header"
                    :items="electEvalPlan.electEvalUsers"
                    :use-paging="true"
                    label="L0000005168"
                    v-model="gridOptions.selectedValues"
                    @userChange="userChange"
                  >
                    <el-table-column
                      v-if="gridEditable"
                      key="electEvalUserSelection"
                      type="selection"
                      slot="selection"
                      align="center"
                      width="55"
                    />
                  </y-data-table>
                </b-col>
              </b-col>
            </b-row> -->
            <b-row class="grid-height grid-box">
              <b-col sm="12" class="h100p">
                <y-auigrid
                  ref="yAuiGrid"
                  :editable="!parentDisabled"
                  :name="gridOptions.name"
                  :headers="gridOptions.header"
                  :btns="gridOptions.btns"
                  :height="gridOptions.height"
                  :label="this.$comm.getLangSpecInfoLabel('L0000005168')"
                  :useExcelExport="false"
                  :enableCellMerge="true"
                  :enableSorting="true"
                  :showGridSetSave="true"
                  :useContextMenu="true"
                  :enableRightDownFocus="true"
                  :showGridCtrl="true"
                  :showRowCheckColumn="true"
                  :softRemoveRowMode="false"
                  @cellEditEnd="cellEditEndHandler"
                  @btnUserAddRow="btnUserAddRow"
                  @btnDelRow="btnDelRow"
                />
              </b-col>
            </b-row>
          </b-card>
        </b-col>
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
  name: 'elect-eval-plan-person',
  props: {
    electEvalPlan: {
      type: Object,
      default: () => {
        return {
          evalPlanNo: 0, // 평가계획번호
          year: null, // 대상년도
          halfTypeCd: null, // 구분(상반기/하반기)
          deptCd: null, // 주관부서
          safElectTitlNo: null, // 법정선임자번호
          evalNm: null, // 평가명
          evalDesc: null, // 상세내용
          procStepCd: null, // 단계(SAF_ELECT_TITL_STEP)
          stateCd: null, // 상태(COM_STATE)
          stepCd: null, // 결재상태(COM_BIZ_APPR_STEP)
          apprRqstNo: 0, // 결재요청번호
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
          electEvalUsers: [], // 평가대상자 목록
          deleteElectEvalUsers: [], // 평가대상자 삭제목록
          electEvalItems: [], // 평가항목 목록
        };
      },
    },
    tabKey: null,
    parentEditable: false, // 평가계획 상세 editable
    parentDisabled: false, // 평가계획 상세 disabled
  },
  data() {
    return {
      editable: false, // 수정 가능 여부
      gridOptions: {
        name: 'electEvalPlanPerson',
        btns: [],
        header: [],
        data: [],
        height: '350px',
        selectedValues: null,
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
      disabled: false,
      columnPersonData: 0,
    };
  },
  computed: {
    gridEditable() {
      return this.editable && this.parentEditable && !this.parentDisabled;
    },
  },
  watch: {
    'electEvalPlan.safElectTitlNo'() {
      this.electEvalPlan.electEvalUsers = [];
      this.setGridData();
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

      this.setGridHeader().then(() => {
        this.setGridData(); // 코드 정보 db 조회
      });

      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000005172'),
          color: 'orange',
          btnClicked: 'btnUserAddRow',
          visible: !this.parentDisabled,
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000003225'),
          color: 'red',
          btnClicked: 'btnDelRow',
          visible: !this.parentDisabled,
        },
      ];
    },
    setGridHeader() {
      return new Promise((resolve) => {
        let myTHis = this;
        this.gridOptions.header = [
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000001415'),
            dataField: 'plantNm',
            width: '14%',
            editable: false,
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000001287'),
            dataField: 'deptNm',
            width: '14%',
            editable: false,
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000002769'),
            dataField: 'positionNm',
            width: '14%',
            editable: false,
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000001631'),
            dataField: 'meUserNm',
            width: '14%',
            editable: false,
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000005170') + ' *',
            dataField: 'meUserNm2',
            width: '14%',
            editable: false,
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000005170') + '찾기',
            width: !this.parentDisabled ? '20%' : '0%',
            editable: false,
            renderer: {
              type: !this.parentDisabled ? 'ButtonRenderer' : null,
              labelText: '찾기',
              onClick: function (rowIndex, columnIndex, value, item) {
                myTHis.searchMeUser(rowIndex.rowIndex);
              },
            },
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000005171') + ' *',
            dataField: 'upUserNm',
            width: '14%',
            editable: false,
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000005171') + '찾기',
            width: !this.parentDisabled ? '20%' : '0%',
            editable: false,
            renderer: {
              type: !this.parentDisabled ? 'ButtonRenderer' : null,
              labelText: '찾기',
              onClick: function (rowIndex, columnIndex, value, item) {
                myTHis.searchUpUser(rowIndex.rowIndex);
              },
            },
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000001360'),
            dataField: 'remark',
            width: '16%',
            editRenderer: {
              type: 'InputEditRenderer',
            },
          },

          // {
          //   text: this.$comm.getLangSpecInfoLabel('L0000005170') + ' *', // 본인 평가자 *
          //   name: 'meUser',
          //   width: '100px',
          //   align: 'center',
          //   type: 'usersearch',
          // },
        ];
        resolve();
      });
    },
    cellEditEndHandler() {
      this.electEvalPlan.electEvalUsers = this.YAuiGrid.getGridData();
    },
    setGridData() {
      this.$_.forEach(this.electEvalPlan.electEvalUsers, (item) => {
        item.meUserId2 = item.meUserId;
        item.meUserNm2 = item.meUserNm;
      });
      this.YAuiGrid.setGridData(this.electEvalPlan.electEvalUsers);
    },
    searchMeUser(data) {
      this.columnPersonData = data;
      this.popupOptions.target = () =>
        import(`${'@/pages/manage/user/userSearch.vue'}`);
      this.popupOptions.param = {
        plantCd: this.$store.getters.plantCd,
      };
      this.popupOptions.title = 'L0000001466'; /* 사용자검색 */
      this.popupOptions.visible = true;
      this.popupOptions.width = '60%';
      this.popupOptions.top = '100px';
      this.popupOptions.closeCallback = this.closePersonPopup;
    },
    closePersonPopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      if (data.user) {
        this.electEvalPlan.electEvalUsers[this.columnPersonData].meUser.userId =
          data.user.userId;
        this.electEvalPlan.electEvalUsers[this.columnPersonData].meUser.userNm =
          data.user.userNm;
        this.electEvalPlan.electEvalUsers[this.columnPersonData].meUserNm2 =
          data.user.userNm;
        this.electEvalPlan.electEvalUsers[this.columnPersonData].meUserId =
          data.user.userId;
        this.YAuiGrid.setGridData(this.electEvalPlan.electEvalUsers);
        this.cellEditEndHandler();
      }
    },
    searchUpUser(data) {
      this.columnPersonData = data;
      this.popupOptions.target = () =>
        import(`${'@/pages/manage/user/userSearch.vue'}`);
      this.popupOptions.param = {
        plantCd: this.$store.getters.plantCd,
      };
      this.popupOptions.title = 'L0000001466'; /* 사용자검색 */
      this.popupOptions.visible = true;
      this.popupOptions.width = '60%';
      this.popupOptions.top = '100px';
      this.popupOptions.closeCallback = this.closeUpPersonPopup;
    },
    closeUpPersonPopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      if (data.user) {
        this.electEvalPlan.electEvalUsers[this.columnPersonData].upUser.userId =
          data.user.userId;
        this.electEvalPlan.electEvalUsers[this.columnPersonData].upUser.userNm =
          data.user.userNm;
        this.electEvalPlan.electEvalUsers[this.columnPersonData].upUserNm =
          data.user.userNm;
        this.electEvalPlan.electEvalUsers[this.columnPersonData].upUserId =
          data.user.userId;
        this.YAuiGrid.setGridData(this.electEvalPlan.electEvalUsers);
        this.cellEditEndHandler();
      }
    },
    userChange(headerName, row) {
      if (headerName === 'meUser') {
        // 본인평가자 수정시
        row.meUserId = row[headerName].userId;
      } else {
        // 상위평가자 수정시
        row.upUserId = row[headerName].userId;
      }
    },
    btnUserAddRow() {
      if (!this.electEvalPlan.safElectTitlNo) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // 안내
          message: 'M0000001101', // 법정선임자명을 선택해주세요.
          type: 'info',
        });
        return;
      }

      this.popupOptions.target = () => import(`${'./electHisEvalTargetPop'}`);
      this.popupOptions.visible = true;
      this.popupOptions.title = 'L0000005176'; /* 법정선임자 검색 */
      this.popupOptions.param = {
        safElectTitlNo: this.electEvalPlan.safElectTitlNo,
        plantCd: this.electEvalPlan.plantCd,
      };
      this.popupOptions.closeCallback = this.closeUserPopData;
    },
    closeUserPopData(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      if (data && data.length > 0) {
        let removeDuplicateList = data;
        let hasItems = false;
        let filteredArray = [];
        let duplicate = false;

        removeDuplicateList.forEach((el) => {
          hasItems = false;
          this.electEvalPlan.electEvalUsers.forEach((el2) => {
            if (
              el['plantNm'] === el2['plantNm'] &&
              el['meUserId'] === el2['meUserId']
            ) {
              hasItems = true;
              duplicate = true;
            }
          });
          if (!hasItems) filteredArray.push(el);
        });
        removeDuplicateList = filteredArray;

        if (duplicate) {
          window.getApp.$emit('ALERT', {
            title: 'L0000003395' /* 안내 */,
            message:
              'L0000005331' /* 이미 선택된 대상자는 제외하고 추가됩니다.  */,
            type: 'warning',
          });
          return;
        }

        removeDuplicateList = removeDuplicateList.map((item) => {
          let row = {
            plantNm: item.item.plantNm, // 사업장명
            deptNm: item.item.deptNm, // 부서명
            positionCd: item.item.positionCd, // 직위명
            positionNm: item.item.positionNm, // 직위명
            meUserNm: item.item.meUserNm, // 성명
            meUserNm2: item.item.meUserNm, // 성명
            meUserId: item.item.meUserId, // 본인평가자
            meUser: {
              userId: item.item.meUserId,
              userNm: item.item.meUserNm,
            }, // 본인평가자 객체
            upUserNm: item.item.upUserNm, // 상위 평가자명
            upUserId: item.item.upUserId, // 상위평가자
            upUser: {
              userId: item.item.upUserId,
              userNm: item.item.upUserNm,
            }, // 상위평가자 객체
            meProcStep: 'PSURE', // 본인평가 진행상태(COM_PROCESS_STEP2 - 미작성/작성중/완료)
            upProcStep: 'PSURE', // 상위평가 진행상태(COM_PROCESS_STEP2 - 미작성/작성중/완료)
            remark: null, // 비고
          };
          this.YAuiGrid.addRow(row, 'last');
          return row;
        });

        this.electEvalPlan.electEvalUsers = this.$_.concat(
          this.electEvalPlan.electEvalUsers,
          removeDuplicateList
        );
      }
    },
    /** Button Event **/
    btnUserAdd() {
      if (!this.electEvalPlan.safElectTitlNo) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // 안내
          message: 'M0000001101', // 법정선임자명을 선택해주세요.
          type: 'info',
        });
        return;
      }

      this.popupOptions.target = () => import(`${'./electHisEvalTargetPop'}`);
      this.popupOptions.visible = true;
      this.popupOptions.title = 'L0000005176'; /* 법정선임자 검색 */
      this.popupOptions.param = {
        safElectTitlNo: this.electEvalPlan.safElectTitlNo,
        plantCd: this.electEvalPlan.plantCd,
      };
      this.popupOptions.closeCallback = this.closeUserPop;
    },
    closeUserPop(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;

      if (data && data.length) {
        let removeDuplicateList = data;

        // removeDuplicateList = this.$comm.removeDuplicatedArrayObject(
        //   this.electEvalPlan.electEvalUsers,
        //   removeDuplicateList,
        //   'meUserId'
        // );

        let hasItems = false;
        let filteredArray = [];
        let duplicate = false;

        removeDuplicateList.forEach((el) => {
          hasItems = false;
          this.electEvalPlan.electEvalUsers.forEach((el2) => {
            if (
              el['plantNm'] === el2['plantNm'] &&
              el['meUserId'] === el2['meUserId']
            ) {
              hasItems = true;
              duplicate = true;
            }
          });
          if (!hasItems) filteredArray.push(el);
        });
        removeDuplicateList = filteredArray;

        if (duplicate) {
          window.getApp.$emit('ALERT', {
            title: 'L0000003395' /* 안내 */,
            message:
              'L0000005331' /* 이미 선택된 대상자는 제외하고 추가됩니다.  */,
            type: 'warning',
          });
        }

        removeDuplicateList = removeDuplicateList.map((item) => {
          let row = {
            plantNm: item.plantNm, // 사업장명
            deptNm: item.deptNm, // 부서명
            positionCd: item.positionCd, // 직위명
            positionNm: item.positionNm, // 직위명
            meUserNm: item.meUserNm, // 성명
            meUserNm2: item.meUserNm, // 성명
            meUserId: item.meUserId, // 본인평가자
            meUser: {
              userId: item.meUserId,
              userNm: item.meUserNm,
            }, // 본인평가자 객체
            upUserNm: item.upUserNm, // 상위 평가자명
            upUserId: item.upUserId, // 상위평가자
            upUser: {
              userId: item.upUserId,
              userNm: item.upUserNm,
            }, // 상위평가자 객체
            meProcStep: 'PSURE', // 본인평가 진행상태(COM_PROCESS_STEP2 - 미작성/작성중/완료)
            upProcStep: 'PSURE', // 상위평가 진행상태(COM_PROCESS_STEP2 - 미작성/작성중/완료)
            remark: null, // 비고
          };

          return row;
        });

        this.electEvalPlan.electEvalUsers = this.$_.concat(
          this.electEvalPlan.electEvalUsers,
          removeDuplicateList
        );
      }
    },
    btnDelRow() {
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
        if (
          item.item.evalPlanNo !== undefined &&
          item.item.evalPlanNo !== null &&
          item.item.evalPlanNo !== ''
        ) {
          this.electEvalPlan.deleteElectEvalUsers.push(item.item);
        }
      });
      for (let i = 0; i < removeData.length; i++) {
        this.YAuiGrid.removeRow(removeData[i].rowIndex);
      }

      this.electEvalPlan.electEvalUsers = this.YAuiGrid.getGridData();
    },
    btnRowDelete() {
      if (
        !this.gridOptions.selectedValues ||
        !this.gridOptions.selectedValues.length
      ) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395' /* 안내 */,
          message: '삭제할 항목을 선택해주세요.',
          type: 'warning', // success / info / warning / error
        });
        return;
      }

      this.electEvalPlan.electEvalUsers =
        this.electEvalPlan.electEvalUsers.filter((row) => {
          return !this.gridOptions.selectedValues.includes(row);
        });

      if (!this.electEvalPlan.deleteElectEvalUsers) {
        this.electEvalPlan.deleteElectEvalUsers = [];
      }

      this.gridOptions.selectedValues.forEach((value) => {
        if (
          value.evalPlanNo &&
          value.evalUserNo &&
          this.electEvalPlan.deleteElectEvalUsers.findIndex(
            (item) =>
              item.evalPlanNo === value.evalPlanNo &&
              item.evalUserNo === value.evalUserNo
          ) < 0
        ) {
          this.electEvalPlan.deleteElectEvalUsers.push(value);
        }
      });
    },
    /** /Button Event **/
  },
};
</script>
