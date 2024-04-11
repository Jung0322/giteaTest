<!--
  목적 : 환경 > 대기 > 기준정보 > 약품 > 상세
  작성자 : jkl
  Detail : 대기 약품항목 관리
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
            <!-- 약품 정보 -->
            <y-label label="L0000001920" icon="user-edit" color-class="cutstom-title-color" />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 저장 -->
              <y-btn
                v-if="editable"
                :action-url="saveUrl"
                :param="chemBase"
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
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <y-plant
                type="edit"
                :required="true"
                :editable="editable"
                name="plantCd"
                v-model="chemBase.plantCd"
                v-validate="'required'"
                :state="validateState('plantCd')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 약품명 -->
              <y-text
                :width="8"
                :editable="editable"
                :required="true"
                :maxlength="30"
                ui="bootstrap"
                label="L0000001922"
                name="eairChemNm"
                v-model="chemBase.eairChemNm"
                v-validate="'required'"
                :state="validateState('eairChemNm')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 단위 -->
              <y-select
                :width="8"
                :comboItems="envUnitCdItems"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                label="L0000000870"
                name="envUnitCd"
                v-model="chemBase.envUnitCd"
                :required="true"
                v-validate="'required'"
                :state="validateState('envUnitCd')"
              ></y-select>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-8">
              <!-- 비고 -->
              <y-textarea
                :width="10"
                :editable="editable"
                :maxlength="200"
                ui="bootstrap"
                label="L0000001360"
                name="remark"
                v-model="chemBase.remark"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
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
                v-model="chemBase.useYn"
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
  name: 'air-chem-base-detail',
  props: {
    popupParam: {
      type: Object,
      default: {
        eairChemCd: null,
      },
    },
  },
  data() {
    return {
      chemBase: {
        eairChemCd: null,
        eairChemNm: null,
        plantCd: null,
        envUnitCd: null,
        remark: null,
        useYn: 'Y',
        sortOrder: null,
        createUserId: null,
        createDt: null,
        updateUserId: null,
        updateDt: null,
      },
      editable: false,
      isSave: false,
      actionType: 'POST',
      saveUrl: '',
      detailUrl: '',
      checkUrl: '',

      envUnitCdItems: [],
    };
  },
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.editable = this.$route.meta.editable;

      // 단위
      this.$comm.getComboItems('EAIR_CHEM_UNIT', false).then(_result => {
        this.envUnitCdItems = _result;
      });

      this.saveUrl = transactionConfig.env.air.baseInfo.chemBase.insert.url;
      this.detailUrl = selectConfig.env.air.baseInfo.chemBase.get.url;
      this.checkUrl = selectConfig.env.air.baseInfo.chemBase.check.url;

      if (this.popupParam.eairChemCd) {
        this.chemBase.eairChemCd = this.popupParam.eairChemCd;
        this.getDetail();
      }
    },
    getDetail() {
      this.$http.url = this.$format(this.detailUrl, this.chemBase.eairChemCd);
      this.$http.type = 'GET';
      this.$http.request(
        _result => {
          this.chemBase = _result.data;
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
      if (this.chemBase.eairChemCd) {
        // 수정
        flag = 'update';
        this.actionType = 'PUT';
        this.saveUrl = transactionConfig.env.air.baseInfo.chemBase.edit.url;
      } else {
        // 신규등록
        flag = 'insert';
        this.actionType = 'POST';
        this.saveUrl = transactionConfig.env.air.baseInfo.chemBase.insert.url;
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
              eairChemCd: flag === 'insert' ? null : this.chemBase.eairChemCd,
              eairChemNm: this.chemBase.eairChemNm,
              plantCd: this.chemBase.plantCd,
            };
            this.$http.request(
              _result => {
                if (_result.data > 0) {
                  window.getApp.$emit('ALERT', {
                    title: 'L0000003395', // '안내',
                    message: 'M0000000295', // '이미 같은 이름의 약품명이 있습니다.',
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
                        this.chemBase.createUserId = this.$store.getters.token;
                      } else {
                        this.chemBase.updateUserId = this.$store.getters.token;
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
            this.$popupRequired.check('chemBaseDetail', this.$data, this.errors);
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