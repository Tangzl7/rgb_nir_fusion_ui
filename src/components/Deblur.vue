<template>
    <a-typography-title :strong="true" style="margin-left: 35%; margin-bottom: 4%">Algorithm Test</a-typography-title>
    <a-row>
        <a-card hoverable style="width: 28%; margin-right: 5%">
            <template #cover>
                <img alt="example" :src="rgb" ref="image"/>
            </template>
            <a-card-meta title="RGB IMAGE"></a-card-meta>
            <a-upload :show-upload-list="false" action="http://127.0.0.1:5590/blur_rgb_img" @change="rgbHandleChange">
                <a-button type="primary" style="margin-top: 20%;">上传图像</a-button>
            </a-upload>
        </a-card>

        <a-card hoverable style="width: 28%; margin-right: 5%">
            <template #cover>
                <img alt="example" :src="nir" ref="image" />
            </template>
            <a-card-meta title="NIR IMAGE"></a-card-meta>
            <a-upload :show-upload-list="false" action="http://127.0.0.1:5590/sharp_nir_img" @change="nirHandleChange">
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
    <a-row>
        <a-card hoverable style="width: 16%; margin-left: 26%" id="blur_rgb">
            <template #cover>
                <img alt="fusion result" :src=rgb ref="image" />
            </template>
            <a-card-meta title="Blur RGB Image"></a-card-meta>
        </a-card>
        <a-card hoverable style="width: 16%; margin-left: 9%" id="slope">
            <template #cover>
                <img alt="fusion result" :src=slope ref="image" />
            </template>
            <a-card-meta title="Slope Map"></a-card-meta>
        </a-card>
        <a-card hoverable style="width: 16%" id="offset">
            <template #cover>
                <img alt="fusion result" :src=offset ref="image" />
            </template>
            <a-card-meta title="Offset Map"></a-card-meta>
        </a-card>
    </a-row>
    <a-row style="margin-left: 3%">
        <a-card hoverable style="width: 16%; margin-top: 5%" id="sharp_nir">
            <template #cover>
                <img alt="fusion result" :src=nir ref="image" />
            </template>
            <a-card-meta title="Sharp NIR Image"></a-card-meta>
        </a-card>
        <a-card hoverable style="width: 16%; margin-top: 5%; margin-left: 8%" id="blurred_nir">
            <template #cover>
                <img alt="fusion result" :src=blurred_nir ref="image" />
            </template>
            <a-card-meta title="Blurred NIR Image"></a-card-meta>
        </a-card>
        <a-card hoverable style="width: 16%; margin-top: 5%; margin-left: 26.2%" id="enhancement">
            <template #cover>
                <img alt="fusion result" :src=enhancement ref="image" />
            </template>
            <a-card-meta title="Enhancement"></a-card-meta>
        </a-card>
    </a-row>

    <div v-if="show" style="margin-right: 8%; margin-top: 5%">
        <a-typography-title :strong="true" style="margin-left: 42%; margin-bottom: 4%">Crop Image</a-typography-title>
        <CropperImage :crop_img="crop_img" :img_type="img_type" :enhance_type="enhance_type" :back_home="back_home"></CropperImage>
    </div>

    <a-modal
            v-model:visible="modal_visible"
            title="Algorithm is running"
            :closable="false"
            :maskClosable="false"
            :keyboard="false"
            footer=""
    >
        <a-spin style="margin-left: 50%" />
    </a-modal>

</template>

