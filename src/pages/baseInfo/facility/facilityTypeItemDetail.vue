<!--
  목적 : 설비관리 - 설비유형 관리
  Detail : 설비유형 상세 등록/수정화면
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <!-- 등록 -->
    <b-row class="mt-3" ref="editBox">
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- 설비 유형별 세부항목 상세 -->
            <y-label
              label="L0000001590"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 저장 -->
              <y-btn
                v-if="updateMode && editable"
                :action-url="editUrl"
                :param="facilityTypeItem"
                :is-submit="isEdit"
                title="L0000002474"
                color="orange"
                action-type="PUT"
                beforeSubmit="beforeSubmit"
                @beforeSubmit="beforeSubmit"
                @btnClicked="btnSaveClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <y-btn
                v-if="!updateMode && editable"
                :action-url="insertUrl"
                :param="facilityTypeItem"
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
              <!-- 설비유형 -->
              <y-tree-facility-type
                :editable="editable"
                :required="true"
                label="L0000001597"
                name="safFacilityTypeCd"
                v-validate="'required'"
                v-model="facilityTypeItem.safFacilityTypeCd"
                :state="validateState('safFacilityTypeCd')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 세부항목명 -->
              <y-text
                :width="8"
                :editable="editable"
                :maxlength="50"
                :required="true"
                ui="bootstrap"
                label="L0000001646"
                name="safFacilityTypeItemNm"
                v-validate="'required'"
                v-model="facilityTypeItem.safFacilityTypeItemNm"
                :state="validateState('safFacilityTypeItemNm')"
              ></y-text>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
              <!-- 추가설명 -->
              <y-textarea
                :width="10"
                :editable="editable"
                :maxlength="600"
                ui="bootstrap"
                label="L0000002894"
                name="safFacilityTypeItemExplain"
                v-model="facilityTypeItem.safFacilityTypeItemExplain"
              ></y-textarea>
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
                v-model="facilityTypeItem.useYn"
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
                v-model="facilityTypeItem.sortOrder"
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
  name: 'y-facility-type-item-detail',
  props: {
    popupParam: {
      type: Object,
      default: {
        safFacilityTypeItemNo: '',
      },
    },
  },
  data: () => ({
    facilityTypeItem: {
      safFacilityTypeItemNo: '',
      safFacilityTypeCd: null,
      safFacilityTypeItemNm: '',
      safFacilityTypeItemExplain: '',
      sortOrder: 0,
      useYn: 'Y',
      safFacilityTypeNm: '',
      createUserId: '',
      updateUserId: '',
    },
    editable: false,
    updateMode: false,
    isInsert: false,
    isEdit: false,
    editUrl: '',
    insertUrl: '',
    searchUrl: '',
    searchDetailUrl: '',
    checkUrl: '',
  }),
  //* Vue lifecycle: created, mounted, destroyed, etc */
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
      this.searchUrl = selectConfig.baseInfo.facilityTypeItem.list.url;
      this.searchDetailUrl = selectConfig.baseInfo.facilityTypeItem.get.url;
      this.checkUrl = selectConfig.baseInfo.facilityTypeItem.check.url;
      this.editUrl = transactionConfig.baseInfo.facilityTypeItem.edit.url;
      this.insertUrl = transactionConfig.baseInfo.facilityTypeItem.insert.url;

      if (this.popupParam.safFacilityTypeItemNo !== '') {
        this.getDetail();
      }
    },
    getDetail() {
      this.$http.url = this.$format(
        this.searchDetailUrl,
        this.popupParam.safFacilityTypeItemNo
      );
      this.$http.type = 'GET';

      this.$http.request(
        (_result) => {
          this.updateMode = true;
          this.facilityTypeItem = this.$_.clone(_result.data);
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
    /** 수정 하기전 UI단 유효성 검사 **/
    beforeSubmit() {
      this.beforeSaveCheck('edit');
    },
    beforeInsert() {
      this.beforeSaveCheck('insert');
    },
    beforeSaveCheck(flag) {
      this.$validator
        .validateAll()
        .then((_result) => {
          if (_result) {
            this.$http.url = this.checkUrl;
            this.$http.param = {
              safFacilityTypeItemNo:
                flag === 'edit'
                  ? this.facilityTypeItem.safFacilityTypeItemNo
                  : 0,
              safFacilityTypeItemNm:
                this.facilityTypeItem.safFacilityTypeItemNm,
              safFacilityTypeCd: this.facilityTypeItem.safFacilityTypeCd,
            };
            this.$http.type = 'GET';

            this.$http.request(
              (_result) => {
                let resultData = true;
                this.$_.forEach(_result.data, (item) => {
                  if (
                    item.gubun === 'safFacilityTypeItemNm' &&
                    this.$_.parseInt(item.cnt) > 0
                  ) {
                    window.getApp.$emit('ALERT', {
                      title: 'L0000003395',
                      message: 'M0000000125',
                      // 이미 존재하는 세부항목명입니다.
                      type: 'warning', // success / info / warning / error
                    });
                    resultData = false;
                    return false;
                  }
                });
                if (!resultData) return;
                else {
                  window.getApp.$emit('CONFIRM', {
                    title: 'L0000003321',
                    message: flag === 'edit' ? 'M0000000011' : 'M0000000011',
                    // 저장하시겠습니까?
                    type: 'info', // success / info / warning / error
                    // 확인 callback 함수
                    confirmCallback: () => {
                      this.facilityTypeItem.createUserId =
                        this.$store.getters.token;
                      this.facilityTypeItem.updateUserId =
                        this.$store.getters.token;
                      if (flag === 'edit') this.isEdit = true;
                      else this.isInsert = true;
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
              'facilityTypeItemDetail',
              this.$data,
              this.errors
            );
          }
        })
        .catch(() => {
          window.getApp.$emit(
            'APP_VALID_ERROR',
            'M0000000876'
            // 유효성 검사도중 에러가 발생하였습니다.'
          );
          this.isEdit = false;
          this.isInsert = false;
        });
    },
    btnSaveClickedCallback(result) {
      window.getApp.$emit('ALERT', {
        title: 'L0000003395',
        message: 'M0000000006',
        type: 'success', // success / info / warning / error
      });
      this.isEdit = false;
    },
    btnClickedErrorCallback(result) {
      window.getApp.$emit('APP_REQUEST_ERROR', result);
    },
    btnInsertClickedCallback(result) {
      window.getApp.$emit('ALERT', {
        title: 'L0000003395',
        message: 'M0000000006',
        type: 'success', // success / info / warning / error
      });
      this.facilityTypeItem.safFacilityTypeItemNo = result.data;
      this.isInsert = false;
      this.updateMode = true;
    },
    btnClosePopup() {
      // 부모창에 값 전달
      this.$emit('closePopup', { success: true });
    },
  },
};
</script>
