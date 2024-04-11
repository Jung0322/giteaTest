<!--
  목적 : 환경 > 대기 > 기준정보 > 연료 > 상세
  작성자 : jkl
  Detail : 대기 연료 상세보기 등록/수정
  *
  examples:
  *
  -->
  <template>
  <b-container fluid>
    <b-row class="mt-3" ref="detailBox">
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- 연료 정보 -->
            <y-label label="L0000001999" icon="user-edit" color-class="cutstom-title-color" />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 저장 -->
              <y-btn
                v-if="editable"
                :action-url="saveUrl"
                :param="fuel"
                :is-submit="isSave"
                title="L0000002474"
                color="orange"
                :action-type="actionType"
                beforeSubmit="beforeSave"
                @beforeSave="beforeSave"
                @btnClicked="btnSaveClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
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
                type="edit"
                :required="true"
                :editable="editable"
                name="plantCd"
                v-model="fuel.plantCd"
                v-validate="'required'"
                :state="validateState('plantCd')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 연료명 -->
              <y-text
                :width="8"
                :editable="editable"
                :required="true"
                :maxlength="30"
                ui="bootstrap"
                label="L0000002000"
                name="eairFuelNm"
                v-model="fuel.eairFuelNm"
                v-validate="'required'"
                :state="validateState('eairFuelNm')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 단위 -->
              <y-select
                :width="8"
                :editable="editable"
                :required="true"
                :comboItems="envUnitCdItems"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                name="envUnitCd"
                label="L0000000870"
                v-model="fuel.envUnitCd"
                v-validate="'required'"
                :state="validateState('envUnitCd')"
              ></y-select>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 황함량(%) -->
              <y-number
                :width="8"
                :editable="editable"
                :required="true"
                :maxlength="5"
                :hasSeperator="false"
                :pointNumber="2"
                ui="bootstrap"
                label="L0000003358"
                name="sulfurContent"
                v-model="fuel.sulfurContent"
                v-validate="'required'"
                :state="validateState('sulfurContent')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 발열량 -->
              <y-number
                :width="8"
                :editable="editable"
                :required="true"
                :maxlength="7"
                :hasSeperator="false"
                :pointNumber="0"
                ui="bootstrap"
                label="L0000001101"
                name="calVal"
                v-model="fuel.calVal"
                v-validate="'required'"
                :state="validateState('calVal')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 발열량단위 -->
              <y-select
                :width="8"
                :editable="editable"
                :required="true"
                :comboItems="calValUnitCds"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                name="envUnitCd"
                label="L0000001102"
                v-model="fuel.calValUnitCd"
                v-validate="'required'"
                :state="validateState('calValUnitCd')"
              ></y-select>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- SEMS 코드 -->
              <y-text
                :width="8"
                :editable="editable"
                :maxlength="30"
                ui="bootstrap"
                label="L0000000161"
                name="semsCd"
                v-model="fuel.semsCd"
              />
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
              <!-- 비고 -->
              <y-textarea
                :width="10"
                :editable="editable"
                :maxlength="200"
                ui="bootstrap"
                label="L0000001360"
                name="remark"
                v-model="fuel.remark"
                :rows="2"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 사용여부 -->
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
                v-model="fuel.useYn"
              />
              <!-- L0000001440: 사용 -->
              <!-- L0000001063: 미사용 -->
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
  name: 'fuel-detail',
  props: {
    popupParam: {
      type: Object,
      default: {
        eairFuelCd: null,
      },
    },
  },
  data() {
    return {
      fuel: {
        eairFuelCd: null,
        eairFuelNm: null,
        plantCd: null,
        envUnitCd: null,
        sulfurContent: null,
        calVal: null,
        calValUnitCd: null,
        remark: '',
        sortOrder: null,
        useYn: 'Y',
        createUserId: '',
        createDt: '',
        updateUserId: '',
        updateDt: '',
      },
      editable: false,
      isSave: false,
      actionType: 'POST',
      saveUrl: '',
      detailUrl: '',
      checkUrl: '',

      envUnitCdItems: [], // 단위
      calValUnitCds: [], // 발열량단위
    };
  },
  watch: {},
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
  },
  mounted() {
    this.init();
  },
  beforeDestory() {},
  methods: {
    init() {
      this.editable = this.$route.meta.editable;

      // 단위
      this.$comm.getComboItems('EAIR_FUEL_UNIT', false).then(_result => {
        this.envUnitCdItems = _result;
      });
      // 발영량단위
      this.$comm.getComboItems('EAIR_CAL_VAL_UNIT', false).then(_result => {
        this.calValUnitCds = _result;
      });

      this.saveUrl = transactionConfig.env.air.baseInfo.fuel.insert.url;
      this.detailUrl = selectConfig.env.air.baseInfo.fuel.get.url;
      this.checkUrl = selectConfig.env.air.baseInfo.fuel.check.url;

      if (this.popupParam.eairFuelCd) {
        this.fuel.eairFuelCd = this.popupParam.eairFuelCd;
        this.getDetail();
      }
    },
    getDetail() {
      this.$http.url = this.$format(this.detailUrl, this.fuel.eairFuelCd);
      this.$http.type = 'GET';
      this.$http.request(
        _result => {
          this.fuel = _result.data;
        },
        _error => {
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
    beforeSave() {
      let flag = '';
      if (this.fuel.eairFuelCd) {
        // 수정
        flag = 'update';
        this.actionType = 'PUT';
        this.saveUrl = transactionConfig.env.air.baseInfo.fuel.edit.url;
      } else {
        // 신규등록
        flag = 'insert';
        this.actionType = 'POST';
        this.saveUrl = transactionConfig.env.air.baseInfo.fuel.insert.url;
      }
      this.check(flag);
    },
    check(flag) {
      this.$validator
        .validateAll()
        .then(_result => {
          if (_result) {
            this.$http.url = this.checkUrl;
            this.$http.type = 'GET';
            this.$http.param = {
              eairFuelCd: flag === 'insert' ? null : this.fuel.eairFuelCd,
              eairFuelNm: this.fuel.eairFuelNm,
              plantCd: this.fuel.plantCd,
            };
            this.$http.request(
              _result => {
                if (_result.data > 0) {
                  window.getApp.$emit('ALERT', {
                    title: 'L0000003395', // '안내',
                    message: 'M0000000300', // '이미 같은 이름의 연료명이 있습니다.',
                    type: 'warning',
                  });
                  return;
                } else {
                  window.getApp.$emit('CONFIRM', {
                    title: 'L0000003321', // '확인',
                    message: 'M0000000011', // 저장하시겠습니까?
                    type: 'info',
                    confirmCallback: () => {
                      if (flag === 'insert') {
                        this.fuel.createUserId = this.$store.getters.token;
                      } else {
                        this.fuel.updateUserId = this.$store.getters.token;
                      }
                      this.isSave = true;
                    },
                  });
                }
              },
              _error => {
                window.getApp.$emit('APP_REQUEST_ERROR', _error);
              }
            );
          } else if (!_result) {
            this.isSave = false;
            this.$popupRequired.check('fuelDetail', this.$data, this.errors);
          }
        })
        .catch(() => {
          this.isSave = false;
          window.getApp.$emit(
            'APP_VALID_ERROR',
            'M0000000004', // '유효성 검사 중 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.'
          );
        });
    },
    btnSaveClickedCallback(_result) {
      this.isSave = false;
      this.fuel.eairFuelCd = _result.data;
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // '안내',
        message: 'M0000000006', // '저장되었습니다.',
        type: 'success',
      });
    },
    btnClickedErrorCallback(_result) {
      this.isSave = false;
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    btnClosePopup() {
      // 부모창에 값 전달
      this.$emit('closePopup', { success: true });
    },
  },
};
</script>