<!--
  목적 : 가동전점검 - 가동전점검 점검 항목
  Detail : 가동전점검 점검 항목 등록/수정화면
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
            <!-- 가동전유형별 점검 항목 상세 -->
            <y-label
              label="L0000004064"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 저장 -->
              <y-btn
                v-if="updateMode && editable"
                :action-url="editUrl"
                :param="befOperationItem"
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
                :param="befOperationItem"
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
                v-model="befOperationItem.plantCd"
                v-validate="'required'"
                :state="validateState('plantCd')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 점검유형 -->
              <y-select
                v-if="popupParam.kind === 'L'"
                :width="8"
                :comboItems="comboPreOperationItems"
                :required="true"
                :editable="editable"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                label="L0000004068"
                name="safCheckTypeCd"
                v-validate="'required'"
                v-model="befOperationItem.safCheckTypeCd"
                :state="validateState('safCheckTypeCd')"
              ></y-select>
              <!-- 점검유형 -->
              <y-select
                v-else
                :width="8"
                :comboItems="comboPreOperationItems"
                :required="true"
                :editable="editable"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                label="L0000004068"
                name="safCheckTypeCd"
                v-validate="'required'"
                v-model="befOperationItem.safCheckTypeCd"
                :state="validateState('safCheckTypeCd')"
                @datachange="dataChange"
              ></y-select>
            </b-col>
            <b-col
              v-if="popupParam.kind === 'S'"
              sm="6"
              md="6"
              lg="6"
              xl="6"
              class="col-xxl-6"
            >
              <!-- 대분류내용 -->
              <y-select
                :width="8"
                :editable="editable"
                :comboItems="categoryCdItems2"
                itemText="safFacilityCheckNm"
                itemValue="safFacilityCheckItemNo"
                :required="true"
                ui="bootstrap"
                label="L0000004073"
                name="ppSafFacilityCheckNm"
                v-model="befOperationItem.ppSafFacilityCheckNm"
                v-validate="'required'"
                :state="validateState('ppSafFacilityCheckNm')"
                @datachange="dataChange2"
              ></y-select>
            </b-col>
            <b-col
              v-else-if="popupParam.kind === 'M'"
              sm="6"
              md="6"
              lg="6"
              xl="6"
              class="col-xxl-6"
            >
              <!-- 대분류내용 -->
              <y-select
                :width="8"
                :editable="editable"
                :comboItems="categoryCdItems2"
                itemText="safFacilityCheckNm"
                itemValue="safFacilityCheckItemNo"
                :required="true"
                ui="bootstrap"
                label="L0000004073"
                name="pSafFacilityCheckNm"
                v-model="befOperationItem.pSafFacilityCheckNm"
                v-validate="'required'"
                :state="validateState('pSafFacilityCheckNm')"
              ></y-select>
            </b-col>
            <b-col
              v-if="popupParam.kind === 'S'"
              sm="6"
              md="6"
              lg="6"
              xl="6"
              class="col-xxl-6"
            >
              <!-- 중분류내용 -->
              <y-select
                :width="8"
                :editable="editable"
                :comboItems="categoryCdItems3"
                itemText="safFacilityCheckNm"
                itemValue="safFacilityCheckItemNo"
                :required="true"
                ui="bootstrap"
                label="L0000004074"
                name="pSafFacilityCheckNm"
                v-model="befOperationItem.pSafFacilityCheckNm"
                v-validate="'required'"
                :state="validateState('pSafFacilityCheckNm')"
              ></y-select>
            </b-col>

            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
              <!-- 점검내용 -->
              <y-text
                :width="10"
                :required="true"
                :maxlength="100"
                :editable="editable"
                ui="bootstrap"
                label="L0000004070"
                name="safFacilityCheckNm"
                v-validate="'required'"
                v-model="befOperationItem.safFacilityCheckNm"
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
                v-model="befOperationItem.useYn"
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
                ui="bootstrap"
                label="L0000002601"
                name="sortOrder"
                v-model="befOperationItem.sortOrder"
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
        safCheckTypeCd: '',
        dataLvlCd: '',
        kind: '',
        tempFirstItems: null,
        tempSecondItems: null,
      },
    },
  },
  data: () => ({
    befOperationItem: {
      plantCd: null,
      safFacilityCheckItemNo: '', // 가동전점검항목번호
      safCheckTypeCd: null, // 가동전점검종류코드
      safCheckTypeNm: '', // 가동전점검종류명
      safFacilityTypeCd: null, // 가동전유형코드
      safFacilityTypeNm: '', // 가동전유형명
      safFacilityCheckNm: '', // 가동전점검항목명
      sortOrder: 0, // 정렬순서
      useYn: 'Y', // 사용여부
      createUserId: '',
      updateUserId: '',

      dataLvlCd: null,
      ppSafFacilityCheckNm: null,
      pSafFacilityCheckNm: null,
    },
    comboPreOperationItems: [],
    categoryCdItems2: [],
    categoryCdItems3: [],
    editable: false,
    updateMode: false,
    isInsert: false,
    isEdit: false,
    editUrl: '',
    insertUrl: '',
    searchDetailUrl: '',
    checkUrl: '',
  }),
  watch: {
    'befOperationItem.pSafFacilityCheckNm'() {
      this.getItems2();
    },
    'befOperationItem.ppSafFacilityCheckNm'() {
      this.getItems3();
    },
  },
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

      this.searchDetailUrl = selectConfig.baseInfo.inspBefOper.get.url;
      this.checkUrl = selectConfig.baseInfo.inspBefOper.check.url;
      this.editUrl = transactionConfig.baseInfo.inspBefOper.edit.url;
      this.insertUrl = transactionConfig.baseInfo.inspBefOper.insert.url;

      this.$comm
        .getComboItems('SAF_PREOPERATION_CHECK', false)
        .then((_result) => {
          this.comboPreOperationItems = _result;
        });
      // 초기값 설정
      if (this.popupParam.safFacilityCheckItemNo === 0) {
        if (
          this.popupParam.tempFirstItems.plantCd &&
          this.popupParam.kind === 'M'
        ) {
          this.befOperationItem.plantCd =
            this.popupParam.tempFirstItems.plantCd;
          this.befOperationItem.safCheckTypeCd =
            this.popupParam.tempFirstItems.safCheckTypeCd;
          this.befOperationItem.pSafFacilityCheckNm =
            this.popupParam.tempFirstItems.safFacilityCheckItemNo;
        } else if (
          this.popupParam.tempSecondItems.plantCd &&
          this.popupParam.kind === 'S'
        ) {
          this.befOperationItem.plantCd =
            this.popupParam.tempSecondItems.plantCd;
          this.befOperationItem.safCheckTypeCd =
            this.popupParam.tempSecondItems.safCheckTypeCd;
          this.befOperationItem.pSafFacilityCheckNm =
            this.popupParam.tempSecondItems.safFacilityCheckItemNo;
          this.befOperationItem.ppSafFacilityCheckNm =
            this.popupParam.tempSecondItems.pSafFacilityCheckNm;
        } else if (
          this.popupParam.safCheckTypeCd &&
          this.popupParam.kind === 'L'
        ) {
          this.befOperationItem.safCheckTypeCd = this.popupParam.safCheckTypeCd;
        }
      }

      if (this.popupParam.safFacilityCheckItemNo !== 0) {
        this.getDetail();
      }

      this.getItems2();

      if (this.popupParam.kind === 'S') {
        this.getItems3();
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
          this.befOperationItem = this.$_.clone(_result.data);
          this.getItems2();
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    dataChange() {
      this.befOperationItem.pSafFacilityCheckNm = null;
      this.getItems2();
    },
    dataChange2() {
      this.befOperationItem.pSafFacilityCheckNm = null;
      this.getItems3();
    },
    getItems2() {
      this.$http.url = this.$format(
        selectConfig.baseInfo.inspBefOper.items.url,
        'ECL01',
        this.befOperationItem.safCheckTypeCd,
        null,
        'Y',
        this.befOperationItem.plantCd
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.categoryCdItems2 = this.$_.clone(_result.data);
          this.categoryCdItems2.splice(0, 0, {
            safFacilityCheckItemNo: null,
            safFacilityCheckNm: this.$comm.getLangSpecInfoLabel('L0000003394'), // 선택하세요
          });
        },
        (_error) => {
          window.getApp.$emit(
            'APP_REQUEST_ERROR',
            'M0000000016' // 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.
          );
        }
      );
    },
    getItems3() {
      this.$http.url = this.$format(
        selectConfig.baseInfo.inspBefOper.items.url,
        'ECL02',
        this.befOperationItem.safCheckTypeCd,
        this.befOperationItem.ppSafFacilityCheckNm,
        'Y',
        this.befOperationItem.plantCd
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.categoryCdItems3 = this.$_.clone(_result.data);
          this.categoryCdItems3.splice(0, 0, {
            safFacilityCheckItemNo: null,
            safFacilityCheckNm: this.$comm.getLangSpecInfoLabel('L0000003394'), // 선택하세요
          });
        },
        (_error) => {
          window.getApp.$emit(
            'APP_REQUEST_ERROR',
            'M0000000016' // 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.
          );
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
      this.$emit('closePopup', {
        data: {
          kind: this.popupParam.kind,
        },
      });
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
                  ? this.befOperationItem.safFacilityCheckItemNo
                  : 0,
              safFacilityCheckNm: this.befOperationItem.safFacilityCheckNm,
              plantCd: this.befOperationItem.plantCd,
              safCheckTypeCd: this.befOperationItem.safCheckTypeCd,
            };
            this.$http.type = 'GET';

            this.$http.request(
              (_result) => {
                let resultData = true;
                // if (
                //   _result.data > 0
                // ) {
                //   window.getApp.$emit('ALERT', {
                //     title: 'L0000003395', // 안내
                //     message: '이미 존재하는 점검항목명입니다.', // 이미 존재하는 점검항목명입니다.
                //     type: 'warning', // success / info / warning / error
                //   });
                //   resultData = false;
                //   return false;
                // }
                // if (!resultData) return;
                // else {
                window.getApp.$emit('CONFIRM', {
                  title: 'L0000003321', // 확인
                  message: 'M0000000011', // 저장하시겠습니까?
                  // TODO : 필요시 추가하세요.
                  type: 'info', // success / info / warning / error
                  // 확인 callback 함수
                  confirmCallback: () => {
                    this.befOperationItem.createUserId =
                      this.$store.getters.token;
                    this.befOperationItem.updateUserId =
                      this.$store.getters.token;
                    this.befOperationItem.dataLvlCd = this.popupParam.dataLvlCd;
                    if (flag === 'edit') this.isEdit = true;
                    else this.isInsert = true;
                  },
                });
                // }
              },
              (_error) => {
                window.getApp.$emit('APP_REQUEST_ERROR', _error);
              }
            );
          } else {
            this.$popupRequired.check(
              'inspBefOperResultItemDetail',
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
      this.befOperationItem.safFacilityCheckItemNo = result.data;
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
