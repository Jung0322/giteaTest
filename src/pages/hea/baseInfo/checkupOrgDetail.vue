<template>
  <b-container fluid>
    <b-row class="mt-3" ref="editBox">
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- 검진기관 상세 -->
            <y-label
              label="L0000000360"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 저장 -->
              <y-btn
                v-if="updateMode && editable"
                :action-url="editUrl"
                :param="checkupOrgan"
                :is-submit="isEdit"
                title="L0000002474"
                color="orange"
                action-type="PUT"
                beforeSubmit="beforeSubmit"
                @beforeSubmit="beforeSubmit"
                @btnClicked="btnSaveClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!-- 신규등록 -->
              <y-btn
                v-if="editable && !updateMode"
                :action-url="insertUrl"
                :param="checkupOrgan"
                :is-submit="isInsert"
                title="L0000001789"
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
              <!-- 검진기관명 -->
              <y-text
                :width="8"
                :editable="editable"
                :maxlength="30"
                :required="true"
                ui="bootstrap"
                name="heaCheckupOrgNm"
                label="L0000000362"
                v-model="checkupOrgan.heaCheckupOrgNm"
                v-validate="'required'"
                :state="validateState('heaCheckupOrgNm')"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 사업자번호 -->
              <y-text
                :width="8"
                :editable="editable"
                :maxlength="15"
                :required="true"
                ui="bootstrap"
                name="businessNo"
                label="L0000001414"
                v-model="checkupOrgan.businessNo"
                v-validate="'required'"
                :state="validateState('businessNo')"
              ></y-text>
            </b-col>

            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- :maxlength="15" -->
              <!-- 검진기관번호 -->
              <y-text
                :width="8"
                :disabled="true"
                ui="bootstrap"
                name="heaCheckupOrgNo"
                label="L0000000363"
                v-model="checkupOrgan.heaCheckupOrgNo"
              ></y-text>
            </b-col>

            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 담당자 전화번호 -->
              <y-text
                :width="8"
                :editable="editable"
                :maxlength="15"
                :required="true"
                ui="bootstrap"
                name="telNo"
                label="L0000000894"
                v-model="checkupOrgan.telNo"
                v-validate="'required'"
                :state="validateState('telNo')"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 검진기관 담당자 -->
              <y-text
                :width="8"
                :editable="editable"
                :maxlength="30"
                ui="bootstrap"
                name="chargerNm"
                label="L0000000358"
                v-model="checkupOrgan.chargerNm"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- E-Mail -->
              <y-text
                :width="8"
                :editable="editable"
                :maxlength="30"
                ui="bootstrap"
                name="email"
                label="L0000000110"
                v-model="checkupOrgan.email"
              ></y-text>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              <!-- 주소 -->
              <y-text
                :width="10"
                :editable="editable"
                :maxlength="150"
                ui="bootstrap"
                name="address"
                label="L0000002717"
                v-model="checkupOrgan.address"
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
                v-model="checkupOrgan.useYn"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 정렬순서 -->
              <y-number
                :width="8"
                :maxlength="5"
                :editable="editable"
                :hasSeperator="false"
                :isPositive="true"
                ui="bootstrap"
                name="sortOrder"
                label="L0000002601"
                v-model="checkupOrgan.sortOrder"
              ></y-number>
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
  name: 'y-checkup-org-detail',
  props: {
    popupParam: {
      type: Object,
      default: {
        heaCheckupOrgNo: 0,
        pageNm: '',
      },
    },
  },
  data() {
    return {
      checkupOrgan: {
        heaCheckupOrgNo: '',
        heaCheckupOrgNm: '',
        address: '',
        businessNo: '',
        telNo: '',
        chargerNm: '',
        email: '',
        sortOrder: '',
        useYn: 'Y',
        updateUserId: '',
        createUserId: '',
      },
      searchParam: {
        heaCheckupOrgNm: '',
      },
      searchArea: {
        title: '검색박스숨기기',
        show: true,
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
        header: [],
        data: [],
        height: '250',
      },
      baseWidth: 9,
      editable: false,
      updateMode: false,
      isInsert: false,
      isEdit: false,
      editUrl: '',
      insertUrl: '',
      duplHeaCheckupOrgNms: [], // 중복확인용 검진기관명 배열
    };
  },
  watch: {
    // 해당 tab 들어올 때마다 그리드 사이즈 조정
    paneName() {
      // this.setGridSize();
    },
  },
  //* Vue lifecycle: created, mounted, destroyed, etc */
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {
    // 윈도우 resize event
    // window.addEventListener('resize', this.setGridSize);
  },
  beforeDestroy() {
    // 윈도우 resize event 제거-SPA 기반이므로 제거하지 않으면 다른페이지에서 해당 이벤트가 호출됨
    // window.removeEventListener('resize', this.setGridSize);
  },
  destroyed() {},
  //* methods */
  methods: {
    init() {
      this.editable = this.$route.meta.editable;
      // URL setting
      this.editUrl = transactionConfig.hea.checkupOrg.edit.url;
      this.insertUrl = transactionConfig.hea.checkupOrg.insert.url;

      if (this.popupParam.heaCheckupOrgNo !== 0) {
        this.getDetail();
      }
    },
    btnClosePopup() {
      // 부모창에 값 전달
      this.$emit('closePopup', { success: true });
    },
    getDetail() {
      // if (data === null) return;
      this.$http.url = this.$format(
        selectConfig.hea.checkupOrg.get.url,
        this.popupParam.heaCheckupOrgNo
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.updateMode = true;
          this.checkupOrgan = this.$_.clone(_result.data);
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
    /** 수정 하기전 UI단 유효성 검사 **/
    beforeSubmit() {
      this._beforeCheck('submit');
    },
    /** 신규등록 하기전 UI단 유효성 검사 **/
    beforeInsert() {
      this._beforeCheck('insert');
    },
    _beforeCheck(mode) {
      // mode: insert / submit
      let confirmMsg;

      if (mode === 'insert') confirmMsg = 'M0000000011'; // 저장하시겠습니까?
      else if (mode === 'submit') confirmMsg = 'M0000000011'; // 저장하시겠습니까?

      if (mode === 'insert') {
        if (
          this.$_.indexOf(
            this.duplHeaCheckupOrgNms,
            this.checkupOrgan.heaCheckupOrgNm
          ) > -1
        ) {
          window.getApp.$emit('ALERT', {
            title: 'L0000003395', // '안내',
            message: 'M0000000410', // 이미 같은 이름의 검진기관명이 존재합니다.
            type: 'warning', // success / info / warning / error
          });
          return;
        }
      }
      this.$validator
        .validateAll()
        .then((_result) => {
          // TODO : 전역 성공 메시지 처리
          // 이벤트는 ./event.js 파일에 선언되어 있음
          if (_result) {
            window.getApp.$emit('CONFIRM', {
              title: 'L0000003321', // '확인',
              // message: '저장하시겠습니까?' || '수정하시겠습니까?',
              message: confirmMsg,
              // TODO : 필요시 추가하세요.
              type: 'info', // success / info / warning / error
              // 확인 callback 함수
              confirmCallback: () => {
                if (mode === 'insert') {
                  this.checkupOrgan.createUserId = this.$store.getters.token;
                  this.isInsert = true;
                } else if (mode === 'submit') {
                  this.checkupOrgan.updateUserId = this.$store.getters.token;
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
              'checkupOrgDetail',
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
          if (mode === 'insert') {
            this.isInsert = false;
          } else {
            this.isEdit = false;
          }
          // this.isInsert = false;
        });
    },
    /**
     * 검진기관 조회 및 수정이 정상적으로 이루어질시 수정버튼 보이도록 처리
     *  수정 버튼 callback
     * _result : backend에서 return하는 데이터
     */
    btnSaveClickedCallback(_result) {
      this.isEdit = false;
      if (_result.data > 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // '안내',
          message: 'M0000000006', // 저장되었습니다.
          type: 'success', // success / info / warning / error
        });
        this.updateMode = true;
      } else {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // '안내',
          message: 'M0000001045', // 저장에 실패하였습니다.
          type: 'warning', // success / info / warning / error
        });
      }
    },
    btnInsertClickedCallback(_result) {
      this.isInsert = false;
      if (_result.data > 0) {
        this.checkupOrgan.heaCheckupOrgNo = _result.data;
        window.getApp.$emit('ALERT', {
          title: 'success',
          message: 'M0000000006', // 저장되었습니다.
          type: 'success', // success / info / warning / error
        });
        this.updateMode = true;
      } else {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // '안내',
          message: 'M0000001045', // 저장에 실패하였습니다.
          type: 'warning', // success / info / warning / error
        });
      }
    },
    /**
     * 수정 버튼 안보여지도록 처리 및 isSubmit false 처리
     *  버튼 http 통신 중 error 발생 callback
     * _result : error return하는 데이터
     */
    btnClickedErrorCallback(_result) {
      this.$emit('APP_REQUEST_ERROR', _result);
      this.isInsert = false;
      this.isEdit = false;
      this.updateMode = false;
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
      // window.alert("ERROR.. 담당자에게 연락바랍니다.");
    },
  },
};
</script>
