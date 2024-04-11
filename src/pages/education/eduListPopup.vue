<!--
  목적 : 교육 목록
  작성자 : kkc
  Detail : 교육 목록 조회
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <b-row ref="searchBox"></b-row>

    <!-- 교육 목록 결과 목록 grid -->
    <!-- <b-row class="mt-3">
      <b-col sm="12">
        <b-col sm="12" class="px-0">
          <div slot="buttonGroup" class="float-right mb-1">
             닫기 -
            <y-btn title="L0000000881" @btnClicked="closePopup('C')" />
          </div>
          <y-data-table
            :print="true"
            ref="dataTable"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            :use-paging="true"
            @tableLinkClicked="tableLinkClicked"
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
          :useExcelExport="false"
          :enableCellMerge="true"
          :enableSorting="true"
          :showGridSetSave="true"
          :useContextMenu="true"
          :enableRightDownFocus="true"
          :showGridCtrl="true"  
          @closePopup="closePopup('C')"
          @cellClick="cellClickHandler"
        />
      </b-col>
    </b-row>
    <y-dialog :param="popupOptions"></y-dialog>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
export default {
  /** attributes: name, components, props, data **/
  name: 'edu-status',
  props: {
    popupParam: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      gridOptions: {
        name: 'eduListPopup',
        btns: [],
        header: [],
        data: [],
        height: '490',
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
      searchUrl: '',
    };
  },
  /** Vue lifecycle: created, mounted, destroyed, etc **/
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;
  },
  beforeDestroy() {},
  /** methods **/
  methods: {
    /** 초기화 관련 함수 **/
    init() {
      this.editable = this.$route.meta.editable;
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001415'), 
          dataField: 'plantNm', 
          width: '10%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002779'), 
          dataField: 'processStepNm', 
          width: '10%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000428'), 
          dataField: 'bizApprStepNm', 
          width: '10%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000644'), 
          dataField: 'eduAttNm', 
          width: '10%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000659'), 
          dataField: 'eduClassNm', 
          width: '10%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000633'), 
          dataField: 'eduCourseNm', 
          width: '10%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000639'), 
          dataField: 'eduTypeNm', 
          width: '10%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000653'), 
          dataField: 'eduNm', 
          width: '20%', 
          style: 'left-align',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {              
            },
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000641'), 
          dataField: 'eduYmd', 
          width: '10%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000155'), 
          dataField: 'qrCode', 
          width: '10%', 
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {              
            },
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000672'), 
          dataField: 'eduLocation', 
          width: '10%', 
          style: 'left-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000890'), 
          dataField: 'deptNm', 
          width: '10%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000892'), 
          dataField: 'deptNm', 
          width: '10%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000926'), 
          children: [
            {
              headerText: this.$comm.getLangSpecInfoLabel('L0000000934'), 
              dataField: 'totalUserNum', 
              width: '10%', 
            },
            {
              headerText: this.$comm.getLangSpecInfoLabel('L0000001354'), 
              dataField: 'failUserNum', 
              width: '10%', 
            },
            {
              headerText: this.$comm.getLangSpecInfoLabel('L0000002622'), 
              dataField: 'exceptUserNum', 
              width: '10%', 
            },
            {
              headerText: this.$comm.getLangSpecInfoLabel('L0000002214'), 
              dataField: 'passUserNum', 
              width: '10%', 
            },          
          ],
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002215'), 
          dataField: 'passOutUserNum', 
          width: '10%', 
        },         
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002216'), 
          dataField: 'totPassUserNum', 
          width: '10%', 
        },  
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001806'), 
          dataField: 'eduTime', 
          width: '10%', 
        },  
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002468'), 
          dataField: 'reEduPerson', 
          width: '10%', 
        },  
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002466'), 
          dataField: 'reEduAbsentPerson', 
          width: '10%', 
        },         
      ];

      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000881'), 
          btnClicked: 'closePopup'
        },
      ]
      this.searchUrl = selectConfig.saf.education.eduStatus.list.url;

      this.getList();
    },
    getList() {
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = this.popupParam;
      this.$http.request(
        _result => {
          // this.gridOptions.data = this.$_.clone(_result.data);
          this.YAuiGrid.setGridData(this.$_.clone(_result.data));
        },
        _error => {
          window.getApp.$emit(
            'APP_REQUEST_ERROR',
            'M0000000016' /* 작업 중 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요. */
          );
        }
      );
    },
    closePopup(data) {
      this.$emit('closePopup');
    },
    btnClickedErrorCallback(_result) {
      window.getApp.$emit(
        'APP_REQUEST_ERROR',
        'M0000000016' /* 작업 중 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요. */
      );
    },
    btnPopupClickedCallback() {
      this.popupOptions.target = () => import(`${'./eduPlan.vue'}`);
      this.popupOptions.title = 'L0000000629'; /* 교육계획 등록/수정 */
      this.popupOptions.visible = true;
      this.popupOptions.width = '80%';
      this.popupOptions.top = '10px';
      this.popupOptions.param = {
        safEduMstNo: 0,
      };
      this.popupOptions.closeCallback = this.closePopup2;
    },
    cellClickHandler(event) {
      if (event.dataField === 'qrCode') {
        this.popupOptions.target = () => import(`${'./eduResultQrcode.vue'}`);
        this.popupOptions.title = 'L0000000155'; /* 교육결과 QR코드 */
        this.popupOptions.visible = true;
        this.popupOptions.width = '100%';
        this.popupOptions.top = '10px';
        this.popupOptions.param = event.item;
        this.popupOptions.closeCallback = this.closePopup2;
      } else if (event.dataField === 'eduNm') {
        // 진행상태에 관한 테이블 컬럼 추가 및 코드값 필요 (프로토타입 용이므로 변경 필요함...)
        if (event.item.processStepCd === 'SES01') {
          this.popupOptions.target = () => import(`${'./eduPlanPopup.vue'}`);
          this.popupOptions.title = 'L0000000629'; /* 교육계획 등록/수정 */
          this.popupOptions.visible = true;
          this.popupOptions.width = '80%';
          this.popupOptions.top = '10px';
          this.popupOptions.param = event.item;
          this.popupOptions.closeCallback = this.closePopup2;
        } else {
          this.popupOptions.target = () => import(`${'./eduResultPopup.vue'}`);
          this.popupOptions.title = 'L0000000626'; /* 교육결과 등록/수정 */
          this.popupOptions.visible = true;
          this.popupOptions.width = '80%';
          this.popupOptions.top = '10px';
          this.popupOptions.param = event.item;
          this.popupOptions.closeCallback = this.closePopup2;
        }
      }
    },
    tableLinkClicked(header, data) {
      if (data === null) return;

      if (header.name === 'qrCode') {
        this.popupOptions.target = () => import(`${'./eduResultQrcode.vue'}`);
        this.popupOptions.title = 'L0000000155'; /* 교육결과 QR코드 */
        this.popupOptions.visible = true;
        this.popupOptions.width = '100%';
        this.popupOptions.top = '10px';
        this.popupOptions.param = data;
        this.popupOptions.closeCallback = this.closePopup2;
      } else {
        // 진행상태에 관한 테이블 컬럼 추가 및 코드값 필요 (프로토타입 용이므로 변경 필요함...)
        if (data.processStepCd === 'SES01') {
          this.popupOptions.target = () => import(`${'./eduPlanPopup.vue'}`);
          this.popupOptions.title = 'L0000000629'; /* 교육계획 등록/수정 */
          this.popupOptions.visible = true;
          this.popupOptions.width = '80%';
          this.popupOptions.top = '10px';
          this.popupOptions.param = data;
          this.popupOptions.closeCallback = this.closePopup2;
        } else {
          this.popupOptions.target = () => import(`${'./eduResultPopup.vue'}`);
          this.popupOptions.title = 'L0000000626'; /* 교육결과 등록/수정 */
          this.popupOptions.visible = true;
          this.popupOptions.width = '80%';
          this.popupOptions.top = '10px';
          this.popupOptions.param = data;
          this.popupOptions.closeCallback = this.closePopup2;
        }
      }
    },
    closePopup2(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
    },
  },
  closePopup(data) {
    this.$emit('closePopup', { data, gubun: this.popupParam.gubun });
  },
};
</script>
