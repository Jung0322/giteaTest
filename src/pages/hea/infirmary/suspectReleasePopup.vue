<!--
  목적 : 사용자검색
  Detail : 
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <y-search-box :gridOptions="gridOptions" @enter="btnSearchClicked">
      <b-row slot="search">
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
          <y-tree-dept
            type="search"
            :plantCd="searchParam.plantCd"
            v-model="searchParam.deptCd"
          />
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
          <!-- 성명 -->
          <y-text
            :width="8"
            :clearable="true"
            ui="bootstrap"
            name="userNm"
            label="L0000001630"
            v-model="searchParam.userNm"
            :readonly="true"
            :appendIcon="[{ icon: 'search', callbackName: 'searchUser' }]"
            @searchUser="btnSearchUserClicked"
          />
        </b-col>
      </b-row>
    </y-search-box>

    <b-row class="mt-3">
      <b-col sm="12" class="px-0">
        <b-col sm="12">
          <div slot="buttonGroup" class="float-right mb-1">
            <y-btn
              title="L0000001561"
              color="orange"
              @btnClicked="selectUser"
            />
            <!-- 선택 -->
            <!-- 검색 -->
            <y-btn
              :action-url="searchUrl"
              :param="searchParam"
              title="L0000000327"
              color="green"
              action-type="get"
              @btnClicked="btnSearchClicked"
            />
            <y-btn title="L0000000881" @btnClicked="closePopup" />
            <!-- 닫기 -->
          </div>
          <!-- :checkItemData="checkItemData" -->
          <!-- 조회 목록 -->
          <y-data-table
            label="L0000004332"
            :headers="gridOptions.header"
            :height="gridOptions.height"
            :items="gridOptions.data"
            :editable="editable"
            :rows="5"
            :useRownum="false"
            v-model="gridOptions.selectedValue"
          >
            <el-table-column
              type="selection"
              slot="selection"
              align="center"
              width="55"
            ></el-table-column>
          </y-data-table>
        </b-col>
      </b-col>
    </b-row>
    <y-dialog :param="popupOptions"></y-dialog>
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
        disabled: false,
        plantCd: '',
        deptCd: '',
        userId: '',
        userNm: '',
        user: [],
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
        // userId: '',
        userNm: '',
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
      gridOptions: {
        height: '300',
        header: [],
        data: [],
        selectedValue: [],
      },
      checkItemData: [],
      checkupYearItems: [],
      disabled: false,
      editable: true,
      searchUrl: '',
    };
  },
  computed: {},
  watch: {},
  /** Vue lifecycle: created, mounted, destroyed, etc **/
  beforeCreate() {},
  created() {},
  beforeMount() {
    // TODO : data를 초기화 시켜줌(검색 조건 유지가 필요할 때는 삭제할 것)
    // 이유 : vue.js는 SPA기반으로 동작하기 때문에 페이지를 이동하더라도 기존 입력된 정보가 그대로 남아 있는 문제가 있음
    Object.assign(this.$data, this.$options.data());
  },
  mounted() {
    this.init();
  },
  beforeDestory() {
    this.init();
  },
  /** methods **/
  methods: {
    /** 초기화 관련 함수 **/
    init() {
      // TODO : 여기에 초기 설정용 함수를 호출하거나 로직을 입력하세요.
      // 초기값 설정
      this.searchParam.plantCd = this.$store.getters.plantCd;
      this.searchParam.deptCd = this.popupParam.deptCd;
      // this.searchParam.userId = this.popupParam.userId;
      this.searchParam.userNm = this.popupParam.userNm;
      this.disabled = this.popupParam.disabled;

      // 그리드 헤더 설정
      this.gridOptions.header = [
        { text: 'L0000001415', name: 'plantNm', width: '20%', align: 'center' }, // 사업장
        { text: 'L0000001287', name: 'deptNm', width: '20%', align: 'center' }, // 부서
        { text: 'L0000001412', name: 'userId', width: '20%', align: 'center' }, // 사번
        { text: 'L0000001630', name: 'userNm', width: '20%', align: 'center' }, // 성명
        {
          text: 'L0000000588', // 관리대상지정일
          name: 'beManagedYmd',
          width: '20%',
          align: 'center',
        },
        {
          text: 'L0000001360', // 비고
          name: 'remark',
          width: '20%',
          align: 'center',
        },
      ];

      // this.searchUrl = selectConfig.manage.user.list.url;
      this.searchUrl = selectConfig.hea.suspectUser.list.release.url;

      this.getList();
    },
    /** /초기화 관련 함수 **/

    /** Call API service */
    getList() {
      this.$http.url = this.searchUrl;
      this.$http.param = this.searchParam;
      this.$http.type = 'get';
      this.$http.request(
        (_result) => {
          this.gridOptions.data = _result.data;
          this.checkItemData = this.popupParam.user;
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },

    selectUser() {
      if (
        !this.gridOptions.selectedValue ||
        (this.gridOptions.selectedValue &&
          this.gridOptions.selectedValue.length === 0)
      ) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // '안내',
          message: 'M0000000447', // 사용자를 먼저 지정하세요.
          type: 'warning', // success / info / warning / error
        });
        return;
      }
      this.$emit('closePopup', {
        success: true,
        users: this.gridOptions.selectedValue,
      });
    },
    closePopup() {
      // 부모창에 값 전달
      this.$emit('closePopup', { success: true });
    },

    /** /Call API service **/

    /** Button Event **/
    btnSearchClicked() {
      this.getList();
    },
    btnSearchUserClicked(_item) {
      this.popupOptions.target = () =>
        import(`${'../../manage/user/userSearch.vue'}`);
      this.popupOptions.param = {
        plantCd: this.searchParam.plantCd,
        deptCd: this.searchParam.deptCd,
      };
      this.popupOptions.title = 'L0000001466'; // 사용자검색
      this.popupOptions.visible = true;
      this.popupOptions.width = '60%';
      this.popupOptions.top = '100px';
      this.popupOptions.closeCallback = this.closePopupSearchUser;
    },
    closePopupSearchUser(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      if (data.user) {
        this.searchParam.userNm = data.user.userNm;
        // this.searchParam.userId = data.user.userId;
      }
    },
    /** /Button Event **/

    /** 기타 function **/

    /** /기타 function **/
  },
};
</script>
