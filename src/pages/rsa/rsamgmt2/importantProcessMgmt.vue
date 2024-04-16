<!--
  목적 : 위험성평가 > 작업 위험성평가 관리 > 중요위험등록부 관리
  Detail : 평가계획 관리 등록/조회 화면
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <y-search-box :gridOptions="gridOptions" @enter="getList">
      <b-row slot="search">
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <y-plant type="search" :width="8" v-model="searchParam.plantCd" />
        </b-col>
        <!-- 평가팀 -->
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <b-row>
            <b-col sm="4" md="4" lg="4" xl="4">
              <y-label label="L0000004990" />
            </b-col>
            <b-col sm="8" md="8" lg="8" xl="8">
              <y-tag-structure
                :width="12"
                itemText="deptNm"
                itemValue="deptCd"
                newLabelText="부서 추가"
                :clearable="true"
                v-model="deptCdList"
                name="deptCdList"
                @customNewTag="searchDept"
              />
            </b-col>
          </b-row>
        </b-col>
        <!-- 분류 -->
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <y-select
            :width="8"
            :comboItems="classificationItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            label="L0000001341"
            name="classificationCd"
            v-model="searchParam.classificationCd"
          ></y-select>
        </b-col>
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <!-- 평가기간 -->
          <y-datepicker
            :width="8"
            name="period"
            label="L0000003062"
            :range="true"
            :default="searchParam.period"
            v-model="searchParam.period"
          />
        </b-col>
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <!-- 평가담당자 -->
          <y-text
            :width="8"
            :clearable="true"
            :disabled="true"
            ui="bootstrap"
            label="L0000004201"
            name="userNm"
            v-model="searchParam.userNm"
            :appendIcon="[
              { icon: 'times', callbackName: 'clear' },
              { icon: 'search', callbackName: 'searchUser' },
            ]"
            @searchUser="btnSearchUserClicked"
            @clear="clear('rqst')"
          />
        </b-col>
        <!-- 평가구분 -->
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <y-select
            :width="8"
            :comboItems="rsaRegRegdemItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            label="L0000003059"
            name="regRegdem"
            v-model="searchParam.regRegdem"
          ></y-select>
        </b-col>
        <!-- 개선진행상태 -->
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <y-select
            :width="8"
            codeGroupCd="SAF_IMPR_STEP"
            firstTitle="L0000002519"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            label="L0000000282"
            name="rsltStepCd"
            type="search"
            v-model="searchParam.rsltStepCd"
          ></y-select>
        </b-col>

        <!-- 평가명 -->
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <y-text
            :width="8"
            ui="bootstrap"
            label="L0000003081"
            name="assessNm"
            v-model="searchParam.assessNm"
          ></y-text>
        </b-col>
        <!-- 공정 -->
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <y-select
            :width="8"
            :comboItems="processItems"
            itemText="processNm"
            itemValue="processCd"
            ui="bootstrap"
            label="L0000000515"
            name="processCd"
            v-model="searchParam.processCd"
          ></y-select>
        </b-col>

        <!-- 작업명 -->
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <y-text
            :width="8"
            ui="bootstrap"
            label="L0000002389"
            name="jobNm"
            v-model="searchParam.jobNm"
          ></y-text>
        </b-col>
      </b-row>
    </y-search-box>
    <!-- 검색 결과 테이블 -->
    <b-row class="mt-3">
      <b-col sm="12">
        <b-col sm="12" class="px-0">
          <!-- 위험등록부 목록 -->
          <!-- <y-data-table
                ref="dataTable"
                :height="gridOptions.height"
                :headers="gridOptions.header"
                :items="gridOptions.data"
                :print="true"
                :use-paging="true"
                @tableLinkClicked="tableLinkAccidentTitleClicked"
                :cellClassName="tableCellClassName"
                label="L0000005890"
                v-model="selectedValue"
              >
                <el-table-column
                  :selectable="selectCheck"
                  type="selection"
                  slot="selection"
                  align="center"
                  width="55"
                ></el-table-column>
              </y-data-table> -->
          <y-auigrid
            ref="yAuiGrid"
            :name="gridOptions.name"
            :headers="gridOptions.header"
            :btns="gridOptions.btns"
            :height="gridOptions.height"
            :label="this.$comm.getLangSpecInfoLabel('L0000005890')"
            :useExcelExport="false"
            :enableCellMerge="true"
            :enableSorting="true"
            :showGridSetSave="true"
            :useContextMenu="true"
            :enableRightDownFocus="true"
            :showGridCtrl="true"
            :showRowCheckColumn="true"
            @reEval="reEval"
            @getList="getList"
          />
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
  /* attributes: name, components, props, data */
  name: 'y-assess-plan',
  props: {},
  data: () => ({
    searchParam: {
      plantCd: '', // 사업장
      period: [], // 평가기간
      assessNm: '',
      classificationCd: '',
      processCd: '', // 구분
      yearChk: '',
      riskType: '',
      stateCd: '', // 상태
      apprStatusCd: '', // 결재상태
      deptSubYn: 'Y', // 하위부서여부 사용
      deptCd: [],
      statusCd: null,
      regRegdem: '',
      userId: '',
      userNm: '',
      jobNm: '',
      rsltStepCd: '',
      reAssessYn: '',
    },
    gridOptions: {
      header: [],
      data: [],
      height: 'auto',
    },
    popupOptions: {
      target: null,
      title: '',
      visible: false,
      param: {},
      width: '90%',
      top: '10px',
      closeCallback: null,
    },
    editable: false,
    rsaAssessTypeItems: [], // 기법
    rsaRegRegdemItems: [], // 구분
    selectedValue: [],
    processItems: [], // 공정
    stateItems: [], // 상태
    statusItem: [{ code: null, codeNm: '계획' }], // 단계
    searchUrl: '',
    companyEditable: false, // 전사 권한
    plantEditable: false, // 사업장 권한
    deptEditable: false, // 일반 권한
    excelUrl: '',
    processUrl: '',
    insertUrl: '',
    classificationUrl: '',
    isInsert: false,
    Planmgmt: {
      assessPlanNo: 0,
    },
    deptCdList: [],
    classificationItems: [],
    YAuiGrid: null,
  }),
  watch: {
    'searchParam.plantCd': function (newValue, oldValue) {
      this.getProcessList();
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
    this.getList();
  },
  beforeDestroy() {},
  //* methods */
  methods: {
    tableCellClassName({ row, column, rowIndex, colIndex }) {
      if (column.property === 'overDateCnt' && row['overDateCnt'] !== '0') {
        return 'row-color';
      }
    },
    init() {
      this.editable = this.$route.meta.editable;
      this.searchParam.plantCd = this.$store.getters.plantCd;
      this.getProcessList();
      // this.searchParam.period = this.$comm.moment().format('YYYY');
      this.classificationUrl =
        selectConfig.rsa.planmgmt2.getClassificationListForDepts.url;
      this.excelUrl = selectConfig.rsa.planmgmt2.getResultExcelDown.url;
      // Url Setting
      this.searchUrl = selectConfig.rsa.planmgmt2.list5.url;
      this.insertUrl = transactionConfig.rsa.planmgmt2.insertReEval.url;
      this.$comm.getComboItems('RSA_ASSESS_TYPE', true).then((_result) => {
        this.rsaAssessTypeItems = _result;
      });
      // 평가구분
      this.$comm.getComboItems('RSA_REG_REGDEM', true).then((_result) => {
        this.rsaRegRegdemItems = _result;
      });
      this.$comm.getComboItems('COM_STATE', true).then((_result) => {
        this.stateItems = _result.filter((v) => v.code !== 'STATE1');
      });
      // 분류
      this.$comm.getComboItems('RSA_ASSESS_CLASS', true).then((_result) => {
        this.classificationItems = _result;
      });

      /* 쿠키에 저장된 검색 조건이 있을 경우 최초 페이지 진입시 자동 설정 */
      var searchParamByCookie = this.$comm.setSearchParamByCookie();
      if (typeof searchParamByCookie !== 'undefined') {
        this.searchParam = searchParamByCookie;
        if (!this.searchParam.deptCd) {
          this.searchParam.deptCd = [];
        }
        if (!this.searchParam.deptCdList) {
          this.searchParam.deptCdList = [];
        }
      }

      if (this.$route.meta.param === 'W') {
        this.searchParam.riskType = 'work';
      } else {
        this.searchParam.riskType = 'proc';
      }

      // 권한별 컨트롤 처리
      if (this.$comm.isCompanyGrp()) {
        // 전사권한
        this.companyEditable = true;
        this.plantEditable = true;
        this.deptEditable = true;
      } else if (this.$comm.isPlantGrp()) {
        // 사업장권한
        this.plantEditable = true;
        this.deptEditable = true;
      } // 일반권한
      else {
        this.deptEditable = true;
        this.searchParam.deptCd = this.$store.getters.deptCd;
      }

      // 그리드 헤더 설정
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000005872'),
          dataField: 'refManagNo',
          width: 200,
        } /* 중요위험번호 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000005886'),
          dataField: 'managNo',
          width: 150,
        } /* 개선요청관리번호 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001415'),
          dataField: 'plantNm',
          width: 100,
        } /* 사업장 */,

        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000271'),
          dataField: 'rsltStepNm',
          width: 100,
        } /* 개선요청상태 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003081'),
          dataField: 'assessNm',
          width: 200,
        } /* 평가명 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003059'),
          dataField: 'regRegdemNm',
          width: 100,
        } /* 평가구분 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004990'),
          dataField: 'deptNm',
          width: 200,
        } /* 평가팀 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001341'),
          dataField: 'classificationNm',
          width: 100,
        } /* 분류 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000590'),
          dataField: 'jobManageNo',
          width: 200,
        } /* 관리번호 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004201'),
          dataField: 'approvalUserNm',
          width: 100,
        } /* 평가담당자 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003092'),
          dataField: 'assessDate',
          width: 100,
        } /* 평가일자 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000515'),
          dataField: 'processNm',
          width: 100,
        } /* 공정 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002389'),
          dataField: 'jobNm',
          width: 100,
        } /* 작업명 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000005887'),
          dataField: 'causeEffect',
          width: 100,
        } /* 중요위험요인 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000275'),
          dataField: 'prevRisk',
          width: 100,
        } /* 개선전 위험도 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000005888'),
          dataField: 'actResultContents',
          width: 100,
        } /* 개선결과 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002044'),
          dataField: 'actConfirmYmd',
          width: 200,
        } /* 개선결과 */,
      ];

      // 그리드 버튼 설정
      this.gridOptions.btns = [
        // 재평가
        {
          title: this.$comm.getLangSpecInfoLabel('L0000005889'),
          color: 'orange',
          btnClicked: 'reEval',
        },

        // 검색
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000327'),
          color: 'green',
          btnClicked: 'getList',
        },
      ];
    },
    /*  한화솔루션 SHE 고도화 프로젝트(쿠키 삭제) wukjin.j 220627 */
    removeCookie() {
      this.$comm.deleteSearchParamByCookie();
      this.$router.go();
    },

    clear(type) {
      this.searchParam.userId = null;
      this.searchParam.userNm = null;
    },
    searchDept() {
      this.popupOptions.target = () =>
        import(`${'@/pages/baseInfo/deptManage/deptSearch.vue'}`);
      this.popupOptions.title = this.$comm.getLangSpecInfoLabel('L0000004209');
      this.popupOptions.visible = true;
      this.popupOptions.width = '60%';
      this.popupOptions.top = '100px';
      this.popupOptions.param = {
        multiple: true,
        defaultExpandAll: true,
        plantCd: this.searchParam.plantCd,
      };
      this.popupOptions.closeCallback = this.closeDeptPopup;
    },
    closeDeptPopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;

      if (data && data.success) {
        if (data.depts) {
          this.$_.forEach(data.depts, (dept) => {
            let index = this.$_.findIndex(this.deptCdList, {
              deptCd: dept.deptCd,
            });
            if (index === -1) {
              this.deptCdList.push({
                deptCd: dept.deptCd,
                deptNm: dept.deptNm,
              });
            }
          });
        } else if (data.dept) {
          let index = this.$_.findIndex(this.deptCdList, {
            deptCd: data.dept.deptCd,
          });
          if (index === -1) {
            this.deptCdList = [
              {
                deptCd: data.dept.deptCd,
                deptNm: data.dept.deptNm,
              },
            ];
          }
        }
      }
    },
    confirm() {
      let evalFlag = false;
      let imprFlag = false;
      let afterRiskFlag = false;
      let prevJobManageNo = null; // 이전의 jobManageNo를 저장하기 위한 변수
      let selectedValue = this.YAuiGrid.getCheckedRowItemsAll();
      if (
        !selectedValue ||
        selectedValue === null ||
        selectedValue.length === 0
      ) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: 'L0000005896', // 재평가할 행을 선택하세요.
          type: 'warning', // success / info / warning / error
        });
        return;
      } else if (selectedValue.length > 0) {
        // item 내부의 jobManageNo 가 서로 다른 두개의 번호가 존재할때
        this.$_.forEach(selectedValue, (item) => {
          if (item.rsltStepCd !== 'IMST5') {
            window.getApp.$emit('ALERT', {
              title: 'L0000003395',
              message: 'L0000005897', // 개선요청상태가 개선완료인 건만 재평가 가능합니다.
              type: 'warning', // success / info / warning / error
            });
            imprFlag = true;
            return false;
          } else if (prevJobManageNo && prevJobManageNo !== item.jobManageNo) {
            // 이전의 jobManageNo와 현재의 jobManageNo가 다른 경우
            evalFlag = true; // evalFlag를 true로 설정
            return false; // 반복문 탈출
          }

          if (item.afterRisk) {
            afterRiskFlag = true;

            return false;
          }

          prevJobManageNo = item.jobManageNo; // 현재의 jobManageNo를 prevJobManageNo에

          if (evalFlag === true) {
            window.getApp.$emit('ALERT', {
              title: 'L0000003395',
              // 서로 다른 관리번호가 존재합니다. 동일한 관리번호가 존재하는 건만 재평가 가능합니다. 관리번호를 확인해주세요.
              message: 'L0000005898',
              type: 'warning', // success / info / warning / error
            });
          } else if (afterRiskFlag === true) {
            window.getApp.$emit('ALERT', {
              title: 'L0000003395',
              // 이미 재평가가 완료된 건이 존재합니다.
              message: 'L0000006064',
              type: 'warning', // success / info / warning / error
            });
          } else if (evalFlag === false && imprFlag === false) {
            window.getApp.$emit('CONFIRM', {
              title: 'L0000003321', // 확인
              message: 'L0000005899', // 재평가를 진행하시겠습니까?
              type: 'info',
              confirmCallback: () => {
                let refManagNoList = [];
                this.$_.forEach(selectedValue, (item) => {
                  let tempItem = {
                    safImprActNo: item.safImprActNo,
                    refManagNo: item.refManagNo,
                    jsaNo: item.jsaNo,
                  };
                  refManagNoList.push(tempItem);
                });
                this.Planmgmt.assessPlanNo = selectedValue[0].assessPlanNo;
                this.Planmgmt.assessRsltNo = selectedValue[0].assessRsltNo;
                this.Planmgmt.planmgmtDeptList = refManagNoList;
                return new Promise((_resolve, _reject) => {
                  window.getApp.$emit('CONFIRM', {
                    title: 'L0000003321', // '확인',
                    message: 'L0000005899', // 재평가를 진행하시겠습니까?
                    type: 'info',
                    confirmCallback: () => {
                      _resolve(true);
                    },
                    cancelCallback: () => {
                      _resolve(false);
                    },
                  });
                });
              },
            });
          }
        });
      }
    },
    reEvalData() {
      return new Promise((_resolve, _reject) => {
        this.$http.url = this.insertUrl;
        this.$http.type = 'POST';
        this.$http.param = this.Planmgmt;
        this.$http.request(
          (_result) => {
            this.btnInsertClickedCallback(_result);
          },
          (_error) => {
            window.getApp.$emit('APP_REQUEST_ERROR', _error);
            _reject(_error);
          }
        );
      });
    },
    reEval() {
      this.$comm.recursivePromise([
        {
          func: this.confirm,
        },
        { func: this.reEvalData },
      ]);
    },
    // reEval() {
    //   let evalFlag = false;
    //   let imprFlag = false;
    //   let afterRiskFlag = false;
    //   let prevJobManageNo = null; // 이전의 jobManageNo를 저장하기 위한 변수
    //   if (
    //     !this.selectedValue ||
    //     this.selectedValue === null ||
    //     this.selectedValue.length === 0
    //   ) {
    //     window.getApp.$emit('ALERT', {
    //       title: 'L0000003395',
    //       message: 'L0000005896', // 재평가할 행을 선택하세요.
    //       type: 'warning', // success / info / warning / error
    //     });
    //     return;
    //   } else if (this.selectedValue.length > 0) {
    //     // item 내부의 jobManageNo 가 서로 다른 두개의 번호가 존재할때
    //     this.$_.forEach(this.selectedValue, (item) => {
    //       if (item.rsltStepCd !== 'IMST5') {
    //         window.getApp.$emit('ALERT', {
    //           title: 'L0000003395',
    //           message: 'L0000005897', // 개선요청상태가 개선완료인 건만 재평가 가능합니다.
    //           type: 'warning', // success / info / warning / error
    //         });
    //         imprFlag = true;
    //         return false;
    //       } else if (prevJobManageNo && prevJobManageNo !== item.jobManageNo) {
    //         // 이전의 jobManageNo와 현재의 jobManageNo가 다른 경우
    //         evalFlag = true; // evalFlag를 true로 설정
    //         return false; // 반복문 탈출
    //       }

    //       if (item.afterRisk) {
    //         afterRiskFlag = true;

    //         return false;
    //       }

    //       prevJobManageNo = item.jobManageNo; // 현재의 jobManageNo를 prevJobManageNo에
    //     });

    //     if (evalFlag === true) {
    //       window.getApp.$emit('ALERT', {
    //         title: 'L0000003395',
    //         // 서로 다른 관리번호가 존재합니다. 동일한 관리번호가 존재하는 건만 재평가 가능합니다. 관리번호를 확인해주세요.
    //         message: 'L0000005898',
    //         type: 'warning', // success / info / warning / error
    //       });
    //     } else if (afterRiskFlag === true) {
    //       window.getApp.$emit('ALERT', {
    //         title: 'L0000003395',
    //         // 이미 재평가가 완료된 건이 존재합니다.
    //         message: 'L0000006064',
    //         type: 'warning', // success / info / warning / error
    //       });
    //     } else if (evalFlag === false && imprFlag === false) {
    //       window.getApp.$emit('CONFIRM', {
    //         title: 'L0000003321', // 확인
    //         message: 'L0000005899', // 재평가를 진행하시겠습니까?
    //         type: 'info',
    //         confirmCallback: () => {
    //           let refManagNoList = [];
    //           this.$_.forEach(this.selectedValue, (item) => {
    //             let tempItem = {
    //               safImprActNo: item.safImprActNo,
    //               refManagNo: item.refManagNo,
    //               jsaNo: item.jsaNo,
    //             };
    //             refManagNoList.push(tempItem);
    //           });
    //           this.Planmgmt.assessPlanNo = this.selectedValue[0].assessPlanNo;
    //           this.Planmgmt.assessRsltNo = this.selectedValue[0].assessRsltNo;
    //           this.Planmgmt.planmgmtDeptList = refManagNoList;
    //           this.isInsert = true;
    //         },
    //       });
    //     }
    //   }
    // },

    getProcessList() {
      this.$http.url = selectConfig.rsa.planmgmt2.getProcessList.url;
      this.$http.param = {
        plantCd: this.searchParam.plantCd,
      };
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          if (_result.data) {
            this.processItems = _result.data;

            if (this.processItems) {
              this.processItems.splice(0, 0, {
                processCd: null,
                processNm: this.$comm.getLangSpecInfoLabel('L0000003394'),
              }); // 선택하세요
            }
          } else {
            this.processItems = [
              {
                processCd: null,
                processNm: this.$comm.getLangSpecInfoLabel('L0000003394'),
              },
            ];
          }

          this.updateMode = true;
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    selectCheck() {
      return true;
    },
    btnSearchUserClicked(_item) {
      this.popupOptions.target = () =>
        import(`${'../../manage/user/userSearch.vue'}`);
      this.popupOptions.title = 'L0000001466'; // 사용자검색
      this.popupOptions.visible = true;
      this.popupOptions.width = '60%';
      this.popupOptions.top = '100px';
      this.popupOptions.param = {
        multiple: false,
        defaultExpandAll: true,
        plantCd: this.searchParam.plantCd,
      };
      this.popupOptions.closeCallback = this.closePopupSearchUser;
    },
    closePopupSearchUser(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;

      if (data.user) {
        this.searchParam.userId = data.user.userId;
        this.searchParam.userNm = data.user.userNm;
      }
    },
    /**
     * showAccidentPopup 호출
     * 평가계획 목록에 평가명 col 클릭시 마다 발생
     * header : 헤더 정보
     * data : 클릭한 col의 row 정보
     */
    tableLinkAccidentTitleClicked(header, data) {
      if (header.name === 'rsltStepNm') {
        this.showApprProgressPopup(data);
      } else {
        this.openPopup(data);
      }
    },

    btnInsertClickedCallback(result) {
      window.getApp.$emit('ALERT', {
        title: 'L0000003395',
        // 재평가를 등록하였습니다. 결과 등록 화면에서 확인 가능합니다.
        message: 'L0000005900',
        type: 'success', // success / info / warning / error
      });

      this.getList();
    },

    openDeptListPopup(data) {
      this.popupOptions.target = () =>
        import(`${'./planmgmtDeptListPopup.vue'}`);
      this.popupOptions.width = '90%';
      this.popupOptions.visible = true;
      this.popupOptions.title = 'L0000000928'; // '대상부서 목록';
      this.popupOptions.param = {
        assessPlanNo: data.assessPlanNo,
        apprFlag: data.apprFlag,
      };

      this.popupOptions.closeCallback = this.closePopup;
    },
    // 개선요청상태 조회
    showApprProgressPopup(data) {
      if (!data.safImprActNo) {
        this.popupOptions.title = 'L0000000268'; /* 개선요청등록 */
        this.popupOptions.target = () =>
          import(`${'@/pages/impr/actionRequest.vue'}`);
        this.popupOptions.param = {
          safImprActNo: 0,
          refTableId: data.jsaNo,
          imprClassCd: 'ICL45',
          // imprStepCd: 'IMST2',
          taskClassNm: '',
          actClassYn: false,
          plantCd: data.plantCd,
        };
      } else {
        this.popupOptions.title = 'L0000000268'; /* 개선요청등록 */
        this.popupOptions.target = () =>
          import(`${'@/pages/impr/improveDetail.vue'}`);
        this.popupOptions.param = {
          safImprActNo: data.safImprActNo,
          refTableId: data.jsaNo,
          imprClassCd: 'ICL45',
          imprStepCd: 'IMST2',
        };
      }

      this.popupOptions.top = '10px';
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closePopup;
    },
    openPopup(data) {
      this.popupOptions.target = () =>
        import(`${'./planmgmtResultDetail.vue'}`);
      this.popupOptions.width = '90%';
      this.popupOptions.visible = true;
      this.popupOptions.title = 'L0000005895'; // 위험성평가 결과 상세;
      this.popupOptions.param = data
        ? data
        : { assessRsltNo: 0, riskType: this.searchParam.riskType };
      this.popupOptions.closeCallback = this.closePopup;
    },
    /** 위험성 평가계획 수립 목록 검색 **/
    getList() {
      this.searchParam.yearChk =
        this.searchParam.yearChk === '' ? 'N' : this.searchParam.yearChk;
      this.searchParam.reAssessYn = 'N';

      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      if (!this.searchParam.deptCd) {
        this.searchParam.deptCd = [];
      }
      if (!this.searchParam.deptCdList) {
        this.searchParam.deptCdList = [];
      }
      this.searchParam.deptCd = this.$_.map(this.deptCdList, (dept) => {
        return dept.deptCd;
      });
      this.$http.param = this.searchParam;

      this.$http.request(
        (_result) => {
          this.$comm.pushCookie(this.searchParam);
          this.gridOptions.data = this.$_.clone(_result.data);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    /**
     *  팝업 안 보이도록 설정 후 getReserveData 호출
     *  팝업 close
     * data : 팝업창에서 return하는 데이터
     */
    closePopup(data) {
      if (data === null || data === undefined) return;
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.getList();
    },
    btnClickedErrorCallback(_result) {
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    setDeptSubYn(_result) {
      // 하위부서 tree에서 값이 변경될 경우 현재값 변경
      this.searchParam.deptSubYn = _result;
    },
    /** end button 관련 이벤트 **/
  },
};
</script>
<style>
.row-color .el-button {
  color: red !important;
}
</style>
