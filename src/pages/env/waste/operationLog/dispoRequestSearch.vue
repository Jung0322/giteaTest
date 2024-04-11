<!--
  목적 : 폐기물-폐기물 처리요청 검색
  작성자 : khk
  Detail : 
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <b-row>
      <b-col sm="12">
        <b-card
          header-class="default-card"
          body-class="default-body-card"
          class="py-0"
        >
          <div slot="header">
            <!-- 검색 -->
            <y-label label="L0000000327" />
            <div class="float-right">
              <!-- 검색 -->
              <y-btn
                title="L0000000327"
                color="green"
                @btnClicked="btnSearchClicked"
              />
            </div>
          </div>
          <b-row>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-plant
                type="edit"
                :required="true"
                :editable="editable"
                name="plantCd"
                v-model="searchParam.plantCd"
                v-validate="'required'"
                :state="validateState('plantCd')"
              />
            </b-col>

            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 요청일 -->
              <y-datepicker
                :width="8"
                :range="true"
                label="L0000002055"
                name="reqYmdPeriod"
                v-model="searchParam.reqYmdPeriod"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 처리상태 -->
              <y-select
                :width="8"
                :comboItems="ewstDispoStCdItems"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                name="ewstDispoStCd"
                label="L0000002830"
                v-model="searchParam.ewstDispoStCd"
              ></y-select>
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>

    <b-row class="mt-3">
      <b-col sm="12">
        <b-col sm="12" class="px-0">
          <div slot="buttonGroup" class="float-right mb-1">
            <y-btn title="L0000000881" @btnClicked="closePopup" />
          </div>
          <!-- 폐기물 처리요청 목록 -->
          <y-data-table
            ref="dataTable"
            label="L0000003116"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            @selectedRow="selectedRow"
          />
        </b-col>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
export default {
  name: 'dispo-request-search',
  props: {
    popupParam: {
      type: Object,
      default: {
        unselectedComplete: false,
      },
    },
  },
  data() {
    return {
      searchParam: {
        reqYmdPeriod: '',
        ewstDispoStCd: '',
        plantCd: '',
      },
      gridOptions: {
        header: [],
        data: [],
        height: '250',
      },
      ewstDispoStCdItems: [],
      searchUrl: '',
    };
  },
  computed: {},
  watch: {},
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {},
  beforeDestory() {},
  methods: {
    init() {
      // 선택항목 설정
      setTimeout(() => {
        this.getEwstDispoStCdItems();
      }, 200);

      // 그리드 헤더 설정
      this.gridOptions.header = [
        {
          text: 'L0000003120',
          name: 'ewstClassNm',
          width: '160px',
          align: 'center',
        }, // 폐기물분류
        { text: 'L0000003102', name: 'ewstWasteNm', width: '160px' }, // 폐기물
        {
          text: 'L0000002055',
          name: 'reqYmd',
          width: '120px',
          align: 'center',
        }, // 요청일
        {
          text: 'L0000002053',
          name: 'reqDeptNm',
          width: '120px',
          align: 'center',
        }, // 요청부서
        {
          text: 'L0000002057',
          name: 'reqUserNm',
          width: '120px',
          align: 'center',
        }, // 요청자
        {
          text: 'L0000002830',
          name: 'ewstDispoStNm',
          width: '100px',
          align: 'center',
        }, // 처리상태
        { text: 'L0000001075', name: 'amtGen', width: '100px', align: 'right' }, // 발생량
        {
          text: 'L0000000870',
          name: 'envUnitNm',
          width: '120px',
          align: 'center',
        }, // 단위
        { text: 'L0000001360', name: 'remark', width: '350px' }, // 비고
        {
          text: 'L0000000973',
          name: 'createDt',
          width: '200px',
          align: 'center',
        }, // 등록일
        {
          text: 'L0000000976',
          name: 'createUserNm',
          width: '120px',
          align: 'center',
        }, // 등록자
        {
          text: 'L0000001697',
          name: 'updateDt',
          width: '200px',
          align: 'center',
        }, // 수정일
        {
          text: 'L0000001698',
          name: 'updateUserNm',
          width: '120px',
          align: 'center',
        }, // 수정자
      ];

      this.searchUrl =
        selectConfig.env.waste.operationLog.disposalRequest.list.url;

      this.getList();
    },

    getList() {
      var items = [];
      this.$http.url = this.searchUrl;
      this.$http.type = 'get';
      this.$http.param = this.searchParam;
      this.$http.request(
        (_result) => {
          if (this.popupParam.unselectedComplete) {
            _result.data.forEach((item) => {
              if (!(item.ewstDispoStCd === '91')) {
                items.push(item);
              }
            });
          }
          this.gridOptions.data = items;
        },
        (_error) => {
          window.getApp.$emit(
            'APP_REQUEST_ERROR',
            'L0000005408'
            // '작업 중 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.'
          );
        }
      );
    },

    getEwstDispoStCdItems() {
      this.$http.url = this.$format(
        selectConfig.manage.codeMaster.getSelect.url,
        'EWST_DISPO_ST'
      );
      this.$http.type = 'get';
      this.$http.request(
        (_result) => {
          _result.data.splice(0, 0, {
            code: null,
            codeNm: this.$comm.getLangSpecInfoLabel('L0000003394'),
          }); // 전체
          this.ewstDispoStCdItems = _result.data;
        },
        (_error) => {
          window.getApp.$emit(
            'APP_REQUEST_ERROR',
            'L0000005408'
            // '작업 중 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.'
          );
        }
      );
    },

    btnSearchClicked() {
      this.getList();
    },
    selectedRow(data) {
      this.$emit('closePopup', { success: true, dispoReq: data });
    },
    closePopup() {
      // 부모창에 값 전달
      this.$emit('closePopup', { success: true });
    },
  },
};
</script>
