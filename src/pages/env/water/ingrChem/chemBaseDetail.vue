<!--
  목적 : 수질약품 관리
  작성자 : kkc (2021-02-16 수정 etg)
  Detail : 수질약품 조회,등록,수정
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <!-- 등록 -->
    <b-row ref="insertBox">
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- 수질약품 상세 -->
            <y-label label="L0000001702" icon="user-edit" color-class="cutstom-title-color" />
            <div slot="buttonGroup" class="float-right mb-1">
            <!-- 저장 -->
            <y-btn
              v-if="editable&&!updateMode"
              :action-url="insertUrl"
              :param="ewtrChem"
              :is-submit="isInsert"
              title="L0000002474"
              color="orange"
              action-type="POST"
              beforeSubmit="beforeInsert"
              @beforeInsert="beforeInsert"
              @btnClicked="btnInsertClickedCallback"
              @btnClickedErrorCallback="btnClickedErrorCallback"
            />
            <!-- 저장 -->
            <y-btn
              v-if="editable&&updateMode"
              :action-url="editUrl"
              :param="ewtrChem"
              :is-submit="isEdit"
              title="L0000002474"
              color="orange"
              action-type="PUT"
              beforeSubmit="beforeEdit"
              @beforeEdit="beforeEdit"
              @btnClicked="btnEditClickedCallback"
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
                v-model="ewtrChem.plantCd"
                v-validate="'required'"
                :state="validateState('plantCd')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 약품일련번호 -->
              <y-text
                :width="8"
                :editable="editable"
                :maxlength="30"
                ui="bootstrap"
                label="L0000001924"
                name="ewtrChemCd"
                v-model="ewtrChem.ewtrChemCd"
                :required="true"
                v-validate="'required'"
                :state="validateState('ewtrChemCd')"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 약품명 -->
              <y-text
                :width="8"
                :editable="editable"
                :maxlength="30"
                ui="bootstrap"
                label="L0000001922"
                name="ewtrChemNm"
                v-model="ewtrChem.ewtrChemNm"
                :required="true"
                v-validate="'required'"
                :state="validateState('ewtrChemNm')"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 단위 -->
              <y-select
                :width="8"
                :editable="editable"
                :comboItems="envUnitCdItems"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                label="L0000000870"
                name="envUnitCd"
                v-model="ewtrChem.envUnitCd"
                :required="true"
                v-validate="'required'"
                :state="validateState('envUnitCd')"
              ></y-select>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
              <!-- 비고 -->
              <y-textarea
                :width="10"
                :editable="editable"
                :maxlength="150"
                ui="bootstrap"
                label="L0000001360"
                name="remark"
                v-model="ewtrChem.remark"
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
                v-model="ewtrChem.useYn"
              ></y-switch>
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
  /* attributes: name, components, props, data */
  name: 'chem-base-detail',
  props: {
    popupParam: {
      type: Object,
      default: {
        ewtrChemNo: 0,
      }
    }
  },
  data() {
    return {
      ewtrChem: {
        ewtrChemNo: 0,
        ewtrChemNm: '',
        ewtrChemCd: '',
        envUnitCd: null,
        amountCurr: null,
        remark: '',
        useYn: 'Y',
        sortOrder: '',
        plantCd: null,
        createUserId: '',
        updateUserId: '',
      },
      gridOptions: {
        header: [],
        data: [],
        height: 300,
      },
      editable: true,
      updateMode: false,
      isInsert: false,
      isEdit: false,
      envUnitCdItems: [],
      plantItems: [],
      editUrl: '',
      insertUrl: '',
      checkUrl: '',
    };
  },
  watch: {
  },
  //* Vue lifecycle: created, mounted, destroyed, etc */
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
  },
  mounted() {
    this.init();
  },
  beforeDestroy() {},
  //* methods */
  methods: {
    /** 초기화 관련 함수 **/
    init() {
      this.editable = this.$route.meta.editable;
      this.editUrl = transactionConfig.env.water.baseInfo.chemical.edit.url;
      this.insertUrl = transactionConfig.env.water.baseInfo.chemical.insert.url;

      this.$comm.getComboItems('ENV_UNIT', false).then(_result => {
        this.envUnitCdItems = _result;
      });
 
      this.getDetail();
    },
    getDetail() {
      if (this.popupParam.ewtrChemNo === 0) return;

      this.$http.url = this.$format(
        selectConfig.env.water.baseInfo.chemical.get.url,
        this.popupParam.ewtrChemNo
      );
      this.$http.type = 'GET';
      this.$http.request(
        _result => {
          this.updateMode = true;
          this.ewtrChem = this.$_.clone(_result.data);
        },
        _error => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    beforeInsert() {
      this.updateMode = false;
      this.$http.url = selectConfig.env.water.baseInfo.chemical.check.url;
      this.$http.type = 'GET';
      this.$http.param = {
        ewtrChemNo: this.popupParam.ewtrChemNo,
        plantCd: this.ewtrChem.plantCd,
        ewtrChemNm: this.ewtrChem.ewtrChemNm,
      };
      this.$http.request(
        _result => {
          if (_result.data === 0) {
            this.$validator
              .validateAll()
              .then(_result => {
                if (_result) {
                  window.getApp.$emit('CONFIRM', {
                    title: 'L0000003321', // '확인',
                    message: 'M0000000011', // 저장하시겠습니까?
                    type: 'info',
                    confirmCallback: () => {
                      this.ewtrChem.createUserId = this.$store.getters.token;
                      this.isInsert = true;
                    },
                  });
                } else if (!_result) {
                  this.$popupRequired.check('waterChemBaseDetail', this.$data, this.errors);
                }
              })
              .catch(() => {
                window.getApp.$emit(
                  'APP_VALID_ERROR',
                  'M0000000004', // '유효성 검사 중 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.'
                );
              });
          } else {
            window.getApp.$emit('ALERT', {
              title: 'L0000003395', // '안내',
              message:
                'M0000000397', // '이미 입력된 사업장의 약품코드가 존재합니다.',
              type: 'warning',
            });
          }
        },
        _error => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    beforeEdit() {
      this.$http.url = selectConfig.env.water.baseInfo.chemical.check.url;
      this.$http.type = 'GET';
      this.$http.param = {
        ewtrChemNo: this.popupParam.ewtrChemNo,
        plantCd: this.ewtrChem.plantCd,
        ewtrChemNm: this.ewtrChem.ewtrChemNm,
      };
      this.$http.request(
        _result => {
          if (_result.data === 0) {
            this.$validator
              .validateAll()
              .then(_result => {
                if (_result) {
                  window.getApp.$emit('CONFIRM', {
                    title: 'L0000003321', // '확인',
                    message: 'M0000000011', // 저장하시겠습니까?
                    type: 'info',
                    confirmCallback: () => {
                      this.ewtrChem.updateUserId = this.$store.getters.token;
                      this.isEdit = true;
                    },
                  });
                } else if (!_result) {
                  this.$popupRequired.check('waterChemBaseDetail', this.$data, this.errors);
                }
              })
              .catch(() => {
                window.getApp.$emit(
                  'APP_VALID_ERROR',
                  'M0000000004', // '유효성 검사 중 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.'
                );
              });
          } else {
            window.getApp.$emit('ALERT', {
              title: 'L0000003395', // '안내',
              message:
                'M0000000397', // '이미 입력된 사업장의 약품코드가 존재합니다.',
              type: 'warning',
            });
          }
        },
        _error => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
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
    btnInsertClickedCallback(_result) {
      this.popupParam.ewtrChemNo = _result.data;
      this.isInsert = false;
      this.updateMode = true;
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // '안내',
        message: 'M0000000006', // '저장되었습니다.',
        type: 'success',
      });
      this.getDetail();
    },
    btnEditClickedCallback(_result) {
      this.isEdit = false;
      this.updateMode = true;
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // '안내',
        message: 'M0000000006', // '저장되었습니다.',
        type: 'success',
      });
      this.getDetail();
    },
    btnClickedErrorCallback(_result) {
      this.isInsert = false;
      this.isEdit = false;
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    btnClosePopup() {
      this.$emit('closePopup', { success: true });
    },
  },
};
</script>