<!--
  목적 : 공통 > 결재요청 문서 팝업
  Detail : 결재요청 화면
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <!-- 검색 -->
    <b-row ref="searchBox">
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- 결재선 -->
            <y-label label="L0000000429" icon="user-edit" color-class="cutstom-title-color" />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 결재요청 -->
              <y-btn title="L0000003418" color="black" @btnClicked="requestAppr" />
              <!-- 결재선변경 -->
              <y-btn title="L0000000435" color="blue" @btnClicked="changeApprLine" />
              <!-- 닫기 -->
              <y-btn title="L0000000881" @btnClicked="closePop" />
            </div>
          </b-col>
        </b-row>
        <b-card>
          <b-row>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              <b-row>
                <b-col sm="2">
                  <!-- 결재선 -->
                  <y-label label="L0000000429" />
                </b-col>
                <b-col>
                  <b>
                    <span v-for="(item, index) in apprRqst.apprLines" :key="index">
                      <span v-if="index == 0">
                        <font color="#04B404">{{item.userNm}}({{$comm.getLangSpecInfoLabel('L0000003798')}})</font> <!-- 기안 -->
                        <span v-if="apprRqst.apprLines.length > 1">
                          <font color="#04B404">&nbsp;&nbsp;▶</font>
                        </span>
                      </span>

                      <span v-else>
                        <span
                          v-if="item.delegatorId && item.delegatorId.length > 0"
                        >&nbsp;&nbsp;{{item.delegatorNm}}({{$comm.getLangSpecInfoLabel('L0000003799')}})</span><!-- 대리결재 -->
                        <span v-else>&nbsp;&nbsp;{{item.userNm}}({{$comm.getLangSpecInfoLabel('L0000003800')}})</span><!-- 결재 -->
                        <span v-if="index != apprRqst.apprLines.length - 1">&nbsp;&nbsp;▶</span>
                      </span>
                      <!-- <span
                        v-if="item.apprStepCd == null && index + 1 < apprRqst.apprLines.length"
                      >&nbsp;&nbsp;▷</span>-->
                    </span>
                  </b>
                </b-col>
                <!-- <b-col sm="2">
                  <y-label label="결재선" />
                </b-col>
                <b-col>
                  <b>
                    <span v-for="(item, index) in apprRqst.apprLines" :key="index">
                      {{item.userNm}}
                      <span
                        v-if="index + 1 < apprRqst.apprLines.length"
                      >&nbsp;&nbsp;▷</span>
                    </span>
                  </b>
                </b-col>-->
              </b-row>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              <!-- 결재요청명 -->
              <y-text
                :width="10"
                :editable="editable"
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
        <b-row class="mt-3">
          <b-col sm="12">
            <!-- 결재 상세 내용 -->
            <y-label label="L0000000418" icon="user-edit" color-class="cutstom-title-color" />
            <y-label v-if="apprCnt > 1" :label="$comm.getLangSpecInfoLabel('L0000003405', { s1: apprCnt ? apprCnt : 0 })" style="font-size:15px;" />
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
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              <el-tabs type="border-card" v-model="tabIndex">
                <el-tab-pane
                  v-for="(item, i) in tabItems"
                  :key="i"
                  stretch
                  :class="tabIndex === i ? 'is-active' : ''"
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
  name: 'com-appr-multi-request',
  props: {
    popupParam: {
      type: Object,
      default: () => ({
        apprBizCd: '', // 결재문서유형코드
        apprRqstNo: null, // 결재문서번호
        apprParams: {},
      }),
    },
  },
  data() {
    return {
      apprRqst: {
        apprBizNo: 0, // 결재문서마스터번호
        plantCd: '', // 사업장코드
        apprReqParameter: '', // 결재요청파라미터
        reqUserId: '', // 요청자 ID
        apprLines: [], // 결재선 목록
        apprRqstNm: '', // 결재요청명
        papprRqstNo: null,
      },
      apprParams: [], // 콤포넌트 전달 파라미터
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
      insertUrl: '', // 결재 정보 등록 url
      tabIndex: 0,
      tabItems: [],
      apprCnt: 0,
    };
  },
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {},
  beforeDestroy() {},
  methods: {
    init() {
      this.editable = this.$route.meta.editable;
      this.getUrl = selectConfig.manage.apprRequest.get.url;
      this.insertUrl = transactionConfig.manage.apprRequest.insert.url;

      this.getApprLine(this.popupParam.apprBizCd);    
    },
    // 결재선 정보 상세 조회
    getApprLine(apprBizCd) {
      this.$http.url = this.getUrl;
      this.$http.param = {
        apprBizCd: apprBizCd,
        plantCd: this.$store.getters.plantCd,
        userId: this.$store.getters.token,
      };
      this.$http.type = 'GET';
      this.$http.request(
        _result => {
          if (_result.data) {
            if (_result.data.apprLines) {
              this.apprRqst.apprLines = this.$_.clone(_result.data.apprLines); // 결재선
              // this.apprRqst.apprLines.splice(0, 0, {
              //   userNm: this.$store.getters.name,
              //   deptNm: this.$store.getters.deptNm,
              // });
            } else {
              // window.getApp.$emit('ALERT', {
              //   title: 'L0000003395', // 안내
              //   message: 'M0000000519', // 결재선이 존재하지 않습니다. 관리자에게 문의하세요.
              //   type: 'warning', // success / info / warning / error
              // });
              // this.$emit('closePopup', { resultFlag: false });
            }
            
            this.apprRqst.apprLines.splice(0, 0, {
              userId: this.$store.getters.token,
              userNm: this.$store.getters.name,
              plantCd: this.$store.getters.plantCd,
              deptCd: this.$store.getters.deptCd,
              deptNm: this.$store.getters.deptNm,
            });
            
            // this.loadComponent(_result.data.apprUrl); // 화면url
            this.apprRqst.apprBizNo = _result.data.apprBizNo; // 결재문서 마스터 번호

            // 콤포넌트 전달 파라미터
            let params = this.$_.split(_result.data.apprParameter, '|');            
            this.$_.forEach(params, element => {             
              this.apprRqst.apprReqParameter +=
                element + ':' + this.popupParam.apprParams[element] + '|';              
                            
              this.apprCnt = this.$_.split(this.popupParam.apprParams[element], ',').length;
            });      
            
            for (let i = 0; i < this.apprCnt; i++)
            {
              this.apprParams.push({ apprFlag: true });
              this.tabItems.push({ title: this.$comm.getLangSpecInfoLabel('L0000005148'), url: _result.data.apprUrl });

              this.$_.forEach(params, element => {  
                this.apprParams[i][element] = this.$_.split(this.popupParam.apprParams[element], ',')[i];                
              });              
              
              this.loadComponent();  
            }
          }
        },
        _error => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    // 걸재 상세 내용 첨부
    loadComponent() {
      var path = this.tabItems[this.tabIndex].url;      
      this.component = () => import(`@/pages${path}`);
    },
    // 결재요청
    requestAppr() {
      let promises = [
        { func: this.checkLine, exceptionMessage: 'M0000000520' }, // 결재선을 지정해주세요.
        { func: this.checkValidation, exceptionMessage: 'M0000001000' }, // 결재요청명을 입력바랍니다.
        { func: this.confirmSave },
        { func: this.saveData, successMessage: 'M0000000504' }, // 결재요청 되었습니다.
      ];

      this.$comm.orderedPromise(promises);
      // let apprLines = this.$_.clone(this.apprRqst.apprLines);
      // apprLines.splice(0, 1);
      // if (apprLines.length <= 0) {
      //   window.getApp.$emit('ALERT', {
      //     title: '안내',
      //     message: '결재선을 지정해주세요.',
      //     type: 'warning', // success / info / warning / error
      //   });
      //   return;
      // } else {
      //   this.$validator
      //     .validateAll()
      //     .then(_result => {
      //       if (_result) {
      //         window.getApp.$emit('CONFIRM', {
      //           title: '확인',
      //           message: '결재요청 하시겠습니까?',
      //           // TODO : 필요시 추가하세요.
      //           type: 'info', // success / info / warning / error
      //           // 확인 callback 함수
      //           confirmCallback: () => {
      //             this.apprRqst.reqUserId = this.$store.getters.token;
      //             this.apprRqst.plantCd = this.$store.getters.plantCd;
      //             this.apprRqst.apprLines.splice(0, 1);
      //             this.$http.url = this.insertUrl;
      //             this.$http.type = 'POST';
      //             this.$http.param = this.apprRqst;
      //             this.$http.request(
      //               _result => {
      //                 if (_result.data > 0) {
      //                   window.getApp.$emit('ALERT', {
      //                     title: '안내',
      //                     message: '결재요청 되었습니다.',
      //                     type: 'success', // success / info / warning / error
      //                   });
      //                   this.$emit('closePopup', {
      //                     resultFlag: true,
      //                     apprRqstNo: this.$_.clone(_result.data),
      //                   });
      //                 } else {
      //                   window.getApp.$emit('ALERT', {
      //                     title: '에러',
      //                     message: '결재요청 처리중 오류가 발생하였습니다.',
      //                     type: 'error', // success / info / warning / error
      //                   });
      //                   this.$emit('closePopup', { resultFlag: false });
      //                 }
      //               },
      //               _error => {
      //                 window.getApp.$emit('APP_REQUEST_ERROR', _error);
      //               }
      //             );
      //           },
      //           // 취소 callback 함수
      //           cancelCallback: () => {},
      //         });
      //       } else if (!_result) {
      //         window.getApp.$emit('ALERT', {
      //           title: '안내',
      //           message: '필수입력값을 입력해주세요.',
      //           type: 'warning', // success / info / warning / error
      //         });
      //       }
      //     })
      //     .catch(() => {
      //       window.getApp.$emit(
      //         'APP_VALID_ERROR',
      //         '유효성 검사 중 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.'
      //       );
      //     });
      // }
    },
    checkLine() {
      return new Promise((_resolve, _reject) => {
        let apprLines = this.$_.clone(this.apprRqst.apprLines);
        apprLines.splice(0, 1);
        if (apprLines.length > 0) {
          _resolve(true);
        } else {
          _resolve(false);
        }
      });
    },
    checkValidation() {
      return this.$validator.validateAll();
    },
    confirmSave() {
      return new Promise((_resolve, _reject) => {
        window.getApp.$emit('CONFIRM', {
          title: 'L0000003321', // 확인
          message: 'M0000000901', // 결재요청 하시겠습니까?
          // TODO : 필요시 추가하세요.
          type: 'info', // success / info / warning / error
          // 확인 callback 함수
          confirmCallback: () => {
            /**
              * 2022.03.11 LHJ
              * 결재요청시 업무별 데이터 저장 후 결재승인처리
            */
            let func = this.$refs.apprDetail.apprSave;

            if (func && typeof func === 'function') {
              func().then(_result => {
                _resolve(_result);
              });
            }
            else {
              _resolve(true);
            }
          },
          // 취소 callback 함수
          cancelCallback: () => {
            _resolve(false);
          },
        });
      })
    },
    saveData() {
      return new Promise((_resolve, _reject) => {
        this.apprRqst.reqUserId = this.$store.getters.token;
        this.apprRqst.plantCd = this.$store.getters.plantCd;
        this.apprRqst.apprLines.splice(0, 1);
        this.apprRqst.papprRqstNo = this.popupParam.apprRqstNo;
        this.$http.url = this.insertUrl;
        this.$http.type = 'POST';
        this.$http.param = this.apprRqst;
        this.$http.request(
          _result => {
            if (_result.data > 0) {
              _resolve(true);
              this.$emit('closePopup', {
                resultFlag: true,
                apprRqstNo: this.$_.clone(_result.data),
              });
            } else {
              _resolve(false);
              window.getApp.$emit('ALERT', {
                title: 'L0000003396', // 에러
                message: 'M0000000505', // 결재요청 처리중 오류가 발생하였습니다.
                type: 'error', // success / info / warning / error
              });
              this.$emit('closePopup', { resultFlag: false });
            }
          },
          _error => {
            _reject(_error);
            window.getApp.$emit('APP_REQUEST_ERROR', _error);
          }
        );
      })
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
    // 닫기
    closePop() {
      this.$emit('closePopup', {});
    },
    // Detail 이전
    movePrev() {      
      if (Number(this.tabIndex) > 0)
      {
        this.tabIndex = (Number(this.tabIndex) - 1).toString();
      }
    },
    // Detail 다음
    moveNext() {
      if (Number(this.tabIndex) < this.tabItems.length - 1)
      {
        this.tabIndex = (Number(this.tabIndex) + 1).toString();
      }
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
  },
};
</script>