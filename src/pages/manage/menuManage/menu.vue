<!--
  목적 : (반드시 기입하세요) 컴포넌트
  작성자 : (이니셜로 반드시 입력하세요)
  Detail :
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <y-search-box :gridOptions="gridOptions" @enter="btnSearchClicked">
      <b-row slot="search">
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 최상위 메뉴명 -->
          <y-select
            :width="8"
            :comboItems="comboTaskItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            label="L0000002885"
            name="taskGrpCdSearch"
            v-model="searchParam.taskGrpCd"
          />
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 메뉴명(KOR) -->
          <y-text
            :width="8"
            ui="bootstrap"
            label="L0000004511"
            name="menuNmSearch"
            v-model="searchParam.menuNm"
          />
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 상위메뉴 -->
          <y-text
            label="L0000001534"
            ui="bootstrap"
            placeholder="L0000002519"
            v-model="searchParam.upMenuNm"
            :width="8"
            :treeCheck="false"
            :editable="false"
          >
            <el-popover
              slot="customAppendIcon"
              placement="right"
              width="400"
              trigger="manual"
              v-model="searchParam.popoverVisible"
            >
              <y-tree
                node-key="menuId"
                label="menuNm"
                :editable="false"
                :treeData="menuTree"
                @nodeClick="searchNodeClick"
              />
              <el-button
                icon="el-icon-search"
                circle
                slot="reference"
                size="mini"
                @click="
                  searchParam.popoverVisible = !searchParam.popoverVisible
                "
              />
              <div style="text-align: right; margin: 0">
                <el-button
                  size="mini"
                  type="text"
                  @click="searchParam.popoverVisible = false"
                  >닫기</el-button
                >
              </div>
            </el-popover>
            <el-button
              v-if="searchParam.upMenuId"
              icon="el-icon-close"
              circle
              slot="customAppendIcon"
              size="mini"
              @click.stop="removeSearchNode"
            />
          </y-text>
        </b-col>
      </b-row>
    </y-search-box>
    <!-- 검색 -->

    <!-- 검색 결과 테이블 -->
    <b-row class="grid-height grid-box">
      <b-col sm="12" class="h100p">
        <y-auigrid
          ref="yAuiGrid"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :useExcelExport="false"
          :useContextMenu="true"
          :enableRightDownFocus="true"
          :showGridCtrl="true"
          :enableSorting="true"
          @btnSearchClicked="btnSearchClicked"
          @cellClick="cellClickHandler"
          @btnPopupClickedCallback="btnPopupClickedCallback"
        />
      </b-col>
    </b-row>
    <y-dialog :param="popupOptions"></y-dialog>
  </b-container>
</template>

<script>
import YTree from '@/components/YTree';
import arrayToTree from 'array-to-tree';
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
import YTreeDataTable from '@/components/YTreeDataTable';

