<!--
  목적 : 안전보호구 > 보호구 신청 > 신규등록/수정 팝업
  작성자 : kga
  Detail :
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <b-row>
      <!-- 보호구 신청 등록 -->
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- 보호구 신청 -->
            <y-label label="L0000004402" icon="user-edit" color-class="cutstom-title-color" />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 신청완료 -->
              <y-btn
                v-if="editable && this.speRqst.safSpeRqstGiveNo > 0"
                :action-url="completeUrl"
                :param="speRqst"
                :is-submit="isFinish"
                title="L0000004406"
                color="black"
                action-type="PUT"
                beforeSubmit="beforeFinish"
                @beforeFinish="beforeFinish"
                @btnClicked="btnFinishClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!-- 저장 -->
              <y-btn
                v-if="editable && this.speRqst.safSpeRqstGiveNo <= 0"
                :action-url="insertUrl"
                :param="speRqst"
                :is-submit="isInsert"
                title="L0000002474"
                color="orange"
                action-type="POST"
                beforeSubmit="beforeInsert"
                @beforeInsert="beforeInsert"
                @btnClicked="btnInsertClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <y-btn
                v-if="editable && this.speRqst.safSpeRqstGiveNo > 0"
                :action-url="editUrl"
                :param="speRqst"
                :is-submit="isEdit"
                title="L0000002474"
                color="orange"
                action-type="PUT"
                beforeSubmit="beforeInsert"
                @beforeInsert="beforeInsert"
                @btnClicked="btnEditClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!-- 삭제 -->
              <y-btn
                v-if="editable && this.speRqst.safSpeRqstGiveNo > 0"
                title="L0000001495"
                color="red"
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
                :disabled="true"
                name="plantCd"
                v-model="speRqst.plantCd"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 신청일 -->
              <y-datepicker
                :width="baseWidth"
                :disabled="true"
                default="today"
                label="L0000001802"
                name="rqstYmd"
                :clearable="true"
                v-model="speRqst.rqstYmd"
              ></y-datepicker>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 신청부서 -->
              <y-text
                :width="baseWidth"
                :disabled="true"
                ui="bootstrap"
                label="L0000001798"
                name="rqstDeptNm"
                v-model="speRqst.rqstDeptNm"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 신청자 -->
              <y-text
                :width="baseWidth"
                :disabled="true"
                ui="bootstrap"
                label="L0000001803"
                name="rqstUserNm"
                v-model="speRqst.rqstUserNm"
              ></y-text>
            </b-col>
            <!-- <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
              <y-text
                :width="10"
                :editable="editable"
                :maxlength="100"
                ui="bootstrap"
                label="비고"
                name="rqstRemark"
                v-model="speRqst.rqstRemark"
              ></y-text>
            </b-col>-->
            <!-- 보호구 신청 상세 -->
            <el-divider content-position="left">{{$comm.getLangSpecInfoLabel('L0000001267')}}</el-divider>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 신청보호구 종류 -->
              <y-select
                :width="baseWidth"
                :editable="editable"
                :comboItems="insSpeKindCds"
                :required="true"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                type="search"
                label="L0000001797"
                name="speKindCd"
                v-model="speKindCd"
              />
            </b-col>
            <!-- <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-number
                :width="baseWidth"
                :editable="editable"
                :required="true"
                :maxlength="5"
                :hasSeperator="false"
                ui="bootstrap"
                label="신청수량"
                name="rqstNum"
                v-model="rqstNum"
              ></y-number>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
              <y-text
                :width="10"
                :editable="editable"
                :maxlength="100"
                ui="bootstrap"
                label="신청보호구 비고"
                name="rqstSpeRemark"
                v-model="rqstSpeRemark"
              ></y-text>
            </b-col>-->
            <!-- <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              <div v-if="editable" slot="buttonGroup" class="float-right mb-1">
                <y-btn title="L0000002892" color="blue" @btnClicked="addSpeRqstList" />  추가 
                <y-btn title="L0000001495" color="red" @btnClicked="deleteSpeRqstList" />  삭제 
              </div>
               보호구 신청 목록 
              <y-data-table
                label="L0000001266"
                ref="dataTable"
                :rows="3"
                :height="gridOptions.height"
                :headers="gridOptions.header"
                :items="gridOptions.data"
                :useRownum="false"
                v-model="selectedValue"
                @tableLinkClicked="tableLinkClicked"
                :popMode="true"
              >
                <el-table-column type="selection" slot="selection" align="center" width="55"></el-table-column>
              </y-data-table>
            </b-col> -->
            <b-col sm="12" class="h100p">
              <y-auigrid
                ref="yAuiGrid"
                :editable="true"
                :name="gridOptions.name"
                :headers="gridOptions.header"
                :btns="gridOptions.btns"
                :height="gridOptions.height"
                :label="this.$comm.getLangSpecInfoLabel('L0000001266')"
                :useExcelExport="false"
                :enableCellMerge="true"
                :enableSorting="true"
                :showGridSetSave="true"
                :useContextMenu="true"
                :enableRightDownFocus="true"
                :showGridCtrl="true"  
                :showRowCheckColumn="true"
                @cellClick="cellClickHanlder"
                @btnAddRowClicked="btnAddRowClicked"
                @btnDelRowClicked="btnDelRowClicked"
              />
            </b-col>
            <!-- 첨부파일 -->
            <el-divider content-position="left">{{$comm.getLangSpecInfoLabel('L0000002843')}}</el-divider>
            <component
              :is="attach"
              v-if="attach"
              :submitCheck="submitCheck"
              :attachFileGrps="attachFileGrps"
              :saveAttachFiles="saveAttachFiles"
              @changeUploadFiles="changeUploadFiles"
              @setTempDeleteFiles="setTempDeleteFiles"
            />
          </b-row>
        </b-card>
      </b-col>
    </b-row>
    <y-dialog :param="shiledOptions"></y-dialog>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
