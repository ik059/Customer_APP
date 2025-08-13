<!-- This component will display as a popup slideshow with multiple images shared via props -->
<template>
    <div class="slideshow" v-if="showImage">
        <button @click="closeImage" class="slideshow__close">
            <i class="fas fa-times"></i>
        </button>
        <div class="slideshow__container">
        <div class="slideshow__slides" @keydown.left="prev" @keydown.right="next">
            <img
            v-for="(image, index) in images"
            :key="index"
            :src="image"
            :class="{ 'slideshow__slide--active': index === activeIndex }"
            class="slideshow__slide"
            />
        </div>
        <button @click="prev" class="slideshow__button slideshow__button--prev">
            <i class="fas fa-chevron-left"></i>
        </button>
        <button @click="next" class="slideshow__button slideshow__button--next">
            <i class="fas fa-chevron-right"></i>
        </button>
        </div>
        <div id="downloadDiv">
            <button id="downloadButton" @click.prevent="downloadButton(images[activeIndex])">Download</button>
        </div>
    </div>
</template>
<script>
export default {
    name: 'Slideshow',
    props: {
        images: {
            type: Array,
            required: true
        },
        showImage: {
            type: Boolean,
            required: true
        },
        closeImage: {
            type: Function,
            required: true
        },
    },
    data() {
        return {
            activeIndex: 0
        }
    },


   
    methods: {
        downloadButton(image) {
            
            let imageName = image.split('machineImages/')[1]
            console.log(imageName);
            const a = document.createElement('a');
            a.href = image;
            a.download = imageName;
            a.target = '_blank';
            a.click();
            
        },
        next() {
            this.activeIndex = this.activeIndex === this.images.length - 1 ? 0 : this.activeIndex + 1
        },
        prev() {
            this.activeIndex = this.activeIndex === 0 ? this.images.length - 1 : this.activeIndex - 1
        },
        handleKeydown(event) {
            if (event.key === "ArrowRight") this.next();
            if (event.key === "ArrowLeft") this.prev();
            if (event.key === "Escape") this.closeImage(); // Close slideshow on ESC
        }

    },
    mounted() {
        window.addEventListener("keydown", this.handleKeydown);
    },
    beforeUnmount() {
        window.removeEventListener("keydown", this.handleKeydown);
    }
}
</script>
<style scoped>
#downloadDiv{
    position: absolute;
    bottom: 10px;
    left:45%;
    background-color: transparent;
    border: none;
    color: white;
    font-size: 34px;
    cursor: pointer;
}
#downloadButton{
    background-color: #97bf0d;
    color: white;
    cursor: pointer;
    padding: 10px 20px;
    border-radius: 5px;
    border: none;
    color: white;
    font-size: 24px;
    cursor: pointer;
    border: none;
}
.slideshow {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    z-index: 1000;
    display: flex;
    justify-content: center;
    align-items: center;
}
.slideshow__close {
    position: absolute;
    top: 10px;
    right: 10px;
    background-color: transparent;
    border: none;
    color: white;
    font-size: 34px;
    cursor: pointer;
}
.slideshow__container {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
}
.slideshow__slides {
    display: flex;
    justify-content: center;
    align-items: center;
}
.slideshow__slide {
    max-width: 90%;
    max-height: 80%;
    display: none;
}
.slideshow__slide--active {
    display: block;
}
.slideshow__button {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background-color: transparent;
    border: none;
    color: white;
    font-size: 24px;
    cursor: pointer;
}
.slideshow__button--prev {
    left: -10px;
}
.slideshow__button--next {
    right: -10px;
}
@media (max-width: 768px) {
    .slideshow__button {
        font-size: 20px;
    }
    .slideshow__button--prev {
    left: 0px;
}
.slideshow__button--next {
    right: 0px;
}
#downloadDiv{
    position: absolute;
    bottom: 15px;
    left:35%;
    background-color: transparent;
    border: none;
    color: white;
    font-size: 24px;
    cursor: pointer;
}
}
@media (min-width: 786px) and (max-width: 1024px) {
    .slideshow__button {
        font-size: 22px;
    }
    .slideshow__button--prev {
    left: 5px;
    }
    .slideshow__button--next {
    right: 5px;
    }
    #downloadDiv{
    position: absolute;
    bottom: 30px;
  
    }
}
</style>