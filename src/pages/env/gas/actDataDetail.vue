<template>
  <b-container fluid>
    <b-row>
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 확정 -->
              <y-btn
                v-if="!compleDisabled && editable"
                title="L0000004571"
                color="black"
                @btnClicked="btnCompleteClicked"
              />
              <!-- 저장 -->
              <y-btn
                v-if="actData.stepCd !== '0002' && editable"
                title="L0000002474"
                color="orange"
                @btnClicked="btnSaveClicked"
              />
              <!-- 삭제 -->
              <y-btn
                v-if="actData.stepCd === '0001' && editable"
                title="L0000001495"
                color="red"
                @btnClicked="btnDeleteClicked"
              />
              <!-- 확정취소 -->
              <y-btn
                v-if="actData.stepCd === '0002' && editable"
                title="L0000004572" @btnClicked="btnCancelCompleteClicked" />
              <!-- 닫기 -->
              <y-btn title="L0000000881" @btnClicked="btnClosePopup" />
            </div>
          </b-col>
        </b-row>
        <b-card>
          <b-row>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-plant
                type=""
                :editable="
                  actData.stepCd !== '0001' && actData.stepCd !== '0002' && editable
                "
                v-model="actData.plantCd"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 대상년월 -->
              <y-datepicker
                :editable="isSave && editable"
                :width="8"
                type="month"
                :range="false"
                name="actMonth"
                label="대상년월"
                :default="actData.actMonth"
                v-model="actData.actMonth"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 진행상태 -->
              <y-text
                :editable="false"
                label="L0000002779"
                ui="bootstrap"
                :width="8"
                :maxlength="10"
                v-model="actData.stepNm"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 작성부서 -->
              <y-text
                :editable="false"
                label="L0000002348"
                ui="bootstrap"
                :width="8"
                :maxlength="10"
                v-model="actData.updateDeptNm"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 작성자 -->
              <y-text
                :editable="false"
                label="L0000002355"
                ui="bootstrap"
                :width="8"
                :maxlength="10"
                v-model="actData.updateUserNm"
              />
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>
    <b-row class="mt-3"></b-row>
    <b-row>
      <b-col sm="12">
        <el-tabs type="border-card" v-model="tabIndex">
          <el-tab-pane
            v-for="(item, i) in tabItems"
            :key="i"
            stretch
            class="default-tab-pane"
          >
            <span slot="label">
              <i class="el-icon-date"></i>
              {{ item.title }}
            </span>
          </el-tab-pane>
          <keep-alive>
            <component
              sm="12"
              v-if="component"
              :is="component"
              :actData.sync="actData"
              :compleDisabled.sync="compleDisabled"
            />
          </keep-alive>
        </el-tabs>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
