<!--
  목적 : 안전점검 - 안전 점검 종류
  Detail : 안전 점검 종류 등록/수정화면
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
            <!-- TMS 측정소별 항목 상세 -->
            <y-label
              label="L0000000177"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 저장 -->
              <y-btn
                v-if="editable"
                :action-url="saveUrl"
                :param="tmsStationItem"
                :is-submit="isSave"
                title="L0000002474"
                color="orange"
                :action-type="actionType"
                beforeSubmit="beforeSave"
                @beforeSave="beforeSave"
                @btnClicked="btnSaveClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!-- 삭제 -->
              <y-btn
                v-if="editable && popupParam.stationItemCode"
                :action-url="deleteUrl"
                :param="deleteValue"
                :is-submit="isDelete"
                title="L0000001495"
                color="red"
                action-type="DELETE"
                beforeSubmit="beforeDelete"
                @beforeDelete="beforeDelete"
                @btnClicked="btnDeleteClickedCallback"
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
              <!-- 구분 -->
              <y-select
                :width="8"
                :editable="editable"
                :required="true"
                :comboItems="typeItems"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                label="L0000000686"
                name="tmsType"
                v-model="tmsStationItem.tmsType"
                v-validate="'required'"
                :state="validateState('tmsType')"
              ></y-select>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-plant
                type="edit"
                :required="true"
                :editable="editable"
                name="plantCd"
                v-model="tmsStationItem.plantCd"
                v-validate="'required'"
                :state="validateState('plantCd')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 측정소 -->
              <y-select
                :width="8"
                :editable="editable"
                :required="true"
                :comboItems="stationItems"
                itemText="stationName"
                itemValue="stationCode"
                ui="bootstrap"
                label="L0000002935"
                name="stationCode"
                v-model="tmsStationItem.stationCode"
                v-validate="'required'"
                :state="validateState('stationCode')"
              ></y-select>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 측정소코드 -->
              <y-text
                :width="8"
                :editable="editable"
                :disabled="true"
                label="L0000002938"
                name="stationCode"
                ui="bootstrap"
                v-model="tmsStationItem.stationCode"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 측정항목 -->
              <y-select
                :width="8"
                :editable="editable"
                :required="true"
                :comboItems="itemItems"
                itemText="itemName"
                itemValue="itemCode"
                ui="bootstrap"
                label="L0000002963"
                name="itemCode"
                v-model="tmsStationItem.itemCode"
                v-validate="'required'"
                :state="validateState('itemCode')"
              ></y-select>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 항목코드 -->
              <y-text
                :width="8"
                :editable="editable"
                :disabled="true"
                label="L0000003212"
                name="itemCode"
                ui="bootstrap"
                v-model="tmsStationItem.itemCode"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 측정소항목코드 -->
              <y-text
                :width="8"
                :editable="editable"
                :disabled="true"
                label="L0000002940"
                name="stationItemCode"
                ui="bootstrap"
                v-model="tmsStationItem.stationItemCode"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3" />
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 배출시설 -->
              <y-text
                :width="8"
                :editable="editable"
                :disabled="true"
                label="L0000001167"
                name="facilityNm"
                ui="bootstrap"
                v-model="tmsStationItem.facilityNm"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 배출구 -->
              <y-text
                :width="8"
                :editable="editable"
                :disabled="true"
                label="L0000001142"
                name="outletNm"
                ui="bootstrap"
                v-model="tmsStationItem.outletNm"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 설치년도 -->
              <y-datepicker
                :width="8"
                :disabled="true"
                :editable="editable"
                label="L0000001624"
                name="setupDay"
                :default="tmsStationItem.setupDay"
                v-model="tmsStationItem.setupDay"
              ></y-datepicker>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 단위 -->
              <y-text
                :width="8"
                :editable="editable"
                :disabled="true"
                label="L0000000870"
                name="sunit"
                ui="bootstrap"
                v-model="tmsStationItem.sunit"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 측정최대 -->
              <y-number
                :width="8"
                :editable="editable"
                :maxlength="8"
                :hasSeperator="true"
                :pointNumber="2"
                ui="bootstrap"
                label="L0000002961"
                name="limMax"
                v-model="tmsStationItem.limMax"
              ></y-number>
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
                name="dispOrder"
                v-model="tmsStationItem.dispOrder"
              ></y-number>
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>
    <y-dialog :param="popupOptions"></y-dialog>
  </b-container>
