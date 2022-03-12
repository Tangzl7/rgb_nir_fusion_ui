<template>
    <a-row>
        <a-card hoverable style="width: 360px; margin-right: 60px">
            <template #cover>
                <img alt="example" :src="rgb" @click="rgb_to_crop_page"/>
            </template>
            <a-upload :show-upload-list="false" action="http://127.0.0.1:5590/get_rgb_img" @change="rgbHandleChange">
                <a-card-meta title="RGB IMAGE">
                    <template #description>click to upload rgb image</template>
                </a-card-meta>
            </a-upload>
        </a-card>
        <a-upload :show-upload-list="false" action="http://127.0.0.1:5590/get_nir_img" @change="nirHandleChange">
            <a-card hoverable style="width: 360px; margin-right: 60px">
                <template #cover>
                    <img alt="example" :src="nir" />
                </template>
                <a-card-meta title="NIR IMAGE">
                    <template #description>click to upload nir image</template>
                </a-card-meta>
            </a-card>
        </a-upload>
        <a-card hoverable style="width: 360px; margin-right: 20px">
            <template #cover>
                <img alt="fusion result" :src=enhancement_0 @click="enhance_to_crop_page" />
            </template>
            <a-card-meta title="RESULT" @click="enhance_0">
                <template #description>NIR And VS Fusion Fast Image Enhancement</template>
            </a-card-meta>
        </a-card>
    </a-row>
    <a-row>
        <img alt="crop original image" :src=crop_original_img />
        <img alt="crop enhancement image" :src=crop_enhance_img />
    </a-row>
</template>

<script>
    import axios from 'axios'
    import bus from '../../bus.ts'

    export default {
        name: "UploadImage",
        inject:['reload'],
        data() {
            return {
                rgb: 'http://127.0.0.1:5590/static/fig_3_a_rgb.png',
                nir: 'http://127.0.0.1:5590/static/fig_3_a_nir.png',
                enhancement_0: 'http://127.0.0.1:5590/static/708752.png',
                enhancement_1: 'http://127.0.0.1:5590/static/157338.png',
                crop_original_img: 'http://127.0.0.1:5590/static/original_crop.png',
                crop_enhance_img: 'http://127.0.0.1:5590/static/enhance_crop.png',
            }
        },
        mounted() {
            bus.on('crop_original_img', (e) => {
                this.crop_original_img = e;
                console.log(this.crop_original_img);
            });
            // bus.on('crop_enhance_img', this.crop_enhance_img);
        },
        methods: {
            rgbHandleChange(info) {
                if (info.file.status === 'done') {
                    this.$message.success(`${info.file.name} file uploaded successfully`);
                    this.rgb = window.URL.createObjectURL(info.file.originFileObj);
                } else if (info.file.status === 'error') {
                    this.$message.error(`${info.file.name} file upload failed.`);
                }
            },
            nirHandleChange(info) {
                if (info.file.status === 'done') {
                    this.$message.success(`${info.file.name} file uploaded successfully`);
                    this.nir = window.URL.createObjectURL(info.file.originFileObj);
                } else if (info.file.status === 'error') {
                    this.$message.error(`${info.file.name} file upload failed.`);
                }
            },
            enhance_0() {
                let _this = this;
                axios.get('http://127.0.0.1:5590/enhancement_0')
                    .then(function (response) {
                        _this.enhancement_0 = response.data.enhancement_0;
                    })
            },
            rgb_to_crop_page() {
                this.$router.push({
                    path: '/CropperImage',
                    query: {
                        img: this.rgb,
                        original: 1,
                    }
                })
            },
            enhance_to_crop_page() {
                this.$router.push({
                    path: '/CropperImage',
                    query: {
                        img: this.enhancement_0,
                        original: 0,
                    }
                })
            }
        },
    }
</script>
