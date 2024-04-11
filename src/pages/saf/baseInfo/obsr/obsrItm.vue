<!--
  목적 : 안전 > 기준정보 > 안전관찰항목
  작성자 : jkl
  Detail : 안전관찰항목 목록
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <y-search-box :gridOptions="gridOptions" @enter="getList">
      <b-row slot="search">
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <y-plant
            type="search"
            name="plantCd"
            v-model="searchParam.plantCd"
          />
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <y-text
            :width="8"
            label="안전관찰 항목명"
            name="obsrItmNm"
            v-model="searchParam.obsrItmNm"
          />
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <y-select 
            :width="8"
            :comboItems="useItems"
            itemText="codeNm"
            itemValue="code"
            label="사용여부"
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
            <y-btn
              v-if="editable"
              title="신규등록"
              color="orange"
              @btnClicked="openPopup(null)"
            />
            <y-btn
              title="검색"
              color="green"
              @btnClicked="getList"
            />
          </div>
          <y-data-table
            ref="dataTable"
            label="안전관찰항목 목록"
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
  /* attributes: name, components, props, data */
  name: 'obsr-itm',
  props: {},
  data() {
    return {
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
        top: '60px',
        param: {},
        closeCallback: null,
      },
      searchParam: {
        plantCd: '',
        obsrItmNm: '',
        useYn: 'Y',
      },
      useItems: [
        { code: '', codeNm: '전체' },
        { code: 'Y', codeNm: '사용' },
        { code: 'N', codeNm: '미사용' },
      ],
      editable: true,
    }
  },
  //* Vue lifecycle: created, mounted, destroyed, etc */
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
  },
  mounted() {
    this.init();
  },
  beforeDestroy() {},
  //* methods */
  methods: {
    init() {
      this.editable = this.$route.meta.editable;
      this.gridOptions.header = [
        { text: '사업장', name: 'plantNm', width: '100px', align: 'center' },
        { text: '관찰항목분류', name: 'itmTypeNm', width: '110px', align: 'left' },
        { text: '관찰항목명', name: 'obsrItmNm', width: '150px', align: 'left', url: 'link' },
        { text: '사용여부', name: 'useYnNm', width: '80px', align: 'center' },
      ];
      this.getList();
    },
    getList() {
      this.$http.url = selectConfig.saf.obsrItm.list.url;
      this.$http.type = 'GET';
      this.$http.param = this.searchParam;
      this.$http.request(
        _result => {
          this.gridOptions.data = _result.data;
        },
        _error => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        },
      );
    },
    tableLinkClicked(header, data) {
      if (!data) return;
      this.openPopup(data);
    },
    openPopup(data) {
      this.popupOptions.target = () => import(`${'./obsrItmDetail.vue'}`);
      this.popupOptions.title = data ? '안전관찰항목 상세' : '안전관찰항목 등록';
      this.popupOptions.visible = true;
      this.popupOptions.param = {
        safObsrItmNo: data ? data.safObsrItmNo : null,
      };
      this.popupOptions.closeCallback = this.closePopup;
    },
    closePopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.getList();
    },
  }
}
</script>