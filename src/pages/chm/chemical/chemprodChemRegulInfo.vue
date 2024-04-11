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
    <b-row>
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- 화학물질 상세 -->
            <y-label
              label="L0000003290"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 저장 -->
              <y-btn
                v-if="editable"
                :action-url="saveUrl"
                :param="saveData"
                :is-submit="isSave"
                title="L0000002474"
                color="orange"
                action-type="POST"
                beforeSubmit="beforeSave"
                @beforeSave="beforeSave"
                @btnClicked="btnSaveClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
            </div>
          </b-col>
        </b-row>
        <b-card>
          <b-row sm="12">
            <b-col sm="12">
              <div slot="buttonGroup" class="float-right mb-1">
                <!-- 추가 -->
                <y-btn
                  v-if="editable"
                  title="L0000002892"
                  color="orange"
                  @btnClicked="OpenInsertPopup"
                />
                <!-- 제외 -->
                <y-btn
                  v-if="gridOptions.data.length > 0 && editable"
                  title="L0000002620"
                  color="red"
                  @btnClicked="btnReject"
                  @btnClickedErrorCallback="btnClickedErrorCallback"
                />
              </div>
              <!-- 구성성분 목록 -->
              <y-data-table
                label="L0000000693"
                ref="dataTable"
                :height="gridOptions.height"
                :headers="gridOptions.header"
                :items="gridOptions.data"
                v-model="selectedValue"
              >
                <el-table-column
                  v-if="editable"
                  type="selection"
                  slot="selection"
                  align="center"
                  width="55"
                ></el-table-column>
              </y-data-table>
            </b-col>
            <b-col sm="12" class="mt-3">
              <div slot="buttonGroup" class="float-right mb-1">
                <!-- 규제정보 검증 -->
                <y-btn
                  v-if="editable"
                  title="L0000000728"
                  color="orange"
                  @btnClicked="validRegulInfo"
                />
              </div>
              <!-- 화학물질 규제정보 -->
              <y-data-table
                label="L0000003288"
                ref="dataTableRegulItem"
                :height="gridOptions.regulItemHeight"
                :headers="gridOptions.regulItemHeader"
                :items="gridOptions.regulItemData"
              ></y-data-table>
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>
    <y-dialog :param="popupOptions"></y-dialog>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
export default {
  name: 'y-chemprod-chem-regul-info',
  props: {
    chemprodNo: 0,
  },
  data() {
    return {
      gridOptions: {
        header: [],
        data: [],
        height: 300,
        regulItemHeader: [],
        regulItemData: [],
        regulItemHeight: 350,
      },
      saveData: {
        chemProdNo: 0,
        chemprodChems: [],
        regulItmNos: [],
        createUserId: '',
        updateUserId: '',
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
      updateMode: false,
      searchUrl: '',
      searchRegulUrl: '',
      searchChemprodRegulUrl: '',
      saveUrl: '',
      isSave: false,
      regulItems: [],
    };
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
      this.searchUrl = selectConfig.chm.chemprodChem.list.url;
      this.searchRegulUrl = selectConfig.chm.chemicalRegulItem.list.url;
      this.searchChemprodRegulUrl = selectConfig.chm.chemprod.regul.url;
      this.saveUrl = transactionConfig.chm.chemprodChem.insert.url;

      this.editable = this.$route.meta.editable;

      this.getDataList(); // 구성성분 grid
      this.getRegulItems();

      // 구성성분 grid 헤더 설정
      this.gridOptions.header = [
        { text: 'L0000000102', name: 'casNo', width: '130px', align: 'center' }, // Cas.No
        {
          text: 'L0000003304',
          name: 'chemNmKr',
          width: '150px',
          align: 'left',
        }, // 화학물질명(국문)
        {
          text: 'L0000003305',
          name: 'chemNmEn',
          width: '150px',
          align: 'left',
        }, // 화학물질명(영문)
        {
          text: 'L0000003177',
          name: 'limitHigh',
          width: '130px',
          align: 'right',
          type: 'number',
        }, // 함유량상한(%)
        {
          text: 'L0000003178',
          name: 'limitLow',
          width: '130px',
          align: 'right',
          type: 'number',
        }, // 함유량하한(%)
        {
          text: 'L0000003176',
          name: 'limitRepval',
          width: '140px',
          align: 'right',
          type: 'number',
        }, // 함유량대표값(%)
      ];
    },
    // 구성성분 grid
    getDataList() {
      if (this.chemprodNo === 0) return;
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = {
        chemProdNo: this.chemprodNo,
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
          if (this.chemprodNo !== 0) this.getRegulDataList();
          else this.setRegulItemData([]);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    getRegulDataList() {
      this.$http.url = this.searchChemprodRegulUrl;
      this.$http.type = 'GET';
      this.$http.param = {
        chemprodNo: this.chemprodNo,
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
    beforeSave() {
      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321' /* 확인 */,
        message: 'M0000000011' /* 저장하시겠습니까? */,
        type: 'info',
        // 확인 callback 함수
        confirmCallback: () => {
          this.saveData.chemProdNo = this.$_.clone(this.chemprodNo);
          this.saveData.createUserId = this.$store.getters.token;
          this.saveData.updateUserId = this.$store.getters.token;

          let regulItemData = [];
          this.$_.forEach(this.gridOptions.regulItemData, (item) => {
            regulItemData = this.$_.concat(regulItemData, item.regulItmNms);
          });

          this.saveData.chemprodChems = this.$_.clone(this.gridOptions.data);
          this.saveData.regulItmNos = this.$_.clone(regulItemData);

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
      this.updateMode = false;
      window.getApp.emit('APP_REQUEST_ERROR', _result);
    },
    OpenInsertPopup(data) {
      this.popupOptions.target = () => import(`${'./chem.vue'}`);
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
    validRegulInfo() {
      // 규제정보 검증
      window.getApp.$emit('ALERT', {
        title: 'L0000003395' /* 안내 */,
        message: 'M0000000829', // '준비중입니다.',
        type: 'info',
      });
    },
    /** /Button Event **/
  },
};
</script>
