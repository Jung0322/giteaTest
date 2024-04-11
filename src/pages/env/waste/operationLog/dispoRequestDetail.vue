<!--
  목적 : 폐기물-폐기물 처리요청
  작성자 : khk
  Detail : 폐기물-폐기물 처리요청 상세 - 등록, 수정
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <b-row class="mt-3">
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- 폐기물 처리요청 -->
            <y-label
              label="L0000003115"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 저장 -->
              <y-btn
                v-if="editable && updateMode && disposalRequest.requestEditable"
                :action-url="editUrl"
                :param="disposalRequest"
                :is-submit="isUpdateSubmit"
                title="L0000002474"
                color="orange"
                action-type="put"
                beforeSubmit="beforeUpdateSubmit"
                @beforeUpdateSubmit="beforeUpdateSubmit"
                @btnClicked="btnUpdateClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!-- 저장 -->
              <y-btn
                v-if="
                  editable && disposalRequest.requestEditable && !updateMode
                "
                :action-url="insertUrl"
                :param="disposalRequest"
                :is-submit="isCreateSubmit"
                title="L0000002474"
                color="orange"
                action-type="post"
                beforeSubmit="beforeCreateSubmit"
                @beforeCreateSubmit="beforeCreateSubmit"
                @btnClicked="btnCreateClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!-- 삭제 -->
              <y-btn
                v-if="editable && updateMode && disposalRequest.requestEditable"
                title="L0000001495"
                color="red"
                @btnClicked="btnDeleteClicked"
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
                :editable="editable && disposalRequest.requestEditable"
                name="plantCd"
                v-model="disposalRequest.plantCd"
                v-validate="'required'"
                :state="validateState('plantCd')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 폐기물 분류 -->
              <y-select
                :width="8"
                :editable="editable && disposalRequest.requestEditable"
                :comboItems="ewstClassCdItems"
                itemText="ewstClassNm"
                itemValue="ewstClassCd"
                ui="bootstrap"
                name="ewstClassCd"
                label="L0000003106"
                v-model="disposalRequest.ewstClassCd"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 폐기물 -->
              <y-select
                :width="8"
                :editable="editable && disposalRequest.requestEditable"
                :required="true"
                :comboItems="ewstWasteNoItems"
                itemText="ewstWasteNm"
                itemValue="ewstWasteNo"
                ui="bootstrap"
                name="ewstWasteNo"
                label="L0000003102"
                v-validate="'required'"
                :state="validateState('ewstWasteNo')"
                v-model="disposalRequest.ewstWasteNo"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 요청일 -->
              <y-datepicker
                :width="8"
                :editable="editable && disposalRequest.requestEditable"
                :required="true"
                label="L0000002055"
                name="reqYmd"
                v-model="disposalRequest.reqYmd"
                v-validate="'required'"
                :state="validateState('reqYmd')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 요청자 -->
              <y-text
                :width="8"
                :editable="editable && disposalRequest.requestEditable"
                :readonly="true"
                :required="true"
                ui="bootstrap"
                label="L0000002057"
                name="displayReqUser"
                v-model="displayReqUser"
                v-validate="'required'"
                :state="validateState('displayReqUser')"
                :appendIcon="[{ icon: 'search', callbackName: 'searchUser' }]"
                @searchUser="btnSearchUserClicked"
                @input="clearDisplayReqUser"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 발생량 -->
              <y-number
                :width="8"
                :editable="editable && disposalRequest.requestEditable"
                :maxlength="10"
                :hasSeperator="true"
                :pointNumber="0"
                ui="bootstrap"
                label="L0000001075"
                name="amtGen"
                v-model="disposalRequest.amtGen"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 단위 -->
              <y-select
                :width="8"
                :editable="editable && disposalRequest.requestEditable"
                :required="true"
                :comboItems="envUnitCdItems"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                name="envUnitCd"
                label="L0000000870"
                v-model="disposalRequest.envUnitCd"
                v-validate="'required'"
                :state="validateState('envUnitCd')"
              ></y-select>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 처리상태 -->
              <y-text
                :width="8"
                :disabled="true"
                ui="bootstrap"
                name="ewstDispoStNm"
                label="L0000002830"
                v-model="disposalRequest.ewstDispoStNm"
              />
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
              <!-- 비고 -->
              <y-textarea
                :width="10"
                :editable="editable && disposalRequest.requestEditable"
                :maxlength="200"
                ui="bootstrap"
                label="L0000001360"
                name="remark"
                v-model="disposalRequest.remark"
                :rows="2"
              />
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>
    <y-dialog :param="popupOptions"></y-dialog>
  </b-container>
