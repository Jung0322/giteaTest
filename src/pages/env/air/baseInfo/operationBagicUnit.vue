<!--
  목적 : 환경 > 대기 > 운영일지 > 운영일지 구분
  작성자 : 
  Detail : 
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
          ></y-plant>
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 작성부서 -->
          <y-tree-dept
            type="search"
            label="L0000002348"
            name="deptCd"
            v-model="searchParam.deptCd"
            :plantCd="searchParam.plantCd"
          />
        </b-col>
      </b-row>
    </y-search-box>
    <b-row class="mt-3">
      <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-3">
        <div slot="buttonGroup" class="float-right mb-1">
          <!-- 검색 -->
          <y-btn title="L0000004421" color="green" @btnClicked="addOutlet" />
          <!-- 배출구 추가 -->
          <y-btn title="L0000000327" color="green" @btnClicked="getList" />
        </div>

        <!-- <el-tree
          :data="data"
          node-key="id"
          default-expand-all
          :expand-on-click-node="false"
          :style="{ height: this.height + 'px' }"
        >
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span>{{ data.label }}</span>
            <span>
              <el-button size="mini" @click="() => append(data)"
                >배출구 추가</el-button
              >
              <el-button @click="() => remove(node, data)"
                >방지시설 추가</el-button
              >
            </span>
          </span>
        </el-tree> -->
        <!-- 최상위 메뉴명 -->
        <y-tree-data-table
          :headers="gridOptions.header"
          :items="menuTreeDataTable"
          :height="gridOptions.height"
          :defaultExpandAll="false"
          expandHeaderNm="L0000002885"
          expand-column-name="menuNm"
          expand-column-width="300"
          data-key="menuId"
          parent-key="upMenuId"
          @tableLinkClicked="tableLinkClicked"
        >
          <!-- 작업방법(상세설명) -->
          <el-table-column
            slot="endExpand"
            :label="$comm.getLangSpecInfoLabel('L0000004422')"
            header-align="center"
            align="center"
            min-width="100px"
          >
            <template slot-scope="scope">
              <y-textarea
                :editable="editable"
                :showMaxLength="false"
                :rows="1"
                rowClass
                ui="bootstrap"
                :name="'wrokMe' + scope.$index"
                v-model="scope.row['wrokMe']"
              />
            </template>
          </el-table-column>
        </y-tree-data-table>
      </b-col>
      <!-- <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
        <div slot="buttonGroup" class="float-right mb-1">
          <y-btn title="L0000000327" color="green" @btnClicked="aGetList" />
        </div>
        <y-data-table
          ref="dataTable"
          :height="aGridOptions.height"
          :headers="aGridOptions.header"
          :items="aGridOptions.data"
          :span-options="aGridOptions.merge"
          :useRownum="false"
          :excelDown="false"
          @tableLinkClicked="tableLinkClicked"
        />
      </b-col> -->
    </b-row>
  </b-container>
</template>
<script>
import YTree from '@/components/YTree';
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
export default {
  name: 'operation-bagic-unit',
  components: {
    'y-tree': YTree,
  },
  props: {},
  data: function () {
    return {
      searchParam: {
        plantCd: '',
        deptCd: '',
      },

      gridOptions: {
        header: [],
        data: [],
        height: 'auto',
        merge: [],
      },
      aGridOptions: {
        header: [],
        data: [],
        height: 'auto',
        merge: [],
      },
      hearFlag: 'O',
      height: 100,
    };
  },
  watch: {},
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
  },
  mounted() {
    this.init();
  },
  beforeDestory() {},
  //* methods */
  methods: {
    init() {
      this.searchParam.plantCd = this.$store.getters.plantCd;
      this.setGridSize();

      this.getOperationDepts(); // 작성부서
      this.setGridHeader();
      this.aGetList();
    },
    setGridHeader() {
      if (this.hearFlag === 'O') {
        this.aGridOptions.header = [
          {
            text: 'L0000001147', // 배출구명
            name: 'mainDischFacNm',
            width: '33%',
            align: 'center',
            url: true,
          },
          {
            text: 'L0000004412', // 일련번호
            name: 'eairOutletNm',
            width: '33%',
            align: 'center',
          },
          {
            text: 'L0000004423', // 허가증상번호
            name: 'eairOutletPermitNo',
            width: '34%',
            align: 'center',
          },
        ];
      }
    },
    aGetList() {
      this.$http.url = selectConfig.env.air.baseInfo.outlet.list.url;
      this.$http.type = 'GET';
      this.$http.param = {
        eairOutletNm: '',
        mainDischFacNm: '',
        mgDeptCd: '',
        plantCd: '1000',
        useYn: 'Y',
      };
      this.$http.request(
        (_result) => {
          this.aGridOptions.data = _result.data;
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    tableLinkClicked(header, row) {
      this.gridOptions.data.push({
        eairOutletNo: row.eairOutletNo,
        mainDischFacNm: row.mainDischFacNm,
        eairPreventNo: 0,
        gubun: '',
        preventOrder: 0,
        eairDischFacNo: 0,
      });
    },

    addOutlet() {
      this.gridOptions.data.push({
        eairOutletNo: 0,
        eairPreventNo: 0,
        gubun: '',
        preventOrder: 0,
        eairDischFacNo: 0,
      });
    },

    append(data) {
      let id = 0;
      const newChild = { id: id++, label: 'testtest', children: [] };
      if (!data.children) {
        this.$set(data, 'children', []);
      }
      data.children.push(newChild);
    },
    remove(node, data) {
      const parent = node.parent;
      const children = parent.data.children || parent.data;
      const index = children.findIndex((d) => d.id === data.id);
      children.splice(index, 1);
    },

    getList() {},
    getOperationDepts() {
      this.$http.url = selectConfig.env.air.operationLog.getDepts.url;
      this.$http.type = 'GET';
      this.$http.param = {
        plantCd: this.searchParam.plantCd,
      };
      this.$http.request(
        (_result) => {
          _result.data.splice(0, 0, {
            deptCd: null,
            deptNm: this.$comm.getLangSpecInfoLabel('L0000003394'), // 선택하세요
          }); // '선택하세요',
          this.deptItems = this.$_.clone(_result.data);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    setGridSize() {
      window.getApp.$emit('LOADING_SHOW');
      setTimeout(() => {
        this.height = window.innerHeight - 270;
        window.getApp.$emit('LOADING_HIDE');
      }, 600);
    },
  },
};
</script>
