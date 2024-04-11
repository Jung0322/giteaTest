<!--
  목적 : 시스템관리-다국어관리-라벨관리
  작성자 : dylee
  수정자 : jkl
  Detail : 라벨관리
  -->
<template>
  <b-container fluid>
    <br />
    <y-search-box v-show="false" :gridOptions="gridMstOptions"></y-search-box>
    <b-row>
      <b-col sm="3">
        <b-col sm="12" class="px-0">
          <!-- 다국어타입 목록 
          <y-data-table
            ref="dataTable"
            label="L0000005023"
            :useRownum="false"
            :height="gridMstOptions.height"
            :headers="gridMstOptions.header"
            :items="gridMstOptions.data"
            :use-paging="false"
            @selectedRow="selectedRow"
          /> -->
          <y-auigrid
            ref="yAuiGrid"
            :name="gridMstOptions.name"
            :headers="gridMstOptions.header"
            :btns="gridMstOptions.btns"
            :height="gridMstOptions.height"
            :label="this.$comm.getLangSpecInfoLabel('L0000005023')"
            :useExcelExport="false"
            :showGridSetSave="true"
            :useContextMenu="true"
            :enableRightDownFocus="true"
            :showGridCtrl="true"
            :enableSorting="true"
            @cellClick="selectedRow"
          />
        </b-col>
      </b-col>
      <b-col sm="9">
        <el-tabs type="border-card" v-model="tabIndex">
          <el-tab-pane
            v-for="(item, i) in tabItems"
            :key="i"
            stretch
            class="default-tab-pane"
          >
            <span slot="label">
              <i class="el-icon-date"></i>
              {{ item.title }}
            </span>
          </el-tab-pane>
          <keep-alive>
            <component
              v-if="component"
              :is="component"
              sm="12"
              :tabParam.sync="tabParam"
              @getList="getList"
            />
          </keep-alive>
        </el-tabs>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
export default {
  name: 'lang-label',
  props: {},
  data() {
    return {
      gridMstOptions: {
        name: 'label',
        header: [],
        data: [],
        height: 'auto',
      },
      tabItems: [
        // {
        //   title: this.$comm.getLangSpecInfoLabel('L0000005024'),
        //   url: './labelMst',
        // }, // 다국어타입 관리
        // {
        //   title: this.$comm.getLangSpecInfoLabel('L0000005025'),
        //   url: './labelDtl',
        // }, // 다국어 관리
      ],
      tabParam: {
        mstCd: '',
      },
      component: null,
      tabIndex: 0,
      editable: false,
      YAuiGrid: null,
    };
  },
  watch: {
    tabIndex() {
      this.loadComponent();
    },
  },
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
      // 그리드 헤더 설정
      this.gridMstOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000005027'),
          dataField: 'mstCd',
          width: '40%',
          style: 'center-align',
        }, // 다국어 타입코드
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000005026'),
          dataField: 'mstNm',
          width: '60%',
        }, // 다국어 타입명
      ];
      this.tabItems = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000005024'),
          url: './labelMst',
        }, // 다국어타입 관리
        {
          title: this.$comm.getLangSpecInfoLabel('L0000005025'),
          url: './labelDtl',
        }, // 다국어 관리
      ];
      this.loadComponent();
      this.getList();
    },
    // 탭
    loadComponent() {
      var path = this.tabItems[this.tabIndex].url;

      this.component = () => import(`${path}`);
    },
    // 메시지타입 목록 조회
    getList() {
      this.$http.url = selectConfig.manage.lang.lblMst.list.url;
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          _result.data.unshift({
            createDt: null,
            createUserId: null,
            delYn: null,
            isEdit: false,
            mstCd: 'all',
            mstNm: this.$comm.getLangSpecInfoLabel('L0000004591'),
            updateDt: null,
            updateUserId: null,
          }); // 전체 메세지 조회
          this.YAuiGrid.setGridData(this.$_.clone(_result.data));
          // this.gridMstOptions.data = this.$_.clone(_result.data);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    /**
     * 메시지타입 목록 행 클릭 시 실행
     */
    selectedRow(row) {
      // 메시지타입을 선택 후 상세에서 신규를 누른뒤 선택했던 메시지타입을 다시 선택했을 경우
      // msgMst.vue파일의 watch에서 tabParam.mstCd가 변경되지 않았다고 인식하여
      // getDetail()을 다시 호출안하는 이유로
      // selectedRow에서 tabParam.mstCd를 초기화해주고 row.mstCd를 넣어줌.
      this.tabParam.mstCd = '';
      this.tabParam.mstCd = row.item.mstCd;
    },
    resizeGrid() {
      let _height = window.innerHeight - 258;
      if (window.innerHeight < 500) {
        _height = 250;
      }

      this.YAuiGrid.resize(null, _height);
    },
  },
};
</script>
