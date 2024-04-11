<!--
  목적 : 대상자 선정 탭
  Detail : 
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <b-col sm="12"></b-col>
    <b-row>
      <b-col sm="12">
        <b-card no-body class="px-3 py-2">
          <b-row class="mt-2">
            <b-col sm="4">
              <!-- 검진종류:  -->
              <y-label label="L0000004320" />
              <y-label
                :label="checkupPlan.heaCheckupClassNm"
                :fieldable="true"
              />
            </b-col>
            <b-col sm="4">
              <!-- 검진계획:  -->
              <y-label label="L0000004321" />
              <y-label
                :label="checkupPlan.heaCheckupPlanNm"
                :fieldable="true"
              />
            </b-col>
            <b-col sm="4">
              <!-- 검진일자:  -->
              <y-label label="L0000004322" />
              <y-label
                :label="checkupPlan.heaCheckupPlanPeriod"
                :fieldable="true"
              />
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>
    <b-row class="mt-3">
      <b-col sm="12">
        <b-card
          header-class="default-card"
          body-class="default-body-card"
          class="py-0"
        >
          <b-row ref="searchBox">
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-tree-dept
                :width="8"
                type="search"
                :plantCd="searchParam.plantCd"
                v-model="searchParam.deptCd"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-tree-process
                :plantCd="searchParam.plantCd"
                :deptCd="searchParam.deptCd"
                :width="8"
                name="processCd"
                v-model="searchParam.processCd"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 성명 -->
              <y-text
                :width="8"
                :readonly="true"
                ui="bootstrap"
                label="L0000001630"
                name="userNm"
                v-model="searchParam.userNm"
                :appendIcon="[{ icon: 'search', callbackName: 'searchUser' }]"
                @searchUser="btnSearchLeaderUserClicked"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 나이 -->
              <y-select
                :width="8"
                :comboItems="ageItems"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                type="search"
                label="L0000000802"
                name="age"
                v-model="searchParam.age"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 성별 -->
              <y-select
                :width="8"
                :comboItems="genderItems"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                type="search"
                label="L0000001632"
                name="gender"
                v-model="searchParam.gender"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 작년 수검자 제외, 제외/미제외 -->
              <y-switch
                :width="8"
                true-value="Y"
                false-value="N"
                ui="bootstrap"
                label="L0000002343"
                name="prevYearCheckupUserYn"
                selectText="L0000002620"
                unselectText="L0000003426"
                v-model="searchParam.prevYearCheckupUserYn"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 특검대상(자재취급), 대상/전체 -->
              <y-switch
                :width="8"
                true-value="Y"
                false-value="N"
                ui="bootstrap"
                label="L0000003011"
                name="specialTargetChemYn"
                selectText="L0000003427"
                unselectText="L0000002519"
                v-model="searchParam.specialTargetChemYn"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 특검대상(물리적인자), 대상/전체 -->
              <y-switch
                :width="8"
                true-value="Y"
                false-value="N"
                ui="bootstrap"
                label="L0000003010"
                name="specialTargetPhyYn"
                selectText="L0000003427"
                unselectText="L0000002519"
                v-model="searchParam.specialTargetPhyYn"
              />
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>
    <!-- 검색조건 대상자 grid-->
    <!-- <b-row class="mt-3">
      <b-col sm="12">
        <b-col sm="12" class="px-0">
          <div slot="buttonGroup" class="float-right mb-1">
            <el-tag size="medium" type="info">
              <i class="el-icon-info"></i> 목록을 불러오는 데 시간이 소요됩니다.
            </el-tag> 
             전체 검진대상자 추가 
            <y-btn
              v-if="editable && checkupPlan.heaCheckupPlanNo > 0"
              title="L0000002522"
              color="blue"
              @btnClicked="addCheckupAllUser"
            />
             검진대상자로 추가 
            <y-btn
              v-if="editable && checkupPlan.heaCheckupPlanNo > 0"
              :action-url="insertUrl"
              :param="gridSelectedRows"
              :is-submit="isInsertSubmit"
              title="L0000000368"
              color="blue"
              action-type="post"
              beforeSubmit="beforeInsertSubmit"
              @beforeInsertSubmit="beforeInsertSubmit"
              @btnClicked="btnInsertClickedCallback"
              @btnClickedErrorCallback="btnClickedErrorCallback"
            />
             검색 
            <y-btn
              v-if="checkupPlan.heaCheckupPlanNo > 0"
              title="L0000000327"
              color="green"
              @btnClicked="searchBtnClicked"
            />
             닫기 
            <y-btn title="L0000000881" @btnClicked="btnClosePopup" />
          </div>
          검색조건 대상자 목록
          <y-data-table
            label="L0000000332"
            v-model="gridSelectedRows"
            :headers="gridHeaderOptions"
            :items="gridData"
            :editable="editable"
            :height="gridHeight"
            :use-paging="false"
            :use-server-paging="true"
            :useRownum="false"
            :pageTotal="searchParam.pageTotal"
            :searchExcelTotalUrl="searchUrl"
            :searchExcelTotalParam="searchParam"            
            @onSortChange="tableSortChange"
          >
            <el-table-column type="selection" slot="selection" width="55"></el-table-column>
          </y-data-table>
          <div class="pagination-container">
            <el-pagination
              ref="pagination"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page.sync="searchParam.pageNumber"
              :page-size="searchParam.pageSize"
              :page-sizes="searchParam.pageSizes"
              layout="total, sizes, prev, pager, next, jumper, ->, slot"
              :total="searchParam.pageTotal"
            ></el-pagination>
          </div>
        </b-col>
      </b-col>
    </b-row> -->
    <b-row class="grid-height grid-box">
      <b-col sm="12" class="h100p">
        <y-auigrid
          ref="yAuiGrid"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000000332')"
          :useExcelExport="false"
          :enableCellMerge="true"
          :enableSorting="true"
          :showGridSetSave="true"
          :useContextMenu="true"
          :enableRightDownFocus="true"
          :showGridCtrl="true"
          :showRowCheckColumn="true"
          :usePaginate="true"
          :paginateListCount="searchParam.pageSize"
          :paginateTotalCount="searchParam.pageTotal"
          :paginateCurrentPage="searchParam.pageNumber"
          @paginateClick="paginateClickHandler"
          @addCheckupAllUser="addCheckupAllUser"
          @searchBtnClicked="searchBtnClicked"
          @btnAddRowCheck="btnAddRowCheck"
          @btnClosePopup="btnClosePopup"
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
  name: 'checkup-org-calendar-user-chice',
  props: {
    popupParam: {
      type: Object,
      default: {
        heaCheckupPlanNo: 0,
        plantCd: '',
      },
    },
    selectedHeaCheckupPlanNo: 0,
    selectedTabIndex: 0,
    // plantCd: '',
  },
  data() {
    return {
      checkupPlan: {
        heaCheckupPlanNo: 0,
        heaCheckupPlanNm: '',
        heaCheckupClassNm: '',
        heaCheckupPlanPeriod: '',
      },
      searchParam: {
        heaCheckupPlanNo: 0,
        processNo: 0,
        processCd: '',
        deptCd: '',
        userId: '',
        userNm: '',
        prevYearCheckupUserYn: 'N',
        age: 0,
        gender: '',
        specialTargetChemYn: 'N',
        specialTargetPhyYn: 'N',
        plantCd: '',
        pageNumber: 1,
        pageSize: 20,
        pageTotal: 0,
        pageSizes: [10, 20],
        orderByExpression: '',
      },
      beforeSearchParam: {}, // 검색조건 저장용(전체 대상자 지정시 필요)
      editable: false,
      detailUrl: '',
      insertUrl: '',
      searchUrl: '',
      addAllUrl: '',

      gridOptions: {
        name: 'ceheckupOrgCalendarUserChice',
        btns: [],
        header: [],
        data: [],
        height: 'auto',
      },
      YAuiGrid: null,
      isInsertSubmit: false,
      ageItems: [],
      genderItems: [],

      gridHeaderOptions: [],
      gridData: [],
      gridHeight: 300,
      gridSelectedRows: [],

      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '60%',
        top: '10px',
        param: {},
        closeCallback: null,
      },
      totListData: [],
    };
  },
  watch: {
    heaCheckupPlanNo: function (newValue, oldValue) {
      this.checkupPlan.heaCheckupPlanNo = this.popupParam.heaCheckupPlanNo;
      this.searchParam.heaCheckupPlanNo = this.popupParam.heaCheckupPlanNo;
      this.getDetail();
      this.getList();
    },
    selectedTabIndex: function (newValue, oldValue) {
      if (
        this.checkupPlan.heaCheckupPlanNo === this.popupParam.heaCheckupPlanNo
      ) {
        this.getList();
      }
    },
  },
  /** Vue lifecycle: created, mounted, destroyed, etc **/
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
  /** methods **/
  methods: {
    /** 초기화 관련 함수 **/
    init() {
      this.editable = this.$route.meta.editable;

      this.getAgeItems();
      this.getComboItems('COM_SEX_TYPE'); // 성별

      // 검진 전체 대상자 그리드 헤더 설정
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001287'),
          dataField: 'deptNm',
          width: '15%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000515'),
          dataField: 'processNms',
          width: '15%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001412'),
          dataField: 'userId',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001630'),
          dataField: 'userNm',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001632'),
          dataField: 'comSexTypeNm',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002293'),
          dataField: 'entryYmd',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000578'),
          dataField: 'chemProdNmKrs',
          width: '15%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000577'),
          dataField: 'chemNmKrs',
          width: '15%',
        },
      ];

      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000002522'),
          color: 'blue',
          btnClicked: 'addCheckupAllUser',
          visible: true,
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000368'),
          color: 'blue',
          btnClicked: 'btnAddRowCheck',
          visible: true,
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000327'),
          color: 'green',
          btnClicked: 'searchBtnClicked',
          visible: true,
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000881'),
          btnClicked: 'btnClosePopup',
          visible: true,
        },
      ];
      this.detailUrl = selectConfig.hea.checkupPlan.get.url;
      this.searchUrl = selectConfig.hea.checkupUserNoTarget.list.url;
      this.insertUrl = transactionConfig.hea.checkupUser.insert.url;
      this.addAllUrl = transactionConfig.hea.checkupUser.insertAll.url;
      this.searchParam.deptCd = '';
      // this.plantCd = this.popupParam.plantCd;
      // this.searchParam.plantCd = this.plantCd;
      this.searchParam.plantCd = this.popupParam.plantCd;

      this.checkupPlan.heaCheckupPlanNo = this.popupParam.heaCheckupPlanNo;
      this.searchParam.heaCheckupPlanNo = this.popupParam.heaCheckupPlanNo;
      if (this.checkupPlan.heaCheckupPlanNo > 0) {
        this.getDetail();
        this.getList();
      }
    },
    /** /초기화 관련 함수 **/

    /** Call API service **/
    getDetail() {
      this.$http.url = this.$format(
        this.detailUrl,
        this.checkupPlan.heaCheckupPlanNo
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.checkupPlan = _result.data;
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    getList() {
      // this.searchParam.plantCd = this.plantCd;
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = this.searchParam;
      this.beforeSearchParam = this.searchParam;
      this.$http.request(
        (_result) => {
          this.searchParam.pageTotal = _result.data.count;
          this.gridData = _result.data.items;
          this.YAuiGrid.setGridData(_result.data.items);
          this.totListData = this.$_.clone(_result.data.totItems);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    getAgeItems() {
      this.ageItems.push({
        code: 0,
        codeNm: this.$comm.getLangSpecInfoLabel('L0000002519'),
      }); // 전체
      this.ageItems.push({
        code: 2,
        codeNm: this.$comm.getLangSpecInfoLabel('L0000004323'),
      }); // 20대
      this.ageItems.push({
        code: 3,
        codeNm: this.$comm.getLangSpecInfoLabel('L0000004324'),
      }); // 30대
      this.ageItems.push({
        code: 4,
        codeNm: this.$comm.getLangSpecInfoLabel('L0000004325'),
      }); // 40대
      this.ageItems.push({
        code: 5,
        codeNm: this.$comm.getLangSpecInfoLabel('L0000004326'),
      }); // 50대이상
      this.searchParam.age = 0;
    },
    paginateClickHandler(pageNum) {
      this.searchParam.pageNumber = pageNum;
      this.getList();
    },
    // 공통 마스터 정보 조회
    getComboItems(codeGroupCd) {
      this.$http.url = this.$format(
        selectConfig.codeMaster.getSelect.url,
        codeGroupCd
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          if (codeGroupCd === 'COM_SEX_TYPE') {
            this.genderItems = this.$_.clone(_result.data);

            this.genderItems.splice(0, 0, {
              code: '',
              codeNm: this.$comm.getLangSpecInfoLabel('L0000002519'), // 전체
            });
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    /** /Call API service **/

    /** validation checking**/
    /**
     * 저장 하기전 UI단 유효성 검사
     **/
    btnAddRowCheck() {
      let checkingData = this.YAuiGrid.getCheckedRowItemsAll();
      if (checkingData.length > 0) {
        window.getApp.$emit('CONFIRM', {
          title: 'L0000003321', // '확인',
          message: 'M0000000430', // 검진 대상자를 추가 하시겠습니까?
          type: 'info',
          // 확인 callback 함수
          confirmCallback: () => {
            this.$http.url = this.insertUrl;
            this.$http.type = 'POST';
            this.$http.param = checkingData;
            this.$http.request(
              (_result) => {
                this.getList();
                this.$emit('changeCheckupUsers');
                window.getApp.$emit('ALERT', {
                  title: 'L0000003395', // '안내',
                  message: 'M0000000431', // 선택된 사용자를 대상자로 추가하였습니다.
                  type: 'success',
                });
              },
              (_error) => {
                window.getApp.$emit('APP_REQUEST_ERROR', _error);
              }
            );
          },
        });
      } else {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // '안내',
          message: 'M0000000435', // 선택된 검진 대상자가 없습니다. 목록 앞단에 선택박스를 확인하세요.
          type: 'warning',
        });
      }
    },
    beforeInsertSubmit() {
      if (this.gridSelectedRows.length > 0) {
        window.getApp.$emit('CONFIRM', {
          title: 'L0000003321', // '확인',
          message: 'M0000000430', // 검진 대상자를 추가 하시겠습니까?
          type: 'info',
          // 확인 callback 함수
          confirmCallback: () => {
            var rowVal = [];
            this.$_.forEach(this.gridSelectedRows, (row) => {
              row.createUserId = this.$store.getters.token;
              row.updateUserId = this.$store.getters.token;
              rowVal.push(row);
            });
            this.isInsertSubmit = true;
          },
        });
      } else {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // '안내',
          message: 'M0000000435', // 선택된 검진 대상자가 없습니다. 목록 앞단에 선택박스를 확인하세요.
          type: 'warning',
        });
      }
    },
    /** /validation checking **/

    /** Component Events, Callbacks (버튼 제외) **/

    /** /Component, Callbacks (버튼 제외) **/

    /** Button Event **/
    btnClosePopup() {
      // 부모창에 값 전달
      this.$emit('closePopup', { success: true });
    },
    searchBtnClicked() {
      // if (!this.searchParam.deptCd || !this.searchParam.processCd) {
      //   window.getApp.$emit('CONFIRM', {
      //     title: '확인',
      //     message: '검색조건 부서 또는 공정을 전체로 하면 검색속도가 느립니다. 진행하시겠습니까?',
      //     type: 'info',
      //     // 확인 callback 함수
      //     confirmCallback: () => {
      //       this.searchParam.pageNumber = 1;
      //       this.getList();
      //     },
      //     cancelCallback: () => {},
      //   });
      // } else {
      this.searchParam.pageNumber = 1;
      this.getList();
      // }
    },
    btnInsertClickedCallback(_result) {
      this.isInsertSubmit = false;
      this.getList();
      this.$emit('changeCheckupUsers');
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // '안내',
        message: 'M0000000431', // 선택된 사용자를 대상자로 추가하였습니다.
        type: 'success',
      });
    },
    btnClickedErrorCallback(_result) {
      this.isInsertSubmit = false;
      window.getApp.$emit(
        'APP_REQUEST_ERROR',
        'M0000000016' // 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.
      );
    },
    btnSearchLeaderUserClicked() {
      this.popupOptions.target = () =>
        import(`${'../../manage/user/userSearch.vue'}`);
      this.popupOptions.param = {
        plantCd: this.searchParam.plantCd,
        deptCd: this.searchParam.deptCd,
      };
      this.popupOptions.title = 'L0000001466'; // 사용자검색
      this.popupOptions.visible = true;
      this.popupOptions.width = '60%';
      this.popupOptions.top = '100px';
      this.popupOptions.closeCallback = this.closePopupSearchUser;
    },
    closePopupSearchUser(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      if (data.user) {
        this.searchParam.userNm = data.user.userNm;
      }
    },
    handleSizeChange(_newPageSize) {
      this.searchParam.pageSize = _newPageSize;
      this.getList();
    },
    handleCurrentChange(_newPage) {
      this.getList();
    },
    tableSortChange(_item) {
      this.searchParam.orderByExpression =
        this.$comm.toUndrFromCamelCase(_item.prop) +
        ' ' +
        (_item.order === 'descending' ? 'desc' : 'asc');
      this.getList();
    },
    addCheckupAllUser() {
      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321', // '확인',
        message: 'M0000000432', // 전체 사용자를 검진 대상자로 추가 하시겠습니까?
        type: 'info',
        // 확인 callback 함수
        confirmCallback: () => {
          this.$http.url = this.addAllUrl;
          this.$http.type = 'POST';
          this.$http.param = this.beforeSearchParam;
          this.$http.request(
            (_result) => {
              if (_result.data > 0) {
                this.getList();
                this.$emit('changeCheckupUsers');
                window.getApp.$emit('ALERT', {
                  title: 'L0000003395', // '안내',
                  message: 'M0000000433', // 전체 사용자를 대상자로 추가하였습니다.
                  type: 'success',
                });
              }
            },
            (_error) => {
              window.getApp.$emit('APP_REQUEST_ERROR', _error);
            }
          );
        },
      });
    },
    /** /Button Event **/

    /** 기타 function **/
    /** /기타 function **/
  },
};
</script>

<style scoped>
.pagination-container {
  background: #fff;
  padding: 0px 16px;
  text-align: center;
}
.pagination-container.hidden {
  display: none;
}
</style>
