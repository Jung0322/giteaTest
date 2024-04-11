<template>
  <div :class="{'hidden':hidden}" class="pagination-container" :style="`background:` + bodyColor">
    <el-pagination
      :background="background"
      :current-page.sync="currentPage"
      :page-size.sync="pageSize"
      :layout="layout"
      :page-sizes="pageSizes"
      :total="total"
      v-bind="$attrs"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
/* eslint-disable */
import { scrollTo } from '@/utils/scrollTo';

export default {
  name: 'y-pagination',
  props: {
    total: {
      required: true,
      type: Number,
    },
    page: {
      type: Number,
      default: 1,
    },
    limit: {
      type: Number,
      default: 20,
    },
    pageSizes: {
      type: Array,
      default() {
        return [5, 20, 40, 50, 100, 200, 300];
      },
    },
    layout: {
      type: String,
      default: 'total, sizes, prev, pager, next, jumper',
    },
    background: {
      type: Boolean,
      default: true,
    },
    autoScroll: {
      type: Boolean,
      default: true,
    },
    hidden: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      bodyColor: '#F1F1F1'
    };
  },
  computed: {
    currentPage: {
      get() {
        return this.page;
      },
      set(val) {
        this.$emit('update:page', val);
      },
    },
    pageSize: {
      get() {
        return this.limit;
      },
      set(val) {
        this.$emit('update:limit', val);
      },
    },
  },
  mounted() {
    this.setBodyColor();

    window.getApp.$on('mainColorChanged', (_color) => {
      this.bodyColor = _color;
    });
  },
  methods: {
    handleSizeChange(val) {
      this.$emit('pagination', { page: this.currentPage, limit: val });
      if (this.autoScroll) {
        scrollTo(0, 800);
      }
    },
    handleCurrentChange(val) {
      this.$emit('pagination', { page: val, limit: this.pageSize });
      this.$emit('onPageChange', { page: val, limit: this.pageSize });

      if (this.autoScroll) {
        scrollTo(0, 800);
      }
    },
    setBodyColor() {
      this.$nextTick(() => {
        let localStorageColor = window.localStorage.getItem('bodyColor');
        this.bodyColor = localStorageColor || this.bodyColor;
      });
    }
  },
};
</script>

<style scoped>
.pagination-container {
  padding: 0px 16px;
  text-align: center;
}
.pagination-container.hidden {
  display: none;
}
</style>
