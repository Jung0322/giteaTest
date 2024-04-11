<!--
  목적 : 사고 등록/접수/조치결과
  Detail : 1. 등록 : 사고 등록 수정 화면으로 사고발생시 발생부서에서 등록.
               2. 접수 : 사고 등록 단계에서 요청된 사고를 접수 및 확인하고 조사여부 검토 후에 조사대상인 경우 조사계획을 세우고, 그 내역을 등록하는 화면.
               3. 조치 : 사고 조사결과를 등록하고 개선사항 발생시 개선요청하는 화면.
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
            <!-- 사고상세 -->
            <y-label
              label="L0000001395"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 결재요청 -->
              <y-btn
                v-if="
                  editable &&
                  completeable &&
                  !popupParam.apprFlag &&
                  this.popupParam.bizApprStepCd !== 'BAPSD' &&
                  popupParam.insertFlag !== 'newsflash'
                "
                title="L0000003418"
                color="black"
                @btnClicked="btnAppr"
              />
              <!-- 안전사고보고서출력 -->
              <y-btn
                v-if="popupParam.accidentStepCd === 'ACCS4' && editable"
                title="L0000001859"
                @btnClicked="printAccident"
              />
              <!-- 완료 -->
              <y-btn
                v-if="
                  popupParam.insertFlag === 'newsflash' &&
                  completeable &&
                  editable &&
                  !popupParam.apprFlag
                "
                :action-url="saveUrl"
                :param="accident"
                :is-submit="isComplete"
                title="L0000002039"
                color="black"
                action-type="PUT"
                beforeSubmit="beforeComplete"
                @beforeComplete="beforeComplete"
                @btnClicked="btnCompleteClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!-- 저장 -->
              <y-btn
                v-if="(insertable || updateMode) && editable"
                :action-url="saveUrl"
                :param="accident"
                :is-submit="isSave"
                title="L0000004986"
                color="orange"
                :action-type="actionType"
                beforeSubmit="beforeSave"
                @beforeSave="beforeSave"
                @btnClicked="btnSaveClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!-- 삭제 -->
              <y-btn
                v-if="deleteable && editable && !popupParam.apprFlag"
                color="red"
                title="L0000001495"
                @btnClicked="btnDeleteClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!-- 닫기 -->
              <y-btn
                v-if="!popupParam.apprFlag"
                title="L0000000881"
                @btnClicked="closePopup"
              />
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
                :disabled="plantDisabled"
                name="plantCd"
                v-model="accident.plantCd"
                v-validate="'required'"
                :state="validateState('plantCd')"
                @getPlantNm="getPlantNm"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 발행번호 -->
              <y-text
                :width="8"
                :disabled="true"
                :editable="editable"
                ui="bootstrap"
                label="L0000001103"
                name="accidentNum"
                v-model="accident.accidentNum"
              ></y-text>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
              <!-- 사고명 -->
              <y-text
                :width="10"
                :maxlength="150"
                :required="true"
                :disabled="disabled"
                :editable="editable"
                ui="bootstrap"
                label="L0000001390"
                name="setTitle"
                v-model="setTitle"
                v-validate="'required'"
                :state="validateState('setTitle')"
              ></y-text>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
              <b-row>
                <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
                  <!-- 보고자/보고일시 -->
                  <!-- 사번 -->
                  <y-text
                    :width="6"
                    :disabled="true"
                    :editable="editable"
                    ui="bootstrap"
                    label="L0000001247"
                    name="rptUserId"
                    placeholder="L0000001412"
                    v-model="accident.rptUserId"
                  ></y-text>
                </b-col>
                <b-col sm="2" md="2" lg="2" xl="2" class="col-xxl-2">
                  <!-- 성명 -->
                  <y-text
                    :width="12"
                    :disabled="true"
                    :editable="editable"
                    ui="bootstrap"
                    name="rptUserNm"
                    placeholder="L0000001630"
                    v-model="accident.rptUserNm"
                  ></y-text>
                </b-col>
                <b-col sm="2" md="2" lg="2" xl="2" class="col-xxl-2">
                  <!-- 소속부서명 -->
                  <y-text
                    :width="12"
                    :disabled="true"
                    :editable="editable"
                    ui="bootstrap"
                    name="rptDeptNm"
                    placeholder="L0000003653"
                    v-model="accident.rptDeptNm"
                  ></y-text>
                </b-col>
                <b-col sm="3" md="3" lg="3" xl="3" class="col-xxl-3">
                  <!-- 보고일시 -->
                  <y-text
                    :width="12"
                    :disabled="true"
                    :editable="editable"
                    ui="bootstrap"
                    name="rptDt"
                    placeholder="L0000001245"
                    v-model="accident.rptDt"
                  ></y-text>
                </b-col>
              </b-row>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 사고자구분 -->
              <y-multi-select
                :width="8"
                :comboItems="comboAccidentDivisionsItems"
                :needDefaultView="true"
                :disabled="disabled"
                :required="true"
                :editable="editable"
                v-model="tempAccKindCds"
                type="edit"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                label="L0000001403"
                name="tempAccKindCds"
                v-validate="'required'"
                :state="validateState('tempAccKindCds')"
              ></y-multi-select>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 사고종류 -->
              <y-multi-select
                :width="8"
                :comboItems="comboAccidentTypeItems"
                :needDefaultView="true"
                :disabled="disabled"
                :required="true"
                :editable="editable"
                v-model="tempAccidentTypes"
                type="edit"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                label="L0000001406"
                name="tempAccidentTypes"
                v-validate="'required'"
                :state="validateState('tempAccidentTypes')"
              ></y-multi-select>
            </b-col>
            <b-col v-if="isEtc" sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 사고종류 기타 -->
              <y-text
                :width="8"
                :maxlength="50"
                :required="true"
                :editable="editable"
                :disabled="disabled"
                ui="bootstrap"
                label="L0000003654"
                name="accidentTypeEtc"
                v-model="accident.accidentTypeEtc"
                v-validate="'required'"
                :state="validateState('accidentTypeEtc')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 발생일시 -->
              <y-datepicker
                :width="8"
                :required="true"
                :editable="editable"
                :disabled="disabled"
                label="L0000001079"
                type="datetime"
                :minuteStep="1"
                name="accidentDateTime"
                v-model="accident.accidentDateTime"
                v-validate="'required'"
                :state="validateState('accidentDateTime')"
                :clearable="true"
              ></y-datepicker>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 발생부서 -->
              <y-tree-dept
                :required="true"
                :editable="editable"
                :disabled="disabled"
                label="L0000001076"
                :plantCd="accident.plantCd"
                v-model="accident.deptCd"
                v-validate="'required'"
                :dtlNull="true"
                :state="validateState('deptCd')"
                @setDeptNm="setDeptNm"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 발생장소 -->
              <y-text
                :width="8"
                :maxlength="50"
                :required="true"
                :disabled="disabled"
                :editable="editable"
                ui="bootstrap"
                name="area"
                label="L0000001081"
                v-model="accident.area"
                v-validate="'required'"
                :state="validateState('area')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 공정상태 -->
              <y-select
                :width="8"
                :editable="editable"
                :disabled="disabled"
                :comboItems="comboProcessStatusCdItems"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                name="prcsStateCd"
                label="L0000000536"
                v-model="accident.prcsStateCd"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 날씨 -->
              <y-select
                :width="8"
                :required="true"
                :comboItems="comboWeatherItems"
                :disabled="disabled"
                :editable="editable"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                name="weatherCd"
                label="L0000000803"
                v-model="accident.weatherCd"
                v-validate="'required'"
                :state="validateState('weatherCd')"
              ></y-select>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 조치사항 -->
              <y-text
                :width="8"
                :maxlength="60"
                :disabled="disabled"
                :editable="editable"
                label="L0000002679"
                ui="bootstrap"
                name="firstAct"
                v-model="accident.firstAct"
              ></y-text>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
              <!-- 기타 -->
              <y-textarea
                :width="10"
                :maxlength="300"
                :disabled="disabled"
                :editable="editable"
                label="L0000000794"
                ui="bootstrap"
                name="etc"
                v-model="accident.etc"
              ></y-textarea>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
              <b-row>
                <b-col sm="2" md="2" lg="2" xl="2" class="col-xxl-2">
                  <!-- 사고개요 -->
                  <!-- '항목사용' -->
                  <y-label
                    label="L0000001384"
                    :required="true"
                    :editable="!disabled && editable"
                    :isCheck="!(popupParam.safAccidentNo > 0)"
                    :comboItems="contentItems"
                    @checkBoxChange="checkBoxChange"
                  />
                </b-col>
                <b-col sm="10" md="10" lg="10" xl="10" class="col-xxl-10">
                  <y-textarea
                    :width="12"
                    :editable="editable"
                    :maxlength="150"
                    :disabled="disabled"
                    :rows="7"
                    ui="bootstrap"
                    name="contents"
                    v-model="accident.contents"
                    v-validate="'required'"
                    :state="validateState('contents')"
                  ></y-textarea>
                </b-col>
              </b-row>
            </b-col>
            <!-- <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6 mb-3">
              <b-row>
                <b-col sm="2" md="2" lg="2" xl="2" class="col-xxl-2">
                  <y-label label="발생형태" :required="true" />
                </b-col>
                <b-col sm="10" md="10" lg="10" xl="10" class="col-xxl-10">
                  <el-cascader-panel
                    style="height:auto !important; margin-bottom: 0px"
                    :options="formOcuurItems"
                    :props="{ checkStrictly: true }"
                  ></el-cascader-panel>
                </b-col>
              </b-row>
            </b-col>-->
            <!-- 발생형태 -->
            <el-divider content-position="left">{{
              this.$comm.getLangSpecInfoLabel('L0000001082')
            }}</el-divider>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 대분류 -->
              <y-select
                :width="8"
                :comboItems="comboFormOcuurMainCategoryItems"
                :disabled="disabled"
                :editable="editable"
                :required="
                  popupParam.accidentStepCd === 'ACCS2' ||
                  popupParam.accidentStepCd === 'ACCS3' ||
                  popupParam.accidentStepCd === 'ACCS4'
                "
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                name="occKindCd"
                label="L0000000912"
                v-model="accident.occKindCd"
                v-validate="
                  popupParam.accidentStepCd === 'ACCS2' ||
                  popupParam.accidentStepCd === 'ACCS3' ||
                  popupParam.accidentStepCd === 'ACCS4'
                    ? 'required'
                    : ''
                "
                :state="
                  validateState(
                    popupParam.accidentStepCd === 'ACCS2' ||
                      popupParam.accidentStepCd === 'ACCS3' ||
                      popupParam.accidentStepCd === 'ACCS4'
                      ? 'occKindCd'
                      : ''
                  )
                "
              ></y-select>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 중분류 -->
              <y-select
                :width="8"
                :comboItems="comboFormOcuurCategoryItems"
                :disabled="disabled"
                :editable="editable"
                :required="
                  popupParam.accidentStepCd === 'ACCS2' ||
                  popupParam.accidentStepCd === 'ACCS3' ||
                  popupParam.accidentStepCd === 'ACCS4'
                "
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                label="L0000002729"
                name="occAttCd"
                v-model="accident.occAttCd"
                v-validate="
                  popupParam.accidentStepCd === 'ACCS2' ||
                  popupParam.accidentStepCd === 'ACCS3' ||
                  popupParam.accidentStepCd === 'ACCS4'
                    ? 'required'
                    : ''
                "
                :state="
                  validateState(
                    popupParam.accidentStepCd === 'ACCS2' ||
                      popupParam.accidentStepCd === 'ACCS3' ||
                      popupParam.accidentStepCd === 'ACCS4'
                      ? 'occAttCd'
                      : ''
                  )
                "
              ></y-select>
            </b-col>
            <!-- 사고원인 -->
            <el-divider
              v-if="
                popupParam.accidentStepCd !== 'ACCS0' &&
                (popupParam.accidentStepCd !== '' ||
                  popupParam.insertFlag !== 'newsflash')
              "
              content-position="left"
              >{{ this.$comm.getLangSpecInfoLabel('L0000001397') }}</el-divider
            >
            <b-col
              v-if="
                popupParam.accidentStepCd !== 'ACCS0' &&
                (popupParam.accidentStepCd !== '' ||
                  popupParam.insertFlag !== 'newsflash')
              "
              sm="6"
              md="6"
              lg="6"
              xl="6"
              class="col-xxl-3"
            >
              <!-- 직접원인 -->
              <y-select
                :width="8"
                :comboItems="comboProvDirectlyReasonItems"
                :disabled="disabled"
                :editable="editable"
                :required="
                  popupParam.accidentStepCd === 'ACCS2' ||
                  popupParam.accidentStepCd === 'ACCS3' ||
                  popupParam.accidentStepCd === 'ACCS4'
                "
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                name="immCauseCd"
                label="L0000002771"
                v-model="accident.immCauseCd"
                v-validate="
                  popupParam.accidentStepCd === 'ACCS2' ||
                  popupParam.accidentStepCd === 'ACCS3' ||
                  popupParam.accidentStepCd === 'ACCS4'
                    ? 'required'
                    : ''
                "
                :state="
                  validateState(
                    popupParam.accidentStepCd === 'ACCS2' ||
                      popupParam.accidentStepCd === 'ACCS3' ||
                      popupParam.accidentStepCd === 'ACCS4'
                      ? 'immCauseCd'
                      : ''
                  )
                "
              ></y-select>
            </b-col>
            <b-col
              v-if="
                popupParam.accidentStepCd !== 'ACCS0' &&
                (popupParam.accidentStepCd !== '' ||
                  popupParam.insertFlag !== 'newsflash')
              "
              sm="6"
              md="6"
              lg="6"
              xl="6"
              class="col-xxl-3"
            >
              <!-- 간접원인 -->
              <y-select
                :width="8"
                :comboItems="comboProvIndirectReasonItems"
                :disabled="disabled"
                :editable="editable"
                :required="
                  popupParam.accidentStepCd === 'ACCS2' ||
                  popupParam.accidentStepCd === 'ACCS3' ||
                  popupParam.accidentStepCd === 'ACCS4'
                "
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                name="indCauseCd"
                label="L0000000220"
                v-model="accident.indCauseCd"
                v-validate="
                  popupParam.accidentStepCd === 'ACCS2' ||
                  popupParam.accidentStepCd === 'ACCS3' ||
                  popupParam.accidentStepCd === 'ACCS4'
                    ? 'required'
                    : ''
                "
                :state="
                  validateState(
                    popupParam.accidentStepCd === 'ACCS2' ||
                      popupParam.accidentStepCd === 'ACCS3' ||
                      popupParam.accidentStepCd === 'ACCS4'
                      ? 'indCauseCd'
                      : ''
                  )
                "
              ></y-select>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
              <!-- 사고원인내용 -->
              <y-textarea
                :width="10"
                :maxlength="300"
                :disabled="disabled"
                :editable="editable"
                ui="bootstrap"
                label="L0000001398"
                name="causeContents"
                v-model="accident.causeContents"
              />
            </b-col>
            <!-- 피해정도 -->
            <el-divider
              v-if="
                popupParam.accidentStepCd !== 'ACCS0' &&
                (popupParam.accidentStepCd !== '' ||
                  popupParam.insertFlag !== 'newsflash')
              "
              content-position="left"
              >{{ this.$comm.getLangSpecInfoLabel('L0000003162') }}</el-divider
            >
            <b-col
              v-if="
                popupParam.accidentStepCd !== 'ACCS0' &&
                (popupParam.accidentStepCd !== '' ||
                  popupParam.insertFlag !== 'newsflash')
              "
              sm="6"
              md="6"
              lg="6"
              xl="6"
              class="col-xxl-3"
            >
              <!-- 사고분류 -->
              <y-select
                :width="8"
                :comboItems="comboAccidentClassItems"
                :disabled="disabled"
                :editable="editable"
                :required="
                  popupParam.accidentStepCd === 'ACCS2' ||
                  popupParam.accidentStepCd === 'ACCS3' ||
                  popupParam.accidentStepCd === 'ACCS4'
                "
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                name="accidentAttCd"
                label="L0000001394"
                v-model="accident.accidentAttCd"
                v-validate="
                  popupParam.accidentStepCd === 'ACCS2' ||
                  popupParam.accidentStepCd === 'ACCS3' ||
                  popupParam.accidentStepCd === 'ACCS4'
                    ? 'required'
                    : ''
                "
                :state="
                  validateState(
                    popupParam.accidentStepCd === 'ACCS2' ||
                      popupParam.accidentStepCd === 'ACCS3' ||
                      popupParam.accidentStepCd === 'ACCS4'
                      ? 'accidentAttCd'
                      : ''
                  )
                "
              ></y-select>
            </b-col>
            <b-col
              v-if="
                popupParam.accidentStepCd !== 'ACCS0' &&
                (popupParam.accidentStepCd !== '' ||
                  popupParam.insertFlag !== 'newsflash')
              "
              sm="6"
              md="6"
              lg="6"
              xl="6"
              class="col-xxl-3"
            >
              <!-- 사고등급 -->
              <y-select
                :width="8"
                :comboItems="comboAccidentLevlItems"
                :disabled="disabled"
                :editable="editable"
                :required="
                  popupParam.accidentStepCd === 'ACCS2' ||
                  popupParam.accidentStepCd === 'ACCS3' ||
                  popupParam.accidentStepCd === 'ACCS4'
                "
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                label="L0000001389"
                name="accidentLvlCd"
                v-model="accident.accidentLvlCd"
                v-validate="
                  popupParam.accidentStepCd === 'ACCS2' ||
                  popupParam.accidentStepCd === 'ACCS3' ||
                  popupParam.accidentStepCd === 'ACCS4'
                    ? 'required'
                    : ''
                "
                :state="
                  validateState(
                    popupParam.accidentStepCd === 'ACCS2' ||
                      popupParam.accidentStepCd === 'ACCS3' ||
                      popupParam.accidentStepCd === 'ACCS4'
                      ? 'accidentLvlCd'
                      : ''
                  )
                "
              ></y-select>
            </b-col>
            <b-col
              v-if="
                popupParam.accidentStepCd !== 'ACCS0' &&
                (popupParam.accidentStepCd !== '' ||
                  popupParam.insertFlag !== 'newsflash')
              "
              sm="12"
              md="12"
              lg="12"
              xl="12"
              class="col-xxl-6"
            >
              <!-- 물적피해 -->
              <y-text
                :width="10"
                :maxlength="300"
                :disabled="disabled"
                :editable="editable"
                :showMaxLength="false"
                :required="
                  popupParam.accidentStepCd === 'ACCS2' ||
                  popupParam.accidentStepCd === 'ACCS3' ||
                  popupParam.accidentStepCd === 'ACCS4'
                "
                ui="bootstrap"
                label="L0000001052"
                name="matDamage"
                v-model="accident.matDamage"
                v-validate="
                  popupParam.accidentStepCd === 'ACCS2' ||
                  popupParam.accidentStepCd === 'ACCS3' ||
                  popupParam.accidentStepCd === 'ACCS4'
                    ? 'required'
                    : ''
                "
                :state="
                  validateState(
                    popupParam.accidentStepCd === 'ACCS2' ||
                      popupParam.accidentStepCd === 'ACCS3' ||
                      popupParam.accidentStepCd === 'ACCS4'
                      ? 'matDamage'
                      : ''
                  )
                "
              />
            </b-col>
            <b-col
              v-if="
                popupParam.accidentStepCd !== 'ACCS0' &&
                (popupParam.accidentStepCd !== '' ||
                  popupParam.insertFlag !== 'newsflash')
              "
              sm="12"
              md="12"
              lg="12"
              xl="12"
              class="col-xxl-6"
            >
              <!-- 인적피해 -->
              <y-text
                :width="10"
                :maxlength="300"
                :showMaxLength="false"
                :disabled="disabled"
                :editable="editable"
                :required="
                  popupParam.accidentStepCd === 'ACCS2' ||
                  popupParam.accidentStepCd === 'ACCS3' ||
                  popupParam.accidentStepCd === 'ACCS4'
                "
                ui="bootstrap"
                label="L0000002236"
                name="humanDamage"
                v-model="accident.humanDamage"
                v-validate="
                  popupParam.accidentStepCd === 'ACCS2' ||
                  popupParam.accidentStepCd === 'ACCS3' ||
                  popupParam.accidentStepCd === 'ACCS4'
                    ? 'required'
                    : ''
                "
                :state="
                  validateState(
                    popupParam.accidentStepCd === 'ACCS2' ||
                      popupParam.accidentStepCd === 'ACCS3' ||
                      popupParam.accidentStepCd === 'ACCS4'
                      ? 'humanDamage'
                      : ''
                  )
                "
              />
              <!-- <y-select
                :width="8"
                :comboItems="comboPersonDamageItems"
                :disabled="disabled"
                :editable="editable"
                :required="popupParam.accidentStepCd === 'ACCS3' || popupParam.accidentStepCd === 'ACCS4'"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                name="humanDamageCd"
                label="인적피해"
                v-model="accident.humanDamageCd"
                v-validate="'required'"
                :state="validateState(popupParam.accidentStepCd === 'ACCS3' || popupParam.accidentStepCd === 'ACCS4' ? 'occKindCd' : '')"
              ></y-select>-->
            </b-col>
            <!-- 기인물/가해물 -->
            <el-divider
              v-if="
                popupParam.accidentStepCd !== 'ACCS0' &&
                (popupParam.accidentStepCd !== '' ||
                  popupParam.insertFlag !== 'newsflash')
              "
              content-position="left"
              >{{ this.$comm.getLangSpecInfoLabel('L0000000782') }}</el-divider
            >
            <b-col
              v-if="
                popupParam.accidentStepCd !== 'ACCS0' &&
                (popupParam.accidentStepCd !== '' ||
                  popupParam.insertFlag !== 'newsflash')
              "
              sm="6"
              md="6"
              lg="6"
              xl="6"
              class="col-xxl-3"
            >
              <!-- 기인물 -->
              <y-select
                :width="8"
                :comboItems="comboOriginMatCdItems"
                :disabled="disabled"
                :editable="editable"
                :required="
                  popupParam.accidentStepCd === 'ACCS2' ||
                  popupParam.accidentStepCd === 'ACCS3' ||
                  popupParam.accidentStepCd === 'ACCS4'
                "
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                name="originMatCd"
                label="L0000000781"
                v-model="accident.originMatCd"
                v-validate="
                  popupParam.accidentStepCd === 'ACCS2' ||
                  popupParam.accidentStepCd === 'ACCS3' ||
                  popupParam.accidentStepCd === 'ACCS4'
                    ? 'required'
                    : ''
                "
                :state="
                  validateState(
                    popupParam.accidentStepCd === 'ACCS2' ||
                      popupParam.accidentStepCd === 'ACCS3' ||
                      popupParam.accidentStepCd === 'ACCS4'
                      ? 'originMatCd'
                      : ''
                  )
                "
              ></y-select>
            </b-col>
            <b-col
              v-if="
                popupParam.accidentStepCd !== 'ACCS0' &&
                (popupParam.accidentStepCd !== '' ||
                  popupParam.insertFlag !== 'newsflash')
              "
              sm="6"
              md="6"
              lg="6"
              xl="6"
              class="col-xxl-3"
            >
              <!-- 가해물 -->
              <y-select
                :width="8"
                :comboItems="comboAssMatCdItems"
                :disabled="disabled"
                :editable="editable"
                :required="
                  popupParam.accidentStepCd === 'ACCS2' ||
                  popupParam.accidentStepCd === 'ACCS3' ||
                  popupParam.accidentStepCd === 'ACCS4'
                "
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                name="assMatCd"
                label="L0000000219"
                v-model="accident.assMatCd"
                v-validate="
                  popupParam.accidentStepCd === 'ACCS2' ||
                  popupParam.accidentStepCd === 'ACCS3' ||
                  popupParam.accidentStepCd === 'ACCS4'
                    ? 'required'
                    : ''
                "
                :state="
                  validateState(
                    popupParam.accidentStepCd === 'ACCS2' ||
                      popupParam.accidentStepCd === 'ACCS3' ||
                      popupParam.accidentStepCd === 'ACCS4'
                      ? 'assMatCd'
                      : ''
                  )
                "
              ></y-select>
            </b-col>
            <!-- <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
              <y-textarea
                :width="10"
                :maxlength="600"
                :disabled="disabled"
                :editable="editable"
                ui="bootstrap"
                label="비상조치 내용 및 평가"
                name="bgnMeas"
                v-model="accident.bgnMeas"
              />
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
              <y-textarea
                :width="10"
                :maxlength="600"
                :disabled="disabled"
                :editable="editable"
                ui="bootstrap"
                label="사고원인"
                name="provReason"
                v-model="accident.provReason"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-select
                :width="8"
                :comboItems="comboCauTypeItems"
                :disabled="disabled"
                :required="true"
                :editable="editable"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                label="원인유형"
                name="cauTypeCd"
                v-model="accident.cauTypeCd"
                v-validate="'required'"
                :state="validateState('cauTypeCd')"
              >
              </y-select>
            </b-col>
            <b-col v-if="isEtcCau" sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-text
              :width="8"
              :maxlength="50"
              :disabled="disabled"
              :editable="editable"
              ui="bootstrap"
              label="원인유형 기타"
              name="cauTypeEtc"
              v-model="accident.cauTypeEtc"
              />
            </b-col>-->
          </b-row>
        </b-card>
      </b-col>
    </b-row>
    <b-row class="mt-3"></b-row>
    <el-tabs type="border-card" v-model="tabIndex" @tab-click="tabClick">
      <el-tab-pane
        v-for="(item, i) in tabItems"
        :key="i"
        stretch
        class="default-tab-pane"
        :name="i.toString()"
      >
        <span slot="label">
          <i class="el-icon-date"></i>
          {{ $comm.getLangSpecInfoLabel(item.title) }}
        </span>
      </el-tab-pane>
      <keep-alive>
        <component
          v-if="component"
          :is="component"
          :research="research"
          :disabled="disabled"
          :tempAccKindCds.sync="tempAccKindCds"
          :accidentDetail.sync="accident"
          :immCauseNm="immCauseNm"
          :indCauseNm="indCauseNm"
          :tabParam.sync="tabParam"
          :tabIndex="tabIndexParam"
          :submitObject="submitObject"
          :attachFileGrps="attachFileGrps"
          :saveAttachFiles="saveAttachFiles"
          :accidentSubmitObject="accidentSubmitObject"
          :accidentAttachFileGrps="accidentAttachFileGrps"
          :saveAccidentAttachFiles="saveAccidentAttachFiles"
          @changeUploadFiles="changeUploadFiles"
          @setTempDeleteFiles="setTempDeleteFiles"
          @changeAccidentUploadFiles="changeAccidentUploadFiles"
          @setAccidentTempDeleteFiles="setAccidentTempDeleteFiles"
          @closePopup="closePopup2"
        />
      </keep-alive>
    </el-tabs>
    <y-dialog :param="popupOptions"></y-dialog>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
