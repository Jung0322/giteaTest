<!--
  목적 : 안전 > 기준정보 > 선해임명관리
  작성자 : kdh
  Detail : 선해임명관리 상세/수정/등록
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <b-col sm="12">
      <b-row>
        <b-col sm="12" class="mt-3">
          <!-- 선해임명 상세 -->
          <y-label
            label="L0000001567"
            icon="user-edit"
            color-class="cutstom-title-color"
          />
          <div slot="buttonGroup" class="float-right mb-1">
            <!-- 저장 -->
            <y-btn
              v-if="editable && !updateMode"
              :action-url="insertUrl"
              :param="electTitle"
              :is-submit="isInsert"
              title="L0000002474"
              color="orange"
              action-type="POST"
              beforeSubmit="beforeInsert"
              @beforeInsert="beforeInsert"
              @btnClicked="btnInsertClickedCallback"
              @btnClickedErrorCallback="btnClickedErrorCallback"
            />
            <!-- 저장(수정모드) -->
            <y-btn
              v-if="updateMode && editable"
              :action-url="editUrl"
              :param="electTitle"
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
            <y-btn title="L0000000881" @btnClicked="btnClosePopup" />
          </div>
        </b-col>
      </b-row>
      <b-card>
        <b-row class="mt-3" ref="detailBox">
          <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
            <!-- 구분 -->
            <y-plant
              type="edit"
              :required="true"
              name="plantCd"
              v-model="electTitle.plantCd"
              v-validate="'required'"
              :state="validateState('plantCd')"
            >
            </y-plant>
          </b-col>
          <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
            <!-- 구분 -->
            <y-select
              :width="8"
              :required="true"
              :comboItems="electClsItems"
              itemText="codeNm"
              itemValue="code"
              ui="bootstrap"
              label="L0000000686"
              name="electClsCd"
              v-model="electTitle.electClsCd"
              v-validate="'required'"
              :state="validateState('electClsCd')"
            ></y-select>
          </b-col>
          <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
            <!-- 분야 -->
            <y-select
              :width="8"
              :required="true"
              :comboItems="electAttCdItems"
              itemText="codeNm"
              itemValue="code"
              ui="bootstrap"
              label="L0000001346"
              name="electAttCd"
              v-model="electTitle.electAttCd"
              v-validate="'required'"
              :state="validateState('electAttCd')"
            ></y-select>
          </b-col>
          <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
            <!-- 관련법령 -->
            <y-select
              :width="8"
              :required="true"
              :comboItems="refLawCdItems"
              itemText="codeNm"
              itemValue="code"
              ui="bootstrap"
              label="L0000000570"
              name="refLawCd"
              v-model="electTitle.refLawCd"
              v-validate="'required'"
              :state="validateState('refLawCd')"
            ></y-select>
          </b-col>
          <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
            <!-- 신고/선임 -->
            <y-select
              :width="8"
              :required="true"
              :comboItems="electTypeCdItems"
              itemText="codeNm"
              itemValue="code"
              ui="bootstrap"
              label="L0000001782"
              name="electTypeCd"
              v-model="electTitle.electTypeCd"
              v-validate="'required'"
              :state="validateState('electTypeCd')"
            ></y-select>
          </b-col>
          <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
            <!-- 선해임명 -->
            <y-text
              :width="10"
              :editable="editable"
              :required="true"
              :maxlength="30"
              ui="bootstrap"
              label="L0000001565"
              name="electTitlNm"
              v-model="electTitle.electTitlNm"
              v-validate="'required'"
              :state="validateState('electTitlNm')"
            ></y-text>
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
              name="radioValue"
              selectText="L0000001440"
              unselectText="L0000001063"
              v-model="electTitle.useYn"
            />
          </b-col>
          <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
            <!-- 정렬순서 -->
            <y-number
              :width="8"
              :editable="editable"
              :maxlength="5"
              :hasSeperator="false"
              :isPositive="true"
              ui="bootstrap"
              name="sortOrder"
              label="L0000002601"
              v-model="electTitle.sortOrder"
            ></y-number>
          </b-col>
          <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
            <!-- 선임기준 -->
            <y-textarea
              :width="10"
              :editable="editable"
              :required="true"
              :maxlength="1500"
              ui="bootstrap"
              label="L0000001556"
              name="electStndDesc"
              v-model="electTitle.electStndDesc"
              v-validate="'required'"
              :state="validateState('electStndDesc')"
            ></y-textarea>
          </b-col>
          <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
            <!-- 자격요건 -->
            <y-textarea
              :width="10"
              :editable="editable"
              :required="true"
              :maxlength="1000"
              ui="bootstrap"
              label="L0000002303"
              name="qualifiRequire"
              v-model="electTitle.qualifiRequire"
              v-validate="'required'"
              :state="validateState('qualifiRequire')"
            ></y-textarea>
          </b-col>
          <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
            <!-- 평가대상여부 -->
            <y-switch
              :width="8"
              :editable="editable"
              true-value="Y"
              false-value="N"
              ui="bootstrap"
              label="L0000005040"
              name="radioValue"
              selectText="L0000003427"
              unselectText="L0000003686"
              v-model="electTitle.evalTgtYn"
            />
          </b-col>
          <!-- <b-col sm="12">
            <b-col sm="12" class="px-0">
              <div slot="buttonGroup" class="float-right mb-1">
                 행 추가 
                <y-btn
                  v-if="editable"
                  title="L0000003224"
                  color="orange"
                  @btnClicked="btnAddItemCheck"
                />
                 행 삭제 
                <y-btn
                  v-if="editable"
                  title="L0000003223"
                  color="red"
                  @btnClicked="btnDeleteItemCheck"
                />
              </div>
               평가항목 목록 
              <y-data-table
                label="L0000003098"
                ref="dataTableCheck"
                :height="gridOptions.height"
                :headers="gridOptions.header"
                :items="gridOptions.data"
                :editable="editable"
                v-model="selectedValue"
              >
                <el-table-column
                  align="center"
                  type="selection"
                  slot="selection"
                  width="55"
                ></el-table-column>
              </y-data-table>
            </b-col>
          </b-col> -->
        </b-row>
        <b-row class="grid-height grid-box">
          <b-col sm="12" class="h100p">
            <y-auigrid
              ref="yAuiGrid"
              :editable="editable"
              :name="gridOptions.name"
              :headers="gridOptions.header"
              :btns="gridOptions.btns"
              :height="gridOptions.height"
              :label="this.$comm.getLangSpecInfoLabel('L0000003098')"
              :useExcelExport="false"
              :enableSorting="true"
              :showGridSetSave="true"
              :useContextMenu="true"
              :enableRightDownFocus="true"
              :softRemoveRowMode="false"
              :showGridCtrl="true"
              :showRowCheckColumn="true"
              :rowHeight="60"
              @btnAddRow="btnAddRow"
              @btnDelRow="btnDelRow"
              @cellDoubleClick="cellDoubleClick"
            />
          </b-col>
        </b-row>
      </b-card>
    </b-col>
    <div id="textAreaWrap">
      <textarea
        id="myTextArea"
        class="aui-grid-custom-renderer-ext"
        style="width: 100%; height: 90px"
      ></textarea>
      <ul class="nav_u" style="margin-top: 4px">
        <li>
          <button class="editor_btn" id="confirmBtn" v-on:click="btnConfirm">
            확인
          </button>
        </li>
        <li>
          <button class="editor_btn" id="cancelBtn" v-on:click="btnCancel">
            취소
          </button>
        </li>
      </ul>
    </div>
  </b-container>
