<!--
  목적 : 사용자검색
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
        <b-card header-class="default-card" body-class="default-body-card" class="py-0">
          <div slot="header">
            <!-- 검색 -->
            <y-label label="L0000000327" />
            <div class="float-right">
              <!-- 검색 -->
              <y-btn title="L0000000327" color="green" @btnClicked="searchBtnClicked" />
            </div>
          </div>
          <b-row>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 사업장 -->
              <y-select
                :width="8"
                :comboItems="plantItems"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                name="plantCd"
                label="L0000001415"
                v-model="searchParam.plantCd"
              ></y-select>
            </b-col>
            <!-- <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-plant reject type="search" v-model="searchParam.plantCd"></y-plant>
            </b-col>-->
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 성명 -->
              <y-text
                :width="8"
                :clearable="true"
                ui="bootstrap"
                name="userNm"
                label="L0000001630"
                v-model="searchParam.userNm"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 자격증명 -->
              <y-text
                :width="8"
                :clearable="true"
                ui="bootstrap"
                name="licenseNm"
                label="L0000004628"
                v-model="searchParam.licenseNm"
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
            <!-- 선택 -->
            <y-btn v-if="popupParam.multiple" title="L0000001561" color="orange" @btnClicked="selectUser" />
            <!-- 닫기 -->
            <y-btn title="L0000000881" @btnClicked="closePopup" />
          </div>
          <!-- HR 자격현황 목록 -->
          <y-data-table
            label="L0000004636"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            :height="gridOptions.height"
            v-model="gridOptions.selectedValue"
            @selectedRow="selectedRow"
            :use-paging="false"
            minHeight="300px"
            :use-server-paging="true"
            :pageTotal="searchParam.pageTotal"
            @onSortChange="tableSortChange"
          ></y-data-table>
          <div class="pagination-container">
            <el-pagination
              ref="pagination"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page.sync="searchParam.pageNumber"
              :page-size="searchParam.pageSize"
              :page-sizes="searchParam.pageSizes"
              layout="total, sizes, prev, pager, next, jumper, ->, slot"
              :total="searchParam.pageTotal"
            ></el-pagination>
          </div>
        </b-col>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
export default {
  /** attributes: name, components, props, data **/
  name: 'lcn-search',
  props: {
    popupParam: {
      type: Object,
      default: {},
    },
  },

  data() {
    return {
      searchParam: {
        plantCd: '',
        deptCd: '',
        userId: '',
        userNm: '',
        pageNumber: 1,
        pageSize: 20,
        pageTotal: 0,
        pageSizes: [10, 20],
        orderByExpression: '',
      },
      gridOptions: {
        header: [],
        data: [],
        selectedValue: [],
        height: '300px',
      },
      checkItemData: [],
      multiple: false,
      disabled: false,
      searchUrl: '',
      plantItems: [],
    };
  },
  computed: {},
  watch: {},
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
  },
  mounted() {
    window.addEventListener('resize', this.setGridSize);
    this.init();
  },
  beforeDestroy() {
    // 윈도우 resize event 제거-SPA 기반이므로 제거하지 않으면 다른페이지에서 해당 이벤트가 호출됨
    window.removeEventListener('resize', this.setGridSize);
  },

  /** methods **/
  methods: {
    /** 초기화 관련 함수 **/
    init() {
      this.editable = this.$route.meta.editable;
      this.searchParam.plantCd = this.$store.getters.plantCd;
      // 그리드 헤더 설정

      this.gridOptions.header = [
        { text: 'L0000001415', name: 'plantNm', width: '20%', align: 'center' }, // 사업장
        { text: 'L0000001287', name: 'deptNm', width: '20%', align: 'center' }, // 부서
        { text: 'L0000001630', name: 'userNm', width: '20%', align: 'center' }, // 성명
        {
          text: 'L0000004637', // 자격증종류
          name: 'licenseGubunNm',
          width: '20%',
          align: 'center',
        },
        { text: 'L0000004628', name: 'licenseNm', width: '20%', align: 'center' }, // 자격증명
        {
          text: 'L0000002305', // 자격증번호
          name: 'licenseNo',
          width: '20%',
          align: 'center',
        },
        { text: 'L0000002306', name: 'lcnGetDt', width: '20%', align: 'center' }, // 자격취득일
      ];

      this.searchUrl = selectConfig.saf.electHisHr.getLcn.url;

      this.getComboItems('COM_PLANT_CD');

      this.getList();
      this.setGridSize();
    },
    /** /초기화 관련 함수 **/

    /** Call API service */
    getList() {
      this.$http.url = this.searchUrl;
      this.$http.param = this.searchParam;
      this.$http.type = 'get';
      this.$http.request(
        _result => {
          this.searchParam.pageTotal = this.$_.clone(_result.data.count);
          this.gridOptions.data = this.$_.clone(_result.data.items);
          this.setGridSize();
        },
        _error => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    selectedRow(data) {
      // if (this.popupParam.multiple) return;
      this.$emit('closePopup', { success: true, data: data });
    },
    selectUser() {
      if (
        !this.gridOptions.selectedValue ||
        (this.gridOptions.selectedValue &&
          this.gridOptions.selectedValue.length === 0)
      ) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // 안내
          message: 'M0000000447', // 사용자를 먼저 지정하세요.
          type: 'warning', // success / info / warning / error
        });
        return;
      }
      this.$emit('closePopup', {
        success: true,
        users: this.gridOptions.selectedValue,
      });
    },
    closePopup() {
      // 부모창에 값 전달
      this.$emit('closePopup');
    },
    handleSizeChange(_newPageSize) {
      this.searchParam.pageSize = _newPageSize;
      this.getList();
    },
    handleCurrentChange(_newPage) {
      this.getList();
    },
    tableSortChange(_item) {
      this.searchParam.orderByExpression =
        this.$comm.toUndrFromCamelCase(_item.prop) +
        ' ' +
        (_item.order === 'descending' ? 'desc' : 'asc');
      this.getList();
    },
    setGridSize() {
      window.getApp.$emit('LOADING_SHOW');
      setTimeout(() => {
        this.gridOptions.height = 300;
        window.getApp.$emit('LOADING_HIDE');
      }, 600);
    },
    searchBtnClicked() {
      this.searchParam.pageNumber = 1;
      this.getList();
    },
    getComboItems(codeGroupCd) {
      this.$http.url = this.$format(
        selectConfig.codeMaster.getSelect.url,
        codeGroupCd
      );
      this.$http.type = 'GET';
      this.$http.request(
        _result => {
          if (codeGroupCd === 'COM_PLANT_CD') {
            this.plantItems = this.$_.clone(_result.data);
            this.plantItems.splice(0, 0, {
              code: null,
              codeNm: this.$comm.getLangSpecInfoLabel('L0000002519'), // 전체
            });
            this.plantItems = this.$_.reject(this.plantItems, { code: '0000' });
          }
        },
        _error => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
  },
};
</script>

<style scoped>
.pagination-container {
  background: #fff;
  padding: 0px 16px;
  text-align: center;
}
.pagination-container.hidden {
  display: none;
}
</style>