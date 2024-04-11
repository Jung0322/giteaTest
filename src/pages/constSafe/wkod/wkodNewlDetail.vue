<!--
  목적 : 작업허가서 상세 
  Detail : 작업허가서 상세 화면
  2019.07.29 (월) 풍산 안강, 울산, 부산 사업장 별 공통 사항에 맞추어 화면만 개발 (기능은 돌아가지 않음)
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <b-row>
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- 공사 정보 -->
            <y-label
              label="L0000000501"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- <el-tag v-if="wkodMaster.bizApprStepCd === 'BAPSD' && !popupParam.apprFlag" size="mini" type="danger">
                <i class="el-icon-warning"></i>
                반려된 문서로 재결재요청은 결재 요청 메뉴에서 하시기 바랍니다.
              </el-tag> -->
              <!-- 이전 작업허가서 복사 -->
              <y-btn
                v-if="!popupParam.wkodNo && editable"
                title="L0000004731"
                color="black"
                @btnClicked="btnPrevWkod"
              />
              <!-- 결재요청 -->
              <y-btn
                v-if="
                  popupParam.wkodStepCd === 'WKS01' &&
                  popupParam.wkodNo > 0 &&
                  !wkodMaster.apprRqstNo &&
                  !disabled &&
                  !popupParam.apprFlag &&
                  editable
                "
                title="L0000003418"
                color="black"
                @btnClicked="btnAppr"
              />
              <!-- 결재요청회수 -->
              <y-btn
                v-if="collectCheck && !popupParam.apprFlag"
                title="L0000003420"
                color="black"
                @btnClicked="btnCollectClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!-- 저장 -->
              <y-btn
                v-if="editable && !disabled"
                :action-url="saveUrl"
                :param="wkodMaster"
                :is-submit="isSave"
                title="L0000002474"
                color="orange"
                :action-type="actionType"
                beforeSubmit="beforeSave"
                @beforeSave="beforeSave"
                @btnClicked="btnSaveClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!-- 작업완료 -->
              <y-btn
                v-if="
                  (popupParam.wkodStepCd === 'WKS04' ||
                    popupParam.wkodStepCd === 'WKS07') &&
                  editable
                "
                :action-url="completeUrl"
                :param="wkodMaster"
                :is-submit="isComplete"
                title="L0000002405"
                color="orange"
                action-type="PUT"
                beforeSubmit="beforeComplete"
                @beforeComplete="beforeComplete"
                @btnClicked="btnCompleteClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!-- 연장 -->
              <y-btn
                v-if="popupParam.wkodStepCd === 'WKS04' && editable"
                :action-url="overUrl"
                :param="wkodMaster"
                :is-submit="isOver"
                title="L0000002004"
                color="orange"
                action-type="PUT"
                beforeSubmit="beforeOver"
                @beforeOver="beforeOver"
                @btnClicked="btnOverClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!-- 취소 -->
              <y-btn
                v-if="popupParam.wkodStepCd === 'WKS04' && editable"
                :action-url="cancelUrl"
                :param="wkodMaster"
                :is-submit="isCancel"
                title="L0000002920"
                color="red"
                action-type="PUT"
                beforeSubmit="beforeCancel"
                @beforeCancel="beforeCancel"
                @btnClicked="btnCancelClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!-- 삭제 -->
              <y-btn
                v-if="editable && deleteCheck"
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
              <!-- 출력물생성 -->
              <y-btn
                v-if="printCheck"
                title="L0000002906"
                color="black"
                @btnClicked="print"
              />
              <!-- 닫기 -->
              <y-btn
                v-if="!popupParam.apprFlag"
                title="L0000000881"
                @btnClicked="closeSndPopup"
              />
            </div>
          </b-col>
        </b-row>
        <b-card>
          <b-row v-if="disabled" key="1">
            <!-- 공사명 -->
            <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
              <y-label label="L0000000503" />
              <y-label :label="wkodMaster.constTitle" :fieldable="true" />
            </b-col>
            <!-- 사업장 -->
            <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
              <y-label label="L0000001415" />
              <y-label :label="wkodMaster.plantNm" :fieldable="true" />
            </b-col>
            <!-- PO번호 -->
            <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
              <y-label label="L0000000139" />
              <y-label :label="wkodMaster.constNum" :fieldable="true" />
            </b-col>
            <!-- 작업기간 -->
            <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
              <y-label label="L0000002373" />
              <y-label
                :label="
                  wkodMaster.constStartYmd && wkodMaster.constEndYmd
                    ? wkodMaster.constStartYmd + '~' + wkodMaster.constEndYmd
                    : ''
                "
                :fieldable="true"
              />
            </b-col>

            <!-- 공사내용 -->
            <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
              <y-label label="L0000000502" />
              <y-label :label="wkodMaster.constContent" :fieldable="true" />
            </b-col>
          </b-row>
          <b-row v-else>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <y-plant
                type="edit"
                :disabled="disabled || this.popupParam.wkodNo !== 0"
                :editable="editable"
                name="plantCd"
                v-model="wkodMaster.plantCd"
              />
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              <!-- 공사명 -->
              <y-text
                :width="10"
                :disabled="!selfConstSafeCheck"
                :editable="editable"
                ui="bootstrap"
                label="L0000000503"
                name="constTitle"
                v-model="wkodMaster.constTitle"
                :appendIcon="
                  !getConstCheck
                    ? [
                        { icon: 'search', callbackName: 'searchConstSafe' },
                        { icon: 'pencil-alt', callbackName: 'editConstSafe' },
                      ]
                    : null
                "
                @searchConstSafe="btnSearchConstSafeClicked"
                @editConstSafe="btnSearchEditConstSafeClicked"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 작업기간 -->
              <y-datepicker
                :width="8"
                :disabled="!selfConstSafeCheck"
                :editable="editable"
                label="L0000002373"
                name="period"
                :range="true"
                :clearable="true"
                v-model="wkodMaster.period"
              ></y-datepicker>
            </b-col>
            <!-- PO번호 -->
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <y-text
                :width="8"
                :disabled="true"
                ui="bootstrap"
                label="L0000000139"
                name="constNum"
                v-model="wkodMaster.constNum"
              ></y-text>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              <!-- 공사내용 -->
              <y-textarea
                :width="10"
                :maxlength="200"
                :disabled="!selfConstSafeCheck"
                :editable="editable"
                ui="bootstrap"
                label="L0000000502"
                name="constContent"
                v-model="wkodMaster.constContent"
              ></y-textarea>
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>
    <!-- 공사 -->
    <!-- 검색 -->
    <b-row class="mt-3">
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- 일반작업허가서 상세 정보 -->
            <y-label
              label="L0000002265"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
          </b-col>
        </b-row>
        <b-card>
          <b-row>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <b-row>
                <!-- 신청부서/신청자 -->
                <b-col sm="8">
                  <y-text
                    :width="6"
                    :disabled="true"
                    ui="bootstrap"
                    label="L0000001799"
                    name="reqDeptNm"
                    v-model="wkodMaster.reqDeptNm"
                  ></y-text>
                </b-col>
                <b-col sm="4">
                  <y-text
                    :width="12"
                    :disabled="true"
                    ui="bootstrap"
                    name="reqUserNm"
                    v-model="wkodMaster.reqUserNm"
                  ></y-text>
                </b-col>
              </b-row>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 신청일 -->
              <y-text
                :width="8"
                :disabled="true"
                ui="bootstrap"
                label="L0000001802"
                name="reqYmd"
                v-model="wkodMaster.reqYmd"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 작업허가번호 -->
              <y-text
                :width="8"
                :disabled="true"
                ui="bootstrap"
                label="L0000002426"
                name="wkodNum"
                v-model="wkodMaster.wkodNum"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 허가서구분 -->
              <y-select
                :width="8"
                :disabled="disabled"
                :editable="editable"
                :comboItems="comboWkodTypeItems"
                :required="true"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                label="L0000003233"
                name="wkodClsCd"
                v-model="wkodMaster.wkodClsCd"
                v-validate="'required'"
                :state="validateState('wkodClsCd')"
              ></y-select>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              <!-- 작업구분 -->
              <y-multi-select
                :width="10"
                :disabled="disabled"
                :editable="editable"
                :comboItems="comboWkodKindItems"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                label="L0000002368"
                name="wkodKindSaves"
                v-model="wkodMaster.wkodKindSaves"
              ></y-multi-select>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- PSM여부 -->
              <y-switch
                :width="8"
                :disabled="disabled"
                :editable="editable"
                true-value="Y"
                false-value="N"
                ui="bootstrap"
                label="L0000000153"
                name="psmYn"
                selectText="Yes"
                unselectText="No"
                v-model="wkodMaster.psmYn"
              ></y-switch>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6"></b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 작업일자 -->
              <y-datepicker
                :width="8"
                :disabled="disabled"
                :editable="editable"
                label="L0000002412"
                name="workYmd"
                :required="true"
                :start="start"
                :end="end"
                v-model="wkodMaster.workYmd"
                v-validate="'required'"
                :state="validateState('workYmd')"
              ></y-datepicker>
            </b-col>
            <b-col sm="6">
              <b-row>
                <b-col sm="5">
                  <y-datepicker
                    :width="12"
                    :disabled="disabled"
                    :editable="editable"
                    label=""
                    name="time"
                    type="time"
                    :required="true"
                    :range="true"
                    :minuteStep="10"
                    v-model="wkodMaster.time"
                    v-validate="'required'"
                    :state="validateState('time')"
                  ></y-datepicker>
                </b-col>
              </b-row>
            </b-col>
            <b-col
              v-if="
                popupParam.wkodStepCd === 'WKS04' ||
                popupParam.wkodStepCd === 'WKS07'
              "
              key="2"
              sm="12"
              md="12"
              lg="12"
              xl="12"
              class="col-xxl-12"
            >
              <b-row>
                <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
                  <!-- 연장시간 -->
                  <y-datepicker
                    :width="8"
                    :disabled="popupParam.wkodStepCd === 'WKS07'"
                    label="L0000003589"
                    :minuteStep="10"
                    :time-picker-options="overTimeOption"
                    type="time"
                    name="workOverTime"
                    v-model="wkodMaster.workOverTime"
                  ></y-datepicker>
                </b-col>
                <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
                  <!-- 연장사유 -->
                  <y-textarea
                    :width="10"
                    :editable="editable"
                    :disabled="popupParam.wkodStepCd === 'WKS07'"
                    :maxlength="150"
                    ui="bootstrap"
                    label="L0000003590"
                    name="refRemark"
                    v-model="wkodMaster.refRemark"
                  />
                </b-col>
              </b-row>
            </b-col>

            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              <b-row>
                <b-col sm="6">
                  <!-- 작업공정/장소 -->
                  <y-tree-process
                    label="L0000002366"
                    :required="true"
                    :disabled="disabled"
                    :editable="editable"
                    :plantCd="wkodMaster.plantCd"
                    name="processCd"
                    v-model="wkodMaster.processCd"
                    v-validate="'required'"
                    :state="validateState('processCd')"
                  ></y-tree-process>
                </b-col>
                <b-col sm="4">
                  <y-text
                    :width="12"
                    :maxlength="100"
                    :disabled="disabled"
                    :editable="editable"
                    :required="true"
                    ui="bootstrap"
                    name="workArea"
                    v-model="wkodMaster.workArea"
                    v-validate="'required'"
                    :state="validateState('workArea')"
                  ></y-text>
                </b-col>
                <b-col sm="2">
                  <!-- 작업위치 -->
                  <el-button
                    plain
                    v-if="editable"
                    :type="this.locationBtnColor"
                    class="default-buntton"
                    @click.prevent="openPopup()"
                    >{{ this.workLocation }}</el-button
                  >
                </b-col>
              </b-row>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              <!-- 작업명 -->
              <y-text
                :width="10"
                :maxlength="100"
                :disabled="disabled"
                :editable="editable"
                :required="true"
                ui="bootstrap"
                label="L0000002389"
                name="workTitle"
                v-model="wkodMaster.workTitle"
                v-validate="'required'"
                :state="validateState('workTitle')"
              ></y-text>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              <!-- 작업내용 -->
              <y-textarea
                :width="10"
                :disabled="disabled"
                :editable="editable"
                :maxlength="200"
                :required="true"
                ui="bootstrap"
                label="L0000002374"
                name="workContent"
                v-model="wkodMaster.workContent"
                v-validate="'required'"
                :state="validateState('workContent')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 사용/운전부서 -->
              <y-tree-dept
                :required="true"
                :disabled="disabled"
                :editable="editable"
                :plantCd="wkodMaster.plantCd"
                :showAllDept="true"
                label="L0000001442"
                v-validate="'required'"
                name="pubDeptCd"
                :state="validateState('pubDeptCd')"
                v-model="wkodMaster.pubDeptCd"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 감독자/연락처(신청) -->
              <b-row>
                <b-col sm="8">
                  <y-text
                    :width="6"
                    :disabled="true"
                    :editable="editable"
                    ui="bootstrap"
                    label="L0000003591"
                    name="pubMgrNm"
                    v-model="wkodMaster.pubMgrNm"
                    :appendIcon="
                      disabled
                        ? null
                        : [{ icon: 'search', callbackName: 'searchUser' }]
                    "
                    @searchUser="btnSearchUserClicked"
                  ></y-text>
                </b-col>
                <b-col sm="4">
                  <y-text
                    :width="12"
                    :maxlength="15"
                    :disabled="true"
                    :editable="editable"
                    ui="bootstrap"
                    name="pubMgrTel"
                    v-model="wkodMaster.pubMgrTel"
                  ></y-text>
                </b-col>
              </b-row>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 작업업체 -->
              <y-text
                :width="8"
                :disabled="true"
                :required="true"
                :editable="editable"
                ui="bootstrap"
                label="L0000002404"
                name="subconnNm"
                v-model="wkodMaster.subconnNm"
                :appendIcon="
                  wkodMaster.constNum
                    ? null
                    : [{ icon: 'search', callbackName: 'searchVendor' }]
                "
                @searchVendor="searchVendor('V')"
                :appendText="
                  wkodMaster.constNum
                    ? null
                    : [
                        {
                          text: $comm.getLangSpecInfoLabel('L0000002333'),
                          callbackName: 'setSelf',
                        },
                      ]
                "
                @setSelf="setSelf"
                v-validate="'required'"
                :state="validateState('subconnNm')"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <b-row>
                <b-col sm="8">
                  <!-- 업체감독자/연락처 -->
                  <y-text
                    :width="6"
                    :disabled="disabled"
                    :editable="editable"
                    ui="bootstrap"
                    label="L0000001955"
                    name="subconnUserNm"
                    v-model="wkodMaster.subconnUserNm"
                  ></y-text>
                </b-col>
                <b-col sm="4">
                  <y-text
                    :width="12"
                    :maxlength="15"
                    :disabled="disabled"
                    :editable="editable"
                    ui="bootstrap"
                    name="subconnUserTel"
                    v-model="wkodMaster.subconnUserTel"
                  ></y-text>
                </b-col>
              </b-row>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 작업인원수 -->
              <y-number
                :width="8"
                :disabled="true"
                :editable="editable"
                ui="bootstrap"
                label="L0000002410"
                name="workerNumb"
                v-model="wkodMaster.workerNumb"
              ></y-number>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 도급여부 -->
              <y-switch
                :width="8"
                :editable="editable"
                :disabled="disabled"
                true-value="Y"
                false-value="N"
                ui="bootstrap"
                label="L0000000950"
                name="radioValue"
                selectText="L0000000948"
                unselectText="L0000000949"
                v-model="wkodMaster.subconn2ndYn"
              ></y-switch>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 협조부서 -->
              <y-tree-dept
                :required="true"
                :disabled="disabled"
                :editable="editable"
                :plantCd="wkodMaster.plantCd"
                :showAllDept="true"
                label="L0000003269"
                name="coopDeptCd"
                v-validate="'required'"
                :state="validateState('coopDeptCd')"
                v-model="wkodMaster.coopDeptCd"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 교대시 인계자 -->
              <y-text
                :width="8"
                :disabled="true"
                :editable="editable"
                ui="bootstrap"
                label="L0000000605"
                name="chngTakePsn"
                v-model="wkodMaster.chngTakePsn"
                :appendIcon="
                  disabled
                    ? null
                    : [{ icon: 'search', callbackName: 'searchUser' }]
                "
                @searchUser="btnSearchTakeOverUserClicked"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 교대시 인수자 -->
              <y-text
                :width="8"
                :disabled="true"
                :editable="editable"
                ui="bootstrap"
                label="L0000000606"
                name="chngAccPsn"
                v-model="wkodMaster.chngAccPsn"
                :appendIcon="
                  disabled
                    ? null
                    : [{ icon: 'search', callbackName: 'searchUser' }]
                "
                @searchUser="btnSearchConsigneeUserClicked"
              ></y-text>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              <!-- 안전대책 -->
              <y-textarea
                :width="10"
                :disabled="disabled"
                :editable="editable"
                :maxlength="1000"
                ui="bootstrap"
                label="L0000001853"
                name="safMeasure"
                v-model="wkodMaster.safMeasure"
              />
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              <!-- 특이사항 -->
              <y-textarea
                :width="10"
                :disabled="disabled"
                :editable="editable"
                :maxlength="1000"
                id="a"
                ui="bootstrap"
                label="L0000003022"
                name="specialInstructions"
                v-model="wkodMaster.specialInstructions"
              />
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              <!-- 작업자준수사항 -->
              <y-textarea
                :width="10"
                :disabled="disabled"
                :editable="editable"
                :maxlength="1000"
                ui="bootstrap"
                label="L0000002418"
                name="wokerTerms"
                v-model="wkodMaster.wokerTerms"
              />
            </b-col>
          </b-row>

          <b-row v-if="gasOxygenDisplay" class="mt-3">
            <b-col sm="12">
              <div slot="buttonGroup" class="float-right mb-1">
                <el-tag size="medium" type="info">
                  <!-- 작성하시는 정보는 출력물에 다시 작성하셔야 합니다. -->
                  <i class="el-icon-info"></i>
                  {{ $comm.getLangSpecInfoLabel('L0000002357') }}
                </el-tag>
              </div>
            </b-col>
            <b-col sm="12" class="h100p">
              <!-- 가스 및 산소농도 측정 목록 -->
              <y-auigrid
                ref="yAuiGrid"
                :editable="!disabled && editable"
                :name="gridOptions.name"
                :headers="gridOptions.header"
                :btns="gridOptions.btns"
                :height="gridOptions.height"
                :label="this.$comm.getLangSpecInfoLabel('L0000000199')"
                :useExcelExport="false"
                :showRowCheckColumn="!disabled"
                @btnAddGas="addGasOxygen"
                @btnDeleteGas="deleteGasOxygen"
              />
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>
    <b-row class="mt-3">
      <b-col sm="12">
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
          <!-- :attachFileGrpAR.sync="attachFileGrpAR" -->
          <keep-alive>
            <component
              v-if="component"
              :is="component"
              :wkodChkItemBase.sync="wkodChkItemBase"
              :disabled="disabled"
              :saveVendorCd="saveVendorCd"
              :isConstWrite="selfConstSafeCheck"
              :isVendor="popupParam.isVendor"
              :constKindSubconnNos="constKindSubconnNos"
              :constSafeInfo="popupParam.constSafeInfo"
              :wkodMaster.sync="wkodMaster"
              :isPrev="isPrev"
              :multiFileUpload.sync="multiFileUpload"
              :safeInfoSubmitCheck="safeInfoSubmitCheck"
              :safInfoAttachFileGrps="safInfoAttachFileGrps"
              :saveSafeInfoAttachFiles="saveSafeInfoAttachFiles"
              safeInfosm="12"
              sm="12"
              :submitObject="submitObject"
              :attachFileGrps="attachFileGrps"
              :saveAttachFiles="saveAttachFiles"
              @changeUploadFiles="changeUploadFiles"
            />
          </keep-alive>
        </el-tabs>
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
  name: 'wkod-detail',
  props: {
    popupParam: {
      type: Object,
      default: function () {
        return {
          constNo: '',
          wkodNo: 0,
          wkodStepCd: '',
          isVendor: false,
          constSafeInfo: [],
          apprFlag: false,
          apprRqstNo: 0,
          readOnly: false,
        };
      },
    },
  },
  data() {
    return {
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '500px',
        top: '50px',
        param: {},
        closeCallback: null,
      },
      wkodMaster: {
        plantCd: null,
        constNo: '',
        constNum: '',
        constTitle: '',
        constStartYmd: '',
        constEndYmd: '',
        period: [],
        constContent: '',
        wkodNo: '',
        wkodNum: '',
        wkodClsCd: null,
        wkodKinds: [],
        wkodKindSaves: [],
        workYmd: '',
        workTime: '',
        workStartTime: '',
        workEndTime: '',
        workOverTime: '',
        // workCompleteTime: '',
        workTitle: '',
        workContent: '',
        wkodStepCd: '',
        processCd: null,
        workArea: '',
        reqUserId: '',
        reqUserNm: '',
        reqDeptCd: '',
        reqDeptNm: '',
        reqYmd: '',
        pubDeptCd: null,
        pubDeptNm: null,
        coopDeptCd: null,
        coopDeptNm: null,
        safMeasure: '',
        wokerTerms: '',
        chngTakePsn: '',
        chngAccPsn: '',
        vendorCd: '',
        subconnNm: '',
        subconnUserNm: '',
        subconnUserTel: '',
        workerNumb: 0,
        specialInstructions: '',
        handleChemContent: '',
        pubMgrNm: '',
        pubMgrId: '',
        pubMgrTel: '',
        vendorWriteYn: '',
        // pubUserId: '',
        // pubUserNm: '',
        // pubConfirmDt: '',
        // appUserId: '',
        // appUserNm: '',
        // appDeptCd: '',
        // appDeptNm: '',
        // appConfirmDt: '',
        overUserId: '',
        overUserNm: '',
        overDeptCd: '',
        overDeptNm: '',
        // overConfirmDt: '',
        // overYn: '',
        locatePntX: null,
        locatePntY: null,
        mapNo: null,
        // delYn: '',
        spmEtc: '',
        refRemark: '',
        subconn2ndYn: 'N',
        prtYn: '',
        wkodSpeCds: [],
        time: [],
        wkodCheckResult: [],
        createUserId: '',
        updateUserId: '',
        assessPlanNo: '',
        assessNm: '',
        // wkodLegalLcns: [], // 법적인허가 대상항목
        wkodSubconnWorkers: [], // 작업자 목록
        wkodGasMeass: [],
        wkodLotos: [],
        psmYn: 'N',
        apprRqstNo: 0,
      },
      getConstCheck: false,
      saveVendorCd: '',
      gasOxygen: [],
      gasOxygenDisplay: false,

      YAuiGrid: null,
      gridOptions: {
        header: [],
        height: 300,
      },

      wkodChkItemBase: [], // chkItemBase
      // 첨부파일
      attach: null, // 첨부파일컴포넌트
      submitObject: {
        submitCheck: false,
      },
      saveAttachFiles: [],
      attachFileGrps: [],

      // 공사정보 첨부파일
      safeInfoSubmitCheck: false,
      saveSafeInfoAttachFiles: [],
      safInfoAttachFileGrps: [],

      tabItems: [],

      editable: true,
      component: null,
      tabIndex: 0,
      comboWkodTypeItems: [], // 허가서구분
      comboWkodKindItems: [],
      templeteUrl: '',
      saveUrl: '',
      deleteUrl: '',
      printUrl: '',
      searchUrl: '',
      completeUrl: '',
      overUrl: '',
      cancelUrl: '',
      constPlantChange: false,
      selfConstSafeCheck: false,
      isComplete: false,
      isOver: false,
      isSave: false,
      isCancel: false,
      isDelete: false,
      deleteCheck: false,
      isApproval: false,
      disabled: false,
      updateMod2: false, // 작업허가서의 단계가 작업완료 상태나 취소 상태가 아니라면 첨부파일을 등록 할 수 있어야 함
      printCheck: false,
      multiFileUpload: false,
      constKindSubconnNos: [],
      start: '',
      end: '',
      collectCheck: false,
      collectUrl: '',
      actionType: 'POST',
      overHourOption: [],
      deleteValue: null,
      workLocation: '',
      locationBtnColor: 'warning',
      isPrev: false,
    };
  },
  computed: {
    overTimeOption() {
      return {
        start: this.$comm
          .moment(this.wkodMaster.workEndTime, 'HH:mm')
          .add('10', 'm')
          .format('HH:mm'),
        step: '00:10',
        end: '23:50',
      };
    },
  },
  watch: {
    tabIndex() {
      this.loadComponent();
    },
    'wkodMaster.plantCd': function (newval, oldVal) {
      this.wkodMaster.constNo = '';
      this.wkodMaster.constNum = '';
      this.wkodMaster.constTitle = '';
      this.wkodMaster.constStartYmd = '';
      this.wkodMaster.constEndYmd = '';
      this.wkodMaster.period = [];
      this.wkodMaster.constContent = '';
      this.wkodMaster.assessPlanNo = 0;
      this.wkodMaster.assessNm = '';
      this.wkodMaster.wkodSubconnWorkers = [];
      this.wkodMaster.workerNumb = 0;
      this.wkodMaster.wkodKindSaves = [];

      this.safInfoAttachFileGrps = [];
      this.wkodKindSaves = [];
      this.wkodCheckResult = [];

      this.constKindSubconnNos = [];

      // 공사업체
      this.wkodMaster.vendorCd = '';
      this.wkodMaster.subconnNm = '';
      this.saveVendorCd = '';
      this.selfConstSafeCheck = false;

      // 허가서구분
      this.wkodMaster.wkodClsCd = null;
      this.$comm.orderedPromise([{ func: this.getListPromise, param: 'f' }]);
    },
    'wkodMaster.wkodSubconnWorkers': {
      handler: function (val, oldVal) {
        if (this.wkodMaster.wkodSubconnWorkers) {
          this.wkodMaster.workerNumb =
            this.wkodMaster.wkodSubconnWorkers.length;
        } else if (this.wkodMaster.workerNumb) {
          this.wkodMaster.workerNumb = this.wkodMaster.workerNumb;
        } else {
          this.wkodMaster.workerNumb = 0;
        }
      },
      deep: true,
    },
    'wkodMaster.period': {
      handler: function (val, oldVal) {
        // 공사 정보에 작업기간 정보가 들어갈 시에 작업일자 데이터를 입력할 수 있는 범위를 제한한다.
        if (this.wkodMaster.period && this.wkodMaster.period.length === 2) {
          this.start = this.wkodMaster.period[0];
          this.end = this.wkodMaster.period[1];
          if (this.start < this.wkodMaster.reqYmd) {
            this.start = this.wkodMaster.reqYmd;
          }
          if (this.wkodMaster.workYmd) {
            if (
              !(
                this.$comm.dateCompare(this.start, this.wkodMaster.workYmd) &&
                this.$comm.dateCompare(this.wkodMaster.workYmd, this.end)
              )
            ) {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395',
                // 입력하신 작업일자가 공사정보의 작업기간을 벗어났습니다. 다시 작업일자를 입력하세요.
                message: 'M0000000237',
                type: 'warning', // success / info / warning / error
              });
              this.wkodMaster.workYmd = '';
            }
          }
        }
      },
    },
    'wkodMaster.wkodKindSaves': {
      handler: function (val, oldVal) {
        if (val) {
          // 화기 / 밀폐 / 유해물질취급 작업인 경우 가스 및 산소농도 보여지도록 설정
          if (
            this.$_.findIndex(this.wkodMaster.wkodKindSaves, {
              code: 'WKKS03',
            }) > -1
          ) {
            this.gasOxygenDisplay = true;
            if ((this.YAuiGrid || null) === null) {
              this.YAuiGrid = this.$refs.yAuiGrid;
              this.setGrid();
            }
            
            if ((this.YAuiGrid || null) !== null) {
              this.YAuiGrid.setGridData(this.wkodMaster.wkodGasMeass);
            }
          } else {
            this.gasOxygenDisplay = false;
            if ((this.YAuiGrid || null) !== null) {
              if (this.YAuiGrid.getGridData().length > 0) {
                this.YAuiGrid.clearGridData();
              }
            }  
          }
        } else {
          // 화기 / 밀폐 / 유해물질취급 작업인 경우 가스 및 산소농도 보여지도록 설정
          if (
            this.$_.findIndex(this.wkodMaster.wkodKinds, {
              wkodKindCd: 'WKKS03',
            }) > -1
          ) {
            this.gasOxygenDisplay = true;
            if ((this.YAuiGrid || null) === null) {
              this.YAuiGrid = this.$refs.yAuiGrid;
              this.setGrid();
            }
            if ((this.YAuiGrid || null) !== null) {
              this.YAuiGrid.setGridData(this.wkodMaster.wkodGasMeass);
            }
          } else {
            this.gasOxygenDisplay = false;
            if ((this.YAuiGrid || null) !== null) {
              if (this.YAuiGrid.getGridData().length > 0) {
                this.YAuiGrid.clearGridData();
              }
            }  
          }
        }
      },
      deep: true,
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
  },
  beforeDestroy() {},
  //* methods */
  methods: {
    init() {
      this.workLocation = this.$comm.getLangSpecInfoLabel('L0000004270'); // 작업위치 등록
      this.tabItems = [
        { title: 'L0000003324', url: './confirmedItem' }, // 확인항목
        { title: 'L0000004269', url: './confirmNewInspectionIndex' }, // 안전조치 점검
        // { title: '설비', url: './facilityUsed' },
        { title: 'L0000000123', url: './assessRsultInsertTab' }, // jsa평가결과
        { title: 'L0000001210', url: './wkodOriginTarget' }, // 법적 인허가 대상
        { title: 'L0000000505', url: './safeInfoFileUpload' }, // 공사안전정보
        { title: 'L0000002416', url: './wkodPerson' }, // 작업자정보
        { title: 'L0000001592', url: './LOTO' }, // 설비&loto
        { title: 'L0000002843', url: 'fileUploadPage' }, // 첨부파일
      ];
      // Url Setting
      this.searchUrl = selectConfig.saf.wkodMaster.get.url;
      this.printUrl = selectConfig.saf.wkodMaster.print.url;
      this.templeteUrl = selectConfig.saf.wkodMaster.templete.url;
      this.deleteUrl = transactionConfig.saf.wkodMaster.delete.url;
      this.collectUrl = transactionConfig.manage.appr.collect.url;
      this.completeUrl = transactionConfig.saf.wkodMaster.complete.url;
      this.overUrl = transactionConfig.saf.wkodMaster.over.url;
      this.cancelUrl = transactionConfig.saf.wkodMaster.cancel.url;

      this.editable = this.$route.meta.editable;

      this.loadComponent();

      // 첨부파일 Setting
      // this.attachFileGrpARSetting();

      // 허가서 구분
      this.$comm.getComboItems('SAF_WKOD_WKKD', false).then((_result) => {
        if (_result && _result.length > 0) {
          _result.splice(0, 1);
        }
        this.comboWkodTypeItems = _result;
      });

      this.getComboAttrItems('SAF_WKOD_KIND'); // 작업구분

      this.$comm.orderedPromise([{ func: this.getListPromise, param: 'f' }]);
    },
    setGrid() {
      // 가스 및 산소 농도 그리드 헤더 설정
      this.gridOptions.header = [
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000002941'), 
          dataField: 'measTime', 
          width: '13%', 
          editRenderer: {
            editable: !this.disabled && this.editable,
            type: "MaskEditRenderer",
            mask: "99:99",
            textAlign: "center",
            placeholder: "__:__",
            applyMaskValue: true,
          } 
        }, // 측정 시간
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000002957'), 
          dataField: 'measPnt', 
          width: '25%', 
          style: 'left-align', 
          editable: !this.disabled && this.editable,
          editRenderer: {
            type: 'InputEditRenderer', 
          }, 
        }, // 측정지점 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000000214'), 
          dataField: 'gasKindNm', 
          width: '25%', 
          style: 'left-align', 
          editable: !this.disabled && this.editable,
          editRenderer: {
            type: 'InputEditRenderer', 
          }, 
        }, // 가스종류 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000002922'), 
          dataField: 'measRslt', 
          width: '20%', 
          editable: !this.disabled && this.editable,
          editRenderer: {
            type: 'InputEditRenderer', 
          }, 
        }, // 측정결과 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000002954'), 
          dataField: 'measMan', 
          width: '15%', 
          editable: !this.disabled && this.editable,
          editRenderer: {
            type: 'InputEditRenderer', 
          }, 
        }, // 측정자 

      ];

      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000002892'),
          color: 'orange',
          btnClicked: 'btnAddGas',
          visible: !this.disabled && this.editable,
        },  //  추가
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001495'),
          color: 'red',
          btnClicked: 'btnDeleteGas',
          visible: !this.disabled && this.editable,
        },  //  삭제
      ];
    },
    getListPromise(isSaveCallback) {
      isSaveCallback = isSaveCallback === 'f' ? false : true;
      return new Promise((_resolve, _reject) => {
        let result = this.getList(isSaveCallback);
        if (!result) {
          if (this.wkodMaster.locatePntX) {
            this.workLocation = this.$comm.getLangSpecInfoLabel('L0000004271'); // 작업위치 등록완료
            this.locationBtnColor = 'info';
          }
          _resolve(true);
        } else {
          _reject(result);
        }
      });
    },
    getList(isSaveCallback) {
      // 신규로 들어온 경우
      if (this.popupParam.wkodNo === 0) {
        this.setDetailData();
        // 공사에서 작업허가서 신청하는 경우
        if (this.popupParam.constNo) {
          this.setConstInfo(this.popupParam.constSafeInfo);
        }
      } else {
        this.$http.url = this.$format(this.searchUrl, this.popupParam.wkodNo);
        this.$http.type = 'GET';
        this.$http.request(
          (_result) => {
            this.$_.extend(this.wkodMaster, _result.data);
            if (this.wkodMaster.constNo) {
              this.getConstCheck = true;
            }

            // 작업시간
            if (this.wkodMaster.workStartTime && this.wkodMaster.workEndTime) {
              this.wkodMaster.time = [
                this.wkodMaster.workStartTime,
                this.wkodMaster.workEndTime,
              ];
              let time = this.wkodMaster.workEndTime.split(':');
              let hour = time[0];
              if (!isNaN(hour)) {
                for (let i = this.$_.parseInt(hour); i < 24; i++) {
                  this.overHourOption.push(i);
                }
              }
            }

            this.getCollectable();

            this.start = this.wkodMaster.reqYmd;
            this.saveVendorCd = this.wkodMaster.vendorCd;
            if (this.wkodMaster.constStartYmd && this.wkodMaster.constEndYmd) {
              this.wkodMaster.period = [
                this.wkodMaster.constStartYmd,
                this.wkodMaster.constEndYmd,
              ];
            }
            // 작업구분
            if (!isSaveCallback) {
              this.wkodMaster.wkodKindSaves = [];
              this.$_.forEach(this.wkodMaster.wkodKinds, (item) => {
                this.wkodMaster.wkodKindSaves.push({
                  code: item.wkodKindCd,
                  name: item.wkodKindNm,
                });
              });
            }
            this.selfConstSafeCheck = false;
            if (this.wkodMaster.constNo) {
              // 이미 만들어져 있는 첨부파일 컴포넌트가 있는 경우에 공사안전
              if (this.safInfoAttachFileGrps.length > 0) {
                this.safInfoAttachFileGrps.splice(
                  0,
                  this.safInfoAttachFileGrps.length
                );
              }
              this.safInfoAttachFileGrps.splice(0, 0, {
                label: 'L0000003593', // 공사안전정보 첨부파일
                listType: 'text',
                drag: false,
                showFileSearch: false,
                editable: true,
                disabled: !this.editable,
                onlyDownload: true,
                limit: 10,
                multiple: true,
                uploadTempFiles: null,
                taskClassNm: 'CONST_SAFETY_INFO',
                taskKey: this.wkodMaster.constNo,
                taskFlag: '',
                createUserId: this.$store.getters.token,
              });
              // 작업구분

              this.$_.forEach(this.wkodMaster.wkodKinds, (item) => {
                // 작업구분이 추가될 때마다 안전관리계획서 첨부파일 컴포넌트를 생성
                this.safInfoAttachFileGrps.push({
                  // 안전관리계획서({s1}) 첨부파일
                  label: this.$comm.getLangSpecInfoLabel('L0000001845', {
                    s1: item.wkodKindNm,
                  }),

                  listType: 'text',
                  drag: false,
                  showFileSearch: false,
                  editable: this.editable,
                  disabled: !this.editable,
                  onlyDownload: true,
                  limit: 20,
                  multiple: true,
                  uploadTempFiles: null,
                  taskClassNm:
                    'CONST_SAFE' + item.wkodKindCd + this.wkodMaster.vendorCd,
                  taskKey:
                    this.wkodMaster.constNo +
                    item.wkodKindCd +
                    this.wkodMaster.vendorCd,
                  taskFlag: '',
                  createUserId: this.$store.getters.token,
                });
              });
            }
            this.wkodMaster.updateUserId = this.$store.getters.token;
            this.setStatus();
            this.setAttachFileGrps();
            this.getWkodChkItem();

            if (this.wkodMaster.locatePntX) {
              this.workLocation =
                this.$comm.getLangSpecInfoLabel('L0000004271'); // 작업위치 등록완료
              this.locationBtnColor = 'info';
            }
          },
          (_error) => {
            window.getApp.$emit('APP_REQUEST_ERROR', _error);
          }
        );
      }
    },
    setStatus() {
      // 작업허가서 신청의 경우
      if (this.popupParam.wkodStepCd === 'WKS01') {
        if (this.popupParam.wkodNo !== 0) {
          this.deleteCheck = true;
        }
      } else {
        // 기존에는 진행단계 1(승인) 인 경우에만 수정가능하도록 설정이 되어져 있었음
        // 바꾼 설정으로는 출력단계 이상부터는 막히게 함
        this.disabled = true;
      }
      // 작업허가서 조회 및 출력의 경우 출력 버튼 활성화
      if (
        this.popupParam.wkodStepCd === 'WKS04' ||
        this.popupParam.wkodStepCd === 'WKS05' ||
        this.popupParam.wkodStepCd === 'WKS07'
      ) {
        this.printCheck = true;
      } else {
        this.printCheck = false;
      }

      if (
        this.wkodMaster.wkodStepCd === 'WKS01' ||
        this.wkodMaster.wkodStepCd === 'WKS04' ||
        this.wkodMaster.wkodStepCd === 'WKS07'
      ) {
        this.updateMod2 = false;
      } else {
        this.updateMod2 = true;
      }

      // 결재상태일때
      if (this.popupParam.apprFlag) {
        if (this.wkodMaster.bizApprStepCd === 'BAPSG') {
          this.disabled = true;
          this.deleteCheck = false;
        } else {
          this.printCheck = false;
          this.deleteCheck = false;
          this.disabled = false;
        }
      } else {
        if (this.wkodMaster.bizApprStepCd === 'BAPSA') {
          this.deleteCheck = false;
          this.disabled = true;
        } else if (this.wkodMaster.bizApprStepCd === 'BAPSD') {
          this.deleteCheck = false;
        }
      }

      if (this.popupParam.readOnly) {
        this.disabled = true;
        this.deleteCheck = false;
      }
    },
    setAttachFileGrps() {
      let taskKey = this.popupParam.wkodNo
        ? this.popupParam.wkodNo.toString()
        : '';
      this.attachFileGrps = [
        {
          label: 'L0000002843', // 첨부파일
          uploadTempFiles: null,
          taskClassNm: 'WKOD_MASTER',
          taskKey: taskKey,
          drag: false,
          showFileSearch: !(this.disabled && this.updateMod2),
          editable: this.editable,
          disabled: this.disabled && this.updateMod2,
          onlyDownload: this.disabled && this.updateMod2,
          createUserId: this.$store.getters.token,
        },
      ];
    },
    loadComponent() {
      var path = this.tabItems[this.tabIndex].url;

      if (path === 'fileUploadPage') {
        this.component = () =>
          import('@/pages/common/attachFile/multiFileUpload');
      } else if (path === 'constSafeOriginTarget') {
        this.component = () =>
          import('@/pages/constSafe/constSafeStatus/constSafeOriginTarget');
      } else this.component = () => import(`${path}`);
    },
    getComboAttrItems(codeGroupCd) {
      this.$http.url = this.$format(
        selectConfig.codeMaster.getSelectAttr.url,
        codeGroupCd,
        null,
        null,
        'STANDARD'
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.comboWkodKindItems = this.$_.clone(_result.data);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    btnSearchUserClicked(_item) {
      if (this.disabled) return;

      this.popupOptions.target = () =>
        import(`${'../../manage/user/userSearch.vue'}`);
      this.popupOptions.title = 'L0000001466'; // 사용자검색
      this.popupOptions.param = {
        plantCd: this.wkodMaster.plantCd,
        deptCd: this.wkodMaster.pubDeptCd,
      };
      this.popupOptions.visible = true;
      this.popupOptions.width = '60%';
      this.popupOptions.top = '100px';
      this.popupOptions.closeCallback = this.closePopupSearchUser;
    },
    closePopupSearchUser(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;

      if (data.user) {
        this.wkodMaster.pubMgrNm = data.user.userNm;
        this.wkodMaster.pubMgrId = data.user.userId;
        this.wkodMaster.pubMgrTel = data.user.phoneNo;
      }
    },
    btnSearchVendorUserClicked(_item) {
      if (this.disabled) return;

      this.popupOptions.target = () =>
        import(`${'../../manage/user/userSearch.vue'}`);
      this.popupOptions.title = 'L0000001466'; // 사용자검색
      this.popupOptions.param = {
        plantCd: this.wkodMaster.plantCd,
        deptCd: '',
      };
      this.popupOptions.visible = true;
      this.popupOptions.width = '60%';
      this.popupOptions.top = '100px';
      this.popupOptions.closeCallback = this.closePopupSearchVendorUser;
    },
    closePopupSearchVendorUser(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;

      if (data.user) this.wkodMaster.subconnUserNm = data.user.userNm;
    },
    btnSearchTakeOverUserClicked(_item) {
      if (this.disabled) return;

      this.popupOptions.target = () =>
        import(`${'../../manage/user/userSearch.vue'}`);
      this.popupOptions.title = 'L0000001466'; // 사용자검색
      this.popupOptions.param = {
        plantCd: this.wkodMaster.plantCd,
        deptCd: '',
      };
      this.popupOptions.visible = true;
      this.popupOptions.width = '60%';
      this.popupOptions.top = '100px';
      this.popupOptions.closeCallback = this.closePopupSearchTakeOverUser;
    },
    closePopupSearchTakeOverUser(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;

      if (data.user) this.wkodMaster.chngTakePsn = data.user.userNm;
    },
    btnSearchConsigneeUserClicked(_item) {
      if (this.disabled) return;

      this.popupOptions.target = () =>
        import(`${'../../manage/user/userSearch.vue'}`);
      this.popupOptions.title = 'L0000001466'; // 사용자검색
      this.popupOptions.param = {
        plantCd: this.wkodMaster.plantCd,
        deptCd: '',
      };
      this.popupOptions.visible = true;
      this.popupOptions.width = '60%';
      this.popupOptions.top = '100px';
      this.popupOptions.closeCallback = this.closePopupSearchConsigneeUser;
    },
    closePopupSearchConsigneeUser(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;

      if (data.user) this.wkodMaster.chngAccPsn = data.user.userNm;
    },
    searchVendor(gubun) {
      if (
        this.editable === true &&
        !this.selfConstSafeCheck &&
        !this.wkodMaster.constNo
      ) {
        if (this.wkodMaster.subconnNm) {
          window.getApp.$emit('CONFIRM', {
            title: 'L0000003321',
            // 공사업체가 변경되면 출입자 목록이 초기화 됩니다. 변경하시겠습니까?
            message: 'M0000000238',
            // TODO : 필요시 추가하세요.
            type: 'info', // success / info / warning / error
            // 확인 callback 함수
            confirmCallback: () => {
              this.popupOptions.target = () =>
                import(`${'../../vendor/baseInfo/vendorMaster.vue'}`);
              this.popupOptions.title = this.$comm.getLangSpecInfoLabel(
                'L0000001951' // 업체
              );
              this.popupOptions.visible = true;
              this.popupOptions.width = '80%';
              this.popupOptions.param = {
                plantCd: this.wkodMaster.plantCd,
                popupMode: true,
                gubun: gubun,
                vendorTypeCd: 'CVET1', // 공사업체
              };
              this.popupOptions.closeCallback = this.closeVendorPopup;
            },
            // 취소 callback 함수
            cancelCallback: () => {},
          });
        } else {
          this.popupOptions.target = () =>
            import(`${'../../vendor/baseInfo/vendorMaster.vue'}`);
          this.popupOptions.title = this.$comm.getLangSpecInfoLabel(
            'L0000001951' // 업체
          );
          this.popupOptions.visible = true;
          this.popupOptions.width = '80%';
          this.popupOptions.param = {
            plantCd: this.wkodMaster.plantCd,
            popupMode: true,
            gubun: gubun,
            vendorTypeCd: 'CVET1', // 공사업체
          };
          this.popupOptions.closeCallback = this.closeVendorPopup;
        }
      }
    },
    closeVendorPopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;

      if (data.data !== 'C') {
        this.wkodMaster.subconnNm = data.data.vendorNm;
        this.wkodMaster.vendorCd = data.data.vendorCd;
      }
    },
    setSelf() {
      if (
        this.editable === true &&
        !this.selfConstSafeCheck &&
        !this.wkodMaster.constNo &&
        this.wkodMaster.subconnNm !==
          this.$comm.getLangSpecInfoLabel('L0000002333')
      ) {
        if (this.wkodMaster.subconnNm) {
          window.getApp.$emit('CONFIRM', {
            title: 'L0000003321',
            // 공사업체가 변경되면 출입자 목록이 초기화 됩니다. 변경하시겠습니까?
            message: 'M0000000238',
            // TODO : 필요시 추가하세요.
            type: 'info', // success / info / warning / error
            // 확인 callback 함수
            confirmCallback: () => {
              this.wkodMaster.subconnNm =
                this.$comm.getLangSpecInfoLabel('L0000002333');
              this.wkodMaster.vendorCd = '';
            },
            // 취소 callback 함수
            cancelCallback: () => {},
          });
        } else {
          this.wkodMaster.subconnNm =
            this.$comm.getLangSpecInfoLabel('L0000002333');
          this.wkodMaster.vendorCd = '';
        }
      }
    },
    getWkodChkItem(flag) {
      return new Promise((_resolve, _reject) => {
        if (!this.wkodMaster.plantCd) return _resolve(true);
        /**
         * 모든 정보를 다 가지고 온 후 wkoMaster에 담긴 data 정보를 토대로 visible처리한다.
         *
         * test: 사용여부 Y인것만 가지고 온다.
         */
        this.$http.url = selectConfig.saf.wkodMaster.getChkItemBase.url;
        this.$http.type = 'GET';
        this.$http.param = {
          plantCd: this.wkodMaster.plantCd,
          wkodNo: flag ? this.wkodMaster.wkodNo : this.popupParam.wkodNo,
        };
        this.$http.request(
          (_result) => {
            this.wkodChkItemBase = _result.data;

            if (flag) {
              this.wkodMaster.wkodNo = 0;
            }
            _resolve(true);
          },
          (_error) => {
            window.getApp.$emit('APP_REQUEST_ERROR', _error);
            _reject(_error);
          }
        );
      });
    },
    setDetailData() {
      this.wkodMaster.wkodClsCd = 'WKKDNS';
      this.wkodMaster.vendorCd = '';
      this.wkodMaster.subconnNm = '';
      this.wkodMaster.subconnRegYn = 'N'; // 공사업체 미작성
      this.wkodMaster.wkodStepCd = this.popupParam.wkodStepCd;
      this.wkodMaster.reqDeptNm = this.$store.getters.deptNm;
      this.wkodMaster.reqDeptCd = this.$store.getters.deptCd;
      this.wkodMaster.reqUserNm = this.$store.getters.name;
      this.wkodMaster.reqUserId = this.$store.getters.token;
      this.wkodMaster.createUserId = this.$store.getters.token;
      this.wkodMaster.reqYmd = this.$comm.getToday();
      this.multiFileUpload = true;

      this.wkodMaster.workYmd = this.$comm.getToday();
      this.wkodMaster.time = ['08:00', '17:00'];

      this.setAttachFileGrps();
      this.getWkodChkItem();
    },
    openPopup() {
      this.popupOptions.param = {
        disabled: this.disabled,
        plantCd: this.wkodMaster.plantCd,
        wkodStepCd: this.popupParam.wkodStepCd,
        locatePntX: this.wkodMaster.locatePntX,
        locatePntY: this.wkodMaster.locatePntY,
        mapNo: this.wkodMaster.mapNo,
      };

      this.popupOptions.target = () => import(`${'./locatePntDialog.vue'}`);
      this.popupOptions.title = 'L0000002406'; // 작업위치
      this.popupOptions.visible = true;
      this.popupOptions.width = '50%';
      this.popupOptions.top = '50px';
      this.popupOptions.closeCallback = this.closePopup;
    },
    closePopup(data) {
      if (data) {
        this.wkodMaster.locatePntX = data.locatePntX;
        this.wkodMaster.locatePntY = data.locatePntY;
        this.wkodMaster.mapNo = data.mapNo;
        if (this.wkodMaster.locatePntX) {
          this.workLocation = this.$comm.getLangSpecInfoLabel('L0000004271'); // 작업위치 등록완료
          this.locationBtnColor = 'info';
        }
      }
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
    },
    closeSndPopup(data) {
      if (this.popupParam.apprFlag) return;
      this.$emit('closePopup');
      Object.assign(this.$data, this.$options.data());
    },
    btnPrevWkod() {
      this.popupOptions.target = () => import(`${'./wkodRequest.vue'}`);
      this.popupOptions.title = this.$comm.getLangSpecInfoLabel('L0000004731'); // 이전 작업허가서 복사
      this.popupOptions.visible = true;
      this.popupOptions.width = '70%';
      this.popupOptions.top = '30px';
      this.popupOptions.param = {
        popupMode: true,
        plantCd: this.wkodMaster.plantCd,
        prevWkod: true,
      };
      this.popupOptions.closeCallback = this.closePrevWkod;
    },
    closePrevWkod(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;

      if (data && data.wkodNo) {
        this.$http.url = this.$format(this.searchUrl, data.wkodNo);
        this.$http.type = 'GET';
        this.$http.request(
          (_result) => {
            this.$_.extend(this.wkodMaster, _result.data);

            // 작업시간
            if (this.wkodMaster.workStartTime && this.wkodMaster.workEndTime) {
              this.wkodMaster.time = [
                this.wkodMaster.workStartTime,
                this.wkodMaster.workEndTime,
              ];
              let time = this.wkodMaster.workEndTime.split(':');
              let hour = time[0];
              if (!isNaN(hour)) {
                for (let i = this.$_.parseInt(hour); i < 24; i++) {
                  this.overHourOption.push(i);
                }
              }
            }

            this.start = this.wkodMaster.reqYmd;
            this.saveVendorCd = this.wkodMaster.vendorCd;

            this.wkodMaster.wkodKindSaves = [];
            this.$_.forEach(this.wkodMaster.wkodKinds, (item) => {
              this.wkodMaster.wkodKindSaves.push({
                code: item.wkodKindCd,
                name: item.wkodKindNm,
              });
            });

            /**
             * 2022.03.11 LHJ
             * 공사정보의 공사일자가 맞으면 공사정보 조회
             * 공사정보가 맞지 않을 경우 지정하도록 수정
             */
            let isConstMatch = false;

            if (this.wkodMaster.constStartYmd && this.wkodMaster.constEndYmd) {
              isConstMatch =
                this.$comm.dateCompare(this.wkodMaster.constStartYmd) &&
                this.$comm.dateCompare(
                  this.$comm.getToday(),
                  this.wkodMaster.constEndYmd
                );
              if (isConstMatch) {
                this.wkodMaster.period = [
                  this.wkodMaster.constStartYmd,
                  this.wkodMaster.constEndYmd,
                ];
              } else {
                this.wkodMaster.constNo = '';
                this.wkodMaster.constTitle = '';
                this.wkodMaster.constNum = '';
                this.wkodMaster.constContent = '';
              }
            }

            this.setAttachFileGrps();
            this.getWkodChkItem(true);

            this.isPrev = !this.isPrev;
          },
          (_error) => {
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
    /**
     * 사용자의 입력을 받는다.
     */
    /** button 관련 이벤트 **/
    beforeSave() {
      this.wkodMaster.wkodGasMeass = this.YAuiGrid.getGridData();
      if (this.popupParam.wkodNo) {
        this.saveUrl = transactionConfig.saf.wkodMaster.edit.url;
        this.actionType = 'PUT';
        this.checkValidator('edit');
      } else {
        this.saveUrl = transactionConfig.saf.wkodMaster.insert.url;
        this.actionType = 'POST';
        this.checkValidator('insert');
      }
    },
    apprSave() {
      return new Promise((resolve) => {
        let flag = 'approval';
        this.$validator
          .validateAll()
          .then((_result) => {
            if (_result) {
              let valid = true;
              // 공사 정보를 직접 입력하는 경우
              if (this.selfConstSafeCheck) {
                if (
                  !this.wkodMaster.period ||
                  this.wkodMaster.period.length === 0
                ) {
                  window.getApp.$emit('ALERT', {
                    title: 'L0000003395',
                    // 작업기간을 입력하세요.
                    message: 'M0000000239',
                    type: 'warning', // success / info / warning / error
                  });
                  resolve(false);
                  return;
                }
                if (!this.wkodMaster.constTitle) {
                  window.getApp.$emit('ALERT', {
                    title: 'L0000003395',
                    // 작업명을 입력하세요.
                    message: 'M0000000240',
                    type: 'warning', // success / info / warning / error
                  });
                  resolve(false);
                  return;
                }
                if (!this.wkodMaster.constContent) {
                  window.getApp.$emit('ALERT', {
                    title: 'L0000003395',
                    // 공사내용을 입력하세요.
                    message: 'M0000000241',
                    type: 'warning', // success / info / warning / error
                  });
                  resolve(false);
                  return;
                }
              }
              if (
                valid &&
                this.wkodMaster.time.length === 2 &&
                this.wkodMaster.time[0] !== null &&
                this.wkodMaster.time[1] !== null
              ) {
                let fromTime = this.wkodMaster.time[0].split(':');
                let toTime = this.wkodMaster.time[1].split(':');

                let hDiff =
                  this.$_.parseInt(toTime[0]) - this.$_.parseInt(fromTime[0]);
                let mDiff =
                  this.$_.parseInt(toTime[1]) - this.$_.parseInt(fromTime[1]);

                if ((hDiff === 9 && mDiff > 0) || hDiff > 9) {
                  window.getApp.$emit('ALERT', {
                    title: 'L0000003395',
                    // 작업시간은 9시간을 넘길수 없습니다.
                    message: 'M0000000242',
                    type: 'warning',
                  });
                  valid = false;
                  resolve(false);
                  return;
                }
              } else {
                if (
                  !this.wkodMaster.time ||
                  this.wkodMaster.time[0] === null ||
                  this.wkodMaster.time[1] === null
                ) {
                  window.getApp.$emit('ALERT', {
                    title: 'L0000003395' /* 안내 */,
                    message: 'M0000000465', // 작업시간을 입력해주세요.
                    type: 'warning', // success / info / warning / error
                  });
                  resolve(false);
                  return false;
                }
                window.getApp.$emit('APP_VALID_ERROR', 'M0000000005');
                valid = false;
                resolve(false);
              }
              if (valid) {
                let start = this.$comm.moment(
                  new Date(this.wkodMaster.workStartTime.split('-').join('/'))
                );
                let end = this.$comm.moment(
                  new Date(this.wkodMaster.workEndTime.split('-').join('/'))
                );
                let ms = this.$comm
                  .moment(end, 'YYYY-MM-SS HH:mm')
                  .diff(start, 'YYYY-MM-SS HH:mm');
                if (ms < 0) {
                  window.getApp.$emit('ALERT', {
                    title: 'L0000003395',
                    // 작업종료시간이 작업시작시간보다 작을 수 없습니다.
                    message: 'M0000000244',
                    type: 'warning',
                  });
                  resolve(false);
                  return;
                }
              }

              if (valid && flag === 'approval') {
                if (
                  !this.wkodMaster.wkodSubconnWorkers ||
                  this.wkodMaster.wkodSubconnWorkers.length === 0
                ) {
                  window.getApp.$emit('ALERT', {
                    title: 'L0000003395',
                    // 근로자를 한 명이상 추가해주세요.
                    message: 'M0000000245',
                    type: 'warning',
                  });
                  valid = false;
                  resolve(false);
                }
              }
              if (valid) {
                this.wkodMaster.wkodKinds = [];
                if (
                  this.wkodMaster.wkodKindSaves &&
                  this.wkodMaster.wkodKindSaves.length > 0
                ) {
                  this.$_.forEach(this.wkodMaster.wkodKindSaves, (item) => {
                    this.wkodMaster.wkodKinds.splice(0, 0, {
                      wkodKindCd: item.code,
                    });
                  });
                }
                this.wkodMaster.workStartTime = this.wkodMaster.time[0];
                this.wkodMaster.workEndTime = this.wkodMaster.time[1];
                this.wkodMaster.updateUserId = this.$store.getters.token;
                this.wkodMaster.createUserId = this.$store.getters.token;

                // 모든 유효성검증 통과 후
                this.$http.url = transactionConfig.saf.wkodMaster.edit.url;
                this.$http.param = this.wkodMaster;
                this.$http.type = 'PUT';
                this.$http.request(
                  (_result) => {
                    resolve(true);
                  },
                  (_error) => {
                    resolve(false);
                  }
                );
              }
            } else {
              resolve(false);
              if (this.checkRequiredInput() === true) {
                window.getApp.$emit('APP_VALID_ERROR', 'M0000000005');
              }
            }
          })
          .catch((_error) => {
            resolve(false);
            window.getApp.$emit('APP_VALID_ERROR', _error.message);
            this.isSave = false;
          });
      });
    },
    checkValidator(flag) {
      this.$validator
        .validateAll()
        .then((_result) => {
          if (_result) {
            let valid = true;
            // 공사 정보를 직접 입력하는 경우
            if (this.selfConstSafeCheck) {
              if (
                !this.wkodMaster.period ||
                this.wkodMaster.period.length === 0
              ) {
                window.getApp.$emit('ALERT', {
                  title: 'L0000003395',
                  // 작업기간을 입력하세요.
                  message: 'M0000000239',
                  type: 'warning', // success / info / warning / error
                });
                return;
              }
              if (!this.wkodMaster.constTitle) {
                window.getApp.$emit('ALERT', {
                  title: 'L0000003395',
                  // 작업명을 입력하세요.
                  message: 'M0000000240',
                  type: 'warning', // success / info / warning / error
                });
                return;
              }
              if (!this.wkodMaster.constContent) {
                window.getApp.$emit('ALERT', {
                  title: 'L0000003395',
                  // 공사내용을 입력하세요.
                  message: 'M0000000241',
                  type: 'warning', // success / info / warning / error
                });
                return;
              }
            }
            if (
              valid &&
              this.wkodMaster.time.length === 2 &&
              this.wkodMaster.time[0] !== null &&
              this.wkodMaster.time[1] !== null
            ) {
              let fromTime = this.wkodMaster.time[0].split(':');
              let toTime = this.wkodMaster.time[1].split(':');

              let hDiff =
                this.$_.parseInt(toTime[0]) - this.$_.parseInt(fromTime[0]);
              let mDiff =
                this.$_.parseInt(toTime[1]) - this.$_.parseInt(fromTime[1]);

              if ((hDiff === 9 && mDiff > 0) || hDiff > 9) {
                window.getApp.$emit('ALERT', {
                  title: 'L0000003395',
                  // 작업시간은 9시간을 넘길수 없습니다.
                  message: 'M0000000242',
                  type: 'warning',
                });
                valid = false;
              }
            } else {
              if (
                !this.wkodMaster.time ||
                this.wkodMaster.time[0] === null ||
                this.wkodMaster.time[1] === null
              ) {
                window.getApp.$emit('ALERT', {
                  title: 'L0000003395' /* 안내 */,
                  message: 'M0000000465', // 작업시간을 입력해 주세요.
                  type: 'warning', // success / info / warning / error
                });
                return false;
              }
              window.getApp.$emit('APP_VALID_ERROR', 'M0000000005');
              valid = false;
            }
            if (valid) {
              let start = this.$comm.moment(
                new Date(this.wkodMaster.workStartTime.split('-').join('/'))
              );
              let end = this.$comm.moment(
                new Date(this.wkodMaster.workEndTime.split('-').join('/'))
              );
              let ms = this.$comm
                .moment(end, 'YYYY-MM-SS HH:mm')
                .diff(start, 'YYYY-MM-SS HH:mm');
              if (ms < 0) {
                window.getApp.$emit('ALERT', {
                  title: 'L0000003395',
                  // 작업종료시간이 작업시작시간보다 작을 수 없습니다.
                  message: 'M0000000244',
                  type: 'warning',
                });
                return;
              }
            }

            if (valid && flag === 'approval') {
              if (
                !this.wkodMaster.wkodSubconnWorkers ||
                this.wkodMaster.wkodSubconnWorkers.length === 0
              ) {
                window.getApp.$emit('ALERT', {
                  title: 'L0000003395',
                  // 근로자를 한 명이상 추가해주세요.
                  message: 'M0000000245',
                  type: 'warning',
                });
                valid = false;
              }
            }

            if (valid) {
              if (flag !== 'approval') {
                window.getApp.$emit('CONFIRM', {
                  title: 'L0000003321',
                  message: 'M0000000011',
                  type: 'info', // success / info / warning / error
                  // 확인 callback 함수
                  confirmCallback: () => {
                    // 공사기간
                    if (
                      this.wkodMaster.period &&
                      this.wkodMaster.period.length === 2
                    ) {
                      this.wkodMaster.constStartYmd = this.wkodMaster.period[0];
                      this.wkodMaster.constEndYmd = this.wkodMaster.period[1];
                    }

                    // 작업구분
                    this.wkodMaster.wkodKinds = [];
                    if (
                      this.wkodMaster.wkodKindSaves &&
                      this.wkodMaster.wkodKindSaves.length > 0
                    ) {
                      this.$_.forEach(this.wkodMaster.wkodKindSaves, (item) => {
                        this.wkodMaster.wkodKinds.splice(0, 0, {
                          wkodKindCd: item.code,
                        });
                      });
                    }

                    // 작업기간
                    this.wkodMaster.workStartTime = this.wkodMaster.time[0];
                    this.wkodMaster.workEndTime = this.wkodMaster.time[1];
                    this.wkodMaster.updateUserId = this.$store.getters.token;
                    this.wkodMaster.createUserId = this.$store.getters.token;

                    this.isSave = true;
                  },
                  // 취소 callback 함수
                  cancelCallback: () => {},
                });
              } else {
                this.wkodMaster.wkodKinds = [];
                if (
                  this.wkodMaster.wkodKindSaves &&
                  this.wkodMaster.wkodKindSaves.length > 0
                ) {
                  this.$_.forEach(this.wkodMaster.wkodKindSaves, (item) => {
                    this.wkodMaster.wkodKinds.splice(0, 0, {
                      wkodKindCd: item.code,
                    });
                  });
                }
                this.wkodMaster.workStartTime = this.wkodMaster.time[0];
                this.wkodMaster.workEndTime = this.wkodMaster.time[1];
                this.wkodMaster.updateUserId = this.$store.getters.token;
                this.wkodMaster.createUserId = this.$store.getters.token;

                this.isApproval = true;
                this.isSave = true;
              }
            }
          } else {
            if (this.checkRequiredInput() === true) {
              window.getApp.$emit('APP_VALID_ERROR', 'M0000000005');
            }
          }
        })
        .catch((_error) => {
          window.getApp.$emit('APP_VALID_ERROR', _error.message);
          this.isSave = false;
        });
    },
    checkRequiredInput() {
      if (!this.wkodMaster.workYmd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395' /* 안내 */,
          message: 'M0000001132', // 작업일자를 선택해주세요.
          type: 'warning', // success / info / warning / error
        });
        return false;
      }
      if (!this.wkodMaster.processCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395' /* 안내 */,
          message: 'M0000001133', // '작업공정을 선택해주세요.
          type: 'warning', // success / info / warning / error
        });
        return false;
      }
      if (!this.wkodMaster.workArea) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395' /* 안내 */,
          message: 'M0000001117', // 장소를 입력해주세요.
          type: 'warning', // success / info / warning / error
        });
        return false;
      }
      if (!this.wkodMaster.mapNo) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          // 작업위치를 선택하세요
          message: 'M0000000243',
          type: 'warning',
        });
        return false;
      }
      if (!this.wkodMaster.workTitle) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395' /* 안내 */,
          message: 'M0000000240', // 작업명을 입력하세요.
          type: 'warning', // success / info / warning / error
        });
        return false;
      }
      if (!this.wkodMaster.workContent) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395' /* 안내 */,
          message: 'M0000001135', // 작업내용을 입력해주세요.
          type: 'warning', // success / info / warning / error
        });
        return false;
      }
      if (!this.wkodMaster.pubDeptCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395' /* 안내 */,
          message: 'M0000001136', // 사용/운전부서를 선택해주세요.
          type: 'warning', // success / info / warning / error
        });
        return false;
      }
      if (!this.wkodMaster.subconnNm) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395' /* 안내 */,
          message: 'M0000000252', // 작업업체를 지정하세요.
          type: 'warning', // success / info / warning / error
        });
        return false;
      }
      if (!this.wkodMaster.coopDeptCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395' /* 안내 */,
          message: 'M0000001137', // 협조부서를 선택해주세요.
          type: 'warning', // success / info / warning / error
        });
        return false;
      }

      return true;
    },
    beforeOver() {
      this.$validator
        .validateAll()
        .then((_result) => {
          if (_result) {
            if (!this.wkodMaster.workOverTime) {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395',
                // 연장시간을 입력하세요.
                message: 'M0000000805',
                type: 'warning',
              });
              return;
            } else if (!this.wkodMaster.refRemark) {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395',
                // 연장사유를 입력하세요.
                message: 'M0000000246',
                type: 'warning',
              });
              return;
            }

            window.getApp.$emit('CONFIRM', {
              title: 'L0000003321',
              // 연장하시겠습니까?
              message: 'M0000000247',
              type: 'info',
              confirmCallback: () => {
                // this.wkodMaster.wkodStepCd = 'WKS07';

                this.wkodMaster.overUserId = this.$store.getters.token;
                this.wkodMaster.overUserNm = this.$store.getters.name;
                this.wkodMaster.overDeptNm = this.$store.getters.deptNm;
                this.wkodMaster.overDeptCd = this.$store.getters.deptCd;
                this.wkodMaster.updateUserId = this.$store.getters.token;

                this.isOver = true;
              },
            });
          } else {
            // TODO : 전역 성공 메시지 처리
            // 이벤트는 ./event.js 파일에 선언되어 있음
            window.getApp.$emit('APP_VALID_ERROR', 'M0000000005');
            // 필수 입력값을 입력해 주세요.
          }
        })
        .catch(() => {
          this.isOver = false;
        });
    },
    beforeCancel() {
      this.$validator
        .validateAll()
        .then((_result) => {
          if (_result) {
            window.getApp.$emit('CONFIRM', {
              title: 'L0000003321',
              // 취소하시겠습니까?
              message: 'M0000000249',
              type: 'info',
              confirmCallback: () => {
                // this.wkodMaster.wkodStepCd = 'WKS06';
                this.wkodMaster.updateUserId = this.$store.getters.token;

                this.isCancel = true;
              },
            });
          } else {
            // TODO : 전역 성공 메시지 처리
            // 이벤트는 ./event.js 파일에 선언되어 있음
            window.getApp.$emit('APP_VALID_ERROR', 'M0000000005');
          }
        })
        .catch(() => {
          this.isCancel = false;
        });
    },
    beforeComplete() {
      this.$validator
        .validateAll()
        .then((_result) => {
          if (_result) {
            window.getApp.$emit('CONFIRM', {
              title: 'L0000003321',
              // 작업완료하시겠습니까?
              message: 'M0000000248',
              type: 'info',
              confirmCallback: () => {
                // this.wkodMaster.wkodStepCd = 'WKS05';
                this.wkodMaster.updateUserId = this.$store.getters.token;

                this.isComplete = true;
              },
            });
          } else {
            // TODO : 전역 성공 메시지 처리
            // 이벤트는 ./event.js 파일에 선언되어 있음
            window.getApp.$emit('APP_VALID_ERROR', 'M0000000005');
          }
        })
        .catch(() => {
          this.isComplete = false;
        });
    },
    beforeDelete() {
      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321',
        // 삭제하시겠습니까?
        message: 'M0000000012',
        type: 'info',
        confirmCallback: () => {
          this.deleteValue = {
            data: this.wkodMaster,
          };
          this.isDelete = true;
        },
      });
    },
    getCollectable() {
      if (!this.wkodMaster.apprRqstNo || this.wkodMaster.apprRqstNo <= 0) {
        return;
      }

      this.$http.url = this.$format(
        selectConfig.manage.appr.getCollect.url,
        this.wkodMaster.apprRqstNo,
        this.$store.getters.token
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.collectCheck = _result.data;
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    btnCollectClickedCallback() {
      if (this.collectCheck) {
        this.$http.url = this.$format(
          this.collectUrl,
          this.wkodMaster.apprRqstNo
        );
        this.$http.type = 'PUT';

        this.$http.request(
          (_result) => {
            this.wkodMaster.apprRqstNo = 0;
            window.getApp.$emit('ALERT', {
              title: 'L0000003395',
              // 회수되었습니다.
              message: 'M0000000507',
              type: 'success', // success / info / warning / error
            });
            this.closeSndPopup();
          },
          (_error) => {
            this.$emit('APP_REQUEST_ERROR', _error);
          }
        );
      } else {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: 'M0000000506',
          type: 'warning', // success / info / warning / error
        });
        this.closeSndPopup();
      }
    },
    btnSaveClickedCallback(_result) {
      if (this.isApproval) {
        this.openApprPopup();
        this.isApproval = false;
      } else {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: 'M0000000006', // 저장되었습니다.
          type: 'success', // success / info / warning / error
        });
      }
      this.popupParam.wkodNo = _result.data;
      this.isSave = false;
      this.saveAttach();

      this.$comm.orderedPromise([
        // { func: this.getWkodChkItem },
        { func: this.getListPromise },
      ]);
    },
    btnOverClickedCallback(_result) {
      window.getApp.$emit('ALERT', {
        title: 'L0000003395',
        // 연장되었습니다.
        message: 'M0000000008',
        type: 'success', // success / info / warning / error
      });
      this.isOver = false;
      this.popupParam.wkodStepCd = 'WKS07';
      this.saveAttach();
      this.getList();
    },
    btnCancelClickedCallback(_result) {
      window.getApp.$emit('ALERT', {
        title: 'L0000003395',
        // 취소되었습니다.
        message: 'M0000000009',
        type: 'success', // success / info / warning / error
      });
      this.isCancel = false;
      this.popupParam.wkodStepCd = 'WKS06';
      this.getList();
    },
    btnCompleteClickedCallback(_result) {
      window.getApp.$emit('ALERT', {
        title: 'L0000003395',
        // 작업완료되었습니다.
        message: 'M0000000010',
        type: 'success', // success / info / warning / error
      });
      this.isComplete = false;
      this.popupParam.wkodStepCd = 'WKS05';
      this.$comm.orderedPromise([
        // { func: this.getWkodChkItem },
        { func: this.getListPromise },
      ]);
    },
    btnDeleteClickedCallback(_result) {
      window.getApp.$emit('ALERT', {
        title: 'L0000003395',
        // 삭제되었습니다.
        message: 'M0000000007',
        type: 'success',
      });
      this.closeSndPopup();
    },
    btnClickedErrorCallback(_result) {
      this.isSave = false;
      this.isDelete = false;
      this.isOver = false;
      this.isCancel = false;
      this.isComplete = false;
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    addGasOxygen() {
      const date = new Date();
      const row = {
        id: date.valueOf(),
        measTime: null,
        measPnt: '',
        gasKindNm: '',
        measRslt: '',
        measMan: '',
      };

      if ((this.YAuiGrid || null) === null) {
        this.YAuiGrid = this.$refs.yAuiGrid;
      }

      this.YAuiGrid.addRow(row);
    },
    deleteGasOxygen() {
      if (this.YAuiGrid.getCheckedRowItems().length === 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003321',
          // 하나 이상 선택하세요
          message: 'M0000000068',
          type: 'warning',
        });
        return;
      }
      let gridData = this.YAuiGrid.getGridData();
      const selectedRows = this.YAuiGrid.getCheckedRowItems().map(rows => rows.item);
      this.$_.forEach(selectedRows, (item) => {
        gridData = this.$_.reject(
          gridData,
          item
        );
      });
      this.YAuiGrid.setGridData(gridData);
    },
    // 공사 팝업 open
    btnSearchConstSafeClicked() {
      if (!this.editable) return;

      this.popupOptions.param = {
        constNo: '', // this.popupParam.constNo,
        showConstSafe: true,
        plantCd: this.wkodMaster.plantCd,
      };
      this.popupOptions.target = () =>
        import(`${'@/pages/constSafe/constSafeStatus/wkodKindVendor.vue'}`);
      this.popupOptions.title = 'L0000002369'; // 작업구분별 업체
      this.popupOptions.visible = true;
      this.popupOptions.width = '80%';
      this.popupOptions.top = '100px';
      this.popupOptions.closeCallback = this.closePopupSearchConstSafe;
    },
    closePopupSearchConstSafe(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;

      if (data && data.length > 0) {
        this.wkodMaster.plantCd = data[0].plantCd;
        this.setConstInfo(data);
      }
      // if (data.user) this.wkodMaster.pubMgrNm = data.user.userNm;
    },
    btnSearchEditConstSafeClicked() {
      this.selfConstSafeCheck = !this.selfConstSafeCheck;
      if (this.selfConstSafeCheck) {
        this.wkodMaster.subconnNm =
          this.$comm.getLangSpecInfoLabel('L0000002333');
      } else {
        this.wkodMaster.subconnNm = '';
      }
      this.wkodMaster.vendorCd = '';
      this.wkodMaster.constNum = '';
      this.wkodMaster.constTitle = '';
      this.wkodMaster.period = [];
      this.wkodMaster.constContent = '';
      this.wkodMaster.constStartYmd = '';
      this.wkodMaster.constEndYmd = '';
      this.wkodMaster.workerNumb = '';
      this.safInfoAttachFileGrps = [];
      this.wkodMaster.wkodLotos = [];
    },
    setConstInfo(data) {
      this.wkodMaster.plantCd = data[0].plantCd;
      this.wkodMaster.constNo = data[0].constNo;
      this.wkodMaster.constNum = data[0].constNum;
      this.wkodMaster.constTitle = data[0].constTitle;
      this.wkodMaster.constStartYmd = data[0].constStartYmd;
      this.wkodMaster.constEndYmd = data[0].constEndYmd;
      this.wkodMaster.period = [data[0].constStartYmd, data[0].constEndYmd];
      this.wkodMaster.constContent = data[0].constContent;
      this.wkodMaster.assessPlanNo = data[0].assessPlanNo;
      this.wkodMaster.assessNm = data[0].assessNm;

      // 허가서구분
      this.wkodMaster.wkodClsCd = data[0].attr1;

      if (this.safInfoAttachFileGrps.length > 0) {
        this.safInfoAttachFileGrps.splice(0, this.safInfoAttachFileGrps.length);
      }
      this.safInfoAttachFileGrps.splice(0, 0, {
        label: 'L0000003593', // 공사안전정보 첨부파일
        listType: 'text',
        drag: false,
        showFileSearch: false,
        editable: this.editable,
        disabled: !this.editable,
        onlyDownload: true,
        limit: 10,
        multiple: true,
        uploadTempFiles: null,
        taskClassNm: 'CONST_SAFETY_INFO',
        taskKey: this.wkodMaster.constNo,
        taskFlag: '',
        createUserId: this.$store.getters.token,
      });
      let i = 1;
      // 작업구분
      this.wkodMaster.wkodKindSaves.splice(
        0,
        this.wkodMaster.wkodKindSaves.length
      );

      // 공사정보에 해당하는 중복되지 않은 작업자인원을 구함
      let uniqSubconnWorkers = [];

      this.$_.forEach(data, (item) => {
        // 공사정보에 해당하는 중복되지 않은 작업자인원을 구함
        this.$_.forEach(item.constKindSubconnWorkers, (_item) => {
          if (
            !this.$_.find(uniqSubconnWorkers, (e) => e.userId === _item.userId)
          ) {
            uniqSubconnWorkers.push(_item);
          }
        });

        this.wkodMaster.wkodKindSaves.push({
          code: item.wkodKindCd,
          name: item.wkodKindNm,
        });
        // 작업구분이 추가될 때마다 안전관리계획서 첨부파일 컴포넌트를 생성

        this.safInfoAttachFileGrps.splice(i, 0, {
          label: this.$comm.getLangSpecInfoLabel('L0000001845', {
            s1: item.wkodKindNm,
          }),
          listType: 'text',
          drag: false,
          showFileSearch: false,
          editable: this.editable,
          disabled: true,
          onlyDownload: true,
          limit: 20,
          multiple: true,
          uploadTempFiles: null,
          taskClassNm: 'CONST_SAFE' + item.wkodKindCd + item.vendorCd,
          taskKey: this.wkodMaster.constNo + item.wkodKindCd + item.vendorCd,
          taskFlag: '',
          createUserId: this.$store.getters.token,
        });
      });

      // 탭을 누르지 않고 저장을 눌렀을 시 저장할 데이터 && 공사정보에 해당하는 중복되지 않은 작업자인원을 구함
      this.wkodMaster.wkodSubconnWorkers = uniqSubconnWorkers;
      this.wkodMaster.workerNumb = uniqSubconnWorkers.length;

      this.constKindSubconnNos = this.$_.map(data, 'constKindSubconnNo');
      this.constPlantChange = true;
      // }, 300);
      // 공사업체
      this.wkodMaster.vendorCd = data[0].vendorCd;
      this.wkodMaster.subconnNm = data[0].vendorNm;
      this.saveVendorCd = this.wkodMaster.vendorCd;
      this.selfConstSafeCheck = false;
    },
    btnAppr() {
      // 결재요청 하기 전 입력된 값을 저장합니다. 진행하시겠습니까?
      let message = 'M0000000250';
      if (
        this.wkodMaster.subconnNm !== 'L0000002333' && // 자체
        this.wkodMaster.vendorWriteYn === 'N'
      ) {
        // 아직 신청회사가 작성을 완료하지 않았습니다. 결재요청하시겠습니까?
        message = 'M0000000904';
      }
      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321',
        message: message,
        type: 'info',
        confirmCallback: () => {
          this.saveUrl = transactionConfig.saf.wkodMaster.edit.url;
          this.actionType = 'PUT';
          this.checkValidator('approval');
        },
        cancelCallback: () => {},
      });
    },
    openApprPopup() {
      this.popupOptions.target = () =>
        import(`${'@/pages/manage/appr/comApprRequest.vue'}`);
      this.popupOptions.title = 'L0000003418'; // 결재요청
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closeApprPop;
      this.popupOptions.width = '80%';
      this.popupOptions.param = {
        apprBizCd: 'CS-WO-01',
        apprParams: {
          wkodNo: this.wkodMaster.wkodNo,
        },
      };
    },
    closeApprPop(data) {
      if (data.resultFlag) {
        this.wkodMaster.apprRqstNo = data.apprRqstNo;
        this.collectCheck = true;
      }
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.$comm.orderedPromise([
        // { func: this.getWkodChkItem },
        { func: this.getListPromise },
      ]);
    },
    // 작업허가서 출력물 생성
    print() {
      let thisVue = this;
      let _comm = this.$comm;
      this.$http.url = this.$format(this.printUrl, this.popupParam.wkodNo); // BASE64를 UTF-8인코딩한 바이트로 다운받음 (그렇지 않으면 FRONT에서 JSON이 깨짐)
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          let fileOrgNm = '안전작업허가서_' + this.$comm.getToday() + '.pdf';
          var url = window.URL || window.webkitURL;
          let link = document.createElement('a');
          var blob = thisVue.$comm.base64ToBlob(_result.data);
          if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(blob, fileOrgNm);
          } else {
            let link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = fileOrgNm;
            link.click();
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    // 양식 생성 (가동 점검 양식, 중량물 공사 중 취급 작업계획서, JSA양식)
    templete(gubun) {
      let thisVue = this;
      let _comm = this.$comm;
      this.$http.url = this.$format(this.templeteUrl, gubun); // BASE64를 UTF-8인코딩한 바이트로 다운받음 (그렇지 않으면 FRONT에서 JSON이 깨짐)
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          let fileOrgNm = '';
          if (gubun === 1) {
            fileOrgNm = '가동전 점검표.hwp';
          } else if (gubun === 2) {
            fileOrgNm = '중량물작업계획서(양식).xlsx';
          } else if (gubun === 3) {
            fileOrgNm = '작업안전분석양식(JSA).hwp';
          }
          var url = window.URL || window.webkitURL;
          let link = document.createElement('a');
          var blob = thisVue.$comm.base64ToBlob(_result.data);
          if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(blob, fileOrgNm);
          } else {
            let link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = fileOrgNm;
            link.click();
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
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
    saveAttach() {
      // task_key 를 셋팅한다.
      this.$_.forEach(this.attachFileGrps, (item) => {
        item.taskKey = this.popupParam.wkodNo;
      });

      // 저장할 데이터가 있는 경우
      if (this.saveAttachFiles.length > 0) {
        this.submitObject.submitCheck = !this.submitObject.submitCheck;
      }
    },
    /** end button 관련 이벤트 **/
  },
};
</script>
