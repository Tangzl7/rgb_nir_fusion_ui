<template>
    <a-carousel autoplay class="Carousel">
        <div>
            <a-row>
                <img style="width: 50%" src="http://127.0.0.1:5590/static/carousel/rgb_0.png" />
                <img style="width: 50%" src="http://127.0.0.1:5590/static/carousel/en_0.png" />
            </a-row>
        </div>
        <div>
            <a-row>
                <img style="width: 50%" src="http://127.0.0.1:5590/static/carousel/rgb_1.png" />
                <img style="width: 50%" src="http://127.0.0.1:5590/static/carousel/en_1.png" />
            </a-row>
        </div>
        <div>
            <a-row>
                <img style="width: 50%" src="http://127.0.0.1:5590/static/carousel/rgb_2.png" />
                <img style="width: 50%" src="http://127.0.0.1:5590/static/carousel/en_2.png" />
            </a-row>
        </div>
        <div>
            <a-row>
                <img style="width: 50%" src="http://127.0.0.1:5590/static/carousel/rgb_3.png" />
                <img style="width: 50%" src="http://127.0.0.1:5590/static/carousel/en_3.png" />
            </a-row>
        </div>
    </a-carousel>
</template>

<script>
    export default {
        name: "Carousel"
    }
</script>

<style scoped>
    .Carousel{
        width: 100%;
        position: relative;
    }
</style>