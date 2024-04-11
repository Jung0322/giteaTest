/* eslint-disable */
// translate router.meta.title, be used in breadcrumb sidebar tagsview
export function generateTitle(title) {
  const hasKey = this.$te('route.' + title)

  if (hasKey) {
    // $t :this method from vue-i18n, inject in @/lang/index.js
    const translatedTitle = this.$t('route.' + title)

    return translatedTitle
  }
  return title
}

export function changeLang(gubun, title) {
  let checkText = title;
  if (gubun) {
    checkText = gubun + '.' + checkText;
  }
  const hasKey = this.$te(checkText)

  if (hasKey) {
    // $t :this method from vue-i18n, inject in @/lang/index.js
    const translatedTitle = this.$t(checkText)

    return translatedTitle
  } else {
    return '';
  }
}
