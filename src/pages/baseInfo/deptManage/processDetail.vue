<!--
  목적 : 작업공정관리 상세정보(탭)
  작성자 : kdh
  Detail : 작업공정 조회 및 등록/수정
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <b-row ref="inputBox">
      <b-col sm="12">
        <b-row>
          <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
            <!-- 작업공정명 -->
            <y-text
              :width="8"
              :editable="editable"
              :maxlength="30"
              :required="true"
              ui="bootstrap"
              label="L0000002367"
              name="processNm"
              v-model="process.processNm"
              v-validate="'required'"
              :state="validateState('processNm')"
            />
          </b-col>
          <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
            <!-- 사용여부 , 사용/미사용 -->
            <y-switch
              :width="8"
              :editable="editable"
              true-value="Y"
              false-value="N"
              ui="bootstrap"
              label="L0000001439"
              name="useYn"
              selectText="L0000001440"
              unselectText="L0000001063"
              v-model="process.useYn"
            />
          </b-col>
          <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
            <!-- 정렬순서 -->
            <y-number
              :width="8"
              :editable="editable"
              :maxlength="5"
              :hasSeperator="false"
              :isPositive="true"
              ui="bootstrap"
              label="L0000002601"
              name="sortOrder"
              v-model="process.sortOrder"
            />
          </b-col>
        </b-row>
        <div class="float-right mt-3">
          <!-- 초기화 -->
          <y-btn
            v-if="editable"
            title="L0000002859"
            @btnClicked="btnClearClickedCallback"
          />
          <!-- 신규등록 -->
          <y-btn
            v-if="editable"
            :action-url="insertUrl"
            :param="process"
            :is-submit="isCreateSubmit"
            title="L0000001789"
            color="orange"
            action-type="post"
            beforeSubmit="beforeCreateSubmit"
            @beforeCreateSubmit="beforeCreateSubmit"
            @btnClicked="btnCreateClickedCallback"
            @btnClickedErrorCallback="btnClickedErrorCallback"
          />
          <!-- 수정 -->
          <y-btn
            v-if="editable && updateMode"
            :action-url="editUrl"
            :param="process"
            :is-submit="isUpdateSubmit"
            title="L0000001696"
            color="orange"
            action-type="put"
            beforeSubmit="beforeUpdateSubmit"
            @beforeUpdateSubmit="beforeUpdateSubmit"
            @btnClicked="btnUpdateClickedCallback"
            @btnClickedErrorCallback="btnClickedErrorCallback"
          />
        </div>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
