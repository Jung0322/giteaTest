<!--
  목적 : 교육 과정 등록/수정
  작성자 : kdk
  Detail : 교육 과정 등록/수정
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <b-row>
      <!-- 교육 자료 상세 -->
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- 교육마스터 상세 -->
            <y-label
              label="L0000005374"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 저장 -->
              <y-btn
                v-if="!updateMode && editable"
                :action-url="insertUrl"
                :param="safEduCourse"
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
                v-if="updateMode && editable"
                :action-url="editUrl"
                :param="safEduCourse"
                :is-submit="isEdit"
                title="L0000002474"
                color="orange"
                action-type="PUT"
                beforeSubmit="beforeEdit"
                @beforeEdit="beforeEdit"
                @btnClicked="btnEditClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!-- 닫기 -->
              <y-btn title="L0000000881" @btnClicked="closePopup" />
            </div>
          </b-col>
        </b-row>
        <b-card>
          <b-row>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 사업장 -->
              <y-plant
                :width="8"
                ui="bootstrap"
                label="L0000001415"
                name="plantCd"
                v-model="safEduCourse.plantCd"
                :disabled="updateMode"
                :required="true"
                v-validate="'required'"
                :state="validateState('plantCd')"
              ></y-plant>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 교육대분류 -->
              <y-select
                :width="8"
                :editable="editable"
                :comboItems="eduAttCdItems"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                label="L0000000644"
                name="eduAttCd"
                v-model="safEduCourse.eduAttCd"
                :disabled="updateMode"
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
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                label="L0000000659"
                name="eduAttCd"
                v-model="safEduCourse.eduTypeCd"
                :disabled="updateMode"
                :required="true"
                v-validate="'required'"
                :state="validateState('eduAttCd')"
              ></y-select>
            </b-col>

            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 교육명 -->
              <y-text
                :width="8"
                :editable="editable"
                ui="bootstrap"
                name="eduCourseNm"
                label="L0000000653"
                :maxlength="60"
                v-model="safEduCourse.eduCourseNm"
                :required="true"
                :disabled="updateMode"
                v-validate="'required'"
                :state="validateState('eduCourseNm')"
              />
            </b-col>

            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 법정교육여부 -->
              <y-switch
                :width="8"
                :editable="editable"
                true-value="Y"
                false-value="N"
                ui="bootstrap"
                label="L0000001214"
                name="lawYn"
                selectText="L0000003213"
                unselectText="L0000001065"
                v-model="safEduCourse.lawYn"
              ></y-switch>
            </b-col>

            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 교육이수시간 -->
              <y-number
                :width="8"
                :editable="editable"
                ui="bootstrap"
                name="lawEduTm"
                label="L0000000667"
                :maxlength="2"
                v-model="safEduCourse.lawEduTm"
                :required="true"
                v-validate="'required'"
                :state="validateState('lawEduTm')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 학습목표 -->
              <y-textarea
                :width="8"
                :editable="editable"
                ui="bootstrap"
                label="L0000003167"
                name="studyTgt"
                v-model="safEduCourse.studyTgt"
                :required="true"
                :maxlength="200"
                v-validate="'required'"
                :state="validateState('studyTgt')"
              ></y-textarea>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 주요학습내용 -->
              <y-textarea
                :width="8"
                :editable="editable"
                ui="bootstrap"
                label="L0000002720"
                name="studyContents"
                v-model="safEduCourse.studyContents"
                :required="true"
                :maxlength="200"
                v-validate="'required'"
                :state="validateState('studyContents')"
              ></y-textarea>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 관련법규 -->
              <y-select
                :width="8"
                :comboItems="isTypeItems"
                :editable="editable"
                :required="true"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                name="isTypeCd"
                label="L0000000568"
                v-model="safEduCourse.isTypeCd"
                v-validate="'required'"
                :state="validateState('isTypeCd')"
              />
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
                v-model="safEduCourse.useYn"
              ></y-switch>
            </b-col>
          </b-row>
        </b-card>
        <!-- <b-row class="mt-3" v-if="!popupParam.multiple">
          <b-col sm="12">
            <b-row>
              <b-col sm="12">
                <div
                  slot="buttonGroup"
                  class="float-right mb-1"
                  v-if="updateMode && editable"
                >
                   교육대상자 추가 
                  <y-btn
                    title="L0000000651"
                    color="orange"
                    @btnClicked="btnAddClicked()"
                  />
                   교육대상자 제외 
                  <y-btn
                    title="L0000000650"
                    color="orange"
                    @btnClicked="btnRemoveClicked()"
                  />
                </div>
                 교육대상자 목록 
                <y-data-table
                  label="L0000000648"
                  ref="dataTable"
                  :editable="editable"
                  :height="gridOptions.height"
                  :headers="gridOptions.header"
                  :items="gridOptions.data"
                  :useRownum="false"
                  :messageCheck="!(updateMode && editable)"
                  :message="gridMessage"
                  v-model="gridOptions.selectedValue"
                  @inputChange="inputChange"
                  :popMode="true"
                >
                  <el-table-column
                    :selectable="selectable"
                    type="selection"
                    slot="selection"
                    align="center"
                    width="55"
                  ></el-table-column>
                </y-data-table>
              </b-col>
            </b-row>
          </b-col>
        </b-row> -->
        <b-row class="grid-height grid-box" v-if="!popupParam.multiple">
          <b-col sm="12" class="h100p">
            <y-auigrid
              ref="yAuiGrid"
              :editable="true"
              :name="gridOptions.name"
              :headers="gridOptions.header"
              :btns="gridOptions.btns"
              :height="gridOptions.height"
              :label="this.$comm.getLangSpecInfoLabel('L0000000648')"
              :useExcelExport="false"
              :enableCellMerge="true"
              :enableSorting="true"
              :showGridSetSave="true"
              :useContextMenu="true"
              :showRowCheckColumn="true"
              :enableRightDownFocus="true"
              :showGridCtrl="true"  
              @btnAddClicked="btnAddClicked"
              @btnRemoveClicked="btnRemoveClicked"
            />
          </b-col>
        </b-row>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
