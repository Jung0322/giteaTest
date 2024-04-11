<!--
  TODO: vue.js + Bootstrap 샘플 예제
-->
<template>
  <b-container fluid>
    <b-row>
      <b-col sm="12">
        <!-- 등록용 예제 시작 -->
        <b-card>
          <!-- header 영역 시작 -->
          <div slot="header">
            <div class="float-left">
              <y-label label="등록 예제" />
            </div>
            <div class="float-right">
              <y-btn type="save" title="신규등록" size="small" color="primary" icon="el-icon-edit" />
              <y-btn
                type="save"
                title="수정"
                size="small"
                color="primary"
                icon="el-icon-edit-outline"
              />
              <y-btn type="delete" title="삭제" size="small" color="danger" icon="el-icon-delete" />
            </div>
          </div>
          <!-- header 영역 종료 -->

          <!-- 본문 영역 시작 -->
          <!-- <b-row>
            <b-col sm="12">
              <h6><small class="font-italic">4열 사용예</small></h6>
            </b-col>
          </b-row>-->
          <b-row>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              <y-label label="검진기관" />
            </b-col>
          </b-row>
          <b-row>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-text
                :width="baseWidth"
                :editable="editable"
                :maxlength="5"
                ui="bootstrap"
                label="건진종류명*"
                name="type"
                :prependIcon="preprenIcons"
                :appendIcon="icons"
                v-model="demo.type"
                v-validate="'required'"
                :state="validateState('type')"
                @iconCallback="iconCallback"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-text
                :width="baseWidth"
                :editable="editable"
                :maxlength="200"
                ui="bootstrap"
                label="건진코드"
                name="test"
                v-model="demo.code"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-number
                :width="baseWidth"
                :editable="editable"
                :maxlength="10"
                :hasSeperator="false"
                :pointNumber="2"
                ui="bootstrap"
                label="실수형"
                name="number"
                v-model="demo.number"
              ></y-number>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-number
                :width="baseWidth"
                :editable="editable"
                :maxlength="10"
                ui="bootstrap"
                label="천단위 구분자"
                name="numberSeperate"
                v-model="demo.numberSeperate"
              ></y-number>
            </b-col>
          </b-row>
          <b-row>
            <b-col sm="3">
              <y-number
                :width="baseWidth"
                :editable="editable"
                :maxlength="10"
                :pointNumber="2"
                prefix="$"
                ui="bootstrap"
                label="금액/단위(접두사)"
                name="number"
                v-model="demo.numberPrefix"
              ></y-number>
            </b-col>
            <b-col sm="3">
              <y-number
                :width="baseWidth"
                :editable="editable"
                :maxlength="10"
                :pointNumber="2"
                suffix="$"
                ui="bootstrap"
                label="금액/단위(접미사)"
                name="number"
                v-model="demo.numberSuffix"
              ></y-number>
            </b-col>
            <b-col sm="3">
              <y-select
                :width="baseWidth"
                :editable="editable"
                :comboItems="comboItems"
                itemText="deptName"
                itemValue="deptPk"
                ui="bootstrap"
                type="edit"
                label="Select 등록용*"
                name="selectValue"
                v-model="demo.selectValue"
                v-validate="'required'"
                :state="validateState('selectValue')"
              ></y-select>
            </b-col>
            <b-col sm="3"></b-col>
            <b-col sm="3">
              <!-- TODO : default - 오늘 today, 1달전 -1m, 1년 후 1m, -->
              <y-datepicker
                :width="baseWidth"
                :editable="editable"
                default="today"
                label="날짜"
                name="remark"
                :clearable="true"
                datepickerWidth="100"
                v-model="demo.date"
              ></y-datepicker>
            </b-col>
            <b-col sm="3">
              <y-datepicker
                :width="baseWidth"
                :editable="editable"
                type="year"
                label="년도"
                name="remark"
                v-model="demo.year"
              ></y-datepicker>
            </b-col>
            <b-col sm="3">
              <y-datepicker
                :width="baseWidth"
                :editable="editable"
                type="month"
                label="월"
                name="remark"
                v-model="demo.month"
              ></y-datepicker>
            </b-col>
            <b-col sm="3">
              <y-datepicker
                :width="baseWidth"
                :editable="editable"
                type="time"
                label="시간"
                name="remark"
                v-model="demo.hour"
              ></y-datepicker>
            </b-col>
            <b-col sm="3">
              <datetime-picker
                v-model="demo.hhmm"
                lang="en"
                type="time"
                format="hh:mm"
                :minute-step="1"
              ></datetime-picker>
            </b-col>
            <b-col sm="3">
              <y-datepicker
                :width="baseWidth"
                label="시분 range"
                type="time"
                ui="bootstrap"
                :range="true"
                :minuteStep="1"
                v-model="demo.hhmmp"
              />
            </b-col>
            <b-col sm="6">
              <y-datepicker
                :width="10"
                :editable="editable"
                :range="true"
                label="기간"
                name="remark"
                v-model="demo.period"
              ></y-datepicker>
            </b-col>
            <b-col sm="3">
              <y-switch
                :width="baseWidth"
                :editable="editable"
                true-value="Y"
                false-value="N"
                ui="bootstrap"
                label="switch"
                name="switch"
                selectText="선택"
                unselectText="미선택"
                v-model="demo.switch"
              ></y-switch>
            </b-col>
          </b-row>

          <b-row>
            <b-col sm="12">
              <h6>
                <small class="font-italic">※ 지금과 같이 필요에 의해 따로 구분해야 할 경우 b-row로 열을 구분합니다.</small>
              </h6>
            </b-col>
          </b-row>

          <b-row>
            <b-col sm="6">
              <y-radio
                :width="widthTwoCols"
                :editable="editable"
                :comboItems="comboItems"
                itemText="deptName"
                itemValue="deptPk"
                ui="bootstrap"
                label="Radio 예제*"
                name="radioValue"
                v-model="demo.radioValue"
                v-validate="'required'"
                :state="validateState('radioValue')"
              />
            </b-col>
            <b-col sm="6">
              <y-checkbox
                :width="widthTwoCols"
                :editable="editable"
                :comboItems="comboItems"
                itemText="deptName"
                itemValue="deptPk"
                ui="bootstrap"
                label="checkbox 예제*"
                name="checkbox"
                v-model="demo.checkbox"
                v-validate="'required'"
                :state="validateState('checkbox')"
              />
            </b-col>
          </b-row>

          <!-- 
            TODO : shuttle box에서 아래쪽 마진이 기본적으로 붙지 않는 문제가 있습니다.
            우선 이렇게 작업하시고 추후 수정하도록 하겠습니다.
          -->
          <b-row class="mb-2">
            <b-col sm="6">
              <y-shuttlebox
                :width="widthTwoCols"
                :editable="editable"
                :items="shuttleboxItems"
                itemText="text"
                itemValue="value"
                ui="bootstrap"
                label="shuttlebox 예제"
                name="shwttlebox"
                v-model="searchParam.heaDiagnoseCds"
              ></y-shuttlebox>
            </b-col>
          </b-row>

          <b-row>
            <b-col sm="12">
              <y-textarea
                :width="11"
                :editable="editable"
                :maxlength="3000"
                ui="bootstrap"
                label="비고"
                name="remark"
                v-model="demo.remark"
              ></y-textarea>
            </b-col>
            <b-col sm="6">
              <y-tree-process
                :required="true"
                :editable="editable"
                label="공정 저장용"
                name="psa"
                v-model="demo.psa"
                v-validate="'required'"
                :state="validateState('psa')"
              ></y-tree-process>
            </b-col>
            <b-col sm="6">
              <y-tree-process label="공정 조회용" name="pse" type="search" v-model="demo.pse"></y-tree-process>
            </b-col>
          </b-row>
        </b-card>
        <!-- 본문 영역 종료 -->
      </b-col>
    </b-row>
    <!-- 등록용 예제 종료 -->

    <b-row>
      <b-col sm="12">
        <y-btn
          :is-submit="isSubmit"
          type="test"
          title="팝업 테스트"
          size="small"
          color="primary"
          @btnClicked="btnTestClickedCallback"
        />
      </b-col>
    </b-row>

    <b-row>
      <b-col sm="12">
        <b-card class="mt-3">
          <div slot="header">
            <strong>v-model</strong>
            <small>정보</small>
          </div>
          <div class="mb-3">demo 모델 : {{demo}}</div>
          <div class="mb-3">검색조건 : {{searchParam}}</div>
          <div class="mb-3">
            팝업 :
            <span v-if="popupData && popupData.length">
              <span v-for="(item, index) in popupData" :key="index">{{index}} : {{item}}</span>
            </span>
          </div>
        </b-card>
      </b-col>
    </b-row>

    <!-- 아래 row는 참고하지 마세요. 간격을 일부러 주기 위함입니다. -->
    <b-row class="my-3"></b-row>

    <!-- 검색용 예제 시작 -->
    <b-row>
      <b-col sm="12">
        <b-card>
          <!-- header 영역 시작 -->
          <div slot="header">
            <div class="float-left">
              <y-label label="검색 예제" />
            </div>
            <div class="float-right">
              <y-btn type="search" title="검색" size="small" color="success" icon="el-icon-search" />
            </div>
          </div>
          <!-- header 영역 종료 -->
          <!-- 본문 영역 시작 -->
          <!-- <b-row>
            <b-col sm="12">
              <h6><small class="font-italic">4열 사용예</small></h6>
            </b-col>
          </b-row>-->

          <b-row>
            <b-col sm="3">
              <y-text
                :width="baseWidth"
                :editable="editable"
                ui="bootstrap"
                label="건진종류명*"
                name="type"
                :clearable="true"
                v-model="demo.type"
                v-validate="'required'"
                :state="validateState('type')"
              ></y-text>
            </b-col>
            <b-col sm="3">
              <y-text
                :width="baseWidth"
                :editable="editable"
                ui="bootstrap"
                label="건진코드"
                name="test"
                v-model="demo.code"
              ></y-text>
            </b-col>
            <b-col sm="3">
              <y-select
                :width="baseWidth"
                :editable="editable"
                :comboItems="comboItems"
                itemText="deptName"
                itemValue="deptPk"
                ui="bootstrap"
                type="search"
                label="Select 조회용"
                name="selectValue"
                v-model="demo.selectValue"
              ></y-select>
            </b-col>
            <b-col sm="3">
              <y-switch
                :width="baseWidth"
                :editable="editable"
                true-value="Y"
                false-value="N"
                ui="bootstrap"
                label="switch"
                name="switch"
                selectText="사용"
                unselectText="미사용"
                v-model="demo.switch"
              ></y-switch>
            </b-col>
          </b-row>
          <b-row>
            <b-col sm="12">
              <!-- <y-expand-search>
                <div slot="body">
                  <b-row>
                    <b-col sm="6">
                      <y-select
                        :width="baseWidth"
                        :editable="editable"
                        :comboItems="comboItems"
                        itemText="deptName"
                        itemValue="deptPk"
                        ui="bootstrap"
                        type="search"
                        label="Select 조회용"
                        name="selectValue"
                        v-model="searchParam.selectValue"
                      ></y-select>
                    </b-col>
                    <b-col sm="6">
                      <y-radio
                        :width="baseWidth"
                        :editable="editable"
                        :comboItems="comboItems"
                        itemText="deptName"
                        itemValue="deptPk"
                        ui="bootstrap"
                        label="Radio 예제*"
                        name="radioValue"
                        v-model="searchParam.radioValue"
                      />
                    </b-col>
                  </b-row>
                </div>
              </y-expand-search> -->
            </b-col>
          </b-row>
        </b-card>
        <!-- 본문 영역 종료 -->
      </b-col>
    </b-row>

    <b-row class="mt-2">
      <b-col sm="12">
        <b-card no-body>
          <div slot="header">
            <div class="float-left">
              <y-label label="Grid 타이틀" />
            </div>
            <div class="float-right">
              <y-btn type="add" size="small" color="primary" icon="el-icon-edit" />
              <y-btn type="delete" size="small" color="danger" icon="el-icon-delete" />
            </div>
          </div>
          <div style="width:1024; overflow-x:auto;">
            <y-data-table
              ui="bootstrap"
              :border="false"
              :headers="gridHeaderOptions"
              :items="gridData"
              :use-paging="true"
              @selectedRow="selectedRow"
              @tableLinkClicked="tableLinkClicked"
            >
              <!-- <el-table-column
              type="selection"
              slot="selection"
              width="55">
              </el-table-column>-->
            </y-data-table>
          </div>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import axios from 'axios';
