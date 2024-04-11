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
            <!-- 시설 상세 -->
            <y-label
              label="L0000001739"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 저장 -->
              <y-btn
                v-if="updateMode && editable"
                :action-url="editUrl"
                :param="safFacilityMst"
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
                :param="safFacilityMst"
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
              <y-plant
                type="edit"
                :editable="editable"
                :required="true"
                name="plantCd"
                v-model="safFacilityMst.plantCd"
                v-validate="'required'"
                :state="validateState('plantCd')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 시설유형 -->
              <y-select
                :width="8"
                :editable="editable"
                :required="true"
                :comboItems="comboFacilityTypeItems"
                itemText="comFacilityTypeNm"
                itemValue="comFacilityTypeCd"
                ui="bootstrap"
                name="comFacilityTypeCd"
                label="L0000001747"
                v-validate="'required'"
                v-model="safFacilityMst.comFacilityTypeCd"
                :state="validateState('facilityCd')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 시설코드 -->
              <y-text
                :width="8"
                :required="true"
                :maxlength="15"
                :disabled="updateMode"
                :editable="editable"
                ui="bootstrap"
                label="L0000001767"
                name="facilityCd"
                v-validate="'required'"
                v-model="safFacilityMst.facilityCd"
                :state="validateState('facilityCd')"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 시설명 -->
              <y-text
                :width="8"
                :maxlength="50"
                :required="true"
                :editable="editable"
                ui="bootstrap"
                label="L0000001743"
                name="facilityNm"
                v-validate="'required'"
                v-model="safFacilityMst.facilityNm"
                :state="validateState('facilityNm')"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 시설관리번호 -->
              <y-text
                :width="8"
                :maxlength="30"
                :editable="editable"
                ui="bootstrap"
                label="L0000001741"
                name="facilityMgrNum"
                v-model="safFacilityMst.facilityMgrNum"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 설치위치 -->
              <y-text
                :width="8"
                :maxlength="50"
                :editable="editable"
                ui="bootstrap"
                label="L0000001626"
                name="installLocate"
                v-model="safFacilityMst.installLocate"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-tree-dept
                type="edit"
                :plantCd="safFacilityMst.plantCd"
                name="deptCd"
                v-model="safFacilityMst.deptCd"
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
                v-model="safFacilityMst.useYn"
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
  name: 'y-facility-mst-detail',
  props: {
    popupParam: {
      type: Object,
      default: {
        facilityCd: 0,
      },
    },
  },
  data: () => ({
    safFacilityMst: {
      plantCd: '', // 사업장 코드
      comFacilityTypeCd: null,
      facilityCd: '',
      facilityNm: '',
      facilityMgrNum: '',
      installLocate: '',
      deptCd: '',
      useYn: 'Y',
    },
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
    comboFacilityTypeItems: [], // 시설유형
    editable: false,
    updateMode: false,
    isInsert: false,
    isEdit: false,
    editUrl: '',
    insertUrl: '',
    detailUrl: '',
  }),
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  methods: {
    init() {
      this.editable = this.$route.meta.editable;

      // Url Setting
      this.detailUrl = selectConfig.baseInfo.safFacility.facilityMst.get.url;
      this.editUrl =
        transactionConfig.baseInfo.safFacility.facilityMst.edit.url;
      this.insertUrl =
        transactionConfig.baseInfo.safFacility.facilityMst.insert.url;

      this.getComboFacilityTypeItems(); // 시설유형
      this.getDetail();
    },
    /** 시설유형 조회 **/
    getComboFacilityTypeItems() {
      this.$http.url = selectConfig.baseInfo.safFacility.facilityType.list.url;
      this.$http.type = 'GET';
      this.$http.request(
        _result => {
          // _result.data.splice(0, 7);
          this.comboFacilityTypeItems = this.$_.clone(_result.data);
          this.comboFacilityTypeItems.splice(0, 0, {
            comFacilityTypeCd: null,
            comFacilityTypeNm: this.$comm.getLangSpecInfoLabel('L0000003394'),
          });
        },
        _error => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    getDetail() {
      if (this.popupParam.facilityCd) {
        this.$http.url = this.$format(
          this.detailUrl,
          this.popupParam.facilityCd
        );
        this.$http.type = 'GET';

        this.$http.request(
          _result => {
            this.updateMode = true;
            this.$_.extend(this.safFacilityMst, _result.data);
          },
          _error => {
            window.getApp.$emit('APP_REQUEST_ERROR', _error);
          }
        );
      }
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
        .then(_result => {
          if (_result) {
            this.$http.url = this.$format(
              this.detailUrl,
              this.safFacilityMst.facilityCd
            );
            this.$http.param = {
              facilityCd: this.safFacilityMst.facilityCd,
            };
            this.$http.type = 'GET';

            this.$http.request(
              _result => {
                if (
                  flag === 'insert' &&
                  _result.data.facilityCd !== undefined
                ) {
                  window.getApp.$emit('ALERT', {
                    title: 'L0000003395',
                    message: 'M0000000126',
                    // 이미 존재하는 시설코드입니다.
                    type: 'warning', // success / info / warning / error
                  });
                  return;
                } else {
                  window.getApp.$emit('CONFIRM', {
                    title: 'L0000003321',
                    message: 'M0000000011', // 저장하시겠습니까?
                    type: 'info', // success / info / warning / error
                    confirmCallback: () => {
                      // this.safFacilityMst.createUserId = this.$store.getters.token;
                      // this.safFacilityMst.updateUserId = this.$store.getters.token;
                      if (flag === 'edit') this.isEdit = true;
                      else this.isInsert = true;
                    },
                  });
                }
              },
              _error => {
                window.getApp.$emit('APP_REQUEST_ERROR', _error);
              }
            );
          } else {
            window.getApp.$emit(
              'APP_VALID_ERROR',
              'M0000000005'
              // 필수 입력값을 입력해 주세요.
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
        title: 'L0000003395',
        message: 'M0000000006',
        type: 'success', // success / info / warning / error
      });
      this.isEdit = false;
      this.updateMode = true;
      this.getDetail();
    },
    btnInsertClickedCallback(result) {
      window.getApp.$emit('ALERT', {
        title: 'L0000003395',
        message: 'M0000000006',
        type: 'success', // success / info / warning / error
      });
      this.popupParam.facilityCd = result.data;
      this.isInsert = false;
      this.updateMode = true;
      this.getDetail();
    },
    btnClickedErrorCallback(result) {
      this.isInsert = false;
      this.isEdit = false;
      window.getApp.$emit('APP_REQUEST_ERROR', result);
    },
    closePopup(data) {
      this.$emit('closePopup', {});
    },
  },
};
</script>
