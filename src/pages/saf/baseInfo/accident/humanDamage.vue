<!--
  목적 : 안전 > 기준정보 > 인적피해
  작성자 : kdh
  Detail : 인적피해 관리
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <y-search-box :gridOptions="gridOptions" @enter="getList">
      <b-row slot="search">
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 인적피해명 -->
          <y-text
            :width="8"
            ui="bootstrap"
            label="L0000002241"
            name="codeNm"
            v-model="searchParam.codeNm"
          />
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 사용여부 -->
          <y-select 
            :width="8"
            :comboItems="useItems"
            itemText="codeNm"
            itemValue="code"
            label="L0000001439"
            ui="bootstrap"
            name="useYn"
            v-model="searchParam.useYn"
          />
        </b-col>
      </b-row>
    </y-search-box>
    <b-row class="mt-3">
      <b-col sm="12">
        <b-col sm="12" class="px-0">
          <div slot="buttonGroup" class="float-right mb-1">
            <!-- 신규등록 -->
            <y-btn
              v-if="editable"
              title="L0000001789"
              color="orange"
              @btnClicked="btnPopupClickedCallback"
            />
            <!-- 검색 -->
            <y-btn title="L0000000327" color="green" @btnClicked="getList" />
          </div>
          <!-- 인적피해 목록 -->
          <y-data-table
            ref="dataTable"
            label="L0000002237"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            :use-paging="true"
            @tableLinkClicked="tableLinkClicked"
          />
        </b-col>
      </b-col>
    </b-row>

    <y-dialog :param="popupOptions"></y-dialog>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
export default {
  /** attributes: name, components, props, data **/
  name: 'y-human-damage',
  props: {},
  data() {
    return {
      searchParam: {
        codeNm: '',
        useYn: 'Y',
        // forSystemYn: 'Y',
      },
      gridOptions: {
        header: [],
        data: [],
        height: 'auto',
      },
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '80%',
        top: '10px',
        param: {},
        closeCallback: null,
      },
      useItems: [],
      editable: false,
      searchUrl: '',
    };
  },
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {
  },
  beforeDestroy() {
  },
  methods: {
    init() {
      this.editable = this.$route.meta.editable;
      this.searchUrl = selectConfig.saf.accidentHumanDamage.list.url;

      this.useItems = [
        { code: '', codeNm: this.$comm.getLangSpecInfoLabel('L0000002519'), }, // 전체
        { code: 'Y', codeNm: this.$comm.getLangSpecInfoLabel('L0000001440'), }, // 사용
        { code: 'N', codeNm: this.$comm.getLangSpecInfoLabel('L0000001063'), }, // 미사용
      ]
      // 그리드 헤더 설정
      this.gridOptions.header = [
        { text: 'L0000002969', name: 'code', width: '100px', align: 'center' }, // 코드
        { text: 'L0000002241', name: 'codeNm', width: '250px', url: 'true' }, // 인적피해명
        { text: 'L0000001439', name: 'useYnNm', width: '100px', align: 'center' }, // 사용여부
        {
          text: 'L0000002355', /* 작성자 */
          name: 'writerUserNm',
          width: '130px',
          align: 'center',
        },
        { 
          text: 'L0000002352', /* 작성일 */
          name: 'writerDt', 
          width: '130px', 
          align: 'center',
        },
      ];

      this.getList();
    },
    getList() {
      this.$http.url = this.searchUrl;
      this.$http.type = 'get';
      this.$http.param = this.searchParam;
      this.$http.request(
        _result => {
          this.gridOptions.data = _result.data;
        },
        _error => {
          window.getApp.$emit(
            'APP_REQUEST_ERROR',
            _error
          );
        }
      );
    },
    /**
     * 수정 팝업 호출
     */
    tableLinkClicked(header, data) {
      if (data === null || data === undefined) return;
      this.popupOptions.target = () => import(`${'./humanDamageDetail.vue'}`);
      this.popupOptions.title = 'L0000002239'; // 인적피해 상세 등록/수정
      this.popupOptions.visible = true;
      this.popupOptions.param = data;
      this.popupOptions.closeCallback = this.closePopupUsage;
    },
    /**
     * 등록 팝업  호출
     */
    btnPopupClickedCallback() {
      this.popupOptions.target = () => import(`${'./humanDamageDetail.vue'}`);
      this.popupOptions.title = 'L0000002239'; // 인적피해 상세 등록/수정
      this.popupOptions.visible = true;
      this.popupOptions.param = {
        code: '',
      };
      this.popupOptions.closeCallback = this.closePopupUsage;
    },
    closePopupUsage(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.getList();
    },
  },
};
</script>