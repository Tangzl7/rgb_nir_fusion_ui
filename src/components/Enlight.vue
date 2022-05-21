<template>
    <a-typography-title :strong="true" style="margin-left: 35%; margin-bottom: 4%">Algorithm Test</a-typography-title>
    <a-row>
        <a-card hoverable style="width: 28%; margin-right: 5%">
            <template #cover>
                <img alt="example" :src="rgb" ref="image"/>
            </template>
            <a-card-meta title="RGB IMAGE"></a-card-meta>
            <a-upload :show-upload-list="false" action="http://127.0.0.1:5590/low_light_rgb_img" @change="rgbHandleChange">
                <a-button type="primary" style="margin-top: 20%;">上传图像</a-button>
            </a-upload>
        </a-card>

        <a-card hoverable style="width: 28%; margin-right: 5%">
            <template #cover>
                <img alt="example" :src="nir" ref="image"/>
            </template>
            <a-card-meta title="NIR IMAGE"></a-card-meta>
            <a-upload :show-upload-list="false" action="http://127.0.0.1:5590/low_light_nir_img" @change="nirHandleChange">
                <a-button type="primary" style="margin-top: 20%;">上传图像</a-button>
            </a-upload>
        </a-card>

        <a-card hoverable style="width: 28%">
            <template #cover>
                <img alt="fusion result" :src=enhancement @click="enhance_to_crop_page" ref="image" />
            </template>
            <a-card-meta title="RESULT"></a-card-meta>
            <a-button type="primary" style="margin-top: 5%;" @click="enhance">运行算法</a-button>
        </a-card>
    </a-row>

    <a-typography-title :strong="true" style="margin-left: 32%; margin-bottom: 4%; margin-top: 5%">Original VS Enhanced</a-typography-title>
    <a-row style="margin-top: 2%">
        <a-card hoverable style="width: 45%">
            <template #cover>
                <img alt="example" :src="crop_original_img" ref="image" />
            </template>
            <a-button type="primary" style="margin-left: 40%;" @click="rgb_to_crop_page">
                <template #icon><SearchOutlined /></template>原图裁剪
            </a-button>
        </a-card>
        <a-card hoverable style="width: 45%; margin-left: 5%">
            <template #cover>
                <img alt="example" :src="crop_enhance_img" ref="image" />
            </template>
            <a-button type="primary" style="margin-left: 38%;" @click="enhance_to_crop_page">
                <template #icon><SearchOutlined /></template>增强图像裁剪
            </a-button>
        </a-card>
    </a-row>

    <a-typography-title :strong="true" style="margin-left: 32%; margin-bottom: 4%; margin-top: 5%">Algorithm Workflow</a-typography-title>
    <a-row style="margin-left: 5%">
        <a-card hoverable style="width: 14%; margin-left: 42%" id="reflection_model">
            <template #cover>
                <img :src=reflection_model ref="image" />
            </template>
            <a-card-meta title="Reflection Model"></a-card-meta>
        </a-card>
        <a-card hoverable style="width: 14%; margin-left: 18%" id="result1">
            <template #cover>
                <img :src=result1 ref="image" />
            </template>
            <a-card-meta title="Init Fusion"></a-card-meta>
        </a-card>
    </a-row>
    <a-row style="margin-left: 1%">
        <a-card hoverable style="width: 14%; margin-top: 3%" id="rgb">
            <template #cover>
                <img :src=rgb ref="image" />
            </template>
            <a-card-meta title="RGB"></a-card-meta>
        </a-card>
        <a-card hoverable style="width: 14%; margin-top: 3%" id="nir">
            <template #cover>
                <img :src=nir ref="image" />
            </template>
            <a-card-meta title="NIR"></a-card-meta>
        </a-card>
        <a-card hoverable style="width: 14%; margin-top: 3%; margin-left: 16%" id="illumination">
            <template #cover>
                <img :src=illumination ref="image" />
            </template>
            <a-card-meta title="Illumination Map"></a-card-meta>
        </a-card>
        <a-card hoverable style="width: 14%; margin-top: 3%; margin-left: 17%" id="result2">
            <template #cover>
                <img :src=result1 ref="image" />
            </template>
            <a-card-meta title="Enlight Map"></a-card-meta>
        </a-card>
    </a-row>
    <a-row style="margin-left: 5%">
        <a-card hoverable style="width: 14%; margin-top: 3%; margin-left: 42%;" id="dense_map">
            <template #cover>
                <img :src=dense_map ref="image" />
            </template>
            <a-card-meta title="Haze Map"></a-card-meta>
        </a-card>
        <a-card hoverable style="width: 14%; margin-left: 18%; margin-top: 3%;" id="enhancement">
            <template #cover>
                <img :src=enhancement ref="image" />
            </template>
            <a-card-meta title="Enhancement"></a-card-meta>
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
                lineContainers: [null, null, null, null, null, null, null, null, null, null, null],
                rgb: 'http://127.0.0.1:5590/static/low_light_enhancement/rgb.png',
                nir: 'http://127.0.0.1:5590/static/low_light_enhancement/nir.png',
                reflection_model: 'http://127.0.0.1:5590/static/low_light_enhancement/reflection_model.png',
                illumination: 'http://127.0.0.1:5590/static/low_light_enhancement/illumination.png',
                dense_map: 'http://127.0.0.1:5590/static/low_light_enhancement/dense_map.png',
                result1: 'http://127.0.0.1:5590/static/low_light_enhancement/result1.png',
                result2: 'http://127.0.0.1:5590/static/low_light_enhancement/result2.png',
                enhancement: 'http://127.0.0.1:5590/static/low_light_enhancement/enhancement.png',
                crop_original_img: 'http://127.0.0.1:5590/static/low_light_enhancement/original_crop.png',
                crop_enhance_img: 'http://127.0.0.1:5590/static/low_light_enhancement/enhance_crop.png',
            }
        },
        mounted() {
            bus.on('liner_destroy', (event => {
                if (event && this.lineContainers[0] != null) {
                    for (var i = 0; i < 11; i++) {
                        this.lineContainers[i].remove();
                        this.lineContainers[i] = null;
                    }
                }
            }));
            // this.rgb = 'http://127.0.0.1:5590/static/low_light_enhancement/rgb.png' + '?t=' + new Date().getTime();
            // this.nir = 'http://127.0.0.1:5590/static/low_light_enhancement/nir.png' + '?t=' + new Date().getTime();
            // this.reflection_model = 'http://127.0.0.1:5590/static/low_light_enhancement/reflection_model.png' + '?t=' + new Date().getTime();
            // this.illumination = 'http://127.0.0.1:5590/static/low_light_enhancement/illumination.png' + '?t=' + new Date().getTime();
            // this.init_enhancement = 'http://127.0.0.1:5590/static/low_light_enhancement/init_enhancement.png' + '?t=' + new Date().getTime();
            // this.enhancement = 'http://127.0.0.1:5590/static/low_light_enhancement/enhancement.png' + '?t=' + new Date().getTime();
            // this.crop_original_img = 'http://127.0.0.1:5590/static/low_light_enhancement/original_crop.png' + '?t=' + new Date().getTime();
            // this.crop_enhance_img = 'http://127.0.0.1:5590/static/low_light_enhancement/enhance_crop.png' + '?t=' + new Date().getTime();
            this.$refs.image.addEventListener('load', () => {
                this.lineContainers[0] = new LeaderLine(
                    document.getElementById('nir'),
                    document.getElementById('reflection_model')
                );
                this.lineContainers[1] = new LeaderLine(
                    document.getElementById('nir'),
                    document.getElementById('illumination')
                );
                this.lineContainers[2] = new LeaderLine(
                    document.getElementById('nir'),
                    document.getElementById('dense_map')
                );
                this.lineContainers[3] = new LeaderLine(
                    document.getElementById('reflection_model'),
                    document.getElementById('result1')
                );
                this.lineContainers[4] = new LeaderLine(
                    document.getElementById('illumination'),
                    document.getElementById('result2')
                );
                this.lineContainers[5] = new LeaderLine(
                    document.getElementById('result1'),
                    document.getElementById('result2')
                );
                this.lineContainers[6] = new LeaderLine(
                    document.getElementById('dense_map'),
                    document.getElementById('enhancement')
                );
                this.lineContainers[7] = new LeaderLine(
                    document.getElementById('result2'),
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
                    });
                if (this.lineContainers[0] != null) {
                    for (var i = 0; i < 5; i++) {
                        this.lineContainers[i].remove();
                        this.lineContainers[i] = null;
                    }
                }
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
