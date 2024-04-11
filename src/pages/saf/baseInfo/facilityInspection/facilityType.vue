<!--
  목적 : 안전 > 기준정보 > 시설관리 > 시설점검유형
  작성자 : lih
  Detail : 시설점검유형 관리 목록/등록/조회 화면
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <b-row ref="searchBox">
      <!-- 검색조건 -->
      <b-col sm="12">
        <b-card header-class="default-card" body-class="default-body-card" class="py-0">
          <div slot="header">
            <div class="float-left">
              <y-label label="검색" />
            </div>
            <div class="float-right">
              <y-btn :title="searchArea.title" color="green" @btnClicked="btnSearchVisibleClicked" />
              <y-btn
                title="검색"
                color="green"
                @btnClicked="btnSearchClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
            </div>
          </div>
          <b-row v-if="searchArea.show">
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-text
                :width="8"
                :maxlength="100"
                ui="bootstrap"
                label="시설유형명"
                name="facilityTypeNm"
                v-model="searchParam.facilityTypeNm"
              ></y-text>
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>

    <b-row class="mt-3">
      <b-col sm="12">
        <b-col sm="12" class="px-0">
          <y-data-table
            ref="dataTable"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            label="시설유형 목록"
            @selectedRow="selectedRow"
          ></y-data-table>
        </b-col>
      </b-col>
    </b-row>

    <!-- 시설점검 유형 상세 -->
    <b-row class="mt-3" ref="detailBox">
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <y-label label="시설점검 유형 상세" icon="user-edit" color-class="cutstom-title-color" />
          </b-col>
        </b-row>
        <b-card>
          <b-row>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-text
                :editable="editable"
                :width="8"
                :required="true"
                ui="bootstrap"
                label="시설유형코드"
                name="facilityTypeCd"
                v-model="facilityInsType.facilityTypeCd"
                v-validate="'required'"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <y-text
                :editable="editable"
                :width="8"
                :maxlength="100"
                :required="true"
                ui="bootstrap"
                label="시설유형명"
                name="facilityTypeNm"
                v-model="facilityInsType.facilityTypeNm"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-switch
                :editable="editable"
                :width="8"
                :required="true"
                true-value="Y"
                false-value="N"
                ui="bootstrap"
                label="PSM해당여부"
                name="radioValue"
                selectText="사용"
                unselectText="미사용"
                v-model="facilityInsType.psmYn"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3"></b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-switch
                :editable="editable"
                :width="8"
                :required="true"
                true-value="Y"
                false-value="N"
                ui="bootstrap"
                label="사용여부"
                name="radioValue"
                selectText="사용"
                unselectText="미사용"
                v-model="facilityInsType.useYn"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-number
                :editable="editable"
                :width="8"
                :maxlength="5"
                :hasSeperator="false"
                :required="true"
                ui="bootstrap"
                name="sortOrder"
                label="정렬순서"
                v-model="facilityInsType.sortOrder"
              ></y-number>
            </b-col>
          </b-row>

          <!-- 버튼 -->
          <div class="float-right">
            <y-btn v-if="editable" title="초기화" @btnClicked="btnClearClickedCallback" />
            <y-btn
              v-if="editable"
              :action-url="saveUrl"
              :param="facilityInsType"
              :is-submit="isSave"
              title="저장"
              color="orange"
              :action-type="actionType"
              beforeSubmit="beforeSave"
              @beforeSave="beforeSave"
              @btnClicked="btnSaveClickedCallback"
              @btnClickedErrorCallback="btnClickedErrorCallback"
            />
          </div>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
