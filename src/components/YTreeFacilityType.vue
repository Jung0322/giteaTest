<!--
  목적 : 트리 설비유형
  작성자 : kdh
  Detail :
  *
  examples:
  *
  -->
<template>
  <y-text
    :label="label"
    ui="bootstrap"
    :name="name"
    :required="required"
    :placeholder="placeholder"
    v-model="safFacilityTypeNm"
    :width="width"
    :editable="false"
    :treeCheck="!editable || disabled"
    :state="state"
  >
    <el-popover
      v-if="editable"
      slot="customAppendIcon"
      placement="right"
      width="400"
      trigger="manual"
      v-model="popoverVisible"
    >
      <!-- 설비유형 선택 -->
      <y-tree
        node-key="safFacilityTypeCd"
        label="safFacilityTypeNm"
        title="L0000003721"
        :editable="false"
        :treeData="facilityTypeTree"
        @nodeClick="searchNodeClick"
      />
      <el-button
        v-if="!disabled"
        icon="el-icon-search"
        circle
        slot="reference"
        size="mini"
        @click="popoverVisible = !popoverVisible"
      />
      <div style="text-align: right; margin: 0">
        <el-button size="mini" type="text" @click="popoverVisible = false">
          <!-- 닫기 -->
          {{$comm.getLangSpecInfoLabel('L0000000881')}}
        </el-button>
      </div>
    </el-popover>
    <el-button
      v-if="safFacilityTypeNm && !disabled && editable"
      icon="el-icon-close"
      circle
      slot="customAppendIcon"
      size="mini"
      @click.stop="removeSearchNode"
    />
  </y-text>
</template>

<script>
import YTree from '@/components/YTree';
import arrayToTree from 'array-to-tree';
import selectConfig from '@/js/selectConfig';
export default {
  name: 'y-tree-facility-type',
  components: {
    'y-tree': YTree,
  },
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
      default: 'L0000001597',
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
    search: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      defaultData: [],
      facilityTypeTree: [],
      safFacilityTypeCd: '',
      safFacilityTypeNm: '',
      placeholder: 'L0000003722', // 설비유형을 선택하세요.
      popoverVisible: false,
    };
  },
  watch: {
    // TODO : 부모의 v-model 변경을 감시(예를 들면, db로부터 데이터를 조회 한 후 값을 바인딩 할 경우)
    value() {
      this.safFacilityTypeCd = this.value;
      this.checkDefault();
    },
    editable() {
      this.placeholder =
        this.type === 'edit' ? 'L0000003722' : 'L0000002519'; // 설비유형을 선택하세요. '전체'
      if (!this.editable && this.type === 'edit') this.placeholder = '';
    },
    search() {
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
      this.placeholder =
        this.type === 'edit' ? 'L0000003722' : 'L0000002519'; // 설비유형을 선택하세요. '전체'
      if (!this.editable && this.type === 'edit') this.placeholder = '';
    },
    /**
     * 메뉴 tree 기초 정보 조회
     */
    getListBases() {
      this.$http.url = selectConfig.baseInfo.facilityType.list.url;
      this.$http.type = 'GET';
      this.$http.request(
        _result => {
          this.facilityTypeTree = this.convertTree(_result.data);
          this.defaultData = this.$_.clone(_result.data);

          this.checkDefault();
        },
        _error => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    checkDefault() {
      var data = null;
      if (this.value) {
        data = this.$_.find(this.defaultData, {
          safFacilityTypeCd: this.value,
        });

        if (!data) return;

        this.safFacilityTypeCd = data.safFacilityTypeCd;
        this.safFacilityTypeNm = data.safFacilityTypeNm;
      } else {
        this.safFacilityTypeCd = '';
        this.safFacilityTypeNm = '';
      }
    },
    /**
     * 메뉴 트리용 기초 정보를 Tree 메뉴로 변환
     */
    convertTree(_treeBases) {
      if (!_treeBases || _treeBases.length <= 0) return null;
      var tree = arrayToTree(_treeBases, {
        parentProperty: 'psafFacilityTypeCd',
        customID: 'safFacilityTypeCd',
      });
      return tree;
    },
    searchNodeClick(_node) {
      this.safFacilityTypeCd = _node.safFacilityTypeCd;
      this.safFacilityTypeNm = _node.safFacilityTypeNm;
      this.popoverVisible = false;
      this.$emit('input', this.safFacilityTypeCd);
      this.$emit('setSafFacilityTypeNm', this.safFacilityTypeNm);
    },
    removeSearchNode() {
      this.safFacilityTypeCd = null;
      this.safFacilityTypeNm = null;
      this.$emit('input', this.safFacilityTypeCd);
      this.$emit('setSafFacilityTypeNm', this.safFacilityTypeNm);
    },
  },
};
</script>