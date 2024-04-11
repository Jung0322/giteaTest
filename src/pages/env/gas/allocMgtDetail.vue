<template>
  <b-container fluid>
    <b-row>
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- 할당량 등록 -->
            <y-label
              label="L0000004438"
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
              <y-btn title="L0000000881" @btnClicked="btnClosePopup" />
            </div>
          </b-col>
        </b-row>
        <b-card>
          <b-row>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-plant
                :editable="editable"
                :disabled="disabled"
                :required="true"
                type="edit"
                name="plantCd"
                v-model="ghgAlloc.plantCd"
                v-validate="'required'"
                :state="validateState('plantCd')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 대상연도 -->
              <y-datepicker
                :width="8"
                :editable="editable"
                :disabled="disabled"
                :required="true"
                type="year"
                label="L0000004432"
                ui="bootstrap"
                name="year"
                v-validate="'required'"
                :state="validateState('year')"
                v-model="ghgAlloc.year"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 전년도 이월량(tCO2-eq) -->
              <y-number
                :editable="editable"
                :width="8"
                :pointNumber="2"
                label="L0000004433"
                ui="bootstrap"
                name="prevAmount"
                v-model="ghgAlloc.prevAmount"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 할당량(tCO2-eq) -->
              <y-number
                :editable="editable"
                :width="8"
                :pointNumber="2"
                label="L0000004434"
                ui="bootstrap"
                name="amount"
                v-model="ghgAlloc.amount"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 월 예상배출량(tCO2-eq) -->
              <y-number
                :editable="editable"
                :width="8"
                :pointNumber="2"
                label="L0000004435"
                ui="bootstrap"
                name="estEmissions"
                v-model="ghgAlloc.estEmissions"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 차년도 이월량(tCO2-eq) -->
              <y-number
                :editable="editable"
                :width="8"
                :pointNumber="2"
                label="L0000004436"
                ui="bootstrap"
                name="nextAmount"
                v-model="ghgAlloc.nextAmount"
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
  name: 'y-gas-type-detail',
  props: {
    popupParam: {
      type: Object,
      default: {
        ghgAllocNo: 0,
      },
    },
  },
  data() {
    return {
      ghgAlloc: {
        ghgAllocNo: 0,
        plantCd: '',
        year: '',
        prevAmount: '',
        amount: '',
        estEmissions: 'Y',
        nextAmount: '',
        createUserId: '',
        createDt: '',
        updateUserId: '',
        updateDt: '',
      },
      insertUrl: '',
      editUrl: '',

      editable: false,
      disabled: false,
    };
  },
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
  },
  mounted() {
    this.init();
  },
  beforeDestroy() {},
  /** methods **/
  methods: {
    // 초기화
    init() {
      this.editable = this.$route.meta.editable;

      this.ghgAlloc.year = this.$comm.moment().format('YYYY');
      if (this.popupParam.ghgAllocNo) {
        this.ghgAlloc.ghgAllocNo = this.popupParam.ghgAllocNo;
        this.disabled = true;
        this.getDetail();
      }
    },

    /** validation checking **/
    // 저장 버튼 클릭
    btnSaveClicked() {
      this.$validator
        .validateAll()
        .then(_result => {
          if (_result) {
            this.$comm.recursivePromise([
              {
                func: this.checkValidation,
                exceptionMessage: this.$comm.getLangSpecInfoLabel('M0000000005'), // 필수 입력값을 입력해 주세요.
              },
              { func: this.checDuple },
              { func: this.confirm, param: this.$comm.getLangSpecInfoLabel('M0000000011') },  // 저장하시겠습니까?
              { func: this.saveData },
              { func: this.getDetail, successMessage: this.$comm.getLangSpecInfoLabel('M0000000006') }, // 저장되었습니다.
            ]);
          } else if (!_result) {
            this.$popupRequired.check('allocMgtDetail', this.$data, this.errors);
          }
        })
        .catch(() => {
          window.getApp.$emit(
            'APP_VALID_ERROR',
            'M0000000881', // 유효성 검사도중 에러가 발생하였습니다.
          );
          this.isInsert = false;
        });
    },
    checkValidation() {
      return this.$validator.validateAll();
    },
    checDuple() {
      return new Promise((_resolve, _reject) => {
        if (!this.ghgAlloc.ghgAllocNo) {
          this.$http.url = this.$format(
            selectConfig.env.gas.alloc.check.url,
            this.ghgAlloc.plantCd,
            this.ghgAlloc.year
          );
          this.$http.type = 'GET';
          this.$http.request(
            _result => {
              if (_result.data > 0) {
                window.getApp.$emit('ALERT', {
                  title: 'L0000003321', // '확인',
                  message: 'M0000001053', // 해당사업장에 대상연도가 이미 존재합니다.
                  type: 'warning',
                });
                _resolve(false);
              } else {
                _resolve(true);
              }
            },
            _error => {
              window.getApp.$emit(
                'APP_REQUEST_ERROR',
                'M0000000016', // 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.
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
        if (this.ghgAlloc.ghgAllocNo) {
          this.$http.type = 'PUT';
          this.ghgAlloc.updateUserId = this.$store.getters.token;
        } else {
          this.$http.type = 'POST';
          this.ghgAlloc.createUserId = this.$store.getters.token;
        }
        this.$http.url = transactionConfig.env.gas.alloc.edit.url;
        this.$http.param = this.ghgAlloc;
        this.$http.request(
          _result => {
            this.ghgAlloc.ghgAllocNo = _result.data;
            _resolve(true);
          },
          _error => {
            window.getApp.$emit('APP_REQUEST_ERROR', _error);
            _reject(_error);
          }
        );
      });
    },
    getDetail() {
      return new Promise((_resolve, _reject) => {
        if (this.ghgAlloc.ghgAllocNo) {
          this.$http.url = this.$format(
            selectConfig.env.gas.alloc.get.url,
            this.ghgAlloc.ghgAllocNo
          );
          this.$http.type = 'GET';
          this.$http.request(
            _result => {
              this.ghgAlloc = this.$_.clone(_result.data);
              _resolve(true);
            },
            _error => {
              window.getApp.$emit('APP_REQUEST_ERROR', _error);
              _reject(_error);
            }
          );
        }
      });
    },

    // 창 닫기
    btnClosePopup() {
      this.$emit('closePopup');
    },
    // 필수값 주기
    validateState(_ref) {
      if (
        this.veeBag[_ref] &&
        (this.veeBag[_ref].dirty || this.veeBag[_ref].validated)
      ) {
        return !this.errors.has(_ref);
      }
      return null;
    },
  },
};
</script>

<style></style>
