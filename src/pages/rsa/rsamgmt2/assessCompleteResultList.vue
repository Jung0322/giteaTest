<!--
  목적 : 위험성평가 > 작업 위험성평가(HE) > 결과 관리
  Detail : 위험성평가 실행 목록 화면
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

        <!-- 정기/수시 -->
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <y-select
            :width="8"
            :comboItems="rsaRegRegdemItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            label="L0000002596"
            name="regRegdem"
            v-model="searchParam.regRegdem"
          ></y-select>
        </b-col>
      </b-row>
    </y-search-box>
    <!-- 검색 결과 테이블 -->
    <b-row class="mt-1">
      <b-col sm="12">
        <b-col sm="12" class="px-0">
          <!-- 평가결과 집계 목록  -->
          <y-auigrid
            ref="yAuiGrid"
            :name="gridOptions.name"
            :headers="gridOptions.header"
            :btns="gridOptions.btns"
            :height="gridOptions.height"
            :label="this.$comm.getLangSpecInfoLabel('L0000005901')"
            :useExcelExport="false"
            :enableCellMerge="true"
            :enableSorting="true"
            :showGridSetSave="true"
            :useContextMenu="true"
            :enableRightDownFocus="true"
            :showGridCtrl="true"
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
  name: 'assess-total-JSA-tab',
  props: {},
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
        deptCd: [],
      },
      gridOptions: {
        header: [],
        data: [],
        height: 'auto',
      },

      classificationItems: [],
      rsaRegRegdemItems: [],
      searchUrl: '',
      classificationUrl: '',
      deptCdList: [],
      YAuiGrid: null,
    };
  },
  watch: {},
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
    init() {
      // Url Setting
      this.searchUrl = selectConfig.rsa.planmgmt2.getCompleteResultList.url;
      this.classificationUrl =
        selectConfig.rsa.planmgmt2.getClassificationListForDepts.url;

      this.$comm.getComboItems('RSA_REG_REGDEM', false).then((_result) => {
        this.rsaRegRegdemItems = _result || [];
        this.$_.remove(this.rsaRegRegdemItems, (item) => {
          return item.code === 'REG03';
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

      // this.getList();

      // 그리드 헤더 설정
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001415'),
          dataField: 'plantNm',
          width: 150,
        } /* 사업장 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003065'),
          dataField: 'assessYear',
          width: 150,
        } /* 평가년도 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003081'),
          dataField: 'assessNm',
          width: 250,
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
          headerText: this.$comm.getLangSpecInfoLabel('L0000005902'),
          dataField: 'assessNmCount',
          width: 150,
        } /* 평가계획건수 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003085'),
          dataField: 'completeCnt',
          width: 150,
        } /* 평가완료건수 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003084'),
          dataField: 'completionPercentage',
          width: 150,
        } /* 평가완료건수 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000005903'),
          dataField: 'criticalRiskCount',
          width: 150,
        } /* 중요위험등록부등재건수 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000255'),
          dataField: 'imprCnt',
          width: 150,
        } /* 개선대책수립건수 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000257'),
          dataField: 'imprCnt2',
          width: 150,
        } /* 개선대책완료건수 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000256'),
          dataField: 'imprPercentage',
          width: 150,
        } /* 개선대책실행율(%) */,
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
    /*  한화솔루션 SHE 고도화 프로젝트(쿠키 삭제) wukjin.j 220627 */
    removeCookie() {
      this.$comm.deleteSearchParamByCookie();
      this.$router.go();
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
          console.log('_result.data: ', _result.data);
          this.$_.forEach(tempGridData, (item) => {
            if (isNaN(item.imprCnt2) || isNaN(item.imprCnt)) {
              item.imprCnt2 = 0;
              item.imprCnt = 0;
            }
            if (item.imprCnt !== 0) {
              item.imprPercentage = (item.imprCnt2 * 100) / item.imprCnt;
            } else {
              item.imprPercentage = 0;
            }
            if (isNaN(item.imprPercentage)) {
              item.imprPercentage = 0;
            }
          });
          // 퍼센트 처리
          this.$_.forEach(tempGridData, (item) => {
            let truncPercent;
            let tempImprPercent;
            let tempCompletPercent;
            truncPercent = this.$_.parseInt(item.imprPercentage);
            tempImprPercent = String(truncPercent) + ' %';
            tempCompletPercent = item.completionPercentage + ' %';
            item.imprPercentage = tempImprPercent;
            item.completionPercentage = tempCompletPercent;
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
        this.searchParam.userNm = data.user.userNm;
      }
    },
    clear() {
      this.searchParam.userId = null;
      this.searchParam.userNm = null;
    },
    /** end button 관련 이벤트 **/
  },
};
</script>

<style></style>
