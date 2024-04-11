<!--
  목적 : 환경 > 환경영향평가 > 환경영향평가 목록
  Detail : 환경영향평가 목록 화면
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <!--검색 -->
    <y-search-box :gridOptions="gridOptions" @enter="getList">
      <b-row slot="search">
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-6">
          <y-plant type="search" name="plantCd" v-model="searchParam.plantCd" />
        </b-col>
        <!--        사업주관부서-->
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <y-text
            :width="8"
            :disabled="true"
            ui="bootstrap"
            name="deptNm"
            label="L0000004730"
            v-model="searchParam.deptNm"
            :appendIcon="[
              { icon: 'times', callbackName: 'clear' },
              { icon: 'search', callbackName: 'searchDept' },
            ]"
            @searchDept="searchDept"
            @clear="clearDept"
          />
        </b-col>
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-6">
          <!-- 평가구분 -->
          <y-select
            :width="8"
            :comboItems="evalGubunCombos"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            label="L0000003059"
            name="evalGubun"
            v-model="searchParam.evalGubun"
          ></y-select>
        </b-col>
        <b-col sm="8" md="8" lg="8" xl="8" class="col-xxl-3">
          <!-- 사업명 -->
          <y-text
            :width="10"
            ui="bootstrap"
            label="L0000004732"
            name="bizNm"
            v-model="searchParam.businessName"
          ></y-text>
        </b-col>
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-6">
          <!-- 사업진행상태 -->
          <y-select
            :width="8"
            :comboItems="evalProgStateCombos"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            label="L0000004733"
            name="evalProgState"
            v-model="searchParam.evalProgState"
          ></y-select>
        </b-col>
      </b-row>
    </y-search-box>

    <!-- 환경영향평가 계획 목록 grid -->
    <!--<b-row class="mt-3">
      <b-col sm="12">
        <b-col sm="12" class="px-0">
          <div slot="buttonGroup" class="float-right mb-1">
            <-- 검색 --
            <y-btn
              title="L0000000327"
              color="green"
              action-type="GET"
              @btnClicked="getList"
            />
          </div>
          <!- 환경영향평가 현황 목록 --
          <y-data-table
            label="L0000004751"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            :rowStripe="true"
            :use-paging="true"
            :useRownum="false"
            @tableLinkClicked="tableLinkClicked"
          ></y-data-table>
        </b-col>
      </b-col>
    </b-row>-->
    <!-- 환경영향평가 현황 목록 -->
    <b-row class="grid-height grid-box">
      <b-col sm="12" class="h100p">
        <y-auigrid
          ref="yAuiGrid"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000004751')"
          :useExcelExport="false"
          :enableSorting="true"
          :showGridSetSave="true"
          @cellClick="tableLinkClicked"
          @btnSearchClickedCallback="btnSearchClickedCallback"
        />
      </b-col>
    </b-row>
    <y-dialog :param="popupOptions"></y-dialog>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';

