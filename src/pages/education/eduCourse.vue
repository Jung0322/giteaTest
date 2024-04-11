<!--
  목적 : 교육과정 관리
  작성자 : kkc
  Detail : 교육과정 조회,등록,수정
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <y-search-box :gridOptions="gridOptions" @enter="getList">
      <b-row slot="search">
        <b-col sm="6" md="6" lg="4" xl="4" class="col-xxl-3">
          <y-plant
            :width="9"
            type="search"
            v-model="searchParam.plantCd"
            @datachange="
              (val) => {
                (searchParam.plantCd = val), getList();
              }
            "
          ></y-plant>
        </b-col>
        <b-col sm="6" md="6" lg="4" xl="4" class="col-xxl-3">
          <!-- 교육대분류 -->
          <y-select
            :width="9"
            :comboItems="eduAttCdSearchItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            label="L0000000644"
            name="eduAttCd"
            v-model="searchParam.eduAttCd"
          ></y-select>
        </b-col>
        <b-col sm="6" md="6" lg="4" xl="4" class="col-xxl-3">
          <!-- 교육분류 -->
          <y-select
            :width="9"
            :comboItems="eduTypeCdSearchItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            label="L0000000659"
            name="eduTypeCd"
            v-model="searchParam.eduTypeCd"
          ></y-select>
        </b-col>
        <b-col sm="6" md="6" lg="4" xl="4" class="col-xxl-3">
          <!-- 관련법규 -->
          <y-select
            :width="9"
            :comboItems="isTypeItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            name="isTypeCd"
            label="L0000000568"
            v-model="searchParam.isTypeCd"
          />
        </b-col>
        <b-col sm="6" md="6" lg="4" xl="4" class="col-xxl-3">
          <!-- 교육명 -->
          <y-text
            :width="9"
            ui="bootstrap"
            name="eduCourseNm"
            label="L0000000653"
            v-model="searchParam.eduCourseNm"
          />
        </b-col>
      </b-row>
    </y-search-box>

    <!-- 검색 결과 테이블 -->
    <!-- <b-row class="mt-3">
      <b-col sm="12">
        <b-col sm="12" class="px-0">
          <div slot="buttonGroup" class="float-right mb-1">
            - 교육마스터 복사등록 -
            <y-btn
              v-if="!popupParam.multiple && editable"
              title="L0000005340"
              @btnClicked="btnOpenCopyPopupClick"
              @btnClickedErrorCallback="btnClickedErrorCallback"
            />
             신규등록 
            <y-btn
              v-if="!popupParam.multiple && editable"
              title="L0000001789"
              color="orange"
              @btnClicked="btnPopupClickedCallback"
            />
             검색 
            <y-btn
              title="L0000000327"
              color="green"
              @btnClicked="btnSearchClickedCallback"
              @btnClickedErrorCallback="btnClickedErrorCallback"
            />
             선택 
            <y-btn
              v-if="popupParam.multiple"
              title="L0000001561"
              color="orange"
              @btnClicked="btnEduCourse"
            />
             닫기 
            <y-btn
              v-if="popupParam.multiple"
              title="L0000000881"
              @btnClicked="closePopupThis"
            />
          </div>
          교육마스터 목록 
          <y-data-table
            label="L0000005371"
            ref="dataTable"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            :use-paging="true"
            @tableLinkClicked="tableLinkClicked"
            @selectedRow="getDetail"
            v-model="selectedValue"
          >
            <el-table-column
              v-if="!popupParam.multiple && editable"
              slot="selection"
              type="selection"
              align="center"
              width="55"
            ></el-table-column>
          </y-data-table>
        </b-col>
      </b-col>
    </b-row> -->
    <b-row class="grid-height grid-box">
      <b-col sm="12" class="h100p">
        <y-auigrid
          ref="yAuiGrid"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000005371')"
          :useExcelExport="false"
          :enableCellMerge="true"
          :enableSorting="true"
          :showGridSetSave="true"
          :useContextMenu="true"
          :showRowCheckColumn="true"
          :enableRightDownFocus="true"
          :showGridCtrl="true"
          @btnSearchClickedCallback="btnSearchClickedCallback"
          @btnOpenCopyPopupClick="btnOpenCopyPopupClick"
          @btnPopupClickedCallback="btnPopupClickedCallback"
          @closePopupThis="closePopupThis"
          @btnEduCourse="btnEduCourse"
          @cellClick="cellClickHandler"
        />
      </b-col>
    </b-row>
    <!-- 등록 -->
    <y-dialog :param="popupOptions"></y-dialog>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
