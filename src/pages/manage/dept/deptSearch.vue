<!--
  목적 : 부서검색
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
            <y-label label="검색" />
            <div class="float-right">
              <y-btn
                :action-url="searchUrl"
                :param="searchParam"
                title="검색"
                color="green"
                action-type="get"
                @btnClicked="btnSearchClicked"
              />
            </div>
          </div>
          <b-row>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-tree-process
                type="search"
                name="processCd"
                v-model="searchParam.processCd"
              />
              <!-- <y-select
                :width="8"
                :comboItems="processNoItems"
                itemText="processNm"
                itemValue="processNo"
                ui="bootstrap"
                type="search"
                name="processNo"
                label="공정"
                v-model="searchParam.processNo"
                /> -->
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-text
                :width="8"
                :clearable="true"
                ui="bootstrap"
                name="deptNm"
                label="부서명"
                v-model="searchParam.deptNm"
              />
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>

    <b-row class="mt-3">
      <b-col sm="12" class="px-0">
        <b-col sm="12">
          <div slot="buttonGroup" class="float-right mb-1">
            <y-btn
              v-if="multiple"
              title="선택"
              color="blue"
              @btnClicked="selectUser"
            />
            <y-btn title="L0000000881" @btnClicked="closePopup" />
          </div>
          <y-data-table
            label="사용자 목록"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            v-model="gridOptions.selectedValue"
            @selectedRow="selectedRow"
          >
            <el-table-column
              v-if="multiple"
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
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
export default {
  /** attributes: name, components, props, data **/
  name: 'user-search', // 반드시 입력하세요(안 하면 warning 발생). 네이밍 룰은 현재 vue component의 파일명의 단어를 "-"로 구분(예:exam-data)하여 입력하시면 됩니다. 입력후 이 주석은 지워주세요.
  props: {
    popupParam: {
      type: Object,
      default: {
        multiple: false,
        processNo: 0,
        deptNm: '',
      },
    },
  },
  // TODO: 화살표 함수(=>)는 data에 사용하지 말 것
  //    data: () => { return { a: this.myProp }}) 화살표 함수가 부모 컨텍스트를 바인딩하기 때문에 this는 예상과 달리 Vue 인스턴스가 아니기 때문에 this.myProp는 undefined로 나옵니다.
  //    참고url: https://kr.vuejs.org/v2/api/index.html#data
  data() {
    return {
      // Naming Rule : JAVA model class와 연동되는 vue model은 model class명을 Camel case로 변환해서 선언하시고 기본값은 {}로 초기화 시켜주세요.
      // 예) ExamData -> examData: {},
      searchParam: {
        processCd: '',
        deptNm: '',
      },
      gridOptions: {
        header: [],
        data: [],
        selectedValue: [],
      },
      multiple: false,
      searchUrl: '',
    };
  },
  computed: {},
  watch: {},
  /** Vue lifecycle: created, mounted, destroyed, etc **/
  beforeCreate() {},
  created() {},
  beforeMount() {
    // TODO : data를 초기화 시켜줌(검색 조건 유지가 필요할 때는 삭제할 것)
    // 이유 : vue.js는 SPA기반으로 동작하기 때문에 페이지를 이동하더라도 기존 입력된 정보가 그대로 남아 있는 문제가 있음
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {},
  beforeDestory() {
    this.init();
  },
  /** methods **/
  methods: {
    /** 초기화 관련 함수 **/
    init() {
      // TODO : 여기에 초기 설정용 함수를 호출하거나 로직을 입력하세요.
      // 초기값 설정
      this.multiple = this.popupParam.multiple;
      // this.searchParam.processNo = this.popupParam.processNo;
      this.searchParam.deptNm = this.popupParam.deptNm;

      // 그리드 헤더 설정
      this.gridOptions.header = [
        { text: '공정', name: 'processNm', width: '50%', align: 'center' },
        { text: '부서명', name: 'deptNm', width: '50%', align: 'center' },
      ];

      this.searchUrl = selectConfig.manage.dept.list.url;

      this.getList();
    },
    /** /초기화 관련 함수 **/

    /** Call API service */
    getList() {
      this.$http.url = this.searchUrl;
      this.$http.param = this.searchParam;
      this.$http.type = 'get';
      this.$http.request(
        (_result) => {
          this.gridOptions.data = _result.data;
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    selectedRow(data) {
      this.$emit('closePopup', { success: true, dept: data });
    },
    selectUser() {
      this.$emit('closePopup', {
        success: true,
        depts: this.gridOptions.selectedValue,
      });
    },
    closePopup() {
      // 부모창에 값 전달
      this.$emit('closePopup', { success: true });
    },

    /** /Call API service **/

    /** Button Event **/
    btnSearchClicked() {
      this.getList();
    },
    /** /Button Event **/

    /** 기타 function **/
    /** /기타 function **/
  },
};
</script>
