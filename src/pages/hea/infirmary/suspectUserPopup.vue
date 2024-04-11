<!--
  목적 : 건강관리실 - 관리대상 유소견자 지정 및 해제 요청목록(팝업)
  Detail :
  examples:
  -->
<template>
  <b-container fluid>
    <!-- 검색 -->
    <y-search-box :gridOptions="gridOptions" @enter="getDataList">
      <b-row slot="search">
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <y-plant
            type="search"
            :editable="editable"
            name="plantCd"
            v-model="searchParam.plantCd"
          />
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 기간 -->
          <y-datepicker
            :width="8"
            :range="true"
            :default="'today'"
            label="L0000000767"
            name="period"
            v-model="searchParam.period"
          ></y-datepicker>
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 등록자 -->
          <y-text
            :width="8"
            ui="bootstrap"
            label="L0000000976"
            name="userNm"
            v-model="searchParam.userNm"
            :disabled="true"
            :appendIcon="[
              { icon: 'times', callbackName: 'clear' },
              { icon: 'search', callbackName: 'searchUser' },
            ]"
            @searchUser="btnSearchUserClicked"
            @clear="clear"
          ></y-text>
        </b-col>
      </b-row>
    </y-search-box>

    <b-row class="mt-3">
      <b-col sm="12">
        <b-col sm="12" class="px-0">
          <div class="float-right mb-1">
            <!-- 신규등록 -->
            <y-btn
              v-if="editable"
              title="L0000001789"
              color="orange"
              @btnClicked="btnCreateSuspectUser"
            />
            <y-btn
              title="L0000000327"
              color="green"
              @btnClicked="btnSearchClicked"
            /><!-- 검색 -->
            <y-btn title="L0000000881" @btnClicked="closePopup" /><!-- 닫기 -->
          </div>
          <!-- 관리대상 지정 -->
          <y-data-table
            ref="dataTable"
            :editable="editable"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            :print="true"
            :useRownum="false"
            label="L0000000582"
            @tableLinkClicked="tableLinkClicked"
            :popMode="true"
          ></y-data-table>
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
  name: 'suspect-user-popup',
  props: {},
  data() {
    return {
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
        header: [],
        data: [],
        height: '400',
      },
      searchParam: {
        plantCd: '',
        period: [],
        userNm: '',
        // userId: '',
      },
      editable: true,
      searchUrl: '',
      gridData: [],
      gridHeaderOptions: [],
    };
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
  beforeDestroy() {},
  /** methods **/
  methods: {
    /** 초기화 관련 함수 **/
    init() {
      this.editable = this.$route.meta.editable;

      // 관리대상 지정 목록
      this.gridOptions.header = [
        {
          text: 'L0000001415',
          name: 'plantNm',
          width: '120px',
          align: 'center',
        }, // 사업장
        {
          text: 'L0000002779', // 진행상태
          name: 'suspStepNm',
          width: '120px',
          align: 'center',
        },
        {
          text: 'L0000000452', // 결재진행상태
          name: 'apprRqstNm',
          width: '120px',
          align: 'center',
          url: 'link',
        },
        {
          text: 'L0000002055', // 요청일
          name: 'rqstDt',
          width: '120px',
          align: 'center',
          url: true,
        },
        {
          text: 'L0000002765', // 지정인원
          name: 'reqActCnt',
          width: '100px',
          align: 'center',
        },
        {
          text: 'L0000003219', // 해제인원
          name: 'reqRelCnt',
          width: '100px',
          align: 'center',
        },
        {
          text: 'L0000000976', // 등록자
          name: 'createUserNm',
          width: '130px',
          align: 'center',
        },
        {
          text: 'L0000000973',
          name: 'createDt',
          width: '130px',
          align: 'center',
        }, // 등록일
      ];

      // 관리대상 해제 목록
      this.searchUrl = selectConfig.hea.suspectUser.list.all.url;
      // this.searchParam.plantCd = this.$store.getters.plantCd;
      setTimeout(() => {
        this.getDataList();
      }, 100);
      // this.setGridSize();
    },
    /** /초기화 관련 함수 **/
    getDataList() {
      this.$http.url = this.searchUrl;
      this.$http.type = 'get';
      this.$http.param = this.searchParam;
      this.$http.request(
        (_result) => {
          this.gridOptions.data = _result.data;
        },
        (_error) => {
          window.getApp.$emit(
            'APP_REQUEST_ERROR',
            'M0000000016' // 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.
          );
        }
      );
    },
    closePopup() {
      // 부모창에 값 전달
      this.$emit('closePopup', { success: true });
    },

    /**
     * 그리드 리사이징
     */
    // setGridSize() {
    //   window.getApp.$emit('LOADING_SHOW');
    //   setTimeout(() => {
    //     this.gridOptions.height =
    //       window.innerHeight - this.$refs.searchBox.clientHeight - 250;
    //     window.getApp.$emit('LOADING_HIDE');
    //   }, 600);
    // },
    /** Button Event **/
    btnSearchClicked() {
      this.getDataList();
    },
    btnCreateSuspectUser() {
      this.popupOptions.target = () =>
        import(`${'./suspectUserApprPopup.vue'}`);
      this.popupOptions.title = 'L0000000580'; // 관리대상 유소견자 지정
      this.popupOptions.visible = true;
      this.popupOptions.width = '80%';
      this.popupOptions.top = '10px';
      this.popupOptions.param = {
        suspectReqNo: 0,
      };
      this.popupOptions.closeCallback = this.closeUserApprPopup;
    },
    tableLinkClicked(header, data) {
      if (header.name === 'apprRqstNm') {
        this.showApprProgressPopup(data);
      } else {
        if (data === null) return;
        this.popupOptions.target = () =>
          import(`${'./suspectUserApprPopup.vue'}`);
        this.popupOptions.title = '관리대상 유소견자 지정';
        this.popupOptions.visible = true;
        this.popupOptions.width = '80%';
        this.popupOptions.top = '10px';
        this.popupOptions.param = {
          suspectReqNo: data.suspectReqNo,
        };
      }
      this.popupOptions.closeCallback = this.closeUserApprPopup;
    },
    // 결재진행상태 조회
    showApprProgressPopup(data) {
      this.popupOptions.target = () => import('@/pages/appr/apprProgressPopup');
      this.popupOptions.title = 'L0000000452'; // 결재진행상태
      this.popupOptions.param = {
        apprRqstNo: data.apprRqstNo, // 결재번호
      };
      this.popupOptions.visible = true;
      // this.popupOptions.closeCallback = this.closePopup;
    },
    closeUserApprPopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.getDataList();
    },
    btnClickedErrorCallback(_result) {
      window.getApp.$emit(
        'APP_REQUEST_ERROR',
        'M0000000016' // 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.
      );
    },
    btnSearchUserClicked(_item) {
      this.popupOptions.target = () =>
        import(`${'../../manage/user/userSearch.vue'}`);
      this.popupOptions.param = {
        plantCd: this.searchParam.plantCd,
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
    clear() {
      this.searchParam.userId = null;
      this.searchParam.userNm = null;
    },
    /** /Button Event **/
  },
};
</script>