export default {
  name: 'create-spe-rqst',
  props: {
    popupParam: {
      type: Object,
      default: {
        safSpeRqstGiveNo: 0, // 보호구신청및지급번호
      },
    },
  },
  data() {
    return {
      gridOptions: {
        name: 'createSpeRqst',
        btns: [],
        header: [],
        data: [],
        height: '300',
      },
      YAuiGrid: null,
      speRqst: {
        safSpeRqstGiveNo: 0, // 보호구신청및지급번호
        rqstYmd: null, // 신청일
        rqstDeptCd: '',
        rqstDeptNm: '',
        rqstUserNm: '',
        rqstRemark: '',
        speKindCd: null, // 보호구종류
        speRqDtlList: [],
        createUserId: '',
        updateUserId: '',
        plantCd: '',
      },
      shiledOptions: {
        target: null,
        title: '',
        visible: false,
        width: '60%',
        top: '10px',
        param: {},
        closeCallback: null,
      },
      speKindCd: null, // 신청보호구 종류
      rqstNum: '', // 신청수량
      rqstSpeRemark: '', // 신청보호구 비고
      baseWidth: 8,
      editable: false,
      searchUrl: '',
      searchSpeKindUrl: '',
      insertUrl: '',
      editUrl: '',
      completeUrl: '',
      isInsert: false,
      isEdit: false,
      isFinish: false,
      insSpeKindCds: [], // 보호구 종류 - 상세
      selectedValue: [],

      // 첨부 파일
      attach: null,
      submitCheck: false,
      saveAttachFiles: [],
      tempDeleteFiles: [],
      attachFileGrps: [],
    };
  },
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init()
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;
  },
  beforeDestroy() {},
  /** methods **/
  methods: {
    init() {
      this.editable = this.$route.meta.editable;
      // URL 셋팅
      this.searchUrl = selectConfig.saf.speRqstDtl.list.url;
      this.searchSpeKindUrl = selectConfig.saf.spe.kinds.url;
      this.insertUrl = transactionConfig.saf.speRqst.insert.url;
      this.editUrl = transactionConfig.saf.speRqst.edit.url;
      this.completeUrl = transactionConfig.saf.speRqst.complete.url;
      this.deleteUrl = transactionConfig.saf.speRqst.delete.url;

      this.getSpeKindeList(); // 보호구 종류

      if (this.popupParam.safSpeRqstGiveNo > 0) {
        this.speRqst.safSpeRqstGiveNo = this.popupParam.safSpeRqstGiveNo;
        this.getSpeRqst();
      } else {
        this.speRqst.plantCd = this.$store.getters.plantCd;
        this.speRqst.rqstUserNm = this.$store.getters.name;
        this.speRqst.rqstDeptCd = this.$store.getters.deptCd;
        this.speRqst.rqstDeptNm = this.$store.getters.deptNm;
        this.speRqst.rqstYmd = this.$comm.getToday();
      }

      // 보호구 신청 grid 헤더 설정
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001277'), 
          dataField: 'speKindNm', 
          width: '30%', 
          editable: false,
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {              
            },
          },
        },        
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001801'),
          dataField: 'rqstNum',
          width: '30%',
          dataType: "numeric",
          formatString: "#,###.#",
          editRenderer: {
            type: 'InputEditRenderer', 
            onlyNumeric: true, 
            maxlength: 6,
            autoThousandSeparator: true,
          }, 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001796'), 
          dataField: 'rqstSpeRemark', 
          width: '40%', 
        },  
      ];
      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000002892'), 
          color: 'blue',
          btnClicked: 'btnAddRowClicked',
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001495'), 
          color: 'red',
          btnClicked: 'btnDelRowClicked',
        },
      ]
      // 첨부파일 셋팅
      this.attach = () => import('@/pages/common/attachFile/multiFileUpload');
      this.setAttachFileGrps();
    },
    // 보호구 신청 상세
    getSpeRqst() {
      if (!this.speRqst.safSpeRqstGiveNo) return;
      this.$http.url = this.$format(
        selectConfig.saf.speRqst.get.url,
        this.speRqst.safSpeRqstGiveNo
      );
      this.$http.type = 'get';
      this.$http.request(
        _result => {
          this.speRqst = this.$_.clone(_result.data);
          this.gridOptions.data = this.$_.clone(_result.data.speRqDtlList);
          this.YAuiGrid.setGridData(this.$_.clone(_result.data.speRqDtlList))

          if (this.speRqst.speStepCd === 'SPES3') {
            this.editable = false;
          }
          this.setAttachFileGrps();
        },
        _error => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    getSpeKindeList() {
      this.$http.url = this.searchSpeKindUrl;
      this.$http.type = 'get';
      this.$http.param = {
        plantCd: this.speRqst.plantCd,
      };
      this.$http.request(
        _result => {
          // 보호구 종류
          this.insSpeKindCds = this.$_.clone(_result.data);
          this.insSpeKindCds.splice(0, 0, {
            code: null,
            codeNm: this.$comm.getLangSpecInfoLabel('L0000003394'), // 선택하세요
          });
        },
        _error => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    btnAddRowClicked() {
      if (!this.speKindCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // '안내',
          message: 'M0000000787', // 신청보호구 종류를 선택해주세요.
          type: 'warning',
        });
        return;
      }
      if (this.$_.find(this.YAuiGrid.getGridData(), { speKindCd: this.speKindCd })) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // '안내',
          message: 'M0000000789', // 이미 추가된 보호구 입니다. 다른 보호구를 선택해주세요.
          type: 'warning',
        });
        return;
      }
      let speKindItem = this.$_.find(this.insSpeKindCds, {
        code: this.speKindCd,
      });
      let addItem = {
        speKindCd: this.speKindCd,
        speKindNm: speKindItem.codeNm,
        rqstNum: 0,
        rqstSpeRemark: '',
      };
      this.YAuiGrid.addRow(addItem, 'last')
    },
    // 보호구 신청 목록 추가
    addSpeRqstList() {
      if (!this.speKindCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // '안내',
          message: 'M0000000787', // 신청보호구 종류를 선택해주세요.
          type: 'warning',
        });
        return;
      }
      // if (!this.rqstNum) {
      //   window.getApp.$emit('ALERT', {
      //     title: '안내',
      //     message: '신청수량을 입력해주세요.',
      //     type: 'warning',
      //   });
      //   return;
      // }
      if (this.$_.find(this.gridOptions.data, { speKindCd: this.speKindCd })) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // '안내',
          message: 'M0000000789', // 이미 추가된 보호구 입니다. 다른 보호구를 선택해주세요.
          type: 'warning',
        });
        return;
      }
      let speKindItem = this.$_.find(this.insSpeKindCds, {
        code: this.speKindCd,
      });
      let addItem = {
        speKindCd: this.speKindCd,
        speKindNm: speKindItem.codeNm,
        rqstNum: 0,
        rqstSpeRemark: '',
        // rqstNum: this.rqstNum,
        // rqstSpeRemark: this.rqstSpeRemark,
      };
      this.gridOptions.data.push(addItem);
    },
    btnDelRowClicked() {
      let checkingData = this.YAuiGrid.getCheckedRowItemsAll();

      if (checkingData.length === 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // '안내',
          message: 'M0000000911', // 삭제 할 데이터를 선택하세요.
          type: 'warning',
        });
        return;
      } else {
        let gridData = this.YAuiGrid.getGridData();
        this.$_.forEach(checkingData, (item) => {
          gridData = this.$_.reject(gridData, item);
        });

        this.YAuiGrid.setGridData(gridData)
      }
    },
    // 보호구 신청 목록 삭제
    deleteSpeRqstList() {
      if (this.selectedValue.length === 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // '안내',
          message: 'M0000000911', // 삭제 할 데이터를 선택하세요.
          type: 'warning',
        });
        return;
      } else {
        this.$_.forEach(this.selectedValue, item => {
          this.gridOptions.data = this.$_.clone(
            this.$_.reject(this.gridOptions.data, item)
          );
        });
      }
    },
    beforeInsert() {
      if (this.gridOptions.data.length <= 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // '안내',
          message: 'M0000000790', // 신청 보호구를 추가해주세요.
          type: 'warning',
        });
        return;
      }
      this.$validator
        .validateAll()
        .then(_result => {
          if (_result) {
            window.getApp.$emit('CONFIRM', {
              title: 'L0000003321', // '확인',
              message: 'M0000000011', // 저장하시겠습니까?
              type: 'info',
              // 확인 callback 함수
              confirmCallback: () => {
                this.speRqst.speRqDtlList = this.YAuiGrid.getGridData();
                if (!this.speRqst.safSpeRqstGiveNo) {
                  this.speRqst.rqstCreateUserId = this.$store.getters.token;
                  this.speRqst.rqstUserId = this.$store.getters.token;
                  this.isInsert = true;
                } else {
                  this.speRqst.rqstUpdateUserId = this.$store.getters.token;
                  this.isEdit = true;
                }
              },
              cancelCallback: () => {
                this.isInsert = false;
                this.isEdit = false;
              },
            });
          } else {
            window.getApp.$emit('ALERT', {
              title: 'L0000003395', // '안내',
              message: 'M0000000005', // '필수 입력값을 입력해 주세요.',
              type: 'warning',
            });
          }
        })
        .catch(() => {
          window.getApp.$emit(
            'APP_VALID_ERROR',
            'M0000000881', // 유효성 검사도중 에러가 발생하였습니다.
          );
        });
    },
    beforeFinish() {
      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321', // '확인',
        message: 'M0000000791', // 신청완료하시겠습니까?
        type: 'info',
        // 확인 callback 함수
        confirmCallback: () => {
          this.speRqst.rqstUpdateUserId = this.$store.getters.token;
          this.speRqst.speRqDtlList = this.gridOptions.data;
          this.isFinish = true;
        },
        cancelCallback: () => {
          this.isFinish = false;
        },
      });
    },
    /** Button Event **/
    // 팝업 닫기
    btnClosePopup() {
      // 부모창에 값 전달
      this.$emit('closePopup', { success: true });
    },
    // 초기화
    btnClearClickedCallback() {
      Object.assign(this.$data.speRqst, this.$options.data().speRqst);
      this.$validator.reset();
      window.getApp.$emit(
        'APP_REQUEST_SUCCESS',
        'M0000000777' // 초기화 버튼이 클릭 되었습니다.
      );
    },
    // 저장
    btnInsertClickedCallback(_result) {
      if (_result.data === 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003396', // 에러
          message: 'M0000000779', // 저장하는 중 오류가 발생했습니다.
          type: 'error',
        });
      } else {
        this.speRqst.safSpeRqstGiveNo = this.$_.clone(_result.data);
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // '안내',
          message: 'M0000000006', // 저장되었습니다.
          type: 'success',
        });
        this.saveAttach();
        // this.getSpeRqst();
      }
      this.isInsert = false;
    },
    // 수정
    btnEditClickedCallback(_result) {
      if (_result.data === 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003396', // 에러
          message: 'M0000000780', // 수정하는 중 오류가 발생했습니다.
          type: 'error',
        });
      } else {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // '안내',
          message: 'M0000000836', // 수정되었습니다.
          type: 'success',
        });
        this.saveAttach();
        // this.getSpeRqst();
      }
      this.isEdit = false;
    },
    // 완료
    btnFinishClickedCallback(_result) {
      if (_result.data === 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003396', // 에러
          message: 'M0000001580', // 신청완료 처리하는 중 오류가 발생했습니다.
          type: 'error',
        });
      } else {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // '안내',
          message: 'M0000001581', // 신청완료 되었습니다.
          type: 'success',
        });
        this.getSpeRqst();
      }
      this.isFinish = false;
    },
    // 삭제
    btnDeleteClickedCallback(_result) {
      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321', // '확인',
        message: 'M0000000012', // 삭제하시겠습니까?
        type: 'info',
        // 확인 callback 함수
        confirmCallback: () => {
          this.$http.url = this.$format(
            transactionConfig.saf.speRqst.delete.url,
            this.speRqst.safSpeRqstGiveNo
          );
          this.$http.type = 'DELETE';
          this.$http.request(
            _result => {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395', // '안내',
                message: 'M0000000007', // 삭제되었습니다.
                type: 'success',
              });
              this.btnClosePopup();
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
    // 버튼 에러 처리
    btnClickedErrorCallback(_result) {
      this.isInsert = false;
      this.isFinish = false;
      window.getApp.emit('APP_REQUEST_ERROR', _result);
    },
    cellClickHanlder(event) {
      if (event.dataField === 'speKindNm') {
        this.shiledOptions.target = () => import(`${'./speListPop.vue'}`);
        this.shiledOptions.title = 'L0000001269'; // 보호구 이미지
        this.shiledOptions.visible = true;
        this.shiledOptions.width = '70%';
        this.shiledOptions.top = '10px';
        this.shiledOptions.param = {
          plantCd: this.speRqst.plantCd,
          speKindCd: event.item.speKindCd,
        };
        this.shiledOptions.closeCallback = this.closeSpeListPop;
      }
    },
    tableLinkClicked(header, data) {
      if (data) {
        this.shiledOptions.target = () => import(`${'./speListPop.vue'}`);
        this.shiledOptions.title = 'L0000001269'; // 보호구 이미지
        this.shiledOptions.visible = true;
        this.shiledOptions.width = '70%';
        this.shiledOptions.top = '10px';
        this.shiledOptions.param = {
          plantCd: this.speRqst.plantCd,
          speKindCd: data.speKindCd,
        };
        this.shiledOptions.closeCallback = this.closeSpeListPop;
      }
    },
    closeSpeListPop() {
      this.shiledOptions.target = null;
      this.shiledOptions.visible = false;
    },
    // 첨부파일 관련 메서드
    setAttachFileGrps() {
      let taskKey = this.speRqst.safSpeRqstGiveNo
        ? this.speRqst.safSpeRqstGiveNo.toString()
        : '';
      this.attachFileGrps = [
        {
          label: 'L0000001272', // 보호구 지급관련 첨부파일
          uploadTempFiles: null,
          taskClassNm: 'SHIELD_RQST',
          taskKey: taskKey,
          drag: false,
          showFileSearch: this.editable,
          editable: this.editable,
          disabled: !this.editable,
          createUserId: this.$store.getters.token,
        },
      ];
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
      this.$_.forEach(this.attachFileGrps, item => {
        item.taskKey = this.speRqst.safSpeRqstGiveNo;
      });

      if (this.tempDeleteFiles.length > 0) {
        this.$http.url = transactionConfig.attachFile.deleteMulti.url;
        this.$http.type = 'DELETE';
        this.$http.param = {
          data: Object.values(this.$_.clone(this.tempDeleteFiles)),
        };
        this.$http.request(_result => {
          this.tempDeleteFiles = [];
          // 저장할 데이터가 있는 경우
          if (this.saveAttachFiles.length > 0) {
            this.submitCheck = !this.submitCheck;
          }
        });
      } else {
        // 저장할 데이터가 있는 경우
        if (this.saveAttachFiles.length > 0) {
          this.submitCheck = !this.submitCheck;
        }
      }
      this.getSpeRqst();
    },
    /** /Button Event **/
  },
};
</script>