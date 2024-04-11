<!--
  목적 : 안전 > 기준정보 > 안전관찰분류
  작성자 : kdh
  Detail : 안전관찰분류 목록/등록/조회 화면
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
              <y-select
                :width="8"
                :comboItems="mainCategorySearchItems"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                label="대분류"
                name="mainCategorySearch"
                v-model="searchParam.mainCategory"
              ></y-select>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-text
                :width="9"
                ui="bootstrap"
                label="중분류"
                name="categorySearch"
                v-model="searchParam.category"
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
            label="안전관찰분류 목록"
            ref="dataTable"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            @selectedRow="selectedRow"
          ></y-data-table>
        </b-col>
      </b-col>
    </b-row>

    <!-- 안전관찰분류 상세 -->
    <b-row class="mt-3" ref="detailBox">
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <y-label label="안전관찰분류 상세" icon="user-edit" color-class="cutstom-title-color" />
          </b-col>
        </b-row>
        <b-card>
          <b-row>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-select
                :width="8"
                :comboItems="mainCategoryItems"
                :editable="editable"
                :required="true"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                label="대분류"
                name="mainCategory"
                v-model="observationClass.mainCategory"
                v-validate="'required'"
                :state="validateState('mainCategory')"
              ></y-select>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-text
                :width="8"
                :editable="editable"
                :maxlength="30"
                :required="true"
                ui="bootstrap"
                label="중분류"
                name="category"
                v-model="observationClass.category"
                v-validate="'required'"
                :state="validateState('category')"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-switch
                :width="8"
                :editable="editable"
                true-value="Y"
                false-value="N"
                ui="bootstrap"
                label="사용여부"
                name="radioValue"
                selectText="사용"
                unselectText="미사용"
                v-model="observationClass.useYn"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-number
                :width="8"
                :editable="editable"
                :maxlength="5"
                :hasSeperator="false"
                ui="bootstrap"
                name="sortOrder"
                label="정렬순서"
                v-model="observationClass.sortOrder"
              ></y-number>
            </b-col>
          </b-row>

          <!-- 버튼 -->
          <div class="float-right">
            <y-btn v-if="editable" title="초기화" @btnClicked="btnClearClickedCallback" />
            <y-btn
              v-if="editable"
              :action-url="insertUrl"
              :param="observationClass"
              :is-submit="isInsert"
              title="신규등록"
              color="orange"
              action-type="POST"
              beforeSubmit="beforeInsert"
              @beforeInsert="beforeInsert"
              @btnClicked="btnInsertClickedCallback"
              @btnClickedErrorCallback="btnClickedErrorCallback"
            />
            <y-btn
              v-if="updateMode && editable"
              :action-url="editUrl"
              :param="observationClass"
              :is-submit="isEdit"
              title="수정"
              color="orange"
              action-type="PUT"
              beforeSubmit="beforeEdit"
              @beforeEdit="beforeEdit"
              @btnClicked="btnEditClickedCallback"
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
  name: 'safety-observation-class',
  props: {},
  data () {
    return {
      observationClass: {
        mainCategory: null,
        category: '',
        useYn: 'Y',
        sortOrder: 0,
        createUserId: '',
        updateUserId: '',
      },
      searchArea: {
        title: '검색박스숨기기',
        show: true,
      },
      searchParam: {
        mainCategory: '',
        category: '',
      },
      gridOptions: {
        header: [],
        data: [],
        height: 300,
      },
      mainCategorySearchItems: [],
      mainCategoryItems: [],
      editable: false,
      updateMode: false,
      searchUrl: '',
      detailUrl: '',
      checkUrl: '',
      insertUrl: '',
      editUrl: '',
      isInsert: false,
      isEdit: false,
    };
  },
  beforeMount () {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted () {},
  beforeDestroy () {},
  /** methods **/
  methods: {
    /** 초기화 관련 함수 **/
    init () {
      // URL 셋팅
      this.searchUrl = selectConfig.chm.chemicalBranch.list.url;
      this.detailUrl = selectConfig.chm.chemicalBranch.get.url;
      this.checkUrl = selectConfig.chm.chemicalBranch.check.url;
      this.insertUrl = transactionConfig.chm.chemicalBranch.insert.url;
      this.editUrl = transactionConfig.chm.chemicalBranch.edit.url;

      this.editable = this.$route.meta.editable;

      this.getComboItems('대분류'); // 대분류
      this.getDataList(); // 안전관찰분류 grid

      // 안전관찰분류 grid 헤더 설정
      this.gridOptions.header = [
        {
          text: '대분류',
          name: 'mainCategory',
          width: '200px',
          align: 'center',
        },
        {
          text: '중분류',
          name: 'category',
          width: '200px',
          align: 'center',
        },
        { text: '사용여부', name: 'useYnNm', width: '90px', align: 'center' },
        { text: '정렬순서', name: 'sortOrder', width: '90px', align: 'center' },
      ];
    },
    // 안전관찰분류 grid
    getDataList () {
      this.gridOptions.data = [
        {
          mainCategory: '부서특성',
          category: '정비',
          useYnNm: '사용',
          sortOrder: '5',
        },
        {
          mainCategory: '보행질서',
          category: '행위',
          useYnNm: '사용',
          sortOrder: '10',
        },
        {
          mainCategory: '보호구',
          category: '얼굴',
          useYnNm: '사용',
          sortOrder: '15',
        },
      ];
      // this.$http.url = this.searchUrl;
      // this.$http.type = 'GET';
      // this.$http.param = this.searchParam;
      // this.$http.request(
      //   _result => {
      //     this.gridOptions.data = _result.data;
      //   },
      //   _error => {
      //     window.getApp.$emit('APP_REQUEST_ERROR', _error);
      //   }
      // );
    },
    /**
     * 공통 마스터 정보 조회 (대분류)
     * codeGroupCd : 마스터 테이블 codeGroupCd 정보
     */
    getComboItems (codeGroupCd) {
      if (codeGroupCd === '대분류') {
        this.mainCategorySearchItems = [
          { code: '', codeNm: '전체' },
          { code: 'a', codeNm: '부서특성' },
          { code: 'b', codeNm: '보행질서' },
          { code: 'b', codeNm: '보호구' },
        ];
        this.mainCategoryItems = [
          { code: null, codeNm: '선택하세요' },
          { code: 'a', codeNm: '부서특성' },
          { code: 'b', codeNm: '보행질서' },
          { code: 'b', codeNm: '보호구' },
        ];
      }
      // this.$http.url = this.$format(
      //   selectConfig.codeMaster.getSelect.url,
      //   codeGroupCd
      // );
      // this.$http.type = 'GET';
      // this.$http.request(
      //   _result => {
      //     if (codeGroupCd === 'CHM_PERMIT_KND') {
      //       this.permitKindItems = this.$_.clone(_result.data);
      //       this.permitKindItems.splice(0, 0, { code: null, codeNm: '전체' });
      //       this.permitKindSaveItems = this.$_.clone(_result.data);
      //       this.permitKindSaveItems.splice(0, 0, {
      //         code: null,
      //         codeNm: '선택하세요',
      //       });
      //     }
      //   },
      //   _error => {
      //     window.getApp.$emit('APP_REQUEST_ERROR', _error);
      //   }
      // );
    },
    // 그리드 row click 이벤트
    selectedRow (data) {
      if (data === null) return;

      this.$http.url = this.$format(this.detailUrl, data.branchCd);
      this.$http.type = 'GET';
      this.$http.request(
        _result => {
          this.observationClass = this.$_.clone(_result.data);
          this.updateMode = true;
        },
        _error => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    showMessage (checkList, flag) {
      var checkText = '';
      var i = 0;
      for (; i < checkList.length; i++) {
        // if (this.$_.parseInt(checkList[i].cnt) > (flag === 'insert' || checkList[i].gubun === 'branchNmKr' ? 0 : 1))
        if (this.$_.parseInt(checkList[i].cnt) > 0) {
          checkText =
            checkList[i].gubun === 'branchNmKr'
              ? '이미 존재하는 법인(KOR)입니다.'
              : '이미 존재하는 법인코드입니다.';
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
    checkValidator (flag) {
      this.$validator
        .validateAll()
        .then(_result => {
          if (_result) {
            this.$http.url = this.checkUrl;
            this.$http.type = 'GET';
            this.$http.param = {
              branchNmKr: this.observationClass.branchNmKr,
              branchCd: this.observationClass.branchCd,
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
                      this.observationClass.createUserId = this.$store.getters.token;
                      this.observationClass.updateUserId = this.$store.getters.token;
                      if (flag === 'edit') this.isEdit = true;
                      else this.isInsert = true;
                    },
                    cancelCallback: () => {
                      if (flag === 'edit') this.isEdit = false;
                      else this.isInsert = false;
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
    /** validation checking **/
    beforeInsert () {
      this.checkValidator('insert');
    },
    beforeEdit () {
      this.checkValidator('edit');
    },
    validateState (_ref) {
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
    btnSearchVisibleClicked () {
      this.searchArea.show = !this.searchArea.show;
      if (this.searchArea.show) this.searchArea.title = '검색박스숨기기';
      else this.searchArea.title = '검색박스보이기';

      window.getApp.$emit('LOADING_PASS_COUNT', 1);
    },
    // 검색
    btnSearchClickedCallback (_result) {
      this.getDataList();
    },
    // 초기화
    btnClearClickedCallback () {
      this.updateMode = false;
      Object.assign(
        this.$data.observationClass,
        this.$options.data().observationClass
      );
      this.$validator.reset();
    },
    // 신규등록
    btnInsertClickedCallback (_result) {
      this.getDataList();
      this.isInsert = false;
      this.updateMode = true;
      this.observationClass.branchCd = _result.data;
      window.getApp.$emit('ALERT', {
        title: '안내',
        message: '등록되었습니다.',
        type: 'success',
      });
    },
    // 수정
    btnEditClickedCallback (_result) {
      this.getDataList();
      this.isEdit = false;
      window.getApp.$emit('ALERT', {
        title: '안내',
        message: '수정되었습니다.',
        type: 'success',
      });
    },
    // 버튼 에러 처리
    btnClickedErrorCallback (_result) {
      this.isInsert = false;
      this.isEdit = false;
      this.updateMode = false;
      window.getApp.emit('APP_REQUEST_ERROR', _result);
    },
    /** /Button Event **/
  },
};
</script>