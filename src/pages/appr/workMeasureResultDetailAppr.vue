<!--
  목적 : 보건 > 작업환경측정 > 작업환경측정 계획 상세/등록/수정/삭제
  Detail : 작업환경 측정 계획 상세/등록/수정/삭제 화면
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <b-row>
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- 작업환경측정 결과 상세 -->
            <y-label
              label="L0000004356"
              icon="user-edit"
              color-class="cutstom-title-color"
            ></y-label>
            <div slot="buttonGroup" class="float-right mb-1">
              <y-btn
                v-if="!disabled"
                title="L0000002474"
                color="orange"
                @btnClicked="btnSave"
              />
            </div>
          </b-col>
        </b-row>

        <b-card>
          <b-row>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <b-row>
                <b-col sm="4">
                  <!-- 사업장 -->
                  <y-label label="L0000001415" />
                </b-col>
                <b-col sm="8">
                  <y-label :label="workMeasurePlan.plantNm" :fieldable="true" />
                </b-col>
              </b-row>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <b-row>
                <b-col sm="4">
                  <!-- 측정년도 -->
                  <y-label label="L0000002931" />
                </b-col>
                <b-col sm="8">
                  <y-label :label="workMeasurePlan.year" :fieldable="true" />
                </b-col>
              </b-row>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <b-row>
                <b-col sm="4">
                  <!-- 분기 -->
                  <y-label label="L0000001337" />
                </b-col>
                <b-col sm="8">
                  <y-label
                    :label="workMeasurePlan.halfYearNm"
                    :fieldable="true"
                  />
                </b-col>
              </b-row>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <b-row>
                <b-col sm="4">
                  <!-- 측정기간 -->
                  <y-label label="L0000002929" />
                </b-col>
                <b-col sm="8">
                  <y-label
                    :label="workMeasurePlan.measPeriod"
                    :fieldable="true"
                  />
                </b-col>
              </b-row>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
              <b-row>
                <b-col sm="2">
                  <!-- 측정기관 -->
                  <y-label label="L0000002930" />
                </b-col>
                <b-col sm="10">
                  <y-label
                    :label="workMeasurePlan.measAgency"
                    :fieldable="true"
                  />
                </b-col>
              </b-row>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
              <b-row>
                <b-col sm="2">
                  <!-- 측정계획명 -->
                  <y-label label="L0000002926" />
                </b-col>
                <b-col sm="10">
                  <y-label
                    :label="workMeasurePlan.measPlanNm"
                    :fieldable="true"
                  />
                </b-col>
              </b-row>
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>
    <b-row v-if="!disabled && editable" class="mt-3">
      <b-col sm="12">
        <b-card
          header-class="default-card bg-light"
          body-class="default-body-card"
          class="py-0"
        >
          <div slot="header">
            <div class="float-left">
              <!-- 엑셀업로드 -->
              <y-label label="L0000001969" />
            </div>
            <!-- <div class="float-right mb-1">
              <y-btn title="양식" @btnClicked="downTemplete" />
            </div> -->
          </div>
          <b-row>
            <b-col sm="12">
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
                <!-- 22.01.06 lhj 양식버튼 위치 변경 -->
                <!-- 양식 -->
                <el-button
                  slot="tip"
                  size="small"
                  type="info"
                  class="float-left"
                  @click="downTemplete"
                  >{{ $comm.getLangSpecInfoLabel('L0000004357') }}</el-button
                >
                <!-- 파일선택 -->
                <el-button
                  style="margin-left: 10px"
                  size="small"
                  type="primary"
                  >{{ $comm.getLangSpecInfoLabel('L0000003028') }}</el-button
                >
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
            </b-col>
            <b-col
              v-if="uploadList && uploadList.length > 0"
              sm="12"
              class="mt-3"
            >
              <el-collapse accordion>
                <el-collapse-item name="1">
                  <!-- 업로드결과내역 -->
                  <template slot="title">
                    업로드결과내역&nbsp;&nbsp;
                    <el-tag size="medium" type="danger">
                      <!-- 마지막에 업로드한 내역만
                      보입니다. -->
                      <i class="el-icon-info"></i>
                      {{ $comm.getLangSpecInfoLabel('M0000001040') }}
                    </el-tag>
                  </template>
                  <!-- 업로드 결과 목록 -->
                  <y-data-table
                    ref="dataTable"
                    :height="gridOptions.height"
                    :headers="gridOptions.header"
                    :items="uploadList"
                    :useRownum="false"
                    label="L0000001935"
                  ></y-data-table>
                </el-collapse-item>
              </el-collapse>
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>
    <el-tabs
      type="border-card"
      class="mt-3"
      v-model="tabIndex"
      @tab-click="tabClick"
    >
      <el-tab-pane
        v-for="(item, i) in tabItems"
        :key="i"
        stretch
        class="default-tab-pane"
        :name="i.toString()"
      >
        <span slot="label">
          <i class="el-icon-date"></i>
          {{ item.title }}
        </span>
      </el-tab-pane>
      <keep-alive>
        <component
          v-if="component"
          :is="component"
          :research="research"
          :disabled="disabled"
          :workMeasurePlan.sync="workMeasurePlan"
          :tabIndex="tabIndexParam"
          @getWorkMeasureChemResults="getWorkMeasureChemResults"
          @getWorkMeasurePhysResults="getWorkMeasurePhysResults"
        />
      </keep-alive>
    </el-tabs>
    <y-dialog :param="popupOptions"></y-dialog>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
