<template>
  <div class="recommend" ref="recommend">
    <scroll ref="scroll" class="recommend-content" :data="discList">
      <div>
        <div v-if="recommends.length" class="slider-wrapper" ref="sliderWrapper">
          <slider>
            <div v-for="item in recommends">
              <a :href="item.linkUrl">
                <img class="needsclick" @load="loadImage" :src="item.picUrl">
              </a>
            </div>
          </slider>
        </div>
        <div class="recommend-list">
          <div class="list-title ">
          	<switches :switches="switches" :currentIndex="currentIndex" @switch="switchItem"></switches>
          </div>
           <scroll ref="songList" v-if="currentIndex===0" class="list-scroll" :data="discList">
            <div >
             <ul>
               <li @click="selectItem(item)" v-for="item in discList" class="item">
               <div class="icon">
                 <img width="60" height="60" v-lazy="item.imgurl">
               </div>
               <div class="text">
                 <h2 class="name" v-html="item.creator.name"></h2>
                 <p class="desc" v-html="item.dissname"></p>
               </div>
               </li>
             </ul>
            </div>
          </scroll>
           <scroll ref="songListNew" v-if="currentIndex===1" class="list-scroll" :data="discListNew">
            <div >
             <ul>
               <li @click="selectItem(item)" v-for="item in discListNew" class="item">
               <div class="icon">
                 <img width="60" height="60" v-lazy="item.imgurl">
               </div>
               <div class="text">
                 <h2 class="name" v-html="item.creator.name"></h2>
                 <p class="desc" v-html="item.dissname"></p>
               </div>
               </li>
             </ul>
            </div>
          </scroll>          
          
        </div>
      </div>
      <div class="loading-container" v-show="!discList.length">
        <loading></loading>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import Slider from 'base/slider/slider'
  import Loading from 'base/loading/loading'
  import Scroll from 'base/scroll/scroll'
  import {getRecommend, getDiscList,getDiscListNew} from 'api/recommend'
  import {playlistMixin} from 'common/js/mixin'
  import {ERR_OK} from 'api/config'
  import {mapMutations} from 'vuex'
  import Switches from 'base/switches/switches'

  export default {
    mixins: [playlistMixin],
    data() {
      return {
        recommends: [],
        discList: [],
        discListNew: [],
        currentIndex: 0,
        switches: [
          {
            name: '日语热推'
          },
          {
            name: '日语新推'
          }
        ]
      }
    },
    created() {
      this._getRecommend()

      this._getDiscList()
     
      this._getDiscListNew()
    },
    methods: {
      handlePlaylist(playlist) {
        const bottom = playlist.length > 0 ? '60px' : ''

        this.$refs.recommend.style.bottom = bottom
        this.$refs.scroll.refresh()
      },
      loadImage() {
        if (!this.checkloaded) {
          this.checkloaded = true
          this.$refs.scroll.refresh()
          setTimeout(() => {
          if (this.currentIndex === 0) {
            this.$refs.songList.refresh()
          } else {
            this.$refs.songListNew.refresh()
          }
        }, 20)
        }
      },
      selectItem(item) {
        this.$router.push({
          path: `/recommend/${item.dissid}`
        })
        this.setDisc(item)
      },
      _getRecommend() {
        getRecommend().then((res) => {
          if (res.code === ERR_OK) {
            this.recommends = res.data.slider
          }
        })
      },
      _getDiscList() {
        getDiscList().then((res) => {
          if (res.code === ERR_OK) {
            this.discList = res.data.list
          }
        })
      },
      _getDiscListNew() {
        getDiscListNew().then((res) => {
          if (res.code === ERR_OK) {
            this.discListNew = res.data.list
          }
        })
      },
      switchItem(index) {
        this.currentIndex = index
      },
      ...mapMutations({
        setDisc: 'SET_DISC'
      })
    },
    components: {
      Slider,
      Loading,
      Switches,
      Scroll
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .recommend
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .recommend-content
      height: 100%
      overflow: hidden
      .slider-wrapper
        position: relative
        width: 100%
        overflow: hidden
      .recommend-list
        .list-title
          font-size: $font-size-medium
        .list-scroll
          height: 100%
          overflow: hidden
        	.item
          	display: flex
          	box-sizing: border-box
          	align-items: center
          	padding: 0 20px 20px 20px
          	.icon
            	flex: 0 0 60px
            	width: 60px
            	padding-right: 20px
          	.text
            	display: flex
            	flex-direction: column
            	justify-content: center
            	flex: 1
            	line-height: 20px
            	overflow: hidden
            	font-size: $font-size-medium
            	.name
              	margin-bottom: 10px
              	color: $color-text
            	.desc
              	color: $color-text-d
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>