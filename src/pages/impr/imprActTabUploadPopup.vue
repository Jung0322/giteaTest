<template>
  <b-container fluid>
    <b-row>
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- 개선사항 업로드 -->
            <y-label
              label="L0000005034"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 닫기 -->
              <y-btn title="L0000000881" @btnClicked="btnClosePopup" />
            </div>
          </b-col>
        </b-row>
        <b-card
          header-class="default-card bg-light"
          body-class="default-body-card"
          class="mt-3"
        >
          <div slot="header">
            <div class="float-left">
              <!-- 엑셀업로드 -->
              <y-label label="L0000001969" />
            </div>
          </div>
          <b-row>
            <b-col sm="12">
              <b-row>
                <el-upload
                  style="margin-left: 10px"
                  class="upload-demo"
                  ref="upload"
                  name="files"
                  :headers="uploadHeader"
                  :action="uploadUrl"
                  :data="uploadParam"
                  :auto-upload="false"
                  :on-success="onSuccess"
                  :drag="false"
                  :multiple="false"
                  :limit="1"
                  :on-error="onError"
                  v-loading="loading"
                >
                  <!-- 파일선택 -->
                  <el-button size="small" type="primary">{{
                    $comm.getLangSpecInfoLabel('L0000003028')
                  }}</el-button>
                  <!-- 업로드 -->
                  <el-button
                    slot="tip"
                    style="margin-left: 10px"
                    size="small"
                    type="success"
                    @click="submitUpload"
                    >{{ $comm.getLangSpecInfoLabel('L0000001934') }}</el-button
                  >
                </el-upload>
                <!-- 검증 -->
                <y-btn
                  title="L0000005035"
                  style="margin-left: 10px"
                  color="blue"
                  @btnClicked="validateChk"
                />
                <!-- 삭제 -->
                <y-btn
                  title="L0000001495"
                  style="margin-left: 10px"
                  color="red"
                  @btnClicked="deleteInfo"
                />
                <!-- 저장 -->
                <y-btn
                  style="margin-left: 10px"
                  :action-url="insertUrl"
                  :param="uploadList"
                  :is-submit="isInsert"
                  title="L0000002474"
                  color="orange"
                  action-type="POST"
                  beforeSubmit="beforeInsert"
                  @beforeInsert="beforeInsert"
                  @btnClicked="btnInsertClickedCallback"
                  @btnClickedErrorCallback="btnClickedErrorCallback"
                />
              </b-row>
            </b-col>
            <b-col sm="12" class="mt-3">
              <div>
                <el-tag size="medium" type="danger">
                  <!--개선요청사항 조치담당자는 저장되지 않습니다.-->
                  <i class="el-icon-info"></i>
                  {{ $comm.getLangSpecInfoLabel('L0000005090') }}
                </el-tag>
              </div>
              <!-- 업로드 결과 목록 -->
              <y-data-table
                :key="tempKey"
                ref="dataTable"
                label="L0000001935"
                :height="gridOptions.height"
                :headers="gridOptions.header"
                :items="uploadList"
                :useRownum="false"
                v-model="selectValue"
                @inputText="selectChange"
              >
                <el-table-column
                  type="selection"
                  slot="selection"
                  align="center"
                  width="55"
                ></el-table-column>
              </y-data-table>
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import transactionConfig from '@/js/transactionConfig';
import backendConfig from '@/js/backendConfig.js';
import selectConfig from '@/js/selectConfig';
import { getAccessToken } from '@/utils/auth';
import { resolve } from 'q';
export default {
  name: 'self-measurement-excel-upload',
  props: {
    popupParam: {
      type: Object,
      default: {
        imprClassCd: '',
        refTableId: 0,
        refTableIdList: [],
        editable: true,
        detailCheck: false,
        status: '',
        message: '',
      },
    },
  },
  data() {
    return {
      gridOptions: {
        header: [],
        data: [],
        height: '400',
      },

      editable: false,
      uploadHeader: {},
      uploadParam: {
        refTableId: 0,
      },
      uploadList: [],
      validateinfo: {},
      validateList: [],
      selectValue: [],
      loading: false,
      uploadUrl: '',
      insertUrl: '',
      validateUrl: '',
      isInsert: false,
      actClassItem: [],
      plantItem: [],
      tempKey: null,
    };
  },
  computed: {},
  watch: {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
  },
  mounted() {
    this.init();
  },
  beforeDestroy() {},
  methods: {
    init() {
      this.editable = this.$route.meta.editable;
      this.insertUrl = transactionConfig.saf.imprAct.excelInsert.url;
      // 구분코드
      this.$comm.getComboItems('SAF_ACT_CLASS', false).then((_result) => {
        this.actClassItem = _result;

        this.gridOptions.header[1].items = this.actClassItem;

        let nowDate = new Date();
        this.tempKey = nowDate.getMilliseconds();
      });
      // 사업장코드
      this.$comm.getComboItems('COM_PLANT_CD', false).then((_result) => {
        this.plantItem = _result;

        this.gridOptions.header[2].items = this.plantItem;

        let nowDate = new Date();
        this.tempKey = nowDate.getMilliseconds();
      });
      this.validateUrl = selectConfig.saf.imprAct.validate.url;
      this.uploadUrl = backendConfig.getUrl(
        transactionConfig.saf.imprAct.uploadExcel.url
      );
      this.uploadParam.refTableId = this.popupParam.refTableId;

      this.uploadHeader = {
        'X-Authorization': getAccessToken(),
      };

      this.gridOptions.header = [
        // 실패내용
        {
          text: 'L0000001818',
          name: 'failMessage',
          width: '300px',
          textCalculate: this.textCalculate,
        },
        {
          text: 'L0000002668',
          name: 'actClassCd',
          width: '130px',
          align: 'center',
          type: 'select',
          items: this.actClassItem,
          itemText: 'codeNm',
          itemValue: 'code',
        } /* 조치구분 */,
        {
          text: 'L0000001415',
          name: 'plantCd',
          width: '120px',
          align: 'center',
          type: 'select',
          items: this.plantItem,
          itemText: 'codeNm',
          itemValue: 'code',
        } /* 사업장 */,
        {
          text: 'L0000005032',
          name: 'imprTitle',
          width: '200px',
          align: 'center',
          type: 'text',
        } /* 요청 제목 */,
        {
          text: 'L0000005039',
          name: 'imprRqstContents',
          width: '300px',
          type: 'text',
        } /* 조치요청내용 */,
        {
          text: 'L0000005033',
          name: 'actResultContents',
          width: '200px',
          align: 'center',
          type: 'text',
        } /* 조치결과 */,
        {
          text: 'L0000002673',
          name: 'actDept',
          width: '130px',
          align: 'center',
          type: 'deptsearch',
        } /* 조치부서 */,
        {
          text: 'L0000002670',
          name: 'actLimitYmd',
          width: '140px',
          align: 'center',
          type: 'datepicker',
        } /* 조치기한 */,
        {
          text: 'L0000002672',
          name: 'actUser',
          width: '130px',
          align: 'center',
          type: 'userSearch',
        } /* 조치 담당자 */,
        {
          text: 'L0000002685',
          name: 'actConfirmYmd',
          width: '140px',
          align: 'center',
          type: 'datepicker',
        } /* 조치완료일 */,
      ];

      this.gridOptions.header[0].items = this.mgtBdtClsItems;

      let nowDate = new Date();
      this.tempKey = nowDate.getMilliseconds();
    },
    validateState(ref) {
      if (
        this.veeBag[ref] &&
        (this.veeBag[ref].dirty || this.veeBag[ref].validated)
      ) {
        return !this.errors.has(ref);
      }
      return null;
    },
    textCalculate(_row, _name) {
      var text = _row[_name];
      if (text) {
        text = text.replace(/\n/g, '<br/>');
      }
      return text;
    },
    // 업로드
    submitUpload() {
      // 파일이 있는지 여부 확인
      if (this.$refs.upload.uploadFiles.length === 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000001934', // '업로드',
          message: 'M0000000083', // '업로드할 파일이 없습니다. 파일을 선택하세요',
          type: 'warning',
        });
        return;
      }
      var uploadFileName = this.$refs.upload.uploadFiles[0].name.toLowerCase();
      if (uploadFileName.indexOf('xlsx') === -1) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // '안내',
          message: 'M0000000900', // '업로드 파일은 XLSX 형식이어야 합니다.',
          type: 'warning',
        });
        return;
      }
      this.loading = true;
      this.$refs.upload.submit();
    },
    onSuccess(response, file, fileList) {
      this.loading = false;
      this.$refs.upload.clearFiles();
      if (response.success) {
        let msg = this.getConfirmMsg(response);
        this.uploadList = response.uploadList;
        // this.research = !this.research;
        window.getApp.$emit('ALERT', {
          title: 'L0000001936', // '업로드 결과내역',
          message: msg,
          type: 'warning',
        });
      } else {
        window.getApp.$emit('ALERT', {
          title: 'L0000001936', // '업로드 결과내역',
          message: response.message,
          type: 'warning',
        });
      }
    },
    getConfirmMsg(response) {
      var returnMsg = '';
      if (response.totCount === 0) {
        returnMsg = this.$comm.getLangSpecInfoMessage('M0000000084');
        // returnMsg = '업로드한 파일에 업로드할 데이터가 없습니다. 업로드할 데이터가 있는지 다시한번 확인해 주세요.';
      } else {
        returnMsg = this.$comm.getLangSpecInfoMessage('M0000000085', {
          s0: response.totCount,
          s1: response.completeCount,
          s2: response.dontCount,
        });
        // returnMsg = String(
        //   '총 ' +
        //     response.totCount +
        //     '건 (완료 : ' +
        //     response.completeCount +
        //     ', 실패 : ' +
        //     response.dontCount +
        //     ')이 업로드 되었습니다.'
        // );
      }
      return returnMsg;
    },
    onError(err, file, fileList) {
      this.loading = false;
      console.log(JSON.stringify(err));
      // 인증오류처리
      window.getApp.$emit(
        'APP_REQUEST_ERROR',
        'M0000000086' // '업로드에 실패했습니다. 재시도 시에도 지속적으로 문제가 발생한다면 관리자에게 문의해 주세요.'
      );
      return;
    },
    btnClosePopup() {
      // 부모창에 값 전달
      this.$emit('closePopup', { success: true });
    },
    beforeInsert() {
      if (this.uploadList.length === 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: 'L0000005041', // 업로드 목록이 없습니다.
          type: 'success', // success / info / warning / error
        });
      }
      this.validateinfo = {};
      this.validateList = [];
      this.$_.forEach(this.uploadList, (item) => {
        this.validateinfo = item;
        this.validateList.push(this.validateinfo);
      });
      this.$http.url = this.validateUrl;
      this.$http.type = 'POST';
      this.$http.param = this.validateList;
      this.$http.request(
        (_result) => {  
          if (_result.data.totCount === _result.data.completeCount)
          {
            let cnt = 0;
            return new Promise((_resolve, _reject) => {
              this.$_.forEach(this.uploadList, (item) => {
                if (item.failMessage.length > 0) {
                  cnt++;
                }
              });
              if (cnt > 0) {
                window.getApp.$emit('ALERT', {
                  title: 'L0000003395', // '안내',
                  message: 'L0000005048', // '실패내용을 확인해주세요.',
                  type: 'warning',
                });
                return;
              } else {
                _resolve(true);
                this.insertSubmit();
              }
            });
          }
          else
          {
            window.getApp.$emit('ALERT', {
              title: 'L0000003395', // '안내',
              message: 'L0000005757', // '검증완료 후 저장 하시기 바랍니다.',
              type: 'warning',
            });
          }          
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    insertSubmit() {
      this.$validator
        .validateAll()
        .then((_result) => {
          if (_result) {
            window.getApp.$emit('CONFIRM', {
              title: '확인',
              message: '개선사항을 등록하시겠습니까?',
              type: 'info',
              confirmCallback: () => {
                this.$_.forEach(this.uploadList, (item) => {
                  item.createUserId = this.$store.getters.token;
                  item.createDeptCd = this.$store.getters.deptCd;
                  item.createDeptNm = this.$store.getters.deptNm;
                  item.createPositionCd = this.$store.getters.positionCd;
                  item.createPositionNm = this.$store.getters.positionNm;
                  item.imprClassCd = this.popupParam.imprClassCd;
                  item.refTableId = this.popupParam.refTableId;
                });
                setTimeout(() => {
                  this.isInsert = true;
                }, 500);
              },
            });
          }
        })
        .catch(() => {
          window.getApp.$emit(
            'APP_VALID_ERROR',
            '유효성 검사도중 에러가 발생하였습니다.'
          );
        });
    },
    btnInsertClickedCallback(result) {
      window.getApp.$emit('ALERT', {
        title: 'L0000003395',
        message: 'M0000000006',
        type: 'success', // success / info / warning / error
      });
      this.isInsert = false;
      this.btnClosePopup();
      // this.getDetail();
    },
    btnClickedErrorCallback(result) {
      this.isInsert = false;
      window.getApp.$emit('APP_REQUEST_ERROR', result);
    },
    deleteInfo(_result) {
      if (!this.selectValue || this.selectValue.length <= 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // '안내',
          message: 'M0000000057', // 삭제할 항목을 선택해주세요.
          type: 'warning',
        });
        return;
      }
      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321',
        message: 'M0000000012', // 삭제하시겠습니까?
        type: 'info', // success / info / warning / error
        // 확인 callback 함수
        confirmCallback: () => {
          this.$_.forEach(this.selectValue, (item) => {
            this.uploadList = this.$_.reject(this.uploadList, item);
          });
        },
        // 취소 callback 함수
        cancelCallback: () => {},
      });
    },
    btnTemplate() {
      let thisVue = this;
      let accept = this.$comm.getAccept('xlsx');
      let _comm = this.$comm;
      let fileNm = '개선사항 업로드양식_샘플.xlsx';

      this.$http.url = selectConfig.saf.imprAct.template.url;
      this.$http.param = {
        fileName: fileNm, // 양식 파일명
      };
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          var url = window.URL || window.webkitURL;
          let link = document.createElement('a');
          var blob = thisVue.$comm.base64ToBlob(_result.data, accept);
          if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(blob, fileNm);
          } else {
            let link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = fileNm;
            link.click();
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    validateChk() {
      if (this.uploadList.length === 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: 'L0000005041', // 업로드 목록이 없습니다.
          type: 'success', // success / info / warning / error
        });
      }
      this.validateinfo = {};
      this.validateList = [];
      this.$_.forEach(this.uploadList, (item) => {
        this.validateinfo = item;
        this.validateList.push(this.validateinfo);
      });
      this.$http.url = this.validateUrl;
      this.$http.type = 'POST';
      this.$http.param = this.validateList;
      this.$http.request(
        (_result) => {
          let msg = this.getConfirmMsg(_result.data);
          this.uploadList = _result.data.uploadList;
          window.getApp.$emit('ALERT', {
            title: 'L0000001936', // '업로드 결과내역',
            message: msg,
            type: 'warning',
          });
          // this.$comm.pushCookie(this.searchParam);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    selectChange(data) {
      if (data.name === 'actClassCd') {
        data.row.actClassNm = data.text;
      } else if (data.name === 'plantCd') {
        data.row.plantNm = data.text;
      }
    },
  },
};
</script>