export default {
  name: 'env-effect-eval-status',
  props: {},
  data() {
    return {
      envEffectEval: {
        envEffectEvalNo: 0,
        plantCd: '',
        deptCd: '',
        evalGubun: '',
        evalProgState: '',
        evalStepCd: '',
        evalStepNm: '',
        proxyVendorCd: '',
        proxyYn: '',
        businessName: '',
        businessStartDt: '',
        businessEndDt: '',
        businessContents: '',
        objectConfirmContent: '',
        evalPrepCont: '',
        evalDeterCont: '',
        draftCont: '',
        draftNoticeCont: '',
        residentOpnAccept: '',
        residentExplCont: '',
        residentHearCont: '',
        evalAgendaReflect: '',
        evalAgendaDiscuss: '',
        evalAgendaWrite: '',
        eval_agenda_write: '',
        writerUserNm: '',
        writerDt: '',
      },
      searchParam: {
        plantCd: '',
        deptCd: '',
        deptNm: '',
        evalGubun: '',
        evalProgState: '',
        evalStepCd: '',
        proxyVendorCd: '',
        proxyVendorNm: '',
        businessName: '',
      },
      gridOptions: {
        name: 'envEffectEvalStatus',
        header: [],
        data: [],
        btns: [],
        height: 400,
      },
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '80%',
        top: '10px',
        param: {},
        closeCallback: null,
      },
      editable: false,
      searchUrl: '',
      evalStepCombos: [],
      evalGubunCombos: [],
      evalProgStateCombos: [],
    };
  },
  computed: {},
  watch: {
    'gridOptions.data': {
      deep: true,
      handler() {
        let spanTags = document.getElementsByTagName('span');
        let completeText = this.$comm.getLangSpecInfoLabel('L0000004735'); // "평가완료"
        let proceedingText = this.$comm.getLangSpecInfoLabel('L0000003642'); // "진행중"
        for (let i = 0; i < spanTags.length; i++) {
          if (
            spanTags[i].textContent === completeText ||
            spanTags[i].textContent === proceedingText
          ) {
            let span = spanTags[i];
            let row = span.parentNode.parentNode.parentNode.parentNode;
            for (let i = 5; i < 16; i++) {
              row.childNodes[i].classList.remove('env-green-cell');
              row.childNodes[i].classList.remove('env-red-cell');
            }
          }
        }
        this.$nextTick(function () {
          let spanTags = document.getElementsByTagName('span');
          let CompleteTagList = [];
          for (let i = 0; i < spanTags.length; i++) {
            if (spanTags[i].textContent === completeText) {
              let span = spanTags[i];
              CompleteTagList.push(span);
              let row = span.parentNode.parentNode.parentNode.parentNode;
              for (let i = 5; i < 16; i++) {
                row.childNodes[i].classList.add('env-green-cell');
                row.childNodes[i].firstChild.firstChild.setAttribute(
                  'title',
                  row.childNodes[i].firstChild.firstChild.firstChild.textContent
                );
              }
            }
          }
          let proceedingTagList = [];
          for (let i = 0; i < spanTags.length; i++) {
            if (spanTags[i].textContent === proceedingText) {
              let span = spanTags[i];
              proceedingTagList.push(span);
              let row = span.parentNode.parentNode.parentNode.parentNode;
              let lastIndexWithText = 0;
              for (let i = 5; i < 16; i++) {
                if (
                  row.childNodes[i].firstChild.firstChild.firstChild.textContent
                ) {
                  lastIndexWithText = i;
                  row.childNodes[i].firstChild.firstChild.setAttribute(
                    'title',
                    row.childNodes[i].firstChild.firstChild.firstChild
                      .textContent
                  );
                }
              }
              for (let i = 5; i <= lastIndexWithText; i++) {
                row.childNodes[i].classList.add('env-red-cell');
              }
            }
          }
        });
      },
    },
  },
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
    window.addEventListener('resize', this.resizeGrid);
    window.getApp.$on('updateEnvEffectEvalList', this.getList);
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;
    this.resizeGrid();
    this.getList();
  },
  methods: {
    init() {
      this.editable = this.$route.meta.editable;
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001415'),
          dataField: 'plantNm',
          width: '100',
          style: 'center-align',
        } /* 사업장 */,
        {
          /* 주관부서 */
          headerText: this.$comm.getLangSpecInfoLabel('L0000002713'),
          dataField: 'deptNm',
          width: '130',
          style: 'center-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003059'),
          dataField: 'evalGubun',
          width: '170',
          style: 'center-align',
        } /* 평가구분 */,
        {
          /* 사업명 */
          headerText: this.$comm.getLangSpecInfoLabel('L0000004732'),
          dataField: 'businessName',
          width: '200',
          style: 'center-align grid-link-cell',
        },
        {
          /* 진행상태 */
          headerText: this.$comm.getLangSpecInfoLabel('L0000002779'),
          dataField: 'evalProgState',
          width: '100',
          style: 'center-align',
        },
        {
          /* 진행단계 */
          headerText: this.$comm.getLangSpecInfoLabel('L0000002777'),
          dataField: 'evalStepNm',
          width: '100',
          style: 'right-align',
          sortable: false,
          children: [
            {
              /* 대상여부확인 */
              headerText: this.$comm.getLangSpecInfoLabel('L0000004739'),
              dataField: 'objectConfirmContent',
              width: '170',
              style: 'center-align',
            },
            {
              /* 평가준비서 작성 */
              headerText: this.$comm.getLangSpecInfoLabel('L0000004741'),
              dataField: 'evalPrepCont',
              width: '170',
              style: 'center-align',
            },
            {
              /* 평가항목 결정 공개 */
              headerText: this.$comm.getLangSpecInfoLabel('L0000004750'),
              dataField: 'evalDeterCont',
              width: '170',
              style: 'center-align',
            },
            {
              /* 환경영향평가(초안) 작성 */
              headerText: this.$comm.getLangSpecInfoLabel('L0000004778'),
              dataField: 'draftCont',
              width: '170',
              style: 'center-align',
            },
            {
              /* 환경영향평가(초안) 공고 공람 */
              headerText: this.$comm.getLangSpecInfoLabel('L0000004782'),
              dataField: 'draftNoticeCont',
              width: '170',
              style: 'center-align',
            },
            {
              /* 주민 등의 의견 수렴 */
              headerText: this.$comm.getLangSpecInfoLabel('L0000004747'),
              dataField: 'residentOpnAccept',
              width: '170',
              style: 'center-align',
            },
            {
              /* 주민설명회 개최 */
              headerText: this.$comm.getLangSpecInfoLabel('L0000004746'),
              dataField: 'residentExplCont',
              width: '170',
              style: 'center-align',
            },
            {
              /* 주민공청회 개최 */
              headerText: this.$comm.getLangSpecInfoLabel('L0000004745'),
              dataField: 'residentHearCont',
              width: '170',
              style: 'center-align',
            },
            {
              /* 환경영향평가(본안) 작성 */
              headerText: this.$comm.getLangSpecInfoLabel('L0000004779'),
              dataField: 'evalAgendaWrite',
              width: '170',
              style: 'center-align',
            },
            {
              /* 환경영향평가(본안) 협의 */
              headerText: this.$comm.getLangSpecInfoLabel('L0000004780'),
              dataField: 'evalAgendaDiscuss',
              width: '170',
              style: 'center-align',
            },
            {
              text: 'L0000004781' /* 환경영향평가(본안) 협의의견 반영 */,
              dataField: 'evalAgendaReflect',
              width: '170',
              style: 'center-align',
            },
          ],
        },
      ];
      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000327'),
          color: 'green',
          btnClicked: 'btnSearchClickedCallback',
        },
      ];

      this.searchUrl = selectConfig.env.envEffectEval.envEffectEval.list.url;

      /* 쿠키에 저장된 검색 조건이 있을 경우 최초 페이지 진입시 자동 설정 */
      var searchParamByCookie = this.$comm.setSearchParamByCookie();
      if (typeof searchParamByCookie !== 'undefined') {
        this.searchParam = searchParamByCookie;
      }

      this.getComboItems('EVAL_GUBUN');
      this.getComboItems('EVAL_PROG_STATE');
      this.getList();
    },
    getList() {
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = this.searchParam;
      this.$http.request(
        (_result) => {
          this.YAuiGrid.setGridData(this.$_.clone(_result.data));
          this.$comm.pushCookie(this.searchParam);
          let paginationTag = document.getElementsByClassName('el-pagination');
          let thTag = document.getElementsByTagName('th');
          /* paginationTag[0].onclick = this.triggerColor
          for (let i = 0; i < thTag.length; i++) {
            thTag[i].onclick = this.triggerColor
          } */
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    tableLinkClicked(data) {
      if (!data) return;
      if (data.dataField === 'businessName') {
        this.popupOptions.target = () =>
          import(`${'./envEffectEvalDetail.vue'}`);
        this.popupOptions.title = 'L0000004728'; /* 환경영향평가 상세 */
        this.popupOptions.visible = true;
        this.popupOptions.width = '80%';
        this.popupOptions.top = '10px';
        this.popupOptions.param = {
          envEffectEvalNo: data.item.envEffectEvalNo,
          popupMode: true,
        };
        this.popupOptions.closeCallback = this.closePopup;
      }
    },
    btnPopupClickedCallback() {
      this.popupOptions.target = () => import(`${'./envEffectEvalDetail.vue'}`);
      this.popupOptions.title = 'L0000004728'; /* 환경영향평가 상세 */
      this.popupOptions.visible = true;
      this.popupOptions.width = '80%';
      this.popupOptions.top = '10px';
      this.popupOptions.param = {
        envEffectEvalNo: 0,
      };
      this.popupOptions.closeCallback = this.closePopup;
    },
    closePopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.getList();
    },
    searchDept(_item) {
      this.popupOptions.target = () =>
        import(`${'@/pages/baseInfo/deptManage/deptSearchPopup.vue'}`);
      this.popupOptions.param = {
        plantCd: this.$store.getters.plantCd,
      };
      this.popupOptions.title = 'L0000004627';
      this.popupOptions.visible = true;
      this.popupOptions.width = '35%';
      this.popupOptions.top = '100px';
      this.popupOptions.closeCallback = this.closePopupSearchDept;
    },
    closePopupSearchDept(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      if (data.dept) {
        this.searchParam.deptCd = data.dept.deptCd;
        this.searchParam.deptNm = data.dept.deptNm;
      }
    },
    clearDept() {
      this.searchParam.deptCd = null;
      this.searchParam.deptNm = null;
    },
    triggerColor() {
      this.$nextTick(function () {
        this.gridOptions.data.push(1);
        this.gridOptions.data.pop();
      });
    },
    getComboItems(codeGroupCd) {
      this.$http.url = this.$format(
        selectConfig.codeMaster.getSelect.url,
        codeGroupCd
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          if (codeGroupCd === 'EVAL_GUBUN') {
            this.evalGubunCombos = this.$_.clone(_result.data);
            this.evalGubunCombos.splice(0, 0, {
              code: '',
              codeNm: this.$comm.getLangSpecInfoLabel('L0000002519'),
            }); /* 전체 */
          }
          if (codeGroupCd === 'EVAL_PROG_STATE') {
            this.evalProgStateCombos = this.$_.clone(_result.data);
            this.evalProgStateCombos.splice(0, 0, {
              code: '',
              codeNm: this.$comm.getLangSpecInfoLabel('L0000002519'),
            }); /* 전체 */
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    btnSearchClickedCallback(result) {
      this.getList();
    },
    resizeGrid() {
      let _height = window.innerHeight - 370;
      if (window.innerHeight < 500) {
        _height = 250;
      }

      this.YAuiGrid.resize(null, _height);
    },
  },
};
</script>

<style>
.env-green-cell {
  background-color: #e1f5e1 !important;
}
.env-red-cell {
  background-color: #efdcdc !important;
}
.env-red-cell > .cell > .cell > span,
.env-green-cell > .cell > .cell > span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
