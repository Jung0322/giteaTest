<!--
  목적 : 사용자 권한별 메뉴 컴포넌트
  작성자 : kdh
  Detail :
  *
  examples:
  *
  -->
<template>
  <b-container fluid v-loading="loading">
    <y-search-box :gridOptions="authGrpGridOptions" @enter="search">
      <b-row slot="search">
        <b-col sm="4">
          <y-plant
            type="search"
            filter="chm"
            name="plantCd"
            v-model="searchParam.plantCd"
          />
        </b-col>
        <b-col sm="8">
          <!-- 검색어 -->
          <y-text
            :width="10"
            ui="bootstrap"
            label="L0000000331"
            placeholder="부서명, 권한그룹명"
            name="keyword"
            v-model="searchParam.keyword"
          />
        </b-col>
      </b-row>
    </y-search-box>
    <b-row class="mt-3">
      <!-- 권한 그룹 영역 -->
      <!--  <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
        <div class="float-right mb-1">
          검색  
          <y-btn title="L0000000327" color="green" @btnClicked="search" />
        </div>
        <y-tree-data-table
          :headers="authGrpGridOptions.header"
          :items="authGrpGridOptions.data"
          :height="authGrpGridOptions.height"
          :defaultExpandAll="true"
          expand-column-name="deptNm"
          expand-column-width="300"
          data-key="deptCd"
          parent-key="pdeptCd"
        >
          <el-table-column slot="tag" label="권한그룹" min-width="500px">
            <template slot-scope="scope">
             권한추가  
              <y-tag-structure
                :width="12"
                itemText="authGrpNm"
                itemValue="authGrpNo"
                label
                newLabelText="권한 추가"
                :controleClose="true"
                :name="'authGrps_' + scope.$index"
                v-model="scope.row.authGrps"
                @customNewTag="customNewTag(scope.row)"
                @closeTag="
                  (val) => {
                    closeTag(val, scope.row);
                  }
                "
              />
            </template>
          </el-table-column>
        </y-tree-data-table>
      </b-col> -->
      <b-col sm="12" class="h100p">
        <y-auigrid
          ref="yAuiGrid"
          :editable="true"
          :name="authGrpGridOptions.name"
          :headers="authGrpGridOptions.header"
          :btns="authGrpGridOptions.btns"
          :height="authGrpGridOptions.height"
          :defaultExpandAll="true"
          :useExcelExport="false"
          :enableSorting="true"
          :showGridSetSave="true"
          :showGridCtrl="true"
          @treeOpenChange="treeOpenChangeHandler"
          @cellEditEnd="cellEditEndHandler"
          @search="search"
        />
      </b-col>
    </b-row>
    <y-dialog :param="popupOptions"></y-dialog>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
