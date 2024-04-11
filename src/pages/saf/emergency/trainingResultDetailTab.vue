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
            <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
              <!-- 참여인원수 -->
              <y-number
                :editable="editable && !stateYn"
                :width="6"
                ui="bootstrap"
                label="L0000005192"
                name="trainUserCnt"
                :maxlength="6"
                v-model="emergencyResultInfo.trainUserCnt"
                :required="true"
                v-validate="'required'"
                :state="validateState('trainUserCnt')"
              ></y-number>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 참여여부 -->
              <y-switch
                :width="8"
                :editable="editable && !stateYn"
                true-value="Y"
                false-value="N"
                ui="bootstrap"
                label="L0000004690"
                name="trainYn"
                v-model="emergencyResultInfo.trainYn"
              >
              </y-switch>
            </b-col>
            <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
              <!-- 평가일 -->
              <y-datepicker
                :width="6"
                :editable="editable && !stateYn"
                ui="bootstrap"
                label="L0000003385"
                name="subTrainYmd"
                v-model="emergencyResultInfo.subTrainYmd"
                :required="true"
                v-validate="'required'"
                :state="validateState('subTrainYmd')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <b-row>
                <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4 pr-0">
                  <!-- 훈련시간 -->
                  <y-label label="L0000003379" :required="true"></y-label>
                </b-col>
                <b-col sm="8" md="8" lg="8" xl="8" class="col-xxl-8">
                  <b-row>
                    <b-col sm="5" md="5" lg="5" xl="5" class="col-xxl-5 pr-0">
                      <y-datepicker
                        :width="12"
                        :editable="editable && !stateYn"
                        :minuteStep="10"
                        type="time"
                        name="subTrainSTime"
                        v-model="emergencyResultInfo.subTrainSTime"
                        v-validate="'required'"
                        :state="validateState('subTrainSTime')"
                      ></y-datepicker>
                    </b-col>
                    <b-col
                      sm="2"
                      md="2"
                      lg="2"
                      xl="2"
                      class="col-xxl-2 text-center"
                    >
                      <y-label label="~"></y-label>
                    </b-col>
                    <b-col sm="5" md="5" lg="5" xl="5" class="col-xxl-5 pl-0">
                      <y-datepicker
                        :width="12"
                        :editable="editable && !stateYn"
                        :minuteStep="10"
                        type="time"
                        name="subTrainETime"
                        v-model="emergencyResultInfo.subTrainETime"
                        v-validate="'required'"
                        :state="validateState('subTrainETime')"
                      ></y-datepicker>
                    </b-col>
                  </b-row>
                </b-col>
              </b-row>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
              <!-- 비고 -->
              <y-textarea
                :editable="editable && !stateYn"
                :width="10"
                ui="bootstrap"
                label="L0000001360"
                name="trainDesc"
                v-model="emergencyResultInfo.trainDesc"
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
        trainUserCnt: 0,
        trainYn: 'N',
        subTrainYmd: null,
        subTrainSTime: null,
        subTrainETime: null,
        trainDesc: '',
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
