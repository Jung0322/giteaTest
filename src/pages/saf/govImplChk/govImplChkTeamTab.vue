<!--
  목적 : 점검>정부지자체 시정조치 이행점검 관리 관리>점검결과 관리>점검결과 상세 팝업
  Detail : 점검결과 상세 팝업화면
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <b-row ref="detailBox">
      <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
        <b-row>
          <b-col sm="8">
            <!-- 점검리더 -->
            <y-text
              :width="8"
              ui="bootstrap"
              :editable="editable && parentEditable"
              :disabled="true"
              :required="true"
              label="L0000004219"
              name="readerDeptNm"
              v-model="govImplChkPlan.readerDeptNm"
            />
          </b-col>
          <b-col sm="4" class="pl-0">
            <!-- 점검리더 -->
            <y-text
              :width="12"
              ui="bootstrap"
              :editable="editable && parentEditable"
              :disabled="true"
              :required="true"
              name="deptReaderNm"
              v-model="govImplChkPlan.deptReaderNm"
              v-validate="'required'"
              :state="validateState('deptReaderNm')"
              :appendIcon="
                editable && parentEditable && !parentDisabled
                  ? [
                      { icon: 'search', callbackName: 'userSearch' },
                      { icon: 'times', callbackName: 'clearUser' },
                    ]
                  : null
              "
              @userSearch="userSearch"
              @clearUser="clearUser"
            />
          </b-col>
        </b-row>
      </b-col>
      <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
        <b-row>
          <!-- <b-col sm="6">
            <div slot="buttonGroup" class="float-right mb-1">
               점검팀원추가 
              <y-btn
                v-if="editable && parentEditable && !parentDisabled"
                title="L0000005281"
                color="orange"
                @btnClicked="btnAddInRater"
              />
               삭제 
              <y-btn
                v-if="editable && parentEditable && !parentDisabled"
                title="L0000001495"
                color="red"
                @btnClicked="btnDelInRater"
              />
            </div>
             내부점검자 목록 
            <y-data-table
              ref="inDataTable"
              :editable="editable && parentEditable && !parentDisabled"
              :height="inGridOptions.height"
              :headers="inGridOptions.header"
              :items="inGridOptions.data"
              :use-paging="false"
              label="L0000005282"
              v-model="inGridOptions.selectedValue"
            >
              <el-table-column
                v-if="editable && parentEditable && !parentDisabled"
                type="selection"
                slot="selection"
                width="55px"
                align="center"
              />
            </y-data-table>
          </b-col> -->
          <b-col sm="6" class="h100p">
            <y-auigrid
              ref="yAuiGrid"
              :editable="true"
              :name="inGridOptions.name"
              :headers="inGridOptions.header"
              :btns="inGridOptions.btns"
              :height="inGridOptions.height"
              :label="this.$comm.getLangSpecInfoLabel('L0000005282')"
              :useExcelExport="false"
              :enableCellMerge="true"
              :enableSorting="true"
              :showRowCheckColumn="true"
              :showGridSetSave="true"
              :useContextMenu="true"
              :enableRightDownFocus="true"
              :showGridCtrl="true"
              :softRemoveRowMode="false"
              @btnAddRowInUser="btnAddRowInUser"
              @btnDelRowInUser="btnDelRowInUser"
              @cellEditEnd="cellEditEndHandler"
            />
          </b-col>
          <b-col sm="6" class="h100p">
            <y-auigrid
              ref="auiGrid"
              :editable="true"
              :name="exGridOptions.name"
              :headers="exGridOptions.header"
              :btns="exGridOptions.btns"
              :height="exGridOptions.height"
              :label="this.$comm.getLangSpecInfoLabel('L0000005310')"
              :useExcelExport="false"
              :enableCellMerge="true"
              :enableSorting="true"
              :showRowCheckColumn="true"
              :showGridSetSave="true"
              :useContextMenu="true"
              :enableRightDownFocus="true"
              :showGridCtrl="true"
              :softRemoveRowMode="false"
              @btnAddRowOutUser="btnAddRowOutUser"
              @btnDelRowOutUser="btnDelRowOutUser"
              @cellEditEnd="cellEditOutEndHandler"
            />
          </b-col>
          <!-- <b-col sm="6">
            <div slot="buttonGroup" class="float-right mb-1">
               행추가 
              <y-btn
                v-if="editable && parentEditable && !parentDisabled"
                title="L0000003226"
                color="orange"
                @btnClicked="btnAddExRater"
              />
               행삭제 
              <y-btn
                v-if="editable && parentEditable && !parentDisabled"
                title="L0000003225"
                color="red"
                @btnClicked="btnDelExRater"
              />
            </div>
             외부점검자 목록 
            <y-data-table
              ref="exDataTable"
              :editable="editable && parentEditable && !parentDisabled"
              :height="exGridOptions.height"
              :headers="exGridOptions.header"
              :items="exGridOptions.data"
              :use-paging="false"
              label="L0000005310"
              v-model="exGridOptions.selectedValue"
            >
              <el-table-column
                v-if="editable && parentEditable && !parentDisabled"
                type="selection"
                slot="selection"
                width="55px"
                align="center"
              />
            </y-data-table>
          </b-col> -->
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
  /** attributes: name, components, props, data **/
  name: 'gov-impl-chk-team-tab',
  props: {
    govImplChkPlan: {
      implChkPlanNo: 0, // 정부지자체 시정조치 이행점검번호
      plantCd: null, // 사업장
      year: null, // 대상년도
      regRegdem: null, // 구분(정기/수시) RSA_REG_REGDEM
      chkStartDt: null, // 점검(계획)시작일
      chkEndDt: null, // 점검(계획)종료일
      chkPeriod: [], // 점검기간
      mainDeptCd: null, // 주관부서
      targetDeptCd: null, // 대상부서
      chkNm: null, // 점검명
      chkDesc: null, // 상세내용
      procStepCd: null, // 단계(COM_STEP)
      stateCd: null, // 상태(COM_STATE)
      stepCd: null, // 결재상태(COM_BIZ_APPR_STEP)
      apprRqstNo: 0, // 결재요청번호
      refGovNm: null, // 관련 정부지자체
      deptReaderId: null, // 평가리더ID
      deptReaderNm: null, // 평가리더
      readerDeptCd: null, // 평가리더 부서코드
      readerDeptNm: null, // 평가리더 부서
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
      govImplChkInRaters: [], // 내부 점검자 목록
      govImplChkExRaters: [], // 외부 점검자 목록
      govImplChkRslt: {
        implChkRsltNo: 0, // 정부지자체 시정조치 이행점검 결과번호
        implChkPlanNo: 0, // 정부지자체 시정조치 이행점검번호
        imprCaseCnt: null, // 개선도출건수
        chkDt: null, // 점검 완료일
        rsltDesc: null, // 점검결과 요약
      },
    },
    parentEditable: {
      type: Boolean,
      default: false,
    },
    parentDisabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      editable: false, // 수정 가능 여부
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '90%',
        top: '10px',
        param: {},
        closeCallback: null,
      },
      regRegdemItems: [], // 구분 selectbox 목록
      disabled: false,
      inGridOptions: {
        name: 'govImplChkTeamTabInGrid',
        btns: [],
        header: [],
        data: [],
        height: '400',
        selectedValue: [],
      },
      exGridOptions: {
        name: 'govImplChkTeamTabOutGrid',
        btns: [],
        header: [],
        data: [],
        height: '400',
        selectedValue: [],
      },
      YAuiGrid: null,
      AuiGrid: null,
    };
  },
  computed: {
    apprState() {
      return (
        this.govImplChkPlan.stepCd === 'BAPSA' ||
        this.govImplChkPlan.stepCd === 'BAPSG'
      );
    },
  },
  watch: {
    'govImplChkPlan.implChkPlanNo': {
      handler: function (newVal, oldVal) {
        if (newVal) {
          // this.inGridOptions.data = this.govImplChkPlan.govImplChkInRaters;
          this.exGridOptions.data = this.govImplChkPlan.govImplChkExRaters;
          this.YAuiGrid.setGridData(this.govImplChkPlan.govImplChkInRaters);
          this.AuiGrid.setGridData(this.govImplChkPlan.govImplChkExRaters);
        }
      },
      deep: true,
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
    this.AuiGrid = this.$refs.auiGrid;
  },
  beforeDestory() {},
  methods: {
    init() {
      this.editable = this.$route.meta.editable;
      setTimeout(() => {
        this.setGridHeader().then(() => {
          this.YAuiGrid.setGridData(this.govImplChkPlan.govImplChkInRaters);
          this.AuiGrid.setGridData(this.govImplChkPlan.govImplChkExRaters);
        });
      }, 300);
      this.inGridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000005281'),
          color: 'orange',
          btnClicked: 'btnAddRowInUser',
          visible: !this.parentDisabled && this.parentEditable,
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001495'),
          color: 'red',
          btnClicked: 'btnDelRowInUser',
          visible: !this.parentDisabled && this.parentEditable,
        },
      ];
      this.exGridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000003226'),
          color: 'orange',
          btnClicked: 'btnAddRowOutUser',
          visible: !this.parentDisabled && this.parentEditable,
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000003225'),
          color: 'red',
          btnClicked: 'btnDelRowOutUser',
          visible: !this.parentDisabled && this.parentEditable,
        },
      ];
      // 구분 (정기/수시)
      this.$comm.getComboItems('RSA_REG_REGDEM', false).then((_result) => {
        this.regRegdemItems = _result;
      });
    },
    setGridHeader() {
      return new Promise((resolve) => {
        this.inGridOptions.header = [
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000001287'),
            dataField: 'deptNm',
            width: '30%',
            editable: false,
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000002769'),
            dataField: 'positionNm',
            width: '20%',
            editable: false,
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000001630'),
            dataField: 'userNm',
            width: '20%',
            editable: false,
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000001360'),
            dataField: 'raterDesc',
            width: '30%',
            editable: !this.parentDisabled && this.parentEditable,
          },
        ];
        this.exGridOptions.header = [
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000001662'),
            dataField: 'companyNm',
            width: '30%',
            editable: !this.parentDisabled && this.parentEditable,
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000002769'),
            dataField: 'positionNm',
            width: '20%',
            editable: !this.parentDisabled && this.parentEditable,
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000001630'),
            dataField: 'userNm',
            width: '20%',
            editable: !this.parentDisabled && this.parentEditable,
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000001360'),
            dataField: 'raterDesc',
            width: '30%',
            editable: !this.parentDisabled && this.parentEditable,
          },
        ];
        resolve();
      });
    },
    getDetail() {
      this.$http.url = this.$format(
        selectConfig.saf.govImplChkResult.get.url,
        this.govImplChkPlan.implChkPlanNo
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          if (_result.data) {
            this.govImplChkPlan = this.$_.clone(_result.data);

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
    /** validation checking **/
    checkValidation(flag) {
      // 값 유효성 체크
      // 유효성 검사 체크
      this.$validator
        .validateAll()
        .then((_result) => {
          if (_result) {
            return true;
          } else {
            // 점검리더 유효성 체크
            if (!this.govImplChkPlan.deptReaderNm) {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395', // 안내
                message: 'L0000005312', // 점검리더를 선택하세요.
                type: 'warning',
              });
              return false;
            }
          }
        })
        .catch((e) => {
          window.getApp.$emit(
            'APP_VALID_ERROR',
            'M0000000876' // 유효성 검사도 에러가 발생하였습니다.
          );
          return false;
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
    userSearch() {
      this.popupOptions.target = () =>
        import(`${'../../manage/user/userSearch.vue'}`);
      this.popupOptions.visible = true;
      this.popupOptions.title = 'L0000001466'; /* 사용자검색 */
      this.popupOptions.param = {
        plantCd: this.govImplChkPlan.plantCd
          ? this.govImplChkPlan.plantCd
          : this.$store.getters.plantCd,
        deptCd: this.govImplChkPlan.mainDeptCd
          ? this.govImplChkPlan.mainDeptCd
          : this.$store.getters.deptCd,
      };
      this.popupOptions.width = '60%';
      this.popupOptions.top = '100px';
      this.popupOptions.closeCallback = this.closePopupSearchUser;
    },
    closePopupSearchUser(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;

      if (data.success && data.user) {
        this.govImplChkPlan.deptReaderId = data.user.userId;
        this.govImplChkPlan.deptReaderNm = data.user.userNm;
        this.govImplChkPlan.readerDeptCd = data.user.deptCd;
        this.govImplChkPlan.readerDeptNm = data.user.deptNm;
      }
    },
    clearUser() {
      this.govImplChkPlan.deptReaderId = null;
      this.govImplChkPlan.deptReaderNm = null;
      this.govImplChkPlan.readerDeptCd = null;
      this.govImplChkPlan.readerDeptNm = null;
    },
    btnAddRowInUser() {
      this.popupOptions.target = () =>
        import(`${'../../manage/user/userSearch.vue'}`);
      this.popupOptions.visible = true;
      this.popupOptions.title = 'L0000001466'; /* 사용자검색 */
      this.popupOptions.param = {
        plantCd: this.govImplChkPlan.plantCd
          ? this.govImplChkPlan.plantCd
          : this.$store.getters.plantCd,
        deptCd: this.govImplChkPlan.mainDeptCd
          ? this.govImplChkPlan.mainDeptCd
          : this.$store.getters.deptCd,
        multiple: true,
      };
      this.popupOptions.width = '60%';
      this.popupOptions.top = '100px';
      this.popupOptions.closeCallback = this.closeAddInRater;
    },
    cellEditEndHandler() {
      this.govImplChkPlan.govImplChkInRaters = this.YAuiGrid.getGridData();
    },
    cellEditOutEndHandler() {
      this.govImplChkPlan.govImplChkExRaters = this.AuiGrid.getGridData();
    },
    btnAddInRater() {
      this.popupOptions.target = () =>
        import(`${'../../manage/user/userSearch.vue'}`);
      this.popupOptions.visible = true;
      this.popupOptions.title = 'L0000001466'; /* 사용자검색 */
      this.popupOptions.param = {
        plantCd: this.govImplChkPlan.plantCd
          ? this.govImplChkPlan.plantCd
          : this.$store.getters.plantCd,
        deptCd: this.govImplChkPlan.mainDeptCd
          ? this.govImplChkPlan.mainDeptCd
          : this.$store.getters.deptCd,
        multiple: true,
      };
      this.popupOptions.width = '60%';
      this.popupOptions.top = '100px';
      this.popupOptions.closeCallback = this.closeAddInRater;
    },
    closeAddInRater(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;

      if (data.success && data.users) {
        let selectedUsers = this.$comm.removeDuplicatedArrayObject(
          this.YAuiGrid.getGridData(),
          data.users,
          'userId'
        );
        this.$_.forEach(selectedUsers, (item) => {
          let row = {
            deptCd: item.deptCd,
            deptNm: item.deptNm,
            positionCd: item.positionCd,
            positionNm: item.positionNm,
            userId: item.userId,
            userNm: item.userNm,
            raterDesc: item.raterDesc,
          };
          this.YAuiGrid.addRow(row, 'first');
        });

        this.govImplChkPlan.govImplChkInRaters = this.YAuiGrid.getGridData();
      }
    },
    btnDelRowInUser() {
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

      this.govImplChkPlan.govImplChkInRaters = this.YAuiGrid.getGridData();
    },
    btnDelInRater() {
      this.inGridOptions.data = this.$_.reject(
        this.inGridOptions.data,
        (item) => {
          return this.inGridOptions.selectedValue.includes(item);
        }
      );

      this.govImplChkPlan.govImplChkInRaters = this.inGridOptions.data;
    },
    btnAddRowOutUser() {
      let row = {
        companyNm: null, // 소속
        positionNm: null, // 직위
        userNm: null, // 성명
        raterDesc: null, // 비고
      };
      this.AuiGrid.addRow(row, 'first');
      this.cellEditOutEndHandler();
    },
    btnDelRowOutUser() {
      let removeData = this.AuiGrid.getCheckedRowItems();
      if (removeData.length === 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // '안내',
          message: 'M0000001614', // 선택된 항목이 없습니다.
          type: 'warning',
        });
        return;
      }
      for (let i = 0; i < removeData.length; i++) {
        this.AuiGrid.removeRow(removeData[i].rowIndex);
      }

      this.cellEditOutEndHandler();
    },
    btnAddExRater() {
      this.exGridOptions.data.push({
        companyNm: null, // 소속
        positionNm: null, // 직위
        userNm: null, // 성명
        raterDesc: null, // 비고
      });

      this.govImplChkPlan.govImplChkExRaters = this.exGridOptions.data;
    },
    btnDelExRater() {
      this.exGridOptions.data = this.$_.reject(
        this.exGridOptions.data,
        (item) => {
          return this.exGridOptions.selectedValue.includes(item);
        }
      );

      this.govImplChkPlan.govImplChkExRaters = this.exGridOptions.data;
    },
    /** /Button Event **/
  },
};
</script>
