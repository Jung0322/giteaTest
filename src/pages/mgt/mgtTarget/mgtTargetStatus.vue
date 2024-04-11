<!--
  목적 : 경영 > SHE KPI > SHE목표달성 현황 > SHE목표달성 현황
  작성자 : mjpark
  Detail : SHE목표달성 현황 조회
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <y-search-box v-if="!this.popupParam.popupMode" :gridOptions="gridOptions" @enter="getList">
      <b-row slot="search">
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <!-- 대상년월 -->
          <y-datepicker
            :width="8"
            :range="true"
            type="year"
            label="L0000000767"
            name="actYear"
            :default="actYear"
            v-model="actYear"
          />
        </b-col>
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <y-plant
            v-if="
              this.searchParam.areaType === 'plant' ||
              this.searchParam.areaType === 'dept'
            "
            type="search"
            name="plantCd"
            :editable="plantEditable"
            v-model="searchParam.plantCd"
          />
        </b-col>
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <!-- 부서 -->
          <y-tree-dept
            v-if="this.searchParam.areaType === 'dept'"
            type="search"
            label="L0000001287"
            name="deptCd"
            :editable="deptEditable"
            :plantCd="searchParam.plantCd"
            v-model="searchParam.deptCd"
          />
        </b-col>
      </b-row>
      <b-row slot="search">
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <!-- 분야 -->
          <y-select
            :width="8"
            :comboItems="bizFieldCdSearchItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            label="L0000001346"
            name="bizFieldCd"
            v-model="searchParam.bizFieldCd"
          ></y-select>
        </b-col>
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <!-- 항목명 -->
          <y-text
            :width="8"
            ui="bootstrap"
            label="L0000003199"
            name="bizFieldItemNm"
            v-model="searchParam.bizFieldItemNm"
          />
        </b-col>
      </b-row>
    </y-search-box>

    <!-- 검색 결과 테이블 -->
    <!-- <b-row class="mt-3">
      <b-col sm="12">
        <b-col sm="12" class="px-0">
          <div slot="buttonGroup" class="float-right mb-1">
             검색 
            <y-btn
              v-if="!this.popupParam.popupMode"
              title="L0000000327"
              color="green"
              @btnClicked="btnSearchClickedCallback"
            />
             닫기 
            <y-btn v-if="this.popupParam.popupMode" title="L0000000881" @btnClicked="closePopup('CLOSE')" />
          </div>
           목표달성 목록 
          <y-data-table
            label="L0000005105"
            ref="dataTable"
            class="mergeTable"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            :span-options="gridOptions.merge"
            :rowClassName="rowClassName"
            :use-paging="false"
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
          :label="this.$comm.getLangSpecInfoLabel('L0000005105')"
          :useExcelExport="false"
          :enableSorting="true"
          :showGridSetSave="true"
          :useContextMenu="true"
          :enableRightDownFocus="true"
          :showGridCtrl="true"
          :enableCellMerge="true"
          :cellMergeRowSpan="true"
          @getList="getList"
          @closePopup="closePopup"
        />
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
export default {
  /* attributes: name, components, props, data */
  name: 'mgt-target-status',
  props: {
    popupParam: {
      type: Object,
      default: () => {
        return {        
          areaType: null,  
          from: '',
          to: '',
          plantCd: null,
          deptCd: null,
          bizFieldCd: null,
          bizFieldItemNm: null,
          popupMode: false,
        };
      },
    },
  },
  data() {
    return {
      searchParam: {
        from: '',
        to: '',
        plantCd: '', // 사업장
        deptCd: '', // 부서
        bizFieldCd: null, // 분야
        bizFieldItemNm: '', // 항목
        areaType: null,
      },
      gridOptions: {
        name: 'mgtTargetStatus',
        header: [],
        data: [],
        merge: [],
        height: '600',
      },
      YAuigrid: null,
      bizFieldCdSearchItems: [], // 분야 리스트 (검색)
      actYear: [], // 대상년
      editable: true,
      hPlant: false, // 사업장 컬럼 숨김여부
      hDept: false, // 부서 컬럼 숨김여부
      valCol: 6,
      plantEditable: false,
      deptEditable: false,
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
    this.YAuiGrid = this.$refs.yAuiGrid;
  },
  beforeDestroy() {},
  //* methods */
  methods: {
    init() {
      this.searchParam.areaType = this.$route.meta.param;
      this.searchUrl = selectConfig.mgt.mgtTarget.mgtTargetStatus.list.url;
      this.editable = this.$route.meta.editable;

      // 기간 Setting
      var today = this.$comm.getToday();
      var from = this.$comm.getCalculatedDate(
        this.$comm.getPrevYear(),
        '0y',
        'YYYY',
        'YYYY'
      );
      var to = this.$comm.getCalculatedDate(
        this.$comm.getPrevYear(),
        '0y',
        'YYYY',
        'YYYY'
      );
      this.actYear = [from, to];

      this.getComboItems('MGT_BIZ_FIELD'); // SHE 분야

      // 권한별 컨트롤 처리
      if (this.$comm.isCompanyGrp()) {
        // 전사권한
        this.searchParam.plantCd = '';
        this.searchParam.deptCd = '';
        this.plantEditable = true;
        this.deptEditable = true;
      } else if (this.$comm.isPlantGrp()) {
        // 사업장권한
        if (
          this.searchParam.areaType === 'plant' ||
          this.searchParam.areaType === 'dept'
        ) {
          this.searchParam.plantCd = this.$store.getters.plantCd;
        } else {
          this.searchParam.plantCd = '';
        }
        this.searchParam.deptCd = '';
        this.plantEditable = true;
        this.deptEditable = true;
      } // 일반권한
      else {
        if (this.searchParam.areaType === 'dept') {
          this.searchParam.plantCd = this.$store.getters.plantCd;
          this.searchParam.deptCd = this.$store.getters.deptCd;
        } else {
          this.searchParam.plantCd = '';
          this.searchParam.deptCd = '';
        }
        this.deptEditable = true;
      }

      this.gridOptions.merge = [];
      this.gridOptions.merge.push({ index: 1, field: 'year' });

      if (this.searchParam.areaType === 'plant') {
        this.hDept = true;
        this.valCol -= 1;

        this.gridOptions.merge.push({ index: 2, field: 'plantNm' });
        this.gridOptions.merge.push({ index: 3, field: 'bizFieldNm' });
        this.gridOptions.merge.push({ index: 4, field: 'bizFieldItemNm' });
      } else if (this.searchParam.areaType === 'dept') {
        this.hPlant = false;
        this.hDept = false;

        this.gridOptions.merge.push({ index: 2, field: 'plantNm' });
        this.gridOptions.merge.push({ index: 3, field: 'deptNm' });
        this.gridOptions.merge.push({ index: 4, field: 'bizFieldNm' });
        this.gridOptions.merge.push({ index: 5, field: 'bizFieldItemNm' });
      } else {
        this.hPlant = true;
        this.hDept = true;
        this.valCol -= 2;

        this.gridOptions.merge.push({ index: 2, field: 'bizFieldNm' });
        this.gridOptions.merge.push({ index: 3, field: 'bizFieldItemNm' });
      }

      this.gridOptions.header = [];
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000829'), 
          dataField: 'year', 
          width: '110', 
          cellMerge: true,
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001415'), 
          dataField: 'plantNm', 
          width: '110', 
          cellMerge: true,
          hidden: this.hPlant,
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001287'), 
          dataField: 'deptNm', 
          width: '110', 
          cellMerge: true,
          hidden: this.hDept,
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001346'), 
          dataField: 'bizFieldNm', 
          width: '110', 
          cellMerge: true,
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003199'), 
          dataField: 'bizFieldItemNm', 
          width: '110', 
        },
      ];

      for (let i = 1; i < 13; i++) {
        let month = i.toString();
        this.gridOptions.header.splice(i + this.valCol, 0, {
          width: '600px',
          headerText: this.$comm.getLangSpecInfoLabel('L0000003663', { s1: i }), // {s1}월
          children: [
            {
              headerText: this.$comm.getLangSpecInfoLabel('L0000000466'), 
              dataField: 'm' + month + 'TargetVal',
              width: '110', 
              style: 'right-align'
            },
            {
              headerText: this.$comm.getLangSpecInfoLabel('L0000001810'), 
              dataField: 'm' + month + 'RsltVal',
              width: '110', 
              style: 'right-align'
            },
            {
              headerText: this.$comm.getLangSpecInfoLabel('L0000003044'), 
              dataField: 'm' + month + 'EvalVal',
              width: '110', 
              style: 'right-align'
            },
          ],
        });
      }
      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000881'),
          btnClicked: 'closePopup',
          visible: this.popupParam.popupMode
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000327'),
          color: 'green',
          btnClicked: 'getList',
        },
      ]

      /* 쿠키에 저장된 검색 조건이 있을 경우 최초 페이지 진입시 자동 설정 */
      var searchParamByCookie = this.$comm.setSearchParamByCookie();
      if (typeof searchParamByCookie !== 'undefined') {
        this.searchParam = searchParamByCookie;
        this.actYear = [this.searchParam.from, this.searchParam.to];
      }

      if (this.popupParam.popupMode) {
        this.searchParam.areaType = this.popupParam.areaType;
        this.searchParam.from = this.popupParam.year;
        this.searchParam.to = this.popupParam.year;
        this.actYear = [this.searchParam.from, this.searchParam.to];
        this.searchParam.plantCd = this.popupParam.plantCd;
        this.searchParam.deptCd = this.popupParam.deptCd;
        this.searchParam.bizFieldCd = this.popupParam.bizFieldCd;
        this.searchParam.bizFieldItemNm = this.popupParam.bizFieldItemNm;
      }

      this.getList();
    },
    rowClassName({ row, rowIndex }) {
      return 'odd-row';
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
    // 검색
    btnSearchClickedCallback() {
      this.getList();
    },
    /**
     * 공통 마스터 정보 조회 (분야)
     * codeGroupCd : 마스터 테이블 codeGroupCd 정보
     */
    getComboItems(codeGroupCd) {
      this.$http.url = this.$format(
        selectConfig.codeMaster.getSelect.url,
        codeGroupCd
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          if (codeGroupCd === 'MGT_BIZ_FIELD') {
            this.bizFieldCdSearchItems = this.$_.clone(_result.data);
            this.bizFieldCdSearchItems.splice(0, 0, {
              code: null,
              codeNm:
                this.$comm.getLangSpecInfoLabel('L0000002519') /* '전체' */,
            });
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    // 검색
    getList() {
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.searchParam.from = this.actYear[0];
      this.searchParam.to = this.actYear[1];
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
    closePopup(data) {
      this.$emit('closePopup', data);
    },
  },
};
</script>
