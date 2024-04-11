<!--
  목적 : 원료 관리
  작성자 : kkc (2021-02-16 수정 etg)
  Detail : 원료 조회,등록,수정
  *
  examples:
  *
  -->
  <template>
  <b-container fluid>
    <!-- 등록 -->
    <b-row class="mt-3" ref="insertBox">
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- 원료 상세 -->
            <y-label label="L0000002082" icon="user-edit" color-class="cutstom-title-color" />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 저장 -->
              <y-btn
                v-if="editable&&updateMode"
                :action-url="editUrl"
                :param="ewtrIngr"
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
                :param="ewtrIngr"
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
                v-model="ewtrIngr.plantCd"
                v-validate="'required'"
                :state="validateState('plantCd')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 원료명 -->
              <y-text
                :width="8"
                :editable="editable"
                :maxlength="30"
                ui="bootstrap"
                label="L0000002088"
                name="ewtrIngrNm"
                v-model="ewtrIngr.ewtrIngrNm"
                :required="true"
                v-validate="'required'"
                :state="validateState('ewtrIngrNm')"
              ></y-text>
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
                v-model="ewtrIngr.remark"
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
                v-model="ewtrIngr.useYn"
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
  name: 'ingredient-detail',
  props: {
    popupParam: {
      type: Object,
      default: {
        ewtrIngrNo: 0,
      },
    },
  },
  data() {
    return {
      ewtrIngr: {
        ewtrIngrNo: 0,
        ewtrIngrNm: null,
        plantCd: null,
        remark: null,
        sortOrder: null,
        useYn: 'Y',
        createUserId: null,
        updateUserId: null,
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
        height: 300,
      },
      editable: true,
      updateMode: false,
      isInsert: false,
      isEdit: false,
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
      this.editUrl = transactionConfig.env.water.baseInfo.ingredient.edit.url;
      this.insertUrl =
        transactionConfig.env.water.baseInfo.ingredient.insert.url;

      this.getDetail();
    },
    getDetail() {
      if (this.popupParam.ewtrIngrNo === 0 || !this.popupParam.ewtrIngrNo) {
        return;
      }
      this.$http.url = this.$format(
        selectConfig.env.water.baseInfo.ingredient.get.url,
        this.popupParam.ewtrIngrNo
      );
      this.$http.type = 'GET';
      this.$http.request(
        _result => {
          this.updateMode = true;
          this.ewtrIngr = this.$_.clone(_result.data);
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
    beforeEdit() {
      this.$http.url = selectConfig.env.water.baseInfo.ingredient.check.url;
      this.$http.type = 'GET';
      this.$http.param = {
        ewtrIngrNo: this.popupParam.ewtrIngrNo,
        plantCd: this.ewtrIngr.plantCd,
        ewtrIngrNm: this.ewtrIngr.ewtrIngrNm,
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
                      this.ewtrIngr.updateUserId = this.$store.getters.token;
                      this.isEdit = true;
                    },
                  });
                } else if (!_result) {
                  this.$popupRequired.check('waterIngredientDetail', this.$data, this.errors);
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
                'M0000000399', // '이미 입력된 사업장의 같은 이름의 원료가 존재합니다.',
              type: 'warning',
            });
          }
        }
      )
    },
    beforeInsert() {
      this.updateMode = false;
      this.$http.url = selectConfig.env.water.baseInfo.ingredient.check.url;
      this.$http.type = 'GET';
      this.$http.param = {
        ewtrIngrNo: this.popupParam.ewtrIngrNo,
        plantCd: this.ewtrIngr.plantCd,
        ewtrIngrNm: this.ewtrIngr.ewtrIngrNm,
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
                      this.ewtrIngr.createUserId = this.$store.getters.token;
                      this.isInsert = true;
                    },
                  });
                } else if (!_result) {
                  this.$popupRequired.check('waterIngredientDetail', this.$data, this.errors);
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
                'M0000000399', // '이미 입력된 사업장의 같은 이름의 원료가 존재합니다.',
              type: 'warning',
            });
          }
        }
      )
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
    btnInsertClickedCallback(_result) {
      this.popupParam.ewtrIngrNo = _result.data;
      this.isInsert = false;
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