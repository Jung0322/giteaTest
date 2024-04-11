<!--
  목적 : 작업허가서 신청 목록
  Detail : 작업허가서 신청 목록 화면
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <y-search-box :gridOptions="gridOptions" @enter="getList">
      <b-row slot="search">
        <b-col sm="12">
          <b-row>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <y-plant
                type="search"
                name="plantCd"
                :disabled="popupParam.plantDisabled"
                v-model="searchParam.plantCd"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 공사명 -->
              <y-text
                :width="8"
                :clearable="true"
                ui="bootstrap"
                name="constTitle"
                label="L0000000503"
                v-model="searchParam.constTitle"
              />
            </b-col>

            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 작업구분 -->
              <y-multi-select
                :width="8"
                :editable="editable"
                :comboItems="comboWkodKindItems"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                label="L0000002368"
                name="wkodKindCds"
                v-model="searchParam.wkodKindCds"
              ></y-multi-select>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
    </y-search-box>

    <b-row class="grid-height grid-box">
      <b-col sm="12" class="h100p">
        <!-- 작업구분별 업체 목록 -->
        <y-auigrid
          ref="yAuiGrid"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000004729')"
          :useExcelExport="false"
          :useContextMenu="true"
          :enableRightDownFocus="true"
          :showGridCtrl="true"
          :enableCellMerge="true"
          :cellMergeRowSpan="true"
          :showRowCheckColumn="true"
          @openWkodPage = "openWkodPage"
          @getList="getList"
          @closePopup="closePopup"
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
  name: 'wkod-kind-vendor',
  props: {
    popupParam: {
      type: Object,
      default: {
        constNo: '',
        plantCd: '',
        showConstSafe: false,
      },
    },
  },
  data() {
    return {
      searchParam: {
        constNo: '',
        plantCd: '',
        constTitle: '',
        wkodKindCds: [],
        isDateCondition: true,
      },
      YAuiGrid: null,
      gridOptions: {
        header: [],
        data: [],
        height: 300,
        merge: [],
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
      editable: true,
      searchUrl: '',

      comboWkodKindItems: [],
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

    this.getList();
  },
  beforeDestroy() {},
  //* methods */
  methods: {
    init() {
      this.editable = this.$route.meta.editable;
      // Url Setting
      this.searchUrl = selectConfig.constSafe.const.getKindSubconns.url;
      this.searchParam.constNo = this.popupParam.constNo;
      this.searchParam.plantCd = this.popupParam.plantCd;

      this.getComboAttrItems('SAF_WKOD_KIND'); // 작업구분

      // 그리드 헤더 설정
      this.gridOptions.header = [
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000000507'), 
          dataField: 'vendorNm', 
          width: '30%', 
        }, // 공사업체 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000002368'), 
          dataField: 'wkodKindNm', 
          width: '20%', 
        }, // 작업구분 
      ];
      this.gridOptions.btns = [
        { 
          title: this.$comm.getLangSpecInfoLabel('L0000001561'), 
          color: 'orange', 
          btnClicked: 'openWkodPage',
          visible: this.editable,
        },  // 선택
        { 
          title: this.$comm.getLangSpecInfoLabel('L0000000327'), 
          color: 'green', 
          btnClicked: 'getList',
        },  // 검색
        { 
          title: this.$comm.getLangSpecInfoLabel('L0000000881'), 
          btnClicked: 'closePopup',
        },  // 닫기
      ];
      // 공사명을 보여주고자 할때
      if (this.popupParam.showConstSafe) {
        this.gridOptions.header.unshift({ 
          headerText: this.$comm.getLangSpecInfoLabel('L0000000503'), 
          dataField: 'constTitle', 
          width: '50%', 
          cellMerge: true,
        }, // 공사명
        );
      }
      this.comboWkodTypeItems = [
        { code: null, codeNm: this.$comm.getLangSpecInfoLabel('L0000002519') }, // 전체
        { code: 'N', codeNm: this.$comm.getLangSpecInfoLabel('L0000005485') }, // 일반
        { code: 'F', codeNm: this.$comm.getLangSpecInfoLabel('L0000005486') }, // 특별(화기)
      ];
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
          this.comboWkodKindItems = this.$_.clone(_result.data);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    getList() {
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = this.searchParam;
      this.$http.request(
        (_result) => {
          this.YAuiGrid.setGridData(_result.data);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    openWkodPage() {
      if (this.YAuiGrid.getCheckedRowItems().length === 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395' /* 안내 */,
          message: 'M0000000230', // '신청할 행을 선택하세요. ',
          type: 'warning',
        });
      } else {
        let isView = true;
        const selectValue = this.YAuiGrid.getCheckedRowItems().map(rows => rows.item);

        this.$_.forEach(selectValue, (item) => {
          if (selectValue[0].attr1 !== item.attr1) {
            window.getApp.$emit('ALERT', {
              title: 'L0000003395' /* 안내 */,
              message: 'M0000000231', // '서로다른 허가서인 작업구분을 선택할 수 없습니다. ',
              type: 'warning',
            });
            isView = false;
            return false;
          }
          if (selectValue[0].vendorCd !== item.vendorCd) {
            window.getApp.$emit('ALERT', {
              title: 'L0000003395' /* 안내 */,
              message: 'M0000000232', // '서로다른 업체를 선택할 수 없습니다. ',
              type: 'warning',
            });
            isView = false;
            return false;
          }
          if (selectValue[0].constNo !== item.constNo) {
            window.getApp.$emit('ALERT', {
              title: 'L0000003395' /* 안내 */,
              message: 'M0000000233', // '서로다른 공사를 선택할 수 없습니다. ',
              type: 'warning',
            });
            isView = false;
            return false;
          }
        });

        if (isView) {
          if (!this.popupParam.showConstSafe) {
            this.popupOptions.title = 'L0000005487'; // 작업허가서 신청
            this.popupOptions.param = {
              constNo: this.popupParam.constNo,
              wkodNo: 0,
              wkodStepCd: 'WKS01',
              apprUrl: 'saf/wkod/wkodDetail?wkodNo',
              constSafeInfo: selectValue,
            };
            this.popupOptions.top = '10px';
            this.popupOptions.target = () =>
              import(`${'../wkod/wkodNewlDetail.vue'}`);
            this.popupOptions.visible = true;
            this.popupOptions.width = '90%';
            this.popupOptions.closeCallback = this.closeWkodPopup;
          } else this.$emit('closePopup', selectValue);
        }
      }
    },
    closeWkodPopup() {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
    },
    closePopup(data) {
      this.$emit('closePopup', {});
    },
    btnClickedErrorCallback(_result) {
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    /** end button 관련 이벤트 **/
  },
};
</script>