export default {
  /* attributes: name, components, props, data */
  name: 'y-accident-detail',
  props: {
    popupParam: {
      type: Object,
      default: {
        safAccidentNo: 0, // 사내사고번호
        accidentStepCd: '', // 사내사고진행단계
        insertFlag: '', // 신규등록 플래그 (newsflash: 속보, occur: 등록)
        tabIndex: 0,
        investYn: '', // 사고조사대상 여부
        apprFlag: false,
        apprRqstNo: 0,
      },
    },
  },
  data: () => ({
    accident: {
      safAccidentNo: 0, // 사내사고번호
      plantCd: null,
      plantNm: '',
      accidentTitle: '', // 사고명
      accidentNum: '', // 발행번호
      accidentStepCd: '', // 사내사고진행단계
      accidentDateTime: null,
      accidentYmd: '', // 발생일
      accidentHour: '', // 발생시
      accidentMinute: '', // 발생분
      deptCd: '', // 발생부서코드
      deptNm: '',
      area: '', // 발생장소
      weatherCd: null, // 날씨코드
      accidentTypeEtc: '', // 사고유형기타

      rptUserId: '', // 보고자사번
      rptUserNm: '', // 보고자성명
      rptDeptCd: '', // 보고자소속코드
      rptDeptNm: '', // 보고자소속명
      rptOfficeTel: '', // 보고자사무실전화번호
      rptDt: '', // 보고일시

      contents: '', // 사고발생내용
      provReason: '', // 추정원인
      cauTypeCd: null, // 원인유형코드
      cauTypeEtc: '', // 원인유형기타
      bgnMeas: '', // 초기대책

      accidentTypes: [], // 사고유형

      investYn: '', // 사고조사대상 여부

      detailDamageDesc: '', // 상세피해내용

      humanInjuryCd: '', // 인적피해_상해정도
      humanInjuryDesc: '', // 인적피해내용

      dirLossAmount: '', // 물적피해직접손실액
      indirLossAmount: '', // 물적피해간접손실액
      matDamageDesc: '', // 물적피해내용

      drainLeak: '', // 환경피해_수계누출량
      etcLeak: '', // 환경피해_그외누출량
      envDamageDesc: '', // 환경피해내용

      noAccidentYn: 'N', // 무재해영향여부
      noAccidentDeptYn: 'N', // 무재해영향여부
      accidentLvlCd: '', // 사고피해레벨코드

      originMatCd: '', // 기인물
      assMatCd: '', // 가해물

      outCompanyData: [], // 상해자(당사)
      partenersData: [], // 상해자(협력업체)

      expectCureDay: 0,
      workLostDay: 0,

      toxiYn: '', // 독성여부
      accidentFacility: [], // 사내사고 설비
      accidentChemprod: [], // 사내사고 물질

      s1ApprRqstNo: 0, // 등록결재
      s2ApprRqstNo: 0, // 접수결재
      s3ApprRqstNo: 0, // 결과결재

      // 조사계획
      accidentInvest: {
        leaderUserId: '', // 리더 사번
        leaderUserNm: '', // 리더 성명
        leaderDeptCd: '', // 리더 소속부서코드
        leaderDeptNm: '', // 리더 소속부서명
        leaderOfficeTel: '', // 리더 사무실전화번호
        leaderSelYmd: '', // 리더 선정일

        faciUserId: '', // 사고조사 Facilitator 사번
        faciUserNm: '', // 사고조사 Facilitator 성명
        faciDeptCd: '', // 사고조사 Facilitator 부서코드
        faciDeptNm: '', // 사고조사 Facilitator 부서명

        investPlan: '', // 조사계획
        investStartYmd: '', // 조사기간시작일
        investEndYmd: '', // 조사기간종료일
        period: [],
        investMethod: '', // 조사방법
      },
      accidentInvestPsns: [], // 조사인원 데이터
      accidentRefPsns: [], // 사고 관계자 정보

      tabIndex: 0,
      occKindCd: null,
      occAttCd: null,
      immCauseCd: '', // 직접원인
      indCauseCd: '', // 간접원인
      causeContents: '',
      firstAct: '',
      accKindCds: [],
      etc: '',
      accidentAttCd: null,
      humanDamage: null,
      matDamage: '',
      prcsStateCd: null,
    },
    popupOptions: {
      target: null,
      title: '',
      visible: false,
      param: null,
      width: '90%',
      top: '10px',
      closeCallback: null,
    },
    immCauseNm: '',
    indCauseNm: '',
    // TODO : 현재까지 파악된 바로는 tab은 같은 폴더 또는 하위 폴더의 컴포넌트만 접근이 가능한 것으로 파악됨
    //                즉, 반드시 메인페이지 역할을 하는 vue와 동일 폴더나 하위 폴더에 tabItem 역할을 하는 vue 파일을 위치 시킬 것
    tabItems: [{ title: 'L0000000572', url: 'multiFileUpload' }], // 관련사진
    // 개선조치를 위한 변수
    tabParam: {
      imprClassCd: '',
      refTableId: 0,
      editable: true,
      detailCheck: true,
    },
    // 관련사진
    submitObject: {
      submitCheck: false,
    },
    saveAttachFiles: [],
    tempDeleteFiles: [],
    attachFileGrps: [],

    // 첨부파일
    accidentSubmitObject: {
      submitCheck: false,
    },
    saveAccidentAttachFiles: [],
    tempAccidentDeleteFiles: [],
    accidentAttachFileGrps: [],

    tabIndexParam: '',
    tempAccidentTypes: [],
    tempAccKindCds: [],

    comboAccidentDivisionsItems: [], // 사고구분
    comboAccidentClassItems: [], // 사고분류
    comboAccidentLevlItems: [], // 사고등급
    // comboPersonDamageItems: [], // 인적피해
    comboAssMatCdItems: [], // 가해물
    comboOriginMatCdItems: [], // 기인물
    contentItems: [],

    component: null,
    tabIndex: '-1',
    actionType: 'POST',
    isInsert: false,
    isSave: false,
    isComplete: false,
    insertable: false,
    editable: false,
    updateMode: false,
    deleteable: false,
    completeable: false,
    comboWeatherItems: [], // 날씨
    comboAccidentTypeItems: [], // 사고유형
    accidentTitle: '',
    accidentHourMinute: '', // 발생시분
    isEtc: false,
    searchDetailUrl: '',
    saveUrl: '',
    printUrl: '',
    disabled: false,
    plantDisabled: false,
    accidentReception: null,
    accidentReceptionPsn: [],
    uploadFiles: {
      data: [],
    },
    isFirst: true,
    isEtcCau: false,
    research: false,
    // tempCauTypeCd: '',
    comboCauTypeItems: [], // 원인유형
    comboProcessStatusCdItems: [], // 공정상태
    formOcuurItems: [],
    comboFormOcuurMainCategoryItems: [],
    comboFormOcuurCategoryItems: [],
    comboProvDirectlyReasonItems: [],
    comboProvIndirectReasonItems: [],
    currStepApprRqstNo: false,
    onAppr: false,
    companyEditable: false, // 전사 권한
    plantEditable: false, // 사업장 권한
    deptEditable: false, // 일반 권한
  }),
  computed: {
    /**
     * 2022.03.03 LHJ
     * 사고 조사결과단계일 경우 안전담당자, 시스템관리자, 전사담당자, 협력사개발도 수정 가능
     */
    isManager() {
      let userAuthGrps = this.$store.getters.userAuthGrps.filter(
        (auth) => auth.settingYn === 'Y'
      );

      let managerAuth = false;

      managerAuth =
        this.$comm.chkAuthGrp('2') ||
        this.$comm.chkAuthGrp('1090') ||
        this.$comm.chkAuthGrp('1021') | this.$comm.chkAuthGrp('1095');

      return managerAuth;
    },
    /**
     * 2022.01.05 LHJ
     * 신규등록인 경유 사고명은 사업장 + 발생부서 + 발생장소 + 대분류 + 사고  자동생성
     * 수정인 경우는 저장된 값으로 표출하도록 변경
     */
    setTitle() {
      if (this.accident.safAccidentNo) return this.accident.accidentTitle;
      let occKindNm = '';

      if (this.accident.occKindCd) {
        if (
          this.comboFormOcuurMainCategoryItems &&
          this.comboFormOcuurMainCategoryItems.length > 0
        ) {
          occKindNm =
            this.comboFormOcuurMainCategoryItems[
              this.$_.findIndex(this.comboFormOcuurMainCategoryItems, {
                code: this.accident.occKindCd,
              })
            ].codeNm + ' ';
        } else {
          occKindNm = '';
        }
      } else if (this.accident.occKindNm) {
        occKindNm = this.accident.occKindNm;
      } else {
        occKindNm = '';
      }
      let temp =
        (this.accident.plantNm ? this.accident.plantNm + ' ' : '') +
        (this.accident.deptNm ? this.accident.deptNm + ' ' : '') +
        (this.accident.area ? this.accident.area + ' ' : '') +
        occKindNm +
        (this.accident.formOcuur ? this.accident.formOcuur + ' ' : '') +
        '사고';

      return temp;
    },
  },

  watch: {
    tabIndex: function (newValue, oldValue) {
      this.loadComponent();
    },
    'accident.plantCd': function (newValue, oldValue) {},
    'accident.deptCd': function (newValue, oldValue) {},
    'accident.area': function (newValue, oldValue) {},
    'accident.occKindCd': function (newValue, oldValue) {
      this.$comm.getComboItems(newValue, false).then((_result) => {
        this.comboFormOcuurCategoryItems = _result;
        this.accident.occAttCd =
          this.$_.findIndex(this.comboFormOcuurCategoryItems, {
            code: this.accident.occAttCd,
          }) === -1
            ? null
            : this.accident.occAttCd;
      });
    },
    tempAccKindCds: function (newValue, oldValue) {
      if (newValue.length < oldValue.length) {
        window.getApp.$emit('CONFIRM', {
          title: 'L0000003321', // 확인
          message: 'M0000000673', // 해당 데이터가 제거됩니다. 진행하시겠습니까?
          type: 'info',
          // 확인 callback 함수
          confirmCallback: () => {},
          // 취소 callback 함수
          cancelCallback: () => {
            this.tempAccKindCds = oldValue;
          },
        });
      }
    },
    'accident.accidentAttCd': function (newValue, oldValue) {
      // 경상/중경상의 경우 사고등급 2
      // 중상해 / 중대재해의 경우 사고등급 3
      if (!this.isFirst || this.insertable) {
        if (
          this.accident.accidentAttCd === 'ACAT1' ||
          this.accident.accidentAttCd === 'ACAT2'
        ) {
          this.accident.accidentLvlCd = 'ALVL2';
        } else if (
          this.accident.accidentAttCd === 'ACAT3' ||
          this.accident.accidentAttCd === 'ACAT4'
        ) {
          this.accident.accidentLvlCd = 'ALVL3';
        }
      } else {
        this.isFirst = false;
      }
    },
    'accident.immCauseCd': function (newValue, oldValue) {
      if (this.comboProvDirectlyReasonItems) {
        let index = this.$_.findIndex(this.comboProvDirectlyReasonItems, {
          code: this.accident.immCauseCd,
        });
        if (index > -1) {
          this.immCauseNm = this.comboProvDirectlyReasonItems[index].codeNm;
        } else {
          this.immCauseNm = '';
        }
      } else {
        this.immCauseNm = !this.accident.immCauseNm
          ? ''
          : this.$_.clone(this.accident.immCauseNm);
      }
    },
    'accident.indCauseCd': function (newValue, oldValue) {
      if (this.comboProvIndirectReasonItems) {
        let index = this.$_.findIndex(this.comboProvIndirectReasonItems, {
          code: this.accident.indCauseCd,
        });
        if (index > -1) {
          this.indCauseNm = this.comboProvIndirectReasonItems[index].codeNm;
        } else {
          this.indCauseNm = '';
        }
      } else {
        this.indCauseNm = !this.accident.indCauseNm
          ? ''
          : this.$_.clone(this.accident.indCauseNm);
      }
    },
    tempAccidentTypes: function (newValue, oldValue) {
      if (!newValue) return;
      if (
        newValue.length > 0 &&
        this.$_.indexOf(this.$_.map(newValue, 'code'), 'OCC10') !== -1
      ) {
        this.isEtc = true;
      } else this.isEtc = false;
    },
  },
  //* Vue lifecycle: created, mounted, destroyed, etc */
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.editable = this.$route.meta.editable;
    // this.loadComponent();
  },
  mounted() {
    this.init();
  },
  beforeDestroy() {},
  //* methods */
  methods: {
    init() {
      if (this.popupParam.safAccidentNo) {
        this.plantDisabled = true;
      }
      this.searchDetailUrl = selectConfig.saf.accident.getOccur.url;
      this.printUrl = selectConfig.saf.accident.print.url;
      this.disabled =
        this.popupParam.accidentStepCd === 'ACCS4' ||
        this.popupParam.accidentStepCd === 'ACCS5';

      this.comboFormOcuurCategoryItems = [
        { code: null, codeNm: this.$comm.getLangSpecInfoLabel('L0000003394') }, // '선택하세요';
      ];
      this.contentItems = [
        { code: 'Y', codeNm: this.$comm.getLangSpecInfoLabel('L0000003209') },
      ];

      if (!this.popupParam.apprFlag) {
        this.setTab(this.popupParam.accidentStepCd, this.popupParam.investYn);
      }
      // Url Setting
      this.saveUrl = transactionConfig.saf.accident.edit.url;

      // 사고구분
      this.$comm.getComboItems('SAF_ACCIDENT_KIND').then((_result) => {
        this.comboAccidentDivisionsItems = _result;
      });
      // 사고유형
      this.$comm.getComboItems('SAF_OCC_TYPE').then((_result) => {
        this.comboAccidentTypeItems = _result;
      });
      // 공정상태
      this.$comm.getComboItems('SAF_PRCS_STATE', false).then((_result) => {
        this.comboProcessStatusCdItems = _result;
      });
      // 날씨
      this.$comm.getComboItems('SAF_WEATHER', false).then((_result) => {
        this.comboWeatherItems = _result;
      });
      // 대분류
      this.$comm
        .getComboItems('SAF_ACCIDENT_OCC_PTN_CLS', false)
        .then((_result) => {
          this.comboFormOcuurMainCategoryItems = _result;
        });
      // 사고직접원인
      this.$comm
        .getComboItems('SAF_ACCIDENT_IMM_CAUSE', false)
        .then((_result) => {
          this.comboProvDirectlyReasonItems = _result;
        });
      // 사고간접원인
      this.$comm
        .getComboItems('SAF_ACCIDENT_IND_CAUSE', false)
        .then((_result) => {
          this.comboProvIndirectReasonItems = _result;
        });
      // 기인물
      this.$comm
        .getComboItems('SAF_ACCIDENT_ORGIN_MAT', false)
        .then((_result) => {
          this.comboOriginMatCdItems = _result;
        });
      // 가해물
      this.$comm
        .getComboItems('SAF_ACCIDENT_ASS_MAT', false)
        .then((_result) => {
          this.comboAssMatCdItems = _result;
        });
      // 사고분류
      this.$comm.getComboItems('SAF_ACCIDENT_ATT', false).then((_result) => {
        this.comboAccidentClassItems = _result;
      });
      // 사고등급
      this.$comm.getComboItems('SAF_ACCIDENT_LVL', false).then((_result) => {
        this.comboAccidentLevlItems = _result;
      });

      // 권한별 컨트롤 처리
      if (this.$comm.isCompanyGrp()) {
        // 전사권한
        this.companyEditable = true;
        this.plantEditable = true;
        this.deptEditable = true;
      } else if (this.$comm.isPlantGrp()) {
        // 사업장권한
        this.plantEditable = true;
        this.deptEditable = true;
      }

      this.getList();
      setTimeout(() => {
        if (this.popupParam.tabIndex) {
          this.tabIndex = this.popupParam.tabIndex.toString();
        } else {
          this.tabIndex = '0';
          // this.component = () =>
          //   import('@/pages/common/attachFile/multiFileUpload');
        }
      }, 100);
    },
    apprSave() {
      return new Promise((resolve) => {
        this.onAppr = true;
        this.saveCheckResult(0).then(() => {
          if (!this.onAppr) {
            resolve(false);
            return;
          }

          this.$http.url = this.saveUrl;
          this.$http.param = this.accident;
          this.$http.type = 'PUT';
          this.$http.request(
            (_result) => {
              this.isEdit = false;

              this.isSave = false;
              this.completeable = true;
              this.deleteable = true;
              this.insertable = false;
              this.updateMode = true;
              this.research = !this.research;
              this.saveAttach();
              resolve(true);
            },
            (_error) => {
              resolve(false);
            }
          );
        });
      });
    },
    loadComponent() {
      var path = this.tabItems[this.$_.parseInt(this.tabIndex)].url;
      if (path === 'fileUploadPage') {
        this.component = () => import('@/pages/saf/imprAct/fileUploadPage');
      } else if (path === 'multiFileUpload') {
        this.component = () =>
          import('@/pages/common/attachFile/multiFileUpload');
      } else if (path === 'imprActTab') {
        this.component = () => import('@/pages/impr/imprActTabSample');
      } else this.component = () => import(`${path}`);
    },
    /**
     * 자식 페이지에 넘길 paneName 정보 업데이트
     * tab 클릭시 마다
     * tab : 클릭한 tab 정보
     */
    tabClick(tab) {
      var nowDate = new Date();
      this.tabIndexParam = nowDate.getMilliseconds();
    },
    getPlantNm(plantNm) {
      this.accident.plantNm = plantNm;
    },
    setTab(accidentStepCd, investYn) {
      // 사고진행단계에 따른 title setting
      switch (accidentStepCd) {
        // 사고속보
        case 'ACCS0':
          this.insertable = false;
          this.updateMode = true;
          this.deleteable = true;
          this.completeable = true;
          break;
        // 사고등록
        case 'ACCS1':
          this.tabItems.splice(1, 0, {
            title: 'L0000003655', // 사고자정보
            url: './accidentPersonDamage',
          });
          this.tabItems.splice(2, 0, {
            title: 'L0000001391', // 사고물질명 및 설비명
            url: './accidentItems',
          });
          this.tabItems.splice(3, 0, {
            title: 'L0000002843', // 첨부파일
            url: './accidentMultiFileUpload',
          });
          this.insertable = false;
          this.updateMode = true;
          this.deleteable = true;
          this.completeable = true;
          break;
        // 사고접수
        case 'ACCS2':
          this.tabItems.splice(1, 0, {
            title: 'L0000003655', // 사고자정보
            url: './accidentPersonDamage',
          });
          this.tabItems.splice(2, 0, {
            title: 'L0000001391', // 사고물질명 및 설비명
            url: './accidentItems',
          });
          this.tabItems.splice(3, 0, {
            title: 'L0000002644', // 조사계획
            url: './accidentInvest',
          });
          this.tabItems.splice(4, 0, {
            title: 'L0000003159', // 피해내역
            url: './accidentDamage',
          });
          this.tabItems.splice(5, 0, {
            title: 'L0000002843', // 첨부파일
            url: './accidentMultiFileUpload',
          });
          this.insertable = false;
          this.updateMode = true;
          this.deleteable = true;
          this.completeable = true;
          break;
        // 사고 조사결과
        case 'ACCS3':
          this.tabItems.splice(1, 0, {
            title: 'L0000003655', // 사고자정보
            url: './accidentPersonDamage',
          });
          this.tabItems.splice(2, 0, {
            title: 'L0000001391', // 사고물질명 및 설비명
            url: './accidentItems',
          });
          this.tabItems.splice(3, 0, {
            title: 'L0000002644', // 조사계획
            url: './accidentInvest',
          });
          this.tabItems.splice(4, 0, {
            title: 'L0000003159', // 피해내역
            url: './accidentDamage',
          });
          this.tabItems.splice(5, 0, {
            title: 'L0000002642', // 조사결과
            url: './accidentCauseMeasures',
          });
          this.tabItems.splice(6, 0, {
            title: 'L0000000259',
            url: 'imprActTab',
          }); // 개선사항
          this.tabItems.splice(7, 0, {
            title: 'L0000002843', // 첨부파일
            url: './accidentMultiFileUpload',
          });
          // 개선조치를 위한 변수 Setting
          this.tabParam.imprClassCd = 'ICL01';
          this.tabParam.refTableId = this.popupParam.safAccidentNo;
          this.tabParam.editable = false;
          this.tabParam.detailCheck = false;
          this.insertable = false;
          this.updateMode = true;
          this.deleteable = true;
          this.completeable = true;
          break;
        // 사고조사완료
        case 'ACCS4':
        case 'ACCS5':
          this.tabItems.splice(1, 0, {
            title: 'L0000003655', // 사고자정보
            url: './accidentPersonDamage',
          });
          this.tabItems.splice(2, 0, {
            title: 'L0000001391', // 사고물질명 및 설비명
            url: './accidentItems',
          });
          this.tabItems.splice(3, 0, {
            title: 'L0000002644', // 조사계획
            url: './accidentInvest',
          });
          this.tabItems.splice(4, 0, {
            title: 'L0000003159', // 피해내역
            url: './accidentDamage',
          });
          // 조사팀이 꾸려지지 않고 사고완료가 되었을 시에 조사결과와 개선사항 탭은 보여주지 않는다.
          // 보여주지 않는 이유 : 조사팀이 꾸려지지 않았기에 조사결과와 그에 따른 개선사항을 입력할 수 없기에
          if (investYn === 'Y') {
            this.tabItems.splice(5, 0, {
              title: 'L0000002642', // 조사결과
              url: './accidentCauseMeasures',
            });
            this.tabItems.splice(6, 0, {
              title: 'L0000000259', // 개선사항
              url: 'imprActTab',
            });
          }
          this.tabItems.splice(7, 0, {
            title: 'L0000002843', // 첨부파일
            url: './accidentMultiFileUpload',
          });
          // 개선조치를 위한 변수 Setting
          this.tabParam.imprClassCd = 'ICL01';
          this.tabParam.refTableId = this.popupParam.safAccidentNo;
          this.tabParam.editable = false;
          this.tabParam.detailCheck = true;
          this.insertable = false;
          this.updateMode = false;
          this.deleteable = false;
          this.completeable = false;
          break;
        // 신규
        default:
          if (this.popupParam.insertFlag === 'occur') {
            this.tabItems.splice(1, 0, {
              title: 'L0000003655', // 사고자정보
              url: './accidentPersonDamage',
            });
            this.tabItems.splice(2, 0, {
              title: 'L0000001391', // 사고물질명 및 설비명
              url: './accidentItems',
            });
            this.tabItems.splice(3, 0, {
              title: 'L0000002843', // 첨부파일
              url: './accidentMultiFileUpload',
            });
          }
          this.insertable = true;
          this.updateMode = false;
          this.deleteable = false;
          this.completeable = false;
      }
    },

    /** 안전점검결과 목록 조회 **/
    getList() {
      if (
        !this.popupParam.safAccidentNo ||
        this.popupParam.safAccidentNo === 0
      ) {
        // 시 분 setting
        this.accident.accidentYmd = this.$comm.getToday(); // 발생일시
        this.accident.rptDt = this.$comm.getTodayDateTime(); // 보고일시

        this.accident.accidentHour = '10'; // 발생일시 시
        this.accident.accidentMinute = '15'; // 발생일시 분

        this.accident.rptUserId = this.$store.getters.token;
        this.accident.rptUserNm = this.$store.getters.name;
        this.accident.rptDeptCd = this.$store.getters.deptCd;
        this.accident.rptDeptNm = this.$store.getters.deptNm;
        this.setAttachFileGrps();
      } else {
        if (
          !this.popupParam.accidentStepCd ||
          this.popupParam.accidentStepCd === 'ACCS0' ||
          this.popupParam.accidentStepCd === 'ACCS1'
        ) {
          this.searchDetailUrl = selectConfig.saf.accident.getOccur.url;
        } else if (this.popupParam.accidentStepCd === 'ACCS2') {
          this.searchDetailUrl = selectConfig.saf.accident.getReception.url;
        } else if (this.popupParam.accidentStepCd === 'ACCS3') {
          this.searchDetailUrl = selectConfig.saf.accident.getResult.url;
        }
        this.$http.url = this.$format(
          this.searchDetailUrl,
          this.popupParam.safAccidentNo
        );
        this.$http.type = 'GET';
        this.$http.request(
          (_result) => {
            this.$_.extend(this.accident, _result.data);
            this.accident.accidentDateTime =
              this.accident.accidentYmd +
              ' ' +
              this.accident.accidentHour +
              ':' +
              this.accident.accidentMinute;
            // this.accident = this.$_.clone(_result.data);
            // this.accident.accidentYmd = _result.data.accidentYmd;
            // this.$forceUpdate();

            if (!this.popupParam.accidentStepCd) {
              this.setTab(this.accident.accidentStepCd, this.accident.investYn);
            }
            if (!this.popupParam.apprFlag) {
              // 결재요청 팝업으로 들어온 경우가 아닌 경우
              if (this.popupParam.insertFlag === 'newsflash') {
                // 사고 속보에서 온 경우 사고 속보만 수정가능
                if (this.accident.accidentStepCd === 'ACCS0') {
                  this.disabled = false;
                  this.tabParam.editable = false;
                  this.tabParam.detailCheck = false;
                } else {
                  this.disabled = true;
                  this.tabParam.editable = false;
                  this.tabParam.detailCheck = true;
                  this.completeable = false;
                  this.insertable = false;
                  this.updateMode = false;
                  this.deleteable = false;
                }
              } else if (this.popupParam.insertFlag === 'occur') {
                // 사고 등록에서 온 경우 사고 등록만 수정가능
                if (this.accident.accidentStepCd === 'ACCS1') {
                  this.disabled = false;
                  this.tabParam.editable = false;
                  this.tabParam.detailCheck = false;
                } else {
                  this.disabled = true;
                  this.tabParam.editable = false;
                  this.tabParam.detailCheck = true;
                  this.completeable = false;
                  this.insertable = false;
                  this.updateMode = false;
                  this.deleteable = false;
                }
              } else if (this.popupParam.insertFlag === 'reception') {
                // 사고 접수에서 온 경우 사고 접수만 수정가능
                if (this.accident.accidentStepCd === 'ACCS2') {
                  this.disabled = false;
                  this.tabParam.editable = false;
                  this.tabParam.detailCheck = false;
                } else {
                  this.disabled = true;
                  this.tabParam.editable = false;
                  this.tabParam.detailCheck = true;
                  this.completeable = false;
                  this.insertable = false;
                  this.updateMode = false;
                  this.deleteable = false;
                }
              } else if (this.popupParam.insertFlag === 'result') {
                // 사고 조사결과에서 온 경우 사고 조사결과만 수정가능
                if (this.accident.accidentStepCd === 'ACCS3') {
                  let investPerson = [];
                  investPerson.push(this.accident.accidentInvest.leaderUserId); // leader
                  investPerson.push(this.accident.accidentInvest.faciUserId);
                  this.$_.forEach(this.accident.accidentInvestPsns, (item) => {
                    investPerson.push(item.userId);
                  });

                  if (
                    this.$_.indexOf(investPerson, this.$store.getters.token) >
                      -1 ||
                    this.isManager
                  ) {
                    this.disabled = false;
                    this.tabParam.editable = true;
                    this.tabParam.detailCheck = false;
                  } else {
                    this.disabled = true;
                    this.tabParam.editable = false;
                    this.tabParam.detailCheck = true;
                    this.completeable = false;
                    this.insertable = false;
                    this.updateMode = false;
                    this.deleteable = false;
                  }
                } else {
                  this.disabled = true;
                  this.tabParam.editable = false;
                  this.tabParam.detailCheck = true;
                  this.completeable = false;
                  this.insertable = false;
                  this.updateMode = false;
                  this.deleteable = false;
                }
              }

              if (
                !(
                  this.accident.bizApprStepCd === 'BAPSG' ||
                  this.accident.bizApprStepCd === 'BAPSD' ||
                  !this.accident.bizApprStepCd
                )
              ) {
                this.disabled = true;
                this.tabParam.editable = false;
                this.tabParam.detailCheck = true;
                this.completeable = false;
                this.insertable = false;
                this.updateMode = false;
                this.deleteable = false;
              }
            } else {
              // 결재요청 팝업으로 들어온 경우
              if (this.accident.accidentStepCd === 'ACCS4') {
                this.disabled = true;
                this.tabParam.editable = false;
                this.tabParam.detailCheck = true;
                this.completeable = false;
                this.insertable = false;
                this.updateMode = false;
                this.deleteable = false;
              } else {
                this.disabled = false;
                this.tabParam.editable = false;
                this.tabParam.detailCheck = false;
              }
            }
            // 조사계획이 세워지지 않은 경우
            if (!this.accident.accidentInvest) {
              this.accident.accidentInvest = this.$_.clone(
                this.$options.data().accident.accidentInvest
              );
              this.accident.investYn =
                this.accident.investYn === 'N' ? 'N' : 'Y';
            }
            this.tempAccidentTypes = [];
            this.tempAccKindCds = [];
            if (_result.data.accKindCds.length > 0) {
              this.$_.forEach(_result.data.accKindCds, (item) => {
                this.tempAccKindCds.push({
                  code: item['accKindCd'],
                  name: item['accKindNm'],
                });
              });
            }
            if (_result.data.accidentTypes.length > 0) {
              this.$_.forEach(_result.data.accidentTypes, (item) => {
                this.tempAccidentTypes.push({
                  code: item['accidentTypeCd'],
                  name: item['accidentTypeNm'],
                });
              });
            }
            this.setAttachFileGrps();
          },
          (_error) => {
            window.getApp.$emit('APP_REQUEST_ERROR', _error);
          }
        );
      }
    },
    setAttachFileGrps() {
      let taskKey = this.popupParam.safAccidentNo
        ? this.popupParam.safAccidentNo.toString()
        : '';
      this.attachFileGrps = [
        {
          label: 'L0000002525', // 전체배경[* 사진만 첨부]
          uploadTempFiles: null,
          taskClassNm: 'ACCIDENT_ALL',
          taskKey: taskKey,
          editable: this.editable,
          disabled: this.disabled,
          onlyDownload: this.disabled,
          // ispictureExplain: true,
          // pictureExplain: '',
          accept: 'png,gif,jpg,jpeg',
          createUserId: this.$store.getters.token,
        },
        {
          label: 'L0000000739', // 근거리범위 [* 사진만 첨부]
          uploadTempFiles: null,
          taskClassNm: 'ACCIDENT_NEAR',
          taskKey: taskKey,
          editable: this.editable,
          disabled: this.disabled,
          onlyDownload: this.disabled,
          ispictureExplain: true,
          pictureExplain: '',
          accept: 'png,gif,jpg,jpeg',
          createUserId: this.$store.getters.token,
        },
        {
          label: 'L0000002716', // 주변작업환경[* 사진만 첨부]
          uploadTempFiles: null,
          taskClassNm: 'ACCIDENT_AROUND_WORK',
          taskKey: taskKey,
          editable: this.editable,
          disabled: this.disabled,
          onlyDownload: this.disabled,
          ispictureExplain: true,
          pictureExplain: '',
          accept: 'png,gif,jpg,jpeg',
          createUserId: this.$store.getters.token,
        },
      ];
      this.accidentAttachFileGrps = [
        {
          label: 'L0000002843', // 첨부파일
          uploadTempFiles: null,
          taskClassNm: 'ACCIDENT',
          taskKey: taskKey,
          editable: this.editable,
          disabled: this.disabled,
          onlyDownload: this.disabled,
          createUserId: this.$store.getters.token,
        },
      ];
    },
    /** 수정 하기전 UI단 유효성 검사 **/
    beforeSave() {
      if (this.insertable) {
        // 신규등록인 경우
        this.saveUrl = transactionConfig.saf.accident.insert.url;
        this.actionType = 'POST';
        this.saveCheckResult(0);
      } else {
        // 수정인 경우
        this.actionType = 'PUT';
        this.saveUrl = transactionConfig.saf.accident.edit.url;
        this.saveCheckResult(0);
      }
    },
    beforeComplete() {
      this.saveCheckResult(1);
    },
    saveCheckResult(completeable) {
      return new Promise((resolve, reject) => {
        this.accident.accidentTitle = this.setTitle;
        var returnVal = true;
        let flag = true;

        if (this.accident.investYn === 'N') {
          flag = true;
        } else {
          flag = this.checkAccidentReception(
            !this.accident.investYn ? null : this.accident
          );

          //
          // setTimeout(() => {
          //   flag = this.checkAccidentReception(
          //     !this.accident.investYn ? null : this.accident
          //   ); // 조사계획
          // }, 100);
        }
        if (
          this.popupParam.accidentStepCd === 'ACCS2' ||
          this.popupParam.accidentStepCd === 'ACCS3'
        ) {
          returnVal = flag;

          if (returnVal && this.accident.outCompanyData) {
            returnVal = this.checkAccidentReceptionDamage(); // 조사인원
          }
          if (returnVal && this.accident.investYn !== 'N') {
            returnVal = this.checkAccidentReceptionPsn(
              this.accident.accidentInvestPsns,
              this.accident.accidentStepCd
            ); // 조사인원
          }
        }

        if (returnVal && this.popupParam.accidentStepCd === 'ACCS3') {
          returnVal = this.checkAccidentResult();
        }

        if (returnVal) {
          this.$validator
            .validateAll()
            .then((_result) => {
              // TODO : 전역 성공 메시지 처리
              // 이벤트는 ./event.js 파일에 선언되어 있음
              if (_result) {
                this.accident.accidentYmd =
                  this.accident.accidentDateTime.substring(0, 10);
                this.accident.accidentHour =
                  this.accident.accidentDateTime.substring(11, 13);
                this.accident.accidentMinute =
                  this.accident.accidentDateTime.substring(14, 16);

                this.accident.accidentTypes = [];
                this.$_.forEach(this.tempAccidentTypes, (item) => {
                  this.accident.accidentTypes.push({
                    accidentTypeCd: item.code,
                  });
                });
                this.accident.accKindCds = [];
                this.$_.forEach(this.tempAccKindCds, (item) => {
                  this.accident.accKindCds.push({
                    accKindCd: item.code,
                  });
                });

                let isAccidentPerson = false;
                // 사고자 정보
                if (
                  (this.accident.outCompanyData &&
                    this.accident.outCompanyData.length > 0) ||
                  (this.accident.partenersData &&
                    this.accident.partenersData.length > 0)
                ) {
                  this.accident.accidentVictims = [];
                  this.$_.forEach(this.accident.outCompanyData, (item) => {
                    this.accident.accidentVictims.push(item);
                  });

                  this.$_.forEach(this.accident.partenersData, (item) => {
                    this.accident.accidentVictims.push(item);
                  });
                }

                if (
                  !this.accident.accidentVictims ||
                  this.accident.accidentVictims.length === 0
                ) {
                  this.accident.accidentVictims = null;
                }

                if (
                  !(
                    (!this.popupParam.accidentStepCd &&
                      this.popupParam.insertFlag === 'newsflash') ||
                    this.popupParam.accidentStepCd === 'ACCS0'
                  ) &&
                  (!this.accident.accidentVictims ||
                    this.accident.accidentVictims.length === 0)
                ) {
                  isAccidentPerson = false;
                  // 속보 신규등록이나 상태가 속보 상태가 아닌데 사고자 정보가 없을 시 사고자를 등록하라고 알람
                  window.getApp.$emit('ALERT', {
                    title: 'L0000003395', // 안내
                    message:
                      '[' +
                      this.$comm.getLangSpecInfoLabel('L0000003655') +
                      '] ' +
                      this.$comm.getLangSpecInfoLabel('L0000005356'), // 상해자(협력업체)를 한건 이상 입력하세요.
                    type: 'warning', // success / info / warning / error
                  });
                  this.onAppr = false;
                  resolve(false);
                } else {
                  isAccidentPerson = true;
                }
                if (this.accident.outCompanyData.length > 0) {
                  this.accident.outCompanyData.every((item) => {
                    if (!item.damageLvlCd) {
                      window.getApp.$emit('ALERT', {
                        title: 'L0000003395', // 안내
                        message:
                          '[' +
                          this.$comm.getLangSpecInfoLabel('L0000003655') +
                          '] ' +
                          this.$comm.getLangSpecInfoLabel('L0000005390'), // 구분을 선택해주세요.
                        type: 'warning', // success / info / warning / error
                      });
                      isAccidentPerson = false;
                      this.onAppr = false;
                      resolve(false);
                      return false;
                    }
                    if (
                      item.damageLvlCd === 'DMGL1' ||
                      item.damageLvlCd === 'DMGL2'
                    ) {
                      if (item.humanInjuryPartCds.length <= 0) {
                        window.getApp.$emit('ALERT', {
                          title: 'L0000003395', // 안내
                          message:
                            '[' +
                            this.$comm.getLangSpecInfoLabel('L0000003655') +
                            '] ' +
                            this.$comm.getLangSpecInfoLabel('L0000005357'), // 상해부위 선택해주세요.
                          type: 'warning', // success / info / warning / error
                        });
                        isAccidentPerson = false;
                        this.onAppr = false;
                        resolve(false);
                        return false;
                      }
                      if (item.humanInjuryClsCds.length <= 0) {
                        window.getApp.$emit('ALERT', {
                          title: 'L0000003395', // 안내
                          message:
                            '[' +
                            this.$comm.getLangSpecInfoLabel('L0000003655') +
                            '] ' +
                            this.$comm.getLangSpecInfoLabel('L0000005358'), // 상해종류를 선택해주세요.
                          type: 'warning', // success / info / warning / error
                        });
                        isAccidentPerson = false;
                        this.onAppr = false;
                        resolve(false);
                        return false;
                      }
                    }
                    return true;
                  });
                }
                if (this.accident.partenersData.length > 0) {
                  this.accident.partenersData.every((item) => {
                    if (!item.damageLvlCd) {
                      window.getApp.$emit('ALERT', {
                        title: 'L0000003395', // 안내
                        message:
                          '[' +
                          this.$comm.getLangSpecInfoLabel('L0000003655') +
                          '] ' +
                          this.$comm.getLangSpecInfoLabel('L0000005390'), // 구분을 선택해주세요.
                        type: 'warning', // success / info / warning / error
                      });
                      isAccidentPerson = false;
                      this.onAppr = false;
                      resolve(false);
                      return false;
                    }
                    if (
                      item.damageLvlCd === 'DMGL1' ||
                      item.damageLvlCd === 'DMGL2'
                    ) {
                      if (item.humanInjuryPartCds.length <= 0) {
                        window.getApp.$emit('ALERT', {
                          title: 'L0000003395', // 안내
                          message:
                            '[' +
                            this.$comm.getLangSpecInfoLabel('L0000003655') +
                            '] ' +
                            this.$comm.getLangSpecInfoLabel('L0000005357'), // 상해부위 선택해주세요.
                          type: 'warning', // success / info / warning / error
                        });
                        isAccidentPerson = false;
                        this.onAppr = false;
                        resolve(false);
                        return false;
                      }
                      if (item.humanInjuryClsCds.length <= 0) {
                        window.getApp.$emit('ALERT', {
                          title: 'L0000003395', // 안내
                          message:
                            '[' +
                            this.$comm.getLangSpecInfoLabel('L0000003655') +
                            '] ' +
                            this.$comm.getLangSpecInfoLabel('L0000005358'), // 상해종류를 선택해주세요.
                          type: 'warning', // success / info / warning / error
                        });
                        isAccidentPerson = false;
                        this.onAppr = false;
                        resolve(false);
                        return false;
                      }
                    }
                    return true;
                  });
                }
                if (
                  this.accident.accidentInvest &&
                  this.accident.accidentInvest.period &&
                  this.accident.accidentInvest.period.length === 2
                ) {
                  this.accident.accidentInvest.investStartYmd =
                    this.accident.accidentInvest.period[0];
                  this.accident.accidentInvest.investEndYmd =
                    this.accident.accidentInvest.period[1];
                }

                // // 조사결과/개선계획
                // if (this.popupParam.accidentStepCd === 'ACCS3') {
                //   if (this.popupParam.accidentCauMeass) {
                //     this.accident.accidentCauMeass = [];
                //     this.$_.forEach(this.popupParam.accidentCauMeass, item => {
                //       this.accident.accidentCauMeass.push(item);
                //     });
                //   }
                // }
                if (isAccidentPerson && !this.onAppr) {
                  window.getApp.$emit('CONFIRM', {
                    title: 'L0000003321', // 확인
                    message: completeable === 0 ? 'M0000000011' : 'M0000000838', // 저장하시겠습니까? 완료하시겠습니까?
                    // TODO : 필요시 추가하세요.
                    type: 'info', // success / info / warning / error
                    // 확인 callback 함수
                    confirmCallback: () => {
                      // 신규등록의 경우 속보와 등록 두 메뉴에서 나옴
                      if (
                        this.popupParam.accidentStepCd === '' &&
                        this.popupParam.insertFlag === 'newsflash'
                      ) {
                        this.accident.accidentStepCd = 'ACCS0';
                      } else if (
                        this.popupParam.accidentStepCd === '' &&
                        this.popupParam.insertFlag === 'occur'
                      ) {
                        this.accident.accidentStepCd = 'ACCS1';
                      }
                      this.accident.createUserId = this.$store.getters.token;
                      this.accident.updateUserId = this.$store.getters.token;

                      if (completeable > 0) {
                        if (this.popupParam.accidentStepCd === 'ACCS0') {
                          this.accident.accidentStepCd = 'ACCS1';
                        } else if (this.popupParam.accidentStepCd === 'ACCS1') {
                          this.accident.accidentStepCd = 'ACCS2';
                        } else if (this.popupParam.accidentStepCd === 'ACCS2') {
                          this.accident.accidentStepCd = 'ACCS3';
                        } else if (this.popupParam.accidentStepCd === 'ACCS3') {
                          this.accident.accidentStepCd = 'ACCS5';
                        }
                      }
                      if (completeable > 0) this.isComplete = true;
                      else this.isSave = true;
                    },
                    // 취소 callback 함수
                    cancelCallback: () => {
                      if (completeable > 0) this.isComplete = false;
                      else this.isSave = false;
                    },
                  });
                } else {
                  if (
                    this.popupParam.accidentStepCd === '' &&
                    this.popupParam.insertFlag === 'newsflash'
                  ) {
                    this.accident.accidentStepCd = 'ACCS0';
                  } else if (
                    this.popupParam.accidentStepCd === '' &&
                    this.popupParam.insertFlag === 'occur'
                  ) {
                    this.accident.accidentStepCd = 'ACCS1';
                  }
                  this.accident.createUserId = this.$store.getters.token;
                  this.accident.updateUserId = this.$store.getters.token;

                  if (completeable > 0) {
                    if (this.popupParam.accidentStepCd === 'ACCS0') {
                      this.accident.accidentStepCd = 'ACCS1';
                    } else if (this.popupParam.accidentStepCd === 'ACCS1') {
                      this.accident.accidentStepCd = 'ACCS2';
                    } else if (this.popupParam.accidentStepCd === 'ACCS2') {
                      this.accident.accidentStepCd = 'ACCS3';
                    } else if (this.popupParam.accidentStepCd === 'ACCS3') {
                      this.accident.accidentStepCd = 'ACCS5';
                    }
                  }

                  resolve(true);
                }
              } else if (!_result) {
                this.$popupRequired.check(
                  'accidentDetail',
                  this.$data,
                  this.errors
                );
                this.onAppr = false;
                resolve(false);
              }
            })
            .catch(() => {
              window.getApp.$emit(
                'APP_VALID_ERROR',
                'M0000000876' // 유효성 검사도중 에러가 발생하였습니다.
              );
              if (completeable > 0) this.isComplete = false;
              else this.isSave = false;
            });
        }
      });
    },
    checkAccidentReceptionDamage() {
      var damageLvlCd = false;

      if (this.accident.outCompanyData) {
        this.$_.forEach(this.accident.outCompanyData, (item) => {
          if (!item.damageLvlCd) damageLvlCd = true;
        });

        if (damageLvlCd) {
          window.getApp.$emit('ALERT', {
            title: 'L0000003395', // 안내
            message:
              '[' +
              this.$comm.getLangSpecInfoLabel('L0000003655') +
              '] ' +
              this.$comm.getLangSpecInfoLabel('M0000000675'), // 상해자(당사) 그리드에서 구분이 입력되지 않았습니다.
            type: 'warning', // success / info / warning / error
          });
          return false;
        }
      }

      return true;
    },
    checkAccidentReception(target) {
      // var target = this.accidentReception;

      if (!target || !target.accidentInvest) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // 안내
          message:
            '[' +
            this.$comm.getLangSpecInfoLabel('L0000002644') +
            '] ' +
            this.$comm.getLangSpecInfoLabel('M0000000676'), // 조사계획이 작성되지 않았습니다.
          type: 'warning', // success / info / warning / error
        });
        return false;
      }

      if (
        target.accidentInvest.period &&
        target.accidentInvest.period.length < 2
      ) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // 안내
          message:
            '[' +
            this.$comm.getLangSpecInfoLabel('L0000002644') +
            '] ' +
            this.$comm.getLangSpecInfoLabel('M0000000677'), // 조사기간이 입력되지 않았습니다.
          type: 'warning', // success / info / warning / error
        });
        return false;
      }

      if (!target.accidentInvest.leaderUserId) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // 안내
          message:
            '[' +
            this.$comm.getLangSpecInfoLabel('L0000002644') +
            '] ' +
            this.$comm.getLangSpecInfoLabel('M0000000678'), // 리더가 지정되지 않았습니다.
          type: 'warning', // success / info / warning / error
        });
        return false;
      }

      if (!target.accidentInvest.leaderSelYmd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // 안내
          message:
            '[' +
            this.$comm.getLangSpecInfoLabel('L0000002644') +
            '] ' +
            this.$comm.getLangSpecInfoLabel('M0000000679'), // 리더 선정일이  지정되지 않았습니다.
          type: 'warning', // success / info / warning / error
        });
        return false;
      }

      if (!target.accidentInvest.investPlan) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // 안내
          message:
            '[' +
            this.$comm.getLangSpecInfoLabel('L0000002644') +
            '] ' +
            this.$comm.getLangSpecInfoLabel('M0000000676'), // 조사계획이 작성되지 않았습니다.
          type: 'warning', // success / info / warning / error
        });
        return false;
      }

      return true;
    },
    checkAccidentReceptionPsn(target, accidentStepCd) {
      // var target = this.accidentReceptionPsn;
      if (
        !target ||
        (accidentStepCd === 'ACCS2' && !target) ||
        (target && target.length === 0)
      ) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // 안내
          message:
            '[' +
            this.$comm.getLangSpecInfoLabel('L0000002644') +
            '] ' +
            this.$comm.getLangSpecInfoLabel('M0000000680'), // 최소1인이상의 조사인원이 지정되야 합니다.
          type: 'warning', // success / info / warning / error
        });
        return false;
      }

      return true;
    },
    checkAccidentResult() {
      var actClsCd = false;
      var rootCause = false;
      var imprMeasure = false;

      if (this.accident.accidentCauMeass) {
        this.$_.forEach(this.accident.accidentCauMeass, (item) => {
          if (!item.actClsCd) actClsCd = true;
          if (!item.rootCause) rootCause = true;
          if (!item.imprMeasure) imprMeasure = true;
        });

        if (rootCause) {
          window.getApp.$emit('ALERT', {
            title: 'L0000003395', // 안내
            message:
              '[' +
              this.$comm.getLangSpecInfoLabel('L0000002642') +
              '] ' +
              this.$comm.getLangSpecInfoLabel('M0000000681'), // 조사결과에서 근본원인이 입력되지 않았습니다.
            type: 'warning', // success / info / warning / error
          });
          return false;
        } else if (imprMeasure) {
          window.getApp.$emit('ALERT', {
            title: 'L0000003395', // 안내
            message:
              '[' +
              this.$comm.getLangSpecInfoLabel('L0000002642') +
              '] ' +
              this.$comm.getLangSpecInfoLabel('M0000000682'), // 조사결과에서 개선계획이 입력되지 않았습니다.
            type: 'warning', // success / info / warning / error
          });
          return false;
        } else if (actClsCd) {
          window.getApp.$emit('ALERT', {
            title: 'L0000003395', // 안내
            message:
              '[' +
              this.$comm.getLangSpecInfoLabel('L0000002642') +
              '] ' +
              this.$comm.getLangSpecInfoLabel('M0000001588'), // 조사결과에서 구분이 입력되지 않았습니다.
            type: 'warning', // success / info / warning / error
          });
          return false;
        }
      }

      return true;
    },
    /**
     * 필수입력값 유효성 검사
     */
    validateState(ref) {
      if (!ref) return;
      if (
        this.veeBag[ref] &&
        (this.veeBag[ref].dirty || this.veeBag[ref].validated)
      ) {
        return !this.errors.has(ref);
      }
      return null;
    },
    changeUploadFilesT(data) {
      this.uploadFiles = data;
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
    /**
     * 수정 버튼 안보여지도록 처리
     *  버튼 http 통신 중 error 발생 callback
     * _result : error return하는 데이터
     */
    btnClickedErrorCallback(_result) {
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    /**
     *  수정 버튼 callback
     * _result : backend에서 return하는 데이터
     */
    btnSaveClickedCallback(_result) {
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // 안내
        message: 'M0000000006', // 저장되었습니다.
        type: 'success', // success / info / warning / error
      });
      this.isSave = false;
      this.completeable = true;
      this.deleteable = true;
      this.insertable = false;
      this.updateMode = true;
      this.plantDisabled = true;
      this.research = !this.research;
      if (!this.popupParam.safAccidentNo) {
        this.popupParam.safAccidentNo = _result.data.safAccidentNo;
        this.popupParam.accidentStepCd = _result.data.accidentStepCd;
        this.accident.safAccidentNo = _result.data.safAccidentNo;
        this.accident.accidentNum = _result.data.accidentNum;
        this.accident.accidentStepCd = _result.data.accidentStepCd;
      }
      this.saveAttach();
    },
    /**
     * 사내사고 삭제
     *  삭제 버튼 callback
     * _result : backend에서 return하는 데이터
     */
    btnDeleteClickedCallback(_result) {
      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321', // 확인
        message: 'M0000000012', // 삭제하시겠습니까?
        // TODO : 필요시 추가하세요.
        type: 'info', // success / info / warning / error
        // 확인 callback 함수
        confirmCallback: () => {
          this.$http.url = this.$format(
            transactionConfig.saf.accident.delete.url,
            this.popupParam.safAccidentNo
          );
          this.$http.type = 'DELETE';
          this.$http.request(
            (_result) => {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395', // 안내
                message: 'M0000000007', // 삭제되었습니다.
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
    btnCompleteClickedCallback(_result) {
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // 안내
        message: 'M0000000078', // 완료되었습니다.
        type: 'success', // success / info / warning / error
      });
      this.isComplete = false;
      this.editable = false;
      this.deleteable = false;
      this.completeable = false;
      this.closePopup(null);
    },
    checkBoxChange(val) {
      if (val.length > 0) {
        this.accident.contents =
          '- ' +
          this.$comm.getLangSpecInfoLabel('L0000000852') +
          ' : \n' + // 누가
          '- ' +
          this.$comm.getLangSpecInfoLabel('L0000000853') +
          ' : \n' + // 누구에게
          '- ' +
          this.$comm.getLangSpecInfoLabel('L0000001933') +
          ' : \n' + // 언제
          '- ' +
          this.$comm.getLangSpecInfoLabel('L0000001931') +
          ' : \n' + // 어디서
          '- ' +
          this.$comm.getLangSpecInfoLabel('L0000001035') +
          ' : \n' + // 무엇을
          '- ' +
          this.$comm.getLangSpecInfoLabel('L0000001932') +
          ' : \n' + // 어떻게
          '- ' +
          this.$comm.getLangSpecInfoLabel('L0000002046'); // 왜
      } else {
        this.accident.contents = '';
      }
    },
    changeUploadFiles(data) {
      var index = this.$_.findIndex(this.attachFileGrps, {
        taskClassNm: data.taskClassNm,
      });
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
    setTempDeleteFiles(data) {
      var pushData = {
        fileNo: data.data.fileNo,
      };
      this.tempDeleteFiles.push(pushData);
    },
    changeAccidentUploadFiles(data) {
      var index = this.$_.findIndex(this.accidentAttachFileGrps, {
        taskClassNm: data.taskClassNm,
      });
      if (index > -1) {
        data.index = index;
        this.accidentAttachFileGrps[index].uploadTempFiles = data;

        // 업로드 하기 위해 올라온 파일들을 저장하는 부분
        // 기존에 들어가 있는 경우에는 덮어쓰고 아닌 경우에는 신규로 넣는다.
        let saveIndex = this.$_.findIndex(
          this.saveAttachFsaveAccidentAttachFilesiles,
          {
            taskClassNm: data.taskClassNm,
          }
        );
        if (saveIndex > -1) {
          this.saveAccidentAttachFiles[saveIndex] = this.$_.clone(
            this.accidentAttachFileGrps[index]
          );
        } else {
          this.saveAccidentAttachFiles.push(
            this.$_.clone(this.accidentAttachFileGrps[index])
          );
        }
      }
    },
    setAccidentTempDeleteFiles(data) {
      var pushData = {
        fileNo: data.data.fileNo,
      };
      this.tempAccidentDeleteFiles.push(pushData);
    },
    saveAttach() {
      // task_key 를 셋팅한다.
      this.$_.forEach(this.attachFileGrps, (item) => {
        item.taskKey = this.popupParam.safAccidentNo;
      });
      this.$_.forEach(this.accidentAttachFileGrps, (item) => {
        item.taskKey = this.popupParam.safAccidentNo;
      });
      if (this.tempDeleteFiles.length > 0) {
        this.$http.url = transactionConfig.attachFile.deleteMulti.url;
        this.$http.type = 'DELETE';
        this.$http.param = {
          data: Object.values(this.$_.clone(this.tempDeleteFiles)),
        };
        this.$http.request(
          (_result) => {
            this.tempDeleteFiles = [];
            let returnVal = false;
            // 저장할 데이터가 있는 경우
            if (this.saveAttachFiles.length > 0) {
              this.submitObject.submitCheck = !this.submitObject.submitCheck;
            }
            if (this.saveAccidentAttachFiles.length > 0) {
              returnVal = false;
              this.accidentSubmitObject.submitCheck =
                !this.accidentSubmitObject.submitCheck;
            }
            if (
              this.saveAttachFiles.length === 0 &&
              this.saveAccidentAttachFiles.length === 0
            ) {
              returnVal = true;
            }
            // 저장할 데이터가 없는 경우
            // if (returnVal) this.closePopup(null);
          },
          (_error) => {
            window.getApp.$emit('APP_REQUEST_ERROR', _error);
          }
        );
      } else {
        let returnVal = false;
        // 저장할 데이터가 있는 경우
        if (this.saveAttachFiles.length > 0) {
          this.submitObject.submitCheck = !this.submitObject.submitCheck;
        }
        if (this.saveAccidentAttachFiles.length > 0) {
          returnVal = false;
          this.accidentSubmitObject.submitCheck =
            !this.accidentSubmitObject.submitCheck;
        }
        if (
          this.saveAttachFiles.length === 0 &&
          this.saveAccidentAttachFiles.length === 0
        ) {
          returnVal = true;
        }
        // 저장할 데이터가 없는 경우
        // if (returnVal) this.closePopup(null);
      }
    },
    setDeptNm(deptNm) {
      this.accident.deptNm = deptNm;
    },
    btnAppr() {
      var returnVal = true;
      let flag = true;

      if (!this.accident.investYn || this.accident.investYn === 'N') {
        flag = true;
      } else {
        flag = this.checkAccidentReception(
          !this.accident.investYn ? null : this.accident
        ); // 조사계획
        // setTimeout(() => {
        //   flag = this.checkAccidentReception(
        //     !this.accident.investYn ? null : this.accident
        //   ); // 조사계획
        // }, 100);
      }
      if (
        this.popupParam.accidentStepCd === 'ACCS2' ||
        this.popupParam.accidentStepCd === 'ACCS3'
      ) {
        returnVal = flag;
        if (returnVal && this.accident.outCompanyData) {
          returnVal = this.checkAccidentReceptionDamage(); // 조사인원
        }
        if (returnVal && this.accident.investYn !== 'N') {
          returnVal = this.checkAccidentReceptionPsn(
            this.accident.accidentInvestPsns,
            this.accident.accidentStepCd
          ); // 조사인원
        }
      }

      if (returnVal && this.popupParam.accidentStepCd === 'ACCS3') {
        returnVal = this.checkAccidentResult();
      }

      if (returnVal && flag) {
        this.$validator
          .validateAll()
          // eslint-disable-next-line complexity
          .then((_result) => {
            // TODO : 전역 성공 메시지 처리
            // 이벤트는 ./event.js 파일에 선언되어 있음
            if (_result) {
              this.accident.accidentTypes = [];
              this.$_.forEach(this.tempAccidentTypes, (item) => {
                this.accident.accidentTypes.push({
                  accidentTypeCd: item.code,
                });
              });
              this.accident.accKindCds = [];
              this.$_.forEach(this.tempAccKindCds, (item) => {
                this.accident.accKindCds.push({
                  accKindCd: item.code,
                });
              });

              let isAccidentPerson = false;
              // 사고자 정보
              if (
                (this.accident.outCompanyData &&
                  this.accident.outCompanyData.length > 0) ||
                (this.accident.partenersData &&
                  this.accident.partenersData.length > 0)
              ) {
                this.accident.accidentVictims = [];
                this.$_.forEach(this.accident.outCompanyData, (item) => {
                  this.accident.accidentVictims.push(item);
                });

                this.$_.forEach(this.accident.partenersData, (item) => {
                  this.accident.accidentVictims.push(item);
                });
              }

              if (
                !this.accident.accidentVictims ||
                this.accident.accidentVictims.length === 0
              ) {
                this.accident.accidentVictims = null;
              }

              if (
                !(
                  (!this.popupParam.accidentStepCd &&
                    this.popupParam.insertFlag === 'newsflash') ||
                  this.popupParam.accidentStepCd === 'ACCS0'
                ) &&
                (!this.accident.accidentVictims ||
                  this.accident.accidentVictims.length === 0)
              ) {
                isAccidentPerson = false;
                // 속보 신규등록이나 상태가 속보 상태가 아닌데 사고자 정보가 없을 시 사고자를 등록하라고 알람
                window.getApp.$emit('ALERT', {
                  title: 'L0000003395', // 안내
                  message:
                    '[' +
                    this.$comm.getLangSpecInfoLabel('L0000003655') +
                    '] ' +
                    this.$comm.getLangSpecInfoLabel('L0000005356'), // 상해자(협력업체)를 한건 이상 입력하세요.
                  type: 'warning', // success / info / warning / error
                });
                return;
              } else {
                isAccidentPerson = true;
              }
              if (this.accident.outCompanyData.length > 0) {
                this.accident.outCompanyData.every((item) => {
                  if (!item.damageLvlCd) {
                    window.getApp.$emit('ALERT', {
                      title: 'L0000003395', // 안내
                      message:
                        '[' +
                        this.$comm.getLangSpecInfoLabel('L0000003655') +
                        '] ' +
                        this.$comm.getLangSpecInfoLabel('L0000005390'), // 구분을 선택해주세요.
                      type: 'warning', // success / info / warning / error
                    });
                    isAccidentPerson = false;
                    return false;
                  }
                  if (
                    item.damageLvlCd === 'DMGL1' ||
                    item.damageLvlCd === 'DMGL2'
                  ) {
                    if (item.humanInjuryPartCds.length <= 0) {
                      window.getApp.$emit('ALERT', {
                        title: 'L0000003395', // 안내
                        message:
                          '[' +
                          this.$comm.getLangSpecInfoLabel('L0000003655') +
                          '] ' +
                          this.$comm.getLangSpecInfoLabel('L0000005357'), // 상해부위 선택해주세요.
                        type: 'warning', // success / info / warning / error
                      });
                      isAccidentPerson = false;
                      return false;
                    }
                    if (item.humanInjuryClsCds.length <= 0) {
                      window.getApp.$emit('ALERT', {
                        title: 'L0000003395', // 안내
                        message:
                          '[' +
                          this.$comm.getLangSpecInfoLabel('L0000003655') +
                          '] ' +
                          this.$comm.getLangSpecInfoLabel('L0000005358'), // 상해종류를 선택해주세요.
                        type: 'warning', // success / info / warning / error
                      });
                      isAccidentPerson = false;
                      return false;
                    }
                  }
                  return true;
                });
              }
              if (this.accident.partenersData.length > 0) {
                this.accident.partenersData.every((item) => {
                  if (!item.damageLvlCd) {
                    window.getApp.$emit('ALERT', {
                      title: 'L0000003395', // 안내
                      message:
                        '[' +
                        this.$comm.getLangSpecInfoLabel('L0000003655') +
                        '] ' +
                        this.$comm.getLangSpecInfoLabel('L0000005390'), // 구분을 선택해주세요.
                      type: 'warning', // success / info / warning / error
                    });
                    isAccidentPerson = false;
                    return false;
                  }
                  if (
                    item.damageLvlCd === 'DMGL1' ||
                    item.damageLvlCd === 'DMGL2'
                  ) {
                    if (item.humanInjuryPartCds.length <= 0) {
                      window.getApp.$emit('ALERT', {
                        title: 'L0000003395', // 안내
                        message:
                          '[' +
                          this.$comm.getLangSpecInfoLabel('L0000003655') +
                          '] ' +
                          this.$comm.getLangSpecInfoLabel('L0000005357'), // 상해부위 선택해주세요.
                        type: 'warning', // success / info / warning / error
                      });
                      isAccidentPerson = false;
                      return false;
                    }
                    if (item.humanInjuryClsCds.length <= 0) {
                      window.getApp.$emit('ALERT', {
                        title: 'L0000003395', // 안내
                        message:
                          '[' +
                          this.$comm.getLangSpecInfoLabel('L0000003655') +
                          '] ' +
                          this.$comm.getLangSpecInfoLabel('L0000005358'), // 상해종류를 선택해주세요.
                        type: 'warning', // success / info / warning / error
                      });
                      isAccidentPerson = false;
                      return false;
                    }
                  }
                  return true;
                });
              }

              if (isAccidentPerson) {
                window.getApp.$emit('CONFIRM', {
                  title: 'L0000003321', // 확인
                  message: 'M0000000767', // 결재요청 하기전 입력된 값을 저장합니다. 진행하시겠습니까?
                  // TODO : 필요시 추가하세요.
                  type: 'info', // success / info / warning / error
                  // 확인 callback 함수
                  confirmCallback: () => {
                    // 신규등록의 경우 속보와 등록 두 메뉴에서 나옴
                    if (
                      this.popupParam.accidentStepCd === '' &&
                      this.popupParam.insertFlag === 'newsflash'
                    ) {
                      this.accident.accidentStepCd = 'ACCS0';
                    } else if (
                      this.popupParam.accidentStepCd === '' &&
                      this.popupParam.insertFlag === 'occur'
                    ) {
                      this.accident.accidentStepCd = 'ACCS1';
                    }
                    this.accident.createUserId = this.$store.getters.token;
                    this.accident.updateUserId = this.$store.getters.token;

                    this.$http.url = transactionConfig.saf.accident.edit.url;
                    this.$http.type = 'PUT';
                    this.$http.param = this.accident;
                    this.$http.request(
                      (_result) => {
                        let apprBizCd = '';
                        let apprRqstNo = '';
                        if (this.popupParam.insertFlag === 'occur') {
                          apprBizCd = 'SA-AC-01';
                          apprRqstNo = this.accident.s1ApprRqstNo;
                        } else if (this.popupParam.insertFlag === 'reception') {
                          apprBizCd = 'SA-AC-02';
                          apprRqstNo = this.accident.s2ApprRqstNo;
                        } else {
                          apprBizCd = 'SA-AC-03';
                          apprRqstNo = this.accident.s3ApprRqstNo;
                        }
                        this.popupOptions.target = () =>
                          import(`${'@/pages/manage/appr/comApprRequest.vue'}`);
                        this.popupOptions.title = 'L0000003418'; // 결재요청
                        this.popupOptions.visible = true;
                        this.popupOptions.closeCallback = this.closeApprPop;
                        this.popupOptions.width = '80%';
                        this.popupOptions.param = {
                          apprBizCd: apprBizCd,
                          apprRqstNo: apprRqstNo,
                          apprParams: {
                            safAccidentNo: this.popupParam.safAccidentNo,
                          },
                        };
                      },
                      (_error) => {
                        window.getApp.$emit('APP_REQUEST_ERROR', _error);
                      }
                    );
                  },
                  // 취소 callback 함수
                  cancelCallback: () => {},
                });
              }
            } else if (!_result) {
              // window.alert("필수입력값을 입력해주세요");
              window.getApp.$emit('ALERT', {
                title: 'L0000003395', // 안내
                message: 'M0000000005', // 필수 입력값을 입력해 주세요.
                type: 'warning', // success / info / warning / error
              });
            }
          })
          .catch(() => {
            window.getApp.$emit(
              'APP_VALID_ERROR',
              'M0000000876' // 유효성 검사도중 에러가 발생하였습니다.
            );
          });
      }
    },
    closeApprPop(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.getList();
    },
    printAccident() {
      let thisVue = this;
      let _comm = this.$comm;
      this.$http.url = this.$format(
        this.printUrl,
        this.popupParam.safAccidentNo
      );
      this.$http.type = 'GET'; // BASE64를 UTF-8인코딩한 바이트로 다운받음 (그렇지 않으면 FRONT에서 JSON이 깨짐)
      this.$http.request(
        (_result) => {
          let fileOrgNm = '안전사고보고서_' + this.$comm.getToday() + '.pdf';
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
    /** end button 관련 이벤트 **/
  },
};
</script>
