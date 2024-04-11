<!--
  목적 : 경영 > 게시판 > 자료실
  작성자 : ksw
  Detail : 자료실 조회
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <y-search-box :gridOptions="gridOptions" @enter="btnSearchClickedCallback">
      <b-row slot="search">
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <y-plant
            type="search"
            v-model="searchParam.plantCd"
            @datachange="
              (val) => {
                (searchParam.plantCd = val), getList();
              }
            "
          ></y-plant>
        </b-col>

        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 분류 -->
          <y-select
            :width="8"
            :comboItems="roomTpItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            label="L0000001341"
            name="kindCd"
            v-model="searchParam.kindCd"
          ></y-select>
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 제목 -->
          <y-text
            :width="8"
            ui="bootstrap"
            label="L0000002616"
            name="title"
            v-model="searchParam.title"
          ></y-text>
        </b-col>
      </b-row>
    </y-search-box>

    <b-row class="grid-height grid-box">
      <b-col sm="12" class="h100p">
        <y-auigrid
          ref="yAuiGrid"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000002274')"
          :useExcelExport="false"
          :enableSorting="true"
          :showGridSetSave="true"
          :useContextMenu="true"
          :enableRightDownFocus="true"
          :showGridCtrl="true"
          @cellClick="cellClickHandler"
          @getList="getList"
          @openNewPopup="openNewPopup"
        />
      </b-col>
    </b-row>
    <y-dialog :param="popupOptions"></y-dialog>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
