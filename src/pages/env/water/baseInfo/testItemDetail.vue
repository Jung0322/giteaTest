<!--
  목적 : 검사항목 관리
  작성자 : kkc (2021-01-16 수정 etg)
  Detail : 검사항목 등록,수정
  *
  examples:
  *
  -->
  <template>
  <b-container fluid>
    <b-row class="mt-3" ref="insertBox">
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- 검사항목 상세 -->
            <y-label label="L0000000322" icon="user-edit" color-class="cutstom-title-color" />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 저장 -->
              <y-btn
                v-if="editable&&updateMode"
                :action-url="editUrl"
                :param="ewtrTestItem"
                :is-submit="isEdit"
                title="L0000002474"
                color="orange"
                action-type="PUT"
                beforeSubmit="beforeEdit"
                @beforeEdit="beforeEdit"
                @btnClicked="btnEditClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!-- 저장 -->
              <y-btn
                v-if="editable&&!updateMode"
                :action-url="insertUrl"
                :param="ewtrTestItem"
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
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-plant
                type="edit"
                :required="true"
                :editable="editable"
                name="plantCd"
                v-model="ewtrTestItem.plantCd"
                v-validate="'required'"
                :state="validateState('plantCd')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 검사항목명 -->
              <y-text
                :width="8"
                :editable="editable"
                :maxlength="30"
                ui="bootstrap"
                label="L0000000325"
                name="ewtrTestItemNm"
                v-model="ewtrTestItem.ewtrTestItemNm"
                :required="true"
                v-validate="'required'"
                :state="validateState('ewtrTestItemNm')"
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
                v-model="ewtrTestItem.envUnitCd"
                :required="true"
                v-validate="'required'"
                :state="validateState('envUnitCd')"
              ></y-select>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 구분 -->
              <y-select
                :width="8"
                :editable="editable"
                :comboItems="inputTypeCdItems"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                label="L0000000686"
                name="inputTypeCd"
                v-model="ewtrTestItem.inputTypeCd"
                :required="true"
                v-validate="'required'"
                :state="validateState('inputTypeCd')"
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
                v-model="ewtrTestItem.remark"
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
                v-model="ewtrTestItem.useYn"
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
  name: 'test-item-detail',
  props: {
    popupParam: {
      type: Object,
      default: {
        ewtrTestItemCd: 0,
      },
    },
  },
  data() {
    return {
      ewtrTestItem: {
        ewtrTestItemNm: '',
        envUnitCd: null,
        remark: '',
        sortOrder: '',
        useYn: 'Y',
        createUserId: '',
        updateUserId: '',
        plantCd: null,
        plantNm: null,
        inputTypeCd: null,
      },
      gridOptions: {
        header: [],
        data: [],
        height: 300,
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
      selectTestItem: null,
      editable: true,
      updateMode: false,
      isInsert: false,
      isEdit: false,
      envUnitCdItems: [],
      inputTypeCdItems: [],
      editUrl: '',
      insertUrl: '',
    };
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
    init() {
      this.editable = this.$route.meta.editable;
      this.editUrl = transactionConfig.env.water.baseInfo.testItem.edit.url;
      this.insertUrl = transactionConfig.env.water.baseInfo.testItem.insert.url;

      this.$comm.getComboItems('ENV_UNIT', false).then(_result => {
        this.envUnitCdItems = _result;
      });
      this.$comm.getComboItems('COM_INPUT_TYPE', false).then(_result => {
        this.inputTypeCdItems = _result;
      });

      this.getDetail();
    },
    getDetail() {
      if (this.popupParam.ewtrTestItemCd === 0 || !this.popupParam.ewtrTestItemCd) {
        return;
      }
      this.$http.url = this.$format(
        selectConfig.env.water.baseInfo.testItem.get.url,
        this.popupParam.ewtrTestItemCd
      );
      this.$http.type = 'GET';
      this.$http.request(
        _result => {
          this.updateMode = true;
          this.ewtrTestItem = this.$_.clone(_result.data);
        },
        _error => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    beforeEdit() {
      this.$http.url = selectConfig.env.water.baseInfo.testItem.check.url;
      this.$http.type = 'GET';
      this.$http.param = {
        ewtrTestItemCd: this.popupParam.ewtrTestItemCd,
        plantCd: this.ewtrTestItem.plantCd,
        ewtrTestItemNm: this.ewtrTestItem.ewtrTestItemNm,
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
                      this.ewtrTestItem.updateUserId = this.$store.getters.token;
                      this.isEdit = true;
                    },
                  });
                } else if (!_result) {
                  this.$popupRequired.check('waterTestItemDetail', this.$data, this.errors);
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
                'M0000000386', // '이미 입력된 사업장의 검사항목명이 존재합니다.',
              type: 'warning',
            });
          }
        },
        _error => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      )
    },
    beforeInsert() {
      this.updateMode = false;
      this.$http.url = selectConfig.env.water.baseInfo.testItem.check.url;
      this.$http.type = 'GET';
      this.$http.param = {
        ewtrTestItemCd: 0,
        plantCd: this.ewtrTestItem.plantCd,
        ewtrTestItemNm: this.ewtrTestItem.ewtrTestItemNm,
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
                      this.ewtrTestItem.ewtrTestItemCd = 0;
                      this.ewtrTestItem.createUserId = this.$store.getters.token;
                      this.isInsert = true;
                    },
                  });
                } else if (!_result) {
                  this.$popupRequired.check('waterTestItemDetail', this.$data, this.errors);
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
                'M0000000386', // '이미 입력된 사업장의 검사항목명이 존재합니다.',
              type: 'warning',
            });
          }
        },
        _error => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      )
    },
    btnInsertClickedCallback(_result) {
      this.popupParam.ewtrTestItemCd = _result.data;
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
    validateState(ref) {
      if (
        this.veeBag[ref] &&
        (this.veeBag[ref].dirty || this.veeBag[ref].validated)
      ) {
        return !this.errors.has(ref);
      }
      return null;
    },
    btnClosePopup() {
      this.$emit('closePopup', { success: true });
    },
  },
};
</script>