<script>
    import axios from 'axios'
    import bus from '../../bus.ts'
    import LeaderLine from 'leader-line'
    import CropperImage from '../components/CropperImage'

    export default {
        name: "Deblur",
        components: {
            CropperImage
        },
        data() {
            return {
                show: false,
                modal_visible: false,
                lineContainers: [null, null, null, null, null],
                crop_img: null,
                img_type: null,
                enhance_type: null,

                rgb: 'http://127.0.0.1:5590/static/deblur/rgb.png',
                nir: 'http://127.0.0.1:5590/static/deblur/nir.png',
                blurred_nir: 'http://127.0.0.1:5590/static/deblur/blurred_nir.png',
                slope: 'http://127.0.0.1:5590/static/deblur/slope.png',
                offset: 'http://127.0.0.1:5590/static/deblur/offset.png',
                enhancement: 'http://127.0.0.1:5590/static/deblur/enhancement.png',
                crop_original_img: 'http://127.0.0.1:5590/static/deblur/original_crop.png',
                crop_enhance_img: 'http://127.0.0.1:5590/static/deblur/enhance_crop.png',
            }
        },
        mounted() {
            bus.on('liner_destroy', (event => {
                this.line_remove();
            }));
            this.$refs.image.addEventListener('load', () => {
                this.lineContainers[0] = new LeaderLine(
                    document.getElementById('sharp_nir'),
                    document.getElementById('blurred_nir')
                );
                this.lineContainers[1] = new LeaderLine(
                    document.getElementById('blur_rgb'),
                    document.getElementById('slope')
                );
                this.lineContainers[2] = new LeaderLine(
                    document.getElementById('blurred_nir'),
                    document.getElementById('slope')
                );
                this.lineContainers[3] = new LeaderLine(
                    document.getElementById('blurred_nir'),
                    document.getElementById('enhancement')
                );
                this.lineContainers[4] = new LeaderLine(
                    document.getElementById('offset'),
                    document.getElementById('enhancement')
                );
            });
        },
        methods: {
            rgbHandleChange(info) {
                if (info.file.status === 'done') {
                    this.$message.success(`${info.file.name} file uploaded successfully`);
                    this.rgb = 'http://127.0.0.1:5590/static/deblur/rgb.png' + '?t=' + new Date().getTime();
                } else if (info.file.status === 'error') {
                    this.$message.error(`${info.file.name} file upload failed.`);
                }
            },
            nirHandleChange(info) {
                if (info.file.status === 'done') {
                    this.$message.success(`${info.file.name} file uploaded successfully`);
                    this.nir = 'http://127.0.0.1:5590/static/deblur/nir.png' + '?t=' + new Date().getTime();
                } else if (info.file.status === 'error') {
                    this.$message.error(`${info.file.name} file upload failed.`);
                }
            },
            enhance() {
                let _this = this;
                this.modal_visible = true;
                axios.get('http://127.0.0.1:5590/deblur')
                    .then(function () {
                        _this.enhancement = 'http://127.0.0.1:5590/static/deblur/enhancement.png' + '?t=' + new Date().getTime();
                        _this.blurred_nir = 'http://127.0.0.1:5590/static/deblur/blurred_nir.png' + '?t=' + new Date().getTime();
                        _this.slope = 'http://127.0.0.1:5590/static/deblur/slope.png' + '?t=' + new Date().getTime();
                        _this.offset = 'http://127.0.0.1:5590/static/deblur/offset.png' + '?t=' + new Date().getTime();
                        _this.modal_visible = false;
                    });
                this.line_remove();
            },
            rgb_to_crop_page() {
                this.crop_img = this.rgb;
                this.img_type = 0;
                this.enhance_type = 'deblur';
                this.show = true;
                this.$nextTick(()=>{
                    this.to_bottom()
                })
            },
            enhance_to_crop_page() {
                this.crop_img = this.enhancement;
                this.img_type = 1;
                this.enhance_type = 'deblur';
                this.show = true;
                this.$nextTick(()=>{
                    this.to_bottom()
                })
            },
            line_remove() {
                if (this.lineContainers[0] != null) {
                    for (var i = 0; i < 5; i++) {
                        this.lineContainers[i].remove();
                        this.lineContainers[i] = null;
                    }
                }
            },
            back_home(flag) {
                this.show = !this.show;
                if (flag === 0)
                    this.crop_original_img = 'http://127.0.0.1:5590/static/deblur/original_crop.png' + '?t=' + new Date().getTime();
                else
                    this.crop_enhance_img = 'http://127.0.0.1:5590/static/deblur/enhance_crop.png' + '?t=' + new Date().getTime();
                this.$nextTick(()=>{
                    this.to_back()
                })
            },
            to_bottom(){
                var height = document.body.clientHeight;
                window.scroll({ top: height*3, left: 0, behavior: 'smooth' });
            },
            to_back() {
                var height = document.body.clientHeight;
                window.scroll({ top: height, left: 0, behavior: 'smooth' });
            }
        },
    }
</script>
