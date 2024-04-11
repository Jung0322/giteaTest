<!--
  목적 : 시스템관리-공지사항
  작성자 : khk
  Detail : 시스템관리-공지사항 목록/조회
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <y-search-box :gridOptions="gridOptions" @enter="getList">
      <b-row slot="search">
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 작성일 -->
          <y-datepicker
            :width="8"
            :range="true"
            label="L0000002352"
            name="searchPeriod"
            v-model="searchParam.searchPeriod"
            @datachange="
              (val) => {
                (searchParam.searchPeriod = val), getList();
              }
            "
          />
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 공지분류 -->
          <y-select
            :width="8"
            :comboItems="searchComNoticeClassCdItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            name="comNoticeClassCd"
            label="L0000000553"
            v-model="searchParam.comNoticeClassCd"
            @datachange="
              (val) => {
                (searchParam.comNoticeClassCd = val), getList();
              }
            "
          ></y-select>
        </b-col>
      </b-row>
    </y-search-box>
    <b-row class="grid-height grid-box">
      <b-col sm="12" class="h100p">
        <y-auigrid
          ref="yAuiGrid"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000000556')"
          :useExcelExport="false"
          :enableSorting="true"
          :showGridSetSave="true"
          @cellClick="cellClickHandler"
          @openNewPage="openNewPage"
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
  /** attributes: name, components, props, data **/
  name: 'notice',
  props: {},
  data() {
    return {
      searchParam: {
        searchPeriod: [],
        comNoticeClassCd: '',
      },
      gridOptions: {
        name: 'notice',
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
      searchComNoticeClassCdItems: [],
      comNoticeClassCdItems: [],
      searchUrl: '',
      YAuiGrid: null,
    };
  },
  watch: {},
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
    window.addEventListener('resize', this.resizeGrid);
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;
    this.resizeGrid();
    this.getList();
  },
  beforeDestroy() {},
  methods: {
    init() {
      this.editable = this.$route.meta.editable;

      this.searchParam.searchPeriod.push(
        this.$comm.getCalculatedDate(
          this.$comm.getToday(),
          '-3m',
          'YYYY-MM-DD',
          'YYYY-MM-DD'
        )
      );
      this.searchParam.searchPeriod.push(
        this.$comm.moment(this.$comm.getToday()).format('YYYY-MM-DD')
      );

      // 선택항목 설정
      this.$comm.getComboItems('COM_NOTICE_CLASS', true).then((_result) => {
        this.searchComNoticeClassCdItems = _result;
      });

      // 그리드 헤더 설정
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000553'), // 공지분류
          dataField: 'comNoticeClassNm',
          width: '12%',
          style: 'center-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002616'),
          dataField: 'noticeTitle',
          width: '16%',
          style: 'grid-link-cell',
        }, // 제목
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003039'), // 팝업공지여부
          dataField: 'popupYnNm',
          width: '12%',
          style: 'center-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003038'), // 팝업공지기간
          dataField: 'popupPeriod',
          width: '12%',
          style: 'center-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000973'),
          dataField: 'createDt',
          width: '12%',
          style: 'center-align',
        }, // 등록일
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000976'), // 등록자
          dataField: 'createUserNm',
          width: '12%',
          style: 'center-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001697'),
          dataField: 'updateDt',
          width: '12%',
          style: 'center-align',
        }, // 수정일
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001698'), // 수정자
          dataField: 'updateUserNm',
          width: '12%',
          style: 'center-align',
        },
      ];
      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001789'),
          color: 'orange',
          btnClicked: 'openNewPage',
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000327'),
          color: 'green',
          btnClicked: 'btnSearchClickedCallback',
        },
      ];

      this.searchUrl = selectConfig.manage.notice.list.url;

      // this.setGridSize();

      /* 쿠키에 저장된 검색 조건이 있을 경우 최초 페이지 진입시 자동 설정 */
      var searchParamByCookie = this.$comm.setSearchParamByCookie();
      if (typeof searchParamByCookie !== 'undefined') {
        this.searchParam = searchParamByCookie;
      }

      this.getList();
    },

    getList() {
      this.$http.url = this.searchUrl;
      this.$http.type = 'get';
      this.$http.param = this.searchParam;
      this.$http.request(
        (_result) => {
          // this.gridOptions.data = _result.data;
          this.YAuiGrid.setGridData(this.$_.clone(_result.data));
          this.$comm.pushCookie(this.searchParam);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    /**
     * 수정 팝업 호출
     */
    cellClickHandler(event) {
      if (event === null || event === undefined) return;
      if (event.dataField === 'noticeTitle') {
        this.popupOptions.top = '10px';
        this.popupOptions.width = '80%';
        this.popupOptions.target = () => import(`${'./noticeAddDetail.vue'}`);
        this.popupOptions.title = 'L0000003391'; // 공지상세 등록/수정
        this.popupOptions.visible = true;
        this.popupOptions.param = event.item;
        this.popupOptions.closeCallback = this.closePopupUsage;
      }
    },
    openNewPage(event) {
      this.popupOptions.top = '10px';
      this.popupOptions.width = '90%';
      this.popupOptions.target = () => import(`${'./noticeAddDetail.vue'}`);
      this.popupOptions.title = 'L0000003391'; // 공지상세 등록/수정
      this.popupOptions.visible = true;
      this.popupOptions.param = {
        noticeNo: 0,
      };
      this.popupOptions.closeCallback = this.closePopupUsage;
    },
    closePopupUsage(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.getList();
    },
    btnSearchClickedCallback(result) {
      this.getList();
    },
    resizeGrid() {
      let _height = window.innerHeight - 335;
      if (window.innerHeight < 500) {
        _height = 250;
      }

      this.YAuiGrid.resize(null, _height);
    },
  },
};
</script>
