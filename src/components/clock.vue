<template>
    <div>

        <div v-if="isPhone">
            <div class="clock">
                <font-awesome-icon icon="fa-solid fa-clock" style="margin-top:5px; color:#97bf0d;"  /> &nbsp;{{ hours }}:{{ minutes }} Uhr
                &nbsp;
                <font-awesome-icon icon="fa-solid fa-calendar" style="margin-top:5px; color:#97bf0d;" /> &nbsp; {{ date }}. {{ ' '+month }}. {{ ' '+year }}
            </div>
        </div>
        <div v-if="isTablet">
            <div class="containerTablet">
                <div >
                    <font-awesome-icon icon="fa-solid fa-clock" style="height:18px; color:#97bf0d;" />
                   {{ hours }}:{{ minutes }} Uhr
                    <font-awesome-icon icon="fa-solid fa-calendar" style="height:18px; color:#97bf0d;" />
                 {{ date }}. {{ ' '+month}}. {{ ' '+year }}
                </div>
              

             
            </div>
        </div>
        <div v-if="isBigScreen">
            <div class="container">
                <div class="clock1">
                    <font-awesome-icon icon="fa-solid fa-clock" style="margin-top:7px; height:24px; color:#97bf0d;" />&nbsp; 
                    <div style="font-weight:100 !important; font-size:24px;">&nbsp;{{ hours }}:{{ minutes }} Uhr&nbsp;&nbsp;</div>
                </div>
                &nbsp;&nbsp;

                <div class="clock1">
                    <font-awesome-icon icon="fa-solid fa-calendar" style="margin-top:7px; height:24px; color:#97bf0d;" />
                    <div style="font-weight:100 !important; font-size:24px;"> &nbsp;&nbsp;{{ date}}. {{' '+month }}. {{ ' '+year }}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
*{
  font-family: 'Oswald';
  color:black;
}
.container {

    font-weight: bold;

    display: flex;
    flex-direction: row;
    justify-content: center;

}
.clock {
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin: auto;
}
.clock1 {
    display: flex;
    flex-direction: row;
}

.active {
    display: flex;
    flex-direction: column;
}
</style>
<script>

export default {
    name: "DigitalClock",
    data() {
        return {
            hours: 0,
            minutes: 0,
            seconds: 0,
            date: '',
            month: '',
            year: '',
            isPhone: false,
            isTablet:false,
            isBigScreen:false
        }
    },
    mounted() {
        setInterval(() => this.setTime(), 1000)
        if (window.innerWidth < 767) {
            this.isPhone = true
            this.isTablet = false
            this.isBigScreen = false
        }
        if (window.innerWidth > 767 && window.innerWidth < 1281){
            this.isTablet=true

        }
        if (window.innerWidth > 1279){
            this.isBigScreen = true
            this.isTablet = false
        }
    },
    methods: {
        setTime() {
            const date = new Date();
            let hours = date.getHours();
            let minutes = date.getMinutes();
            let seconds = date.getSeconds();
            let todayDate = date.getDate()
            let month = date.getMonth() + 1
            let year = date.getFullYear()
            hours = hours <= 9 ? `${hours}`.padStart(2, 0) : hours;
            minutes = minutes <= 9 ? `${minutes}`.padStart(2, 0) : minutes;
            seconds = seconds <= 9 ? `${seconds}`.padStart(2, 0) : seconds;
            this.hours = hours;
            this.minutes = minutes;
            this.seconds = seconds;
            this.date = todayDate
            this.month = month
            this.year = year
            if(this.month === 1){
                this.month = 'Jan'
            }
            if(this.month === 2){
                this.month = 'Feb'
            }
            if(this.month === 3){
                this.month = 'Mar'
            }
            if(this.month === 4){
                this.month = 'Apr'
            }
            if(this.month === 5){
                this.month = 'May'
            }
            if(this.month === 6){
                this.month = 'Jun'
            }
            if(this.month === 7){
                this.month = 'Jul'
            }
            if(this.month === 8){
                this.month = 'Aug'
            }
            if(this.month === 9){
                this.month = 'Sep'
            }
            if(this.month === 10){
                this.month = 'Oct'
            }
            if(this.month === 11){
                this.month = 'Nov'
            }
            if(this.month === 12){
                this.month = 'Dec'
            }
        }
    }
}
</script>
