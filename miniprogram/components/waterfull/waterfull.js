Component({
  properties: {
    desc: {
      type: Array,
      observer: function (newVal) {
        // 这里可以发现 第一次值是空 第二次才有值。说明进行了值变化的操作。验证了刚才的场景说法。
        // 在这里进行对值的处理，直接渲染在页面上
        if (newVal) {
          this.setData({
            coffe_desc: newVal
          })
        }
      }
    }
  },
  options: {
    styleIsolation: "apply-shared"
  },
  data: {
    coffe_desc: [],
    //初始动画效果
    animationType: 'animated lightSpeedOut',
    clickShow: false,
    firstIn: false,
    activeIndex: -1
  
  },
  attached: function () {
    // 在组件实例进入页面节点树时执行
  },
  methods: {
    clickBtn(e) {

      let index = e.target.dataset.index

      this.setData({
        firstIn: true
      })
      
      if (this.data.activeIndex !== index) {
        this.setData({
          clickShow: true, 
          activeIndex: index
        })
      }
      else {
        this.setData({
          clickShow: false,
          activeIndex: -1
        })
      }
    
    }
  },
  

})