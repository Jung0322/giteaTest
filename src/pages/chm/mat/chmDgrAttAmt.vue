<!--
  목적 : sap에서 받은 저장위치 
  작성자 : kdh
  Detail : 
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <b-row v-if="!popupParam.single">
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- 저장/보관 위치 정보 -->
            <y-label label="L0000003813" icon="user-edit" color-class="cutstom-title-color" />
          </b-col>
        </b-row>
        <b-card header-class="default-card" body-class="default-body-card" class="py-0">
          <b-row>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <b-row>
                <b-col sm="4">
                  <!-- 사업장 -->
                  <y-label label="L0000001415" />
                </b-col>
                <b-col sm="8">
                  <y-label :label="popupParam.plantNm" :fieldable="true" />
                </b-col>
              </b-row>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <b-row>
                <b-col sm="4">
                  <!-- 저장위치코드 -->
                  <y-label label="L0000002480" />
                </b-col>
                <b-col sm="8">
                  <y-label :label="popupParam.matStrgCd" :fieldable="true" />
                </b-col>
              </b-row>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <b-row>
                <b-col sm="4">
                  <!-- 저장위치명 -->
                  <y-label label="L0000002479" />
                </b-col>
                <b-col sm="8">
                  <y-label :label="popupParam.matStrgNm" :fieldable="true" />
                </b-col>
              </b-row>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <b-row>
                <b-col sm="4">
                  <!-- 시설위치 -->
                  <y-label label="L0000003814" />
                </b-col>
                <b-col sm="8">
                  <y-label :label="popupParam.location" :fieldable="true" />
                </b-col>
              </b-row>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <b-row>
                <b-col sm="4">
                  <!-- 총허가량(kg) -->
                  <y-label label="L0000002877" />
                </b-col>
                <b-col sm="8">
                  <y-label :label="String(allPermitAmt)" :fieldable="true" />
                </b-col>
              </b-row>
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>

    <b-row sm="12" class="mt-3">
      <b-col sm="12">
        <div slot="buttonGroup" class="float-right mb-1">
          <!-- 적용 -->
          <y-btn v-if="editable" title="L0000002482" color="orange" @btnClicked="onSelect" />
          <!-- 닫기 -->
          <y-btn title="L0000000881" @btnClicked="closePopup" />
        </div>
        <!-- 위험물 목록 -->
        <y-data-table
          label="L0000003815"
          ref="dataTable"
          :height="gridOptions.height"
          :headers="gridOptions.header"
          :items="gridOptions.data"
          :span-options="gridOptions.merge"
          :useRownum="false"
          checkKey="chmDgrAttAmtNo"
          :checkItemData="checkItemData"
          v-model="selectedValue"
          @selectedRow="selectedRow"
          @rowDoubleClicked="rowDoubleClicked"
        >
          <el-table-column
            v-if="!popupParam.single"
            type="selection"
            slot="selection"
            align="center"
            width="55"
          ></el-table-column>
        </y-data-table>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
export default {
  name: 'chm-dgr-att-amt',
  props: {
    popupParam: {
      type: Object,
      default: {
        plantCd: '',
        plantNm: '',
        matStrgCd: '',
        matStrgNm: '',
        location: '',
        single: false,
        data: [],
      },
    },
  },
  data() {
    return {
      gridOptions: {
        header: [],
        data: [],
        height: 450,
        merge: [],
      },
      checkItemData: [],
      allPermitAmt: 0,
      editable: false,
      searchUrl: '',
      selectedValue: [],
      selectedObject: null,
    };
  },
  watch: {
    selectedValue() {
      this.allPermitAmt = 0;
      if (this.selectedValue && this.selectedValue.length > 0) {
        this.$_.forEach(this.selectedValue, value => {
          let val = value.appAmt;
          if (isNaN(val)) {
            val = 0;
          } else {
            val = this.$_.parseInt(val);
          }
          this.allPermitAmt += val;
        });
      }
    },
  },
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {},
  beforeDestroy() {},
  /** methods **/
  methods: {
    /** 초기화 관련 함수 **/
    init() {
      // URL 셋팅
      this.searchUrl = selectConfig.chm.mat.storageFacilityManagement.dgrList.url;

      this.editable = this.$route.meta.editable;

      this.getDataList(); // 구성성분 grid

      // 구성성분 grid 헤더 설정
      this.gridOptions.header = [
        // 위험물 구분
        { text: 'L0000002136', name: 'regulItmNm', width: '150px', align: 'center', },
        // 세부품명
        { text: 'L0000001644', name: 'dgrNm', width: '150px', align: 'center', },
        // 지정수량
        { text: 'L0000003816', name: 'appAmt', width: '150px', align: 'right', },
        // 단위
        { text: 'L0000000870', name: 'unitNm', width: '100px', align: 'center', },
      ];
      this.gridOptions.merge = [];
      let index = 1;
      if (this.popupParam.single) {
        index = 0;
      }
      this.gridOptions.merge.push({ index: index, field: 'regulItmNm' });
    },
    // 구성성분 grid
    getDataList() {
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      if (this.popupParam.plantCd && this.popupParam.matStrgCd) {
        this.$http.param = {
          plantCd: this.popupParam.plantCd,
          matStrgCd: this.popupParam.matStrgCd,
        };
      }
      this.$http.request(
        _result => {
          this.gridOptions.data = _result.data;
          this.checkItemData = this.popupParam.data;
        },
        _error => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    onSelect() {
      if (!this.popupParam.single) {
        if (!this.selectedValue || this.selectedValue.length === 0) {
          window.getApp.$emit('ALERT', {
            title: 'L0000003395', // '안내',
            message: 'M0000000177', // '위험물을 선택하세요.',
            type: 'warning',
          });
        } else {
          this.closePopup(this.selectedValue);
        }
      } else {
        if (!this.selectedObject) {
          window.getApp.$emit('ALERT', {
            title: 'L0000003395', // '안내',
            message: 'M0000000177', // '위험물을 선택하세요.',
            type: 'warning',
          });
        } else {
          this.closePopup(this.selectedObject);
        }
      }
    },
    closePopup(data) {
      if (!data) {
        this.$emit('closePopup', 'CLOSE');
      } else if (!this.popupParam.single) {
        this.$emit('closePopup', {
          list: data,
          allPermitAmt: this.allPermitAmt,
        });
      } else {
        this.$emit('closePopup', data);
      }
    },
    selectedRow(data) {
      if (!this.popupParam.single) return;
      this.selectedObject = data;
    },
    rowDoubleClicked(data) {
      if (!this.popupParam.single) return;
      this.closePopup(data);
    },
  },
};
</script>