<template>
    <a-layout id="components-layout-demo-responsive">
        <a-layout-header style="height: 5%;">
            <a-layout style="background: rgba(0,21,41,0.89); width: 100%">
                <a-layout-sider style=" margin-left: 4%;">
                    <img src="../assets/logo.png"  style="width: 30%; margin-left: 40%"/>
                </a-layout-sider>
                <a-layout-content style="margin-left: 40%">
                    <a-menu mode="horizontal" theme="dark"  v-model:selectedKeys="selectedKeys" @click="to_menu" style="height: 100%; line-height: 72px">
                        <a-menu-item key="1">图像细节增强</a-menu-item>
                        <a-menu-item key="2">图像低光增亮</a-menu-item>
                        <a-menu-item key="3">图像去噪</a-menu-item>
                        <a-menu-item key="4">图像去模糊</a-menu-item>
                    </a-menu>
                </a-layout-content>
            </a-layout>
        </a-layout-header>
        <a-layout-content :style="{ margin: '0px 0px 0px' }">
            <Carousel></Carousel>
            <div :style="{ padding: '24px', minHeight: '580px', marginLeft: '140px'}" :inline="true">
                <DetailEnhance v-if="select_menu === '1'"></DetailEnhance>
                <Enlight v-if="select_menu === '2'"></Enlight>
                <Denoise v-if="select_menu === '3'"></Denoise>
                <Deblur v-if="select_menu === '4'"></Deblur>
            </div>
        </a-layout-content>
        <a-layout-footer style="textAlign: center">
            Image Enhancement ©2022 Created by Zhenglin Tang
        </a-layout-footer>
    </a-layout>
</template>

<script>
    import { reactive, toRefs } from 'vue'
    import bus from '../../bus.ts'
    import DetailEnhance from '../components/DetailEnhance'
    import Deblur from '../components/Deblur'
    import Denoise from '../components/Denoise'
    import Enlight from '../components/Enlight'
    import Carousel from '../components/Carousel'

    export default {
        components: {
            DetailEnhance,
            Deblur,
            Denoise,
            Enlight,
            Carousel
        },
        setup() {
            const state = reactive({
                selectedKeys: ['1']
            });
            return {
                ...toRefs(state),
            }
        },
        data() {
            return {
                nav_0: "图像细节增强",
                nav_1: "图像低光增亮",
                nav_2: "图像去噪",
                nav_3: "图像去模糊",
                select_menu: '1',
            }
        },
        methods: {
            to_menu({ item, key, keyPath }) {
                // if (this.select_menu === '1' && key !== '1')
                bus.emit('liner_destroy', true);
                this.select_menu = key;
            }
        }
    };
</script>

<style>
    #components-layout-demo-responsive .logo {
        height: 32px;
        background: rgba(255, 255, 255, 0.2);
        margin: 16px;
    }
    .Carousel{
        width: 100%;
        position: relative;
    }
</style>
