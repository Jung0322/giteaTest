<!--
  목적 : 안전점검 - 점검 항목
  Detail : 점검 항목 종류 등록/수정화면
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <!-- 등록 -->
    <b-row ref="editBox">
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- 점검항목 상세 -->
            <y-label
              label="L0000003720"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 저장 -->
              <y-btn
                v-if="updateMode && editable"
                :action-url="editUrl"
                :param="checkItem"
                :is-submit="isEdit"
                title="L0000002474"
                color="orange"
                action-type="PUT"
                beforeSubmit="beforeSubmit"
                @beforeSubmit="beforeSubmit"
                @btnClicked="btnSaveClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!-- 저장 -->
              <y-btn
                v-if="!updateMode && editable"
                :action-url="insertUrl"
                :param="checkItem"
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
                v-model="checkItem.plantCd"
                v-validate="'required'"
                :state="validateState('plantCd')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 점검종류 상세 -->
              <y-select
                :width="8"
                :editable="editable"
                :comboItems="comboCheckKindDetail"
                :required="true"
                itemText="safCheckKindNm"
                itemValue="safCheckKindNo"
                ui="bootstrap"
                label="L0000003718"
                name="safCheckKindNo"
                v-validate="'required'"
                v-model="checkItem.safCheckKindNo"
                :state="validateState('safCheckKindNo')"
              ></y-select>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 점검항목명 -->
              <y-text
                :width="8"
                :editable="editable"
                :required="true"
                :maxlength="50"
                ui="bootstrap"
                label="L0000001886"
                name="safCheckTypeNm"
                v-validate="'required'"
                v-model="checkItem.safCheckTypeNm"
                :state="validateState('safCheckTypeNm')"
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
                v-model="checkItem.useYn"
              ></y-switch>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 정렬순서 -->
              <y-number
                :width="8"
                :editable="editable"
                :maxlength="5"
                :hasSeperator="false"
                :isPositive="true"
                ui="bootstrap"
                label="L0000002601"
                name="sortOrder"
                v-model="checkItem.sortOrder"
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
let oldSafCheckTypeNm = null;
export default {
  /* attributes: name, components, props, data */
  name: 'y-check-item',
  props: {
    popupParam: {
      type: Object,
      default: {
        safCheckItemNo: 0,
        pageNm: '',
        noAccUseYn: false,
      },
    },
  },
  data() {
    return {
      checkItem: {
        plantCd: null,
        safCheckItemNo: '',
        safCheckKindNo: null,
        safCheckTypeNm: '',
        sortOrder: 0,
        useYn: 'Y',
        createUserId: '',
        updateUserId: '',
      },
      comboCheckKindDetail: [],
      editable: false,
      updateMode: false,
      isInsert: false,
      isEdit: false,
      editUrl: '',
      insertUrl: '',
      checkUrl: '',
    };
  },
  watch: {
    'checkItem.plantCd'() {
      this.getCheckKindItems('detail');
    },
  },
  beforeCreate() {},
  created() {},
  updated() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {},
  beforeDestroy() {},
  //* methods */
  methods: {
    init() {
      this.editable = this.$route.meta.editable;
      // Url Setting

      this.checkUrl = selectConfig.saf.checkItem.check.url;
      this.editUrl = transactionConfig.saf.checkItem.edit.url;
      this.insertUrl = transactionConfig.saf.checkItem.insert.url;

      this.getCheckKindItems();
      if (this.popupParam.safCheckItemNo !== 0) {
        this.getDetail();
      }
    },
    getCheckKindItems() {
      this.$http.url = selectConfig.saf.checkKind.list.url;
      this.$http.type = 'GET';
      this.$http.param = {
        plantCd: this.checkItem.plantCd,
      };
      this.$http.request(
        (_result) => {
          let detailItems = [];
          if (this.checkItem.plantCd) {
            detailItems = this.$_.clone(_result.data);
          }
          detailItems.splice(0, 0, {
            safCheckKindNo: null,
            safCheckKindNm: this.$comm.getLangSpecInfoLabel('L0000003394'), // '선택하세요'
          });
          this.comboCheckKindDetail = detailItems;
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    getDetail() {
      this.$http.url = this.$format(
        selectConfig.saf.checkItem.get.url,
        this.popupParam.safCheckItemNo
      );
      this.$http.type = 'GET';

      this.$http.request(
        (_result) => {
          this.updateMode = true;
          this.checkItem = this.$_.clone(_result.data);
          oldSafCheckTypeNm = this.checkItem.safCheckTypeNm;
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    beforeSubmit() {
      this.$validator
        .validateAll()
        .then((_result) => {
          if (_result) {
            // 안전점검항목명이 변경됬을 경우 중복체크
            if (oldSafCheckTypeNm !== this.checkItem.safCheckTypeNm) {
              this.$http.url = this.checkUrl;
              this.$http.param = {
                safCheckTypeNm: this.checkItem.safCheckTypeNm,
                safCheckKindNo: this.checkItem.safCheckKindNo,
                safCheckItemNo: 1,
              };
              this.$http.type = 'GET';
              this.$http.request(
                (_result) => {
                  if (_result.data.length === 0) {
                    window.getApp.$emit('CONFIRM', {
                      title: 'L0000003321', // 확인
                      message: 'M0000000011', // 저장하시겠습니까?
                      // TODO : 필요시 추가하세요.
                      type: 'info', // success / info / warning / error
                      // 확인 callback 함수
                      confirmCallback: () => {
                        this.checkItem.updateUserId = this.$store.getters.token;
                        this.isEdit = true;
                      },
                    });
                  } else {
                    window.getApp.$emit('ALERT', {
                      title: 'L0000003395', // 안내
                      message: 'M0000000609', // 점검항목명이 중복 됩니다.
                      type: 'warning', // success / info / warning / error
                    });
                  }
                },
                (_error) => {
                  window.getApp.$emit('APP_REQUEST_ERROR', _error);
                }
              );
            } else {
              window.getApp.$emit('CONFIRM', {
                title: 'L0000003321', // 확인
                message: 'M0000000011', // 저장하시겠습니까?
                // TODO : 필요시 추가하세요.
                type: 'info', // success / info / warning / error
                // 확인 callback 함수
                confirmCallback: () => {
                  this.checkItem.updateUserId = this.$store.getters.token;
                  this.isEdit = true;
                },
              });
            }
          } else {
            this.$popupRequired.check(
              'checkItemDetail',
              this.$data,
              this.errors
            );
          }
        })
        .catch(() => {
          this.isEdit = false;
          if (!this.isEdit) {
            window.getApp.$emit(
              'APP_VALID_ERROR',
              'M0000000876' // 유효성 검사도  에러가 발생하였습니다.
            );
          }
        });
    },
    beforeInsert() {
      this.$validator
        .validateAll()
        .then((_result) => {
          if (_result) {
            this.$http.url = this.checkUrl;
            this.$http.param = {
              safCheckTypeNm: this.checkItem.safCheckTypeNm,
              safCheckKindNo: this.checkItem.safCheckKindNo,
              safCheckItemNo: 0,
            };
            this.$http.type = 'GET';
            this.$http.request(
              (_result) => {
                if (_result.data.length === 0) {
                  window.getApp.$emit('CONFIRM', {
                    title: 'L0000003321', // 확인
                    message: 'M0000000011', // 저장하시겠습니까?
                    // TODO : 필요시 추가하세요.
                    type: 'info', // success / info / warning / error
                    // 확인 callback 함수
                    confirmCallback: () => {
                      this.checkItem.createUserId = this.$store.getters.token;
                      this.isInsert = true;
                    },
                  });
                } else {
                  window.getApp.$emit('ALERT', {
                    title: 'L0000003395', // 안내
                    message: 'M0000000609', // 점검항목명이 중복 됩니다.
                    type: 'warning', // success / info / warning / error
                  });
                }
              },
              (_error) => {
                window.getApp.$emit('APP_REQUEST_ERROR', _error);
              }
            );
          } else {
            this.$popupRequired.check(
              'checkItemDetail',
              this.$data,
              this.errors
            );
          }
        })
        .catch(() => {
          this.isInsert = false;
          window.getApp.$emit(
            'APP_VALID_ERROR',
            'M0000000876' // 유효성 검사도  에러가 발생하였습니다.
          );
        });
    },
    btnSaveClickedCallback(result) {
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // 안내
        message: 'M0000000006', // 저장되었습니다.
        type: 'success', // success / info / warning / error
      });
      this.isEdit = false;
      // this.$emit('APP_REQUEST_SUCCESS', '수정 버튼이 클릭 되었습니다.');
    },
    btnInsertClickedCallback(result) {
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // 안내
        message: 'M0000000006', // 저장되었습니다.
        type: 'success', // success / info / warning / error
      });
      this.checkItem.safCheckItemNo = this.$_.clone(result.data);
      this.isInsert = false;
      this.updateMode = true;
    },
    btnClickedErrorCallback(result) {
      this.updateMode = false;
      this.isInsert = false;
      this.isEdit = false;
      window.getApp.$emit('APP_REQUEST_ERROR', result);
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
    // 팝업 닫기
    btnClosePopup() {
      // 부모창에 값 전달
      this.$emit('closePopup', { success: true });
    },
  },
};
</script>