</template>
<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
export default {
  /** attributes: name, components, props, data **/
  name: 'dispo-request-detail',
  props: {
    popupParam: {
      type: Object,
      default: {
        ewstDispoReqNo: 0,
      },
    },
  },
  data() {
    return {
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '60%',
        top: '100px',
        param: {},
        closeCallback: null,
      },
      disposalRequest: {
        requestEditable: true,
        ewstDispoReqNo: 0,
        ewstDivCd: null,
        ewstDivNm: null,
        ewstClassCd: null,
        ewstClassNm: null,
        ewstDispoMtdCd: null,
        ewstDispoMtdNm: null,
        ewstWasteNo: null,
        ewstWasteNm: null,
        ewstDispoStCd: null,
        ewstDispoStNm: null,
        reqUserId: null,
        reqUserNm: null,
        reqDeptCd: null,
        reqDeptNm: null,
        reqYmd: null,
        amtGen: null,
        plantCd: null,
        plantNm: null,
        envUnitCd: null,
        envUnitNm: null,
        remark: null,
        dispoYmd: null,
        dispoAmt: null,
        createUserId: '',
        createUserNm: '',
        createDt: '',
        updateUserId: '',
        updateUserNm: '',
        updateDt: '',
      },
      gridOptions: {
        header: [],
        data: [],
        height: '250',
      },
      editable: true,
      updateMode: false,
      isCreateSubmit: false,
      isUpdateSubmit: false,

      ewstClassCdItems: [], // 폐기물 분류
      ewstWasteNoItems: [], // 폐기물
      envUnitCdItems: [], // 단위

      insertUrl: '',
      editUrl: '',
      searchUrl: '',
      detailUrl: '',
    };
  },
  computed: {
    displayReqUser: {
      get: function () {
        if (
          !(
            this.disposalRequest.reqDeptNm == null ||
            this.disposalRequest.reqUserNm == null
          )
        ) {
          return (
            this.disposalRequest.reqDeptNm +
            ' / ' +
            this.disposalRequest.reqUserNm
          );
        } else return null;
      },
      set: function (newValue) {},
    },
  },
  watch: {
    'disposalRequest.ewstClassCd': function (newValue, oldValue) {
      this.getEwstWasteNoItems();
    },
  },
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

      // 폐기물 분류
      this.getEwstClassCdItems();
      // 폐기물
      this.getEwstWasteNoItems();
      // 단위
      this.$comm.getComboItems('EWST_UNIT', false).then((_result) => {
        this.envUnitCdItems = _result;
      });

      this.insertUrl =
        transactionConfig.env.waste.operationLog.disposalRequest.insert.url;
      this.editUrl =
        transactionConfig.env.waste.operationLog.disposalRequest.edit.url;
      this.searchUrl =
        selectConfig.env.waste.operationLog.disposalRequest.list.url;
      this.detailUrl =
        selectConfig.env.waste.operationLog.disposalRequest.get.url;

      if (this.popupParam.ewstDispoReqNo > 0) {
        this.getDetail();
      }
    },
    clearDisplayReqUser() {
      this.disposalRequest.reqDeptNm = null;
      this.disposalRequest.reqUserNm = null;
    },
    getDetail() {
      this.$http.url = this.$format(
        this.detailUrl,
        this.popupParam.ewstDispoReqNo
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.updateMode = true;
          this.disposalRequest = _result.data;
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    getEwstClassCdItems() {
      this.$http.url = selectConfig.env.waste.baseInfo.wasteClass.list.url;
      this.$http.type = 'GET';
      this.$http.param = {
        useYn: 'Y',
      };
      this.$http.request(
        (_result) => {
          _result.data.splice(0, 0, {
            ewstClassCd: null,
            ewstClassNm: this.$comm.getLangSpecInfoLabel('L0000003394'), // 선택하세요
          });
          this.ewstClassCdItems = _result.data;
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    getEwstWasteNoItems() {
      this.$http.url = selectConfig.env.waste.baseInfo.waste.list.url;
      this.$http.type = 'GET';
      this.$http.param = {
        useYn: 'Y',
        ewstClassCd: this.disposalRequest.ewstClassCd,
        plantCd: this.disposalRequest.plantCd,
      };
      this.$http.request(
        (_result) => {
          _result.data.splice(0, 0, {
            ewstWasteNo: null,
            ewstWasteNm:
              this.$comm.getLangSpecInfoLabel('L0000003394') /* 선택하세요 */,
          });
          this.ewstWasteNoItems = _result.data;
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    btnCreateClickedCallback(_result) {
      this.isCreateSubmit = false;
      this.updateMode = true;
      this.popupParam.ewstDispoReqNo = _result.data;
      this.getDetail();
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // 안내
        message: 'M0000000006', // 저장되었습니다.
        type: 'success',
      });
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
    btnSearchUserClicked(_item) {
      this.popupOptions.target = () =>
        import(`${'../../../manage/user/userSearch.vue'}`);
      this.popupOptions.title = 'L0000002057'; // '요청자';
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closePopupSearchUser;
    },
    beforeCreateSubmit() {
      this.disposalRequest.ewstDispoReqNo = 0;
      this.updateMode = false;
      this.$validator
        .validateAll()
        .then((_result) => {
          if (_result) {
            window.getApp.$emit('CONFIRM', {
              title: 'L0000003321', // '확인',
              message: 'M0000000011', // 저장하시겠습니까?
              type: 'info',
              confirmCallback: () => {
                this.disposalRequest.createUserId = this.$store.getters.token;
                this.isCreateSubmit = true;
              },
            });
          } else if (!_result) {
            this.$popupRequired.check(
              'dispoRequestDetail',
              this.$data,
              this.errors
            );
          }
        })
        .catch(() => {
          window.getApp.$emit(
            'APP_VALID_ERROR',
            'M0000000004' // '유효성 검사 중 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.'
          );
        });
    },
    btnDeleteClicked() {
      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321', // '확인',
        message: 'M0000000012', // '삭제하시겠습니까?',
        type: 'info',
        confirmCallback: () => {
          this.$http.url = this.$format(
            transactionConfig.env.waste.operationLog.disposalRequest.delete.url,
            this.disposalRequest.ewstDispoReqNo
          );
          this.$http.type = 'delete';
          this.$http.request(
            (_result) => {
              this.btnClearClickedCallback(_result);
              window.getApp.$emit('ALERT', {
                title: 'L0000003395', // '안내',
                message: 'M0000000007', // '삭제되었습니다.',
                type: 'success',
              });
              this.$emit('closePopup', { success: true });
            },
            (_error) => {
              window.getApp.$emit('APP_REQUEST_ERROR', _error);
            }
          );
        },
      });
    },
    beforeUpdateSubmit() {
      this.$validator
        .validateAll()
        .then((_result) => {
          if (_result) {
            window.getApp.$emit('CONFIRM', {
              title: 'L0000003321', // '확인',
              message: 'M0000000011', // 저장하시겠습니까?
              type: 'info',
              confirmCallback: () => {
                this.disposalRequest.updateUserId = this.$store.getters.token;
                this.isUpdateSubmit = true;
              },
            });
          } else {
            this.$popupRequired.check(
              'dispoRequestDetail',
              this.$data,
              this.errors
            );
          }
        })
        .catch(() => {
          window.getApp.$emit(
            'APP_VALID_ERROR',
            'M0000000004' // '유효성 검사 중 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.'
          );
        });
    },
    btnUpdateClickedCallback(_result) {
      this.isUpdateSubmit = false;

      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // '안내',
        message: 'M0000000006', // '저장되었습니다.',
        type: 'success',
      });
    },
    btnClickedErrorCallback(_result) {
      this.isCreateSubmit = false;
      this.isUpdateSubmit = false;
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    btnClearClickedCallback(_result) {
      this.updateMode = false;
      Object.assign(
        this.$data.disposalRequest,
        this.$options.data().disposalRequest
      );
    },
    btnClosePopup() {
      // 부모창에 값 전달
      this.$emit('closePopup', { success: true });
    },

    closePopupSearchUser(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      if (data.user) {
        this.disposalRequest.reqUserId = data.user.userId;
        this.disposalRequest.reqUserNm = data.user.userNm;
        this.disposalRequest.reqDeptCd = data.user.deptCd;
        this.disposalRequest.reqDeptNm = data.user.deptNm;
      }
    },
  },
};
</script>
