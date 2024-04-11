<!--
  목적 : 사용자검색
  작성자 : khk
  Detail : 
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <y-search-box :gridOptions="gridOptions" @enter="btnSearchClicked">
      <b-row slot="search">
        <b-col sm="12">
          <b-row>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-plant
                type="search"
                name="plantCd"
                :disabled="popupParam.plantDisabled"
                v-model="searchParam.plantCd"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-tree-dept
                type="search"
                name="deptCd"
                deptSubYn="Y"
                :disabled="deptDisabled"
                :plantCd="searchParam.plantCd"
                v-model="searchParam.deptCd"
                @setDeptSubYn="setDeptSubYn"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 사번 -->
              <y-text
                :width="8"
                :clearable="true"
                ui="bootstrap"
                name="userId"
                label="L0000001412"
                v-model="searchParam.userId"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 성명 -->
              <y-text
                :width="8"
                :clearable="true"
                ui="bootstrap"
                name="userNm"
                label="L0000001630"
                v-model="searchParam.userNm"
              />
            </b-col>
          </b-row>
        </b-col>
      </b-row>
    </y-search-box>

    <b-row>
      <b-col sm="12" class="h100p">
        <!-- 사용자 목록 -->
        <y-auigrid
          ref="yAuiGrid"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000001462')"
          :useExcelExport="false"
          :useContextMenu="true"
          :enableRightDownFocus="true"
          :showGridCtrl="true"
          :showRowCheckColumn="popupParam.multiple"
          @cellClick="cellClickHandler"
          @cellDoubleClick="cellDoubleClickHandler"
          @btnSelectUser="selectUser"
          @btnSearch="btnSearchClicked"
          @closePopup="closePopup"
        />
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
export default {
  /** attributes: name, components, props, data **/
  name: 'user-search', // 반드시 입력하세요(안 하면 warning 발생). 네이밍 룰은 현재 vue component의 파일명의 단어를 "-"로 구분(예:exam-data)하여 입력하시면 됩니다. 입력후 이 주석은 지워주세요.
  props: {
    popupParam: {
      type: Object,
      default: {
        multiple: false,
        disabled: false,
        plantDisabled: false,
        deptDisabled: false,
        plantCd: '',
        deptCd: '',
        userId: '',
        userNm: '',
        user: [],
        deptSubYn: '', // 하위부서 포함 여부
      },
    },
  },
  // TODO: 화살표 함수(=>)는 data에 사용하지 말 것
  //    data: () => { return { a: this.myProp }}) 화살표 함수가 부모 컨텍스트를 바인딩하기 때문에 this는 예상과 달리 Vue 인스턴스가 아니기 때문에 this.myProp는 undefined로 나옵니다.
  //    참고url: https://kr.vuejs.org/v2/api/index.html#data
  data() {
    return {
      // Naming Rule : JAVA model class와 연동되는 vue model은 model class명을 Camel case로 변환해서 선언하시고 기본값은 {}로 초기화 시켜주세요.
      // 예) ExamData -> examData: {},
      searchParam: {
        plantCd: '',
        deptCd: '',
        userId: '',
        userNm: '',
        useYn: 'Y',
        deptSubYn: 'Y', // 하위부서 포함 여부 Y(하위부서 포함), N(하위부서 미포함) 2021년 04월 08일 jkl
      },
      selectedUser: null,
      YAuiGrid: null,
      gridOptions: {
        height: '350',
        header: [],
        btns: [],
      },
      checkItemData: [],
      multiple: false,
      disabled: false,
      searchUrl: '',
    };
  },
  computed: {
    deptDisabled() {
      // 2021년 04월 09일 jkl
      // 부서가 '전체', 하위부서 포함 여부(deptSubYn)가 'N' 일경우 검색되어지는 유저가 없어서
      // 하위부서 포함 여부(deptSubYn)가 'N'인 경우는 부서 선택을 못하도록 막음
      return this.popupParam.deptDisabled || this.popupParam.deptSubYn === 'N';
    },
  },
  watch: {},
  /** Vue lifecycle: created, mounted, destroyed, etc **/
  beforeCreate() {},
  created() {},
  beforeMount() {
    // TODO : data를 초기화 시켜줌(검색 조건 유지가 필요할 때는 삭제할 것)
    // 이유 : vue.js는 SPA기반으로 동작하기 때문에 페이지를 이동하더라도 기존 입력된 정보가 그대로 남아 있는 문제가 있음
    Object.assign(this.$data, this.$options.data());
    this.setGridHeader();
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;
    this.init();
  },
  beforeDestory() {},
  /** methods **/
  methods: {
    /** 초기화 관련 함수 **/
    init() {
      this.searchUrl = selectConfig.manage.user.list.url;

      // TODO : 여기에 초기 설정용 함수를 호출하거나 로직을 입력하세요.
      // 초기값 설정
      if (this.popupParam.plantCd) {
        this.searchParam.plantCd = this.popupParam.plantCd;
      }
      if (this.popupParam.deptCd) {
        this.searchParam.deptCd = this.popupParam.deptCd;
      } else if (
        this.popupParam.plantCd &&
        this.popupParam.plantCd !== this.$store.getters.plantCd
      ) {
        // 부서정보가 오지 않았으며 로그인자의 사업장과 넘어온 사업장의 정보가 다를 시에 부서정보를 빈값처리
        this.searchParam.deptCd = '';
      }

      if (this.popupParam.deptSubYn) {
        this.searchParam.deptSubYn = this.popupParam.deptSubYn;
      }

      this.searchParam.userId = this.popupParam.userId;
      this.searchParam.userNm = this.popupParam.userNm;
      this.disabled = this.popupParam.disabled;
      this.getList();
    },
    setGridHeader() {
      // 그리드 헤더 설정
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001415'),
          dataField: 'plantNm',
          width: '20%',
        }, // 사업장
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001287'),
          dataField: 'deptNm',
          width: '20%',
        }, // 부서
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002772'),
          dataField: 'positionNm',
          width: '20%',
        }, // 직책
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001412'),
          dataField: 'userId',
          width: '20%',
        }, // 사번
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001630'),
          dataField: 'userNm',
          width: '20%',
        }, // 성명
      ];
      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001561'),
          color: 'orange',
          btnClicked: 'btnSelectUser',
        }, //  선택
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000327'),
          color: 'green',
          btnClicked: 'btnSearch',
        }, //  검색
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000881'),
          btnClicked: 'closePopup',
        }, //  닫기
      ];
    },
    /** /초기화 관련 함수 **/

    /** Call API service */
    getList() {
      this.$http.url = this.searchUrl;
      this.$http.param = this.searchParam;
      this.$http.type = 'get';
      this.$http.request(
        (_result) => {
          this.YAuiGrid.setGridData(_result.data);
          this.checkItemData = this.popupParam.user;
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    cellClickHandler(event) {
      if (this.popupParam.multiple) return;
      this.selectedUser = event.item;
    },
    cellDoubleClickHandler(event) {
      if (this.popupParam.multiple) return;
      this.$emit('closePopup', { success: true, user: event.item });
    },
    selectUser() {
      if (this.popupParam.multiple) {
        if (this.YAuiGrid.getCheckedRowItemsAll().length === 0) {
          window.getApp.$emit('ALERT', {
            title: 'L0000003395', // 안내
            message: 'M0000000447', // 사용자를 먼저 지정하세요.
            type: 'warning', // success / info / warning / error
          });
          return;
        }
        this.$emit('closePopup', {
          success: true,
          users: this.YAuiGrid.getCheckedRowItemsAll(),
        });
      } else {
        this.selectUser2();
      }
    },
    selectUser2() {
      if (!this.selectedUser) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // 안내
          message: 'M0000000447', // 사용자를 먼저 지정하세요.
          type: 'warning', // success / info / warning / error
        });
      } else {
        this.$emit('closePopup', { success: true, user: this.selectedUser });
      }
    },
    closePopup() {
      // 부모창에 값 전달
      this.$emit('closePopup', { success: true });
    },
    setDeptSubYn(_result) {
      this.searchParam.deptSubYn = _result;
    },

    /** /Call API service **/

    /** Button Event **/
    btnSearchClicked() {
      this.getList();
    },
    /** /Button Event **/
  },
};
</script>