export default {
  /** attributes: name, components, props, data **/
  name: 'process-detail', // 반드시 입력하세요(안 하면 warning 발생). 네이밍 룰은 현재 vue component의 파일명의 단어를 "-"로 구분(예:exam-data)하여 입력하시면 됩니다. 입력후 이 주석은 지워주세요.
  props: {
    processNo: 0,
  },
  // TODO: 화살표 함수(=>)는 data에 사용하지 말 것
  //    data: () => { return { a: this.myProp }}) 화살표 함수가 부모 컨텍스트를 바인딩하기 때문에 this는 예상과 달리 Vue 인스턴스가 아니기 때문에 this.myProp는 undefined로 나옵니다.
  //    참고url: https://kr.vuejs.org/v2/api/index.html#data
  data() {
    return {
      // Naming Rule : JAVA model class와 연동되는 vue model은 model class명을 Camel case로 변환해서 선언하시고 기본값은 {}로 초기화 시켜주세요.
      // 예) ExamData -> examData: {},
      process: {
        processNo: 0,
        processNm: null,
        sortOrder: null,
        useYn: 'Y',
        createUserId: '',
        createUserNm: '',
        createDt: '',
        updateUserId: '',
        updateUserNm: '',
        updateDt: '',
      },
      editable: true,
      updateMode: false,
      isCreateSubmit: false,
      isUpdateSubmit: false,
      gridData: [],
      gridHeaderOptions: [],
      gridHeight: '420',
      insertUrl: '',
      editUrl: '',
      searchUrl: '',
      detailUrl: '',
    };
  },
  watch: {
    processNo() {
      if (this.processNo > 0) this.getDetail();
    },
  },
  /** Vue lifecycle: created, mounted, destroyed, etc **/
  beforeCreate() {},
  created() {},
  beforeMount() {
    // TODO : data를 초기화 시켜줌(검색 조건 유지가 필요할 때는 삭제할 것)
    // 이유 : vue.js는 SPA기반으로 동작하기 때문에 페이지를 이동하더라도 기존 입력된 정보가 그대로 남아 있는 문제가 있음
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {},
  beforeDestory() {},
  /** methods **/
  methods: {
    /** 초기화 관련 함수 **/
    init() {
      // TODO : 여기에 초기 설정용 함수를 호출하거나 로직을 입력하세요.

      this.editable = this.$route.meta.editable;

      this.insertUrl = transactionConfig.manage.process.insert.url;
      this.editUrl = transactionConfig.manage.process.edit.url;
      this.searchUrl = selectConfig.manage.process.list.url;
      this.detailUrl = selectConfig.manage.process.get.url;
    },
    /** /초기화 관련 함수 **/

    /** Call API service */
    getDetail() {
      this.$http.url = this.$format(this.detailUrl, this.processNo);
      this.$http.type = 'get';
      this.$http.request(
        (_result) => {
          this.updateMode = true;
          this.process = _result.data;
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    /** /Call API service **/
    /** validation checking(필요없으면 지워주세요) **/
    beforeCreateSubmit() {
      var processNms = this.$_.map(this.gridData, 'processNm');
      if (this.$_.indexOf(processNms, this.process.processNm) > -1) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395' /* 안내 */,
          message: 'M0000000117', // 이미 같은 이름의 작업공정명이 존재합니다.
          type: 'warning',
        });
        return;
      }

      this.$validator
        .validateAll()
        .then((_result) => {
          this.process.processNo = 0;
          if (_result) {
            window.getApp.$emit('CONFIRM', {
              title: 'L0000003321' /* 확인 */,
              message: 'M0000000011' /* 저장하시겠습니까? */,
              type: 'info',
              // 확인 callback 함수
              confirmCallback: () => {
                this.process.createUserId = this.$store.getters.token;
                this.isCreateSubmit = true;
              },
            });
          } else {
            window.getApp.$emit('ALERT', {
              title: 'L0000003395' /* 안내 */,
              message: 'M0000000005', // 필수 입력값을 입력해 주세요.
              type: 'warning',
            });
          }
        })
        .catch(() => {
          window.getApp.$emit('APP_VALID_ERROR', 'M0000000881'); // 유효성 검사도중 에러가 발생하였습니다.
        });
    },
    beforeUpdateSubmit() {
      this.$validator
        .validateAll()
        .then((_result) => {
          if (_result) {
            window.getApp.$emit('CONFIRM', {
              title: 'L0000003321' /* 확인 */,
              message: 'M0000000011' /* 저장하시겠습니까? */,
              type: 'info',
              // 확인 callback 함수
              confirmCallback: () => {
                this.process.updateUserId = this.$store.getters.token;
                this.isUpdateSubmit = true;
              },
            });
          } else {
            window.getApp.$emit('ALERT', {
              title: 'L0000003395' /* 안내 */,
              message: 'M0000000005', // 필수 입력값을 입력해 주세요.
              type: 'warning',
            });
          }
        })
        .catch(() => {
          window.getApp.$emit('APP_VALID_ERROR', 'M0000000881'); // 유효성 검사도중 에러가 발생하였습니다.
        });
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

    /** /Component, Callbacks (버튼 제외) **/

    /** Button Event **/
    /**
     * 저장 버튼 처리용 샘플함수
     */
    btnClearClickedCallback(_result) {
      this.updateMode = false;
      Object.assign(this.$data.process, this.$options.data().process);
      this.$validator.reset();
    },
    btnCreateClickedCallback(_result) {
      this.process.processNo = _result.data;
      this.isCreateSubmit = false;
      this.updateMode = true;
      this.$emit('getList');
      window.getApp.$emit('ALERT', {
        title: 'L0000003395' /* 안내 */,
        message: 'M0000000006', // 저장되었습니다.
        type: 'success',
      });
    },
    btnUpdateClickedCallback(_result) {
      this.isUpdateSubmit = false;
      this.$emit('getList');
      window.getApp.$emit('ALERT', {
        title: 'L0000003395' /* 안내 */,
        message: 'M0000000006', // 저장되었습니다.
        type: 'success',
      });
    },
    /**
     * 버튼 에러 처리용 공통함수
     */
    btnClickedErrorCallback(_result) {
      this.isSubmit = false;
      this.isCreateSubmit = false;
      this.isUpdateSubmit = false;
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    /** /Button Event **/

    /** 기타 function **/

    /** /기타 function **/
  },
};
</script>
