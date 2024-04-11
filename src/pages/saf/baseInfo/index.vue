<!--
  목적 : 검진 기준정보 - 검진항목
  Detail : 검진항목 등록/수정화면
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <!-- 검색 결과 테이블 -->
    <b-row>
      <b-col sm="12">
        <b-col sm="11" class="px-0">
          <y-data-table
            :headers="gridHeaderItemOptions"
            :items="gridItemData"
            :editable="editable"
            :print="true"
            :rows="5"
            :cellClick="true"
            v-model="heaTestItem"
            label="임시 페이지"
            ref="dataTable"
          >
          </y-data-table>
        </b-col>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
export default {
  /* attributes: name, components, props, data */
  name: 'y-test-item',
  props: {},
  data: () => ({
    heaTestItem: {
      heaTestItemCd: '',
      heaTestClassCd: null,
      heaTestClassNm: '',
      heaTestItemNm: '',
      unit: '',
      heaResultTypeCd: null,
      heaResultTypeNm: '',
      remark: '',
      specRef: '',
      sortOrder: '',
      useYn: '',
    },
    baseWidth: 9,
    editable: true,
    isSubmit: false,
    isSubmit2: false,
    radioItems: null,
    gridItemData: [],
    gridHeaderItemOptions: [],
    comboTestClassItems: [],
    comboResultTypeItems: [],
    insertUrl: '',
    saveUrl: '',
  }),
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
      // radio 버튼 셋팅
      setTimeout(() => {
        this.radioItems = [
          { useYn: 'Y', useName: '사용' },
          { useYn: 'N', useName: '미사용' },
        ];
      }, 1000);

      // 그리드 헤더 설정
      this.gridHeaderItemOptions = [
        {
          text: '검진검사',
          name: 'heaTestClassNm',
          width: '20%',
          align: 'left',
          link: 'test',
        },
        {
          text: '검진항목',
          name: 'heaTestItemNm',
          width: '20%',
          align: 'left',
        },
        { text: '단위', name: 'unit', width: '10%', align: 'center' },
        {
          text: '결과타입',
          name: 'heaResultTypeNm',
          width: '10%',
          align: 'center',
        },
        { text: '정렬순서', name: 'sortOrder', width: '10%', align: 'center' },
        { text: '사용여부', name: 'useYn', width: '10%', align: 'center' },
      ];

      this.getComboItems('HEA_RESULT_TYPE');
      this.getComboItems('HEA_TEST_CLASS');
      this.getItemList();
    },

    getComboItems(codeGroupCd) {
      this.$http.url = this.$format(
        selectConfig.codeMaster.getSelect.url,
        codeGroupCd
      );
      this.$http.type = 'GET';
      // this.$http.param = {
      //   "codeGroupCd": codeGroupCd
      // };
      this.$http.request(
        (_result) => {
          if (codeGroupCd === 'HEA_RESULT_TYPE') {
            this.comboResultTypeItems = _result.data;
          } else {
            this.comboTestClassItems = _result.data;
          }
        },
        (_error) => {
          this.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },

    ReceivesData(data) {
      Object.assign(this.heaTestItem, data);
      this.heaTestItem.useYn = data.useYn === '사용' ? 'Y' : 'N';
    },

    /** 수정 하기전 UI단 유효성 검사 **/
    beforeSubmit() {
      this.isSubmit2 = this.checkValidation();
      this.saveUrl = transactionConfig.hea.testItem.edit.url;
    },
    beforeInsert() {
      this.isSubmit = this.checkValidation();
      this.insertUrl = transactionConfig.hea.testItem.insert.url;
    },
    /**
     * 수정전 유효성 검사
     */
    checkValidation() {
      this.$validator
        .validateAll()
        .then((_result) => {
          if (!_result) {
            window.getApp.$emit(
              'APP_VALID_ERROR',
              '유효성 검사도중 에러가 발생하였습니다.'
            );
          }
          return _result;
          // TODO : 전역 성공 메시지 처리
          // 이벤트는 ./event.js 파일에 선언되어 있음
        })
        .catch(() => {
          return false;
        });
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
    getItemList() {
      this.$http.url = selectConfig.hea.testItem.list.url;
      this.$http.type = 'GET';
      // this.$http.param = {
      //   "heaTestClassCd": ''
      // };
      this.$http.request(
        (_result) => {
          this.gridItemData = _result.data;
        },
        (_error) => {
          this.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    /**
     * 사용자의 입력을 받는다.
     */
    getConfirm() {},
    /** button 관련 이벤트 **/
    btnSaveClickedCallback(_result) {
      // this.$emit('APP_REQUEST_SUCCESS', '수정 버튼이 클릭 되었습니다.');
      this.getItemList();
      this.btnClearClickedCallback();
      this.isSubmit2 = false;
    },
    btnInsertClickedCallback(_result) {
      this.getItemList();
      this.btnClearClickedCallback();
      this.isSubmit = false;
    },
    btnClickedErrorCallback(_result) {
      this.isSubmit = false;
      this.isSubmit2 = false;
      this.btnClearClickedCallback();
      this.$emit('APP_REQUEST_ERROR', _result);
    },
    btnClearClickedCallback() {
      Object.assign(this.$data.heaTestItem, this.$options.data().heaTestItem);
      this.$validator.reset();
      window.getApp.$emit(
        'APP_REQUEST_SUCCESS',
        '초기화 버튼이 클릭 되었습니다.'
      );
    },
    /** end button 관련 이벤트 **/
  },
};
</script>
