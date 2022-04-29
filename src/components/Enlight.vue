<template>
    <a-typography-title :strong="true" style="margin-left: 35%; margin-bottom: 4%">Algorithm Test</a-typography-title>
    <a-row>
        <a-card hoverable style="width: 360px; margin-right: 60px">
            <template #cover>
                <img alt="example" :src="rgb" ref="image"/>
            </template>
            <a-card-meta title="RGB IMAGE"></a-card-meta>
            <a-upload :show-upload-list="false" action="http://127.0.0.1:5590/low_light_rgb_img" @change="rgbHandleChange">
                <a-button type="primary" style="margin-top: 20%;">上传图像</a-button>
            </a-upload>
        </a-card>

        <a-card hoverable style="width: 360px; margin-right: 60px">
            <template #cover>
                <img alt="example" :src="nir" ref="image"/>
            </template>
            <a-card-meta title="NIR IMAGE"></a-card-meta>
            <a-upload :show-upload-list="false" action="http://127.0.0.1:5590/low_light_nir_img" @change="nirHandleChange">
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
        <a-card hoverable style="width: 200px; margin-right: 0px" id="rgb">
            <template #cover>
                <img alt="fusion result" :src=rgb ref="image" />
            </template>
            <a-card-meta title="RGB Image"></a-card-meta>
        </a-card>
        <a-card hoverable style="width: 200px; margin-left: 20%;" id="init_illumination">
            <template #cover>
                <img alt="fusion result" :src=init_illumination ref="image" />
            </template>
            <a-card-meta title="Init Illumination"></a-card-meta>
        </a-card>
        <a-card hoverable style="width: 200px; margin-left: 20%;" id="enhancement">
            <template #cover>
                <img alt="fusion result" :src=enhancement ref="image" />
            </template>
            <a-card-meta title="Enhancement"></a-card-meta>
        </a-card>
    </a-row>
    <a-row>
        <a-card hoverable style="width: 200px; margin-top: 3%" id="nir">
            <template #cover>
                <img alt="fusion result" :src=nir ref="image" />
            </template>
            <a-card-meta title="NIR Image"></a-card-meta>
        </a-card>
        <a-card hoverable style="width: 200px; margin-top: 3%; margin-left: 20%;" id="illumination">
            <template #cover>
                <img alt="fusion result" :src=illumination ref="image" />
            </template>
            <a-card-meta title="Illumination"></a-card-meta>
        </a-card>
        <a-card hoverable style="width: 200px; margin-left: 20%; margin-top: 3%;" id="init_enhancement">
            <template #cover>
                <img alt="fusion result" :src=init_enhancement ref="image" />
            </template>
            <a-card-meta title="Init Enhancement"></a-card-meta>
        </a-card>
    </a-row>
</template>

<script>
    import axios from 'axios'
    import bus from '../../bus.ts'
    import LeaderLine from 'leader-line'

    export default {
        name: "Enlight",
        data() {
            return {
                lineContainers: [null, null, null, null, null],
                rgb: 'http://127.0.0.1:5590/static/low_light_enhancement/rgb.png',
                nir: 'http://127.0.0.1:5590/static/low_light_enhancement/nir.png',
                init_illumination: 'http://127.0.0.1:5590/static/low_light_enhancement/init_illumination.png',
                illumination: 'http://127.0.0.1:5590/static/low_light_enhancement/illumination.png',
                init_enhancement: 'http://127.0.0.1:5590/static/low_light_enhancement/init_enhancement.png',
                enhancement: 'http://127.0.0.1:5590/static/low_light_enhancement/enhancement.png',
                crop_original_img: 'http://127.0.0.1:5590/static/low_light_enhancement/original_crop.png',
                crop_enhance_img: 'http://127.0.0.1:5590/static/low_light_enhancement/enhance_crop.png',
            }
        },
        mounted() {
            bus.on('liner_destroy', (event => {
                if (event && this.lineContainers[0] != null) {
                    for (var i = 0; i < 6; i++) {
                        this.lineContainers[i].remove();
                        this.lineContainers[i] = null;
                    }
                }
            }));
            this.rgb = 'http://127.0.0.1:5590/static/low_light_enhancement/rgb.png' + '?t=' + new Date().getTime();
            this.nir = 'http://127.0.0.1:5590/static/low_light_enhancement/nir.png' + '?t=' + new Date().getTime();
            this.init_illumination = 'http://127.0.0.1:5590/static/low_light_enhancement/init_illumination.png' + '?t=' + new Date().getTime();
            this.illumination = 'http://127.0.0.1:5590/static/low_light_enhancement/illumination.png' + '?t=' + new Date().getTime();
            this.init_enhancement = 'http://127.0.0.1:5590/static/low_light_enhancement/init_enhancement.png' + '?t=' + new Date().getTime();
            this.enhancement = 'http://127.0.0.1:5590/static/low_light_enhancement/enhancement.png' + '?t=' + new Date().getTime();
            this.crop_original_img = 'http://127.0.0.1:5590/static/low_light_enhancement/original_crop.png' + '?t=' + new Date().getTime();
            this.crop_enhance_img = 'http://127.0.0.1:5590/static/low_light_enhancement/enhance_crop.png' + '?t=' + new Date().getTime();
            this.$refs.image.addEventListener('load', () => {
                this.lineContainers[0] = new LeaderLine(
                    document.getElementById('rgb'),
                    document.getElementById('init_illumination')
                );
                this.lineContainers[1] = new LeaderLine(
                    document.getElementById('init_illumination'),
                    document.getElementById('illumination')
                );
                this.lineContainers[2] = new LeaderLine(
                    document.getElementById('nir'),
                    document.getElementById('illumination')
                );
                this.lineContainers[3] = new LeaderLine(
                    document.getElementById('illumination'),
                    document.getElementById('init_enhancement')
                );
                this.lineContainers[4] = new LeaderLine(
                    document.getElementById('init_enhancement'),
                    document.getElementById('enhancement')
                );
            });
        },
        methods: {
            rgbHandleChange(info) {
                if (info.file.status === 'done') {
                    this.$message.success(`${info.file.name} file uploaded successfully`);
                    this.rgb = 'http://127.0.0.1:5590/static/low_light_enhancement/rgb.png' + '?t=' + new Date().getTime();
                } else if (info.file.status === 'error') {
                    this.$message.error(`${info.file.name} file upload failed.`);
                }
            },
            nirHandleChange(info) {
                if (info.file.status === 'done') {
                    this.$message.success(`${info.file.name} file uploaded successfully`);
                    this.nir = 'http://127.0.0.1:5590/static/low_light_enhancement/nir.png' + '?t=' + new Date().getTime();
                } else if (info.file.status === 'error') {
                    this.$message.error(`${info.file.name} file upload failed.`);
                }
            },
            enhance() {
                let _this = this;
                axios.get('http://127.0.0.1:5590/enlight')
                    .then(function () {
                        _this.enhancement = 'http://127.0.0.1:5590/static/low_light_enhancement/enhancement.png' + '?t=' + new Date().getTime();
                    })
            },
            rgb_to_crop_page() {
                this.$router.push({
                    path: '/CropperImage',
                    query: {
                        type: 'low_light_enhancement',
                        img: this.rgb,
                        original: 1,
                    }
                })
            },
            enhance_to_crop_page() {
                this.$router.push({
                    path: '/CropperImage',
                    query: {
                        type: 'low_light_enhancement',
                        img: this.enhancement,
                        original: 0,
                    }
                });
            }
        },
    }
</script>
