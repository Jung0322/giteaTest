<!--
  목적 : 위험성평가 > 기준정보 > 유해위험요인 관리
  작성자 : kga
  Detail : 유해위험요인 상세, 등록, 수정
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
            <!-- 유해위험요인 상세 -->
            <y-label
              label="L0000002182"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 저장 -->
              <y-btn
                v-if="this.riskHazard.riskHazardNo > 0 && editable"
                :action-url="editUrl"
                :param="riskHazard"
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
                v-if="this.riskHazard.riskHazardNo === 0 && editable"
                :action-url="insertUrl"
                :param="riskHazard"
                :is-submit="isInsert"
                title="L0000002474"
                color="orange"
                action-type="POST"
                beforeSubmit="beforeInsert"
                @beforeInsert="beforeInsert"
                @btnClicked="btnInsertClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!--  닫기 -->
              <y-btn title="L0000000881" @btnClicked="btnClosePopup" />
            </div>
          </b-col>
        </b-row>
        <b-card>
          <b-row>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 유해위험요인 분류 -->
              <y-select
                :width="8"
                :editable="editable"
                :required="true"
                :comboItems="comboInsPriskHazardNos"
                itemText="riskHazardNm"
                itemValue="riskHazardNo"
                ui="bootstrap"
                type="search"
                label="L0000002181"
                name="priskHazardNo"
                v-model="riskHazard.priskHazardNo"
                v-validate="'required'"
                :state="validateState('priskHazardNo')"
              />
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
              <!-- 유해위험요인 -->
              <y-text
                :width="10"
                :editable="editable"
                :maxlength="30"
                :required="true"
                ui="bootstrap"
                label="L0000002179"
                name="riskHazardNm"
                v-model="riskHazard.riskHazardNm"
                v-validate="'required'"
                :state="validateState('riskHazardNm')"
              ></y-text>
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
                v-model="riskHazard.useYn"
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
  name: 'y-risk-hazard-detail',
  props: {
    popupParam: {
      type: Object,
      default: {
        riskHazardNo: 0,
      },
    },
  },
  data() {
    return {
      riskHazard: {
        riskHazardNo: 0,
        priskHazardNo: null,
        riskHazardNm: '',
        useYn: 'Y',
        createUserId: '',
        updateUserId: '',
      },
      gridOptions: {
        header: [],
        data: [],
        height: 210,
      },
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        param: null,
        width: '800px',
        top: '10px',
        closeCallback: null,
      },
      editable: false,
      comboSelPriskHazardNos: [],
      comboInsPriskHazardNos: [],
      searchUrl: '',
      checkUrl: '',
      insertUrl: '',
      editUrl: '',
      isInsert: false,
      isEdit: false,
    };
  },
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {},
  beforeDestroy() {},
  /** methods **/
  methods: {
    /** 초기화 관련 함수 **/
    init() {
      // URL 셋팅
      this.searchUrl = selectConfig.rsa.riskHazard.list.url;
      this.checkUrl = selectConfig.rsa.riskHazard.check.url;
      this.insertUrl = transactionConfig.rsa.riskHazard.insert.url;
      this.editUrl = transactionConfig.rsa.riskHazard.edit.url;
      this.editable = this.$route.meta.editable;

      this.riskHazard.riskHazardNo = this.popupParam.riskHazardNo;

      if (this.riskHazard.riskHazardNo !== 0) {
        this.getPriskHazardNos('null');
        this.getDetail();
      } else {
        this.getPriskHazardNos('model'); // 유해위험요인
      }
    },
    getDetail() {
      this.$http.url = this.$format(
        selectConfig.rsa.riskHazard.get.url,
        this.riskHazard.riskHazardNo
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.riskHazard = this.$_.clone(_result.data);
        },
        (_error) => {
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
    // 유해위험요인 분류
    getPriskHazardNos(flag) {
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = {
        riskHazardLevel: 1,
      };
      this.$http.request(
        (_result) => {
          if (flag === 'null') {
            this.comboInsPriskHazardNos = this.$_.clone(_result.data);
          } else if (flag === 'model') {
            this.comboInsPriskHazardNos = this.$_.clone(_result.data);

            this.comboInsPriskHazardNos.splice(0, 0, {
              riskHazardNo: null,
              riskHazardNm: this.$comm.getLangSpecInfoLabel('L0000003394'),
            });
            if (
              this.riskHazard.priskHazardNo &&
              this.$_.indexOf(
                this.$_.map(this.comboInsPriskHazardNos, 'priskHazardNo'),
                this.riskHazard.priskHazardNo
              ) === -1
            ) {
              this.riskHazard.priskHazardNo = null;
            }
          }
        },
        (_error) => {
          this.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    beforeEdit() {
      this.check('edit');
    },
    beforeInsert() {
      this.check('insert');
    },
    /** validation checking **/
    check(gubun) {
      this.$validator
        .validateAll()
        .then((_result) => {
          if (_result) {
            this.$http.url = this.checkUrl;
            this.$http.type = 'GET';
            this.$http.param = {
              priskHazardNo: this.riskHazard.priskHazardNo,
              riskHazardNo: gubun === 'edit' ? this.riskHazard.riskHazardNo : 0,
              riskHazardNm: this.riskHazard.riskHazardNm,
            };
            this.$http.request(
              (_result) => {
                if (_result.data[0].cnt > 0) {
                  window.getApp.$emit('ALERT', {
                    title: 'L0000003395',
                    message: 'M0000000612', // 이미 같은 이름의 유해위험요인이 존재합니다.
                    type: 'warning',
                  });
                } else {
                  window.getApp.$emit('CONFIRM', {
                    title: 'L0000003321',
                    message: 'M0000000011', // 저장하시겠습니까?
                    type: 'info',
                    // 확인 callback 함수
                    confirmCallback: () => {
                      this.riskHazard.createUserId = this.$store.getters.token;
                      this.riskHazard.updateUserId = this.$store.getters.token;
                      if (gubun === 'edit') {
                        this.isEdit = true;
                      } else {
                        this.isInsert = true;
                      }
                    },
                    cancelCallback: () => {
                      this.isEdit = false;
                      this.isInsert = false;
                    },
                  });
                }
              },
              (_error) => {
                window.getApp.$emit('APP_REQUEST_ERROR', _error);
              }
            );
          } else {
            this.$popupRequired.check(
              'riskHazardDetail',
              this.$data,
              this.errors
            );
          }
        })
        .catch(() => {
          window.getApp.$emit('APP_VALID_ERROR', 'M0000000876');
        });
    },
    // 수정
    btnEditClickedCallback(_result) {
      this.isEdit = false;
      window.getApp.$emit('ALERT', {
        title: 'L0000003395',
        message: 'M0000000006',
        type: 'success',
      });
    },
    // 신규등록
    btnInsertClickedCallback(_result) {
      this.isInsert = false;
      this.riskHazard.riskHazardNo = _result.data;
      window.getApp.$emit('ALERT', {
        title: 'L0000003395',
        message: 'M0000000006',
        type: 'success',
      });
    },

    // 버튼 에러 처리
    btnClickedErrorCallback(_result) {
      this.isInsert = false;
      this.isEdit = false;
      window.getApp.emit('APP_REQUEST_ERROR', _result);
    },
    btnClosePopup() {
      // 부모창에 값 전달
      this.$emit('closePopup', { success: true });
    },
  },
};
</script>
