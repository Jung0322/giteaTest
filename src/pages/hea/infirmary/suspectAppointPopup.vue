<!--
  목적 : 지정자 추가 팝업
  Detail : 
  examples:
  -->
<template>
  <b-container fluid>
    <y-search-box :gridOptions="gridOptions" @enter="btnSearchClicked">
      <b-row slot="search">
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
          <!-- 검진년도 -->
          <y-select
            :width="8"
            :editable="editable"
            :comboItems="checkupYearItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            type="search"
            name="heaCheckedYear"
            label="L0000000364"
            v-model="searchParam.heaCheckedYear"
          />
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
          <!-- 검진계획 -->
          <y-select
            :width="8"
            :editable="editable"
            :comboItems="heaCheckupPlanNoItems"
            itemText="heaCheckupPlanNm"
            itemValue="heaCheckupPlanNo"
            ui="bootstrap"
            type="search"
            name="heaCheckupPlanNo"
            label="L0000000353"
            v-model="searchParam.heaCheckupPlanNo"
          />
        </b-col>
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
            <y-btn
              title="L0000000327"
              color="green"
              @btnClicked="btnSearchClicked"
            />
            <!-- 검색 -->
            <y-btn title="L0000000881" @btnClicked="closePopup" />
            <!-- 닫기 -->
          </div>
          <!-- 조회 목록 -->
          <y-data-table
            label="L0000004332"
            :headers="gridOptions.header"
            :height="gridOptions.height"
            :items="gridOptions.data"
            :editable="editable"
            :rows="8"
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
  name: 'suspect-appoint-popup',
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
  data() {
    return {
      searchParam: {
        plantCd: '',
        deptCd: '',
        userNm: '',
        userId: '',
        heaCheckupPlanNo: 0,
        heaCheckedYear: '',
        heaCheckupPlanPeriod: [],
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
        height: 300,
        header: [],
        data: [],
        selectedValue: [],
      },
      checkItemData: [],
      checkupYearItems: [],
      heaCheckupPlanNoItems: [],
      disabled: false,
      editable: true,
      searchUrl: '',
    };
  },
  computed: {},
  watch: {
    'searchParam.heaCheckedYear': function () {
      let heaCheckedYear = this.searchParam.heaCheckedYear;
      this.searchParam.heaCheckupPlanPeriod = [heaCheckedYear, heaCheckedYear];
      this.getHeaCheckupPlanNoItems();
    },
  },
  /** Vue lifecycle: created, mounted, destroyed, etc **/
  beforeCreate() {},
  created() {},
  beforeMount() {
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
      // 초기값 설정
      this.searchParam.plantCd = this.$store.getters.plantCd;
      this.searchParam.deptCd = this.popupParam.deptCd;
      this.searchParam.userNm = this.popupParam.userNm;
      this.disabled = this.popupParam.disabled;

      var nowDate = new Date();
      var from = nowDate.getFullYear() - 9;
      for (; from <= nowDate.getFullYear() + 1; from++) {
        this.checkupYearItems.push({
          code: from,
          codeNm: from + this.$comm.getLangSpecInfoLabel('L0000000828'),
        }); // 년
      }
      let today = this.$comm.getToday();
      this.searchParam.heaCheckupPlanPeriod = [today, today];
      this.searchParam.heaCheckedYear = this.$comm.getToday().substring(0, 4);

      // 그리드 헤더 설정
      this.gridOptions.header = [
        { text: 'L0000001415', name: 'plantNm', width: '20%', align: 'center' }, // 사업장
        { text: 'L0000001287', name: 'deptNm', width: '20%', align: 'center' }, // 부서
        { text: 'L0000001412', name: 'userId', width: '20%', align: 'center' }, // 사번
        { text: 'L0000001630', name: 'userNm', width: '20%', align: 'center' }, // 성명
        {
          text: 'L0000004333', // 검진명
          name: 'heaCheckupPlanNm',
          width: '20%',
          align: 'center',
        },
        {
          text: 'L0000000371', // 검진일
          name: 'heaCheckedYmd',
          width: '20%',
          align: 'center',
        },
        {
          text: 'L0000003035',
          name: 'heaDiagnoseCd',
          width: '20%',
          align: 'center',
        }, // 판정
        {
          text: 'L0000002780',
          name: 'heaDiseaseNms',
          width: '20%',
          align: 'center',
        }, // 질환
      ];

      this.searchUrl = selectConfig.hea.suspectUser.list.appoint.url;
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
    /** /Button Event **/

    /** 기타 function **/
    getHeaCheckupPlanNoItems() {
      // 검진계획 선택항목 조회
      this.$http.url = selectConfig.hea.checkupPlan.list.url;
      this.$http.type = 'get';
      this.$http.param = {
        plantCd: this.searchParam.plantCd,
        heaCheckupPlanPeriod: this.searchParam.heaCheckupPlanPeriod,
      };
      this.$http.request(
        (_result) => {
          _result.data.splice(0, 0, {
            heaCheckupPlanNo: '0',
            heaCheckupPlanNm: this.$comm.getLangSpecInfoLabel('L0000002519'), // '전체',
          });
          this.heaCheckupPlanNoItems = _result.data;
          this.searchParam.heaCheckupPlanNo = 0;
        },
        (_error) => {
          window.getApp.$emit(
            'APP_REQUEST_ERROR',
            'M0000000016' // 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.
          );
        }
      );
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
        this.searchParam.userId = data.user.userId;
      }
    },
    /** /기타 function **/
  },
};
</script>
