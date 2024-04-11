<!--
  목적 : (반드시 기입하세요) 컴포넌트
  작성자 : (이니셜로 반드시 입력하세요)
  Detail :
  *
  examples:
  *
  -->
<template>
  <div id>
    <b-container fluid>
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
      <!-- 검색 -->

      <!-- 검색 결과 테이블 -->
      <!-- <b-row class="mt-3">
        <b-col sm="12">
          <b-col sm="12" class="px-0">
            <div class="float-right mb-1"> -->
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
              @rowClicked="rowClicked"
              @tableLinkClicked="tableLinkClicked"
            ></y-tree-data-table>
          </b-col>
        </b-col>
      </b-row> -->
      <!-- 검색 결과 테이블 -->
      <b-row>
        <b-col sm="12" class="mt-3">
          <b-col sm="12" class="px-0">
            <b-row class="grid-height grid-box">
              <b-col sm="12" class="h100p">
                <!-- 부서목록 -->
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
                  @btnPopupClicked="getDeptTreeDatatableBases"
                />
              </b-col>
            </b-row>
          </b-col>
        </b-col>
      </b-row>
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
  name: 'dept-manage', // 반드시 입력하세요(안 하면 warning 발생). 네이밍 룰은 현재 vue component의 파일명의 단어를 "-"로 구분(예:exam-data)하여 입력하시면 됩니다. 입력후 이 주석은 지워주세요.
  components: {
    'y-tree': YTree,
    YTreeDataTable,
  },
  props: {},
  data() {
    return {
      gridOptions: {
        header: [],
        data: [],
        height: 'auto',
      },
      gridProcessOptions: {
        header: [],
        data: [],
        height: '300',
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
        keyValue: '',
        processList: '',
        processCdList: '',
        selectProcess: [],
        createUserId: '',
        updateUserId: '',
      },
      selectProcess: [],
      editable: false,
      updateMode: false,
      component: null,
      searchUrl: '',
      detailUrl: '',
      insertProcessUrl: '',
      deleteProcessUrl: '',
      isInsert: false,
      isEdit: false,
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
      /* 쿠키에 저장된 검색 조건이 있을 경우 최초 페이지 진입시 자동 설정 */
      var searchParamByCookie = this.$comm.setSearchParamByCookie();
      if (typeof searchParamByCookie !== 'undefined') {
        this.searchParam = searchParamByCookie;
      }

      this.editable = this.$route.meta.editable;

      this.searchUrl = selectConfig.manage.dept.treelist.url;
      this.detailUrl = selectConfig.manage.dept.get.url;

      this.getDeptTreeDatatableBases();
      this.gridOptions.header = [
        {
          headerText: '',
          dataField: 'deptNm',
          width: '200px',
          style: 'center',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001332'),
          dataField: 'deptCd',
          width: '140px',
          style: 'center',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {},
          },
        }, // 부서코드
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001307'),
          dataField: 'deptLvlNm',
          width: '140px',
          style: 'center',
        }, // 부서레벨
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001439'),
          dataField: 'useYnNm',
          width: '120px',
          style: 'center',
        }, // 사용여부
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001312'),
          dataField: 'processList',
        }, // 부서별 공정
      ];
      this.gridProcessOptions.header = [
        {
          text: 'L0000000515',
          name: 'processNm',
          width: '200px',
          align: 'center',
        }, // 공정
      ];
    },
    mountedInit() {
      this.gridOptions.btn = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000327'),
          color: 'green',
          btnClicked: 'btnPopupClicked',
        }, // 검색
      ];
      this.YAuiGrid.setBtnArr(this.gridOptions.btn);
    },
    resizeGrid() {
      let _height = window.innerHeight - 315;  
      if (window.innerHeight < 500) {
        _height = 250;
      }
      
      this.YAuiGrid.resize(null, _height);
    },
    getDeptTreeDatatableBases() {
      this.$http.url = this.searchUrl;
      this.$http.param = this.searchParam;
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          console.log('_result.data: ', _result.data);
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
    openPopup() {
      this.popupOptions.param = {
        selectProcess: [], // this.dept.selectProcess,
        plantCd: this.dept.plantCd,
      };
      this.popupOptions.target = () => import(`${'./processDialog.vue'}`);
      this.popupOptions.title = 'L0000000537'; // 공정선택
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closePopup;
    },
    closePopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;

      if (data === 'CLOSE') return;

      let saveProcessCd = [];
      this.$_.forEach(data.process, (item) => {
        if (
          this.$_.findIndex(this.gridProcessOptions.data, {
            processCd: item.processCd,
          }) === -1
        ) {
          saveProcessCd.push({
            processCd: item.processCd,
            processNm: item.processNm,
            deptCd: this.dept.deptCd,
            createUserId: this.$store.getters.token,
          });
        }
      });
      if (saveProcessCd.length > 0) {
        this.$http.url = this.insertProcessUrl;
        this.$http.param = saveProcessCd;
        this.$http.type = 'POST';
        this.$http.request(
          (_result) => {
            window.getApp.$emit('ALERT', {
              title: 'L0000003395',
              message: 'M0000000763', // 등록되었습니다.
              type: 'success',
            });
            this.getDeptTreeDatatableBases();
            this.$_.forEach(saveProcessCd, (item) => {
              this.gridProcessOptions.data.splice(0, 0, {
                processCd: item.processCd,
                processNm: item.processNm,
              });
            });
          },
          (_error) => {
            window.getApp.$emit('APP_REQUEST_ERROR', _error);
          }
        );
      }
    },
    rowClicked(data) {
      this.$http.url = this.$format(this.detailUrl, data.deptCd);
      this.$http.type = 'get';
      this.$http.request(
        (_result) => {
          this.updateMode = true;
          this.dept = _result.data;
          this.gridProcessOptions.data = this.dept.selectProcess;
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    btnClickedErrorCallback(_result) {
      this.isInsert = false;
      this.isEdit = false;
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },

    /**
     * 수정 팝업 호출
     */
    // tableLinkClicked(header, data) {
    //   if (data === null || data === undefined) return;
    //   this.popupOptions.top = '10px';
    //   this.popupOptions.width = '80%';
    //   this.popupOptions.target = () => import(`${'./deptProcessDetail.vue'}`);
    //   this.popupOptions.title = 'L0000001314';
    //   // 부서별 공정 상세 등록/수정
    //   this.popupOptions.visible = true;
    //   this.popupOptions.param = data;
    //   this.popupOptions.closeCallback = this.closePopupUsage;
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
        this.popupOptions.target = () => import(`${'./deptProcessDetail.vue'}`);
        this.popupOptions.title = 'L0000001314';
        // 부서별 공정 상세 등록/수정
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
      this.popupOptions.target = () => import(`${'./deptProcessDetail.vue'}`);
      this.popupOptions.title = 'L0000001314';
      // 부서별 공정 상세 등록/수정
      this.popupOptions.visible = true;
      this.popupOptions.param = {
        ewtrDischNo: 0,
      };
      this.popupOptions.closeCallback = this.closePopupUsage;
    },

    closePopupUsage(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.getDeptTreeDatatableBases();
    },
    /** /기타 function **/
  },
};
</script>
