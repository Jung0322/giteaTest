<!--
  목적 : 교육 결과 등록/수정
  작성자 : kkc
  Detail : 교육 결과 등록/수정
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <b-row>
      <!-- 교육 결과 상세 -->
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- 교육 결과 상세 -->
            <y-label
              label="L0000000607"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- <y-label v-if="!isAppr" label="결재요청은 교육 기간이 지난 이후에 가능합니다" style="font-size:13px; " /> -->
              <!-- 과정다운로드 -->
              <!-- <y-btn
                v-if="!this.popupParam.apprFlag && !compleMode && !updateMode "
                title="L0000000561"
                color="gray"
                @btnClicked="excelDownEduResult('EDU1')"
              /> -->
              <!-- 차수다운로드 -->
              <!-- <y-btn
                v-if="!this.popupParam.apprFlag && !compleMode && !updateMode "
                title="L0000002799"
                color="gray"
                @btnClicked="excelDownEduResult('EDU2')"
              /> -->
              <!-- 대상자다운로드 -->
              <!-- <y-btn
                v-if="!this.popupParam.apprFlag && !compleMode && !updateMode "
                title="L0000000937"
                color="gray"
                @btnClicked="excelDownEduResult('EDU3')"
              /> -->
              <!-- 결과다운로드 -->
              <!-- <y-btn
                v-if="!this.popupParam.apprFlag && !compleMode && !updateMode "
                title="L0000000410"
                color="gray"
                @btnClicked="excelDownEduResult('EDU4')"
              /> -->
              <!-- 이력다운로드 -->
              <!-- <y-btn
                v-if="!this.popupParam.apprFlag && !compleMode && !updateMode "
                title="L0000002207"
                color="gray"
                @btnClicked="excelDownEduResult('EDU5')"
              /> -->
              <!-- 결재요청 -->
              <y-btn
                v-if="
                  editable &&
                  !this.popupParam.apprFlag &&
                  (this.eduMaster.rbizApprStepCd === null ||
                    this.eduMaster.rbizApprStepCd === 'BAPSD') &&
                  !popupParam.search
                "
                title="L0000003418"
                color="black"
                @btnClicked="btnAppr"
              />
              <!-- 결재요청회수 -->
              <!-- <y-btn
                v-if="
                  collectCheck && !popupParam.apprFlag && !popupParam.search
                "
                title="L0000003420"
                color="black"
                @btnClicked="btnCollectClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              /> -->
              <!-- 불참자재교육 -->
              <y-btn
                v-if="
                  isReEdu && this.eduMaster.reEduPersonYn && !popupParam.search
                "
                title="L0000001357"
                color="blue"
                @btnClicked="btnAbsenteeReEdu"
              />
              <!-- 저장 -->
              <y-btn
                v-if="
                  (editable && !authDuringAppr && !popupParam.search) ||
                  this.popupParam.apprFlag
                "
                :action-url="editUrl"
                :param="eduMaster"
                :is-submit="isEdit"
                title="L0000002474"
                color="orange"
                action-type="PUT"
                beforeSubmit="beforeEdit"
                @beforeEdit="beforeEdit"
                @btnClicked="btnEditClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!-- <y-btn
                v-if="editable && updateMode && compleMode"
                title="삭제"
                color="red"
                @btnClicked="btnDeleteClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />-->
              <!-- 닫기 -->
              <y-btn
                v-if="!this.popupParam.apprFlag"
                title="L0000000881"
                @btnClicked="closePopup"
              />
            </div>
          </b-col>
        </b-row>
        <b-card>
          <b-row>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 대상년도 -->
              <y-datepicker
                :width="8"
                label="L0000004449"
                type="year"
                name="year"
                :default="eduMaster.year"
                v-model="eduMaster.year"
                :disabled="true"
                v-validate="'required'"
                :state="validateState('year')"
              ></y-datepicker>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 사업장 -->
              <y-plant
                type="edit"
                :required="true"
                :editable="editable"
                :disabled="true"
                name="plantCd"
                v-model="eduMaster.plantCd"
                v-validate="'required'"
                :state="validateState('plantCd')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 교육구분 -->
              <y-select
                :width="8"
                :editable="editable"
                :comboItems="eduTypeCdItems"
                :required="true"
                :disabled="true"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                label="L0000000639"
                name="eduTypeCd"
                v-model="eduMaster.eduTypeCd"
                v-validate="'required'"
                :state="validateState('eduTypeCd')"
              />
            </b-col>

            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 교육대분류 -->
              <y-select
                :width="8"
                :editable="editable"
                :comboItems="eduAttCdItems"
                :disabled="true"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                label="L0000000644"
                name="eduAttCd"
                v-model="eduMaster.eduAttCd"
                :required="true"
                v-validate="'required'"
                :state="validateState('eduAttCd')"
              ></y-select>
            </b-col>

            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 교육분류 -->
              <y-select
                :width="8"
                :editable="editable"
                :comboItems="eduClassCdItems"
                :disabled="true"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                label="L0000000659"
                name="eduAttCd"
                v-model="eduMaster.eduClassCd"
                :required="true"
                v-validate="'required'"
                :state="validateState('eduClassCd')"
              ></y-select>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 교육명 -->
              <y-select
                :width="8"
                :editable="editable"
                :comboItems="eduCourseItems"
                itemText="eduCourseNm"
                itemValue="safEduCourseNo"
                :disabled="true"
                ui="bootstrap"
                label="L0000000653"
                name="safEduCourseNo"
                v-model="eduMaster.safEduCourseNo"
                :required="true"
                v-validate="'required'"
                :state="validateState('safEduCourseNo')"
              ></y-select>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 교육담당자 -->
              <y-text
                :width="8"
                :readonly="true"
                :required="true"
                :disabled="true"
                ui="bootstrap"
                label="L0000000643"
                name="addUser"
                v-model="addUser"
                v-validate="'required'"
                :state="validateState('eduUser')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 관련법규    v-validate="'required'"
                :state="validateState('isTypeCd')" -->
              <y-text
                :width="8"
                :editable="editable"
                :disabled="true"
                :required="false"
                itemText="codeNm"
                itemValue="codeNm"
                ui="bootstrap"
                name="isTypeCd"
                label="L0000000568"
                v-model="eduMaster.isTypeNm"
              />
            </b-col>
            <!--
              <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-select
                :width="8"
                :comboItems="questionUseYnItems"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                :disabled="true"
                label="교육풀이문제"
                name="questionUseYn"
                v-model="eduMaster.questionUseYn"
              ></y-select>
            </b-col>
            -->
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 주관부서 -->
              <y-tree-dept
                :width="8"
                label="L0000002713"
                :editable="editable"
                :disabled="true"
                :required="true"
                :plantCd="eduMaster.plantCd"
                v-model="eduMaster.mainDeptCd"
                v-validate="'required'"
                :state="validateState('deptCd')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 대상부서 -->
              <y-tree-dept
                :width="8"
                label="L0000000927"
                :editable="editable"
                :disabled="true"
                :required="true"
                :plantCd="eduMaster.plantCd"
                v-model="eduMaster.targetDeptCd"
                v-validate="'required'"
                :state="validateState('deptCd')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 수행부서 -->
              <y-tree-dept
                :width="8"
                label="L0000005120"
                :editable="editable"
                :disabled="true"
                :required="true"
                :plantCd="eduMaster.plantCd"
                v-model="eduMaster.execDeptCd"
                v-validate="'required'"
                :state="validateState('deptCd')"
              />
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
              <!-- 교육과정명 -->
              <y-text
                :width="10"
                :editable="editable"
                :required="true"
                :disabled="true"
                :maxlength="60"
                ui="bootstrap"
                label="L0000000637"
                name="eduNm"
                v-model="eduMaster.eduNm"
                v-validate="'required'"
                :state="validateState('eduNm')"
              ></y-text>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
              <b-row>
                <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
                  <!-- 교육시작일시 -->
                  <y-datepicker
                    :width="8"
                    :editable="editable"
                    :disabled="true"
                    :required="true"
                    :end="eduMaster.eduEYmd"
                    label="L0000000662"
                    name="eduSYmd"
                    v-validate="'required'"
                    v-model="eduMaster.eduSYmd"
                    :state="validateState('eduSYmd')"
                  ></y-datepicker>
                </b-col>
                <b-col sm="3" md="3" lg="3" xl="3" class="col-xxl-3 px-1">
                  <y-select
                    :width="12"
                    :comboItems="comboHourItems"
                    :editable="editable"
                    :disabled="true"
                    itemText="hourNm"
                    itemValue="hour"
                    ui="bootstrap"
                    name="startHour"
                    v-model="eduMaster.startHour"
                    v-validate="'required'"
                    :state="validateState('startHour')"
                  ></y-select>
                </b-col>
                <b-col sm="3" md="3" lg="3" xl="3" class="col-xxl-3 px-1">
                  <y-select
                    :width="12"
                    :comboItems="comboMinuteItems"
                    :editable="editable"
                    :disabled="true"
                    itemText="minuteNm"
                    itemValue="minute"
                    ui="bootstrap"
                    name="startMinute"
                    v-model="eduMaster.startMinute"
                    v-validate="'required'"
                    :state="validateState('startMinute')"
                  ></y-select>
                </b-col>
              </b-row>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
              <b-row>
                <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
                  <!-- 교육종료일시 -->
                  <y-datepicker
                    :width="8"
                    :editable="editable"
                    :required="true"
                    :disabled="true"
                    :start="eduMaster.eduSYmd"
                    label="L0000000674"
                    name="eduEYmd"
                    v-validate="'required'"
                    v-model="eduMaster.eduEYmd"
                    :state="validateState('eduEYmd')"
                  ></y-datepicker>
                </b-col>
                <b-col sm="3" md="3" lg="3" xl="3" class="col-xxl-3 px-1">
                  <y-select
                    :width="12"
                    :comboItems="comboHourItems"
                    :editable="editable"
                    :disabled="true"
                    itemText="hourNm"
                    itemValue="hour"
                    ui="bootstrap"
                    name="endHour"
                    v-model="eduMaster.endHour"
                    v-validate="'required'"
                    :state="validateState('endHour')"
                  ></y-select>
                </b-col>
                <b-col sm="3" md="3" lg="3" xl="3" class="col-xxl-3 px-1">
                  <y-select
                    :width="12"
                    :comboItems="comboMinuteItems"
                    :editable="editable"
                    :disabled="true"
                    itemText="minuteNm"
                    itemValue="minute"
                    ui="bootstrap"
                    name="endMinute"
                    v-model="eduMaster.endMinute"
                    v-validate="'required'"
                    :state="validateState('endMinute')"
                  ></y-select>
                </b-col>
              </b-row>
            </b-col>

            <!-- <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-datepicker
                :width="8"
                :editable="editable"
                :required="true"
                :disabled="true"
                label="교육시작일"
                name="eduSYmd"
                v-validate="'required'"
                v-model="eduMaster.eduSYmd"
                :state="validateState('eduSYmd')"
              ></y-datepicker>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-datepicker
                :width="8"
                :editable="editable"
                :required="true"
                label="교육종료일"
                name="eduEYmd"
                v-validate="'required'"
                v-model="eduMaster.eduEYmd"
                :state="validateState('eduEYmd')"
              ></y-datepicker>
            </b-col>-->
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 교육시간 -->
              <y-number
                :width="8"
                :editable="editable || this.popupParam.apprFlag"
                :maxlength="5"
                :disabled="authDuringAppr || popupParam.search"
                :required="true"
                :hasSeperator="false"
                :pointNumber="2"
                ui="bootstrap"
                label="L0000000660"
                name="eduTime"
                v-model="eduMaster.eduTime"
                v-validate="'required'"
                :state="validateState('eduTime')"
              />
            </b-col>
            <!-- <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <b-row>
                <b-col sm="8">
                  <y-text
                    :width="6"
                    :editable="editable"
                    :maxlength="10"
                    ui="bootstrap"
                    label="교육 시작시/종료시"
                    name="eduSHour"
                    v-model="eduMaster.eduSHour"
                    :required="true"
                    v-validate="'required'"
                    :state="validateState('eduSHour')"
                  ></y-text>
                </b-col>
                <b-col sm="4">
                  <y-text
                    :width="12"
                    :editable="editable"
                    :maxlength="10"
                    ui="bootstrap"
                    name="eduEHour"
                    v-model="eduMaster.eduEHour"
                    v-validate="'required'"
                    :state="validateState('eduEHour')"
                  ></y-text>
                </b-col>
              </b-row>
            </b-col>-->
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 교육장소 -->
              <y-text
                :width="8"
                :editable="editable"
                :disabled="true"
                :maxlength="60"
                :required="true"
                ui="bootstrap"
                label="L0000000672"
                name="eduPlace"
                v-validate="'required'"
                v-model="eduMaster.eduPlace"
                :state="validateState('eduPlace')"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 교육강사 -->
              <y-text
                :width="8"
                :editable="editable"
                :disabled="true"
                :maxlength="30"
                :required="true"
                ui="bootstrap"
                label="L0000003649"
                name="eduTeacher"
                v-validate="'required'"
                v-model="eduMaster.eduTeacher"
                :state="validateState('eduTeacher')"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 교육총비용 -->
              <y-number
                :width="8"
                :editable="editable || this.popupParam.apprFlag"
                :disabled="authDuringAppr || popupParam.search"
                :maxlength="9"
                :required="true"
                :hasSeperator="true"
                ui="bootstrap"
                label="L0000000676"
                name="eduCost"
                v-validate="'required'"
                v-model="eduMaster.eduCost"
                :state="validateState('eduCost')"
              ></y-number>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 변경발의번호 -->
              <y-text
                :width="8"
                :editable="editable && !popupParam.search"
                :disabled="true"
                ui="bootstrap"
                label="L0000004754"
                name="chngNum"
                v-model="eduMaster.chngNum"
              ></y-text>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
              <!-- 교육내용 -->
              <y-textarea
                :width="10"
                :editable="editable"
                :disabled="true"
                :maxlength="600"
                :required="true"
                ui="bootstrap"
                label="L0000000642"
                name="eduContent"
                v-validate="'required'"
                v-model="eduMaster.eduContent"
                :state="validateState('eduContent')"
              ></y-textarea>
            </b-col>
          </b-row>
        </b-card>
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
              :search="popupParam.search"
              :authDuringAppr="authDuringAppr"
              :parentEditable="editable || this.popupParam.apprFlag"
              :eduMaster.sync="eduMaster"
              :refresh="refresh"
              sm="12"
              :submitObject="submitObject"
              :attachFileGrps="safAttachFileGrps"
              :saveAttachFiles="safSaveAttachFiles"
              @changeUploadFiles="changeUploadFiles"
              @setTempDeleteFiles="setTempDeleteFiles"
            />
          </keep-alive>
        </el-tabs>
      </b-col>
    </b-row>
    <y-dialog :param="popupOptions"></y-dialog>
    <!-- excelDownload -->
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
export default {
  /** attributes: name, components, props, data **/
  name: 'edu-result',
  props: {
    popupParam: {
      type: Object,
      default: {
        apprRqstNo: 0,
        safEduMstNo: 0,
        processStepCd: '',
        search: false,
      },
    },
  },
  data() {
    return {
      tabItems: [
        { title: 'L0000000668', url: './eduResultPerson' } /* 교육이수자 */,
        {
          title: 'L0000000669',
          url: './eduResultPersonOutside',
        } /* 교육이수자(외부) */,
        { title: 'L0000000407', url: './eduResultOverall' } /* 결과/총평 */,
        { title: 'L0000000654', url: './eduPlanExam' } /* 교육문제 */,
        {
          title: 'L0000000775',
          url: './eduPlanMaterialResult',
        } /* 기본 교육자료 */,
        { title: 'L0000002843', url: 'multiFileUpload' } /* 첨부파일 */,
      ],
      component: null,
      tabIndex: 0,
      eduMaster: {
        safEduMstNo: 0,
        eduAttCd: null,
        safEduCourseNo: null,
        eduTypeCd: null,
        deptCd: null,
        eduNm: '',
        eduTime: null,
        eduSYmd: '',
        eduEYmd: '',
        eduPlace: '',
        eduCost: '',
        eduTeacher: '',
        eduContent: '',
        processStepCd: '',
        startHour: null, // 교육시작시
        startMinute: null, // 교육시작시
        eduSHour: null, // 교육시작시
        endHour: null, // 교육시작시
        endMinute: null, // 교육시작시
        eduEHour: null, // 교육종료시
        eduResultSummary: '',
        eduEvalOpin: '',
        personList: [],
        createUserId: '',
        updateUserId: '',
        rapprRqstNo: 0,
        eduOutSideUsers: [],
        userId: '',
        reEduPersonYn: false,
        chngNum: '', // 변경발의번호
        safChngNo: 0,
        year: null,
        mainDeptCd: null,
        targetDeptCd: null,
        execDeptCd: null,
        isTypeCd: null,
      },
      attachFileGrp: {
        taskClassNm: '',
        taskKey: '',
        createUserId: '',
        showUploadBtn: true,
        editable: true,
        drag: true,
        label: '',
      },

      attach: null, // 첨부파일컴포넌트
      submitObject: {
        submitCheck: false,
      },
      safSaveAttachFiles: [],
      safTempDeleteFiles: [],
      safAttachFileGrps: [],
      eduClassCdItems: [],

      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '80%',
        top: '10px',
        param: {},
        closeCallback: null,
      },
      addUser: '',
      editable: false,
      updateMode: false,
      compleMode: false,
      eduAttCdItems: [],
      eduCourseItems: [],
      eduTypeCdItems: [],
      isTypeItems: [],
      comboHourItems: [], // 시
      comboMinuteItems: [], // 분
      questionUseYnItems: [],
      editUrl: '',
      deleteUrl: '',
      getUrl: '',
      isEdit: false,
      isAppr: false,
      isComple: false,
      isApprBtn: false,
      isReEdu: false,
      authDuringAppr: false,
      collectCheck: false,
      collectUrl: '',
      refresh: false,
      disabled: false,
    };
  },
  watch: {
    tabIndex() {
      this.loadComponent();
    },
    'eduMaster.eduAttCd': function (newValue, oldValue) {
      this.getEduCourseItems();
    },
  },
  /** Vue lifecycle: created, mounted, destroyed, etc **/

  beforeMount() {
    Object.assign(this.$data, this.$options.data());
  },
  mounted() {
    this.init();
    this.loadComponent();
  },
  /** methods **/
  methods: {
    /** 초기화 관련 함수 **/
    init() {
      this.editable = this.$route.meta.editable;
      // URL 셋팅
      this.editUrl = transactionConfig.saf.education.eduResult.edit.url;
      this.deleteUrl = transactionConfig.saf.education.eduMaster.delete.url;
      this.getUrl = selectConfig.saf.education.eduMaster.get.url;
      this.collectUrl = transactionConfig.manage.appr.collect.url;
      this.questionUseYnItems = [
        {
          code: 'Y',
          codeNm: this.$comm.getLangSpecInfoLabel('L0000001440'),
        } /* 사용 */,
        {
          code: 'N',
          codeNm: this.$comm.getLangSpecInfoLabel('L0000001063'),
        } /* 미사용 */,
      ];
      this.attachFileGrp.taskClassNm = 'EDUCATION';
      this.attachFileGrp.taskKey = this.popupParam.safEduMstNo.toString();
      this.attachFileGrp.createUserId = this.$store.getters.token;
      this.attachFileGrp.showUploadBtn = true;
      this.attachFileGrp.drag = true;
      this.attachFileGrp.label = 'L0000003030'; /* 파일업로드 */

      var i = 0;
      for (; i < 24; i++) {
        this.comboHourItems.push({
          hourNm: i + this.$comm.getLangSpecInfoLabel('L0000003897') /* 시 */,
          hour: i,
        });
      }

      i = 0;
      for (; i < 60; i++) {
        this.comboMinuteItems.push({
          minuteNm: i + this.$comm.getLangSpecInfoLabel('L0000003898') /* 분 */,
          minute: i,
        });
      }

      this.getEduAttCdItems();
      this.getEduCourseItems();
      this.getEduTypeCdItems();
      this.getEduClassCdItems();

      this.eduMaster.safEduMstNo = this.popupParam.safEduMstNo;
      this.eduMaster.processStepCd = this.popupParam.processStepCd;

      this.getDetail();
      if (this.eduMaster.processStepCd === 'SES02') {
        this.updateMode = true;
        this.compleMode = true;
      } else if (this.eduMaster.processStepCd === 'SES03') {
        this.updateMode = false;
        this.compleMode = false;
      }

      setTimeout(() => {
        this.setAttachFileGrp();
      }, 600);
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
          this.setAttachFileGrp();
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },

    getCollectable() {
      if (!this.eduMaster.rapprRqstNo || this.eduMaster.rapprRqstNo <= 0) {
        return;
      }
      this.$http.url = this.$format(
        selectConfig.manage.appr.getCollect.url,
        this.eduMaster.rapprRqstNo,
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
          this.eduMaster.rapprRqstNo
        );
        this.$http.type = 'PUT';

        this.$http.request(
          (_result) => {
            window.getApp.$emit('ALERT', {
              title: 'L0000003395' /* 안내 */,
              message: 'M0000000507' /* 회수되었습니다. */,
              type: 'success', // success / info / warning / error
            });
            this.closePopup();
          },
          (_error) => {
            this.$emit('APP_REQUEST_ERROR', _error);
          }
        );
      } else {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395' /* 안내 */,
          message: 'M0000000506' /* 이미 결재된 문서입니다. */,
          type: 'warning', // success / info / warning / error
        });
        this.closePopup();
      }
    },
    getDetail() {
      this.$http.url = this.$format(this.getUrl, this.eduMaster.safEduMstNo);
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.eduMaster = this.$_.clone(_result.data);
          this.getApprDetail();
          this.getCollectable();
          if (this.eduMaster.eduSHour) {
            let splitData = this.eduMaster.eduSHour.split(':');
            if (splitData && splitData.length === 2) {
              this.eduMaster.startHour = splitData[0];
              this.eduMaster.startMinute = splitData[1];
            } else {
              this.eduMaster.startHour = null;
              this.eduMaster.startMinute = null;
            }
          }
          if (this.eduMaster.eduEHour) {
            let splitData = this.eduMaster.eduEHour.split(':');
            if (splitData && splitData.length === 2) {
              this.eduMaster.endHour = splitData[0];
              this.eduMaster.endMinute = splitData[1];
            } else {
              this.eduMaster.endHour = null;
              this.eduMaster.endMinute = null;
            }
          }
          this.addUser = _result.data.deptNm + ' / ' + _result.data.userNm;
          this.eduMaster.userId = _result.data.userId;
          this.eduMaster.deptCd = _result.data.deptCd;

          if (this.editable) {
            if (this.eduMaster.rbizApprStepCd === 'BAPSD') {
              // 반려일때 수정가능
              this.editable = true;
            } else {
              if (
                this.eduMaster.rbizApprStepCd === 'BAPSA' &&
                this.popupParam.apprFlag
              ) {
                // 결재중이며 결재자 처리 시 수정가능
                this.editable = true;
              } else if (
                !this.eduMaster.rbizApprStepCd &&
                !this.popupParam.apprFlag
              ) {
                this.editable = true;
              } else {
                this.editable = false;
              }
            }

            if (this.eduMaster.rbizApprStepCd === 'BAPSG') {
              this.isReEdu = true;
            }
          }

          this.setAttachFileGrp();
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    getEduAttCdItems() {
      this.$http.url = this.$format(
        selectConfig.codeMaster.getSelect.url,
        'SAF_EDU_ATT'
      );
      this.$http.type = 'get';
      this.$http.request(
        (_result) => {
          this.eduAttCdItems = this.$_.clone(_result.data);
          this.eduAttCdItems.splice(0, 0, {
            code: null,
            codeNm:
              this.$comm.getLangSpecInfoLabel('L0000003394') /* 선택하세요 */,
          });
        },
        (_error) => {
          window.getApp.$emit(
            'APP_REQUEST_ERROR',
            'M0000000016' /* 작업 중 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요. */
          );
        }
      );
    },
    getEduTypeCdItems() {
      this.$http.url = this.$format(
        selectConfig.codeMaster.getSelect.url,
        'SAF_EDU_TYPE'
      );
      this.$http.type = 'get';
      this.$http.request(
        (_result) => {
          this.eduTypeCdItems = this.$_.clone(_result.data);
          this.eduTypeCdItems.splice(0, 0, {
            code: null,
            codeNm:
              this.$comm.getLangSpecInfoLabel('L0000003394') /* 선택하세요 */,
          });
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    getEduClassCdItems() {
      this.$http.url = this.$format(
        selectConfig.codeMaster.getSelect.url,
        'SAF_EDU_COURSE'
      );
      this.$http.type = 'get';
      this.$http.request(
        (_result) => {
          this.eduClassCdItems = this.$_.clone(_result.data);
          this.eduClassCdItems.splice(0, 0, {
            code: null,
            codeNm:
              this.$comm.getLangSpecInfoLabel('L0000003394') /* 선택하세요 */,
          });
        },
        (_error) => {
          window.getApp.$emit(
            'APP_REQUEST_ERROR',
            'M0000000016' /* 작업 중 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요. */
          );
        }
      );
    },
    getEduCourseItems() {
      this.$http.url = selectConfig.saf.education.eduCourse.list.url;
      this.$http.type = 'GET';
      this.$http.param = {
        useYn: 'Y',
        eduAttCd: this.eduMaster.eduAttCd,
      };
      this.$http.request(
        (_result) => {
          this.eduCourseItems = this.$_.clone(_result.data);
          this.eduCourseItems.splice(0, 0, {
            safEduCourseNo: null,
            eduCourseNm:
              this.$comm.getLangSpecInfoLabel('L0000003394') /* 선택하세요 */,
          });
          if (
            this.eduMaster.safEduCourseNo &&
            this.$_.indexOf(
              this.$_.map(this.eduCourseItems, 'safEduCourseNo'),
              this.eduMaster.safEduCourseNo
            ) === -1
          ) {
            this.eduMaster.safEduCourseNo = null;
          }
        },
        (_error) => {
          window.getApp.$emit(
            'APP_REQUEST_ERROR',
            'M0000000016' /* 작업 중 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요. */
          );
        }
      );
    },

    // 탭
    loadComponent() {
      var path = this.tabItems[this.tabIndex].url;
      if (path === 'multiFileUpload') {
        this.component = () =>
          import('@/pages/common/attachFile/multiFileUpload');
      } else {
        this.component = () => import(`${path}`);
      }
    },
    beforeEdit() {
      if (this.eduMaster.eduTime <= 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395' /* 안내 */,
          message: 'M0000000288' /* 교육시간은 0시간 이상 되어야 합니다. */,
          type: 'warning', // success / info / warning / error
        });
        return;
      }

      var flag = false;
      this.$_.forEach(this.eduMaster.eduOutSideUsers, (_item) => {
        if (_item.birthYmd === '' || _item.workerNm === '') {
          flag = true;
        }
      });

      if (flag) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395' /* 안내 */,
          message:
            '[' +
            this.$comm.getLangSpecInfoLabel('L0000000669') +
            '] ' +
            this.$comm.getLangSpecInfoLabel('M0000000289'), // 교육이수자(외부)의 성명과 생년월일은 필수 입니다.
          type: 'warning', // success / info / warning / error
        });
        return;
      }

      let personFlag = true;
      if (
        this.eduMaster &&
        this.eduMaster.personList &&
        this.eduMaster.personList.length > 0
      ) {
        this.$_.forEach(this.eduMaster.personList, (item) => {
          if (
            item.completYn === 'Y' &&
            (item.completYmd == null || item.completYmd === '')
          ) {
            window.getApp.$emit('ALERT', {
              title: 'L0000003395' /* 안내 */,
              message:
                '[' +
                this.$comm.getLangSpecInfoLabel('L0000000668') +
                '] ' +
                this.$comm.getLangSpecInfoLabel('M0000000290'), // 교육 이수자의 교육 이수일을 선택하세요.
              type: 'warning', // success / info / warning / error
            });
            personFlag = false;
          }
          if (item.eduEvalPnt) {
            let eduEvalPnt = Number(item.eduEvalPnt);
            if (eduEvalPnt < 0 || eduEvalPnt > 100) {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395' /* 안내 */,
                message:
                  'M0000000291' /* 최초평가결과를 확인하세요.(0 ~ 100) */,
                type: 'warning', // success / info / warning / error
              });
              personFlag = false;
            }
          }
          if (item.eduEvalPntSec) {
            let eduEvalPntSec = Number(item.eduEvalPntSec);
            if (eduEvalPntSec < 0 || eduEvalPntSec > 100) {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395' /* 안내 */,
                message: 'M0000000292' /* 2차평가결과를 확인하세요.(0 ~ 100) */,
                type: 'warning', // success / info / warning / error
              });
              personFlag = false;
            }
          }
        });
      }
      // 교육종료일시를 교육시작일시보다 이른 날짜로 선택할 수 없음. 또한 교육시작일시를 교육종료일시보다 늦은 날짜로 선택할 수 없음.
      const fromDataTime = this.$moment(
        this.eduMaster.eduSYmd +
          ' ' +
          this.eduMaster.startHour +
          ':' +
          this.eduMaster.startMinute
      );
      const endDataTime = this.$moment(
        this.eduMaster.eduEYmd +
          ' ' +
          this.eduMaster.endHour +
          ':' +
          this.eduMaster.endMinute
      );
      if (fromDataTime.diff(endDataTime) >= 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395' /* 안내 */,
          message:
            'M0000000274' /* 교육시작일시와 교육종료일시를 확인하세요. */,
          type: 'warning',
        });
        return;
      }

      if (personFlag) {
        this.$validator
          .validateAll()
          .then((_result) => {
            this.validationMessage();
            if (
              !this.eduMaster.eduResultSummary ||
              !this.eduMaster.eduEvalOpin
            ) {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395' /* 안내 */,
                message:
                  '[' +
                  this.$comm.getLangSpecInfoLabel('L0000000407') + // 결과/총평
                  '] ' +
                  this.$comm.getLangSpecInfoLabel('L0000005758'), // 을 입력해 주세요.
                type: 'warning', // success / info / warning / error
              });
              return;
            } else if (_result) {
              if (this.isApprBtn) {
                this.eduMaster.updateUserId = this.$store.getters.token;
                this.isEdit = true;
              } else {
                window.getApp.$emit('CONFIRM', {
                  title: 'L0000003321' /* 확인 */,
                  message: 'M0000000011' /* 저장하시겠습니까? */,
                  type: 'info',
                  confirmCallback: () => {
                    this.eduMaster.eduSHour =
                      this.eduMaster.startHour +
                      ':' +
                      this.eduMaster.startMinute;
                    this.eduMaster.eduEHour =
                      this.eduMaster.endHour + ':' + this.eduMaster.endMinute;
                    this.eduMaster.updateUserId = this.$store.getters.token;
                    this.isEdit = true;
                  },
                });
              }
            }
          })
          .catch(() => {
            window.getApp.$emit(
              'APP_VALID_ERROR',
              'M0000000876' /* 유효성 검사도중 에러가 발생하였습니다. */
            );
          });
      }
    },
    beforeComple() {
      this.$validator.validateAll().then((_result) => {
        this.validationMessage();
        if (!this.eduMaster.eduResultSummary || !this.eduMaster.eduEvalOpin) {
          window.getApp.$emit('ALERT', {
            title: 'L0000003395' /* 안내 */,
            message: 'M0000000293' /* 결과/총평을 입력해 주세요. */,
            type: 'warning', // success / info / warning / error
          });
          return;
        } else if (_result) {
          window.getApp.$emit('CONFIRM', {
            title: 'L0000003321' /* 확인 */,
            message: 'M0000000838' /* 완료하시겠습니까? */,
            type: 'info',
            confirmCallback: () => {
              this.eduMaster.processStepCd = 'SES03';
              this.eduMaster.updateUserId = this.$store.getters.token;
              this.$validator
                .validateAll()
                .then((_result) => {
                  this.isComple = true;
                })
                .catch(() => {
                  this.isComple = false;
                });
            },
          });
        }
      });
    },
    btnDeleteClickedCallback() {
      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321' /* 확인 */,
        message: 'M0000000012' /* 삭제하시겠습니까? */,
        type: 'info',
        // 확인 callback 함수
        confirmCallback: () => {
          this.$http.url = this.$format(
            this.deleteUrl,
            this.eduMaster.safEduMstNo
          );
          this.$http.type = 'DELETE';
          this.$http.request(
            (_result) => {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395' /* 안내 */,
                message: 'M0000000007' /* 정상적으로 삭제되었습니다. */,
                type: 'success',
              });
              this.closePopup();
            },
            (_error) => {
              window.getApp.$emit(
                'APP_REQUEST_ERROR',
                'M0000000016' /* 작업 중 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요. */
              );
            }
          );
        },
        // 취소 callback 함수
        cancelCallback: () => {},
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
    validationMessage() {
      if (!this.eduMaster.deptCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395' /* 안내 */,
          message: 'M0000000725' /* 주관부서를 선택해 주세요. */,
          type: 'warning', // success / info / warning / error
        });
        return;
      } else if (!this.eduMaster.eduSYmd || !this.eduMaster.eduEYmd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395' /* 안내 */,
          message: 'M0000000726' /* 교육기간을 선택해 주세요. */,
          type: 'warning', // success / info / warning / error
        });
        return;
      }
    },
    // 수정
    btnEditClickedCallback(_result) {
      // this.eduMaster.safEduMstNo = _result.data;
      if (this.isApprBtn) {
        this.btnAppr2();
      } else {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395' /* 안내 */,
          message: 'M0000000556' /* 정상적으로 수정되었습니다. */,
          type: 'success', // success / info / warning / error
        });
      }
      this.updateMode = true;
      this.isEdit = false;

      this.saveAttach();
      // this.getDetail();
    },
    // 완료
    btnCompleClickedCallback(_result) {
      window.getApp.$emit('ALERT', {
        title: 'L0000003395' /* 안내 */,
        message: 'M0000000078' /* 완료되었습니다. */,
        type: 'success', // success / info / warning / error
      });
      this.compleMode = false;
      this.updateMode = false;
      this.isComple = false;
    },
    closePopup() {
      this.$emit('closePopup');
    },

    excelDownEduResult(data) {
      let thisVue = this;
      let _comm = this.$comm;
      this.$http.url = '/api/saf/education/eduresultexceldown'; // BASE64를 UTF-8인코딩한 바이트로 다운받음 (그렇지 않으면 FRONT에서 JSON이 깨짐)
      this.$http.type = 'GET';
      this.$http.param = {
        type: data,
        safEduMstNo: this.eduMaster.safEduMstNo,
      };
      this.$http.request(
        (_result) => {
          var fileOrgNm = null;
          if (data === 'EDU1') {
            fileOrgNm =
              '교육과정_' + this.$comm.moment().format('YYYYMMDD') + '.xlsx';
          } else if (data === 'EDU2') {
            fileOrgNm =
              '교육차수_' + this.$comm.moment().format('YYYYMMDD') + '.xlsx';
          } else if (data === 'EDU3') {
            fileOrgNm =
              '교육대상자_' + this.$comm.moment().format('YYYYMMDD') + '.xlsx';
          } else if (data === 'EDU4') {
            fileOrgNm =
              '교육결과_' + this.$comm.moment().format('YYYYMMDD') + '.xlsx';
          } else if (data === 'EDU5') {
            fileOrgNm =
              '교육이력_' + this.$comm.moment().format('YYYYMMDD') + '.xlsx';
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

      // let form = document.excelDownload;
      // form.action =
      //   'http://192.1.22.63:8080/api/saf/education/eduresultexceldown';

      // form.target = 'hiddenifr';
      // form.submit();
    },

    inputElementFunc(_name, _value) {
      var method = document.createElement('input');
      method.setAttribute('type', 'hidden');
      method.setAttribute('name', _name);
      method.value = _value;
      return method;
    },

    /**
     * 버튼 에러 처리용 공통함수
     */
    btnClickedErrorCallback(_result) {
      this.isEdit = false;
      this.isComple = false;
      window.getApp.emit('APP_REQUEST_ERROR', _result);
    },
    /** /Button Event **/
    btnAbsenteeReEdu(data) {
      this.popupOptions.target = () => import(`${'./eduPlanReEdu.vue'}`);
      this.popupOptions.title = 'L0000001356'; /* 불참자 재교육결과 등록/수정 */
      this.popupOptions.visible = true;
      this.popupOptions.width = '80%';
      this.popupOptions.top = '10px';
      this.popupOptions.param = { safEduMstNo: this.eduMaster.safEduMstNo };
      this.popupOptions.closeCallback = this.closeReEduPopup;
    },
    closeReEduPopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;

      this.refresh = !this.refresh;
    },
    btnAppr() {
      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321',
        message: 'M0000000718',
        // 결재요청 전 저장됩니다. 진행하시겠습니까?
        type: 'info', // success / info / warning / error
        confirmCallback: () => {
          this.isApprBtn = true;
          this.beforeEdit();
        },
      });
    },
    btnAppr2() {
      this.popupOptions.target = () =>
        import(`${'@/pages/manage/appr/comApprRequest.vue'}`);
      this.popupOptions.title = 'L0000003418'; /* 결재요청 */
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closeApprPop;
      this.popupOptions.width = '80%';
      this.popupOptions.param = {
        apprBizCd: 'EU-ED-02',
        apprRqstNo: this.eduMaster.rapprRqstNo,
        apprParams: {
          safEduMstNo: this.eduMaster.safEduMstNo,
        },
      };
    },
    closeApprPop(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.isApprBtn = false;
      this.getDetail();
    },

    setAttachFileGrp() {
      let taskKey = this.eduMaster.safEduMstNo
        ? this.eduMaster.safEduMstNo.toString()
        : '';
      this.safAttachFileGrps = [
        {
          label: 'L0000000628' /* 교육결과 파일업로드 */,
          listType: 'text',
          drag: false,
          editable:
            this.editable && !this.authDuringAppr && !this.popupParam.search,
          disabled:
            !this.editable || this.authDuringAppr || !this.popupParam.search,
          showFileSearch:
            this.editable && !this.authDuringAppr && !this.popupParam.search,
          limit: 10,
          multiple: true,
          uploadTempFiles: null,
          taskClassNm: 'EDUPLAN',
          taskKey: taskKey,
          taskFlag: '',
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
        item.taskKey = this.eduMaster.safEduMstNo;
      });
      if (this.safTempDeleteFiles.length > 0) {
        this.$http.url = transactionConfig.attachFile.deleteMulti.url;
        this.$http.type = 'DELETE';
        this.$http.param = {
          data: Object.values(this.$_.clone(this.safTempDeleteFiles)),
        };
        this.$http.request((_result) => {
          this.safTempDeleteFiles = [];
          // this.getDetail();
          if (this.safSaveAttachFiles.length > 0) {
            // 저장할 데이터가 있는 경우
            this.submitObject.submitCheck = !this.submitObject.submitCheck;
          }
        });
      } else {
        // this.getDetail();
        if (this.safSaveAttachFiles.length > 0) {
          // 저장할 데이터가 있는 경우
          this.submitObject.submitCheck = !this.submitObject.submitCheck;
        }
      }
      // this.setBtnVisible(true);
    },
    searchMoc() {
      this.popupOptions.param = {
        plantCd: this.eduMaster.plantCd,
        chngRefWorkCd: 'CGRW3',
      };
      this.popupOptions.target = () =>
        import(`${'@/pages/saf/change/changePop.vue'}`);
      this.popupOptions.title = 'L0000001221'; // 변경관리
      this.popupOptions.visible = true;
      this.popupOptions.width = '80%';
      this.popupOptions.closeCallback = this.closeMocPopup;
    },
    closeMocPopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      if (data !== 'CLOSE') {
        this.eduMaster.chngNum = data.chngNum;
        this.eduMaster.safChngNo = data.safChngNo;
      }
    },
    removeMoc() {
      this.eduMaster.chngNum = '';
      this.eduMaster.safChngNo = 0;
    },
    /** 기타 function **/

    /** /기타 function **/
  },
};
</script>
