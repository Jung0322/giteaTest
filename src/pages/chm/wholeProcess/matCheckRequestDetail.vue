<!--
  목적 : 물질관리 > 전과정관리 > 물질검토 > 물질검토 상세
  Detail :  물질검토에 대한 상세정보를 보여준다.
  *
  신규등록인 경우 자재번호의 자재는 sap의 자재 선택가능.<style scoped>
  검토요청이 들어온 건에 대해서는 자재번호의 선택은 불가능. 
  </style>
  examples:
  *
  -->
<template>
  <b-container fluid>
    <b-row ref="editBox">
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- 자재검토 상세 -->
            <y-label
              label="L0000002323"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div slot="buttonGroup" class="float-right mb-1">
              <y-btn
                v-if="
                  editable &&
                  popupParam.matChkRqstNo &&
                  (this.popupParam.chkRqstState === 'MCRS0' ||
                    (this.popupParam.chkRqstState === 'MCRS2' &&
                      this.matCheckRequest.chkResultFinYn === 'Y' &&
                      this.matCheckRequest.chkResultEnvFinYn === 'Y'))
                "
                :action-url="saveUrl"
                :param="matCheckRequest"
                :is-submit="isAppr"
                :title="apprBtnTitle"
                color="black"
                action-type="PUT"
                beforeSubmit="beforeAppr"
                @beforeAppr="beforeAppr"
                @btnClicked="btnApprClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!-- 검토반려 -->
              <y-btn
                v-if="this.popupParam.chkRqstState === 'MCRS2' && editable"
                title="L0000000382"
                color="black"
                action-type="PUT"
                beforeSubmit="beforeReject"
                @beforeReject="beforeReject"
              />
              <!-- 저장 -->
              <y-btn
                v-if="this.popupParam.chkRqstState === 'MCRS0' && editable"
                :action-url="saveUrl"
                :param="matCheckRequest"
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
                v-if="
                  popupParam.matChkRqstNo &&
                  this.popupParam.chkRqstState === 'MCRS0' &&
                  editable
                "
                color="red"
                title="L0000001495"
                @btnClicked="btnDelete"
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
              <b-row>
                <b-col sm="8" md="8" lg="8" xl="8" class="col-xxl-8">
                  <!-- 검토요청자 -->
                  <y-text
                    :width="6"
                    :editable="editable"
                    :disabled="true"
                    ui="bootstrap"
                    label="L0000000387"
                    name="deptNm"
                    v-model="matCheckRequest.deptNm"
                  ></y-text>
                </b-col>
                <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
                  <y-text
                    :width="12"
                    :editable="editable"
                    :disabled="true"
                    ui="bootstrap"
                    name="chkRqsterNm"
                    v-model="matCheckRequest.chkRqsterNm"
                  ></y-text>
                </b-col>
              </b-row>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 검토요청일 -->
              <y-datepicker
                :width="8"
                :disabled="true"
                type="rqstDt"
                label="L0000000386"
                :default="matCheckRequest.rqstDt"
                v-model="matCheckRequest.rqstDt"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 대표사업장 -->
              <y-plant
                type="search"
                label="L0000000940"
                filter="chm"
                :editable="editable"
                :disabled="disabled"
                v-model="matCheckRequest.plantCd"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 자재번호 -->
              <y-text
                :width="8"
                :required="true"
                :editable="editable"
                :disabled="disabled"
                ui="bootstrap"
                label="L0000002329"
                name="sapMatCd"
                v-model="matCheckRequest.sapMatCd"
                :appendIcon="
                  disabled
                    ? null
                    : [{ icon: 'search', callbackName: 'searchChemProd' }]
                "
                @searchChemProd="searchChmProd()"
                v-validate="'required'"
                :state="validateState('sapMatCd')"
              ></y-text>
            </b-col>
            <!-- 2022-04-01 추가 -->
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <y-text
                :width="8"
                :editable="editable"
                :disabled="disabled"
                :maxlength="30"
                ui="bootstrap"
                label="L0000004599"
                name="msdsNum"
                v-model="matCheckRequest.msdsNum"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 비공개승인번호 -->
              <y-text
                :width="8"
                :editable="editable"
                :disabled="disabled"
                :maxlength="30"
                ui="bootstrap"
                label="L0000004600"
                name="secretNum"
                v-model="matCheckRequest.secretNum"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 비공개승인일 -->
              <y-datepicker
                :width="8"
                :editable="editable"
                :disabled="disabled"
                ui="bootstrap"
                label="L0000004601"
                name="secretApproval"
                v-model="matCheckRequest.secretApproval"
              ></y-datepicker>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 비공개만료일 -->
              <y-datepicker
                :width="8"
                :editable="editable"
                :disabled="disabled"
                ui="bootstrap"
                label="L0000004602"
                name="secretExpiration"
                v-model="matCheckRequest.secretExpiration"
              ></y-datepicker>
            </b-col>
            <!-- ㅡㅡㅡㅡㅡㅡㅡㅡ -->
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 화학자재명(국문) -->
              <y-text
                :width="8"
                :required="true"
                :editable="editable"
                :disabled="disabled"
                ui="bootstrap"
                label="L0000003318"
                name="chemProdNmKr"
                v-model="matCheckRequest.chemProdNmKr"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 화학자재명(영문) -->
              <y-text
                :width="8"
                :required="true"
                :editable="editable"
                :disabled="disabled"
                ui="bootstrap"
                label="L0000003319"
                name="chemProdNmEn"
                v-model="matCheckRequest.chemProdNmEn"
              ></y-text>
            </b-col>

            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-8">
              <b-row>
                <b-col sm="8" md="8" lg="8" xl="8" class="col-xxl-8">
                  <!-- 납품업체/국가 -->
                  <y-text
                    :width="9"
                    :required="true"
                    :editable="editable"
                    :disabled="true"
                    ui="bootstrap"
                    label="L0000000805"
                    name="vendorNm"
                    v-model="matCheckRequest.vendorNm"
                    :appendIcon="
                      disabled
                        ? null
                        : [{ icon: 'search', callbackName: 'searchVendor' }]
                    "
                    @searchVendor="searchVendor('V')"
                    v-validate="'required'"
                    :state="validateState('vendorNm')"
                  ></y-text>
                </b-col>
                <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
                  <y-text
                    :width="12"
                    :required="true"
                    :editable="editable"
                    :disabled="true"
                    ui="bootstrap"
                    name="originNmKr"
                    v-model="matCheckRequest.originNmKr"
                  ></y-text>
                </b-col>
              </b-row>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-8">
              <b-row>
                <b-col sm="8" md="8" lg="8" xl="8" class="col-xxl-8">
                  <!-- 제조업체/국가 -->
                  <y-text
                    :width="9"
                    :required="true"
                    :editable="editable"
                    :disabled="true"
                    ui="bootstrap"
                    label="L0000002629"
                    name="makecpNm"
                    v-model="matCheckRequest.makecpNm"
                    :appendIcon="
                      disabled
                        ? null
                        : [{ icon: 'search', callbackName: 'searchVendor' }]
                    "
                    @searchVendor="searchVendor('M')"
                    v-validate="'required'"
                    :state="validateState('makecpNm')"
                  ></y-text>
                </b-col>
                <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
                  <y-text
                    :width="12"
                    :required="true"
                    :editable="editable"
                    :disabled="true"
                    ui="bootstrap"
                    name="makeOriginNmKr"
                    v-model="matCheckRequest.makeOriginNmKr"
                  ></y-text>
                </b-col>
              </b-row>
            </b-col>

            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 요청구분 -->
              <y-radio
                :width="8"
                :editable="editable"
                :required="true"
                :disabled="disabled"
                :comboItems="rqstTypeItems"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                name="rqstType"
                label="L0000002050"
                v-model="matCheckRequest.rqstType"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 물질구성 -->
              <y-switch
                :width="8"
                :editable="editable"
                :disabled="disabled"
                true-value="Y"
                false-value="N"
                ui="bootstrap"
                label="L0000001053"
                name="mixYn"
                selectText="L0000003801"
                unselectText="L0000003802"
                v-model="matCheckRequest.mixYn"
              />
              <!-- L0000003801: 복합 -->
              <!-- L0000003802: 단일 -->
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 성상 -->
              <y-select
                :width="8"
                :editable="editable"
                :comboItems="propertyItems"
                :required="true"
                :disabled="disabled"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                type="search"
                label="L0000001635"
                name="property"
                v-model="matCheckRequest.property"
                v-validate="'required'"
                :state="validateState('property')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 사업구분 -->
              <y-select
                :width="8"
                :editable="editable"
                :comboItems="bizCatItems"
                :required="true"
                :disabled="disabled"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                type="search"
                label="L0000001413"
                name="bizCatCd"
                v-model="matCheckRequest.bizCatCd"
                v-validate="'required'"
                :state="validateState('bizCatCd')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 용도 -->
              <y-select
                :width="8"
                :editable="editable"
                :comboItems="usageItems"
                :required="true"
                :disabled="disabled"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                type="search"
                label="L0000002059"
                name="usageCd"
                v-model="matCheckRequest.usageCd"
                v-validate="'required'"
                :state="validateState('usageCd')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 제품구분 -->
              <y-select
                :width="8"
                :editable="editable"
                :comboItems="prodCatItems"
                :required="true"
                :disabled="disabled"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                type="search"
                label="L0000002637"
                name="prodCatCd"
                v-model="matCheckRequest.prodCatCd"
                v-validate="'required'"
                :state="validateState('prodCatCd')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 용도(기타) -->
              <y-text
                :width="8"
                :editable="editable"
                :disabled="disabled"
                :maxlength="60"
                ui="bootstrap"
                label="L0000002060"
                name="usageEtc"
                v-model="matCheckRequest.usageEtc"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 비중 -->
              <y-text
                :width="8"
                :editable="editable"
                :maxlength="3"
                :disabled="disabled"
                ui="bootstrap"
                label="L0000001374"
                name="specificGravity"
                v-model="matCheckRequest.specificGravity"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- HS번호 -->
              <y-text
                :width="8"
                :editable="editable"
                :disabled="disabled"
                :maxlength="30"
                ui="bootstrap"
                label="L0000000118"
                name="hsNum"
                v-model="matCheckRequest.hsNum"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 연간예정량 -->
              <y-number
                :width="8"
                :editable="editable"
                :disabled="disabled"
                :maxlength="10"
                :hasSeperator="false"
                :pointNumber="2"
                ui="bootstrap"
                label="L0000001981"
                name="expectAmt"
                v-model="matCheckRequest.expectAmt"
              ></y-number>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 보관장소 -->
              <y-text
                :width="8"
                :editable="editable"
                :disabled="disabled"
                :maxlength="100"
                ui="bootstrap"
                label="L0000001248"
                name="stckArea"
                v-model="matCheckRequest.stckArea"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 대기/수질여부 -->
              <y-checkbox
                :width="8"
                :editable="editable"
                :disabled="disabled"
                :comboItems="polItems"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                name="pols"
                label="L0000000909"
                v-model="matCheckRequest.pols"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 인허가대상물질 -->
              <y-switch
                :width="8"
                :editable="editable"
                :disabled="disabled"
                true-value="Y"
                false-value="N"
                ui="bootstrap"
                label="L0000002249"
                name="licensingYn"
                selectText="L0000003213"
                unselectText="L0000001065"
                v-model="matCheckRequest.licensingYn"
              />
              <!-- L0000003213: 해당 -->
              <!-- L0000001065: 미해당 -->
            </b-col>
            <!-- <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <y-switch
                :width="8"
                :editable="editable"
                :disabled="disabled"
                true-value="Y"
                false-value="N"
                ui="bootstrap"
                label="위험물질"
                name="dgrYn"
                selectText="해당"
                unselectText="미해당"
                v-model="matCheckRequest.dgrYn"
              />
            </b-col>-->
            <!-- <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <y-select
                :width="8"
                :editable="editable"
                :disabled="disabled"
                :comboItems="chemprodRegulItems"
                itemText="regulItmNm"
                itemValue="regulItmNo"
                ui="bootstrap"
                label="위험물질"
                name="chemprodRegulItmNo"
                v-model="matCheckRequest.chemprodRegulItmNo"
              ></y-select>
            </b-col>-->
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 위험물질 -->
              <y-text
                :width="8"
                :disabled="true"
                ui="bootstrap"
                label="L0000002143"
                name="chemprodRegulItmNm"
                v-model="matCheckRequest.chemprodRegulItmNm"
                :appendIcon="[
                  { icon: 'search', callbackName: 'searchMatStrg' },
                ]"
                @searchMatStrg="searchMatStrg"
              ></y-text>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-8">
              <!-- 제품분류 -->
              <y-checkbox
                :width="10"
                :editable="editable"
                :disabled="disabled"
                :comboItems="prodClassItems"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                name="prodClass"
                label="L0000002640"
                v-model="matCheckRequest.prodClass"
              />
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-8">
              <!-- 검토요청사항 -->
              <y-textarea
                :width="10"
                :editable="editable"
                :disabled="disabled"
                :maxlength="300"
                ui="bootstrap"
                label="L0000000385"
                name="chkRqstDesc"
                v-model="matCheckRequest.chkRqstDesc"
              ></y-textarea>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-8">
              <!-- 비고 -->
              <y-textarea
                :width="10"
                :editable="editable"
                :disabled="disabled"
                :maxlength="300"
                ui="bootstrap"
                label="L0000001360"
                name="etcDesc"
                v-model="matCheckRequest.etcDesc"
              ></y-textarea>
            </b-col>
            <!-- 첨부파일 -->
            <el-divider content-position="left">{{
              $comm.getLangSpecInfoLabel('L0000002843')
            }}</el-divider>
            <component
              :is="attach"
              v-if="attach"
              :submitCheck="submitCheck"
              :attachFileGrps="attachFileGrps"
              :saveAttachFiles="saveAttachFiles"
              @changeUploadFiles="changeUploadFiles"
              @setUploadedList="setUploadedList"
            />
          </b-row>
        </b-card>
      </b-col>
    </b-row>
    <el-tabs
      type="border-card"
      v-model="tabIndex"
      @tab-click="tabClick"
      class="mt-3"
    >
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
        <keep-alive>
          <component
            :is="component"
            v-if="component"
            :paneName="paneName"
            :matChkRqstNo="popupParam.matChkRqstNo"
            :chemProdNo="matCheckRequest.chemProdNo"
            :changeChemProd="changeChemProd"
            :saveData="saveData"
            :matCheckRequest="matCheckRequest"
            :chkRqstState="popupParam.chkRqstState"
            :chkFlag="popupParam.chkFlag"
            :disabled="disabled"
            @setChangeChemProd="setChangeChemProd"
            @closePopup="closePopup2"
          />
        </keep-alive>
      </el-tab-pane>
    </el-tabs>
    <y-dialog :param="popupOptions"></y-dialog>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