export default {
  /** attributes: name, components, props, data **/
  name: 'menu-manage', // 반드시 입력하세요(안 하면 warning 발생). 네이밍 룰은 현재 vue component의 파일명의 단어를 "-"로 구분(예:exam-data)하여 입력하시면 됩니다. 입력후 이 주석은 지워주세요.
  components: {
    'y-tree': YTree,
    YTreeDataTable,
  },
  props: {},
  // TODO: 화살표 함수(=>)는 data에 사용하지 말 것
  //    data: () => { return { a: this.myProp }}) 화살표 함수가 부모 컨텍스트를 바인딩하기 때문에 this는 예상과 달리 Vue 인스턴스가 아니기 때문에 this.myProp는 undefined로 나옵니다.
  //    참고url: https://kr.vuejs.org/v2/api/index.html#data
  data() {
    return {
      menu: {
        menuId: '',
        menuNm: '',
        upMenuId: '',
      },
      menuTree: [],
      // menuTreeDataTable: [],
      // defaultExpandAll: [],
      gridOptions: {
        name: 'menu',
        header: [],
        data: [],
        btns: [],
        height: '600',
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
      searchUrl: '',
      searchParam: {
        popoverVisible: false,
        taskGrpCd: '',
        menuNm: '',
        upMenuNm: '',
        upMenuId: '',
      },
      comboTaskItems: [],
      editable: false,
      YAuiGrid: null,
    };
  },
  watch: {},
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
    this.resizeGrid();
  },
  beforeDestroy() {},
  /** methods **/
  methods: {
    /** 초기화 관련 함수 **/
    init() {
      this.editable = this.$route.meta.editable;
      // 검색 url
      this.searchUrl = selectConfig.menuTreeBases.list.url;

      this.$comm.getComboItems('TASK_GRP', true).then((_result) => {
        this.comboTaskItems = _result;
      });

      /* 쿠키에 저장된 검색 조건이 있을 경우 최초 페이지 진입시 자동 설정 */
      var searchParamByCookie = this.$comm.setSearchParamByCookie();
      if (typeof searchParamByCookie !== 'undefined') {
        this.searchParam = searchParamByCookie;
      }

      this.getMenuTreeDatatableBases();
      this.getMenuTreeBases();

      // TODO: 일부 컬럼의 width를 주지 않으면 자동으로 너비에 맞게 조정 된다.
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004511'),
          dataField: 'menuNm',
          width: '20%',
        }, // 메뉴명(KOR)
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001010'),
          dataField: 'menuId',
          width: '100',
          style: 'grid-link-cell',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {},
          },
        }, // 메뉴코드
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001007'),
          dataField: 'menuLvl',
          width: '80',
          style: 'center-align',
        }, // 메뉴레벨
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004843'),
          dataField: 'menuKind',
          width: '80',
          style: 'center-align',
        }, // 종류
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002601'), // 정렬순서
          dataField: 'sortOrder',
          width: '80',
          style: 'center-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000113'),
          dataField: 'frontEndUrl',
          style: 'left-align',
          width: '250',
        }, // FrontEnd Url
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002285'),
          dataField: 'accessYn',
          style: 'left-align',
          width: '280',
        }, // 읽기권한
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001826'),
          dataField: 'writeYn',
          style: 'left-align',
          width: '280',
        }, // 쓰기권한
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001439'),
          dataField: 'useYnNm',
          style: 'center-align',
        }, // 사용여부
      ];
      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001789'),
          color: 'orange',
          btnClicked: 'btnPopupClickedCallback',
        }, // 신규등록
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000327'),
          color: 'green',
          btnClicked: 'btnSearchClicked',
        }, // 신규등록
      ];
    },
    getMenuTreeDatatableBases() {
      this.$http.url = this.searchUrl;
      this.$http.param = this.searchParam;
      this.$http.type = 'GET';
      console.log('this.$http.param: ', this.$http.param);
      var success = false;
      var dataCnt;
      this.$http.request(
        (_result) => {
          // this.menuTreeDataTable = this.convertTree(_result.data);
          if (_result.data.length > 0) {
            this.YAuiGrid.setGridData(this.convertTree(_result.data));
          } else {
            this.YAuiGrid.setGridData([]);
          }

          this.$comm.pushCookie(this.searchParam);
          success = true;
          dataCnt = _result.length;
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    /**
     * 메뉴 tree 기초 정보 조회
     */
    getMenuTreeBases() {
      this.$http.url = this.searchUrl;
      this.$http.param = null;
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.menuTree = this.convertTree(_result.data);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    btnSearchClicked() {
      this.getMenuTreeDatatableBases();
    },
    searchNodeClick(_node) {
      this.searchParam.upMenuNm = _node.menuNm;
      this.searchParam.upMenuId = _node.menuId;
      this.searchParam.popoverVisible = false;
    },
    removeSearchNode() {
      this.searchParam.upMenuNm = null;
      this.searchParam.upMenuId = null;
    },
    /** /Button Event **/

    /** 기타 function **/
    /**
     * 메뉴 트리용 기초 정보를 Tree 메뉴로 변환
     */
    convertTree(_treeBases) {
      if (!_treeBases || _treeBases.length <= 0) return null;
      var tree = arrayToTree(_treeBases, {
        parentProperty: 'upMenuId',
        customID: 'menuId',
      });

      return tree;
    },
    /**
     * 수정 팝업 호출
     */
    cellClickHandler(event) {
      if (event.item === null || event.item === undefined) return;

      if (event.dataField === 'menuId') {
        this.popupOptions.target = () => import(`${'./menuDetail.vue'}`);
        this.popupOptions.title =
          this.$comm.getLangSpecInfoLabel('L0000004512'); // 메뉴관리 상세 등록/ 수정
        this.popupOptions.visible = true;
        this.popupOptions.param = {
          menu: event.item,
        };
        this.popupOptions.closeCallback = this.closePopupUsage;
      }
    },
    /**
     * 등록 팝업  호출
     */
    btnPopupClickedCallback() {
      this.popupOptions.target = () => import(`${'./menuDetail.vue'}`);
      this.popupOptions.title = this.$comm.getLangSpecInfoLabel('L0000004512'); // 메뉴관리 상세 등록/ 수정
      this.popupOptions.visible = true;
      this.popupOptions.param = {
        menu: null,
      };
      this.popupOptions.closeCallback = this.closePopupUsage;
    },
    closePopupUsage(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.getMenuTreeDatatableBases();
    },
    /** /기타 function **/
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
