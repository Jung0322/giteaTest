<!--
  목적 : 안전점검 - 안전 점검 종류
  Detail : 안전 점검 종류 등록/수정화면
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <b-row class="mt-3" ref="editBox">
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- 점검종류 상세 -->
            <y-label
              label="L0000003718"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 저장 -->
              <y-btn
                v-if="editable && !updateMode"
                :action-url="insertUrl"
                :param="checkKind"
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
                v-if="editable && updateMode"
                :action-url="editUrl"
                :param="checkKind"
                :is-submit="isEdit"
                title="L0000002474"
                color="orange"
                action-type="PUT"
                beforeSubmit="beforeSubmit"
                @beforeSubmit="beforeSubmit"
                @btnClicked="btnSaveClickedCallback"
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
                :disabled="updateMode"
                name="plantCd"
                v-model="checkKind.plantCd"
                v-validate="'required'"
                :state="validateState('plantCd')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 점검종류 상세 -->
              <y-text
                :width="8"
                :required="true"
                :maxlength="30"
                :editable="editable"
                ui="bootstrap"
                label="L0000003718"
                name="safCheckKindNm"
                v-validate="'required'"
                v-model="checkKind.safCheckKindNm"
                :state="validateState('safCheckKindNm')"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 점검종류 -->
              <y-select
                :width="8"
                :comboItems="chngKindItems"
                :disabled="updateMode"
                :required="true"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                name="chngKind"
                label="L0000002576"
                v-model="checkKind.chngKind"
                v-validate="'required'"
                :state="validateState('chngKind')"
              ></y-select>
            </b-col>
            <!-- <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-switch
                :width="8"
                :editable="editable"
                true-value="Y"
                false-value="N"
                ui="bootstrap"
                label="안전점검여부"
                name="planUseYn"
                selectText="해당"
                unselectText="미해당"
                v-model="checkKind.planUseYn"
              ></y-switch>
            </b-col> -->
            <!-- 점검항목사용여부, 사용여부 중복 -->
            <!-- <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-switch
                :width="8"
                :editable="editable"
                :disabled="true"
                true-value="Y"
                false-value="N"
                ui="bootstrap"
                label="협력업체자체점검여부"
                name="subconUseYn"
                selectText="해당"
                unselectText="미해당"
                v-model="checkKind.subconUseYn"
              ></y-switch>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-switch
                :width="8"
                :editable="editable"
                :disabled="true"
                true-value="Y"
                false-value="N"
                ui="bootstrap"
                label="설비점검여부"
                name="facilityUseYn"
                selectText="해당"
                unselectText="미해당"
                v-model="checkKind.facilityUseYn"
              ></y-switch>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-switch
                :width="8"
                :editable="editable"
                :disabled="true"
                true-value="Y"
                false-value="N"
                ui="bootstrap"
                label="순회점검여부"
                name="patrolYn"
                selectText="해당"
                unselectText="미해당"
                v-model="checkKind.patrolYn"
              ></y-switch>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-switch
                :width="8"
                :editable="editable"
                :disabled="true"
                true-value="Y"
                false-value="N"
                ui="bootstrap"
                label="합동점검여부"
                name="congYn"
                selectText="해당"
                unselectText="미해당"
                v-model="checkKind.congYn"
              ></y-switch>
            </b-col> -->
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
                v-model="checkKind.useYn"
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
                v-model="checkKind.sortOrder"
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
  /* attributes: name, components, props, data */
  name: 'y-check-kind-detail',
  props: {
    popupParam: {
      type: Object,
      default: {
        safCheckKindNo: 0,
      },
    },
  },
  data: () => ({
    checkKind: {
      plantCd: null,
      chngKind: null,
      safCheckKindNo: 0,
      safCheckKindNm: '',
      planUseYn: 'N', // 안전점검으로 들어감
      itemUseYn: 'Y', // 고정
      subconUseYn: 'N',
      patrolYn: 'N',
      congYn: 'N',
      sortOrder: 0,
      useYn: 'Y',
      createUserId: '',
      updateUserId: '',
    },
    chngKindItems: [],
    editable: false,
    updateMode: false,
    isInsert: false,
    isEdit: false,
    editUrl: '',
    insertUrl: '',
    checkUrl: '',
  }),
  watch: {
    'checkKind.chngKind'() {
      if (this.popupParam.safCheckKindNo === 0) {
        if (this.checkKind.chngKind === 'CKC01') {
          this.checkKind.subconUseYn = 'Y';
          this.checkKind.planUseYn = 'N';
          this.checkKind.patrolYn = 'N';
          this.checkKind.congYn = 'N';
        } else if (this.checkKind.chngKind === 'CKC02') {
          this.checkKind.subconUseYn = 'N';
          this.checkKind.planUseYn = 'N';
          this.checkKind.patrolYn = 'N';
          this.checkKind.congYn = 'N';
        } else if (this.checkKind.chngKind === 'CKC04') {
          this.checkKind.subconUseYn = 'N';
          this.checkKind.planUseYn = 'N';
          this.checkKind.patrolYn = 'Y';
          this.checkKind.congYn = 'N';
        } else if (this.checkKind.chngKind === 'CKC05') {
          this.checkKind.subconUseYn = 'N';
          this.checkKind.planUseYn = 'N';
          this.checkKind.patrolYn = 'N';
          this.checkKind.congYn = 'Y';
        } else if (this.checkKind.chngKind === 'CKC03') {
          this.checkKind.subconUseYn = 'N';
          this.checkKind.planUseYn = 'Y';
          this.checkKind.patrolYn = 'N';
          this.checkKind.congYn = 'N';
        } else {
          this.checkKind.subconUseYn = 'N';
          this.checkKind.planUseYn = 'N';
          this.checkKind.patrolYn = 'N';
          this.checkKind.congYn = 'N';
        }
      }
    },
  },
  beforeCreate() {},
  created() {},
  updated() {},
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
      // Url Setting
      this.checkUrl = selectConfig.saf.checkKind.check.url;
      this.editUrl = transactionConfig.saf.checkKind.edit.url;
      this.insertUrl = transactionConfig.saf.checkKind.insert.url;

      this.$comm.getComboItems('CHECK_KIND_CD', false).then((_result) => {
        this.chngKindItems = _result;
      });
      if (this.popupParam.safCheckKindNo !== 0) {
        this.getDetail();
      }
    },
    getDetail() {
      this.$http.url = this.$format(
        selectConfig.saf.checkKind.get.url,
        this.popupParam.safCheckKindNo
      );
      this.$http.type = 'GET';

      this.$http.request(
        (_result) => {
          this.updateMode = true;
          this.checkKind = this.$_.clone(_result.data);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    checkInputValid(_action) {
      this.$validator
        .validateAll()
        .then((_result) => {
          if (_result) {
            this.$http.url = this.checkUrl;
            this.$http.param = {
              plantCd: this.checkKind.plantCd,
              safCheckKindNm: this.checkKind.safCheckKindNm,
              safCheckKindNo:
                _action === 'update' ? this.checkKind.safCheckKindNo : 0,
            };
            this.$http.type = 'GET';
            this.$http.request(
              (_result) => {
                if (_result.data.length === 0) {
                  window.getApp.$emit('CONFIRM', {
                    title: 'L0000003321', // 확인
                    message: 'M0000000011', // 저장하시겠습니까?
                    type: 'info', // success / info / warning / error
                    confirmCallback: () => {
                      if (_action === 'update') {
                        this.checkKind.updateUserId = this.$store.getters.token;
                        this.isEdit = true;
                      } else {
                        this.checkKind.createUserId = this.$store.getters.token;
                        this.isInsert = true;
                      }
                    },
                  });
                } else {
                  window.getApp.$emit('ALERT', {
                    title: 'L0000003395', // 안내
                    message: 'M0000000698', // 점검종류명이 중복 됩니다.
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
              'checkKindDetail',
              this.$data,
              this.errors
            );
          }
        })
        .catch(() => {
          window.getApp.$emit(
            'APP_VALID_ERROR',
            'M0000000876' // 유효성 검사도  에러가 발생하였습니다.
          );
          this.isInsert = false;
        });
    },
    /** 수정 하기전 UI단 유효성 검사 **/
    beforeSubmit() {
      this.checkInputValid('update');
    },
    beforeInsert() {
      this.checkInputValid('insert');
    },
    btnSaveClickedCallback(result) {
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // 안내
        message: 'M0000000006', // 저장되었습니다.
        type: 'success', // success / info / warning / error
      });
      this.isEdit = false;
    },
    btnInsertClickedCallback(result) {
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // 안내
        message: 'M0000000006', // 저장되었습니다.
        type: 'success', // success / info / warning / error
      });
      this.checkKind.safCheckKindNo = this.$_.clone(result.data);
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
