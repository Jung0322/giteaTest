f
<template>
  <b-container fluid>
    <b-row ref="detailBox">
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- PSM 감사범위 상세 -->
            <y-label
              label="L0000000144"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 저장 -->
              <y-btn
                v-if="editable"
                :action-url="saveUrl"
                :param="auditItem"
                :is-submit="isSave"
                title="L0000002474"
                color="orange"
                :action-type="actionType"
                beforeSubmit="beforeSave"
                @beforeSave="beforeSave"
                @btnClicked="btnSaveClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!-- <y-btn
                v-if="editable && popupParam.auditStdNo > 0"
                :action-url="deleteUrl"
                :param="deleteValue"
                :is-submit="isDelete"
                title="삭제"
                color="red"
                action-type="DELETE"
                beforeSubmit="beforeDelete"
                @beforeDelete="beforeDelete"
                @btnClicked="btnDeleteClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              /> -->
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
                :required="true"
                :editable="editable"
                name="plantCd"
                v-model="auditItem.plantCd"
                v-validate="'required'"
                :state="validateState('plantCd')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 감사범위 -->
              <y-text
                :width="8"
                :required="true"
                :editable="editable"
                :maxlength="30"
                ui="bootstrap"
                label="L0000000233"
                name="auditStdNm"
                v-model="auditItem.auditStdNm"
                v-validate="'required'"
                :state="validateState('auditStdNm')"
              ></y-text>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
              <!-- 감사기준 -->
              <y-textarea
                :width="10"
                :maxlength="200"
                :required="true"
                :editable="editable"
                ui="bootstrap"
                label="L0000000229"
                name="auditStdDesc"
                v-model="auditItem.auditStdDesc"
                v-validate="'required'"
                :state="validateState('auditStdDesc')"
              ></y-textarea>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
              <!-- 비고 -->
              <y-textarea
                :width="10"
                :maxlength="200"
                :editable="editable"
                ui="bootstrap"
                label="L0000001360"
                name="remark"
                v-model="auditItem.remark"
              ></y-textarea>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 환산계수 -->
              <y-number
                :width="8"
                :editable="editable"
                :maxlength="20"
                :pointNumber="10"
                :hasSeperator="true"
                :required="true"
                ui="bootstrap"
                label="L0000003338"
                name="convFactor"
                v-model="auditItem.convFactor"
                v-validate="'required'"
                :state="validateState('convFactor')"
              ></y-number>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <b-row>
                <b-col
                  sm="10"
                  md="10"
                  lg="10"
                  xl="10"
                  class="col-xxl-10"
                  style="
                    max-height: 300px;
                    overflow-y: auto;
                    overflow-x: hidden;
                  "
                >
                  <!-- 주관부서 -->
                  <y-tree-dept
                    type="search"
                    label="L0000002713"
                    :required="true"
                    :plantCd="auditItem.plantCd"
                    v-model="auditItem.chargeDeptCd"
                    v-validate="'required'"
                    name="chargeDeptCd"
                    :state="validateState('chargeDeptCd')"
                  />
                </b-col>
              </b-row>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 사용여부, 사용/미사용 -->
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
                v-model="auditItem.useYn"
              ></y-switch>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 정렬순서 -->
              <y-number
                :width="8"
                :editable="editable"
                :isPositive="true"
                :required="true"
                ui="bootstrap"
                label="L0000002601"
                :maxlength="5"
                name="sortOrder"
                v-model="auditItem.sortOrder"
                v-validate="'required'"
                :state="validateState('sortOrder')"
              ></y-number>
            </b-col>

            <el-divider content-position="left"
              >{{ this.$comm.getLangSpecInfoLabel('L0000002724') }}}</el-divider
            >
            <!-- 준비서류 첨부파일 -->
            <component
              :is="attach"
              v-if="attach"
              :submitCheck="submitCheck"
              :attachFileGrps="attachFileGrps"
              :saveAttachFiles="saveAttachFiles"
              @changeUploadFiles="changeUploadFiles"
              @setTempDeleteFiles="setTempDeleteFiles"
              @closePopup="closePopup2"
            />
          </b-row>
        </b-card>
      </b-col>
    </b-row>

    <b-row>
      <b-col sm="12">
        <!-- 감사항목 목록 -->
        <y-auigrid
          ref="yAuiGrid"
          :editable="editable"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :items="gridOptions.data"
          :label="this.$comm.getLangSpecInfoLabel('L0000000241')"
          :useExcelExport="true"
          :useContextMenu="true"
          :enableRightDownFocus="true"
          :showGridCtrl="true"
          :showRowCheckColumn="true"
          @cellEditEnd="cellEditEndHandler"
          @btnAddItemCheck="btnAddItemCheck"
          @btnDeleteItemCheck="btnDeleteItemCheck"
        />
      </b-col>
    </b-row>

    <y-dialog :param="popupOptions"></y-dialog>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
