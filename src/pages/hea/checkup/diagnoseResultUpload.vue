<!--
  목적 : 검진결과/판정 업로드
  Detail :
  examples:
  -->
<template>
  <b-container fluid>
    <b-row>
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- 업로드정보 -->
            <y-label
              label="L0000001945"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 일반검진 양식 다운로드 -->
              <y-btn
                title="L0000002263"
                @btnClicked="btnDownloadFormClicked('normal')"
              />
              <!-- 특수검진 양식 다운로드 -->
              <y-btn
                title="L0000003017"
                @btnClicked="btnDownloadFormClicked('special')"
              />
              <!-- 닫기 -->
              <y-btn title="L0000000881" @btnClicked="closePopup" />
            </div>
          </b-col>
        </b-row>
        <b-card>
          <b-row>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <y-plant
                type="edit"
                :editable="editable"
                :required="true"
                name="plantCd"
                v-model="uploadFile.plantCd"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 검진년도 -->
              <y-datepicker
                :width="8"
                :editable="editable"
                :required="true"
                type="year"
                :range="false"
                label="L0000000364"
                name="checkupYear"
                :default="uploadFile.checkupYear"
                v-model="uploadFile.checkupYear"
              ></y-datepicker>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 검진계획 -->
              <y-select
                :width="8"
                :editable="editable"
                :required="true"
                :comboItems="heaCheckupPlanNoItems"
                itemText="heaCheckupPlanNm"
                itemValue="heaCheckupPlanNo"
                ui="bootstrap"
                type="search"
                name="heaCheckupPlanNo"
                label="L0000000353"
                v-model="uploadParam.heaCheckupPlanNo"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <b-row>
                <b-col sm="4">
                  <!--검진종류  -->
                  <y-label label="L0000000373"></y-label>
                </b-col>
                <b-col sm="8">
                  <y-label
                    :label="uploadFile.heaCheckupClassNm"
                    :fieldable="true"
                  ></y-label>
                </b-col>
              </b-row>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 검진기관 -->
              <y-select
                :width="8"
                :required="true"
                :ediable="editable"
                :comboItems="heaCheckupOrgItems"
                itemText="heaCheckupOrgNm"
                itemValue="heaCheckupOrgNo"
                ui="bootstrap"
                name="heaCheckupOrgNo"
                label="L0000000357"
                v-model="uploadParam.heaCheckupOrgNo"
              />
            </b-col>
          </b-row>

          <b-row>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              <el-upload
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
                <el-button size="small" type="primary">
                  <!-- 파일선택 -->
                  {{ $comm.getLangSpecInfoLabel('L0000003028') }}
                </el-button>
                <!-- 업로드 -->
                <el-button
                  slot="tip"
                  style="margin-left: 10px"
                  size="small"
                  type="success"
                  @click="submitUpload"
                  >{{ $comm.getLangSpecInfoLabel('L0000001934') }}
                </el-button>
              </el-upload>
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>

    <b-row class="mt-3">
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- 업로드 및 저장결과 -->
            <!-- <y-label
              label="L0000001937"
              icon="user-edit"
              color-class="cutstom-title-color"
            /> -->
            <y-auigrid
              ref="yAuiGrid"
              :name="gridSuccessHeaderOptions.name"
              :headers="gridSuccessHeaderOptions.header"
              :height="gridSuccessHeaderOptions.height"
              :label="this.$comm.getLangSpecInfoLabel('L0000001937')"
              :useExcelExport="false"
              :enableSorting="true"
              :showGridSetSave="true"
              :useContextMenu="true"
              :enableRightDownFocus="true"
              :showGridCtrl="true"
              :softRemoveRowMode="false"
              :showRowCheckColumn="true"
            />
          </b-col>
        </b-row>
      </b-col>
    </b-row>

    <b-row class="mt-3">
      <b-col sm="12">
        <b-col sm="12" class="px-0">
          <!-- 오류정보(실패한 사유에 대한 정보) -->
          <!-- <y-data-table
            ref="dataTable"
            label="L0000002022"
            :headers="gridErrorHeaderOptions"
            :items="gridErrorData"
            :use-paging="true"
          /> -->
          <y-auigrid
            ref="yAuiGrid2"
            :editable="editable"
            :name="gridErrorHeaderOptions.name"
            :headers="gridErrorHeaderOptions.header"
            :height="gridErrorHeaderOptions.height"
            :label="this.$comm.getLangSpecInfoLabel('L0000002022')"
            :useExcelExport="false"
            :enableSorting="true"
            :showGridSetSave="true"
            :useContextMenu="true"
            :enableRightDownFocus="true"
            :showGridCtrl="true"
            :softRemoveRowMode="false"
            :showRowCheckColumn="true"
          />
        </b-col>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
