<template>
	<sidebar @search-input-emit="search" /><!--sidebar component-->
	<div class="container" translate="no">
		<Help/>
		<div class="card">
			<div class="card-header">
				<h2 >Profil Bearbeiten</h2>
			</div>
			<div class="row gutters">
				<div class="">

					<div class="card-body">
						<div class="account-settings">
							<div class="user-profile">
								<!--customer info-->
								<div class="user-avatar">
									<img v-bind:src="profilePic"
										alt="avatar" class="rounded-circle img-fluid" style="width: 150px; height:150px; padding: 2px; border: 5px solid #97bf0d" />
								</div>
								<h5 class="user-name">{{$t('customer')}}</h5>
								<h6 class="user-email">{{ customerDetails }}</h6>
							</div>


						</div>
					</div>
				</div>
				<div class="profilesection">

					<!--edit details-->
					<div class="row gutters">
						<div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
							<h6 class="mb-2 text-primary">{{$t('personalDetails')}}</h6>
						</div>
						<div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
							<div class="form-group">
								<label for="fullName">{{$t('fName')}}</label>
								<input type="text" class="form-control" id="fullName" placeholder="Enter full name"
									v-model="fName">
							</div>
						</div>
						<div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
							<div class="form-group">
								<label for="fullName">{{$t('lastName')}}</label>
								<input type="text" class="form-control" id="fullName" placeholder="Enter full name"
									v-model="lName">
							</div>
						</div>
						<div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
							<div class="form-group">
								<label for="phone">{{$t('phone')}}</label>
								<input type="text" class="form-control" id="phone" placeholder="Enter phone number"
									v-model="cNumber">
							</div>
						</div>
						<div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
							<div class="form-group">
								<label for="eMail">Email</label>
								<input type="email" class="form-control" id="eMail" placeholder="Enter email ID"
									v-model="email">
							</div>
						</div>
					</div>
					<div class="row gutters">
						<div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
							<h6 class="mt-3 mb-2 text-primary">{{$t('billingAddress')}}</h6>
						</div>
						<div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
							<div class="form-group">
								<label for="Street">{{$t('street')}}</label>
								<input type="name" class="form-control" id="Street" placeholder="Enter Street"
									v-model="street">
							</div>
						</div>
						<div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
							<div class="form-group">
								<label for="Street">Hausnummer</label>
								<input type="name" class="form-control" id="Street" placeholder="Hausnummer"
									v-model="streetnumber">
							</div>
						</div>
						<div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
							<div class="form-group">
								<label for="ciTy">{{$t('city')}}</label>
								<input type="name" class="form-control" id="ciTy" placeholder="Enter City"
									v-model="city">
							</div>
						</div>

						<div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
							<div class="form-group">
								<label for="zIp">{{$t('postCode')}}</label>
								<input type="text" class="form-control" id="zIp" placeholder="Zip Code"
									v-model="postCode">
							</div>
						</div>
					</div>
					<div class="row gutters">
						<div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12" id="buttons">
							<div class="text-right"><!--action buttons-->
								<a href="#/profile">
									<button type="button" id="submit" name="submit"
										class="btn btn-secondary">Zurück</button>
								</a>
								<button type="button" id="submit" name="submit" class="btn btn-primary"
									@click.prevent="updateProfile">
									<div v-if="loading" class="spinner-border spinner-border-sm"></div>
									{{ $t('update') }}</button>
							</div>
						</div>
					</div>
					{{ updates }}
					<br/>
				<br/>
				</div>
			
			</div>
			
		</div>
		
	</div>

	<!-- <Footer v-if="!isLoading"/> -->

</template>

