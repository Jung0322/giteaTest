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
      <y-search-box :gridOptions="gridOptions" @enter="btnSearchClicked">
        <b-row slot="search">
          <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
            <y-plant type="search" v-model="searchParam.plantCd" />
          </b-col>
          <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
            <!-- 부서 -->
            <y-tree-dept
              type="search"
              label="L0000001287"
              v-model="searchParam.deptCd"
              :plantCd="searchParam.plantCd"
              :show-all-dept="false"
              :deptSubYn="searchParam.deptSubYn"
              @setDeptSubYn="setDeptSubYn"
            />
          </b-col>
          <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
            <!-- 사용자명 -->
            <y-text
              :width="8"
              ui="bootstrap"
              label="L0000001472"
              name="userNm"
              v-model="searchParam.userNm"
            />
          </b-col>
          <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
            <!-- 사용자ID -->
            <y-text
              :width="8"
              ui="bootstrap"
              label="L0000001465"
              name="userId"
              v-model="searchParam.userId"
            />
          </b-col>
          <!-- 재직여부 추가 -->
          <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
            <!-- 재직여부 -->
            <y-select
              :width="8"
              :comboItems="useItems"
              itemText="codeNm"
              itemValue="code"
              ui="bootstrap"
              label="L0000002471"
              name="useYnNm"
              v-model="searchParam.useYn"
            ></y-select>
          </b-col>
          <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
            <!-- 직책 -->
            <y-select
              :width="8"
              :comboItems="dutylItems"
              :disabled="false"
              itemText="dutyNm"
              itemValue="dutyCd"
              ui="bootstrap"
              label="L0000002772"
              name="dutyCd"
              v-model="searchParam.dutyCd"
            />
          </b-col>
        </b-row>
      </y-search-box>
      <!-- 검색 -->
      <b-row class="grid-height grid-box">
        <b-col sm="12" class="h100p">
          <y-auigrid
            ref="yAuiGrid"
            :name="gridOptions.name"
            :headers="gridOptions.header"
            :btns="gridOptions.btns"
            :height="gridOptions.height"
            :label="this.$comm.getLangSpecInfoLabel('L0000001462')"
            :useExcelExport="false"
            :enableSorting="true"
            :showGridSetSave="true"
            @cellClick="cellClickHandler"
            @openNewPage="openNewPage"
            @btnSearch="getUserList"
          />
        </b-col>
      </b-row>

      <!-- 팝업 설정 -->
      <y-dialog :param="popupOptions"></y-dialog>
    </b-container>
  </div>
</template>

<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';

