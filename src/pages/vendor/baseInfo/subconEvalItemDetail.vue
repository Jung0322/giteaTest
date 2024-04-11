<!--
  목적 : 안전 > 기준정보 > 협력업체 평가 항목 관리
  작성자 : kdh
  Detail : 협력업체 평가 항목 관리 상세/등록/수정 화면
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <!-- 협력업체 평가 항목 상세 -->
    <b-row class="mt-3">
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- 협력업체 평가 항목 상세 -->
            <y-label
              label="L0000003262"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 저장 -->
              <y-btn
                v-if="updateMode && editable"
                :action-url="editUrl"
                :param="subconEvalItem"
                :is-submit="isEdit"
                title="L0000002474"
                color="orange"
                action-type="PUT"
                beforeSubmit="beforeEdit"
                @beforeEdit="beforeEdit"
                @btnClicked="btnEditClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <y-btn
                v-if="!updateMode && editable"
                :action-url="insertUrl"
                :param="subconEvalItem"
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
                name="subconEvalPlantCd"
                v-model="subconEvalItem.subconEvalPlantCd"
                v-validate="'required'"
                :state="validateState('plantCd')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 평가구분 -->
              <y-select
                :width="8"
                :required="true"
                :comboItems="evalClsItems"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                label="L0000003059"
                name="subconEvalClsCd"
                v-model="subconEvalItem.subconEvalClsCd"
                v-validate="'required'"
                :state="validateState('subconEvalClsCd')"
              ></y-select>
            </b-col>

            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 평가기준 -->
              <y-text
                :width="8"
                :editable="editable"
                :maxlength="20"
                ui="bootstrap"
                label="L0000003063"
                name="subconEvalItemStnd"
                v-model="subconEvalItem.subconEvalItemStnd"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 평가유형 -->
              <y-select
                :width="8"
                :comboItems="evalAttItems"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                label="L0000003089"
                name="subconEvalAttCd"
                v-model="subconEvalItem.subconEvalAttCd"
              ></y-select>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 배점 -->
              <y-number
                :width="8"
                :editable="editable"
                :maxlength="5"
                :required="true"
                :hasSeperator="false"
                ui="bootstrap"
                name="subconEvalItemPnt"
                label="L0000001137"
                v-model="subconEvalItem.subconEvalItemPnt"
                v-validate="'required'"
                :state="validateState('subconEvalItemPnt')"
              ></y-number>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 평가항목명 -->
              <y-text
                :width="8"
                :editable="editable"
                :maxlength="100"
                :required="true"
                ui="bootstrap"
                label="L0000003099"
                name="subconEvalItemNm"
                v-model="subconEvalItem.subconEvalItemNm"
                v-validate="'required'"
                :state="validateState('subconEvalItemNm')"
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
                name="radioValue"
                selectText="L0000001440"
                unselectText="L0000001063"
                v-model="subconEvalItem.useYn"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-number
                :width="8"
                :editable="editable"
                :maxlength="5"
                :hasSeperator="false"
                ui="bootstrap"
                name="sortOrder"
                label="L0000002601"
                v-model="subconEvalItem.sortOrder"
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
  name: 'y-subcon-eval-item',
  props: {
    popupParam: {
      type: Object,
      default: {
        safSubconEvalItemNo: 0,
      },
    },
  },
  data() {
    return {
      subconEvalItem: {
        safSubconEvalItemNo: 0,
        subconEvalPlantCd: null,
        subconEvalPlantNm: '',
        subconEvalItemNm: '',
        subconEvalItemStnd: '',
        subconEvalItemPnt: 0,
        subconEvalClsCd: null,
        subconEvalAttCd: null,
        sortOrder: '',
        useYn: 'Y',
        createUserId: '',
        updateUserId: '',
      },

      editable: false,
      updateMode: false,
      searchUrl: '',
      detailUrl: '',
      checkUrl: '',
      insertUrl: '',
      editUrl: '',
      isInsert: false,
      isEdit: false,
      evalClsSearchItems: [], // 평가구분 리스트 (조회)
      evalAttSearchItems: [], // 평가유형 리스트 (조회)
      evalClsItems: [], // 평가구분 리스트 (저장)
      evalAttItems: [], // 평가유형 리스트(저장)
    };
  },
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
  },
  mounted() {
    this.init();
  },
  beforeDestroy() {},
  /** methods **/
  methods: {
    init() {
      this.detailUrl = selectConfig.vendor.baseInfo.subconEvalItem.get.url;
      this.checkUrl = selectConfig.vendor.baseInfo.subconEvalItem.check.url;
      this.insertUrl =
        transactionConfig.vendor.baseInfo.subconEvalItem.insert.url;
      this.editUrl = transactionConfig.vendor.baseInfo.subconEvalItem.edit.url;

      this.editable = this.$route.meta.editable;
      this.$comm.getComboItems('SAF_SC_EVAL_CLS', false).then(_result => {
        this.evalClsItems = _result; // 평가구분
      });
      this.$comm.getComboItems('SAF_SC_EVAL_ATT', false).then(_result => {
        this.evalAttItems = _result; // 평가유형
      });
      this.subconEvalItem.subconEvalClsCd = 'SCSC1';
      this.subconEvalItem.subconEvalAttCd = 'SCSA1';

      if (this.popupParam.safSubconEvalItemNo !== 0) {
        this.getDetail();
      }
    },
    getDetail() {
      this.$http.url = this.$format(
        this.detailUrl,
        this.popupParam.safSubconEvalItemNo
      );
      this.$http.type = 'GET';
      this.$http.request(
        _result => {
          this.subconEvalItem = this.$_.clone(_result.data);
          this.updateMode = true;
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
    /** validation checking **/
    beforeInsert() {
      this.checkValidator('insert');
    },
    beforeEdit() {
      this.checkValidator('edit');
    },
    checkValidator(flag) {
      this.$validator
        .validateAll()
        .then(_result => {
          if (_result) {
            /**
             * 20221223 동일한 사업장, 평가구분, 평가유형의 평가항목의 합은 100이하 1237
             */
            this.$http.url =
              selectConfig.vendor.baseInfo.subconEvalItem.list.url;
            this.$http.type = 'GET';
            this.$http.param = {
              subconEvalPlantCd: this.subconEvalItem.subconEvalPlantCd,
              subconEvalClsCd: this.subconEvalItem.subconEvalClsCd,
              subconEvalAttCd: this.subconEvalItem.subconEvalAttCd,
              useYn: 'Y',
            };
            this.$http.request(
              _result => {
                let tempList = _result.data;
                let sum = this.$_.parseInt(
                  this.subconEvalItem.subconEvalItemPnt
                );

                if (this.subconEvalItem.safSubconEvalItemNo) {
                  tempList = tempList.filter(f => {
                    return (
                      f.safSubconEvalItemNo !==
                      this.subconEvalItem.safSubconEvalItemNo
                    );
                  });
                }
                sum += tempList.reduce(
                  (acc, cur) =>
                    acc + this.$_.parseInt(cur['subconEvalItemPnt']),
                  0
                );

                if (sum > 100) {
                  window.getApp.$emit('ALERT', {
                    title: 'L0000003395',
                    message: 'L0000005354',
                    type: 'warning',
                  });
                  this.isInsert = false;
                } else {
                  window.getApp.$emit('CONFIRM', {
                    title: 'L0000003321',
                    message: flag === 'edit' ? 'M0000000011' : 'M0000000011',
                    type: 'info',
                    // 확인 callback 함수
                    confirmCallback: () => {
                      this.subconEvalItem.createUserId = this.$store.getters.token;
                      this.subconEvalItem.updateUserId = this.$store.getters.token;
                      if (flag === 'edit') this.isEdit = true;
                      else this.isInsert = true;
                    },
                    cancelCallback: () => {
                      if (flag === 'edit') this.isEdit = false;
                      else this.isInsert = false;
                    },
                  });
                }

                this.isInsert = false;
              },
              _error => {
                window.getApp.$emit('APP_REQUEST_ERROR', _error);
              }
            );

            /**
             * 20221223 평가항목명 중복체크 기능 삭제, 단위테스트 1237
             */
            // this.$http.url = this.checkUrl;
            // this.$http.type = 'GET';
            // this.$http.param = {
            //   subconEvalItemNm: this.subconEvalItem.subconEvalItemNm,
            //   safSubconEvalItemNo:
            //     flag === 'edit' ? this.subconEvalItem.safSubconEvalItemNo : '',
            // };
            // this.$http.request(
            //   _result => {
            //     var returnVal = this.showMessage(_result.data, flag);

            //   },
            //   _error => {
            //     window.getApp.$emit('APP_REQUEST_ERROR', _error);
            //   }
            // );
          } else {
            this.$popupRequired.check(
              'subconEvalItemDetail',
              this.$data,
              this.errors
            );
          }
        })
        .catch(() => {
          window.getApp.$emit(
            'APP_VALID_ERROR',
            'M0000000876'
            // 유효성 검사도중 에러가 발생하였습니다.
          );
        });
    },
    showMessage(checkList, flag) {
      var checkText = '';
      var i = 0;
      for (; i < checkList.length; i++) {
        if (this.$_.parseInt(checkList[i].cnt) > 0) {
          checkText = 'M0000000809';
          // 이미 존재하는 평가항목명입니다.
          break;
        }
      }
      if (checkText) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: checkText,
          type: 'warning',
        });
        return false;
      } else {
        return true;
      }
    },
    // 버튼 에러 처리
    btnClickedErrorCallback(_result) {
      this.isInsert = false;
      this.isEdit = false;
      this.updateMode = false;
      window.getApp.emit('APP_REQUEST_ERROR', _result);
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
      this.updateMode = true;
      this.subconEvalItem.safSubconEvalItemNo = _result.data;
      window.getApp.$emit('ALERT', {
        title: 'L0000003395',
        message: 'M0000000006',
        type: 'success',
      });
    },

    btnClosePopup() {
      // 부모창에 값 전달
      this.$emit('closePopup', { success: true });
    },
  },
};
</script>
