<template>
    <div id="email" translate="no">
        <img id="logo" src="-"/><br/><br/>
        <font-awesome-icon icon="fa fa-frown-o" id="success"/>
        <h1>Oops!</h1>
        <h1>{{$t('wentWrong')}}</h1>
        <h2>{{$t('problem')}}</h2>
        <h2>{{$t('tryAgain')}}</h2>
        <h3>{{$t('thankYou')}}</h3>
        <br/>
        <br/>
        <router-link to="registration" id="link">{{$t('register')}}</router-link>

    </div>
</template>
<script>
export default{
    name:'Wrong',
    data(){
        return{
            customerID: ''
        }
    },
    mounted(){
        this.customerID = this.$route.query.customer;
    }
}
</script>
<style scoped>

* {
  font-family: 'Oswald';
}
body{
    background-color: #97bf0d;;
}
#logo{
    margin-top: 20px;
    height: 150px;
    width: 450px;
    background-color: aliceblue;
    padding: 5px;
    border-radius: 10%;
}
#success{
    height: 100px;
    color: greenyellow;
    border: 2px solid gold;
    padding: 10px;
    border-radius: 50%;
    background-color: #ADD8E6;
}
#customer{
    color:brown
}

#link{
    text-decoration: none;
    height: 50px;
    color: aliceblue;
    cursor: pointer;
}

</style>