</template>
<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
import { type } from 'case';
export default {
  name: 'y-elect-title-detail',
  props: {
    popupParam: {
      type: Object,
      default: {
        safElectTitlNo: 0,
        pageNm: '',
        noAccUseYn: false,
        noAccevalTgtYn: false,
      },
    },
  },
  data() {
    return {
      electTitle: {
        safElectTitlNo: 0,
        electClsCd: null,
        electAttCd: null,
        refLawCd: null,
        electTitlNm: '',
        lcnTypeCds: [],
        sortOrder: '',
        useYn: 'Y',
        evalTgtYn: 'Y',
        createUserId: '',
        updateUserId: '',
        qualifiRequire: '',
        electStndDesc: '',
        plantCd: '',
        electTitleItems: [], // 평가항목 리스트
        deleteElectTitleItems: [], // 삭제할 평가항목 리스트
      },
      gridOptions: {
        name: 'electHisDetail',
        btns: [],
        header: [],
        data: [],
        height: '350',
      },
      YAuiGrid: null,
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '90%',
        top: '10px',
        param: {},
        closeCallback: null,
      },
      editable: false,
      updateMode: false,
      searchUrl: '',
      detailUrl: '',
      checkUrl: '',
      insertUrl: '',
      editUrl: '',
      isInsert: false,
      isEdit: false,
      electClsSearchItems: [], // 구분 리스트 (검색)
      electClsItems: [], // 구분 리스트 (저장)
      electAttCdSearchItems: [], // 분야(검색)
      electAttCdItems: [], // 분야(저장)
      refLawCdItems: [], // 법규명(저장)
      lcnTypeCdItems: [], // 자격증 (저장)
      elecTypeCdItems: [], // 신고/선임
      electTypeCdItems: [],
      selectedValue: [],
      TypeFlag: false, // 평가항목 - 구분 유효성 Flag
      WorkFlag: false, // 평가항목 - 평가대상업무 유효성 Flag
    };
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
      this.electTitle.plantCd = this.$store.getters.plantCd;
      // URL 셋팅
      this.searchUrl = selectConfig.saf.electTitle.list.url;
      this.detailUrl = selectConfig.saf.electTitle.get.url;
      this.checkUrl = selectConfig.saf.electTitle.check.url;
      this.insertUrl = transactionConfig.saf.electTitle.insert.url;
      this.editUrl = transactionConfig.saf.electTitle.edit.url;
      this.editable = this.$route.meta.editable;

      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000686') + ' *',
          dataField: 'itemType',
          width: '20%',
          style: 'left-align',
          wrapText: true,
          renderer: {
            type: 'TemplateRenderer',
            maxlength: 200,
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000005047') + ' *',
          dataField: 'itemWork',
          width: '40%',
          style: 'left-align',
          wrapText: true,
          renderer: {
            type: 'TemplateRenderer',
            maxlength: 200,
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001360') + ' *',
          dataField: 'remark',
          width: '30%',
          style: 'left-align',
          wrapText: true,
          renderer: {
            type: 'TemplateRenderer',
            maxlength: 200,
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001457') + ' *',
          dataField: 'useYn',
          width: '10%',
          renderer: {
            type: 'CheckBoxEditRenderer',
            editable: true, // 체크박스 편집 활성화 여부(기본값 : false)
            checkValue: 'Y', // true, false 인 경우가 기본
            unCheckValue: 'N',
            checkableFunction: function (
              rowIndex,
              columnIndex,
              value,
              isChecked,
              item,
              dataField
            ) {
              if (value) {
                return true;
              }
            },
          },
        },
      ];
      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000003224'),
          color: 'orange',
          btnClicked: 'btnAddRow',
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000003223'),
          color: 'red',
          btnClicked: 'btnDelRow',
        },
      ];

      this.getComboItems('SAF_ELECT_CLS'); // 구분
      this.getComboItems('TASK_GRP'); // 분야
      this.getComboItems('MGT_LAW_CLASS'); // 법규명
      this.getComboItems('MGT_LCN_TYPE'); // 자격증
      this.getComboItems('MGT_ELECT_TYPE'); // 신고/선임/

      if (this.popupParam.safElectTitlNo !== 0) {
        this.getDetail();
      }
    },
    /**
     * 공통 마스터 정보 조회 (구분, 분야,  법규명, 자격증)
     * codeGroupCd : 마스터 테이블 codeGroupCd 정보
     */
    getComboItems(codeGroupCd) {
      this.$http.url = this.$format(
        selectConfig.codeMaster.getSelect.url,
        codeGroupCd
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          if (codeGroupCd === 'SAF_ELECT_CLS') {
            this.electClsSearchItems = this.$_.clone(_result.data);
            this.electClsSearchItems.splice(0, 0, {
              code: null,
              codeNm:
                this.$comm.getLangSpecInfoLabel('L0000002519') /* '전체' */,
            });
            this.electClsItems = this.$_.clone(_result.data);
            this.electClsItems.splice(0, 0, {
              code: null,
              codeNm:
                this.$comm.getLangSpecInfoLabel(
                  'L0000003394'
                ) /* '선택하세요' */,
            });
          } else if (codeGroupCd === 'TASK_GRP') {
            this.electAttCdSearchItems = this.$_.clone(_result.data);
            this.electAttCdSearchItems.splice(0, 0, {
              code: null,
              codeNm: '전체',
            });
            this.electAttCdItems = this.$_.clone(_result.data);
            this.electAttCdItems.splice(0, 0, {
              code: null,
              codeNm:
                this.$comm.getLangSpecInfoLabel(
                  'L0000003394'
                ) /* '선택하세요' */,
            });
          } else if (codeGroupCd === 'MGT_LAW_CLASS') {
            this.refLawCdItems = this.$_.clone(_result.data);
            this.refLawCdItems.splice(0, 0, {
              code: null,
              codeNm:
                this.$comm.getLangSpecInfoLabel(
                  'L0000003394'
                ) /* '선택하세요' */,
            });
          } else if (codeGroupCd === 'MGT_LCN_TYPE') {
            this.lcnTypeCdItems = this.$_.clone(_result.data);
          } else if (codeGroupCd === 'MGT_ELECT_TYPE') {
            this.electTypeCdItems = this.$_.clone(_result.data);
            this.electTypeCdItems.splice(0, 0, {
              code: null,
              codeNm:
                this.$comm.getLangSpecInfoLabel(
                  'L0000003394'
                ) /* '선택하세요' */,
            });
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    getDetail() {
      this.$http.url = this.$format(
        this.detailUrl,
        this.popupParam.safElectTitlNo
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.electTitle = this.$_.clone(_result.data);
          this.YAuiGrid.setGridData(this.electTitle.electTitleItems);
          // this.gridOptions.data = this.electTitle.electTitleItems;
          this.lcnTypeCds = [];
          if (
            this.electTitle.lcnTypeCds &&
            this.electTitle.lcnTypeCds.length > 0
          ) {
            this.$_.forEach(this.electTitle.lcnTypeCds, (item) => {
              this.lcnTypeCds.push({
                code: item,
                name: this.lcnTypeCdItems[
                  this.$_.findIndex(this.lcnTypeCdItems, { code: item })
                ].codeNm,
              });
            });
          }
          this.updateMode = true;
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
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
      this.checkValidator('insert');
    },
    beforeEdit() {
      this.checkValidator('edit');
    },
    checkValidator(flag) {
      this.$validator
        .validateAll()
        .then((_result) => {
          if (_result) {
            this.$http.url = this.checkUrl;
            this.$http.type = 'GET';
            this.$http.param = {
              electTitlNm: this.electTitle.electTitlNm,
              safElectTitlNo:
                flag === 'edit' ? this.electTitle.safElectTitlNo : '',
            };

            this.$_.forEach(this.YAuiGrid.getGridData(), (item) => {
              if (item.itemType === '') {
                this.TypeFlag = true;
                this.WorkFlag = false;
              } else if (item.itemWork === '') {
                this.WorkFlag = true;
                this.TypeFlag = false;
              }
            });
            if (this.TypeFlag === true) {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395' /* 안내 */,
                message: 'M0000001287' /* 구분을 입력해주세요.  */,
                type: 'warning',
              });
              this.TypeFlag = false;
            } else if (this.WorkFlag === true) {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395' /* 안내 */,
                message: 'L0000005071' /* 평가대상 업무를 입력해주세요.  */,
                type: 'warning',
              });
              this.WorkFlag = false;
            } else if (this.YAuiGrid.getGridData().length < 1) {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395' /* 안내 */,
                message:
                  'L0000005321' /* 평가항목을 한 건 이상 등록해주세요. */,
                type: 'warning', // success / info / warning / error
              });
            } else {
              this.$http.request(
                (_result) => {
                  var returnVal = this.showMessage(_result.data, flag);

                  if (returnVal) {
                    window.getApp.$emit('CONFIRM', {
                      title: 'L0000003321' /* 확인 */,
                      message:
                        flag === 'edit'
                          ? 'M0000000011' /* 저장하시겠습니까? */
                          : 'M0000000105' /* 등록하시겠습니까? */,
                      type: 'info',
                      // 확인 callback 함수
                      confirmCallback: () => {
                        this.electTitle.createUserId =
                          this.$store.getters.token;
                        this.electTitle.updateUserId =
                          this.$store.getters.token;
                        this.electTitle.electTitleItems =
                          this.YAuiGrid.getGridData();
                        if (this.lcnTypeCds && this.lcnTypeCds.length > 0) {
                          this.electTitle.lcnTypeCds = this.$_.clone(
                            this.$_.map(this.lcnTypeCds, 'code')
                          );
                        }

                        if (flag === 'edit') {
                          this.isEdit = true;
                        } else {
                          this.isInsert = true;
                        }
                      },
                      cancelCallback: () => {
                        if (flag === 'edit') {
                          this.isEdit = false;
                        } else {
                          this.isInsert = false;
                        }
                      },
                    });
                  }
                },
                (_error) => {
                  window.getApp.$emit('APP_REQUEST_ERROR', _error);
                }
              );
            }
          } else {
            if (this.checkRequiredInput() === true) {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395' /* 안내 */,
                message: 'M0000000005' /* 필수 입력값을 입력해 주세요. */,
                type: 'warning',
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
    },
    checkRequiredInput() {
      if (!this.electTitle.electClsCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395' /* 안내 */,
          message: 'M0000001116', // 구분을 선택해주세요.
          type: 'warning', // success / info / warning / error
        });
        return false;
      }
      if (!this.electTitle.electAttCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395' /* 안내 */,
          message: 'M0000001084', // 분야를 선택해주세요.
          type: 'warning', // success / info / warning / error
        });
        return false;
      }
      if (!this.electTitle.refLawCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395' /* 안내 */,
          message: 'M0000001123', // 관련법령을 선택해주세요.
          type: 'warning', // success / info / warning / error
        });
        return false;
      }
      if (!this.electTitle.electTypeCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395' /* 안내 */,
          message: 'M0000001124', // 신고/선임을 선택해주세요.
          type: 'warning', // success / info / warning / error
        });
        return false;
      }
      if (!this.electTitle.electTitlNm) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395' /* 안내 */,
          message: 'M0000001101', // 법정선임자명을 입력해주세요.
          type: 'warning', // success / info / warning / error
        });
        return false;
      }
      if (!this.electTitle.electStndDesc) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395' /* 안내 */,
          message: 'M0000001125', // 선임기준을 입력해주세요.
          type: 'warning', // success / info / warning / error
        });
        return false;
      }
      if (!this.electTitle.qualifiRequire) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395' /* 안내 */,
          message: 'M0000001126', // 자격요건을 입력해주세요.
          type: 'warning', // success / info / warning / error
        });
        return false;
      }
      return true;
    },
    showMessage(checkList, flag) {
      var checkText = '';
      var i = 0;
      for (; i < checkList.length; i++) {
        if (this.$_.parseInt(checkList[i].cnt) > 0) {
          checkText =
            this.$comm.getLangSpecInfoLabel(
              'M0000000924'
            ); /* '이미 존재하는 선해임명입니다.' */
          break;
        }
      }
      if (checkText) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395' /* 안내 */,
          message: checkText,
          type: 'warning',
        });
        return false;
      } else {
        return true;
      }
    },
    // 신규등록
    btnInsertClickedCallback(_result) {
      this.isInsert = false;
      this.updateMode = true;
      this.electTitle.safElectTitlNo = _result.data;
      window.getApp.$emit('ALERT', {
        title: 'L0000003395' /* 안내 */,
        message: 'M0000000106' /* 등록되었습니다. */,
        type: 'success',
      });
    },
    // 수정
    btnEditClickedCallback(_result) {
      this.isEdit = false;
      window.getApp.$emit('ALERT', {
        title: 'L0000003395' /* 안내 */,
        message: 'M0000000006' /* 저장되었습니다. */,
        type: 'success',
      });
    },
    // 버튼 에러 처리
    btnClickedErrorCallback(_result) {
      this.isInsert = false;
      this.isEdit = false;
      this.updateMode = false;
      window.getApp.emit('APP_REQUEST_ERROR', _result);
    },
    // 팝업 닫기
    btnClosePopup() {
      // 부모창에 값 전달
      this.$emit('closePopup', { success: true });
    },
    btnAddRow() {
      var d = new Date();
      let row = {
        tempId: d.getTime(),
        safElectTitlNo: this.electTitle.safElectTitlNo,
        itemType: '',
        itemWork: '',
        points: '',
        sortOrder: 0,
        remark: '',
        useYn: 'Y',
      };
      this.YAuiGrid.addRow(row, 'first');
    },
    btnAddItemCheck() {
      // 평가항목 추가
      var d = new Date();
      this.gridOptions.data.splice(0, 0, {
        tempId: d.getTime(),
        safElectTitlNo: this.electTitle.safElectTitlNo,
        itemType: '',
        itemWork: '',
        points: '',
        sortOrder: 0,
        remark: '',
        useYn: 'Y',
      });
    },
    btnDelRow() {
      let removeData = this.YAuiGrid.getCheckedRowItems();
      if (!removeData || removeData.length === 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395' /* 안내 */,
          message: 'M0000000057' /* 삭제할 항목을 선택해주세요. */,
          type: 'warning',
        });
        return;
      } else {
        for (let i = 0; i < removeData.length; i++) {
          this.YAuiGrid.removeRow(removeData[i].rowIndex);
        }
      }
    },
    btnDeleteItemCheck() {
      let removeData = this.YAuiGrid.getCheckedRowItems();
      if (!removeData || removeData.length === 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395' /* 안내 */,
          message: 'M0000000057' /* 삭제할 항목을 선택해주세요. */,
          type: 'warning',
        });
        return;
      } else {
        for (let i = 0; i < removeData.length; i++) {
          this.YAuiGrid.removeRow(removeData[i].rowIndex);
        }
      }
    },
    cellDoubleClick(event) {
      if (!(!this.disabled2 && this.editable)) return;
      if (event.dataField === 'itemType') {
        this.createMyCustomEditRenderer(event);
      } else if (event.dataField === 'itemWork') {
        this.createMyCustomEditRenderer(event);
      } else if (event.dataField === 'remark') {
        this.createMyCustomEditRenderer(event);
      }
    },
    // 커스텀 에디팅 렌더러 유형에 맞게 출력하기
    createMyCustomEditRenderer(event) {
      var i = 0;
      if (event.orgEvent.layerY > 70 && event.orgEvent.layerY < 140) {
        i = 1;
      } else if (event.orgEvent.layerY > 140 && event.orgEvent.layerY < 210) {
        i = 2;
      }
      var dataField = event.dataField;
      var $obj;
      var $textArea;
      // title, content는  TextArea 사용
      if (dataField === 'itemType') {
        $obj = $('#textAreaWrap')
          .css({
            left: event.orgEvent.clientX - event.orgEvent.offsetX - 100,
            top: event.orgEvent.screenY - event.orgEvent.pageY + 480 + 70 * i,
            width: 350,
            height: 140,
          })
          .show();
        $textArea = $('#myTextArea').val(
          String(event.value).replace(/[<]br[/][>]/gi, '\r\n')
        );
      }

      if (dataField === 'itemType') {
        // 데이터 필드 보관
        $obj.data('data-field', dataField);
        // 행인덱스 보관
        $obj.data('row-index', event.rowIndex);

        // 포커싱
        setTimeout(function () {
          $textArea.focus();
          $textArea.select();
        }, 16);
      }
      if (dataField === 'itemWork') {
        $obj = $('#textAreaWrap')
          .css({
            left: event.orgEvent.clientX - event.orgEvent.offsetX - 100,
            top: event.orgEvent.screenY - event.orgEvent.pageY + 480 + 70 * i,
            width: 350,
            height: 140,
          })
          .show();
        $textArea = $('#myTextArea').val(
          String(event.value).replace(/[<]br[/][>]/gi, '\r\n')
        );
      }

      if (dataField === 'itemWork') {
        // 데이터 필드 보관
        $obj.data('data-field', dataField);
        // 행인덱스 보관
        $obj.data('row-index', event.rowIndex);

        // 포커싱
        setTimeout(function () {
          $textArea.focus();
          $textArea.select();
        }, 16);
      }
      if (dataField === 'remark') {
        $obj = $('#textAreaWrap')
          .css({
            left: event.orgEvent.clientX - event.orgEvent.offsetX - 100,
            top: event.orgEvent.screenY - event.orgEvent.pageY + 480 + 70 * i,
            width: 350,
            height: 140,
          })
          .show();
        $textArea = $('#myTextArea').val(
          String(event.value).replace(/[<]br[/][>]/gi, '\r\n')
        );
      }

      if (dataField === 'remark') {
        // 데이터 필드 보관
        $obj.data('data-field', dataField);
        // 행인덱스 보관
        $obj.data('row-index', event.rowIndex);

        // 포커싱
        setTimeout(function () {
          $textArea.focus();
          $textArea.select();
        }, 16);
      }
    },
    // 진짜로 textarea 값을 그리드에 수정 적용시킴
    forceEditngTextArea(value) {
      var dataField = $('#textAreaWrap').data('data-field'); // 보관한 dataField 얻기
      var rowIndex = Number($('#textAreaWrap').data('row-index')); // 보관한 rowIndex 얻기
      value = value.replace(/\r|\n|\r\n/g, '<br/>'); // 엔터를 BR태그로 변환

      var item = {};
      item[dataField] = value;

      this.YAuiGrid.updateRow(item, rowIndex);
      $('#textAreaWrap').hide();
    },
    btnConfirm() {
      var value = $('#myTextArea').val();
      this.forceEditngTextArea(value);
    },
    btnCancel() {
      $('#textAreaWrap').hide();
    },
  },
};
</script>
<style>
/* 커스텀 에디터 스타일 */
#textAreaWrap {
  font-size: 12px;
  position: absolute;
  height: 100px;
  min-width: 100px;
  background: #fff;
  border: 1px solid #555;
  display: none;
  padding: 4px;
  text-align: right;
  z-index: 9999;
}
#textAreaWrap textarea {
  font-size: 12px;
}

.nav_u {
  display: inline-block;
  list-style: none;
}
.nav_u li {
  display: inline;
  white-space: nowrap;
  text-align: right;
  list-style: none;
}

/* 에디터 버튼 */
.editor_btn {
  background: #ccc;
  border: 1px solid #555;
  cursor: pointer;
  margin: 2px;
  padding: 2px;
}
</style>
