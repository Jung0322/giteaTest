<!--
  목적 : 훈련결과 상세 > 결과 탭
  작성자 : pkj
  Detail :
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <b-row class="mt-3" ref="editBox">
      <b-col sm="12">
        <b-card>
          <b-row>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
              <!-- 문제점 및 개선사항 -->
              <y-textarea
                :editable="editable && !stateYn"
                :width="10"
                ui="bootstrap"
                label="L0000001049"
                name="trainImprDesc"
                v-model="emergencyResultInfo.trainImprDesc"
                :required="true"
                v-validate="'required'"
                :state="validateState('trainImprDesc')"
                :rows="3"
                :maxlength="1000"
              ></y-textarea>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
              <!-- 훈련결과요약 -->
              <y-textarea
                :editable="editable && !stateYn"
                :width="10"
                ui="bootstrap"
                label="L0000005212"
                name="trainEvalOpin"
                v-model="emergencyResultInfo.trainEvalOpin"
                :required="true"
                v-validate="'required'"
                :state="validateState('trainEvalOpin')"
                :rows="3"
                :maxlength="2000"
              ></y-textarea>
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
  name: 'y-facility-mst-detail',
  props: {
    emergencyResultInfo: {
      type: Object,
      default: () => ({
        trainImprDesc: '',
        trainEvalOpin: '',
      }),
    },
    stateYn: false,
  },
  data: () => ({
    gridOptions: {
      header: [],
      data: [],
      height: '450',
    },
    disabled: false,
    editable: false,
  }),
  watch: {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  methods: {
    init() {
      this.editable = this.$route.meta.editable;
    },
    validateState(ref) {
      if (
        this.veeBag[ref] &&
        (this.veeBag[ref].dirty || this.veeBag[ref].validated)
      ) {
        return !this.errors.has(ref);
      }
      return null;
    },
  },
};
</script>
