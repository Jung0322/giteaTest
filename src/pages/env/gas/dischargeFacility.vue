<template>
  <b-container fluid>
    <b-row v-if="popupParam.popupMode" class="mb-3">
      <b-col sm="12">
        <b-card>
          <b-row>
            <b-col sm="6">
              <!-- 년도 -->
              <y-datepicker
                :required="true"
                :width="8"
                type="year"
                label="L0000000829"
                name="year"
                v-model="searchParam.year"
                @datachange="datachange"
              ></y-datepicker>
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>
    <y-search-box :gridOptions="gridOptions" @enter="getList">
      <b-row slot="search">
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <y-plant type="search" name="plantCd" v-model="searchParam.plantCd" />
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 배출시설분류 -->
          <y-select
            :width="8"
            :comboItems="disFacItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            label="L0000001175"
            name="ghgFcltCd"
            v-model="searchParam.ghgFcltCd"
          ></y-select>
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 배출시설명 -->
          <y-text
            :width="8"
            ui="bootstrap"
            label="L0000001174"
            name="fcltNm"
            v-model="searchParam.fcltNm"
          ></y-text>
        </b-col>
        <b-col
          v-if="!popupParam.popupMode"
          sm="6"
          md="6"
          lg="6"
          xl="6"
          class="col-xxl-3"
        >
          <!-- 사용여부 -->
          <y-select
            :width="8"
            :comboItems="useItems"
            itemText="codeNm"
            itemValue="code"
            label="L0000001439"
            ui="bootstrap"
            name="useYn"
            v-model="searchParam.useYn"
          />
        </b-col>
      </b-row>
    </y-search-box>

    <!-- 배출시설 목록(화면) -->
    <b-row class="grid-height grid-box">
      <b-col sm="12" class="h100p">
        <y-auigrid
          v-if="!popupParam.popupMode"
          ref="yAuiGrid"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000001170')"
          :enableCellMerge="true"
          :useExcelExport="false"
          :enableSorting="true"
          :showGridSetSave="true"
          @cellClick="tableLinkAccidentTitleClicked"
          @openPopup="openPopup"
          @btnSearchClickedCallback="btnSearchClickedCallback"
        />
      </b-col>

      <!-- 배출시설 목록(팝업) -->
      <b-col sm="12" class="h100p">
        <y-auigrid
          v-if="popupParam.popupMode"
          ref="yAuiGrid"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000001170')"
          :enableCellMerge="true"
          :useExcelExport="false"
          :enableSorting="true"
          :showRowCheckColumn="true"
          @btnAdd="btnAdd"
          @btnClosePopup="btnClosePopup"
          @btnSearchClickedCallback="btnSearchClickedCallback"
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
  name: 'y-discharge-facility',
  props: {
    popupParam: {
      type: Object,
      default: function () {
        return {
          popupMode: false,
        };
      },
    },
  },
  data() {
    return {
      searchParam: {
        plantCd: '', // 사업장
        ghtFcltCd: null, // 배출시설코드
        fcltNm: '', // 배출시설명
        useYn: 'Y',
        year: '',
      },
      gridOptions: {
        name: 'dischargeFacility',
        header: [],
        data: [],
        btns: [],
        height: 400,
        selectValue: [],
      },
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        param: {},
        width: '90%',
        top: '10px',
        closeCallback: null,
      },
      editable: false,
      disFacItems: [],
      useItems: [],
      searchUrl: '',
      YAuiGrid: null,
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
    this.getList();
  },
  beforeDestroy() {},
  //* methods */
  methods: {
    init() {
      /* 쿠키에 저장된 검색 조건이 있을 경우 최초 페이지 진입시 자동 설정 */
      var searchParamByCookie = this.$comm.setSearchParamByCookie();
      if (typeof searchParamByCookie !== 'undefined') {
        this.searchParam = searchParamByCookie;
      }

      this.editable = this.$route.meta.editable;
      // 그리드 헤더 설정

      if (this.popupParam.popupMode) {
        this.searchParam.year = this.$comm.getToday().substring(0, 4);
        this.searchParam.filterSave = 'Y';
        this.gridOptions.header = [
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000001415'),
            dataField: 'plantNm',
            width: '14%',
            style: 'center-align',
          }, // 사업장
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000001287'),
            dataField: 'deptNm',
            width: '14%',
            style: 'center-align',
          }, // 부서
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000000515'),
            dataField: 'processNm',
            width: '14%',
            style: 'center-align',
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000001175'),
            dataField: 'ghgFcltNm',
            width: '15%',
            style: 'left-align',
          }, // 배출시설분류
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000001174'),
            dataField: 'fcltNm',
            width: '15%',
            style: 'left-align',
          }, // 배출시설명
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000000136'),
            dataField: 'ngmsFceqNum',
            width: '14%',
            style: 'center-align',
          }, // NGMS시설일련번호
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000004483'),
            dataField: 'ghgCount',
            width: '14%',
            style: 'right-align',
          }, // 활동자료수
        ];
        this.gridOptions.btns = [
          {
            title: this.$comm.getLangSpecInfoLabel('L0000002474'), // 저장
            color: 'orange',
            btnClicked: 'btnAdd',
          },
          {
            title: this.$comm.getLangSpecInfoLabel('L0000000327'), // 검색
            color: 'green',
            btnClicked: 'btnSearchClickedCallback',
          },
          {
            title: this.$comm.getLangSpecInfoLabel('L0000000881'), // 닫기
            color: 'gray',
            btnClicked: 'btnClosePopup',
          },
        ];
      } else {
        this.gridOptions.header = [
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000001415'),
            dataField: 'plantNm',
            width: '9%',
            style: 'center-align',
          }, // 사업장
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000001287'),
            dataField: 'deptNm',
            width: '9%',
            style: 'center-align',
          }, // 부서
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000000515'),
            dataField: 'processNm',
            width: '10%',
            style: 'center-align',
          }, // 공정
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000001175'),
            dataField: 'ghgFcltNm',
            width: '9%',
            style: 'center-align',
          }, // 배출시설분류
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000001174'),
            dataField: 'fcltNm',
            width: '9%',
            style: 'left-align grid-link-cell',
          }, // 배출시설명
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000000136'),
            dataField: 'ngmsFceqNum',
            width: '9%',
            style: 'center-align',
          }, // NGMS시설일련번호
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000004483'),
            dataField: 'ghgCount',
            width: '9%',
            style: 'right-align',
          }, // 활동자료수
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000001439'),
            dataField: 'useYnNm',
            width: '9%',
            style: 'center-align',
          }, // 사용여부
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000002601'),
            dataField: 'sortOrder',
            width: '9%',
            align: 'right',
          }, // 정렬순서
          {
            /* 작성자 */
            headerText: this.$comm.getLangSpecInfoLabel('L0000002355'),
            dataField: 'writerUserNm',
            width: '9%',
            style: 'center-align',
          },
          {
            /* 작성일 */
            headerText: this.$comm.getLangSpecInfoLabel('L0000002352'),
            dataField: 'writerDt',
            width: '9%',
            style: 'center-align',
          },
        ];
        this.gridOptions.btns = [
          {
            title: this.$comm.getLangSpecInfoLabel('L0000001789'), // 신규등록
            color: 'orange',
            btnClicked: 'openPopup',
          },
          {
            title: this.$comm.getLangSpecInfoLabel('L0000000327'), // 검색
            color: 'green',
            btnClicked: 'btnSearchClickedCallback',
          },
        ];
      }

      this.$comm.getComboItems('GHG_FAC_DATA', true).then((_result) => {
        this.disFacItems = _result;
      });

      this.useItems = [
        { code: '', codeNm: this.$comm.getLangSpecInfoLabel('L0000002519') }, // 전체
        { code: 'Y', codeNm: this.$comm.getLangSpecInfoLabel('L0000001440') }, // 사용
        { code: 'N', codeNm: this.$comm.getLangSpecInfoLabel('L0000001063') }, // 미사용
      ];
      this.getList();
    },
    tableLinkAccidentTitleClicked(data) {
      if (data.dataField !== 'fcltNm') {
        return;
      }
      this.openPopup('detail', data);
    },
    openPopup(gubun, data) {
      this.popupOptions.target = () =>
        import(`${'./dischargeFacilityDetail.vue'}`);
      this.popupOptions.width = '90%';
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closePopup;

      if (gubun === 'detail') {
        this.popupOptions.title = 'L0000004484'; // 온실가스 배출시설 수정
        this.popupOptions.param = {
          ghgFcltNo: data.item.ghgFcltNo,
          plantCd: data.item.plantCd,
        };
      } else {
        this.popupOptions.title = 'L0000004484'; // 온실가스 배출시설 등록
        this.popupOptions.param = {
          ghgFcltNo: 0, // key
        };
      }
    },
    getList() {
      this.$http.url = selectConfig.env.gas.dischargeFacility.list.url;
      this.$http.type = 'GET';
      this.$http.param = this.searchParam;
      this.$http.request(
        (_result) => {
          // this.gridOptions.data = this.$_.clone(_result.data);
          this.YAuiGrid.setGridData(this.$_.clone(_result.data));
          this.$comm.pushCookie(this.searchParam);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    datachange() {
      if (!this.searchParam.year) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // 안내
          message: 'M0000000334', // 년도를 지정하세요.
          type: 'warning', // success / info / warning / error
        });
        this.gridOptions.data = [];
      } else {
        this.getList();
      }
    },
    btnAdd() {
      let removeData = this.YAuiGrid.getCheckedRowItemsAll();
      if (removeData.length === 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // 안내
          message: 'M0000000335', // 배출시설을 하나 이상 선택하세요.
          type: 'warning', // success / info / warning / error
        });
        // 이쪽임
      } else if (!this.searchParam.year) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // 안내
          message: 'M0000000334', // 년도를 지정하세요.
          type: 'warning', // success / info / warning / error
        });
      } else {
        window.getApp.$emit('CONFIRM', {
          title: 'L0000003321', // 확인
          message: 'M0000000011', // 저장하시겠습니까?
          type: 'info',
          confirmCallback: () => {
            this.btnClosePopup(removeData);
          },
          cancelCallback: () => {},
        });
      }
    },
    closePopup(data) {
      if (data === null || data === undefined) return;
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.getList();
    },
    btnClosePopup(data) {
      this.$emit('closePopup', { year: this.searchParam.year, data: data });
    },
    resizeGrid() {
      let _height = window.innerHeight - 335;
      if (window.innerHeight < 500) {
        _height = 250;
      }

      this.YAuiGrid.resize(null, _height);
    },
    /** button 관련 이벤트 **/
    btnSearchClickedCallback() {
      this.getList();
    },
    btnClickedErrorCallback(_result) {
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
  },
};
</script>
