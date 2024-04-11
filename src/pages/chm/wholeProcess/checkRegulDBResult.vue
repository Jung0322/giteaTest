<!--
  목적 : 화학물질관리 > 자재검토 > 규제db검증
  작성자 : kyk
  Detail : 규제db검증결과 확인 화면 
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <b-row ref="editBox">
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <div slot="buttonGroup" class="float-right mb-1">
              <el-tag size="medium" type="info">
                <!-- 적용을 누르시면 적용가능 규제항목을 설정합니다. -->
                <i class="el-icon-info"></i>
                {{ $comm.getLangSpecInfoLabel('L0000003864') }}
              </el-tag>
              <!-- 적용 -->
              <y-btn
                v-if="editable"
                title="L0000002482"
                color="orange"
                @btnClicked="btnSaveClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!-- 닫기 -->
              <y-btn title="L0000000881" @btnClicked="closePopup" />
            </div>
          </b-col>
        </b-row>
        <b-card>
          <b-row class="mt-3">
            <b-col sm="12">
              <!--적용가능 : 검증대상 구성물질(화학물질)에 모두 포함되어 있는 규제항목-->
              <!-- <el-tag size="medium" type="success">{{
                $comm.getLangSpecInfoLabel('L0000003865')
              }}</el-tag>  -->
              <!-- 규제해당 : 검증대상 구성물질(화학물질)의 기준값이 없거나, 있는경우 기준값을 만족하는 규제항목 -->
              <el-tag size="medium" type="success">{{
                $comm.getLangSpecInfoLabel('L0000003866')
              }}</el-tag>
              <br />
              <!-- 규제미해당 : 검증대상 구성물질(화학물질)의 규제항목으로 포함되어 있으나, 기준값을 만족하지 못하여 사용하지 못하는 규제항목 -->
              <el-tag size="medium" type="danger" class="mt-1">{{
                $comm.getLangSpecInfoLabel('L0000003867')
              }}</el-tag>
              <br />
              <!-- 규제DB검증결과 -->
              <y-data-table
                label="L0000003863"
                ref="dataTable"
                :height="gridOptions.height"
                :headers="gridOptions.header"
                :items="gridOptions.data"
                :span-options="gridOptions.merge"
                :useRownum="false"
              >
                <!-- <el-table-column slot="tag">
                  <template slot-scope="scope"> -->
                <!-- 적용가능 -->
                <!-- <el-button
                      v-if="
                        scope.row.chkVal === '규제해당' &&
                        scope.row.chemNo === '0'
                      "
                      size="mini"
                      type="success"
                    >
                      규제해당</el-button
                    > -->
                <!-- 적용가능 -->
                <!-- <el-button
                      v-else-if="scope.row.chkVal === '규제해당'"
                      size="mini"
                      type="warning"
                    >
                      규제해당</el-button
                    > -->
                <!-- 적용불가 -->
                <!-- <el-button v-else size="mini" type="danger">{{
                      $comm.getLangSpecInfoLabel('L0000003869')
                    }}</el-button>
                  </template>
                </el-table-column> -->
              </y-data-table>
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {
  /* attributes: name, components, props, data */
  name: 'check-reguldb-result',
  components: {},
  props: {
    popupParam: {
      type: Object,
      default: {
        checkResult: [],
      },
    },
  },
  data: function () {
    return {
      editable: false,
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
        height: 400,
        merge: [],
      },
    };
  },
  //* Vue lifecycle: created, mounted, destroyed, etc */
  beforeCreate() {},
  created() {},
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
      this.gridOptions.merge = [];
      this.gridOptions.header = [];

      this.gridOptions.merge.push({ index: 0, field: 'lawItemNm' });
      // 법규/규제항목명
      this.gridOptions.header.push({
        text: 'L0000003870',
        name: 'lawItemNm',
        width: '250px',
        align: 'left',
      });
      // 화학물질명(국문)
      this.gridOptions.header.push({
        text: 'L0000003304',
        name: 'chemNmKr',
        width: '150px',
        align: 'left',
      });
      // CAS No.
      this.gridOptions.header.push({
        text: 'L0000000102',
        name: 'casNo',
        width: '150px',
        align: 'left',
      });
      // 기준값
      this.gridOptions.header.push({
        text: 'L0000000786',
        name: 'stndVal',
        width: '100px',
        align: 'center',
      });
      // 단위
      this.gridOptions.header.push({
        text: 'L0000000870',
        name: 'unitNm',
        width: '100px',
        align: 'center',
      });
      // 함유량대표값
      this.gridOptions.header.push({
        text: 'L0000003871',
        name: 'rpval',
        width: '100px',
        align: 'center',
      });
      // 규제해당여부
      this.gridOptions.header.push({
        text: 'L0000003868',
        name: 'chkValNm',
        width: '100px',
        align: 'center',
      });

      this.gridOptions.data = this.popupParam.checkResult;
    },
    btnSaveClickedCallback(_result) {
      let _lists = [];
      this.$_.forEach(this.popupParam.checkResult, (item) => {
        if (item.chkVal === 'Y') {
          _lists.push({
            regulLawCd: item.regulLawCd,
            regulLawNm: item.regulLawNm,
            regulItemNo: item.regulItemNo,
          });
        }
      });
      this.$emit('closePopup', {
        apply: true,
        items: _lists,
      });
    },
    btnClickedErrorCallback(_result) {
      this.isSave = false;
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    closePopup(data) {
      this.$emit('closePopup', { apply: false });
    },
  },
};
</script>
