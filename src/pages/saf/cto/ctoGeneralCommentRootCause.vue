<!--
  목적 : 안전관찰 > 안전관찰 상세 > 총평/근본원인 탭
  Detail : 총평/근본원인 탭 화면
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <b-row>
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- 안전관찰 총평 -->
            <y-label label="L0000001852" icon="user-edit" color-class="cutstom-title-color" />
          </b-col>
        </b-row>
        <b-card>
          <b-row>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
              <!-- 우선사항 -->
              <y-textarea
                :width="10"
                :editable="editable"
                :disabled="disabled"
                :maxlength="300"
                ui="bootstrap"
                label="L0000002070"
                name="mainAct"
                v-model="cto.mainAct"
              ></y-textarea>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
              <!-- 개선사항 -->
              <y-textarea
                :width="10"
                :editable="editable"
                :disabled="disabled"
                :maxlength="300"
                ui="bootstrap"
                label="L0000000259"
                name="content"
                v-model="cto.content"
              ></y-textarea>
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>
    <b-row class="mt-3">
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <y-label label="L0000001352" icon="user-edit" color-class="cutstom-title-color" />  <!-- 불안전한 행동의 근본원인 -->
          </b-col>
        </b-row>
        <b-card>
          <b-row>
            <b-col
              v-for="(att, index) in attItem"
              :key="index"
              sm="12"
              md="12"
              lg="12"
              xl="12"
              class="col-xxl-6"
            >
              <y-multi-select
                :width="10"
                :comboItems="att.comboItem"
                :needDefaultView="true"
                :editable="editable"
                :disabled="disabled"
                type="edit"
                itemText="itmNm"
                itemValue="itmCd"
                ui="bootstrap"
                :label="att.codeNm"
                :maxHeight="250"
                v-model="att.itmCd"
              ></y-multi-select>
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
export default {
  /* attributes: name, components, props, data */
  name: 'y-cto-general-comment-root-cause',
  props: {
    attItem: {
      type: Array,
      default: function() {
        return [];
      },
    },
    disabled: false,
    cto: {
      type: Object,
      default: {
        safCtoNo: 0,
        mainAct: '',
        content: '',
        ctoActCauses: [],
      },
    },
  },
  data: () => ({
    // TODO : 현재까지 파악된 바로는 tab은 같은 폴더 또는 하위 폴더의 컴포넌트만 접근이 가능한 것으로 파악됨
    //                즉, 반드시 메인페이지 역할을 하는 vue와 동일 폴더나 하위 폴더에 tabItem 역할을 하는 vue 파일을 위치 시킬 것
    editable: true,
    attItemTemp: [],
  }),
  watch: {
    attItem: {
      handler: function(newValue, oldValue) {
      },
      deep: true,
    },
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

      this.getComboItems('SAF_CTO_CAU_CLS'); // 항목분류
    },
    /**
     * 공통 마스터 정보 조회 (날씨, 사고유형)
     * codeGroupCd : 마스터 테이블 codeGroupCd 정보
     */
    getComboItems(codeGroupCd) {
      this.$http.url = this.$format(
        selectConfig.codeMaster.getSelect.url,
        codeGroupCd
      );
      this.$http.type = 'GET';
      this.$http.request(
        _result => {
          if (codeGroupCd === 'SAF_CTO_CAU_CLS') {
            this.attItemTemp = this.$_.clone(_result.data);
            this.getComboItems('SAF_CTO_CAU_ITM'); // 항목코드
          } else if (codeGroupCd === 'SAF_CTO_CAU_ITM') {
            this.$_.forEach(this.attItemTemp, att => {
              let filterData = this.$_.filter(_result.data, {
                attr1: att.code,
              });
              att.comboItem = [];
              this.$_.forEach(filterData, filter => {
                att.comboItem.splice(0, 0, {
                  itmCd: filter.code,
                  itmNm: filter.codeNm,
                });
              });
              att.itmCd = [];
              if (this.cto.ctoActCauses && this.cto.ctoActCauses.length > 0) {
                let filterData2 = this.$_.filter(this.cto.ctoActCauses, {
                  attCd: att.code,
                });
                this.$_.forEach(filterData2, filter => {
                  att.itmCd.splice(0, 0, {
                    code: filter.itmCd,
                    name: filter.itmNm,
                  });
                });
              }
            });
            this.$_.forEach(this.attItemTemp, item => {
              this.attItem.splice(0, 0, item);
            });
          }
        },
        _error => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    /** end button 관련 이벤트 **/
  },
};
</script>
<style>
</style>