</template>
<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
export default {
  /* attributes: name, components, props, data */
  name: 'y-tms-station-detail',
  props: {
    popupParam: {
      type: Object,
      default: {
        stationItemCode: '',
      },
    },
  },
  data: () => ({
    tmsStationItem: {
      plantCd: null,
      stationItemCodeOrign: '',
      stationItemCode: '',
      stationCode: null,
      stationName: '',
      itemCode: null,
      itemName: '',
      outletNm: '',
      facilityNm: '',
      tmsType: null,
      sunit: '',
      setupDay: '',
      limMax: '',
      dispOrder: 0,
      createUserId: '',
      updateUserId: '',
    },
    stationItemCode: '',
    stationItems: [],
    itemItems: [],
    typeItems: [],
    popupOptions: {
      target: null,
      title: '',
      visible: false,
      width: '80%',
      top: '10px',
      param: {},
      closeCallback: null,
    },
    deleteValue: null,
    actionType: 'POST',
    editable: false,
    disabled: false,
    isSave: false,
    isDelete: false,
    searchDetailUrl: '',
    saveUrl: '',
    checkUrl: '',
    searchStationUrl: '',
    searchItemUrl: '',
    deleteCheckUrl: '',
    deleteUrl: '',
  }),
  watch: {
    'tmsStationItem.stationCode'() {
      if (this.tmsStationItem.stationCode) {
        let data = this.$_.filter(this.stationItems, {
          stationCode: this.tmsStationItem.stationCode,
        });
        if (data && data.length > 0) {
          this.tmsStationItem.facilityNm = data[0].facilityNm;
          this.tmsStationItem.outletNm = data[0].outletNm;
          this.tmsStationItem.plantCd = data[0].plantCd;
          this.tmsStationItem.setupDay = data[0].setupDay;
          this.tmsStationItem.tmsType = data[0].tmsType;
        }
      } else {
        this.tmsStationItem.facilityNm = '';
        this.tmsStationItem.outletNm = '';
        this.tmsStationItem.plantCd = '';
      }
      this.setStationItemCode();
    },
    'tmsStationItem.itemCode'() {
      if (this.tmsStationItem.itemCode) {
        let data = this.$_.filter(this.itemItems, {
          itemCode: this.tmsStationItem.itemCode,
        });
        if (data && data.length > 0) {
          this.tmsStationItem.sunit = data[0].unit;
          this.tmsStationItem.tmsType = data[0].tmsType;
        }
      } else {
        this.tmsStationItem.facilityNm = '';
        this.tmsStationItem.outletNm = '';
        this.tmsStationItem.plantCd = '';
      }
      this.setStationItemCode();
    },
    'tmsStationItem.tmsType'() {
      // 측정소와 측정항목을 재조회한다.
      this.getTmsStation(); // TMS 측정소 조회
      this.getTmsItem(); // TMS 측정항목 조회
    },
    'tmsStationItem.plantCd'() {
      // 측정소를 재조회한다.
      this.getTmsStation(); // TMS 측정소 조회
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

      this.searchDetailUrl =
        selectConfig.env.tms.baseInfo.tmsStationItem.get.url;
      this.checkUrl = selectConfig.env.tms.baseInfo.tmsStationItem.check.url;
      this.saveUrl =
        transactionConfig.env.tms.baseInfo.tmsStationItem.insert.url;
      this.searchStationUrl = selectConfig.env.tms.baseInfo.tmsStation.list.url;
      this.searchItemUrl = selectConfig.env.tms.baseInfo.tmsItem.list.url;
      this.deleteCheckUrl =
        selectConfig.env.tms.baseInfo.tmsStationItem.deleteCheck.url;
      this.deleteUrl =
        transactionConfig.env.tms.baseInfo.tmsStationItem.delete.url;

      this.getTmsStation(); // TMS 측정소 조회
      this.getTmsItem(); // TMS 측정항목 조회
      this.getComboItems('TMS_TYPE');
      this.getDetail(); // TMS 측정소별 항목 상세조회
    },
    getDetail() {
      if (!this.popupParam.stationItemCode) {
        return;
      }
      this.$http.url = this.$format(
        this.searchDetailUrl,
        this.popupParam.stationItemCode
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.disabled = true;
          this.$_.extend(this.tmsStationItem, _result.data);
          this.stationItemCode = this.$_.clone(
            this.tmsStationItem.stationItemCode
          );
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    getTmsStation() {
      this.$http.url = this.searchStationUrl;
      this.$http.type = 'GET';
      this.$http.param = {
        plantCd: this.tmsStationItem.plantCd,
        tmsType: this.tmsStationItem.tmsType,
      };
      this.$http.request(
        (_result) => {
          this.stationItems = this.$_.clone(_result.data);
          this.stationItems.splice(0, 0, {
            stationCode: null,
            stationName: this.$comm.getLangSpecInfoLabel('L0000003394'), // 선택하세요
          });

          if (
            this.$_.findIndex(this.stationItems, {
              stationCode: this.tmsStationItem.stationCode,
            }) === -1
          ) {
            this.tmsStationItem.stationCode = null;
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    getTmsItem() {
      this.$http.url = this.searchItemUrl;
      this.$http.type = 'GET';
      this.$http.param = {
        plantCd: this.tmsStationItem.plantCd,
        tmsType: this.tmsStationItem.tmsType,
      };
      this.$http.request(
        (_result) => {
          this.itemItems = this.$_.clone(_result.data);
          this.itemItems.splice(0, 0, {
            itemCode: null,
            itemName: this.$comm.getLangSpecInfoLabel('L0000003394'), // 선택하세요
          });

          if (
            this.$_.findIndex(this.itemItems, {
              itemCode: this.tmsStationItem.itemCode,
            }) === -1
          ) {
            this.tmsStationItem.itemCode = null;
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    /**
     * 공통 마스터 정보 조회
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
          if (codeGroupCd === 'TMS_TYPE') {
            _result.data = this.$_.reject(_result.data, { attr1: 'tms_item' });
            this.typeItems = this.$_.clone(_result.data);
            this.typeItems.splice(0, 0, {
              code: null,
              codeNm: this.$comm.getLangSpecInfoLabel('L0000003394'), // 선택하세요
            });
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    beforeSave() {
      if (this.popupParam.stationItemCode) {
        this.saveUrl =
          transactionConfig.env.tms.baseInfo.tmsStationItem.edit.url;
        this.actionType = 'PUT';
        this.checkValidator('edit');
      } else {
        this.saveUrl =
          transactionConfig.env.tms.baseInfo.tmsStationItem.insert.url;
        this.actionType = 'POST';
        this.checkValidator('insert');
      }
    },
    checkValidator(flag) {
      this.$validator
        .validateAll()
        .then((_result) => {
          if (_result) {
            this.$http.url = this.checkUrl;
            this.$http.param = {
              stationItemCodeOrign: flag === 'edit' ? this.stationItemCode : '',
              stationItemCode: this.tmsStationItem.stationItemCode,
            };
            this.$http.type = 'GET';
            this.$http.request(
              (_result) => {
                var returnVal = this.showMessage(_result.data, flag);
                if (returnVal) {
                  window.getApp.$emit('CONFIRM', {
                    title: 'L0000003321', // 확인
                    message: 'M0000000011', // 저장하시겠습니까?
                    // TODO : 필요시 추가하세요.
                    type: 'info', // success / info / warning / error
                    // 확인 callback 함수
                    confirmCallback: () => {
                      this.tmsStationItem.stationItemCodeOrign =
                        this.popupParam.stationItemCode;
                      this.tmsStationItem.createUserId =
                        this.$store.getters.token;
                      this.tmsStationItem.updateUserId =
                        this.$store.getters.token;
                      this.isSave = true;
                    },
                  });
                }
              },
              (_error) => {
                window.getApp.$emit('APP_REQUEST_ERROR', _error);
              }
            );
          } else {
            window.getApp.$emit(
              'APP_VALID_ERROR',
              'M0000000005' // 필수 입력값을 입력해 주세요.
            );
          }
        })
        .catch(() => {
          this.isSave = false;
          if (!this.isSave) {
            window.getApp.$emit(
              'APP_VALID_ERROR',
              'M0000000881' // 유효성 검사도중 에러가 발생하였습니다.
            );
          }
        });
    },
    showMessage(checkList, flag) {
      var checkText = '';
      var i = 0;
      for (; i < checkList.length; i++) {
        if (this.$_.parseInt(checkList[i].cnt) > 0) {
          checkText =
            checkList[i].gubun === 'stationName'
              ? 'M0000000364' //  이미 해당 사업장에 존재하는 측정소별 항목명입니다.
              : 'M0000000365'; // 이미 존재하는 측정소별 항목코드입니다.
          break;
        }
      }
      if (checkText) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // 안내
          message: checkText,
          type: 'warning',
        });
        return false;
      } else {
        return true;
      }
    },
    beforeDelete() {
      this.$http.url = this.deleteCheckUrl;
      this.$http.param = {
        stationItemCode: this.popupParam.stationItemCode,
      };
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          if (_result.data > 0) {
            window.getApp.$emit('ALERT', {
              title: 'L0000003395', // 안내
              message: 'M0000000363', // [삭제불가] 이미 사용중인 정보입니다.
              type: 'warning',
            });
          } else {
            window.getApp.$emit('CONFIRM', {
              title: 'L0000003321', // 확인
              message: 'M0000000012', // 삭제하시겠습니까?
              // TODO : 필요시 추가하세요.
              type: 'info', // success / info / warning / error
              // 확인 callback 함수
              confirmCallback: () => {
                this.deleteValue = {
                  data: Object.values([this.tmsStationItem]),
                };
                this.isDelete = true;
              },
            });
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    // 삭제
    btnDeleteClickedCallback(_result) {
      this.isDelete = false;
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // 안내
        message: 'M0000000007', // 삭제되었습니다.
        type: 'success',
      });
      this.btnClosePopup();
    },
    btnSaveClickedCallback(result) {
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // 안내
        message: 'M0000000006', // 저장되었습니다.
        type: 'success', // success / info / warning / error
      });
      if (!this.popupParam.stationItemCode) {
        this.stationItemCode = result.data;
        this.popupParam.stationItemCode = result.data;
      }
      this.isSave = false;
    },
    btnClickedErrorCallback(result) {
      this.isSave = false;
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
    setStationItemCode() {
      let stationItemCodeText = '';
      stationItemCodeText = this.tmsStationItem.stationCode
        ? this.$_.padStart(this.tmsStationItem.stationCode, 8, '0')
        : '00000000';
      stationItemCodeText += this.tmsStationItem.itemCode
        ? this.$_.padStart(this.tmsStationItem.itemCode, 3, '0')
        : '000';
      this.tmsStationItem.stationItemCode = stationItemCodeText;
    },
  },
};
</script>
