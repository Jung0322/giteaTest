<!--
  목적 : 부서 목록
  작성자 : JKL(필요없는 소스코드 삭제만 함)
  Detail : 부서 목록을 조회
  *
  examples:
  *
  -->
<template>
  <div id>
    <b-container fluid>
      <!-- 검색 -->
      <y-search-box
        :gridOptions="gridOptions"
        @enter="getDeptTreeDatatableBases"
      >
        <b-row slot="search">
          <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
            <y-plant type="search" v-model="searchParam.plantCd" />
          </b-col>
          <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
            <!-- 부서 -->
            <y-text
              :width="8"
              ui="bootstrap"
              label="L0000001287"
              name="menuNm"
              v-model="searchParam.deptNm"
            />
          </b-col>
        </b-row>
      </y-search-box>
      <!-- 검색 결과 테이블 -->
      <b-row class="mt-3">
        <b-col sm="12">
          <b-col sm="12" class="px-0">
            <!-- <div class="float-right mb-1"> -->
            <!-- 신규등록 -->
            <!-- <y-btn
                v-if="editable"
                title="L0000001789"
                color="orange"
                @btnClicked="btnPopupClickedCallback"
              /> -->
            <!-- 검색 -->
            <!-- <y-btn
                title="L0000000327"
                color="green"
                @btnClicked="getDeptTreeDatatableBases"
              />
            </div> -->
            <!-- 부서목록 -->
            <!-- <y-tree-data-table
              label="L0000001310"
              :headers="gridOptions.header"
              :items="gridOptions.data"
              :height="gridOptions.height"
              expand-column-name="deptNm"
              expand-column-width="250"
              data-key="deptCd"
              parent-key="pdeptCd"
              @tableLinkClicked="tableLinkClicked"
            ></y-tree-data-table> -->
            <y-auigrid
              ref="yAuiGrid"
              :name="gridOptions.name"
              :headers="gridOptions.header"
              :btns="gridOptions.btns"
              :height="gridOptions.height"
              :label="this.$comm.getLangSpecInfoLabel('L0000001310')"
              :useExcelExport="true"
              :useContextMenu="true"
              :enableRightDownFocus="true"
              :showGridCtrl="true"
              :enableSorting="true"
              :showGridSetSave="true"
              @cellClick="tableLinkClicked"
              @getDeptTreeDatatableBases="getDeptTreeDatatableBases"
              @btnPopupClickedCallback="btnPopupClickedCallback"
            />
          </b-col>
        </b-col>
      </b-row>

      <!-- 부서 정보 상세 팝업 -->
      <y-dialog :param="popupOptions"></y-dialog>
    </b-container>
  </div>
</template>

<script>
import YTree from '@/components/YTree';
import arrayToTree from 'array-to-tree';
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
import YTreeDataTable from '@/components/YTreeDataTable';

export default {
  /** attributes: name, components, props, data **/
  name: 'dept-manage',
  components: {
    'y-tree': YTree,
    YTreeDataTable,
  },
  props: {},
  data() {
    return {
      gridOptions: {
        name: 'deptMain',
        header: [],
        data: [],
        height: 'auto',
      },
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '70%',
        top: '50px',
        param: {},
        closeCallback: null,
      },
      searchParam: {
        plantCd: '',
        deptNm: '',
        pdeptCd: '',
      },
      dept: {
        plantCd: '',
        deptCd: '',
        deptNm: '',
        pdeptCd: '',
        pdeptNm: '',
        deptLvl: null,
        useYn: 'Y',
      },
      editable: false,
      YAuiGrid: null,
    };
  },
  /** Vue lifecycle: created, mounted, destroyed, etc **/
  beforeCreate() {},
  created() {},
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
  beforeDestroy() {},
  /** methods **/
  methods: {
    /** 초기화 관련 함수 **/
    init() {
      this.editable = this.$route.meta.editable;
      /* 쿠키에 저장된 검색 조건이 있을 경우 최초 페이지 진입시 자동 설정 */
      var searchParamByCookie = this.$comm.setSearchParamByCookie();
      if (typeof searchParamByCookie !== 'undefined') {
        this.searchParam = searchParamByCookie;
      }

      this.getDeptTreeDatatableBases();
      this.gridOptions.header = [
        {
          headerText: '',
          dataField: 'deptNm',
          width: '200px',
          style: 'center',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001332'), // 부서코드
          dataField: 'deptCd',
          width: '250px',
          style: 'center',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {},
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001307'), // 부서레벨
          dataField: 'deptLvlNm',
          width: '250px',
          style: 'center',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001439'),
          dataField: 'useYnNm',
          width: '250px',
          style: 'center',
        },
        // 사용여부
      ];
    },
    mountedInit() {
      this.gridOptions.btn = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001789'),
          color: 'orange',
          btnClicked: 'btnPopupClickedCallback',
          visible: this.editable,
        }, // 신규등록
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000327'),
          color: 'green',
          btnClicked: 'getDeptTreeDatatableBases',
        }, // 검색
      ];
      this.YAuiGrid.setBtnArr(this.gridOptions.btn);
    },

    getDeptTreeDatatableBases() {
      this.$http.url = selectConfig.manage.dept.treelist.url;
      this.$http.param = this.searchParam;
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          // this.gridOptions.data = this.convertTree(_result.data);
          this.YAuiGrid.setGridData(this.convertTree(_result.data));
          this.$comm.pushCookie(this.searchParam);
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
        parentProperty: 'pdeptCd',
        customID: 'deptCd',
      });
      return tree;
    },
    resizeGrid() {
      let _height = window.innerHeight - 315;  
      if (window.innerHeight < 500) {
        _height = 250;
      }
      
      this.YAuiGrid.resize(null, _height);
    },
    /**
     * 등록 팝업  호출
     */
    btnPopupClickedCallback() {
      this.popupOptions.top = '10px';
      this.popupOptions.width = '80%';
      this.popupOptions.target = () => import(`${'./deptDetail.vue'}`);
      this.popupOptions.title = 'L0000005405'; // 부서관리 상세 등록/수정
      this.popupOptions.visible = true;
      this.popupOptions.param = {
        deptCd: '',
      };
      this.popupOptions.closeCallback = this.closePopup;
    },
    // 수정 팝업 호출
    // tableLinkClicked(header, data) {
    //   if (data === null || data === undefined) return;
    //   this.popupOptions.top = '10px';
    //   this.popupOptions.width = '80%';
    //   this.popupOptions.target = () => import(`${'./deptDetail.vue'}`);
    //   this.popupOptions.title = 'L0000001298'; // 부서 정보 상세
    //   this.popupOptions.visible = true;
    //   this.popupOptions.param = data;
    //   this.popupOptions.closeCallback = this.closePopup;
    // },
    tableLinkClicked(event) {
      if (
        event === null ||
        event === undefined ||
        event.dataField !== 'deptCd'
      ) {
        return;
      } else {
        this.popupOptions.top = '10px';
        this.popupOptions.width = '80%';
        this.popupOptions.target = () => import(`${'./deptDetail.vue'}`);
        this.popupOptions.title = 'L0000001298';
        // 부서별 공정 상세 등록/수정
        this.popupOptions.visible = true;
        this.popupOptions.param = event.item;
        this.popupOptions.closeCallback = this.closePopup;
      }
    },
    /** /기타 function **/
    closePopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.getDeptTreeDatatableBases();
    },
  },
};
</script>