import arrayToTree from 'array-to-tree';
import YTreeDataTable from '@/components/YTreeDataTable';
import YTree from '@/components/YTree';
export default {
  /** attributes: name, components, props, data **/
  name: 'auth-dept', // 반드시 입력하세요(안 하면 warning 발생). 네이밍 룰은 현재 vue component의 파일명의 단어를 "-"로 구분(예:exam-data)하여 입력하시면 됩니다. 입력후 이 주석은 지워주세요.
  components: {
    'y-tree': YTree,
    YTreeDataTable,
  },
  props: {
    paneName: {
      type: String,
      default: '',
    },
  },
  // TODO: 화살표 함수(=>)는 data에 사용하지 말 것
  //    data: () => { return { a: this.myProp }}) 화살표 함수가 부모 컨텍스트를 바인딩하기 때문에 this는 예상과 달리 Vue 인스턴스가 아니기 때문에 this.myProp는 undefined로 나옵니다.
  //    참고url: https://kr.vuejs.org/v2/api/index.html#data
  data() {
    return {
      authDept: {
        plantCd: '',
        plantNm: '',
        pdeptCd: '',
        deptCd: '',
        deptNm: '',
        // useYn: 'Y',
      },
      searchParam: {
        keyword: '',
        plantCd: '',
      },
      authGrpNo: '',
      updateMode: false,
      authGrpGridOptions: {
        header: [],
        data: [],
        btns: [],
        height: 'auto',
      },
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '35%',
        top: '10px',
        param: {},
        closeCallback: null,
      },
      deptCd: '',
      // authGrps: [],
      searchUserUrl: '',
      insertUrl: '',
      deleteUrl: '',
      loading: false,

      index: 0,

      YAuiGrid: null,
      authGrpNmKoForGrid: '',
      authGrpNoForGrid: '',
    };
  },
  watch: {
    // 해당 tab 들어올 때마다 그리드 사이즈 조정
    paneName() {
      this.loading = true;
      this.getList();
    },
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
    this.resizeGrid();
    this.getList();
  },
  beforeDestory() {},
  /** methods **/
  methods: {
    /** 초기화 관련 함수 **/
    init() {
      /* 쿠키에 저장된 검색 조건이 있을 경우 최초 페이지 진입시 자동 설정 */
      var searchParamByCookie = this.$comm.setSearchParamByCookie();
      if (typeof searchParamByCookie !== 'undefined') {
        this.searchParam = searchParamByCookie;
      }

      // 권한 부여
      this.searchUserUrl = selectConfig.authGrpDept.list.url;
      this.insertUrl = transactionConfig.authGrpDept.insert.url;
      this.deleteUrl = transactionConfig.authGrpDept.delete.url;

      this.loading = true;
      this.setGridHeader();

      this.authGrpGridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000327'),
          color: 'green',
          btnClicked: 'search',
        },
      ];
    },

    setGridHeader() {
      let myThis = this;
      this.authGrpGridOptions.header = [
        {
          headerText: '',
          dataField: 'deptNm',
          width: '20%',
          style: 'center-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004366'), // 사업장명
          dataField: 'plantNm',
          width: '20%',
          style: 'center-align',
        },
        {
          headerText: '권한그룹', // 사업장명
          dataField: 'authGrpNmKoForGrid',
          width: '20%',
          style: 'center-align',
        },
        {
          headerText: '권한 추가',
          dataField: '',
          width: '20%',
          editable: false,
          renderer: {
            type: 'ButtonRenderer',
            labelText: '권한 추가',
            onClick: function (rowIndex, columnIndex, value, item) {
              myThis.customNewTag(rowIndex);
            },
          },
        },
        {
          headerText: '권한 초기화',
          dataField: '',
          width: '20%',
          editable: false,
          renderer: {
            type: 'ButtonRenderer',
            labelText: '권한 초기화',
            onClick: function (rowIndex, columnIndex, value, item) {
              myThis.closeTag(rowIndex);
            },
          },
        },
      ];
    },

    /** Call API service */
    // 기본 권한 그룹 조회
    getList() {
      if (this.checkSearchParam()) {
        this.$http.url = this.searchUserUrl;
        this.$http.param = this.searchParam;
        this.$http.type = 'GET';
        this.$http.request(
          (_result) => {
            this.authGrpGridOptions.data = _result.data;
            // this.authGrpGridOptions.data = this.convertTree(_result.data); // x
            this.$comm.pushCookie(this.searchParam);
            this.loading = false;

            this.$_.forEach(this.authGrpGridOptions.data, (item) => {
              this.authGrpNmKoForGrid = '';
              this.authGrpNoForGrid = '';
              this.$_.forEach(item.authGrps, (item) => {
                this.authGrpNmKoForGrid += item.authGrpNm + ',';
                this.authGrpNoForGrid += item.authGrpNo + ',';
              });
              item.authGrpNmKoForGrid = this.authGrpNmKoForGrid;
              item.authGrpNoForGrid = this.authGrpNoForGrid;
            });
            // this.YAuiGrid.setGridData(
            //   this.convertTree(this.authGrpGridOptions.data)
            // );
            this.YAuiGrid.setGridData(this.convertTree(_result.data));
            this.$comm.pushCookie(this.searchParam);
            this.loading = false;

            // 권한그룹 목록
            let tmpAuthGrp = _result.data;
            if (tmpAuthGrp.length > 0) {
              this.setAuthGrps(tmpAuthGrp);
            }
          },
          (_error) => {
            window.getApp.$emit('APP_REQUEST_ERROR', _error);
          }
        );
      } else {
        this.loading = false;
      }
    },
    treeOpenChangeHandler(event) {
      console.log('event: ', event);
    },
    convertTree(_treeBases) {
      if (!_treeBases || _treeBases.length <= 0) return null;
      var tree = arrayToTree(_treeBases, {
        parentProperty: 'pdeptCd',
        customID: 'deptCd',
      });

      return tree;
    },
    checkSearchParam() {
      if (!this.searchParam.keyword && !this.searchParam.plantCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // 안내
          message: 'M0000000526', // 하나 이상 검색조건을 입력하세요
          type: 'warning',
        });
        return false;
      } else {
        return true;
      }
    },
    search() {
      this.loading = true;
      this.getList();
    },

    customNewTag(item) {
      this.index = item.rowIndex;
      this.deptCd = this.$_.clone(item.item.deptCd);
      this.authGrps = item.authGrps;
      this.popupOptions.target = () => import(`${'./authMultiSelect.vue'}`);
      this.popupOptions.title = 'L0000004537'; // 권한
      this.popupOptions.visible = true;
      this.popupOptions.param = {
        checkStrictly: true,
      };
      this.popupOptions.closeCallback = this.closeDeptPopup;
    },
    closeDeptPopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      if (data !== 'CLOSE') {
        let param = {
          deptCd: this.deptCd,
          authGrps: [],
        };

        let authGrps = this.authGrpGridOptions.data;
        let authSize = authGrps.length;
        if (!authGrps) {
          authGrps = [];
        }
        this.$_.forEach(authGrps, (item) => {
          data = this.$_.reject(data, { authGrpNo: item.authGrpNo });
        });
        this.$_.forEach(data, (item) => {
          item.createUserId = this.$store.getters.token;
          // item.authGrpNo = data.authGrpNo;
          this.authGrpGridOptions.data[this.index].authGrps.push(item);
        });
        param.authGrps = data;

        this.$http.url = this.insertUrl;
        this.$http.param = param;
        this.$http.type = 'POST';
        this.$http.request(
          (_result) => {
            window.getApp.$emit('ALERT', {
              title: 'L0000003395', // 안내
              message: 'M0000000006', // 저장되었습니다.
              type: 'success',
            });
            this.$_.forEach(data, (item) => {
              // this.authGrps.push(item);
              this.authGrpGridOptions.data[this.index].authGrps.push(item);
            });
          },
          (_error) => {
            window.getApp.$emit('APP_REQUEST_ERROR', _error);
          }
        );
      }
      this.getList();
    },

    closeTag(item) {
      let authGrpList = [];
      let indexRow = item.rowIndex;
      // authGrpList = this.authGrpGridOptions.data[indexRow].authGrps;
      authGrpList = item.item.authGrps;
      this.deptCd = item.item.deptCd;
      // this.deptCd = this.authGrpGridOptions.data[indexRow].deptCd;
      if (authGrpList.length > 0) {
        window.getApp.$emit('CONFIRM', {
          title: 'L0000003321', // 확인
          message: 'M0000000012', // 삭제하시겠습니까?
          // TODO : 필요시 추가하세요.
          type: 'info', // success / info / warning / error
          // 확인 callback 함수
          confirmCallback: () => {
            this.$_.forEach(authGrpList, (item) => {
              this.removalData(item);
            });
          },
        });
      } else;
      return;
    },
    removalData(item) {
      this.$http.param = {
        data: {
          deptCd: this.deptCd,
          authGrpNo: item.authGrpNo,
        },
      };
      this.$http.url = this.deleteUrl;
      this.$http.type = 'DELETE';
      this.$http.request(
        (_result) => {
          item = this.$_.reject(item, {
            authGrpNo: String(item.authGrpNo),
          });
          this.getList();
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    cellEditEndHandler() {
      this.authGrpGridOptions.data = this.YAuiGrid.getGridData();
    },
    resizeGrid() {
      const _height = window.innerHeight < 500 ? 250 : window.innerHeight - 335;
      this.YAuiGrid.resize(null, _height);
    },
    setAuthGrps(tmpAuthGrp) {
      if (tmpAuthGrp) {
        this.$_.forEach(tmpAuthGrp, (item) => {
          this.$_.filter(item.authGrps, (item) => item.authGrpNm);
        });
      }
    },
  },
};
</script>
