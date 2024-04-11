<!--
  목적 : 설비관리 - 설비유형 관리
  Detail : 설비유형 조회 등록/수정화면
  y-aui-grid 로 변경
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <!-- 아래 그리드 강제 설정을 위해 y-search-box 생성 -->
    <y-search-box :gridOptions="gridOptions" v-show="false"></y-search-box>

    <!-- 검색 결과 테이블 -->
    <b-row>
      <b-col sm="12" class="mt-3">
        <b-col sm="12" class="px-0">
          <b-row class="grid-height grid-box">
            <b-col sm="12" class="h100p">
              <y-auigrid
                ref="yAuiGrid"
                :name="gridOptions.name"
                :headers="gridOptions.header"
                :btns="gridOptions.btns"
                :height="gridOptions.height"
                :label="this.$comm.getLangSpecInfoLabel('L0000001598')"
                :useExcelExport="true"
                :useContextMenu="true"
                :enableRightDownFocus="true"
                :showGridCtrl="true"
                :enableSorting="true"
                :showGridSetSave="true"
                @cellClick="tableLinkClicked"
                @btnPopupClicked="btnPopupClickedCallback"
                @treeOpenChange="treeOpenChangeHandler"
              />
            </b-col>
          </b-row>
        </b-col>
      </b-col>
    </b-row>
    <y-dialog :param="popupOptions"></y-dialog>
  </b-container>
</template>

<script>
import YTree from '@/components/YTree';
import arrayToTree from 'array-to-tree';
import YTreeDataTable from '@/components/YTreeDataTable';
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
export default {
  /* attributes: name, components, props, data */
  name: 'y-facility-type',
  components: {
    'y-tree': YTree,
    YTreeDataTable,
  },
  props: {},
  data: () => ({
    facilityType: {
      safFacilityTypeCd: '',
      safFacilityTypeNm: '',
      psafFacilityTypeCd: '',
      // sortOrder: 0,
      useYn: 'Y',
    },
    searchParam: {
      safFacilityTypeNm: '',
      psafFacilityTypeCd: '',
    },
    search: false, // 설비유형 저장 후 설비유형 컴포넌트 재 조회하는 용도
    gridOptions: {
      header: [],
      data: [],
      height: 'auto',
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
    updateMode: false,
    isInsert: false,
    isEdit: false,
    editUrl: '',
    insertUrl: '',
    searchUrl: '',
    searchDetailUrl: '',
    checkUrl: '',
    YAuiGrid: null,
  }),
  //* Vue lifecycle: created, mounted, destroyed, etc */
  beforeCreate() {},
  created() {},
  updated() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
    window.addEventListener('resize', this.resizeGrid);
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;
    this.mountedInit();
    this.resizeGrid();
  },
  beforeDestroy() {
    // 윈도우 resize event 제거-SPA 기반이므로 제거하지 않으면 다른페이지에서 해당 이벤트가 호출됨
  },
  //* methods */
  methods: {
    init() {
      this.editable = this.$route.meta.editable;

      // Url Setting
      this.searchUrl = selectConfig.baseInfo.facilityType.list.url;

      this.getList();

      // 그리드 헤더 설정
      this.gridOptions.header = [
        {
          headerText: '',
          dataField: 'safFacilityTypeNm',
          width: '200px',
          style: 'center',
        }, // 사용여부
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001605'),
          dataField: 'safFacilityTypeCd',
          width: '300px',
          style: 'center',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {},
          },
        }, // 설비유형코드
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001439'),
          dataField: 'useYnNm',
          width: '200px',
          style: 'center',
        }, // 사용여부
      ];
    },
    treeOpenChangeHandler(event) {
      console.log('event: ', event);
    },
    getList() {
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = this.searchParam;
      this.$http.request(
        (_result) => {
          // this.gridOptions.data = this.convertTree(_result.data);
          this.YAuiGrid.setGridData(this.convertTree(_result.data));
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    /**
     * 부서 트리용 기초 정보를 Tree 메뉴로 변환
     */
    convertTree(_treeBases) {
      if (!_treeBases || _treeBases.length <= 0) return null;
      var tree = arrayToTree(_treeBases, {
        parentProperty: 'psafFacilityTypeCd',
        customID: 'safFacilityTypeCd',
      });

      return tree;
    },
    mountedInit() {
      this.gridOptions.btn = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001789'),
          color: 'orange',
          btnClicked: 'btnPopupClicked',
          visible: this.editable,
        }, // 신규등록
      ];
      this.YAuiGrid.setBtnArr(this.gridOptions.btn);
    },
    // 입력 setting
    selectedRow(data) {
      if (!data) return;

      this.$http.url = this.$format(
        this.searchDetailUrl,
        data.safFacilityTypeCd
      );
      this.$http.type = 'GET';

      this.$http.request(
        (_result) => {
          this.updateMode = true;
          this.facilityType = this.$_.clone(_result.data);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    /**
     * 수정 팝업 호출
     */
    resizeGrid() {
      let _height = window.innerHeight - 270;  
      if (window.innerHeight < 500) {
        _height = 250;
      }
      
      this.YAuiGrid.resize(null, _height);
    },
    tableLinkClicked(event) {
      if (event === null || event === undefined) return;
      if (event.dataField === 'safFacilityTypeCd') {
        this.popupOptions.top = '10px';
        this.popupOptions.width = '80%';
        this.popupOptions.target = () =>
          import(`${'./facilityTypeDetail.vue'}`);
        this.popupOptions.title = 'L0000001600';
        // 설비유형 상세 등록/수정
        this.popupOptions.visible = true;
        this.popupOptions.param = event.item;
        this.popupOptions.closeCallback = this.closePopupUsage;
      }
    },
    /**
     * 등록 팝업  호출
     */
    btnPopupClickedCallback() {
      this.popupOptions.top = '10px';
      this.popupOptions.width = '80%';
      this.popupOptions.target = () => import(`${'./facilityTypeDetail.vue'}`);
      this.popupOptions.title = 'L0000001600';
      // 설비유형 상세 등록/수정
      this.popupOptions.visible = true;
      this.popupOptions.param = {
        safFacilityTypeCd: 0,
      };
      this.popupOptions.closeCallback = this.closePopupUsage;
    },
    closePopupUsage(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.getList();
    },

    /** end button 관련 이벤트 **/
  },
};
</script>
