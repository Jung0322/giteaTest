<!--
  목적 : 교육계획 등록-> 교육계획탭
  Detail : 교육풀이문제 문제 추가화면
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <b-row>
      <!-- 교육 문제 상세 -->
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- 교육문제 상세 -->
            <y-label
              label="L0000000656"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 저장 -->
              <y-btn
                v-if="editable && insertMode"
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
                v-if="editable && updateMode"
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

              <!--               
              <y-btn
                v-if="updateMode"
                title="삭제"
                color="red"
                @btnClicked="btnDeleteClickedCallback"
              />-->
              <!-- 닫기 -->
              <y-btn title="L0000000881" @btnClicked="closePopup" />
            </div>
          </b-col>
        </b-row>
        <b-card>
          <b-row>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 등록자 -->
              <y-text
                :width="8"
                :editable="editable"
                :disabled="true"
                ui="bootstrap"
                label="L0000000976"
                name="createUserNm"
                v-model="eduMaster.createUserNm"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 등록일 -->
              <y-text
                :width="8"
                :editable="editable"
                :disabled="true"
                ui="bootstrap"
                label="L0000000973"
                name="createDt"
                v-model="eduMaster.createDt"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-plant
                type="edit"
                :required="true"
                :editable="editable"
                :disabled="updateMode"
                name="plantCd"
                v-model="eduMaster.plantCd"
                v-validate="'required'"
                :state="validateState('plantCd')"
                @datachange="
                  (val) => {
                    (eduMaster.plantCd = val), getEduCourseItems();
                  }
                "
              />
            </b-col>

            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 교육대분류 -->
              <y-select
                :width="8"
                :editable="editable"
                :comboItems="eduAttCdItems"
                :disabled="updateMode"
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
                :comboItems="eduTypeCdItems"
                :disabled="updateMode"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                label="L0000000659"
                name="eduTypeCd"
                v-model="eduMaster.eduTypeCd"
                :required="true"
                v-validate="'required'"
                :state="validateState('eduTypeCd')"
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
                ui="bootstrap"
                label="L0000000653"
                name="safEduCourseNo"
                :disabled="updateMode"
                v-model="eduMaster.safEduCourseNo"
                :required="true"
                v-validate="'required'"
                :state="validateState('safEduCourseNo')"
              ></y-select>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 사용여부 -->
              <y-switch
                :width="8"
                :editable="editable"
                true-value="Y"
                false-value="N"
                ui="bootstrap"
                label="L0000001439"
                name="useYn"
                selectText="L0000001440"
                unselectText="L0000001063"
                v-model="eduMaster.useYn"
              ></y-switch>
            </b-col>

            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-9"></b-col>
            <!--             
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
              <y-textarea
                :width="10"
                :editable="editable"
                :maxlength="600"
                :required="true"
                ui="bootstrap"
                label="문제"
                name="examNm"
                v-validate="'required'"
                v-model="eduMaster.examNm"
              ></y-textarea>
            </b-col>-->
          </b-row>
        </b-card>
      </b-col>
    </b-row>

    <b-row>
      <b-col sm="12" style="margin-top: 1.2rem">
        <!-- 교육문제 내역 -->
        <y-label
          label="L0000000655"
          icon="user-edit"
          color-class="cutstom-title-color"
        />
        <div slot="buttonGroup" class="float-right mb-1">
          <!-- 추가 -->
          <y-btn
            v-if="editable"
            title="L0000002892"
            color="blue"
            @btnClicked="addQuestion"
          />
          <y-btn :title="folderTitle" @btnClicked="folder" />
        </div>
      </b-col>
    </b-row>
    <el-card class="box-card cardStyle" shadow="never">
      <el-collapse
        v-model="activeName"
        style="width: 100%"
        @change="gridResize"
      >
        <el-collapse-item
          v-for="(questions, i) in questions"
          :key="i"
          :name="questions.eduQuestionLstNo"
        >
          <template slot="title">
            <b-col style="width: 70%">
              <y-label
                :label="
                  Number(i + 1) +
                  '  ' +
                  $comm.getLangSpecInfoLabel('L0000001043') +
                  ' : ' +
                  questions.questionContents
                "
                color-class="cutstom-title-color"
              />
              <div class="float-right"></div>
            </b-col>
          </template>

          <b-row>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
              <!-- 문제사용여부 -->
              <y-switch
                :width="10"
                :editable="editable"
                true-value="Y"
                false-value="N"
                ui="bootstrap"
                :required="true"
                label="L0000001047"
                name="useYn"
                selectText="L0000001440"
                unselectText="L0000001063"
                v-model="questions.useYn"
              />
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
              <!-- 문제 -->
              <y-textarea
                :width="10"
                :editable="editable"
                :maxlength="600"
                :required="true"
                ui="bootstrap"
                label="L0000001043"
                v-model="questions.questionContents"
                :placeholder="$comm.getLangSpecInfoLabel('L0000001046')"
                v-validate="'required'"
              ></y-textarea>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6 h100p">
              <y-auigrid
                :ref="'yAuiGrid_' + i"
                :name="gridOptions.name + '_' + i"
                :headers="gridOptions.header"
                :btns="gridOptions.btns"
                :height="gridOptions.height"
                :items="questions.eduQuestionAnswers"
                :useExcelExport="false"
                :editable="editable"
                selectionMode="multipleCells"
                :showRowCheckColumn="true"
                :softRemoveRowMode="false"
                @btnAddAnswer="btnAddAnswer(i)"
                @btnDeleteAnswer="btnDeleteAnswer('yAuiGrid_' + i, i)"
                @cellEditEnd="cellEditHandler('yAuiGrid_' + i, i)"
              />
            </b-col>
          </b-row>
        </el-collapse-item>
      </el-collapse>
    </el-card>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
