<!--
  목적 : 화학물질 > 화학자재 > 화학자재 상세
  Detail :  화학자재에 대한 상세정보를 보여준다.
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
            <!-- 화학자재 -->
            <y-label label="L0000003309" icon="user-edit" color-class="cutstom-title-color" />
            <div slot="buttonGroup" class="float-right mb-1">
              <el-tag size="medium" type="success" v-if="importTypeNm !== ''">{{ $comm.getLangSpecInfoLabel(importTypeNm) }}</el-tag>&nbsp;&nbsp;
              <!-- 불러오기 -->
              <y-btn
                v-if="!popupParam.popupMode && editable && popupParam.chemprodNo === 0"
                title="L0000001349"
                color="orange"
                @btnClicked="openMatCheckRequestPopup"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!-- 저장 -->
              <y-btn
                v-if="!popupParam.popupMode && editable"
                :action-url="saveUrl"
                :param="chemprod"
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
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-8">
              <b-row>
                <b-col sm="8" md="8" lg="8" xl="8" class="col-xxl-8">
                  <!-- 자재/자재코드 -->
                  <y-text
                    :width="9"
                    :editable="!popupParam.popupMode && editable"
                    :required="true"
                    :clearable="true"
                    :disabled="true"
                    ui="bootstrap"
                    label="L0000002321"
                    name="chemProdNm"
                    v-model="chemprod.chemProdNm"
                    v-validate="'required'"
                    :state="validateState('chemProdNm')"
                    :appendIcon="[{ 'icon': 'search', callbackName: 'searchChemProd' }]"
                    @searchChemProd="searchChmProd()"
                  ></y-text>
                </b-col>
                <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
                  <y-text
                    :width="12"
                    :editable="!popupParam.popupMode && editable"
                    :disabled="true"
                    :clearable="true"
                    ui="bootstrap"
                    name="sapMatCd"
                    v-model="chemprod.sapMatCd"
                  ></y-text>
                </b-col>
              </b-row>
            </b-col>

            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-8">
              <b-row>
                <b-col sm="8" md="8" lg="8" xl="8" class="col-xxl-8">
                  <!-- 납품업체/코드 -->
                  <y-text
                    :width="9"
                    :required="true"
                    :editable="!popupParam.popupMode && editable"
                    :disabled="true"
                    :clearable="true"
                    ui="bootstrap"
                    label="L0000000806"
                    name="vendorNm"
                    v-model="chemprod.vendorNm"
                    :appendIcon="[{ 'icon': 'search', callbackName: 'searchVendor' }]"
                    @searchVendor="searchVendor('V')"
                    v-validate="'required'"
                    :state="validateState('vendorNm')"
                  ></y-text>
                </b-col>
                <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
                  <y-text
                    :width="12"
                    :editable="!popupParam.popupMode && editable"
                    :disabled="true"
                    :clearable="true"
                    ui="bootstrap"
                    name="vendorCd"
                    v-model="chemprod.vendorCd"
                    v-validate="'required'"
                    :state="validateState('vendorCd')"
                  ></y-text>
                </b-col>
              </b-row>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-8">
              <b-row>
                <b-col sm="8" md="8" lg="8" xl="8" class="col-xxl-8">
                  <!-- 제조업체/코드 -->
                  <y-text
                    :width="9"
                    :required="true"
                    :editable="!popupParam.popupMode && editable"
                    :disabled="true"
                    :clearable="true"
                    ui="bootstrap"
                    label="L0000002630"
                    name="makerNm"
                    v-model="chemprod.makerNm"
                    :appendIcon="[{ 'icon': 'search', callbackName: 'searchVendor' }]"
                    @searchVendor="searchVendor('M')"
                    v-validate="'required'"
                    :state="validateState('makerNm')"
                  ></y-text>
                </b-col>
                <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
                  <y-text
                    :width="12"
                    :editable="!popupParam.popupMode && editable"
                    :disabled="true"
                    :clearable="true"
                    ui="bootstrap"
                    name="makerCd"
                    v-model="chemprod.makerCd"
                    v-validate="'required'"
                    :state="validateState('makerCd')"
                  ></y-text>
                </b-col>
              </b-row>
            </b-col>

            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4"></b-col>

            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 대표사업장 -->
              <y-plant
                type="edit"
                filter="chm"
                :required="true"
                :editable="!popupParam.popupMode && editable"
                label="L0000000940"
                name="plantCd"
                v-model="chemprod.plantCd"
                v-validate="'required'"
                :state="validateState('plantCd')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4" v-show="false">
              <!-- 화학자재명(국문) -->
              <y-text
                :width="8"
                :disable="true"
                :maxlength="200"
                ui="bootstrap"
                label="L0000003318"
                name="chemProdNmKr"
                v-model="chemprod.chemProdNmKr"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4" v-show="false">
              <!-- 화학자재명(영문) -->
              <y-text
                :width="8"
                :disable="true"
                :maxlength="200"
                ui="bootstrap"
                label="L0000003319"
                name="chemProdNmEn"
                v-model="chemprod.chemProdNmEn"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 성상 -->
              <y-select
                :width="8"
                :required="true"
                :editable="!popupParam.popupMode && editable"
                :comboItems="propertyItems"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                type="search"
                label="L0000001635"
                name="property"
                v-model="chemprod.property"
                v-validate="'required'"
                :state="validateState('property')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 비산성(고체) -->
              <y-number
                :width="8"
                :editable="!popupParam.popupMode && editable"
                :maxlength="10"
                :hasSeperator="false"
                :pointNumber="2"
                ui="bootstrap"
                label="L0000001366"
                name="fugacity"
                v-model="chemprod.fugacity"
              ></y-number>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 끓는점(액체,기체) -->
              <y-number
                :width="8"
                :editable="!popupParam.popupMode && editable"
                :maxlength="10"
                :hasSeperator="false"
                :pointNumber="2"
                ui="bootstrap"
                label="L0000000801"
                name="boilpoint"
                v-model="chemprod.boilpoint"
              ></y-number>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 녹는점 -->
              <y-number
                :width="8"
                :editable="!popupParam.popupMode && editable"
                :maxlength="10"
                :hasSeperator="false"
                :pointNumber="2"
                ui="bootstrap"
                label="L0000000851"
                name="meltingPnt"
                v-model="chemprod.meltingPnt"
              ></y-number>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 분자량 -->
              <y-text
                :width="8"
                :editable="!popupParam.popupMode && editable"
                :maxlength="30"
                ui="bootstrap"
                label="L0000001347"
                name="moleWeight"
                v-model="chemprod.moleWeight"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 사업구분 -->
              <y-select
                :width="8"
                :editable="!popupParam.popupMode && editable"
                :comboItems="bizCatItems"
                :required="true"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                type="search"
                label="L0000001413"
                name="bizCatCd"
                v-model="chemprod.bizCatCd"
                v-validate="'required'"
                :state="validateState('bizCatCd')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 제품구분 -->
              <y-select
                :width="8"
                :editable="!popupParam.popupMode && editable"
                :comboItems="prodCatItems"
                :required="true"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                type="search"
                label="L0000002637"
                name="prodCatCd"
                v-model="chemprod.prodCatCd"
                v-validate="'required'"
                :state="validateState('prodCatCd')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 용도 -->
              <y-select
                :width="8"
                :editable="!popupParam.popupMode && editable"
                :required="true"
                :comboItems="usageItems"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                type="search"
                label="L0000002059"
                name="usageCd"
                v-model="chemprod.usageCd"
                v-validate="'required'"
                :state="validateState('usageCd')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 용도(기타) -->
              <y-text
                :width="8"
                :editable="!popupParam.popupMode && editable"
                :maxlength="60"
                ui="bootstrap"
                label="L0000002060"
                name="usageEtc"
                v-model="chemprod.usageEtc"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- HS번호 -->
              <y-text
                :width="8"
                :editable="!popupParam.popupMode && editable"
                :maxlength="30"
                ui="bootstrap"
                label="L0000000118"
                name="hsNum"
                v-model="chemprod.hsNum"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 비중 -->
              <y-text
                :width="8"
                :editable="!popupParam.popupMode && editable"
                :maxlength="20"
                ui="bootstrap"
                label="L0000001374"
                name="specificGravity"
                v-model="chemprod.specificGravity"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- CAS No. -->
              <y-text
                :width="8"
                :editable="!popupParam.popupMode && editable"
                :maxlength="30"
                ui="bootstrap"
                label="L0000000102"
                name="casNo"
                v-model="chemprod.casNo"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 보관장소 -->
              <y-text
                :width="8"
                :editable="!popupParam.popupMode && editable"
                :maxlength="30"
                ui="bootstrap"
                label="L0000001248"
                name="stckArea"
                v-model="chemprod.stckArea"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 대기/수질여부 -->
              <y-checkbox
                :width="8"
                :editable="!popupParam.popupMode && editable"
                :comboItems="polItems"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                name="pols"
                label="L0000000909"
                v-model="chemprod.pols"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 물질구성 -->
              <y-switch
                :width="8"
                :editable="!popupParam.popupMode && editable"
                :required="true"
                true-value="Y"
                false-value="N"
                ui="bootstrap"
                label="L0000001053"
                name="mixYn"
                selectText="L0000003801"
                unselectText="L0000003802"
                v-model="chemprod.mixYn"
                v-validate="'required'"
                :state="validateState('mixYn')"
              />
              <!-- L0000003801: 복합 -->
              <!-- L0000003802: 단일 -->
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 인허가대상물질 -->
              <y-switch
                :width="8"
                :editable="!popupParam.popupMode && editable"
                true-value="Y"
                false-value="N"
                ui="bootstrap"
                label="L0000002249"
                name="licensingYn"
                selectText="L0000003213"
                unselectText="L0000001065"
                v-model="chemprod.licensingYn"
              />
              <!-- L0000003213: 해당 -->
              <!-- L0000001065: 미해당 -->
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 위험물질 -->
              <y-text
                :width="8"
                :disabled="true"
                :editable="!popupParam.popupMode && editable"
                ui="bootstrap"
                label="L0000002143"
                name="chemprodRegulItmNm"
                v-model="chemprod.chemprodRegulItmNm"
                :appendIcon="[{ 'icon': 'search', callbackName: 'searchMatStrg' }]"
                @searchMatStrg="searchMatStrg"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 사용여부 -->
              <y-switch
                :width="8"
                :editable="!popupParam.popupMode && editable"
                true-value="Y"
                false-value="N"
                ui="bootstrap"
                label="L0000001439"
                name="useYn"
                selectText="L0000001440"
                unselectText="L0000001063"
                v-model="chemprod.useYn"
              />
              <!-- L0000001440: 사용 -->
              <!-- L0000001063: 미사용 -->
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-8">
              <!-- 성분확인방법 -->
              <y-radio
                :width="10"
                :editable="!popupParam.popupMode && editable"
                :required="true"
                :comboItems="cfmMtdItems"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                name="cfmMtdCd"
                label="L0000001634"
                v-model="chemprod.cfmMtdCd"
                v-validate="'required'"
                :state="validateState('cfmMtdCd')"
              />
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-8">
              <!-- 제품분류 -->
              <y-checkbox
                :width="10"
                :editable="!popupParam.popupMode && editable"
                :comboItems="prodClassItems"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                name="prodClass"
                label="L0000002640"
                v-model="chemprod.prodClass"
              />
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              <!-- 비고 -->
              <y-textarea
                :width="10"
                :editable="!popupParam.popupMode && editable"
                :maxlength="600"
                ui="bootstrap"
                label="L0000001360"
                name="remark"
                v-model="chemprod.remark"
              ></y-textarea>
            </b-col>
            <!-- 첨부파일 -->
            <el-divider content-position="left">{{$comm.getLangSpecInfoLabel('L0000002843')}}</el-divider>
            <component
              :is="attach"
              v-if="attach"
              :submitCheck="submitCheck"
              :attachFileGrps="attachFileGrps"
              :saveAttachFiles="saveAttachFiles"
              @changeUploadFiles="changeUploadFiles"
              @setTempDeleteFiles="setTempDeleteFiles"
              @closePopup="closePopup"
            />
            <!-- PSM 정보 -->
            <el-divider content-position="left">{{$comm.getLangSpecInfoLabel('L0000000154')}}</el-divider>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 폭발한계상한 -->
              <y-number
                :width="8"
                :editable="!popupParam.popupMode && editable"
                :maxlength="10"
                :hasSeperator="false"
                :pointNumber="2"
                ui="bootstrap"
                label="L0000003148"
                name="explUpLimit"
                v-model="chemprod.explUpLimit"
              ></y-number>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 폭발한계하한 -->
              <y-number
                :width="8"
                :editable="!popupParam.popupMode && editable"
                :maxlength="10"
                :hasSeperator="false"
                :pointNumber="2"
                ui="bootstrap"
                label="L0000003149"
                name="explLowLimit"
                v-model="chemprod.explLowLimit"
              ></y-number>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 노출기준 -->
              <y-text
                :width="8"
                :editable="!popupParam.popupMode && editable"
                ui="bootstrap"
                label="L0000000845"
                name="leakThresh"
                v-model="chemprod.leakThresh"
                :maxlength="30"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 독성치 -->
              <y-text
                :width="8"
                :editable="!popupParam.popupMode && editable"
                ui="bootstrap"
                label="L0000000959"
                name="lc50"
                v-model="chemprod.lc50"
                :maxlength="30"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 인화점 -->
              <y-text
                :width="8"
                :editable="!popupParam.popupMode && editable"
                ui="bootstrap"
                label="L0000002261"
                name="flashingPnt"
                v-model="chemprod.flashingPnt"
                :maxlength="30"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 발화점 -->
              <y-text
                :width="8"
                :editable="!popupParam.popupMode && editable"
                ui="bootstrap"
                label="L0000001104"
                name="IgnitionPnt"
                v-model="chemprod.IgnitionPnt"
                :maxlength="30"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 증기압 -->
              <y-text
                :width="8"
                :editable="!popupParam.popupMode && editable"
                ui="bootstrap"
                label="L0000002744"
                name="vaporPressure"
                v-model="chemprod.vaporPressure"
                :maxlength="30"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 이상반응유무 -->
              <y-switch
                :width="8"
                :editable="!popupParam.popupMode && editable"
                true-value="Y"
                false-value="N"
                ui="bootstrap"
                label="L0000002210"
                name="extraReactionYn"
                selectText="O"
                unselectText="X"
                v-model="chemprod.extraReactionYn"
              ></y-switch>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 부식성유무 -->
              <y-switch
                :width="8"
                :editable="!popupParam.popupMode && editable"
                true-value="Y"
                false-value="N"
                ui="bootstrap"
                label="L0000001335"
                name="corrosivenessYn"
                selectText="O"
                unselectText="X"
                v-model="chemprod.corrosivenessYn"
              ></y-switch>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 일일취급량 -->
              <y-text
                :width="8"
                :editable="!popupParam.popupMode && editable"
                ui="bootstrap"
                label="L0000002271"
                name="dailyVol"
                v-model="chemprod.dailyVol"
                :maxlength="30"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 저장량 -->
              <y-text
                :width="8"
                :editable="!popupParam.popupMode && editable"
                ui="bootstrap"
                label="L0000002477"
                name="maxVol"
                v-model="chemprod.maxVol"
                :maxlength="30"
              ></y-text>
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>
    <el-tabs class="mt-3" type="border-card" v-model="tabIndex" @tab-click="tabClick">
      <el-tab-pane v-for="(item, i) in tabItems" :key="i" stretch class="default-tab-pane">
        <span slot="label">
          <i class="el-icon-date"></i>
          {{ $comm.getLangSpecInfoLabel(item.title) }}
        </span>
      </el-tab-pane>
      <keep-alive>
        <component
          :is="component"
          v-if="component"
          :paneName="paneName"
          :chemProd="chemprod"
          :chemprodNo="popupParam.chemprodNo"
          :matChkRqstNo="popupParam.matChkRqstNo"
          :changeChemProd="changeChemProd"
          :changeImport="changeImport"
          :saveData="saveData"
          :popupMode="popupParam.popupMode"
          @setChangeChemProd="setChangeChemProd"
          @setChangeImport="setChangeImport"
          @closePopup="closePopup"
        />
      </keep-alive>
    </el-tabs>
    <b-row class="mt-1">
      <b-col>
        <div slot="buttonGroup" class="float-right mb-1">
          <!-- 닫기 -->
          <!-- <y-btn title="L0000000881" @btnClicked="closePopup" /> -->
        </div>
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
  name: 'chemprod-detail',
  components: {},
  props: {
    popupParam: {
      type: Object,
      default: {
        chemprodNo: 0, // 평가계획 번호
        popupMode: false, // 팝업조회모드
        matCheckRqstNo: 0,
      },
    },
  },
  data() {
    return {
      chemprod: {
        chemProdNo: 0,
        chemProdNm: '',
        chemProdNmKr: '',
        chemProdNmEn: '',
        sapMatCd: '', // SAP자재코드
        vendorNm: '', // 납품업체명
        vendorCd: '', // 납품업체코드
        originNm: '', // 납품업체국가명
        originCd: '', // 납품업체국가코드
        makerNm: '', // 공급업체명
        makerCd: '', // 공급업체코드
        makerOriginNm: '',
        makerOriginCd: '',
        plantCd: '',
        property: null,
        fugacity: '',
        mixYn: 'N',
        boilpoint: '',
        meltingPnt: '',
        moleWeight: '',
        bizCatCd: null,
        prodCatCd: null,
        usageCd: null,
        specificGravity: null, // 비중
        casNo: null, // CAS No.
        usageEtc: null,
        hsNum: null,
        stckArea: null, // 보관장소
        pols: [], // 대기/수질여부
        airPolYn: 'N',
        wtrPolYn: 'N',
        licensingYn: 'N',
        // dgrYn: 'N', // 위험물질여부
        chemprodRegulItmNo: 0,
        chemprodRegulItmNm: '',
        cfmMtdCd: null,
        makeYn: '',
        impYn: '',
        buyYn: '',
        salesYn: '',
        usingYn: '',
        expYn: '',
        prodClass: [],
        remark: null,
        explUpLimit: '',
        explLowLimit: '',
        leakThresh: '',
        lc50: '',
        flashingPnt: '',
        IgnitionPnt: '',
        vaporPressure: '',
        extraReactionYn: '',
        corrosivenessYn: '',
        dailyVol: '',
        maxVol: '',
        useYn: 'Y',
        createUserId: '',
        updateUserId: '',
        chemprodChemRegul: null,
      },
      editable: false,
      updateMode: false,
      isSave: false,
      gridOptions: {
        header: [],
        data: [],
        height: '300',
      },
      propertyItems: [],
      bizCatItems: [],
      cfmMtdItems: [],
      prodClassItems: [],
      polItems: [], // 대기/수질여부
      usageItems: [],
      prodCatItems: [],
      plantItems: [],
      saveData: {
        chemProdNo: 0,
        chemprodChems: [],
        chemprodRegulItms: [],
        regulItmNos: [],
        createUserId: '',
        updateUserId: '',
      },
      tabItems: [
        // 구성성분/규제 정보
        { title: 'L0000000697', url: './chemprodChemRegulInfoNew.vue' },
      ],
      component: null,
      tabIndex: 0,
      paneName: '',
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '80%',
        top: '50px',
        param: {},
        closeCallback: null,
      },
      selectedValue: [],
      searchDetailUrl: '',
      searchSetRegulUrl: '',
      matCheckRqstDetailUrl: '',
      searchRegulUrl: '',
      saveUrl: '',
      checkUrl: '',
      actionType: 'POST',
      changeChemProd: false,
      changeImport: false,
      importTypeNm: '',

      // 첨부파일
      attach: null, // 첨부파일컴포넌트
      submitCheck: false, // 첨부파일의 변경여부를 판단하여 처리
      saveAttachFiles: [],
      tempDeleteFiles: [],
      attachFileGrps: [],
    };
  },
  watch: {
    tabIndex() {
      this.loadComponent();
    },
  },
  //* Vue lifecycle: created, mounted, destroyed, etc */
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.editable = this.$route.meta.editable;
  },
  mounted() {
    this.loadComponent();
    this.init();
  },
  beforeDestroy() {},
  //* methods */
  methods: {
    loadComponent() {
      var path = this.tabItems[this.tabIndex].url;
      this.component = () => import(`${path}`);
    },
    init() {
      this.searchDetailUrl = selectConfig.chm.chemprod.get.url;
      this.searchSetRegulUrl = selectConfig.chm.chemicalRegulItmChemVal.list.url;
      this.checkUrl = selectConfig.chm.chemprod.check.url;
      this.saveUrl = transactionConfig.chm.chemprod.insert.url;
      this.matCheckRqstDetailUrl = selectConfig.chm.matCheckRequest.getchild.url;
      this.searchRegulUrl = selectConfig.chm.chemicalRegulItem.list.url;

      // 그리드 헤더 설정
      this.gridOptions.header = [
        // 자재번호
        { text: 'L0000002329', name: 'matCode', width: '120px', align: 'center' },
        // 자재명
        { text: 'L0000002326', name: 'matName', width: '250px' },
        // 포장단위
        { text: 'L0000003141', name: 'packUnit', width: '120px', align: 'center' },
      ];

      this.prodClassItems = [
        { code: 'make', codeNm: this.$comm.getLangSpecInfoLabel('L0000002624') }, // '제조'
        { code: 'imp', codeNm: this.$comm.getLangSpecInfoLabel('L0000001695') }, // '수입'
        { code: 'buy', codeNm: this.$comm.getLangSpecInfoLabel('L0000000684') }, // '구매'
        { code: 'using', codeNm: this.$comm.getLangSpecInfoLabel('L0000001440') }, // '사용'
        { code: 'sales', codeNm: this.$comm.getLangSpecInfoLabel('L0000001705') }, // '수출'
        { code: 'exp', codeNm: this.$comm.getLangSpecInfoLabel('L0000003034') }, // '판매'
      ];

      this.polItems = [
        { code: 'air', codeNm: this.$comm.getLangSpecInfoLabel('L0000000910') }, // '대기오염물질'
        { code: 'wtr', codeNm: this.$comm.getLangSpecInfoLabel('L0000001703') }, // '수질오염물질'
      ];

      // 성상
      this.$comm.getComboItems('RSA_PROPERTIES', false).then(_result => {
        this.propertyItems = _result;
      });
      // 사업구분
      this.$comm.getComboItems('CHM_BIZ_CAT', false).then(_result => {
        this.bizCatItems = _result;
      });
      // 제품구분
      this.$comm.getComboItems('CHM_PROD_CAT', false).then(_result => {
        this.prodCatItems = _result;
      });
      // 용도
      this.$comm.getComboItems('CHM_USAGE', false).then(_result => {
        this.usageItems = _result;
      });
      // 성분확인방법
      this.$comm.getComboItems('CHM_INGREDIENT_MTD').then(_result => {
        this.cfmMtdItems = _result;
      });

      this.getList(); // 화학물질 상세 검색

      this.attach = () => import('@/pages/common/attachFile/multiFileUpload');
      this.setAttachFileGrps(); // 첨부파일 셋팅
    },
    tabClick(tab) {
      var nowDate = new Date();
      this.paneName = tab.paneName + nowDate.getMilliseconds();
    },
    closePopup(data) {
      this.$emit('closePopup', {});
    },
    setChangeChemProd() {
      this.changeChemProd = false;
    },
    setChangeImport() {
      this.changeImport = false;
    },
    getList() {
      if (this.popupParam.chemprodNo === 0) return;
      this.$http.url = this.$format(
        this.searchDetailUrl,
        this.popupParam.chemprodNo
      );
      this.$http.type = 'GET';
      this.$http.request(
        _result => {
          this.chemprod = this.$_.clone(_result.data);
          // 추가된 정보 임시 추가
          this.chemprod.chemProdNm = this.chemprod.chemProdNmKr;
          this.chemprod.prodClass = [];
          if (this.chemprod.makeYn === 'Y') {
            this.chemprod.prodClass.push('make');
          }
          if (this.chemprod.impYn === 'Y') this.chemprod.prodClass.push('imp');
          if (this.chemprod.buyYn === 'Y') this.chemprod.prodClass.push('buy');
          if (this.chemprod.salesYn === 'Y') {
            this.chemprod.prodClass.push('sales');
          }
          if (this.chemprod.usingYn === 'Y') {
            this.chemprod.prodClass.push('using');
          }
          if (this.chemprod.expYn === 'Y') this.chemprod.prodClass.push('exp');
          this.chemprod.pols = [];
          if (this.chemprod.airPolYn === 'Y') this.chemprod.pols.push('air');
          if (this.chemprod.wtrPolYn === 'Y') this.chemprod.pols.push('wtr');
        },
        _error => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    alertMessage() {
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // '안내',
        message: 'M0000000172', // '이미 등록되어 있는 화학물질입니다. [사업장·자재·납품업체·제조업체] 정보는 유일한 정보이어야 합니다.',
        type: 'warning',
      });
    },
    check(gubun) {
      this.$validator
        .validateAll()
        .then(result => {
          if (result) {
            this.$http.url = this.checkUrl;
            this.$http.type = 'GET';
            this.$http.param = {
              sapMatCd: this.chemprod.sapMatCd,
              vendorCd: this.chemprod.vendorCd,
              makerCd: this.chemprod.makerCd,
              plantCd: this.chemprod.plantCd,
              chemProdNo: gubun === 'insert' ? 0 : this.popupParam.chemprodNo,
            };
            this.$http.request(
              _result => {
                var gubunList = this.$_.map(
                  this.$_.clone(_result.data),
                  'gubun'
                );
                // 자재 + 납품업체 + 제조업체
                var cntList = this.$_.map(this.$_.clone(_result.data), 'cnt');
                var chemprodIndex = this.$_.indexOf(
                  gubunList,
                  'chem_prod_count'
                );
                if (cntList[chemprodIndex] > 0) {
                  this.alertMessage();
                  return;
                } else {
                  window.getApp.$emit('CONFIRM', {
                    title: 'L0000003321', // '확인',
                    message: 'M0000000011', // 저장하시겠습니까?
                    // TODO : 필요시 추가하세요.
                    type: 'info', // success / info / warning / error
                    // 확인 callback 함수
                    confirmCallback: () => {
                      this.chemprod.createUserId = this.$store.getters.token;
                      this.chemprod.updateUserId = this.$store.getters.token;
                      this.chemprod.makeYn =
                        this.$_.indexOf(this.chemprod.prodClass, 'make') !== -1
                          ? 'Y'
                          : 'N';
                      this.chemprod.impYn =
                        this.$_.indexOf(this.chemprod.prodClass, 'imp') !== -1
                          ? 'Y'
                          : 'N';
                      this.chemprod.buyYn =
                        this.$_.indexOf(this.chemprod.prodClass, 'buy') !== -1
                          ? 'Y'
                          : 'N';
                      this.chemprod.salesYn =
                        this.$_.indexOf(this.chemprod.prodClass, 'sales') !== -1
                          ? 'Y'
                          : 'N';
                      this.chemprod.usingYn =
                        this.$_.indexOf(this.chemprod.prodClass, 'using') !== -1
                          ? 'Y'
                          : 'N';
                      this.chemprod.expYn =
                        this.$_.indexOf(this.chemprod.prodClass, 'exp') !== -1
                          ? 'Y'
                          : 'N';

                      this.chemprod.airPolYn =
                        this.$_.indexOf(this.chemprod.pols, 'air') !== -1
                          ? 'Y'
                          : 'N';

                      this.chemprod.wtrPolYn =
                        this.$_.indexOf(this.chemprod.pols, 'wtr') !== -1
                          ? 'Y'
                          : 'N';

                      this.saveData.chemProdNo = this.chemprod.chemProdNo;
                      this.saveData.createUserId = this.chemprod.createUserId;
                      this.chemprod.chemprodChemRegul = this.$_.clone(
                        this.saveData
                      );
                      this.isSave = true;
                    },
                    // 취소 callback 함수
                    cancelCallback: () => {
                      this.isSave = false;
                    },
                  });
                }
              },
              _error => {
                window.getApp.$emit('APP_REQUEST_ERROR', _error);
              }
            );
          } else if (!result) {
            this.$popupRequired.check('chemprodDetail', this.$data, this.errors);
          }
        })
        .catch(() => {
          window.getApp.$emit(
            'APP_VALID_ERROR',
            'M0000000004', // '유효성 검사 중 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.'
          );
          this.isSave = false;
        });
    },
    /** 신규등록 하기전 UI단 유효성 검사 **/
    beforeSave() {
      var gubun = '';

      // 구성성분 대표값이 100% 필수
      var limitRepvalSum = 0;
      this.$_.forEach(this.saveData.chemprodChems, item => {
        limitRepvalSum +=
          item.limitRepval === '' ? 0 : Number(item.limitRepval);
      });
      if (limitRepvalSum === 99.99999999999999) {
        limitRepvalSum = 100;
      }
      // var total=0;
      // while(A.length){
      // total+= Math.floor(A.shift()*1000)/1000;
      // }
      if (this.saveData.chemprodChems.length > 0 && limitRepvalSum !== 100) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // '안내',
          message: 'M0000000173', // '성분 대표값의 합이 100% 이어야 합니다.',
          type: 'warning',
        });
        return;
      }

      // 신규등록
      if (this.popupParam.chemprodNo === 0) {
        gubun = 'insert';
        this.saveUrl = transactionConfig.chm.chemprod.insert.url;
        this.actionType = 'POST';
      }
      // 수정
      else {
        gubun = 'edit';
        this.saveUrl = transactionConfig.chm.chemprod.edit.url;
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
    /** button 관련 이벤트 **/
    /**
     * 대상부서 목록 조회 및 수정버튼 보여지도록 처리
     *  신규등록 버튼 callback
     * _result : backend에서 return하는 데이터
     */
    btnSaveClickedCallback(_result) {
      this.chemprod.chemProdNo = _result.data;
      this.popupParam.chemprodNo = _result.data;
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // '안내',
        message: 'M0000000006', // '저장되었습니다.',
        type: 'success', // success / info / warning / error
      });
      // this.getDetail();
      this.getList();
      this.updateMode = true;
      this.isSave = false;


      this.saveAttach();
    },
    /**
     * 수정 버튼 안보여지도록 처리 및 isSubmit false 처리
     *  버튼 http 통신 중 error 발생 callback
     * _result : error return하는 데이터
     */
    btnClickedErrorCallback(_result) {
      this.isSave = false;
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    // 추가 팝업
    btnPopupClickedCallback() {
      this.popupOptions.target = () =>
        import(`${'../../baseInfo/SAPMAT/SAPMAT.vue'}`);
      this.popupOptions.title = 'L0000003803'; // '자재';
      this.popupOptions.visible = true;
      this.popupOptions.width = '70%';
      this.popupOptions.top = '10px';
      this.popupOptions.param = {
        chemprodNo: this.popupParam.chemprodNo,
        mats: this.gridOptions.data,
      };

      this.popupOptions.closeCallback = this.closeRegulPopup;
    },
    // 규제법규 및 항목 추가 팝업 닫기
    closeRegulPopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      var mats = data.data;
      // 닫기가 아닌경우
      if (mats !== 'C') {
        this.gridOptions.data = [];
        this.$_.forEach(mats, item => {
          this.gridOptions.data.push({
            matCode: item.matCode,
            matName: item.matName,
            packUnit: item.packUnit,
            useYn: 'Y',
            chemprodNo: this.popupParam.chemprodNo,
            createUserId: this.$store.getters.token,
          });
        });
      }
    },
    /** end button 관련 이벤트 **/
    searchVendor(gubun) {
      this.popupOptions.target = () =>
        import(`${'../../vendor/baseInfo/vendorMaster.vue'}`);
      this.popupOptions.title = 'L0000001951'; // '업체';
      this.popupOptions.visible = true;
      this.popupOptions.param = {
        popupMode: true,
        vendorTypeCd: 'CVET3',
        gubun: gubun,
      };
      this.popupOptions.closeCallback = this.closeVendorPopup;
    },
    closeVendorPopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      if (data.data !== 'C') {
        if (data.gubun === 'V') {
          this.chemprod.vendorNm = data.data.vendorNm;
          this.chemprod.vendorCd = data.data.vendorCd;
          this.chemprod.originNm = data.data.originNmKr;
          this.chemprod.originCd = data.data.originCd;
        } else {
          this.chemprod.makerNm = data.data.vendorNm;
          this.chemprod.makerCd = data.data.vendorCd;
          this.chemprod.makerOriginNm = data.data.originNmKr;
          this.chemprod.makerOriginCd = data.data.originCd;
        }
      }
    },
    searchChmProd() {
      if (!this.editable) return;
      // this.popupOptions.target = () => import(`${'./chemprod.vue'}`);
      this.popupOptions.target = () =>
        import(`${'../../baseInfo/SAPMAT/SAPMAT.vue'}`);
      this.popupOptions.title = 'L0000003804'; // '자재 검색';
      this.popupOptions.visible = true;
      this.popupOptions.param = {
        popupMode: true,
      };
      this.popupOptions.width = '75%';
      this.popupOptions.top = '100px';
      this.popupOptions.closeCallback = this.closePopupSearchChemProd;
    },
    closePopupSearchChemProd(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      var _result = data.data;
      if (_result !== 'C' && _result !== '[]') {
        this.chemprod.sapMatCd = _result.mat_code;
        this.chemprod.chemProdNm =
          _result.mat_name +
          (!_result.mat_name_eng ? '' : ' / ' + _result.mat_name_eng);
        this.chemprod.chemProdNmKr = _result.mat_name;
        this.chemprod.chemProdNmEn = _result.mat_name_eng;
      }
    },
    openMatCheckRequestPopup() {
      /**
       * 검토요청이 완료된 건에 대해서 불러오기를 할 수 있다.
       * 검토요청이 완료된 건의 팝업을 띄우고, 해당 팝업에서 1개의 검토건을 선택할 수 있다.
       * 사업장 정보는 y-plant에 따라서 자동으로 설정되도록 한다.
       * 검토건을 불러오는 경우 이미, 해당 화학물질가 있는경우 이미 있는 자재라는 메시지를 보여주고 해당 자재 번호를 보여주어야 한다.
       * (새로운 화학물질를 등록할 수도, 이미 있는 화학물질를 변경할 수 있도 있는 구조임.)
       */
      this.popupOptions.target = () =>
        import(`${'../wholeProcess/matCheckRequest.vue'}`);
      this.popupOptions.title = 'L0000003805'; // '자재 검토요청 완료건 조회';
      this.popupOptions.visible = true;
      this.popupOptions.width = '70%';
      this.popupOptions.top = '10px';
      this.popupOptions.param = {
        chkRqstState: 'MCRS3',
        popupMode: true,
      };

      this.popupOptions.closeCallback = this.closeMatCheckRequestPopup;
    },
    // 규제법규 및 항목 추가 팝업 닫기
    closeMatCheckRequestPopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      if (data.data !== 'C' && data.data !== []) {
        this.callMatCheckRequestInfo(data.data);
      }
    },
    callMatCheckRequestInfo(data) {
      this.$http.url = this.$format(
        this.matCheckRqstDetailUrl,
        data.matChkRqstNo
      );
      this.$http.type = 'GET';
      this.$http.request(
        _result => {
          let _oldPlantCd = this.chemprod.plantCd;

          let item = _result.data;
          let isNew = false;
          if (item.existChemProdNo !== null && item.existChemProdNo > 0) {
            // 이미 등록된 화학물질가 있어 해당 화학물질정보 수정으로 처리됩니다.
            isNew = false;
            this.importTypeNm = 'L0000003806'; // '동일한 자재가 존재하여, 해당 자재의 수정으로 처리됩니다. 화학물질의 정보는 불러온 자재검토의 정보로 표시됩니다.';
            this.popupParam.chemprodNo = item.existChemProdNo;
            this.chemprod.chemProdNm = item.existChemProdNo;
          } else {
            isNew = true;
            this.importTypeNm = 'L0000003807'; // '등록되지 않은 화학물질로 자재검토의 정보를 불러왔습니다.';
            this.popupParam.chemprodNo = 0;
            this.popupParam.matCheckRqstNo = item.matCheckRqstNo;
            this.useYn = 'Y';
            this.chemprod.chemProdNo = 0;
          }

          this.chemprod.chemProdNm = item.chemProdNmKr;
          this.chemprod.chemProdNmKr = item.chemProdNmKr;
          this.chemprod.chemProdNmEn = item.chemProdNmEn;
          this.chemprod.sapMatCd = item.sapMatCd;
          this.chemprod.vendorNm = item.vendorNm;
          this.chemprod.vendorCd = item.vendorCd;
          this.chemprod.originNm = item.originNmKr; // 납품업체국가명
          this.chemprod.originCd = item.originCd; // 납품업체국가코드
          this.chemprod.makerNm = item.makecpNm; // 공급업체명
          this.chemprod.makerCd = item.makecpCd; // 공급업체코드
          this.chemprod.makerOriginNm = item.makeOriginNmKr;
          this.chemprod.makerOriginCd = item.makeoriginCd;
          this.chemprod.property = item.property;
          this.chemprod.mixYn = item.mixYn;
          this.chemprod.bizCatCd = item.bizCatCd;
          this.chemprod.prodCatCd = item.prodCatCd;
          this.chemprod.usageCd = item.usageCd;
          this.chemprod.specificGravity = item.specificGravity;
          this.chemprod.casNo = item.casNo;
          this.chemprod.usageEtc = item.usageEtc;
          this.chemprod.hsNum = item.hsNum;
          this.chemprod.stckArea = item.stckArea;
          this.chemprod.airPolYn = item.airPolYn;
          this.chemprod.wtrPolYn = item.wtrPolYn;
          this.chemprod.licensingYn = item.licensingYn;
          this.chemprod.dgrYn = item.dgrYn;
          this.chemprod.chemprodRegulItmNo = item.chemprodRegulItmNo;
          this.chemprod.cfmMtdCd = item.cfmMtdCd;
          this.chemprod.makeYn = item.makeYn;
          this.chemprod.impYn = item.impYn;
          this.chemprod.buyYn = item.buyYn;
          this.chemprod.salesYn = item.salesYn;
          this.chemprod.usingYn = item.usingYn;
          this.chemprod.expYn = item.expYn;

          // 추가된 정보 임시 추가
          if (this.chemprod.makeYn === 'Y') {
            this.chemprod.prodClass.push('make');
          }
          if (this.chemprod.impYn === 'Y') this.chemprod.prodClass.push('imp');
          if (this.chemprod.buyYn === 'Y') this.chemprod.prodClass.push('buy');
          if (this.chemprod.salesYn === 'Y') {
            this.chemprod.prodClass.push('sales');
          }
          if (this.chemprod.usingYn === 'Y') {
            this.chemprod.prodClass.push('using');
          }
          if (this.chemprod.expYn === 'Y') this.chemprod.prodClass.push('exp');
          this.chemprod.pols = [];
          if (this.chemprod.airPolYn === 'Y') this.chemprod.pols.push('air');
          if (this.chemprod.wtrPolYn === 'Y') this.chemprod.pols.push('wtr');

          // 구성성분*규제항목
          this.saveData.chemprodChems =
            item.matCheckRequestCompoRegul.matCheckRequestCompos;
          this.$_.forEach(this.saveData.chemprodChems, item => {
            item.useYn = 'Y'
          })
          this.saveData.chemprodRegulItms =
            item.matCheckRequestCompoRegul.matCheckRequestRegulItms;

          if (isNew) {
            this.chemprod.fugacity = '';
            this.chemprod.boilpoint = '';
            this.chemprod.meltingPnt = '';
            this.chemprod.moleWeight = '';
            this.chemprod.casNo = '';
            this.chemprod.remark = '';
            this.chemprod.explUpLimit = '';
            this.chemprod.explLowLimit = '';
            this.chemprod.leakThresh = '';
            this.chemprod.lc50 = '';
            this.chemprod.flashingPnt = '';
            this.chemprod.IgnitionPnt = '';
            this.chemprod.vaporPressure = '';
            this.chemprod.extraReactionYn = '';
            this.chemprod.corrosivenessYn = '';
            this.chemprod.dailyVol = '';
            this.chemprod.maxVol = '';
            this.changeImport = true;
          } else {
            // this.changeChemProd = true;
            // 가져온 정보로 바인딩해야 하므로
            this.saveData.chemProdNo = this.popupParam.chemprodNo;
            this.changeImport = true;
          }
        },
        _error => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    setAttachFileGrps() {
      let taskKey = this.popupParam.chemprodNo
        ? this.popupParam.chemprodNo.toString()
        : '';
      this.attachFileGrps = [
        {
          label: 'MSDS',
          uploadTempFiles: null,
          taskClassNm: 'CHEMPROD_MSDS',
          taskKey: taskKey,
          drag: this.editable,
          showFileSearch: false,
          editable: this.editable && !this.popupParam.popupMode,
          disabled: !this.editable && this.popupParam.popupMode,
          createUserId: this.$store.getters.token,
        },
      ];
    },
    changeUploadFiles(data) {
      var index = this.$_.findIndex(this.attachFileGrps, {
        taskClassNm: data.taskClassNm,
      });
      if (index > -1) {
        data.index = index;
        this.attachFileGrps[index].uploadTempFiles = data;
        let saveIndex = this.$_.findIndex(this.saveAttachFiles, {
          taskClassNm: data.taskClassNm,
        });
        if (saveIndex > -1) {
          this.saveAttachFiles[saveIndex] = this.$_.clone(
            this.attachFileGrps[index]
          );
        } else {
          this.saveAttachFiles.push(this.$_.clone(this.attachFileGrps[index]));
        }
      }
    },
    setTempDeleteFiles(data) {
      var pushData = {
        fileNo: data.data.fileNo,
      };
      this.tempDeleteFiles.push(pushData);
    },
    saveAttach() {
      // task_key 를 셋팅한다.
      this.$_.forEach(this.attachFileGrps, item => {
        item.taskKey = this.popupParam.chemprodNo;
      });

      if (this.tempDeleteFiles.length > 0) {
        this.$http.url = transactionConfig.attachFile.deleteMulti.url;
        this.$http.type = 'DELETE';
        this.$http.param = {
          data: Object.values(this.$_.clone(this.tempDeleteFiles)),
        };
        this.$http.request(
          _result => {
            this.tempDeleteFiles = [];
            // 저장할 데이터가 있는 경우
            if (this.saveAttachFiles.length > 0) {
              this.submitCheck = !this.submitCheck;
            }
            // 저장할 데이터가 없는 경우
            else this.closePopup();
          },
          _error => {
            window.getApp.$emit('APP_REQUEST_ERROR', _error);
          }
        );
      } else {
        // 저장할 데이터가 있는 경우
        if (this.saveAttachFiles.length > 0) {
          this.submitCheck = !this.submitCheck;
        }
        // 저장할 데이터가 없는 경우
        else this.closePopup();
      }
    },
    searchMatStrg() {
      this.popupOptions.target = () => import(`${'../mat/chmDgrAttAmt.vue'}`);
      this.popupOptions.title = 'L0000003808'; // '위험물 허가량';
      this.popupOptions.visible = true;
      this.popupOptions.param = {
        single: true,
      };
      this.popupOptions.closeCallback = this.closeChemPopup;
    },
    closeChemPopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;

      if (data !== 'CLOSE') {
        this.chemprod.chemprodRegulItmNo = data.chmDgrAttAmtNo;
        this.chemprod.chemprodRegulItmNm = data.dgrNm;
      }
    },
  },
};
</script>
