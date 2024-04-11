<!--
  목적 : 교육 계획 등록/수정
  작성자 : kkc
  Detail : 교육 계획 등록/수정
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <b-row>
      <!-- 교육 계획 상세 -->
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- 교육 계획 상세 -->
            <y-label
              label="L0000000630"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 결재요청 -->
              <y-btn
                v-if="
                  editable &&
                  !this.popupParam.apprFlag &&
                  updateMode &&
                  (this.eduMaster.pbizApprStepCd === null ||
                    this.eduMaster.pbizApprStepCd === 'BAPSD') &&
                  !popupParam.search
                "
                title="L0000003418"
                color="black"
                @btnClicked="btnAppr"
              />
              <!-- 결재요청회수 -->
              <!-- <y-btn
                v-if="collectCheck && !popupParam.apprFlag"
                title="L0000003420"
                color="black"
                @btnClicked="btnCollectClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              /> -->
              <!-- 저장 -->
              <y-btn
                v-if="
                  editable &&
                  insertMode &&
                  !this.popupParam.apprFlag &&
                  !popupParam.search
                "
                :action-url="insertUrl"
                :param="eduMaster"
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
                v-if="
                  (editable && updateMode && !popupParam.search) ||
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
              <!-- 삭제 -->
              <y-btn
                v-if="
                  editable &&
                  updateMode &&
                  !this.popupParam.apprFlag &&
                  this.eduMaster.papprRqstNo === null &&
                  !popupParam.search
                "
                title="L0000001495"
                color="red"
                @btnClicked="btnDeleteClickedCallback"
              />
              <!-- 닫기 -->
              <y-btn
                title="L0000000881"
                v-if="!this.popupParam.apprFlag"
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
                :editable="editable"
                :disabled="popupParam.search"
                :required="true"
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
                :disabled="popupParam.search"
                name="plantCd"
                v-model="eduMaster.plantCd"
                @datachange="
                  (val) => {
                    (eduMaster.plantCd = val), getEduCourseItems();
                  }
                "
                v-validate="'required'"
                :state="validateState('plantCd')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 교육구분 -->
              <y-select
                :width="8"
                :comboItems="eduTypeCdItems"
                :editable="editable"
                :disabled="popupParam.search"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                label="L0000000639"
                name="eduTypeCd"
                v-model="eduMaster.eduTypeCd"
                :required="true"
                v-validate="'required'"
                :state="validateState('eduTypeCd')"
              ></y-select>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 교육대분류 -->
              <y-select
                :width="8"
                :editable="editable"
                :comboItems="eduAttCdItems"
                :disabled="popupParam.search"
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
                :disabled="popupParam.search"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                label="L0000000659"
                name="eduClassCd"
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
                :disabled="popupParam.search"
                itemText="eduCourseNm"
                itemValue="safEduCourseNo"
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
                ui="bootstrap"
                label="L0000000643"
                name="addUser"
                v-model="addUser"
                v-validate="'required'"
                :state="validateState('addUser')"
                :appendIcon="[{ icon: 'search', callbackName: 'searchUser' }]"
                @searchUser="btnSearchUserClicked"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 관련법규    v-validate="'required'"
                :state="validateState('isTypeCd')" -->
              <y-select
                :width="8"
                :comboItems="isTypeItems"
                :editable="editable"
                :disabled="true"
                :required="false"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                name="isTypeCd"
                label="L0000000568"
                v-model="eduMaster.isTypeCd"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 주관부서 -->
              <y-text
                :width="8"
                ui="bootstrap"
                name="mainDeptNm"
                label="L0000002713"
                placeholder="L0000003394"
                :editable="editable && deptEditable"
                :disabled="true"
                :required="true"
                :plantCd="eduMaster.plantCd"
                v-model="eduMaster.mainDeptNm"
                v-validate="'required'"
                :state="validateState('deptCd')"
                :appendIcon="[
                  { icon: 'times', callbackName: 'clear' },
                  { icon: 'search', callbackName: 'searchDept' },
                ]"
                @searchDept="searchDept('main')"
                @clear="clearDept('main')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 대상부서 -->
              <y-text
                :width="8"
                ui="bootstrap"
                name="targetDeptNm"
                label="L0000000927"
                placeholder="L0000003394"
                :editable="editable"
                :disabled="true"
                :required="true"
                :dtlNull="true"
                :plantCd="eduMaster.plantCd"
                v-model="eduMaster.targetDeptNm"
                v-validate="'required'"
                :state="validateState('deptCd')"
                :appendIcon="[
                  { icon: 'times', callbackName: 'clear' },
                  { icon: 'search', callbackName: 'searchDept' },
                ]"
                @searchDept="searchDept('target')"
                @clear="clearDept('target')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 수행부서 authDuringAppr || popupParam.search -->
              <y-text
                :width="8"
                ui="bootstrap"
                name="execDeptNm"
                label="L0000005120"
                placeholder="L0000003394"
                :editable="editable"
                :disabled="true"
                :required="true"
                :dtlNull="true"
                :plantCd="eduMaster.plantCd"
                v-model="eduMaster.execDeptNm"
                :appendIcon="[
                  { icon: 'times', callbackName: 'clear' },
                  { icon: 'search', callbackName: 'searchDept' },
                ]"
                v-validate="'required'"
                :state="validateState('deptCd')"
                @searchDept="searchDept('exec')"
                @clear="clearDept('exec')"
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
                label="교육풀이문제여부"
                name="questionUseYn"
                v-model="eduMaster.questionUseYn"
              ></y-select>
            </b-col>-->

            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
              <!-- 교육과정명 -->
              <y-text
                :width="10"
                :editable="editable"
                :required="true"
                :disabled="popupParam.search"
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
                    :disabled="popupParam.search"
                    :required="true"
                    :end="eduMaster.eduEYmd"
                    label="L0000000662"
                    name="eduSYmd"
                    v-validate="'required'"
                    :default="eduMaster.eduSYmd"
                    v-model="eduMaster.eduSYmd"
                    :state="validateState('eduSYmd')"
                  ></y-datepicker>
                </b-col>
                <b-col sm="3" md="3" lg="3" xl="3" class="col-xxl-3 px-1">
                  <y-select
                    :width="12"
                    :comboItems="comboHourItems"
                    :editable="editable"
                    :disabled="popupParam.search"
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
                    :disabled="popupParam.search"
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
                    :disabled="popupParam.search"
                    :start="eduMaster.eduSYmd"
                    label="L0000000674"
                    name="eduEYmd"
                    v-validate="'required'"
                    :default="eduMaster.eduEYmd"
                    v-model="eduMaster.eduEYmd"
                    :state="validateState('eduEYmd')"
                  ></y-datepicker>
                </b-col>
                <b-col sm="3" md="3" lg="3" xl="3" class="col-xxl-3 px-1">
                  <y-select
                    :width="12"
                    :comboItems="comboHourItems"
                    :editable="editable"
                    :disabled="popupParam.search"
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
                    :disabled="popupParam.search"
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
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 교육시간 -->
              <y-number
                :width="8"
                :editable="editable"
                :maxlength="5"
                :required="true"
                :disabled="popupParam.search"
                :hasSeperator="false"
                :pointNumber="2"
                ui="bootstrap"
                label="L0000000660"
                name="eduTimePlan"
                v-model="eduMaster.eduTimePlan"
                v-validate="'required'"
                :state="validateState('eduTimePlan')"
              ></y-number>
            </b-col>
            <!-- <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <b-row>
                <b-col sm="8">
                  <y-number
                    :width="6"
                    :editable="editable"
                    :maxlength="2"
                    ui="bootstrap"
                    label="교육 시작시/종료시"
                    name="eduSHour"
                    v-model="eduMaster.eduSHour"
                    :required="true"
                    v-validate="'required'"
                    :state="validateState('eduSHour')"
                  ></y-number>
                </b-col>
                <b-col sm="4">
                  <y-number
                    :width="12"
                    :editable="editable"
                    :maxlength="2"
                    ui="bootstrap"
                    name="eduEHour"
                    v-model="eduMaster.eduEHour"
                    v-validate="'required'"
                    :state="validateState('eduEHour')"
                  ></y-number>
                </b-col>
              </b-row>
            </b-col>-->
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 교육장소 -->
              <y-text
                :width="8"
                :editable="editable"
                :maxlength="60"
                :required="true"
                :disabled="popupParam.search"
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
                :maxlength="30"
                :disabled="popupParam.search"
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
              <!-- 변경발의번호 -->
              <y-text
                :width="8"
                :editable="editable && !popupParam.search"
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
                :maxlength="600"
                :required="true"
                :disabled="popupParam.search"
                ui="bootstrap"
                label="L0000000642"
                name="eduContent"
                v-validate="'required'"
                v-model="eduMaster.eduContent"
                :state="validateState('eduContent')"
              ></y-textarea>
            </b-col>

            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
              <!-- <qrcode-vue value="www.naver.com" size="300" level="H"></qrcode-vue> -->
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
              :eduMaster.sync="eduMaster"
              :submitCheck="safSubmitCheck"
              :refresh.sync="refresh"
              sm="12"
              :tabEditable="editable"
              :attachFileGrps.sync="safAttachFileGrps"
              :saveAttachFiles.sync="safSaveAttachFiles"
              @changeUploadFiles="changeUploadFiles"
              @setTempDeleteFiles="setTempDeleteFiles"
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
import QrcodeVue from 'qrcode.vue';

