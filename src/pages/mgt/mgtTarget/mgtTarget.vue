<!--
  목적 : 경영 > 목표관리 > 실적/평가 관리
  작성자 : mjpark
  Detail : 실적/평가 관리 목록 조회
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <y-search-box :gridOptions="gridOptions" @enter="getList">
      <b-row slot="search">
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <!-- 대상년월 -->
          <y-datepicker
            :width="8"
            :range="true"
            type="month"
            label="L0000004446"
            name="actMonth"
            :default="actMonth"
            v-model="actMonth"
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
        <b-col sm="4" md="4" lg="4" xl="" class="col-xxl-3">
          <y-select
            :width="8"
            :comboItems="unregisteredItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            label="L0000004966"
            name="unregistered"
            v-model="searchParam.unregistered"
          />
        </b-col>
      </b-row>
    </y-search-box>

    <!-- 검색 결과 테이블 -->
    <!-- <b-row class="mt-3">
      <b-col sm="12">
        <b-col sm="12" class="px-0">
          <div slot="buttonGroup" class="float-right mb-1">
             실적 일괄결재요청 
            <y-btn
              v-if="
                editable &&
                ((companyEditable && this.searchParam.areaType === 'company') ||
                  (plantEditable && this.searchParam.areaType === 'plant') ||
                  (deptEditable && this.searchParam.areaType === 'dept'))
              "
              title="L0000004969"
              color="black"
              @btnClicked="btnRsltAppr"
            />
             평가 일괄결재요청 
            <y-btn
              v-if="
                editable &&
                ((companyEditable && this.searchParam.areaType === 'company') ||
                  (plantEditable && this.searchParam.areaType === 'plant') ||
                  (deptEditable && this.searchParam.areaType === 'dept'))
              "
              title="L0000004970"
              color="black"
              @btnClicked="btnEvalAppr"
            />
             검색 
            <y-btn
              title="L0000000327"
              color="green"
              @btnClicked="btnSearchClickedCallback"
            />
          </div>
           실적/평가 목록 
          <y-data-table
            class="mergeTable"
            label="L0000004968"
            ref="dataTable"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            :span-options="gridOptions.merge"
            :use-paging="false"
            :rowClassName="tableRowClassName"
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
          :label="this.$comm.getLangSpecInfoLabel('L0000004968')"
          :useExcelExport="false"
          :enableSorting="true"
          :showGridSetSave="true"
          :useContextMenu="true"
          :enableRightDownFocus="true"
          :showGridCtrl="true"
          :enableCellMerge="true"
          :cellMergeRowSpan="true"
          @cellClick="cellClickHandler"
          @getList="getList"
          @btnRsltAppr="btnRsltAppr"
          @btnEvalAppr="btnEvalAppr"
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
  name: 'mgt-target',
  props: {},
  data() {
    return {
      searchParam: {
        from: '',
        to: '',
        plantCd: '', // 사업장
        deptCd: '', // 부서
        bizFieldCd: null, // 분야
        bizFieldItemNm: '', // 항목
        unregistered: '', // 미등록건
        areaType: null, // 전사/사업장/일반 구분
      },
      gridOptions: {
        name: 'mgtTarget',
        header: [],
        data: [],
        btns: [],
        merge: [],
        height: '500',
      },
      YAuigrid: null,
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '80%',
        top: '10px',
        height: '1000px',
        param: {},
        closeCallback: null,
      },
      bizFieldCdSearchItems: [], // 분야 리스트 (검색)
      unregisteredItems: [],
      actMonth: [], // 대상년월
      editable: true,
      hPlant: false, // 사업장 컬럼 숨김여부
      hDept: false, // 부서 컬럼 숨김여부
      companyEditable: false, // 전사 권한
      plantEditable: false, // 사업장 권한
      deptEditable: false, // 일반 권한
      mgtTargetMonthNos: '',
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
    tableRowClassName({ row, rowIndex }) {
      return 'odd-row';
    },
    init() {
      // 기간 Setting
      var today = this.$comm.getToday();
      var from = this.$comm.getCalculatedDate(
        this.$comm.getPrevYear(),
        '0m',
        'YYYY-MM',
        'YYYY-MM'
      );
      var to = this.$comm.getCalculatedDate(
        this.$comm.getPrevYear(),
        '11m',
        'YYYY-MM',
        'YYYY-MM'
      );
      this.actMonth = [from, to];

      this.getComboItems('MGT_BIZ_FIELD'); // SHE 분야
      this.getComboItems('MGT_TGT_STEP'); // 미등록건

      /* 쿠키에 저장된 검색 조건이 있을 경우 최초 페이지 진입시 자동 설정 */
      var searchParamByCookie = this.$comm.setSearchParamByCookie();
      if (typeof searchParamByCookie !== 'undefined') {
        this.searchParam = searchParamByCookie;
        this.actMonth = [this.searchParam.from, this.searchParam.to];
      }

      this.searchParam.areaType = this.$route.meta.param;
      this.searchUrl = selectConfig.mgt.mgtTarget.mgtTarget.list.url;
      this.editable = this.$route.meta.editable;

      // 권한별 컨트롤 처리
      if (this.$comm.isCompanyGrp()) {
        // 전사권한
        this.searchParam.plantCd = null;
        this.searchParam.deptCd = null;
        this.companyEditable = true;
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
          this.searchParam.plantCd = null;
        }
        this.searchParam.deptCd = null;
        this.plantEditable = true;
        this.deptEditable = true;
      } // 일반권한
      else {
        if (this.searchParam.areaType === 'dept') {
          this.searchParam.plantCd = this.$store.getters.plantCd;
          this.searchParam.deptCd = this.$store.getters.deptCd;
        } else {
          this.searchParam.plantCd = null;
          this.searchParam.deptCd = null;
        }
        this.deptEditable = true;
      }

      this.gridOptions.merge = [];
      this.gridOptions.merge.push({ index: 1, field: 'year' });
      this.gridOptions.merge.push({ index: 2, field: 'target' });
      this.gridOptions.merge.push({ index: 3, field: 'policy' });

      if (this.searchParam.areaType === 'plant') {
        this.hDept = true;

        this.gridOptions.merge.push({ index: 4, field: 'plantNm' });
        this.gridOptions.merge.push({ index: 5, field: 'month' });
        this.gridOptions.merge.push({ index: 6, field: 'bizFieldNm' });
        this.gridOptions.merge.push({ index: 11, field: 'month' });
        this.gridOptions.merge.push({ index: 12, field: 'month' });
        this.gridOptions.merge.push({ index: 13, field: 'month' });
      } else if (this.searchParam.areaType === 'dept') {
        this.hPlant = false;
        this.hDept = false;

        this.gridOptions.merge.push({ index: 4, field: 'plantNm' });
        this.gridOptions.merge.push({ index: 5, field: 'deptNm' });
        this.gridOptions.merge.push({ index: 6, field: 'month' });
        this.gridOptions.merge.push({ index: 7, field: 'bizFieldNm' });
        this.gridOptions.merge.push({ index: 12, field: 'month' });
        this.gridOptions.merge.push({ index: 13, field: 'month' });
        this.gridOptions.merge.push({ index: 14, field: 'month' });
      } else {
        this.hPlant = true;
        this.hDept = true;

        this.gridOptions.merge.push({ index: 4, field: 'month' });
        this.gridOptions.merge.push({ index: 5, field: 'bizFieldNm' });
        this.gridOptions.merge.push({ index: 10, field: 'month' });
        this.gridOptions.merge.push({ index: 11, field: 'month' });
        this.gridOptions.merge.push({ index: 12, field: 'month' });
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
          headerText: this.$comm.getLangSpecInfoLabel('L0000003774'),
          dataField: 'target',
          width: '110',
          cellMerge: true,
          style: 'left-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000005049'),
          dataField: 'policy',
          width: '110',
          cellMerge: true,
          style: 'left-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001415'),
          dataField: 'plantNm',
          width: '110',
          visible: !this.hPlant,
          cellMerge: true,
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001287'),
          dataField: 'deptNm',
          width: '110',
          visible: !this.hDept,
          cellMerge: true,
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002108'),
          dataField: 'month',
          width: '110',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {},
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001346'),
          dataField: 'bizFieldNm',
          width: '110',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003199'),
          dataField: 'bizFieldItemNm',
          width: '110',
          style: 'left-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003774'),
          dataField: 'targetVal',
          width: '110',
          style: 'right-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001810'),
          dataField: 'rsltVal',
          width: '110',
          style: 'right-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003044'),
          dataField: 'evalVal',
          width: '110',
          style: 'right-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004972'),
          dataField: 'stepNm',
          width: '110',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {},
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002355'),
          dataField: 'createUserNm',
          width: '110',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002352'),
          dataField: 'createDt',
          width: '110',
        },
      ];
      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000004969'),
          color: 'black',
          btnClicked: 'btnRsltAppr',
          visible:
            this.searchParam.areaType === 'company' ||
            this.searchParam.areaType === 'plant' ||
            this.searchParam.areaType === 'dept',
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000004970'),
          color: 'black',
          btnClicked: 'btnEvalAppr',
          visible:
            this.searchParam.areaType === 'company' ||
            this.searchParam.areaType === 'plant' ||
            this.searchParam.areaType === 'dept',
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000327'),
          color: 'green',
          btnClicked: 'getList',
        },
      ];
      this.getList();
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
    resizeGrid() {
      let _height = window.innerHeight - 350;
      if (window.innerHeight < 500) {
        _height = 250;
      }

      this.YAuiGrid.resize(null, _height);
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
          if (codeGroupCd === 'MGT_TGT_STEP') {
            this.unregisteredItems = this.$_.clone(_result.data);
            this.unregisteredItems.splice(0, 0, {
              code: null,
              codeNm:
                this.$comm.getLangSpecInfoLabel('L0000003394') /* '전체' */,
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
      this.searchParam.from = this.actMonth[0];
      this.searchParam.to = this.actMonth[1];
      this.$http.param = this.searchParam;

      this.$http.request(
        (_result) => {
          if (this.searchParam.areaType === 'dept') {
            // 부서 화면
            if (this.companyEditable) {
              // 전사권한 : 전체 건
              // this.gridOptions.data = this.$_.clone(_result.data);
              this.YAuiGrid.setGridData(this.$_.clone(_result.data));
            } else if (this.plantEditable) {
              // 사업장권한 : 내 사업장 등록 건
              this.gridOptions.data = this.$_.clone(
                _result.data.filter(
                  (v) => v.plantCd === this.$store.getters.plantCd
                )
              );
              this.YAuiGrid.setGridData(this.gridOptions.data);
            } else if (this.deptEditable) {
              // 일반권한 : 내 부서 등록 건 + 타 부서 평가완료 건
              this.gridOptions.data = this.$_.clone(
                _result.data.filter(
                  (v) =>
                    v.deptCd === this.$store.getters.deptCd ||
                    v.tstepCd === 'BAPSG'
                )
              );
              this.YAuiGrid.setGridData(this.gridOptions.data);
            }
          } else if (this.searchParam.areaType === 'plant') {
            // 사업장 화면
            if (this.companyEditable) {
              // 전사권한 : 전체 건
              // this.gridOptions.data = this.$_.clone(_result.data);
              this.YAuiGrid.setGridData(this.$_.clone(_result.data));
            } else if (this.plantEditable) {
              // 사업장권한 : 내 사업장 등록 건
              this.gridOptions.data = this.$_.clone(
                _result.data.filter(
                  (v) => v.plantCd === this.$store.getters.plantCd
                )
              );
              this.YAuiGrid.setGridData(this.gridOptions.data);
            } else if (this.deptEditable) {
              // 일반권한 : 내 부서 등록 건 + 타 부서 평가완료 건
              this.gridOptions.data = this.$_.clone(
                _result.data.filter(
                  (v) =>
                    v.plantCd === this.$store.getters.plantCd &&
                    v.tstepCd === 'BAPSG'
                )
              );
              this.YAuiGrid.setGridData(this.gridOptions.data);
            }
          } // 전사 화면
          else {
            if (this.companyEditable) {
              // 전사권한 : 전체 건
              // this.gridOptions.data = this.$_.clone(_result.data);
              this.YAuiGrid.setGridData(this.$_.clone(_result.data));
            } else if (this.plantEditable) {
              // 사업장권한 : 내 사업장 등록 건
              this.gridOptions.data = this.$_.clone(
                _result.data.filter((v) => v.tstepCd === 'BAPSG')
              );
              this.YAuiGrid.setGridData(this.gridOptions.data);
            } else if (this.deptEditable) {
              // 일반권한 : 내 부서 등록 건 + 타 부서 평가완료 건
              this.gridOptions.data = this.$_.clone(
                _result.data.filter((v) => v.tstepCd === 'BAPSG')
              );
              this.YAuiGrid.setGridData(this.gridOptions.data);
            }
          }
          this.$comm.pushCookie(this.searchParam);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },

    cellClickHandler(event) {
      if (event.dataField === 'stepNm') {
        this.showApprProgressPopup(event.item);
      } else {
        if (event.item === null) return;
        this.popupOptions.target = () => import(`${'./mgtTargetResult.vue'}`);
        this.popupOptions.title = 'L0000001528'; /* 상세조회 및 수정 */
        this.popupOptions.visible = true;
        this.popupOptions.width = '80%';
        this.popupOptions.top = '10px';
        this.popupOptions.param = {
          mgtTargetMonthNo: event.item.mgtTargetMonthNo,
          areaType: this.searchParam.areaType,
        };
        this.popupOptions.closeCallback = this.closePopup;
      }
    },
    // 결재진행상태 조회
    showApprProgressPopup(data) {
      var apprRqstNo = 0;

      // 평가 결재요청 전 : 실적 결재요청 번호
      // 실적 결재요청 전 : 목표 결재요청 번호
      if (data.estepCd !== null) {
        apprRqstNo = data.eapprRqstNo;
      } else if (data.rstepCd !== null) {
        apprRqstNo = data.rapprRqstNo;
      } else {
        apprRqstNo = data.tapprRqstNo;
      }

      this.popupOptions.target = () => import('@/pages/appr/apprProgressPopup');
      this.popupOptions.title = 'L0000000452'; // 결재진행상태
      this.popupOptions.param = {
        apprRqstNo: apprRqstNo, // 결재번호
      };
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closePopup;
    },
    btnRsltAppr() {
      this.mgtTargetMonthNos = '';
      let data = this.YAuiGrid.getGridData().filter(
        (v) => v.rstepCd === 'BAPSB' || v.rstepCd === 'BAPSD'
      );
      this.$_.forEach(data, (item) => {
        if (this.mgtTargetMonthNos.indexOf(item.mgtTargetMonthNo) === -1) {
          this.mgtTargetMonthNos += ',' + item.mgtTargetMonthNo;
        }
      });
      if (this.mgtTargetMonthNos !== '') {
        this.mgtTargetMonthNos = this.mgtTargetMonthNos.substring(
          1,
          this.mgtTargetMonthNos.length
        );

        window.getApp.$emit('CONFIRM', {
          title: 'L0000003395',
          message: 'L0000005062',
          type: 'info',
          // 확인 callback 함수
          confirmCallback: () => {
            this.popupOptions.target = () =>
              import(`${'@/pages/manage/appr/comApprRequest.vue'}`);
            this.popupOptions.title = 'L0000003418'; // 결재요청
            this.popupOptions.visible = true;
            this.popupOptions.closeCallback = this.closePopup;
            this.popupOptions.width = '80%';
            this.popupOptions.param = {
              apprBizCd: 'MG-MI-07',
              apprParams: {
                mgtTargetMonthNo: this.mgtTargetMonthNos,
              },
            };
          },
        });
      } else {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: 'L0000005061',
          type: 'info', // success / info / warning / error
        });
      }
    },
    btnEvalAppr() {
      this.mgtTargetMonthNos = '';
      let data = this.YAuiGrid.getGridData().filter(
        (v) => v.estepCd === 'BAPSB' || v.estepCd === 'BAPSD'
      );
      this.$_.forEach(data, (item) => {
        if (this.mgtTargetMonthNos.indexOf(item.mgtTargetMonthNo) === -1) {
          this.mgtTargetMonthNos += ',' + item.mgtTargetMonthNo;
        }
      });
      if (this.mgtTargetMonthNos !== '') {
        this.mgtTargetMonthNos = this.mgtTargetMonthNos.substring(
          1,
          this.mgtTargetMonthNos.length
        );

        window.getApp.$emit('CONFIRM', {
          title: 'L0000003395',
          message: 'L0000005062',
          type: 'info',
          // 확인 callback 함수
          confirmCallback: () => {
            this.popupOptions.target = () =>
              import(`${'@/pages/manage/appr/comApprRequest.vue'}`);
            this.popupOptions.title = 'L0000003418'; // 결재요청
            this.popupOptions.visible = true;
            this.popupOptions.closeCallback = this.closePopup;
            this.popupOptions.width = '80%';
            this.popupOptions.param = {
              apprBizCd: 'MG-MI-08',
              apprParams: {
                mgtTargetMonthNo: this.mgtTargetMonthNos,
              },
            };
          },
        });
      } else {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: 'L0000005061',
          type: 'info', // success / info / warning / error
        });
      }
    },
    closePopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.getList();
    },
  },
};
</script>
