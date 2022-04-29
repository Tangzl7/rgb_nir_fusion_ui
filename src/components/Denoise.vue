<template>
    <a-typography-title :strong="true" style="margin-left: 35%; margin-bottom: 4%">Algorithm Test</a-typography-title>
    <a-row>
        <a-card hoverable style="width: 360px; margin-right: 60px">
            <template #cover>
                <img alt="example" :src="rgb" ref="image"/>
            </template>
            <a-card-meta title="RGB IMAGE"></a-card-meta>
            <a-upload :show-upload-list="false" action="http://127.0.0.1:5590/noisy_rgb_img" @change="rgbHandleChange">
                <a-button type="primary" style="margin-top: 20%;">上传图像</a-button>
            </a-upload>
        </a-card>

        <a-card hoverable style="width: 360px; margin-right: 60px">
            <template #cover>
                <img alt="example" :src="nir" ref="image" />
            </template>
            <a-card-meta title="NIR IMAGE"></a-card-meta>
            <a-upload :show-upload-list="false" action="http://127.0.0.1:5590/clear_nir_img" @change="nirHandleChange">
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
            <a-button type="primary" style="margin-left: 38%;" @click="enhance_to_crop_page">
                <template #icon><SearchOutlined /></template>增强图像裁剪
            </a-button>
        </a-card>
    </a-row>

    <a-typography-title :strong="true" style="margin-left: 32%; margin-bottom: 4%; margin-top: 5%">Algorithm Workflow</a-typography-title>
    <a-row>
        <a-card hoverable style="width: 180px;" id="noisy_rgb">
            <template #cover>
                <img alt="fusion result" :src=rgb ref="image" />
            </template>
            <a-card-meta title="Noisy RGB Image"></a-card-meta>
        </a-card>
        <a-card hoverable style="width: 180px; margin-left: 24%" id="base">
            <template #cover>
                <img alt="fusion result" :src=base ref="image" />
            </template>
            <a-card-meta title="Base RGB Image"></a-card-meta>
        </a-card>
    </a-row>
    <a-row>
        <a-card hoverable style="width: 180px; margin-top: 2%" id="clear_nir">
            <template #cover>
                <img alt="fusion result" :src=nir ref="image" />
            </template>
            <a-card-meta title="Clear NIR Image"></a-card-meta>
        </a-card>
        <a-card hoverable style="width: 180px; margin-top: 2%; margin-left: 24%" id="noise_reduce">
            <template #cover>
                <img alt="fusion result" :src=noise_reduce ref="image" />
            </template>
            <a-card-meta title="Noise Reduce illumination Map"></a-card-meta>
        </a-card>
        <a-card hoverable style="width: 180px; margin-top: 2%; margin-left: 24%" id="enhancement">
            <template #cover>
                <img alt="fusion result" :src=enhancement ref="image" />
            </template>
            <a-card-meta title="Enhancement"></a-card-meta>
        </a-card>
    </a-row>
    <a-card hoverable style="width: 180px; margin-top: 2%; margin-left: 37.5%" id="detail">
        <template #cover>
            <img alt="fusion result" :src=detail ref="image" />
        </template>
        <a-card-meta title="Detail Image"></a-card-meta>
    </a-card>
</template>