export default {
  name: 'y-facility-inspection-type',
  props: {},
  data() {
    return {
      facilityInsType: {
        facilityTypeOriCd: '', // 기존시설유형코드
        facilityTypeCd: '', // 시설유형코드
        facilityTypeNm: '', // 시설유형명
        psmYn: 'N', // PSM해당여부
        useYn: 'Y', // 사용여부
        sortOrder: '', // 정렬순서
      },
      searchArea: {
        title: '검색박스숨기기',
        show: true,
      },
      searchParam: {
        facilityTypeNm: '', // 시설유형명
      },
      gridOptions: {
        header: [],
        data: [],
        height: 210,
      },
      actionType: 'POST',
      editable: false,
      updateMode: false,
      searchUrl: '',
      detailUrl: '',
      checkUrl: '',
      saveUrl: '',
      insertUrl: '',
      editUrl: '',
      isSave: false,
      isInsert: false,
      isEdit: false,
    };
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
    /** 초기화 관련 함수 **/
    init() {
      // URL 셋팅
      this.searchUrl = selectConfig.saf.facilityInsType.list.url;
      this.detailUrl = selectConfig.saf.facilityInsType.get.url;
      this.checkUrl = selectConfig.saf.facilityInsType.check.url;
      this.insertUrl = transactionConfig.saf.facilityInsType.insert.url;
      this.editUrl = transactionConfig.saf.facilityInsType.edit.url;

      // this.editable = this.$route.meta.editable;
      this.editable = true;

      // 시설점검유형 항목 grid 헤더 설정
      this.gridOptions.header = [
        {
          text: '시설유형코드',
          name: 'facilityTypeCd',
          width: '130px',
          align: 'center',
        },
        {
          text: '시설유형명',
          name: 'facilityTypeNm',
          width: '130px',
          align: 'center',
        },
        {
          text: 'PSM여부',
          name: 'psmYnNm',
          width: '130px',
          align: 'center',
        },
        { text: '사용여부', name: 'useYnNm', width: '100px', align: 'center' },
        {
          text: '정렬순서',
          name: 'sortOrder',
          width: '100px',
          align: 'center',
        },
      ];

      setTimeout(() => {
        this.getDataList(); // 시설유형 항목 grid
      }, 200);
    },
    // 시설유형 항목 grid
    getDataList() {
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = this.searchParam;
      this.$http.request(
        _result => {
          this.gridOptions.data = _result.data;
        },
        _error => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    // 그리드 row click 이벤트
    selectedRow(data) {
      if (data === null) return;
      this.$http.url = this.$format(this.detailUrl, data.facilityTypeCd);
      this.$http.type = 'GET';
      this.$http.request(
        _result => {
          this.facilityInsType = this.$_.clone(_result.data);
          // 기존 시설유형코드 세팅
          this.facilityInsType.facilityTypeOriCd = this.facilityInsType.facilityTypeCd;
          this.updateMode = true;
        },
        _error => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    showMessage(checkList, flag) {
      var checkText = '';
      var i = 0;
      for (; i < checkList.length; i++) {
        if (this.$_.parseInt(checkList[i].cnt) > 0) {
          checkText = '이미 존재하는 시설유형코드입니다.';
          break;
        }
      }
      if (checkText) {
        window.getApp.$emit('ALERT', {
          title: '안내',
          message: checkText,
          type: 'warning',
        });
        return false;
      } else {
        return true;
      }
    },
    checkValidator(flag) {
      this.$validator
        .validateAll()
        .then(_result => {
          if (_result) {
            this.$http.url = this.checkUrl;
            this.$http.type = 'GET';
            this.$http.param = {
              facilityTypeCd: this.facilityInsType.facilityTypeCd,
            };
            this.$http.request(
              _result => {
                var returnVal = this.showMessage(_result.data, flag);

                if (returnVal) {
                  window.getApp.$emit('CONFIRM', {
                    title: '확인',
                    message:
                      flag === 'edit'
                        ? '수정하시겠습니까?'
                        : '등록하시겠습니까?',
                    type: 'info',
                    // 확인 callback 함수
                    confirmCallback: () => {
                      if (flag === 'edit') this.isEdit = true;
                      else this.isInsert = true;
                      this.isSave = true;
                    },
                    cancelCallback: () => {
                      if (flag === 'edit') this.isEdit = false;
                      else this.isInsert = false;
                      this.isSave = false;
                    },
                  });
                }
              },
              _error => {
                window.getApp.$emit('APP_REQUEST_ERROR', _error);
              }
            );
          } else {
            window.getApp.$emit('ALERT', {
              title: '안내',
              message: '필수입력값을 입력해주세요.',
              type: 'warning',
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
    /** 신규등록 하기전 UI단 유효성 검사 **/
    beforeSave() {
      var gubun = '';

      // 신규등록
      if (!this.updateMode) {
        gubun = 'insert';
        this.saveUrl = this.insertUrl;
        this.actionType = 'POST';
      }
      // 수정
      else {
        gubun = 'edit';
        this.saveUrl = this.editUrl;
        this.actionType = 'PUT';
      }

      this.checkValidator(gubun);
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
    /** /validation checking **/

    /** Button Event **/
    // 검색박스숨기기
    btnSearchVisibleClicked() {
      this.searchArea.show = !this.searchArea.show;
      if (this.searchArea.show) this.searchArea.title = '검색박스숨기기';
      else this.searchArea.title = '검색박스보이기';

      window.getApp.$emit('LOADING_PASS_COUNT', 1);
    },
    // 검색
    btnSearchClickedCallback(_result) {
      this.getDataList();
    },
    // 초기화
    btnClearClickedCallback() {
      this.updateMode = false;
      Object.assign(
        this.$data.facilityInsType,
        this.$options.data().facilityInsType
      );
      this.$validator.reset();
    },
    /**
     * 대상부서 목록 조회 및 수정버튼 보여지도록 처리
     *  신규등록 버튼 callback
     * _result : backend에서 return하는 데이터
     */
    btnSaveClickedCallback(_result) {
      // _result.data가 저장여부 1/0을 반환하고 있음.
      this.isInsert = false;
      this.updateMode = true;
      this.facilityInsType = _result.data;
      window.getApp.$emit('ALERT', {
        title: '안내',
        message: '저장되었습니다.',
        type: 'success', // success / info / warning / error
      });
      this.isSave = false;
      this.getDataList();
      this.btnClearClickedCallback();
    },
    // 버튼 에러 처리
    btnClickedErrorCallback(_result) {
      this.isInsert = false;
      this.isEdit = false;
      this.updateMode = false;
      window.getApp.emit('APP_REQUEST_ERROR', _result);
    },
    /** /Button Event **/
  },
};
</script>