import selectConfig from '@/js/selectConfig';
import backendConfig from '@/js/backendConfig.js';
import vue2Datepicker from 'vue2-datepicker';
export default {
  name: 'sampleBootstrap',
  components: {
    'datetime-picker': vue2Datepicker,
  },
  /** props, data, computed, watch **/
  props: {},
  data: () => ({
    demo: {
      type: '',
      code: '',
      number: null,
      numberSeperate: null,
      numberPrefix: null,
      numbersuffix: null,
      selectValue: null,
      mutiSelectValues: [],
      radioValue: null,
      checkbox: null,
      usable: true,
      date: null,
      year: null,
      month: null,
      time: null,
      hhmm: null,
      hhmmp: [],
      period: null,
      remark: '',
      switch: 'N',
      shuttlebox: [],
      pse: '',
      psa: '',
    },
    popupData: {},
    baseWidth: 8,
    widthTwoCols: 10,
    editable: true,
    gridData: [],
    gridHeaderOptions: [],
    gridMultiHeaderOptions: [],
    saveUrl: '/api/hea/checkup/checkupResultsMap',
    deleteUrl: '',
    isSubmit: null,
    comboItems: [],
    shuttleboxItems: [],
    icons: [
      { icon: 'search', callbackName: 'iconCallback' },
      // { 'icon': 'times', callbackName: 'iconCallback' }
    ],
    preprenIcons: [{ icon: 'search', callbackName: 'iconCallback' }],
    searchParam: {
      year: 2018,
      heaCheckupPlanNo: 1,
      heaDiagnoseCds: [1],
      retirementYn: 'N',
      heaCheckedOrgNos: [3, 5],
      diseaseClassCd: '',
      diseaseCd: '',
    },
    // 첨부파일 그룹
    attachFileGrp: {
      taskClassNm: 'test',
      taskKey: 'test',
      createUserId: 'tester',
    },
    metaInfo: {
      taskClassNm: 'ELECT_HIS',
      taskKey: 'test'
      // createUserId: this.$store.getters.token
    },
    fileUploadOptions: {
      acceptType: ['zip', 'image'],
      limitCount: 10
    },
    isUpload: false
  }),
  computed: {},
  watch: {
    'demo.period': function () {},
    'demo.hhmmp' () {
    },
  },
  /** created, beforeMount, mounted, beforeDestroy, destroyed **/
  beforeCreate () {},
  created () {},
  beforeMount () {
    this.getDeptItems();
    this.init();

    // TODO : 팝업에서 보내는 정보 수신
    window.getApp.$on('POPUP_SEND_DATA', this.popupSelectChanged);

    // alert 사용 예시
    // window.getApp.$emit('ALERT', {
    //   title: 'alert title',
    //   message: 'alert message',
    //   type: 'warning',  // success / info / warning / error
    //   // TODO : 필요시 추가하세요.
    //   // callback: () => {
    //   //   window.alert('');
    //   // }
    // });

    // confirm 사용 예시
    // window.getApp.$emit('CONFIRM', {
    //   title: 'confirm title',
    //   message: 'confirm message',
    //   // TODO : 필요시 추가하세요.
    //   // type: 'success',  // success / info / warning / error
    //   // 확인 callback 함수
    //   confirmCallback: () => {
    //     window.alert('confirm');
    //   },
    //   // 취소 callback 함수
    //   cancelCallback: () => {
    //     window.alert('cancel');
    //   }
    // });

    // // toast message 사용 예시
    // window.getApp.$emit('MESSAGE', {
    //   // TODO : 필요시 추가하세요.
    //   // type: 'success',  // success / info / warning / error
    //   message: 'this is toast message',
    //   // TODO : 팝업 유지시간(기본 3초)
    //   // duration: 5000
    // });

    // // 우측 안내 팝업 사용 예시
    // window.getApp.$emit('NOTIFY', {
    //   // TODO : 필요시 추가하세요.
    //   // type: 'success',  // success / info / warning / error
    //   message: 'this is notify message',
    //   // TODO : 팝업 유지시간(기본 3초)
    //   // duration: 5000
    // });
  },
  mounted () {
    setTimeout(() => {
      this.demo.type = 'test';
    }, 3000);
  },
  beforeDestroy () {
    // TODO : 팝업을 사용할 경우 반드시 추가할 것, 추가하지 않으면 이벤트가 중복 발생
    window.getApp.$off('POPUP_SEND_DATA', this.popupSelectChanged);
  },
  destroyed () {},
  /** methods **/
  methods: {
    init () {
      var from = this.$comm.getToday();
      var to = this.$comm.getCalculatedDate(
        from,
        '2m',
        'YYYY-MM-DD',
        'YYYY-MM-DD'
      );
      this.demo.date = from;
      // 그리드 멀티 헤더 설정(예시)
      this.gridMultiHeaderOptions = [
        { text: 'Date', name: 'date', width: '150', fixed: true },
        {
          text: 'Delivery Info',
          child: [
            { text: 'Name', name: 'name', width: '120' },
            {
              text: 'Address Info',
              child: [
                { text: 'State', name: 'state', width: '120' },
                { text: 'City', name: 'city', width: '120' },
                { text: 'Address', name: 'address', width: '120' },
                { text: 'Zip', name: 'zip', width: '120' },
              ],
            },
          ],
        },
      ];

      // TODO : backend에서 데이터를 조회해 올것
      setTimeout(() => {
        this.demo.shuttlebox = [1, 3];
      }, 1000);

      // TODO : backend에서 데이터를 조회해 올것
      this.shuttleboxItems = [
        { text: 'Orange', value: '1' },
        { text: 'Apple', value: '2' },
        { text: 'Pineapple', value: '3' },
        { text: 'Grape', value: '4' },
      ];

      this.gridHeaderOptions = [
        // 팝업으로 띄울 경우 url에 YPopup에 추가된 type명을 입력할 것
        {
          text: '링크',
          name: 'link',
          width: '50',
          align: 'center',
          url: 'checkupUser',
          target: 'popup',
        },
        {
          text: '텍스트',
          name: 'text',
          width: '100',
          align: 'center',
          type: 'text',
        },
        { text: '숫자', name: 'number', width: '100', type: 'number' },
        {
          text: 'select',
          name: 'select',
          width: '100',
          type: 'select',
          items: this.shuttleboxItems,
          itemText: 'text',
          itemValue: 'value',
        },
        {
          text: 'datepicker',
          name: 'datepicker',
          width: '150',
          align: 'center',
          type: 'datepicker',
        },
        {
          text: '기간',
          name: 'period',
          width: '150',
          type: 'datepicker',
          range: true,
        },
        {
          text: '라디오',
          name: 'radio',
          width: '100',
          type: 'radio',
          items: this.shuttleboxItems,
          itemText: 'text',
          itemValue: 'value',
        },
        {
          text: '체크박스',
          name: 'checkbox',
          width: '100',
          type: 'checkbox',
          items: this.shuttleboxItems,
          itemText: 'text',
          itemValue: 'value',
        },
        {
          text: '버튼',
          name: 'button',
          width: '80',
          type: 'select',
          items: this.shuttleboxItems,
          itemText: 'text',
          itemValue: 'value',
        },
      ];

      this.getGridData();

      this.metaInfo.createUserId = this.$store.getters.token;

      // this.getComboItems('HEA_TEST_CLASS'); // 검진검사
      // this.getComboItems('HEA_CHECKUP_TYPE'); // 검진유형
    },
    /** Call API service **/
    /**
     * 부서 정보를 가져옴
     */
    getDeptItems () {
      // 이 부분을 api service 호출 하는 것으로 바꿀 것
      setTimeout(() => {
        this.comboItems = [
          { deptPk: '1', deptName: '경영팀' },
          { deptPk: '2', deptName: 'SDG팀' },
          { deptPk: '3', deptName: '영업팀' },
        ];

        this.demo.checkbox = ['1', '2'];

        this.demo.radioValue = '2';
      }, 3000);
    },
    getComboItems (codeGroupCd) {
      this.$http.url = this.$format(
        selectConfig.comCodeMaster.get.url,
        codeGroupCd
      );
      this.$http.type = 'GET';
      this.$http.param = {
        codeGroupCd: codeGroupCd,
      };
      this.$http.request(
        _result => {},
        _error => {
          this.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    /** /Call API service **/

    /** validation checking **/
    /**
     * 저장 하기전 UI단 유효성 검사
     **/
    beforeSubmit () {
      this.checkValidation();
    },
    /**
     * 저장전 유효성 검사
     */
    checkValidation () {
      this.$validator
        .validateAll()
        .then(_result => {
          this.isSubmit = _result;
          // TODO : 전역 성공 메시지 처리
          // 이벤트는 ./event.js 파일에 선언되어 있음
          if (!this.isSubmit) {
            window.getApp.$emit(
              'APP_VALID_ERROR',
              '유효성 검사도중 에러가 발생하였습니다.'
            );
          }
        })
        .catch(() => {
          this.isSubmit = false;
        });
    },
    validateState (ref) {
      if (
        this.veeBag[ref] &&
        (this.veeBag[ref].dirty || this.veeBag[ref].validated)
      ) {
        return !this.errors.has(ref);
      }
      return null;
    },
    /** /validation checking **/

    /** Events, Callbacks (버튼 제외) **/
    iconCallback () {},
    getGridData () {
      // { text: '텍스트', name: 'text', width: '20%', align: 'center', type: 'text' },
      //   { text: '숫자', name: 'number', width: '20%', type: 'number' },
      //   { text: 'select', name: 'select', width: '10%', type: 'select' },
      //   { text: 'datepicker', name: 'datepicker', width: '10%' },
      //   { text: '기간', name: 'period', width: '10%' },
      //   { text: '라디오', name: 'radio', width: '10%' },
      //   { text: '버튼', name: 'button', width: '10%' },
      this.gridData = [
        {
          link: '링크',
          text: '텍스트',
          number: '123',
          select: '',
          datepicker: '2019-01-01',
          period: '',
          radio: 1,
          checkbox: [1, 2],
        },
      ];
    },
    /**
     * 팝업 창에서 선택된 정보가 바뀔 경우 후속 처리
     */
    popupSelectChanged (_result) {
      this.popupData = _result;
    },
    /**
     * 파일 업로드 완료 후 관련 테이블에 업데이트
     */
    fileUploadComplete (_result) {
      // 추후 작업 예정
    },
    /** /Events, Callbacks (버튼 제외) **/

    /** button 관련 이벤트 **/
    btnSearchClickedCallback (_result) {},
    btnClearClickedCallback () {
      this.$validator.reset();
      window.getApp.$emit(
        'APP_REQUEST_SUCCESS',
        '초기화 버튼이 클릭 되었습니다.'
      );
    },
    btnSaveClickedCallback (_result) {
      this.isSubmit = null;
      window.getApp.$emit(
        'APP_REQUEST_SUCCESS',
        '[SAMPLE Message] 저장 Action이 요청 되었습니다. 콘솔창을 확인하세요.'
      );
    },
    btnDeleteClickedCallback (_result) {
      window.getApp.$emit(
        'APP_REQUEST_SUCCESS',
        '삭제 버튼이 클릭 되었습니다.'
      );
    },
    btnClickedErrorCallback (_result) {
      this.isSubmit = null;
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    btnTestClickedCallback () {
      this.isSubmit = null;
      window.getApp.$emit('POPUP_OPEN', {
        isPopupOpen: true,
        id: 'popup',
        label: '팝업테스트',
        editable: false,
        type: 'checkupUser',
        childProps: {
          checkupPlanNo: 10,
        },
      });
    },
    selectedRow (data) {},
    tableLinkClicked (header, row) {
      alert(header.type + '::' + row.text);
    },
    testFileUpload() {
      this.isUpload = true;
    },
    fileUploadSuccess() {
      this.isUpload = false;
    },
    fileUploadError() {
      this.isUpload = false;
    }
    /** end button 관련 이벤트 **/

    /** 기타 로직 **/
    /** /기타 로직 **/
  },
};
</script>

<style>
</style>
