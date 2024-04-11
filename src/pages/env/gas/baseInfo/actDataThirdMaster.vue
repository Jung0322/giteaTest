<template>
  <b-container fluid>
    <b-row>
      <!-- 안전정보 분류 등록/수정 -->
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- 소분류 상세 -->
            <y-label
              label="L0000004482"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 저장 -->
              <y-btn
                v-if="editable"
                title="L0000002474"
                color="orange"
                @btnClicked="btnSaveClicked"
              />
              <!-- 닫기 -->
              <y-btn title="L0000000881" @btnClicked="closePopup" />
            </div>
          </b-col>
        </b-row>
        <b-card>
          <b-row>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 대분류명 -->
              <y-select
                :width="8"
                :editable="editable"
                :comboItems="categoryCdItems2"
                itemText="actDataNm"
                itemValue="actDataCd"
                :required="true"
                ui="bootstrap"
                label="L0000000915"
                name="ppActDataCd"
                v-model="safetyInfoMaster3.ppActDataCd"
                v-validate="'required'"
                :state="validateState('ppActDataCd')"
                @datachange="dataChange2"
              ></y-select>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 중분류명 -->
              <y-select
                :width="8"
                :editable="editable"
                :comboItems="categoryCdItems3"
                itemText="actDataNm"
                itemValue="actDataCd"
                :required="true"
                ui="bootstrap"
                label="L0000002731"
                name="pActDataCd"
                v-model="safetyInfoMaster3.pActDataCd"
                v-validate="'required'"
                :state="validateState('pActDataCd')"
              ></y-select>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 활동자료코드 -->
              <y-text
                :width="8"
                :editable="editable"
                :required="true"
                :disabled="isSave"
                ui="bootstrap"
                label="L0000003353"
                name="actDataCd"
                v-model="safetyInfoMaster3.actDataCd"
                v-validate="'required'"
                :state="validateState('actDataCd')"
                @input="formatInput"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 활동자료명 -->
              <y-text
                :width="8"
                :editable="editable"
                :required="true"
                ui="bootstrap"
                label="L0000003350"
                :maxlength="250"
                name="actDataNm"
                v-model="safetyInfoMaster3.actDataNm"
                v-validate="'required'"
                :state="validateState('actDataNm')"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 정렬순서 -->
              <y-number
                :width="8"
                :editable="editable"
                :isPositive="true"
                ui="bootstrap"
                label="L0000002601"
                name="sortOrder"
                v-model="safetyInfoMaster3.sortOrder"
              ></y-number>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 사용여부, 사용/미사용 -->
              <y-switch
                :width="8"
                true-value="Y"
                :editable="editable"
                false-value="N"
                ui="bootstrap"
                label="L0000001439"
                name="useYn"
                selectText="L0000001440"
                unselectText="L0000001063"
                v-model="safetyInfoMaster3.useYn"
              ></y-switch>
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
  /** attributes: name, components, props, data **/
  name: 'act-data-third-master',
  props: {
    popupParam: {
      type: Object,
      default: {
        actDataCd: null,
      },
    },
  },
  data: () => ({
    safetyInfoMaster3: {
      actDataCd: null,
      dataLvlCd: 'ECL03',
      actClsCd: null,
      pActDataCd: null,
      pActDataNm: null,
      ppActDataCd: null,
      ppActDataNm: null,
      actDataNm: null,
      useYn: 'Y',
      sortOrder: '',
      createUserId: null,
      updateUserId: null,
    },
    categoryCdItems2: [],
    categoryCdItems3: [],

    editable: false,
    isSave: false,
  }),
  computed: {},
  watch: {
    'safetyInfoMaster3.ppActDataCd'() {
      this.getItems3();
    },
  },
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
  },
  mounted() {
    this.init();
  },
  /** methods **/
  methods: {
    /** 초기화 관련 함수 **/
    init() {
      this.editable = this.$route.meta.editable;
      this.categoryCdItems3.splice(0, 0, {
        actDataNm: this.$comm.getLangSpecInfoLabel('L0000003394'), // 선택하세요
        actDataCd: null,
      });
      this.getDetail();
      this.getItems2();
      if (this.popupParam.actDataCd) {
        this.isSave = true;
      }
    },
    formatInput(text) {
      // text에 부모 input에 넣는 값이 들어옵니다.
      // 한글 테스트 정규식
      const notPhoneticSymbolExp = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;
      if (!notPhoneticSymbolExp.test(text)) {
        this.safetyInfoMaster3.actDataCd = text;
      } else {
        // 한글이 빠른 시간에 여러개 들어오는 경우도 있으니,한글이 없을 때까지 삭제하고, 검사
        setTimeout(() => {
          text = text.slice(0, -1);
          let condition = notPhoneticSymbolExp.test(text);
          while (condition) {
            text = text.slice(0, -1);
            condition = notPhoneticSymbolExp.test(text);
          }
          this.safetyInfoMaster3.actDataCd = text;
        }, 50);
      }
    },
    getItems2() {
      this.$http.url = this.$format(
        selectConfig.env.gas.actDataMaster.items.url,
        'ECL01',
        null,
        null
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.categoryCdItems2 = this.$_.clone(_result.data);
          this.categoryCdItems2.splice(0, 0, {
            actDataCd: null,
            actDataNm: this.$comm.getLangSpecInfoLabel('L0000003394'), // 선택하세요
          });
        },
        (_error) => {
          window.getApp.$emit(
            'APP_REQUEST_ERROR',
            'M0000000016' // 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.
          );
        }
      );
    },
    getItems3() {
      this.$http.url = this.$format(
        selectConfig.env.gas.actDataMaster.items.url,
        'ECL02',
        this.safetyInfoMaster3.ppActDataCd,
        null
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.categoryCdItems3 = this.$_.clone(_result.data);
          this.categoryCdItems3.splice(0, 0, {
            actDataCd: null,
            actDataNm: this.$comm.getLangSpecInfoLabel('L0000003394'), // 선택하세요
          });
        },
        (_error) => {
          window.getApp.$emit(
            'APP_REQUEST_ERROR',
            'M0000000016' // 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.
          );
        }
      );
    },
    getDetail() {
      return new Promise((_resolve, _reject) => {
        if (this.popupParam.actDataCd) {
          this.$http.url = this.$format(
            selectConfig.env.gas.actDataMaster.get.url,
            this.popupParam.actDataCd
          );
          this.$http.type = 'GET';
          this.$http.request(
            (_result) => {
              this.safetyInfoMaster3 = this.$_.clone(_result.data[2]);
              this.safetyInfoMaster3.ppActDataCd = _result.data[0].actDataCd;
              this.popupParam.actDataCd = _result.data[2].actDataCd;
              setTimeout(() => {
                this.safetyInfoMaster3.pActDataCd = _result.data[1].actDataCd;
              }, 300);
              _resolve(true);
            },
            (_error) => {
              window.getApp.$emit('APP_REQUEST_ERROR', _error);
              _reject(_error);
            }
          );
        }
      });
    },
    btnSaveClicked() {
      this.$comm.recursivePromise([
        {
          func: this.checkValidation,
          exceptionMessage: this.$comm.getLangSpecInfoLabel('M0000000005'),
        }, // '필수 입력값을 입력해 주세요.',
        { func: this.checkOverlap },
        {
          func: this.confirm,
          param: this.$comm.getLangSpecInfoLabel('M0000000011'),
        }, // 저장하시겠습니까?
        { func: this.saveData },
        {
          func: this.getDetail,
          successMessage: this.$comm.getLangSpecInfoLabel('M0000000006'),
        }, // 저장되었습니다.
      ]);
    },
    checkOverlap() {
      return new Promise((_resolve, _reject) => {
        if (!this.popupParam.actDataCd) {
          this.$http.url = this.$format(
            selectConfig.env.gas.actDataMaster.check.url,
            this.popupParam.actDataCd
              ? this.popupParam.actDataCd
              : this.safetyInfoMaster3.actDataCd
          );
          this.$http.type = 'GET';
          this.$http.request(
            (_result) => {
              if (_result.data > 0) {
                window.getApp.$emit('ALERT', {
                  title: 'L0000003321', // '확인',
                  message: 'M0000000344', // 소분류코드가 이미 존재합니다.
                  type: 'warning',
                });
                _resolve(false);
              } else {
                _resolve(true);
              }
            },
            (_error) => {
              window.getApp.$emit(
                'APP_REQUEST_ERROR',
                'M0000000016' // 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.
              );
              _resolve(false);
            }
          );
        } else {
          _resolve(true);
        }
      });
    },
    confirm() {
      return new Promise((_resolve, _reject) => {
        window.getApp.$emit('CONFIRM', {
          title: 'L0000003321', // '확인',
          message: 'M0000000011', // 저장하시겠습니까?
          type: 'info',
          confirmCallback: () => {
            _resolve(true);
          },
          cancelCallback: () => {
            _resolve(false);
          },
        });
      });
    },
    saveData() {
      return new Promise((_resolve, _reject) => {
        if (this.popupParam.actDataCd) {
          this.$http.url = transactionConfig.env.gas.actDataMaster.update.url;
          this.$http.type = 'PUT';
          this.safetyInfoMaster3.updateUserId = this.$store.getters.token;
        } else {
          this.$http.url = transactionConfig.env.gas.actDataMaster.insert.url;
          this.$http.type = 'POST';
        }
        this.safetyInfoMaster3.createUserId = this.$store.getters.token;
        this.$http.param = this.safetyInfoMaster3;
        this.popupParam.actDataCd = this.safetyInfoMaster3.actDataCd;
        this.$http.request(
          (_result) => {
            this.completeMode = true;
            this.isSave = true;
            _resolve(true);
          },
          (_error) => {
            window.getApp.$emit('APP_REQUEST_ERROR', _error);
            _reject(_error);
          }
        );
      });
    },
    dataChange2(data) {
      this.safetyInfoMaster3.pActDataCd = null;
      this.getItems3();
    },
    checkValidation() {
      return this.$validator.validateAll();
    },
    validateState(ref) {
      if (
        this.veeBag[ref] &&
        (this.veeBag[ref].dirty || this.veeBag[ref].validated)
      ) {
        return !this.errors.has(ref);
      }
      return null;
    },
    closePopup() {
      this.$emit('closePopup');
    },
  },
};
</script>