export default {
  /** attributes: name, components, props, data **/
  name: 'edu-plan',
  components: {
    QrcodeVue,
  },
  props: {
    popupParam: {
      type: Object,
      default: {
        apprRqstNo: 0,
        safEduMstNo: 0,
        processStepCd: '',
        safEduCourseNo: null,
        search: false,
      },
    },
  },
  data() {
    return {
      tabItems: [
        { title: 'L0000000646', url: './eduPlanPerson' } /* 교육대상자 */,
        { title: 'L0000000654', url: './eduPlanExam' } /* 교육문제 */,
        // { title: 'L0000000775', url: './eduPlanMaterial' } /* 기본 교육자료 */,
        { title: 'L0000002843', url: 'multiFileUpload' } /* 첨부파일 */,
      ],

      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '850px',
        top: '100px',
        param: {},
        closeCallback: null,
      },

      component: null,
      tabIndex: 0,
      eduMaster: {
        safEduMstNo: 0, // 교육마스터 번호
        safEduCourseNo: null, // 교육과정 번호
        eduTypeCd: null, // 교육구분코드
        eduAttCd: null, // 교육분류
        deptCd: null, // 교육담당부서코드
        userId: null, // 교육담당자 아이디
        eduNm: null, // 교육명
        eduSYmd: null, // 교육시작일
        eduEYmd: null, // 교육종료일
        eduTime: 0, // 실제교육시간
        eduTimePlan: null, // 계획교육시간
        startHour: null, // 교육시작시
        startMinute: null, // 교육시작시
        eduSHour: null, // 교육시작시
        endHour: null, // 교육시작시
        endMinute: null, // 교육시작시
        eduEHour: null, // 교육종료시
        eduPlace: null, // 교육장소
        eduTeacher: null, // 교육강사
        eduContent: null, // 교육내용
        eduResultSummary: null, // 교육결과요약
        eduEvalOpin: null, // 교육총평
        processStepCd: null, // 교육진행단계코드
        plantCd: null, // 사업장
        questionUseYn: null, // 교육문제풀이여부
        reEduYn: null, // 재교육수행여부
        reEduSYmd: null, // 재교육시작일
        reEduEYmd: null, // 재교육종료일
        reEduTime: 0, // 재교육시간
        reEduPlace: null, // 재교육장소
        reEduTeacher: null, // 재교육강사
        reEduEndYn: null, // 재교육완료여부
        papprRqstNo: 0, // 계획결재요청번호
        rapprRqstNo: 0, // 결과결재요청번호
        createUserId: null, // 등록자아이디
        createDt: null, // 등록일
        updateUserId: null, // 수정자아이디
        updateDt: null, // 수정일
        eduClassCd: null,
        questionLsts: [],
        dataLsts: [],
        eduCourseMat: [],
        chngNum: '', // 변경발의번호
        safChngNo: 0,
        year: null,
        mainDeptCd: null,
        targetDeptCd: null,
        execDeptCd: null,
        mainDeptNm: null,
        targetDeptNm: null,
        execDeptNm: null,
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
      editable: false,
      insertMode: false,
      updateMode: false,
      compleMode: false,

      eduAttCdItems: [],
      eduCourseItems: [],
      eduTypeCdItems: [],
      eduClassCdItems: [],
      comboHourItems: [], // 시
      comboMinuteItems: [], // 분
      questionUseYnItems: [],
      isTypeItems: [],
      addUser: '',
      insertUrl: '',
      editUrl: '',
      deleteUrl: '',
      getUrl: '',
      isInsert: false,
      isEdit: false,
      isComple: false,
      disabled: false,
      attach: null, // 첨부파일컴포넌트
      safSubmitCheck: false,
      safSaveAttachFiles: [],
      safTempDeleteFiles: [],
      safAttachFileGrps: [],
      collectCheck: false,
      collectUrl: '',
      refresh: false, // 교육대상자 refresh 플래그
      type: null,
      companyEditable: false, // 전사 권한
      plantEditable: false, // 사업장 권한
      deptEditable: false, // 일반 권한
    };
  },
  watch: {
    tabIndex() {
      this.loadComponent();
    },
    'eduMaster.eduAttCd': function (newValue, oldValue) {
      this.getEduCourseItems();
    },
    'eduMaster.eduClassCd': function (newValue, oldValue) {
      this.getEduCourseItems();
    },
    'eduMaster.safEduCourseNo': function (newValue, oldValue) {
      this.$comm.getComboItems('MGT_LAW_CLASS', false).then((_result) => {
        this.isTypeItems = this.$_.clone(_result);
      });
      this.getEduCourseItems();
    },
    'eduMaster.year'() {
      if (this.eduMaster.year) {
        this.eduMaster.eduSYmd = this.eduMaster.year + '-01-01';
        this.eduMaster.eduEYmd = this.eduMaster.year + '-12-31';
      }
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
      this.insertUrl = transactionConfig.saf.education.eduMaster.insert.url;
      this.editUrl = transactionConfig.saf.education.eduMaster.edit.url;
      this.deleteUrl = transactionConfig.saf.education.eduMaster.delete.url;
      this.getUrl = selectConfig.saf.education.eduMaster.get.url;
      this.collectUrl = transactionConfig.manage.appr.collect.url;

      this.eduMaster.mainDeptCd = this.$store.getters.deptCd;
      this.eduMaster.mainDeptNm = this.$store.getters.deptNm;

      var i = 0;
      for (; i < 24; i++) {
        this.comboHourItems.push({
          hourNm: i + this.$comm.getLangSpecInfoLabel('L0000003897'), // 시
          hour: i,
        });
      }

      i = 0;
      for (; i < 60; i++) {
        this.comboMinuteItems.push({
          minuteNm: i + this.$comm.getLangSpecInfoLabel('L0000003898'), // 분
          minute: i,
        });
      }
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

      this.$comm.getComboItems('SAF_EDU_ATT', true).then((_result) => {
        this.eduAttCdItems = _result;
      });
      this.$comm.getComboItems('SAF_EDU_TYPE', true).then((_result) => {
        this.eduTypeCdItems = _result;
      });
      this.$comm.getComboItems('SAF_EDU_COURSE', true).then((_result) => {
        this.eduClassCdItems = _result;
      });

      this.isTypeItems.splice(0, 0, {
        isTypeCd: null,
        codeNm: this.$comm.getLangSpecInfoLabel('L0000003394') /* 선택하세요 */,
      });

      this.eduCourseItems.splice(0, 0, {
        safEduCourseNo: null,
        eduCourseNm:
          this.$comm.getLangSpecInfoLabel('L0000003394') /* 선택하세요 */,
      });

      this.eduMaster.safEduMstNo = this.popupParam.safEduMstNo;
      this.eduMaster.processStepCd = this.popupParam.processStepCd;

      if (this.popupParam.safEduMstNo === 0) {
        this.updateMode = false;
        this.insertMode = true;
        this.compleMode = false;
      } else {
        this.getDetail();
        this.updateMode = true;
        this.insertMode = false;
        this.compleMode = true;
      }

      this.questionUseYnItems.splice(0, 0, {
        code: null,
        codeNm: this.$comm.getLangSpecInfoLabel('L0000003394') /* 선택하세요 */,
      });

      this.setAttachFileGrp();

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
      console.log('ed', this.editable);
      console.log('appr', this.popupParam.apprFlag);
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
      if (!this.eduMaster.papprRqstNo || this.eduMaster.papprRqstNo <= 0) {
        return;
      }
      this.$http.url = this.$format(
        selectConfig.manage.appr.getCollect.url,
        this.eduMaster.papprRqstNo,
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
          this.eduMaster.papprRqstNo
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
          this.$_.extend(this.eduMaster, _result.data);
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
          this.addUser =
            String(_result.data.deptNm) + ' / ' + String(_result.data.userNm);
          if (this.editable) {
            if (this.eduMaster.pbizApprStepCd === 'BAPSD') {
              // 반려일때 수정가능
              this.editable = true;
            } else {
              if (
                this.eduMaster.pbizApprStepCd === 'BAPSA' &&
                this.popupParam.apprFlag
              ) {
                // 결재중이며 결재자 처리 시 수정가능
                this.editable = true;
              } else if (
                !this.eduMaster.pbizApprStepCd &&
                !this.popupParam.apprFlag
              ) {
                this.editable = true;
              } else {
                this.editable = false;
              }
            }
          }
          this.setAttachFileGrp();
          this.refresh = !this.refresh;
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },

    getEduCourseItems() {
      this.$http.url = selectConfig.saf.education.eduCourse.list.url;
      this.$http.type = 'GET';
      this.$http.param = {
        useYn: 'Y',
        eduAttCd: this.eduMaster.eduAttCd,
        eduTypeCd: this.eduMaster.eduClassCd,
        plantCd: this.eduMaster.plantCd,
        safEduCourseNo: this.eduMaster.safEduCourseNo,
        isTypeCd: this.eduMaster.isTypeCd,
      };
      this.$http.request(
        (_result) => {
          if (this.eduMaster.safEduCourseNo !== null) {
            this.eduMaster.isTypeCd = _result.data[0]
              ? _result.data[0].isTypeCd
              : '';
          } else {
            this.eduMaster.isTypeCd = null;
          }

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
      } // else if (path === 'imprActTab') this.component = () => import('@/pages/impr/imprActTab');
      else {
        this.component = () => import(`${path}`);
      }
    },
    beforeInsert() {
      this.$validator
        .validateAll()
        .then((_result) => {
          if (_result) {
            if (
              this.eduMaster.eduUserId === undefined ||
              this.eduMaster.eduUserId.length === 0
            ) {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395' /* 안내 */,
                message:
                  '[' +
                  this.$comm.getLangSpecInfoLabel('L0000000646') +
                  '] ' +
                  this.$comm.getLangSpecInfoLabel('M0000000724'), // 교육대상자를 선정해 주세요.
                type: 'warning', // success / info / warning / error
              });
              return;
            }
            if (this.eduMaster.eduTimePlan <= 0) {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395' /* 안내 */,
                message:
                  'M0000000288' /* 교육시간은 0시간 이상 되어야 합니다. */,
                type: 'warning', // success / info / warning / error
              });
              return;
            }
            let eduSHour = Number(this.eduMaster.eduSHour);
            if (eduSHour < 0 || eduSHour > 24) {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395' /* 안내 */,
                message: 'M0000000272' /* 교육 시작시를 확인하세요.(0 ~ 24) */,
                type: 'warning', // success / info / warning / error
              });
              return;
            }
            let eduEHour = Number(this.eduMaster.eduEHour);
            if (eduEHour < 0 || eduEHour > 24) {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395' /* 안내 */,
                message: 'M0000000273' /* 교육 종료시를 확인하세요.(0 ~ 24) */,
                type: 'warning', // success / info / warning / error
              });
              return;
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
            window.getApp.$emit('CONFIRM', {
              title: 'L0000003321' /* 확인 */,
              message: 'M0000000011' /* 저장하시겠습니까? */,
              type: 'info',
              confirmCallback: () => {
                this.eduMaster.eduSHour =
                  this.eduMaster.startHour + ':' + this.eduMaster.startMinute;
                this.eduMaster.eduEHour =
                  this.eduMaster.endHour + ':' + this.eduMaster.endMinute;
                this.eduMaster.createUserId = this.$store.getters.token;
                this.isInsert = true;
              },
            });
          } else {
            if (!this.eduMaster.year) {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395', // 안내
                message: 'L0000005132', // 대상년도를 선택해주세요
                type: 'warning',
              });
              // window.getApp.$emit('APP_REQUEST_ERROR', '비밀번호와 비밀번호 확인은 동일해야 합니다.');
              return;
            }
            if (!this.eduMaster.plantCd) {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395',
                message: 'M0000000066', // 사업장을 선택하세요.
                type: 'warning',
              });
              return;
            }
            if (!this.eduMaster.eduTypeCd) {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395',
                message: 'M0000001327', // 교육구분을 선택해주세요.
                type: 'warning',
              });
              return;
            }
            if (!this.eduMaster.eduAttCd) {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395',
                message: 'M0000001328', // 교육대분류를 선택해주세요.
                type: 'warning',
              });
              return;
            }
            if (!this.eduMaster.eduClassCd) {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395',
                message: 'M0000001329', // 교육분류를 선택해주세요.
                type: 'warning',
              });
              return;
            }
            if (!this.eduMaster.safEduCourseNo) {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395',
                message: 'L0000005328', // 교육명을 선택해주세요.
                type: 'warning',
              });
              return;
            }
            if (!this.addUser) {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395',
                message: 'M0000001331', // 교육담당자를 선택해주세요.
                type: 'warning',
              });
              return;
            }
            if (!this.eduMaster.mainDeptCd) {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395',
                message: 'L0000005136', // 주관부서를 선택해주세요.
                type: 'warning',
              });
              return;
            }
            if (!this.eduMaster.targetDeptCd) {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395',
                message: 'L0000005330', // 대상부서를 선택해주세요.
                type: 'warning',
              });
              return;
            }
            if (!this.eduMaster.execDeptCd) {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395',
                message: 'L0000005155', // 수행부서를 선택해주세요.
                type: 'warning',
              });
              return;
            }
            if (!this.eduMaster.eduNm) {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395',
                message: 'L0000005329', // 교육과정명을 입력해주세요.
                type: 'warning',
              });
              return;
            }
            if (!this.eduMaster.eduSYmd) {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395',
                message: 'M0000001333', // 교육시작일시(날짜)를 선택해주세요.
                type: 'warning',
              });
              return;
            }
            if (!this.eduMaster.startHour) {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395',
                message: 'M0000001334', // 교육시작일시(시간)를 선택해주세요.
                type: 'warning',
              });
              return;
            }
            if (!this.eduMaster.startMinute) {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395',
                message: 'M0000001335', // 교육시작일시(분)를 선택해주세요.
                type: 'warning',
              });
              return;
            }
            if (!this.eduMaster.eduEYmd) {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395',
                message: 'M0000001336', // 교육종료일시(날짜)를 선택해주세요.
                type: 'warning',
              });
              return;
            }
            if (!this.eduMaster.endHour) {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395',
                message: 'M0000001337', // 교육종료일시(시간)를 선택해주세요.
                type: 'warning',
              });
              return;
            }
            if (!this.eduMaster.endMinute) {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395',
                message: 'M0000001338', // 교육종료일시(분)를 선택해주세요.
                type: 'warning',
              });
              return;
            }
            if (!this.eduMaster.eduTimePlan) {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395',
                message: 'M0000001339', // 교육시간을 입력해주세요.
                type: 'warning',
              });
              return;
            }
            if (!this.eduMaster.eduPlace) {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395',
                message: 'M0000001340', // 교육장소를 입력해주세요.
                type: 'warning',
              });
              return;
            }
            if (!this.eduMaster.eduTeacher) {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395',
                message: 'M0000001341', // 교육강사를 입력해주세요.
                type: 'warning',
              });
              return;
            }
            if (!this.eduMaster.eduContent) {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395',
                message: 'M0000001342', // 교육내용을 입력해주세요.
                type: 'warning',
              });
              return;
            }
          }
        })
        .catch((e) => {
          window.getApp.$emit(
            'APP_VALID_ERROR',
            'M0000000881' /* 유효성 검사도중 에러가 발생하였습니다. */
          );
        });
    },
    beforeEdit() {
      this.$validator
        .validateAll()
        .then((_result) => {
          if (_result) {
            if (
              this.eduMaster.eduUserId === undefined ||
              this.eduMaster.eduUserId.length === 0
            ) {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395' /* 안내 */,
                message:
                  '[' +
                  this.$comm.getLangSpecInfoLabel('L0000000646') +
                  '] ' +
                  this.$comm.getLangSpecInfoLabel('M0000000724'), // 교육대상자를 선정해 주세요.
                type: 'warning', // success / info / warning / error
              });
              return;
            }
            if (this.eduMaster.eduTimePlan <= 0) {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395' /* 안내 */,
                message:
                  'M0000000288' /* 교육시간은 0시간 이상 되어야 합니다. */,
                type: 'warning', // success / info / warning / error
              });
              return;
            }

            let eduSHour = Number(this.eduMaster.eduSHour);
            if (eduSHour < 0 || eduSHour > 24) {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395' /* 안내 */,
                message: 'M0000000272' /* 교육 시작시를 확인하세요.(0 ~ 24) */,
                type: 'warning', // success / info / warning / error
              });
              return;
            }
            let eduEHour = Number(this.eduMaster.eduEHour);
            if (eduEHour < 0 || eduEHour > 24) {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395' /* 안내 */,
                message: 'M0000000273' /* 교육 종료시를 확인하세요.(0 ~ 24) */,
                type: 'warning', // success / info / warning / error
              });
              return;
            }
            window.getApp.$emit('CONFIRM', {
              title: 'L0000003321' /* 확인 */,
              message: 'M0000000060' /* 수정하시겠습니까? */,
              type: 'info',
              confirmCallback: () => {
                this.eduMaster.updateUserId = this.$store.getters.token;
                this.isEdit = true;
              },
            });
          } else if (!_result) {
            this.$popupRequired.check('eduPlan', this.$data, this.errors);
          }
        })
        .catch(() => {
          window.getApp.$emit(
            'APP_VALID_ERROR',
            'M0000000881' /* 유효성 검사도중 에러가 발생하였습니다. */
          );
        });
    },
    beforeComple() {
      this.$validator.validateAll().then((_result) => {
        this.validationMessage();
        if (!_result) {
          this.$popupRequired.check('eduPlan', this.$data, this.errors);
        } else if (_result) {
          window.getApp.$emit('CONFIRM', {
            title: 'L0000003321' /* 확인 */,
            message: 'M0000000838' /* 완료하시겠습니까? */,
            type: 'info',
            confirmCallback: () => {
              this.eduMaster.processStepCd = 'SES02';
              this.eduMaster.updateUserId = this.$store.getters.token;
              this.isComple = true;
            },
          });
        }
      });
    },
    btnDeleteClickedCallback(_result) {
      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321' /* 확인 */,
        message: 'M0000000012' /* 삭제하시겠습니까? */,
        type: 'info',
        // 확인 callback 함수
        confirmCallback: () => {
          this.$http.url = this.$format(
            this.deleteUrl,
            this.eduMaster.safEduMstNo,
            this.eduMaster.safEduCourseNo
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
                'M0000000016' /* 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요. */
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
    btnSearchUserClicked(_item) {
      if (this.authDuringAppr) return;
      this.popupOptions.target = () =>
        import(`${'../manage/user/userSearch.vue'}`);
      this.popupOptions.title = 'L0000000327'; /* 처리자검색 */
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closePopupSearchUser;
    },

    closePopupSearchUser(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      if (data.user) {
        this.addUser = data.user.deptNm + ' / ' + data.user.userNm;
        this.eduMaster.userId = data.user.userId;
        this.eduMaster.deptCd = data.user.deptCd;
      }
    },

    validationMessage() {
      if (!this.eduMaster.eduSYmd || !this.eduMaster.eduEYmd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395' /* 안내 */,
          message: 'M0000000726' /* 교육기간을 선택해 주세요. */,
          type: 'warning', // success / info / warning / error
        });
        return;
      }
    },
    // 신규등록
    btnInsertClickedCallback(_result) {
      this.eduMaster.safEduMstNo = _result.data;
      this.isInsert = false;
      this.insertMode = false;
      this.updateMode = true;
      window.getApp.$emit('ALERT', {
        title: 'L0000003395' /* 안내 */,
        message: 'M0000000555' /* 정상적으로 등록하였습니다. */,
        type: 'success',
      });

      // this.getDetail();
      this.saveAttach();
    },
    // 수정
    btnEditClickedCallback(_result) {
      window.getApp.$emit('ALERT', {
        title: 'L0000003395' /* 안내 */,
        message: 'M0000000556' /* 정상적으로 수정하였습니다. */,
        type: 'success', // success / info / warning / error
      });
      this.updateMode = true;
      this.insertMode = false;
      this.isEdit = false;
      this.saveAttach();
    },
    // 완료
    btnCompleClickedCallback(_result) {
      window.getApp.$emit('ALERT', {
        title: 'L0000003395' /* 안내 */,
        message: 'M0000000078' /* 완료되었습니다. */,
        type: 'success', // success / info / warning / error
      });
      this.closePopup();
    },
    closePopup() {
      this.$emit('closePopup');
    },
    /**
     * 버튼 에러 처리용 공통함수
     */
    btnClickedErrorCallback(_result) {
      this.isInsert = false;
      this.isEdit = false;
      this.isComple = false;
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },

    btnAppr() {
      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321',
        message: 'M0000000718',
        // 결재요청 전 저장됩니다. 진행하시겠습니까?
        type: 'info', // success / info / warning / error
        confirmCallback: () => {
          this.eduMaster.updateUserId = this.$store.getters.token;
          this.$http.url = this.editUrl;
          this.$http.type = 'PUT';
          this.$http.param = this.eduMaster;
          this.$http.request(
            (_result) => {
              this.popupOptions.target = () =>
                import(`${'@/pages/manage/appr/comApprRequest.vue'}`);
              this.popupOptions.title = 'L0000003418'; /* 결재요청 */
              this.popupOptions.visible = true;
              this.popupOptions.closeCallback = this.closeApprPop;
              this.popupOptions.width = '80%';
              this.popupOptions.param = {
                apprBizCd: 'EU-ED-01',
                apprRqstNo: this.eduMaster.papprRqstNo,
                apprParams: {
                  safEduMstNo:
                    this.popupParam.safEduMstNo === 0
                      ? this.eduMaster.safEduMstNo
                      : this.popupParam.safEduMstNo,
                },
              };
            },
            (_error) => {
              window.getApp.$emit('APP_REQUEST_ERROR', _error);
            }
          );
        },
      });
    },
    closeApprPop(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.eduMaster.safEduMstNo =
        this.popupParam.safEduMstNo === 0
          ? this.eduMaster.safEduMstNo
          : this.popupParam.safEduMstNo;

      this.getDetail();
    },

    setAttachFileGrp() {
      let taskKey = this.eduMaster.safEduMstNo
        ? this.eduMaster.safEduMstNo.toString()
        : '';
      this.safAttachFileGrps = [
        {
          label: 'L0000000632' /* 교육계획 파일업로드 */,
          uploadTempFiles: null,
          taskClassNm: 'EDUPLAN',
          taskKey: taskKey,
          // 수정 전 코드 drag: this.editable && !this.authDuringAppr && !this.popupParam.search,
          // 수정 전 코드 editable: this.editable && !this.authDuringAppr && !this.popupParam.search,
          // 수정 전 코드 disabled: !this.editable || this.authDuringAppr || !this.popupParam.search,
          drag: this.editable,
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
            this.safSubmitCheck = !this.safSubmitCheck;
          } else {
            // 저장할 데이터가 없는 경우
            this.submitCheck = !this.submitCheck;
          }
        });
      } else {
        // this.getDetail();
        if (this.safSaveAttachFiles.length > 0) {
          // 저장할 데이터가 있는 경우
          this.safSubmitCheck = !this.safSubmitCheck;
        } else {
          // 저장할 데이터가 없는 경우
          this.submitCheck = !this.submitCheck;
        }
      }
      this.getDetail();
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
    searchDept(type) {
      this.type = type;
      this.popupOptions.target = () =>
        import(`${'../baseInfo/deptManage/deptSearchPopup.vue'}`);
      this.popupOptions.param = {
        plantCd: this.eduMaster.plantCd,
      };
      this.popupOptions.title = 'L0000004627'; // 부서 검색
      this.popupOptions.visible = true;
      this.popupOptions.width = '35%';
      this.popupOptions.top = '100px';
      this.popupOptions.closeCallback = this.closePopupSearchDept;
    },
    closePopupSearchDept(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      if (data.dept) {
        if (this.type === 'exec') {
          this.eduMaster.execDeptCd = data.dept.deptCd;
          this.eduMaster.execDeptNm = data.dept.deptNm;
        }
        if (this.type === 'main') {
          this.eduMaster.mainDeptCd = data.dept.deptCd;
          this.eduMaster.mainDeptNm = data.dept.deptNm;
        }
        if (this.type === 'target') {
          this.eduMaster.targetDeptCd = data.dept.deptCd;
          this.eduMaster.targetDeptNm = data.dept.deptNm;
        }
      }
    },
    clearDept(type) {
      this.type = type;
      if (type === 'main') {
        this.eduMaster.mainDeptCd = null;
        this.eduMaster.mainDeptNm = null;
      } else if (type === 'target') {
        this.eduMaster.targetDeptCd = null;
        this.eduMaster.targetDeptNm = null;
      } else {
        this.eduMaster.execDeptCd = null;
        this.eduMaster.execDeptNm = null;
      }
    },
    /** end button 관련 이벤트 **/

    /** /Button Event **/

    /** 기타 function **/

    /** /기타 function **/
  },
};
</script>
