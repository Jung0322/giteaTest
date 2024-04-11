<!--
  목적 : 물질관리 > 기준정보 > 인허가신고서
  작성자 : kdh
  Detail : 인허가신고서 목록/조회 화면
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <y-search-box :gridOptions="gridOptions" @enter="getDataList">
      <b-row slot="search">
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
          <y-plant
            type="search"
            filter="chm"
            v-model="searchParam.plantCd"
            @datachange="
              (val) => {
                (searchParam.plantCd = val), getDataList();
              }
            "
          />
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
          <!-- 인허가구분 -->
          <y-select
            :width="8"
            :comboItems="permitKindItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            label="L0000002248"
            v-model="searchParam.permitKindCd"
            @datachange="
              (val) => {
                (searchParam.permitKindCd = val), getDataList();
              }
            "
          ></y-select>
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
          <!-- 인허가신고명 -->
          <y-text
            :width="8"
            ui="bootstrap"
            label="L0000002251"
            name="permitClsNmSearch"
            v-model="searchParam.permitClsNm"
            @datachange="
              (val) => {
                (searchParam.permitClsNm = val), getDataList();
              }
            "
          ></y-text>
        </b-col>
      </b-row>
    </y-search-box>
    <!-- <b-row class="mt-3">
      <b-col sm="12">
        <b-col sm="12" class="px-0">
          <div slot="buttonGroup" class="float-right mb-1">
             신규등록 
            <y-btn
              v-if="editable"
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
          </div>
           인허가신고서 목록 
          <y-data-table
            label="L0000002252"
            ref="dataTable"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            :span-options="gridOptions.merge"
            @tableLinkClicked="tableLinkClicked"
            :excelDown="true"
            :use-paging="true"
          ></y-data-table>
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
          :label="this.$comm.getLangSpecInfoLabel('L0000002252')"
          :useExcelExport="false"
          :enableCellMerge="true"
          :enableSorting="true"
          :showGridSetSave="true"
          :useContextMenu="true"
          :enableRightDownFocus="true"
          :showGridCtrl="true"
          @btnSearchClickedCallback="btnSearchClickedCallback"
          @btnPopupClickedCallback="btnPopupClickedCallback"
          @cellClick="cellClickHandler"
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
  name: 'y-chemical-branch',
  props: {},
  data() {
    return {
      chemicalPermitCls: {
        permitClsNm: '',
        permitClsCd: '',
        permitKindCd: null,
        permitConfirms: [],
        confirmYn: '',
        attachYn: '',
        mainOrg: '',
        permitPeriod: '',
        permitUrl: '',
        sortOrder: '',
        needYn: 'N',
        useYn: 'Y',
        createUserId: '',
        updateUserId: '',
        regulItmNos: [],
        plantCd: '', // 사업장
      },
      branchCd: '',
      searchParam: {
        permitKindCd: null, // 인허가구분
        permitClsNm: '', // 인허가신고명
        plantCd: '', // 사업장
      },
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '90%',
        top: '10px',
        param: {},
        closeCallback: null,
      },
      gridOptions: {
        name: 'chemicalPermitCls',
        btns: [],
        header: [],
        data: [],
        height: 'auto',
        merge: [],
        checkGroupStyle: 'width: 140px !important;',
        regulItemHeader: [],
        regulItemData: [],
        regulItemHeight: 250,
        regulItemMinHeight: '250px',
      },
      YAuiGrid: null,
      editable: false,
      updateMode: false,
      searchUrl: '',
      searchPermitRegulUrl: '',
      searchRegulUrl: '',

      isInsert: false,
      isEdit: false,
      permitKindItems: [], // 인허가 구분 리스트 (조회)
      permitKindSaveItems: [], // 인허가 구분 리스트 (저장)
      permitConfirmItems: [],
      regulItems: [],
      plantItems: [],
    };
  },
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
    window.addEventListener('resize', this.resizeGrid);
    this.editable = this.$route.meta.editable;
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;
    this.resizeGrid();
  },
  beforeDestroy() {},
  /** methods **/
  methods: {
    /** 초기화 관련 함수 **/
    init() {
      // URL 셋팅
      this.searchUrl = selectConfig.chm.chemicalPermitCls.list.url;
      this.searchPermitRegulUrl =
        selectConfig.chm.chemicalPermitCls.permitRegul.url;
      this.searchRegulUrl = selectConfig.chm.chemicalRegulItem.list.url;

      this.permitConfirmItems = [
        {
          code: 'confirm',
          codeNm: this.$comm.getLangSpecInfoLabel('L0000003321'),
        }, // 전체
        {
          code: 'attach',
          codeNm: this.$comm.getLangSpecInfoLabel('L0000002843'),
        }, // 첨부파일
      ];
      this.$comm.getComboItems('CHM_PERMIT_KND', true).then((_result) => {
        this.permitKindItems = _result; // 인허가구분
      });

      /* 쿠키에 저장된 검색 조건이 있을 경우 최초 페이지 진입시 자동 설정 */
      var searchParamByCookie = this.$comm.setSearchParamByCookie();
      if (typeof searchParamByCookie !== 'undefined') {
        this.searchParam = searchParamByCookie;
      }

      this.getDataList(); // 인허가신고서 grid
      this.getRegulItems();

      // 인허가신고서 grid 헤더 설정
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001415'),
          dataField: 'plantNm',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002251'),
          dataField: 'permitClsNm',
          width: '10%',
          style: 'left-align',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {},
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002248'),
          dataField: 'permitKindNm',
          width: '7%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002633'),
          dataField: 'mainOrg',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000568'),
          dataField: 'regulLawNm',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000726'),
          dataField: 'regulItmNms',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002839'),
          dataField: 'permitPeriod',
          width: '8%',
          style: 'right-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003163'),
          dataField: 'needYnNm',
          width: '7%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001439'),
          dataField: 'useYnNm',
          width: '7%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002601'),
          dataField: 'sortOrder',
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
          title: this.$comm.getLangSpecInfoLabel('L0000001789'),
          color: 'orange',
          btnClicked: 'btnPopupClickedCallback',
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000327'),
          color: 'green',
          btnClicked: 'btnSearchClickedCallback',
        },
      ];
    },
    getDataList() {
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = this.searchParam;
      this.$http.request(
        (_result) => {
          // this.gridOptions.data = _result.data;
          this.YAuiGrid.setGridData(_result.data);
          this.$comm.pushCookie(this.searchParam);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    getRegulItems() {
      this.$http.url = this.searchRegulUrl;
      this.$http.type = 'GET';
      this.$http.param = {
        useYn: 'Y',
      };
      this.$http.request(
        (_result) => {
          let keys = this.$_.uniq(this.$_.map(_result.data, 'regulLawCd'));
          let keyNames = this.$_.uniq(this.$_.map(_result.data, 'regulLawNm'));
          this.$_.forEach(keys, (key) => {
            this.regulItems.push(
              this.$_.filter(_result.data, { regulLawCd: key })
            );
          });
          this.gridOptions.regulItemHeader = [
            {
              text: 'L0000000568',
              name: 'regulLawNm',
              width: '130px',
              align: 'center',
            }, // 관련법규
            {
              text: 'L0000000726',
              name: 'regulItmNms',
              width: '500px',
              type: 'checkboxmulti',
              items: this.regulItems,
              itemText: 'regulItmNm',
              itemValue: 'regulItmNo',
            }, // 규제사항
          ];
          this.setRegulItemData([]);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    getRegulDataList(permitClsNo) {
      this.$http.url = this.searchPermitRegulUrl;
      this.$http.type = 'GET';
      this.$http.param = {
        permitClsNo: permitClsNo,
      };
      this.$http.request(
        (_result) => {
          let keys = this.$_.uniq(this.$_.map(_result.data, 'regulLawCd'));
          let keyNames = this.$_.uniq(this.$_.map(_result.data, 'regulLawNm'));
          let values = [];
          this.$_.forEach(keys, (key) => {
            values.push(
              this.$_.map(
                this.$_.filter(_result.data, { regulLawCd: key }),
                'regulItmNo'
              )
            );
          });
          this.setRegulItemData(this.$_.zipObject(keys, values));
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    setRegulItemData(regulItmNms) {
      this.$http.url = this.$format(
        selectConfig.codeMaster.getSelect.url,
        'CHM_REGUL_LAW'
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.gridOptions.regulItemData = [];
          this.$_.forEach(_result.data, (item) => {
            this.gridOptions.regulItemData.push({
              regulLawNm: item.codeNm,
              regulItmNms: !this.$_.isEmpty(regulItmNms)
                ? regulItmNms[item.code]
                : [],
            });
          });
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    /** /validation checking **/
    /** Button Event **/

    // 검색
    btnSearchClickedCallback(_result) {
      this.getDataList();
    },
    // 버튼 에러 처리
    btnClickedErrorCallback(_result) {
      this.isInsert = false;
      this.isEdit = false;
      this.updateMode = false;
      window.getApp.emit('APP_REQUEST_ERROR', _result);
    },

    /**
     * 수정 팝업 호출
     */
    resizeGrid() {
      let _height = window.innerHeight - 335;
      if (window.innerHeight < 500) {
        _height = 250;
      }

      this.YAuiGrid.resize(null, _height);
    },
    cellClickHandler(event) {
      if (event.dataField !== 'permitClsNm') return;
      this.popupOptions.top = '10px';
      this.popupOptions.width = '80%';
      this.popupOptions.target = () =>
        import(`${'./chemicalPermitClsDetail.vue'}`);
      this.popupOptions.title = 'L0000002253';
      // 인허가신고서 상세
      this.popupOptions.visible = true;
      this.popupOptions.param = event.item;
      this.popupOptions.closeCallback = this.closePopupUsage;
    },
    tableLinkClicked(header, data) {
      if (data === null || data === undefined) return;
      this.popupOptions.top = '10px';
      this.popupOptions.width = '80%';
      this.popupOptions.target = () =>
        import(`${'./chemicalPermitClsDetail.vue'}`);
      this.popupOptions.title = 'L0000002253';
      // 인허가신고서 상세
      this.popupOptions.visible = true;
      this.popupOptions.param = data;
      this.popupOptions.closeCallback = this.closePopupUsage;
    },
    /**
     * 등록 팝업  호출
     */
    btnPopupClickedCallback() {
      this.popupOptions.top = '10px';
      this.popupOptions.width = '80%';
      this.popupOptions.target = () =>
        import(`${'./chemicalPermitClsDetail.vue'}`);
      this.popupOptions.title = 'L0000002253';
      this.popupOptions.visible = true;
      this.popupOptions.param = {
        permitClsNo: 0,
      };
      this.popupOptions.closeCallback = this.closePopupUsage;
    },
    closePopupUsage(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.getDataList();
    },
  },
};
</script>
