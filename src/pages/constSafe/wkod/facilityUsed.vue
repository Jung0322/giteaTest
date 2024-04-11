<!--
  목적 : 작업허가서 설비지정
  Detail : 작업허가서 설비지정 Tab
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <!-- 등록 -->
    <b-row>
      <b-col sm="12">
        <b-row></b-row>
        <b-row>
          <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
            <div slot="buttonGroup" class="float-right mb-1">
              <!--  추가-->
              <y-btn
                v-if="!updateMod && editable"
                title="L0000002892"
                color="orange"
                @btnClicked="openPopup"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!-- 제외 -->
              <y-btn
                v-if="!updateMod && editable"
                color="red"
                title="L0000002620"
                @btnClicked="btnDeleteClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
            </div>
            <!--설비 목록  -->
            <y-data-table
              label="L0000001581"
              ref="dataTable"
              :height="gridOptions.height"
              :headers="gridOptions.header"
              :items="gridOptions.data"
              v-model="selectValue"
              @tableLinkClicked="tableLinkClicked"
            >
              <el-table-column
                v-if="!updateMod && editable"
                type="selection"
                slot="selection"
                align="center"
                width="55"
              ></el-table-column>
            </y-data-table>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
    <y-dialog :param="popupOptions"></y-dialog>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
