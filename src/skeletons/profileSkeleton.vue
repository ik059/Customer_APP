<template>
<div class="card" id="main">
    <div class="card-header">
      <h2></h2>
    </div>


    <div class="row">
      <div class="col">
        <div class="card ">
          <div class="card-body text-center">
            <img alt="avatar" class="rounded-circle img-fluid" style="width: 150px" />
            <br />
            <br />
            <button type="button" class="btn btn-primary" >
              Avatar ändern
            </button><!--customer details-->
            <h5 class=""></h5>
            <p class="text-muted "></p>
            <p class="text-muted ">
            
            </p>
            <div class="d-flex justify-content-center ">
              <a href="#/profile/editprofile">
                <button type="button" class="btn btn-primary">
                  {{ $t("editProfile") }}
                </button></a><!--routing to edit profile-->
              <a href="#/profile/editprofile">
                <button type="button" class="btn btn-secondary">
                  {{ $t("updatePassword") }}
                </button></a>
            </div>
          </div>
        </div>
      </div>

      <div class="col">

        <div class="card ">

          <div class="card-body">

            <div class="row">

              <div class="col">
                <!--customer information-->
                <p class="mb-0">{{ $t("fullName") }}</p>
              </div>
              <div class="col">
                <p class="text-muted "></p>
              </div>
            </div>
            <hr />
            <div class="row">
              <div class="col">
                <p class="mb-0">Email</p>
              </div>
              <div class="col">
                <p class="text-muted mb-0"></p>
              </div>
            </div>

            <hr />
            <div class="row">
              <div class="col">
                <p class="mb-0">{{ $t('mobile') }}</p>
              </div>
              <div class="col">
                <p class="text-muted mb-0"></p>
              </div>
            </div>
            <hr />
            <div class="row">
              <div class="col">
                <p class="mb-0">{{ $t("billingAddress") }}</p>
              </div>
              <div class="col">
                <p class="text-muted mb-0">
                </p>
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="co">
            <div class="card ">
              <div class="card-body">
                <p class="mb">{{ $t('license') }}</p>
                <!--customer licenses-->
                <p>Anzahl der Lizenzen:&nbsp;<strong></strong></p>
              </div>
            </div>
          </div>
          <div class="col">
            <div class="card">
              <div class="card-body">
                <p class="">{{ $t('certificate') }}</p>
                <!--customer certificates-->
                <p>Anzahl der Bescheinigungen:&nbsp;<strong></strong></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default{
    name:'profileSkeleton',

}


</script>