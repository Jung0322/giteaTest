<!--
  목적 : 평가계획수립 - 대상부서
  Detail : 평가계획에서 선택된 평가계획별 대상부서 리스트를 조회한다.
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <!-- 검색 결과 테이블 -->
    <!-- <b-row>
      <b-col sm="12">
        <b-col sm="12" class="px-0">
          <div class="float-right mb-1">
             공정 추가 
            <y-btn
              v-if="editableInput && updateModeParent && editable && !authDuringAppr"
              title="L0000000528"
              color="orange"
              @btnClicked="addProcess"
            />
            - 공정 제거 
            <y-btn
              v-if="editableInput && updateModeParent && editable && !authDuringAppr"
              title="L0000000527"
              color="red"
              @btnClicked="deleteProcess"
            />
          </div>
           대상공정 목록 
          <y-data-table
            ref="dataTable"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            :editable="editable && !authDuringAppr"
            :print="true"
            :useRownum="false"
            label="L0000000920"
            v-model="selectedValue"
            @selectedRow="selectedRow"
            :popMode="true"
          >
            <el-table-column
              v-if="!authDuringAppr && editableInput"
              type="selection"
              slot="selection"
              align="center"
              width="55"
            ></el-table-column>
          </y-data-table>
        </b-col>
      </b-col>
    </b-row> -->
    <b-row class="grid-height grid-box">
      <b-col sm="12" class="h100p">
        <y-auigrid
          ref="yAuiGrid"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000000920')"
          :useExcelExport="false"
          :enableCellMerge="true"
          :enableSorting="true"
          :showRowCheckColumn="true"
          :showGridSetSave="true"
          :useContextMenu="true"
          :enableRightDownFocus="true"
          :showGridCtrl="true"  
          @addProcessNew="addProcessNew"
          @deleteProcessNew="deleteProcessNew"
          @selectedRow="selectedRow"
        />
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
  name: 'y-risk-assess-dept',
  props: {
    authDuringAppr: false,
    assessPlanNo: 0, // 평가계획 번호
    plantCd: '',
    createDeptCd: '',
    editableInput: true, // 수정
    tabIndex: '',
    updateModeParent: false,
  },
  data: () => ({
    riskAssessDept: {
      assessPlanNo: 0, // 평가계획 번호
      deptCd: null, // 부서 코드
      processCd: '', // 공정 코드
      processNm: '', // 공정 명
      deptNm: '', // 부서명
      userId: '', // 사용자 id
      userNm: '', // 사용자명
      assessPlanContents: '', // 공지사항
      selectedDeptCd: '',
      selectedProcessCd: '',
      createUserId: '',
      updateUserId: '',
    },
    gridOptions: {
      name: 'riskAssessDept',
      btns: [],
      header: [],
      data: [],
      height: '300',
    },
    YAuiGrid: null,
    selectedValue: [],
    popupOptions: {
      target: null,
      title: '',
      visible: false,
      param: {},
      width: '90%',
      top: '10px',
      closeCallback: null,
    },
    editable: false,
    updateMode: false,
    isInsert: false,
    isEdit: false,
    deptCdItems: [],
    editUrl: '',
    insertUrl: '',
    searchUrl: '',
    deleteUrl: '',
    obj: [],
  }),
  watch: {
    tabIndex: function(newValue, oldValue) {
      this.getList();
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
    this.YAuiGrid = this.$refs.yAuiGrid;
  },
  beforeDestroy() {},
  //* methods */
  methods: {
    init() {
      this.editable = this.$route.meta.editable;
      // Url Setting
      this.searchUrl = selectConfig.rsa.riskAssessDept.list.url;
      this.editUrl = transactionConfig.rsa.riskAssessDept.edit.url;
      this.insertUrl = transactionConfig.rsa.riskAssessDept.insert.url;
      this.deleteUrl = transactionConfig.rsa.riskAssessDept.delete.url;
      
      // 그리드 헤더 설정
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000515'), 
          dataField: 'processNm', 
          width: '50%', 
          editable: false,
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002364'), 
          dataField: 'jobCount', 
          width: '50%', 
          editable: false,
          style: 'right-align'
        },
      ];

      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000528'),
          color: 'orange',
          btnClicked: 'addProcessNew',
          visible: this.editableInput && this.updateModeParent && this.editable && !this.authDuringAppr,
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000527'),
          color: 'red',
          btnClicked: 'deleteProcessNew',
          visible: this.editableInput && this.updateModeParent && this.editable && !this.authDuringAppr,
        },
      ]
      this.getList(); // 대상공정 조회
    },
    /** 대상부서 목록 조회 **/
    getList() {
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = {
        assessPlanNo: this.assessPlanNo,
      };
      this.$http.request(
        _result => {
          this.YAuiGrid.setGridData(this.$_.clone(_result.data))
          this.gridOptions.data = this.$_.clone(_result.data);
        },
        _error => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    /**
     * 대상부서 상세 조회
     * 대상부서 목록 row 클릭시 마다 발생
     * data : 클릭한 row 정보
     */
    selectedRow(data) {
      if (data === null || !this.editableInput) return;

      this.$http.url = selectConfig.rsa.riskAssessDept.get.url;
      this.$http.type = 'get';
      this.$http.param = {
        assessPlanNo: data.assessPlanNo,
        processCd: data.processCd,
        userId: data.userId,
      };
      this.$http.request(
        _result => {
          this.updateMode = true;
          this.riskAssessDept = this.$_.clone(_result.data);
          this.riskAssessDept.selectedProcessCd = this.riskAssessDept.processCd;
        },
        _error => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    check(gubun) {
      var processCds = this.$_.map(this.gridOptions.data, 'processCd');
      if (!this.riskAssessDept.processCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: 'M0000000643', // 공정을 선택 하세요.
          type: 'warning', // success / info / warning / error
        });
        return false;
      }
      if (!this.riskAssessDept.userNm) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: 'M0000000644', // 담당자를 입력하세요.
          type: 'warning', // success / info / warning / error
        });
        return false;
      }

      if (gubun === 'edit') {
        processCds.splice(
          this.$_.indexOf(processCds, this.riskAssessDept.selectedProcessCd),
          1
        );
      }
      if (this.$_.indexOf(processCds, this.riskAssessDept.processCd) > -1) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: 'M0000000645', // 현재 평가계획에 같은 공정이 존재합니다.
          type: 'warning', // success / info / warning / error
        });
        return false;
      }
    },
    /** 수정 하기전 UI단 유효성 검사 **/
    beforeSubmit() {
      var check = this.check('edit');
      if (check) {
        this.$validator
          .validateAll()
          .then(_result => {
            if (_result) {
              window.getApp.$emit('CONFIRM', {
                title: 'L0000003321',
                message: 'M0000000011',
                // TODO : 필요시 추가하세요.
                type: 'info', // success / info / warning / error
                // 확인 callback 함수
                confirmCallback: () => {
                  this.riskAssessDept.assessPlanNo = this.assessPlanNo;
                  this.riskAssessDept.createUserId = this.$store.getters.token;
                  this.riskAssessDept.updateUserId = this.$store.getters.token;
                  this.isEdit = true;
                },
                // 취소 callback 함수
                cancelCallback: () => {
                  this.isEdit = false;
                },
              });
            } else if (!_result) {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395',
                message: 'M0000000005',
                type: 'warning', // success / info / warning / error
              });
            }
          })
          .catch(() => {
            window.getApp.$emit(
              'APP_VALID_ERROR',
              'M0000000876'
            );
            this.isEdit = false;
          });
      }
    },
    /** 신규등록 하기전 UI단 유효성 검사 **/
    beforeInsert() {
      var check = this.check('insert');
      if (check) {
        this.$validator
          .validateAll()
          .then(_result => {
            // TODO : 전역 성공 메시지 처리
            // 이벤트는 ./event.js 파일에 선언되어 있음
            if (_result) {
              window.getApp.$emit('CONFIRM', {
                title: 'L0000003321',
                message: 'M0000000011',
                // TODO : 필요시 추가하세요.
                type: 'info', // success / info / warning / error
                // 확인 callback 함수
                confirmCallback: () => {
                  this.riskAssessDept.assessPlanNo = this.assessPlanNo;
                  this.riskAssessDept.createUserId = this.$store.getters.token;

                  this.isInsert = true;
                },
                // 취소 callback 함수
                cancelCallback: () => {
                  this.isInsert = false;
                },
              });
            } else if (!_result) {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395',
                message: 'M0000000005',
                type: 'warning', // success / info / warning / error
              });
            }
          })
          .catch(() => {
            window.getApp.$emit(
              'APP_VALID_ERROR',
              'M0000000876'
            );
            this.isInsert = false;
          });
      }
    },
    /**
     * 필수입력값 유효성 검사
     */
    validateState(ref) {
      if (
        this.veeBag[ref] &&
        (this.veeBag[ref].dirty || this.veeBag[ref].validated)
      ) {
        return !this.errors.has(ref);
      }
      return null;
    },
    /** button 관련 이벤트 **/
    /**
     * 대상부서 목록 조회
     *  수정 버튼 callback
     * _result : backend에서 return하는 데이터
     */
    btnSaveClickedCallback(_result) {
      this.getList();
      this.riskAssessDept.selectedProcessCd = this.riskAssessDept.processCd;
      window.getApp.$emit('ALERT', {
        title: 'L0000003395',
        message: 'M0000000006',
        type: 'success', // success / info / warning / error
      });
      this.isEdit = false;
    },
    /**
     * 대상부서 목록 조회 및 수정버튼 보여지도록 처리
     *  신규등록 버튼 callback
     * _result : backend에서 return하는 데이터
     */
    btnInsertClickedCallback(_result) {
      this.getList();
      this.riskAssessDept.selectedProcessCd = this.riskAssessDept.processCd;
      window.getApp.$emit('ALERT', {
        title: 'L0000003395',
        message: 'M0000000006',
        type: 'success', // success / info / warning / error
      });
      this.isInsert = false;
      this.updateMode = true;
    },
    /**
     * 데이터 및 이벤트 초기화, 수정버튼 안보여지도록 처리
     *  초기화 버튼 callback
     */
    btnClearClickedCallback() {
      this.updateMode = false;
      Object.assign(
        this.$data.riskAssessDept,
        this.$options.data().riskAssessDept
      );
      this.riskAssessDept.assessPlanNo = this.assessPlanNo;
      this.$validator.reset();
    },
    /**
     * 수정 버튼 안보여지도록 처리 및 isSubmit false 처리
     *  버튼 http 통신 중 error 발생 callback
     * _result : error return하는 데이터
     */
    btnClickedErrorCallback(_result) {
      this.updateMode = false;
      this.isInsert = false;
      this.isEdit = false;
      this.btnClearClickedCallback();
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    btnSearchUserClicked() {
      if (!this.editableInput) return;
      this.popupOptions.target = () =>
        import(`${'../../../manage/user/userSearch.vue'}`);
      this.popupOptions.title = 'L0000001466'; // 사용자검색
      this.popupOptions.visible = true;
      this.popupOptions.width = '60%';
      this.popupOptions.top = '100px';
      this.popupOptions.param = {
        plantCd: this.plantCd,
      };
      this.popupOptions.closeCallback = this.closePopup;
    },
    closePopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;

      if (data.user) {
        this.riskAssessDept.userId = data.user.userId;
        this.riskAssessDept.userNm = data.user.userNm;
      }
    },
    /**
     * 대상부서 삭제
     *  삭제 버튼 callback
     * _result : backend에서 return하는 데이터
     */
    btnDeleteClickedCallback(_result) {
      var delArr = [];
      var obj = {
        assessPlanNo: this.assessPlanNo,
        processCd: this.riskAssessDept.processCd,
      };
      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321',
        message: 'M0000000012', // 삭제하시겠습니까?
        // TODO : 필요시 추가하세요.
        type: 'info', // success / info / warning / error
        // 확인 callback 함수
        confirmCallback: () => {
          this.$http.url = transactionConfig.rsa.riskAssessDept.delete.url;
          this.$http.type = 'DELETE';
          this.$http.param = {
            data: obj,
          };
          this.$http.request(
            _result => {
              if (_result.data > 0) {
                window.getApp.$emit('ALERT', {
                  title: 'L0000003395',
                  message: 'M0000000007', // 삭제되었습니다.
                  type: 'success', // success / info / warning / error
                });
              } else {
                window.getApp.$emit('ALERT', {
                  title: 'L0000003395',
                  message: 'M0000000647', // 삭제에 실패하였습니다. 다시 시도해주세요
                  type: 'warning', // success / info / warning / error
                });
              }
              this.updateMode = false;
              this.getList();
            },
            _error => {
              window.getApp.$emit('APP_REQUEST_ERROR', _error);
            }
          );
        },
        // 취소 callback 함수
        cancelCallback: () => {},
      });
    },
    addProcessNew() {
      if (!this.editableInput) return;
      this.popupOptions.target = () =>
        import(`${'@/pages/baseInfo/deptManage/process.vue'}`);
      this.popupOptions.title = 'L0000000515'; // 공정
      this.popupOptions.visible = true;
      this.popupOptions.width = '60%';
      this.popupOptions.top = '100px';
      this.popupOptions.param = {
        popupMode: true,
        multiple: true,
        plantCd: this.plantCd,
      };
      this.popupOptions.closeCallback = this.closeProcessPopup;
    },
    addProcess() {
      if (!this.editableInput) return;
      this.popupOptions.target = () =>
        import(`${'@/pages/baseInfo/deptManage/process.vue'}`);
      this.popupOptions.title = 'L0000000515'; // 공정
      this.popupOptions.visible = true;
      this.popupOptions.width = '60%';
      this.popupOptions.top = '100px';
      this.popupOptions.param = {
        popupMode: true,
        multiple: true,
        plantCd: this.plantCd,
      };
      this.popupOptions.closeCallback = this.closeProcessPopup;
    },
    closeProcessPopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;

      if (data && data.process && data.process.length > 0) {
        let saveData = [];
        this.$_.forEach(this.YAuiGrid.getGridData(), gridData => {
          if (
            this.$_.findIndex(data.process, {
              processCd: gridData.processCd,
            }) > -1
          ) {
            data.process = this.$_.reject(data.process, {
              processCd: gridData.processCd,
            });
          }
        });
        this.$_.forEach(data.process, item => {
          item.assessPlanNo = this.assessPlanNo;
          item.createUserId = this.$store.getters.token;
        });
        this.$http.url =
          transactionConfig.rsa.riskAssessDept.insert.multiple.url;
        this.$http.type = 'POST';
        this.$http.param = data.process;
        this.$http.request(
          _result => {
            if (_result.data > 0) {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395',
                message: 'M0000000006',
                type: 'success', // success / info / warning / error
              });
              this.getList();
            } else {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395',
                message: 'M0000000669',
                // 저장에 실패하였습니다. 다시 시도해주세요
                type: 'warning', // success / info / warning / error
              });
            }
          },
          _error => {
            window.getApp.$emit('APP_REQUEST_ERROR', _error);
          }
        );
      }
    },
    deleteProcessNew() {
      let removeData = this.YAuiGrid.getCheckedRowItems();
      if (!removeData || removeData.length === 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: 'M0000000670',
          // 제거 할 공정을 하나 이상 선택하세요
          type: 'warning', // success / info / warning / error
        });
        return;
      }
      this.selectedValue = [];
      this.$_.forEach(removeData, item => {
        this.selectedValue.push(item.item)
      });
      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321',
        message: 'M0000000012',
        type: 'info', // success / info / warning / error
        confirmCallback: () => {
          this.$http.url =
              transactionConfig.rsa.riskAssessDept.delete.multiple.url;
          this.$http.type = 'DELETE';
          this.$http.param = {
            data: this.selectedValue,
          };
          this.$http.request(
            _result => {
              if (_result.data > 0) {
                window.getApp.$emit('ALERT', {
                  title: 'L0000003395',
                  message: 'M0000000007', // 삭제되었습니다.
                  type: 'success', // success / info / warning / error
                });
              } else {
                window.getApp.$emit('ALERT', {
                  title: 'L0000003395',
                  message: 'M0000000647', // 삭제에 실패하였습니다. 다시 시도해주세요
                  type: 'warning', // success / info / warning / error
                });
              }
              this.updateMode = false;
              this.getList();
            },
            _error => {
              window.getApp.$emit('APP_REQUEST_ERROR', _error);
            }
          );
        },
        // 취소 callback 함수
        cancelCallback: () => {},
      });
    },
    deleteProcess() {
      if (this.selectedValue && this.selectedValue.length > 0) {
        window.getApp.$emit('CONFIRM', {
          title: 'L0000003321',
          message: 'M0000000012',
          type: 'info', // success / info / warning / error
          confirmCallback: () => {
            this.$http.url =
              transactionConfig.rsa.riskAssessDept.delete.multiple.url;
            this.$http.type = 'DELETE';
            this.$http.param = {
              data: this.selectedValue,
            };
            this.$http.request(
              _result => {
                if (_result.data > 0) {
                  window.getApp.$emit('ALERT', {
                    title: 'L0000003395',
                    message: 'M0000000007', // 삭제되었습니다.
                    type: 'success', // success / info / warning / error
                  });
                } else {
                  window.getApp.$emit('ALERT', {
                    title: 'L0000003395',
                    message: 'M0000000647', // 삭제에 실패하였습니다. 다시 시도해주세요
                    type: 'warning', // success / info / warning / error
                  });
                }
                this.updateMode = false;
                this.getList();
              },
              _error => {
                window.getApp.$emit('APP_REQUEST_ERROR', _error);
              }
            );
          },
          // 취소 callback 함수
          cancelCallback: () => {},
        });
      } else {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: 'M0000000670',
          // 제거 할 공정을 하나 이상 선택하세요
          type: 'warning', // success / info / warning / error
        });
      }
    },
  },
};
</script>