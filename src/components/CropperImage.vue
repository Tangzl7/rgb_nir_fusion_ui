<template>
    <div class="container">
        <div class="img-container">
            <img :src="img" style="width: 1024px; height: 680px" ref="image" alt="">
        </div>
    </div>
    <a-button class="button"  @click="save" style="padding-top: 8px; padding-bottom: 30px; background: gray; width: 50%">crop</a-button>
    <a-button class="button"  @click="back" style="padding-top: 8px; padding-bottom: 30px; background: gray; width: 50%">back</a-button>
</template>

<script>
    import Cropper from 'cropperjs'
    import 'cropperjs/dist/cropper.css'
    import axios from 'axios'
    import bus from '../../bus.ts'

    export default {
        name: 'CropperImage',
        props: {
            crop_img: {
                type: String,
            },
            img_type: {
                type: Number
            },
            enhance_type: {
                type: String,
            },
            back_home: {
                type: Function,
            }
        },
        data () {
            return {
                img: this.crop_img,
                type1: this.img_type,
                type2: this.enhance_type,
                myCropper: null,
                crop_original_img: null,
                crop_enhance_img: null
            }
        },

        mounted() {
            // this.img = this.$route.query.img;

            this.$refs.image.addEventListener('load', () => {
                if (this.myCropper) {
                    this.myCropper.destroy()
                }
                this.myCropper = new Cropper(this.$refs.image, {
                    viewMode: 1,
                    dragMode: 'move',
                    initialAspectRatio: 1,
                    aspectRatio: 3/2,
                    cropBoxResizable: true,
                    background: false,
                    center: false,
                    autoCropArea: 0.6,
                    zoomOnWheel: false,
                })
            });
        },
        methods: {
            save(){
                let crop_img = this.myCropper.getCroppedCanvas({
                    imageSmoothingQuality: 'high'
                }).toDataURL('image/png');
                let blob = this.base64ToBlob(crop_img);
                let params = new FormData();
                params.append('file', blob);
                params.append('type', this.type2);
                let config = {
                    headers: {'Content-Type': 'multipart/form-data'}
                };
                let _this =this;
                if (this.type1 === 0) {
                    axios.post('http://127.0.0.1:5590/original_crop_img', params, config)
                        .then(function (response) {
                            _this.crop_original_img = response.data.crop_img;
                        });
                } else {
                    axios.post('http://127.0.0.1:5590/enhance_crop_img', params, config)
                        .then(function (response) {
                            _this.crop_enhance_img = response.data.crop_img;
                        });
                }
                this.$message.success('crop image success', 3,);
            },
            back() {
                this.back_home(this.type1);
            },
            base64ToBlob (code) {
                let parts = code.split(';base64,');
                let contentType = parts[0].split(':')[1];
                let raw = window.atob(parts[1]);
                let rawLength = raw.length;
                let uInt8Array = new Uint8Array(rawLength);
                for (let i = 0; i < rawLength; ++i) {
                    uInt8Array[i] = raw.charCodeAt(i)
                }
                return new Blob([uInt8Array], { type: contentType })
            },
        },
    }
</script>
