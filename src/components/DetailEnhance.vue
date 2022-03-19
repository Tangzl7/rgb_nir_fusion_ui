<template>
    <a-typography-title :strong="true" style="margin-left: 35%; margin-bottom: 4%">Algorithm Test</a-typography-title>
    <a-row>
        <a-card hoverable style="width: 360px; margin-right: 60px">
            <template #cover>
                <img alt="example" :src="rgb" ref="image"/>
            </template>
            <a-card-meta title="RGB IMAGE"></a-card-meta>
            <a-upload :show-upload-list="false" action="http://127.0.0.1:5590/get_rgb_img" @change="rgbHandleChange">
                <a-button type="primary" style="margin-top: 20%;">上传图像</a-button>
            </a-upload>
        </a-card>

        <a-card hoverable style="width: 360px; margin-right: 60px">
            <template #cover>
                <img alt="example" :src="nir" ref="image"/>
            </template>
            <a-card-meta title="NIR IMAGE"></a-card-meta>
            <a-upload :show-upload-list="false" action="http://127.0.0.1:5590/get_nir_img" @change="nirHandleChange">
                <a-button type="primary" style="margin-top: 20%;">上传图像</a-button>
            </a-upload>
        </a-card>

        <a-card hoverable style="width: 360px; margin-right: 20px">
            <template #cover>
                <img alt="fusion result" :src=enhancement @click="enhance_to_crop_page" ref="image" />
            </template>
            <a-card-meta title="RESULT"></a-card-meta>
            <a-button type="primary" style="margin-top: 5%;" @click="enhance">运行算法</a-button>
        </a-card>
    </a-row>

    <a-typography-title :strong="true" style="margin-left: 32%; margin-bottom: 4%; margin-top: 5%">Original VS Enhanced</a-typography-title>
    <a-row style="margin-top: 50px">
        <a-card hoverable>
            <template #cover>
                <img alt="example" :src="crop_original_img" height="380" width="570" ref="image" />
            </template>
            <a-button type="primary" style="margin-left: 40%;" @click="rgb_to_crop_page">
                <template #icon><SearchOutlined /></template>原图裁剪
            </a-button>
        </a-card>
        <a-card hoverable style="margin-left: 5%">
            <template #cover>
                <img alt="example" :src="crop_enhance_img" height="380" width="570" ref="image" />
            </template>
            <a-button type="primary" style="margin-left: 38%;" @click="rgb_to_crop_page">
                <template #icon><SearchOutlined /></template>增强图像裁剪
            </a-button>
        </a-card>
    </a-row>

    <a-typography-title :strong="true" style="margin-left: 32%; margin-bottom: 4%; margin-top: 5%">Algorithm Workflow</a-typography-title>

    <a-row>
        <a-card hoverable style="width: 180px; margin-right: 0px" id="rgb_reflection">
            <template #cover>
                <img alt="fusion result" :src=rgb ref="image" />
            </template>
            <a-card-meta title="RGB Reflection Maps"></a-card-meta>
        </a-card>
        <a-card hoverable style="width: 180px; margin-left: 13%" id="reflection_weights">
            <template #cover>
                <img alt="fusion result" :src=r_reflection_weight ref="image" />
            </template>
            <a-card-meta title="Reflection Weight Maps"></a-card-meta>
        </a-card>
        <a-card hoverable style="width: 180px; margin-left: 36%" id="init_fusion">
            <template #cover>
                <img alt="fusion result" :src=init_fusion ref="image" />
            </template>
            <a-card-meta title="Init Fusion"></a-card-meta>
        </a-card>
    </a-row>
    <a-row>
        <a-card hoverable style="width: 180px; margin-top: 5%" id="nir_reflection">
            <template #cover>
                <img alt="fusion result" :src=nir ref="image" />
            </template>
            <a-card-meta title="NIR Reflection Map"></a-card-meta>
        </a-card>
        <a-card hoverable style="width: 180px; margin-left: 13%; margin-top: 5%" id="gradient_maps">
            <template #cover>
                <img alt="fusion result" :src=r_gradient_map ref="image" />
            </template>
            <a-card-meta title="Gradient Maps"></a-card-meta>
        </a-card>
        <a-card hoverable style="width: 180px; margin-left: 13%; margin-top: 5%" id="transmission_weights">
            <template #cover>
                <img alt="fusion result" :src=r_transmission_weight ref="image" />
            </template>
            <a-card-meta title="Transmission Weight Maps"></a-card-meta>
        </a-card>
        <a-card hoverable style="width: 180px; margin-left: 9.5%; margin-top: 5%" id="enhancement">
            <template #cover>
                <img alt="fusion result" :src=enhancement ref="image" />
            </template>
            <a-card-meta title="Enhancement"></a-card-meta>
        </a-card>
    </a-row>

    <a-typography-title :strong="true" style="margin-left: 32%; margin-bottom: 4%; margin-top: 5%">Algorithm Introduce</a-typography-title>
    <img :src="workflow" style="margin-left: 6%"/>
    <AlgorithmIntroduce></AlgorithmIntroduce>

</template>