export default {
  /** attributes: name, components, props, data **/
  name: 'user-manage', // 반드시 입력하세요(안 하면 warning 발생). 네이밍 룰은 현재 vue component의 파일명의 단어를 "-"로 구분(예:exam-data)하여 입력하시면 됩니다. 입력후 이 주석은 지워주세요.
  props: {},
  // TODO: 화살표 함수(=>)는 data에 사용하지 말 것
  //    data: () => { return { a: this.myProp }}) 화살표 함수가 부모 컨텍스트를 바인딩하기 때문에 this는 예상과 달리 Vue 인스턴스가 아니기 때문에 this.myProp는 undefined로 나옵니다.
  //    참고url: https://kr.vuejs.org/v2/api/index.html#data
  data() {
    return {
      user: {
        userId: '',
        userPwdSHA: '',
        userNm: '',
        deptCd: '',
        comSexTypeCd: null,
        birthYmd: '',
        officeTel: '',
        phoneNo: '',
        email: '',
        entryYmd: '',
        positionCd: null,
        dutyCd: null,
        useYn: 'Y',
        createUserId: '',
        updateUserId: '',
      },
      orgUser: {},
      searchArea: {
        title: 'L0000000329', // 검색박스숨기기
        show: true,
      },
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '60%',
        top: '10px',
        param: {},
        closeCallback: null,
      },
      gridOptions: {
        name: 'user',
        header: [],
        data: [],
        btns: [],
        height: '600',
      },

      searchParam: {
        plantCd: '',
        deptCd: '',
        deptSubYn: 'Y', // 하위부서여부 사용
        userNm: '',
        userId: '',
        useYn: '',
        dutyCd: '',
      },
      positionlItems: [],
      dutylItems: [],
      sexualItems: [],
      isInsert: false,
      insertUrl: '',
      updateMode: false,
      isEdit: false,
      editUrl: '',
      editable: true,
      upMenuLvl: null, // 버튼을 submit 할 것인지 판단하는 변수로써 버튼의 개수만큼 필요합니다.
      useItems: [],
      selectedUserId: '',
      searchUrl: '',
      searchPositionUrl: '',
      searchDutyUrl: '',
      countUrl: '',
      YAuiGrid: null,
    };
  },
  /** Vue lifecycle: created, mounted, destroyed, etc **/
  beforeCreate() {},
  created() {},
  beforeMount() {
    // TODO : data를 초기화 시켜줌(검색 조건 유지가 필요할 때는 삭제할 것)
    // 이유 : vue.js는 SPA기반으로 동작하기 때문에 페이지를 이동하더라도 기존 입력된 정보가 그대로 남아 있는 문제가 있음
    Object.assign(this.$data, this.$options.data());
    this.init();
    window.addEventListener('resize', this.resizeGrid);
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;
    this.resizeGrid();
    this.getPositionList();
    this.getDutyList();
    this.getUserList();
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

      this.searchParam.deptSubYn = 'Y';

      this.useItems = [
        { code: '', codeNm: this.$comm.getLangSpecInfoLabel('L0000002519') }, // 전체
        { code: 'Y', codeNm: this.$comm.getLangSpecInfoLabel('L0000002470') }, // 재직O
        { code: 'N', codeNm: this.$comm.getLangSpecInfoLabel('L0000004538') }, // 재직X
      ];
      this.insertUrl = transactionConfig.user.insert.url;
      this.searchUrl = selectConfig.manage.user.list.url;
      this.searchPositionUrl = selectConfig.manage.position.list.url;
      this.searchDutyUrl = selectConfig.manage.duty.list.url;
      this.countUrl = selectConfig.manage.user.count.url;
      this.editUrl = transactionConfig.user.update.url;

      this.getComboItems('HEA_GENDER_TYPE');

      this.getPositionList();
      this.getDutyList();
      this.getUserList();
      // this.setGridSize();
      this.editable = this.$route.meta.editable;

      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001465'),
          dataField: 'userId',
          width: '11%',
        }, // 사용자ID
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001472'), // 사용자명
          dataField: 'userNm',
          width: '11%',
          style: 'grid-link-cell',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004366'),
          dataField: 'plantNm',
          width: '11%',
          style: 'center-align',
        }, // 사업장명
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004367'),
          dataField: 'deptNm',
          width: '11%',
          style: 'center-align',
        }, // 부서명
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002769'),
          dataField: 'positionNm',
          width: '11%',
          style: 'center-align',
        }, // 직위
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002772'),
          dataField: 'dutyNm',
          width: '8%',
          style: 'center-align',
        }, // 직책
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001632'),
          dataField: 'comSexTypeNm',
          width: '11%',
          style: 'center-align',
        }, // 성별
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004539'),
          dataField: 'email',
          width: '14%',
        }, // email
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002471'),
          dataField: 'useYnNm',
          width: '11%',
          style: 'center-align',
        }, // 재직여부
      ];
      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001789'),
          color: 'orange',
          btnClicked: 'openNewPage',
        }, // 신규등록
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000327'),
          color: 'green',
          btnClicked: 'btnSearch',
        }, //  검색
      ];
    },

    /** /초기화 관련 함수 **/

    /**
     *  Call API service
     */
    getUserList() {
      this.$http.url = this.searchUrl;
      this.$http.param = this.searchParam;
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          // this.gridOptions.data = _result.data;
          this.YAuiGrid.setGridData(this.$_.clone(_result.data));
          this.$comm.pushCookie(this.searchParam);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    getPositionList() {
      this.$http.url = this.searchPositionUrl;
      this.$http.param = {
        useYn: 'Y',
      };
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.positionlItems = _result.data;
          this.positionlItems.splice(0, 0, {
            positionCd: null,
            positionNm: this.$comm.getLangSpecInfoLabel('L0000003394'), // 선택하세요
          });
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    getDutyList() {
      this.$http.url = this.searchDutyUrl;
      this.$http.param = {
        useYn: 'Y',
      };
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.dutylItems = _result.data;
          this.dutylItems.splice(0, 0, {
            dutyCd: null,
            dutyNm: this.$comm.getLangSpecInfoLabel('L0000003394'),
          }); // 선택하세요
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },

    /** /Call API service **/

    /** validation checking(필요없으면 지워주세요) **/
    checkValidation(flag) {
      var countUser = 0;

      this.$http.url = this.countUrl;
      this.$http.param = this.user;
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          countUser = _result.data;

          if (countUser > 0 && flag === 'insert') {
            window.getApp.$emit('ALERT', {
              title: 'L0000003395', // 안내
              message: 'M0000000553', // 이미 존재하는 ID입니다
              type: 'warning',
            });
            return;
          }

          this.$validator
            .validateAll()
            .then((_result) => {
              if (_result) {
                window.getApp.$emit('CONFIRM', {
                  title: 'L0000003321', // 확인
                  message:
                    flag === 'insert'
                      ? 'M0000000105' // 등록하시겠습니까?
                      : 'M0000000060', // 수정하시겠습니까?
                  type: 'info',
                  // 확인 callback 함수
                  confirmCallback: () => {
                    if (flag === 'insert') {
                      this.user.createUserId = this.$store.getters.token;
                      this.isInsert = true;
                    } else {
                      this.user.updateUserId = this.$store.getters.token;
                      this.isEdit = true;
                    }
                  },
                  cancelCallback: () => {
                    this.isInsert = false;
                    this.isEdit = false;
                  },
                });
              } else if (!_result) {
                window.getApp.$emit('ALERT', {
                  title: 'L0000003395', // 안내
                  message: 'M0000000710', // 필수입력값을 입력 후 저장해주세요
                  type: 'warning',
                });
              }
            })
            .catch(() => {
              if (flag === 'insert') this.isInsert = false;
              else this.isEdit = false;
            });
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    validateState(_ref) {
      if (
        this.veeBag[_ref] &&
        (this.veeBag[_ref].dirty || this.veeBag[_ref].validated)
      ) {
        return !this.errors.has(_ref);
      }
      return null;
    },
    /** /validation checking **/

    /** Component Events, Callbacks (버튼 제외) **/

    /**
     * 등록전 유효성 검사
     */
    beforeInsert() {
      this.checkValidation('insert');
    },
    beforeUpdate() {
      // if (this.orgUser.userId !== this.user.userId) {
      if (this.selectedUserId !== this.user.userId) {
        this.isEdit = false;
        window.getApp.$emit('APP_VALID_ERROR', 'ID는 수정할 수 없습니다.');
        return;
      }
      this.checkValidation('update');
    },
    /** /Component, Callbacks (버튼 제외) **/

    /** Button Event **/
    btnSearchClicked() {
      this.getUserList();
    },

    // 초기화
    btnClearClickedCallback() {
      // Object.assign(this.$data.user, this.$options.data().user);
      // Object.assign(this.$data, this.$options.data());
      this.user = {
        useYn: 'Y',
      };
      this.selectedUserId = '';
      // this.orgUser = {};
      this.$validator.reset();
    },
    /**
     * 저장 버튼 처리용 샘플함수
     */
    btnInsertClickedCallback(_result) {
      this.getUserList();
      this.selectedUserId = _result.data;
      this.isInsert = false; // 반드시 isSubmit을 false로 초기화 하세요. 그렇지 않으면 버튼을 다시 클릭해도 동작하지 않습니다.
      window.getApp.$emit('APP_REQUEST_SUCCESS', '정상적으로 등록되었습니다.');
    },
    btnSaveClickedCallback(_result) {
      this.getUserList();
      this.isEdit = false;
      window.getApp.$emit('APP_REQUEST_SUCCESS', '정상적으로 수정되었습니다.');
    },
    /**
     * 버튼 에러 처리용 공통함수
     */
    btnClickedErrorCallback(_result) {
      this.isInsert = false; // 반드시 isSubmit을 false로 초기화 하세요. 그렇지 않으면 버튼을 다시 클릭해도 동작하지 않습니다.
      this.isEdit = false;
      this.updateMode = false;
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    btnSearchClickedCallback(_result) {
      this.gridOptions.data = _result.data;
    },
    // 비밀번호 변경 팝업
    btnPasswordChangeClickedCallback(data) {
      if (!this.user.userId) {
        window.getApp.$emit('APP_REQUEST_ERROR', '사용자를 먼저 선택해주세요.');
        return;
      }
      this.popupOptions.target = () => import(`${'./passwordChange.vue'}`);
      this.popupOptions.title = 'L0000001363'; // 비밀번호 변경
      this.popupOptions.visible = true;
      this.popupOptions.width = '450px';
      this.popupOptions.top = '10px';
      this.popupOptions.param = {
        userId: this.user.userId,
      };
      this.popupOptions.closeCallback = this.closePopup;
    },
    // 비밀번호 변경 팝업 닫기
    closePopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
    },
    // btnPasswordChangeClickedCallback () {
    //   if (!this.user.userId) {
    //     window.getApp.$emit('APP_REQUEST_ERROR', '사용자를 먼저 선택해주세요.');
    //     return;
    //   }
    //   window.getApp.$emit('POPUP_OPEN', {
    //     isPopupOpen: true,
    //     id: 'popup',
    //     label: '비밀번호 변경',
    //     editable: true,
    //     type: 'passwordChange',
    //     fullscreen: false,
    //     getPopupDataFuncName: 'getPassword',
    //   });
    // },
    /** /Button Event **/

    /** 기타 function **/
    /**
     * 공통 마스터 정보 조회
     */
    getComboItems(codeGroupCd) {
      this.$http.url = selectConfig.codeMaster.allList.url;
      this.$http.param = {
        codeGroupCd: codeGroupCd,
        attr1: 'COM',
      };
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.sexualItems = this.$_.clone(_result.data);
          this.sexualItems.splice(0, 0, {
            code: null,
            codeNm: this.$comm.getLangSpecInfoLabel('L0000003394'),
          }); // 선택하세요
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    /**
     * 수정 팝업 호출
     */
    cellClickHandler(event) {
      if (event.item === null || event.item === undefined) return;
      if (event.dataField === 'userNm') {
        this.popupOptions.top = '10px';
        this.popupOptions.width = '80%';
        this.popupOptions.target = () => import(`${'./userDetail.vue'}`);
        this.popupOptions.title = 'L0000004999'; // 사용자 관리 상세 수정
        this.popupOptions.visible = true;
        this.popupOptions.param = event.item;
        this.popupOptions.closeCallback = this.closePopupUsage;
      }
    },
    openNewPage(event) {
      this.popupOptions.top = '10px';
      this.popupOptions.width = '80%';
      this.popupOptions.target = () => import(`${'./userDetail.vue'}`);
      this.popupOptions.title = 'L0000004998'; // 사용자 관리 상세 등록
      this.popupOptions.visible = true;
      this.popupOptions.param = {
        userId: '',
      };
      this.popupOptions.closeCallback = this.closePopupUsage;
    },
    closePopupUsage(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.getUserList();
    },
    setDeptSubYn(_result) {
      // 하위부서 tree에서 값이 변경될 경우 현재값 변경
      this.searchParam.deptSubYn = _result;
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
