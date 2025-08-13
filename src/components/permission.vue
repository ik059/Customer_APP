<template>
    <div id="permission">
        <div class="popup center" v-bind:class="{ active: isActive }">

            <div class="title">
                <h2></h2>
            </div>
            <div v-if="confirming">
                <div>
                    <font-awesome-icon icon="fa-solid fa-calendar-check" style="color:#97bf0d; height: 45px;" />
                </div>
                <div class="cancelButton ">
                    <button class="btn btn-success" id="book" v-on:click="booking">
                        {{ $t('confirm') }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'DataHandlingPermission',
    data() {
        return {
            isActive : true
        }
    }
}

</script>
<style>

* {
  font-family: 'Oswald';
}

h1 {
  text-transform: uppercase;
}

.center {
  position: absolute;
}
</style>