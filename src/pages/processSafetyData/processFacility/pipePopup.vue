<!--
  목적 : 공정시설정보 - 배관 및 개스킷(입력 popup)
  작성자 : kdh
  Detail :
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <b-row>
      <b-col sm="12">
        <b-col sm="12" class="px-0" id="pipeDetailTable">
          <!-- 배관 및 개스킷 분류코드별 목록 -->
          <y-auigrid
            ref="yAuiGrid"
            :name="gridOptions.name"
            :headers="gridOptions.header"
            :btns="gridOptions.btns"
            :label="this.$comm.getLangSpecInfoLabel('L0000001132')"
            :showRowCheckColumn="editable&&!popupParam.search"
            :useExcelExport="false"
            :enableCellMerge="true"
            :cellMergeRowSpan="true"
            @selectedRow="selectedRow"
            @btnDeletePipe="btnDeletePipe"
            @btnClose="closePopup"
          />
        </b-col>
      </b-col>
    </b-row>

    <!-- 탭 -->
    <b-row class="mt-3"></b-row>
    <el-tabs type="border-card" v-model="tabIndex">
      <el-tab-pane v-for="(item, i) in tabItems" :key="i" stretch class="default-tab-pane">
        <span slot="label">
          <i class="el-icon-date"></i>
          {{ item.title }}
        </span>
      </el-tab-pane>
      <keep-alive>
        <component
          :is="component"
          v-if="component"
          :tabParam.sync="pipe"
          :editCheck="popupParam.editCheck"
          :search="popupParam.search"
          @getList="getList"
          @reset="reset"
        />
      </keep-alive>
    </el-tabs>

    <b-row>
      <b-col sm="12">
        <div class="float-right mt-2">
          <y-btn title="L0000000881" size="mini" @btnClicked="closePopup" /> <!-- 닫기 -->
        </div>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