<script>
    import axios from 'axios'
    import bus from '../../bus.ts'
    import LeaderLine from 'leader-line'

    export default {
        name: "Denoise",
        data() {
            return {
                lineContainers: [null, null, null, null, null, null, null],
                rgb: 'http://127.0.0.1:5590/static/denoise/rgb.png',
                nir: 'http://127.0.0.1:5590/static/denoise/nir.png',
                base: 'http://127.0.0.1:5590/static/denoise/base.png',
                noise_reduce: 'http://127.0.0.1:5590/static/denoise/noise_reduce.png',
                detail: 'http://127.0.0.1:5590/static/denoise/detail.png',
                enhancement: 'http://127.0.0.1:5590/static/denoise/enhancement.png',
                crop_original_img: 'http://127.0.0.1:5590/static/denoise/original_crop.png',
                crop_enhance_img: 'http://127.0.0.1:5590/static/denoise/enhance_crop.png',
            }
        },
        mounted() {
            bus.on('liner_destroy', (event => {
                if (event && this.lineContainers[0] != null) {
                    for (var i = 0; i < 7; i++) {
                        this.lineContainers[i].remove();
                        this.lineContainers[i] = null;
                    }
                }
            }));
            this.rgb = 'http://127.0.0.1:5590/static/denoise/rgb.png' + '?t=' + new Date().getTime();
            this.nir = 'http://127.0.0.1:5590/static/denoise/nir.png' + '?t=' + new Date().getTime();
            this.base = 'http://127.0.0.1:5590/static/denoise/base.png' + '?t=' + new Date().getTime();
            this.noise_reduce = 'http://127.0.0.1:5590/static/denoise/noise_reduce.png' + '?t=' + new Date().getTime();
            this.detail = 'http://127.0.0.1:5590/static/denoise/detail.png' + '?t=' + new Date().getTime();
            this.enhancement = 'http://127.0.0.1:5590/static/denoise/enhancement.png' + '?t=' + new Date().getTime();
            this.crop_original_img = 'http://127.0.0.1:5590/static/denoise/original_crop.png' + '?t=' + new Date().getTime();
            this.crop_enhance_img = 'http://127.0.0.1:5590/static/denoise/enhance_crop.png' + '?t=' + new Date().getTime();
            this.$refs.image.addEventListener('load', () => {
                this.lineContainers[0] = new LeaderLine(
                    document.getElementById('noisy_rgb'),
                    document.getElementById('base')
                );
                this.lineContainers[1] = new LeaderLine(
                    document.getElementById('base'),
                    document.getElementById('noise_reduce')
                );
                this.lineContainers[2] = new LeaderLine(
                    document.getElementById('clear_nir'),
                    document.getElementById('noise_reduce')
                );
                this.lineContainers[3] = new LeaderLine(
                    document.getElementById('clear_nir'),
                    document.getElementById('detail')
                );
                this.lineContainers[4] = new LeaderLine(
                    document.getElementById('base'),
                    document.getElementById('enhancement')
                );
                this.lineContainers[5] = new LeaderLine(
                    document.getElementById('noise_reduce'),
                    document.getElementById('enhancement')
                );
                this.lineContainers[6] = new LeaderLine(
                    document.getElementById('detail'),
                    document.getElementById('enhancement')
                );
            });
        },
        methods: {
            rgbHandleChange(info) {
                if (info.file.status === 'done') {
                    this.$message.success(`${info.file.name} file uploaded successfully`);
                    this.rgb = 'http://127.0.0.1:5590/static/denoise/rgb.png' + '?t=' + new Date().getTime();
                } else if (info.file.status === 'error') {
                    this.$message.error(`${info.file.name} file upload failed.`);
                }
            },
            nirHandleChange(info) {
                if (info.file.status === 'done') {
                    this.$message.success(`${info.file.name} file uploaded successfully`);
                    this.nir = 'http://127.0.0.1:5590/static/denoise/nir.png' + '?t=' + new Date().getTime();
                } else if (info.file.status === 'error') {
                    this.$message.error(`${info.file.name} file upload failed.`);
                }
            },
            enhance() {
                let _this = this;
                axios.get('http://127.0.0.1:5590/denoise')
                    .then(function () {
                        _this.enhancement = 'http://127.0.0.1:5590/static/denoise/enhancement.png' + '?t=' + new Date().getTime();
                    })
            },
            rgb_to_crop_page() {
                this.$router.push({
                    path: '/CropperImage',
                    query: {
                        type: 'denoise',
                        img: this.rgb,
                        original: 1,
                    }
                })
            },
            enhance_to_crop_page() {
                this.$router.push({
                    path: '/CropperImage',
                    query: {
                        type: 'denoise',
                        img: this.enhancement,
                        original: 0,
                    }
                });
            }
        },
    }
</script>
