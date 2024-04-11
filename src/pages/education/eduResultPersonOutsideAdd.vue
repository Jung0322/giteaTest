<!--
  목적 : 교육결과 등록 팝업 > 교육이수자(외부) 탭
  작성자 : ksw
  Detail : 교육결과 등록 팝업 > 교육이수자(외부) 탭
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <b-row>
      <!-- 교육 계획 상세 -->
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- 교육 계획 상세 -->
            <y-label
              label="L0000000608"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 검색 -->
              <y-btn
                title="L0000000327"
                color="blue"
                @btnClicked="btnSearchClickedCallback"
              />
              <!-- 저장 -->
              <y-btn
                title="L0000002474"
                color="orange"
                @btnClicked="btnInsertClickedCallback"
              />
              <!-- 닫기 -->
              <y-btn title="L0000000881" @btnClicked="closePopup" />
            </div>
          </b-col>
        </b-row>
        <b-card>
          <b-row>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 공사업체 -->
              <y-text
                :width="8"
                ui="bootstrap"
                label="L0000000507"
                name="subconnNm"
                v-model="searchParam.vendor"
                :appendIcon="[{ icon: 'search', callbackName: 'searchVendor' }]"
                @searchVendor="searchVendor"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 성명 -->
              <y-text
                :width="8"
                :editable="editable"
                :required="true"
                ui="bootstrap"
                label="L0000001630"
                name="userNm"
                v-model="searchParam.userNm"
                v-validate="'required'"
              >
              </y-text>
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>
    <b-row class="mt-3">
      <b-col sm="12">
        <b-col sm="12" class="px-0">
          <y-data-table
            ref="answerTable"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            :useRownum="false"
            v-model="gridOptions.selectedItems"
          >
            <el-table-column
              type="selection"
              slot="selection"
              align="center"
              width="55"
            >
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
  /* attributes: name, components, props, data */
  name: 'edu-plan-exam-add',
  props: {
    popupParam: {
      type: Object,
      default: {
        examNo: 0,
      },
    },
  },
  data: () => ({
    searchParam: {
      vendor: '',
      userNm: '',
    },
    gridOptions: {
      header: [],
      data: [],
      height: '150',
      selectedItems: [],
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
    vendorList: [],
  }),
  //* Vue lifecycle: created, mounted, destroyed, etc */
  beforeCreate() {},
  created() {},
  update() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {},
  beforeDestroy() {},
  //* methods */
  methods: {
    init() {
      this.editable = this.$route.meta.editable;

      this.gridOptions.header = [
        { text: 'L0000001957', name: 'vendorNm', width: '100px', align: 'center' }, // 업체명
        {
          text: 'L0000001630', // 성명
          name: 'userNm',
          width: '50px',
          align: 'center',
          type: 'text',
        },
        {
          text: 'L0000001545', // 생년월일
          name: 'birthday',
          width: '100px',
          align: 'center',
          type: 'text',
        },
        { text: 'L0000001632', name: 'sex', width: '50px', align: 'center' }, // 성별
      ];

      this.vendorList = [
        {
          vendorNm: '마이크로캠',
          userNm: '홍길동',
          birthday: '1985-02-02',
          sex: 'M',
        },
        {
          vendorNm: '업체1',
          userNm: '이길동',
          birthday: '1975-01-01',
          sex: 'F',
        },
        {
          vendorNm: '업체2',
          userNm: '최길동',
          birthday: '1980-12-12',
          sex: 'M',
        },
      ];

      this.gridOptions.data = this.vendorList;
    },
    // 검색
    btnSearchClickedCallback() {},
    // 저장
    btnInsertClickedCallback() {
      this.gridOptions.selectedItems.forEach(item => {
        let index = this.$_.findIndex(this.gridOptions.data, {
          orderNo: item.orderNo,
        });
      });
      this.closePopup();
    },
    // 닫기
    closePopup(data) {
      this.$emit('closePopup');
    },
    searchVendor() {
      this.popupOptions.target = () =>
        import(`${'../vendor/baseInfo/vendorMaster.vue'}`);
      this.popupOptions.title = 'L0000001951'; // 업체
      this.popupOptions.visible = true;
      this.popupOptions.width = '80%';
      this.popupOptions.param = {
        popupMode: true,
        gubun: 'V',
      };
      this.popupOptions.closeCallback = this.closeVendorPopup;
    },
    closeVendorPopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;

      if (data.data !== 'C') {
        this.searchParam.vendor = data.data.vendorNm;
      }
    },
  },
};
</script>
