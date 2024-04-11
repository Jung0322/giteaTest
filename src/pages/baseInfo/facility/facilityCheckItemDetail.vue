<!--
  목적 : 안전점검 - 안전 설비 점검 항목
  Detail : 안전 설비 점검 항목 등록/수정화면
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
            <!-- 설비유형별 점검 항목 상세 -->
            <y-label
              label="L0000001604"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 저장 -->
              <y-btn
                v-if="updateMode && editable"
                :action-url="editUrl"
                :param="facilityCheckItem"
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
                :param="facilityCheckItem"
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
                v-model="facilityCheckItem.plantCd"
                v-validate="'required'"
                :state="validateState('plantCd')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 설비유형 -->
              <y-tree-facility-type
                :editable="editable"
                :required="true"
                label="L0000001597"
                name="safFacilityTypeCd"
                v-validate="'required'"
                v-model="facilityCheckItem.safFacilityTypeCd"
                :state="validateState('safFacilityTypeCd')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 설비점검종류 -->
              <y-select
                :width="8"
                :comboItems="detailComboFacilityCheckCd"
                :required="true"
                :editable="editable"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                label="L0000001616"
                name="safCheckTypeCd"
                v-validate="'required'"
                v-model="facilityCheckItem.safCheckTypeCd"
                :state="validateState('safCheckTypeCd')"
              ></y-select>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 설비점검항목명 -->
              <y-text
                :width="8"
                :required="true"
                :maxlength="50"
                :editable="editable"
                ui="bootstrap"
                label="L0000001617"
                name="safFacilityCheckNm"
                v-validate="'required'"
                v-model="facilityCheckItem.safFacilityCheckNm"
                :state="validateState('safFacilityCheckNm')"
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
                v-model="facilityCheckItem.useYn"
              ></y-switch>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 정렬순서 -->
              <y-number
                :width="8"
                :maxlength="5"
                :editable="editable"
                :hasSeperator="false"
                :isPositive="true"
                :required="true"
                ui="bootstrap"
                label="L0000002601"
                name="sortOrder"
                v-model="facilityCheckItem.sortOrder"
                v-validate="'required'"
                :state="validateState('sortOrder')"
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
  name: 'y-facility-check-item-detail',
  props: {
    popupParam: {
      type: Object,
      default: {
        safFacilityCheckItemNo: 0,
        pageNm: '',
        noAccUseYn: false,
      },
    },
  },
  data: () => ({
    facilityCheckItem: {
      plantCd: null,
      safFacilityCheckItemNo: '', // 설비점검항목번호
      safCheckTypeCd: null, // 설비점검종류코드
      safCheckTypeNm: '', // 설비점검종류명
      safFacilityTypeCd: null, // 안전설비유형코드
      safFacilityTypeNm: '', // 안전설비유형명
      safFacilityCheckNm: '', // 설비점검항목명
      sortOrder: 0, // 정렬순서
      useYn: 'Y', // 사용여부
      createUserId: '',
      updateUserId: '',
    },
    detailComboFacilityCheckCd: [],
    editable: false,
    updateMode: false,
    isInsert: false,
    isEdit: false,
    editUrl: '',
    insertUrl: '',
    searchDetailUrl: '',
    checkUrl: '',
  }),
  //* Vue lifecycle: created, mounted, destroyed, etc */
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

      this.searchDetailUrl = selectConfig.baseInfo.facilityCheckItem.get.url;
      this.checkUrl = selectConfig.baseInfo.facilityCheckItem.check.url;
      this.editUrl = transactionConfig.baseInfo.facilityCheckItem.edit.url;
      this.insertUrl = transactionConfig.baseInfo.facilityCheckItem.insert.url;

      this.$comm.getComboItems('SAF_FACILITY_CHECK', false).then((_result) => {
        this.detailComboFacilityCheckCd = _result;
      });
      if (this.popupParam.safFacilityCheckItemNo !== 0) {
        this.getDetail();
      }
    },
    getDetail() {
      this.$http.url = this.$format(
        this.searchDetailUrl,
        this.popupParam.safFacilityCheckItemNo
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.updateMode = true;
          this.facilityCheckItem = this.$_.clone(_result.data);
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
    btnClosePopup() {
      // 부모창에 값 전달
      this.$emit('closePopup', { success: true });
    },
    beforeSaveCheck(flag) {
      this.$validator
        .validateAll()
        .then((_result) => {
          if (_result) {
            this.$http.url = this.checkUrl;
            this.$http.param = {
              safFacilityCheckItemNo:
                flag === 'edit'
                  ? this.facilityCheckItem.safFacilityCheckItemNo
                  : 0,
              safFacilityCheckNm: this.facilityCheckItem.safFacilityCheckNm,
              plantCd: this.facilityCheckItem.plantCd,
              safCheckTypeCd: this.facilityCheckItem.safCheckTypeCd,
              safFacilityTypeCd: this.facilityCheckItem.safFacilityTypeCd,
            };
            this.$http.type = 'GET';

            this.$http.request(
              (_result) => {
                let resultData = true;
                this.$_.forEach(_result.data, (item) => {
                  if (
                    item.gubun === 'safFacilityCheckNm' &&
                    this.$_.parseInt(item.cnt) > 0
                  ) {
                    window.getApp.$emit('ALERT', {
                      title: 'L0000003395', // 안내
                      message: 'M0000000120', // 이미 존재하는 설비점검항목명입니다.
                      type: 'warning', // success / info / warning / error
                    });
                    resultData = false;
                    return false;
                  }
                });
                if (!resultData) return;
                else {
                  window.getApp.$emit('CONFIRM', {
                    title: 'L0000003321', // 확인
                    message: 'M0000000011', // 저장하시겠습니까?
                    // TODO : 필요시 추가하세요.
                    type: 'info', // success / info / warning / error
                    // 확인 callback 함수
                    confirmCallback: () => {
                      this.facilityCheckItem.createUserId =
                        this.$store.getters.token;
                      this.facilityCheckItem.updateUserId =
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
              'facilityCheckItemDetail',
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
          this.isEdit = false;
          this.isInsert = false;
        });
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
      this.facilityCheckItem.safFacilityCheckItemNo = result.data;
      this.isInsert = false;
      this.updateMode = true;
    },
    btnClickedErrorCallback(result) {
      this.isInsert = false;
      this.isEdit = false;
      window.getApp.$emit('APP_REQUEST_ERROR', result);
    },
  },
};
</script>
