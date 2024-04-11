<!--
  목적 : 공사 상세
  Detail : 공사 상세 화면
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <!-- 검색 -->
    <b-row>
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- 등록자 정보 -->
            <y-label
              label="L0000000977"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div class="float-right mb-1">
              <!-- 결재요청 -->
              <y-btn
                v-if="
                  !insertCheck &&
                  !popupParam.apprFlag &&
                  editable &&
                  popupParam.constStepCd === 'CONS1'
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
                v-if="insertCheck && editable && !authDuringAppr"
                :action-url="insertUrl"
                :param="constSafe"
                :is-submit="isInsert"
                title="L0000002474"
                color="orange"
                action-type="POST"
                beforeSubmit="beforeInsert"
                @beforeInsert="beforeInsert"
                @btnClicked="btnInsertClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!-- 저장 -->
              <y-btn
                v-if="editCheck && editable && !authDuringAppr"
                :action-url="editUrl"
                :param="constSafe"
                :is-submit="isEdit"
                title="L0000002474"
                color="orange"
                action-type="PUT"
                beforeSubmit="beforeEdit"
                @beforeEdit="beforeEdit"
                @btnClicked="btnEditClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />

              <!-- 완료 -->
              <y-btn
                v-if="
                  popupParam.constStepCd && constSafe.constStepCd === 'CONS3'
                "
                :action-url="actUrl"
                :is-submit="isSave"
                title="L0000002039"
                color="orange"
                action-type="PUT"
                beforeSubmit="beforeEdit"
                @beforeEdit="beforeComplete('Y')"
                @btnClicked="btnEditCompleClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />

              <!-- 완료취소 -->
              <y-btn
                v-if="
                  popupParam.constStepCd && constSafe.constStepCd === 'CONS4'
                "
                :action-url="actUrl"
                :is-submit="isSave"
                title="L0000002045"
                color="orange"
                action-type="PUT"
                beforeSubmit="beforeEdit"
                @beforeEdit="beforeComplete('N')"
                @btnClicked="btnEditCancelClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />

              <!-- 삭제 -->
              <y-btn
                v-if="
                  !insertCheck &&
                  popupParam.constStepCd !== 'CONS3' &&
                  popupParam.constStepCd !== 'CONS4' &&
                  !popupParam.apprFlag &&
                  editable &&
                  !authDuringAppr
                "
                :action-url="deleteUrl"
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
              <y-btn
                v-if="!popupParam.apprFlag"
                title="L0000000881"
                @btnClicked="closeSndPopup"
              />
            </div>
          </b-col>
        </b-row>
        <b-card>
          <b-row>
            <!-- 등록일 -->
            <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
              <y-label label="L0000000973" />
              <y-label :label="constSafe.createDt" :fieldable="true" />
            </b-col>
            <!-- 등록부서 -->
            <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
              <y-label label="L0000000971" />
              <y-label :label="constSafe.createDeptNm" :fieldable="true" />
            </b-col>
            <!-- 등록자 -->
            <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
              <y-label label="L0000000976" />
              <y-label :label="constSafe.createUserNm" :fieldable="true" />
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>
    <b-row class="mt-3">
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- 공사 상세 -->
            <y-label
              label="L0000000499"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
          </b-col>
        </b-row>
        <b-card>
          <b-row>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-plant
                type="edit"
                :required="true"
                :editable="editable"
                :disabled="updateMod || authDuringAppr"
                name="plantCd"
                v-model="constSafe.plantCd"
                v-validate="'required'"
                :state="validateState('plantCd')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- PO번호 -->
              <y-text
                :width="8"
                :disabled="updateMod || authDuringAppr"
                :editable="editable"
                :required="true"
                ui="bootstrap"
                label="L0000000139"
                name="constNum"
                v-model="constSafe.constNum"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 작업기간 -->
              <y-datepicker
                :width="8"
                :disabled="updateMod || authDuringAppr"
                :editable="editable"
                label="L0000002373"
                name="period"
                :required="true"
                :range="true"
                :clearable="true"
                :default="constSafe.period"
                v-model="constSafe.period"
                v-validate="'required'"
                :state="validateState('period')"
              ></y-datepicker>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 협력업체 노출여부 -->
              <y-switch
                :width="8"
                :editable="editable"
                :disabled="updateMod || authDuringAppr"
                true-value="Y"
                false-value="N"
                ui="bootstrap"
                label="L0000003250"
                name="radioValue"
                selectText="L0000003561"
                unselectText="L0000003562"
                v-model="constSafe.showVendorYn"
              ></y-switch>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
              <!-- 작업구분 -->
              <y-multi-select
                :width="10"
                :disabled="updateMod || authDuringAppr"
                :editable="editable"
                :comboItems="comboWkodKindItems"
                :required="true"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                label="L0000002368"
                name="wkodKindCd"
                v-model="wkodKindCds"
                v-validate="'required'"
                :state="validateState('wkodKindCd')"
              ></y-multi-select>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
              <!-- 공사명 -->
              <y-text
                :width="10"
                :maxlength="65"
                :disabled="updateMod || authDuringAppr"
                :editable="editable"
                :required="true"
                ui="bootstrap"
                label="L0000000503"
                name="constTitle"
                v-model="constSafe.constTitle"
                v-validate="'required'"
                :state="validateState('constTitle')"
              ></y-text>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
              <!-- 공사내용 -->
              <y-textarea
                :width="10"
                :maxlength="2000"
                :disabled="updateMod || authDuringAppr"
                :editable="editable"
                :required="true"
                ui="bootstrap"
                label="L0000000502"
                name="constContent"
                v-model="constSafe.constContent"
                v-validate="'required'"
                :state="validateState('constContent')"
              ></y-textarea>
            </b-col>
            <b-col
              v-if="
                popupParam.constStepCd && popupParam.constStepCd !== 'CONS1'
              "
              sm="6"
              md="6"
              lg="6"
              xl="6"
              class="col-xxl-3"
            >
              <!-- 공사 완료
              <y-switch
                :width="8"
                :editable="editable2 && !authDuringAppr"
                true-value="Y"
                false-value="N"
                ui="bootstrap"
                label="L0000000500"
                name="isComplete"
                selectText="L0000002039"
                unselectText="L0000003563"
                v-model="isComplete"
              ></y-switch>
              -->
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>

    <!-- 검색 -->
    <b-row v-if="wkodKindVendors && wkodKindVendors.length > 0" class="mt-3">
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- 작업구분별 업체 정보 -->
            <y-label
              label="L0000002371"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
          </b-col>
        </b-row>
        <b-card>
          <b-row>
            <b-col
              v-for="(wkodKindVendor, i) in wkodKindVendors"
              :key="i"
              sm="12"
              md="12"
              lg="12"
              xl="12"
              class="col-xxl-6 mb-3"
            >
              <el-card class="box-card cardStyle" shadow="never">
                <div slot="header" class="clearfix">
                  <span>
                    <b>{{ wkodKindVendor.wkodKindNm }}</b>
                  </span>
                  <div class="float-right">
                    <!-- 자체 -->
                    <y-btn
                      v-if="!updateMod && editable && !authDuringAppr"
                      title="L0000002333"
                      color="orange"
                      @btnClicked="
                        setPoongsan(
                          wkodKindVendor.wkodKindCd,
                          wkodKindVendor.vendors
                        )
                      "
                      @btnClickedErrorCallback="btnClickedErrorCallback"
                    />
                    <!-- 업체 추가 -->
                    <y-btn
                      v-if="!updateMod && editable && !authDuringAppr"
                      title="L0000004660"
                      color="orange"
                      @btnClicked="
                        openVendor(
                          wkodKindVendor.wkodKindCd,
                          wkodKindVendor.vendors
                        )
                      "
                      @btnClickedErrorCallback="btnClickedErrorCallback"
                    />
                  </div>
                </div>
                <el-collapse
                  v-if="
                    wkodKindVendor.vendors && wkodKindVendor.vendors.length > 0
                  "
                  v-model="wkodKindVendor.collapse"
                  @change="gridResize"
                >
                  <div
                    v-for="(vendor, i) in wkodKindVendor.vendors"
                    :key="i"
                    class="collapse-header"
                  >
                    <div class="float-right">
                      <y-btn
                        v-if="popupParam.constNo && editable && !authDuringAppr"
                        :title="vendor.statusTitle"
                        color="orange"
                        @btnClicked="
                          setStatus(wkodKindVendor.wkodKindCd, vendor.vendorCd)
                        "
                        @btnClickedErrorCallback="btnClickedErrorCallback"
                      />
                      <!-- 제거 -->
                      <y-btn
                        v-if="editable && !authDuringAppr"
                        title="L0000002615"
                        color="red"
                        @btnClicked="
                          deleteVendor(
                            wkodKindVendor.wkodKindCd,
                            vendor.vendorCd
                          )
                        "
                        @btnClickedErrorCallback="btnClickedErrorCallback"
                      />
                    </div>
                    <el-collapse-item :name="vendor.vendorCd">
                      <template slot="title">
                        <b-col style="width: 70%">
                          <y-label
                            :label="
                              $comm.getLangSpecInfoLabel('L0000003565', {
                                s1: vendor.vendorNm,
                              })
                            "
                            color-class="cutstom-title-color"
                            class="kindVendorNmStyle"
                          />
                        </b-col>
                      </template>
                      <b-row>
                        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
                          <!-- 작업기간, 업체 작업기간 -->
                          <y-datepicker
                            :width="8"
                            :disabled="
                              updateMod ||
                              vendor.subconnStepCd === 'STEP2' ||
                              authDuringAppr
                            "
                            :editable="editable"
                            :label="
                              vendor.vendorCd === ''
                                ? 'L0000002373'
                                : 'L0000001952'
                            "
                            :name="
                              wkodKindVendor.wkodKindCd +
                              vendor.vendorCd +
                              'period'
                            "
                            :start="start"
                            :end="end"
                            :required="true"
                            :range="true"
                            :clearable="true"
                            :default="vendor.period"
                            v-model="vendor.period"
                            v-validate="'required'"
                            :state="
                              validateState(
                                wkodKindVendor.wkodKindCd +
                                  vendor.vendorCd +
                                  'period'
                              )
                            "
                          ></y-datepicker>
                        </b-col>
                        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
                          <!-- 산재관리번호 -->
                          <y-text
                            :width="8"
                            :maxlength="15"
                            :disabled="
                              updateMod ||
                              vendor.subconnStepCd === 'STEP2' ||
                              authDuringAppr
                            "
                            :editable="editable"
                            :name="
                              wkodKindVendor.wkodKindCd +
                              vendor.vendorCd +
                              'indAccNum'
                            "
                            :required="vendor.vendorCd === '' ? false : true"
                            ui="bootstrap"
                            label="L0000001502"
                            v-model="vendor.indAccNum"
                            v-validate="
                              vendor.vendorCd !== '' ? 'required' : ''
                            "
                            :state="
                              validateState(
                                vendor.vendorCd !== ''
                                  ? wkodKindVendor.wkodKindCd +
                                      vendor.vendorCd +
                                      'indAccNum'
                                  : null
                              )
                            "
                          ></y-text>
                        </b-col>
                        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
                          <!-- 2차 도급업체명 -->
                          <y-text
                            :width="8"
                            :disabled="
                              updateMod ||
                              vendor.subconnStepCd === 'STEP2' ||
                              authDuringAppr
                            "
                            :editable="editable"
                            ui="bootstrap"
                            label="L0000000096"
                            v-model="vendor.subconn2rdNm"
                          ></y-text>
                        </b-col>
                        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
                          <!-- 3차 도급업체명 -->
                          <y-text
                            :width="8"
                            :maxlength="15"
                            :disabled="
                              updateMod ||
                              vendor.subconnStepCd === 'STEP2' ||
                              authDuringAppr
                            "
                            :editable="editable"
                            :name="
                              wkodKindVendor.wkodKindCd +
                              vendor.vendorCd +
                              'subconn3rdNm'
                            "
                            ui="bootstrap"
                            label="L0000000099"
                            v-model="vendor.subconn3rdNm"
                          ></y-text>
                        </b-col>
                      </b-row>
                      <b-row>
                        <b-col sm="12">
                          <div class="float-right mb-1">
                            <!-- 추가 -->
                            <y-btn
                              v-if="
                                editable &&
                                vendor.subconnStepCd !== 'STEP2' &&
                                !authDuringAppr
                              "
                              title="L0000002892"
                              color="orange"
                              @btnClicked="
                                addPersonPopup(
                                  wkodKindVendor.wkodKindCd,
                                  vendor.vendorCd,
                                  vendor.constKindSubconnWorkers
                                )
                              "
                              @btnClickedErrorCallback="btnClickedErrorCallback"
                            />
                            <!-- 제외 -->
                            <y-btn
                              v-if="
                                editable &&
                                vendor.subconnStepCd !== 'STEP2' &&
                                !authDuringAppr
                              "
                              title="L0000002620"
                              color="red"
                              @btnClicked="
                                deletePersonPopup(
                                  wkodKindVendor.wkodKindCd,
                                  vendor.vendorCd,
                                  vendor.constKindSubconnWorkers
                                )
                              "
                              @btnClickedErrorCallback="btnClickedErrorCallback"
                            />
                          </div>
                        </b-col>
                        <b-col sm="12">
                          <y-auigrid
                            v-if="vendor.vendorCd !== ''"
                            :editable="
                              editable &&
                              vendor.subconnStepCd !== 'STEP2' &&
                              !authDuringAppr
                            "
                            :ref="'yAuiGrid' + i"
                            :headers="gridOptions.header"
                            :height="gridOptions.height"
                            :items="vendor.constKindSubconnWorkers"
                            :label="'L0000002413'"
                            :useExcelExport="false"
                            :showRowCheckColumn="
                              editable &&
                              vendor.subconnStepCd !== 'STEP2' &&
                              !authDuringAppr
                            "
                          />
                          <y-auigrid
                            v-else-if="vendor.vendorCd === ''"
                            :editable="
                              editable &&
                              vendor.subconnStepCd !== 'STEP2' &&
                              !authDuringAppr
                            "
                            :ref="'yAuiGrid' + i"
                            :headers="PoongsanGridOptions.header"
                            :height="PoongsanGridOptions.height"
                            :items="vendor.constKindSubconnWorkers"
                            :label="'L0000002413'"
                            :useExcelExport="false"
                            :showRowCheckColumn="
                              editable &&
                              vendor.subconnStepCd !== 'STEP2' &&
                              !authDuringAppr
                            "
                          />
                        </b-col>
                      </b-row>
                      <!-- 작업자 목록 -->
                      <!-- <y-data-table
                        v-if="vendor.vendorCd !== ''"
                        :editable="
                          editable &&
                          vendor.subconnStepCd !== 'STEP2' &&
                          !authDuringAppr
                        "
                        label="L0000002413"
                        :height="150"
                        :headers="gridOptionsHeader"
                        :items="vendor.constKindSubconnWorkers"
                        v-model="vendor.deleteWorkers"
                        :popMode="true"
                      >
                        <el-table-column
                          v-if="
                            editable &&
                            vendor.subconnStepCd !== 'STEP2' &&
                            !authDuringAppr
                          "
                          type="selection"
                          slot="selection"
                          width="55"
                        ></el-table-column>
                      </y-data-table> -->
                      <!-- 작업자 목록 -->
                      <!-- <y-data-table
                        v-else-if="vendor.vendorCd === ''"
                        :editable="
                          editable &&
                          vendor.subconnStepCd !== 'STEP2' &&
                          !authDuringAppr
                        "
                        label="L0000002413"
                        :height="150"
                        :headers="gridOptionsPoongsanHeader"
                        :items="vendor.constKindSubconnWorkers"
                        v-model="vendor.deleteWorkers"
                        :popMode="true"
                      >
                        <el-table-column
                          v-if="
                            editable &&
                            vendor.subconnStepCd !== 'STEP2' &&
                            !authDuringAppr
                          "
                          type="selection"
                          slot="selection"
                          width="55"
                        ></el-table-column>
                      </y-data-table> -->
                      <div class="mt-3" />
                      <!-- 안전관리계획서 -->
                      <y-file-upload
                        :ref="
                          wkodKindVendor.wkodKindCd +
                          vendor.vendorCd +
                          'fileupload'
                        "
                        label="L0000003572"
                        :showUploadBtn="false"
                        :drag="false"
                        :multiple="true"
                        :attach-file-grp="vendor.attachFileGrp"
                        :close="true"
                        :limit="20"
                        :editable="vendor.attachFileGrp.editable"
                        :disabled="
                          vendor.attachFileGrp.disabled ||
                          vendor.subconnStepCd === 'STEP2' ||
                          authDuringAppr
                        "
                        listType="text"
                        :showFileSearch="
                          vendor.attachFileGrp.showFileSearch &&
                          vendor.subconnStepCd !== 'STEP2'
                        "
                        :onlyDownload="
                          vendor.attachFileGrp.onlyDownload ||
                          vendor.subconnStepCd === 'STEP2'
                        "
                        :uploadTempFiles="vendor.attachFileGrp.uploadTempFiles"
                        @closePopup="closeAttachPopup"
                        @uploadFiles="safetyPlanUploadFiles"
                        @setDeleteTempFileData="setDeleteTempFileData"
                      ></y-file-upload>
                    </el-collapse-item>
                  </div>
                </el-collapse>
              </el-card>
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>
    <el-tabs
      type="border-card"
      v-model="tabIndex"
      class="mt-3"
      @tab-click="tabClick"
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
      </el-tab-pane>
      <keep-alive>
        <component
          v-if="component"
          :is="component"
          :paneName="paneName"
          :isConstWrite="true"
          :constSafe.sync="constSafe"
          :constUpdateMod="editable"
          :authDuringAppr="authDuringAppr"
          @closePopup="closeSndPopup2"
          sm="12"
          :submitObject="submitObject"
          :attachFileGrps="safAttachFileGrps"
          :saveAttachFiles="safSaveAttachFiles"
          @changeUploadFiles="changeUploadFiles"
          @setTempDeleteFiles="setTempDeleteFiles"
          :wkodKindVendors.sync="wkodKindVendors"
          :editable.sync="editable"
          :updateMod.sync="updateMod"
          :popupParam.sync="popupParam"
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
  name: 'const-safe-detail',
  props: {
    popupParam: {
      type: Object,
      default: {
        constNo: '',
        constStepCd: '',
        apprFlag: false,
        apprRqstNo: 0,
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
      constSafe: {
        plantCd: null,
        constNo: '',
        constNum: '',
        constTitle: '',
        period: [],
        constStartYmd: '',
        constEndYmd: '',
        wkodKindCds: [],
        constContent: '',
        showVendorYn: 'N',
        assessPlanNo: 0,
        assessNm: '',
        constStepCd: '',

        isApprRequest: false,
        createDt: '',
        createDeptNm: '',
        createUserNm: '',
        createUserId: '',
        updateUserId: '',

        constLotos: [], // LOTO 데이터
        constLegalLcns: [], // 법적인허가 대상항목
        apprRqstNo: 0,
      },
      isComplete: 'N',
      wkodKindCds: [],
      wkodKindCd: '',
      vendorCd: '',
      isInit: true,
      wkodKindChangeCancel: false,
      searchWkodKindVendors: [],
      wkodKindVendors: [],
      gridOptionsHeader: [],

      gridOptionsPoongsanHeader: [],
      gridOptions: {
        header: [],
        data: [],
        height: '150',
      },
      PoongsanGridOptions: {
        header: [],
        data: [],
        height: '150',
      },

      persons: [],
      start: '',
      end: '',

      submitCheck: false,

      saveAttachFiles: [],
      tempDeleteFiles: [],

      // 공사안전정보 첨부파일
      attach: null, // 첨부파일컴포넌트
      submitObject: {
        submitCheck: false,
      },
      safSaveAttachFiles: [],
      safTempDeleteFiles: [],
      safAttachFileGrps: [],

      paneName: '',
      tabItems: [
        { title: 'L0000000505', url: 'fileUploadPage' }, // 공사안전정보
        { title: 'L0000001592', url: './LOTO' }, // 설비&loto
        { title: 'L0000000123', url: './assessRsultInsertTab' }, // JSA평가결과
        {
          title: 'L0000001210', // 법적 인허가 대상
          url: './constSafeOriginTarget',
        },
      ],
      editable: true,
      editable2: true,
      authEditable: false,
      component: null,
      tabIndex: 0,
      comboWkodKindItems: [],
      insertUrl: '',
      editUrl: '',
      deleteUrl: '',
      completeUrl: '',
      completeConstUrl: '',
      searchDetailUrl: '',
      checkUrl: '',
      isInsert: false,
      isEdit: false,
      isDelete: false,
      insertCheck: false,
      editCheck: false,
      updateMod: false,
      deleteValue: null,
      authDuringAppr: false,
      collectCheck: false,
      collectUrl: '',
      actUrl: '',
      isSave: false,
      wkodKindVendorsRequiredInputCheck: false,
    };
  },
  watch: {
    tabIndex() {
      this.loadComponent();
    },
    submitCheck: {
      handler: function (val, oldVal) {
        // true
        if (val) {
          this.$_.forEach(this.wkodKindVendors, (kind) => {
            this.$_.forEach(kind.vendors, (vendor) => {
              this.$refs[
                kind.wkodKindCd + vendor.vendorCd + 'fileupload'
              ][0].submitUpload();
            });
          });

          if (this.tempDeleteFiles && this.tempDeleteFiles.length > 0) {
            this.$http.url = transactionConfig.attachFile.deleteMulti.url;
            this.$http.type = 'DELETE';
            this.$http.param = {
              data: Object.values(this.$_.clone(this.tempDeleteFiles)),
            };
            this.$http.request((_result) => {
              this.tempDeleteFiles = [];
              this.closeSndPopup2();
            });
          } else {
            this.closeSndPopup2();
          }
          this.submitCheck = false;
        }
      },
    },
    'constSafe.period': {
      handler: function (val, oldVal) {
        if (this.constSafe.period && this.constSafe.period.length === 2) {
          this.start = this.constSafe.period[0];
          this.end = this.constSafe.period[1];
        }
      },
      deep: true,
    },
    wkodKindCds: {
      // 공사현황 동적탭생성
      handler: function (val, oldVal) {
        let idx;
        let num = Number(val.length) - 1;

        if (!this.isInit && !this.wkodKindChangeCancel) {
          let isWkodKindAdd = false;
          this.$_.forEach(this.wkodKindCds, (item) => {
            // 추가되는 경우
            if (
              this.$_.findIndex(this.wkodKindVendors, {
                wkodKindCd: item.code,
              }) === -1
            ) {
              isWkodKindAdd = true;
              this.wkodKindVendors.push({
                wkodKindCd: item.code,
                wkodKindNm: item.name,
                vendors: [],
              });
              // 상세조회의 데이터 중 작업구분별 업체에 대한 정보가 있는 경우
              if (
                this.searchWkodKindVendors &&
                this.searchWkodKindVendors.length > 0
              ) {
                this.$_.forEach(this.searchWkodKindVendors, (vendor) => {
                  let taskKey = this.popupParam.constNo
                    ? this.popupParam.constNo.toString() +
                      vendor.wkodKindCd +
                      vendor.vendorCd
                    : '';
                  let index = this.$_.findIndex(this.wkodKindVendors, {
                    wkodKindCd: vendor.wkodKindCd,
                  });
                  if (
                    index > -1 &&
                    this.wkodKindVendors[index].wkodKindCd === item.code
                  ) {
                    this.wkodKindVendors[index].vendors.push({
                      constKindSubconnNo: vendor.constKindSubconnNo,
                      vendorCd: vendor.vendorCd,
                      vendorNm: vendor.vendorNm,
                      statusTitle:
                        vendor.subconnStepCd === 'STEP2'
                          ? this.$comm.getLangSpecInfoLabel('L0000002045')
                          : this.$comm.getLangSpecInfoLabel('L0000002039'),
                      subconnStepCd: vendor.subconnStepCd,
                      selfYn: vendor.selfYn,
                      indAccNum: vendor.indAccNum, // 산재관리번호
                      constKindSubconnWorkers: vendor.constKindSubconnWorkers,
                      period: [vendor.constStartYmd, vendor.constEndYmd],
                      constStartYmd: vendor.constStartYmd,
                      constEndYmd: vendor.constEndYmd,
                      subconn2rdNm: vendor.subconn2rdNm,
                      subconn3rdNm: vendor.subconn3rdNm,
                      attachFileGrp: {
                        editable: this.editable,
                        disabled: this.updateMod,
                        showFileSearch: !this.updateMod,
                        onlyDownload: this.updateMod,
                        uploadTempFiles: null,
                        taskClassNm:
                          'CONST_SAFE' + vendor.wkodKindCd + vendor.vendorCd,
                        taskKey: taskKey,
                        taskFlag: '',
                        createUserId: this.$store.getters.token,
                        wkodKindCd: vendor.wkodKindCd, // 나중에 파일 업로드의 정보를 찾기 위한 용도
                        vendorCd: vendor.vendorCd, // 나중에 파일 업로드의 정보를 찾기 위한 용도
                        hasUploadList: false,
                      },
                    });

                    let collapse = [];

                    for (
                      let i = 0;
                      i < this.wkodKindVendors[index].vendors.length;
                      i++
                    ) {
                      collapse.push(
                        this.wkodKindVendors[index].vendors[i].vendorCd
                      );
                    }

                    this.wkodKindVendors[index].collapse = collapse;
                  }
                });
              }
              return false;
            }
          });
          // 추가가 아닌 경우 컨펌을 받고 삭제 처리
          if (
            !isWkodKindAdd &&
            (this.wkodKindCds.length > 0 ||
              (this.wkodKindCds.length === 0 && oldVal.length === 1))
          ) {
            window.getApp.$emit('CONFIRM', {
              title: 'L0000003321',
              message: 'M0000000211',
              // 작업구분을 변경하시면 작업구분별 업체정보가 변경 될 수 있습니다. \n변경하시겠습니까?
              type: 'info',
              confirmCallback: () => {
                this.$_.forEach(this.wkodKindVendors, (item) => {
                  if (
                    this.$_.findIndex(this.wkodKindCds, {
                      code: item.wkodKindCd,
                    }) === -1
                  ) {
                    this.wkodKindVendors = this.$_.reject(
                      this.wkodKindVendors,
                      {
                        wkodKindCd: item.wkodKindCd,
                      }
                    );
                    return false;
                  }
                });
                // 삭제가 아니였을 시 추가 여부 체크
                // if (!isWkodKindDelete) {
                // }
              },
              cancelCallback: () => {
                this.wkodKindChangeCancel = true;
                this.wkodKindCds = oldVal;
              },
            });
          }
        } else {
          this.isInit = false;
          this.wkodKindChangeCancel = false;
        }

        // 동적탭
        // if (val.length > oldVal.length) {
        //   val.forEach(item => {
        //     idx = this.$_.findIndex(oldVal, { code: item.code });
        //     if (idx < 0) {
        //       this.tabItems.push(
        //         { title: this.wkodKindCds[num].name, url: './탭이름.vue' },
        //       )
        //     }
        //   })
        // } else {
        //   let i = 0;
        //   let j = 0;
        //   oldVal.forEach(item => {
        //     idx = this.$_.findIndex(val, { code: item.code });
        //     if (idx >= 0) {
        //       i++;
        //       return;
        //     } else {
        //       j = i;
        //     }
        //   })
        //   j = 4 + j;
        //   this.tabItems.splice(j, 1);
        // }
        // // //
      },
    },
  },
  //* Vue lifecycle: created, mounted, destroyed, etc */
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.editable = this.$route.meta.editable;
    this.editable2 = this.$route.meta.editable;
    this.init();
  },
  mounted() {
    this.loadComponent();
    this.getList();
  },
  beforeDestroy() {},
  //* methods */
  methods: {
    init() {
      this.searchDetailUrl = selectConfig.constSafe.const.get.url;
      this.checkUrl = selectConfig.constSafe.const.check.url;
      this.completeUrl = transactionConfig.constSafe.const.complete.url;
      this.completeConstUrl =
        transactionConfig.constSafe.const.completeConst.url;
      this.insertUrl = transactionConfig.constSafe.const.insert.url;
      this.editUrl = transactionConfig.constSafe.const.edit.url;
      this.deleteUrl = this.$format(
        transactionConfig.constSafe.const.delete.url,
        this.popupParam.constNo
      );
      this.collectUrl = transactionConfig.manage.appr.collect.url;

      // 사용자의 사업장 셋팅
      this.constSafe.plantCd = this.$store.getters.plantCd;
      // 공사진행단계가 완료인 경우에만 작업허가서정보 탭을 보이게 한다.(완료상태만 작업허가서를 등록 가능)
      if (
        this.popupParam.constStepCd === 'CONS3' ||
        this.popupParam.constStepCd === 'CONS4'
      ) {
        this.tabItems.splice(1, 0, {
          title: 'L0000003573', // 작업허가서정보
          url: './wkodRequestList',
        });
      }

      this.gridOptionsHeader = [
        {
          text: 'L0000002414',
          name: 'workerNm',
          width: '150px',
          align: 'center',
        }, // 작업자명
        {
          text: 'L0000002773',
          name: 'workerJob',
          width: '150px',
          align: 'center',
        }, // 직책/직무
        {
          text: 'L0000001545',
          name: 'birthYmd',
          width: '150px',
          align: 'center',
        }, // 생년월일
        {
          text: 'L0000001632',
          name: 'genderNm',
          width: '90px',
          align: 'center',
        }, // 성별
        {
          text: 'L0000002797',
          name: 'carNum',
          width: '200px',
          type: 'text',
        }, // 차량번호
        {
          text: 'L0000001071',
          name: 'inEquip',
          width: '200px',
          type: 'text',
        }, // 반입장비
        {
          text: 'L0000003022',
          name: 'speCommts',
          width: '250px',
          type: 'text',
        }, // 특이사항
      ];
      this.gridOptionsPoongsanHeader = [
        {
          text: 'L0000002414',
          name: 'workerNm',
          width: '150px',
          align: 'center',
        }, // 작업자명
        {
          text: 'L0000002773',
          name: 'workerJob',
          width: '150px',
          align: 'center',
        }, // 직책/직무
        {
          text: 'L0000001287',
          name: 'deptNm',
          width: '150px',
          align: 'center',
        }, // 부서
        {
          text: 'L0000003022',
          name: 'speCommts',
          width: '250px',
          type: 'text',
        }, // 특이사항
      ];

      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002414'),
          dataField: 'workerNm',
          width: '10%',
        }, // 작업자명
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002773'),
          dataField: 'workerJob',
          width: '10%',
        }, // 직책/직무
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001545'),
          dataField: 'birthYmd',
          width: '12%',
        }, // 생년월일
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001632'),
          dataField: 'genderNm',
          width: '8%',
        }, // 성별
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002797'),
          dataField: 'carNum',
          width: '20%',
          editRenderer: {
            type: 'InputEditRenderer',
          },
        }, // 차량번호
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001071'),
          dataField: 'inEquip',
          width: '20%',
          editRenderer: {
            type: 'InputEditRenderer',
          },
        }, // 반입장비
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003022'),
          dataField: 'speCommts',
          width: '20%',
          editRenderer: {
            type: 'InputEditRenderer',
          },
        }, // 특이사항
      ];
      this.PoongsanGridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002414'),
          dataField: 'workerNm',
          width: '20%',
        }, // 작업자명
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002773'),
          dataField: 'workerJob',
          width: '20%',
        }, // 직책/직무
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001287'),
          dataField: 'deptNm',
          width: '20%',
        }, // 부서
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003022'),
          dataField: 'speCommts',
          width: '40%',
          editRenderer: {
            type: 'InputEditRenderer',
          },
        }, // 특이사항
      ];

      if ((this.popupParam.constStepCd !== 'CONS4') === false) {
        this.editable = false;
      } else {
        this.editable = true;
      }

      this.getComboAttrItems('SAF_WKOD_KIND'); // 작업구분
    },
    // 완료
    btnEditCompleClickedCallback(_result) {
      this.isSave = false;

      window.getApp.$emit('ALERT', {
        title: 'L0000003395',
        message: 'M0000000515', // 처리되었습니다.
        type: 'success', // success / info / warning / error
      });
      if (this.constSafe.constStepCd === 'CONS4') {
        this.updateMod = true;
      } else if (this.constSafe.constStepCd === 'CONS3') {
        this.updateMod = false;
      }
      this.setSafInfoAttachFileGrps();
    },
    beforeComplete(data) {
      let message = data === 'Y' ? 'M0000000212' : 'M0000000213'; // 공사를 완료하시겠습니까? : // 공사를 완료취소하시겠습니까?
      let constStepCd = data === 'Y' ? 'CONS4' : 'CONS3';

      window.getApp.$emit('CONFIRM', {
        message: message,
        type: 'info', // success / info / warning / error
        confirmCallback: () => {
          this.constSafe.constStepCd = constStepCd;
          this.actUrl = this.$format(
            this.completeConstUrl,
            this.constSafe.constNo,
            this.constSafe.constStepCd
          );
          this.isSave = true;
        },
        cancelCallback: () => {},
      });
    },
    /** 완료 하기전 UI단 유효성 검사 **/
    beforeEditComple() {
      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321', // 확인
        message: 'M0000000838', // 완료하시겠습니까?
        // TODO : 필요시 추가하세요.
        type: 'info', // success / info / warning / error
        // 확인 callback 함수
        confirmCallback: () => {
          this.constSafe.updateUserId = this.$store.getters.token;
          this.checkRequiredInput();
        },
      });
    },
    /* 완료취소버튼 */
    btnEditCancelClickedCallback() {},
    /**
     * 자식 페이지에 넘길 paneName 정보 업데이트
     * tab 클릭시 마다
     * tab : 클릭한 tab 정보
     */
    tabClick(tab) {
      var nowDate = new Date();
      this.paneName = tab.paneName + nowDate.getMilliseconds();
    },
    getApprDetail() {
      if (!this.popupParam.apprRqstNo || this.popupParam.apprRqstNo <= 0) {
        return;
      }
      this.$http.url = this.$format(
        selectConfig.manage.appr.authCheck.url,
        this.popupParam.apprRqstNo,
        this.$store.getters.token
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.authDuringAppr = _result.data;
          this.setSafInfoAttachFileGrps();
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    // 공사안전정보 첨부파일(탭)
    setSafInfoAttachFileGrps(disabled) {
      let taskKey = this.popupParam.constNo
        ? this.popupParam.constNo.toString()
        : '';
      this.safAttachFileGrps = [
        {
          label: 'L0000000506',
          // 공사안전정보/첨부파일
          uploadTempFiles: null,
          taskClassNm: 'CONST_SAFETY_INFO',
          taskKey: taskKey,
          drag: !this.updateMod && !this.authDuringAppr,
          editable: this.editable && !this.authDuringAppr,
          disabled: this.updateMod || this.authDuringAppr,
          createUserId: this.$store.getters.token,
        },
      ];
    },
    loadComponent() {
      var path = this.tabItems[this.tabIndex].url;

      if (path === 'fileUploadPage') {
        this.component = () =>
          import('@/pages/common/attachFile/multiFileUpload');
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
    getCollectable() {
      if (!this.constSafe.apprRqstNo || this.constSafe.apprRqstNo <= 0) return;

      this.$http.url = this.$format(
        selectConfig.manage.appr.getCollect.url,
        this.constSafe.apprRqstNo,
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
          this.constSafe.apprRqstNo
        );
        this.$http.type = 'PUT';

        this.$http.request(
          (_result) => {
            this.constSafe.apprRqstNo = 0;
            window.getApp.$emit('ALERT', {
              title: 'L0000003395',
              message: 'M0000000507', // 회수되었습니다.
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
          message: 'M0000000506', // 이미 결재된 문서입니다.
          type: 'warning', // success / info / warning / error
        });
        this.closeSndPopup();
      }
    },
    getList() {
      if (!this.popupParam.constNo) {
        // 신규등록으로 들어온 경우
        // 등록자 정보 셋팅
        this.constSafe.createDt = this.$comm.getToday();
        this.constSafe.createDeptNm = this.$store.getters.deptNm;
        this.constSafe.createUserNm = this.$store.getters.name;

        // 저장 버튼 활성화
        this.insertCheck = true;
        this.editCheck = false;

        this.setSafInfoAttachFileGrps();
      } else {
        // 수정 버튼 활성화
        this.insertCheck = false;
        this.editCheck = true;
        // 수정으로 들어온 경우 공사정보를 가지고 온다.
        this.$http.url = this.$format(
          this.searchDetailUrl,
          this.popupParam.constNo
        );
        this.$http.type = 'GET';
        this.$http.request(
          (_result) => {
            this.getApprDetail();
            if (
              !(
                _result.data.bizApprStepCd === 'BAPSG' ||
                _result.data.bizApprStepCd === 'BAPSD' ||
                !_result.data.bizApprStepCd
              ) &&
              !this.popupParam.apprFlag
            ) {
              this.editable = false;
              this.updateMod = true;
            }
            this.constSafe = this.$_.clone(_result.data);
            this.getCollectable();
            this.constSafe.period = [
              this.constSafe.constStartYmd,
              this.constSafe.constEndYmd,
            ];
            this.searchWkodKindVendors = this.$_.clone(
              this.constSafe.constKindSubconns
            );
            // 공사현황별 작업구분
            this.wkodKindCds = [];
            this.$_.forEach(_result.data.wkodKindCds, (wkodKindCd) => {
              setTimeout(() => {
                this.wkodKindCds.push({
                  code: wkodKindCd.wkodKindCd,
                  name: wkodKindCd.wkodKindNm,
                });
              }, 30);
            });

            if (this.constSafe.constStepCd === 'CONS4') {
              this.updateMod = true;
              this.isComplete = 'Y';
            } else if (this.constSafe.constStepCd === 'CONS3') {
              this.isComplete = 'N';
            }

            // 결재완료인 경우 수정 불가
            if (this.constSafe.bizApprStepCd === 'BAPSG') {
              this.updateMod = true;
              this.editable = false;
            }

            // 권한에 따라서 수정 가능 여부 체크
            // 전사담당자-2, 시스템관리자-1090, 안전담당자-1021
            let userAuthGrps = this.$store.getters.userAuthGrps.filter((o) => {
              return o.settingYn === 'Y';
            });

            let authFlag = false;

            this.$_.forEach(userAuthGrps, (item) => {
              if (
                item.authGrpNo === '2' ||
                item.authGrpNo === '1090' ||
                item.authGrpNo === '1021'
              ) {
                authFlag = true;
              }
            });
            if (
              !authFlag &&
              this.$store.getters.token === this.constSafe.createUserId
            ) {
              authFlag = true;
            }
            this.editable = authFlag ? this.editable : authFlag;

            this.setSafInfoAttachFileGrps();
          },
          (_error) => {
            window.getApp.$emit('APP_REQUEST_ERROR', _error);
          }
        );
      }
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
        item.taskKey = this.popupParam.constNo;
      });
      if (this.safTempDeleteFiles.length > 0) {
        this.$http.url = transactionConfig.attachFile.deleteMulti.url;
        this.$http.type = 'DELETE';
        this.$http.param = {
          data: Object.values(this.$_.clone(this.safTempDeleteFiles)),
        };
        this.$http.request(
          (_result) => {
            this.safTempDeleteFiles = [];
            // 저장할 데이터가 있는 경우
            if (this.safSaveAttachFiles.length > 0) {
              this.submitObject.submitCheck = !this.submitObject.submitCheck;
            }
            // 저장할 데이터가 없는 경우
            else this.submitCheck = true;
          },
          (_error) => {
            window.getApp.$emit('APP_REQUEST_ERROR', _error);
          }
        );
      } else {
        // 저장할 데이터가 있는 경우
        if (this.safSaveAttachFiles.length > 0) {
          this.submitObject.submitCheck = !this.submitObject.submitCheck;
        }
        // 저장할 데이터가 없는 경우
        else this.submitCheck = true;
      }
    },
    closeSndPopup(data) {
      if (data) {
        this.submitCheck = true;
      } else {
        if (!this.popupParam.apprFlag) {
          this.$emit('closePopup', {});
        }
      }
    },
    closeSndPopup2(data) {
      if (data) {
        this.submitCheck = true;
      }
    },
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
    /** button 관련 이벤트 **/
    beforeInsert() {
      let returnVal = true;
      this.$_.forEach(this.wkodKindVendors, (kind) => {
        if (!kind.vendors || kind.vendors.length === 0) {
          window.getApp.$emit('ALERT', {
            title: 'L0000003395',
            message: 'M0000000862',
            // 작업구분별 업체를 선택하세요
            type: 'warning',
          });
          returnVal = false;
          return false;
        }
      });
      if (returnVal) {
        this.$validator
          .validateAll()
          .then((_result) => {
            if (_result) {
              this.$http.url = this.checkUrl;
              this.$http.type = 'GET';
              this.$http.param = {
                constNo: '',
                constNum: this.constSafe.constNum,
              };
              this.$http.request(
                (_result) => {
                  if (_result.data && _result.data.cnt === 0) {
                    window.getApp.$emit('CONFIRM', {
                      title: 'L0000003321',
                      message: 'M0000000011',
                      type: 'info', // success / info / warning / error
                      // 확인 callback 함수
                      confirmCallback: () => {
                        this.constSafe.createUserId = this.$store.getters.token;
                        this.constSafe.constStartYmd = this.constSafe.period[0];
                        this.constSafe.constEndYmd = this.constSafe.period[1];
                        this.$_.forEach(
                          this.$_.map(this.wkodKindCds, 'code'),
                          (wkodKindCd) => {
                            this.constSafe.wkodKindCds.splice(0, 0, {
                              wkodKindCd: wkodKindCd,
                              constNo: '',
                            });
                          }
                        );

                        this.constSafe.constKindSubconns = [];
                        this.$_.forEach(this.wkodKindVendors, (kind) => {
                          this.$_.forEach(kind.vendors, (vendor) => {
                            vendor.constStartYmd = vendor.period[0];
                            vendor.constEndYmd = vendor.period[1];
                            vendor.wkodKindCd = kind.wkodKindCd;
                            this.constSafe.constKindSubconns.push(vendor);
                          });
                        });

                        this.isInsert = true;
                      },
                    });
                  } else {
                    window.getApp.$emit('ALERT', {
                      title: 'L0000003395',
                      message: 'M0000000217',
                      // 이미 존재하는 PO번호입니다.
                      type: 'warning',
                    });
                  }
                },
                (_error) => {
                  window.getApp.$emit('APP_REQUEST_ERROR', _error);
                }
              );
            } else {
              if (this.checkRequiredInput() === true) {
                window.getApp.$emit('ALERT', {
                  title: 'L0000003395',
                  message: 'M0000000005', // 필수 입력값을 입력해 주세요.
                  type: 'warning',
                });
              }
            }
          })
          .catch(() => {
            this.isInsert = false;
          });
      }
    },
    checkRequiredInput() {
      if (!this.constSafe.plantCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395' /* 안내 */,
          message: 'M0000000863', // 사업장을 선택해주세요.
          type: 'warning', // success / info / warning / error
        });
        return false;
      }
      if (!this.constSafe.constNum) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395' /* 안내 */,
          message: 'M0000001127', // PO번호를 입력해주세요.
          type: 'warning', // success / info / warning / error
        });
        return false;
      }
      if (this.constSafe.period.length === 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395' /* 안내 */,
          message: 'M0000001128', // 작업기간을 선택해주세요.
          type: 'warning', // success / info / warning / error
        });
        return false;
      }
      if (this.wkodKindCds.length === 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395' /* 안내 */,
          message: 'M0000001129', // 작업구분을 선택해주세요.
          type: 'warning', // success / info / warning / error
        });
        return false;
      }
      if (!this.constSafe.constTitle) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395' /* 안내 */,
          message: 'M0000001130', // 공사명을 입력해주세요.
          type: 'warning', // success / info / warning / error
        });
        return false;
      }
      if (!this.constSafe.constContent) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395' /* 안내 */,
          message: 'M0000000241', // 공사내용을 입력하세요.
          type: 'warning', // success / info / warning / error
        });
        return false;
      }
      this.$_.forEach(this.wkodKindVendors, (wkodKindVendor) => {
        this.$_.forEach(wkodKindVendor.vendors, (vendor) => {
          if (vendor.period === null) {
            window.getApp.$emit('ALERT', {
              title: 'L0000003395' /* 안내 */,
              message: 'M0000001131', // 업체 작업기간을 선택해주세요.
              type: 'warning', // success / info / warning / error
            });
            this.wkodKindVendorsRequiredInputCheck = false;
            return false;
          }
          if (!vendor.indAccNum && !vendor.vendorCd !== '') {
            window.getApp.$emit('ALERT', {
              title: 'L0000003395' /* 안내 */,
              message: 'M0000000222', // 산재관리번호를 입력하세요.
              type: 'warning', // success / info / warning / error
            });
            this.wkodKindVendorsRequiredInputCheck = false;
            return false;
          }
          this.wkodKindVendorsRequiredInputCheck = true;
        });
      });
      return this.wkodKindVendorsRequiredInputCheck;
    },
    beforeEdit() {
      let stepByStep = true;
      if (stepByStep) {
        this.$validator
          .validateAll()
          .then((_result) => {
            if (_result) {
              this.$http.url = this.checkUrl;
              this.$http.type = 'GET';
              this.$http.param = {
                constNo: this.constSafe.constNo,
                constNum: this.constSafe.constNum,
              };
              this.$http.request(
                (_result) => {
                  if (_result.data && _result.data.cnt === 0) {
                    window.getApp.$emit('CONFIRM', {
                      title: 'L0000003321',
                      message: 'M0000000011', // 저장하시겠습니까?
                      type: 'info',
                      confirmCallback: () => {
                        this.constSafe.updateUserId = this.$store.getters.token;
                        this.constSafe.constStartYmd = this.constSafe.period[0];
                        this.constSafe.constEndYmd = this.constSafe.period[1];
                        // 수정 시에는 작업구분을 다 날린 후 다시 넣는다.
                        this.constSafe.wkodKindCds.splice(
                          0,
                          this.constSafe.wkodKindCds.length
                        );
                        this.$_.forEach(
                          this.$_.map(this.wkodKindCds, 'code'),
                          (wkodKindCd) => {
                            this.constSafe.wkodKindCds.splice(0, 0, {
                              wkodKindCd: wkodKindCd,
                              constNo: this.constSafe.constNo,
                            });
                          }
                        );

                        this.constSafe.constKindSubconns = [];
                        this.$_.forEach(this.wkodKindVendors, (kind) => {
                          this.$_.forEach(kind.vendors, (vendor) => {
                            vendor.constStartYmd = vendor.period[0];
                            vendor.constEndYmd = vendor.period[1];
                            vendor.wkodKindCd = kind.wkodKindCd;
                            this.constSafe.constKindSubconns.push(vendor);
                          });
                        });
                        // if (this.isComplete === 'Y') {
                        //   this.constSafe.constStepCd = 'CONS4';
                        // } else {
                        //   this.constSafe.constStepCd = 'CONS3';
                        // }
                        this.isEdit = true;
                      },
                    });
                  } else {
                    if (this.checkRequiredInput() === true) {
                      window.getApp.$emit('ALERT', {
                        title: 'L0000003395',
                        message: 'M0000000005', // 필수 입력값을 입력해 주세요.
                        type: 'warning',
                      });
                    }
                  }
                },
                (_error) => {
                  window.getApp.$emit('APP_REQUEST_ERROR', _error);
                }
              );
            } else {
              window.getApp.$emit('APP_VALID_ERROR', 'M0000000005');
            }
          })
          .catch(() => {
            this.isEdit = false;
          });
      }
    },
    beforeDelete() {
      this.deleteUrl = this.$format(
        transactionConfig.constSafe.const.delete.url,
        this.popupParam.constNo
      );
      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321',
        message: 'M0000000012', // 삭제하시겠습니까?
        type: 'info',
        confirmCallback: () => {
          this.isDelete = true;
        },
      });
    },
    btnInsertClickedCallback(_result) {
      window.getApp.$emit('ALERT', {
        title: 'L0000003395',
        message: 'M0000000006', // 저장되었습니다.
        type: 'success', // success / info / warning / error
      });

      // 안전보건관리계획서 첨부파일 등록
      this.$_.forEach(this.wkodKindVendors, (kind) => {
        this.$_.forEach(kind.vendors, (vendor) => {
          vendor.attachFileGrp.taskKey =
            _result.data + kind.wkodKindCd + vendor.vendorCd;

          this.$refs[
            kind.wkodKindCd + vendor.vendorCd + 'fileupload'
          ][0].submitUpload();
        });
      });
      this.constSafe.constNo = _result.data;
      this.constSafe.constStepCd = 'CONS1';
      this.popupParam.constNo = _result.data;
      this.popupParam.constStepCd = 'CONS1';
      this.isInsert = false;
      this.insertCheck = false;
      this.editCheck = true;

      this.isInit = true;
      this.wkodKindChangeCancel = false;
      this.wkodKindVendors = [];
      this.getList();
      this.saveAttach();
    },
    btnEditClickedCallback(_result) {
      window.getApp.$emit('ALERT', {
        title: 'L0000003395',
        message: 'M0000000006', // 저장되었습니다.
        type: 'success', // success / info / warning / error
      });
      this.isEdit = false;
      // this.getList();
      this.saveAttach();
    },
    btnDeleteClickedCallback(_result) {
      window.getApp.$emit('ALERT', {
        title: 'L0000003395',
        message: 'M0000000007', // 삭제되었습니다.
        type: 'success',
      });
      this.closeSndPopup();
    },
    btnClickedErrorCallback(_result) {
      this.isInsert = false;
      this.isEdit = false;
      this.isDelete = false;
      this.isSave = false;
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    setPoongsan(wkodKindCd, vendors) {
      this.wkodKindCd = wkodKindCd;
      let index = this.$_.findIndex(this.wkodKindVendors, {
        wkodKindCd: this.wkodKindCd,
      });
      let index2 = this.$_.findIndex(this.wkodKindVendors[index].vendors, {
        vendorCd: '',
      });
      if (index2 > -1) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: 'M0000000219', // 이미 자체가 존재합니다.
          type: 'warning',
        });
        // this.wkodKindVendors[index].vendors.splice(index2, 1);
      } else {
        let taskKey = this.popupParam.constNo
          ? this.popupParam.constNo.toString() + this.wkodKindCd
          : '';
        this.wkodKindVendors[index].vendors.push({
          constKindSubconnNo: 0,
          vendorCd: '',
          vendorNm: this.$comm.getLangSpecInfoLabel('L0000002333'), // 자체
          statusTitle: this.$comm.getLangSpecInfoLabel('L0000002039'), // 완료
          subconnStepCd: 'STEP1',
          selfYn: 'Y',
          // processNo: 0,
          // workArea: '',
          // locatePntX: '',
          // locatePntY: '',
          indAccNum: '', // 산재관리번호
          subconn2rdNm: '',
          subconn3rdNm: '',
          constKindSubconnWorkers: [],
          deleteWorkers: [],
          period: null,
          constStartYmd: '',
          constEndYmd: '',
          attachFileGrp: {
            editable: this.editable,
            disabled: this.updateMod,
            showFileSearch: !this.updateMod,
            onlyDownload: this.updateMod,
            uploadTempFiles: null,
            taskClassNm: 'CONST_SAFE' + this.wkodKindCd,
            taskKey: taskKey,
            taskFlag: '',
            createUserId: this.$store.getters.token,
            wkodKindCd: wkodKindCd, // 나중에 파일 업로드의 정보를 찾기 위한 용도
            vendorCd: '', // 나중에 파일 업로드의 정보를 찾기 위한 용도
            hasUploadList: false,
          },
        });

        if (
          this.wkodKindVendors[index].collapse &&
          this.wkodKindVendors[index].collapse.length > 0
        ) {
          this.wkodKindVendors[index].collapse.push('');
        } else {
          this.wkodKindVendors[index].collapse = [''];
        }
      }
    },
    openVendor(wkodKindCd, vendors) {
      this.wkodKindCd = wkodKindCd;
      this.popupOptions.target = () =>
        import(`${'../../vendor/baseInfo/vendorMaster.vue'}`);
      this.popupOptions.title = 'L0000003246'; // 협력업체
      this.popupOptions.visible = true;
      this.popupOptions.width = '80%';
      this.popupOptions.param = {
        popupMode: true,
        multiSelect: true,
        vendors: vendors,
        vendorTypeCd: 'CVET1', // 공사업체
        plantCd: this.constSafe.plantCd,
      };
      this.popupOptions.closeCallback = this.closeVendorPopup;
    },
    closeVendorPopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;

      if (data.data !== 'C') {
        let index = this.$_.findIndex(this.wkodKindVendors, {
          wkodKindCd: this.wkodKindCd,
        });
        let deleteCheck = false;
        let tempDeleteData = this.wkodKindVendors[index].vendors;
        // 삭제 여부 체크
        this.$_.forEach(this.wkodKindVendors[index].vendors, (item) => {
          // 삭제된 경우
          let deleteFindIndex = this.$_.findIndex(data.data, {
            vendorCd: item.vendorCd,
          });
          // if (deleteFindIndex !== -1 && item.vendorCd !== '') {
          //   deleteCheck = true;
          //   // this.wkodKindVendors[index].vendors.splice(deleteFindIndex, 1);
          //   tempDeleteData = this.$_.reject(
          //     this.wkodKindVendors[index].vendors,
          //     { vendorCd: item.vendorCd }
          //   );
          // }
        });
        // 추가 여부 체크
        this.$_.forEach(data.data, (item) => {
          // 추가된 경우
          let addFindIndex = this.$_.findIndex(
            this.wkodKindVendors[index].vendors,
            { vendorCd: item.vendorCd }
          );
          if (addFindIndex === -1) {
            let taskKey = this.popupParam.constNo
              ? this.popupParam.constNo.toString() +
                this.wkodKindCd +
                item.vendorCd
              : '';
            item.constKindSubconnNo = 0;
            item.statusTitle = this.$comm.getLangSpecInfoLabel('L0000002039');
            item.subconnStepCd = 'STEP1';
            item.selfYn = 'N';
            item.constKindSubconnWorkers = [];
            item.deleteWorkers = [];
            item.period = null;
            item.constStartYmd = '';
            item.constEndYmd = '';
            item.indAccNum = ''; // 산재관리번호
            item.subconn2rdNm = ''; // 2차 도급업체명
            item.subconn3rdNm = ''; // 3차 도급업체명
            // item.processNo = 0;
            // item.workArea = '';
            // item.locatePntX = '';
            // item.locatePntY = '';
            // 나중에 taskClassNm에다가 constSafe에 키 값을 넣어야 함 (저장이 되고 난 후)
            // 신규등록일때에는 값이 없기 때문
            item.attachFileGrp = {
              editable: this.editable, // 협력업체 포탈에서 입력되기에
              disabled: this.updateMod, // 협력업체 포탈에서 입력되기에
              showFileSearch: !this.updateMod, // 협력업체 포탈에서 입력되기에
              onlyDownload: this.updateMod,
              uploadTempFiles: null,
              taskClassNm: 'CONST_SAFE' + this.wkodKindCd + item.vendorCd,
              taskKey: taskKey,
              taskFlag: '',
              createUserId: this.$store.getters.token,
              wkodKindCd: this.wkodKindCd, // 나중에 파일 업로드의 정보를 찾기 위한 용도
              vendorCd: this.vendorCd, // 나중에 파일 업로드의 정보를 찾기 위한 용도
              hasUploadList: false,
            };
            tempDeleteData.push(item);
            if (
              this.wkodKindVendors[index].collapse &&
              this.wkodKindVendors[index].collapse.length > 0
            ) {
              this.wkodKindVendors[index].collapse.push(item.vendorCd);
            } else {
              this.wkodKindVendors[index].collapse = [item.vendorCd];
            }
          } else {
            window.getApp.$emit('ALERT', {
              title: 'L0000003395',
              message:
                '이미 추가된 업체가 존재합니다.  [' + item.vendorNm + ']',
              type: 'warning', // success / info / warning / error
            });
          }
        });
        // 삭제된 데이터가 있으면 제거한 후 추가 된 데이터가 있는 지 찾고 있다면 push로 맨 뒤로 데이터를 넣은 후 해당데이터를 vendors에 삽입
        this.wkodKindVendors[index].vendors = tempDeleteData;
        console.log(this.wkodKindVendors[index].collapse);
        console.log(this.wkodKindVendors[index].vendors);
      }
    },
    deletePersonPopup(wkodKindCd, vendorCd, persons) {
      let index = this.$_.findIndex(this.wkodKindVendors, {
        wkodKindCd: wkodKindCd,
      });
      let index2 = this.$_.findIndex(this.wkodKindVendors[index].vendors, {
        vendorCd: vendorCd,
      });
      let delData = this.wkodKindVendors[index].vendors[index2].deleteWorkers;
      if (!delData || delData.length === 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: 'M0000000220',
          // 제거할 작업자를 선택하세요.
          type: 'warning',
        });
      } else {
        if (!vendorCd) {
          this.$_.forEach(delData, (del) => {
            let delIndex = this.$_.findIndex(
              this.wkodKindVendors[index].vendors[index2]
                .constKindSubconnWorkers,
              { userId: del.userId }
            );
            if (delIndex > -1) {
              this.wkodKindVendors[index].vendors[
                index2
              ].constKindSubconnWorkers.splice(delIndex, 1);
            }
          });
        } else {
          this.$_.forEach(delData, (del) => {
            let delIndex = this.$_.findIndex(
              this.wkodKindVendors[index].vendors[index2]
                .constKindSubconnWorkers,
              { userId: del.userId }
            );
            if (delIndex > -1) {
              this.wkodKindVendors[index].vendors[
                index2
              ].constKindSubconnWorkers.splice(delIndex, 1);
            }
          });
        }
      }
    },
    addPersonPopup(wkodKindCd, vendorCd, persons) {
      this.wkodKindCd = wkodKindCd;
      this.vendorCd = vendorCd;
      this.persons = persons;

      // 협력업체 작업자
      if (this.vendorCd !== '') {
        this.popupOptions.param = {
          popupMode: true,
          vendorPerson: [],
          vendorCd: vendorCd,
          multiple: true,
        };
        this.popupOptions.target = () =>
          import(`${'../../vendor/baseInfo/vendorMasterPerson.vue'}`);
        this.popupOptions.title = 'L0000003575'; // 작업자 검색
        this.popupOptions.visible = true;
        this.popupOptions.width = '80%';
        this.popupOptions.closeCallback = this.closePersonPopup;
      }
      // 풍산 사용자정보
      else {
        this.popupOptions.target = () =>
          import(`${'../../manage/user/userSearch.vue'}`);
        this.popupOptions.param = {
          multiple: true,
          deptCd: this.$store.getters.deptCd,
          user: [],
        };
        this.popupOptions.title = 'L0000001466'; // 사용자검색
        this.popupOptions.visible = true;
        this.popupOptions.width = '60%';
        this.popupOptions.top = '100px';
        this.popupOptions.closeCallback = this.closePersonPopup;
      }
    },
    closePersonPopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;

      if ((!data.data && !data.users) || data.data === 'C') {
        return;
      }
      let index = this.$_.findIndex(this.wkodKindVendors, {
        wkodKindCd: this.wkodKindCd,
      });
      let index2 = this.$_.findIndex(this.wkodKindVendors[index].vendors, {
        vendorCd: this.vendorCd,
      });

      if (data.users) {
        // 추가
        this.$_.forEach(data.users, (item) => {
          if (
            this.$_.findIndex(
              this.wkodKindVendors[index].vendors[index2]
                .constKindSubconnWorkers,
              { userId: item.userId }
            ) === -1
          ) {
            let workerJob =
              (item.positionNm ? item.positionNm + ' / ' : '') +
              (item.dutyNm ? item.dutyNm : '');
            this.wkodKindVendors[index].vendors[
              index2
            ].constKindSubconnWorkers.splice(0, 0, {
              selfYn: 'Y', // 자체작업
              deptNm: item.deptNm,
              deptCd: item.deptCd,
              positionNm: item.positionNm,
              userId: item.userId, // 공사작업자번호
              workerNm: item.userNm, // 성명
              // genderCd: item.comSexTypeCd, // 성별
              // genderNm: item.comSexTypeNm, // 성별
              workerJob: workerJob, // 직책/직무
              // birthYmd: item.birthYmd, // 생년월일

              // 풍산의 사용자의 경우 성별과 생년월일은 집어넣지 않는걸로 결정 2019.09.16
            });
          }
        });
      } else if (data.data) {
        this.$_.forEach(data.data, (item) => {
          if (
            this.$_.findIndex(
              this.wkodKindVendors[index].vendors[index2]
                .constKindSubconnWorkers,
              { userId: item.vendorWorkerNo }
            ) === -1
            // &&
            // this.$_.findIndex(
            //   this.wkodKindVendors[index].vendors[index2]
            //     .constKindSubconnWorkers,
            //   { workerNm: item.workerNm }
            // ) === -1
          ) {
            this.wkodKindVendors[index].vendors[
              index2
            ].constKindSubconnWorkers.splice(0, 0, {
              selfYn: 'N', // 업체작업
              deptNm: item.vendorNm,
              // 2019.09.16 공사작업자번호의 경우에는 사용자의 키값이 들어가지 않고 seq로 따로 따지는 값임, 작업허가서에서 출입자정보가 갱신 되는 경우에 사용자를 찾기 위한 키값은 저장되지 않음, 성명, 성별, 생년월일로 체크(중복데이터가 일어나도 상관없다 하심)
              userId: item.vendorWorkerNo,
              workerNm: item.workerNm, // 성명
              genderCd: item.genderCd, // 성별
              genderNm: item.genderNm, // 성별
              workerJob: item.workerJob, // 직책/직무
              birthYmd: item.birthYmd, // 생년월일
              speCommts: item.speCommts, // 특이사항 ** 협력업체 출입자만 특이사항을 관리하고 있음
            });
          }
        });
      }
    },
    safetyPlanUploadFiles(data, taskClassNm, attachFileGrp) {
      let inputData = {
        data: data,
      };
      var index = this.$_.findIndex(this.wkodKindVendors, {
        wkodKindCd: attachFileGrp.wkodKindCd,
      });
      let index2 = this.$_.findIndex(this.wkodKindVendors[index].vendors, {
        vendorCd: attachFileGrp.vendorCd,
      });
      this.$_.forEach(this.wkodKindVendors[index].vendors, (vendor) => {
        if (
          vendor.attachFileGrp &&
          vendor.attachFileGrp.taskKey === attachFileGrp.taskKey
        ) {
          vendor.attachFileGrp.hasUploadList = true;
        }
      });
      if (this.wkodKindVendors[index].vendors[index2]) {
        inputData.index = index;
        inputData.taskClassNm = taskClassNm;
        inputData.taskKey = attachFileGrp.taskKey;
        this.wkodKindVendors[index].vendors[
          index2
        ].attachFileGrp.uploadTempFiles = inputData;
      }
      // this.saveAttachFiles[index].data = data;
      // this.$emit('refWorkAttach');
    },
    setDeleteTempFileData(data) {
      var pushData = {
        fileNo: data.fileNo,
      };
      this.tempDeleteFiles.push(pushData);
      // this.$emit('refWorkAttach');
    },
    /**
     *  팝업 안 보이도록 closePopup emit
     *  팝업 close
     * data : 팝업창에서 return하는 데이터
     */
    closeAttachPopup(data) {},
    setStatus(wkodKindCd, vendorCd) {
      let index = this.$_.findIndex(this.wkodKindVendors, {
        wkodKindCd: wkodKindCd,
      });
      let index2 = this.$_.findIndex(this.wkodKindVendors[index].vendors, {
        vendorCd: vendorCd,
      });
      var subconnStepCd =
        this.wkodKindVendors[index].vendors[index2].subconnStepCd;
      if (subconnStepCd === 'STEP1') {
        // 안전계획서 등록여부 체크
        // 출입자 등록여부 체크
        if (
          this.wkodKindVendors[index].vendors[index2].constKindSubconnWorkers
            .length === 0
        ) {
          window.getApp.$emit('ALERT', {
            title: 'L0000003395',
            message: 'M0000000221',
            // 출입자를 등록하세요.
            type: 'warning',
          });
          return;
        } else if (
          !this.wkodKindVendors[index].vendors[index2].period ||
          this.wkodKindVendors[index].vendors[index2].period.length !== 2
        ) {
          window.getApp.$emit('ALERT', {
            title: 'L0000003395',
            message: 'M0000000239',
            // 작업기간을 입력하세요.
            type: 'warning',
          });
          return;
        } else if (
          !this.wkodKindVendors[index].vendors[index2].indAccNum &&
          this.wkodKindVendors[index].vendors[index2].vendorCd !== ''
        ) {
          window.getApp.$emit('ALERT', {
            title: 'L0000003395',
            message: 'M0000000222',
            // 산재관리번호를 입력하세요.
            type: 'warning',
          });
          return;
        } else {
          this.$http.url = selectConfig.attachFile.list.url;
          this.$http.type = 'GET';
          this.$http.param =
            this.wkodKindVendors[index].vendors[index2].attachFileGrp;
          this.$http.request(
            (_result) => {
              let files =
                this.$refs[
                  wkodKindCd + vendorCd + 'fileupload'
                ][0].getUploadFile();
              if (_result.data.length === 0 && (!files || files.length === 0)) {
                window.getApp.$emit('ALERT', {
                  title: 'L0000003395',
                  message: 'M0000000861',
                  // 안전관리계획서를 등록하세요
                  type: 'warning',
                });
                return;
              } else {
                // 저장되지 않은 파일을 저장 한다. (안전관리계획서)
                if (files && files.length > 0) {
                  this.$refs[
                    wkodKindCd + vendorCd + 'fileupload'
                  ][0].submitUpload();
                }
                /**
                 * 저장 데이터 (입력만 되고 실제로 저장이 되지 않을 수 있기 때문에)
                 *  1. 출입자
                 *  2. 작업기간
                 *  3. 산재관리번호
                 *  4. 완료 처리
                 */
                this.$http.url = transactionConfig.constSafe.const.editStep.url;
                this.$http.type = 'PUT';
                this.$http.param = {
                  constNo: this.constSafe.constNo,
                  constKindSubconnNo:
                    this.wkodKindVendors[index].vendors[index2]
                      .constKindSubconnNo, // key
                  constStartYmd:
                    this.wkodKindVendors[index].vendors[index2].period[0], // 작업시작일
                  constEndYmd:
                    this.wkodKindVendors[index].vendors[index2].period[1], // 작업종료일
                  indAccNum:
                    this.wkodKindVendors[index].vendors[index2].indAccNum, // 산재번호
                  safPlanYn: 'Y',
                  workPasserYn: 'Y',
                  constKindSubconnWorkers:
                    this.wkodKindVendors[index].vendors[index2]
                      .constKindSubconnWorkers, // 작업자
                  subconnStepCd: 'STEP2', // 완료 상태값
                };
                this.$http.request(
                  (_result) => {
                    this.wkodKindVendors[index].vendors[index2].subconnStepCd =
                      'STEP2';
                    this.wkodKindVendors[index].vendors[index2].statusTitle =
                      this.$comm.getLangSpecInfoLabel('L0000002045');
                  },
                  (_error) => {
                    window.getApp.$emit('APP_REQUEST_ERROR', _error);
                  }
                );
              }
            },
            (_error) => {
              window.getApp.$emit('APP_REQUEST_ERROR', _error);
            }
          );
        }
      } else {
        this.$http.url = transactionConfig.constSafe.const.editStep.url;
        this.$http.type = 'PUT';
        this.$http.param = {
          constKindSubconnNo:
            this.wkodKindVendors[index].vendors[index2].constKindSubconnNo,
          subconnStepCd: 'STEP1',
        };
        this.$http.request(
          (_result) => {
            this.wkodKindVendors[index].vendors[index2].subconnStepCd = 'STEP1';
            this.wkodKindVendors[index].vendors[index2].statusTitle =
              this.$comm.getLangSpecInfoLabel('L0000002039'); // 완료
          },
          (_error) => {
            window.getApp.$emit('APP_REQUEST_ERROR', _error);
          }
        );
      }
    },
    deleteVendor(wkodKindCd, vendorCd) {
      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321',
        message: 'M0000000224', // 제거하시겠습니까?
        type: 'info',
        // 확인 callback 함수
        confirmCallback: () => {
          let index = this.$_.findIndex(this.wkodKindVendors, {
            wkodKindCd: wkodKindCd,
          });
          let index2 = this.$_.findIndex(this.wkodKindVendors[index].vendors, {
            vendorCd: vendorCd,
          });
          this.wkodKindVendors[index].vendors.splice(index2, 1);
          let index3 = this.$_.findIndex(
            this.wkodKindVendors[index].vendors.collapse,
            {
              vendorCd: vendorCd,
            }
          );
          this.wkodKindVendors[index].vendors.collapse.splice(index3, 1);
        },
        cancelCallback: () => {},
      });
    },
    btnAppr() {
      let returnVal = true;
      this.$_.forEach(this.wkodKindVendors, (kind) => {
        if (!kind.vendors || kind.vendors.length === 0) {
          window.getApp.$emit('ALERT', {
            title: 'L0000003395',
            message: 'M0000000862',
            // 작업구분별 업체를 선택하세요
            type: 'warning',
          });
          returnVal = false;
          return false;
        } else {
          this.$_.forEach(kind.vendors, (vendor) => {
            if (!vendor.subconnStepCd || vendor.subconnStepCd !== 'STEP2') {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395',
                message: 'M0000000225',
                // 작업구분별 업체중 완료되지 않은 업체가 있습니다.
                type: 'warning',
              });
              returnVal = false;
              return false;
            }
          });
        }
      });
      if (returnVal) {
        this.popupOptions.target = () =>
          import(`${'@/pages/manage/appr/comApprRequest.vue'}`);
        this.popupOptions.title = 'L0000003418'; // 결재요청
        this.popupOptions.visible = true;
        this.popupOptions.closeCallback = this.closeApprPop;
        this.popupOptions.width = '80%';
        this.popupOptions.param = {
          apprBizCd: 'CS-WO-03',
          apprParams: {
            constNo: this.constSafe.constNo,
          },
        };
      }
    },
    closeApprPop(data) {
      if (data.resultFlag) {
        this.constSafe.apprRqstNo = data.apprRqstNo;
        this.collectCheck = true;
        this.editable = false;
        this.editCheck = false;
      }
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      // this.wkodKindVendors = [];

      this.insertCheck = false;
      this.updateMod = true;

      this.setSafInfoAttachFileGrps();
      // this.getList();
    },
  },
};
</script>

<style>
.cardStyle .el-card__header {
  background-color: gainsboro;
}
.cardStyle .el-collapse {
  border-left: 1px solid #ebeef5;
  border-right: 1px solid #ebeef5;
}
.cardStyle .el-collapse-item__content {
  padding: 15px;
}
.kindVendorNmStyle label {
  font-size: 15px;
}
</style>
