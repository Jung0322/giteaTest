<!--
  목적 : 검진 기준정보 - 검진항목
  Detail : 검진항목 등록/수정화면
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <!-- 등록 -->
    <b-row class="mt-3" ref="editBox">
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- 검진항목 상세 -->
            <y-label
              label="L0000000376"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 저장 -->
              <y-btn
                v-if="updateMode && editable"
                :action-url="editUrl"
                :param="testItem"
                :is-submit="isEdit"
                title="L0000002474"
                color="orange"
                action-type="PUT"
                beforeSubmit="beforeSubmit"
                @beforeSubmit="beforeSubmit"
                @btnClicked="btnSaveClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <y-btn
                v-if="editable && !updateMode"
                :action-url="insertUrl"
                :param="testItem"
                :is-submit="isInsert"
                title="L0000002474"
                color="orange"
                action-type="POST"
                beforeSubmit="beforeInsert"
                @beforeInsert="beforeInsert"
                @btnClicked="btnInsertClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!-- 닫기 -->
              <y-btn title="L0000000881" @btnClicked="btnClosePopup" />
            </div>
          </b-col>
        </b-row>
        <b-card>
          <b-row>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 검진검사 -->
              <y-select
                :width="8"
                :comboItems="comboTestClassItems"
                :required="true"
                :editable="editable"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                type="edit"
                name="heaTestClassCd"
                label="L0000000349"
                v-model="testItem.heaTestClassCd"
                v-validate="'required'"
                :state="validateState('heaTestClassCd')"
              ></y-select>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 검진항목명 -->
              <y-text
                :width="8"
                :editable="editable"
                :maxlength="30"
                :required="true"
                ui="bootstrap"
                name="heaTestItemNm"
                label="L0000000378"
                v-model="testItem.heaTestItemNm"
                v-validate="'required'"
                :state="validateState('heaTestItemNm')"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 결과타입 -->
              <y-select
                :width="8"
                :editable="editable"
                :comboItems="comboResultTypeItems"
                :required="true"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                name="heaResultTypeCd"
                label="L0000000415"
                v-model="testItem.heaResultTypeCd"
                v-validate="'required'"
                :state="validateState('heaResultTypeCd')"
              ></y-select>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 단위 -->
              <y-text
                :width="8"
                :editable="editable"
                :maxlength="15"
                ui="bootstrap"
                name="unit"
                label="L0000000870"
                v-model="testItem.unit"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 사용여부, 사용/미사용 -->
              <y-switch
                :width="8"
                :editable="editable"
                true-value="Y"
                false-value="N"
                ui="bootstrap"
                label="L0000001439"
                name="radioValue"
                selectText="L0000001440"
                unselectText="L0000001063"
                v-model="testItem.useYn"
              ></y-switch>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 정렬순서 -->
              <y-number
                :width="8"
                :editable="editable"
                :maxlength="5"
                :hasSeperator="false"
                :isPositive="true"
                ui="bootstrap"
                name="sortOrder"
                label="L0000002601"
                v-model="testItem.sortOrder"
              ></y-number>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
              <!-- 참고치 -->
              <y-textarea
                :editable="editable"
                :width="10"
                :maxlength="150"
                ui="bootstrap"
                name="specRef"
                label="L0000002801"
                v-model="testItem.specRef"
              />
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
              <!-- 분석항목설명 -->
              <y-textarea
                :editable="editable"
                :width="10"
                :maxlength="150"
                ui="bootstrap"
                name="itemExplan"
                label="L0000001344"
                v-model="testItem.remark"
              />
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>
<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
export default {
  /* attributes: name, components, props, data */
  name: 'y-test-item-detail',
  props: {
    popupParam: {
      type: Object,
      default: {
        heaTestItemCd: '',
        pageNm: '',
      },
    },
  },
  data: () => ({
    testItem: {
      heaTestItemCd: '',
      heaTestClassCd: null,
      heaTestClassNm: '',
      heaTestItemNm: '',
      unit: '',
      heaResultTypeCd: null,
      heaResultTypeNm: '',
      remark: '',
      specRef: '',
      sortOrder: '',
      useYn: 'Y',
      updateUserId: '',
      createUserId: '',
    },
    searchParam: {
      heaTestClassCd: '',
      heaTestItemNm: '',
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
    searchArea: {
      title: '검색박스숨기기',
      show: true,
    },
    gridOptions: {
      header: [],
      data: [],
      height: '300',
    },
    baseWidth: 9,
    editable: false,
    updateMode: false,
    isInsert: false,
    isEdit: false,
    gridItemData: [],
    gridHeaderItemOptions: [],
    comboSearchTestClassItems: [],
    comboTestClassItems: [],
    comboResultTypeItems: [],
    insertUrl: '',
    editUrl: '',
    searchUrl: '',
    period: '',
    cookieName: '',
    routeName: '',
  }),
  //* Vue lifecycle: created, mounted, destroyed, etc */
  beforeCreate() {},
  created() {},
  beforeMount() {
    this.$nextTick(() => {
      Object.assign(this.$data, this.$options.data());
      this.init();
    });
  },
  mounted() {},
  beforeDestroy() {},
  //* methods */
  methods: {
    init() {
      this.editable = this.$route.meta.editable;
      // URL setting
      this.searchUrl = selectConfig.hea.testItem.list.url;
      this.editUrl = transactionConfig.hea.testItem.edit.url;
      this.insertUrl = transactionConfig.hea.testItem.insert.url;

      this.routeName = this.$route.name;
      this.cookieName = 'SHE' + this.$store.getters.token; // cookieName 설정

      this.getComboItems('HEA_RESULT_TYPE'); // 결과타입
      this.getComboItems('HEA_TEST_CLASS'); // 검진검사
      if (this.popupParam.heaTestItemCd !== '') {
        this.getDetail();
      }
    },
    /**
     * 공통 마스터 정보 조회 (결과타입, 검진검사)
     * codeGroupCd : 마스터 테이블 codeGroupCd 정보
     */
    getComboItems(codeGroupCd) {
      this.$http.url = this.$format(
        selectConfig.codeMaster.getSelect.url,
        codeGroupCd
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          if (codeGroupCd === 'HEA_RESULT_TYPE') {
            this.comboResultTypeItems = this.$_.clone(_result.data);
            this.comboResultTypeItems.splice(0, 0, {
              code: null,
              codeNm: this.$comm.getLangSpecInfoLabel('L0000003394'), // 선택하세요
            });
          } else {
            this.comboSearchTestClassItems = this.$_.clone(_result.data);
            this.comboTestClassItems = this.$_.clone(_result.data);

            this.comboSearchTestClassItems.splice(0, 0, {
              code: '',
              codeNm: this.$comm.getLangSpecInfoLabel('L0000002519'), // 전체
            });
            this.comboTestClassItems.splice(0, 0, {
              code: null,
              codeNm: this.$comm.getLangSpecInfoLabel('L0000003394'), // 선택하세요
            });
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    getDetail() {
      if (this.popupParam.heaTestItemCd === '') return;

      this.$http.url = this.$format(
        selectConfig.hea.testItem.get.url,
        this.popupParam.heaTestItemCd
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.updateMode = true;
          this.testItem = this.$_.clone(_result.data);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    /**
     * 필수입력값 유효성 검사
     */
    validateState(ref) {
      if (
        this.veeBag[ref] &&
        (this.veeBag[ref].dirty || this.veeBag[ref].validated)
      ) {
        return !this.errors.has(ref);
      }
      return null;
    },
    /**
     * 검진항목  목록 조회
     *  수정 버튼 callback
     * _result : backend에서 return하는 데이터
     */
    btnSaveClickedCallback(_result) {
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // '안내',
        message: 'M0000000006', // 저장되었습니다.
        type: 'success', // success / info / warning / error
      });
      this.isEdit = false;
    },
    /** 수정 하기전 UI단 유효성 검사 **/
    beforeSubmit() {
      this._beforeCheck('submit');
    },
    btnClosePopup() {
      // 부모창에 값 전달
      this.$emit('closePopup', { success: true });
    },
    _beforeCheck(mode) {
      let confirmMsg;

      if (mode === 'insert') confirmMsg = 'M0000000011'; // 저장하시겠습니까?
      else if (mode === 'submit') confirmMsg = 'M0000000011'; // 저장하시겠습니까?

      this.$validator
        .validateAll()
        .then((_result) => {
          // TODO : 전역 성공 메시지 처리
          // 이벤트는 ./event.js 파일에 선언되어 있음
          if (_result) {
            window.getApp.$emit('CONFIRM', {
              title: 'L0000003321', // '확인',
              message: confirmMsg,
              // TODO : 필요시 추가하세요.
              type: 'info', // success / info / warning / error
              // 확인 callback 함수
              confirmCallback: () => {
                if (mode === 'insert') {
                  this.testItem.createUserId = this.$store.getters.token;
                  this.isInsert = true;
                } else if (mode === 'submit') {
                  this.testItem.updateUserId = this.$store.getters.token;
                  this.isEdit = true;
                }
              },
              // 취소 callback 함수
              cancelCallback: () => {
                if (mode === 'insert') this.isInsert = false;
                else if (mode === 'submit') this.isEdit = false;
              },
            });
          } else if (!_result) {
            this.$popupRequired.check(
              'testItemDetail',
              this.$data,
              this.errors
            );
          }
        })
        .catch(() => {
          window.getApp.$emit(
            'APP_VALID_ERROR',
            'M0000000881' // 유효성 검사도중 에러가 발생하였습니다.
          );
          if (mode === 'insert') this.isInsert = false;
          else if (mode === 'submit') this.isEdit = false;
        });
    },
    /**
     * 검진항목  목록 조회 및 수정 버튼 보이도록 처리
     *  신규등록 버튼 callback
     * _result : backend에서 return하는 데이터
     */
    btnInsertClickedCallback(_result) {
      this.testItem.heaTestItemCd = this.$_.clone(_result.data);
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // '안내',
        message: 'M0000000006', // 저장되었습니다.
        type: 'success', // success / info / warning / error
      });
      this.isInsert = false;
      this.updateMode = true;
    },
    /** 신규등록 하기전 UI단 유효성 검사 **/
    beforeInsert() {
      this._duplCheck();
      this._beforeCheck('insert');
    },
    _duplCheck() {
      var heaTestItemNms = this.$_.map(this.gridOptions.data, 'heaTestItemNm');
      if (this.$_.indexOf(heaTestItemNms, this.testItem.heaTestItemNm) > -1) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // '안내',
          message: 'M0000000416', // 이미 같은 이름의 검사항목명이 존재합니다.
          type: 'warning', // success / info / warning / error
        });
        return;
      }
    },
    /**
     * 수정 버튼 안보여지도록 처리 및 isSubmit false 처리
     *  버튼 http 통신 중 error 발생 callback
     * _result : error return하는 데이터
     */
    btnClickedErrorCallback(_result) {
      this.isInsert = false;
      this.isEdit = false;
      this.updateMode = false;
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
      this.btnClearClickedCallback();
    },
  },
};
</script>
