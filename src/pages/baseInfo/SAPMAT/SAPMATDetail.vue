<!--
  목적 : 기초정보 > 자재
  작성자 : kdh
  Detail : 자재 정보 상세 화면
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <!-- 자재 상세 -->
    <b-row class="mt-3" ref="detailBox">
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- 자재 상세 -->
            <y-label
              label="L0000002317"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 닫기 -->
              <y-btn title="L0000000881" @btnClicked="btnClosePopup" />
            </div>
          </b-col>
        </b-row>
        <b-card>
          <b-row>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 자재번호 -->
              <y-text
                :width="8"
                :editable="editable"
                :disabled="true"
                ui="bootstrap"
                label="L0000002329"
                name="matCode"
                v-model="SAPMAT.matCode"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 자재명(KOR) -->
              <y-text
                :width="8"
                :disabled="true"
                ui="bootstrap"
                label="L0000002328"
                name="matName"
                v-model="SAPMAT.matName"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 자재명(ENG) -->
              <y-text
                :width="8"
                :editable="editable"
                :disabled="true"
                ui="bootstrap"
                label="L0000002327"
                name="matNameEng"
                v-model="SAPMAT.matNameEng"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 포장단위 -->
              <y-text
                :width="8"
                :editable="editable"
                :disabled="true"
                ui="bootstrap"
                label="L0000003141"
                name="packUnit"
                v-model="SAPMAT.packUnit"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 자재그룹 -->
              <y-text
                :width="8"
                :editable="editable"
                :disabled="true"
                ui="bootstrap"
                label="L0000002325"
                name="matGroupNm"
                v-model="SAPMAT.matGroupNm"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 자재유형 -->
              <y-text
                :width="8"
                :editable="editable"
                :disabled="true"
                ui="bootstrap"
                label="L0000002331"
                name="matType"
                v-model="SAPMAT.matType"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 사용여부 -->
              <y-switch
                :width="8"
                :disabled="true"
                :editable="editable"
                true-value="Y"
                false-value="N"
                ui="bootstrap"
                label="L0000001439"
                name="useYn"
                selectText="L0000001440"
                unselectText="L0000001063"
                v-model="SAPMAT.useYn"
              />
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
  name: 'SAP-MAT-detail',
  props: {
    popupParam: {
      type: Object,
      default: {
        matCode: '',
      },
    },
  },
  data() {
    return {
      SAPMAT: {
        matCode: '',
        matName: '',
        matNameEng: '',
        packUnit: '',
        matGroupNm: '',
        matType: '',
        useYn: 'Y',
        createUserId: '',
        updateUserId: '',
        matVendors: [],
      },
      editable: false,
    };
  },
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {},
  beforeDestroy() {},
  /** methods **/
  methods: {
    init() {
      this.editable = this.$route.meta.editable;
      this.getDetail();
    },
    getDetail() {
      this.$http.url = this.$format(
        selectConfig.baseInfo.SAPMAT.get.url,
        this.popupParam.matCode
      );
      console.log('this.$http.url: ', this.$http.url);
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.SAPMAT = this.$_.clone(_result.data);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    btnClosePopup() {
      this.$emit('closePopup', { success: true });
    },
  },
};
</script>
