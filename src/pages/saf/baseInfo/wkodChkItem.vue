<!--
  목적 : 작업허가서 항목 관리
  Detail : 작업허가서 항목 등록/수정화면
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <!-- 검색 -->
    <b-row ref="searchBox">
      <b-col sm="12">
        <b-card
          header-class="default-card"
          body-class="default-body-card"
          class="py-0"
        >
          <div slot="header">
            <!-- <div class="float-left"> -->
            <!-- 검색 -->
            <y-label label="L0000000327" />
            <!-- </div> -->
            <div class="float-right">
              <!-- <y-btn :title="searchArea.title" color="green" @btnClicked="btnSearchVisibleClicked" /> -->
              <!-- 검색 -->
              <y-btn
                :action-url="searchUrl"
                :param="searchParam"
                title="L0000000327"
                color="green"
                action-type="get"
                @btnClicked="btnSearchClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
            </div>
          </div>
          <b-row v-if="searchArea.show">
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 작업종류 -->
              <y-select
                :width="8"
                :comboItems="comboWkodKindItems"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                label="L0000002422"
                name="wkodKindCd"
                v-model="searchParam.wkodKindCd"
              ></y-select>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 점검부서 구분 -->
              <y-select
                :width="8"
                :comboItems="comboWkodDptyItems"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                label="L0000004665"
                name="wkodDptyCd"
                v-model="searchParam.wkodDptyCd"
              ></y-select>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 항목명 -->
              <y-text
                :width="8"
                ui="bootstrap"
                label="L0000003205"
                name="chkItemNm"
                v-model="searchParam.chkItemNm"
              ></y-text>
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>

    <!-- 검색 결과 테이블 -->
    <b-row class="mt-3">
      <b-col sm="12">
        <b-col sm="12" class="px-0">
          <!-- 항목 목록 -->
          <y-data-table
            :headers="gridOptions.header"
            :items="gridOptions.data"
            :height="gridOptions.height"
            :print="true"
            :rows="5"
            :cellClick="true"
            :useRownum="false"
            label="L0000003200"
            ref="dataTable"
            @selectedRow="selectedRow"
          ></y-data-table>
        </b-col>

        <!-- 등록 -->
        <b-row class="mt-3" ref="insertBox">
          <b-col sm="12">
            <b-row>
              <b-col sm="12">
                <!-- 항목 상세 -->
                <y-label
                  label="L0000003203"
                  icon="user-edit"
                  color-class="cutstom-title-color"
                />
              </b-col>
            </b-row>
            <b-card>
              <b-row>
                <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
                  <!-- 작업종류 -->
                  <y-select
                    :width="8"
                    :comboItems="comboDetailWkodKindItems"
                    :editable="editable"
                    :required="true"
                    itemText="codeNm"
                    itemValue="code"
                    ui="bootstrap"
                    label="L0000002422"
                    name="wkodKindCd"
                    v-model="wkodChkItem.wkodKindCd"
                    v-validate="'required'"
                    :state="validateState('wkodKindCd')"
                  ></y-select>
                </b-col>
                <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
                  <!-- 점검부서 구분 -->
                  <y-select
                    :width="8"
                    :comboItems="comboDetailWkodDptyItems"
                    :editable="editable"
                    :required="true"
                    itemText="codeNm"
                    itemValue="code"
                    ui="bootstrap"
                    label="L0000004665"
                    name="wkodDptyCd"
                    v-model="wkodChkItem.wkodDptyCd"
                    v-validate="'required'"
                    :state="validateState('wkodDptyCd')"
                  ></y-select>
                </b-col>
                <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-4">
                  <!-- 항목명 -->
                  <y-text
                    :width="10"
                    :maxlength="50"
                    :editable="editable"
                    :required="true"
                    ui="bootstrap"
                    label="L0000003205"
                    name="chkItemNm"
                    v-model="wkodChkItem.chkItemNm"
                    v-validate="'required'"
                    :state="validateState('chkItemNm')"
                  ></y-text>
                </b-col>
                <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
                  <!-- 사용여부 -->
                  <y-switch
                    :width="8"
                    :editable="editable"
                    true-value="Y"
                    false-value="N"
                    ui="bootstrap"
                    label="L0000001439"
                    name="radioValue"
                    selectText="L0000001440"
                    unselectText="L0000001063"
                    v-model="wkodChkItem.useYn"
                  ></y-switch>
                </b-col>
                <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
                  <!-- 정렬순서 -->
                  <y-number
                    :width="8"
                    :maxlength="5"
                    :hasSeperator="false"
                    :isPositive="true"
                    :editable="editable"
                    ui="bootstrap"
                    label="L0000002601"
                    name="sortOrder"
                    v-model="wkodChkItem.sortOrder"
                  ></y-number>
                </b-col>
              </b-row>
              <div class="float-right mt-3">
                <!-- 초기화 -->
                <y-btn
                  v-if="editable"
                  title="L0000002859"
                  @btnClicked="btnClearClickedCallback"
                />
                <!-- 신규등록 -->
                <y-btn
                  v-if="editable"
                  :action-url="insertUrl"
                  :param="wkodChkItem"
                  :is-submit="isInsert"
                  title="L0000001789"
                  color="orange"
                  action-type="POST"
                  beforeSubmit="beforeInsert"
                  @beforeInsert="beforeInsert"
                  @btnClicked="btnInsertClickedCallback"
                  @btnClickedErrorCallback="btnClickedErrorCallback"
                />
                <!-- 수정 -->
                <y-btn
                  v-if="updateMod && editable"
                  :action-url="editUrl"
                  :param="wkodChkItem"
                  :is-submit="isEdit"
                  title="L0000001696"
                  color="orange"
                  action-type="PUT"
                  beforeSubmit="beforeSubmit"
                  @beforeSubmit="beforeSubmit"
                  @btnClicked="btnSaveClickedCallback"
                  @btnClickedErrorCallback="btnClickedErrorCallback"
                />
              </div>
            </b-card>
          </b-col>
        </b-row>
        <!-- </b-card> -->
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
export default {
  /* attributes: name, components, props, data */
  name: 'wkod-chk-item',
  props: {},
  data() {
    return {
      wkodChkItem: {
        chkItemNo: '',
        wkodKindCd: null,
        wkodDptyCd: null,
        chkItemNm: '',
        sortOrder: 0,
        useYn: 'Y',
        createUserId: '',
        updateUserId: '',
      },
      searchParam: {
        wkodKindCd: '',
        wkodDptyCd: '',
        chkItemNm: '',
      },
      searchArea: {
        title: 'L0000000329', // 검색박스숨기기
        show: true,
      },
      gridOptions: {
        header: [],
        data: [],
        height: 300,
      },
      baseWidth: 9,
      editable: true,
      updateMod: false,
      isInsert: false,
      isEdit: false,
      comboWkodDptyItems: [],
      comboWkodKindItems: [],
      comboDetailWkodDptyItems: [],
      comboDetailWkodKindItems: [],
      radioItems: null,
      editUrl: '',
      insertUrl: '',
      searchUrl: '',
    };
  },
  //* Vue lifecycle: created, mounted, destroyed, etc */
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {
    this.setGridSize();
  },
  beforeDestroy() {},
  //* methods */
  methods: {
    init() {
      this.editable = this.$route.meta.editable;

      // Url Setting
      this.searchUrl = selectConfig.saf.wkodChkItem.list.url;
      this.editUrl = transactionConfig.saf.wkodChkItem.edit.url;
      this.insertUrl = transactionConfig.saf.wkodChkItem.insert.url;

      this.radioItems = [
        { useYn: 'Y', useName: this.$comm.getLangSpecInfoLabel('L0000001440') }, // 사용
        { useYn: 'N', useName: this.$comm.getLangSpecInfoLabel('L0000001063') }, // 미사용
      ];

      // 그리드 헤더 설정
      this.gridOptions.header = [
        {
          text: 'L0000002422',
          name: 'wkodKindNm',
          width: '15%',
          align: 'center',
        }, // 작업종류
        {
          text: 'L0000004665', // 점검부서 구분
          name: 'wkodDptyNm',
          width: '15%',
          align: 'center',
        },
        { text: 'L0000003205', name: 'chkItemNm', width: '45%' }, // 항목명
        {
          text: 'L0000002601',
          name: 'sortOrder',
          width: '10%',
          align: 'center',
        }, // 정렬순서
        { text: 'L0000001439', name: 'useYnNm', width: '10%', align: 'center' }, // 사용여부
      ];

      this.getComboItems('SAF_WKOD_KIND'); // 작업종류
      this.getComboItems('SAF_WKOD_DPTY'); // 점검부서구분
      this.setGridSize();
      this.getList();
    },
    // combo box list
    getComboItems(codeGroupCd) {
      this.$http.url = this.$format(
        selectConfig.codeMaster.getSelect.url,
        codeGroupCd
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          if (codeGroupCd === 'SAF_WKOD_KIND') {
            this.comboWkodKindItems = this.$_.clone(_result.data);
            this.comboDetailWkodKindItems = this.$_.clone(_result.data);

            this.comboWkodKindItems.splice(0, 0, {
              code: null,
              codeNm: this.$comm.getLangSpecInfoLabel('L0000002519'), // 전체
            });
            this.comboDetailWkodKindItems.splice(0, 0, {
              code: null,
              codeNm: this.$comm.getLangSpecInfoLabel('L0000003394'), // 선택하세요
            });
          } else {
            this.comboWkodDptyItems = this.$_.clone(_result.data);
            this.comboDetailWkodDptyItems = this.$_.clone(_result.data);

            this.comboWkodDptyItems.splice(0, 0, {
              code: null,
              codeNm: this.$comm.getLangSpecInfoLabel('L0000002519'), // 전체
            });
            this.comboDetailWkodDptyItems.splice(0, 0, {
              code: null,
              codeNm: this.$comm.getLangSpecInfoLabel('L0000003394'), // 선택하세요
            });
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    selectedRow(data) {
      if (data === null) return;
      this.$http.url = this.$format(
        selectConfig.saf.wkodChkItem.get.url,
        data.chkItemNo
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.updateMod = true;
          this.wkodChkItem = this.$_.clone(_result.data);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    setGridSize() {
      window.getApp.$emit('LOADING_SHOW');
      setTimeout(() => {
        this.gridOptions.height =
          window.innerHeight -
          this.$refs.searchBox.clientHeight -
          this.$refs.insertBox.clientHeight -
          270;
        window.getApp.$emit('LOADING_HIDE');
      }, 600);
    },
    /** button 관련 이벤트 **/
    /**
     * 검색박스 숨기기/보이기 처리 후 setGridSize 호출
     */
    btnSearchVisibleClicked() {
      this.searchArea.show = !this.searchArea.show;
      // if (this.searchArea.show) this.searchArea.title = '검색박스숨기기';
      // else this.searchArea.title = '검색박스보이기';

      window.getApp.$emit('LOADING_PASS_COUNT', 1);
      this.setGridSize();
    },
    /** 수정 하기전 UI단 유효성 검사 **/
    beforeSubmit() {
      // if (window.confirm("수정하시겠습니까?"))
      // {
      //   this.checkValidationSave();
      // }
      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321', // 확인
        message: 'M0000000060', // 수정하시겠습니까?
        // TODO : 필요시 추가하세요.
        type: 'info', // success / info / warning / error
        // 확인 callback 함수
        confirmCallback: () => {
          this.wkodChkItem.updateUserId = this.$store.getters.token;
          this.checkValidationSave();
        },
      });
    },
    beforeInsert() {
      // if (window.confirm("저장하시겠습니까?"))
      // {
      //   this.checkValidationInsert();
      // }
      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321', // 확인
        message: 'M0000000105', // 등록하시겠습니까?
        // TODO : 필요시 추가하세요.
        type: 'info', // success / info / warning / error
        // 확인 callback 함수
        confirmCallback: () => {
          this.wkodChkItem.createUserId = this.$store.getters.token;
          this.checkValidationInsert();
        },
      });
    },
    /**
     * 수정전 유효성 검사
     */
    checkValidationSave() {
      this.$validator
        .validateAll()
        .then((_result) => {
          this.isEdit = _result;
          // TODO : 전역 성공 메시지 처리
          // 이벤트는 ./event.js 파일에 선언되어 있음
          if (!this.isEdit) {
            window.getApp.$emit(
              'APP_VALID_ERROR',
              'M0000000881' // 유효성 검사도중 에러가 발생하였습니다.
            );
          }
        })
        .catch(() => {
          this.isEdit = false;
        });
    },
    checkValidationInsert() {
      this.$validator
        .validateAll()
        .then((_result) => {
          this.isInsert = _result;
          // TODO : 전역 성공 메시지 처리
          // 이벤트는 ./event.js 파일에 선언되어 있음
          if (!this.isInsert) {
            window.getApp.$emit(
              'APP_VALID_ERROR',
              'M0000000881' // 유효성 검사도중 에러가 발생하였습니다.
            );
          }
        })
        .catch(() => {
          this.isInsert = false;
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
    getList() {
      this.$http.url = selectConfig.saf.wkodChkItem.list.url;
      this.$http.type = 'GET';
      this.$http.param = this.searchParam;
      this.$http.request(
        (_result) => {
          this.gridOptions.data = this.$_.clone(_result.data);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    /**
     * 사용자의 입력을 받는다.
     */
    getConfirm() {},
    /** button 관련 이벤트 **/
    btnSearchClickedCallback(_result) {
      this.getList();
      this.isEdit = false;
      this.btnClearClickedCallback();
      // window.getApp.$emit('APP_REQUEST_SUCCESS', '조회 버튼이 클릭되었습니다.');
    },
    btnSaveClickedCallback(_result) {
      this.getList();
      // window.alert("수정되었습니다.");
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // 안내
        message: 'M0000000836', // 수정되었습니다.
        type: 'success', // success / info / warning / error
      });
      this.isEdit = false;
      // this.$emit('APP_REQUEST_SUCCESS', '수정 버튼이 클릭 되었습니다.');
    },
    btnInsertClickedCallback(_result) {
      this.getList();
      // window.alert("저장되었습니다.");
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // 안내
        message: 'M0000000006', // 저장되었습니다.
        type: 'success', // success / info / warning / error
      });
      this.wkodChkItem.chkItemNo = this.$_.clone(_result.data);
      this.isInsert = false;
    },
    btnClearClickedCallback() {
      this.updateMod = false;
      Object.assign(this.$data.wkodChkItem, this.$options.data().wkodChkItem);
      this.$validator.reset();
      // window.getApp.$emit('APP_REQUEST_SUCCESS', '초기화 버튼이 클릭 되었습니다.');
    },
    btnClickedErrorCallback(_result) {
      this.updateMod = false;
      this.isInsert = false;
      this.isEdit = false;
      this.btnClearClickedCallback();
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    /** end button 관련 이벤트 **/
  },
};
</script>

<style></style>
