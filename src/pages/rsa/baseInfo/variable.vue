<!--
  목적 : 위험성평가 > 기준정보 > 변수
  작성자 : kdh
  Detail :
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <!-- 아래 그리드 사이즈 강제 설정을 위해 y-search-box 생성 -->
    <y-search-box :gridOptions="gridOptions" v-show="false"></y-search-box>
    <!-- 변수 Grid -->
    <b-row >
      <b-col sm="12">
        <b-col sm="12" class="px-0">
          <div slot="buttonGroup" class="float-right mb-1">
            <!-- 신규등록 -->
            <y-btn title="L0000001789" color="orange" @btnClicked="openPopup" />
          </div>
            <!-- 변수 목록 -->
          <y-data-table 
            label="L0000001237"
            ref="dataTable"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            :use-paging="true"
            @tableLinkClicked="tableLinkClicked"
            >
          </y-data-table>
        </b-col>
      </b-col>
    </b-row>
    <!-- 변수 popup -->
    <y-dialog :param="popupOptions"></y-dialog>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
export default {
  name: 'y-variable',
  props: {
  },
  data () {
    return {
      editable: false,
      gridOptions: {
        header: [],
        data: [],
        height: 'auto',
      },
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        param: {},
        width: '70%',
        top: '10px',
        closeCallback: null,
      },
    };
  },
  watch: {
  },
  beforeMount () {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted () {
  },
  beforeDestroy () {
  },
  /** methods **/
  methods: {
    /** 초기화 관련 함수 **/
    init () {
      this.editable = this.$route.meta.editable;
      this.getList();

      // 변수 grid 헤더 설정
      this.gridOptions.header = [
        { text: 'L0000001242', name: 'varNmKr', width: '200px', align: 'left', url: 'link' }, // 변수명(kor)
        { text: 'L0000001241', name: 'varNmEn', width: '200px', align: 'left' }, // 변수명(eng)
        { text: 'L0000001439', name: 'useYnNm', width: '100px', align: 'center' }, // 사용여부
      ];
    },
    // 변수 grid
    getList () {
      this.$http.url = selectConfig.rsa.variable.list.url;
      this.$http.type = 'GET';
      this.$http.request((_result) => {
        this.gridOptions.data = _result.data;
      }, (_error) => {
        window.getApp.$emit('APP_REQUEST_ERROR', _error);
      });
    },
    // 그리드 link click 이벤트
    tableLinkClicked (header, data) {
      this.openPopup(data);
    },
    openPopup(data) {
      this.popupOptions.title = 'L0000001236'; // 변수
      this.popupOptions.param = {
        varId: data ? data.varId : 0,
      };
      this.popupOptions.target = () => import(`${'./variableDetail.vue'}`);
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closePopup;
    },
    closePopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.getList();
    },
    /** /Button Event **/
  }
};
</script>