<template>
  <b-container fluid>
    <b-row ref="detailBox">
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- SHE목표 분야별 항목 관리 상세 -->
            <y-label
              label="L0000005096"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 저장 -->
              <y-btn
                v-if="editable && !createMode && updateMode"
                :action-url="editUrl"
                :param="bizFieldItem"
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
                v-if="editable && createMode"
                :action-url="insertUrl"
                :param="bizFieldItem"
                :is-submit="isCreateSubmit"
                title="L0000002474"
                color="orange"
                action-type="post"
                beforeSubmit="beforeCreateSubmit"
                @beforeCreateSubmit="beforeCreateSubmit"
                @btnClicked="btnCreateClickedCallback"
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
              <!-- 분야 -->
              <y-select
                :width="8"
                :required="true"
                :comboItems="bizFieldCdSearchItems"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                label="L0000001346"
                name="bizFieldCd"
                v-model="bizFieldItem.bizFieldCd"
                v-validate="'required'"
                :state="validateState('bizFieldCd')"
              ></y-select>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 항목명 -->
              <y-text
                :width="8"
                :editable="editable"
                :required="true"
                :maxlength="50"
                ui="bootstrap"
                label="L0000003199"
                name="bizFieldItemNm"
                v-model="bizFieldItem.bizFieldItemNm"
                v-validate="'required'"
                :state="validateState('bizFieldItemNm')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 소수점 자리수 -->
              <y-number
                :width="8"
                :editable="editable"
                :maxlength="5"
                :hasSeperator="false"
                ui="bootstrap"
                label="L0000004965"
                name="decPlace"
                v-model="bizFieldItem.decPlace"
              />
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
                v-model="bizFieldItem.sortOrder"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 대시보드 사용여부 -->
              <y-switch
                :width="8"
                :editable="editable"
                true-value="Y"
                false-value="N"
                ui="bootstrap"
                label="L0000005307"
                name="dashboardYn"
                selectText="L0000001440"
                unselectText="L0000001063"
                v-model="bizFieldItem.dashboardYn"
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
                v-model="bizFieldItem.useYn"
              />
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import transactionConfig from '@/js/transactionConfig';
import selectConfig from '@/js/selectConfig';
export default {
  /** attributes: name, components, props, data **/
  name: 'safety-action-biz-field-item-detail',
  props: {
    popupParam: {
      type: Object,
      default: {
        bizFieldItemNo: 0,
        pageNm: '',
      },
    },
  },
  data() {
    return {
      bizFieldItem: {
        bizFieldItemNo: 0,
        bizFieldCd: null,
        bizFieldItemNm: '',
        decPlace: 0,
        sortOrder: 0,
        dashboardYn: 'N',
        useYn: 'Y',
        createUserId: '',
        createUserNm: '',
        createDt: '',
        updateUserId: '',
        updateUserNm: '',
        updateDt: '',
      },
      editable: false,
      createMode: true,
      updateMode: false,
      isCreateSubmit: false,
      isUpdateSubmit: false,

      insertUrl: '',
      editUrl: '',
      detailUrl: '',
      checkUrl: '',

      bizFieldCdSearchItems: [], // 분야 리스트
    };
  },
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {},
  beforeDestroy() {},
  methods: {
    init() {
      this.editable = this.$route.meta.editable;

      this.insertUrl =
        transactionConfig.mgt.safetyActionBizFieldItem.insert.url;
      this.editUrl = transactionConfig.mgt.safetyActionBizFieldItem.edit.url;
      this.detailUrl = selectConfig.mgt.safetyActionBizFieldItem.get.url;
      this.checkUrl = selectConfig.mgt.safetyActionBizFieldItem.check.url;

      this.getComboItems('MGT_BIZ_FIELD'); // 분야

      if (this.popupParam.bizFieldItemNo) {
        this.getDetail();
      } else {
        this.createMode = true;
      }
    },

    /**
     * 공통 마스터 정보 조회 (분야)
     * codeGroupCd : 마스터 테이블 codeGroupCd 정보
     */
    getComboItems(codeGroupCd) {
      this.$http.url = this.$format(
        selectConfig.codeMaster.getSelect.url,
        codeGroupCd
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          if (codeGroupCd === 'MGT_BIZ_FIELD') {
            this.bizFieldCdSearchItems = this.$_.clone(_result.data);
            this.bizFieldCdSearchItems.splice(0, 0, {
              code: null,
              codeNm:
                this.$comm.getLangSpecInfoLabel(
                  'L0000003394'
                ) /* '선택하세요' */,
            });
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },

    getDetail() {
      this.$http.url = this.$format(
        this.detailUrl,
        this.popupParam.bizFieldItemNo
      );
      this.$http.type = 'get';
      this.$http.request(
        (_result) => {
          this.createMode = false;
          this.updateMode = true;
          this.bizFieldItem = _result.data;
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
    beforeUpdateSubmit() {
      this.checkBeforSubmit('edit');
    },
    beforeCreateSubmit() {
      this.checkBeforSubmit('insert');
    },
    btnUpdateClickedCallback(_result) {
      this.isUpdateSubmit = false;
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // 안내
        message: 'M0000000006', // 저장되었습니다.
        type: 'success',
      });
    },
    btnCreateClickedCallback(_result) {
      this.bizFieldItem.bizFieldItemNo = _result.data;
      this.isCreateSubmit = false;
      this.createMode = false;
      this.updateMode = true;
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // 안내
        message: 'M0000000006', // 저장되었습니다.
        type: 'success',
      });
    },
    btnClickedErrorCallback(_result) {
      this.isCreateSubmit = false;
      this.isUpdateSubmit = false;
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },

    checkBeforSubmit(flag) {
      this.$validator
        .validateAll()
        .then((_result) => {
          if (_result) {
            this.$http.url = this.checkUrl;
            this.$http.type = 'get';
            this.$http.param = {
              bizFieldCd: this.bizFieldItem.bizFieldCd,
              bizFieldItemNm: this.bizFieldItem.bizFieldItemNm,
              bizFieldItemNo: this.bizFieldItem.bizFieldItemNo,
            };
            this.$http.request(
              (_result) => {
                let result = true;
                if (_result.data && _result.data.length > 0) {
                  if (
                    flag === 'insert' &&
                    this.$_.findIndex(_result.data, { gubun: 'code' }) > -1
                  ) {
                    window.getApp.$emit('ALERT', {
                      title: 'L0000003395', // 안내
                      message: 'M0000000050', // 이미 존재하는 항목입니다.
                      type: 'warning',
                    });
                    result = false;
                  } else if (
                    this.$_.findIndex(_result.data, { gubun: 'name' }) > -1
                  ) {
                    window.getApp.$emit('ALERT', {
                      title: 'L0000003395', // 안내
                      message: 'M0000000050', // 이미 존재하는 항목입니다.
                      type: 'warning',
                    });
                    result = false;
                  }
                }

                if (result) {
                  window.getApp.$emit('CONFIRM', {
                    title: 'L0000003321', // 확인
                    message: 'M0000000011', // 저장하시겠습니까?
                    type: 'info',
                    confirmCallback: () => {
                      this.bizFieldItem.createUserId =
                        this.$store.getters.token;
                      this.bizFieldItem.updateUserId =
                        this.$store.getters.token;
                      if (flag === 'insert') this.isCreateSubmit = true;
                      else this.isUpdateSubmit = true;
                    },
                  });
                }
              },
              (_error) => {
                window.getApp.$emit('APP_REQUEST_ERROR', _error);
              }
            );
          } else {
            if (!this.bizFieldItem.bizFieldCd) {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395' /* 안내 */,
                message: 'M0000001084', // 분야를 선택해주세요.
                type: 'warning', // success / info / warning / error
              });
              return false;
            }
            if (!this.bizFieldItem.bizFieldItemNm) {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395' /* 안내 */,
                message: 'M0000000933', // 항목을 입력해 주세요.
                type: 'warning', // success / info / warning / error
              });
              return false;
            }
          }
        })
        .catch(() => {
          window.getApp.$emit(
            'APP_VALID_ERROR',
            'M0000000876' // 유효성 검사도  에러가 발생하였습니다.
          );
        });
    },
    // 팝업 닫기
    btnClosePopup() {
      // 부모창에 값 전달
      this.$emit('closePopup', { success: true });
    },
  },
};
</script>