<script>
    import axios from 'axios'
    import bus from '../../bus.ts'
    import LeaderLine from 'leader-line'
    import AlgorithmIntroduce from './AlgorithmIntroduce'

    export default {
        name: "DetailEnhance",
        components: {
            AlgorithmIntroduce
        },
        data() {
            return {
                lineContainers: [null, null, null, null, null, null, null, null],
                rgb: 'http://127.0.0.1:5590/static/detail_enhancement/rgb.png',
                nir: 'http://127.0.0.1:5590/static/detail_enhancement/nir.png',
                enhancement: 'http://127.0.0.1:5590/static/detail_enhancement/enhancement.png',

                crop_original_img: 'http://127.0.0.1:5590/static/detail_enhancement/original_crop.png',
                crop_enhance_img: 'http://127.0.0.1:5590/static/detail_enhancement/enhance_crop.png',

                workflow: 'http://127.0.0.1:5590/static/detail_enhancement/workflow.png',

                r_reflection_weight: 'http://127.0.0.1:5590/static/detail_enhancement/r_reflection_weight.png',
                r_gradient_map: 'http://127.0.0.1:5590/static/detail_enhancement/r_gradient_map.png',
                r_transmission_weight: 'http://127.0.0.1:5590/static/detail_enhancement/r_transmission_weight.png',
                init_fusion: 'http://127.0.0.1:5590/static/detail_enhancement/init_fusion.png'
            }
        },
        mounted() {
            bus.on('liner_destroy', (event => {
                if (event && this.lineContainers[0] != null) {
                    for (var i = 0; i < 8; i++) {
                        this.lineContainers[i].remove();
                        this.lineContainers[i] = null;
                    }
                }
            }));
            this.rgb = 'http://127.0.0.1:5590/static/detail_enhancement/rgb.png' + '?t=' + new Date().getTime();
            this.nir = 'http://127.0.0.1:5590/static/detail_enhancement/nir.png' + '?t=' + new Date().getTime();
            this.enhancement = 'http://127.0.0.1:5590/static/detail_enhancement/enhancement.png' + '?t=' + new Date().getTime();
            this.crop_original_img = 'http://127.0.0.1:5590/static/detail_enhancement/original_crop.png' + '?t=' + new Date().getTime();
            this.crop_enhance_img = 'http://127.0.0.1:5590/static/detail_enhancement/enhance_crop.png' + '?t=' + new Date().getTime();
            this.$refs.image.addEventListener('load', () => {
                this.lineContainers[0] = new LeaderLine(
                    document.getElementById('rgb_reflection'),
                    document.getElementById('reflection_weights')
                );
                this.lineContainers[1] = new LeaderLine(
                    document.getElementById('nir_reflection'),
                    document.getElementById('reflection_weights')
                );
                this.lineContainers[2] = new LeaderLine(
                    document.getElementById('rgb_reflection'),
                    document.getElementById('gradient_maps')
                );
                this.lineContainers[3] = new LeaderLine(
                    document.getElementById('nir_reflection'),
                    document.getElementById('gradient_maps')
                );
                this.lineContainers[4] = new LeaderLine(
                    document.getElementById('gradient_maps'),
                    document.getElementById('transmission_weights')
                );
                this.lineContainers[5] = new LeaderLine(
                    document.getElementById('transmission_weights'),
                    document.getElementById('init_fusion')
                );
                this.lineContainers[6] = new LeaderLine(
                    document.getElementById('reflection_weights'),
                    document.getElementById('init_fusion')
                );
                this.lineContainers[7] = new LeaderLine(
                    document.getElementById('init_fusion'),
                    document.getElementById('enhancement')
                );
            });
        },
        methods: {
            rgbHandleChange(info) {
                if (info.file.status === 'done') {
                    this.$message.success(`${info.file.name} file uploaded successfully`);
                    this.rgb = 'http://127.0.0.1:5590/static/detail_enhancement/rgb.png' + '?t=' + new Date().getTime();
                    console.log(this.rgb)
                } else if (info.file.status === 'error') {
                    this.$message.error(`${info.file.name} file upload failed.`);
                }
            },
            nirHandleChange(info) {
                if (info.file.status === 'done') {
                    this.$message.success(`${info.file.name} file uploaded successfully`);
                    this.nir = 'http://127.0.0.1:5590/static/detail_enhancement/nir.png' + '?t=' + new Date().getTime();
                } else if (info.file.status === 'error') {
                    this.$message.error(`${info.file.name} file upload failed.`);
                }
            },
            enhance() {
                let _this = this;
                axios.get('http://127.0.0.1:5590/enhancement')
                    .then(function () {
                        _this.enhancement = 'http://127.0.0.1:5590/static/detail_enhancement/enhancement.png' + '?t=' + new Date().getTime();
                    })
            },
            rgb_to_crop_page() {
                this.$router.push({
                    path: '/CropperImage',
                    query: {
                        type: 'detail_enhancement',
                        img: this.rgb,
                        original: 1,
                    }
                })
            },
            enhance_to_crop_page() {
                this.lineContainer.remove();
                this.$router.push({
                    path: '/CropperImage',
                    query: {
                        type: 'detail_enhancement',
                        img: this.enhancement,
                        original: 0,
                    }
                });
            }
        },
    }
</script>