export default {
  /* attributes: name, components, props, data */
  name: 'edu-plan-exam-add',
  props: {
    popupParam: {
      type: Object,
      default: {},
    },
  },
  data: () => ({
    eduMaster: {
      eduQuestionNo: 0,
      plantCd: null,
      safEduCourseNo: null,
      questionYn: null,
      useYn: 'Y',
      sortOrder: 0,
      createUserId: '',
      createDt: null,
      updateUserId: '',
      updateDt: null,
      qeustion: [],
      delQuestion: [],
      delAnswer: [],
    },
    gridOptions: {
      name: 'eduExamQuestion',
      header: [],
      data: [],
      height: '200',
      selectedItems: [],
    },

    folderTitle: 'L0000003043',
    folderFlag: 'Y',
    activeName: [],

    insertMode: false,
    updateMode: false,
    isInsert: false,
    isEdit: false,
    editUrl: '',
    insertUrl: '',
    editable: true,
    eduAttCdItems: [],
    eduAttTypeItems: [],
    eduCourseItems: [],
    eduTypeCdItems: [],
    questions: [],
    delQuestions: [],
    delAnswers: [],
  }),
  watch: {
    'eduMaster.eduAttCd': function (newValue, oldValue) {
      this.getEduCourseItems();
    },
    'eduMaster.eduTypeCd': function (newValue, oldValue) {
      this.getEduCourseItems();
    },
  },
  //* Vue lifecycle: created, mounted, destroyed, etc */
  beforeCreate() {},
  created() {},
  update() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {},
  beforeDestroy() {},
  //* methods */
  methods: {
    init() {
      this.eduMaster.plantCd = this.$store.getters.plantCd;

      this.editable = this.$route.meta.editable;

      this.insertUrl = transactionConfig.saf.education.eduQuestion.insert.url;
      this.editUrl = transactionConfig.saf.education.eduQuestion.edit.url;
      this.deleteUrl = transactionConfig.saf.education.eduQuestion.delete.url;

      this.getEduAttCdItems();
      this.getEduTypeCdItems();
      this.getEduCourseItems();

      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002599'), // 정답
          dataField: 'correctYn',
          width: '10%',
          renderer: {
            type: 'CheckBoxEditRenderer',
            checkValue: 'Y',
            unCheckValue: 'N',
            editable: this.editable,
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001708'), // 순서
          dataField: 'sortOrder',
          width: '10%',
          dataType: 'numeric',
          editRenderer: {
            type: 'InputEditRenderer',
            onlyNumeric: true, // 0~9만 입력가능
            textAlign: 'right', // 오른쪽 정렬로 입력되도록 설정
            maxlength: 5, // 글자수 5으로 제한 (천단위 구분자 삽입(autoThousandSeparator=true)로 한 경우 구분자 포함해서 5자로 제한)
            autoThousandSeparator: true, // 천단위 구분자 삽입 여부
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000901'), // 답안
          dataField: 'answerContents',
          width: '80%',
          style: 'my-left-column',
          editRenderer: {
            type: 'InputEditRenderer',
            textAlign: 'left', // 왼쪽 정렬로 입력되도록 설정
            maxlength: 100, // 글자수 10으로 제한 (천단위 구분자 삽입(autoThousandSeparator=true)로 한 경우 구분자 포함해서 10자로 제한)
          },
        },
      ];

      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000002892'),
          color: 'blue',
          btnClicked: 'btnAddAnswer',
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001495'),
          color: 'red',
          btnClicked: 'btnDeleteAnswer',
        },
      ];

      this.gridOptions.data = [{ rightAnswer: '', orderNo: 1, answer: '' }];

      this.eduMaster.createDt = this.$comm
        .moment(this.$comm.getToday())
        .format('YYYY-MM-DD');

      if (this.popupParam.eduQuestionNo === 0) {
        this.updateMode = false;
        this.insertMode = true;
        this.eduMaster.createUserNm = this.$store.getters.name;
      } else {
        this.eduMaster.eduQuestionNo = this.popupParam.eduQuestionNo;
        this.getDetail();
        this.updateMode = true;
        this.insertMode = false;
      }
    },

    getDetail() {
      this.$http.url = this.$format(
        selectConfig.saf.education.eduQuestion.get.url,
        this.eduMaster.eduQuestionNo
      );
      this.$http.type = 'GET';
      this.$http.param = [];
      this.$http.request(
        (_result) => {
          this.eduMaster = this.$_.clone(_result.data);
          this.eduMaster.safEduCourseNo = Number(_result.data.safEduCourseNo);

          this.updateMode = true;
          this.getQuestionList(this.eduMaster.eduQuestionNo);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', 'M0000000016');
          // 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.
        }
      );
    },

    getQuestionList(eduQuestionNo) {
      this.$http.url = this.$format(
        selectConfig.saf.education.eduQuestion.items.url,
        eduQuestionNo
      );
      this.$http.type = 'GET';
      this.$http.param = [];
      this.$http.request(
        (_result) => {
          this.questions = this.$_.clone(_result.data);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', 'M0000000016');
          // 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.
        }
      );
    },
    closePopup(data) {
      this.$emit('closePopup');
    },
    // 추가
    btnAddAnswer(index) {
      if (this.questions[index].eduQuestionAnswers.length >= 5) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // 안내
          message: 'M0000000276', // 최대 5개의 답안까지 추가가 가능 합니다.
          type: 'warning', // success / info / warning / error
        });
        return;
      }
      this.questions[index].eduQuestionAnswers.push({
        eduQuestionAnsNo: this.$comm.moment().format('mmSS') + index,
        correctYn: 'N',
        sortOrder: this.questions[index].eduQuestionAnswers.length + 1,
        answerContents: '',
      });
    },

    deleteEducation(eduQuestionLstNo) {
      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321', // 확인
        message: 'M0000000224', // 제거하시겠습니까?
        type: 'info',
        // 확인 callback 함수
        confirmCallback: () => {
          this.delQuestions.push(eduQuestionLstNo);
          this.questions = this.$_.clone(
            this.$_.reject(this.questions, {
              eduQuestionLstNo: eduQuestionLstNo,
            })
          );
        },
        cancelCallback: () => {},
      });
    },
    // 삭제
    btnDeleteAnswer(gridRef, index) {
      const yAuiGrid = this.$refs[gridRef][0];
      this.questions[index].selectedValue = yAuiGrid
        .getCheckedRowItems()
        .map((data) => data.item);

      this.$_.forEach(this.questions[index].selectedValue, (_item) => {
        this.delAnswers.push(_item.eduQuestionAnsNo);
      });

      yAuiGrid.removeCheckedRows();
      this.questions[index].eduQuestionAnswers = yAuiGrid.getGridData();
    },

    addQuestion() {
      this.questions.push({
        eduQuestionNo: '',
        questionContents: '',
        sortOrder: this.questions.length + 1,
        useYn: 'Y',
        status: 'INSERT',
        eduQuestionLstNo:
          this.$comm.moment().format('mmSS') + this.questions.length,
        eduQuestionAnswers: [],
      });
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
            codeNm: this.$comm.getLangSpecInfoLabel('L0000003394'),
          }); // 선택하세요

          this.$_.forEach(this.eduAttCdItems, (_item) => {
            _item.data = [];
            _item.data.push({
              rightAnswer: '',
              orderNo: 5,
              answer: '',
            });
          });
        },

        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', 'M0000000016');
          // 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.
        }
      );
    },

    getEduTypeCdItems() {
      this.$http.url = this.$format(
        selectConfig.codeMaster.getSelect.url,
        'SAF_EDU_COURSE'
      );
      this.$http.type = 'get';
      this.$http.request(
        (_result) => {
          this.eduTypeCdItems = this.$_.clone(_result.data);
          this.eduTypeCdItems.splice(0, 0, {
            code: null,
            codeNm: this.$comm.getLangSpecInfoLabel('L0000003394'), // 선택하세요
          });
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', 'M0000000016');
          // 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.
        }
      );
    },
    getEduCourseItems() {
      this.$http.url = selectConfig.saf.education.eduCourse.list.url;
      this.$http.type = 'GET';
      this.$http.param = {
        useYn: 'Y',
        eduAttCd: this.eduMaster.eduAttCd,
        eduTypeCd: this.eduMaster.eduTypeCd,
        plantCd: this.eduMaster.plantCd,
      };
      this.$http.request(
        (_result) => {
          this.eduCourseItems = this.$_.clone(_result.data);
          this.eduCourseItems.splice(0, 0, {
            safEduCourseNo: null,
            eduCourseNm: this.$comm.getLangSpecInfoLabel('L0000003394'), // 선택하세요
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
          window.getApp.$emit('APP_REQUEST_ERROR', 'M0000000016');
          // 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.
        }
      );
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

    beforeInsert() {
      this.eduMaster.questions = this.questions;

      let questionLength = this.questions.length;
      var sum = 0;
      var isSave = true;
      var isCheck = false;
      for (let i = 0; i < questionLength; i++) {
        let answerLength = this.questions[i].eduQuestionAnswers.length;
        if (answerLength <= 0) {
          isSave = false;
        }
        let check = 0;
        for (let j = 0; j < answerLength; j++) {
          if (this.questions[i].eduQuestionAnswers[j].correctYn === 'Y') {
            sum = sum + 1;
            check = check + 1;
            if (isCheck > 1) {
              isCheck = true;
            }
          }
        }
      }
      if (!isSave) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // 안내
          message: 'M0000000278', // 문제의 답안이 등록되지 않았습니다 확인 후 시도 해주세요.
          type: 'warning', // success / info / warning / error
        });
        return;
      }
      if (sum !== questionLength || isCheck) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // 안내
          message: 'M0000000277', // 문제별 정답이 1개 이상이거나 등록되지 않았습니다.
          type: 'warning', // success / info / warning / error
        });
        return;
      }

      this.$validator
        .validateAll()
        .then((_result) => {
          if (_result) {
            window.getApp.$emit('CONFIRM', {
              title: 'L0000003321', // 확인
              message: 'M0000000011', // 저장하시겠습니까
              type: 'info',
              confirmCallback: () => {
                this.eduMaster.createUserId = this.$store.getters.token;
                this.isInsert = true;
              },
            });
          } else {
            this.$popupRequired.check(
              'eduPlanExamAdd',
              this.$data,
              this.errors
            );
          }
        })
        .catch(() => {
          window.getApp.$emit('APP_VALID_ERROR', 'M0000000876');
          // M0000000876
        });
    },

    beforeEdit() {
      this.eduMaster.questions = this.questions;

      let questionLength = this.questions.length;
      var sum = 0;
      var isSave = true;
      var isCheck = false;
      for (let i = 0; i < questionLength; i++) {
        let answerLength = this.questions[i].eduQuestionAnswers.length;
        if (answerLength <= 0) {
          isSave = false;
        }
        let check = 0;
        for (let j = 0; j < answerLength; j++) {
          if (this.questions[i].eduQuestionAnswers[j].correctYn === 'Y') {
            sum = sum + 1;
            check = check + 1;
            if (isCheck > 1) {
              isCheck = true;
            }
          }
        }
      }
      if (!isSave) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // 안내
          message: 'M0000000278', // 문제의 답안이 등록되지 않았습니다 확인 후 시도 해주세요.
          type: 'warning', // success / info / warning / error
        });
        return;
      }
      if (sum !== questionLength || isCheck) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // 안내
          message: 'M0000000277', // 문제별 정답이 1개 이상이거나 등록되지 않았습니다.
          type: 'warning', // success / info / warning / error
        });
        return;
      }

      this.$validator
        .validateAll()
        .then((_result) => {
          if (_result) {
            window.getApp.$emit('CONFIRM', {
              title: 'L0000003321', // 확인
              message: 'M0000000011', // 저장하시겠습니까
              type: 'info',
              confirmCallback: () => {
                this.eduMaster.updateUserId = this.$store.getters.token;
                this.eduMaster.delAnswer = this.delAnswers;
                this.eduMaster.delQuestion = this.delQuestions;

                this.isEdit = true;
              },
            });
          } else if (!_result) {
            this.$popupRequired.check(
              'eduPlanExamAdd',
              this.$data,
              this.errors
            );
          }
        })
        .catch(() => {
          window.getApp.$emit('APP_VALID_ERROR', 'M0000000004');
          // 유효성 검사 중 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.
        });
    },
    btnDeleteClickedCallback(_result) {
      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321', // 확인
        message: 'M0000000012', // 삭제하시겠습니까?
        type: 'info',
        // 확인 callback 함수
        confirmCallback: () => {
          this.$http.url = this.$format(
            this.deleteUrl,
            this.eduMaster.eduQuestionNo
          );
          this.$http.type = 'DELETE';
          this.$http.request(
            (_result) => {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395', // 안내
                message: 'M0000000007', // 삭제되었습니다.
                type: 'success',
              });
              this.closePopup();
            },
            (_error) => {
              window.getApp.$emit('APP_REQUEST_ERROR', 'M0000000016');
              // M0000000016
            }
          );
        },
        // 취소 callback 함수
        cancelCallback: () => {},
      });
    },

    btnClickedErrorCallback(_result) {
      this.isInsert = false;
      this.isEdit = false;
      window.getApp.emit('APP_REQUEST_ERROR', _result);
    },

    // 신규등록
    btnInsertClickedCallback(_result) {
      this.eduMaster.eduQuestionNo = this.$_.clone(_result.data);
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // 안내
        message: 'M0000000006', // 저장되었습니다.
        type: 'success',
      });
      this.updateMode = true;
      this.insertMode = false;
      this.isInsert = false;
      this.getDetail();
    },
    // 수정
    btnEditClickedCallback(_result) {
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // 안내
        message: 'M0000000006', // 저장되었습니다.
        type: 'success', // success / info / warning / error
      });

      this.updateMode = true;
      this.insertMode = false;
      this.isEdit = false;
      this.getDetail();
    },

    folder() {
      if (this.folderFlag === 'Y') {
        this.folderFlag = 'N';
        this.folderTitle = 'L0000001021'; // 모두접기
        this.activeName = [];

        this.$_.forEach(this.questions, (_item) => {
          this.activeName.push(_item.eduQuestionLstNo);
        });
      } else {
        this.folderFlag = 'Y';
        this.folderTitle = 'L0000003043'; // 펼쳐보기
        this.activeName = [];
      }
    },
    gridResize(data) {
      let activeNums = data;

      activeNums.forEach((num) => {
        let idx = this.questions.findIndex(
          (item) => String(item.eduQuestionLstNo) === String(num)
        );

        const auiGrid = this.$refs['yAuiGrid_' + idx][0];
        auiGrid.resize();
      });
    },
    cellEditHandler(gridRef, idx) {
      const yAuiGrid = this.$refs[gridRef][0];
      this.questions[idx].eduQuestionAnswers = yAuiGrid.getGridData();
    },
  },
};
</script>