export default {
  /* attributes: name, components, props, data */
  name: 'facility-userd',
  props: {
    updateMod: false,
    wkodMaster: {
      type: Object,
      default: {
        wkodNo: '',
        wkodStepCd: '',
        bizApprStepCd: '',
        safFacilityCds: [],
      },
    },
  },
  data() {
    return {
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '80%',
        top: '50px',
        param: {},
        closeCallback: null,
      },
      gridOptions: {
        header: [],
        data: [],
        height: '300',
      },
      searchUrl: '',
      deleteUrl: '',
      editable: true,
      isDelete: false,
      selectValue: [],
      deleteValue: null,
    };
  },
  watch: {
    'gridOptions.data': {
      handler: function (val, oldVal) {
        this.wkodMaster.safFacilityCds = this.$_.clone(val);
      },
      deep: true,
    },
    'wkodMaster.bizApprStepCd'() {
      if (this.wkodMaster.bizApprStepCd === 'BAPSA') this.editable = false;
    },
  },
  //* Vue lifecycle: created, mounted, destroyed, etc */
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  updated() {
    // this.$nextTick(function () {
    //   this.$emit("wkodChkItem", this.wkodMaster)
    // })
  },
  mounted() {},
  beforeDestroy() {},
  //* methods */
  methods: {
    init() {
      // URL 셋팅
      this.searchUrl = selectConfig.saf.wkodMaster.getFacilities.url;
      this.deleteUrl = transactionConfig.saf.wkodMaster.deleteFacility.url;

      // 설비 grid 헤더
      this.gridOptions.header = [
        {
          text: 'L0000001597',
          name: 'safFacilityTypeNm',
          width: '150px',
          align: 'center',
        }, // 설비유형
        {
          text: 'L0000001596',
          name: 'facilityNm',
          width: '250px',
          align: 'left',
          url: 'link',
        }, // 설비명
      ];

      this.editable = this.$route.meta.editable;
      if (this.wkodMaster.bizApprStepCd === 'BAPSA') this.editable = false;

      if (this.wkodMaster.wkodNo) this.getList();
    },
    getList() {
      this.$http.url = this.searchUrl;
      this.$http.type = 'get';
      this.$http.param = {
        wkodNo: this.wkodMaster.wkodNo,
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
    // 그리드 row click 이벤트
    tableLinkClicked(header, data) {
      this.popupOptions.target = () =>
        import(`${'../../baseInfo/facility/createFacilityMst.vue'}`);
      this.popupOptions.title = 'L0000003659'; // 설비
      this.popupOptions.visible = true;
      this.popupOptions.width = '80%';
      this.popupOptions.top = '10px';
      this.popupOptions.param = {
        safFacilityCd: data ? data.safFacilityCd : '',
        facilityPsmCd: data.facilityPsmCd === 'FPSM0' ? '' : data.facilityPsmCd,
        title: 'L0000003576', // 설비 상세
        flag: true,
      };
      this.popupOptions.closeCallback = this.closeFacilityPopup;
    },
    openPopup() {
      this.popupOptions.param = {
        selectedFacilityMstValue: this.gridOptions.data,
      };
      this.popupOptions.target = () =>
        import(`${'../../baseInfo/facility/facilityMstPopup.vue'}`);
      this.popupOptions.title = 'L0000001580'; // 설비 등록
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closePopup;
    },
    closePopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      if (data === 'CLOSE') return;
      var i = 0;
      this.$_.forEach(this.gridOptions.data, (item) => {
        data = this.$_.clone(
          this.$_.reject(data, { safFacilityCd: item.safFacilityCd })
        );
      });
      this.$_.forEach(data, (item) => {
        this.gridOptions.data.splice(0, 0, {
          safFacilityTypeCd: item.safFacilityTypeCd,
          safFacilityTypeNm: item.safFacilityTypeNm,
          safFacilityCd: item.safFacilityCd,
          facilityNm: item.facilityNm,
          facilityPsmCd: item.facilityPsmCd,
          facilityPsmNm: item.facilityPsmNm,
          wkodNo: this.wkodMaster.wkodNo,
        });
      });
    },
    closeFacilityPopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
    },
    // 삭제
    btnDeleteClickedCallback(_result) {
      if (this.selectValue.length <= 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395' /* 안내 */,
          message: 'M0000000795', // '설비목록에서 계획을 한개이상 선택하세요.',
          type: 'warning', // success / info / warning / error
        });
        return;
      } else {
        window.getApp.$emit('CONFIRM', {
          title: 'L0000003321' /* 확인 */,
          message: 'M0000000093', // '제외하시겠습니까?',
          // TODO : 필요시 추가하세요.
          type: 'info', // success / info / warning / error
          // 확인 callback 함수
          confirmCallback: () => {
            this.$_.forEach(this.selectValue, (item) => {
              this.gridOptions.data = this.$_.reject(this.gridOptions.data, {
                safFacilityCd: item.safFacilityCd,
              });
            });

            window.getApp.$emit('ALERT', {
              title: 'L0000003395' /* 안내 */,
              message: 'M0000000686', // '제외되었습니다.',
              type: 'success', // success / info / warning / error
            });

            // var keys = [];
            // this.$_.forEach(this.selectValue, (item) => {
            //   if (item.safFacilityCheckResultNo !== 0)
            //   {
            //     keys.push({
            //       'safFacilityCheckResultNo': item.safFacilityCheckResultNo,
            //     });
            //   }
            // });
            // this.$http.url = this.deleteUrl;
            // this.$http.type = 'DELETE';
            // this.$http.param = {
            //   'data': Object.values(this.$_.clone(keys))
            // };
            // this.$http.request((_result) => {

            //   this.$_.forEach(this.selectValue, (item) => {
            //     this.gridOptions.data = this.$_.reject(this.gridOptions.data, { 'safFacilityCd': item.safFacilityCd });
            //   });

            //   window.getApp.$emit('ALERT', {
            //     title: '안내',
            //     message: '삭제되었습니다.',
            //     type: 'success',  // success / info / warning / error
            //   });
            // }, (_error) => {
            //   window.getApp.$emit('APP_REQUEST_ERROR', _error);
            // });
          },
          // 취소 callback 함수
          cancelCallback: () => {},
        });
      }
    },
    btnClickedErrorCallback(_result) {
      this.isDelete = false;
      window.getApp.emit('APP_REQUEST_ERROR', _result);
    },
  },
};
</script>

<style></style>
