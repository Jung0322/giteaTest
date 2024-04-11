<!--
  목적 : (반드시 기입하세요) 컴포넌트
  작성자 : (이니셜로 반드시 입력하세요)
  Detail :
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
            <!-- 설비유형 상세 -->
            <y-label
              label="L0000001599"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 저장 -->
              <y-btn
                v-if="updateMode && editable"
                :action-url="editUrl"
                :param="facilityType"
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
                :param="facilityType"
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
              <y-btn title="L0000000881" @btnClicked="closePopup" />
            </div>
          </b-col>
        </b-row>
        <b-card>
          <b-row>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 설비유형코드 -->
              <y-text
                :width="8"
                :required="true"
                :maxlength="15"
                :disabled="updateMode"
                :editable="editable"
                ui="bootstrap"
                label="L0000001605"
                name="safFacilityTypeCd"
                v-validate="'required'"
                v-model="facilityType.safFacilityTypeCd"
                :state="validateState('safFacilityTypeCd')"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 설비유형명 -->
              <y-text
                :width="8"
                :maxlength="50"
                :required="true"
                :editable="editable"
                ui="bootstrap"
                label="L0000001601"
                name="safFacilityTypeNm"
                v-validate="'required'"
                v-model="facilityType.safFacilityTypeNm"
                :state="validateState('safFacilityTypeNm')"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 상위설비유형 -->
              <y-tree-facility-type
                :editable="editable"
                :search="search"
                label="L0000001537"
                v-model="facilityType.psafFacilityTypeCd"
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
                name="radioValue"
                selectText="L0000001440"
                unselectText="L0000001063"
                v-model="facilityType.useYn"
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
  name: 'y-facility-type-detail',
  props: {
    popupParam: {
      type: Object,
      default: {
        safFacilityTypeCd: 0,
      },
    },
  },
  data: () => ({
    facilityType: {
      safFacilityTypeCd: '',
      safFacilityTypeNm: '',
      psafFacilityTypeCd: '',
      // sortOrder: 0,
      useYn: 'Y',
    },
    searchParam: {
      safFacilityTypeNm: '',
      psafFacilityTypeCd: '',
    },
    search: false, // 설비유형 저장 후 설비유형 컴포넌트 재 조회하는 용도
    gridOptions: {
      header: [],
      data: [],
      height: '450',
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
  beforeDestroy() {
    // 윈도우 resize event 제거-SPA 기반이므로 제거하지 않으면 다른페이지에서 해당 이벤트가 호출됨
  },
  //* methods */
  methods: {
    init() {
      this.editable = this.$route.meta.editable;

      // Url Setting
      this.searchUrl = selectConfig.baseInfo.facilityType.list.url;
      this.searchDetailUrl = selectConfig.baseInfo.facilityType.get.url;
      this.checkUrl = selectConfig.baseInfo.facilityType.check.url;
      this.editUrl = transactionConfig.baseInfo.facilityType.edit.url;
      this.insertUrl = transactionConfig.baseInfo.facilityType.insert.url;
      if (this.popupParam.safFacilityTypeCd !== 0) {
        this.getDetail();
      }
    },
    getDetail() {
      this.$http.url = this.$format(
        this.searchDetailUrl,
        this.popupParam.safFacilityTypeCd
      );
      this.$http.type = 'GET';

      this.$http.request(
        (_result) => {
          this.updateMode = true;
          this.facilityType = this.$_.clone(_result.data);
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
              safFacilityTypeCd: this.facilityType.safFacilityTypeCd,
              safFacilityTypeNm: this.facilityType.safFacilityTypeNm,
            };
            this.$http.type = 'GET';

            this.$http.request(
              (_result) => {
                let resultData = true;
                this.$_.forEach(_result.data, (item) => {
                  if (
                    item.gubun === 'saf_facility_type_cd' &&
                    flag === 'insert' &&
                    this.$_.parseInt(item.cnt) > 0
                  ) {
                    window.getApp.$emit('ALERT', {
                      title: 'L0000003395', // 안내
                      message: 'M0000000122',
                      // 이미 존재하는 설비유형코드입니다.
                      type: 'warning', // success / info / warning / error
                    });
                    resultData = false;
                    return false;
                  }
                  if (item.gubun === 'saf_facility_type_nm') {
                    if (this.$_.parseInt(item.cnt) > 0) {
                      window.getApp.$emit('ALERT', {
                        title: 'L0000003395', // 안내
                        message: 'M0000000123',
                        // 이미 존재하는 설비유형명입니다.
                        type: 'warning', // success / info / warning / error
                      });
                      resultData = false;
                      return false;
                    }
                  }
                });
                if (
                  this.facilityType.safFacilityTypeCd ===
                    this.facilityType.psafFacilityTypeCd &&
                  flag === 'edit'
                ) {
                  window.getApp.$emit('ALERT', {
                    title: 'L0000003395', // 안내
                    message: 'M0000000124',
                    // 상위설비유형을 자기자신으로 지정할 수 없습니다.
                    type: 'warning', // success / info / warning / error
                  });
                  resultData = false;
                }
                if (!resultData) return;
                else {
                  window.getApp.$emit('CONFIRM', {
                    title: 'L0000003321', // 확인
                    message: flag === 'edit' ? 'M0000000011' : 'M0000000011',
                    // 저장하시겠습니까?
                    type: 'info', // success / info / warning / error
                    // 확인 callback 함수
                    confirmCallback: () => {
                      this.facilityType.createUserId =
                        this.$store.getters.token;
                      this.facilityType.updateUserId =
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
              'facilityTypeDetail',
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
      this.search = !this.search;
      this.getDetail();
      this.isEdit = false;
    },
    btnInsertClickedCallback(result) {
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // 안내
        message: 'M0000000006', // 저장되었습니다.
        type: 'success', // success / info / warning / error
      });
      this.popupParam.safFacilityTypeCd = this.$_.clone(result.data);
      this.facilityType.safFacilityTypeCd = this.$_.clone(result.data);
      this.getDetail();
      this.search = !this.search;
      this.isInsert = false;
      this.updateMode = true;
    },

    btnClickedErrorCallback(result) {
      window.getApp.$emit('APP_REQUEST_ERROR', result);
    },
    closePopup(data) {
      this.$emit('closePopup', {});
    },
  },
};
</script>
