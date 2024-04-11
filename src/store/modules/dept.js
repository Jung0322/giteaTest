/* eslint-disable */
import request from '@/utils/request';
import selectConfig from '@/js/selectConfig';
import comm from '@/js/common';
import {
  getAccessToken
} from '@/utils/auth';

const dept = {
  state: {
    allDept: []
  },
  mutations: {
    GET_DEPT: (state, _allDept) => {
      state.allDept = _allDept;
    }
  },
  actions: {
    getDept({ commit }) {
      request({
        url: selectConfig.manage.dept.treelist.url,
        method: 'get'
      }).then(_result => {
        let deptTree = comm.convertArrayToTree(_result.data, 'pdeptCd', 'deptCd');
        commit('GET_DEPT', deptTree);
      });
    }
  }
}

export default dept