export default {
  /* attributes: name, components, props, data */
  name: 'edu-course',
  props: {
    popupParam: {
      type: Object,
      default: function () {
        return { eduCourseList: [], multiple: false };
      },
    },
  },
  data() {
    return {
      searchArea: {
        title: 'L0000000329', // 검색박스숨기기
        show: true,
      },
      searchParam: {
        eduAttCd: null,
        eduTypeCd: null,
        eduCourseNm: '',
        plantCd: '',
        useYn: 'Y',
        isTypeCd: '',
      },
      safEduCourse: {
        safEduCourseNo: 0,
        eduAttCd: null,
        eduTypeCd: null,
        eduCourseNm: null,
        eduCost: null,
        lawYn: null,
        lawPerdCd: null,
        lawEduTm: 0,
        eduObject: null,
        dftEduTm: 0,
        eduDayNum: 0,
        studyTgt: null,
        studyContents: null,
        useYn: 'Y',
        sortOrder: 0,
        plantCd: null,
        createUserId: null,
        createDt: null,
        updateUserId: null,
        updateDt: null,
      },
      gridOptions: {
        name: 'eduCourse',
        btns: [],
        header: [],
        data: [],
        height: 'auto',
      },
      YAuiGrid: null,
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '80%',
        top: '10px',
        param: {},
        closeCallback: null,
      },
      editable: true,
      updateMode: false,
      isInsert: false,
      isEdit: false,
      eduAttCdItems: [],
      eduTypeCdItems: [],
      eduAttCdSearchItems: [],
      eduTypeCdSearchItems: [],
      lawPerdCdItems: [],
      isTypeItems: [],
      editUrl: '',
      insertUrl: '',
      searchUrl: '',
      disabled: false,
      // sk e&s
      selectedValue: [],
    };
  },
  watch: {
    'safEduCourse.lawYn': function (newValue, oldValue) {
      if (newValue === 'Y') {
        this.disabled = false;
      } else {
        this.safEduCourse.lawPerdCd = null;
        this.disabled = true;
      }
    },
  },
  //* Vue lifecycle: created, mounted, destroyed, etc */
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
    window.addEventListener('resize', this.resizeGrid);
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;
    this.resizeGrid();
    // 윈도우 resize event
    // window.addEventListener('resize', this.setGridSize);
  },
  beforeDestroy() {
    // 윈도우 resize event 제거
    // window.removeEventListener('resize', this.setGridSize);
  },
  //* methods */
  methods: {
    /** 초기화 관련 함수 **/
    init() {
      this.editable = this.$route.meta.editable;

      // 관련법규 ()
      this.$comm.getComboItems('MGT_LAW_CLASS', true).then((_result) => {
        this.isTypeItems = _result;
      });

      setTimeout(() => {
        this.getLawPerdCdItems();
        this.getEduAttCdItems();
        this.getEduTypeCdItems();
      }, 200);

      // 그리드 헤더 설정
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001415'),
          dataField: 'plantNm',
          width: '7%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000568'),
          dataField: 'isTypeNm',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000653'),
          dataField: 'eduCourseNm',
          width: '16%',
          style: 'left-align',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {},
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000644'),
          dataField: 'eduAttNm',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000659'),
          dataField: 'eduTypeNm',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001214'),
          dataField: 'lawYnNm',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000667'),
          dataField: 'lawEduTm',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001439'),
          dataField: 'useYnNm',
          width: '7%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002355'),
          dataField: 'writerUserNm',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002352'),
          dataField: 'writerDt',
          width: '10%',
        },
      ];

      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000005340'),
          btnClicked: 'btnOpenCopyPopupClick',
          visible: true,
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001789'),
          color: 'orange',
          btnClicked: 'btnPopupClickedCallback',
          visible: true,
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000327'),
          color: 'green',
          btnClicked: 'btnSearchClickedCallback',
          visible: true,
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001561'),
          color: 'orange',
          btnClicked: 'btnEduCourse',
          visible: true,
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000881'),
          btnClicked: 'closePopupThis',
          visible: true,
        },
      ];
      if (this.popupParam.multiple) {
        this.gridOptions.header.splice(6, 5);
      }

      this.editUrl = transactionConfig.saf.education.eduCourse.edit.url;
      this.insertUrl = transactionConfig.saf.education.eduCourse.insert.url;
      this.searchUrl = selectConfig.saf.education.eduCourse.list.url;

      /* 쿠키에 저장된 검색 조건이 있을 경우 최초 페이지 진입시 자동 설정 */
      var searchParamByCookie = this.$comm.setSearchParamByCookie();
      if (typeof searchParamByCookie !== 'undefined') {
        this.searchParam = searchParamByCookie;
      }

      this.getList();
      // this.setGridSize();

      if (this.safEduCourse.lawYn === 'Y') {
        this.disabled = false;
      } else {
        this.safEduCourse.lawPerdCd = null;
        this.disabled = true;
      }
    },

    getList() {
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = this.searchParam;
      this.$http.request(
        (_result) => {
          if (!this.popupParam.multiple) {
            this.gridOptions.btns[0].visible = true;
            this.gridOptions.btns[1].visible = true;
            this.gridOptions.btns[2].visible = true;
            this.gridOptions.btns[3].visible = false;
            this.gridOptions.btns[4].visible = false;
          } else {
            this.gridOptions.btns[0].visible = false;
            this.gridOptions.btns[1].visible = false;
            this.gridOptions.btns[2].visible = false;
            this.gridOptions.btns[3].visible = true;
            this.gridOptions.btns[4].visible = true;
          }
          this.YAuiGrid.setGridData(this.$_.clone(_result.data));
          this.$comm.pushCookie(this.searchParam);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', 'M0000000016');
          // 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.
        }
      );
    },
    getDetail(data) {
      if (data === null) return;
      if (this.popupParam.multiple) return;

      this.$http.url = this.$format(
        selectConfig.saf.education.eduCourse.get.url,
        data.safEduCourseNo
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.updateMode = true;
          this.safEduCourse = this.$_.clone(_result.data);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', 'M0000000016');
          // 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.
        }
      );
    },
    resizeGrid() {
      let _height = window.innerHeight - 335;
      if (window.innerHeight < 500) {
        _height = 250;
      }

      this.YAuiGrid.resize(null, _height);
    },
    getLawPerdCdItems() {
      this.$http.url = this.$format(
        selectConfig.codeMaster.getSelect.url,
        'SAF_EDU_CYCLE'
      );
      this.$http.type = 'get';
      this.$http.request(
        (_result) => {
          this.lawPerdCdItems = this.$_.clone(_result.data);
          this.lawPerdCdItems.splice(0, 0, {
            code: null,
            codeNm: 'L0000003394', // 선택하세요
          });
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', 'M0000000016');
          // 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.
        }
      );
    },
    getEduAttCdItems() {
      this.$http.url = this.$format(
        selectConfig.codeMaster.getSelect.url,
        'SAF_EDU_ATT'
      );
      this.$http.type = 'get';
      this.$http.request(
        (_result) => {
          this.eduAttCdSearchItems = this.$_.clone(_result.data);
          this.eduAttCdItems = this.$_.clone(_result.data);

          this.eduAttCdSearchItems.splice(0, 0, {
            code: null,
            codeNm: this.$comm.getLangSpecInfoLabel('L0000002519'),
          }); // 전체
          this.eduAttCdItems.splice(0, 0, {
            code: null,
            codeNm: this.$comm.getLangSpecInfoLabel('L0000003394'),
          }); // 선택하세요
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', 'M0000000016');
          // 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.
        }
      );
    },
    getEduTypeCdItems() {
      this.$http.url = this.$format(
        selectConfig.codeMaster.getSelect.url,
        'SAF_EDU_COURSE'
      );
      this.$http.type = 'get';
      this.$http.request(
        (_result) => {
          this.eduTypeCdSearchItems = this.$_.clone(_result.data);
          this.eduTypeCdItems = this.$_.clone(_result.data);

          this.eduTypeCdSearchItems.splice(0, 0, {
            code: null,
            codeNm: this.$comm.getLangSpecInfoLabel('L0000002519'), // 전체
          });
          this.eduTypeCdItems.splice(0, 0, {
            code: null,
            codeNm: this.$comm.getLangSpecInfoLabel('L0000003394'), // 선택하세요
          });
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', 'M0000000016');
          // 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.
        }
      );
    },

    /** 신규등록 하기전 UI단 유효성 검사 **/
    beforeInsert() {
      this.updateMode = false;
      if (this.checkDuplicate()) return;

      if (this.safEduCourse.lawEduTm === '') {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // 안내
          message: 'M0000000261', // 교육이수시간을 입력해주세요.
          type: 'warning', // success / info / warning / error
        });
        return;
      }

      if (Number(this.safEduCourse.lawEduTm) <= 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // 안내
          message: 'M0000000262', // 교육 이수시간은 0시간 이상 되어야 합니다.
          type: 'warning', // success / info / warning / error
        });
        return;
      }
      this.$validator
        .validateAll()
        .then((_result) => {
          if (_result) {
            window.getApp.$emit('CONFIRM', {
              title: 'L0000003321', // 확인
              message: 'M0000000011', // 저장하시겠습니까?
              type: 'info',
              confirmCallback: () => {
                this.safEduCourse.safEduCourseNo = '';
                this.updateMode = false;
                this.safEduCourse.createUserId = this.$store.getters.token;
                this.isInsert = true;
              },
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
          window.getApp.$emit('APP_VALID_ERROR', 'M0000000876');
          // 위험 Matrix 정보를 생성해 주세요.
        });
    },

    checkDuplicate() {
      var test = {
        eduCourseNm: this.safEduCourse.eduCourseNm,
        eduAttCd: this.safEduCourse.eduAttCd,
        eduTypeCd: this.safEduCourse.eduTypeCd,
        plantCd: this.safEduCourse.plantCd,
      };
      var item = this.$_.find(this.gridOptions.data, test);
      if (item != null) {
        if (
          this.updateMode &&
          this.safEduCourse.eduAttCd !== item.eduAttCd &&
          this.safEduCourse.eduTypeCd !== item.eduTypeCd &&
          this.safEduCourse.plantCd !== item.plantCd
        ) {
          if (this.safEduCourse.eduCourseNm !== item.eduCourseNm) return false;
        }
        if (
          this.updateMode &&
          this.safEduCourse.safEduCourseNo === item.safEduCourseNo
        ) {
          return false;
        }
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // 안내
          message: 'M0000000270', // 이미 같은 분류의 과정명이 존재합니다.
          type: 'warning',
        });
        this.updateMode = true;
        return true;
      }
      return false;
    },
    /** 수정 하기전 UI단 유효성 검사 **/
    beforeEdit() {
      if (this.checkDuplicate()) return;

      if (this.safEduCourse.lawEduTm === '') {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // 안내
          message: 'M0000000261', // 교육이수시간을 입력해주세요.
          type: 'warning', // success / info / warning / error
        });
        return;
      }

      if (Number(this.safEduCourse.lawEduTm) <= 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // 안내
          message: 'M0000000269', // 교육이수시간은 0시간 이상 되어야 합니다.
          type: 'warning', // success / info / warning / error
        });
        return;
      }

      this.$validator
        .validateAll()
        .then((_result) => {
          if (_result) {
            window.getApp.$emit('CONFIRM', {
              title: 'L0000003321', // 확인
              message: 'M0000000060', // 수정하시겠습니까?
              type: 'info',
              confirmCallback: () => {
                this.safEduCourse.updateUserId = this.$store.getters.token;
                this.isEdit = true;
              },
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
          window.getApp.$emit('APP_VALID_ERROR', 'M0000000876');
          // 위험 Matrix 정보를 생성해 주세요.
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

    btnPopupClickedCallback(copyDataKey) {
      this.popupOptions.target = () => import(`${'./eduCourseDetail.vue'}`);
      this.popupOptions.title = 'L0000005373'; // 교육마스터 등록/수정
      this.popupOptions.visible = true;
      this.popupOptions.width = '80%';
      this.popupOptions.top = '10px';
      this.popupOptions.param = {
        safEduCourseNo: 0,
      };

      // 복사등록일 경우 해당 대상의 pk 전달
      if (copyDataKey) {
        this.popupOptions.param.copyDataKey = copyDataKey;
      }

      this.popupOptions.closeCallback = this.closePopup;
    },
    cellClickHandler(event) {
      if (event.dataField !== 'eduCourseNm') return;
      this.popupOptions.target = () => import(`${'./eduCourseDetail.vue'}`);
      this.popupOptions.title = 'L0000005374'; // 교육마스터 상세
      this.popupOptions.visible = true;
      this.popupOptions.width = '80%';
      this.popupOptions.top = '10px';
      // sk e&s
      event.item.multiple = this.popupParam.multiple;
      this.popupOptions.param = event.item;
      this.popupOptions.closeCallback = this.closePopup;
    },
    tableLinkClicked(header, data) {
      if (data === null) return;
      this.popupOptions.target = () => import(`${'./eduCourseDetail.vue'}`);
      this.popupOptions.title = 'L0000005374'; // 교육마스터 상세
      this.popupOptions.visible = true;
      this.popupOptions.width = '80%';
      this.popupOptions.top = '10px';
      // sk e&s
      data.multiple = this.popupParam.multiple;
      this.popupOptions.param = data;
      this.popupOptions.closeCallback = this.closePopup;
    },

    closePopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.getList();
    },

    /** button 관련 이벤트 **/
    btnInsertClickedCallback(_result) {
      this.safEduCourse.safEduCourseNo = _result.data;
      this.getList();
      this.isInsert = false;
      this.updateMode = true;
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // 안내
        message: 'M0000000006', // 저장되었습니다.
        type: 'success',
      });
    },

    btnEditClickedCallback(_result) {
      this.getList();
      this.isEdit = false;
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // 안내
        message: 'M0000000836', // 수정되었습니다.
        type: 'success',
      });
    },
    btnClearClickedCallback() {
      Object.assign(this.$data.safEduCourse, this.$options.data().safEduCourse);
      this.$validator.reset();
      this.updateMode = false;
    },
    btnClickedErrorCallback(_result) {
      this.isInsert = false;
      this.isEdit = false;
      window.getApp.$emit('APP_REQUEST_ERROR', 'M0000000016');
      // 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.
    },
    btnSearchClickedCallback(_result) {
      this.getList();
    },
    // sk e&s
    btnEduCourse() {
      if (!this.selectedValue || this.selectedValue.length === 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // 안내
          message: 'M0000000263', // 교육 과정 목록에서 한 행 이상 선택하세요.
          type: 'warning',
        });
      } else {
        this.closePopupThis(this.selectedValue);
      }
    },
    // 팝업 닫기
    closePopupThis(data) {
      if (!data) {
        data = 'CLOSE';
      }
      // 부모창에 값 전달
      this.$emit('closePopup', data);
    },

    // 복사등록 버튼 클릭
    btnOpenCopyPopupClick() {
      let isValid = false;
      let checkingData = this.YAuiGrid.getCheckedRowItems();

      isValid = checkingData && checkingData.length === 1;

      if (isValid) {
        let safEduCourseNo = checkingData[0].item.safEduCourseNo;

        this.btnPopupClickedCallback(safEduCourseNo);
      } else {
        let message =
          !this.selectedValue || !this.selectedValue.length
            ? 'L0000005341'
            : 'L0000005342'; // 교육마스터 복사등록 대상을 선택해주세요. : 교육마스터 복사등록 대상을 1개만 선택해주세요.
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // 안내
          message: message,
          type: 'warning',
        });

        return;
      }
    },

    /** end button 관련 이벤트 **/
  },
};
</script>