<script>
import axios from 'axios'
import Sidebar from "@/components/Sidebar.vue";
import Help from '@/components/Help.vue';
import Footer from '@/components/Footer.vue';
export default {
	name: "EditProfile",
	data() {
		return {
			mobileTrue: false,
			customerDetails: {},
			fName: '',
			lName: '',
			cNumber: '',
			email: '',
			street: '',
			city: '',
			postCode: '',
			updates: '',
			profilePic:'',
			loading: false,
			streetnumber:'',
			isLoading: false
		}
	},
	components: {
		Sidebar,Help,Footer
	},
	methods: {
		updateProfile() {
			this.loading = true
			const profileDetails = {
				customerID: this.customerDetails,
				firstName: this.fName,
				lastName: this.lName,
				contactNumber: this.cNumber,
				email: this.email,
				street: this.street,
				city: this.city,
				postcode: this.postCode,
				streetnumber: this.streetnumber
			}

			axios.post(process.env.VUE_APP_HOST +'/updateprofile', profileDetails).then((res) => {
				this.updates = res.data
				this.loading = false
			})
		}

	},
	mounted() {
		if (window.innerWidth < 767) {
      this.mobileTrue = true
    }
    else {
      this.mobileTrue = false
    }
		axios.get(process.env.VUE_APP_HOST +"/user", {
			headers: { token: localStorage.getItem("token") },
		}).then((res) => {
			this.customerDetails = res.data.user.customerID
			this.fName = res.data.user.firstName
			this.lName = res.data.user.lastName
			this.cNumber = res.data.user.contactNumber
			this.email = res.data.user.email
			this.street = res.data.user.street
			this.city = res.data.user.city
			this.postCode = res.data.user.postcode
			this.profilePic = res.data.user.profilePicture
			this.streetnumber = res.data.user.streetnumber
			this.isLoading = false
		})
	},
};
</script>

<style scoped>
#buttons{
	margin-top: 20px;
	display: flex;
	justify-content: center;
}
.profilesection{
	  margin-top: 20px;
  padding: 20px;

  border-radius: 10px;
}
input{
	  border-radius: 5px !important;
	  padding: 10px;
}


* {
  font-family: 'Oswald';
}
.footer{
  background-color: #97bf0d;
  height: 56px;
  text-align: center;
  position: fixed;
  bottom: 0;
  width: 85%;
  display: flex;
  flex-direction: column;
  text-align: center;

}
#copyright{
  font-size: 10px;
  color:white;
  
}
.links {
        font-size: 9px;
		color:white;


    }
h2{
  font-weight: bold;
}
.text-primary{
	color: #97bf0d !important;
}
body {
	margin: 0;
	padding-top: 40px;
	color: #2e323c;
	background: #f5f6fa;
	position: relative;
	height: 100%;
}

.account-settings .user-profile {
	margin: 0 0 1rem 0;
	padding-bottom: 1rem;
	text-align: center;
}






.account-settings .user-profile h6.user-email {
	margin: 0;
	font-size: 0.8rem;
	font-weight: 400;
	color: #97bf0d;
}

.account-settings .about {
	
	text-align: center;
}

.account-settings .about h5 {
	color: #007ae1;
}

.account-settings .about p {
	font-size: 0.825rem;
}

.form-control {
	border: 1px solid #cfd1d8;
	-webkit-border-radius: 2px;
	-moz-border-radius: 2px;
	border-radius: 2px;
	font-size: .825rem;
	background: #ffffff;
	color: #2e323c;
}

.card-header {
	background: #97bf0d;
  color: white;
  height: auto;
  width: 430px;
  font-size: 36px;
  margin:10px auto;
  border-radius:10px;
  text-align: center;
  padding: 10px;
}

.container {
	width: auto;
	height: auto;
}

.card {
	margin-top: 20px;
	height: auto;
	width: auto;
	border:none;
}
.card-body{
	margin-bottom: 0;
}

.btn-secondary {
	margin-right: 5px;
	margin-top: 10px;
	background-color: #575656 !important;
  border: #575656 !important;
  border-radius: 10px !important;

	margin-bottom: 5px;

}

.btn-primary {
	margin-top: 10px;
	margin-right: 5px;
	border-radius: 10px !important;
	background-color: #97bf0d !important;
	border-color: #97bf0d;
	margin-bottom: 5px;
}
@media (max-width: 575.98px) {
.card{
	font-size: xx-small;
	margin-bottom: 10vh;
}
.form-control{
	height: 15px;
	font-size: x-small;
}

}
@media (max-width: 990px) {
	.card-header{
		background: #97bf0d;
  color: white;
  height:50px;
  width: 260px;
  font-size: 48px;
  border-radius: 10px;
  margin: auto;
  display: flex;
  justify-content: center;
	}
}
</style>