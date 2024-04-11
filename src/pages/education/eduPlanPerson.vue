<!--
  목적 : 교육계획 등록-> 교육계획탭
  Detail : 교육대상자 등록/수정화면
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <!-- 검색 -->

    <b-row v-if="tabEditable && !authDuringAppr" ref="searchBox">
      <b-col sm="12">
        <b-card
          header-class="default-card"
          body-class="default-body-card"
          class="py-0"
        >
          <b-row v-if="searchArea.show">
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 교육그룹 -->
              <y-select
                :width="8"
                :comboItems="eduGroupCds"
                itemText="grpNm"
                itemValue="eduGrpNo"
                ui="bootstrap"
                label="L0000000640"
                name="eduGrpNo"
                v-model="eduMaster.eduGrpNo"
              ></y-select>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 선택그룹 전체지정 -->
              <y-btn
                v-if="editable && !search"
                :width="8"
                title="L0000001562"
                color="orange"
                @btnClicked="btnSearchEduGroupClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
            </b-col>
          </b-row>
          <hr />
          <b-row>
            <b-col sm="2" md="2" lg="2" xl="2" class="col-xxl-1">
              <!-- 법정선임자(법규) -->
              <y-label label="L0000005351"></y-label>
            </b-col>
            <!-- <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-2">
              <y-select
                :comboItems="refLawCdItems"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                name="refLawCd"
                v-model="refLawCd"
              ></y-select>
            </b-col> -->
            <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-2">
              <y-select
                :comboItems="electTitleItems"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                name="safElectTitlNo"
                v-model="safElectTitlNo"
              ></y-select>
            </b-col>
            <b-col sm="2" md="2" lg="2" xl="2" class="col-xxl-1">
              <!-- 법정선임 대상자 전체지정 -->
              <y-btn
                v-if="editable && !search"
                title="L0000005350"
                color="orange"
                @btnClicked="btnSearchElectTitlNoClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
            </b-col>
          </b-row>
          <hr />
          <b-row>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 부서 -->
              <y-text
                label="L0000001287"
                :width="8"
                :editable="editable"
                placeholder="L0000005330"
                :dtlNull="true"
                v-model="eduMaster.targetDeptNm"
                :plantCd="eduMaster.plantCd"
                :disabled="true"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 사원명 -->
              <y-text
                :width="8"
                :editable="editable"
                label="L0000001482"
                ui="bootstrap"
                name="userNm"
                v-model="searchUserParam.userNm"
              ></y-text>
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>

    <b-row class="mt-3" ref="searchBox">
      <b-col sm="12">
        <b-row>
          <b-col sm="5" class="h100p">
            <y-auigrid
              ref="yAuiGrid"
              :name="gridTestItemLeftOptions.name"
              :headers="gridTestItemLeftOptions.header"
              :btns="gridTestItemLeftOptions.btns"
              :height="gridTestItemLeftOptions.height"
              :useExcelExport="false"
              :enableCellMerge="true"
              :enableSorting="true"
              :showGridSetSave="true"
              :useContextMenu="true"
              :showRowCheckColumn="true"
              :enableRightDownFocus="true"
              :showGridCtrl="true"
              @getUserList="getUserList"
            />
          </b-col>
          <!-- 가운데 버튼 영역 -->
          <b-col sm="1" md="1" lg="1" xl="1" class="col-xxl-1 text-center">
            <b-row
              v-if="tabEditable && !authDuringAppr"
              align-v="center"
              style="height: 100%"
            >
              <b-col>
                <b-row class="mb-2">
                  <b-col>
                    <b-button @click.stop="btnMoveClicked">
                      <f-icon icon="angle-right" />
                    </b-button>
                  </b-col>
                </b-row>
                <b-row>
                  <b-col>
                    <b-button @click.stop="btnDeleteTestItemClicked">
                      <f-icon icon="angle-left" />
                    </b-button>
                  </b-col>
                </b-row>
              </b-col>
            </b-row>
          </b-col>
          <b-col sm="6" class="h100p">
            <y-auigrid
              ref="auiGrid"
              :name="gridTestItemRightOptions.name"
              :headers="gridTestItemRightOptions.header"
              :btns="gridTestItemRightOptions.btns"
              :height="gridTestItemRightOptions.height"
              :useExcelExport="false"
              :enableCellMerge="true"
              :enableSorting="true"
              :showGridSetSave="true"
              :useContextMenu="true"
              :showRowCheckColumn="true"
              :enableRightDownFocus="true"
              :showGridCtrl="true"
              @btnExcelTemplateDownClicked="btnExcelTemplateDownClicked"
              @btnExcelUploadClicked="btnExcelUploadClicked"
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
export default {
  /* attributes: name, components, props, data */
  name: 'edu-plan-person',
  props: {
    tabEditable: false,
    search: false,
    authDuringAppr: false,
    eduMaster: {
      safEduMstNo: 0,
      eduAttCd: null,
      safEduCourseNo: null,
      eduTypeCd: null,
      deptCd: null,
      eduNm: '',
      duration: [],
      eduGrpNo: 0,
      eduTime: 0,
      eduSYmd: '',
      eduEYmd: '',
      eduPlace: '',
      eduTeacher: '',
      eduContent: '',
      processStepCd: '',
      disYn: '',
      eduUserId: [],
      eduDeptCd: [],
      eduGroupCds: [],
      targetDeptCd: null,
    },
    refresh: false,
  },
  data: () => ({
    searchParam: {
      safEduMstNo: '',
    },
    searchUserParam: {
      userNm: '',
      deptCd: '',
    },
    searchArea: {
      title: 'L0000000329' /* 검색박스숨기기 */,
      show: true,
    },
    gridOptions: {
      header: [],
      data: [],
      height: '300',
    },
    searchUserUrl: '',
    searchYearlyUserUrl: '', // sk e&s
    gridTestItemLeftOptions: {
      name: 'eduPlanPersonAllUser',
      btns: [],
      header: [],
      data: [],
      height: '300',
    },
    YAuiGrid: null,
    AuiGrid: null,
    gridTestItemRightOptions: {
      name: 'eduPlanPersonEduUser',
      btns: [],
      header: [],
      data: [],
      height: '300',
    },
    eduGroupCds: [],
    testItemLeftValueCheckData: [],
    testItemLeftValue: [],
    searchDeptCd: '',

    testItemRightValue: [],
    editable: false,
    popupOptions: {
      target: null,
      title: '',
      visible: false,
      width: '80%',
      top: '10px',
      param: {},
      closeCallback: null,
    },
    refLawCd: null,
    safElectTitlNo: null,
    refLawCdItems: [],
    electTitleItems: [],
    disabled: false,
  }),
  //* Vue lifecycle: created, mounted, destroyed, etc */
  watch: {
    'eduMaster.safEduMstNo': function (newValue, oldValue) {
      if (this.eduMaster.safEduMstNo !== 0) {
        this.getDetailUser();
      }
    },
    'eduMaster.plantCd': function (n, o) {
      this.getEduGroupList();
    },
    refLawCd: function (newValue, oldValue) {
      this.safElectTitlNo = null;
      this.getElectTitleComboItems();
    },
    refresh() {
      if (this.eduMaster.safEduMstNo !== 0) {
        this.getDetailUser();
      }
    },
    'eduMaster.safEduCourseNo': function (newValue, oldValue) {
      if (newValue) {
        if (this.eduMaster.safEduMstNo) {
          this.getDetailUser();
        } else {
          this.getEduCoursePsn();
        }
      } else {
        // this.gridTestItemRightOptions.data = [];
        this.AuiGrid.setGridData([]);
        this.setUserList();
      }
    },
  },
  beforeCreate() {},
  created() {},
  update() {},
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
      // sk E&S
      this.isManager = this.$store.getters.token === 'manager' ? true : false;

      // this.eduMaster.plantCd = this.$store.getters.plantCd;
      // url 셋팅
      this.searchUserUrl = selectConfig.manage.user.list.url;

      this.getEduGroupList();
      this.getRefLawCdList();
      // this.getUserList(); // 부서에 따른 사용자 검색

      // 이수자 검색
      if (this.eduMaster.safEduMstNo !== 0) {
        this.getDetailUser();
      }

      // 선택된 부서의 유저 목록 그리드 헤더 설정 왼쪽
      this.gridTestItemLeftOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001415'),
          dataField: 'plantNm',
          width: '33%',
          style: 'left-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001287'),
          dataField: 'deptNm',
          width: '33%',
          style: 'left-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001482'),
          dataField: 'userNm',
          width: '33%',
          style: 'left-align',
        },
      ];
      this.gridTestItemLeftOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000327'),
          color: 'blue',
          btnClicked: 'getUserList',
        },
      ];
      // 선택된 유저 목록 그리드 헤더 설정 오른쪽
      this.gridTestItemRightOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001415'),
          dataField: 'plantNm',
          width: '33%',
          style: 'left-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001287'),
          dataField: 'deptNm',
          width: '33%',
          style: 'left-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001482'),
          dataField: 'userNm',
          width: '33%',
          style: 'left-align',
        },
        // {
        //   text: 'L0000001415',
        //   name: 'plantNm',
        //   width: '80px',
        //   align: 'left',
        // } /* 사업장 */,
        // {
        //   text: 'L0000001287',
        //   name: 'deptNm',
        //   width: '80px',
        //   align: 'left',
        // } /* 부서 */,
        // {
        //   text: 'L0000001482',
        //   name: 'userNm',
        //   width: '80px',
        //   align: 'left',
        //   filter: 'true',
        // } /* 사원명 */,
      ];

      this.gridTestItemRightOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001926'),
          color: 'blue',
          btnClicked: 'btnExcelTemplateDownClicked',
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000936'),
          color: 'blue',
          btnClicked: 'btnExcelUploadClicked',
        },
      ];
      this.editable = this.$route.meta.editable;
    },
    /**
     * 버튼 에러 처리용 공통함수
     */
    btnClickedErrorCallback(_result) {
      window.getApp.emit('APP_REQUEST_ERROR', _result);
    },
    // 검색
    btnSearchClickedCallback(_result) {
      this.gridTestItemLeftOptions.data = this.$_.clone(_result.data);
      // this.YAuiGrid.setGridData(this.$_.clone(_result.data))
    },

    btnSearchEduGroupClickedCallback() {
      if (
        this.eduMaster.eduGrpNo === undefined ||
        this.eduMaster.eduGrpNo === null
      ) {
        this.gridTestItemRightOptions.data.splice(
          0,
          this.gridTestItemRightOptions.data.length
        );
        window.getApp.$emit('ALERT', {
          title: 'L0000003395' /* 안내 */,
          message: 'M0000000280' /* 교육그룹을 선택 하세요. */,
          type: 'warning', // success / info / warning / error
        });
        return;
      }

      this.$http.url = this.$format(
        selectConfig.saf.education.eduMaster.getGroupUser.url,
        this.eduMaster.eduGrpNo
      );
      this.$http.type = 'GET';
      this.$http.param = [];
      this.$http.request(
        (_result) => {
          this.$_.forEach(_result.data, (row) => {
            if (
              this.$_.findIndex(this.AuiGrid.getGridData(), {
                userId: row.userId,
              }) === -1
            ) {
              this.AuiGrid.addRow(row, 'last');
              // this.gridTestItemRightOptions.data.push(row);
            }
          });

          this.setUserList();
        },
        (_error) => {
          window.getApp.$emit(
            'APP_REQUEST_ERROR',
            'M0000000016'
            /* 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요. */
          );
        }
      );
    },
    btnSearchElectTitlNoClickedCallback() {
      this.$http.url = selectConfig.saf.electHis.list.url;
      this.$http.type = 'GET';
      this.$http.param = {
        plantCd: this.eduMaster.plantCd,
        safElectTitlNo: this.safElectTitlNo,
      };
      this.$http.request(
        (_result) => {
          this.$_.forEach(_result.data, (row) => {
            if (
              this.$_.findIndex(this.AuiGrid.getGridData(), {
                userId: row.userId,
              }) === -1
            ) {
              this.AuiGrid.addRow(row, 'last');
              // this.gridTestItemRightOptions.data.push(row);
            }
          });

          this.setUserList();
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    getEduGroupList() {
      this.$http.url = this.$format(
        selectConfig.saf.education.combo.eduGrplist.url,
        this.eduMaster.plantCd
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.eduGroupCds = this.$_.clone(_result.data);
          this.eduGroupCds.splice(0, 0, {
            eduGrpNo: null,
            grpNm:
              this.$comm.getLangSpecInfoLabel('L0000003394') /* 선택하세요 */,
          });
        },
        (_error) => {
          window.getApp.$emit(
            'APP_REQUEST_ERROR',
            'M0000000016'
            /* 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요. */
          );
        }
      );
    },
    // 법규 콤보박스 목록 조회
    getRefLawCdList() {
      this.$http.url = this.$format(
        selectConfig.codeMaster.getSelect.url,
        'MGT_LAW_CLASS'
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.refLawCdItems = this.$_.clone(_result.data);
          this.refLawCdItems.splice(0, 0, {
            code: null,
            codeNm:
              this.$comm.getLangSpecInfoLabel('L0000003394') /* 선택하세요 */,
          });

          this.getElectTitleComboItems();
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    // 선해임자 목록 조회
    getElectTitleComboItems() {
      this.$http.url = selectConfig.saf.electTitle.list.url;
      this.$http.type = 'GET';
      this.$http.param = {
        electAttCd: null,
        refLawCd: this.refLawCd,
        useYn: 'Y',
      };
      this.$http.request(
        (_result) => {
          this.electTitleItems = this.$_.clone(_result.data);
          this.electTitleItems.splice(0, 0, {
            code: null,
            codeNm:
              this.$comm.getLangSpecInfoLabel('L0000003394') /* 선택하세요 */,
          });
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },

    // 사용자 전체 검색
    getUserList() {
      // sk e&s 연간교육계획 - 대상부서 사용자 검색
      let param = {};

      if (!this.isManager) {
        param = {
          deptCd: this.eduMaster.targetDeptCd,
          userNm: this.searchUserParam.userNm,
          plantCd: this.eduMaster.plantCd,
        };
      }

      this.$http.url = this.searchUserUrl;
      this.$http.param = param;
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.gridTestItemLeftOptions.data = this.$_.clone(_result.data);
          this.YAuiGrid.setGridData(this.$_.clone(_result.data));
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    // 교육번호에 따른 교육 이수자 검색
    getDetailUser() {
      this.$http.url = this.$format(
        selectConfig.saf.education.eduMaster.getUser.url,
        this.eduMaster.safEduMstNo
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          // this.gridTestItemRightOptions.data = this.$_.clone(_result.data);
          this.AuiGrid.setGridData(this.$_.clone(_result.data));
          this.setUserList();
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    getEduCoursePsn() {
      this.$http.url = selectConfig.saf.education.eduMaster.getEduCoursePsn.url;
      this.$http.type = 'GET';
      this.$http.param = {
        safEduCourseNo: this.eduMaster.safEduCourseNo,
        plantCd: this.eduMaster.plantCd,
      };
      this.$http.request((_result) => {
        // this.gridTestItemRightOptions.data = this.$_.clone(_result.data);
        this.AuiGrid.setGridData(this.$_.clone(_result.data));
        this.setUserList();
      });
    },
    // 최종 데이터 master에 전달
    setUserList() {
      var userIdList = [];
      var deptCdList = [];
      let gridData = this.AuiGrid.getGridData();
      this.gridTestItemRightOptions.data.forEach((element) => {
        if (
          this.$_.findIndex(gridData, {
            userId: element.userId,
          }) === -1
        ) {
          gridData.push(element);
          userIdList.push(element.userId);
          deptCdList.push(element.deptCd);
        }
      });
      this.AuiGrid.getGridData().forEach((element) => {
        userIdList.push(element.userId);
        deptCdList.push(element.deptCd);
      });
      this.gridTestItemRightOptions.data = [];
      this.AuiGrid.setGridData(gridData);
      this.eduMaster.eduUserId = userIdList;
      this.eduMaster.eduDeptCd = deptCdList;
    },
    /**
     * 유저 목록에 선택된 정보를 선택된 유저 목록으로 이동
     */
    btnMoveClicked() {
      let checkingData = this.YAuiGrid.getCheckedRowItems();
      checkingData.forEach((item) => {
        this.testItemLeftValue.push(item.item);
      });
      // 1. 추가된 아이템 중 기존 항목이 있는지 체크
      var filteredDuplicatedArray = this.$comm.removeDuplicatedArrayObject(
        // this.gridTestItemRightOptions.data,
        this.AuiGrid.getGridData(),
        this.testItemLeftValue,
        'userId'
      );
      // 2. 선택된 항목중에서 기존에 선택된 항목을 제외한 항목을 가져와서 기존 항목과 합침
      if (filteredDuplicatedArray.length > 0) {
        this.gridTestItemRightOptions.data = this.$_.concat(
          this.AuiGrid.getGridData(),
          filteredDuplicatedArray
        );
        this.AuiGrid.setGridData(this.gridTestItemRightOptions.data);
        this.setUserList();
      }
    },
    /**
     * 선택된 유저 목록에 선택된 정보를 삭제(화면상으로)
     */
    btnDeleteTestItemClicked(_result) {
      let checkingData = this.AuiGrid.getCheckedRowItemsAll();

      let gridData = this.AuiGrid.getGridData();
      this.$_.forEach(checkingData, (item) => {
        gridData = this.$_.reject(gridData, item);
      });

      this.AuiGrid.setGridData(gridData);
      this.setUserList();
    },
    btnExcelTemplateDownClicked() {
      let thisVue = this;
      let accept = this.$comm.getAccept('xlsx');
      let _comm = this.$comm;
      this.$http.url = selectConfig.saf.education.eduMaster.excelSample.url;
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          var url = window.URL || window.webkitURL;
          let link = document.createElement('a');
          var blob = thisVue.$comm.base64ToBlob(_result.data, accept);
          if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(
              blob,
              '교육대상자_업로드_양식.xlsx'
            );
          } else {
            let link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = '교육대상자_업로드_양식.xlsx';
            link.click();
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    btnExcelUploadClicked() {
      this.popupOptions.target = () => import(`${'./eduPlanPersonUpload.vue'}`);
      this.popupOptions.title = 'L0000000649'; /* 교육대상자 엑셀 업로드 */
      this.popupOptions.visible = true;
      this.popupOptions.width = '60%';
      this.popupOptions.top = '100px';
      this.popupOptions.closeCallback = this.closePopupExcelUpload;
    },
    closePopupExcelUpload(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      if (!data.isTrusted) {
        this.$_.forEach(data, (item) => {
          if (
            this.$_.findIndex(this.gridTestItemRightOptions.data, {
              userId: item.userId,
            }) === -1
          ) {
            this.gridTestItemRightOptions.data.push(item);
          }
        });
      }
      this.setUserList();
    },
    /** end button 관련 이벤트 **/
  },
};
</script>
