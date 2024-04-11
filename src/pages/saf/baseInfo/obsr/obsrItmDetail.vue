<!--
  목적 : 안전 > 기준정보 > 안전관찰항목 > 상세
  작성자 : jkl
  Detail : 안전관찰항목 등록/상세
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <b-row>
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <y-label
              label="안전관찰항목 정보"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div slot="buttonGroup" class="float-right mb-1">
              <y-btn
                v-if="editable"
                title="저장"
                color="orange"
                @btnClicked="saveBtnClicked"
              />
              <y-btn title="L0000000881" @btnClicked="closePopup" />
            </div>
          </b-col>
        </b-row>
        <b-card>
          <b-row>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-plant
                :editable="editable"
                :required="true"
                :state="validateState('plantCd')"
                type="edit"
                name="plantCd"
                v-validate="'required'"
                v-model="obsrItm.plantCd"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-select
                :width="8"
                :required="true"
                :editable="editable"
                :comboItems="itmTypeCdItems"
                :state="validateState('itmTypeCd')"
                ui="bootstrap"
                label="관찰항목분류"
                name="itmTypeCd"
                itemText="codeNm"
                itemValue="code"
                v-validate="'required'"
                v-model="obsrItm.itmTypeCd"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-text
                :width="8"
                :maxlength="250"
                :required="true"
                :editable="editable"
                ui="bootstrap"
                label="관찰항목"
                name="obsrItmNm"
                v-model="obsrItm.obsrItmNm"
                v-validate="'required'"
                :state="validateState('obsrItmNm')"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-switch
                :width="8"
                :editable="editable"
                true-value="Y"
                false-value="N"
                ui="bootstrap"
                label="사용여부"
                name="useYn"
                selectText="사용"
                unselectText="미사용"
                v-model="obsrItm.useYn"
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
  /* attributes: name, components, props, data */
  name: 'obsr-itm-detail',
  props: {
    popupParam: {
      type: Object,
      default: {
        safObsrItmNo: 0,
      },
    },
  },
  data() {
    return {
      obsrItm: {
        safObsrItmNo: 0,
        plantCd: null,
        itmTypeCd: null,
        obsrItmNm: null,
        useYn: 'Y',
      },
      editable: false,
      itmTypeCdItems: [], // 관찰항목분류
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
      this.$comm.getComboItems('SAF_STOP_ITM_TYPE', false).then((_result) => {
        this.itmTypeCdItems = _result;
      });
      if (this.popupParam.safObsrItmNo) {
        this.obsrItm.safObsrItmNo = this.popupParam.safObsrItmNo;
        this.getDetail();
      }
    },
    getDetail() {
      this.$http.url = this.$format(
        selectConfig.saf.obsrItm.get.url,
        this.obsrItm.safObsrItmNo
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.obsrItm = this.$_.clone(_result.data);
        },
        (_error) => {
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
    saveBtnClicked() {
      let promises = [
        {
          func: this.checkValidation,
          exceptionMessage: '필수입력값을 입력해주세요.',
        },
        { func: this.checkData },
        { func: this.confirmSave },
        { func: this.saveData, successMessage: '저장되었습니다.' },
      ];
      this.$comm.orderedPromise(promises);
    },
    checkValidation() {
      return this.$validator.validateAll();
    },
    confirmSave() {
      return new Promise((_resolve, _reject) => {
        window.getApp.$emit('CONFIRM', {
          title: '확인',
          message: '저장하시겠습니까?',
          type: 'info',
          // 확인 callback 함수
          confirmCallback: () => {
            _resolve(true);
          },
          cancelCallback: () => {
            _resolve(false);
          },
        });
      });
    },
    checkData() {
      return new Promise((_resolve, _reject) => {
        this.$http.url = selectConfig.saf.obsrItm.check.url;
        this.$http.param = {
          plantCd: this.obsrItm.plantCd,
          itmTypeCd: this.obsrItm.itmTypeCd,
          obsrItmNm: this.obsrItm.obsrItmNm,
          safObsrItmNo: this.obsrItm.safObsrItmNo,
        };
        this.$http.type = 'GET';
        this.$http.request(
          (_result) => {
            if (_result.data > 0) {
              window.getApp.$emit('ALERT', {
                title: '안내',
                message: '이미 등록된 항목입니다.',
                type: 'warning',
              });
              _resolve(false);
            } else {
              _resolve(true);
            }
          },
          (_error) => {
            _reject(_error);
            window.getApp.$emit('APP_REQUEST_ERROR', _error);
          }
        );
      });
    },
    saveData() {
      return new Promise((_resolve, _reject) => {
        if (this.obsrItm.safObsrItmNo) {
          // 수정
          this.$http.url = transactionConfig.saf.obsrItm.edit.url;
          this.$http.type = 'PUT';
        } else {
          // 신규등록
          this.$http.url = transactionConfig.saf.obsrItm.insert.url;
          this.$http.type = 'POST';
        }

        this.$http.param = this.obsrItm;
        this.$http.request(
          (_result) => {
            if (!this.obsrItm.safObsrItmNo) {
              this.obsrItm.safObsrItmNo = this.$_.clone(_result.data);
            }

            this.getDetail();
            _resolve(true);
          },
          (_error) => {
            _reject(_error);
            window.getApp.$emit('APP_REQUEST_ERROR', _error);
          }
        );
      });
    },
    closePopup() {
      // 부모창에 값 전달
      this.$emit('closePopup', { success: true });
    },
  },
};
</script>
