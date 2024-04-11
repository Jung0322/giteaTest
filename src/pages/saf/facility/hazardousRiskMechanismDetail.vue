<template>
  <b-container fluid>
    <b-row ref="detailBox">
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- 유해위험기계기구 상세 -->
            <y-label
              label="L0000002176"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 저장 -->
              <y-btn
                v-if="editable"
                :action-url="saveUrl"
                :param="safCheckMachine"
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
                v-if="popupParam.checkMachineNo > 0 && isAuthGrpSafety"
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
              <y-plant
                type="edit"
                :editable="editable"
                name="plantCd"
                v-model="safCheckMachine.plantCd"
                v-validate="'required'"
                :state="validateState('plantCd')"
              />
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
              <b-row>
                <b-col sm="2" md="2" lg="2" xl="2" class="col-xxl-2">
                  <!-- 기계분류 -->
                  <y-label label="L0000000772" :required="true" />
                </b-col>
                <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
                  <y-select
                    :width="12"
                    :editable="editable"
                    :comboItems="machineItems"
                    itemText="codeNm"
                    itemValue="code"
                    ui="bootstrap"
                    name="machineTypeCd"
                    v-model="safCheckMachine.machineTypeCd"
                    v-validate="'required'"
                    :state="validateState('machineTypeCd')"
                  ></y-select>
                </b-col>
                <b-col
                  v-show="
                    safCheckMachine.machineTypeCd != 'M20' &&
                      safCheckMachine.machineTypeCd != 'M30'
                  "
                  sm="4"
                  md="4"
                  lg="4"
                  xl="4"
                  class="col-xxl-4"
                >
                  <y-select
                    :width="12"
                    :editable="editable"
                    :comboItems="pressureItems"
                    itemText="codeNm"
                    itemValue="code"
                    ui="bootstrap"
                    name="pressureClsCd"
                    v-model="safCheckMachine.pressureClsCd"
                    v-validate="'required'"
                    :state="validateState('pressureClsCd')"
                  ></y-select>
                </b-col>
              </b-row>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- ITEM NO -->
              <y-text
                :width="8"
                :required="true"
                :editable="editable"
                ui="bootstrap"
                label="L0000000119"
                name="itemNo"
                v-model="safCheckMachine.itemNo"
                v-validate="'required'"
                :state="validateState('itemNo')"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 용량(m3) -->
              <y-number
                v-show="!isHighPressureGas && !isEnergy && !isCraneHoist"
                :width="8"
                :editable="editable"
                :maxlength="8"
                :pointNumber="3"
                :hasSeperator="true"
                ui="bootstrap"
                label="L0000002063"
                name="volume"
                v-model="safCheckMachine.volume"
              ></y-number>
            </b-col>

            <!-- 기계분류가 압력용기이면서 고압가스인 경우 start -->
            <b-col
              v-show="isHighPressureGas || isCraneHoist"
              sm="6"
              md="6"
              lg="6"
              xl="6"
              class="col-xxl-3"
            >
              <!-- 제조사 -->
              <y-text
                :width="8"
                :editable="editable"
                :maxlength="10"
                ui="bootstrap"
                label="L0000003687"
                name="makerNm"
                v-model="safCheckMachine.makerNm"
              ></y-text>
            </b-col>
            <b-col
              v-show="isHighPressureGas"
              sm="6"
              md="6"
              lg="6"
              xl="6"
              class="col-xxl-3"
            >
              <!-- 내용적(L) -->
              <y-number
                :width="8"
                :editable="editable"
                :maxlength="8"
                :hasSeperator="true"
                ui="bootstrap"
                label="L0000003688"
                name="contents"
                v-model="safCheckMachine.contents"
              ></y-number>
            </b-col>
            <b-col
              v-show="isHighPressureGas"
              sm="6"
              md="6"
              lg="6"
              xl="6"
              class="col-xxl-3"
            >
              <!-- 설계온도(℃) -->
              <y-number
                :width="8"
                :editable="editable"
                :maxlength="8"
                :pointNumber="3"
                :hasSeperator="true"
                ui="bootstrap"
                label="L0000001575"
                name="designTemp"
                v-model="safCheckMachine.designTemp"
              ></y-number>
            </b-col>
            <b-col
              v-show="isHighPressureGas"
              sm="6"
              md="6"
              lg="6"
              xl="6"
              class="col-xxl-3"
            >
              <!-- 설계압력(kg/cm2) -->
              <y-number
                :width="8"
                :editable="editable"
                :maxlength="8"
                :pointNumber="3"
                :hasSeperator="true"
                ui="bootstrap"
                label="L0000003689"
                name="designPressKg"
                v-model="safCheckMachine.designPressKg"
              ></y-number>
            </b-col>
            <b-col
              v-show="isHighPressureGas"
              sm="6"
              md="6"
              lg="6"
              xl="6"
              class="col-xxl-3"
            >
              <!-- 설계압력(Mpa) -->
              <y-number
                :width="8"
                :editable="editable"
                :maxlength="8"
                :pointNumber="3"
                :hasSeperator="true"
                ui="bootstrap"
                label="L0000001574"
                name="designPressMpa"
                v-model="safCheckMachine.designPressMpa"
              ></y-number>
            </b-col>
            <b-col
              v-show="isHighPressureGas"
              sm="6"
              md="6"
              lg="6"
              xl="6"
              class="col-xxl-3"
            >
              <!-- 관리번호 -->
              <y-number
                :width="8"
                :editable="editable"
                :maxlength="8"
                :hasSeperator="false"
                ui="bootstrap"
                label="L0000000590"
                name="manageNo"
                v-model="safCheckMachine.manageNo"
              ></y-number>
            </b-col>
            <b-col
              v-show="isHighPressureGas"
              sm="6"
              md="6"
              lg="6"
              xl="6"
              class="col-xxl-3"
            >
              <!-- 검사합격일자 -->
              <y-datepicker
                :width="8"
                :editable="editable"
                label="L0000003690"
                name="inspPassDt"
                v-model="safCheckMachine.inspPassDt"
              ></y-datepicker>
            </b-col>
            <!-- 기계분류가 압력용기이면서 고압가스인 경우 end -->

            <!-- 기계분류가 압력용기이면서 에너지인 경우 start -->
            <b-col
              v-show="isEnergy"
              sm="6"
              md="6"
              lg="6"
              xl="6"
              class="col-xxl-3"
            >
              <!-- P&ID -->
              <y-text
                :width="8"
                :editable="editable"
                :maxlength="10"
                ui="bootstrap"
                label="L0000003691"
                name="pnid"
                v-model="safCheckMachine.pnid"
              ></y-text>
            </b-col>
            <b-col
              v-show="isEnergy"
              sm="6"
              md="6"
              lg="6"
              xl="6"
              class="col-xxl-3"
            >
              <!-- 용량 -->
              <y-number
                :width="8"
                :editable="editable"
                :maxlength="8"
                :pointNumber="3"
                :hasSeperator="true"
                ui="bootstrap"
                label="L0000002061"
                name="volume"
                v-model="safCheckMachine.volume"
              ></y-number>
            </b-col>
            <b-col
              v-show="isEnergy"
              sm="6"
              md="6"
              lg="6"
              xl="6"
              class="col-xxl-3"
            >
              <!-- 검사증NO. -->
              <y-text
                :width="8"
                :editable="editable"
                :maxlength="10"
                ui="bootstrap"
                label="L0000003692"
                name="inspCertiNo"
                v-model="safCheckMachine.inspCertiNo"
              ></y-text>
            </b-col>
            <b-col
              v-show="isEnergy"
              sm="6"
              md="6"
              lg="6"
              xl="6"
              class="col-xxl-3"
            >
              <!-- PSV -->
              <y-text
                :width="8"
                :editable="editable"
                :maxlength="10"
                ui="bootstrap"
                label="L0000003693"
                name="psv"
                v-model="safCheckMachine.psv"
              ></y-text>
            </b-col>
            <b-col
              v-show="isEnergy"
              sm="6"
              md="6"
              lg="6"
              xl="6"
              class="col-xxl-3"
            >
              <!-- OPERRATING(PRESS.) -->
              <y-number
                :width="8"
                :editable="editable"
                :maxlength="8"
                :pointNumber="3"
                :hasSeperator="true"
                ui="bootstrap"
                label="L0000003694"
                name="operPresssure"
                v-model="safCheckMachine.operPresssure"
              ></y-number>
            </b-col>
            <b-col
              v-show="isEnergy"
              sm="6"
              md="6"
              lg="6"
              xl="6"
              class="col-xxl-3"
            >
              <!-- OPERATION(Temp.) -->
              <y-number
                :width="8"
                :editable="editable"
                :maxlength="8"
                :pointNumber="3"
                :hasSeperator="true"
                ui="bootstrap"
                label="L0000003695"
                name="operTemp"
                v-model="safCheckMachine.operTemp"
              ></y-number>
            </b-col>
            <b-col
              v-show="isEnergy"
              sm="6"
              md="6"
              lg="6"
              xl="6"
              class="col-xxl-3"
            >
              <!-- DESIGN(PRESS.) -->
              <y-number
                :width="8"
                :editable="editable"
                :maxlength="8"
                :pointNumber="3"
                :hasSeperator="true"
                ui="bootstrap"
                label="L0000003696"
                name="designPressure"
                v-model="safCheckMachine.designPressure"
              ></y-number>
            </b-col>
            <b-col
              v-show="isEnergy"
              sm="6"
              md="6"
              lg="6"
              xl="6"
              class="col-xxl-3"
            >
              <!-- DESIGN(Temp.) -->
              <y-number
                :width="8"
                :editable="editable"
                :maxlength="8"
                :pointNumber="3"
                :hasSeperator="true"
                ui="bootstrap"
                label="L0000003697"
                name="designTemp"
                v-model="safCheckMachine.designTemp"
              ></y-number>
            </b-col>
            <b-col
              v-show="isEnergy"
              sm="6"
              md="6"
              lg="6"
              xl="6"
              class="col-xxl-3"
            >
              <!-- Service -->
              <y-text
                :width="8"
                :editable="editable"
                :maxlength="10"
                ui="bootstrap"
                label="L0000003698"
                name="service"
                v-model="safCheckMachine.service"
              ></y-text>
            </b-col>
            <b-col
              v-show="isEnergy"
              sm="6"
              md="6"
              lg="6"
              xl="6"
              class="col-xxl-3"
            >
              <!-- Part -->
              <y-text
                :width="8"
                :editable="editable"
                :maxlength="10"
                ui="bootstrap"
                label="L0000003699"
                name="part"
                v-model="safCheckMachine.part"
              ></y-text>
            </b-col>
            <b-col
              v-show="isEnergy"
              sm="6"
              md="6"
              lg="6"
              xl="6"
              class="col-xxl-3"
            >
              <!-- 최고사용압력(kg/cm2) -->
              <y-number
                :width="8"
                :editable="editable"
                :maxlength="8"
                :pointNumber="3"
                :hasSeperator="true"
                ui="bootstrap"
                label="L0000003700"
                name="maxPressure"
                v-model="safCheckMachine.maxPressure"
              ></y-number>
            </b-col>
            <b-col
              v-show="isEnergy"
              sm="6"
              md="6"
              lg="6"
              xl="6"
              class="col-xxl-3"
            >
              <!-- 제조업체 -->
              <y-text
                :width="8"
                :editable="editable"
                :maxlength="10"
                ui="bootstrap"
                label="L0000002627"
                name="makerNm"
                v-model="safCheckMachine.makerNm"
              ></y-text>
            </b-col>
            <b-col
              v-show="isEnergy"
              sm="6"
              md="6"
              lg="6"
              xl="6"
              class="col-xxl-3"
            >
              <!-- 조정자 -->
              <y-text
                :width="8"
                :editable="editable"
                :maxlength="10"
                ui="bootstrap"
                label="L0000003701"
                name="coordiUserId"
                v-model="safCheckMachine.coordiUserId"
              ></y-text>
            </b-col>
            <b-col
              v-show="isEnergy"
              sm="6"
              md="6"
              lg="6"
              xl="6"
              class="col-xxl-3"
            >
              <!-- 자격번호 -->
              <y-text
                :width="8"
                :editable="editable"
                :maxlength="10"
                ui="bootstrap"
                label="L0000003702"
                name="licenseNumber"
                v-model="safCheckMachine.licenseNumber"
              ></y-text>
            </b-col>
            <!-- 기계분류가 압력용기이면서 에너지인 경우 end -->

            <!-- 기계분류가 크레인&호이스트 경우 start -->
            <b-col
              v-show="isCraneHoist"
              sm="6"
              md="6"
              lg="6"
              xl="6"
              class="col-xxl-3"
            >
              <!-- 설치장소 -->
              <y-text
                :width="8"
                :editable="editable"
                :maxlength="10"
                ui="bootstrap"
                label="L0000003703"
                name="installPlace"
                v-model="safCheckMachine.installPlace"
              ></y-text>
            </b-col>
            <b-col
              v-show="isCraneHoist"
              sm="6"
              md="6"
              lg="6"
              xl="6"
              class="col-xxl-3"
            >
              <!-- 설치년도 -->
              <y-datepicker
                :width="8"
                :editable="editable"
                label="L0000001624"
                name="installDt"
                v-model="safCheckMachine.installDt"
              ></y-datepicker>
            </b-col>
            <b-col
              v-show="isCraneHoist"
              sm="6"
              md="6"
              lg="6"
              xl="6"
              class="col-xxl-3"
            >
              <!-- 철거년도 -->
              <y-datepicker
                :width="8"
                :editable="editable"
                label="L0000003704"
                name="withdrawDt"
                v-model="safCheckMachine.withdrawDt"
              ></y-datepicker>
            </b-col>
            <b-col
              v-show="isCraneHoist"
              sm="6"
              md="6"
              lg="6"
              xl="6"
              class="col-xxl-3"
            >
              <!-- 합격번호 -->
              <y-text
                :width="8"
                :editable="editable"
                :maxlength="10"
                ui="bootstrap"
                label="L0000003705"
                name="passNumber"
                v-model="safCheckMachine.passNumber"
              ></y-text>
            </b-col>
            <b-col
              v-show="isCraneHoist"
              sm="6"
              md="6"
              lg="6"
              xl="6"
              class="col-xxl-3"
            >
              <!-- EWR NO. -->
              <y-text
                :width="8"
                :editable="editable"
                :maxlength="10"
                ui="bootstrap"
                label="L0000003706"
                name="ewrNo"
                v-model="safCheckMachine.ewrNo"
              ></y-text>
            </b-col>
            <b-col
              v-show="isCraneHoist"
              sm="6"
              md="6"
              lg="6"
              xl="6"
              class="col-xxl-3"
            >
              <!-- 설계근거(정격하중) -->
              <y-text
                :width="8"
                :editable="editable"
                :maxlength="10"
                ui="bootstrap"
                label="L0000003707"
                name="designBasisWeight"
                v-model="safCheckMachine.designBasisWeight"
              ></y-text>
            </b-col>
            <b-col
              v-show="isCraneHoist"
              sm="6"
              md="6"
              lg="6"
              xl="6"
              class="col-xxl-3"
            >
              <!-- 설계근거(종류) -->
              <y-text
                :width="8"
                :editable="editable"
                :maxlength="10"
                ui="bootstrap"
                label="L0000003708"
                name="designBasisClass"
                v-model="safCheckMachine.designBasisClass"
              ></y-text>
            </b-col>
            <!-- 기계분류가 크레인&호이스트 경우 end -->
            <b-col
              v-show="!this.isEnergy && !this.isCraneHoist"
              sm="6"
              md="6"
              lg="6"
              xl="6"
              class="col-xxl-3"
            >
              <!-- 허가번호 -->
              <y-text
                :width="8"
                :editable="editable"
                :maxlength="30"
                ui="bootstrap"
                label="L0000003232"
                name="licenseNumber"
                v-model="safCheckMachine.licenseNumber"
              ></y-text>
            </b-col>
            <b-col
              v-show="(!isHighPressureGas && !isEnergy) || isCraneHoist"
              sm="6"
              md="6"
              lg="6"
              xl="6"
              class="col-xxl-3"
            >
              <!-- 검사증교부일자 -->
              <y-datepicker
                :width="8"
                :editable="editable"
                :required="true"
                label="L0000000317"
                name="inspIssueDt"
                :end="end"
                v-model="safCheckMachine.inspIssueDt"
              ></y-datepicker>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 최근검사일자 -->
              <y-datepicker
                :width="8"
                :editable="editable"
                label="L0000002880"
                name="recentInspDt"
                :end="end"
                v-model="safCheckMachine.recentInspDt"
                @datachange="nextIsnpDtChange"
              ></y-datepicker>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 차기검사일자 -->
              <y-datepicker
                :width="8"
                :editable="editable"
                label="L0000002794"
                name="nextIsnpDt"
                :end="end"
                v-model="safCheckMachine.nextIsnpDt"
              ></y-datepicker>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 검사주기 -->
              <y-select
                :width="8"
                :required="true"
                :editable="editable"
                :comboItems="cycleItems"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                name="inspCycleCd"
                label="L0000000316"
                v-model="safCheckMachine.inspCycleCd"
                v-validate="'required'"
                :state="validateState('inspCycleCd')"
                @datachange="nextIsnpDtChange"
              ></y-select>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 알람주기 -->
              <y-multi-select
                :required="true"
                :width="8"
                :editable="editable"
                :comboItems="alarmCycleItems"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                label="L0000001902"
                name="alarmCycs"
                v-model="safCheckMachine.alarmCycs"
                v-validate="'required'"
                :state="validateState('alarmCycs')"
              ></y-multi-select>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 검사대상 -->
              <!-- 대상 -->
              <!-- 미대상 -->
              <y-switch
                :width="8"
                :editable="editable"
                true-value="Y"
                false-value="N"
                ui="bootstrap"
                selectText="L0000003427"
                unselectText="L0000003686"
                label="L0000000310"
                name="inspYn"
                v-model="safCheckMachine.inspYn"
                v-validate="'required'"
                :state="validateState('inspYn')"
              ></y-switch>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 검사비용 -->
              <y-number
                :width="8"
                :editable="editable"
                :maxlength="8"
                :pointNumber="3"
                :hasSeperator="true"
                ui="bootstrap"
                label="L0000000312"
                name="inspFee"
                v-model="safCheckMachine.inspFee"
              ></y-number>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
              <!-- 제외사유 -->
              <y-text
                :width="10"
                :editable="editable"
                :maxlength="150"
                ui="bootstrap"
                label="L0000002621"
                name="excludeDesc"
                v-model="safCheckMachine.excludeDesc"
              ></y-text>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
              <!-- 비고 -->
              <y-text
                :width="10"
                :editable="editable"
                :maxlength="150"
                ui="bootstrap"
                label="L0000001360"
                name="remark"
                v-model="safCheckMachine.remark"
              ></y-text>
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
          :safCheckMachine.sync="safCheckMachine"
          :submitObject.sync="submitObject"
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
  name: 'hazardous-risk-mechanism-detail',
  props: {
    disabled: {
      type: Boolean,
      default: function() {
        return false;
      },
    },
    popupParam: {
      type: Object,
      default: {
        checkMachineNo: 0,
      },
    },
  },
  data() {
    return {
      safCheckMachine: {
        checkMachineNo: 0, // 기계기구번호
        plantCd: '', // 사업장코드
        machineTypeCd: '', // (C)기계분류
        pressureClsCd: '', // (C)압력용기유형
        itemNo: '', // itemNo
        volume: '', // 용량
        licenseNumber: '', // 허가(자격)번호
        inspIssueDt: '', // 검사증교부일자
        recentInspDt: '', // 최근검사일자
        nextIsnpDt: '', // 차기검사일자
        inspCycleCd: '', // (C)검사주기
        inspYn: 'N', // 검사대상
        inspFee: '', // 검사비용(수수료)
        manageNo: '', // 관리번호
        deptCd: '', // 담당부서코드
        deptNm: '', // 담당부서명
        excludeDesc: '', // 제외사유
        remark: '', // 비고
        alarmCycs: [], // 알람주기
        // <!-- 기계분류가 압력용기이면서 고압가스인 경우 start -->
        makerNm: '', // 제조사(제작업체)
        contents: '', // 내용적(L)
        designTemp: '', // 설계(온도)
        designPressKg: '', // 설계압력(kg/cm2)
        designPressMpa: '', // 설계압력(Mpa)
        inspPassDt: '', // 검사합격일자
        // <!-- 기계분류가 압력용기이면서 고압가스인 경우 end -->
        // <!-- 기계분류가 압력용기이면서 에너지인 경우 start -->
        pnid: '', // P&ID
        inspCertiNo: '', // 검사증번호
        psv: '', // psv
        operPresssure: '', // 운전(압력)
        operTemp: '', // 운전(온도)
        designPressure: '', // 설계(압력)
        service: '', // service
        part: '', // part
        maxPressure: '', // 최고사용압력
        coordiUserId: '', // 조정자
        // <!-- 기계분류가 압력용기이면서 에너지인 경우 end -->
        // <!-- 기계분류가 크레인&호이스트 경우 start -->
        installPlace: '', // 설치장소
        installDt: '', // 설치년도
        withdrawDt: '', // 철거년도
        passNumber: '', // 합격번호
        ewrNo: '', // EWR NO.
        designBasisWeight: '', // 설계근거(정격하중)
        designBasisClass: '', // 설계근거(종류)
        // <!-- 기계분류가 크레인&호이스트 경우 end -->
        createUserId: '',
        updateUserId: '',
        safCheckLogs: [], // 점검이력
        deleteSafCheckLogs: [], // 삭제할 점검이력
        safCheckUsers: [], // 알람 담당자
        deleteSafCheckUsers: [], // 삭제할 알람 담당자
      },
      gridOptions: {
        header: [],
        data: [],
        height: '320',
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
      machineItems: [],
      pressureItems: [],
      cycleItems: [],
      alarmCycleItems: [],
      end: '',
      isHighPressureGas: false,
      isEnergy: false,
      isCraneHoist: false,
      editable: false,
      isAuthGrpSafety: false,
      searchDetailUrl: '',
      saveUrl: '',
      isSave: false,
      actionType: 'POST',
      selectedValue: [],
      component: null,
      tabIndex: 0,
      tabItems: [
        { title: 'L0000003709', url: './hazardousRiskCheckHis.vue' }, // 검사이력
        { title: 'L0000000891', url: './hazardousRiskMechanismUser.vue' }, // 담당부서/담당자
      ],
      submitObject: {
        submitCheck: false,
      },
      attachFileGrps: [],
      saveAttachFiles: [],
      deleteUrl: '',
      isDelete: false,
      deleteValue: null,
    };
  },
  watch: {
    tabIndex: function(newValue, oldValue) {
      this.loadComponent();
    },
    'safCheckMachine.machineTypeCd'() {
      // 기계분류가 바꼈을 시
      if (this.safCheckMachine.machineTypeCd === 'M20') {
        // 크레인 인 경우
        this.isHighPressureGas = false;
        this.isEnergy = false;
        this.isCraneHoist = true;
      } else if (this.safCheckMachine.machineTypeCd === 'M30') {
        // 호이스트 인 경우
        this.isHighPressureGas = false;
        this.isEnergy = false;
        this.isCraneHoist = true;
      } else {
        if (this.safCheckMachine.pressureClsCd === 'PC20') {
          this.isHighPressureGas = true;
          this.isEnergy = false;
          this.isCraneHoist = false;
        } else if (this.safCheckMachine.pressureClsCd === 'PC30') {
          this.isHighPressureGas = false;
          this.isEnergy = true;
          this.isCraneHoist = false;
        } else {
          this.isHighPressureGas = false;
          this.isEnergy = false;
          this.isCraneHoist = false;
        }
      }
    },
    'safCheckMachine.pressureClsCd'() {
      // 압력용기 기계분류에서 종류가 바꼈을 시
      if (this.safCheckMachine.pressureClsCd === 'PC20') {
        this.isHighPressureGas = true;
        this.isEnergy = false;
        this.isCraneHoist = false;
      } else if (this.safCheckMachine.pressureClsCd === 'PC30') {
        this.isHighPressureGas = false;
        this.isEnergy = true;
        this.isCraneHoist = false;
      } else {
        this.isHighPressureGas = false;
        this.isEnergy = false;
        this.isCraneHoist = false;
      }
    },
    'gridOptions.data': {
      handler: function(val, oldVal) {
        let deleteData = this.$_.clone(this.safCheckMachine.safCheckLogs);
        this.$_.forEach(this.safCheckMachine.safCheckLogs, item => {
          if (item.checkLogNo) {
            let index = this.$_.findIndex(this.gridOptions.data, {
              checkLogNo: item.checkLogNo,
            });
            if (index === -1) {
              deleteData = this.$_.reject(deleteData, {
                checkLogNo: item.checkLogNo,
              });
            }
          } else {
            let index = this.$_.findIndex(this.gridOptions.data, {
              tempId: item.tempId,
            });
            if (index === -1) {
              deleteData = this.$_.reject(deleteData, {
                tempId: item.tempId,
              });
            }
          }
        });
        this.safCheckMachine.safCheckLogs = deleteData;

        this.$_.forEach(this.gridOptions.data, item => {
          if (item.checkLogNo) {
            let index = this.$_.findIndex(this.safCheckMachine.safCheckLogs, {
              checkLogNo: item.checkLogNo,
            });
            if (index > -1) {
              this.safCheckMachine.safCheckLogs[index] = item;
            } else {
              this.safCheckMachine.safCheckLogs.push(item);
            }
          } else {
            let index = this.$_.findIndex(this.safCheckMachine.safCheckLogs, {
              tempId: item.tempId,
            });
            if (index > -1) {
              this.safCheckMachine.safCheckLogs[index] = item;
            } else {
              this.safCheckMachine.safCheckLogs.push(item);
            }
          }
        });
      },
    },
  },
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
  },
  mounted() {
    this.init();
  },
  beforeDestroy() {},
  /** methods **/
  methods: {
    init() {
      this.editable = this.$route.meta.editable;
      this.isAuthGrpSafety = this.$store.getters.userAuthGrps.filter(d => Number(d.authGrpNo) === 1021 && d.settingYn === 'Y').length > 0;
      // URL 셋팅
      this.searchDetailUrl = selectConfig.saf.hazardousRiskMechanism.get.url;
      this.saveUrl = transactionConfig.saf.hazardousRiskMechanism.insert.url;
      this.deleteUrl = transactionConfig.saf.hazardousRiskMechanism.delete.url;

      this.end = this.$comm.getToday();

      // 기계분류
      this.$comm.getComboItems('MACHINE_TYPE_CD').then(_result => {
        this.machineItems = _result;
        this.safCheckMachine.machineTypeCd = this.safCheckMachine.machineTypeCd
          ? this.safCheckMachine.machineTypeCd
          : this.machineItems[0].code;
      });
      // 압력용기유형
      this.$comm.getComboItems('PRESSURE_CLS_CD').then(_result => {
        this.pressureItems = _result;
        this.safCheckMachine.pressureClsCd = this.safCheckMachine.pressureClsCd
          ? this.safCheckMachine.pressureClsCd
          : this.pressureItems[0].code;
      });
      // 검사주기
      this.$comm.getComboItems('INSP_CYCLE_CD', false).then(_result => {
        this.cycleItems = _result;

        this.safCheckMachine.inspCycleCd = this.safCheckMachine.inspCycleCd
          ? this.safCheckMachine.inspCycleCd
          : this.cycleItems[0].code;
      });
      // 알람 주기
      this.$comm.getComboItems('ALARM_CYCLE').then(_result => {
        this.alarmCycleItems = _result;
      });

      this.getDetail();
    },
    getDetail() {
      if (!this.popupParam.checkMachineNo) {
        return;
      } else {
        this.$http.url = this.$format(
          this.searchDetailUrl,
          this.popupParam.checkMachineNo
        );
        this.$http.type = 'GET';
        this.$http.request(_result => {
          this.safCheckMachine = this.$_.clone(_result.data);
          this.gridOptions.data = this.$_.clone(_result.data.safCheckLogs);
          let tempAlarmCycs = this.$_.clone(this.safCheckMachine.alarmCycs);
          this.safCheckMachine.alarmCycs = [];
          this.$_.forEach(tempAlarmCycs, item => {
            this.safCheckMachine.alarmCycs.push({
              code: item.alarmCycleCd,
              name: item.alarmCycleNm,
            });
          });
        });
      }
    },
    validateState(_ref) {
      if (!_ref) return;
      if (
        this.veeBag[_ref] &&
        (this.veeBag[_ref].dirty || this.veeBag[_ref].validated)
      ) {
        return !this.errors.has(_ref);
      }
      return null;
    },
    beforeSave() {
      if (this.popupParam.checkMachineNo) {
        this.saveUrl = transactionConfig.saf.hazardousRiskMechanism.edit.url;
        this.actionType = 'PUT';
        this.checkValidator('edit');
      } else {
        this.saveUrl = transactionConfig.saf.hazardousRiskMechanism.insert.url;
        this.actionType = 'POST';
        this.checkValidator('insert');
      }
    },
    checkValidator(flag) {
      if (this.safCheckMachine.safCheckUsers.length < 1) {
        window.getApp.$emit('APP_VALID_ERROR', 'M0000000644'); // 담당자를 입력하세요.
        return;
      }
      let isValCk = true;

      this.$_.forEach(this.safCheckMachine.safCheckLogs, item => {
        if (item.inspDt === null || item.inspDt === '') {
          isValCk = false;
        }
      });
      if (!isValCk) {
        window.getApp.$emit('APP_VALID_ERROR', 'M0000000919'); // 검사일자를 입력해 주세요.
        return;
      }

      this.$validator
        .validateAll()
        .then(_result => {
          if (_result) {
            window.getApp.$emit('CONFIRM', {
              title: 'L0000003321', // 확인
              message: 'M0000000011', // 저장하시겠습니까?
              // TODO : 필요시 추가하세요.
              type: 'info', // success / info / warning / error
              // 확인 callback 함수
              confirmCallback: () => {
                this.safCheckMachine.createUserId = this.$store.getters.token;
                this.safCheckMachine.updateUserId = this.$store.getters.token;

                this.$_.forEach(this.safCheckMachine.alarmCycs, item => {
                  item.alarmCycleCd = item.code;
                  item.alarmCycleNm = item.name;
                });
                this.isSave = true;
              },
            });
          } else {
            window.getApp.$emit(
              'APP_VALID_ERROR',
              'M0000000005' // 필수 입력값을 입력해 주세요.
            );
          }
        })
        .catch(() => {
          this.isSave = false;
          window.getApp.$emit(
            'APP_VALID_ERROR',
            'M0000000876' // 유효성 검사도중 에러가 발생하였습니다.
          );
        });
    },
    btnSaveClickedCallback(_result) {
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // 안내
        message: 'M0000000006', // 저장되었습니다.
        type: 'success',
      });
      if (!this.popupParam.checkMachineNo) {
        this.popupParam.checkMachineNo = _result.data;
        this.safCheckMachine.checkMachineNo = _result.data;
      }
      this.isSave = false;
      this.getDetail();
    },
    // 버튼 에러 처리
    btnClickedErrorCallback(_result) {
      this.isSave = false;
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    // 팝업 닫기
    btnClosePopup() {
      // 부모창에 값 전달
      this.$emit('closePopup', { success: true });
    },
    btnAdd() {
      var date = new Date();
      this.gridOptions.data.splice(0, 0, {
        tempId: String(date.getTime()),
        checkMachineNo: this.safCheckMachine.checkMachineNo,
        itemNo: this.safCheckMachine.itemNo,
        inspDt: '',
        remark: '',
      });
    },
    // btnSearchUserClicked(_item) {
    //   if (!this.editable) return;
    //   this.popupOptions.target = () =>
    //     import(`${'../../manage/user/userSearch.vue'}`);
    //   this.popupOptions.param = {
    //     plantCd: this.safCheckMachine.plantCd, // 선택한 사업장의 정보가 따라서 조회되도록 설정
    //   };
    //   this.popupOptions.title = '담당자검색';
    //   this.popupOptions.visible = true;
    //   this.popupOptions.width = '60%';
    //   this.popupOptions.top = '100px';
    //   this.popupOptions.closeCallback = this.closePopupSearchUser;
    // },
    // closePopupSearchUser(data) {
    //   this.popupOptions.target = null;
    //   this.popupOptions.visible = false;

    //   if (data.user) {
    //     this.safCheckMachine.alarmUserId = data.user.userId;
    //     this.safCheckMachine.alarmUserNm = data.user.userNm;
    //     this.safCheckMachine.deptCd = data.user.deptCd;
    //     this.safCheckMachine.deptNm = data.user.deptNm;
    //   }
    // },
    loadComponent() {
      var path = this.tabItems[this.tabIndex].url;

      if (path === 'multiFileUpload') {
        this.component = () =>
          import('@/pages/common/attachFile/multiFileUpload');
      } else if (path === 'imprActTab') {
        this.component = () => import('@/pages/impr/imprActTab');
      } else this.component = () => import(`${path}`);
    },
    beforeDelete() {
      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321', // 확인
        message: 'M0000000012', // 삭제하시겠습니까?
        type: 'info',
        confirmCallback: () => {
          this.safCheckMachines = [];
          this.safCheckMachines.push(this.safCheckMachine);
          this.deleteValue = {
            data: Object.values(this.$_.clone(this.safCheckMachines)),
          };
          this.isDelete = true;
        },
      });
    },
    btnDeleteClickedCallback(_result) {
      this.isDelete = false;
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // 안내
        message: 'M0000000007', // 삭제되었습니다.
        type: 'success',
      });
      this.btnClosePopup();
    },
    nextIsnpDtChange(data) {
      if (
        this.safCheckMachine.recentInspDt !== null &&
        this.safCheckMachine.recentInspDt !== ''
      ) {
        if (
          this.safCheckMachine.inspCycleCd !== null &&
          this.safCheckMachine.inspCycleCd !== ''
        ) {
          let addDate =
            this.safCheckMachine.inspCycleCd.substr(1) +
            this.safCheckMachine.inspCycleCd.substring(0, 1).toLowerCase();

          this.safCheckMachine.nextIsnpDt = this.$comm.getCalculatedDate(
            this.safCheckMachine.recentInspDt,
            addDate,
            'YYYY-MM-DD',
            'YYYY-MM-DD'
          );
        }
      }
    },
  },
};
</script>
