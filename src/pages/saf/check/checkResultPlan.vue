<!--
  목적 : 안전점검관리 - 점검계획 등록
  Detail : 안전점검계획 등록/수정 화면
               안전점검계획을 점검계획사용여부가 사용으로 지정된 점검종류별로  주관부서와 수행부서들을 지정하고, 점검주기 별로 기간을 지정하여 점검예정일을 지정
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <!-- 등록 -->
    <b-row ref="editBox">
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- 안전점검계획 -->
            <y-label label="L0000004055" icon="user-edit" color-class="cutstom-title-color" />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 저장 -->
              <y-btn
                v-if="popupParam.safCheckRsltNo <= 0 && editable"
                :action-url="insertUrl"
                :param="checkResult"
                :is-submit="isInsert"
                title="L0000002474"
                color="orange"
                action-type="POST"
                beforeSubmit="beforeInsert"
                @beforeInsert="beforeInsert"
                @btnClicked="btnInsertClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!-- 완료 -->
              <y-btn
                v-if="popupParam.safCheckRsltNo > 0 && editable && popupParam.checkPlanStepCd === 'N'"
                title="L0000002039"
                color="black"
                @btnClicked="btnCompleteClicked"
              />
              <!-- 수정 -->
              <y-btn
                v-if="popupParam.safCheckRsltNo > 0 && editable && popupParam.checkPlanStepCd === 'N'"
                :action-url="editUrl"
                :param="checkResult"
                :is-submit="isInsert"
                title="L0000001696"
                color="orange"
                action-type="PUT"
                beforeSubmit="beforeInsert"
                @beforeInsert="beforeInsert"
                @btnClicked="btnInsertClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!-- 삭제 -->
              <y-btn
                v-if="popupParam.safCheckRsltNo > 0 && editable && popupParam.checkPlanStepCd === 'N'"
                color="red"
                title="L0000001495"
                @btnClicked="btnDeleteClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!-- 닫기 -->
              <y-btn title="L0000000881" @btnClicked="closePopup" />
            </div>
          </b-col>
        </b-row>
        <b-card>
          <b-row>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-plant
                type="edit"
                :editable="editable"
                :required="true"
                name="plantCd"
                v-model="checkResult.plantCd"
                v-validate="'required'"
                :state="validateState('plantCd')"
              />
              <!-- <y-select
                :width="8"
                :required="true"
                :comboItems="plantItems"
                :editable="editable"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                label="사업장"
                name="plantCd"
                v-model="checkResult.plantCd"
                v-validate="'required'"
                :state="validateState('plantCd')"
              ></y-select>-->
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 점검종류 -->
              <y-select
                :width="8"
                :comboItems="comboCheckKindItems"
                :required="true"
                :editable="editable"
                itemText="safCheckKindNm"
                itemValue="safCheckKindNo"
                ui="bootstrap"
                type="edit"
                name="safCheckKindNo"
                label="L0000002576"
                v-model="checkResult.safCheckKindNo"
                v-validate="'required'"
                :state="validateState('safCheckKindNo')"
              ></y-select>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 등록자/등록일 -->
              <y-text
                :width="8"
                :disabled="true"
                :editable="editable"
                ui="bootstrap"
                name="createUserNm"
                label="L0000000978"
                v-model="checkResult.createUserNm"
                v-validate="'required'"
                :state="validateState('createUserNm')"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 점검주관부서 -->
              <y-tree-dept
                :editable="editable"
                :required="true"
                label="L0000002578"
                v-model="checkResult.deptCd"
                v-validate="'required'"
                :state="validateState('deptCd')"
              />
              <!-- <y-select
                :width="8"
                :comboItems="comboDeptItems"
                :required="true"
                itemText="deptNm"
                itemValue="deptCd"
                ui="bootstrap"
                name="deptCd"
                label="점검주관부서"
                v-model="checkResult.deptCd"
                v-validate="'required'"
                :state="validateState('deptCd')"
              >
              </y-select>-->
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 점검대상부서 -->
              <y-multi-select
                :width="8"
                :editable="editable"
                :comboItems="comboTgtDeptItems"
                :needDefaultView="true"
                :required="true"
                v-model="checkResult.tempTgtDeptCd"
                type="edit"
                itemText="deptNm"
                itemValue="deptCd"
                ui="bootstrap"
                label="L0000002549"
                name="tempTgtDeptCd"
                v-validate="'required'"
                :state="validateState('tempTgtDeptCd')"
              ></y-multi-select>
            </b-col>
          </b-row>
          <b-row ref="searchBox" class="mt-3">
            <b-col sm="12">
              <b-card header-class="default-card" body-class="default-body-card" class="py-0">
                <div slot="header">
                  <!-- 검색 -->
                  <y-label label="L0000000327" />
                  <div class="float-right">
                    <y-btn
                      :title="searchArea.title"
                      color="green"
                      @btnClicked="btnSearchVisibleClicked"
                    />
                    <!-- 검색 -->
                    <y-btn
                      v-if="popupParam.checkPlanStepCd === 'N'"
                      title="L0000000327"
                      color="green"
                      @btnClicked="btnSearchCheckYmdClicked"
                      @btnClickedErrorCallback="btnClickedErrorCallback"
                    />
                  </div>
                </div>
                <b-row v-if="searchArea.show">
                  <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
                    <!-- 점검주기 -->
                    <y-select
                      :width="8"
                      :comboItems="comboCycleItems"
                      itemText="codeNm"
                      itemValue="code"
                      ui="bootstrap"
                      name="cycle"
                      label="L0000002579"
                      v-model="searchParam.cycle"
                    ></y-select>
                  </b-col>
                  <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
                    <!-- 점검기간 -->
                    <y-datepicker
                      :width="8"
                      :range="true"
                      label="L0000002545"
                      name="period"
                      v-model="searchParam.period"
                    ></y-datepicker>
                  </b-col>
                </b-row>
              </b-card>
            </b-col>
          </b-row>

          <!-- 검색 결과 테이블 -->
          <b-row class="mt-3">
            <b-col sm="12">
              <b-col sm="12" class="px-0">
                <!-- 점검기간 목록 -->
                <y-data-table
                  :height="gridOptions.height"
                  :headers="gridOptions.header"
                  :items="gridOptions.data"
                  :checkItemData="checkItemData"
                  :editable="editable"
                  :print="true"
                  :useRownum="false"
                  checkKey="checkSchYmd"
                  v-model="checkYmdValue"
                  label="L0000002546"
                  ref="checkPriodDataTable"
                >
                  <el-table-column
                    :selectable="selectedCheck"
                    type="selection"
                    slot="selection"
                    align="center"
                    width="55"
                  ></el-table-column>
                </y-data-table>
              </b-col>
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>
    <b-row>
      <b-col sm="12">
        <div class="float-right mt-2">
          <!-- 저장 -->
          <y-btn
            v-if="popupParam.safCheckRsltNo <= 0 && editable"
            title="L0000002474"
            color="orange"
            @btnClicked="beforeInsert"
            @btnClickedErrorCallback="btnClickedErrorCallback"
          />
          <!-- 완료 -->
          <y-btn
            v-if="popupParam.safCheckRsltNo > 0 && editable && popupParam.checkPlanStepCd === 'N'"
            title="L0000002039"
            color="black"
            @btnClicked="btnCompleteClicked"
          />
          <!-- 수정 -->
          <y-btn
            v-if="popupParam.safCheckRsltNo > 0 && editable && popupParam.checkPlanStepCd === 'N'"
            title="L0000001696"
            color="orange"
            @btnClicked="beforeInsert"
            @btnClickedErrorCallback="btnClickedErrorCallback"
          />
          <!-- 삭제 -->
          <y-btn
            v-if="popupParam.safCheckRsltNo > 0 && editable && popupParam.checkPlanStepCd === 'N'"
            color="red"
            title="L0000001495"
            @btnClicked="btnDeleteClickedCallback"
            @btnClickedErrorCallback="btnClickedErrorCallback"
          />
          <!-- 닫기 -->
          <y-btn title="L0000000881" size="mini" @btnClicked="closePopup" />
        </div>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
