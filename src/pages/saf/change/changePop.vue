<!--
  목적 : 안전 - 변경관리
  Detail : 변경관리 조회 화면
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <y-search-box :gridOptions="gridOptions" @enter="getList">
      <b-row slot="search">
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 기간(요청일) -->
          <y-datepicker
            :width="8"
            :range="true"
            label="L0000000771"
            name="rqstPeriod"
            v-model="searchParam.rqstPeriod"
          />
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 변경구분 -->
          <y-select
            :width="8"
            :comboItems="chngClsCdItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            name="chngAttCd"
            label="L0000001226"
            v-model="searchParam.chngAttCd"
          ></y-select>
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 제목 -->
          <y-text :width="8" ui="bootstrap" label="L0000002616" name="bizNm" v-model="searchParam.bizNm"></y-text>
        </b-col>
      </b-row>
    </y-search-box>
    <!-- 검색 결과 테이블 -->
    <b-row class="mt-3">
      <b-col sm="12">
        <b-col sm="12" class="px-0">
          <div slot="buttonGroup" class="float-right mb-1">
            <!-- 검색 -->
            <y-btn
              title="L0000000327"
              color="green"
              @btnClicked="getList"
            />
            <!-- 선택 -->
            <y-btn title="L0000001561" color="orange" @btnClicked="btnAdd" />
            <!-- 닫기 -->
            <y-btn title="L0000000881" @btnClicked="closePopup('CLOSE')" />
          </div>
          <!-- 변경관리 목록 -->
          <y-data-table
            ref="dataTable"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            :use-paging="true"
            label="L0000001222"
            @selectedRow="selectedRow"
            @rowDoubleClicked="rowDoubleClicked"
          ></y-data-table>
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
  name: 'y-change-pop',
  props: {
    popupParam: {
      type: Object,
      default: {
        plantCd: '',
        chngRefWorkCd: '',
      },
    },
  },
  data: () => ({
    searchParam: {
      plantCd: '',
      rqstPeriod: [],
      chngStepCd: 'CGSP98',
      chngRefWorkCd: '',
      chngAttCd: null,
      bizNm: '',
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
      param: {},
      width: '80%',
      top: '10px',
      closeCallback: null,
    },
    editable: false,
    chngClsCdItems: [], // 변경종류
    selectRow: null,
    searchUrl: '',
  }),
  watch: {},
  //* Vue lifecycle: created, mounted, destroyed, etc */
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
  },
  mounted() {
    this.init();
  },
  beforeDestroy() {
  },
  //* methods */
  methods: {
    init() {
      this.editable = this.$route.meta.editable;
      // Url Setting
      this.searchUrl = selectConfig.saf.change.list.url;

      // 기간 Setting
      let today = this.$comm.getToday();
      let from = this.$comm.getCalculatedDate(
        today,
        '-3m',
        'YYYY-MM-DD',
        'YYYY-MM-DD'
      );
      this.searchParam.rqstPeriod = [from, today];
      this.searchParam.plantCd = this.popupParam.plantCd
      this.searchParam.chngRefWorkCd = this.popupParam.chngRefWorkCd

      // 그리드 헤더 설정
      this.gridOptions.header = [
        { text: 'L0000001415', name: 'plantNm', width: '150px', align: 'center' }, // 사업장
        {
          text: 'L0000002777', // 진행단계
          name: 'chngStepNm',
          width: '150px',
          align: 'center',
        },
        {
          text: 'L0000002616', // 제목
          name: 'bizNm',
          width: '250px',
          align: 'left',
        },
        {
          text: 'L0000000451', // 결재진행단계
          name: 'bizApprStepNm',
          width: '120px',
          align: 'center',
        },
        {
          text: 'L0000001226', // 변경구분
          name: 'chngAttNm',
          width: '100px',
          align: 'center',
        },
        { text: 'L0000001042', name: 'chngNum', width: '120px', align: 'center' }, // 문서번호
        { text: 'L0000002055', name: 'rqstDt', width: '120px', align: 'center' }, // 요청일
        {
          text: 'L0000002053', // 요청부서
          name: 'rqstDeptNm',
          width: '120px',
          align: 'center',
        },
        { text: 'L0000002057', name: 'rqstUserNm', width: '100px', align: 'center' }, // 요청자
        {
          text: 'L0000002043', // 완료일
          name: 'confirmDt',
          width: '120px',
          align: 'center',
        },
      ];

      // 변경구분
      this.$comm.getComboItems('SAF_CHNG_ATT', true).then(_result => {
        this.chngClsCdItems = _result;
      });

      this.getList(); // 변경관리 목록 조회
    },
    /** 변경관리 목록 검색 **/
    getList() {
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = this.searchParam;
      this.$http.request(
        _result => {
          this.gridOptions.data = this.$_.clone(_result.data);
        },
        _error => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    btnAdd() {
      if (!this.selectRow) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // 안내
          message: 'M0000001031', // 선택된 변경관리가 없습니다.
          type: 'warning',
        });
      } else {
        this.closePopup(this.selectRow);
      }
    },
    selectedRow(data) {
      this.selectRow = data;
    },
    rowDoubleClicked(data) {
      this.closePopup(data);
    },
    closePopup(data) {
      this.$emit('closePopup', data);
    },
  },
};
</script>