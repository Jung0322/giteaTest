<!--
  목적 : 화학물질관리 > 화학물질 > 구성성분/규제 정보
  작성자 : kdh
  Detail : 구성성분/규제 정보 등록/조회 화면
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <!-- <b-row>
          <b-col sm="12">
            <y-label label="화학물질 상세" icon="user-edit" color-class="cutstom-title-color" />
            <div slot="buttonGroup" class="float-right mb-1">
              <y-btn
                v-if="editable"
                :action-url="saveUrl"
                :param="saveData"
                :is-submit="isSave"
                title="저장"
                color="orange"
                action-type="POST"
                beforeSubmit = "beforeSave"
                @beforeSave="beforeSave"
                @btnClicked="btnSaveClickedCallback" 
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
            </div>
          </b-col>
    </b-row>-->
    <b-row sm="12">
      <b-col sm="12">
        <div slot="buttonGroup" class="float-right mb-1">
          <el-tag size="medium" type="info" v-if="!disabled && editable">
            <i class="el-icon-info"></i> 대표값 합의 전체값이 100%가 되지 않는
            경우, 성분내역서를 첨부하셔야 합니다.
          </el-tag>
          <!--추가  -->
          <y-btn
            v-if="!disabled && editable"
            title="L0000002892"
            color="orange"
            @btnClicked="OpenInsertPopup"
          />
          <!-- 제외 -->
          <y-btn
            v-if="gridOptions.data.length > 0 && !disabled && editable"
            title="L0000002620"
            color="red"
            @btnClicked="btnReject"
            @btnClickedErrorCallback="btnClickedErrorCallback"
          />
        </div>
        <!-- 구성성분 정보 -->
        <y-data-table
          label="L0000000694"
          ref="dataTable"
          :height="gridOptions.height"
          :headers="gridOptions.header"
          :items="gridOptions.data"
          :editable="editable && !disabled"
          v-model="selectedValue"
          :popMode="true"
        >
          <el-table-column
            v-if="!disabled && editable"
            type="selection"
            slot="selection"
            align="center"
            width="55"
          ></el-table-column>
        </y-data-table>
      </b-col>
      <b-col sm="12" class="mt-3">
        <div slot="buttonGroup" class="float-right mb-1">
          <el-tag size="medium" type="info" v-if="!disabled && editable">
            <i class="el-icon-info"></i> 구성성분에 해당하는 규제정보를
            검증합니다.
          </el-tag>
          <!-- 규제정보 검증 -->
          <y-btn
            v-if="editable && !disabled"
            title="L0000000728"
            color="orange"
            @btnClicked="verificationRegulDb"
          />
        </div>
        <!-- 자재규제정보 -->
        <y-data-table
          label="L0000002324"
          ref="dataTableRegulItem"
          :height="gridOptions.regulItemHeight"
          :headers="gridOptions.regulItemHeader"
          :items="gridOptions.regulItemData"
          :editable="editable && !disabled"
          :fixwithclass="gridOptions.checkGroupStyle"
          minHeight="380px"
          :popMode="true"
        ></y-data-table>
      </b-col>
    </b-row>
    <y-dialog :param="popupOptions"></y-dialog>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
