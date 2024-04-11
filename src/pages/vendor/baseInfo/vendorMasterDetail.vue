<!--
  목적 : 협력업체관리 > 기준정보 > 협력업체상세조회
  작성자 : kdh
  Detail : 협력업체관리 등록,수정 화면 
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <b-row ref="editBox">
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- 협력업체 정보 -->
            <y-label
              label="L0000003254"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 저장 -->
              <y-btn
                v-if="editable && !updateMode"
                :action-url="saveUrl"
                :param="chemicalVendorMaster"
                :is-submit="isSave"
                title="L0000002474"
                color="orange"
                :action-type="actionType"
                beforeSubmit="beforeSave"
                @beforeSave="beforeSave"
                @btnClicked="btnSaveClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!-- 저장 -->
              <y-btn
                v-if="editable && updateMode"
                :action-url="saveUrl"
                :param="chemicalVendorMaster"
                :is-submit="isSave"
                title="L0000002474"
                color="orange"
                :action-type="actionType"
                beforeSubmit="beforeSave"
                @beforeSave="beforeSave"
                @btnClicked="btnSaveClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!-- 닫기 -->
              <y-btn title="L0000000881" @btnClicked="closePopup" />
            </div>
          </b-col>
        </b-row>
        <b-card>
          <b-row>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 국가 -->
              <y-select
                :width="8"
                :required="true"
                :comboItems="originCdSaveItems"
                itemText="originNmKr"
                itemValue="originCd"
                ui="bootstrap"
                label="L0000000702"
                name="originCd"
                v-model="chemicalVendorMaster.originCd"
                v-validate="'required'"
                :state="validateState('originCd')"
              ></y-select>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <b-row>
                <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
                  <!-- 업체분류/유형 -->
                  <y-label
                    :width="4"
                    :required="true"
                    ui="bootstrap"
                    label="L0000001960"
                  ></y-label>
                </b-col>
                <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
                  <y-select
                    :width="12"
                    :required="true"
                    :comboItems="vendorTypeCdItems"
                    itemText="codeNm"
                    itemValue="code"
                    ui="bootstrap"
                    name="vendorTypeCd"
                    v-model="chemicalVendorMaster.vendorTypeCd"
                    v-validate="'required'"
                    :state="validateState('vendorTypeCd')"
                  ></y-select>
                </b-col>
                <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
                  <y-select
                    :width="12"
                    :required="true"
                    :comboItems="vendorAttCdItems"
                    itemText="codeNm"
                    itemValue="code"
                    ui="bootstrap"
                    name="vendorAttCd"
                    v-model="chemicalVendorMaster.vendorAttCd"
                    v-validate="'required'"
                    :state="validateState('vendorAttCd')"
                  ></y-select>
                </b-col>
              </b-row>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 업체코드(SAP) -->
              <y-text
                :width="8"
                :editable="editable"
                :maxlength="10"
                :required="true"
                :disabled="updateMode"
                ui="bootstrap"
                label="L0000001964"
                name="vendorCd"
                v-model="chemicalVendorMaster.vendorCd"
                v-validate="'required'"
                :state="validateState('vendorCd')"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 업체명 -->
              <y-text
                :width="8"
                :editable="editable"
                :maxlength="50"
                :required="true"
                ui="bootstrap"
                label="L0000001957"
                name="vendorNm"
                v-model="chemicalVendorMaster.vendorNm"
                v-validate="'required'"
                :state="validateState('vendorNm')"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 대표자명 -->
              <y-text
                :width="8"
                :editable="editable"
                :maxlength="25"
                ui="bootstrap"
                label="L0000000942"
                name="chiefNm"
                v-model="chemicalVendorMaster.chiefNm"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 사업자번호 -->
              <y-text
                :width="8"
                :editable="editable"
                :maxlength="20"
                :required="true"
                ui="bootstrap"
                label="L0000001414"
                name="bizNum"
                v-model="chemicalVendorMaster.bizNum"
                v-validate="'required'"
                :state="validateState('bizNum')"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 전화번호 -->
              <y-text
                :width="8"
                :editable="editable"
                :maxlength="25"
                ui="bootstrap"
                label="L0000002528"
                name="vendorTel"
                v-model="chemicalVendorMaster.vendorTel"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 팩스번호 -->
              <y-text
                :width="8"
                :editable="editable"
                :maxlength="25"
                ui="bootstrap"
                label="L0000003040"
                name="vendorFax"
                v-model="chemicalVendorMaster.vendorFax"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 담당자명 -->
              <y-text
                :width="8"
                :editable="editable"
                :maxlength="25"
                ui="bootstrap"
                label="L0000000895"
                name="chargerNm"
                v-model="chemicalVendorMaster.chargerNm"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 담당자부서명 -->
              <y-text
                :width="8"
                :editable="editable"
                :maxlength="25"
                ui="bootstrap"
                label="L0000000896"
                name="chargerDept"
                v-model="chemicalVendorMaster.chargerDept"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 담당자연락처 -->
              <y-text
                :width="8"
                :editable="editable"
                :maxlength="20"
                ui="bootstrap"
                label="L0000000897"
                name="chargerTel"
                v-model="chemicalVendorMaster.chargerTel"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 담당자이메일 -->
              <!-- 이메일 형식 확인 필요 -->
              <y-text
                :width="8"
                :editable="editable"
                ui="bootstrap"
                label="L0000000898"
                name="email"
                type="email"
                :maxlength="50"
                checkMessage="L0000003757"
                :state="$comm.checkEmail(chemicalVendorMaster.email)"
                v-model="chemicalVendorMaster.email"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <b-row>
                <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
                  <!-- 포털접속ID -->
                  <y-label
                    :width="4"
                    :required="true"
                    ui="bootstrap"
                    label="L0000003142"
                  ></y-label>
                </b-col>
                <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-8">
                  <y-text
                    :width="12"
                    :editable="editable"
                    :disabled="updateMode"
                    :maxlength="20"
                    ui="bootstrap"
                    name="portalId"
                    v-model="chemicalVendorMaster.portalId"
                    v-validate="'required'"
                    :state="validateState('portalId')"
                  ></y-text>
                </b-col>
                <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
                  <!-- 비밀번호초기화 -->
                  <y-btn title="L0000001365" @btnClicked="initPassword" />
                </b-col>
              </b-row>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 협력업체등록일 -->
              <y-datepicker
                :width="8"
                :editable="editable"
                :disabled="false"
                ui="bootstrap"
                label="L0000005111"
                name="regDt"
                :default="chemicalVendorMaster.regDt"
                v-model="chemicalVendorMaster.regDt"
              />
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-8">
              <!-- 본사주소 -->
              <y-text
                :width="10"
                :editable="editable"
                :maxlength="100"
                ui="bootstrap"
                label="L0000001280"
                name="vendorAddr"
                v-model="chemicalVendorMaster.vendorAddr"
              ></y-text>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-8">
              <!-- 공장주소 -->
              <y-text
                :width="10"
                :editable="editable"
                :maxlength="100"
                ui="bootstrap"
                label="L0000000514"
                name="factoryAddr"
                v-model="chemicalVendorMaster.factoryAddr"
              ></y-text>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-8">
              <!-- 관련사업장 -->
              <y-checkbox
                :width="10"
                :editable="editable"
                :required="true"
                :comboItems="plantCdItems"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                label="L0000000571"
                name="plantCds"
                v-validate="'required'"
                v-model="chemicalVendorMaster.plantCds"
                :state="validateState('plantCds')"
              ></y-checkbox>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 사용여부 -->
              <!-- 사용 -->
              <!-- 미사용 -->
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
                v-model="chemicalVendorMaster.useYn"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 정렬순서 -->
              <y-number
                :width="8"
                :editable="editable"
                :maxlength="5"
                :hasSeperator="false"
                :isPositive="true"
                ui="bootstrap"
                name="sortOrder"
                label="L0000002601"
                v-model="chemicalVendorMaster.sortOrder"
              ></y-number>
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>
    <b-row class="mt-3"></b-row>
    <el-tabs type="border-card" v-model="tabIndex">
      <el-tab-pane
        v-for="(item, i) in tabItems"
        :key="i"
        stretch
        class="default-tab-pane"
      >
        <span slot="label">
          <i class="el-icon-date"></i>
          {{ $comm.getLangSpecInfoLabel(item.title) }}
        </span>
      </el-tab-pane>
      <keep-alive>
        <component
          :is="component"
          v-if="component"
          :disabled="disabled"
          :tempVendorCd.sync="tempVendorCd"
          :chemicalVendorMaster.sync="chemicalVendorMaster"
          :submitCheck="safSubmitCheck"
          :attachFileGrps="safAttachFileGrps"
          :saveAttachFiles="safSaveAttachFiles"
          @changeUploadFiles="changeUploadFiles"
          @setTempDeleteFiles="setTempDeleteFiles"
          @closePopup="closePopup"
        />
      </keep-alive>
    </el-tabs>
    <b-row>
      <b-col sm="12">
        <div slot="buttonGroup" class="float-right mt-3">
          <!-- 저장 -->
          <y-btn
            v-if="editable && !updateMode"
            title="L0000002474"
            color="orange"
            @btnClicked="beforeSave"
            @btnClickedErrorCallback="btnClickedErrorCallback"
          />
          <!-- 저장 -->
          <y-btn
            v-if="editable && updateMode"
            title="L0000002474"
            color="orange"
            @btnClicked="beforeSave"
            @btnClickedErrorCallback="btnClickedErrorCallback"
          />
          <!-- 닫기 -->
          <y-btn title="L0000000881" @btnClicked="closePopup" />
        </div>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
