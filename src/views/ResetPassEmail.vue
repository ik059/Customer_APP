<template>
    <div id="email" translate="no">
        <img id="ourlogo" src="-" /><br /><br />
        <!--email after succesful registration-->
        <h3>{{$t('linkSent')}}</h3>
        <br/>
        <p>{{$t('checkEmailPassword')}}</p>
        <p>{{$t('thankYou')}}!</p>
        <br />
        <br />
        <a href="/" class="
            btn btn-primary
            black-background
            white
            mt-2
            btn-lg btn-block
            border-0
          " role="button">{{$t('login')}}</a>

    </div>
</template>
<script>
export default {
    nmae: 'Resetemail'
}

</script>
<style>

* {
  font-family: 'Oswald';
}
a{
    background-color: #97bf0d !important;
}
#ourlogo {
    height: 100px;
    widows: 200px;
    margin-top: 10%;
}
</style>