var pixelWidth = require('string-pixel-width');
export default {
  name: 'y-matCheckRequest-chem-regul-info',
  props: {
    matChkRqstNo: 0,
    chemProdNo: 0,
    changeChemProd: false,
    chkRqstState: '',
    saveData: {
      matChkRqstNo: 0,
      matCheckRequestCompos: [],
      regulItmMatVals: [],
      createUserId: '',
      updateUserId: '',
    },
    disabled: false,
  },
  data() {
    return {
      gridOptions: {
        header: [],
        data: [],
        height: 300,
        regulItemHeader: [],
        regulItemData: [],
        regulItemHeight: 250,
        checkGroupStyle: 'width: 140px !important;',
      },
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '80%',
        top: '50px',
        param: {},
        closeCallback: null,
      },
      selectedValue: [],
      editable: false,
      searchUrl: '',
      searchRegulUrl: '',
      searchMatRegulUrl: '',
      searchChemProdChemUrl: '',
      searchChemprodRegulUrl: '',
      checkRegulDbUrl: '', // 규제db검증
      saveUrl: '',
      isSave: false,
      regulItems: [],
    };
  },
  watch: {
    'gridOptions.regulItemData': {
      handler: function (val, oldVal) {
        let regulItemData = [];
        this.$_.forEach(this.gridOptions.regulItemData, (item) => {
          if (item.regulItmNms) {
            regulItemData = this.$_.concat(regulItemData, item.regulItmNms);
          }
        });
        this.saveData.regulItmMatVals = this.$_.clone(regulItemData);
      },
      deep: true,
    },
    'gridOptions.data': {
      handler: function (val, oldVal) {
        this.saveData.matCheckRequestCompos = this.$_.clone(
          this.gridOptions.data
        );
      },
      deep: true,
    },
    changeChemProd: {
      handler: function (val, oldVal) {
        if (val) {
          this.getChemProdDataList(); // 구성성분 grid
          this.getChemProdRegulDataList(); // 규제
        } else this.$emit('setChangeChemProd');
      },
      deep: true,
    },
  },
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {
    // 윈도우 resize event
    window.addEventListener('resize', this.setGridSize);
  },
  beforeDestroy() {
    // 윈도우 resize event 제거-SPA 기반이므로 제거하지 않으면 다른페이지에서 해당 이벤트가 호출됨
    window.removeEventListener('resize', this.setGridSize);
  },
  /** methods **/
  methods: {
    /** 초기화 관련 함수 **/
    init() {
      // URL 셋팅
      this.searchUrl = selectConfig.chm.matCheckRequestCompo.list.url;
      this.searchRegulUrl = selectConfig.chm.chemicalRegulItem.list.url;
      this.searchMatRegulUrl = selectConfig.chm.matCheckRequestCompo.regul.url;
      this.saveUrl = transactionConfig.chm.matCheckRequestCompo.insert.url;
      this.checkRegulDbUrl = selectConfig.chm.matCheckRequest.reguldbcheck.url;

      // 화학물질별
      this.searchChemProdChemUrl = selectConfig.chm.chemprodChem.list.url;
      this.searchChemprodRegulUrl = selectConfig.chm.chemprod.regul.url;

      this.editable = this.$route.meta.editable;

      // if (this.chkRqstState === 'MCRS2' || this.chkRqstState === 'MCRS3') {
      //   this.disabled = true;
      // }

      this.getDataList(); // 구성성분 grid
      this.getRegulItems(); // 규제

      // 구성성분 grid 헤더 설정
      this.gridOptions.header = [
        { text: 'L0000000102', name: 'casNo', width: '130px', align: 'center' }, // CAS No.
        {
          text: 'L0000003304',
          name: 'chemNmKr',
          width: '150px',
          align: 'left',
        }, // 화학물질명 (국문)
        {
          text: 'L0000003305',
          name: 'chemNmEn',
          width: '150px',
          align: 'left',
        }, // 화학물질명 (영문)
        {
          text: 'L0000003177',
          name: 'limitHigh',
          width: '130px',
          align: 'right',
          type: 'number',
          pointNumber: 5,
        }, // 함유량상한(%)
        {
          text: 'L0000003178',
          name: 'limitLow',
          width: '130px',
          align: 'right',
          type: 'number',
          pointNumber: 5,
        }, // 함유량하한(%)
        {
          text: 'L0000003176',
          name: 'limitRepval',
          width: '140px',
          align: 'right',
          type: 'number',
          pointNumber: 5,
        }, // 함유량대표값(%)
      ];

      this.setGridSize(); // 그리드 사이즈 조절
    },
    // 구성성분 grid
    getDataList() {
      if (this.matChkRqstNo === 0) return;
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = {
        matChkRqstNo: this.matChkRqstNo,
      };
      this.$http.request(
        (_result) => {
          this.gridOptions.data = _result.data;
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    // 화학물질별 구성성분 grid
    getChemProdDataList() {
      if (this.chemProdNo === 0) return;
      this.$http.url = this.searchChemProdChemUrl;
      this.$http.type = 'GET';
      this.$http.param = {
        chemProdNo: this.chemProdNo,
        searchFlag: 'true',
      };
      this.$http.request(
        (_result) => {
          this.gridOptions.data = _result.data;
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
          if (this.matChkRqstNo !== 0) this.getRegulDataList();
          else this.setRegulItemData([]);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    // 물질검토별 규제정보
    getRegulDataList() {
      this.$http.url = this.searchMatRegulUrl;
      this.$http.type = 'GET';
      this.$http.param = {
        matChkRqstNo: this.matChkRqstNo,
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
    // 화학물질별 규제정보
    getChemProdRegulDataList() {
      this.$http.url = this.searchChemprodRegulUrl;
      this.$http.type = 'GET';
      this.$http.param = {
        chemprodNo: this.chemProdNo,
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
          this.setChemHeader(_result.data);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    setChemHeader(reguls) {
      var i = 0;
      var maxWidth = 50;
      this.$_.forEach(reguls, (regul) => {
        var parent = null;
        var child = [];
        this.$_.forEach(this.regulItems[i], (item) => {
          var width = pixelWidth(item.regulItmNm, {
            size: 12,
            bold: true,
            font: 'Arial',
          });
          if (width > maxWidth) {
            maxWidth = width;
          }
        });
        i++;
      });
      this.gridOptions.checkGroupStyle =
        'width: ' + (maxWidth + 70) + 'px !important;';
    },
    beforeSave() {
      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321' /* 확인 */,
        message: 'M0000000011' /* 저장하시겠습니까? */,
        type: 'info',
        // 확인 callback 함수
        confirmCallback: () => {
          this.saveData.matChkRqstNo = this.$_.clone(this.matChkRqstNo);
          this.saveData.createUserId = this.$store.getters.token;
          this.saveData.updateUserId = this.$store.getters.token;

          let regulItemData = [];
          this.$_.forEach(this.gridOptions.regulItemData, (item) => {
            regulItemData = this.$_.concat(regulItemData, item.regulItmNms);
          });
          this.saveData.matCheckRequestCompos = this.$_.clone(
            this.gridOptions.data
          );
          this.saveData.regulItmMatVals = this.$_.clone(regulItemData);

          this.isSave = true;
        },
        cancelCallback: () => {
          this.isSave = false;
        },
      });
    },
    /** validation checking **/
    /** /validation checking **/

    /** Button Event **/
    // 저장
    btnSaveClickedCallback(_result) {
      this.getDataList(); // 구성성분 grid
      this.getRegulItems();
      this.isSave = false;
      window.getApp.$emit('ALERT', {
        title: 'L0000003395' /* 안내 */,
        message: 'M0000000006', // '저장되었습니다.',
        type: 'success',
      });
    },
    // 버튼 에러 처리
    btnClickedErrorCallback(_result) {
      this.isInsert = false;
      this.isEdit = false;
      window.getApp.emit('APP_REQUEST_ERROR', _result);
    },
    OpenInsertPopup(data) {
      this.popupOptions.target = () => import(`${'../chemical/chem.vue'}`);
      this.popupOptions.title = 'L0000003285'; // 화학물질
      this.popupOptions.visible = true;
      this.popupOptions.param = {
        chems: this.gridOptions.data,
        popupMode: true,
      };
      this.popupOptions.closeCallback = this.closeChemPopup;
    },
    closeChemPopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      if (data.data !== 'C') {
        // 기존 데이터가 존재하는 경우에는 제외
        this.$_.forEach(this.gridOptions.data, (item) => {
          data.data = this.$_.clone(
            this.$_.reject(data.data, { chemNo: item.chemNo })
          );
        });

        this.$_.forEach(data.data, (item) => {
          this.gridOptions.data.push(item);
        });
      }
    },
    btnReject() {
      if (this.selectedValue.length === 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395' /* 안내 */,
          message: 'M0000000160', // '제외할 항목를 선택하세요.',
          type: 'warning',
        });
      } else {
        this.$_.forEach(this.selectedValue, (item) => {
          this.gridOptions.data = this.$_.clone(
            this.$_.reject(this.gridOptions.data, { chemNo: item.chemNo })
          );
        });
      }
    },
    verificationRegulDb() {
      // 규제DB검증
      let chemNos = '';
      let chemCount = 0;
      let limitRepvals = '';

      this.$_.forEach(this.gridOptions.data, (item) => {
        chemNos += (chemNos === '' ? '' : ',') + item.chemNo;
        limitRepvals += (limitRepvals === '' ? '' : ',') + item.limitRepval;
        chemCount += 1;
      });

      if (chemCount === 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395' /* 안내 */,
          message: 'M0000000171', // '검증할 구성성분이 없습니다. 구성성분을 추가하신 후 검증하시기 바랍니다.',
          type: 'warning',
        });
        return;
      }

      this.$http.url = this.checkRegulDbUrl;
      this.$http.type = 'GET';
      this.$http.param = {
        chemNos: chemNos,
        limitRepvals: limitRepvals,
        chemCount: chemCount,
      };
      this.$http.request(
        (_result) => {
          // 새 창을 띄워서 결과를 보여주고, 결과값 적용여부를 확인 받아 처리해 준다.
          this.openVerificationResultPop(_result.data);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    openVerificationResultPop(data) {
      this.popupOptions.target = () => import(`${'./checkRegulDBResult.vue'}`);
      this.popupOptions.title = 'L0000003863'; // 규제DB검증결과
      this.popupOptions.visible = true;
      this.popupOptions.width = '80%';
      this.popupOptions.param = {
        checkResult: data,
        popupMode: true,
      };
      this.popupOptions.closeCallback = this.closeVerificationResultPop;
    },
    closeVerificationResultPop(_retData) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.popupOptions.width = '80%';
      if (_retData.apply) {
        // 검증한 규제DB 정보를 적용한다.
        let keys = this.$_.uniq(this.$_.map(_retData.items, 'regulLawCd'));
        let keyNames = this.$_.uniq(this.$_.map(_retData.items, 'regulLawNm'));
        let values = [];
        this.$_.forEach(keys, (key) => {
          values.push(
            this.$_.map(
              this.$_.filter(_retData.items, { regulLawCd: key }),
              'regulItemNo'
            )
          );
        });
        this.setRegulItemData(this.$_.zipObject(keys, values));
      }
    },
    /**
     * 그리드 리사이징
     */
    setGridSize() {
      var defaultHeight1 = 250;
      var defaultHeight2 = 480;
      window.getApp.$emit('LOADING_SHOW');
      setTimeout(() => {
        this.gridOptions.regulItemHeight = '380';
        this.gridOptions.height = 'auto';
        window.getApp.$emit('LOADING_HIDE');
      }, 600);
    },
    /** /Button Event **/
  },
};
</script>
