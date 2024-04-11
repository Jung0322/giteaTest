<!--
  목적 : 공통 > 결재승인 팝업
  Detail : 결재승인 화면
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <!-- 검색 -->
    <b-row>
      <b-col sm="12">
        <b-row v-if="rejectFlag">
          <b-col sm="12">
            <!-- 결재선 -->
            <y-label
              label="L0000000429"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 재결재요청 -->
              <y-btn
                title="L0000003856"
                color="black"
                @btnClicked="requestAppr"
              />
              <!-- 결재선변경 -->
              <y-btn
                title="L0000000435"
                color="blue"
                @btnClicked="changeApprLine"
              />
              <!-- 닫기 -->
              <y-btn title="L0000000881" @btnClicked="closePop" />
            </div>
          </b-col>
        </b-row>
        <b-card v-if="rejectFlag" class="mb-3">
          <b-row>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              <b-row>
                <b-col sm="2">
                  <!-- 결재선 -->
                  <y-label label="L0000000429" />
                </b-col>
                <b-col>
                  <b>
                    <span
                      v-for="(item, index) in apprRqst.apprLines"
                      :key="index"
                    >
                      <span
                        v-if="item.delegatorId && item.delegatorId.length > 0"
                        >{{ item.delegatorNm }}({{
                          $comm.getLangSpecInfoLabel('L0000003799')
                        }})</span
                      >
                      <!-- 대리결재 -->
                      <span v-else
                        >{{ item.userNm }}({{
                          $comm.getLangSpecInfoLabel('L0000003800')
                        }})</span
                      >
                      <!-- 결재 -->
                      <span v-if="index + 1 < apprRqst.apprLines.length"
                        >&nbsp;&nbsp;▷</span
                      >
                    </span>
                  </b>
                </b-col>
              </b-row>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              <!-- 결재요청명 -->
              <y-text
                :width="10"
                :editable="true"
                :required="true"
                :maxlength="100"
                ui="bootstrap"
                label="L0000000439"
                name="apprRqstNm"
                v-model="apprRqst.apprRqstNm"
                v-validate="'required'"
                :state="validateState('apprRqstNm')"
              />
            </b-col>
          </b-row>
        </b-card>
        <b-row>
          <b-col sm="12">
            <b-col sm="12" class="px-0">
              <div
                slot="buttonGroup"
                class="float-right mb-1"
                v-if="!rejectFlag"
              >
                <!-- 결재요청회수 -->
                <!-- <y-btn
                  v-if="collectCheck"
                  title="L0000003420"
                  color="black"
                  @btnClicked="btnCollectClickedCallback"
                  @btnClickedErrorCallback="btnClickedErrorCallback"
                /> -->
                <!-- 닫기 -->
                <!-- <y-btn title="L0000000881" @btnClicked="closePop" /> -->
              </div>
              <!-- 결재 이력 -->
              <!-- 결재 현황 -->
              <!-- <y-data-table
                ref="dataTable"
                :height="gridOptions.height"
                :headers="gridOptions.header"
                :items="gridOptions.data"
                :label="rejectFlag ? 'L0000003857' : 'L0000003858'"
                :popMode="true"
              ></y-data-table> -->
              <y-auigrid
                ref="yAuiGrid"
                :headers="gridOptions.header"
                :height="gridOptions.height"
                :items="gridOptions.data"
                :btns="gridOptions.btns"
                :label="rejectFlag ? 'L0000003857' : 'L0000003858'"
                :useExcelExport="false"
                @closePopup="closePopup"
                @btnCollectClickedCallback="btnCollectClickedCallback"
              />
            </b-col>
          </b-col>
        </b-row>
        <b-row class="mt-3"></b-row>
        <b-row>
          <b-col sm="12">
            <!-- 결재 상세 내용 -->
            <y-label
              label="L0000000418"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <y-label
              v-if="apprCnt > 1"
              :label="
                $comm.getLangSpecInfoLabel('L0000003405', {
                  s1: apprCnt ? apprCnt : 0,
                })
              "
              style="font-size: 15px"
            />
            <div v-if="apprCnt > 1" slot="buttonGroup" class="float-right mb-1">
              <!-- 이전 -->
              <y-btn title="< Prev" @btnClicked="movePrev" />
              <!-- 다음 -->
              <y-btn title="Next >" @btnClicked="moveNext" />
            </div>
          </b-col>
        </b-row>
        <b-card>
          <b-row>
            <b-col
              sm="12"
              md="12"
              lg="12"
              xl="12"
              class="col-xxl-12 mb-3"
              v-if="!rejectFlag"
            >
              <!-- 결재요청명 -->
              <y-text
                :width="10"
                :editable="false"
                :maxlength="100"
                ui="bootstrap"
                label="L0000000439"
                name="apprRqstNm"
                v-model="apprRqst.apprRqstNm"
              />
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              <el-tabs type="border-card" v-model="tabIndex">
                <el-tab-pane
                  v-for="(item, i) in tabItems"
                  :key="i"
                  stretch
                  class="default-tab-pane"
                >
                  <span v-if="tabItems.length === 1" slot="label">
                    <i class="el-icon-date"></i>
                    {{ item.title }}
                  </span>
                  <span v-if="tabItems.length !== 1" slot="label">
                    <i class="el-icon-date"></i>
                    {{ item.title + ' ' + (i + 1) }}
                  </span>
                  <keep-alive>
                    <component
                      ref="apprDetail"
                      :is="component"
                      v-if="component"
                      :popupParam.sync="apprParams[i]"
                    />
                  </keep-alive>
                </el-tab-pane>
              </el-tabs>
            </b-col>
          </b-row>
        </b-card>
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
  name: 'appr-request-detail',
  props: {
    popupParam: {
      type: Object,
      default: () => ({
        apprBizNo: 0,
        apprRqstNo: 0,
        bizApprStepCd: null,
      }),
    },
  },
  data() {
    return {
      apprRqst: {
        apprLines: [], // 결재선 목록
        apprRqstNm: null, // 결재요청명
      },
      gridOptions: {
        header: [],
        data: [],
        height: '300',
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
      component: null, // 콤포넌트
      getUrl: '', // 결재 정보 상세 조회 url
      insertUrl: '',
      rejectFlag: false,
      collectCheck: false,
      collectUrl: '',
      apprParams: [], // 콤포넌트 전달 파라미터
      tabIndex: 0,
      tabItems: [],
      apprCnt: 0,
      YAuiGrid: null,
    };
  },
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;
    this.getApprLineDetail();
  },
  methods: {
    init() {
      this.getUrl = selectConfig.manage.appr.getRejectDetail.url;
      this.insertUrl = transactionConfig.manage.apprRequest.edit.url;
      this.collectUrl = transactionConfig.manage.appr.collect.url;
      this.$_.extend(this.apprRqst, this.popupParam);

      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000445'), // 결재유형
          dataField: 'apprTypeNm',
          width: '16%',
          style: 'center-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000451'), // 결재진행단계
          dataField: 'apprStepNm',
          width: '16%',
          style: 'center-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000427'), // 결재부서
          dataField: 'apprUserDeptNm',
          width: '17%',
          style: 'center-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000448'),
          dataField: 'apprUserNm',
          width: '17%',
          style: 'center-align',
        }, // 결재자
        // {
        //   text: 'L0000000904', // 대결재부서
        //   name: 'delegatorDeptNm',
        //   width: '100px',
        //   align: 'center',
        // },
        // {
        //   text: 'L0000000905', // 대결재자
        //   name: 'delegatorNm',
        //   width: '100px',
        //   align: 'center',
        // },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000447'),
          dataField: 'apprDt',
          width: '17%',
          style: 'center-align',
        }, // 결재일시
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002206'),
          dataField: 'apprRemark',
          width: '17%',
        }, // 의견
      ];

      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000003420'),
          btnClicked: 'btnCollectClickedCallback',
          color: 'black',
          visible:
            !this.rejectFlag && this.popupParam.bizApprStepCd === 'BAPSA',
        }, // 결재요청 회수
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000881'),
          btnClicked: 'closePopup',
          visible:
            !this.rejectFlag && this.popupParam.bizApprStepCd !== 'BAPSD',
        }, // 닫기
      ];
      this.getApprLineDetail(); // 결재 정보 상세 조회(반려 결재 이력포함)
    },
    // 결재 정보 상세 조회 (반려 결재 이력포함)
    getApprLineDetail() {
      this.$http.url = this.$format(this.getUrl, this.apprRqst.apprRqstNo);
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          console.log('a', _result.data);
          this.$_.extend(this.apprRqst, _result.data);
          this.apprRqst.apprLines = this.$_.clone(
            _result.data.apprRqstLineList
          );
          /* this.gridOptions.data = this.$_.clone(
            _result.data.apprRqstLineHistoryList
          ); */
          this.YAuiGrid.setGridData(_result.data.apprRqstLineHistoryList);

          this.getCollectable();

          if (this.apprRqst.bizApprStepCd === 'BAPSD') {
            this.rejectFlag = true;
          } else {
            this.rejectFlag = false;
          }
          this.gridOptions.data.forEach((item) => {
            if (item.apprStepCd === 'APSPA' && item.apprTypeCd === 'APTP0') {
              // 승인, 기안인 상황
              item.apprStepNm = this.$comm.getLangSpecInfoLabel('L0000002039'); // 완료
            }
          });

          this.apprParams['apprRqstNo'] = this.apprRqst.apprRqstNo;

          // 콤포넌트 전달 파라미터
          let params = this.$_.split(this.apprRqst.apprReqParameter, '|');
          this.$_.forEach(params, (element) => {
            if (element !== '') {
              this.apprCnt = this.$_.split(
                this.$_.split(element, ':')[1],
                ','
              ).length;
            }
          });

          for (let i = 0; i < this.apprCnt; i++) {
            this.apprParams.push({ apprFlag: true, apprConfirmFlag: true });
            this.tabItems.push({
              title: this.$comm.getLangSpecInfoLabel('L0000005148'),
              url: this.apprRqst.apprUrl,
            });

            this.$_.forEach(params, (element) => {
              this.apprParams[i][this.$_.split(element, ':')[0]] =
                this.$_.split(this.$_.split(element, ':')[1], ',')[i];
            });
            this.loadComponent();
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    // 걸재 상세 내용 첨부
    loadComponent() {
      var path = this.tabItems[this.tabIndex].url;
      this.component = () => import(`@/pages${path}`);
    },
    // 닫기
    closePop() {
      this.$emit('closePopup', {});
    },
    closePopup() {
      this.$emit('closePopup', {});
    },
    // 재결재요청
    requestAppr() {
      if (this.apprRqst.apprLines.length <= 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // 안내
          message: 'M0000000520', // 결재선을 지정해주세요.
          type: 'warning', // success / info / warning / error
        });
        return;
      } else {
        this.$validator
          .validateAll()
          .then((_result) => {
            if (_result) {
              window.getApp.$emit('CONFIRM', {
                title: 'L0000003321', // 확인
                message: 'M0000000522', // 재결재요청 하시겠습니까?
                // TODO : 필요시 추가하세요.
                type: 'info', // success / info / warning / error
                // 확인 callback 함수
                confirmCallback: () => {
                  this.apprRqst.reqUserId = this.$store.getters.token;
                  this.apprRqst.plantCd = this.$store.getters.plantCd;

                  this.$http.url = this.insertUrl;
                  this.$http.type = 'PUT';
                  this.$http.param = this.apprRqst;
                  this.$http.request(
                    (_result) => {
                      if (_result.data > 0) {
                        window.getApp.$emit('ALERT', {
                          title: 'L0000003395', // 안내
                          message: 'M0000000509', // 결재요청 되었습니다.
                          type: 'success', // success / info / warning / error
                        });
                        this.$emit('closePopup', { resultFlag: true });
                      } else {
                        window.getApp.$emit('ALERT', {
                          title: 'L0000003396', // 에러
                          message: 'M0000000505', // 결재요청 처리중 오류가 발생하였습니다.
                          type: 'error', // success / info / warning / error
                        });
                        this.$emit('closePopup', { resultFlag: false });
                      }
                    },
                    (_error) => {
                      window.getApp.$emit('APP_REQUEST_ERROR', _error);
                    }
                  );
                },
                // 취소 callback 함수
                cancelCallback: () => {},
              });
            } else if (!_result) {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395', // 안내
                message: 'M0000000005', // 필수입력값을 입력해주세요.
                type: 'warning', // success / info / warning / error
              });
            }
          })
          .catch(() => {
            window.getApp.$emit(
              'APP_VALID_ERROR',
              'M0000000876' // 유효성 검사도중 에러가 발생하였습니다.
            );
          });
      }
    },
    // 결재선변경
    changeApprLine() {
      this.popupOptions.target = () =>
        import(`${'@/pages/manage/appr/comApprLinePopup.vue'}`);
      this.popupOptions.title = 'L0000000435'; // 결재선 변경
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closeApprLinePop;
      this.popupOptions.width = '95%';
      this.popupOptions.param = {
        apprLines: this.apprRqst.apprLines,
      };
    },
    closeApprLinePop(data) {
      this.apprRqst.apprLines = data.apprLineList;
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
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
    getCollectable() {
      if (!this.popupParam.apprRqstNo || this.popupParam.apprRqstNo <= 0) {
        return;
      }

      this.$http.url = this.$format(
        selectConfig.manage.appr.getCollect.url,
        this.popupParam.apprRqstNo,
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
          this.popupParam.apprRqstNo
        );
        this.$http.type = 'PUT';

        this.$http.request(
          (_result) => {
            window.getApp.$emit('ALERT', {
              title: 'L0000003395', // 안내
              message: 'M0000000507', // 회수되었습니다.
              type: 'success', // success / info / warning / error
            });
            this.closePop();
          },
          (_error) => {
            this.$emit('APP_REQUEST_ERROR', _error);
          }
        );
      } else {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // 안내
          message: 'M0000000506', // 이미 결재된 문서입니다.
          type: 'warning', // success / info / warning / error
        });
        this.closePop();
      }
    },
    btnClickedErrorCallback(_error) {
      window.getApp.$emit('APP_REQUEST_ERROR', _error);
    },
    // Detail 이전
    movePrev() {
      if (Number(this.tabIndex) > 0) {
        this.tabIndex = (Number(this.tabIndex) - 1).toString();
      }
    },
    // Detail 다음
    moveNext() {
      if (Number(this.tabIndex) < this.tabItems.length - 1) {
        this.tabIndex = (Number(this.tabIndex) + 1).toString();
      }
    },
    /** method end */
  },
};
</script>
