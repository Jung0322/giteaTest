<!--
  목적 : 열교환기 튜브 화학물질 등록(팝업)
  작성자 : kdh
  Detail : 
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <!-- 화학물질 grid -->
    <b-row>
      <b-col sm="12" class="px-0">
        <b-col sm="12" class="px-0">
          <div slot="buttonGroup" class="float-right mb-1">
            <!-- 추가 -->
            <y-btn
              v-if="!flag && editable"
              title="L0000002892"
              color="orange"
              @btnClicked="btnAddChemprod"
            />
            <!-- 제외 -->
            <y-btn
              v-if="!flag && editable"
              title="L0000002620"
              color="red"
              @btnClicked="btnDeleteChemprod"
            />
            <!-- <y-btn
              v-if="editable"
              title="삭제"
              color="red"
              @btnClicked="btnDeleteChemprod" 
            />-->
          </div>
          <!-- 화학자재 목록 -->
          <y-data-table
            label="L0000003311"
            ref="dataTable"
            :rows="3"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            :height="gridOptions.height"
            :span-options="gridOptions.merge"
            :editable="editable"
            :useRownum="false"
            v-model="selectedValue"
          >
            <el-table-column
              v-if="!flag"
              :selectable="selectCheck"
              type="selection"
              slot="selection"
              align="center"
              width="55"
            ></el-table-column>
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
  name: 'y-chem-prod-popup',
  props: {
    facilityMst: {
      type: Object,
      default: () => ({
        safFacilityCd: '',
        tubeChemprods: [],
        tubeCheck: false,
        firstTubeChemprod: [],
      }),
    },
    tubeEquipmentNo: {
      type: Number,
      default: 0,
    },
    flag: false,
  },
  data: function () {
    return {
      searchParam: {
        // plantCd: '',
        // chemProdNmKr: '',
        safFacilityCd: '',
        equipmentNo: 0,
        // chemProdNos: [],
      },
      searchArea: {
        title: 'L0000000329', // '검색박스숨기기',
        show: true,
        height: 0,
      },
      gridOptions: {
        header: [],
        data: [],
        height: 500,
        merge: [],
      },
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '60%',
        top: '10px',
        param: {},
        closeCallback: null,
      },
      // savedChemprods: [],
      editable: false,
      chemProdNo: 0,
      chemProdRevNo: '0',
      // plantItems: [],
      searchUrl: '',
      deleteUrl: '',
      selectedValue: [],
      chemProds: [],
    };
  },
  watch: {
    'gridOptions.data': {
      handler: function (val, oldVal) {
        this.facilityMst.tubeChemprods = this.$_.uniqBy(
          this.gridOptions.data,
          'chemProdNo'
        );
        if (this.tubeEquipmentNo === 0 || this.tubeEquipmentNo === 1) {
          this.$_.forEach(this.facilityMst.tubeChemprods, (item) => {
            item.equipmentNo = this.tubeEquipmentNo;
          });
        }
        this.chemProds = val;
      },
      deep: true,
    },
  },
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {},
  beforeDestroy() {},
  //* methods */
  methods: {
    init() {
      // URL 셋팅
      this.searchUrl = selectConfig.psm.facilityChemprod.list.url;
      this.deleteUrl = transactionConfig.psm.facilityChemprod.delete.url;

      this.editable = this.$route.meta.editable;
      // this.getComboItems("COM_PLANT_CD"); // 사업장
      this.facilityMst.tubeCheck = true;
      this.getDataList();

      // 그리드 헤더 설정
      this.gridOptions.header = [
        { text: 'L0000001415', name: 'plantNm', width: '150', align: 'center' }, // 사업장
        {
          text: 'L0000003315',
          name: 'chemProdNmKr',
          width: '150',
          align: 'center',
        }, // 화학자재명
        { text: 'L0000003298', name: 'chemNmKr', width: '150', align: 'left' }, // 화학물질명
        { text: 'L0000000102', name: 'casNo', width: '150', align: 'center' }, // CAS No.
        {
          text: 'L0000001348',
          name: 'moleFormula',
          width: '150',
          align: 'left',
        }, // 분자식
        {
          text: 'L0000003147', // 폭발한계(%)
          child: [
            {
              text: 'L0000001540',
              name: 'explUpLimit',
              width: '80',
              align: 'right',
            }, // 상한
            {
              text: 'L0000003166',
              name: 'explLowLimit',
              width: '80',
              align: 'right',
            }, // 하한
          ],
        },
        {
          text: 'L0000000845',
          name: 'leakThresh',
          width: '130',
          align: 'left',
        }, // 노출기준
        { text: 'L0000000959', name: 'lc50', width: '180', align: 'left' }, // 독성치
        {
          text: 'L0000002261',
          name: 'flashingPnt',
          width: '130',
          align: 'right',
        }, // 인화점
        {
          text: 'L0000001104',
          name: 'IgnitionPnt',
          width: '130',
          align: 'right',
        }, // 발화점
        {
          text: 'L0000002744',
          name: 'vaporPressure',
          width: '130',
          align: 'right',
        }, // 증기압
        {
          text: 'L0000001335',
          name: 'corrosivenessYnNm',
          width: '130',
          align: 'center',
        }, // 부식성유무
        {
          text: 'L0000002210',
          name: 'extraReactionYnNm',
          width: '130',
          align: 'center',
        }, // 이상반응유무
        { text: 'L0000002271', name: 'dailyVol', width: '130', align: 'right' }, // 일일취급량
        { text: 'L0000002477', name: 'maxVol', width: '130', align: 'right' }, // 저장량
        { text: 'L0000001360', name: 'remark', width: '200', align: 'left' }, // 비고
      ];
      this.gridOptions.merge = [];
      var i = 0;
      for (; i <= this.gridOptions.header.length + 1; i++) {
        if (i !== 3 && i !== 4 && i !== 5) {
          this.gridOptions.merge.push({ index: i, field: 'chemProdNmKr' });
        }
      }
    },
    selectCheck() {
      if (!this.editable) return false;
      else return true;
    },
    // 화학물질 grid
    getDataList() {
      this.searchParam.safFacilityCd = this.facilityMst.safFacilityCd;
      this.searchParam.equipmentNo = this.tubeEquipmentNo;
      this.$http.url = this.searchUrl; // selectConfig.saf.facilityChemprod.list.url;
      this.$http.type = 'get';
      this.$http.param = this.searchParam;
      this.$http.request(
        (_result) => {
          this.gridOptions.data = this.$_.clone(_result.data);
          this.facilityMst.firstTubeChemprod = this.$_.clone(_result.data);
        },
        (_error) => {
          window.getApp.$emit(
            'APP_REQUEST_ERROR',
            'L0000005408' // '작업 중 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.'
          );
        }
      );
    },
    closePopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      if (data === 'CLOSE') return;

      // this.$_.forEach(this.$_.uniqBy(this.gridOptions.data, 'chemProdNo'), (item) => {
      //   data = this.$_.clone(this.$_.reject(data, { 'chemProdNo': item.chemProdNo }));
      // });
      // this.getDataList();
      // this.chemProds = this.$_.clone(data);
      // this.gridOptions.data = this.$_.clone(data);

      this.$_.forEach(data, (item) => {
        if (
          this.$_.findIndex(this.gridOptions.data, {
            chemProdNo: item.chemProdNo,
            chemNo: item.chemNo,
          }) === -1
        ) {
          this.gridOptions.data.push(item);
        }
      });
    },
    /** button 관련 이벤트 **/
    // 검색박스숨기기
    btnSearchVisibleClicked() {
      this.searchArea.show = !this.searchArea.show;
      if (this.searchArea.show) {
        this.searchArea.title = 'L0000000329'; // 검색박스숨기기
      } else this.searchArea.title = 'L0000003907'; // 검색박스보이기

      window.getApp.$emit('LOADING_PASS_COUNT', 1);
      // this.setGridSize();
    },
    // 검색
    btnSearchClickedCallback(_result) {
      this.getDataList();
    },
    // 버튼 에러 처리
    btnClickedErrorCallback(_result) {
      window.getApp.emit('APP_REQUEST_ERROR', _result);
    },
    btnAddChemprod() {
      this.popupOptions.target = () =>
        import(`${'../../common/chemProd/chemprodPopup.vue'}`);
      this.popupOptions.title = 'L0000003309'; // 화학자재
      this.popupOptions.visible = true;
      this.popupOptions.width = '80%';
      this.popupOptions.top = '10px';
      this.popupOptions.param = {
        safFacilityCd: this.facilityMst.safFacilityCd,
        equipmentNo: this.tubeEquipmentNo,
        chemProds: [],
        plantCd: this.facilityMst.plantCd,
        // 'saveChemprodNos': this.savedChemprods,
      };
      this.popupOptions.closeCallback = this.closePopup;
    },
    btnDeleteChemprod() {
      if (this.selectedValue.length === 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395' /* 안내 */,
          message: 'M0000000208', // '제외 할 데이터를 선택하세요.',
          type: 'warning',
        });
        return;
      } else {
        this.$_.forEach(this.selectedValue, (item) => {
          this.gridOptions.data = this.$_.clone(
            this.$_.reject(this.gridOptions.data, {
              chemProdNo: item.chemProdNo,
            })
          );
        });
        // window.getApp.$emit('CONFIRM', {
        //   title: '확인',
        //   message: '제외하시겠습니까?',
        //   type: 'info',
        //   // 확인 callback 함수
        //   confirmCallback: () => {
        //     // this.$http.url = this.deleteUrl;
        //     // this.$http.type = 'DELETE';
        //     // this.$http.param = {
        //     //   'data': Object.values(this.$_.clone(this.selectedValue))
        //     // };
        //     // this.$http.request((_result) => {
        //     //   window.getApp.$emit('ALERT', {
        //     //     title: '안내',
        //     //     message: '삭제되었습니다.',
        //     //     type: 'success',
        //     //   });
        //     //   this.getDataList();
        //     // }, (_error) => {
        //     //   window.getApp.$emit('APP_REQUEST_ERROR', _error);
        //     // });
        //   },
        //   // 취소 callback 함수
        //   cancelCallback: () => {
        //   }
        // });
      }
    },
    /** end button 관련 이벤트 **/
  },
};
</script>
