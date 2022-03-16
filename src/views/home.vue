<template>
    <a-layout id="components-layout-demo-responsive">
        <a-layout-sider
                breakpoint="lg"
                collapsed-width="0"
                @collapse="onCollapse"
                @breakpoint="onBreakpoint"
        >
            <div class="logo" />
            <a-menu theme="dark" mode="inline" v-model:selectedKeys="selectedKeys" @click="to_menu">
                <a-menu-item key="1">
                    <FileImageOutlined />
                    <span class="nav-text">{{nav_0}}</span>
                </a-menu-item>
                <a-menu-item key="2">
                    <FileImageOutlined />
                    <span class="nav-text">{{nav_1}}</span>
                </a-menu-item>
                <a-menu-item key="3">
                    <FileImageOutlined />
                    <span class="nav-text">{{nav_2}}</span>
                </a-menu-item>
                <a-menu-item key="4">
                    <FileImageOutlined />
                    <span class="nav-text">{{nav_3}}</span>
                </a-menu-item>
            </a-menu>
        </a-layout-sider>
        <a-layout>
            <a-layout-header :style="{ background: '#fff', padding: 0 }" />
            <a-layout-content :style="{ margin: '24px 16px 0' }">
                <div :style="{ padding: '24px', background: '#fff', minHeight: '580px'}" :inline="true">
                    <DetailEnhance v-if="select_menu === '1'"></DetailEnhance>
                    <Deblur v-if="select_menu === '4'"></Deblur>
                </div>
            </a-layout-content>
            <a-layout-footer style="textAlign: center">
                Image Enhancement ©2022 Created by Zhenglin Tang
            </a-layout-footer>
        </a-layout>
    </a-layout>
</template>

<script>
    import { reactive, toRefs } from 'vue'
    import DetailEnhance from '../components/DetailEnhance'
    import Deblur from '../components/Deblur'

    export default {
        components: {
            DetailEnhance,
            Deblur
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
                this.select_menu = key
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
</style>
