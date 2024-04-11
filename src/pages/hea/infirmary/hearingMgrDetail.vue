<!--
  목적 : 청력관리대상자 상세
  작성자 :
  Detail : 
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
            <!-- 청력관리대상자 상세 -->
            <y-label
              label="L0000004698"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 저장 -->
              <y-btn
                v-if="editable"
                title="L0000002474"
                color="orange"
                @btnClicked="btnSaveClickedCallback"
              />
              <!-- 삭제 -->
              <y-btn
                v-if="editable"
                title="L0000001495"
                color="red"
                @btnClicked="btnDeleteClickedCallback"
              />
              <!-- 닫기 -->
              <y-btn title="L0000000881" @btnClicked="closePopup" />
            </div>
          </b-col>
        </b-row>
        <b-card>
          <b-row>
            <!-- 사업장 -->
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <y-plant
                :editable="editable"
                :required="true"
                type="edit"
                name="plantCd"
                v-model="hearingMgr.plantCd"
                v-validate="'required'"
                :state="validateState('plantCd')"
              />
            </b-col>

            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 부서 -->
              <y-tree-dept
                :editable="editable"
                :required="true"
                label="L0000001287"
                :plantCd="hearingMgr.plantCd"
                v-model="hearingMgr.deptCd"
                v-validate="'required'"
                :state="validateState('deptCd')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 검사일자 -->
              <y-datepicker
                :width="8"
                :editable="editable"
                :required="true"
                label="L0000000314"
                name="chkDt"
                :default="hearingMgr.chkDt"
                v-model="hearingMgr.chkDt"
                v-validate="'required'"
                :state="validateState('chkDt')"
              ></y-datepicker>
            </b-col>

            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 성명 -->
              <y-text
                :width="8"
                :maxlength="15"
                :disabled="true"
                :editable="editable"
                :showMaxLength="false"
                :required="true"
                ui="bootstrap"
                label="L0000001630"
                name="userNm"
                v-model="hearingMgr.userNm"
                :appendIcon="[{ icon: 'search', callbackName: 'searchUser' }]"
                @searchUser="btnSearchUserClicked"
                v-validate="'required'"
                :state="validateState('userNm')"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 좌-500 -->
              <y-number
                :width="8"
                :editable="editable"
                :maxlength="5"
                :hasSeperator="true"
                ui="bootstrap"
                label="L0000004342"
                name="left500"
                v-model="hearingMgr.left500"
              ></y-number>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 좌-1000 -->
              <y-number
                :width="8"
                :editable="editable"
                :maxlength="5"
                :hasSeperator="true"
                ui="bootstrap"
                label="L0000004343"
                name="left1000"
                v-model="hearingMgr.left1000"
              ></y-number>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 좌-2000 -->
              <y-number
                :width="8"
                :editable="editable"
                :maxlength="5"
                :hasSeperator="true"
                ui="bootstrap"
                label="L0000004344"
                name="left2000"
                v-model="hearingMgr.left2000"
              ></y-number>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 좌-4000 -->
              <y-number
                :width="8"
                :editable="editable"
                :maxlength="5"
                :hasSeperator="true"
                ui="bootstrap"
                label="L0000004345"
                name="left4000"
                v-model="hearingMgr.left4000"
              ></y-number>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 좌청력-3분법 -->
              <y-number
                :width="8"
                :editable="editable"
                :maxlength="5"
                :hasSeperator="true"
                ui="bootstrap"
                label="L0000004346"
                name="left3Div"
                v-model="hearingMgr.left3Div"
              ></y-number>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 좌청력-6분법 -->
              <y-number
                :width="8"
                :editable="editable"
                :maxlength="5"
                :hasSeperator="true"
                ui="bootstrap"
                label="L0000004347"
                name="left6Div"
                v-model="hearingMgr.left6Div"
              ></y-number>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 우-500 -->
              <y-number
                :width="8"
                :editable="editable"
                :maxlength="5"
                :hasSeperator="true"
                ui="bootstrap"
                label="L0000004348"
                name="right500"
                v-model="hearingMgr.right500"
              ></y-number>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 우-1000 -->
              <y-number
                :width="8"
                :editable="editable"
                :maxlength="5"
                :hasSeperator="true"
                ui="bootstrap"
                label="L0000004349"
                name="right1000"
                v-model="hearingMgr.right1000"
              ></y-number>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 우-2000 -->
              <y-number
                :width="8"
                :editable="editable"
                :maxlength="5"
                :hasSeperator="true"
                ui="bootstrap"
                label="L0000004350"
                name="right2000"
                v-model="hearingMgr.right2000"
              ></y-number>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 우-4000 -->
              <y-number
                :width="8"
                :editable="editable"
                :maxlength="5"
                :hasSeperator="true"
                ui="bootstrap"
                label="L0000004351"
                name="right4000"
                v-model="hearingMgr.right4000"
              ></y-number>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 우청력-3분법 -->
              <y-number
                :width="8"
                :editable="editable"
                :maxlength="5"
                :hasSeperator="true"
                ui="bootstrap"
                label="L0000004352"
                name="right3Div"
                v-model="hearingMgr.right3Div"
              ></y-number>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 우청력-6분법 -->
              <y-number
                :width="8"
                :editable="editable"
                :maxlength="5"
                :hasSeperator="true"
                ui="bootstrap"
                label="L0000004353"
                name="right6Div"
                v-model="hearingMgr.right6Div"
              ></y-number>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 판정 -->
              <y-select
                :width="8"
                :comboItems="heaDiagnoseItems"
                :editable="editable"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                name="heaDiagnoseCd"
                label="L0000003035"
                v-model="hearingMgr.heaDiagnoseCd"
              ></y-select>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 관리등급 -->
              <y-text
                :width="8"
                :maxlength="50"
                :editable="editable"
                :showMaxLength="false"
                :required="true"
                ui="bootstrap"
                label="L0000000589"
                name="userNm"
                v-model="hearingMgr.mgrLvl"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 고위험군 -->
              <y-text
                :width="8"
                :maxlength="50"
                :editable="editable"
                :showMaxLength="false"
                ui="bootstrap"
                label="L0000000476"
                name="userNm"
                v-model="hearingMgr.highDgrGrpNm"
              ></y-text>
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
  name: 'checkup-result-detail',
  props: {
    popupParam: {
      type: Object,
      default: {
        heaHearingMgrListNo: 0,
      },
    },
  },
  data() {
    return {
      hearingMgr: {
        heaHearingMgrListNo: 0, // 청력관리대상자번호
        plantCd: null, // 사업장 코드
        plantNm: null, // 사업장 명칭
        userId: null, // 사용자 아이디
        userNm: null, // 사용자 이름
        deptCd: null, // 부서 코드
        deptNm: null, // 부서 명칭
        chkDt: null, // 검사일자
        left500: null, // 좌500
        left1000: null, // 좌1000
        left2000: null, // 좌2000
        left4000: null, // 좌4000
        left3Div: null, // 좌3분법
        left6Div: null, // 좌6분법
        right500: null, // 우500
        right1000: null, // 우1000
        right2000: null, // 우2000
        right4000: null, // 우4000
        right3Div: null, // 우3분법
        right6Div: null, // 우3분법
        heaDiagnoseCd: null, // 검사결과 진단 코드(판정)
        mgrLvl: null, // 관리등급
        highDgrGrpNm: null, // 고위험군
        createUserId: null, // 등록일
        createDt: null, // 등록자
        updateUserId: null, // 수정일
        updateDt: null, // 수정자
      },
      editable: false,

      detailUrl: '',
      saveUrl: '',

      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '80%',
        top: '10px',
        param: {},
        closeCallback: null,
      },
      heaDiagnoseItems: [],
    };
  },
  computed: {},
  watch: {},
  /** Vue lifecycle: created, mounted, destroyed, etc **/
  beforeCreate() {},
  created() {},
  beforeMount() {
    // TODO : data를 초기화 시켜줌(검색 조건 유지가 필요할 때는 삭제할 것)
    // 이유 : vue.js는 SPA기반으로 동작하기 때문에 페이지를 이동하더라도 기존 입력된 정보가 그대로 남아 있는 문제가 있음
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {},
  beforeDestory() {},
  /** methods **/
  methods: {
    /** 초기화 관련 함수 **/
    init() {
      this.editable = this.$route.meta.editable;

      this.detailUrl = selectConfig.hea.hearingMgr.get.url;
      this.saveUrl = transactionConfig.hea.hearingMgr.edit.url;

      this.$comm.getComboItems('HEA_DIAGNOSE', false).then((_result) => {
        this.heaDiagnoseItems = this.$_.clone(_result);
      });

      if (this.popupParam.heaHearingMgrListNo > 0) {
        this.getDetail();
      }
    },
    getDetail() {
      this.$http.url = this.$format(
        this.detailUrl,
        this.popupParam.heaHearingMgrListNo
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.hearingMgr = this.$_.clone(_result.data);
          this.hearingMgr.chkDt = this.$comm
            .moment(this.hearingMgr.chkDt)
            .format('YYYY-MM-DD');
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    closePopup() {
      // 부모창에 값 전달
      this.$emit('closePopup', { success: true });
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
    btnDeleteClickedCallback() {
      let promises = [
        {
          func: this.confirm,
          param: this.$comm.getLangSpecInfoLabel('M0000000012'),
        }, // 삭제하시겠습니까?
        { func: this.deleteData },
      ];

      this.$comm.orderedPromise(promises);
    },
    btnSaveClickedCallback() {
      let promises = [
        {
          func: this.confirm,
          param: this.$comm.getLangSpecInfoLabel('M0000000011'),
        }, // 저장하시겠습니까?
        { func: this.saveData },
      ];

      this.$comm.orderedPromise(promises);
    },
    confirm(msg) {
      return new Promise((_resolve) => {
        window.getApp.$emit('CONFIRM', {
          title: 'L0000003321', // '확인',
          message: msg,
          confirmCallback: () => {
            this.hearingMgr.createUserId = this.$store.getters.token;
            this.hearingMgr.updateUserId = this.$store.getters.token;
            _resolve(true);
          },
          cancelCallback: () => {
            _resolve(false);
          },
        });
      });
    },
    saveData() {
      return new Promise((_resolve) => {
        this.hearingMgr.chkDt = this.$comm
          .moment(this.hearingMgr.chkDt)
          .format('YYYYMMDD');

        this.$http.url = this.saveUrl;
        this.$http.type = 'PUT';
        this.$http.param = this.hearingMgr;
        this.$http.request(
          (_result) => {
            this.hearingMgr.heaHearingMgrListNo = this.$_.clone(_result.data);
            this.getDetail();

            window.getApp.$emit('ALERT', {
              title: 'L0000003395', // '안내',
              message: 'M0000001038', // 정상적으로 저장되었습니다.
              type: 'success',
            });
            _resolve(true);
          },
          (_error) => {
            window.getApp.$emit(
              'APP_REQUEST_ERROR',
              'M0000000016' // 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.
            );
          }
        );
      });
    },
    deleteData() {
      return new Promise((_resolve) => {
        this.$http.url = this.$format(
          transactionConfig.hea.hearingMgr.delete.url,
          this.hearingMgr.heaHearingMgrListNo
        );
        this.$http.type = 'DELETE';
        this.$http.request(
          (_result) => {
            window.getApp.$emit('ALERT', {
              title: 'L0000003395', // '안내',
              message: 'M0000001025', // 정상적으로 삭제되었습니다.
              type: 'success',
            });
            this.closePopup();
            _resolve(true);
          },
          (_error) => {
            window.getApp.$emit(
              'APP_REQUEST_ERROR',
              'M0000000016' // 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.
            );
          }
        );
      });
    },
    btnSearchUserClicked(_item) {
      this.popupOptions.target = () =>
        import(`${'../../manage/user/userSearch.vue'}`);
      this.popupOptions.param = {
        plantCd: this.$store.getters.plantCd,
      };
      this.popupOptions.title = 'L0000001466'; // 사용자검색
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closePopupSearchUser;
    },
    closePopupSearchUser(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      if (data.user) {
        this.hearingMgr.userId = data.user.userId;
        this.hearingMgr.userNm = data.user.userNm;

        this.hearingMgr.plantCd = data.user.plantCd;
        this.hearingMgr.plantNm = data.user.plantNm;
        this.hearingMgr.deptCd = data.user.deptCd;
        this.hearingMgr.deptNm = data.user.deptNm;
      }
    },
    removeUser() {
      this.hearingMgr.userNm = '';
      this.hearingMgr.userId = '';

      this.hearingMgr.plantCd = '';
      this.hearingMgr.plantNm = '';
      this.hearingMgr.deptCd = '';
      this.hearingMgr.deptNm = '';
    },
  },
};
</script>
