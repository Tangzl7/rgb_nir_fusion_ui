<template>
    <a-row>
        <a-card hoverable style="width: 360px; margin-right: 60px">
            <template #cover>
                <img alt="example" :src="rgb" @click="rgb_to_crop_page"/>
            </template>
            <a-upload :show-upload-list="false" action="http://127.0.0.1:5590/low_light_rgb_img" @change="rgbHandleChange">
                <a-card-meta title="RGB IMAGE">
                    <template #description>click to upload rgb image</template>
                </a-card-meta>
            </a-upload>
        </a-card>

        <a-card hoverable style="width: 360px; margin-right: 60px">
            <template #cover>
                <img alt="example" :src="nir" />
            </template>
            <a-upload :show-upload-list="false" action="http://127.0.0.1:5590/low_light_nir_img" @change="nirHandleChange">
                <a-card-meta title="NIR IMAGE">
                    <template #description>click to upload nir image</template>
                </a-card-meta>
            </a-upload>
        </a-card>

        <a-card hoverable style="width: 360px; margin-right: 20px">
            <template #cover>
                <img alt="fusion result" :src=enhancement @click="enhance_to_crop_page" />
            </template>
            <a-card-meta title="RESULT" @click="enhance">
                <template #description>NIR And VS Fusion Through Local Linear Mapping</template>
            </a-card-meta>
        </a-card>
    </a-row>
    <a-row style="margin-top: 50px">
        <img alt="crop original image" :src=crop_original_img style="margin-left: 30px" height="380" width="570"/>
        <img alt="crop enhancement image" :src=crop_enhance_img style="margin-left: 30px" height="380" width="570"/>
    </a-row>
</template>

<script>
    import axios from 'axios'

    export default {
        name: "Enlight",
        data() {
            return {
                rgb: 'http://127.0.0.1:5590/static/low_light_enhancement/rgb.png',
                nir: 'http://127.0.0.1:5590/static/low_light_enhancement/nir.png',
                enhancement: 'http://127.0.0.1:5590/static/low_light_enhancement/enhancement.png',
                crop_original_img: 'http://127.0.0.1:5590/static/low_light_enhancement/original_crop.png',
                crop_enhance_img: 'http://127.0.0.1:5590/static/low_light_enhancement/enhance_crop.png',
            }
        },
        mounted() {
            this.rgb = 'http://127.0.0.1:5590/static/low_light_enhancement/rgb.png' + '?t=' + new Date().getTime();
            this.nir = 'http://127.0.0.1:5590/static/low_light_enhancement/nir.png' + '?t=' + new Date().getTime();
            this.enhancement = 'http://127.0.0.1:5590/static/low_light_enhancement/enhancement.png' + '?t=' + new Date().getTime();
            this.crop_original_img = 'http://127.0.0.1:5590/static/low_light_enhancement/original_crop.png' + '?t=' + new Date().getTime();
            this.crop_enhance_img = 'http://127.0.0.1:5590/static/low_light_enhancement/enhance_crop.png' + '?t=' + new Date().getTime();
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
