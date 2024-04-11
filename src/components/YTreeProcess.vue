<!--
  목적 : 트리 공정
  작성자 : kdh
  Detail :
  *
  examples:
  *
  -->
<template>
  <div>
    <b-row>
      <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
        <y-text
          ref="process"
          :width="width"
          :disabled="true"
          :required="required"
          :editable="editable"
          ui="bootstrap"
          :label="label"
          :name="name"
          :rowClass="rowClass"
          v-model="processNm"
          :appendIcon="editable&&!disabled ? [{ 'icon': 'times', callbackName: 'clear' }, { 'icon': 'search', callbackName: 'searchProcess' }] : null"
          @searchProcess="btnSearchProcessClicked"
          @clear="clear"
          v-validate="'required'"
          :state="state"
        ></y-text>
      </b-col>
      <b-col
        v-if="showDataMapping&&(plantCd||deptCd)&&showProcessCd"
        sm="12"
        md="12"
        lg="12"
        xl="12"
        class="col-xxl-12 mb-1"
      >
        <el-tag size="medium" type="danger">
          <i class="el-icon-warning"></i>
          {{showProcessNm}} {{this.$comm.getLangSpecInfoLabel('L0000000863')}}
          <!-- 는 입력된 사업장과 부서에 할당된 공정이 아닙니다. -->
        </el-tag>
      </b-col>
    </b-row>
    <y-dialog :param="popupOptions"></y-dialog>
  </div>
</template>

<script>
import selectConfig from '@/js/selectConfig';
export default {
  name: 'y-tree-process',
  props: {
    // TODO : 부모의 v-model의 값을 받아오는 속성
    value: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: 'edit',
    },
    editable: {
      type: Boolean,
      default: true,
    },
    // 필수 입력 여부
    required: {
      type: Boolean,
      default: false,
    },
    // 라벨 텍스트
    label: {
      type: String,
      default: 'L0000000515', // 공정
    },
    // 사용 여부
    disabled: {
      type: Boolean,
      default: false,
    },
    // 사용 여부
    width: {
      type: Number,
      default: 8,
    },
    // veeValidate 유효성 검사
    state: {
      type: Boolean,
      default: null,
    },
    name: {
      type: String,
      default: '',
    },
    deptCd: {
      type: String,
      default: '',
    },
    plantCd: {
      type: String,
      default: '',
    },
    showDataMapping: {
      type: Boolean,
      default: false,
    },
    // b-row에 추가할 클래스
    rowClass: {
      type: String,
      default: 'mb-2',
    },
  },
  data() {
    return {
      showProcessCd: '',
      showProcessNm: '',
      processCd: '',
      processNm: '',
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        param: {},
        width: '90%',
        top: '10px',
        closeCallback: null,
      },
      defaultData: [],
    };
  },
  watch: {
    processNm() {
      if (!this.processCd) {
        if (this.processNm) {
          this.showProcessNm = this.$_.clone(this.processNm);
        }
        this.processNm = '';
      }
    },
    // TODO : 부모의 v-model 변경을 감시(예를 들면, db로부터 데이터를 조회 한 후 값을 바인딩 할 경우)
    value() {
      this.processCd = this.value;
      this.setProcessNm();
      this.getListBases();
    },
    editable() {
      // this.placeholder = this.type === 'edit' ? '공정을 선택하세요.' : '전체';
      // if (!this.editable && this.type === 'edit') this.placeholder = '';
    },
    processCd() {
      this.$emit('input', this.processCd);
    },
    plantCd() {
      this.getListBases();
    },
    deptCd() {
      this.getListBases();
    },
  },
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {},
  beforeDestory() {
    this.init();
  },
  methods: {
    init() {
      this.getListBases();
    },
    /**
     * 메뉴 tree 기초 정보 조회
     */
    getListBases() {
      if (!this.plantCd || !this.deptCd) return;
      this.$http.url = selectConfig.manage.process.list.url;
      this.$http.param = {
        plantCd: this.plantCd,
        deptCd: this.deptCd,
      };

      this.$http.type = 'GET';
      this.$http.request(
        _result => {
          this.defaultData = _result.data;
          if (this.value && this.defaultData.length) {
            this.checkDefault();
          }
        },
        _error => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    checkDefault() {
      var data = null;
      if (
        this.defaultData &&
        this.defaultData.length > 0 &&
        this.$_.findIndex(this.defaultData, { searchPlantCd: this.plantCd, searchDeptCd: this.deptCd }) === -1
      ) {
        this.getListBases();
        return;
      }
      // if (!this.defaultData || this.defaultData.length === 0) {
      //   this.getListBases();
      //   return;
      // }
      if (this.value) {
        data = this.$_.find(this.defaultData, { processCd: this.value });
        if (!data) {
          this.showProcessCd = this.$_.clone(this.processCd);
          this.showProcessNm = this.$_.clone(this.processNm);
          this.processCd = null;
          this.processNm = '';
          this.$refs.process.clearableClicked();
        } else {
          this.showProcessCd = '';
          this.processCd = data.processCd;
          this.processNm = data.processNm;
        }
      } else {
        this.showProcessCd = '';
        this.processCd = null;
        this.processNm = '';
      }
      this.$forceUpdate();
      this.$emit('input', this.processCd);
    },
    searchchange(newValue) {
      // 데이터가 변경되는 경우 처리 해당 속성이 설정되어 있으면 조회처리하도록 수정
      this.$emit('datachange', newValue);
    },
    btnSearchProcessClicked() {
      if (!this.editable || this.disabled) return;
      this.popupOptions.target = () =>
        import(`${'@/pages/baseInfo/deptManage/process.vue'}`);
      this.popupOptions.title = 'L0000000529'; // 공정검색
      this.popupOptions.visible = true;
      this.popupOptions.width = '60%';
      this.popupOptions.top = '100px';
      this.popupOptions.param = {
        popupMode: true,
        plantCd: this.plantCd,
        deptCd: this.deptCd,
      };
      this.popupOptions.closeCallback = this.closePopup;
    },
    closePopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;

      if (data.process) {
        this.processCd = data.process.processCd;
        this.processNm = data.process.processNm;
      }
    },
    setProcessNm() {
      if (!this.processCd) {
        if (this.processNm) {
          this.showProcessNm = this.$_.clone(this.processNm);
        }
        this.processNm = '';
        return;
      }
      this.$http.url = selectConfig.manage.process.get.url;
      this.$http.type = 'GET';
      this.$http.param = {
        processCd: this.processCd,
      };
      this.$http.request(
        _result => {
          this.processNm = this.$_.clone(_result.data.processNm);
        },
        _error => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    clear() {
      this.showProcessCd = '';
      this.processCd = null;
      this.processNm = '';
      this.$emit('input', this.processCd);
    },
  },
};
</script>