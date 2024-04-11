<!--
  목적 : 대상자 선정 현황
  Detail :
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <b-col sm="12"></b-col>
    <!-- <y-label label="대상자 지정 상세 " icon="user-edit" color-class="cutstom-title-color" /> -->
    <b-row>
      <b-col sm="12">
        <b-card no-body class="px-3 py-2">
          <b-row>
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

    <y-search-box @enter="btnSearchClickedCallback">
      <b-row slot="search">
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
        <b-col
          v-if="checkupOrgDept"
          sm="6"
          md="6"
          lg="6"
          xl="6"
          class="col-xxl-3"
        >
          <y-tree-dept
            :width="8"
            :plantCd="popupParam.plantCd"
            type="search"
            v-model="searchParam.deptCd"
          />
        </b-col>
        <b-col
          v-else-if="checkupOrgDept === true"
          sm="6"
          md="6"
          lg="6"
          xl="6"
          class="col-xxl-3"
        >
          <!-- 부서 -->
          <y-text
            :width="8"
            :disabled="true"
            ui="bootstrap"
            label="L0000001287"
            name="deptCd"
            v-model="searchParam.deptNm"
          />
        </b-col>
        <!-- 수정 전 코드 <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <y-tree-dept
            :width="8"
            :plantCd="popupParam.plantCd"
            type="search"
            v-model="searchParam.deptCd"
          />
        </b-col> -->
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
          <!-- 성명 -->
          <y-text
            :width="8"
            :disabled="true"
            :editable="nameFlag"
            ui="bootstrap"
            label="L0000001630"
            name="userNm"
            v-model="searchParam.userNm"
            :appendIcon="[
              { icon: 'times', callbackName: 'clear' },
              { icon: 'search', callbackName: 'searchUser' },
            ]"
            @searchUser="btnSearchLeaderUserClicked"
            @clear="clear"
          />
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 검진결과 -->
          <y-select
            :width="8"
            :comboItems="checkUpResultItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            type="search"
            label="검진결과"
            name="checkUpResult"
            v-model="searchParam.checkUpResult"
          />
        </b-col>
      </b-row>
    </y-search-box>

    <!-- 검진 계획별 대상자 현황 grid-->
    <!-- <b-row class="mt-3">
      <b-col sm="12">
        <b-col sm="12" class="px-0">
          <div slot="buttonGroup" class="float-right mb-1">
            <el-tag size="medium" type="info"></el-tag>
              <i class="el-icon-info"></i> 목록을 불러오는 데 시간이 소요됩니다.
            </el-tag> 
             대상자 통보 버튼 사용할 경우, v-if 에서 false 조건 제거 
            대상자 통보 
            <y-btn
              v-if="false && editable && checkupPlan.heaCheckupPlanNo > 0"
              title="L0000003425"
              color="blue"
              @btnClicked="btnSendClickedCallback"
              @btnClickedErrorCallback="btnClickedErrorCallback"
            />
             검진대상자 추가 
            <y-btn
              v-if="editable && checkupPlan.heaCheckupPlanNo > 0"
              title="L0000000367"
              color="blue"
              @btnClicked="btnAddClicked"
              @btnClickedErrorCallback="btnClickedErrorCallback"
            />
             전체 검진대상자 제외 
            <y-btn
              v-if="editable && checkupPlan.heaCheckupPlanNo > 0"
              :action-url="deleteUrl"
              :param="deleteRows"
              :is-submit="isAllDeleteSubmit"
              title="L0000002521"
              color="red"
              action-type="delete"
              beforeSubmit="beforeAllDeleteSubmit"
              @beforeAllDeleteSubmit="beforeAllDeleteSubmit"
              @btnClicked="btnAllDeleteClickedCallback"
              @btnClickedErrorCallback="btnClickedErrorCallback"
            />
             검진대상자 제외 
            <y-btn
              v-if="editable && checkupPlan.heaCheckupPlanNo > 0"
              :action-url="deleteUrl"
              :param="deleteRows"
              :is-submit="isDeleteSubmit"
              title="L0000000366"
              color="red"
              action-type="delete"
              beforeSubmit="beforeDeleteSubmit"
              @beforeDeleteSubmit="beforeDeleteSubmit"
              @btnClicked="btnDeleteClickedCallback"
              @btnClickedErrorCallback="btnClickedErrorCallback"
            />
             검색 
            <y-btn
              v-if="editable && checkupPlan.heaCheckupPlanNo > 0"
              title="L0000000327"
              color="green"
              @btnClicked="btnSearchClickedCallback"
              @btnClickedErrorCallback="btnClickedErrorCallback"
            />
             닫기 
            <y-btn title="L0000000881" @btnClicked="btnClosePopup" />
          </div>
          - 검진 대상자 목록 
          <y-data-table
            label="L0000000344"
            ref="dataTable"
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
            @tableLinkClicked="tableLinkClicked"
          >
            <el-table-column
              label="checkbox"
              type="selection"
              slot="selection"
              width="55"
            ></el-table-column>
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
          :label="this.$comm.getLangSpecInfoLabel('L0000000344')"
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
          @cellClick="cellCLickHandler"
          @btnAddClicked="btnAddClicked"
          @btnDelRowAll="btnDelRowAll"
          @btnDelRowChek="btnDelRowChek"
          @btnSearchClickedCallback="btnSearchClickedCallback"
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
  name: 'checkup-org-calendar-detail2',
  props: {
    popupParam: {
      type: Object,
      default: {
        heaCheckupPlanNo: 0,
        plantCd: '',
        pageNm: '',
        noAccUseYn: false,
      },
    },
    selectedTabIndex: 0,
  },
  data() {
    return {
      // plantCd: '',
      checkupPlan: {
        heaCheckupPlanNo: 0,
        heaCheckupPlanNm: '',
        heaCheckupClassNm: '',
        heaCheckupPlanPeriod: '',
      },
      searchParam: {
        heaCheckupPlanNo: 0,
        processNo: 0,
        deptCd: '',
        deptNm: '',
        userId: '',
        userNm: '',
        age: 0,
        gender: '',
        pageNumber: 1,
        pageSize: 20,
        pageTotal: 0,
        pageSizes: [10, 20],
        orderByExpression: '',
        checkUpResult: '',
      },
      editable: false,
      detailUrl: '',
      deleteUrl: '',
      searchUrl: '',

      deleteRows: [],
      isDeleteSubmit: false,
      isAllDeleteSubmit: false,
      checkupOrgDept: false,
      processNoItems: [],
      deptCdItems: [],
      ageItems: [],
      genderItems: [],
      checkUpResultItems: [],
      gridHeaderOptions: [],
      gridData: [],
      gridHeight: 300,
      gridSelectedRows: [],
      gridOptions: {
        name: 'ceheckupOrgCalendarDetail2',
        btns: [],
        header: [],
        data: [],
        height: 'auto',
      },
      YAuiGrid: null,
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
      nameFlag: false,
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
    'searchParam.deptCd'(val) {
      this.getProcessNoItems(val);
    },
  },
  /** Vue lifecycle: created, mounted, destroyed, etc **/
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    window.getApp.$on('closePopupToDetail', this.getList);
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

      this.searchParam.deptNm = this.$store.getters.deptNm;

      this.checkupOrgDept = true;
      if (
        !this.$store.getters.deptAuthGrp ||
        (this.$store.getters.deptAuthGrp &&
          this.$store.getters.deptAuthGrp.deptAccessYn === 'N')
      ) {
        this.searchParam.deptCd = this.$store.getters.deptCd;
        this.searchParam.userNm = this.$store.getters.name;
        this.searchParam.userId = this.$store.getters.token;
      } else {
        this.searchParam.deptNm = this.$store.getters.deptNm;
        this.searchParam.deptCd = '';
        this.nameFlag = true;
      }

      // if (!this.checkupOrgDept) {
      //   this.searchParam.deptNm = this.$store.getters.deptNm;
      //   this.searchParam.deptCd = '';
      // }
      this.checkUpResultItems = [
        { code: '', codeNm: this.$comm.getLangSpecInfoLabel('L0000002519') }, // '전체'
        { code: '1', codeNm: this.$comm.getLangSpecInfoLabel('L0000003758') }, // '등록'
        { code: '2', codeNm: this.$comm.getLangSpecInfoLabel('L0000005742') }, // '미동록'
      ];
      this.getAgeItems();
      this.getComboItems('COM_SEX_TYPE'); // 성별

      // 검진 대상자 현황 그리드 헤더 설정
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001287'), 
          dataField: 'deptNm', 
          width: '10%', 
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
          width: '10%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000577'), 
          dataField: 'chemNmKrs', 
          width: '10%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004319'), 
          dataField: 'checkUpResult', 
          width: '15%', 
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {              
            },
          },
        },
      ];
      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000367'),
          color: 'blue',
          btnClicked: 'btnAddClicked',
          visible: true,
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000002521'),
          color: 'red',
          btnClicked: 'btnDelRowAll',
          visible: true,
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000366'),
          color: 'red',
          btnClicked: 'btnDelRowChek',
          visible: true,
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000327'),
          color: 'green',
          btnClicked: 'btnSearchClickedCallback',
          visible: true,
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000881'),
          btnClicked: 'btnClosePopup',
          visible: true,
        },
      ]
      this.detailUrl = selectConfig.hea.checkupPlan.get.url;
      this.searchUrl = selectConfig.hea.checkupUser.list.url;
      this.deleteUrl = transactionConfig.hea.checkupUser.delete.url;
      this.checkupPlan.heaCheckupPlanNo = this.popupParam.heaCheckupPlanNo;
      this.searchParam.heaCheckupPlanNo = this.popupParam.heaCheckupPlanNo;
      // this.plantCd = this.popupParam.plantCd;

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
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = this.searchParam;
      this.$http.request(
        (_result) => {
          if (this.checkupPlan.heaCheckupPlanNo > 0) {
            this.gridOptions.btns[0].visible = true;
            this.gridOptions.btns[1].visible = true;
            this.gridOptions.btns[2].visible = true;
            this.gridOptions.btns[3].visible = true;
          } else {
            this.gridOptions.btns[0].visible = false;
            this.gridOptions.btns[1].visible = false;
            this.gridOptions.btns[2].visible = false;
            this.gridOptions.btns[3].visible = false;
          }
          this.searchParam.pageTotal = _result.data.count;
          this.gridData = this.$_.clone(_result.data.items);
          this.YAuiGrid.setGridData(this.$_.clone(_result.data.items))
          this.totListData = this.$_.clone(_result.data.totItems);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },

    getProcessNoItems(deptCd) {
      this.$http.url = selectConfig.manage.process.list.url;
      this.$http.type = 'GET';
      this.$http.param = {
        deptCd: deptCd,
        useYn: 'Y',
      };
      this.$http.request(
        (_result) => {
          _result.data.splice(0, 0, {
            processNo: 0,
            processNm: this.$comm.getLangSpecInfoLabel('L0000002519'),
          }); // 전체
          this.processNoItems = _result.data;
          if (
            this.searchParam.processNo > 0 &&
            this.$_.indexOf(
              this.$_.map(this.processNoItems, 'processNo'),
              this.searchParam.processNo
            ) === -1
          ) {
            this.searchParam.processNo = 0;
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    getDeptCdItems() {
      this.$http.url = selectConfig.manage.dept.list.url;
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          _result.data.splice(0, 0, {
            deptCd: '',
            deptNm: this.$comm.getLangSpecInfoLabel('L0000002519'),
          }); // 전체
          this.deptCdItems = _result.data;
          this.searchParam.deptCd = '';
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
    btnDelRowChek() {
      let checkingData = this.YAuiGrid.getCheckedRowItemsAll();
      if (checkingData.length > 0) {
        this.deleteRows = [];
        window.getApp.$emit('CONFIRM', {
          title: 'L0000003321', // '확인',
          message: 'M0000000434', // 검진 대상자에서 제외 하시겠습니까?
          type: 'info',
          // 확인 callback 함수
          confirmCallback: () => {
            checkingData.forEach((item) => {
              this.deleteRows.push(item); 
            })
            this.$http.url = this.deleteUrl;
            this.$http.type = 'DELETE';
            this.$http.param = {
              data: Object.values(this.$_.clone(this.deleteRows)),
            };
            this.$http.request(
              (_result) => {
                this.getList();
                this.$emit('changeCheckupUsers');
                window.getApp.$emit('ALERT', {
                  title: 'L0000003395', // '안내',
                  message: 'M0000000420', // 선택된 사용자를 대상자에서 제외하였습니다.
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
    beforeDeleteSubmit() {
      if (this.gridSelectedRows.length > 0) {
        this.deleteRows = {
          data: Object.values(this.$_.clone(this.gridSelectedRows)),
        };
        window.getApp.$emit('CONFIRM', {
          title: 'L0000003321', // '확인',
          message: 'M0000000434', // 검진 대상자에서 제외 하시겠습니까?
          type: 'info',
          // 확인 callback 함수
          confirmCallback: () => {
            this.isDeleteSubmit = true;
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

    btnDelRowAll() {
      this.deleteRows = [];
      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321', // '확인',
        message: 'M0000000434', // 검진 대상자에서 제외 하시겠습니까?
        type: 'info',
        // 확인 callback 함수
        confirmCallback: () => {
          this.$http.url = this.deleteUrl;
          this.$http.type = 'DELETE';
          this.$http.param = {
            data: Object.values(this.$_.clone(this.totListData)),
          };
          this.$http.request(
            (_result) => {
              this.getList();
              this.$emit('changeCheckupUsers');
              window.getApp.$emit('ALERT', {
                title: 'L0000003395', // '안내',
                message: 'M0000000421', // 전체 사용자를 대상자에서 제외하였습니다.
                type: 'success',
              });
            },
            (_error) => {
              window.getApp.$emit('APP_REQUEST_ERROR', _error);
            }
          );
        },
      });
    },
    beforeAllDeleteSubmit() {
      this.deleteRows = {
        data: Object.values(this.$_.clone(this.totListData)),
      };
      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321', // '확인',
        message: 'M0000000418', // 전체 사용자를 검진 대상자에서 제외 하시겠습니까?
        type: 'info',
        // 확인 callback 함수
        confirmCallback: () => {
          this.isAllDeleteSubmit = true;
        },
      });
    },
    /** /validation checking **/

    /** /Component, Callbacks (버튼 제외) **/
    /** Button Event **/
    /**
     * 조회 버튼 처리용 샘플함수
     */
    btnAddClicked() {
      this.popupOptions.top = '10px';
      this.popupOptions.width = '70%';
      this.popupOptions.target = () =>
        import(`${'./checkupOrgCalendarUserChice.vue'}`);
      this.popupOptions.title = 'L0000000935'; // 대상자 선정
      this.popupOptions.visible = true;

      this.popupOptions.param = {
        heaCheckupPlanNo: this.checkupPlan.heaCheckupPlanNo,
        plantCd: this.popupParam.plantCd,
      };

      this.popupOptions.closeCallback = this.closePopupChice;
    },

    btnSearchClickedCallback() {
      // if (!this.searchParam.deptCd) {
      //   window.getApp.$emit('CONFIRM', {
      //     title: '확인',
      //     message: '목록을 불러오는 데 시간이 소요됩니다. 진행하시겠습니까?',
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
    paginateClickHandler(pageNum) {
      this.searchParam.pageNumber = pageNum;
      this.getList();
    },
    btnDeleteClickedCallback(_result) {
      this.isDeleteSubmit = false;
      this.getList();
      this.$emit('changeCheckupUsers');
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // '안내',
        message: 'M0000000420', // 선택된 사용자를 대상자에서 제외하였습니다.
        type: 'success',
      });
    },

    btnAllDeleteClickedCallback(_result) {
      this.isAllDeleteSubmit = false;
      this.getList();
      this.$emit('changeCheckupUsers');
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // '안내',
        message: 'M0000000421', // 전체 사용자를 대상자에서 제외하였습니다.
        type: 'success',
      });
    },

    btnSendClickedCallback(_result) {
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // '안내',
        message: 'M0000000436', // 아직 지원하지 않는 기능입니다.
        type: 'success',
      });
    },
    btnClickedErrorCallback(_result) {
      this.isDeleteSubmit = false;
      this.isAllDeleteSubmit = false;
      window.getApp.$emit(
        'APP_REQUEST_ERROR',
        'M0000000016' // 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.
      );
    },
    btnSearchLeaderUserClicked() {
      this.popupOptions.target = () =>
        import(`${'../../manage/user/userSearch.vue'}`);
      this.popupOptions.param = {
        plantCd: this.popupParam.plantCd,
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
        this.searchParam.userId = data.user.userId;
      }
    },
    cellCLickHandler(event) {
      if (event.dataField !== 'checkUpResult') return;
      let periodArr = this.checkupPlan.heaCheckupPlanPeriod.split('~');
      if (event.item.checkUpResult === '등록') {
        this.popupOptions.param = {
          heaCheckupPlanNo: event.item ? event.item.heaCheckupPlanNo : 0,
          userId: event.item ? event.item.userId : null,
        };
      } else {
        this.popupOptions.param = {
          heaCheckupPlanNo: 0,
          userId: event.item.userId,
          userNm: event.item.userNm,
          deptNm: event.item.deptNm,
          deptCd: event.item.deptCd,
          plantNm: event.item.plantNm,
          plantCd: event.item.plantCd,
          start: periodArr[0],
          end: periodArr[1],
          heaCheckupPlanNoForNewResult: this.checkupPlan.heaCheckupPlanNo,
        };
      }
      this.popupOptions.target = () => import(`${'./checkupResultDetail.vue'}`);
      this.popupOptions.title = event.item ? 'L0000000351' : 'L0000004329'; // 검진결과 상세 : 검진결과 등록
      this.popupOptions.visible = true;
      this.popupOptions.width = '80%';
      this.popupOptions.top = '40px';
      this.popupOptions.closeCallback = this.closePopup;
    },
    tableLinkClicked(header, row) {
      let periodArr = this.checkupPlan.heaCheckupPlanPeriod.split('~');
      if (row.checkUpResult === '등록') {
        this.popupOptions.param = {
          heaCheckupPlanNo: row ? row.heaCheckupPlanNo : 0,
          userId: row ? row.userId : null,
        };
      } else {
        this.popupOptions.param = {
          heaCheckupPlanNo: 0,
          userId: row.userId,
          userNm: row.userNm,
          deptNm: row.deptNm,
          deptCd: row.deptCd,
          plantNm: row.plantNm,
          plantCd: row.plantCd,
          start: periodArr[0],
          end: periodArr[1],
          heaCheckupPlanNoForNewResult: this.checkupPlan.heaCheckupPlanNo,
        };
      }
      this.popupOptions.target = () => import(`${'./checkupResultDetail.vue'}`);
      this.popupOptions.title = row ? 'L0000000351' : 'L0000004329'; // 검진결과 상세 : 검진결과 등록
      this.popupOptions.visible = true;
      this.popupOptions.width = '80%';
      this.popupOptions.top = '40px';
      this.popupOptions.closeCallback = this.closePopup;
    },
    closePopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
    },
    clear() {
      this.searchParam.userId = null;
      this.searchParam.userNm = null;
    },
    closePopupChice() {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.getList();
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
    /** /Button Event **/
    btnClosePopup() {
      // 부모창에 값 전달
      this.$emit('closePopup', { success: true });
    },
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