let originBizNum;
export default {
  /* attributes: name, components, props, data */
  name: 'y-vendoermaster-detail',
  components: {},
  props: {
    popupParam: {
      type: Object,
      default: {
        vendorCd: '',
      },
    },
  },
  // TODO: 화살표 함수(=>)는 data에 사용하지 말 것
  //    data: () => { return { a: this.myProp }}) 화살표 함수가 부모 컨텍스트를 바인딩하기 때문에 this는 예상과 달리 Vue 인스턴스가 아니며, this.myProp는 정의되지 않습니다.
  //    참고url: https://kr.vuejs.org/v2/api/index.html#data
  data: function () {
    return {
      tabItems: [
        { title: 'L0000000749', url: './vendorMasterWorker' } /* 근무인원 */,
        { title: 'L0000002843', url: 'fileUploadPage' } /* 첨부파일 */,
      ],
      component: null,
      tabIndex: 0,
      chemicalVendorMaster: {
        originCd: null,
        // vendorTypes: [],
        vendorTypeCd: null,
        vendorAttCd: null,
        vendorCd: '',
        vendorNm: '',
        chiefNm: '',
        bizNum: '',
        vendorTel: '',
        vendorFax: '',
        chargerNm: '',
        chargerDept: '',
        chargerTel: '',
        email: '',
        portalId: '',
        portalUseYn: 'Y',
        portalPwd: '',
        vendorAddr: '',
        factoryAddr: '',
        plantCds: [],
        sortOrder: '',
        useYn: 'Y',
        supplyYn: '',
        sellerYn: '',
        regDt: '',
        createUserId: '',
        updateUserId: '',
        workers: [],
      },
      chemicalVendorMasterAdd: {
        portalID: '',
        connectYn: 'Y',
      },
      saveData: {
        vendorCd: 0,
        createUserId: '',
        updateUserId: '',
      },
      gridOptions: {
        header: [],
        data: [],
        height: '300',
      },
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '80%',
        top: '50px',
        param: {},
        closeCallback: null,
      },
      changeVendoerMaster: false,
      editable: false,
      updateMode: false,
      disabled: false,
      isSave: false,
      selectedValue: [],
      tempVendorCd: '',
      searchDetailUrl: '',
      searchOriginUrl: '',
      checkUrl: '',
      insertUrl: '',
      editUrl: '',
      resetUrl: '',
      saveUrl: '',
      actionType: 'POST',
      originCdItems: [], // 규제법규 리스트 (조회)
      originCdSaveItems: [], // 규제법규 리스트 (저장)
      vendorTypeCdItems: [], // 업체분류 리스트 (저장)
      vendorAttCdItems: [], // 업체유형 리스트
      plantCdItems: [], // 사업장 체크 리스트 (저장)
      paneName: '',
      genderItems: [],

      // 첨부파일 관련
      attach: null, // 첨부파일컴포넌트
      safSubmitCheck: false,
      safSaveAttachFiles: [],
      safTempDeleteFiles: [],
      safAttachFileGrps: [],
    };
  },
  watch: {
    tabIndex(newValue, oldValue) {
      this.loadComponent();
    },
  },
  //* Vue lifecycle: created, mounted, destroyed, etc */
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {
    this.loadComponent();
  },
  beforeDestroy() {},
  //* methods */
  methods: {
    init() {
      this.editable = this.$route.meta.editable;
      // Url Setting
      this.searchOriginUrl = selectConfig.chm.chemicalOrigin.list.url;
      this.searchDetailUrl = selectConfig.vendor.baseInfo.vendorMaster.get.url;
      this.checkUrl = selectConfig.vendor.baseInfo.vendorMaster.check.url;
      this.insertUrl =
        transactionConfig.vendor.baseInfo.vendorMaster.insert.url;
      this.editUrl = transactionConfig.vendor.baseInfo.vendorMaster.edit.url;
      this.resetUrl = transactionConfig.vendor.baseInfo.vendorMaster.reset.url;

      // 업체분류
      this.$comm.getComboItems('COM_PLANT_CD', false).then((_result) => {
        this.$_.forEach([null], (_item) => {
          const index = this.$_.findIndex(_result, { code: _item });
          if (index > -1) {
            _result.splice(index, 1);
          }
        });
        this.plantCdItems = _result;
      });
      this.$comm.getComboItems('COM_VENDOR_TYPE', false).then((_result) => {
        this.vendorTypeCdItems = _result;
      });
      this.$comm.getComboItems('COM_VENDOR_ATT', false).then((_result) => {
        this.vendorAttCdItems = _result;
      });
      this.getOriginItems(); // 국가

      this.setAttachFileGrp(); // 첨부파일 설정

      this.getDetail(); // 협력업체 정보 상세 검색
    },
    /**
     * 국가 검색
     */
    getOriginItems() {
      this.$http.url = this.searchOriginUrl;
      this.$http.type = 'GET';
      this.$http.param = {
        useYn: 'Y',
      };
      this.$http.request(
        (_result) => {
          this.originCdItems = this.$_.clone(_result.data);
          this.originCdItems.splice(0, 0, {
            originCd: null,
            originNmKr: 'L0000002519' /* 전체 */,
          });
          this.originCdSaveItems = this.$_.clone(_result.data);
          this.originCdSaveItems.splice(0, 0, {
            originCd: null,
            originNmKr: 'L0000003394' /* 선택하세요 */,
          });
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    /** 물질검토 상세 검색 **/
    getDetail() {
      if (this.popupParam.vendorCd && this.popupParam.vendorCd !== '') {
        this.$http.url = this.$format(
          this.searchDetailUrl,
          this.popupParam.vendorCd
        );
        this.$http.type = 'GET';
        this.$http.request(
          (_result) => {
            this.chemicalVendorMaster = this.$_.clone(_result.data);
            this.tempVendorCd = this.popupParam.vendorCd;
            this.updateMode = true;
            originBizNum = this.$_.clone(_result.data.bizNum);
          },
          (_error) => {
            window.getApp.$emit('APP_REQUEST_ERROR', _error);
          }
        );
      } else {
        this.chemicalVendorMaster.originCd = 'KR';
        this.chemicalVendorMaster.plantCds.push(this.$store.getters.plantCd);
      }
    },
    check(flag) {
      this.$validator
        .validateAll()
        .then((_result) => {
          if (_result) {
            this.checkVendorData(flag).then((_result) => {
              if (_result) {
                this.checkPortalId(flag).then((_result) => {
                  if (_result) {
                    this.checkBizNum(flag).then((_result) => {
                      if (_result) {
                        this.saveVendorData(flag);
                      }
                    });
                  }
                });
              }
            });
          } else {
            this.$popupRequired.check(
              'vendorMasterDetail',
              this.$data,
              this.errors
            );
          }
        })
        .catch(() => {
          window.getApp.$emit(
            'APP_VALID_ERROR',
            'M0000000876' /* 유효성 검사도중 에러가 발생하였습니다. */
          );
          this.isSave = false;
        });
    },
    checkVendorData(flag) {
      return new Promise((_resolve, _reject) => {
        this.$http.url = this.checkUrl;
        this.$http.type = 'GET';
        this.$http.param = {
          vendorNm: this.chemicalVendorMaster.vendorNm,
          vendorCd: this.chemicalVendorMaster.vendorCd,
          vendorCdOrigin:
            flag === 'edit' ? this.chemicalVendorMaster.vendorCd : '',
        };
        this.$http.request(
          (_result) => {
            var returnVal = this.showMessage(_result.data, flag);
            if (returnVal) _resolve(true);
            else _resolve(false);
          },
          (_error) => {
            _reject(_error);
            window.getApp.$emit('APP_REQUEST_ERROR', _error);
          }
        );
      });
    },
    checkPortalId(flag) {
      return new Promise((_resolve, _reject) => {
        if (flag === 'insert') {
          this.$http.url =
            selectConfig.vendor.baseInfo.vendorMaster.checkPortalId.url;
          this.$http.type = 'GET';
          this.$http.param = {
            portalId: this.chemicalVendorMaster.portalId,
          };
          this.$http.request(
            (_result) => {
              if (_result.data) {
                if (_result.data > 0) {
                  window.getApp.$emit('ALERT', {
                    title: 'L0000003395' /* 안내 */,
                    message: 'M0000000812' /* 이미 등록된 포털ID입니다. */,
                    type: 'warning', // success / info / warning / error
                  });
                  _resolve(false);
                }
              } else {
                _resolve(true);
              }
            },
            (_error) => {
              _reject(_error);
              window.getApp.$emit('APP_REQUEST_ERROR', _error);
            }
          );
        } else {
          _resolve(true);
        }
      });
    },
    checkBizNum(flag) {
      return new Promise((_resolve, _reject) => {
        if (originBizNum !== this.chemicalVendorMaster.bizNum) {
          this.$http.url =
            selectConfig.vendor.baseInfo.vendorMaster.checkBizNum.url;
          this.$http.type = 'GET';
          this.$http.param = {
            bizNum: this.chemicalVendorMaster.bizNum,
          };
          this.$http.request(
            (_result) => {
              if (_result.data) {
                if (_result.data > 0) {
                  window.getApp.$emit('ALERT', {
                    title: 'L0000003395' /* 안내 */,
                    message: 'M0000000813' /* 이미 등록된 사업자번호입니다. */,
                    type: 'warning', // success / info / warning / error
                  });
                  _resolve(false);
                }
              } else {
                _resolve(true);
              }
            },
            (_error) => {
              _reject(_error);
              window.getApp.$emit('APP_REQUEST_ERROR', _error);
            }
          );
        } else {
          _resolve(true);
        }
      });
    },
    saveVendorData(flag) {
      return new Promise((_resolve, _reject) => {
        window.getApp.$emit('CONFIRM', {
          title: 'L0000003321' /* 확인 */,
          message:
            flag === 'edit'
              ? 'M0000000011'
              : 'M0000000105' /* 저장하시겠습니까? : 등록하시겠습니까? */,
          type: 'info',
          // 확인 callback 함수
          confirmCallback: () => {
            this.chemicalVendorMaster.createUserId = this.$store.getters.token;
            this.chemicalVendorMaster.updateUserId = this.$store.getters.token;

            this.isSave = true;
            _resolve(true);
          },
          cancelCallback: () => {
            this.isSave = false;
            _resolve(false);
          },
        });
      });
    },
    /** 신규등록 하기전 UI단 유효성 검사 **/
    beforeSave() {
      var gubun = '';

      // 신규등록
      if (this.popupParam.vendorCd === '') {
        gubun = 'insert';
        this.saveUrl = this.insertUrl;
        this.actionType = 'POST';
      }
      // 수정
      else {
        gubun = 'edit';
        this.saveUrl = this.editUrl;
        this.actionType = 'PUT';
      }

      this.check(gubun);
    },
    /**
     * 필수입력값 유효성 검사
     */
    validateState(ref) {
      if (
        this.veeBag[ref] &&
        (this.veeBag[ref].dirty || this.veeBag[ref].validated)
      ) {
        return !this.errors.has(ref);
      }
      return null;
    },
    btnSaveClickedCallback(_result) {
      // 신규등록일 경우 _result.data가 업체코드(vendorCd)를 반환하고 있음.
      // 수정일 경우 _result.data가 저장여부 1/0을 반환하고 있음.
      if (!this.popupParam.vendorCd || !this.chemicalVendorMaster.vendorCd) {
        this.popupParam.vendorCd = this.$_.clone(_result.data);
        this.chemicalVendorMaster.vendorCd = this.$_.clone(_result.data);
      }

      this.isSave = false;
      // this.chemicalVendorMaster = _result.data;
      window.getApp.$emit('ALERT', {
        title: 'L0000003395' /* 안내 */,
        message: 'M0000000006' /* 저장되었습니다. */,
        type: 'success', // success / info / warning / error
      });
      this.saveAttach();
    },
    btnClickedErrorCallback(_result) {
      this.isSave = false;
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    /**
     *  팝업 안 보이도록 closePopup emit
     *  팝업 close
     * data : 팝업창에서 return하는 데이터
     */
    closePopup(data) {
      this.$emit('closePopup', { data });
    },

    /** end button 관련 이벤트 **/
    loadComponent() {
      var path = this.tabItems[this.tabIndex].url;

      if (path === 'fileUploadPage') {
        this.component = () =>
          import('@/pages/common/attachFile/multiFileUpload');
      } else if (path === './vendorMasterWorker') {
        this.component = () =>
          import('@/pages/vendor/baseInfo/vendorMasterWorker');
      } else this.component = () => import(`${path}`);
    },

    initPassword() {
      // 포탈아이디 입력유무 or 길이체크
      if (this.chemicalVendorMaster.portalId === '') {
        return;
      }
      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321' /* 확인 */,
        message: 'M0000000814' /* 초기화하시겠습니까? */,
        type: 'info',
        // 확인 callback 함수
        confirmCallback: () => {
          this.$http.url = this.$format(
            this.resetUrl,
            this.chemicalVendorMaster.vendorCd,
            this.chemicalVendorMaster.portalId
          );
          this.$http.type = 'PUT';
          this.$http.request(
            (_result) => {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395' /* 안내 */,
                message: 'M0000000815' /* 초기화 되었습니다. */,
                type: 'success',
              });
            },
            (_error) => {
              window.getApp.$emit('APP_REQUEST_ERROR', _error);
            }
          );
        },
        cancelCallback: () => {},
      });
    },
    tableLinkClicked(header, data) {
      this.openUserPopup(data);
    },
    btnAdd() {
      this.gridOptions.data.splice(0, 0, {
        vendorUserNm: '',
        birthday: '',
        genderNm: 'y',
        positionNm: '',
        vendorUserDesc: '',
      });
    },
    showMessage(checkList, flag) {
      var checkText = '';
      var i = 0;
      for (; i < checkList.length; i++) {
        if (this.$_.parseInt(checkList[i].cnt) > 0) {
          checkText = 'M0000000816'; /* 이미 존재하는 업체입니다. */
          break;
        }
      }
      if (checkText) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395' /* 안내 */,
          message: checkText,
          type: 'warning',
        });
        return false;
      } else {
        return true;
      }
    },
    // 첨부파일 설정
    setAttachFileGrp() {
      let taskKey = this.popupParam.vendorCd ? this.popupParam.vendorCd : '';
      this.safAttachFileGrps = [
        {
          label:
            'L0000002847' /* 첨부파일[산재요양승인확인서를 반드시 첨부 바랍니다] */,
          uploadTempFiles: null,
          taskClassNm: 'VENDOR_MASTER',
          taskKey: taskKey,
          showFileSearch: false,
          editable: this.editable,
          disabled: !this.editable,
          createUserId: this.$store.getters.token,
        },
      ];
    },
    changeUploadFiles(data) {
      var index = this.$_.findIndex(this.safAttachFileGrps, {
        taskClassNm: data.taskClassNm,
      });
      if (index > -1) {
        data.index = index;
        this.safAttachFileGrps[index].uploadTempFiles = data;
        let saveIndex = this.$_.findIndex(this.safSaveAttachFiles, {
          taskClassNm: data.taskClassNm,
        });
        if (saveIndex > -1) {
          this.safSaveAttachFiles[saveIndex] = this.$_.clone(
            this.safAttachFileGrps[index]
          );
        } else {
          this.safSaveAttachFiles.push(
            this.$_.clone(this.safAttachFileGrps[index])
          );
        }
      }
    },
    setTempDeleteFiles(data) {
      var pushData = {
        fileNo: data.data.fileNo,
      };
      this.safTempDeleteFiles.push(pushData);
    },
    saveAttach() {
      // task_key 를 셋팅한다.
      this.$_.forEach(this.safAttachFileGrps, (item) => {
        item.taskKey = this.chemicalVendorMaster.vendorCd;
      });
      if (this.safTempDeleteFiles.length > 0) {
        this.$http.url = transactionConfig.attachFile.deleteMulti.url;
        this.$http.type = 'DELETE';
        this.$http.param = {
          data: Object.values(this.$_.clone(this.safTempDeleteFiles)),
        };
        this.$http.request((_result) => {
          this.safTempDeleteFiles = [];
          this.getDetail();
          if (this.safSaveAttachFiles.length > 0) {
            // 저장할 데이터가 있는 경우
            this.safSubmitCheck = !this.safSubmitCheck;
          } else {
            // 저장할 데이터가 없는 경우
            this.submitCheck = !this.submitCheck;
          }
        });
      } else {
        this.getDetail();
        if (this.safSaveAttachFiles.length > 0) {
          // 저장할 데이터가 있는 경우
          this.safSubmitCheck = !this.safSubmitCheck;
        } else {
          // 저장할 데이터가 없는 경우
          this.submitCheck = !this.submitCheck;
        }
      }
    },
  },
};
</script>