import backendConfig from '@/js/backendConfig.js';
import { getAccessToken } from '@/utils/auth';
export default {
  name: 'diagnose-result-upload',
  props: {},
  data() {
    return {
      uploadFile: {
        checkupYear: '',
        file: null,
        // heaCheckupPlanPeriod: [],
        plantCd: '',
        heaCheckupClassCd: '',
        heaCheckupClassNm: '',
        startDate: null,
        endDate: null,
      },
      uploadResult: {
        classNm: '',
        totalCount: 0,
        successCount: 0,
        failCount: 0,
      },
      errorInfo: {
        classNm: '',
        failRow: 0,
        failMessage: '',
        remark: '',
      },
      editable: true,
      SAuiGrid: null,
      EAuiGrid: null,
      gridUploadData: [],
      gridSuccessHeaderOptions: {
        name: 'successUpload',
        data: [],
        header: [],
        height: '200',
      },
      gridErrorData: [],
      gridErrorHeaderOptions: {
        name: 'errorUpload',
        data: [],
        header: [],
        height: '200',
      },

      heaCheckupPlanNoItems: [],
      heaCheckupOrgItems: [
        {
          heaCheckupOrgNo: null,
          heaCheckupOrgNm: this.$comm.getLangSpecInfoLabel('L0000005745'), // '검진계획을 선택하세요',
        },
      ],

      downloadUrl: '',
      searchPlanDetailUrl: '',

      uploadHeader: {},
      uploadParam: {
        taskClassNm: 'CHECKUP_RESULT',
        taskKey: '',
        heaCheckupPlanNo: null,
        heaCheckupOrgNo: null,
        createUserId: '',
      },
      loading: false,
      uploadList: [],
      uploadMessage: '',
    };
  },
  watch: {
    'uploadFile.checkupYear': function (newValue, oldValue) {
      this.getHeaCheckupPlanNoItems();
    },
    'uploadParam.heaCheckupPlanNo': function (newValue, oldValue) {
      if (this.uploadParam.heaCheckupPlanNo) {
        let data = this.$_.find(this.heaCheckupPlanNoItems, {
          heaCheckupPlanNo: this.uploadParam.heaCheckupPlanNo,
        });
        if (data) {
          // 검진계획 하나에 검진종류 하나가 매핑 됨으로 처음꺼로 바로 적용
          this.uploadFile.heaCheckupClassCd = data.heaCheckupClassCd;
          this.uploadFile.heaCheckupClassNm = data.heaCheckupClassNm;
          this.getPlanDetail(data);
        }
      }
    },
    'uploadFile.plantCd': function (newValue, oldValue) {
      this.getHeaCheckupPlanNoItems();
    },
    'uploadFile.heaCheckupClassCd': function (newValue, oldValue) {
      this.getHeaCheckupPlanNoItems();
    },
  },
  /** Vue lifecycle: created, mounted, destroyed, etc **/
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {
    this.SAuiGrid = this.$refs.yAuiGrid;
    this.EAuiGrid = this.$refs.yAuiGrid2;
  },
  beforeDestory() {
    this.init();
  },
  /** methods **/
  methods: {
    init() {
      // URL 셋팅
      this.searchPlanDetailUrl = selectConfig.hea.checkupPlan.get.url;
      this.downloadUrl = selectConfig.hea.checkupResult.excel.url;
      this.uploadUrl = backendConfig.getUrl(
        transactionConfig.hea.checkupResult.upload.url
      );

      this.uploadHeader = {
        'X-Authorization': getAccessToken(),
      };

      // 선택항목 설정
      let today = this.$comm.getToday();
      this.uploadFile.heaCheckupPlanPeriod = [today, today];
      this.uploadFile.checkupYear = this.$comm.getThisYear();

      this.uploadParam.createUserId = this.$store.getters.token;

      this.getHeaCheckupPlanNoItems();
      // 그리드 헤더 설정
      this.gridSuccessHeaderOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002520'),
          dataField: 'totalCount',
          width: '33%',
          align: 'center',
        }, // 전체 Row 수
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004878'),
          dataField: 'successCount',
          width: '33%',
          align: 'center',
        }, // 유효한 row 수
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001816'),
          dataField: 'failCount',
          width: '34%',
          align: 'center',
        }, // 실패 Row 수
      ];

      this.gridErrorHeaderOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001814'),
          dataField: 'failRow',
          width: '20%',
          align: 'center',
        }, // 실패 Row No
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001817'),
          dataField: 'failMessage',
          width: '50%',
        }, // 실패 사유
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001360'),
          dataField: 'remark',
          width: '30%',
        }, // 비고
      ];
    },
    textCalculate(_row, _name) {
      var text = _row[_name];
      if (text) {
        text = text.replace(/\n/g, '<br/>');
      }
      return text;
    },
    submitUpload() {
      // 파일이 있는지 여부 확인
      if (this.$refs.upload.uploadFiles.length === 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000001934', // 업로드
          message: 'M0000000083', // '업로드할 파일이 없습니다. 파일을 선택하세요',
          type: 'warning',
        });
        return;
      }
      var uploadFileName = this.$refs.upload.uploadFiles[0].name.toLowerCase();
      if (uploadFileName.indexOf('xlsx') === -1) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003874', // '파일형식 오류',
          message: 'M0000000900', // '업로드 파일은 XLSX 형식이어야 합니다.',
          type: 'warning',
        });
        return;
      }
      if (!this.uploadParam.heaCheckupPlanNo) {
        window.getApp.$emit('ALERT', {
          title: 'L00000033950', // '안내',
          message: 'M0000000437', // '검진계획을 선택하셔야 업로드가 가능합니다.',
          type: 'warning',
        });
        return;
      }
      if (!this.uploadParam.heaCheckupOrgNo) {
        window.getApp.$emit('ALERT', {
          title: 'L00000033950', // '안내',
          message: 'M0000000438', // '검진기관을 선택하셔야 업로드가 가능합니다.',
          type: 'warning',
        });
        return;
      }
      var nowDate = new Date();
      this.uploadParam.taskKey = nowDate.getTime().toString();
      this.loading = true;
      this.$refs.upload.submit();
    },
    onSuccess(response, file, fileList) {
      this.loading = false;
      this.$refs.upload.clearFiles();
      this.gridErrorData = [];
      if (response.success) {
        let msg = this.getConfirmMsg(response.uploadResult);
        this.gridErrorData = response.errorInfo;
        this.uploadMessage = msg;
      } else {
        this.uploadMessage = response.message;
      }
    },
    onError(err, file, fileList) {
      this.loading = false;
      console.log(JSON.stringify(err));
      // 인증오류처리
      window.getApp.$emit(
        'APP_REQUEST_ERROR',
        'M0000000086'
        // '업로드에 실패했습니다. 재시도 시에도 지속적으로 문제가 발생한다면 관리자에게 문의해 주세요.'
      );
      return;
    },
    getConfirmMsg(result) {
      if (!result) {
        return;
      }
      var returnMsg = '';
      if (
        !result[0].totalCount &&
        !result[1].totalCount &&
        !result[2].totalCount
      ) {
        returnMsg = 'M0000000084';
        // '업로드한 파일에 업로드할 데이터가 없습니다. 업로드할 데이터가 있는지 다시한번 확인해 주세요.';
      } else {
        returnMsg = String(
          // 검진소견결과
          '[' +
            result[0].classNm +
            ']<br />' +
            '총 ' +
            result[0].totalCount +
            '건<br />완료 : ' +
            result[0].successCount +
            '건<br />저장불가 : ' +
            result[0].failCount +
            '건<br />' +
            // 검진질환및판정결과
            '[' +
            result[1].classNm +
            ']<br />' +
            '총 ' +
            result[1].totalCount +
            '건<br />완료 : ' +
            result[1].successCount +
            '건<br />저장불가 : ' +
            result[1].failCount +
            '건<br />' +
            // 검진항목별결과
            '[' +
            result[2].classNm +
            ']<br />' +
            '총 ' +
            result[2].totalCount +
            '건<br />완료 : ' +
            result[2].successCount +
            '건<br />저장불가 : ' +
            result[2].failCount +
            '건'
        );
      }
      return returnMsg;
    },
    getHeaCheckupPlanNoItems() {
      // 검진계획 선택항목 조회
      this.$http.url = selectConfig.hea.checkupPlan.list.url;
      this.$http.type = 'GET';
      this.$http.param = {
        plantCd: this.uploadFile.plantCd,
        startDate: this.uploadFile.checkupYear,
        endDate: this.uploadFile.checkupYear,
      };
      this.$http.request(
        (_result) => {
          _result.data.splice(0, 0, {
            heaCheckupPlanNo: null,
            heaCheckupPlanNm:
              this.$comm.getLangSpecInfoLabel('L0000003394') /* 선택하세요 */,
          });
          this.heaCheckupPlanNoItems = _result.data;
          if (
            this.$_.findIndex(this.heaCheckupPlanNoItems, {
              heaCheckupPlanNo: this.uploadParam.heaCheckupPlanNo,
            }) === -1
          ) {
            this.uploadParam.heaCheckupPlanNo = null;
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    getPlanDetail(data) {
      if (!data || !data.heaCheckupPlanNo) {
        return;
      }
      this.$http.url = this.$format(
        this.searchPlanDetailUrl,
        data.heaCheckupPlanNo
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.heaCheckupOrgItems = _result.data.checkupPlanOrgs;
          this.heaCheckupOrgItems.splice(0, 0, {
            heaCheckupOrgNo: null,
            heaCheckupOrgNm:
              this.$comm.getLangSpecInfoLabel('L0000003394') /* 선택하세요 */,
          });
          if (
            this.$_.findIndex(this.heaCheckupOrgItems, {
              heaCheckupOrgNo: this.uploadParam.heaCheckupOrgNo,
            }) === -1
          ) {
            this.uploadParam.heaCheckupOrgNo = null;
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    closePopup(data) {
      this.$emit('closePopup');
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
    btnDownloadFormClicked(checkupType) {
      if (checkupType === 'normal') {
        this.downloadUrl = selectConfig.hea.checkupResult.excel.normal.url;
      } else if (checkupType === 'special') {
        this.downloadUrl = selectConfig.hea.checkupResult.excel.special.url;
      }

      let thisVue = this;
      let accept = this.$comm.getAccept('xlsx');
      let _comm = this.$comm;
      this.$http.url = this.downloadUrl; // BASE64를 UTF-8인코딩한 바이트로 다운받음 (그렇지 않으면 FRONT에서 JSON이 깨짐)
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          var url = window.URL || window.webkitURL;
          let link = document.createElement('a');
          var blob = thisVue.$comm.base64ToBlob(_result.data, accept);
          if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            if (checkupType === 'normal') {
              window.navigator.msSaveOrOpenBlob(
                blob,
                '일반검진결과_엑셀업로드양식.xlsx'
              );
            } else if (checkupType === 'special') {
              window.navigator.msSaveOrOpenBlob(
                blob,
                '특수검진결과_엑셀업로드양식.xlsx'
              );
            }
          } else {
            let link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            if (checkupType === 'normal') {
              link.download = '일반검진결과_엑셀업로드양식.xlsx';
            } else if (checkupType === 'special') {
              link.download = '특수검진결과_엑셀업로드양식.xlsx';
            }

            link.click();
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
  },
};
</script>