import backendConfig from '@/js/backendConfig.js';
import { getAccessToken } from '@/utils/auth';
export default {
  name: 'work-measure-result-detail-appr',
  props: {
    popupParam: {
      type: Object,
      default: {
        workMeasPlanNo: null, // 작업환경측정 계획 번호
      },
    },
  },
  data() {
    return {
      workMeasurePlan: {
        workMeasPlanNo: null, // 작업환경측정 계획 번호
        plantCd: null, // 사업장코드
        year: null, // 측정년도
        halfYearCd: null, // 분기
        measAgency: null, // 측정기관
        measPeriod: null, // 측정기간
        measPlanNm: null, // 측정계획명
        workMeasStateCd: null, // 측정계획 단계코드
        updateUserId: null, // 수정자ID
        workMeasurePlanTargets: [], // 대상 및 범위
      },
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        param: null,
        width: '80%',
        top: '10px',
        closeCallback: null,
      },
      gridOptions: {
        header: [],
        data: [],
        height: '500',
      },
      tabItems: [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000003320'),
          url: 'workMeasureResultChem',
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001050'),
          url: 'workMeasureResultPhys',
        },
      ],

      editable: false,
      disabled: false,

      tabIndexParam: '',
      component: null,
      tabIndex: 0,

      uploadHeader: {},
      uploadParam: {
        workMeasPlanNo: 0,
        plantCd: '',
        year: '',
        halfYearCd: '',
        measAgency: '',
        createUserId: '',
      },
      uploadList: [],
      loading: false,
      research: false,
    };
  },
  computed: {},
  watch: {
    tabIndex: function (newValue, oldValue) {
      this.loadComponent();
    },
  },
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
  },
  mounted() {
    this.init();
  },
  beforeDestroy() {},
  /** methods **/
  methods: {
    init() {
      this.editable = this.$route.meta.editable;
      this.uploadUrl = backendConfig.getUrl(
        transactionConfig.hea.workMeasureResult.excelUpload.url
      );

      this.uploadHeader = {
        'X-Authorization': getAccessToken(),
      };

      this.gridOptions.header = [
        {
          text: 'L0000001818',
          name: 'failMessage',
          width: '150px',
        }, // 실패내용
        {
          text: 'L0000000686',
          name: '',
          width: '130px',
          align: 'center',
        }, // 구분
        {
          text: 'L0000001332',
          name: 'deptCd',
          width: '150px',
          align: 'center',
        }, // 부서코드
        {
          text: 'L0000000549',
          name: 'processCd',
          width: '150px',
          align: 'center',
        }, // 공정코드
        { text: 'L0000000878', name: 'workPlace', width: '150px' }, // 단위작업장소
        { text: 'L0000002199', name: 'hazardCd', width: '150px' }, // 유해인자코드
        {
          text: 'L0000000746',
          name: 'workerCnt',
          width: '110px',
          align: 'right',
          type: 'cost',
        }, // 근로자수
        {
          text: 'L0000002374',
          name: 'workContents',
          width: '110px',
          align: 'center',
        }, // 작업내용
        {
          text: 'L0000000748',
          name: 'shiftType',
          width: '180px',
          align: 'right',
        }, // 근로형태(근로시간)
        {
          text: 'L0000001085',
          name: 'occurType',
          width: '150px',
          align: 'right',
        }, // 발생형태 및 발생시간(주기)
        {
          text: 'L0000002198',
          name: 'occurTime',
          width: '150px',
          align: 'right',
        }, // 유해인자발생시간
        {
          text: 'L0000002948',
          name: 'measPsnNm',
          width: '170px',
          align: 'center',
        }, // 측정위치(근로자명)
        {
          text: 'L0000002942',
          name: 'measStartTime',
          width: '180px',
          align: 'center',
        }, // 측정시간(시작)
        {
          text: 'L0000002943',
          name: 'measEndTime',
          width: '180px',
          align: 'center',
        }, // 측정시간(종료)
        {
          text: 'L0000002953', // 측정일자
          name: 'measDt',
          width: '180px',
          align: 'center',
        },
        {
          text: 'L0000002965',
          name: 'measCnt',
          width: '150px',
          type: 'cost',
          align: 'right',
        }, // 측정횟수
        {
          text: 'L0000002962',
          name: 'measValue',
          width: '150px',
          type: 'cost',
          align: 'right',
        }, // 측정치
        {
          text: 'L0000001732', // 시간가중 평균치
          child: [
            {
              text: 'L0000002529',
              name: 'twaPrev',
              width: '120px',
              align: 'right',
              type: 'cost',
            }, // 전회
            {
              text: 'L0000000766',
              name: 'twaCurr',
              width: '120px',
              align: 'right',
              type: 'cost',
            }, // 금회
          ],
        },
        {
          text: 'L0000000845',
          name: 'exposureStd',
          width: '130px',
          align: 'center',
        }, // 노출기준
        {
          text: 'L0000000847',
          name: 'exposureExcessFlag',
          width: '110px',
          align: 'center',
        }, // 노출기준초과여부
        {
          text: 'L0000002933',
          name: 'measMethod',
          width: '150px',
        }, // 측정방법
        {
          text: 'L0000001360',
          name: 'remark',
          width: '120px',
        }, // 비고
      ];

      this.getDetail();
    },
    getDetail() {
      if (!this.popupParam.workMeasPlanNo) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395' /* 안내 */,
          message: 'M0000000082', // 해당문서에 오류가 있습니다. 관리자에게 문의바랍니다.
          type: 'warning',
        });
        this.btnClosePopup();
      }
      this.$http.url = this.$format(
        selectConfig.hea.workMeasurePlan.getPlanResult.url,
        this.popupParam.workMeasPlanNo
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          _result.data.measPeriod =
            _result.data.measDtSta + ' ~ ' + _result.data.measDtEnd;
          this.workMeasurePlan = this.$_.clone(_result.data);
          if (this.workMeasurePlan.workMeasStateCd === 'WMS40') {
            // WMS10: 계획등록, WMS20: 계획접수, WMS30: 결과입력중, WMS40: 결과완료
            // 완료 상태일 경우 수정 불가
            this.disabled = true;
          }
          if (this.workMeasurePlan.bizApprStepCd === 'BAPSG') {
            // BAPSA: 결재중, BAPSD: 반려, BAPSG: 결재완료
            // 결재완료 상태일 경우 수정 불가
            this.disabled = true;
          }

          this.uploadParam = {
            workMeasPlanNo: this.workMeasurePlan.workMeasPlanNo,
            plantCd: this.workMeasurePlan.plantCd,
            year: this.workMeasurePlan.year,
            halfYearCd: this.workMeasurePlan.halfYearCd,
            measAgency: this.workMeasurePlan.measAgency,
            createUserId: this.$store.getters.token,
          };
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    loadComponent() {
      var path = this.tabItems[this.$_.parseInt(this.tabIndex)].url;
      this.component = () => import(`@/pages/hea/workMeasure/${path}`);
      // this.component = () => import(`${path}`);
    },
    /**
     * 자식 페이지에 넘길 paneName 정보 업데이트
     * tab 클릭시 마다
     * tab : 클릭한 tab 정보
     */
    tabClick(tab) {
      var nowDate = new Date();
      this.tabIndexParam = nowDate.getMilliseconds();
    },
    downTemplete() {
      let thisVue = this;
      let accept = this.$comm.getAccept('xlsx');
      // BASE64를 UTF-8인코딩한 바이트로 다운받음 (그렇지 않으면 FRONT에서 JSON이 깨짐)
      this.$http.url = selectConfig.hea.workMeasureResult.excelDown.url;
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          var url = window.URL || window.webkitURL;
          let link = document.createElement('a');
          var blob = thisVue.$comm.base64ToBlob(_result.data, accept);
          if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(
              blob,
              '작업환경측정결과_통합_양식_v1.0.xlsx'
            );
          } else {
            let link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = '작업환경측정결과_통합_양식_v1.0.xlsx';
            link.click();
          }
        },
        (_error) => {
          window.getApp.$emit('ALERT', {
            title: 'L0000001934', // 업로드
            message: 'M0000000474', // 첨부파일 다운로드시 오류가 발생했습니다.
            type: 'warning',
          });
        }
      );
    },
    // 업로드
    submitUpload() {
      // 파일이 있는지 여부 확인
      if (this.$refs.upload.uploadFiles.length === 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000001934', // 업로드
          message: 'M0000000083', // 업로드할 파일이 없습니다. 파일을 선택하세요
          type: 'warning',
        });
        return;
      }
      var uploadFileName = this.$refs.upload.uploadFiles[0].name.toLowerCase();
      if (uploadFileName.indexOf('xlsx') === -1) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003874', // 파일형식 오류
          message: 'M0000000900', // 업로드 파일은 XLSX 형식이어야 합니다.
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
        this.research = !this.research;
        window.getApp.$emit('ALERT', {
          title: 'L0000003875', // 업로드 결과
          message: msg,
          type: 'warning',
        });
      } else {
        window.getApp.$emit('ALERT', {
          title: 'L0000003875', // 업로드 결과
          message: response.message,
          type: 'warning',
        });
      }
    },
    onError(err, file, fileList) {
      this.loading = false;
      console.log(JSON.stringify(err));
      // 인증오류처리
      window.getApp.$emit(
        'APP_REQUEST_ERROR',
        'M0000000086' // 업로드에 실패했습니다. 재시도 시에도 지속적으로 문제가 발생한다면 관리자에게 문의해 주세요.
      );
      return;
    },
    getConfirmMsg(response) {
      var returnMsg = '';
      if (response.totCount === 0) {
        returnMsg = 'M0000000084'; // 업로드한 파일에 업로드할 데이터가 없습니다. 업로드할 데이터가 있는지 다시한번 확인해 주세요.
      } else {
        returnMsg = String(
          '총 ' +
            response.totCount +
            '건 (완료 : ' +
            response.completeCount +
            ', 실패 : ' +
            response.dontCount +
            ')이 업로드 되었습니다.'
        );
      }
      return returnMsg;
    },
    // apprBtnClicked() {
    //   let promises = [
    //     { func: this.confirmAppr },
    //     { func: this.openAppr },
    //   ];
    //   this.$comm.orderedPromise(promises);
    // },
    checkResult() {
      return new Promise((_resolve, _reject) => {
        this.$http.url = selectConfig.hea.workMeasureResult.list.url;
        this.$http.type = 'GET';
        this.$http.param = {
          workMeasPlanNo: this.workMeasurePlan.workMeasPlanNo,
        };
        this.$http.request(
          (_result) => {
            if (!_result.data || _result.data.length === 0) {
              window.getApp.$emit('ALERT', {
                title: 'L0000001934', // 업로드
                message: 'M0000000087', // 입력된 결과가 한 건도 없습니다.
                type: 'warning',
              });
              _resolve(false);
            } else {
              _resolve(true);
            }
          },
          (_error) => {}
        );
      });
    },
    // confirmAppr() {
    //   return new Promise((_resolve, _reject) => {
    //     window.getApp.$emit('CONFIRM', {
    //       title: '확인',
    //       message: '결재 요청하시겠습니까?',
    //       type: 'info',
    //       // 확인 callback 함수
    //       confirmCallback: () => {
    //         _resolve(true);
    //       },
    //       cancelCallback: () => {
    //         _resolve(false);
    //       },
    //     });
    //   });
    // },
    // openAppr() {
    //   return new Promise((_resolve, _reject) => {
    //     this.popupOptions.target = () => import(`${'@/pages/manage/appr/comApprRequest.vue'}`);
    //     this.popupOptions.title = '결재요청';
    //     this.popupOptions.visible = true;
    //     this.popupOptions.closeCallback = this.closeApprPop;
    //     this.popupOptions.width = '80%';
    //     this.popupOptions.param = {
    //       apprBizCd: 'HE-WM-02',
    //       apprParams: {
    //         workMeasPlanNo: this.workMeasurePlan.workMeasPlanNo,
    //       },
    //     };
    //     _resolve(true);
    //   });
    // },
    // closeApprPop(data) {
    //   this.popupOptions.target = null;
    //   this.popupOptions.visible = false;
    //   if (data && data.resultFlag) {
    //     this.getDetail();
    //   }
    // },
    btnClosePopup() {
      // 부모창에 값 전달
      this.$emit('closePopup', { success: true });
    },
    getWorkMeasureChemResults(data) {
      this.workMeasureChemResults = this.$_.clone(data);
    },
    getWorkMeasurePhysResults(data) {
      this.workMeasurePhysResults = this.$_.clone(data);
    },
    btnSave() {
      let promises = [
        { func: this.checkValidation },
        { func: this.confirm },
        { func: this.saveData },
      ];

      this.$comm.orderedPromise(promises);
    },
    checkValidation() {
      let deptFlag = true;
      let proccessFlag = true;
      let hazardFlag = true;
      let placeFlag = true;
      let measDtFlag = true;
      let valueFlag = true;
      let exposureStdFlag = true; // 노출기준 숫자여부
      this.workMeasurePlan.workMeasureResults =
        this.workMeasureChemResults.concat(this.workMeasurePhysResults);

      return new Promise((resolve) => {
        this.$_.forEach(this.workMeasurePlan.workMeasureResults, (row) => {
          if (!row.deptCd) {
            deptFlag = false;
          }

          if (!row.processCd) {
            proccessFlag = false;
          }

          if (!row.hazardCd) {
            hazardFlag = false;
          }

          if (!row.workPlace) {
            placeFlag = false;
          }

          if (!row.measDt) {
            measDtFlag = false;
          }

          if (!row.measValue) {
            valueFlag = false;
          }

          if (isNaN(row.exposureStd)) {
            exposureStdFlag = false;
          }
        });

        if (
          !deptFlag ||
          !proccessFlag ||
          !hazardFlag ||
          !placeFlag ||
          !valueFlag ||
          !measDtFlag
        ) {
          window.getApp.$emit('ALERT', {
            title: 'L0000003395', // '안내',
            message: 'M0000000005', // '필수 입력값을 입력해 주세요.',
            type: 'warning',
          });
          resolve(false);
        } else if (!exposureStdFlag) {
          window.getApp.$emit('ALERT', {
            title: 'L0000003395' /* 오류 */,
            message: `${this.$comm.getLangSpecInfoMessage(
              'M0000001572'
            )} (${this.$comm.getLangSpecInfoLabel('L0000000845')})`,
            type: 'warning',
          });
          resolve(false);
        } else {
          resolve(true);
        }
      });
    },
    confirm() {
      return new Promise((_resolve) => {
        window.getApp.$emit('CONFIRM', {
          title: 'L0000003321' /* 확인 */,
          message: 'M0000001042', // 결과를 저장하시겠습니까?
          type: 'info',
          // 확인 callback 함수
          confirmCallback: () => {
            _resolve(true);
          },
          cancelCallback: () => {
            _resolve(false);
          },
        });
      });
    },
    saveData() {
      return new Promise((resolve) => {
        this.$http.url = transactionConfig.hea.workMeasureResult.insert.url;
        this.$http.type = 'POST';
        this.$http.param = this.workMeasurePlan.workMeasureResults;
        this.$http.request(
          (_result) => {
            if (_result.data) {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395' /* 안내 */,
                message: 'M0000000006', // 저장되었습니다.
                type: 'success',
              });
              resolve(true);
            }
          },
          (_error) => {
            window.getApp.$emit('APP_REQUEST_ERROR');
            resolve(false);
          }
        );
      });
    },
  },
};
</script>
