<!--
  목적 : 위험성평가 > JSA > 이력 조회
  Detail : 
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <y-search-box :gridOptions="gridOptions" @enter="getList">
      <div slot="header">
        <y-label label="L0000000327" />
        <div class="float-right">
          <!-- 검색 -->
          <y-btn title="L0000000327" color="green" @btnClicked="getList" />
        </div>
      </div>
      <b-row slot="search">
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <y-plant
            type="search"
            :width="8"
            :editable="false"
            v-model="searchParam.plantCd"
          />
        </b-col>
        <!-- 평가팀 -->
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <b-row>
            <b-col sm="4" md="4" lg="4" xl="4">
              <y-label label="평가팀" />
            </b-col>
            <b-col sm="8" md="8" lg="8" xl="8">
              <y-tag-structure
                :width="12"
                :editable="false"
                itemText="deptNm"
                itemValue="deptCd"
                newLabelText="L0000005773"
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
            :editable="false"
            :width="8"
            :comboItems="classificationItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            label="분류"
            name="classificationCd"
            v-model="searchParam.classificationCd"
          ></y-select>
        </b-col>
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <!-- 평가년도 -->
          <y-datepicker
            :width="8"
            name="assessYear"
            label="평가년도"
            type="year"
            :default="searchParam.assessYear"
            v-model="searchParam.assessYear"
          />
        </b-col>
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <!-- 평가담당자 -->
          <y-text
            :width="8"
            :clearable="true"
            :disabled="true"
            ui="bootstrap"
            label="평가담당자"
            name="assessLeaderNm"
            v-model="searchParam.assessLeaderNm"
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
            label="평가구분"
            name="regRegdem"
            v-model="searchParam.regRegdem"
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
            :comboItems="processCdItems"
            itemText="processNm"
            itemValue="processCd"
            ui="bootstrap"
            label="공정"
            name="processCd"
            v-model="searchParam.processCd"
          ></y-select>
        </b-col>
        <!-- 작업명 -->
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <y-text
            :width="8"
            ui="bootstrap"
            label="작업명"
            name="jobNm"
            v-model="searchParam.jobNm"
          ></y-text>
        </b-col>
      </b-row>
    </y-search-box>
    <!-- 검색 결과 테이블 -->
    <b-row class="mt-1">
      <b-col sm="12">
        <b-col sm="12" class="px-0">
          <y-auigrid
            ref="yAuiGrid"
            :name="gridOptions.name"
            :headers="gridOptions.header"
            :btns="gridOptions.btns"
            :height="gridOptions.height"
            :label="this.$comm.getLangSpecInfoLabel('L0000003053')"
            :useExcelExport="false"
            :enableCellMerge="true"
            :enableSorting="true"
            :showGridSetSave="true"
            :useContextMenu="true"
            :enableRightDownFocus="true"
            :showGridCtrl="true"
            :showRowCheckColumn="true"
            @btnAdd="btnAdd"
            @closeRevPopup="closeRevPopup"
          />
          <!-- 평가결과 집계 목록 -->
          <!-- <y-data-table
            label="평가결과 집계 목록"
            ref="dataTable"
            :print="true"
            :use-paging="true"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            v-model="selectedValue"
          >
            <el-table-column
              v-if="popupParam.popupMode && popupParam.multiple && editable"
              type="selection"
              slot="selection"
              align="center"
              width="55"
            ></el-table-column>
          </y-data-table> -->
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
  name: 'assess-total-JSA-tab',
  props: {
    popupParam: {
      type: Object,
      default: function () {
        return {
          popupMode: false,
          multiple: false,
          plantCd: '',
          deptCd: '',
          classificationCd: '',
          jobNo: 0,
          assessYear: '',
        };
      },
    },
  },
  data() {
    return {
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '95%',
        top: '10px',
        param: {},
        closeCallback: null,
      },
      searchParam: {
        plantCd: '',
        assessYear: [],
        assessNm: '',
        totalDivision: 'PROCESS',
        flag: 'JSA',
        userId: '',
        assessLeaderNm: '',
        processCd: '',
        jobNm: '',
        deptCd: [],
      },
      gridOptions: {
        header: [],
        data: [],
        height: 'auto',
      },

      classificationItems: [],
      rsaRegRegdemItems: [],
      processCdItems: [],
      selectedValue: [],
      searchUrl: '',
      classificationUrl: '',
      editable: false,
      deptCdList: [],
      YAuiGrid: null,
    };
  },

  //* Vue lifecycle: created, mounted, destroyed, etc */
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
    this.editable = this.$route.meta.editable;
    window.addEventListener('resize', this.resizeGrid);
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;
    this.resizeGrid();
  },
  beforeDestroy() {},
  //* methods */
  methods: {
    init() {
      // Url Setting
      this.searchUrl = selectConfig.rsa.planmgmt2.getRevList.url;
      this.classificationUrl =
        selectConfig.rsa.planmgmt2.getClassificationListForDepts.url;

      this.$comm.getComboItems('RSA_REG_REGDEM', false).then((_result) => {
        this.rsaRegRegdemItems = _result || [];
        this.$_.forEach(this.rsaRegRegdemItems, (item) => {
          if (item.code === null) {
            item.codeNm = '전체';
          }
        });
      });
      this.$comm.getComboItems('RSA_ASSESS_CLASS', true).then((_result) => {
        this.classificationItems = _result;
      });
      /* 쿠키에 저장된 검색 조건이 있을 경우 최초 페이지 진입시 자동 설정 */
      var searchParamByCookie = this.$comm.setSearchParamByCookie();
      if (typeof searchParamByCookie !== 'undefined') {
        this.searchParam = searchParamByCookie;
      }
      if (this.popupParam.plantCd) {
        this.searchParam.plantCd = this.popupParam.plantCd;
      }
      if (this.popupParam.deptCd) {
        this.deptCdList.push({
          deptCd: this.popupParam.deptCd,
          deptNm: this.popupParam.deptNm,
        });
        // this.searchParam.deptCd = this.popupParam.deptCd
      }
      if (this.popupParam.classificationCd) {
        this.searchParam.classificationCd = this.popupParam.classificationCd;
      }
      if (this.popupParam.assessYear) {
        this.searchParam.assessYear = this.popupParam.assessYear;
      }

      this.getProcessList();
      this.getList();

      // 그리드 헤더 설정
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001415'),
          dataField: 'plantNm',
          width: 250,
        }, // 사업장
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003081'),
          dataField: 'assessNm',
          width: 250,
        }, // 평가명
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003059'),
          dataField: 'regRegdemNm',
          width: 250,
        }, // 평가구분
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004990'),
          dataField: 'deptNm',
          width: 250,
        }, // 평가팀
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001341'),
          dataField: 'classificationNm',
          width: 250,
        }, // 분류
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000590'),
          dataField: 'jobManageNo',
          width: 250,
        }, // 관리번호

        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000515'),
          dataField: 'processNm',
          width: 250,
        }, // 공정
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002389'),
          dataField: 'jobNm',
          width: 250,
        }, // 작업명
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003065'),
          dataField: 'assessYear',
          width: 250,
        }, // 평가년도
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003091'),
          dataField: 'assessDate',
          width: '100px',
        }, // 평가일
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004201'),
          dataField: 'approvalUserNm',
          width: 250,
        }, // 평가담당자
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000005835'),
          dataField: 'revNo',
          width: 250,
        }, // 이력번호
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000005930'),
          dataField: 'maxRevNo',
          width: 250,
        }, // 이력번호
      ];

      // 그리드 버튼 설정
      this.gridOptions.btns = [
        // 선택
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001561'),
          color: 'orange',
          btnClicked: 'btnAdd',
        },
      ];
    },
    resizeGrid() {
      let _height = window.innerHeight - 385;
      if (window.innerHeight < 500) {
        _height = 250;
      }

      this.YAuiGrid.resize(null, _height);
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
    btnAdd() {
      let selectedValue = this.YAuiGrid.getCheckedRowItemsAll();

      if (selectedValue.length === 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395' /* 안내 */,
          message: '이력을 선택하세요.' /* 이력을 선택하세요. */,
          type: 'warning',
        });
      } else {
        this.closeRevPopup(selectedValue);
      }
    },

    closeRevPopup(data) {
      this.$emit('closePopup', data);
    },
    getProcessList() {
      this.$http.url = this.$format(
        selectConfig.manage.dept.getProcess.url,
        this.searchParam.plantCd
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          if (this.searchParam.plantCd) {
            this.processCdItems = _result.data.processList;
            if (this.processCdItems) {
              this.processCdItems.splice(0, 0, {
                processCd: null,
                processNm: '전체' /* 선택하세요 */,
              });
            } else {
              this.processCdItems = [{ processCd: null, processNm: '전체' }];
            }
          } else {
            this.processCdItems = [{ processCd: null, processNm: '전체' }];
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },

    getList() {
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.searchParam.deptCd = this.$_.map(this.deptCdList, (dept) => {
        return dept.deptCd;
      });
      this.$http.param = this.searchParam;
      this.$http.request(
        (_result) => {
          this.gridOptions.data = this.$_.clone(_result.data);
          this.$comm.pushCookie(this.searchParam);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },

    closePopup() {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
    },
    /** button 관련 이벤트 **/
    btnClickedErrorCallback(_result) {
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    btnSearchUserClicked() {
      this.popupOptions.target = () =>
        import(`${'@/pages/manage/user/userSearch.vue'}`);
      this.popupOptions.param = {
        multiple: false,
        defaultExpandAll: true,
        plantCd: this.searchParam.plantCd,
      };
      this.popupOptions.title = 'L0000001466'; // 사용자검색
      this.popupOptions.visible = true;
      this.popupOptions.width = '60%';
      this.popupOptions.top = '100px';
      this.popupOptions.closeCallback = this.closePopupUser;
    },
    closePopupUser(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;

      if (data.user) {
        this.searchParam.userId = data.user.userId;
        this.searchParam.assessLeaderNm = data.user.userNm;
      }
      console.log('this.searchParam: ', this.searchParam);
    },
    clear() {
      this.searchParam.userId = null;
      this.searchParam.assessLeaderNm = null;
    },
    /** end button 관련 이벤트 **/
  },
};
</script>

<style></style>