export default {
  name: 'pipe-popup',
  props: {
    popupParam: {
      type: Object,
      default: () => ({
        pipeCd: '',
        // title: '',
        plantCd: '',
        processCd: '',
        editCheck: false,
        search: false,
      }),
    },
  },
  data() {
    return {
      pipe: {
        pipeNo: 0,
        pipeCd: '',
        pipeNm: '',
        planPress: '',
        planTemp: '',
        pipeMat: '',
        gasketMat: '',
        nondestructMethod: '',
        nondestructPer: '',
        aftHeatTreatYn: 'N',
        plantCd: null,
        processCd: null,

        chngNum: '',
        chngNo: 0,
        createUserId: '',
        tabItems: [],
        // chemprods: [],
      },
      // tabItems: [
      //   // { title: this.$comm.getLangSpecInfoLabel('L0000001133'), url: './pipeTab' }, // 배관 및 개스킷 상세
      //   // { title: this.$comm.getLangSpecInfoLabel('L0000003285'), url: 'pipeChemprod' }, // 화학물질
      //   { title: 'L0000001133', url: './pipeTab' }, // 배관 및 개스킷 상세  this.$comm.getLangSpecInfoLabel('L0000001133') {{$comm.getLangSpecInfoLabel('L0000001133')}}
      //   { title: 'L0000003285', url: 'pipeChemprod' }, // 화학물질  this.$comm.getLangSpecInfoLabel('L0000003285') {{$comm.getLangSpecInfoLabel('L0000003285')}}
      // ],
      component: null,
      tabIndex: 0,

      YAuiGrid: null,
      gridOptions: {
        header: [],
        data: [],
        height: '210',
      },
      gridOptionsX: {
        header: [],
        merge: [],
      },
      editable: false,
      searchUrl: '',
      searchDetailUrl: '',
    };
  },
  watch: {
    tabIndex() {
      this.loadComponent();
    },
  },
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;
    this.loadComponent();
    this.getList();
  },
  beforeDestroy() {},
  methods: {
    init() {
      this.tabItems = [
        // { title: this.$comm.getLangSpecInfoLabel('L0000001133'), url: './pipeTab' }, // 배관 및 개스킷 상세
        // { title: this.$comm.getLangSpecInfoLabel('L0000003285'), url: 'pipeChemprod' }, // 화학물질
        { title: this.$comm.getLangSpecInfoLabel('L0000001133'), url: './pipeTab' }, // 배관 및 개스킷 상세
        { title: this.$comm.getLangSpecInfoLabel('L0000003285'), url: 'pipeChemprod' }, // 화학물질
      ]
      
      // URL 셋팅
      this.searchUrl = selectConfig.psm.processFacility.pipe.list.url;
      this.searchDetailUrl = selectConfig.psm.processFacility.pipe.get.url;
      this.deleteUrl = transactionConfig.psm.processFacility.pipe.delete.url;

      this.editable = this.$route.meta.editable;

      // 설비 grid 헤더 설정
      this.gridOptions.header = [
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000001415'), 
          dataField: 'plantNm', 
          width: '90', 
          cellMerge: true,
          mergeRef: "pipeCd",
          mergePolicy: "restrict"
        }, // 사업장 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000000515'), 
          dataField: 'processNm', 
          width: '150', 
          cellMerge: true,
          mergeRef: "pipeCd",
          mergePolicy: "restrict"
        }, // 공정 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000001342'), 
          dataField: 'pipeCd', 
          width: '120', 
          cellMerge: true,
        }, // 분류코드 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000004305'), 
          dataField: 'pipeNm', 
          width: '170', 
          style: 'left-align', 
        }, // 유체의 명칭 또는 구분 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000001574'), 
          dataField: 'planPress', 
          width: '160', 
          style: 'right-align', 
        }, // 설계압력(Mpa) 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000001575'), 
          dataField: 'planTemp', 
          width: '140', 
          style: 'right-align', 
        }, // 설계온도(℃) 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000001134'), 
          dataField: 'pipeMat', 
          width: '140', 
          style: 'left-align', 
        }, // 배관재질 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000000288'), 
          dataField: 'gasketMat', 
          width: '300', 
          style: 'left-align', 
        }, // 개스킷 재질 및 형태 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000001376'), 
          dataField: 'nondestructPer', 
          width: '160', 
          style: 'left-align', 
        }, // 비파괴검사율 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000003369'), 
          dataField: 'aftHeatTreatYnNm', 
          width: '100', 
        }, // 후열처리여부 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000001360'), 
          dataField: 'nondestructMethod', 
          width: '180', 
          style: 'left-align', 
        }, // 비파괴 검사법 > 비고 명칭변경 
      ];
      this.gridOptions.btns = [
        { 
          title: this.$comm.getLangSpecInfoLabel('L0000001495'), 
          color: 'red', 
          btnClicked: 'btnDeletePipe',
          btnClickedError: 'btnClickedError',
          visible: this.editable && !this.popupParam.search,
        },  // 삭제
        { 
          title: this.$comm.getLangSpecInfoLabel('L0000000881'), 
          btnClicked: 'btnClose',
        },  // 닫기
      ]; 
            
      this.gridOptionsX.header = [
        { text: 'L0000001415', name: 'plantNm', width: '120px', align: 'center' }, // 사업장
        { text: 'L0000000515', name: 'processNm', width: '120px', align: 'center' }, // 공정
        { text: 'L0000001342', name: 'pipeCd', width: '120px', align: 'center' }, // 분류코드
        {
          text: 'L0000004305', // 유체의 명칭 또는 구분
          name: 'pipeNm',
          width: '170px',
          align: 'left',
        },
        {
          text: 'L0000001574', // 설계압력(Mpa)
          name: 'planPress',
          width: '160px',
          align: 'right',
        },
        {
          text: 'L0000001575', // 설계온도(℃)
          name: 'planTemp',
          width: '140px',
          align: 'right',
        },
        { text: 'L0000001134', name: 'pipeMat', width: '140px', align: 'left' }, // 배관재질
        {
          text: 'L0000000288', // 개스킷 재질 및 형태
          name: 'gasketMat',
          width: '300px',
          align: 'left',
        },
        {
          text: 'L0000001376', // 비파괴검사율
          name: 'nondestructPer',
          width: '160px',
          align: 'left',
        },
        {
          text: 'L0000003369', // 후열처리여부
          name: 'aftHeatTreatYnNm',
          width: '160px',
          align: 'center',
        },
        // 비파괴 검사법 > 비고 명칭변경
        {
          text: 'L0000001360', // 비고
          name: 'nondestructMethod',
          width: '180px',
          align: 'left',
        },
      ];

      if (this.popupParam.pipeCd !== '' && this.popupParam.pipeCd !== null) {
        this.pipe.plantCd = this.popupParam.plantCd;
        this.pipe.processCd = this.popupParam.processCd;
        this.pipe.pipeCd = this.popupParam.pipeCd;
      }

      this.gridOptionsX.merge = [];
      var i = 1;
      for (; i < 4; i++) {
        this.gridOptionsX.merge.push({ index: i, field: 'pipeCd' });
      }
    },
    selectCheck() {
      if (!this.editable) return false;
      else return true;
    },
    loadComponent() {
      // this.facilityChemprod = () => import('@/pages/common/chemProd/facilityChemprod');

      var path = this.tabItems[this.tabIndex].url;

      if (path === 'pipeChemprod') {
        this.component = () => import('@/pages/common/chemProd/pipeChemprod');
      } else this.component = () => import(`${path}`);
    },
    getList() {
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = {
        pipeCd: this.popupParam.pipeCd,
      };
      this.$http.request(
        _result => {
          if (_result.data) this.gridOptions.data = _result.data;

          this.YAuiGrid.setGridData(_result.data);
        },
        _error => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    selectedRow(data) {
      console.log('-----------', data);
      if (data === null) return;

      this.$http.url = this.$format(
        this.searchDetailUrl,
        data.pipeNo,
        data.pipeCd
      );
      this.$http.type = 'GET';
      this.$http.request(
        _result => {
          if (_result.data) {
            this.pipe = this.$_.clone(_result.data);
            this.updateMode = true;
          }
        },
        _error => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    /**
     *  팝업 안 보이도록 closePopup emit
     *  팝업 close
     * data : 팝업창에서 return하는 데이터
     */
    closePopup(data) {
      this.$emit('closePopup', {});
    },
    reset() {
      var tempData = this.$_.clone(this.pipe);
      Object.assign(this.$data.pipe, this.$options.data().pipe);
      if (this.popupParam.editCheck) {
        this.pipe.plantCd = tempData.plantCd;
        this.pipe.processCd = tempData.processCd;
        this.pipe.pipeCd = tempData.pipeCd;
      }
    },
    btnDeletePipe() {
      const selectedRows = this.YAuiGrid.getCheckedRowItemsAll();
      if (selectedRows.length === 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // '안내',
          message: 'M0000000911', // 삭제 할 데이터를 선택하세요.
          type: 'warning',
        });
        return;
      } else {
        window.getApp.$emit('CONFIRM', {
          title: 'L0000003321', // '확인',
          message: 'M0000000012', // 삭제하시겠습니까?
          type: 'info',
          // 확인 callback 함수
          confirmCallback: () => {
            this.$http.url = this.deleteUrl;
            this.$http.type = 'DELETE';
            this.$http.param = {
              data: Object.values(this.$_.clone(selectedRows)),
            };
            this.$http.request(
              _result => {
                window.getApp.$emit('ALERT', {
                  title: 'L0000003395', // '안내',
                  message: 'M0000000007', // 삭제되었습니다.
                  type: 'success',
                });
                this.getList();
              },
              _error => {
                window.getApp.$emit('APP_REQUEST_ERROR', _error);
              }
            );
          },
          // 취소 callback 함수
          cancelCallback: () => {},
        });
      }
    },
  },
};
</script>
<style>
#pipeDetailTable .cell span {
  white-space: pre-line;
}
</style>