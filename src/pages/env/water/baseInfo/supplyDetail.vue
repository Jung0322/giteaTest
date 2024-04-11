<!--
  목적 : 공급수 관리
  작성자 : kkc (2021-02-16 수정 etg)
  Detail : 공급수 조회,등록,수정
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
            <!-- 공급수 상세 -->
            <y-label label="L0000000492" icon="user-edit" color-class="cutstom-title-color" />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 저장 -->
              <y-btn
                v-if="editable&&updateMode"
                :action-url="editUrl"
                :param="ewtrSupl"
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
                :param="ewtrSupl"
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
                v-model="ewtrSupl.plantCd"
                v-validate="'required'"
                :state="validateState('plantCd')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 공급수 분류명 -->
              <y-select
                :width="8"
                :editable="editable"
                :comboItems="supplyClassItems"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                label="L0000000489"
                name="ewtrSuplClassCd"
                v-model="ewtrSupl.ewtrSuplClassCd"
                :required="true"
                v-validate="'required'"
                :state="validateState('ewtrSuplClassCd')"
              ></y-select>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 공급수명 -->
              <y-text
                :width="8"
                :editable="editable"
                :maxlength="30"
                ui="bootstrap"
                label="L0000000494"
                name="ewtrSuplNm"
                v-model="ewtrSupl.ewtrSuplNm"
                :required="true"
                v-validate="'required'"
                :state="validateState('ewtrSuplNm')"
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
                v-model="ewtrSupl.remark"
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
                v-model="ewtrSupl.useYn"
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
  name: 'supply-detail',
  props: {
    popupParam: {
      type: Object,
      default: {
        ewtrSuplNo: 0,
      },
    },
  },
  data() {
    return {
      ewtrSupl: {
        ewtrSuplNo: 0,
        ewtrSuplClassCd: null,
        ewtrSuplNm: null,
        plantCd: null,
        plantNm: null,
        remark: '',
        sortOrder: 0,
        useYn: 'Y',
        createUserId: '',
        updateUserId: '',
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
      plantSearchItems: [],
      plantItems: [],
      supplyClassItems: [],
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
      this.editUrl = transactionConfig.env.water.baseInfo.supply.edit.url;
      this.insertUrl = transactionConfig.env.water.baseInfo.supply.insert.url;
      
      this.$comm.getComboItems('EWTR_SUPL_CLASS', false).then(_result => {
        this.supplyClassItems = _result;
      });
     
      this.getDetail();
    },
    getDetail() {
      if (this.popupParam.ewtrSuplNo === 0 || !this.popupParam.ewtrSuplNo) {
        return;
      }
      this.$http.url = this.$format(
        selectConfig.env.water.baseInfo.supply.get.url,
        this.popupParam.ewtrSuplNo
      );
      this.$http.type = 'GET';
      this.$http.request(
        _result => {
          this.updateMode = true;
          this.ewtrSupl = this.$_.clone(_result.data);
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
    beforeInsert() {
      this.updateMode = false;
      this.$http.url = selectConfig.env.water.baseInfo.supply.check.url;
      this.$http.type = 'GET';
      this.$http.param = {
        ewtrSuplNo: 0,
        plantCd: this.ewtrSupl.plantCd,
        ewtrSuplClassCd: this.ewtrSupl.ewtrSuplClassCd,
        ewtrSuplNm: this.ewtrSupl.ewtrSuplNm,
      };
      this.$http.request(
        _result => {
          if (this.$_.parseInt(_result.data.cnt) === 0) {
            this.$validator
              .validateAll()
              .then(_result => {
                if (_result) {
                  window.getApp.$emit('CONFIRM', {
                    title: 'L0000003321', // '확인',
                    message: 'M0000000011', // 저장하시겠습니까?
                    type: 'info',
                    confirmCallback: () => {
                      this.ewtrSupl.ewtrSuplNo = 0;
                      this.ewtrSupl.createUserId = this.$store.getters.token;

                      this.isInsert = true;
                    },
                  });
                } else if (!_result) {
                  this.$popupRequired.check('supplyDetail', this.$data, this.errors);
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
                'M0000000384', // '이미 입력된 사업장의 공급수 분류명에 같은 이름의 공급수명이 존재합니다.',
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
      this.$http.url = selectConfig.env.water.baseInfo.supply.check.url;
      this.$http.type = 'get';
      this.$http.param = {
        ewtrSuplNo: this.ewtrSupl.ewtrSuplNo,
        plantCd: this.ewtrSupl.plantCd,
        ewtrSuplClassCd: this.ewtrSupl.ewtrSuplClassCd,
        ewtrSuplNm: this.ewtrSupl.ewtrSuplNm,
      };
      this.$http.request(
        _result => {
          if (this.$_.parseInt(_result.data.cnt) === 0) {
            this.$validator
              .validateAll()
              .then(_result => {
                if (_result) {
                  window.getApp.$emit('CONFIRM', {
                    title: 'L0000003321', // '확인',
                    message: 'M0000000011', // 저장하시겠습니까?
                    type: 'info',
                    confirmCallback: () => {
                      this.ewtrSupl.updateUserId = this.$store.getters.token;

                      this.isEdit = true;
                    },
                  });
                } else if (!_result) {
                  this.$popupRequired.check('supplyDetail', this.$data, this.errors);
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
              title: '안내',
              message:
                'M0000000384', // '이미 입력된 사업장의 공급수 분류명에 같은 이름의 공급수명이 존재합니다.',
              type: 'warning',
            });
          }
        },
        _error => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    btnInsertClickedCallback(_result) {
      this.ewtrSupl.ewtrSuplNo = _result.data;
      this.isInsert = false;
      this.updateMode = true;
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // '안내',
        message: 'M0000000006', // '저장되었습니다.',
        type: 'success',
      });
    },
    btnEditClickedCallback(_result) {
      this.isEdit = false;
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // '안내',
        message: 'M0000000006', // '저장되었습니다.',
        type: 'success',
      });
    },
    btnClickedErrorCallback(_result) {
      this.isInsert = false;
      this.isEdit = false;
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    btnClosePopup() {
      // 부모창에 값 전달
      this.$emit('closePopup', { success: true });
    },
  },
};
</script>