export default {
  name: 'y-act-data-detail',
  props: {
    popupParam: {
      type: Object,
      default: {
        actDaRptNo: null,
        plantCd: null,
        actMonth: [],
      },
    },
  },

  data() {
    return {
      actData: {
        actDaRptNo: '',
        actDaRsltNo: '',
        ghgFcltNo: '',
        actDataCd: '',
        fcltCalcMtdNo: '',
        plantCd: '',
        // plantCd2: '',
        deptNm: '',
        deptCd: '',
        processCd: '',

        processNm: '',
        actMonth: null,
        disClsCd: '',
        disActCd: '',
        disActNm: '',
        disFacCd: '',
        disFacNm: '',
        disFacNo: '',
        actClsSec: '',
        actDataNm: '',
        unitType: '',
        actAmt: 0,
        stepCd: '',
        createUserId: '',
        createUserNm: '',
        createDeptCd: '',
        createDeptNm: '',
        createDt: '',
        updateUserId: '',
        updateUserNm: '',
        updateDeptCd: '',
        updateDeptNm: '',
        updateDt: '',
        actDataList: [],
      },
      tabIndex: 0,
      tabItems: [
        { title: this.$comm.getLangSpecInfoLabel('L0000003341'), url: 'actDataAmt' }, // 활동량
        // { title: '활동자료파일', url: './disFacDetailHistory' },
        // { title: '증빙자료파일', url: './disFacDetailHistory' },
      ],
      component: null,
      gridOptions: {
        header: [],
        data: [],
        height: 'auto',
      },
      insertUrl: '',
      editUrl: '',
      isInsert: false,
      isEdit: false,
      disClsItems: [], // 배출활동 구분 리스트

      editable: false,
      isSave: false,
      compleDisabled: false,
    };
  },
  watch: {
    tabIndex() {
      this.loadComponent();
    },
  },
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
  },
  mounted() {
    this.init();
    this.loadComponent();
  },
  beforeDestroy() {},
  /** methods **/
  methods: {
    // 초기화
    init() {
      this.editable = this.$route.meta.editable;
      var today = this.$comm.getToday();
      var beforeMonth = this.$comm.getCalculatedDate(
        today,
        '-1m',
        'YYYY-MM',
        'YYYY-MM'
      );


      if (!this.popupParam.actDataCd) {
        this.actData.createUserId = this.$store.getters.token;
        this.actData.createUserNm = this.$store.getters.name;
        this.actData.createDeptCd = this.$store.getters.deptCd;
        this.actData.createDeptNm = this.$store.getters.deptNm;
        this.actData.updateUserId = this.$store.getters.token;
        this.actData.updateUserNm = this.$store.getters.name;
        this.actData.updateDeptCd = this.$store.getters.deptCd;
        this.actData.updateDeptNm = this.$store.getters.deptNm;
      }
      if (this.popupParam.plantCd) this.actData.plantCd = this.popupParam.plantCd
      if (this.popupParam.actDaRptNo) {
        this.compleDisabled = false;
        this.getDetail();
      } else {
        this.compleDisabled = true;
        this.isSave = true;
      }

      this.actData.actMonth = beforeMonth;
    },

    loadComponent() {
      var path = this.tabItems[this.tabIndex].url;

      if (path === 'actDataAmt') {
        this.component = () => import('@/pages/env/gas/actDataAmt');
      } else {
        this.component = () => import(`${path}`);
      }
    },

    // 필수값 주기
    validateState(_ref) {
      if (
        this.veeBag[_ref] &&
        (this.veeBag[_ref].dirty || this.veeBag[_ref].validated)
      ) {
        return !this.errors.has(_ref);
      }
      return null;
    },

    /** validation checking **/
    // 저장 버튼 클릭
    btnSaveClicked() {
      this.$comm.recursivePromise([
        { func: this.checkOverlap },
        // {
        //   func: this.checkValid,
        //   exceptionMessage: '활동데이터의 활동량을 하나 이상 입력하세요.',
        // },
        { func: this.confirm, param: this.$comm.getLangSpecInfoLabel('M0000000011') }, // 저장하시겠습니까?
        { func: this.saveData },
        { func: this.getDetail, successMessage: this.$comm.getLangSpecInfoLabel('M0000000006') }, // 저장되었습니다.
      ]);
    },
    checkOverlap() {
      return new Promise((_resolve, _reject) => {
        if (!this.popupParam.actDaRptNo) {
          this.$http.url = this.$format(
            selectConfig.env.gas.actData.check.url,
            this.actData.plantCd,
            this.actData.actMonth
          );
          this.$http.type = 'GET';
          this.$http.request(
            _result => {
              if (_result.data > 0) {
                window.getApp.$emit('ALERT', {
                  title: 'L0000003321', // '확인',
                  message: 'M0000000330', // 해당 월에 데이터가 이미 존재합니다.
                  type: 'warning',
                });
                _resolve(false);
              } else {
                _resolve(true);
              }
            },
            _error => {
              window.getApp.$emit(
                'APP_REQUEST_ERROR',
                'M0000000016', // 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.
              );
              _resolve(false);
            }
          );
        } else {
          _resolve(true);
        }
      });
    },
    checkValid() {
      return new Promise((_resolve, _reject) => {
        var flag = true;
        // this.$_.forEach(this.actData.actDataList, _item => {
        //   if (!_item.actAmt) {
        //     flag = false;
        //   } else {
        //     flag = true;
        //   }
        // })
        const tempList = this.$_.filter(this.actData.actDataList, _item => {
          return _item.actAmt;
        });
        if (tempList.length > 0) {
          _resolve(true);
        } else {
          _resolve(false);
        }
      });
    },
    confirm() {
      return new Promise((_resolve, _reject) => {
        window.getApp.$emit('CONFIRM', {
          title: 'L0000003321', // '확인',
          message: 'M0000000011', // 저장하시겠습니까?
          type: 'info',
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
      return new Promise((_resolve, _reject) => {
        if (this.popupParam.actDaRptNo) {
          this.$http.url = transactionConfig.env.gas.actData.edit.url;
          this.$http.type = 'PUT';
          this.actData.updateUserId = this.$store.getters.token;
          this.actData.updateUserNm = this.$store.getters.name;
          this.actData.updateDeptCd = this.$store.getters.deptCd;
          this.actData.updateDeptNm = this.$store.getters.deptNm;
        } else {
          this.$http.url = transactionConfig.env.gas.actData.insert.url;
          this.$http.type = 'POST';
        }
        this.actData.createUserId = this.$store.getters.token;
        this.$http.param = this.actData;
        this.$http.request(
          _result => {
            this.popupParam.actDaRptNo = _result.data;
            _resolve(true);
          },
          _error => {
            window.getApp.$emit('APP_REQUEST_ERROR', _error);
            _reject(_error);
          }
        );
      });
    },
    getDetail() {
      return new Promise((_resolve, _reject) => {
        this.$http.url = this.$format(
          selectConfig.env.gas.actData.get.url,
          this.popupParam.actDaRptNo
        );
        this.$http.type = 'GET';
        this.$http.request(
          _result => {
            this.actData = this.$_.clone(_result.data);
            if (this.actData.stepCd === '0002') {
              this.compleDisabled = true;
            } else {
              this.compleDisabled = false;
            }
            this.isSave = false;

            _resolve(true);
          },
          _error => {
            window.getApp.$emit('APP_REQUEST_ERROR', _error);
            _reject(_error);
          }
        );
      });
    },

    // 삭제
    btnDeleteClicked() {
      this.$comm.recursivePromise([
        { func: this.deleteConfirm },
        { func: this.deleteData },
        { func: this.btnClosePopup, successMessage: this.$comm.getLangSpecInfoLabel('M0000000007') }, // 삭제되었습니다.
      ]);
    },
    deleteConfirm() {
      return new Promise((_resolve, _reject) => {
        window.getApp.$emit('CONFIRM', {
          title: 'L0000003321', // '확인',
          message:
            'M0000000331', // 삭제하시겠습니까?(삭제할 시 활동데이터들이 모두 삭제 됩니다)'
          type: 'info',
          confirmCallback: () => {
            _resolve(true);
          },
          cancelCallback: () => {
            _resolve(false);
          },
        });
      });
    },
    deleteData() {
      return new Promise((_resolve, _reject) => {
        if (this.popupParam.actDaRptNo) {
          this.$http.url = this.$format(
            transactionConfig.env.gas.actData.delete.url,
            this.popupParam.actDaRptNo
          );
          this.$http.type = 'DELETE';
          this.$http.request(
            _result => {
              _resolve(true);
            },
            _error => {
              window.getApp.$emit('APP_REQUEST_ERROR', _error);
              _reject(_error);
            }
          );
        }
      });
    },

    // 창 닫기
    btnClosePopup() {
      return new Promise((_resolve, _reject) => {
        this.isSave = false;
        _resolve(true);
        this.$emit('closePopup');
      });
    },

    // 완료
    btnCompleteClicked() {
      this.$comm.recursivePromise([
        { func: this.completeConfirm },
        { func: this.saveData },
        { func: this.completeData },
        { func: this.getDetail, successMessage: this.$comm.getLangSpecInfoLabel('M0000000078') }, // 완료되었습니다.
      ]);
    },
    btnCancelCompleteClicked() {
      this.$comm.recursivePromise([
        { func: this.cancelCompleteConfirm },
        { func: this.cancelCompleteData },
        { func: this.getDetail, successMessage: this.$comm.getLangSpecInfoLabel('M0000000078') }, // 완료되었습니다.
      ]);
    },
    completeConfirm() {
      return new Promise((_resolve, _reject) => {
        window.getApp.$emit('CONFIRM', {
          title: 'L0000003321', // '확인',
          message:
            'M0000000332', // 완료하시겠습니까? (완료할 시 해당 월의 활동데이터 수정이 불가능합니다.)
          type: 'info',
          confirmCallback: () => {
            _resolve(true);
          },
          cancelCallback: () => {
            _resolve(false);
          },
        });
      });
    },
    cancelCompleteConfirm() {
      return new Promise((_resolve, _reject) => {
        window.getApp.$emit('CONFIRM', {
          title: 'L0000003321', // '확인',
          message:
            'M0000000804', // 취소 하시겠습니까?
          type: 'info',
          confirmCallback: () => {
            _resolve(true);
          },
          cancelCallback: () => {
            _resolve(false);
          },
        });
      });
    },
    completeData() {
      return new Promise((_resolve, _reject) => {
        if (this.popupParam.actDaRptNo) {
          this.actData.updateUserId = this.$store.getters.token;
          this.actData.updateUserNm = this.$store.getters.name;
          this.actData.updateDeptCd = this.$store.getters.deptCd;
          this.actData.updateDeptNm = this.$store.getters.deptNm;
          this.$http.url = transactionConfig.env.gas.actData.complete.url;
          this.$http.type = 'PUT';
          this.$http.param = this.actData;
          this.$http.request(
            _result => {
              this.popupParam.actDaRptNo = _result.data;
              _resolve(true);
            },
            _error => {
              window.getApp.$emit('APP_REQUEST_ERROR', _error);
              _reject(_error);
            }
          );
        }
      });
    },
    cancelCompleteData() {
      return new Promise((_resolve, _reject) => {
        if (this.popupParam.actDaRptNo) {
          this.actData.updateUserId = this.$store.getters.token;
          this.actData.updateUserNm = this.$store.getters.name;
          this.actData.updateDeptCd = this.$store.getters.deptCd;
          this.actData.updateDeptNm = this.$store.getters.deptNm;
          this.$http.url = transactionConfig.env.gas.actData.cancelComplete.url;
          this.$http.type = 'PUT';
          this.$http.param = this.actData;
          this.$http.request(
            _result => {
              this.popupParam.actDaRptNo = _result.data;
              _resolve(true);
            },
            _error => {
              window.getApp.$emit('APP_REQUEST_ERROR', _error);
              _reject(_error);
            }
          );
        }
      });
    },
  },
};
</script>

<style></style>
