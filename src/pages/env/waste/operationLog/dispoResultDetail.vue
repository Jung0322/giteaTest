<!--
  목적 : 폐기물-폐기물 처리결과
  작성자 : khk
  Detail : 폐기물-폐기물 처리결과 상세, 등록, 수정
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <b-row class="mt-3">
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- 폐기물 처리결과 등록 -->
            <y-label
              label="L0000003111"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 저장 -->
              <y-btn
                v-if="
                  editable &&
                  updateMode &&
                  ((disposalResult.ewstDispoStCd === '91' &&
                    disposalResult.ewstDispoDivCd === 2 &&
                    disposalResult.allbaroYn === 'Y') ||
                    disposalResult.ewstDispoStCd !== '91')
                "
                :action-url="editUrl"
                :param="disposalResult"
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
                v-if="editable && !updateMode"
                :action-url="insertUrl"
                :param="disposalResult"
                :is-submit="isCreateSubmit"
                title="L0000002474"
                color="orange"
                action-type="post"
                beforeSubmit="beforeCreateSubmit"
                @beforeCreateSubmit="beforeCreateSubmit"
                @btnClicked="btnCreateClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!-- 완료 -->
              <y-btn
                v-if="editable && !disposalResult.resultComplete && updateMode"
                :action-url="completeUrl"
                :param="disposalResult"
                :is-submit="isCompleteSubmit"
                title="L0000002039"
                color="orange"
                action-type="post"
                beforeSubmit="beforeCompleteSubmit"
                @beforeCompleteSubmit="beforeCompleteSubmit"
                @btnClicked="btnCompleteClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!-- 삭제 -->
              <y-btn
                v-if="editable && updateMode && disposalResult.resultEditable"
                title="L0000001495"
                color="red"
                @btnClicked="btnDeleteClicked"
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
                :disabled="disabled"
                :editable="editable"
                name="plantCd"
                v-model="disposalResult.plantCd"
                v-validate="'required'"
                :state="validateState('plantCd')"
              />
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
              <b-row>
                <b-col sm="6">
                  <!-- 처리일 -->
                  <y-datepicker
                    :width="8"
                    :disabled="disabled"
                    :editable="editable"
                    label="L0000002839"
                    name="dispoYmd"
                    :default="disposalResult.dispoYmd"
                    v-model="disposalResult.dispoYmd"
                    :required="true"
                    v-validate="'required'"
                    :state="validateState('dispoYmd')"
                  />
                </b-col>
                <b-col sm="6">
                  <!-- 인터페이스 사용 할 경우 활성화 하여 수정할 것 -->
                  <!-- <y-btn
                    :width="8"
                    :disabled="disabled"
                    title="I/F 계근정보 조회"
                    color="gray"
                    @btnClicked="btnSearchSysInfoClicked"
                  /> -->
                </b-col>
              </b-row>
            </b-col>
            <b-col sm="0" md="0" lg="0" xl="0" class="col-xxl-3"></b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 결과처리방식 -->
              <y-switch
                :width="8"
                :editable="editable"
                :disabled="true"
                true-value="Y"
                false-value="N"
                ui="bootstrap"
                label="L0000000414"
                name="allbaroYn"
                selectText="L0000002037"
                unselectText="L0000003665"
                v-model="disposalResult.allbaroYn"
              />
              <!-- L0000002037: 올바로데이터업로드 -->
              <!-- L0000003665: 수동 -->
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 올바로인계번호 -->
              <y-text
                :width="8"
                :editable="editable"
                :disabled="true"
                ui="bootstrap"
                label="L0000002038"
                name="allbaroTransNum"
                v-model="disposalResult.allbaroTransNum"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 폐기물 분류 -->
              <y-select
                :width="8"
                :disabled="disabled"
                :editable="editable"
                :comboItems="ewstClassCdItems"
                itemText="ewstClassNm"
                itemValue="ewstClassCd"
                ui="bootstrap"
                label="L0000003106"
                name="ewstClassCd"
                v-model="disposalResult.ewstClassCd"
                :required="true"
                v-validate="'required'"
                :state="validateState('ewstClassCd')"
              ></y-select>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 폐기물 -->
              <y-select
                :width="8"
                :disabled="disabled"
                :editable="editable"
                :comboItems="ewstWasteCdItems"
                itemText="ewstWasteNm"
                itemValue="ewstWasteNo"
                ui="bootstrap"
                name="ewstWasteNo"
                label="L0000003102"
                v-model="disposalResult.ewstWasteNo"
                :required="true"
                v-validate="'required'"
                :state="validateState('ewstWasteNo')"
              ></y-select>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 처리구분 -->
              <y-select
                :width="8"
                :disabled="disabled"
                :editable="editable"
                :required="true"
                :comboItems="ewstDispoDivCdItems"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                name="ewstDispoDivCd"
                label="L0000002816"
                v-validate="'required'"
                v-model="disposalResult.ewstDispoDivCd"
                :state="validateState('ewstDispoDivCd')"
              ></y-select>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 처리방법 -->
              <y-select
                :width="8"
                :disabled="disabled"
                :editable="editable"
                :comboItems="ewstDispoMtdCdItems"
                itemText="ewstDispoMtdNm"
                itemValue="ewstDispoMtdCd"
                ui="bootstrap"
                name="ewstDispoMtdCd"
                v-model="disposalResult.ewstDispoMtdCd"
                label="L0000002825"
                :required="true"
                v-validate="'required'"
                :state="validateState('ewstDispoMtdCd')"
              ></y-select>
            </b-col>
            <b-col
              v-if="disposalResult.ewstDispoDivCd === '1'"
              sm="6"
              md="6"
              lg="6"
              xl="6"
              class="col-xxl-3"
            >
              <!-- 처리단계 -->
              <y-select
                :width="8"
                :required="true"
                :disabled="disabled"
                :editable="editable"
                :comboItems="ewstDispoStepCdItems"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                name="ewstDispoStepCd"
                label="L0000003666"
                v-validate="'required'"
                v-model="disposalResult.ewstDispoStepCd"
                :state="validateState('ewstDispoStepCd')"
              ></y-select>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 계근중량 -->
              <y-number
                :width="8"
                :disabled="disabled"
                :editable="editable"
                :hasSeperator="true"
                :pointNumber="3"
                :maxlength="17"
                :required="
                  disposalResult.allbaroYn === 'N' ||
                  disposalResult.allbaroYn === undefined
                    ? true
                    : false
                "
                ui="bootstrap"
                label="L0000000462"
                name="amtLoaded"
                v-validate="
                  disposalResult.allbaroYn === 'N' ||
                  disposalResult.allbaroYn === undefined
                    ? 'required'
                    : ''
                "
                :state="
                  disposalResult.allbaroYn === 'N' ||
                  disposalResult.allbaroYn === undefined
                    ? validateState('amtLoaded')
                    : ''
                "
                v-model="disposalResult.amtLoaded"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 공차중량 -->
              <y-number
                :width="8"
                :disabled="disabled"
                :editable="editable"
                :hasSeperator="true"
                :pointNumber="3"
                :maxlength="17"
                :required="
                  disposalResult.allbaroYn === 'N' ||
                  disposalResult.allbaroYn === undefined
                    ? true
                    : false
                "
                ui="bootstrap"
                label="L0000000557"
                name="amtEmpty"
                v-validate="
                  disposalResult.allbaroYn === 'N' ||
                  disposalResult.allbaroYn === undefined
                    ? 'required'
                    : ''
                "
                :state="
                  disposalResult.allbaroYn === 'N' ||
                  disposalResult.allbaroYn === undefined
                    ? validateState('amtEmpty')
                    : ''
                "
                v-model="disposalResult.amtEmpty"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 처리량 -->
              <y-number
                :width="8"
                :disabled="disabled"
                :editable="editable"
                :required="true"
                ui="bootstrap"
                label="L0000002824"
                name="amtGen"
                :hasSeperator="true"
                :pointNumber="3"
                :maxlength="17"
                v-validate="'required'"
                v-model="disposalResult.amtGen"
                :state="validateState('amtGen')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 단위 -->
              <y-select
                :width="8"
                :disabled="disabled"
                :editable="editable"
                :comboItems="envUnitCdItems"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                name="envUnitCd"
                label="L0000000870"
                v-model="disposalResult.envUnitCd"
                :required="true"
                v-validate="'required'"
                :state="validateState('envUnitCd')"
              ></y-select>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 처리담당자 -->
              <y-text
                :width="8"
                :disabled="disabled"
                :editable="editable"
                :readonly="true"
                :required="true"
                ui="bootstrap"
                label="L0000002823"
                name="displayDispoUser"
                v-model="displayDispoUser"
                v-validate="'required'"
                :state="validateState('displayDispoUser')"
                :appendIcon="[{ icon: 'search', callbackName: 'searchUser' }]"
                @searchUser="btnSearchUserClicked"
                @input="clearDisplayDispoUser"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 운반차량번호 -->
              <y-text
                :width="8"
                :editable="editable"
                :disabled="/*disposalResult.allbaroYn === 'Y'*/ disabled"
                :required="true"
                ui="bootstrap"
                label="L0000002074"
                name="carrier"
                v-model="disposalResult.carrier"
                v-validate="'required'"
                :state="validateState('carrier')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 운반업체 -->
              <y-text
                :width="8"
                :disabled="disabled"
                :editable="editable"
                :readonly="true"
                :required="true"
                ui="bootstrap"
                label="L0000002072"
                name="vendorNm"
                v-model="disposalResult.vendorNm"
                v-validate="'required'"
                :state="validateState('vendorNm')"
                :appendIcon="[
                  { icon: 'search', callbackName: 'searchFreightCo' },
                ]"
                @searchFreightCo="btnSearchFreightCoClicked"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 처리업체 -->
              <y-text
                :width="8"
                :disabled="disabled"
                :editable="editable"
                :readonly="true"
                :required="true"
                ui="bootstrap"
                label="L0000002831"
                name="freightNm"
                v-model="disposalResult.freightNm"
                v-validate="'required'"
                :state="validateState('freightNm')"
                :appendIcon="[
                  { icon: 'search', callbackName: 'searchDispoCo' },
                ]"
                @searchDispoCo="btnSearchDispoCoClicked"
              />
            </b-col>
            <!-- <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-text
                :width="8"
                :readonly="true"
                ui="bootstrap"
                name="ewstDispoStNm"
                label="처리상태"
                v-model="disposalResult.ewstDispoStNm"
              />
            </b-col>-->
            <!-- <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-number
                :width="8"
                :disabled="disabled"
                :editable="editable"
                :hasSeperator="true"
                :required="true"
                :maxlength="9"
                ui="bootstrap"
                label="운반단가"
                name="dispoCost"
                v-model="disposalResult.dispoCost"
                v-validate="'required'"
                :state="validateState('dispoCost')"
              />
            </b-col>-->
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 처리단가 -->
              <y-number
                :width="8"
                :disabled="disabled"
                :editable="editable"
                :hasSeperator="true"
                :required="true"
                :maxlength="12"
                ui="bootstrap"
                label="L0000002821"
                name="freightCost"
                v-model="disposalResult.freightCost"
                v-validate="'required'"
                :state="validateState('freightCost')"
              />
            </b-col>
            <!-- <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-number
                :width="8"
                :disabled="disabled"
                :editable="editable"
                :hasSeperator="true"
                :required="true"
                :maxlength="9"
                label="운반금액합계"
                ui="bootstrap"
                name="dispoCostSum"
                v-model="disposalResult.dispoCostSum"
                v-validate="'required'"
                :state="validateState('dispoCostSum')"
              />
            </b-col>-->
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 처리단가합계 -->
              <y-number
                :width="8"
                :disabled="disabled"
                :editable="editable"
                :hasSeperator="true"
                :required="true"
                :maxlength="15"
                ui="bootstrap"
                label="L0000002822"
                name="freightCostSum"
                v-model="disposalResult.freightCostSum"
                v-validate="'required'"
                :state="validateState('freightCostSum')"
              />
            </b-col>
            <b-col v-show="false" sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 총금액 합계 -->
              <y-number
                :width="8"
                :disabled="true"
                :editable="editable"
                :hasSeperator="true"
                :maxlength="15"
                ui="bootstrap"
                label="L0000003667"
                name="totalCost"
                v-model="disposalResult.totalCost"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 출고번호 -->
              <y-text
                :width="8"
                :disabled="disabled"
                :editable="editable"
                :maxlength="10"
                ui="bootstrap"
                label="L0000002904"
                name="wgtOutNo"
                v-model="disposalResult.wgtOutNo"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 회수번호 -->
              <y-text
                :width="8"
                :disabled="disabled"
                :editable="editable"
                :maxlength="5"
                ui="bootstrap"
                label="L0000003359"
                name="wgtIocnt"
                v-model="disposalResult.wgtIocnt"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 관련근거 -->
              <y-text
                :width="8"
                :disabled="disabled"
                :editable="editable"
                :maxlength="30"
                ui="bootstrap"
                label="L0000000565"
                name="wgtRfno"
                v-model="disposalResult.wgtRfno"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 반출입구분 -->
              <y-select
                :width="8"
                :disabled="disabled"
                :editable="editable"
                :comboItems="wgtIogbItems"
                itemText="wgtIogbNm"
                itemValue="wgtIogb"
                ui="bootstrap"
                name="wgtIogb"
                label="L0000001072"
                v-model="disposalResult.wgtIogb"
              ></y-select>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
              <!-- 비고(계근) -->
              <y-textarea
                :width="10"
                :disabled="disabled"
                :editable="editable"
                :maxlength="100"
                ui="bootstrap"
                label="L0000001361"
                name="wgtBigo"
                v-model="disposalResult.wgtBigo"
                :rows="2"
              />
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
              <!-- 비고 -->
              <y-textarea
                :width="10"
                :disabled="disabled"
                :editable="editable"
                :maxlength="150"
                ui="bootstrap"
                label="L0000001360"
                name="remark"
                v-model="disposalResult.remark"
                :rows="2"
              />
            </b-col>
            <el-divider content-position="left"></el-divider>
            <!-- 처리요청내역 -->
            <b-col sm="12" class="h100p">
              <y-auigrid
                ref="yAuiGrid1"
                :name="gridDispoReqOptions.name"
                :headers="gridDispoReqOptions.header"
                :btns="gridDispoReqOptions.btns"
                :height="gridDispoReqOptions.height"
                :items="gridDispoReqOptions.data"
                :label="this.$comm.getLangSpecInfoLabel('L0000002835')"
                :useExcelExport="false"
                :enableSorting="true"
                :showGridSetSave="true"
                :showRowCheckColumn="true"
                @btnSearchDispoRequestClicked="btnSearchDispoRequestClicked"
                @btnReject="btnReject"
                @cellEditEnd="cellEditEndHandler"
              />
            </b-col>

            <!-- 부서별 발생 산정량 -->
            <b-col sm="12" class="h100p">
              <y-auigrid
                ref="yAuiGrid2"
                :name="gridDispoRateOptions.name"
                :headers="gridDispoRateOptions.header"
                :height="gridDispoRateOptions.height"
                :label="this.$comm.getLangSpecInfoLabel('L0000001317')"
                :useExcelExport="false"
                :enableSorting="true"
                :showGridSetSave="true"
              />
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
  /** attributes: name, components, props, data **/
  name: 'dispo-result-detail',
  props: {
    popupParam: {
      type: Object,
      default: {
        ewstDispoResultNo: 0,
      },
    },
  },
  data() {
    return {
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '80%',
        top: '100px',
        param: {},
        closeCallback: null,
      },
      disposalResult: {
        resultEditable: true,
        resultComplete: false,
        requestComplete: false,
        dispoStepDisabled: false,
        ewstDispoResultNo: 0,
        ewstDispoStCd: null,
        ewstDispoStNm: null,
        ewstDispoReqNo: null,
        ewstDivCd: null,
        ewstDivNm: null,
        ewstClassCd: null,
        plantCd: null,
        ewstClassNm: null,
        ewstDispoMtdCd: null,
        ewstDispoMtdNm: null,
        sellYn: 'N',
        ewstWasteNo: null,
        ewstWasteNm: null,
        reqUserId: null,
        reqUserNm: null,
        reqDeptCd: null,
        reqDeptNm: null,
        reqYmd: null,
        ewstDispoDivNm: null,
        ewstDispoStepCd: null,
        ewstDispoStepNm: null,
        dispoUserId: null,
        dispoUserNm: null,
        dispoDeptCd: null,
        dispoDeptNm: null,
        dispoYmd: null,
        amtEmpty: null,
        amtLoaded: null,
        amtGen: null,
        envUnitCd: null,
        envUnitNm: null,
        ewstDispoCoNo: null,
        ewstDispoCoNm: null,
        ewstFreightCoNo: null,
        ewstFreightCoNm: null,
        carrier: null,
        // dispoCost: null,
        freightCost: null,
        dispoCostSum: null,
        freightCostSum: null,
        totalCost: null,
        freightNm: null,
        vendorNm: null,
        vendorCd: null,
        freightCd: null,
        remark: null,
        allbaroYn: 'N',
        allbaroTransNum: null,
        wgtOutNo: '',
        wgtIocnt: '',
        wgtRfno: '',
        wgtIogb: 'O',
        wgtBigo: '',
        createUserId: '',
        createUserNm: '',
        createDt: '',
        updateUserId: '',
        updateUserNm: '',
        updateDt: '',
        disposalRequest: [],
      },
      gridDispoRateOptions: {
        name: 'dispoResultDispoRate',
        header: [],
        data: [],
        height: 250,
      },
      gridDispoReqOptions: {
        name: 'dispoResultDispoReq',
        header: [],
        data: [],
        btns: [],
        height: 250,
      },
      editable: true,
      updateMode: false,
      isCompleteSubmit: false,
      isCreateSubmit: false,
      isUpdateSubmit: false,

      ewstDispoDivCdItems: [], // 처리구분
      ewstDispoStepCdItems: [], // 처리단계
      envUnitCdItems: [], // 단위
      ewstDispoMtdCdItems: [], // 처리방법
      ewstClassCdItems: [], // 폐기물 분류
      ewstWasteCdItems: [], // 폐기물
      ewstWasteCdItemsEdit: [],
      selectedValue: [],
      wgtIogbItems: [], // 반출입구분

      completeUrl: '',
      insertUrl: '',
      editUrl: '',
      detailUrl: '',
      requestUrl: '',

      ewstDispoStepCdDisabled: true,
      amtEmptyDisabled: false,
      amtLoadedDisabled: false,
      unitLoadedDisabled: true,
      amtGenDisabled: true,
      ewstDispoCoNmDisabled: false,
      ewstFreightCoNmDisabled: false,
      carrierDisabled: false,
      disabled: false,
      YAuiGrid1: null,
      YAuiGrid2: null,
    };
  },
  computed: {
    displayReqUser: {
      get: function () {
        if (
          !(
            this.disposalResult.reqDeptNm == null ||
            this.disposalResult.reqUserNm == null
          )
        ) {
          return (
            this.disposalResult.reqDeptNm +
            ' / ' +
            this.disposalResult.reqUserNm
          );
        } else return null;
      },
      set: function (newValue) {},
    },
    displayDispoUser: {
      get: function () {
        if (
          !(
            this.disposalResult.dispoDeptNm == null ||
            this.disposalResult.dispoUserNm == null
          )
        ) {
          return (
            this.disposalResult.dispoDeptNm +
            ' / ' +
            this.disposalResult.dispoUserNm
          );
        } else return null;
      },
      set: function (newValue) {},
    },
  },
  watch: {
    'disposalResult.plantCd': function (newValue, oldValue) {
      this.getEwstWasteCdItems();
    },
    'disposalResult.ewstClassCd': function (newValue, oldValue) {
      this.getEwstWasteCdItems();
    },
    'disposalResult.freightCostSum': function (newValue, oldValue) {
      this.disposalResult.totalCost = Number(
        this.disposalResult.freightCostSum
      );
    },
  },
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {
    this.YAuiGrid1 = this.$refs.yAuiGrid1;
    this.YAuiGrid2 = this.$refs.yAuiGrid2;
  },
  beforeDestory() {},
  methods: {
    init() {
      // 처리구분
      this.$comm.getComboItems('EWST_DISPO_DIV', false).then((_result) => {
        this.ewstDispoDivCdItems = _result;
      });
      // 처리단계
      this.$comm.getComboItems('EWST_DISPO_STEP2', false).then((_result) => {
        this.ewstDispoStepCdItems = _result;
      });
      // 단위
      this.$comm.getComboItems('EWST_UNIT', false).then((_result) => {
        this.envUnitCdItems = _result;
      });
      // 처리방법
      this.getEwstDispoMtdCdItems();
      // 폐기물
      this.getEwstWasteCdItems();
      // 폐기물 분류
      this.getEwstClassCdItems();

      // 반출입구분
      this.wgtIogbItems = [
        {
          wgtIogb: null,
          wgtIogbNm: this.$comm.getLangSpecInfoLabel('L0000003394'),
        }, // 선택하세요
        {
          wgtIogb: 'I',
          wgtIogbNm: this.$comm.getLangSpecInfoLabel('L0000003668'),
        }, // 반입
        {
          wgtIogb: 'O',
          wgtIogbNm: this.$comm.getLangSpecInfoLabel('L0000003669'),
        }, // 반출
      ];

      this.gridDispoRateOptions.header = [
        // 부서
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001287'),
          dataField: 'deptNm',
          width: '33%',
          style: 'center-align',
        },
        // 분배율(%)
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001343'),
          dataField: 'm01',
          width: '33%',
          style: 'center-align',
        },
        // 부서별 발생 산정량
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001317'),
          dataField: 'm02',
          width: '34%',
          style: 'right-align',
        },
      ];

      this.gridDispoReqOptions.header = [
        // 요청일
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002055'),
          dataField: 'reqYmd',
          width: '200',
          style: 'center-align',
        },
        // 요청부서
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002053'),
          dataField: 'reqDeptNm',
          width: '200',
          style: 'center-align',
        },
        // 요청자
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002057'),
          dataField: 'reqUserNm',
          width: '200',
          style: 'center-align',
        },
        // 폐기물
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003102'),
          dataField: 'ewstWasteNm',
          width: '200',
          style: 'center-align',
        },
        // 발생량
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001075'),
          dataField: 'amtGen',
          width: '200',
          style: 'right-align',
        },
        // 단위
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000870'),
          dataField: 'envUnitNm',
          width: '200',
          style: 'center-align',
        },
      ];

      this.completeUrl =
        transactionConfig.env.waste.operationLog.disposalResult.complete.url;
      this.insertUrl =
        transactionConfig.env.waste.operationLog.disposalResult.insert.url;
      this.editUrl =
        transactionConfig.env.waste.operationLog.disposalResult.edit.url;
      this.detailUrl =
        selectConfig.env.waste.operationLog.disposalResult.get.url;
      this.requestUrl =
        selectConfig.env.waste.operationLog.disposalRequest.request.url;

      if (this.popupParam.ewstDispoResultNo !== 0) {
        this.disposalResult.ewstDispoResultNo =
          this.popupParam.ewstDispoResultNo;
        this.getDetail();
      }
      this.setGridBtn();
    },
    setGridBtn() {
      this.gridDispoReqOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000003226'), // 행추가
          color: 'blue',
          btnClicked: 'btnSearchDispoRequestClicked',
          visible:
            (this.editable &&
              this.updateMode &&
              ((this.disposalResult.ewstDispoStCd === '91' &&
                this.disposalResult.ewstDispoDivCd === 2 &&
                this.disposalResult.allbaroYn === 'Y') ||
                this.disposalResult.ewstDispoStCd !== '91')) ||
            this.popupParam.ewstDispoResultNo === 0,
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000003223'), // 행 삭제
          color: 'red',
          btnClicked: 'btnReject',
          visible:
            (this.editable &&
              this.updateMode &&
              ((this.disposalResult.ewstDispoStCd === '91' &&
                this.disposalResult.ewstDispoDivCd === 2 &&
                this.disposalResult.allbaroYn === 'Y') ||
                this.disposalResult.ewstDispoStCd !== '91')) ||
            this.popupParam.ewstDispoResultNo === 0,
        },
      ];
    },
    getDetail() {
      this.gridDispoRateOptions.data = [];
      this.gridDispoReqOptions.data = [];

      this.$http.url = this.$format(
        this.detailUrl,
        this.disposalResult.ewstDispoResultNo
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.updateMode = true;
          this.disposalResult = _result.data;
          // this.gridDispoRateOptions.data = _result.data.disporateDeptItem;
          this.YAuiGrid2.setGridData(
            this.$_.clone(_result.data.disporateDeptItem)
          );

          this.disposalResult.totalCost = _result.data.freightCostSum;

          if (
            this.disposalResult.allbaroYn === 'Y' ||
            this.disposalResult.ewstDispoStCd === '91'
          ) {
            // 올바로를 통해서 등록 했을 경우 기본정보는 수정불가
            // 진행상태가 처리완료인 경우 기본정보 수정불가
            this.disabled = true;
          } else {
            this.disabled = false;
          }
          this.setGridBtn();
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
      this.$http.url = this.$format(
        this.requestUrl,
        this.disposalResult.ewstDispoResultNo
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.gridDispoReqOptions.data = _result.data;
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    getEwstDispoMtdCdItems() {
      this.$http.url = this.$format(
        selectConfig.env.waste.operationLog.disposalResult.mtd.url
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          _result.data.splice(0, 0, {
            ewstDispoMtdCd: null,
            ewstDispoMtdNm: this.$comm.getLangSpecInfoLabel('L0000003394'), // '선택하세요',
          });
          this.ewstDispoMtdCdItems = _result.data;
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    getEwstWasteCdItems() {
      this.$http.url = selectConfig.env.waste.baseInfo.waste.list.url;
      this.$http.type = 'GET';
      this.$http.param = {
        plantCd: this.disposalResult.plantCd,
        ewstClassCd: this.disposalResult.ewstClassCd,
        useYn: 'Y',
      };
      this.$http.request(
        (_result) => {
          this.ewstWasteCdItems = _result.data;
          this.ewstWasteCdItems.splice(0, 0, {
            ewstWasteNo: null,
            ewstWasteNm: this.$comm.getLangSpecInfoLabel('L0000003394'), // '선택하세요',
          });
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    clearDisplayDispoUser() {
      this.disposalResult.dispoDeptNm = null;
      this.disposalResult.dispoUserNm = null;
    },
    btnSearchSysInfoClicked(_item) {
      if (this.disposalResult.dispoYmd === null) {
        window.getApp.$emit('ALERT', {
          title: 'L0000001934', // '업로드',
          message: 'M0000000380', // '처리일자를 입력해 주세요.',
          type: 'warning',
        });

        return false;
      }
      let ymd = this.disposalResult.dispoYmd;

      this.popupOptions.target = () => import(`${'./dispoSysInfoPopup.vue'}`);
      this.popupOptions.title = 'L0000003670'; // '계근정보 조회';
      this.popupOptions.param = {
        ymd: ymd.replace(/-/g, ''),
        plantCd: this.disposalResult.plantCd,
      };
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closePopupSysInfo;
    },
    closePopupSysInfo(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;

      if (data.sys) {
        this.disposalResult.amtLoaded = data.sys.ZGRWGT; // 계근 중량
        this.disposalResult.amtGen = data.sys.ZGGWGT; // 처리량
        this.disposalResult.amtEmpty = data.sys.ZBLKWE; // 공차 중량
        this.disposalResult.remark = data.sys.ZMATNM; // 물품명
        this.disposalResult.carrier = data.sys.ZCARNS; // 차량번호

        this.disposalResult.wgtOutNo = data.sys.ZOUTNO; // 출고번호
        this.disposalResult.wgtIocnt = data.sys.ZIOCNT; // 회수번호
        this.disposalResult.wgtRfno = data.sys.ZRFNO; // 관련근거
        this.disposalResult.wgtIogb = data.sys.ZIOGB; // 반출입구분
        this.disposalResult.wgtBigo = data.sys.ZBIGO; // 비고
      }
    },
    btnSearchUserClicked(_item) {
      if (this.disposalResult.allbaroYn === 'Y') {
        return;
      }
      this.popupOptions.target = () =>
        import(`${'../../../manage/user/userSearch.vue'}`);
      this.popupOptions.title = 'L0000003674'; // '처리자검색';
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closePopupSearchUser;
    },
    closePopupSearchUser(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      if (data.user) {
        this.disposalResult.dispoUserId = data.user.userId;
        this.disposalResult.dispoUserNm = data.user.userNm;
        this.disposalResult.dispoDeptCd = data.user.deptCd;
        this.disposalResult.dispoDeptNm = data.user.deptNm;
      }
    },
    btnSearchFreightCoClicked(_item) {
      if (this.disposalResult.allbaroYn === 'Y') {
        return;
      }

      this.popupOptions.param = {
        dispoFreightYn: 'freight',
      };
      this.popupOptions.target = () =>
        import(`${'../baseInfo/dispoCompanySearch.vue'}`);
      this.popupOptions.title = 'L0000002072'; // '운반업체';
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closePopupSearchFreightCo;
    },
    getEwstClassCdItems() {
      this.$http.url = selectConfig.env.waste.baseInfo.wasteClass.list.url;
      this.$http.type = 'GET';
      this.$http.param = { useYn: 'Y' };
      this.$http.request(
        (_result) => {
          this.ewstClassCdItems = this.$_.clone(_result.data);
          this.ewstClassCdItems.splice(0, 0, {
            ewstClassCd: null,
            ewstClassNm: this.$comm.getLangSpecInfoLabel('L0000003394'), // '선택하세요',
          });
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    beforeCreateSubmit() {
      this.disposalResult.disposalRequest = this.gridDispoReqOptions.data;

      this.disposalResult.totalCost = Number(
        this.disposalResult.freightCostSum
      );

      this.disposalResult.ewstDispoResultNo = 0;
      this.updateMode = false;
      this.$validator
        .validateAll()
        .then((_result) => {
          if (_result) {
            window.getApp.$emit('CONFIRM', {
              title: 'L0000003321', // '확인',
              message: 'M0000000011', // 저장하시겠습니까?
              type: 'info',
              confirmCallback: () => {
                this.disposalResult.createUserId = this.$store.getters.token;
                this.isCreateSubmit = true;
              },
            });
          } else if (!_result) {
            this.$popupRequired.check(
              'dispoResultDetail',
              this.$data,
              this.errors
            );
          }
        })
        .catch(() => {
          window.getApp.$emit(
            'APP_VALID_ERROR',
            'M0000000004' // '유효성 검사 중 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.'
          );
        });
    },
    btnCreateClickedCallback(_result) {
      this.isCreateSubmit = false;
      this.updateMode = true;
      this.disposalResult.ewstDispoResultNo = _result.data;
      this.getDetail();
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // '안내',
        message: 'M0000000006', // '저장되었습니다.',
        type: 'success',
      });
    },
    validateState(_ref) {
      if (
        this.veeBag[_ref] &&
        (this.veeBag[_ref].dirty || this.veeBag[_ref].validated)
      ) {
        return !this.errors.has(_ref);
      }
      return null;
    },
    btnSearchDispoCoClicked(_item) {
      if (this.disposalResult.allbaroYn === 'Y') {
        return;
      }
      this.popupOptions.param = {
        dispoFreightYn: 'dispo',
      };
      this.popupOptions.target = () =>
        import(`${'../baseInfo/dispoCompanySearch.vue'}`);
      this.popupOptions.title = 'L0000002831'; // '처리업체';
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closePopupSearchDispoCo;
    },
    btnCompleteClickedCallback(_result) {
      this.isCompleteSubmit = false;
      this.updateMode = true;
      this.disposalResult.ewstDispoResultNo = _result.data;
      this.getDetail();

      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // '안내',
        message: 'M0000000006', // '저장되었습니다.',
        type: 'success',
      });
    },
    closePopupSearchDispoCo(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      if (data.dispoCo) {
        this.disposalResult.freightCd = data.dispoCo.item.vendorCd;
        this.disposalResult.freightNm = data.dispoCo.item.vendorNm;
      }
    },
    beforeCompleteSubmit() {
      this.disposalResult.disposalRequest = this.gridDispoReqOptions.data;
      this.disposalResult.ewstDispoStCd = '91';
      if (this.gridDispoReqOptions.data.length <= 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // '안내',
          message: 'M0000000377', // '처리요청내역이 존재하지 않습니다.',
          type: 'warning', // success / info / warning / error
        });
        return;
      }
      this.disposalResult.totalCost = Number(
        this.disposalResult.freightCostSum
      );
      this.disposalResult.disposalRequest = this.gridDispoReqOptions.data;
      this.$http.url = this.editUrl;
      this.$http.param = this.disposalResult;
      this.$http.type = 'PUT';
      this.$http.request(
        (_result) => {},
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
      this.$validator
        .validateAll()
        .then((_result) => {
          if (_result) {
            window.getApp.$emit('CONFIRM', {
              title: 'L0000003321', // '확인',
              message: 'M0000000378', // '처리완료 하시겠습니까?',
              type: 'info',
              confirmCallback: () => {
                this.disposalResult.createUserId = this.$store.getters.token;
                this.disposalResult.updateUserId = this.$store.getters.token;
                this.isCompleteSubmit = true;
              },
            });
          } else {
            this.$popupRequired.check(
              'dispoResultDetail',
              this.$data,
              this.errors
            );
          }
        })
        .catch(() => {
          window.getApp.$emit(
            'APP_VALID_ERROR',
            'M0000000004' // '유효성 검사 중 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.'
          );
        });
    },
    btnSearchDispoRequestClicked(_item) {
      this.popupOptions.target = () =>
        import(`${'../baseInfo/dispoRequestSearch.vue'}`);
      this.popupOptions.param = {
        dispoRequests: this.gridDispoReqOptions.data,
        ewstWasteNo: this.disposalResult.ewstWasteNo,
      };
      this.popupOptions.title = 'L0000003675'; // '폐기물 요청';
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closePopupDispoRequest;
    },
    closePopupSearchFreightCo(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      if (data.dispoCo) {
        this.disposalResult.vendorCd = data.dispoCo.item.vendorCd;
        this.disposalResult.vendorNm = data.dispoCo.item.vendorNm;
      }
    },
    closePopupDispoRequest(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;

      this.$_.forEach(data.dispoRequest, (item) => {
        if (
          this.$_.findIndex(this.gridDispoReqOptions.data, {
            ewstDispoReqNo: item.ewstDispoReqNo,
          }) === -1
        ) {
          this.gridDispoReqOptions.data.push({
            ewstDispoReqNo: item.ewstDispoReqNo,
            reqYmd: item.reqYmd,
            reqDeptNm: item.reqDeptNm,
            reqUserNm: item.reqUserNm,
            ewstWasteNm: item.ewstWasteNm,
            amtGen: item.amtGen,
            envUnitNm: item.envUnitNm,
          });
        }
      });
    },
    btnReject() {
      if (this.YAuiGrid1.getCheckedRowItems().length === 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // '안내',
          message: 'M0000000160', // '제외할 항목을 선택하세요.',
          type: 'warning',
        });
      } else {
        let gridData = this.YAuiGrid1.getGridData();
        const selectedRows = this.YAuiGrid1.getCheckedRowItems().map(
          (row) => row.item
        );
        this.$_.forEach(selectedRows, (item) => {
          gridData = this.$_.reject(gridData, item);
        });

        this.gridDispoReqOptions.data = gridData;
        this.YAuiGrid1.setGridData(gridData);
        this.cellEditEndHandler();
      }
    },
    cellEditEndHandler() {
      this.disposalResult.disposalRequest = this.YAuiGrid1.getGridData();
    },
    beforeUpdateSubmit() {
      this.disposalResult.disposalRequest = this.gridDispoReqOptions.data;
      this.disposalResult.ewstDispoStCd = '31';
      this.disposalResult.totalCost = Number(
        this.disposalResult.freightCostSum
      );

      this.$validator
        .validateAll()
        .then((_result) => {
          if (_result) {
            window.getApp.$emit('CONFIRM', {
              title: 'L0000003321', // '확인',
              message: 'M0000000011', // 저장하시겠습니까?
              type: 'info',
              confirmCallback: () => {
                this.disposalResult.updateUserId = this.$store.getters.token;

                this.isUpdateSubmit = true;
              },
            });
          } else if (!_result) {
            window.getApp.$emit('ALERT', {
              title: 'L0000003395', // '안내',
              message: 'M0000000005', // '필수 입력값을 입력해 주세요.',
              type: 'warning', // success / info / warning / error
            });
          }
        })
        .catch(() => {
          window.getApp.$emit(
            'APP_VALID_ERROR',
            'M0000000004' // '유효성 검사 중 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.'
          );
        });
    },
    btnUpdateClickedCallback(_result) {
      this.isUpdateSubmit = false;
      this.getDetail();

      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // '안내',
        message: 'M0000000006', // '저장되었습니다.',
        type: 'success',
      });
    },
    btnClickedErrorCallback(_result) {
      this.isCompleteSubmit = false;
      this.isCreateSubmit = false;
      this.isUpdateSubmit = false;
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    selectedCheck() {
      return this.editable;
    },
    btnDeleteClicked() {
      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321', // '확인',
        message: 'M0000000012', // '삭제하시겠습니까?',
        type: 'info',
        confirmCallback: () => {
          this.$http.url = this.$format(
            transactionConfig.env.waste.operationLog.disposalResult.delete.url,
            this.disposalResult.ewstDispoResultNo
          );
          this.$http.type = 'delete';
          this.$http.request(
            (_result) => {
              this.getList();
              this.btnClearClickedCallback(_result);
              window.getApp.$emit('ALERT', {
                title: 'L0000003395', // '안내',
                message: 'M0000000007', // '삭제되었습니다.',
                type: 'success',
              });
            },
            (_error) => {
              window.getApp.$emit('APP_REQUEST_ERROR', _error);
            }
          );
        },
      });
    },
    btnClosePopup() {
      // 부모창에 값 전달
      this.$emit('closePopup', { success: true });
    },
  },
};
</script>
