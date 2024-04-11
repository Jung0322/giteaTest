<!--
  목적 : 작업허가서 신청 목록
  Detail : 작업허가서 신청 목록 화면
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <!-- 검색 -->
    <!-- <b-row ref="searchBox">
      <b-col sm="12">
        <b-card header-class="default-card" body-class="default-body-card" class="py-0">
          <div slot="header">
            <y-label label="검색" />
            <div class="float-right">
              <y-btn
                :action-url="searchUrl"
                :param="searchParam"
                title="검색"
                color="green"
                action-type="get"
                @btnClicked="btnSearchClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
            </div>
          </div>
          <b-row>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-select
                :width="8"
                :disabled="true"
                :comboItems="comboImprClassItems"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                label="업무구분"
                name="imprClassCd"
                v-model="popupParam.imprClassCd"
              ></y-select>
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>-->

    <!-- 검색 결과 테이블 -->
    <!-- <b-row>
      <b-col sm="12">
        <b-col sm="12" class="px-0">
          <div class="float-right mb-1">
             닫기 -
            <y-btn title="L0000000881" @btnClicked="btnClosePopup" />
          </div>
           개선조치실적 업무별 목록 
          <y-data-table
            label="L0000003574"
            ref="dataTable"
            :print="true"
            :use-paging="true"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            @tableLinkClicked="tableLinkimprTitleClicked"
            :popMode="true"
          />
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
          :label="this.$comm.getLangSpecInfoLabel('L0000003574')"
          :useExcelExport="false"
          :enableCellMerge="true"
          :enableSorting="true"
          :showGridSetSave="true"
          :useContextMenu="true"
          :enableRightDownFocus="true"
          :showGridCtrl="true"  
          @btnClosePopup="btnClosePopup"
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
  /* attributes: name, components, props, data */
  name: 'impr-performance-detail',
  props: {
    popupParam: {
      type: Object,
      default: {
        imprClassCd: '',
        imprStepCd: '',
        actClassCd: 'ACL02',
      },
    },
  },
  data() {
    return {
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '1000px',
        top: '10px',
        param: {},
        closeCallback: null,
      },
      // searchParam: {
      //   imprClassCd: '',
      //   imprStepCd: '',
      //   actClassCd: 'ACL02',
      //   imprTitle: '',
      //   imprRqstDeptCd: '',
      //   actDeptCd: '',
      //   subconnNm: '',
      // },
      deptVendorGubun: '',
      gridOptions: {
        name: 'imprPerformanceDetail',
        btns: [],
        header: [],
        data: [],
        height: 300,
      },
      YAuiGrid: null,
      component: null,
      comboImprStepItems: [],
      comboImprClassItems: [],
      deptVendorGubunItems: [],
      searchUrl: '',
      editable: true,
    };
  },
  //* Vue lifecycle: created, mounted, destroyed, etc */
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
    // this.getComboItems('SAF_IMPR_CLASS'); // 개선분류코드
    // this.getComboItems('SAF_IMPR_STEP'); // 개선진행단계
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;
  },
  beforeDestroy() {},
  //* methods */
  methods: {
    init() {
      this.editable = this.$route.meta.editable;

      this.searchUrl = selectConfig.saf.imprAct.list.url;

      this.getList();

      // 그리드 헤더 설정
      if (this.popupParam.actClassCd === 'ACL02') {
        this.gridOptions.header = [
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000001947'), 
            dataField: 'imprClassNm', 
            width: '10%', 
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000002616'), 
            dataField: 'imprTitle', 
            width: '20%', 
            renderer: {
              type: 'LinkRenderer',
              baseUrl: 'javascript',
              jsCallback: function (rowIndex, columnIndex, value, item) {              
              },
            },
          },   
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000002779'), 
            dataField: 'imprStepNm', 
            width: '10%', 
          },     
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000002055'), 
            dataField: 'imprRqstYmd', 
            width: '10%', 
          },  
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000002053'), 
            dataField: 'imprRqstDeptNm', 
            width: '10%', 
          },  
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000002676'), 
            dataField: 'actDeptNm', 
            width: '10%', 
          },  
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000002672'), 
            dataField: 'actUserNm', 
            width: '10%', 
          },  
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000002670'), 
            dataField: 'actLimitYmd', 
            width: '10%', 
          },  
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000002694'), 
            dataField: 'actConfirmYmd', 
            width: '10%', 
          },
        ];
      }
      else {
        this.gridOptions.header = [
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000001947'), 
            dataField: 'imprClassNm', 
            width: '10%', 
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000002666'), 
            dataField: 'actResultContents', 
            width: '30%', 
            renderer: {
              type: 'LinkRenderer',
              baseUrl: 'javascript',
              jsCallback: function (rowIndex, columnIndex, value, item) {              
              },
            },
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000002779'), 
            dataField: 'imprStepNm', 
            width: '10%', 
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000002055'), 
            dataField: 'imprRqstYmd', 
            width: '10%', 
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000002053'), 
            dataField: 'imprRqstDeptNm', 
            width: '10%', 
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000002676'), 
            dataField: 'actDeptNm', 
            width: '10%', 
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000002672'), 
            dataField: 'actUserNm', 
            width: '10%', 
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000002694'), 
            dataField: 'actConfirmYmd', 
            width: '10%', 
          },      
        ];

      }
      
      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000881'),
          btnClicked: 'btnClosePopup',
        },
      ]

      this.deptVendorGubunItems = [
        { code: 'd', codeNm: 'L0000001287' }, /* 부서 */
        { code: 'v', codeNm: 'L0000003246' }, /* 협력업체 */
      ];
    },
    // combo box list
    getComboItems(codeGroupCd) {
      this.$http.url = this.$format(
        selectConfig.codeMaster.getSelect.url,
        codeGroupCd
      );
      this.$http.type = 'GET';
      this.$http.request(
        _result => {
          _result.data.splice(0, 0, { code: '', codeNm: 'L0000002519' }); /* 전체 */
          if (codeGroupCd === 'SAF_IMPR_CLASS') this.comboImprClassItems = this.$_.clone(_result.data);
          else this.comboImprStepItems = this.$_.clone(_result.data);
        },
        _error => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    selectedRow(data) {
      if (data === null) return;
    },
    cellClickHandler(event) {
      if (event.dataField !== 'actResultContents' && event.dataField !== 'imprTitle') return;
      this.openDialogPage('DETAIL', event.item);
    },
    tableLinkimprTitleClicked(header, data) {
      this.openDialogPage('DETAIL', data);
    },
    getList() {
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = this.popupParam;
      this.$http.request(
        _result => {
          this.gridOptions.data = this.$_.clone(_result.data);
          this.YAuiGrid.setGridData(this.gridOptions.data);
        },
        _error => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    openDialogPage(flag, data) {
      if (data.imprStepCd === 'IMST2') flag = 'ACCEPT';
      else if (data.imprStepCd === 'IMST3') flag = 'IMPROVE';
      // else if (data.imprStepCd === 'IMST4') flag = 'CONFIRM';
      else flag = 'DETAIL';

      if (!this.editable) flag = 'DETAIL';

      flag = 'DETAIL';

      this.popupOptions.param = {
        safImprActNo: data.safImprActNo,
        imprClassCd: data.imprClassCd,
        flag: flag,
      };
      // IMST1 요청등록 , IMST2 접수, IMST3 조치부서조치중, IMST4 요청부서확인, IMST5 개선완료

      if (flag === 'ACCEPT') {
        this.popupOptions.target = () => import(`${'./actionAccept.vue'}`);
        this.popupOptions.title = 'L0000003545'; /* 개선조치부서 접수 및 확인 */
      } else {
        if (flag === 'IMPROVE') this.popupOptions.title = 'L0000000276'; /* 개선조치 */
        else if (flag === 'CONFIRM') this.popupOptions.title = 'L0000003546'; /* 개선조치요청 확인 */
        else this.popupOptions.title = 'L0000003560'; /* 상세정보 */

        this.popupOptions.target = () => import(`${'./improveDetail.vue'}`);
      }

      this.popupOptions.top = '10px';
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closePopup;
    },
    closePopup() {
      this.getList();

      this.popupOptions.target = null;
      this.popupOptions.visible = false;
    },
    /**
     * 사용자의 입력을 받는다.
     */
    getConfirm() {},
    /** button 관련 이벤트 **/
    btnSearchClickedCallback(_result) {
      this.getList();
    },
    btnClickedErrorCallback(_result) {
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    /** Button Event **/
    // 팝업 닫기
    btnClosePopup() {
      // 부모창에 값 전달
      this.$emit('closePopup', { success: true });
    },
    /** end button 관련 이벤트 **/
  },
};
</script>

<style>
</style>
