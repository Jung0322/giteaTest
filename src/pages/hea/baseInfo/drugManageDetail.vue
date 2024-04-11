<template>
  <b-container fluid>
    <!-- 등록 -->
    <b-row class="mt-3" ref="insertBox">
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- 약품 상세 -->
            <y-label
              label="L0000001918"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 저장 -->
              <y-btn
                v-if="editable && updateMode"
                :action-url="editUrl"
                :param="heaDrug"
                :is-submit="isEditSubmit"
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
                v-if="editable && !updateMode"
                :action-url="insertUrl"
                :param="heaDrug"
                :is-submit="isInsertSubmit"
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
              <!-- 약품명 -->
              <y-text
                :width="baseWidth"
                :editable="editable"
                :maxlength="30"
                ui="bootstrap"
                label="L0000001922"
                name="heaDrugNm"
                v-model="heaDrug.heaDrugNm"
                :required="true"
                v-validate="'required'"
                :state="validateState('heaDrugNm')"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 단위 -->
              <y-text
                :width="baseWidth"
                :editable="editable"
                :maxlength="15"
                ui="bootstrap"
                label="L0000000870"
                name="unit"
                v-model="heaDrug.unit"
              ></y-text>
            </b-col>
            <!-- <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-number
                :width="baseWidth"
                :editable="editable"
                :maxlength="5"
                ui="bootstrap"
                label="적정 재고량"
                name="amountLimit"
                v-model="heaDrug.amountLimit"
              >
              </y-number>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-number
                :width="baseWidth"
                :editable="editable"
                :maxlength="7"
                ui="bootstrap"
                label="현재 재고량"
                name="amountCurr"
                v-model="heaDrug.amountCurr"
              >
              </y-number>
            </b-col>-->
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 사용여부, 사용/미사용 -->
              <y-switch
                :width="baseWidth"
                :editable="editable"
                true-value="Y"
                false-value="N"
                ui="bootstrap"
                label="L0000001439"
                name="useYn"
                selectText="L0000001440"
                unselectText="L0000001063"
                v-model="heaDrug.useYn"
              ></y-switch>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 정렬순서 -->
              <y-number
                :width="baseWidth"
                :editable="editable"
                :maxlength="5"
                :isPositive="true"
                ui="bootstrap"
                label="L0000002601"
                name="sortOrder"
                v-model="heaDrug.sortOrder"
              ></y-number>
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
  name: 'drug-manage-detail',
  props: {
    popupParam: {
      type: Object,
      default: {
        heaDrug: [],
        heaDrugNo: 0,
      },
    },
  },
  data() {
    return {
      gridOptions: {
        header: [],
        data: [],
        height: '300',
      },
      heaDrug: {
        heaDrugNo: 0,
        heaDrugNm: '',
        unit: '',
        amountLimit: '',
        amountCurr: '',
        sortOrder: '',
        useYn: 'Y',
        createUserId: '',
        creatDt: '',
        updateUserId: '',
        updateDt: '',
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
      baseWidth: 8,
      widthTwoCols: 10,
      editable: true,
      updateMode: false,
      useYnItems: [],
      isInsertSubmit: false,
      isEditSubmit: false,
      editUrl: '',
      insertUrl: '',
    };
  },
  /** Vue lifecycle: created, mounted, destroyed, etc **/
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {},
  beforeDestroy() {},
  /** methods **/
  methods: {
    init() {
      this.editable = this.$route.meta.editable;

      this.searchUrl = selectConfig.hea.drugManage.list.url;
      this.getUrl = selectConfig.hea.drugManage.get.url;
      this.insertUrl = transactionConfig.hea.drugManage.insert.url;
      this.editUrl = transactionConfig.hea.drugManage.edit.url;

      this.getUseYnItems();
      if (this.popupParam.heaDrugNo !== 0) {
        console.log('111', this.popupParam.heaDrugNo);
        this.getDetail();
      }
    },
    /** /초기화 관련 함수 **/
    getUseYnItems() {
      setTimeout(() => {
        this.useYnItems = [
          {
            useYn: 'Y',
            useYnNm: this.$comm.getLangSpecInfoLabel('L0000001440'),
          }, // 사용
          {
            useYn: 'N',
            useYnNm: this.$comm.getLangSpecInfoLabel('L0000001063'),
          }, // 미사용
        ];
      }, 200);
    },
    beforeEdit() {
      if (this.checkDuplicate()) return;
      this.$validator
        .validateAll()
        .then((_result) => {
          if (_result) {
            window.getApp.$emit('CONFIRM', {
              title: 'L0000003321', // 확인
              message: 'M0000000011', // 저장하시겠습니까?
              type: 'info',
              // 확인 callback 함수
              confirmCallback: () => {
                this.heaDrug.updateUserId = this.$store.getters.token;

                this.isEditSubmit = true;
              },
            });
          } else {
            if (!this.heaDrug.heaDrugNm) {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395',
                message: 'M0000001161', // 약품명을 입력해주세요.
                type: 'warning',
              });
              return false;
            }
          }
        })
        .catch(() => {
          window.getApp.$emit(
            'APP_VALID_ERROR',
            'M0000000881' // 유효성 검사도중 에러가 발생하였습니다.
          );
        });
    },
    beforeInsert() {
      if (this.checkDuplicate()) return;
      this.$validator
        .validateAll()
        .then((_result) => {
          if (_result) {
            window.getApp.$emit('CONFIRM', {
              title: 'L0000003321', // 확인
              message: 'M0000000011', // 저장하시겠습니까?
              type: 'info',
              // 확인 callback 함수
              confirmCallback: () => {
                this.heaDrug.heaDrugNo = '';
                this.updateMode = false;
                this.heaDrug.createUserId = this.$store.getters.token;

                this.isInsertSubmit = true;
              },
            });
          } else {
            if (!this.heaDrug.heaDrugNm) {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395',
                message: 'M0000001161', // 약품명을 입력해주세요.
                type: 'warning',
              });
              return false;
            }
          }
        })
        .catch(() => {
          window.getApp.$emit(
            'APP_VALID_ERROR',
            'M0000000881' // 유효성 검사도중 에러가 발생하였습니다.
          );
        });
    },

    /** validation checking **/
    validateState(_ref) {
      if (
        this.veeBag[_ref] &&
        (this.veeBag[_ref].dirty || this.veeBag[_ref].validated)
      ) {
        return !this.errors.has(_ref);
      }
      return null;
    },
    btnClosePopup() {
      // 부모창에 값 전달
      this.$emit('closePopup', { success: true });
    },
    checkDuplicate() {
      var test = {
        heaDrugNm: this.heaDrug.heaDrugNm,
      };
      var item = this.$_.find(this.gridOptions.data, test);
      if (item != null) {
        if (this.updateMode && this.heaDrug.heaDrugNo === item.heaDrugNo) {
          return false;
        }

        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // 안내
          message: 'M0000000412', // 이미 같은 이름의 약품명이 존재합니다.
          type: 'warning',
        });
        return true;
      }
      return false;
    },
    btnEditClickedCallback(_result) {
      this.isEditSubmit = false;
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // 안내
        message: 'M0000000006', // 저장되었습니다.
        type: 'success',
      });
    },
    /** Button Event **/
    btnInsertClickedCallback(_result) {
      this.heaDrug.heaDrugNo = _result.data;
      this.isInsertSubmit = false;
      this.updateMode = true;
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // 안내
        message: 'M0000000006', // 저장되었습니다.
        type: 'success',
      });
    },
    btnClickedErrorCallback(_result) {
      this.isInsertSubmit = false;
      this.isEditSubmit = false;
      window.getApp.$emit(
        'APP_REQUEST_ERROR',
        'M0000000016' // 작업 중 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.
      );
    },
    getDetail() {
      if (!this.popupParam.heaDrugNo) {
        return;
      }
      this.$http.url = this.$format(this.getUrl, this.popupParam.heaDrugNo);
      this.$http.type = 'GET';
      this.$http.request((_result) => {
        this.heaDrug = this.$_.clone(_result.data);
        this.updateMode = true;
      });
    },
  },
};
</script>
