<script>
/* eslint-disable */
export default {
  name: 'MenuItem',
  functional: true,
  props: {
    icon: {
      type: String,
      default: ''
    },
    color: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    }
  },
  render(h, context) {
    const { icon, color, title } = context.props
    const vnodes = []
    
    if (icon) {
      // vnodes.push(<svg-icon icon-class={icon}/>)
      if (color) {
        vnodes.push(<font color={color}><f-icon icon={icon} /></font> )
      } else {
        vnodes.push(<f-icon icon={icon} /> )
      }
      
    }

    if (title) {
      vnodes.push(<span slot='title' style="padding:10px;">{(title)}</span>)
    }
    return vnodes
  }
}
</script>
