<!--
  목적 : 물질관리 > 화학물질 > 화학물질
  작성자 : kdh
  Detail : 화학물질 목록 조회 화면
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <y-search-box :gridOptions="gridOptions" @enter="getDataList">
      <b-row slot="search">
        <b-col
          v-if="!popupParam.popupMode"
          sm="6"
          md="6"
          lg="6"
          xl="6"
          class="col-xxl-6"
        >
          <!-- 검색어1 -->
          <y-text
            :width="8"
            ui="bootstrap"
            label="L0000004604"
            v-model="searchParam.search"
            name="search"
          ></y-text>
        </b-col>
        <b-col
          v-if="!popupParam.popupMode"
          sm="6"
          md="6"
          lg="6"
          xl="6"
          class="col-xxl-3"
        >
          <!-- 화학물질명 및 성분명 및 성분 CAS No. -->
          <y-label label="(L0000004605)" :fieldable="true"></y-label>
        </b-col>
        <b-col
          v-if="!popupParam.popupMode"
          sm="12"
          md="12"
          lg="12"
          xl="12"
          class="col-xxl-12 mb-3"
        >
          <div slot="buttonGroup" class="float-right mb-1">
            <!-- 숨기기 -->
            <y-btn
              v-if="show"
              title="L0000001723"
              color="green"
              @btnClicked="iconClicked"
            />
            <!-- 표시 -->
            <y-btn
              v-if="!show"
              title="L0000003151"
              color="green"
              @btnClicked="iconClicked"
            />
          </div>
          <el-collapse-transition>
            <!-- 규제법규 및 항목 -->
            <y-data-table
              v-show="show"
              ref="dataTableRegulItem"
              label="L0000000724"
              :height="gridOptions.regulItemHeight"
              :headers="gridOptions.regulItemHeader"
              :items="gridOptions.regulItemData"
            ></y-data-table>
          </el-collapse-transition>
          <y-tag
            v-show="!show"
            :width="10"
            :editable="editable"
            :disabled="true"
            new-label-text
            label="L0000000724"
            v-model="selectedRegulItems"
            name="selectedRegulItems"
          />
        </b-col>

        <b-col
          v-if="popupParam.popupMode"
          sm="6"
          md="6"
          lg="6"
          xl="6"
          class="col-xxl-3"
        >
          <!-- 화학물질명 -->
          <y-text
            :width="7"
            ui="bootstrap"
            type="search"
            label="L0000003298"
            v-model="searchParam.chemprodNm"
            name="chemprodNm"
          ></y-text>
        </b-col>
      </b-row>
    </y-search-box>

    <b-row class="mt-3">
      <b-col sm="12">
        <b-col sm="12" class="px-0">
          <div slot="buttonGroup" class="float-right mb-1">
            <!-- 신규등록 -->
            <y-btn
              v-if="!popupParam.popupMode && editable"
              title="L0000001789"
              color="orange"
              @btnClicked="btnInsert"
            />
            <!-- 선택 -->
            <y-btn
              v-if="popupParam.popupMode && editable"
              title="L0000001561"
              color="orange"
              @btnClicked="btnAdd"
            />
            <!-- 검색 -->
            <y-btn
              title="L0000000327"
              color="green"
              @btnClicked="btnSearchClickedCallback"
            />
            <!-- 닫기 -->
            <y-btn
              v-if="popupParam.popupMode && editable"
              title="L0000000881"
              @btnClicked="closePopup('C')"
            />
          </div>
          <!-- 화학물질 목록 -->
          <y-data-table
            ref="dataTable"
            label="L0000003289"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            :use-paging="!popupParam.popupMode"
            excelDown="true"
            @selectedRow="selectedRow"
            @rowDoubleClicked="rowDoubleClicked"
            @tableLinkClicked="tableLinkClicked"
            @expandChange="expandChange"
          >
            <!-- 구성물질 -->
            <el-table-column
              v-if="!popupParam.popupMode"
              slot="expand"
              type="expand"
              label="L0000000689"
              width="75"
            >
              <template slot-scope="scope">
                <!-- L0000003463 // * 구성물질 목록({s0}건) -->
                <!--  <y-label
                  :label="
                    '* 구성물질 목록 (' + scope.row.chemicals.length + '건)'
                  "
                ></y-label> -->
                <y-label
                  :label="
                    $comm.getLangSpecInfoLabel('L0000003463', {
                      s0: scope.row.chemicals.length,
                    })
                  "
                />
                <el-table
                  ref="chemicalData"
                  :border="true"
                  header-cell-class-name="default-th"
                  cell-class-name="default-td"
                  :data="scope.row.chemicals"
                  style="overflow-y: scroll"
                >
                  <el-table-column
                    label="L0000003304"
                    width="150px"
                    prop="chem_nm_kr"
                    align="left"
                  />
                  <!-- 화학물질명 (국문) -->
                  <el-table-column
                    label="L0000003305"
                    width="150px"
                    prop="chem_nm_en"
                    align="left"
                  />
                  <!-- 화학물질명 (영문) -->
                  <el-table-column
                    label="L0000000102"
                    width="100px"
                    prop="cas_no"
                    align="center"
                  />
                  <!-- CAS No. -->
                  <el-table-column
                    v-for="(regul, index) in regulInfor"
                    :key="index"
                    :label="regul.text"
                    align="center"
                  >
                    <el-table-column
                      v-for="_regul in regul.child"
                      :key="_regul.name"
                      :label="_regul.text"
                      :width="_regul.width"
                      :prop="_regul.name"
                      :align="_regul.align"
                    ></el-table-column>
                  </el-table-column>
                </el-table>
              </template>
            </el-table-column>
          </y-data-table>
        </b-col>
      </b-col>
    </b-row>
    <y-dialog :param="popupOptions"></y-dialog>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
