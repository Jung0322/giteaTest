<!--
  목적 : 위험성평가 > 작업 위험성평가 (HE) > 이력 조회
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
      </div>
      <b-row slot="search">
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <y-plant type="search" :width="8" v-model="searchParam.plantCd" />
        </b-col>

        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <b-row>
            <b-col sm="4" md="4" lg="4" xl="4">
              <!-- 평가팀 -->
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
          <!-- 평가년도 -->
          <y-datepicker
            :width="8"
            name="assessYear"
            label="L0000003065"
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
            label="L0000004201"
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
            label="L0000003059"
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
    <b-row class="mt-1">
      <b-col sm="12">
        <b-col sm="12" class="px-0">
          <div slot="buttonGroup" class="float-right mb-1">
            <!-- 선택 -->
            <y-btn
              v-if="popupParam.popupMode && editable"
              title="L0000001561"
              color="orange"
              @btnClicked="btnAdd"
            />
            <!-- 닫기 -->
            <y-btn
              v-if="popupParam.popupMode"
              title="L0000000881"
              @btnClicked="closeRevPopup"
            />
          </div>

          <!-- 위험성평가 결과 목록 -->
          <!-- <y-data-table
            label="L0000005860"
            ref="dataTable"
            :print="true"
            :use-paging="true"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            v-model="selectedValue"
            @tableLinkClicked="tableLinkAccidentTitleClicked"
          >
            <el-table-column
              v-if="popupParam.popupMode && popupParam.multiple && editable"
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
            :label="this.$comm.getLangSpecInfoLabel('L0000005860')"
            :useExcelExport="false"
            :enableCellMerge="true"
            :enableSorting="true"
            :showGridSetSave="true"
            :useContextMenu="true"
            :enableRightDownFocus="true"
            :showGridCtrl="true"
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
  name: 'assess-total-JSA-tab',
  props: {
    popupParam: {
      type: Object,
      default: function () {
        return {
          popupMode: false,
          multiple: false,
          plantCd: '',
          jobNo: 0,
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
    this.editable = this.$route.meta.editable;
    this.init();
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;
    this.getList();
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

      this.getProcessList();
      // 그리드 헤더 설정
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001415'),
          dataField: 'plantNm',
          width: 150,
        } /* 사업장 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003081'),
          dataField: 'assessNm',
          width: 300,
        } /* 평가명 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003059'),
          dataField: 'regRegdemNm',
          width: 150,
        } /* 평가구분 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004990'),
          dataField: 'deptNm',
          width: 150,
        } /* 평가팀 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001341'),
          dataField: 'classificationNm',
          width: 150,
        } /* 분류 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000590'),
          dataField: 'jobManageNo',
          width: 180,
        } /* 관리번호 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000515'),
          dataField: 'processNm',
          width: 180,
        } /* 공정 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002389'),
          dataField: 'jobNm',
          width: 180,
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: (rowIndex, columnIndex, value, item) => {
              this.openDetailPopup(item);
            },
          },
        } /* 작업명 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003065'),
          dataField: 'assessYear',
          width: 100,
        } /* 평가년도 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003091'),
          dataField: 'assessDate',
          width: 100,
        } /* 평가일 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004201'),
          dataField: 'approvalUserNm',
          width: 100,
        } /* 평가담당자 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000005835'),
          dataField: 'revNo',
          width: 100,
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: (rowIndex, columnIndex, value, item) => {
              this.openPopup(item);
            },
          },
        } /* 이력번호 */,
      ];
      // 그리드 버튼 설정
      this.gridOptions.btns = [
        // 검색
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000327'),
          color: 'green',
          btnClicked: 'getList',
        },
      ];
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
      if (!this.selectedValue) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395' /* 안내 */,
          message: 'L0000006073' /* 이력을 선택하세요. */,
          type: 'warning',
        });
      } else {
        this.closeRevPopup(this.selectedValue);
      }
    },
    tableLinkAccidentTitleClicked(header, data) {
      if (header.name === 'revNo') {
        this.openPopup(data);
      } else {
        this.openDetailPopup(data);
      }
    },
    openDetailPopup(data) {
      this.popupOptions.target = () =>
        import(`${'@/pages/rsa/rsamgmt2/planmgmtResultDetail.vue'}`);
      this.popupOptions.width = '90%';
      this.popupOptions.visible = true;
      this.popupOptions.title = 'L0000005902'; // 위험성평가 결과 등록;
      this.popupOptions.param = data
        ? data
        : { assessRsltNo: 0, riskType: this.searchParam.riskType };
      this.popupOptions.closeCallback = this.closePopup;
    },
    openPopup(data) {
      this.popupOptions.target = () =>
        import(`${'./completeRevisionList.vue'}`);
      this.popupOptions.width = '90%';
      this.popupOptions.visible = true;
      this.popupOptions.title = 'L0000005904'; // 위험성평가 결과 이력
      this.popupOptions.param = {
        jobNo: data.jobNo,
      };
      this.popupOptions.closeCallback = this.closePopup;
    },
    closeRevPopup(data) {
      this.$emit('closePopup', data);
    },
    getProcessList() {
      this.$http.url = selectConfig.rsa.planmgmt2.getProcessList.url;
      this.$http.param = {
        plantCd: this.searchParam.plantCd,
      };
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          if (this.searchParam.plantCd) {
            this.processCdItems = _result.data;
            if (this.processItems) {
              this.processItems.splice(0, 0, {
                processCd: null,
                processNm: this.$comm.getLangSpecInfoLabel('L0000003394'),
              }); // 선택하세요
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
    /*  한화솔루션 SHE 고도화 프로젝트(쿠키 삭제) wukjin.j 220627 */
    removeCookie() {
      this.$comm.deleteSearchParamByCookie();
      this.$router.go();
    },

    getList() {
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
          let tempGridData = _result.data;

          this.$_.forEach(tempGridData, (item) => {
            const duplicateItems = this.$_.filter(tempGridData, {
              jobManageNo: item.jobManageNo,
            });
            const maxRevNo = this.$_.maxBy(duplicateItems, 'revNo').revNo;
            if (item.revNo !== maxRevNo) {
              this.$_.remove(tempGridData, (dataItem) => {
                return (
                  dataItem.jobManageNo === item.jobManageNo &&
                  dataItem.revNo < item.revNo
                );
              });
            }
          });
          this.YAuiGrid.setGridData(tempGridData);
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
