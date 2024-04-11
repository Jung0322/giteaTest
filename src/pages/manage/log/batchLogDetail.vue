<!--
  목적 : 배치로그 상세
  작성자 : jkl
  Detail : 시스템 > 로그관리 > 배치로그관리 > 배치로그 상세
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <b-row class="mt-3" ref="detailBox">
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- 배치로그 상세 -->
            <y-label
              label="L0000004577"
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
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 배치코드 -->
              <y-text
                :width="10"
                ui="bootstrap"
                label="L0000001200"
                name="batchCd"
                :editable="false"
                v-model="popupParam.batchLog.batchCd"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 로그발생일 -->
              <y-text
                :width="10"
                ui="bootstrap"
                label="L0000000993"
                name="runDt"
                :editable="false"
                v-model="popupParam.batchLog.runDt"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 실행결과 -->
              <y-text
                :width="10"
                ui="bootstrap"
                label="L0000001819"
                name="runResult"
                :editable="false"
                v-model="popupParam.batchLog.runResult"
              />
            </b-col>
          </b-row>
          <b-row>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              <!-- 내용 -->
              <y-textarea
                :width="11"
                ui="bootstrap"
                label="L0000000810"
                name="remark"
                :editable="false"
                v-model="popupParam.batchLog.remark"
              />
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {
  name: 'batch-log-detail',
  props: {
    popupParam: {
      type: Object,
      default: {},
    },
  },
  beforeMount() {
    // vue 객체 초기화
    Object.assign(this.$data, this.$options.data());
  },
  /* methods */
  methods: {
    // 팝업 닫기
    btnClosePopup() {
      // 부모창에 값 전달
      this.$emit('closePopup', { success: true });
    },
  },
  /* methods */
};
</script>