export default {
  /* attributes: name, components, props, data */
  name: 'y-check-result-plan',
  props: {
    popupParam: {
      type: Object,
      default: {
        safCheckRsltNo: 0, // 안전점검결과번호
        safCheckKindNo: null, // 안전점검종류번호
        deptCd: null, // 주관부서코드

        createUserNm: '', // 등록자
        createDt: '', // 등록일
        safCheckPerd: '', // 점검주기
        period: [], // 점검기간
        safCheckPlanNo: 0, // 점검계획번호
        checkPlanStepCd: '', // 점검계획진행상태
        plantCd: null, // 사업장 코드
      },
    },
  },
  data: () => ({
    checkResult: {
      safCheckRsltNo: '', // 안전점검결과번호
      safCheckRsltNos: [],
      tempTgtDeptCd: [],
      arrayTgtDeptCd: [],
      tgtDeptCd: '', // 대상부서코드
      tgtDeptNm: '', // 대상부서명
      deptCd: null, // 주관부서코드
      deptNm: '', // 주관부서명
      safCheckKindNo: null, // 점검종류번호
      safCheckKindNm: '', // 점검종류명
      arrayCheckSchYmd: [], // 배열된 가능성 있음 (점검일)
      arrayCheckTitle: [], // 배열된 가능성 있음 (점검명)
      updateUserId: '',
      createUserId: '',
      createUserNm: '',
      safCheckPerd: '', // 점검주기
      safCheckPlanSymd: '', // 점검계획시작일
      safCheckPlanEymd: '', // 점검계획종료일
      plantCd: null, // 사업장 코드
    },
    searchParam: {
      cycle: '', // 점검주기
      period: [], // 점검기간
    },
    gridOptions: {
      header: [],
      data: [],
      height: '350',
    },
    searchArea: {
      title: 'L0000000329', // 검색박스숨기기
      show: true,
    },
    checkItemTempData: [],
    checkItemData: [],
    baseWidth: 9,
    editable: false,
    isInsert: false,
    gridItemData: [],
    gridHeaderItemOptions: [],
    comboCheckKindItems: [], // 점검종류
    comboDeptItems: [], // 주관부서
    comboTgtDeptItems: [], // 대상부서
    comboCycleItems: [], // 점검주기
    plantItems: [], // 사업장 목록
    insertUrl: '',
    editUrl: '',
    completeUrl: '',
    checkYmdValue: [],
  }),
  watch: {
    'checkResult.plantCd'() {
      this.getComboCheckKindItems();
    },
  },
  //* Vue lifecycle: created, mounted, destroyed, etc */
  beforeCreate() {},
  created() {},
  beforeMount() {
    this.$nextTick(() => {
      Object.assign(this.$data, this.$options.data());
      this.init();
    });
  },
  mounted() {},
  beforeDestroy() {},
  //* methods */
  methods: {
    init() {
      this.editable = this.$route.meta.editable;
      // URL setting
      this.insertUrl = transactionConfig.saf.checkPlan.insert.url;
      this.editUrl = transactionConfig.saf.checkPlan.edit.url;
      this.completeUrl = transactionConfig.saf.checkPlan.complete.url;

      // 그리드 헤더 설정
      this.gridOptions.header = [
        {
          text: 'L0000002564', // 점검예정일
          name: 'checkSchYmd',
          width: '20%',
          align: 'center',
          type: 'datepicker',
        },
        {
          text: 'L0000002551', // 점검명
          name: 'checkTitle',
          width: '20%',
          align: 'left',
          type: 'text',
        },
      ];

      this.getComboItems('SAF_CHECK_CYCLE'); // 점검주기
      this.getComboItems('COM_PLANT_CD'); // 사업장
      this.getComboCheckKindItems(); // 점검종류
      this.getComboDeptItems(); // 점검주관부서, 점검수행부서

      // 기간 Setting
      var today = this.$comm.getToday();
      var from = this.$comm.getCalculatedDate(
        today,
        '-1m',
        'YYYY-MM-DD',
        'YYYY-MM-DD'
      );
      var to = this.$comm.getCalculatedDate(
        today,
        '1m',
        'YYYY-MM-DD',
        'YYYY-MM-DD'
      );
      setTimeout(() => {
        this.searchParam.period =
          this.popupParam.period && this.popupParam.period[0]
            ? this.popupParam.period
            : [from, to];
      }, 200);

      if (this.popupParam.safCheckRsltNo > 0) {
        this.checkResult.safCheckRsltNo = this.popupParam.safCheckRsltNo;
        this.checkResult.safCheckKindNo = this.popupParam.safCheckKindNo;
        this.checkResult.deptCd = this.popupParam.deptCd;
        this.checkResult.safCheckPlanNo = this.popupParam.safCheckPlanNo;
        this.searchParam.cycle = this.popupParam.safCheckPerd
          ? this.popupParam.safCheckPerd
          : this.searchParam.cycle;
      }
      // 등록자 setting
      this.checkResult.createUserNm = this.popupParam.createUserNm
        ? this.popupParam.createUserNm + '/' + this.popupParam.createDt
        : this.$store.getters.name + ' / ' + this.$comm.getToday();
    },
    selectedCheck() {
      return this.editable;
    },
    /** 안전점검결과 목록 조회 **/
    getList() {
      this.$http.url = selectConfig.saf.checkResult.list.url;
      this.$http.type = 'GET';
      this.$http.param = {
        safCheckPlanNo: this.popupParam.safCheckPlanNo,
      };
      this.$http.request(
        _result => {
          this.checkResult.safCheckRsltNos = this.$_.clone(
            this.$_.map(_result.data, 'safCheckRsltNo')
          );
          if (this.checkResult.tempTgtDeptCd.length === 0) {
            this.$_.forEach(
              this.$_.uniq(this.$_.map(_result.data, 'tgtDeptCd')),
              item => {
                if (
                  this.$_.findIndex(this.comboTgtDeptItems, ['deptCd', item]) >
                  -1
                ) {
                  this.checkResult.tempTgtDeptCd.push({
                    code: item,
                    name: this.comboTgtDeptItems[
                      this.$_.findIndex(this.comboTgtDeptItems, [
                        'deptCd',
                        item,
                      ])
                    ].deptNm,
                  });
                }
              }
            );
          }

          // 점검기간 목록중 선택되어진 예정일 체크
          this.checkItemTempData = this.$_.uniq(
            this.$_.map(_result.data, 'checkSchYmd')
          );
          if (this.checkItemTempData) {
            this.checkItemData = [];
            this.$_.forEach(this.gridOptions.data, item => {
              if (
                this.$_.indexOf(this.checkItemTempData, item.checkSchYmd) > -1
              ) {
                this.checkItemData.push(item);
              }
            });
          }

          // 점검명 맵핑
          let resultData = _result.data;
          resultData.forEach(item => {
            this.gridOptions.data.forEach(gData => {
              if (item.checkSchYmd === gData.checkSchYmd) {
                gData.checkTitle = item.checkTitle;
              }
            });
          });
        },
        _error => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    /**
     * 공통 마스터 정보 조회 (점검주기)
     * codeGroupCd : 마스터 테이블 codeGroupCd 정보
     */
    getComboItems(codeGroupCd) {
      this.$http.url = this.$format(
        selectConfig.codeMaster.getSelect.url,
        codeGroupCd
      );
      this.$http.type = 'GET';
      this.$http.request(
        _result => {
          if (codeGroupCd === 'SAF_CHECK_CYCLE') {
            this.comboCycleItems = this.$_.clone(_result.data);
            this.comboCycleItems.splice(0, 0, {
              code: null,
              codeNm: this.$comm.getLangSpecInfoLabel('L0000003394') // 선택하세요
            });
            this.searchParam.cycle = 'CCY1W';
          } else {
            this.plantItems = this.$_.clone(_result.data);
            this.plantItems.splice(0, 0, {
              code: null,
              codeNm: this.$comm.getLangSpecInfoLabel('L0000003394') // 선택하세요
            });
            this.checkResult.plantCd = this.popupParam.plantCd;
          }
        },
        _error => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    /**
     * 점검종류 조회
     */
    getComboCheckKindItems() {
      this.$http.url = selectConfig.saf.checkKind.list.url;
      this.$http.type = 'GET';
      this.$http.param = {
        planUseYn: 'Y',
        useYn: 'Y',
        plantCd: this.checkResult.plantCd,
      };
      this.$http.request(
        _result => {
          this.comboCheckKindItems = this.$_.clone(_result.data);
          this.comboCheckKindItems.splice(0, 0, {
            safCheckKindNo: null,
            safCheckKindNm: this.$comm.getLangSpecInfoLabel('L0000003394') // 선택하세요
          });

          if (this.popupParam.safCheckRsltNo > 0) {
            setTimeout(() => {
              this.btnSearchCheckYmdClicked();
            }, 100);
          }
        },
        _error => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    /**
     * 점검주관부서, 점검수행부서 조회
     */
    getComboDeptItems(codeGroupCd) {
      this.$http.url = selectConfig.manage.dept.list.url;
      this.$http.type = 'GET';
      this.$http.request(
        _result => {
          this.comboDeptItems = this.$_.clone(_result.data);
          this.comboDeptItems.splice(0, 0, {
            deptCd: null,
            deptNm: this.$comm.getLangSpecInfoLabel('L0000003394') // 선택하세요
          });
          // this.checkResult.deptCd = null;
          this.comboTgtDeptItems = this.$_.clone(_result.data);
          // this.comboTgtDeptItems.splice(0, 0, { 'deptCd': null, 'deptNm': '선택하세요' });
          // this.checkResult.tempTgtDeptCd = [{ 'code': '', 'name': '선택하세요' }];
        },
        _error => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    /** 신규등록 하기전 UI단 유효성 검사 **/
    beforeInsert() {
      var notOrderedCheckSchYmd = this.$_.clone(
        this.$_.map(this.checkYmdValue, 'checkSchYmd')
      );

      notOrderedCheckSchYmd.sort(function compare(a, b) {
        var dateA = new Date(a);
        var dateB = new Date(b);
        return dateA - dateB;
      });

      this.$validator
        .validateAll()
        .then(_result => {
          // TODO : 전역 성공 메시지 처리
          // 이벤트는 ./event.js 파일에 선언되어 있음
          if (_result) {
            if (this.checkYmdValue.length <= 0) {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395', // 안내
                message: 'M0000000711', // 점검예정일은 최소 1개 이상 필수 지정되야 합니다.
                type: 'warning', // success / info / warning / error
              });
              return;
            }

            window.getApp.$emit('CONFIRM', {
              title: 'L0000003321', // 확인
              message: 'M0000000011', // 저장하시겠습니까?
              // TODO : 필요시 추가하세요.
              type: 'info', // success / info / warning / error
              // 확인 callback 함수
              confirmCallback: () => {
                this.checkResult.createUserId = this.$store.getters.token;
                this.checkResult.updateUserId = this.$store.getters.token;
                this.checkResult.plantCd = this.$store.getters.plantCd;
                this.checkResult.arrayTgtDeptCd = this.$_.clone(
                  this.$_.map(this.checkResult.tempTgtDeptCd, 'code')
                );
                this.checkResult.arrayCheckSchYmd = this.$_.clone(
                  this.$_.map(this.checkYmdValue, 'checkSchYmd')
                );
                this.checkResult.arrayCheckTitle = this.$_.clone(
                  this.$_.map(this.checkYmdValue, 'checkTitle')
                );

                this.checkResult.safCheckPerd = this.$_.clone(
                  this.searchParam.cycle
                );
                this.checkResult.safCheckPlanSymd = this.$_.clone(
                  notOrderedCheckSchYmd[0]
                );
                this.checkResult.safCheckPlanEymd = this.$_.clone(
                  notOrderedCheckSchYmd[notOrderedCheckSchYmd.length - 1]
                );

                this.isInsert = true;
              },
              // 취소 callback 함수
              cancelCallback: () => {
                this.isInsert = false;
              },
            });
          } else if (!_result) {
            window.getApp.$emit('ALERT', {
              title: 'L0000003395', // 안내
              message: 'M0000000710', // 필수입력값을 입력 후 저장해주세요.
              type: 'warning', // success / info / warning / error
            });
          }
        })
        .catch(() => {
          window.getApp.$emit(
            'APP_VALID_ERROR',
            'M0000000881' // '유효성 검사도중 에러가 발생하였습니다.
          );
          this.isInsert = false;
        });
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
    /**
     *  팝업 안 보이도록 closePopup emit
     *  팝업 close
     * data : 팝업창에서 return하는 데이터
     */
    closePopup(data) {
      this.$emit('closePopup', {});
    },
    /** button 관련 이벤트 **/
    /**
     * 검진항목  목록 조회 및 수정 버튼 보이도록 처리
     *  신규등록 버튼 callback
     * _result : backend에서 return하는 데이터
     */
    btnInsertClickedCallback(_result) {
      this.isInsert = false;
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // 안내
        message: 'M0000000006', // 저장되었습니다.
        type: 'success', // success / info / warning / error
      });
      this.closePopup();
    },
    /** button 관련 이벤트 **/
    /**
     * 검색박스 숨기기/보이기 처리 후 setGridSize 호출
     */
    btnSearchVisibleClicked() {
      this.searchArea.show = !this.searchArea.show;
      if (this.searchArea.show) this.searchArea.title = 'L0000000329'; // 검색박스숨기기
      else this.searchArea.title = 'L0000003907'; // 검색박스보이기

      window.getApp.$emit('LOADING_PASS_COUNT', 1);
    },
    /**
     * 수정 버튼 안보여지도록 처리 및 isSubmit false 처리
     *  버튼 http 통신 중 error 발생 callback
     * _result : error return하는 데이터
     */
    btnClickedErrorCallback(_result) {
      this.isInsert = false;
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    // /**
    //  * 데이터 및 이벤트 초기화, 수정버튼 안보여지도록 처리
    //  *  초기화 버튼 callback
    //  */
    // btnClearClickedCallback () {
    //   Object.assign(this.$data.checkResult, this.$options.data().checkResult);

    //   this.searchParam.cycle = '';
    //   this.searchParam.period = [];
    //   this.gridOptions.data = [];
    //   this.checkResult.createUserId = 'dev';
    //   this.checkResult.createUserNm = '개발자 / ' + this.$comm.getToday();
    //   this.$validator.reset();
    // },
    /** 점검기간  목록 조회 **/
    btnSearchCheckYmdClicked() {
      if (!this.checkResult.safCheckKindNo) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // 안내
          message: 'M0000000712', // 점검종류를 선택해주세요.
          type: 'warning', // success / info / warning / error
        });
        return;
      } else if (!this.searchParam.cycle) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // 안내
          message: 'M0000000061', // 점검주기를 선택해주세요.
          type: 'warning', // success / info / warning / error
        });
        return;
      } else if (
        !this.searchParam.period ||
        this.searchParam.period.length <= 0
      ) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // 안내
          message: 'M0000000062', // 점검기간을 선택해주세요.
          type: 'warning', // success / info / warning / error
        });
        return;
      }

      var gapOfDate = '';
      switch (this.searchParam.cycle) {
        case 'CCY1W':
          gapOfDate = '7d'; // 1주
          break;
        case 'CCY1M':
          gapOfDate = '1m'; // 1달
          break;
        case 'CCYPD':
          gapOfDate = '4m'; // 분기
          break;
        case 'CCYHY':
          gapOfDate = '6m'; // 반기
          break;
        case 'CCY1Y':
          gapOfDate = '1y'; // 1년
          break;
        default:
        // code block
      }
      var startDate = this.searchParam.period[0];
      var endDate = this.searchParam.period[1];
      var date = new Date();
      var safCheckKindNm = '';
      safCheckKindNm = this.comboCheckKindItems[
        this.$_.findIndex(this.comboCheckKindItems, [
          'safCheckKindNo',
          this.checkResult.safCheckKindNo,
        ])
      ].safCheckKindNm;
      var gridData = [];
      gridData.push({
        checkSchYmd: startDate,
        checkTitle: safCheckKindNm + '(' + startDate + ')',
      });
      startDate = this.$comm.getCalculatedDate(
        startDate,
        gapOfDate,
        'YYYY-MM-DD',
        'YYYY-MM-DD'
      );

      while (
        this.$comm.getDatediff(
          this.$comm.moment(startDate),
          this.$comm.moment(endDate)
        ) >= 0
      ) {
        gridData.push({
          checkSchYmd: startDate,
          checkTitle: safCheckKindNm + '(' + startDate + ')',
        });
        startDate = this.$comm.getCalculatedDate(
          startDate,
          gapOfDate,
          'YYYY-MM-DD',
          'YYYY-MM-DD'
        );
      }

      this.gridOptions.data = this.$_.clone(gridData);
      if (this.popupParam.safCheckRsltNo > 0) this.getList();
    },
    /**
     * 안전점검계획 삭제
     *  삭제 버튼 callback
     * _result : backend에서 return하는 데이터
     */
    btnDeleteClickedCallback(_result) {
      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321', // 확인
        message: 'M0000000138', // 일괄삭제됩니다.\n삭제하시겠습니까?
        // TODO : 필요시 추가하세요.
        type: 'info', // success / info / warning / error
        // 확인 callback 함수
        confirmCallback: () => {
          var keys = [];
          this.$_.forEach(this.checkResult.safCheckRsltNos, item => {
            keys.push({
              safCheckRsltNo: item,
            });
          });
          this.$http.url = transactionConfig.saf.checkResult.deletes.url;
          this.$http.type = 'DELETE';
          this.$http.param = {
            data: Object.values(this.$_.clone(keys)),
          };
          this.$http.request(
            _result => {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395', // 안내
                message: 'M0000000007', // 삭제되었습니다.
                type: 'success', // success / info / warning / error
              });
              this.closePopup(null);
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
    btnCompleteClicked() {
      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321', // 확인
        message: 'M0000001149', // 완료처리 하시겠습니까?
        // TODO : 필요시 추가하세요.
        type: 'info', // success / info / warning / error
        // 확인 callback 함수
        confirmCallback: () => {
          this.$http.url = this.completeUrl;
          this.$http.type = 'PUT';
          this.$http.param = {
            safCheckRsltNos: this.checkResult.safCheckRsltNos,
            updateUserId: this.$store.getters.token,
          };
          this.$http.request(
            _result => {
              if (_result.data > 0) {
                window.getApp.$emit('ALERT', {
                  title: 'L0000003395', // 안내
                  message: 'M0000000285', // 완료처리 되었습니다.
                  type: 'success', // success / info / warning / error
                });
                this.closePopup(null);
              } else {
                window.getApp.$emit('ALERT', {
                  title: 'L0000003395', // 안내
                  message: 'M0000000714', // 완료처리 중 오류가 발생했습니다.
                  type: 'error', // success / info / warning / error
                });
              }
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
    /** end button 관련 이벤트 **/
  },
};
</script>