export default {
  /** attributes: name, components, props, data **/
  name: 'eduCourseDetail',
  props: {
    popupParam: {
      type: Object,
      default: {
        safEduCourseNo: 0,
        // sk e&s
        multiple: false,
        copyDataKey: 0, // 점검결과 복사등록인지 판단
      },
    },
  },
  data: () => ({
    component: null,

    safEduCourse: {
      safEduCourseNo: 0,
      eduAttCd: null,
      eduTypeCd: null,
      eduCourseNm: null,
      eduCost: null,
      lawYn: null,
      lawPerdCd: null,
      lawEduTm: 0,
      eduObject: null,
      dftEduTm: 0,
      eduDayNum: 0,
      studyTgt: null,
      studyContents: null,
      useYn: 'Y',
      sortOrder: 0,
      plantCd: null,
      createUserId: null,
      createDt: null,
      updateUserId: null,
      updateDt: null,
      isTypeCd: null,
    },

    gridOptions: {
      name: 'eduCourseDetail',
      btns: [],
      header: [],
      data: [],
      height: '490',
      selectedValue: [],
    },
    YAuiGrid: null,
    gridMessage: 'M0000000264', // 교육과정 등록 후 교육대상자를 추가할 수 있습니다.
    editable: true,
    insertMode: false,
    updateMode: false,
    compleMode: false,
    eduTypeCdItems: [],
    eduAttCdItems: [],
    eduCourseItems: [],
    eduGrpItems: [],
    eduStdItems: [],
    preEduItems: [],
    electTitleItems: [],
    isTypeItems: [],

    grpUseYn: [],
    getUrl: '',
    isInsert: false,
    isEdit: false,
    gridIndex: 0,
    editUrl: '',
    insertUrl: '',
    // 첨부 파일
  }),
  watch: {
    // eduStdItems: function (newValue, oldValue) {
    //   this.setHeader();
    // },
    // preEduItems: function (newValue, oldValue) {
    //   this.setHeader();
    // },
    // eduGrpItems: function (newValue, oldValue) {
    //   this.setHeader();
    // },
    'safEduCourse.plantCd': function (newValue, oldValue) {
      this.getTableComboInit();
    },
  },
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;
  },
  beforeDestroy() {},
  /** methods **/
  methods: {
    /** 초기화 관련 함수 **/
    init() {
      this.editable = this.$route.meta.editable;

      this.grpUseYn = [
        { code: 'Y', codeNm: this.$comm.getLangSpecInfoLabel('L0000001440') }, // 사용
        { code: 'N', codeNm: this.$comm.getLangSpecInfoLabel('L0000001063') }, // 사용
      ];
      // URL 셋팅
      this.getUrl = selectConfig.saf.education.eduCourse.get.url;
      this.editUrl = transactionConfig.saf.education.eduCourse.edit.url;
      this.insertUrl = transactionConfig.saf.education.eduCourse.insert.url;

      const promise1 = this.getEduAttCdItems();
      const promise2 =  this.getEduCourseItems();
      const promise3 =  this.getEduTypeCdItems();
      const promise4 =  this.getTableComboInit();
      Promise.all([promise1, promise2, promise3, promise4]).then(() => {      
        this.setHeader().then(() => {
          if (
            this.popupParam.safEduCourseNo === 0 &&
            !this.popupParam.copyDataKey
          ) {
            this.updateMode = false;
            this.insertMode = true;
            this.safEduCourse.createUserNm = this.$store.getters.name;

            // 수정일때
          } else {
            this.getDetail();

            if (!this.popupParam.copyDataKey) {
              if (this.popupParam.multiple) {
                this.updateMode = false;
                this.insertMode = false;
                this.editable = false;
              } else {
                this.updateMode = true;
                this.insertMode = false;
              }
            } else {
              this.updateMode = false;
              this.insertMode = true;
              this.safEduCourse.createUserNm = this.$store.getters.name;
            }
          }
        })
      });
      // this.getEduAttCdItems();
      // this.getEduCourseItems();
      // this.getEduTypeCdItems();
      // this.getTableComboInit();
      
      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000651'),
          color: 'orange',
          btnClicked: 'btnAddClicked',
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000650'),
          color: 'red',
          btnClicked: 'btnRemoveClicked',
        },
      ]
      // 구분(상반기/하반기)
      this.$comm.getComboItems('MGT_LAW_CLASS', true).then((_result) => {
        this.isTypeItems = this.$_.clone(_result);
      });

      // 신규등록일때
      
    },

    /** 신규등록 하기전 UI단 유효성 검사 **/
    beforeInsert() {
      this.checkDuplicate();
      if (!this.isInsert) return;
      if (!this.checkValid()) return;
      this.updateMode = false;
    },

    // 동일한 교육대상자그룹 체크
    inputChange(changeData) {
      if (changeData.name === 'safElectTitlNo') {
        // if (
        //   changeData.row.safElectTitlNo != null &&
        //   changeData.row.eduGrpNo != null
        // ) {
        //   changeData.row.eduGrpNo = null;
        // }
        for (let i = 0; i < this.gridOptions.data.length; i++) {
          if (
            changeData.index !== i &&
            changeData.row.safElectTitlNo ===
              this.gridOptions.data[i].safElectTitlNo
          ) {
            window.getApp.$emit('ALERT', {
              title: 'L0000003395', // 안내
              message: 'M0000000265', // 동일한 법규/선임이 등록되어 있습니다.
              type: 'warning', // success / info / warning / error
            });
            this.gridOptions.data[changeData.index].safElectTitlNo = null;
          }
        }
      } else if (changeData.name === 'eduGrpNo') {
        // if (
        //   changeData.row.eduGrpNo != null &&
        //   changeData.row.safElectTitlNo != null
        // ) {
        //   changeData.row.safElectTitlNo = null;
        // }

        for (let i = 0; i < this.gridOptions.data.length; i++) {
          if (
            changeData.index !== i &&
            changeData.row.eduGrpNo === this.gridOptions.data[i].eduGrpNo
          ) {
            window.getApp.$emit('ALERT', {
              title: 'L0000003395', // 안내
              message: 'M0000000266', // 동일한 교육대상자그룹이 등록되어 있습니다.
              type: 'warning', // success / info / warning / error
            });
            this.gridOptions.data[changeData.index].eduGrpNo = null;
          }
        }
      }
    },

    beforeEdit() {
      if (!this.checkValid()) return;

      this.$validator
        .validateAll()
        .then((_result) => {
          if (_result) {
            window.getApp.$emit('CONFIRM', {
              title: 'L0000003321', // 확인
              message: 'M0000000060', // 수정하시겠습니까?
              type: 'info',
              confirmCallback: () => {
                this.safEduCourse.updateUserId = this.$store.getters.token;
                this.isEdit = true;
              },
            });
          } else if (!_result) {
            this.$popupRequired.check(
              'eduCourseDetail',
              this.$data,
              this.errors
            );
          }
        })
        .catch(() => {
          window.getApp.$emit('APP_VALID_ERROR', 'M0000000876');
          // 위험 Matrix 정보를 생성해 주세요.
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

    checkValid() {
      for (let i = 0; i < this.gridOptions.data.length; i++) {
        if (
          this.gridOptions.data[i].eduGrpNo === null &&
          this.gridOptions.data[i].safElectTitlNo === null
        ) {
          window.getApp.$emit('ALERT', {
            title: 'L0000003395', // 안내
            message: 'M0000000267', // 법규/선임 또는 교육대상자그룹을 선택하세요.
            type: 'warning', // success / info / warning / error
          });
          return false;
        }

        if (
          this.gridOptions.data[i].eduComStd === null ||
          this.gridOptions.data[i].eduComStd === ''
        ) {
          window.getApp.$emit('ALERT', {
            title: 'L0000003395', // 안내
            message: 'M0000000268', // 교육이수기준을 선택하세요.
            type: 'warning', // success / info / warning / error
          });
          return false;
        }
      }

      if (this.safEduCourse.lawEduTm === '') {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // 안내
          message: 'M0000000261', // 교육이수시간을 입력해주세요.
          type: 'warning', // success / info / warning / error
        });
        return false;
      }

      if (Number(this.safEduCourse.lawEduTm) <= 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // 안내
          message: 'M0000000269', // 교육이수시간은 0시간 이상 되어야 합니다.
          type: 'warning', // success / info / warning / error
        });
        return false;
      }

      return true;
    },

    checkDuplicate() {
      var test = {
        eduCourseNm: this.safEduCourse.eduCourseNm,
        eduAttCd: this.safEduCourse.eduAttCd,
        eduTypeCd: this.safEduCourse.eduTypeCd,
        plantCd: this.safEduCourse.plantCd,
      };

      this.$http.url = this.$format(
        selectConfig.saf.education.eduCourse.check.url,
        test.eduCourseNm,
        test.eduAttCd,
        test.eduTypeCd,
        test.plantCd
      );
      this.$http.type = 'GET';
      this.$http.request((_result) => {
        if (_result.data > 0) {
          window.getApp.$emit('ALERT', {
            title: 'L0000003395', // 안내
            message: 'M0000000270', // 이미 같은 분류의 과정명이 존재합니다.
            type: 'warning',
          });
          // this.updateMode = true;
          return;
        }

        this.$validator
          .validateAll()
          .then((_result) => {
            if (_result) {
              window.getApp.$emit('CONFIRM', {
                title: 'L0000003321', // 확인
                message: 'M0000000011', // 저장하시겠습니까?
                type: 'info',
                confirmCallback: () => {
                  this.safEduCourse.safEduCourseNo = '';
                  this.updateMode = false;
                  this.safEduCourse.createUserId = this.$store.getters.token;
                  this.isInsert = true;
                },
              });
            } else if (!_result) {
              this.$popupRequired.check(
                'eduCourseDetail',
                this.$data,
                this.errors
              );
            }
          })
          .catch(() => {
            window.getApp.$emit('APP_VALID_ERROR', 'M0000000876');
            // 위험 Matrix 정보를 생성해 주세요.
          });
      });
    },

    setHeader() {
      return new Promise(resovle => {
        this.gridOptions.header = [
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000005162'), 
            dataField: 'safElectTitlNo', 
            width: '15%', 
            renderer: {
              type: 'DropDownListRenderer',
              listFunction: (rowIndex, columnIndex, item, dataField) => {
                return this.electTitleItems;
              },
              keyField: 'code',
              valueField: 'codeNm',

            },
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000000647'), 
            dataField: 'eduGrpNo', 
            width: '15%', 
            renderer: {
              type: 'DropDownListRenderer',
              listFunction: (rowIndex, columnIndex, item, dataField) => {
                return this.eduGrpItems;
              },
              keyField: 'eduGrpNo',
              valueField: 'grpNm',

            },
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000005352'),        
            children: [
              {
                headerText: this.$comm.getLangSpecInfoLabel('L0000005349'), 
                dataField: 'eduComYn', 
                width: '10%', 
                renderer: {
                  type: "CheckBoxEditRenderer",
                  editable: true, // 체크박스 편집 활성화 여부(기본값 : false)
                  checkValue: 'Y', // true, false 인 경우가 기본
                  unCheckValue: 'N',
                }
              },
              {
                headerText: this.$comm.getLangSpecInfoLabel('L0000000785'), 
                dataField: 'eduComStd', 
                width: '10%', 
                renderer: {
                  type: 'DropDownListRenderer',
                  listFunction: (rowIndex, columnIndex, item, dataField) => {
                    return this.eduStdItems;
                  },
                  keyField: 'code',
                  valueField: 'codeNm',

                },
              },
              {
                headerText: this.$comm.getLangSpecInfoLabel('L0000001488'), 
                dataField: 'preEduCd', 
                width: '10%', 
                renderer: {
                  type: 'DropDownListRenderer',
                  listFunction: (rowIndex, columnIndex, item, dataField) => {
                    return this.preEduItems;
                  },
                  keyField: 'safEduCourseNo',
                  valueField: 'eduCourseNm',

                },
              },
              {
                headerText: this.$comm.getLangSpecInfoLabel('L0000000797'), 
                dataField: 'eduComPer', 
                width: '10%', 
              },
              {
                headerText: this.$comm.getLangSpecInfoLabel('L0000001068'), 
                dataField: 'eduRepeatYn', 
                width: '10%', 
                renderer: {
                  type: "CheckBoxEditRenderer",
                  editable: true, // 체크박스 편집 활성화 여부(기본값 : false)
                  checkValue: 'Y', // true, false 인 경우가 기본
                  unCheckValue: 'N',
                }
              },
            ],
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000000679'), 
            dataField: 'docKeepPer', 
            width: '10%', 
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000003215'), 
            dataField: 'lawDesk', 
            width: '10%', 
          },        
        ];
        resovle();
      });
      
    },

    getDetail(data) {
      if (
        this.popupParam.safEduCourseNo === 0 &&
        !this.popupParam.copyDataKey
      ) {
        return;
      }

      // 복사등록인 경우 교육과정상세 데이터를 복사대상의 정보를 가져오도록 한다.
      if (this.popupParam.copyDataKey) {
        this.$http.url = this.$format(
          selectConfig.saf.education.eduCourse.get.url,
          this.popupParam.copyDataKey
        );

        // 복사등록 대상이 없는 경우 기존 상세 로직으로
      } else {
        this.$http.url = this.$format(
          selectConfig.saf.education.eduCourse.get.url,
          this.popupParam.safEduCourseNo
        );
      }

      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.updateMode = true;
          this.safEduCourse = this.$_.clone(_result.data);

          /**
           * 2022.05.23 장헌영
           * 복사등록인 경우 해당 사항 없으므로 확인후 처리
           */
          if (!this.popupParam.copyDataKey) {
            /**
             * 22.02.15 LHJ
             * 생성된 교육과정을 사용하여 교육계획을 등록하였을 경우 해당 교육과정 수정 불가능 하도록 권한 처리
             */
            if (this.safEduCourse.planCnt > 0) {
              this.editable = false;
            }

            // 복사등록인 경우 등록을 먼저 처리해야하므로 최초 등록시와 동일하게 변수 셋팅
          } else {
            this.updateMode = false;
            this.safEduCourse.safEduCourseNo = 0;
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', 'M0000000016');
          // 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.
        }
      );

      // 복사등록인 경우 교육과정상세만 불러온다.
      if (!this.popupParam.copyDataKey) {
        this.$http.url = this.$format(
          selectConfig.saf.education.eduCourseGrp.get.url,
          this.popupParam.safEduCourseNo
        );
        this.$http.type = 'GET';
        this.$http.request(
          (_result) => {
            this.gridOptions.data = this.$_.clone(_result.data);
            this.YAuiGrid.setGridData(this.$_.clone(_result.data))
          },
          (_error) => {
            window.getApp.$emit('APP_REQUEST_ERROR', 'M0000000016');
            // 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.
          }
        );
      }
    },

    getEduAttCdItems() {
      return new Promise((resolve, reject) => {
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
            resolve();
          },
          (_error) => {
            window.getApp.$emit('APP_REQUEST_ERROR', 'M0000000016');
            reject(_error);
          // 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.
          }
        );
      })
    },

    getEduTypeCdItems() {
      return new Promise((resolve, reject) => {
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
              codeNm: this.$comm.getLangSpecInfoLabel('L0000002519'), // 전체
            });
            resolve();
          },
          (_error) => {
            window.getApp.$emit('APP_REQUEST_ERROR', 'M0000000016');
            reject(_error)
          // 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.
          }
        );
      })
    },

    getEduCourseItems() {
      return new Promise((resolve, reject) => {
        this.$http.url = selectConfig.saf.education.eduCourse.list.url;
        this.$http.type = 'GET';
        this.$http.param = {
          useYn: 'Y',
          eduAttCd: this.safEduCourse.eduAttCd,
        };
        this.$http.request(
          (_result) => {
            this.eduCourseItems = this.$_.clone(_result.data);
            this.eduCourseItems.splice(0, 0, {
              safEduCourseNo: null,
              eduCourseNm: this.$comm.getLangSpecInfoLabel('L0000003394'), // 선택하세요
            });
            if (
              this.safEduCourse.safEduCourseNo &&
            this.$_.indexOf(
              this.$_.map(this.eduCourseItems, 'safEduCourseNo'),
              this.safEduCourse.safEduCourseNo
            ) === -1
            ) {
              this.eduMaterial.safEduCourseNo = null;
            }
            resolve();
          },
          (_error) => {
            window.getApp.$emit('APP_REQUEST_ERROR', 'M0000000016');
            reject(_error);
          // 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.
          }
        );
      })
    },

    getTableComboInit() {
      // 교육대상자그룹 콤보
      return new Promise((resolve, reject) => {
        this.$http.url = this.$format(
          selectConfig.saf.education.combo.eduGrplist.url,
          this.safEduCourse.plantCd
        );
        this.$http.type = 'GET';
        this.$http.request(
          (_result) => {
            this.eduGrpItems = this.$_.clone(_result.data);
            this.eduGrpItems.splice(0, 0, {
              eduGrpNo: null,
              grpNm: this.$comm.getLangSpecInfoLabel('L0000003394'), // 선택하세요
            });
          },
          (_error) => {
            window.getApp.$emit('APP_REQUEST_ERROR', 'M0000000016');
          // 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.
          }
        );
        // 교육이수기한(기준) 콤보
        this.$http.url = this.$format(
          selectConfig.codeMaster.getSelect.url,
          'EDU_COM_STD'
        );
        this.$http.type = 'get';
        this.$http.request(
          (_result) => {
            this.eduStdItems = this.$_.clone(_result.data);
            this.eduStdItems.splice(0, 0, {
              code: null,
              codeNm: this.$comm.getLangSpecInfoLabel('L0000003394'), // 선택하세요
            });
          },
          (_error) => {
            window.getApp.$emit('APP_REQUEST_ERROR', 'M0000000016');
          // 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.
          }
        );

        // 교육이수기한(사전필수교육) 콤보
        this.$http.url = selectConfig.saf.education.combo.preEdulist.url;
        this.$http.type = 'GET';
        this.$http.request(
          (_result) => {
            this.preEduItems = this.$_.clone(_result.data);
            this.preEduItems.splice(0, 0, {
              safEduCourseNo: null,
              eduCourseNm: this.$comm.getLangSpecInfoLabel('L0000003636'), // 없
            });
          },
          (_error) => {
            window.getApp.$emit('APP_REQUEST_ERROR', 'M0000000016');
          // 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.
          }
        );

        // 법규/선입 콤보
        this.$http.url = selectConfig.saf.electTitle.list.url;
        this.$http.type = 'GET';
        this.$http.param = {
          electAttCd: null,
          refLawCd: null,
          useYn: 'Y',
        };
        this.$http.request(
          (_result) => {
            this.electTitleItems = _result.data;
            this.electTitleItems.splice(0, 0, {
              code: null,
              codeNm: this.$comm.getLangSpecInfoLabel('L0000003394'), // 선택하세요
            });

          // _result.data.forEach((item) => {
          //   this.electTitleItems.splice(0, 0, {
          //     code: item.safElectTitlNo,
          //     codeNm:
          //       item.electTitlNm +
          //       '(' +
          //       item.electAttNm +
          //       '/' +
          //       item.refLawNm +
          //       ')',
          //   });
          // });
          },
          (_error) => {
            window.getApp.$emit('APP_REQUEST_ERROR', _error);
          }
        );
        resolve();
      })
    },

    btnAddClicked() {
      this.gridIndex = this.gridIndex + 1;
      let row = {
        safElectTitlNo: null,
        eduGrpNo: null,
        eduComYn: 'Y',
        eduComStd: null,
        preEduCd: null,
        eduPeroid: '',
        dockeepPeriod: '',
        lawDesk: '',
        useYn: 'Y',
        gridIndex: this.gridIndex,
      };
      this.YAuiGrid.addRow(row, 'last');
    },

    btnRemoveClicked() {
      let checkingData = this.YAuiGrid.getCheckedRowItemsAll();
      if (
        !checkingData ||
        checkingData.length === 0
      ) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // 안내
          message: 'M0000000160', // 제외할 항목을 선택하세요.
          type: 'warning',
        });
        return;
      }
      let gridData = this.YAuiGrid.getGridData();
      this.$_.forEach(checkingData, (item) => {
        gridData = this.$_.reject(gridData, item);
      });

      this.YAuiGrid.setGridData(gridData)
    },

    saveGroup(type) {
      this.$http.url = this.$format(
        transactionConfig.saf.education.eduCourseGrp.edit.url,
        this.safEduCourse.safEduCourseNo
      );
      this.$http.param = this.YAuiGrid.getGridData();
      this.$http.type = 'POST';
      this.$http.request((_result) => {
        if (type === 'insert') {
          this.isInsert = false;
          this.updateMode = true;
          window.getApp.$emit('ALERT', {
            title: 'L0000003395', // 안내
            message: 'M0000000006', // 저장되었습니다.
            type: 'success',
          });

          // 복사등록일 경우 복사대상의 교육대상자 정보 조회후 셋팅
          if (this.popupParam.copyDataKey) {
            window.getApp.$emit('ALERT', {
              title: 'L0000003395', // 안내
              message: 'L0000005372', // 교육마스터 복사등록입니다. 선택하신 교육마스터의 교육대상자 목록을 조회합니다.
              type: 'success',
            });

            this.$http.url = this.$format(
              selectConfig.saf.education.eduCourseGrp.get.url,
              this.popupParam.copyDataKey
            );
            this.$http.type = 'GET';
            this.$http.request(
              (_result) => {
                // 대상자들을 셋팅전 복사대상의 교육번호 연결된 부분을 삭제처리
                this.$_.forEach(_result.data, (item) => {
                  item.safEduCourseNo = 0;
                });
                // this.gridOptions.data = this.$_.clone(_result.data);
                this.YAuiGrid.setGridData = this.$_.clone(_result.data)

                // 교육대상자를 불러왔다면 복사대상의 pk 삭제처리
                delete this.popupParam.copyDataKey;
              },
              (_error) => {
                window.getApp.$emit('APP_REQUEST_ERROR', 'M0000000016');
                // 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.
              }
            );
          }
        } else {
          this.isEdit = false;
          window.getApp.$emit('ALERT', {
            title: 'L0000003395', // 안내
            message: 'M0000000836', // 수정되었습니다.
            type: 'success',
          });
        }
      });
    },

    // 탭
    loadComponent() {},

    beforeComple() {},

    closePopup() {
      this.$emit('closePopup');
    },
    /**
     * 버튼 에러 처리용 공통함수
     */
    btnClickedErrorCallback(_result) {
      this.isInsert = false;
      this.isEdit = false;
      window.getApp.$emit('APP_REQUEST_ERROR', 'M0000000016');
      // 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.
    },

    /** button 관련 이벤트 **/
    btnInsertClickedCallback(_result) {
      this.safEduCourse.safEduCourseNo = _result.data;
      this.saveGroup('insert');
    },

    btnEditClickedCallback(_result) {
      this.saveGroup('update');
    },
    selectable() {
      return this.editable;
    },
  },
};
</script>