export default {
  /* attributes: name, components, props, data */
  name: 'mat-check-request-detail',
  components: {},
  props: {
    popupParam: {
      type: Object,
      default: {
        matChkRqstNo: 0,
        chkRqstState: 'MCRS0',
        chkFlag: null,
      },
    },
  },
  // TODO: 화살표 함수(=>)는 data에 사용하지 말 것
  //    data: () => { return { a: this.myProp }}) 화살표 함수가 부모 컨텍스트를 바인딩하기 때문에 this는 예상과 달리 Vue 인스턴스가 아니며, this.myProp는 정의되지 않습니다.
  //    참고url: https://kr.vuejs.org/v2/api/index.html#data
  data() {
    return {
      matCheckRequest: {
        matChkRqstNo: 0,
        chkRqstState: '',
        chkRqsterId: '',
        chkRqsterNm: '',
        deptNm: '',
        rqstDt: '',
        sapMatCd: '', // SAP 자재코드
        sapIfCd: '', // 구매검토요청시 I/F키코드
        chemProdNo: 0, // 안씀 (sapMatCd로 변경)
        chemProdNmKr: '',
        chemProdNmEn: '',
        originNmKr: '',
        originCd: '',
        vendorNm: '',
        vendorCd: '',
        makeOriginNmKr: '',
        makeoriginCd: '',
        makecpNm: '',
        makecpCd: '',
        rqstType: null,
        property: null,
        mixYn: 'N',
        bizCatCd: null,
        prodCatCd: null,
        usageCd: null,
        usageEtc: '',
        specificGravity: '',
        hsNum: '',
        expectAmt: 0,
        chkRqstDesc: '',
        etcDesc: '',
        makeYn: '',
        impYn: '',
        buyYn: '',
        salesYn: '',
        usingYn: '',
        expYn: '',
        stckArea: '', // 보관장소
        airPolYn: '', // 대기오염물질
        wtrPolYn: '', // 수질오염물질
        licensingYn: '', // 인허가대상물질여부
        dgrYn: '', // 위험물질여무
        chemprodRegulItmNo: 0,
        chemprodRegulItmNm: '',
        chkResult: '', // 안전/보건 검토결과
        chkResultYn: '', // 안전/보건 검토결과 적합여부
        chkResultFinYn: '', // 안전/보건 검토결과 완료여부
        chkResultFinUserId: '', // 안전/보건 검토결과 완료처리자 아이디
        chkResultFinUserNm: '', // 안전/보건 검토결과 완료처리자
        chkResultFinDt: '', // 안전/보건 검토결과 완료처리일
        chkResultEnv: '', // 환경 검토결과
        chkResultEnvYn: '', // 환경 검토결과 적합여부
        chkResultEnvFinYn: '', // 환경 검토결과 완료여부
        chkResultEnvFinUserId: '', // 환경 검토결과 완료처리자 아이디
        chkResultEnvFinUserNm: '', // 환경 검토결과 완료처리자
        chkResultEnvFinDt: '', // 환경 검토결과 완료처리일
        chkResultHea: '', // 안씀.
        prodClass: [], // 제품분류
        pols: [], // 대기/수질여부
        matCheckRequestCompoRegul: null,
        plantCd: '',
        chkDt: null,
        reviewerId: '',

        // 2022-04-01 추가
        msdsNum: '',
        secretNum: '',
        secretApproval: '',
        secretExpiration: '',
        // ㅡㅡㅡㅡㅡㅡㅡㅡ
      },
      saveData: {
        matChkRqstNo: 0,
        matCheckRequestCompos: [],
        regulItmMatVals: [],
        createUserId: '',
        updateUserId: '',
      },
      changeChemProd: false,
      editable: false,
      disabled: false,
      isSave: false,
      isAppr: false,
      isReject: false,
      propertyItems: [],
      bizCatItems: [],
      prodClassItems: [],
      polItems: [], // 대기/수질여부
      usageItems: [],
      prodCatItems: [],
      rqstTypeItems: [],
      chemprodRegulItems: [],
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '80%',
        top: '50px',
        param: {},
        closeCallback: null,
      },
      apprBtnTitle: '', // '자재검토요청',
      selectedValue: [],
      searchDetailUrl: '',
      searchRegulUrl: '',
      saveUrl: '',
      deleteUrl: '',
      checkUrl: '',
      actionType: 'POST',
      // TODO : 현재까지 파악된 바로는 tab은 같은 폴더 또는 하위 폴더의 컴포넌트만 접근이 가능한 것으로 파악됨
      //                즉, 반드시 메인페이지 역할을 하는 vue와 동일 폴더나 하위 폴더에 tabItem 역할을 하는 vue 파일을 위치 시킬 것
      tabItems: [
        // { title: '첨부파일', url: './matCheckRequestFileUpload' },
        { title: 'L0000000697', url: './tab/matCheckRequestRegulInfoNew' }, // '구성성분/규제 정보',
      ],
      attach: null,
      submitCheck: false,
      saveAttachFiles: [],
      attachFileGrps: [],
      uploadedMsdsList: [], // 업로드된 msds
      uploadedIngredientList: [], // 업로드된 성분내역서
      component: null,
      tabIndex: 0,
      paneName: '',
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
    this.init();
    this.loadComponent();
  },
  beforeDestroy() {},
  //* methods */
  methods: {
    init() {
      // Url Setting
      this.searchDetailUrl = selectConfig.chm.matCheckRequest.get.url;
      this.checkUrl = selectConfig.chm.matCheckRequest.check.url;
      this.saveUrl = transactionConfig.chm.matCheckRequest.insert.url;
      this.deleteUrl = transactionConfig.chm.matCheckRequest.delete.url;
      this.searchRegulUrl = selectConfig.chm.chemicalRegulItem.list.url;

      this.prodClassItems = [
        {
          code: 'make',
          codeNm: this.$comm.getLangSpecInfoLabel('L0000002624'),
        }, // '제조'
        { code: 'imp', codeNm: this.$comm.getLangSpecInfoLabel('L0000001695') }, // '수입'
        { code: 'buy', codeNm: this.$comm.getLangSpecInfoLabel('L0000000684') }, // '구매'
        {
          code: 'using',
          codeNm: this.$comm.getLangSpecInfoLabel('L0000001440'),
        }, // '사용'
        {
          code: 'sales',
          codeNm: this.$comm.getLangSpecInfoLabel('L0000001705'),
        }, // '수출'
        { code: 'exp', codeNm: this.$comm.getLangSpecInfoLabel('L0000003034') }, // '판매'
      ];

      this.polItems = [
        { code: 'air', codeNm: this.$comm.getLangSpecInfoLabel('L0000000910') }, // '대기오염물질'
        { code: 'wtr', codeNm: this.$comm.getLangSpecInfoLabel('L0000001703') }, // '수질오염물질'
      ];

      if (this.popupParam.chkRqstState !== 'MCRS0') {
        this.tabItems.splice(2, 0, {
          title: 'L0000000380', // '검토결과',
          url: './matCheckRequestResult',
        });

        this.tabIndex = this.popupParam.chkFlag ? '1' : '0';
      }
      if (
        this.popupParam.chkRqstState === 'MCRS2' ||
        this.popupParam.chkRqstState === 'MCRS3'
      ) {
        this.disabled = true;
      }

      if (this.popupParam.chkRqstState === 'MCRS2') {
        this.apprBtnTitle = this.$comm.getLangSpecInfoLabel('L0000000383'); // '검토완료';
      } else {
        this.apprBtnTitle = this.$comm.getLangSpecInfoLabel('L0000003812'); // '자재검토요청';
      }

      this.getChemprodRegulItems(); // 위험물질

      // 성상
      this.$comm.getComboItems('RSA_PROPERTIES', false).then((_result) => {
        this.propertyItems = _result;
      });
      // 사업구분
      this.$comm.getComboItems('CHM_BIZ_CAT', false).then((_result) => {
        this.bizCatItems = _result;
      });
      // 제품구분
      this.$comm.getComboItems('CHM_PROD_CAT', false).then((_result) => {
        this.prodCatItems = _result;
      });
      // 용도
      this.$comm.getComboItems('CHM_USAGE', false).then((_result) => {
        this.usageItems = _result;
      });
      // 요청구분
      this.$comm.getComboItems('CHM_MCR_CLS').then((_result) => {
        this.rqstTypeItems = _result;
      });

      this.attach = () => import('@/pages/common/attachFile/multiFileUpload');

      this.getDetail(); // 물질검토 상세 검색
    },
    getChemprodRegulItems() {
      this.$http.url = this.searchRegulUrl;
      this.$http.type = 'GET';
      this.$http.param = {
        regulLawCd: 'RL004',
        useYn: 'Y',
      };
      this.$http.request(
        (_result) => {
          _result.data.splice(0, 0, {
            regulItmNo: 0,
            regulItmNm: this.$comm.getLangSpecInfoLabel('L0000003394'), // 선택하세요
          });
          this.chemprodRegulItems = _result.data;
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    /** 물질검토 상세 검색 **/
    getDetail() {
      if (!this.popupParam.matChkRqstNo || this.popupParam.matChkRqstNo === 0) {
        this.matCheckRequest.chkRqsterId = this.$store.getters.token;
        this.matCheckRequest.chkRqsterNm = this.$store.getters.name;
        this.matCheckRequest.deptNm = this.$store.getters.deptNm;
        this.matCheckRequest.rqstDt = this.$comm.getToday();
        this.setAttachFileGrps(); // 첨부파일 셋팅
      } else {
        this.$http.url = this.$format(
          this.searchDetailUrl,
          this.popupParam.matChkRqstNo
        );
        this.$http.type = 'GET';
        this.$http.request(
          (_result) => {
            this.matCheckRequest = this.$_.clone(_result.data);

            this.matCheckRequest.prodClass = [];

            if (this.matCheckRequest.makeYn === 'Y') {
              this.matCheckRequest.prodClass.push('make');
            }
            if (this.matCheckRequest.impYn === 'Y') {
              this.matCheckRequest.prodClass.push('imp');
            }
            if (this.matCheckRequest.buyYn === 'Y') {
              this.matCheckRequest.prodClass.push('buy');
            }
            if (this.matCheckRequest.salesYn === 'Y') {
              this.matCheckRequest.prodClass.push('sales');
            }
            if (this.matCheckRequest.usingYn === 'Y') {
              this.matCheckRequest.prodClass.push('using');
            }
            if (this.matCheckRequest.expYn === 'Y') {
              this.matCheckRequest.prodClass.push('exp');
            }
            this.matCheckRequest.pols = [];
            if (this.matCheckRequest.airPolYn === 'Y') {
              this.matCheckRequest.pols.push('air');
            }
            if (this.matCheckRequest.wtrPolYn === 'Y') {
              this.matCheckRequest.pols.push('wtr');
            }
            // 요청상태인 경우 검토자
            if (
              this.matCheckRequest.chkRqstState === 'MCRS0' &&
              this.matCheckRequest.sapIfCd !== ''
            ) {
              this.matCheckRequest.chkRqsterId =
                this.matCheckRequest.chkRqsterId === null
                  ? this.$store.getters.token
                  : this.matCheckRequest.chkRqsterId;
              this.matCheckRequest.chkRqsterNm =
                this.matCheckRequest.chkRqsterNm === null
                  ? this.$store.getters.name
                  : this.matCheckRequest.chkRqsterNm;
              this.matCheckRequest.deptNm =
                this.matCheckRequest.deptNm === null
                  ? this.$store.getters.deptNm
                  : this.matCheckRequest.deptNm;
            }

            this.setAttachFileGrps(); // 첨부파일 셋팅
          },
          (_error) => {
            window.getApp.$emit('APP_REQUEST_ERROR', _error);
          }
        );
      }
    },
    setAttachFileGrps() {
      let taskKey = this.popupParam.matChkRqstNo
        ? this.popupParam.matChkRqstNo.toString()
        : '';
      this.attachFileGrps = [
        {
          label: 'L0000000130', //  <span class="text-danger">MSDS(필수)</span>
          uploadTempFiles: null,
          taskClassNm: 'MAT_MSDS',
          taskKey: taskKey,
          drag: false,
          showFileSearch: !this.disabled,
          editable: this.editable && !this.disabled,
          disabled: this.disabled,
          createUserId: this.$store.getters.token,
        },
        {
          label: 'L0000003293', // '화학물질 성분내역서',
          uploadTempFiles: null,
          taskClassNm: 'CHEM_INGREDIENT_STATEMENT',
          taskKey: taskKey,
          drag: false,
          showFileSearch: !this.disabled,
          editable: this.editable && !this.disabled,
          disabled: this.disabled,
          createUserId: this.$store.getters.token,
        },
        {
          label: 'L0000003294', // '화학물질 확인내역서',
          uploadTempFiles: null,
          taskClassNm: 'CHEM_CONFIRMATION_STATEMENT',
          taskKey: taskKey,
          drag: false,
          showFileSearch: !this.disabled,
          editable: this.editable && !this.disabled,
          disabled: this.disabled,
          createUserId: this.$store.getters.token,
        },
        {
          label: 'L0000001636', // '성적서',
          uploadTempFiles: null,
          taskClassNm: 'MAT_REPORTS',
          taskKey: taskKey,
          drag: false,
          showFileSearch: !this.disabled,
          editable: this.editable && !this.disabled,
          disabled: this.disabled,
          createUserId: this.$store.getters.token,
        },
        {
          label: 'L0000000794', // '기타',
          uploadTempFiles: null,
          taskClassNm: 'MAT_ETC',
          taskKey: taskKey,
          drag: false,
          showFileSearch: !this.disabled,
          editable: this.editable && !this.disabled,
          disabled: this.disabled,
          createUserId: this.$store.getters.token,
        },
      ];
    },
    alertMessage() {
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // '안내',
        message: 'M0000000101', // '이미 같은 이름의 화학물질이 있습니다.',
        type: 'warning',
      });
    },
    check(gubun) {
      this.$validator
        .validateAll()
        .then((result) => {
          if (result) {
            window.getApp.$emit('CONFIRM', {
              title: 'L0000003321', // '확인',
              message:
                gubun === 'appr'
                  ? this.apprBtnTitle +
                    this.$comm.getLangSpecInfoMessage('M0000000097') // '하시겠습니까?'
                  : 'M0000000011', // 저장하시겠습니까?
              // TODO : 필요시 추가하세요.
              type: 'info', // success / info / warning / error
              // 확인 callback 함수
              confirmCallback: () => {
                this.matCheckRequest.createUserId = this.$store.getters.token;
                this.matCheckRequest.updateUserId = this.$store.getters.token;
                this.matCheckRequest.makeYn =
                  this.$_.indexOf(this.matCheckRequest.prodClass, 'make') !== -1
                    ? 'Y'
                    : 'N';
                this.matCheckRequest.impYn =
                  this.$_.indexOf(this.matCheckRequest.prodClass, 'imp') !== -1
                    ? 'Y'
                    : 'N';
                this.matCheckRequest.buyYn =
                  this.$_.indexOf(this.matCheckRequest.prodClass, 'buy') !== -1
                    ? 'Y'
                    : 'N';
                this.matCheckRequest.salesYn =
                  this.$_.indexOf(this.matCheckRequest.prodClass, 'sales') !==
                  -1
                    ? 'Y'
                    : 'N';
                this.matCheckRequest.usingYn =
                  this.$_.indexOf(this.matCheckRequest.prodClass, 'using') !==
                  -1
                    ? 'Y'
                    : 'N';
                this.matCheckRequest.expYn =
                  this.$_.indexOf(this.matCheckRequest.prodClass, 'exp') !== -1
                    ? 'Y'
                    : 'N';

                this.matCheckRequest.airPolYn =
                  this.$_.indexOf(this.matCheckRequest.pols, 'air') !== -1
                    ? 'Y'
                    : 'N';

                this.matCheckRequest.wtrPolYn =
                  this.$_.indexOf(this.matCheckRequest.pols, 'wtr') !== -1
                    ? 'Y'
                    : 'N';

                this.saveData.matChkRqstNo = this.matCheckRequest.matChkRqstNo;
                this.saveData.createUserId = this.matCheckRequest.createUserId;
                this.matCheckRequest.matCheckRequestCompoRegul = this.$_.clone(
                  this.saveData
                );
                if (gubun === 'appr') {
                  if (this.popupParam.chkRqstState === 'MCRS0') {
                    this.matCheckRequest.chkRqstState = 'MCRS2';
                  } else if (this.popupParam.chkRqstState === 'MCRS2') {
                    this.matCheckRequest.chkRqstState = 'MCRS3';
                    this.matCheckRequest.chkDt = this.$comm.getToday();
                    this.matCheckRequest.reviewerId = this.$store.getters.token;
                  }

                  this.isAppr = true;
                } else {
                  this.matCheckRequest.chkRqstState =
                    this.popupParam.chkRqstState;
                  this.isSave = true;
                }
              },
              // 취소 callback 함수
              cancelCallback: () => {
                this.isSave = false;
                this.isAppr = false;
              },
            });
          } else if (!result) {
            this.$popupRequired.check(
              'matCheckRequestDetail',
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
          this.isSave = false;
          this.isAppr = false;
        });
    },
    /** 신규등록 하기전 UI단 유효성 검사 **/
    beforeSave() {
      var gubun = '';
      // 신규등록
      if (this.popupParam.matChkRqstNo === 0) {
        gubun = 'insert';
        this.saveUrl = transactionConfig.chm.matCheckRequest.insert.url;
        this.actionType = 'POST';
      }
      // 수정
      else {
        gubun = 'edit';
        this.saveUrl = transactionConfig.chm.matCheckRequest.edit.url;
        this.actionType = 'PUT';
      }

      let substituteYN = false;
      this.$_.forEach(this.saveData.matCheckRequestCompos, (item) => {
        if (item.secretWhether === 'Y') {
          if (!item.substitute) {
            substituteYN = true;
          }
        }
      });
      if (substituteYN) {
        this.$comm.alertWarning(
          'L0000005474' // 영업비밀여부가 체크되어있으면 대체물질명을 입력해주세요
        );
        return;
      }

      this.check(gubun);
      // MSDS 첨부 필수
      var itm = null;
      var isMsdsFind = false;
      isMsdsFind = this.uploadedMsdsList.length > 0 ? true : false;
      this.$_.forEach(this.saveAttachFiles, (item) => {
        if (item.taskClassNm === 'MAT_MSDS') {
          isMsdsFind = true;
        }
      });

      if (!isMsdsFind) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // '안내',
          message: 'M0000000197', // 'MSDS 파일을 첨부해주세요.',
          type: 'warning',
        });
        return;
      }

      // 검토할 구성성분이 없을 경우
      if (
        !this.saveData.matCheckRequestCompos ||
        !this.saveData.matCheckRequestCompos.length
      ) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // '안내',
          message: 'M0000001001', // '검토할 구성성분이 없습니다. 구성성분을 추가하신 후 검토요청하시기 바랍니다.',
          type: 'warning',
        });
        return;
      }

      // 구성성분 대표값이 100%가 되지 않은 경우 성분내역서 첨부 필수
      var limitRepvalSum = 0;
      var isIngredientFind = false;

      this.$_.forEach(this.saveData.matCheckRequestCompos, (item) => {
        limitRepvalSum +=
          item.limitRepval === '' ? 0 : Number(item.limitRepval, 10);
      });
      if (limitRepvalSum === 99.99999999999999) {
        limitRepvalSum = 100;
      }
      if (
        this.saveData.matCheckRequestCompos.length > 0 &&
        limitRepvalSum !== 100
      ) {
        isIngredientFind =
          this.uploadedIngredientList.length > 0 ? true : false;
        this.$_.forEach(this.saveAttachFiles, (item) => {
          if (item.taskClassNm === 'CHEM_INGREDIENT_STATEMENT') {
            isIngredientFind = true;
          }
        });
        if (!isIngredientFind) {
          window.getApp.$emit('ALERT', {
            title: 'L0000003395', // '안내',
            message: 'M0000000198', // '성분 대표값의 합이 100%가 아닌 경우, 성분내역서를 첨부하셔야 합니다.',
            type: 'warning',
          });
          return;
        }
      }
    },
    beforeAppr() {
      this.check('appr');
      this.saveUrl = transactionConfig.chm.matCheckRequest.edit.url;

      // MSDS 첨부 필수
      var itm = null;
      var isMsdsFind = false;
      isMsdsFind = this.uploadedMsdsList.length > 0 ? true : false;
      this.$_.forEach(this.saveAttachFiles, (item) => {
        if (item.taskClassNm === 'MAT_MSDS') {
          isMsdsFind = true;
        }
      });

      if (!isMsdsFind) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // '안내',
          message: 'M0000000197', // 'MSDS 파일을 첨부해주세요.',
          type: 'warning',
        });
        return;
      }

      // 검토할 구성성분이 없을 경우
      if (
        !this.saveData.matCheckRequestCompos ||
        !this.saveData.matCheckRequestCompos.length
      ) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // '안내',
          message: 'M0000001001', // '검토할 구성성분이 없습니다. 구성성분을 추가하신 후 검토요청하시기 바랍니다.',
          type: 'warning',
        });
        return;
      }

      // 구성성분 대표값이 100%가 되지 않은 경우 성분내역서 첨부 필수
      var limitRepvalSum = 0;
      var isIngredientFind = false;

      this.$_.forEach(this.saveData.matCheckRequestCompos, (item) => {
        limitRepvalSum +=
          item.limitRepval === '' ? 0 : Number(item.limitRepval, 10);
      });
      if (limitRepvalSum === 99.99999999999999) {
        limitRepvalSum = 100;
      }
      if (
        this.saveData.matCheckRequestCompos.length > 0 &&
        limitRepvalSum !== 100
      ) {
        isIngredientFind =
          this.uploadedIngredientList.length > 0 ? true : false;
        this.$_.forEach(this.saveAttachFiles, (item) => {
          if (item.taskClassNm === 'CHEM_INGREDIENT_STATEMENT') {
            isIngredientFind = true;
          }
        });
        if (!isIngredientFind) {
          window.getApp.$emit('ALERT', {
            title: 'L0000003395', // '안내',
            message: 'M0000000198', // '성분 대표값의 합이 100%가 아닌 경우, 성분내역서를 첨부하셔야 합니다.',
            type: 'warning',
          });
          return;
        }
      }
    },
    beforeReject() {
      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321', // '확인',
        message: 'M0000000199', // '검토반려시 검토한 내용이 모두 초기화 되고, 검토요청 상태로 변경됩니다. 검토반려 하시겠습니까?',
        type: 'info',
        confirmCallback: () => {
          this.$http.url = transactionConfig.chm.matCheckRequest.reject.url;
          this.$http.type = 'PUT';
          this.$http.param = this.matCheckRequest;
          this.$http.request(
            (_result) => {
              this.closePopup();
            },
            (_error) => {
              window.getApp.$emit('APP_REQUEST_ERROR', _error);
            }
          );
        },
      });
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
    btnSaveClickedCallback(_result) {
      this.popupParam.matChkRqstNo = _result.data.matChkRqstNo;
      this.matCheckRequest.matChkRqstNo = _result.data.matChkRqstNo;
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // '안내',
        message: 'M0000000006', // '저장되었습니다.',
        type: 'success', // success / info / warning / error
      });
      this.isSave = false;

      this.saveAttach();
    },
    btnApprClickedCallback(_result) {
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // '안내',
        message:
          this.apprBtnTitle + this.$comm.getLangSpecInfoMessage('M0000000200'), // '되었습니다.',
        type: 'success', // success / info / warning / error
      });

      // 검토요청 후 버튼 title 변경
      this.apprBtnTitle = this.$comm.getLangSpecInfoLabel('L0000000383'); // '검토완료';
      this.popupParam.chkRqstState = _result.data.chkRqstState;
      this.matCheckRequest.chkRqstState = _result.data.chkRqstState;
      this.disabled = true;
      this.isAppr = false;

      this.saveAttach();
      this.setAttachFileGrps(); // 첨부파일 셋팅
      this.tabItems.splice(2, 0, {
        title: 'L0000000380', // '검토결과',
        url: './matCheckRequestResult',
      });
    },
    saveAttach() {
      // task_key 를 셋팅한다.
      this.$_.forEach(this.attachFileGrps, (item) => {
        item.taskKey = this.matCheckRequest.matChkRqstNo;
      });

      // 저장할 데이터가 있는 경우
      if (this.saveAttachFiles.length > 0) {
        this.submitCheck = !this.submitCheck;
      }
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
    /**
     *  팝업 안 보이도록 closePopup emit
     *  팝업 close
     * data : 팝업창에서 return하는 데이터
     */
    closePopup(data) {
      this.$emit('closePopup', {});
    },
    closePopup2() {},
    searchVendor(gubun) {
      this.popupOptions.target = () =>
        import(`${'../../vendor/baseInfo/vendorMaster.vue'}`);
      this.popupOptions.title = 'L0000001951'; // '업체';
      this.popupOptions.visible = true;
      this.popupOptions.param = {
        popupMode: true,
        vendorTypeCd: 'CVET3', // 화학물질 분류
        gubun: gubun,
        plantCd: this.matCheckRequest.plantCd,
      };
      this.popupOptions.closeCallback = this.closeVendorPopup;
    },
    closeVendorPopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;

      if (data.data !== 'C') {
        if (data.gubun === 'V') {
          this.matCheckRequest.vendorNm = data.data.vendorNm;
          this.matCheckRequest.vendorCd = data.data.vendorCd;
          this.matCheckRequest.originNmKr = data.data.originNmKr;
          this.matCheckRequest.originCd = data.data.originCd;
        } else {
          this.matCheckRequest.makecpNm = data.data.vendorNm;
          this.matCheckRequest.makecpCd = data.data.vendorCd;
          this.matCheckRequest.makeOriginNmKr = data.data.originNmKr;
          this.matCheckRequest.makeoriginCd = data.data.originCd;
        }
      }
    },
    /** end button 관련 이벤트 **/
    loadComponent() {
      var path = this.tabItems[this.tabIndex].url;
      this.component = () => import(`${path}`);
    },
    /**
     * 자식 페이지에 넘길 paneName 정보 업데이트
     * tab 클릭시 마다
     * tab : 클릭한 tab 정보
     */
    tabClick(tab) {
      var nowDate = new Date();
      this.paneName = tab.paneName + nowDate.getMilliseconds();
    },
    // test () {
    //   this.submitCheck = true;
    // },
    changeUploadFiles(data) {
      var index = this.$_.findIndex(this.attachFileGrps, {
        taskClassNm: data.taskClassNm,
      });
      // 인덱스를 재배치해야 함. 저장오류발생.
      if (index > -1) {
        data.index = index;
        this.attachFileGrps[index].uploadTempFiles = data;

        // 업로드 하기 위해 올라온 파일들을 저장하는 부분
        // 기존에 들어가 있는 경우에는 덮어쓰고 아닌 경우에는 신규로 넣는다.
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
    setUploadedList(data) {
      if (data.taskClassNm === 'MAT_MSDS') {
        this.uploadedMsdsList = [];
        this.$_.forEach(data.data, (_item) => {
          this.uploadedMsdsList.push({
            fileNo: _item.fileNo,
          });
        });
      } else if (data.taskClassNm === 'CHEM_INGREDIENT_STATEMENT') {
        this.uploadedIngredientList = [];
        this.$_.forEach(data.data, (_item) => {
          this.uploadedIngredientList.push({
            fileNo: _item.fileNo,
          });
        });
      }
    },
    setChangeChemProd() {
      this.changeChemProd = false;
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
      // SAP 자재검색
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      var _result = data.data;
      if (_result !== 'C' && _result !== '[]' && _result) {
        this.matCheckRequest.sapMatCd = _result.mat_code;
        this.matCheckRequest.chemProdNmKr = _result.mat_name;
        this.matCheckRequest.chemProdNmEn =
          _result.mat_eng_name === undefined
            ? _result.mat_name
            : _result.mat_eng_name;
      }
    },
    btnDelete(_result) {
      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321', // '확인',
        message: 'M0000000012', // '삭제하시겠습니까?',
        // TODO : 필요시 추가하세요.
        type: 'info', // success / info / warning / error
        // 확인 callback 함수
        confirmCallback: () => {
          this.$http.url = this.$format(
            this.deleteUrl,
            this.popupParam.matChkRqstNo
          );
          this.$http.type = 'DELETE';
          this.$http.request(
            (_result) => {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395', // '안내',
                message: 'M0000000007', // '삭제되었습니다.',
                type: 'success', // success / info / warning / error
              });
              this.closePopup(null);
            },
            (_error) => {
              window.getApp.$emit('APP_REQUEST_ERROR', _error);
            }
          );
        },
        // 취소 callback 함수
        cancelCallback: () => {},
      });
    },
    searchMatStrg() {
      if (this.disabled) return;

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
        this.matCheckRequest.chemprodRegulItmNo = data.chmDgrAttAmtNo;
        this.matCheckRequest.chemprodRegulItmNm = data.dgrNm;
      }
    },
    // searchChemprod () {
    //   this.popupOptions.target = () => import(`${'../chemprod/chemprod.vue'}`);
    //   this.popupOptions.title = '화학물질';
    //   this.popupOptions.visible = true;
    //   this.popupOptions.param = {
    //     popupMode: true,
    //   };
    //   this.popupOptions.closeCallback = this.closeChemprodPopup;
    // },
    // closeChemprodPopup (data) {
    //   this.popupOptions.target = null;
    //   this.popupOptions.visible = false;

    //   if (data.data !== 'C') {
    //     this.matCheckRequest.chemProdNmKr = data.data.chemProdNmKr;
    //     this.matCheckRequest.chemProdNmEn = data.data.chemProdNmEn;
    //     this.matCheckRequest.chemProdNo = data.data.chemProdNo;

    //     this.matCheckRequest.property = data.data.property; // 성상
    //     this.matCheckRequest.propertyNm = data.data.propertyNm; // 성상명
    //     this.matCheckRequest.usageCd = data.data.usageCd; // 주요용도
    //     this.matCheckRequest.usageNm = data.data.usageNm; // 주요용도명
    //     this.matCheckRequest.hsNum = data.data.hsNum; // hs번호
    //     this.matCheckRequest.bizCatCd = data.data.bizCatCd; // 사업구분
    //     this.matCheckRequest.prodCatCd = data.data.prodCatCd; // 제품구분
    //     this.matCheckRequest.mixYn = data.data.mixYn; // 물질구성
    //     this.matCheckRequest.prodClass = []; // 제품분류
    //     if (data.data.makeYn === 'Y') this.matCheckRequest.prodClass.push('make');
    //     if (data.data.impYn === 'Y') this.matCheckRequest.prodClass.push('imp');
    //     if (data.data.buyYn === 'Y') this.matCheckRequest.prodClass.push('buy');
    //     if (data.data.salesYn === 'Y') this.matCheckRequest.prodClass.push('sales');
    //     if (data.data.usingYn === 'Y') this.matCheckRequest.prodClass.push('using');
    //     if (data.data.expYn === 'Y') this.matCheckRequest.prodClass.push('exp');

    //     this.changeChemProd = true;
    //   }
    // },
  },
};
</script>
