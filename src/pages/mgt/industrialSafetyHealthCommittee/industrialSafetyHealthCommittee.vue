<!--
  목적 : 검진 계획
  작성자 : jkl
  Detail : 검진계획 검색/등록/수정 화면
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <y-search-box :gridOptions="gridOptions" @enter="getDataList">
      <b-row slot="search">
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <y-plant type="search" name="plantCd" v-model="searchParam.plantCd" />
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 기간 -->
          <y-datepicker
            :width="8"
            :range="true"
            type="year"
            label="L0000000767"
            name="year"
            :default="searchParam.period"
            v-model="searchParam.period"
          ></y-datepicker>
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 구분 -->
          <y-select
            :width="8"
            :comboItems="cmiClsCdItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            label="L0000000686"
            name="cmiClsCd"
            v-model="searchParam.cmiClsCd"
          />
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 제목 -->
          <y-text
            :width="8"
            label="L0000002616"
            name="confNm"
            v-model="searchParam.confNm"
          />
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 진행단계 -->
          <y-select
            :width="8"
            :comboItems="progressStepCdItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            label="L0000002777"
            name="progressStepCd"
            v-model="searchParam.progressStepCd"
          />
        </b-col>
      </b-row>
    </y-search-box>

    <!-- <b-row class="mt-3">
      <b-col sm="12">
        <b-col sm="12" class="px-0">
          <div slot="buttonGroup" class="float-right mb-1">
             계획등록 
            <y-btn
              v-if="editable"
              title="L0000000470"
              color="orange"
              @btnClicked="btnPlanClicked"
            />
             무계획결과등록
            <y-btn
              v-if="editable"
              title="L0000001034"
              color="orange"
              @btnClicked="btnResultClicked"
            />
             검색
            <y-btn
              title="L0000000327"
              color="green"
              @btnClicked="getDataList"
            />
          </div>
          산업안전위원회/협의체 목록 
          <y-data-table
            label="L0000001500"
            ref="dataTable"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            :use-paging="true"
            :useRownum="false"
            @tableLinkClicked="tableLinkClicked"
          >
          </y-data-table>
        </b-col>
      </b-col>
    </b-row> -->
    <!-- 산업안전위원회/협의체 목록 -->
    <b-row class="grid-height grid-box">
      <b-col sm="12" class="h100p">
        <y-auigrid
          ref="yAuiGrid"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000001500')"
          :useExcelExport="false"
          :enableSorting="true"
          :showGridSetSave="true"
          :useContextMenu="true"
          :enableRightDownFocus="true"
          :showGridCtrl="true"
          :enableCellMerge="true"
          :cellMergeRowSpan="true"
          @cellClick="cellClickHandler"
          @getDataList="getDataList"
          @btnPlanClicked="btnPlanClicked"
          @btnResultClicked="btnResultClicked"
        />
      </b-col>
    </b-row>
    <y-dialog :param="popupOptions"></y-dialog>
  </b-container>