export default {
  name: 'y-chem-prod',
  props: {
    popupParam: {
      type: Object,
      default: function () {
        return { chemprod: [], popupMode: false };
      },
    },
  },
  data() {
    return {
      searchArea: {
        title: '검색박스숨기기' /* 검색박스숨기기 */,
        show: true,
      },
      searchParam: {
        search: '', // 검색어
        regulItmNos: [],
        chemprodNm: '',
      },
      gridOptions: {
        header: [],
        data: [],
        height: '600',
        regulItemHeader: [],
        regulItemData: [],
        regulItemHeight: 300,
      },
      selectChemprod: null,
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '80%',
        top: '50px',
        param: {},
        closeCallback: null,
      },
      editable: false,
      searchUrl: '',
      searchChemiUrl: '',
      searchRegulUrl: '',
      vendorItems: [],
      regulItemFullList: [],
      regulItems: [],
      regulInfor: [],
      selectedRegulItems: [],
      show: true,
    };
  },
  watch: {
    'gridOptions.regulItemData': {
      handler: function (val, oldVal) {
        this.selectedRegulItems = [];
        this.$_.forEach(this.gridOptions.regulItemData, (regulItem) => {
          this.$_.forEach(regulItem.regulItmNms, (item) => {
            let index = this.$_.findIndex(this.regulItemFullList, {
              regulItmNo: item,
            });
            this.selectedRegulItems.push(
              regulItem.regulLawNm +
                ' | ' +
                this.regulItemFullList[index].regulItmNm
            );
          });
        });
      },
      deep: true,
    },
  },
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  /** methods **/
  methods: {
    /** 초기화 관련 함수 **/
    init() {
      // URL 셋팅
      this.searchUrl = selectConfig.chm.chemprod.list.url;
      this.searchChemiUrl = selectConfig.chm.chem.list.url;
      this.searchRegulUrl = selectConfig.chm.chemicalRegulItem.list.url;

      this.editable = this.$route.meta.editable;

      if (!this.popupParam.popupMode) this.getRegulItems(); // 규제법규 및 항목
      this.getDataList(); // 화학물질 grid

      // 화학물질 grid 헤더 설정
      if (!this.popupParam.popupMode) {
        this.gridOptions.header = [
          {
            text: 'L0000003304' /* 화학물질명(국문) */,
            name: 'chem_prod_nm_kr',
            width: '150px',
            align: 'left',
            url: 'link',
          },
          {
            text: 'L0000003305' /* 화학물질명(영문) */,
            name: 'chem_prod_nm_en',
            width: '150px',
            align: 'left',
          },
          {
            text: 'L0000001635' /* 성상 */,
            name: 'property_nm',
            width: '100px',
            align: 'center',
          },
        ];
      } else {
        this.gridOptions.header = [
          {
            text: 'L0000003304' /* 화학물질명(국문) */,
            name: 'chemProdNmKr',
            width: '150px',
            align: 'left',
          },
          {
            text: 'L0000003305' /* 화학물질명(영문) */,
            name: 'chemProdNmEn',
            width: '150px',
            align: 'left',
          },
          {
            text: 'L0000001635',
            /* 성상 */ name: 'propertyNm',
            width: '100px',
            align: 'center',
          },
          {
            text: 'L0000001053' /* 물질구성 */,
            name: 'mixYnNm',
            width: '120px',
            align: 'center',
          },
          {
            text: 'L0000002637' /* 제품구분 */,
            name: 'prodCatNm',
            width: '120px',
            align: 'center',
          },
          {
            text: 'L0000002059',
            /* 용도 */ name: 'usageNm',
            width: '100px',
            align: 'center',
          },
        ];
      }

      /* 쿠키에 저장된 검색 조건이 있을 경우 최초 페이지 진입시 자동 설정 By 2022-05-09 장헌영 */
      var searchParamByCookie = this.$comm.setSearchParamByCookie();
      if (typeof searchParamByCookie !== 'undefined') {
        this.searchParam = searchParamByCookie;
      }
    },
    /**
     * 규제법규 및 항목 검색
     */
    getRegulItems() {
      this.$http.url = this.searchRegulUrl;
      this.$http.type = 'GET';
      this.$http.param = {
        useYn: 'Y',
      };
      this.$http.request(
        (_result) => {
          this.regulItemFullList = this.$_.clone(_result.data);
          let keys = this.$_.uniq(this.$_.map(_result.data, 'regulLawCd'));
          let keyNames = this.$_.uniq(this.$_.map(_result.data, 'regulLawNm'));
          this.$_.forEach(keys, (key) => {
            this.regulItems.push(
              this.$_.filter(_result.data, { regulLawCd: key })
            );
          });
          this.gridOptions.regulItemHeader = [
            {
              text: 'L0000000568' /* 관련법규 */,
              name: 'regulLawNm',
              width: '130px',
              align: 'center',
            },
            {
              text: 'L0000000726' /* 규제사항 */,
              name: 'regulItmNms',
              width: '500px',
              type: 'checkboxmulti',
              items: this.regulItems,
              itemText: 'regulItmNm',
              itemValue: 'regulItmNo',
            },
          ];
          this.setRegulItemData([]);
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
          this.setChemHeader(_result.data);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    setChemHeader(regul) {
      var i = 0;
      this.regulInfor = [];
      this.$_.forEach(regul, (regul) => {
        var parent = null;
        var child = [];
        this.$_.forEach(this.regulItems[i], (item) => {
          if (item.regulLawCd === regul.code) {
            child.push({
              text: item.regulItmNm,
              name: item.regulItmNo.toString(),
              width: item.regulItmNm.length * 8 + 105 + 'px',
              align: 'center',
            });
          }
        });
        parent = {
          text: regul.codeNm,
          child: child,
        };
        i++;
        this.regulInfor.push(parent);
        this.gridOptions.header.push(parent);
      });
    },
    // 화학물질 grid
    getDataList() {
      let saveData = [];
      this.$_.forEach(this.gridOptions.regulItemData, (item) => {
        saveData = this.$_.concat(saveData, item.regulItmNms);
      });
      if (this.popupParam.popupMode) {
        this.searchUrl = selectConfig.chm.chemprod.chemprodNoRegul.url;
        this.searchParam.useYn = 'Y';
      }
      this.searchParam.regulItmNos = saveData;
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = this.searchParam;
      this.$http.request(
        (_result) => {
          _result.data.forEach((item) => {
            item['chemicals'] = [];
          });
          this.gridOptions.data = _result.data;
          this.$comm.pushCookie(this.searchParam);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    expandChange(row) {
      this.$http.url = this.searchChemiUrl;
      this.$http.type = 'get';
      this.$http.param = {
        chemprodNo: row.chem_prod_no,
      };
      this.$http.request(
        (_result) => {
          row['chemicals'] = _result.data;
        },
        (_error) => {
          window.getApp.$emit(
            'APP_REQUEST_ERROR',
            'M0000000016' // 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.
          );
        }
      );
    },
    selectedRow(data) {
      if (!this.popupParam.popupMode) return;
      this.selectChemprod = data;
    },
    rowDoubleClicked(data) {
      if (!this.popupParam.popupMode) return;
      this.closePopup(data);
    },
    // 그리드 row click 이벤트
    tableLinkClicked(header, row) {
      if (row === null) return;

      this.OpenInsertPopup(row);
    },
    /** /validation checking **/

    /** Button Event **/

    // 검색
    btnSearchClickedCallback(_result) {
      this.getDataList();
    },
    iconClicked() {
      this.show = !this.show;
    },
    btnInsert() {
      this.OpenInsertPopup(null);
    },
    OpenInsertPopup(data) {
      this.popupOptions.target = () =>
        import(`${'./../chemprod/chemprodDetail.vue'}`);
      this.popupOptions.title = 'L0000003285'; /* 화학물질 */
      this.popupOptions.visible = true;
      this.popupOptions.param = {
        chemprodNo: data ? data.chem_prod_no : 0,
      };
      this.popupOptions.closeCallback = this.closeChemprodPopup;
    },
    closeChemprodPopup() {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;

      this.getDataList(); // 화학물질 grid
    },
    btnAdd() {
      if (!this.selectChemprod) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395' /* 안내 */,
          message: 'M0000000161', // 화학물질를 선택하세요.
          type: 'warning',
        });
      } else this.closePopup(this.selectChemprod);
    },
    /**
     *  팝업 안 보이도록 closePopup emit
     *  팝업 close
     * data : 팝업창에서 return하는 데이터
     */
    closePopup(data) {
      this.$emit('closePopup', { data });
    },
    /** /Button Event **/
  },
};
</script>
