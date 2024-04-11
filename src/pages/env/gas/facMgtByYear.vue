<template>
  <b-container fluid>
    <y-search-box :gridOptions="gridOptions" @enter="getList">
      <b-row slot="search">
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <y-plant type="search" name="plantCd" v-model="searchParam.plantCd" />
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!--년도  -->
          <y-datepicker
            :width="8"
            type="year"
            label="L0000000829"
            name="year"
            v-model="searchParam.year"
          ></y-datepicker>
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
      </b-row>
    </y-search-box>

    <!-- 연도별 배출시설 목록 -->
    <b-row class="grid-height grid-box">
      <b-col sm="12" class="h100p">
        <y-auigrid
          ref="yAuiGrid"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000001993')"
          :useExcelExport="false"
          :enableSorting="true"
          :showGridSetSave="true"
          :showRowCheckColumn="true"
          @cellClick="tableLinkAccidentTitleClicked"
          @btnRemoveClicked="btnRemoveClicked"
          @btnAdd="btnAdd"
          @btnSearchClickedCallback="btnSearchClickedCallback"
        />
      </b-col>
    </b-row>
    <y-dialog :param="popupOptions"></y-dialog>
  </b-container>
</template>
<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
export default {
  /* attributes: name, components, props, data */
  name: 'y-assess-plan',
  props: {},
  data() {
    return {
      searchParam: {
        plantCd: '',
        year: '',
        ghgFcltNo: 0,
        fcltNm: '',
      },
      gridOptions: {
        selectValue: [],
        name: 'facMgtByYear',
        header: [],
        data: [],
        btns: [],
        height: 400,
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
      searchUrl: '',
      saveItems: [],
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
      this.editable = this.$route.meta.editable;
      this.searchParam.year = this.$comm.getToday().substring(0, 4);
      // 그리드 헤더 설정
      this.gridOptions.header = [
        {
          /* 사업장 */
          headerText: this.$comm.getLangSpecInfoLabel('L0000001415'),
          dataField: 'plantNm',
          width: '120',
          style: 'center-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001287'),
          dataField: 'deptNm',
          width: '120',
          style: 'center-align',
        } /* 부서 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000515'),
          dataField: 'processNm',
          width: '120',
          style: 'center-align',
        } /* 공정 */,
        {
          /* 년도 */ headerText: this.$comm.getLangSpecInfoLabel('L0000000829'),
          dataField: 'year',
          width: '80p',
          style: 'center-align',
        },
        {
          /* 배출시설분류 */
          headerText: this.$comm.getLangSpecInfoLabel('L0000001175'),
          dataField: 'ghgFcltNm',
          width: '140',
          style: 'left-align',
        },
        {
          /* 배출시설명 */
          headerText: this.$comm.getLangSpecInfoLabel('L0000001174'),
          dataField: 'fcltNm',
          width: '180',
          style: 'left-align grid-link-cell',
        },
        {
          /* NGMS시설일련번호 */
          headerText: this.$comm.getLangSpecInfoLabel('L0000000136'),
          dataField: 'ngmsFceqNum',
          width: '150',
          style: 'center-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004483'),
          dataField: 'ghgCount',
          width: '100',
          style: 'right-align',
        } /* 활동자료수 */,
        // 작성자
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002355'),
          dataField: 'writerUserNm',
          width: '120',
          style: 'center-align',
        },
        // 작성일
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002352'),
          dataField: 'writerDt',
          width: '120',
          style: 'center-align',
        },
      ];
      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001789'),
          color: 'orange',
          btnClicked: 'btnAdd',
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001495'),
          color: 'red',
          btnClicked: 'btnRemoveClicked',
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000327'),
          color: 'green',
          btnClicked: 'btnSearchClickedCallback',
        },
      ];

      /* 쿠키에 저장된 검색 조건이 있을 경우 최초 페이지 진입시 자동 설정 */
      var searchParamByCookie = this.$comm.setSearchParamByCookie();
      if (typeof searchParamByCookie !== 'undefined') {
        this.searchParam = searchParamByCookie;
      }
      this.getList();
    },
    tableLinkAccidentTitleClicked(data) {
      if (data.dataField !== 'fcltNm') {
        return;
      }
      this.openPopup('detail', data.item);
    },
    openPopup(gubun, data) {
      if (!data.year || data.year === '') {
        window.getApp.$emit('ALERT', {
          title: 'L0000003321', // 확인
          message: 'M0000000338', // 먼저 저장을 하세요.
          type: 'warning',
        });
        return;
      }
      this.popupOptions.target = () => import(`${'./facMgtByYearDetail.vue'}`);
      this.popupOptions.width = '90%';
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closePopup;

      if (gubun === 'detail') {
        this.popupOptions.title = 'L0000001993'; // 연도별 배출시설 목록
        this.popupOptions.param = {
          ghgFcltNo: data.ghgFcltNo,
          year: data.year,
          plantCd: data.plantCd,
        };
      }
    },
    getList() {
      return new Promise((_resolve, _reject) => {
        this.$http.url = selectConfig.env.gas.facMgtYear.list.url;
        this.$http.type = 'GET';
        this.$http.param = this.searchParam;
        this.$http.request(
          (_result) => {
            this.YAuiGrid.setGridData(this.$_.clone(_result.data));
            this.$comm.pushCookie(this.searchParam);
            _resolve(true);
          },
          (_error) => {
            window.getApp.$emit('APP_REQUEST_ERROR', _error);
            _resolve(false);
          }
        );
      });
    },
    closePopup(data) {
      if (data === null || data === undefined) return;
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.getList();
    },
    checkValidation() {
      return new Promise((_resolve, _reject) => {
        if (this.gridOptions.selectValue.length === 0) {
          _resolve(false);
        } else {
          _resolve(true);
        }
      });
    },
    btnSaveClicked(_result) {
      this.$comm.recursivePromise([
        { func: this.checkValidation1, exceptionMessage: 'M0000000068' }, // 하나 이상 선택하세요.
        { func: this.checkValidation2, exceptionMessage: 'M0000000339' }, // 년도를 선택하세요.
        { func: this.confirm, param: 'M0000000341' }, // 저장하시겠습니까? (이미 해당년도에 대한 배출시설을 등록한 경우 제외하고 저장이 됩니다.)
        { func: this.saveData, successMessage: 'M0000000006' }, // 저장되었습니다.
      ]);
    },
    checkValidation1() {
      return new Promise((_resolve, _reject) => {
        if (this.gridOptions.selectValue.length === 0) {
          _resolve(false);
        } else {
          _resolve(true);
        }
      });
    },
    checkValidation2() {
      return new Promise((_resolve, _reject) => {
        if (!this.searchParam.year || this.searchParam.year === '') {
          _resolve(false);
        } else {
          _resolve(true);
        }
      });
    },
    btnAdd() {
      this.popupOptions.target = () => import(`${'./dischargeFacility.vue'}`);
      this.popupOptions.width = '75%';
      this.popupOptions.title = this.$comm.getLangSpecInfoLabel('L0000004491'); // 배출시설 관리 검색
      this.popupOptions.param = {
        popupMode: true,
      };
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closeFacPopup;
    },
    closeFacPopup(data) {
      this.popupOptions.visible = false;
      this.popupOptions.target = null;

      if (data && data.data && data.data.length > 0) {
        this.$_.forEach(data.data, (_item) => {
          this.saveItems.splice(0, 0, {
            ghgFcltNo: _item.ghgFcltNo,
            year: data.year,
            createUserId: this.$store.getters.token,
          });
        });

        this.saveData();
      }
    },
    confirm() {
      return new Promise((_resolve, _reject) => {
        window.getApp.$emit('CONFIRM', {
          title: 'L0000003321', // 확인
          message: 'M0000000341', // 저장하시겠습니까? (이미 해당년도에 대한 배출시설을 등록한 경우 제외하고 저장이 됩니다.)
          type: 'info',
          confirmCallback: () => {
            this.$_.forEach(this.gridOptions.selectValue, (_item) => {
              this.saveItems.splice(0, 0, {
                ghgFcltNo: _item.ghgFcltNo,
                year: this.searchParam.year,
                createUserId: this.$store.getters.token,
              });
            });
            _resolve(true);
          },
          cancelCallback: () => {
            _resolve(false);
          },
        });
      });
    },
    saveData() {
      return new Promise((_resolve, _reject) => {
        this.$http.url = transactionConfig.env.gas.facMgtYear.insert.url;
        this.$http.type = 'POST';
        this.$http.param = this.saveItems;
        this.$http.request(
          (_result) => {
            this.getList();
            window.getApp.$emit('ALERT', {
              title: 'L0000003395', // 안내
              message: 'M0000000006', // 저장되었습니다.
              type: 'success', // success / info / warning / error
            });
            _resolve(true);
          },
          (_error) => {
            window.getApp.$emit('APP_REQUEST_ERROR', _error);
            _resolve(false);
          }
        );
      });
    },
    btnRemoveClicked(_result) {
      let removeDataSel = this.YAuiGrid.getCheckedRowItemsAll();
      let flag = true;
      if (removeDataSel.length === 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // 안내
          message: 'M0000000068', // 하나 이상 선택하세요.
          type: 'warning', // success / info / warning / error
        });
        return;
      }
      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321', // 확인
        message: 'M0000000012', // 삭제하시겠습니까?
        type: 'info',
        confirmCallback: () => {
          this.$_.forEach(this.YAuiGrid.getCheckedRowItemsAll(), (_item) => {
            this.$http.url = this.$format(
              transactionConfig.env.gas.facMgtYear.delete.url,
              _item.ghgFcltNo,
              _item.year
            );
            this.$http.type = 'DELETE';
            this.$http.request(
              (_result) => {
                flag = true;
              },
              (_error) => {
                window.getApp.$emit('APP_REQUEST_ERROR', _error);
                flag = false;
              }
            );
          });
          if (flag) {
            window.getApp.$emit('ALERT', {
              title: '안내',
              message: '정상적으로 삭제하였습니다.',
              type: 'success',
            });
            this.getList();
          }
        },
        // 취소 callback 함수
        cancelCallback: () => {},
      });
    },
    btnSearchClickedCallback() {
      this.getList();
    },
    resizeGrid() {
      let _height = window.innerHeight - 335;
      if (window.innerHeight < 500) {
        _height = 250;
      }

      this.YAuiGrid.resize(null, _height);
    },
  },
};
</script>
