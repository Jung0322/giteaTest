<!--
  목적 : 협력업체 > 협력업체 자체점검 결과 상세보기
  작성자 : kyk
  Detail : 협력업체 자체점검 결과등록  
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
            <!-- 자체점검 상세 -->
            <y-label label="L0000002340" icon="user-edit" color-class="cutstom-title-color" />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 닫기 -->
              <y-btn title="L0000000881" @btnClicked="closePopup" />
            </div>
          </b-col>
        </b-row>
        <b-card>
          <b-row>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-plant
                type="edit"
                :disabled="true"
                v-model="subconCheckResult.plantCd"
                name="plantCd"
                v-validate="'required'"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 점검일 -->
              <y-datepicker
                :width="8"
                :disabled="true"
                label="L0000002570"
                name="checkYmd"
                v-model="subconCheckResult.checkYmd"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 점검업체 -->
              <y-text
                :width="8"
                :disabled="true"
                ui="bootstrap"
                name="vendorNm"
                label="L0000002560"
                v-model="subconCheckResult.vendorNm"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 점검종류 -->
              <y-select
                :width="8"
                :disabled="true"
                :comboItems="checkKindCdItems"
                itemText="safCheckKindNm"
                itemValue="safCheckKindNo"
                ui="bootstrap"
                name="safCheckKindNo"
                label="L0000002576"
                v-model="subconCheckResult.safCheckKindNo"
              ></y-select>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
              <!-- 점검명 -->
              <y-text
                :width="10"
                :disabled="true"
                ui="bootstrap"
                name="checkTitle"
                label="L0000002551"
                v-model="subconCheckResult.checkTitle"
              ></y-text>
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>
    <b-row class="mt-3"></b-row>
    <el-tabs type="border-card" v-model="tabIndex">
      <el-tab-pane v-for="(item, i) in tabItems" :key="i" stretch class="default-tab-pane">
        <span slot="label">
          <i class="el-icon-date"></i>
          {{ item.title }}
        </span>
      </el-tab-pane>
      <keep-alive>
          <component
            :is="component"
            v-if="component"
            :subconCheckResult.sync="subconCheckResult"
            :tabParam.sync="tabParam"
            :attachFileGrps="attachFileGrps"
          />
        </keep-alive>
    </el-tabs>
    <b-row>
      <b-col sm="12">
        <div class="float-right mt-2">
          <!-- 닫기 -->
          <y-btn title="L0000000881" size="mini" @btnClicked="closePopup" />
        </div>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
export default {
  /* attributes: name, components, props, data */
  name: 'y-subcon-check-result-detail',
  props: {
    popupParam: {
      type: Object,
      default: {
        vendorCheckRsltNo: 0, // 자체점검번호
      },
    },
  },
  data() {
    return {
      tabItems: [],
      component: null,
      tabIndex: 0,
      // 개선조치를 위한 변수
      tabParam: {
        imprClassCd: 'ICL07',
        refTableId: 0,
        editable: false,
        detailCheck: false,
        target: 'IMM',
      },
      attachFileGrps: [],
      subconCheckResult: {
        vendorCheckRsltNo: 0, // 자체점검결과번호
        plantCd: '', // 사업장코드
        plantNm: '', // 사업장명
        safCheckKindNo: 0, // 점검종류
        safCheckKindNm: '', // 점검명
        checkYmd: '', // 점검일
        checkTitle: '', // 점검명
        vendorCd: '',
        vendorNm: '', // 점검업체명
        checkResult: '', // 점검결과요약
        safCheckItemResults: [], // 점검항목별결과목록
        safCheckInspectors: [], // 점검자(외부)
        safCheckImprActs: [], // 개선사항목록
        createUserId: '',
        updateUserId: '',
      },
      disabled: false,
      searchDetailUrl: '',
      checkKindCdItems: [],
    };
  },
  watch: {
    tabIndex: function(newValue, old) {
      this.loadComponent();
    },
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
      this.searchDetailUrl = selectConfig.vendor.subconCheckPatrol.get.url;
      this.tabItems = [
        { title: this.$comm.getLangSpecInfoLabel('L0000000405'), url: './subconCheckItemResult' }, 
        { title: this.$comm.getLangSpecInfoLabel('L0000002572'), url: './selfCheckInspector' },
        { title: this.$comm.getLangSpecInfoLabel('L0000000259'), url: 'imprActTab' },
        { title: this.$comm.getLangSpecInfoLabel('L0000002843'), url: 'fileUploadPage' },
      ];
      // 개선조치를 위한 변수 Setting
      this.tabParam.refTableId = this.popupParam.vendorCheckRsltNo;
      this.tabParam.editable = false;
      this.tabParam.detailCheck = true;

      this.attachFileGrpSetting(); // 첨부파일 설정
      this.getDetail();
      this.loadComponent();
    },
    getDetail() {
      this.$http.url = this.$format(
        this.searchDetailUrl,
        this.popupParam.vendorCheckRsltNo
      );
      this.$http.type = 'GET';
      this.$http.request(
        _result => {
          this.subconCheckResult = this.$_.clone(_result.data);
          this.getCheckKindCdItems(); // 점검종류
          this.loadComponent();
        },
        _error => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    loadComponent() {
      var path = this.tabItems[this.tabIndex].url;

      if (path === 'fileUploadPage') {
        this.component = () =>
          import('@/pages/common/attachFile/multiFileUpload');
      } else if (path === 'imprActTab') {
        this.component = () => import('@/pages/impr/imprActTab');
      } else this.component = () => import(`${path}`);
    },
    // 첨부파일 설정
    attachFileGrpSetting() {
      let taskKey = this.popupParam.vendorCheckRsltNo
        ? this.popupParam.vendorCheckRsltNo.toString()
        : '';
      this.attachFileGrps = [
        {
          label: 'L0000004507', // 협력업체 자체점검 첨부파일
          listType: 'text',
          drag: false,
          showFileSearch: false,
          editable: false,
          disabled: true,
          onlyDownload: true,
          limit: 10,
          multiple: true,
          uploadTempFiles: null,
          taskClassNm: 'VENDOR_SAFETY_CHECK', // 파일첨부경로물어보기
          taskKey: taskKey,
          taskFlag: '',
          createUserId: this.$store.getters.token,
        },
      ];
    },
    // 점검종류 조회
    getCheckKindCdItems() {
      this.$http.url = selectConfig.saf.checkKind.list.url;
      this.$http.type = 'GET';
      this.$http.param = {
        plantCd: this.subconCheckResult.plantCd,
      }
      this.$http.request(
        _result => {
          this.checkKindCdItems = this.$_.clone(_result.data);
          this.checkKindCdItems.splice(0, 0, {
            safCheckKindNo: null,
            safCheckKindNm: this.$comm.getLangSpecInfoLabel('L0000001186'), // 선택하세요
          });
        },
        _error => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    closePopup(data) {
      this.$emit('closePopup', {});
    },
    /** end button 관련 이벤트 **/
  },
};
</script>