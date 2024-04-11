/**
* @Author: jianglei
* @Date:   2017-10-12 12:06:49
*/
/* eslint-disable */
'use strict'
import Vue from 'vue'
export default function treeToArray(data, expandAll, parent, level, item) {
  const marLTemp = []
  let tmp = []
  Array.from(data).forEach(function(record) {
    if (record._expanded === undefined) {
      Vue.set(record, '_expanded', expandAll)
    }
    let _level = 1
    if (level !== undefined && level !== null) {
      _level = level + 1
    }
    Vue.set(record, '_level', _level)
    // 如果有父元素
    if (parent) {
      Vue.set(record, 'parent', parent)
      // 부모 요소에 오프셋이 있으면이 요소의 오프셋에서 계산해야합니다.
      // 오프셋은 이전 형제 요소와 관련이 있으므로 이전 요소의 길이를 모두 추가해야합니다.
      if (!marLTemp[_level]) {
        marLTemp[_level] = 0
      }
      Vue.set(record, '_marginLeft', marLTemp[_level] + parent._marginLeft)
      Vue.set(record, '_width', record[item] / parent[item] * parent._width)
      // 다음 요소에 대해이 오프셋을 계산 한 후 사용자 고유의 길이를 추가하십시오.
      marLTemp[_level] += record._width
    } else {
      // 루트 인 경우
      // 오프셋 저장 맵 초기화
      marLTemp[record.id] = []
      // 지도에서 각 레벨의 길이를 저장하는 배열이며
      // 처음에는 0
      marLTemp[record.id][_level] = 0
      Vue.set(record, '_marginLeft', 0)
      Vue.set(record, '_width', 1)
    }
    tmp.push(record)
    if (record.children && record.children.length > 0) {
      const children = treeToArray(record.children, expandAll, record, _level, item)
      tmp = tmp.concat(children)
    }
  })
  return tmp
}