</template>
<script>
import selectConfig from '@/js/selectConfig';
export default {
  name: 'industrial-safety-health-committee',
  props: {},
  data() {
    return {
      searchParam: {
        plantCd: '',
        startDt: '',
        endDt: '',
        cmiClsCd: '',
        confNm: '',
        progressStepNm: '',
        period: '',
      },
      gridOptions: {
        header: [],
        data: [],
        btns: [],
        height: '400',
      },
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '90%',
        top: '10px',
        param: {},
        closeCallback: null,
      },
      editable: false,
      searchUrl: '',
      cmiClsCdItems: [],
      progressStepCdItems: [],
      period: [],
      YAuiGrid: null,
    };
  },
  watch: {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.setGridHeader();
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;
    this.init();
  },
  beforeDestroy() {},
  /** methods **/
  methods: {
    init() {
      // URL 셋팅
      this.searchUrl =
        selectConfig.mgt.industrialSafetyHealthCommittee.list.url;
      this.editable = this.$route.meta.editable;

      this.searchParam.period = [
        this.$comm.getThisYear(),
        this.$comm.getThisYear(),
      ];
      this.$comm.getComboItems('MGT_CMI_CLS', true).then((_result) => {
        this.cmiClsCdItems = _result;
      });

      this.$comm.getComboItems('COM_GEN_STEP', true).then((_result) => {
        this.progressStepCdItems = _result;
      });

      /* 쿠키에 저장된 검색 조건이 있을 경우 최초 페이지 진입시 자동 설정 */
      var searchParamByCookie = this.$comm.setSearchParamByCookie();
      if (typeof searchParamByCookie !== 'undefined') {
        this.searchParam = searchParamByCookie;
      }
      this.getDataList();
    },
    setGridHeader() {
      // 그리드 헤더 설정
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001415'),
          dataField: 'plantNm',
          width: '11%',
        }, // 사업장
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002777'),
          dataField: 'progressStepNm',
          width: '11%',
        }, // 진행단계
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000451'),
          dataField: 'bizApprStepNm',
          width: '11%',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {},
          },
        }, // 결재진행단계
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000686'),
          dataField: 'cmiClsNm',
          width: '12%',
        }, // 구분
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002268'),
          dataField: 'confDate',
          width: '11%',
        }, // 일시
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002616'),
          dataField: 'confNm',
          width: '11%',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {},
          },
        }, // 제목
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002451'),
          dataField: 'confPlace',
          width: '11%',
        }, // 장소
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002355'),
          dataField: 'writerUserNm',
          width: '11%',
        }, // 작성자
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002352'),
          dataField: 'writerDt',
          width: '11%',
        }, // 작성일
      ];

      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001789'),
          color: 'orange',
          btnClicked: 'btnPlanClicked',
        }, // 신규등록
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001034'),
          color: 'orange',
          btnClicked: 'btnResultClicked',
        }, // 무계획 결과등록
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000327'),
          color: 'green',
          btnClicked: 'getDataList',
        },
      ];
    },
    getDataList() {
      this.searchParam.startDt = this.searchParam.period[0];
      this.searchParam.endDt = this.searchParam.period[1];

      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = this.searchParam;
      this.$http.request(
        (_result) => {
          this.YAuiGrid.setGridData(_result.data);
          this.$comm.pushCookie(this.searchParam);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    tableLinkClicked(header, data) {
      if (header.name === 'bizApprStepNm') {
        this.showApprProgressPopup(data);
      } else {
        if (!data) return;
        this.openPopup(data, null);
      }
    },

    cellClickHandler(data) {
      if (data.dataField === 'bizApprStepNm') {
        this.showApprProgressPopup(data.item);
        console.log('111', data);
      } else {
        if (!data) return;
        this.openPopup(data.item, null);
      }
    },

    // 결재진행상태 조회
    showApprProgressPopup(data) {
      this.popupOptions.target = () => import('@/pages/appr/apprProgressPopup');
      this.popupOptions.title = 'L0000000452'; // 결재진행상태
      this.popupOptions.param = {
        apprRqstNo: data.apprRqstNo, // 결재번호
      };
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closePopup;
    },
    btnPlanClicked() {
      this.openPopup(null, 'plan');
    },
    btnResultClicked() {
      this.openPopup(null, 'result');
    },
    openPopup(data, flag) {
      this.popupOptions.target = () =>
        import(`${'./industrialSafetyHealthCommitteeDetail.vue'}`);
      this.popupOptions.title = data
        ? 'L0000003846'
        : 'L0000003847'; /* 산업안전위원회/협의체 상세 ,  산업안전위원회/협의체 등록 */
      this.popupOptions.visible = true;
      this.popupOptions.width = '90%';
      this.popupOptions.param = {
        committeeConfNo: data ? data.committeeConfNo : 0,
        progressStepCd: flag === 'result' ? 'CMS03' : 'CMS01',
      };
      this.popupOptions.closeCallback = this.closePopup;
    },
    closePopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.getDataList();
    },
  },
};
</script>