import arrayToTree from 'array-to-tree';
export default {
  name: 'audit-item-detail',
  props: {
    popupParam: {
      type: Object,
      default: {
        auditStdNo: 0,
      },
    },
  },
  data() {
    return {
      auditItem: {
        auditStdNo: 0, // 감사기준번호
        plantCd: null, // 사업장코드
        auditStdNm: null, // 감사범위
        auditStdDesc: null, // 감사기준(비고)
        convFactor: null, // 환산계수
        chargeDeptCd: null, // 주관부서
        remark: null, // remark
        useYn: 'Y', // 사용여부
        sortOrder: null,
        auditItems: [], // PSM검사기준별항목 리스트
        deleteAuditItems: [], // 삭제할 PSM검사기준별항목 리스트
      },
      YAuiGrid: null,
      gridOptions: {
        header: [],
        data: [],
        height: '320',
      },
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '500px',
        top: '50px',
        param: {},
        closeCallback: null,
      },
      selectedValue: [],
      editable: false,
      searchDetailUrl: '',
      saveUrl: '',
      isSave: false,
      actionType: 'POST',
      // 첨부 파일
      attach: null,
      submitCheck: false,
      saveAttachFiles: [],
      tempDeleteFiles: [],
      attachFileGrps: [],
      deleteUrl: '',
      isDelete: false,
      deleteValue: null,
    };
  },
  watch: {
    'gridOptions.data': {
      handler: function (val, oldVal) {
        let deleteData = this.$_.clone(this.auditItem.auditItems);
        this.$_.forEach(this.auditItem.auditItems, (item) => {
          if (item.auditItemNo) {
            let index = this.$_.findIndex(this.gridOptions.data, {
              auditItemNo: item.auditItemNo,
            });
            if (index === -1) {
              deleteData = this.$_.reject(deleteData, {
                auditItemNo: item.auditItemNo,
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
        this.auditItem.auditItems = deleteData;

        this.$_.forEach(this.gridOptions.data, (item) => {
          if (item.auditItemNo) {
            let index = this.$_.findIndex(this.auditItem.auditItems, {
              auditItemNo: item.auditItemNo,
            });
            if (index > -1) {
              this.auditItem.auditItems[index] = item;
            } else {
              this.auditItem.auditItems.push(item);
            }
          } else {
            let index = this.$_.findIndex(this.auditItem.auditItems, {
              tempId: item.tempId,
            });
            if (index > -1) {
              this.auditItem.auditItems[index] = item;
            } else {
              this.auditItem.auditItems.push(item);
            }
          }
        });
      },
    },
  },
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;
    this.getDetail();
  },
  beforeDestroy() {},
  /** methods **/
  methods: {
    init() {
      // URL 셋팅
      this.searchDetailUrl = selectConfig.saf.auditItem.get.url;
      this.saveUrl = transactionConfig.saf.auditItem.insert.url;
      this.deleteUrl = transactionConfig.saf.auditItem.delete.url;
      this.checkStdUrl = selectConfig.saf.auditItem.checkStdUrl.url;
      this.checkItemUrl = selectConfig.saf.auditItem.checkItemUrl.url;
      this.editable = this.$route.meta.editable;

      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003783'),
          dataField: 'auditItemNm',
          width: '45%',
          style: 'left-align',
          editRenderer: {
            type: 'InputEditRenderer',
            maxlength: 200,
          },
        } /* 감사항목 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001360'),
          dataField: 'remark',
          width: '35%',
          style: 'left-align',
          editRenderer: {
            type: 'InputEditRenderer',
            maxlength: 200,
          },
        } /* 비고 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002601'),
          dataField: 'sortOrder',
          width: '10%',
          dataType: 'numeric',
          formatString: '#,###.#',
          rounding: 'floor',
          style: 'right-align',
          editRenderer: {
            type: 'InputEditRenderer',
            onlyNumeric: true,
            maxlength: 10,
            autoThousandSeparator: true, // 자동 컴마를 천단위 출력할지 여부
            allowPoint: false, // 소수점 입력(.) 도 허용할지 여부
          },
        } /* 정렬순서 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001457'),
          dataField: 'useYn',
          width: '10%',
          renderer: {
            type: 'CheckBoxEditRenderer',
            showLabel: true,
            editable: true,
            checkValue: 'Y',
            unCheckValue: 'N',
          },
        } /* 사용유무 */,
      ];
      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000243'),
          color: 'orange',
          btnClicked: 'btnAddItemCheck',
          visible: this.editable,
        }, // 감사항목 추가
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000242'),
          color: 'red',
          btnClicked: 'btnDeleteItemCheck',
          visible: this.editable,
        }, // 감사항목 삭제
      ];

      this.attach = () => import('@/pages/common/attachFile/multiFileUpload');
      this.setAttachFileGrps(); // 첨부파일 셋팅
    },
    getDetail() {
      if (!this.popupParam.auditStdNo) {
        this.setAttachFileGrps();
        return;
      } else {
        this.$http.url = this.$format(
          this.searchDetailUrl,
          this.popupParam.auditStdNo
        );
        this.$http.type = 'GET';
        this.$http.request((_result) => {
          this.auditItem = this.$_.clone(_result.data);
          this.gridOptions.data = this.$_.clone(_result.data.auditItems);
          this.setAttachFileGrps();
        });
      }
    },
    setAttachFileGrps() {
      // 첨부파일 설정
      let taskKey = this.popupParam.auditStdNo
        ? this.popupParam.auditStdNo.toString()
        : '';
      this.attachFileGrps = [
        {
          label: 'L0000002723' /* 준비서류 */,
          listType: 'text',
          drag: false,
          showFileSearch: this.editable,
          editable: this.editable,
          limit: 5,
          multiple: true,
          uploadTempFiles: null,
          loadOtherFileGrps: null,
          taskClassNm: 'AUDIT_STD',
          taskKey: taskKey,
          taskFlag: '',
          createUserId: this.$store.getters.token,
          isOtherFile: true,
        },
      ];
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
      if (this.popupParam.auditStdNo) {
        this.saveUrl = transactionConfig.saf.auditItem.edit.url;
        this.actionType = 'PUT';
        this.checkValidator('edit');
      } else {
        this.saveUrl = transactionConfig.saf.auditItem.insert.url;
        this.actionType = 'POST';
        this.checkValidator('insert');
      }
    },
    checkValidator(flag) {
      this.$validator
        .validateAll()
        .then((_result) => {
          if (_result) {
            window.getApp.$emit('CONFIRM', {
              title: 'L0000003321' /* 확인 */,
              message: 'M0000000011' /* 저장하시겠습니까? */,
              // TODO : 필요시 추가하세요.
              type: 'info', // success / info / warning / error
              // 확인 callback 함수
              confirmCallback: () => {
                this.auditItem.createUserId = this.$store.getters.token;
                this.auditItem.updateUserId = this.$store.getters.token;
                this.isSave = true;
              },
            });
          } else {
            this.$popupRequired.check(
              'auditItemDetail',
              this.$data,
              this.errors
            );
          }
        })
        .catch(() => {
          this.isSave = false;
          window.getApp.$emit(
            'APP_VALID_ERROR',
            'M0000000876' /* '유효성 검사도중 에러가 발생하였습니다.' */
          );
        });
    },
    btnSaveClickedCallback(_result) {
      window.getApp.$emit('ALERT', {
        title: 'L0000003395' /* 안내 */,
        message: 'M0000000006' /* 저장되었습니다. */,
        type: 'success',
      });
      if (!this.popupParam.auditStdNo) {
        this.popupParam.auditStdNo = _result.data;
        this.auditItem.auditStdNo = _result.data;
      }

      this.isSave = false;
      this.saveAttach();
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
    // 팝업 닫기
    closePopup2() {},
    /**
     * 부서 트리용 기초 정보를 Tree 메뉴로 변환
     */
    convertTree(_treeBases) {
      if (!_treeBases || _treeBases.length <= 0) return null;
      var tree = arrayToTree(_treeBases, {
        parentProperty: 'pdeptCd',
        customID: 'deptCd',
      });

      return tree;
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
    saveAttach() {
      // task_key 를 셋팅한다.
      this.$_.forEach(this.attachFileGrps, (item) => {
        item.taskKey = this.auditItem.auditStdNo;
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
            // 저장할 데이터가 있는 경우
            if (this.saveAttachFiles.length > 0) {
              this.submitCheck = !this.submitCheck;
            }
          },
          (_error) => {
            window.getApp.$emit('APP_REQUEST_ERROR', _error);
          }
        );
      } else {
        // 저장할 데이터가 있는 경우
        if (this.saveAttachFiles.length > 0) {
          this.submitCheck = !this.submitCheck;
        }
      }
    },
    btnAddItemCheck() {
      // 직무스트레스 체크리스트 항목 추가>
      var d = new Date();
      this.gridOptions.data.push({
        tempId: d.getTime(),
        auditStdNo: this.auditItem.auditStdNo,
        auditItemNm: '',
        points: '',
        sortOrder: 0,
        remark: '',
        useYn: 'Y',
      });
    },
    btnDeleteItemCheck() {
      const selectedRows = this.YAuiGrid.getCheckedRowItemsAll();
      // 직무스트레스 대상자 삭제 추가
      if (selectedRows.length === 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395' /* 안내 */,
          message: 'M0000000057' /* 삭제할 항목을 선택해주세요. */,
          type: 'warning',
        });
        return;
      } else {
        if (!this.auditItem.deleteAuditItems) {
          this.auditItem.deleteAuditItems = [];
        }
        let delText = '';
        this.$http.url = this.checkItemUrl;
        this.$http.type = 'post';
        this.$http.param = selectedRows;
        this.$http.request((_result) => {
          if (_result.data) {
            this.$_.forEach(_result.data, (item) => {
              if (item.tempId > 0) {
                this.gridOptions.data.splice(
                  this.$_.findIndex(this.gridOptions.data, {
                    tempId: Number(item.tempId),
                  }),
                  1
                );
              } else {
                if (item.auditUseYn === 'Y') {
                  if (delText !== '') {
                    delText += '\n\n"' + item.auditItemNm + '"';
                  } else {
                    delText += '"' + item.auditItemNm + '"';
                  }
                } else {
                  this.auditItem.deleteAuditItems.push(item);
                  this.gridOptions.data.splice(
                    this.$_.findIndex(this.gridOptions.data, {
                      auditItemNo: item.auditItemNo,
                    }),
                    1
                  );
                }
              }
            });
            if (delText !== '') {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395' /* 안내 */,
                message:
                  delText +
                  this.$comm.getLangSpecInfoMessage(
                    'M0000000703'
                  ) /* 은 사용중인 감사항목으로 삭제할 수 없습니다. */,
                type: 'warning',
              });
            }
          }
        });
      }
    },
    saveDeleteItem() {
      // 삭제한 항목을 따로 저장해 둔 후 저장 버튼을 누를때 가지고 가서

      // 23.04.03 saveDeleteItem 호출하는 곳이 없어 수정 X
      // this.selectedValue : 그리드에서 체크박스가 선택된 값.
      this.$_.forEach(this.selectedValue, (item) => {
        if (item.tempId) {
          this.gridOptions.data.splice(
            this.$_.findIndex(this.gridOptions.data, { tempId: item.tempId }),
            1
          );
        } else {
          this.auditItem.deleteAuditItems.push(item);
          this.gridOptions.data.splice(
            this.$_.findIndex(this.gridOptions.data, {
              auditItemNo: item.auditItemNo,
            }),
            1
          );
        }
      });
    },
    customNewTag() {
      this.popupOptions.target = () =>
        import(`${'@/pages/baseInfo/deptManage/deptSearchPopup.vue'}`);
      this.popupOptions.title = 'L0000001287'; /* 부서 */
      this.popupOptions.visible = true;
      this.popupOptions.param = {
        multiple: true,
        checkStrictly: true,
      };
      this.popupOptions.width = '35%';
      this.popupOptions.top = '10px';
      this.popupOptions.closeCallback = this.closeDeptPopup;
    },
    closeDeptPopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      if (data !== 'CLOSE') {
        this.$_.forEach(data, (item) => {
          if (item.deptCd) {
            this.auditItem.depts = item.deptCd;
          }
        });
      }
    },
    beforeDelete() {
      this.$http.url = this.$format(
        this.checkStdUrl,
        this.popupParam.auditStdNo
      );
      this.$http.type = 'get';
      this.$http.request((_result) => {
        if (_result.data > 0) {
          window.getApp.$emit('ALERT', {
            title: 'L0000003395' /* 안내 */,
            message:
              'M0000000704' /* PSM자체감사 계획 및 결과에서 사용하고 있습니다. 삭제할 수 없습니다. */,
            type: 'warning',
          });
          return;
        } else {
          window.getApp.$emit('CONFIRM', {
            title: 'L0000003321' /* 확인 */,
            message: 'M0000000012' /* 삭제하시겠습니까? */,
            type: 'info',
            confirmCallback: () => {
              let auditItems = [];
              auditItems.push(this.auditItem);
              this.deleteValue = {
                data: Object.values(this.$_.clone(auditItems)),
              };
              this.isDelete = true;
            },
          });
        }
      });
    },
    cellEditEndHandler(event) {
      this.gridOptions.data[event.rowIndex][event.dataField] = event.value;
    },
    // btnDeleteClickedCallback(_result) {
    //   this.isDelete = false;
    //   window.getApp.$emit('ALERT', {
    //     title: 'L0000003395' /* 안내 */,
    //     message: '삭제되었습니다.',
    //     type: 'success',
    //   });
    //   this.btnClosePopup();
    // },
  },
};
</script>
