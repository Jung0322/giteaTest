<!--
  목적 : 공사안전 > 작업허가서 현황
  Detail : 작업허가서 현황 화면
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <y-search-box :gridOptions="gridOptions" @enter="getList">
      <b-row slot="search">
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <y-plant type="search" v-model="searchParam.plantCd" />
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 작업기간 -->
          <y-datepicker
            :width="8"
            :range="true"
            label="L0000002373"
            name="workYmd"
            v-model="searchParam.workYmd"
          ></y-datepicker>
        </b-col>
      </b-row>
    </y-search-box>

    <!-- 검색 결과 테이블 -->
    <b-row class="grid-height grid-box">
      <b-col sm="12" class="h100p">
        <y-auigrid
          ref="yAuiGrid"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000001433')"
          :useExcelExport="true"
          :showGridSetSave="true"
          @cellClick="cellClickHandler"
          @btnSearch="getList"
        />
      </b-col>
    </b-row>

    <y-search-box :gridOptions="gridOptions2" @enter="selectedRow(null)">
      <b-row slot="search">
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 신청부서 -->
          <y-tree-dept
            label="L0000001798"
            type="search"
            name="reqDeptCd"
            :plantCd="searchParam2.plantCd"
            v-model="searchParam2.reqDeptCd"
          />
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 사용/운전부서 -->
          <y-tree-dept
            label="L0000001442"
            type="search"
            name="pubDeptCd"
            :showAllDept="true"
            :plantCd="searchParam2.plantCd"
            v-model="searchParam2.pubDeptCd"
          />
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 공사업체 -->
          <y-text
            :width="8"
            ui="bootstrap"
            label="L0000000507"
            name="subconnNm"
            v-model="searchParam2.subconnNm"
          ></y-text>
        </b-col>
      </b-row>
    </y-search-box>

    <b-row class="grid-height grid-box">
      <b-col sm="12" class="h100p">
        <!-- 사업장별 세부 작업허가서 현황 -->
        <y-auigrid
          ref="yAuiGrid2"
          :headers="gridOptions2.header"
          :btns="gridOptions2.btns"
          :height="gridOptions2.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000001429')"
          :useExcelExport="true"
          :showGridSetSave="true"
          @cellClick="cellClickHandler"
          @btnSearch="selectedRow(null)"
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
  name: 'wkod-status',
  props: {},
  data() {
    return {
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '90%',
        top: '10px',
        param: {},
        closeCallback: null,
      },
      searchParam: {
        plantCd: '',
        workYmd: [],
      },
      searchParam2: {
        plantCd: '',
        workYmd: [],
        reqDeptCd: '',
        subconnNm: '',
        vendorCd: '',
      },
      // gubun: 'req',
      YAuiGrid: null,
      gridOptions: {
        header: [],
        data: [],
        height: '300',
      },
      YAuiGrid2: null,
      gridOptions2: {
        header: [],
        data: [],
        height: '500',
      },
      editable: true,
      searchUrl: '',
      searchUrl2: '',
      comboWkodTypeItems: [],
      comboItems: [],
    };
  },
  watch: {},
  //* Vue lifecycle: created, mounted, destroyed, etc */
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;
    this.YAuiGrid2 = this.$refs.yAuiGrid2;
    this.getList();
  },
  beforeDestroy() {},
  //* methods */
  methods: {
    init() {
      this.editable = this.$route.meta.editable;
      // Url Setting
      this.searchUrl = selectConfig.saf.wkodMaster.status.url;
      this.searchUrl2 = selectConfig.saf.wkodMaster.status2.url;

      this.searchParam2.plantCd = this.$_.clone(this.searchParam.plantCd);

      this.searchParam.workYmd = [];
      this.searchParam.workYmd.push(
        this.$comm
          .getCalculatedDate(
            this.$comm.getToday(),
            '-1m',
            'YYYY-MM-DD',
            'YYYY-MM-DD'
          )
          .substr(0, 8) + '01'
      );
      this.searchParam.workYmd.push(this.$comm.getToday());
      this.comboItems = [
        { code: 'req', codeNm: 'L0000001798' }, // 신청부서
        { code: 'pub', codeNm: 'L0000001442' }, // 사용/운전부서
        { code: 'sub', codeNm: 'L0000000507' }, // 공사업체
      ];

      // 그리드 헤더 설정
      this.setHeader(true);
      this.gridOptions.btns = [
        { 
          title: this.$comm.getLangSpecInfoLabel('L0000000327'), 
          btnClicked: 'btnSearch',
        },  // 검색
      ];
      this.gridOptions2.btns = [
        { 
          title: this.$comm.getLangSpecInfoLabel('L0000000327'), 
          btnClicked: 'btnSearch',
        },  // 검색
      ];

      /* 쿠키에 저장된 검색 조건이 있을 경우 최초 페이지 진입시 자동 설정 */
      var searchParamByCookie = this.$comm.setSearchParamByCookie();
      if (typeof searchParamByCookie !== 'undefined') {
        this.searchParam = searchParamByCookie;
      }

      /* 쿠키에 저장된 검색 조건이 있을 경우 최초 페이지 진입시 자동 설정 */
      var searchParamByCookie2 = this.$comm.setSearchParamByCookie();
      if (typeof searchParamByCookie2 !== 'undefined') {
        this.searchParam2 = searchParamByCookie2;
      }
    },
    setHeader(isFirst) {
      this.gridOptions.header = [
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000001415'), 
          dataField: 'plant_nm', 
          width: '130', 
        }, // 사업장
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000003180'), 
          dataField: 'sum', 
          width: '100', 
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {}, 
          },
        }, // 합계
      ];

      this.gridOptions2.header = [
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000003180'), 
          dataField: 'sum', 
          width: '100', 
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {}, 
          },
        } 
      ];

      if (isFirst) {
        this.$comm.getComboItems('SAF_WKOD_WKKD', true).then((_result) => {
          // 허가서 구분
          _result = this.$_.filter(_result, { attr3: 'STANDARD' });
          _result = this.$_.reject(_result, {
            codeNm: this.$comm.getLangSpecInfoLabel('L0000004663'),
          }); // 보충작업
          this.comboWkodTypeItems = _result;
          this.getComboAttrItems('SAF_WKOD_KIND');
        });
      } else {
        this.getComboAttrItems('SAF_WKOD_KIND'); // 작업구분
      }
    },
    getList() {
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = this.searchParam;
      this.$http.request(
        (_result) => {
          this.YAuiGrid.setGridData(_result.data);
          this.$comm.pushCookie(this.searchParam);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    selectedRow(data) {
      if (data) {
        this.searchParam2.plantCd = data.plant_cd;
      }
      this.searchParam2.workYmd = this.searchParam.workYmd;
      this.$http.url = this.searchUrl2;
      this.$http.type = 'GET';
      this.$http.param = this.searchParam2;
      this.$http.request(
        (_result) => {
          this.YAuiGrid2.setGridData(_result.data);
          this.$comm.pushCookie(this.searchParam2);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    getComboAttrItems(codeGroupCd) {
      this.$http.url = this.$format(
        selectConfig.codeMaster.getSelectAttr.url,
        codeGroupCd,
        null,
        null,
        'STANDARD'
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          let index = 1;
          let indexSub = 0;
          this.$_.forEach(this.comboWkodTypeItems, (type) => {
            if (type.code) {
              let headerInfo = {
                headerText: type.codeNm,
                dataField: type.code,
                children: [],
              };
              let index2 = 0;
              // 보충작업X
              headerInfo.children.push({
                headerText: this.$comm.getLangSpecInfoLabel('L0000001258'),
                dataField: type.code,
                style: 'right-align',
                width: '110px',
                dataType: 'numeric',
                formatString: '#,##0',
                renderer: {
                  type: 'LinkRenderer',
                  baseUrl: 'javascript',
                  jsCallback: function (rowIndex, columnIndex, value, item) {}, 
                },
              });
              this.$_.forEach(_result.data, (item) => {
                headerInfo.children.push({
                  headerText: item.codeNm,
                  dataField: type.code + '_' + item.code,
                  style: 'right-align',
                  width: '100px',
                  dataType: 'numeric',
                  formatString: '#,##0',
                  renderer: {
                    type: 'LinkRenderer',
                    baseUrl: 'javascript',
                    jsCallback: function (rowIndex, columnIndex, value, item) {}, 
                  },
                });
                if (_result.data.length - 1 === index2) {
                  if (index === 1) {
                    // 소계
                    headerInfo.children.push({
                      headerText: this.$comm.getLangSpecInfoLabel('L0000001659'),
                      dataField: 'sumGeneral',
                      width: '100px',
                      style: 'right-align',
                      dataType: 'numeric',
                      formatString: '#,##0',
                      renderer: {
                        type: 'LinkRenderer',
                        baseUrl: 'javascript',
                        jsCallback: function (rowIndex, columnIndex, value, item) {}, 
                      },
                    });
                  } else {
                    headerInfo.children.push({
                      headerText: this.$comm.getLangSpecInfoLabel('L0000001659'),
                      dataField: 'sumSpecial',
                      width: '100px',
                      style: 'right-align',
                      dataType: 'numeric',
                      formatString: '#,##0',
                      renderer: {
                        type: 'LinkRenderer',
                        baseUrl: 'javascript',
                        jsCallback: function (rowIndex, columnIndex, value, item) {}, 
                      },
                    });
                  }
                }
                index2++;
              });
              this.gridOptions.header.splice(index, 0, headerInfo);
              this.gridOptions2.header.splice(indexSub, 0, headerInfo);
              index++;
              indexSub++;
            }
          });

          this.YAuiGrid.changeColumnLayout(this.gridOptions.header);
          this.YAuiGrid2.changeColumnLayout(this.gridOptions2.header);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    cellClickHandler(event) {
      if (event.dataField === 'plant_nm')
      {
        this.selectedRow(event.item);
        return;
      }
      const row = event.item;

      let msg = '';
      let msgAppend = '';

      if (event.dataField === 'sumGeneral') {
        msgAppend = this.$comm.getLangSpecInfoMessage('M0000000255');
      } else if (event.dataField === 'sumSpecial') {
        msgAppend = this.$comm.getLangSpecInfoMessage('M0000000256');
      } else {
        msgAppend = this.$comm.getLangSpecInfoMessage('M0000000257');
      }

      if (row[event.dataField] === 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: this.$comm.getLangSpecInfoMessage('M0000000254', {
            s1: row.plant_nm ? row.plant_nm : row.req_dept_nm,
          }),
          type: 'warning', // success / info / warning / error
        });
      } else {
        let wkodClsCd = '';
        let wkodKindCds = [];
        if (event.dataField === 'sumGeneral') {
          // 허가서구분에 일반의 소계는 허가서구분 일반만 들고 간다.
          wkodClsCd = 'WKKDNS';
        } else if (event.dataField === 'sumSpecial') {
          // 허가서구분에 특별의 소계는 허가서구분 특별만 들고 간다.
          wkodClsCd = 'WKKDSS';
        } else {
          if (event.dataField !== 'sum') {
            let split = this.$_.split(event.dataField, '_');
            if (split && split.length > 0) {
              wkodClsCd = split[0];
              wkodKindCds.push({
                code: split[1],
                name: event.headerText,
              });
            }
          } else {
            // 총 합계의 경우 plantCd만 들고 간다.
          }
        }
        // 작업허가서 목록을 띄워준다.
        this.popupOptions.target = () => import(`${'./wkodRequest.vue'}`);
        this.popupOptions.title = 'L0000002430'; // 작업허가서 목록
        this.popupOptions.visible = true;
        this.popupOptions.width = '80%';
        this.popupOptions.param = {
          popupMode: true,
          subconnNm: row.subconn_nm,
          plantCd: row.plant_cd,
          wkodClsCd: wkodClsCd,
          wkodKindCds: wkodKindCds,
          workYmd: this.searchParam.workYmd,
        };
        this.popupOptions.closeCallback = this.closePopup;
      }
    },
    closePopup() {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
    },
    /** end button 관련 이벤트 **/
  },
};
</script>