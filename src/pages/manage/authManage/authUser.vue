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
        <b-col sm="4">
          <y-tree-dept
            type="search"
            name="deptCd"
            filter="chm"
            :plantCd="searchParam.plantCd"
            v-model="searchParam.deptCd"
          />
        </b-col>
        <b-col sm="8">
          <!-- 검색어 -->
          <y-text
            :width="10"
            ui="bootstrap"
            label="L0000000331"
            placeholder="권한그룹명, 사용자명"
            name="keyword"
            v-model="searchParam.keyword"
          />
        </b-col>
      </b-row>
    </y-search-box>

    <b-row class="mt-3">
      <!-- 권한 그룹 영역 -->
      <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
        <!-- <div class="float-right mb-1">
            검색  
          <y-btn title="L0000000327" color="green" @btnClicked="search" />
        </div> -->
        <!-- 사용자 목록 -->
        <!-- <y-data-table
          :headers="authGrpGridOptions.header"
          :items="authGrpGridOptions.data"
          :height="authGrpGridOptions.height"
          :useRownum="false"
          :use-paging="true"
          label="L0000001462"
        >
          <el-table-column slot="tag" label="권한그룹" min-width="500px">
            <template slot-scope="scope">
              <y-tag-structure
                :width="12"
                itemText="authGrpNm"
                itemValue="authGrpNo"
                label
                newLabelText="권한 추가"
                :controleClose="true"
                :name="'authGrps_' + scope.$index"
                v-model="scope.row.authGrps"
                @customNewTag="customNewTag(scope.row, scope.$index)"
                @closeTag="
                  (val) => {
                    closeTag(val, scope.row);
                  }
                "
              />
            </template>
          </el-table-column>
        </y-data-table> -->
        <b-col sm="12" class="h100p">
          <y-auigrid
            ref="yAuiGrid"
            :editable="true"
            :name="authGrpGridOptions.name"
            :headers="authGrpGridOptions.header"
            :btns="authGrpGridOptions.btns"
            :height="authGrpGridOptions.height"
            :label="this.$comm.getLangSpecInfoLabel('L0000001462')"
            :items="authGrpGridOptions.data"
            :useExcelExport="false"
            :enableSorting="true"
            :showGridSetSave="true"
            :showGridCtrl="true"
            @cellEditEnd="cellEditEndHandler"
            @search="search"
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
  /** attributes: name, components, props, data **/
  name: 'auth-user', // 반드시 입력하세요(안 하면 warning 발생). 네이밍 룰은 현재 vue component의 파일명의 단어를 "-"로 구분(예:exam-data)하여 입력하시면 됩니다. 입력후 이 주석은 지워주세요.
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
      searchParam: {
        keyword: '',
        plantCd: '',
        deptCd: '',
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
      index: 0,
      userId: '',
      // authGrps: [],
      searchUserUrl: '',
      insertUrl: '',
      deleteUrl: '',
      loading: false,

      YAuiGrid: null,
      authGrpNmKoForGrid: '',
      authGrpNoForGrid: '',
    };
  },
  watch: {
    // 해당 tab 들어올 때마다 그리드 사이즈 조정
    paneName() {
      this.loading = true;
      this.getUserList();
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
    this.getUserList();
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
      this.searchUserUrl = selectConfig.authGrpUser.list.url;
      this.insertUrl = transactionConfig.authGrpUser.insert.url;
      this.deleteUrl = transactionConfig.authGrpUser.delete.url;

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
          headerText: this.$comm.getLangSpecInfoLabel('L0000004366'), // 사업장명
          dataField: 'plantNm',
          width: '16%',
          style: 'center-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004367'), // 부서명
          dataField: 'deptNm',
          width: '16%',
          style: 'center-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001472'), // 사용자명
          dataField: 'userNm',
          width: '16%',
          style: 'center-align',
          // textCalculate: this.getTextComment,
        },
        {
          headerText: '권한그룹',
          dataField: 'authGrpNmKoForGrid',
          editable: false,
          width: '18%',
        },
        {
          headerText: '권한 추가',
          dataField: '',
          width: '18%',
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
          width: '16%',
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
    /** /초기화 관련 함수 **/
    getTextComment(_row, _name) {
      var text = _row[_name];
      if (_name === 'authGrpNm') {
        if (_row['authGrpNo'] === 1015) {
          text =
            text +
            ' <span class="el-tag el-tag--danger el-tag--mini el-tag--light"><i class="el-icon-warning"></i>' +
            '플랜트 접근권한은 사업장/부서 접근을 설정하는 권한입니다.' +
            '특정 부서를 사업장 접근 처리하게 되면 부서 접근 또한 같이 적용됩니다.' +
            '반대로 특정 부서를 부서 접근에서 제외하게 되면 사업장 접근 또한 같이 제외됩니다.' +
            '</span>';
        }
      }
      return text;
    },

    /** Call API service */
    // 기본 권한 그룹 조회
    getUserList() {
      if (this.checkSearchParam()) {
        this.$http.url = this.searchUserUrl;
        this.$http.param = this.searchParam;
        this.$http.type = 'GET';
        this.$http.request(
          (_result) => {
            this.authGrpGridOptions.data = this.$_.clone(_result.data);

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
            this.YAuiGrid.setGridData(this.authGrpGridOptions.data);

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
    checkSearchParam() {
      if (
        !this.searchParam.keyword &&
        !this.searchParam.plantCd &&
        !this.searchParam.deptCd
      ) {
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
      this.getUserList();
    },
    customNewTag(item) {
      this.index = item.rowIndex;
      this.userId = this.$_.clone(item.item.userId);
      this.authGrps = this.$_.clone(item.item.authGrps);
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
          userId: this.userId,
          authGrps: [],
        };

        let authGrps = this.authGrpGridOptions.data[this.index].authGrps;
        if (!authGrps) {
          authGrps = [];
        }
        this.$_.forEach(authGrps, (item) => {
          data = this.$_.reject(data, { authGrpNo: item.authGrpNo });
        });
        this.$_.forEach(data, (item) => {
          item.createUserId = this.$store.getters.token;
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
              message: 'M0000000006', // 저장되었습니다
              type: 'success',
            });
            this.$_.forEach(data, (item) => {
              this.authGrpGridOptions.data[this.index].authGrps.push(item);
            });
          },
          (_error) => {
            window.getApp.$emit('APP_REQUEST_ERROR', _error);
          }
        );
      }
      this.getUserList();
    },
    closeTag(item) {
      let authGrpList = [];
      let indexRow = item.rowIndex;
      authGrpList = this.authGrpGridOptions.data[indexRow].authGrps;
      this.userId = this.authGrpGridOptions.data[indexRow].userId;
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
          userId: this.userId,
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
          this.getUserList();
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