export default {
  /* attributes: name, components, props, data */
  name: 'reference-room',
  props: {},
  data() {
    return {
      searchArea: {
        // title: '검색박스숨기기',
        show: true,
      },
      searchParam: {
        plantCd: null, // 사업장
        deptCd: null, // 부서
        kindCd: null, // 분류
        title: null, // 제목
      },
      gridOptions: {
        name: 'referenceRoom',
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
      searchUrl: null,
      roomTpItems: [],
      plantItems: [],
      mgtDataBoard: [],
      editable: false,
    };
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
  },
  beforeDestroy() {},
  //* methods */
  methods: {
    init() {
      this.editable = this.$route.meta.editable;

      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001341'),
          dataField: 'roomTp',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002616'),
          dataField: 'title',
          width: '19%',
          style: 'left-align',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {},
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000918'),
          dataField: 'plantNms',
          width: '19%',
          style: 'left-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000293'),
          dataField: 'revNum',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000971'),
          dataField: 'writerDeptNm',
          width: '14%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002355'),
          dataField: 'writerUserNm',
          width: '14%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002352'),
          dataField: 'writerDt',
          width: '14%',
        },
      ];

      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001789'),
          color: 'orange',
          btnClicked: 'openNewPopup',
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000327'),
          color: 'green',
          btnClicked: 'getList',
        },
      ];

      this.scheduleItems = [
        { code: '', codeNm: this.$comm.getLangSpecInfoLabel('L0000003394') }, // 선택하세요
        { code: '0', codeNm: this.$comm.getLangSpecInfoLabel('L0000004256') }, // 점검
        { code: '1', codeNm: this.$comm.getLangSpecInfoLabel('L0000004257') }, // 행사
      ];

      //   this.roomTpItems = [{ code: null, codeNm: '전체' }];
      this.searchUrl = selectConfig.mgt.referenceRoom.list.url;

      /* 쿠키에 저장된 검색 조건이 있을 경우 최초 페이지 진입시 자동 설정 */
      var searchParamByCookie = this.$comm.setSearchParamByCookie();
      if (typeof searchParamByCookie !== 'undefined') {
        this.searchParam = searchParamByCookie;
      }

      this.getList();
      // this.setGridSize();
      // this.getComboItems('COM_PLANT_CD'); // 사업장
      this.getComboItems('MGT_DOCU_KND01'); // 분류
    },
    // 필수입력값 유효성 검사
    validateState(ref) {
      if (
        this.veeBag[ref] &&
        (this.veeBag[ref].dirty || this.veeBag[ref].validated)
      ) {
        return !this.errors.has(ref);
      }
      return null;
    },

    btnSearchClickedCallback(_result) {
      this.getList();
    },

    // 초기화
    btnClearClickedCallback() {
      Object.assign(
        this.$data.comSafeMaster,
        this.$options.data().comSafeMaster
      );
      this.$validator.reset();
    },
    resizeGrid() {
      let _height = window.innerHeight - 325;
      if (window.innerHeight < 500) {
        _height = 250;
      }

      this.YAuiGrid.resize(null, _height);
    },
    // 검색
    getList() {
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = this.searchParam;
      this.$http.request(
        (_result) => {
          this.YAuiGrid.setGridData(this.$_.clone(_result.data));
          this.$comm.pushCookie(this.searchParam);
        },
        (_error) => {
          window.getApp.$emit(
            'APP_REQUEST_ERROR',
            'M0000000016' // 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.
          );
        }
      );
    },
    // 사업장
    getComboItems(codeGroupCd) {
      this.$http.url = this.$format(
        selectConfig.codeMaster.getSelect.url,
        codeGroupCd
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          if (codeGroupCd === 'COM_PLANT_CD') {
            this.plantItems = this.$_.clone(_result.data);
            this.plantItems.splice(0, 0, {
              code: null,
              codeNm: this.$comm.getLangSpecInfoLabel('L0000002519'),
            }); // 전체
          } else if (codeGroupCd === 'MGT_DOCU_KND01') {
            this.roomTpItems = this.$_.clone(_result.data);
            this.roomTpItems.splice(0, 0, {
              code: null,
              codeNm: this.$comm.getLangSpecInfoLabel('L0000002519'),
            }); // 전체
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    openNewPopup() {
      this.popupOptions.target = () => import(`${'./referenceRoomAdd.vue'}`);
      this.popupOptions.title = 'L0000002312'; // 자료실 등록/수정
      this.popupOptions.visible = true;
      this.popupOptions.width = '80%';
      this.popupOptions.top = '10px';
      this.popupOptions.param = {
        insertMode: true,
        updateMode: false,
        revisionMode: false,
      };
      this.popupOptions.closeCallback = this.closePopup;
    },
    cellClickHandler(event) {
      if (event.dataField !== 'title') return;
      this.popupOptions.target = () => import(`${'./referenceRoomDetail.vue'}`);
      this.popupOptions.title = 'L0000002314'; // 자료실 상세
      this.popupOptions.visible = true;
      this.popupOptions.width = '80%';
      this.popupOptions.top = '10px';
      this.popupOptions.param = {
        dataBoardNo: event.item.dataBoardNo,
      };

      this.popupOptions.closeCallback = this.closePopup;
      this.popupOptions.customCallBack = this.updatePopup;
    },
    btnPopupClickedCallback() {
      this.popupOptions.target = () => import(`${'./referenceRoomAdd.vue'}`);
      this.popupOptions.title = 'L0000002312'; // 자료실 등록/수정
      this.popupOptions.visible = true;
      this.popupOptions.width = '80%';
      this.popupOptions.top = '10px';
      this.popupOptions.param = {
        insertMode: true,
        updateMode: false,
        revisionMode: false,
      };
      this.popupOptions.closeCallback = this.closePopup;
    },
    tableLinkClicked(header, data) {
      if (data === null) return;
      this.popupOptions.target = () => import(`${'./referenceRoomDetail.vue'}`);
      this.popupOptions.title = 'L0000002314'; // 자료실 상세
      this.popupOptions.visible = true;
      this.popupOptions.width = '80%';
      this.popupOptions.top = '10px';
      this.popupOptions.param = {
        dataBoardNo: data.dataBoardNo,
      };

      this.popupOptions.closeCallback = this.closePopup;
      this.popupOptions.customCallBack = this.updatePopup;
    },
    updatePopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;

      this.popupOptions.target = () => import(`${'./referenceRoomAdd.vue'}`);
      this.popupOptions.title = 'L0000002312'; // 자료실 등록/수정
      this.popupOptions.visible = true;
      this.popupOptions.width = '80%';
      this.popupOptions.top = '10px';
      this.popupOptions.param = {
        dataBoardNo: data.dataBoardNo,
        dataBoardGrpNo: data.dataBoardGrpNo,
        insertMode: data.insertMode,
        updateMode: data.updateMode,
        revisionMode: data.revisionMode,
      };
    },
    closePopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.getList();
    },
  },
};
</script>
