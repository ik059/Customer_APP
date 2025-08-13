<template>
    <div translate="no">
        <sidebar @search-input-emit="search" /><!--sidebar component-->

        <Help />

        <div>
            <button id="machineButton" type="button" class="btn btn-secondary"
                @click.prevent="viewTable">{{ $t('tableView') }}</button>
            <button id="machineButton" type="button" class="btn btn-success"
                @click.prevent="viewMap">{{ $t("mapView") }}</button>
        </div>
        <div>
            <form @submit.prevent="searchPostcode">
                <input type="text" placeholder=" Postleitzahl" v-model="postCode" @input="searchPostcode"
                    style="margin-left:2px; border: 1px solid;" />
                <button class="btn btn-primary" style="background-color: #97bf0d !important;" type="submit"
                    id="sortingButtons"> Suche</button>
            </form>
        </div>
        <div v-if="tableView">
            <br/>
            <div>
                            <label>items in a single page &nbsp;</label>
                            <select v-model="perPage" @change="setPages">
                                <option disabled>all</option>
                                <option>5</option>
                                <option>10</option>
                                <option>50</option>
                                <option>100</option>
                            </select>
                        </div>
            <div class="card">
                
                <div class="card-header">
                    <h2>{{ $t('machines') }}</h2>

                </div>
                <!--license table-->
                <div v-if="noMachines">
                    <p>{{ updates }}</p>
                </div>
                <div v-else>
                   
                    <div class="offset">
                        <table class="table table-striped table-hover table-responsive">
                            <thead>
                                <tr>
                                    <th scope="col">{{ $t('machineName') }}</th>
                                    <th scope="col">{{ $t('location') }}</th>
                                    <th scope="col">{{ $t('appointment') }}?</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="machine in displayedPosts">
                                    <td>{{ machine.machineName }}</td>
                                    <td>{{ machine.address[0].street }}, {{ machine.address[0].city }}, {{
                                        machine.address[0].postcode }}</td>
                                    <td>
                                        <!-- Call to action buttons -->
                                        <ul class="list-inline m-0">
                                            <li class="list-inline-item">
                                                <button class="btn btn-success btn-sm rounded-0" type="button"
                                                    data-toggle="tooltip" data-placement="top"
                                                    @click="value = machine.machineID" v-on:click="bookAppointment">
                                                    <font-awesome-icon
                                                        icon="fa-solid fa-calendar-check" /><!--delete license-->
                                                </button>
                                            </li>
                                        </ul>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                       

                      
                    </div>

                </div>

            </div>
            <nav aria-label="Page navigation example">
                            <ul class="pagination" id="pageNumber">
                                <li class="page-item">
                                    <button type="button" class="page-link" v-if="page != 1" @click="page--"> Vorherige
                                    </button>
                                </li>

                                <li v-if="page >= 1" class="page-item">
                                    <button type="button" class="page-link">
                                      
                                        {{ page }} </button>
                                </li>
                                <li class="page-item">
                                    <button type="button" @click="page++" v-if="page < pages.length" class="page-link"> Weiter
                                    </button>
                                </li>
                            </ul>
                        </nav>

        </div>
        <div v-if="search">
            <div class="card">
                <div class="card-header">
                    <h2>{{ $t('machines') }}</h2>

                </div>
                <!--license table-->
                <div v-if="noMachines">
                    <p>{{ updates }}</p>
                </div>
                <div v-else>
                    <table class="table table-striped table-hover table-responsive">
                        <thead>
                            <tr>

                                <th scope="col">{{ $t('machineName') }}</th>
                                <th scope="col">{{ $t('location') }}</th>
                                <th scope="col">{{ $t('appointment') }}?</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="machine in posts">

                                <td>{{ machine.machineName }}</td>
                                <td>{{ machine.address[0].street }}, {{ machine.address[0].city }}, {{
                                    machine.address[0].postcode }}</td>
                                <td>
                                    <!-- Call to action buttons -->
                                    <ul class="list-inline m-0">
                                        <li class="list-inline-item">
                                            <button class="btn btn-success btn-sm rounded-0" type="button"
                                                data-toggle="tooltip" data-placement="top"
                                                @click="value = machine.machineID" v-on:click="bookAppointment">
                                                <font-awesome-icon icon="fa-solid fa-calendar-check" /><!--delete license-->
                                            </button>
                                        </li>
                                    </ul>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <div v-if="mapView" class="map">
            <Map />

        </div>
    </div>
</template>
<script>
import axios from "axios";
import Sidebar from "@/components/Sidebar.vue";
import Map from '@/components/Map.vue'
import Help from "@/components/Help.vue";
export default {
    data() {
        return {
            posts: [''],
            page: 1,
            perPage:5,
            pages: [],
            details: "",
            machines: [],
            isActive: false,
            ongoingDeletedLicense: '',
            value: '',
            tableView: true,
            mapView: false,
            updates: "",
            postCode: '',
            noMachines: false,
            search: false
        }
    },
    components: {
        Sidebar,
        Map,
        Help
    },
    methods: {
        getPosts() {
            axios.get(process.env.VUE_APP_HOST +"/machinelist")
                .then((res) => {
                    this.posts = res.data,
                    this.perPage =res.data.length
                });
        },
        paginate(posts) {
            let page = this.page;
            let perPage = this.perPage;
            let from = (page * perPage) - perPage;
            let to = (page * perPage);
            return posts.slice(from, to);
        },
        searchPostcode() {
            this.tableView = false
            this.search = true
            axios.post(process.env.VUE_APP_HOST +"/searchmachinebypostcode", { postcode: this.postCode }).then((res) => {
                if (res.data.length == 0) {
                    this.noMachines = true
                    this.updates = 'Keine Maschinen mit dieser Postleitzahl gefunden'
                }
                else {
                    
                    this.noMachines = false
                    this.posts = res.data
                }

            }).then(()=>{
                if(this.postCode == 0){
                this.tableView = true
                this.search = false
            }
            })
           
        },
        bookAppointment() {
            this.$router.push({ path: 'appointment', query: { machine: this.value } })
        },
        viewMap() {
            this.tableView = false
            this.mapView = true
        },
        viewTable() {
            this.mapView = false
            this.tableView = true
        },
        setPages () {
            this.page=1
            this.pages = []
			let numberOfPages = Math.ceil(this.posts.length / this.perPage);
			for (let index = 1; index <= numberOfPages; index++) {
				this.pages.push(index);
			}
		},

    },
    mounted() {

    },
    computed: {
      
        displayedPosts() {
            return this.paginate(this.posts);
        }
    },
    watch: {
        setPages () {
			let numberOfPages = Math.ceil(this.posts.length / this.perPage);
			for (let index = 1; index <= numberOfPages; index++) {
				this.pages.push(index);
			}
		},
    },
    created() {
        this.getPosts();
    },
    filters: {
        trimWords(value) {
            return value.split(" ").splice(0, 20).join(" ") + '...';
        }
    }
}
</script>
<style scoped>

* {
  font-family: 'Oswald';
}
#pageNumber{
    justify-content: center;
}
.btn-primary {
    margin-left: 10px;
    border-radius: 0 !important;
    border-color: #97bf0d;
}

h2 {
    text-transform: uppercase;
    font-weight: bold;
}


.btn-secondary {
    border-radius: 0 !important;
}

.btn-success {
    border-radius: 0 !important;
    background-color: #97bf0d !important;
    border-color: #97bf0d;
}

.card {
    height: auto;
    width: auto;
    margin-top: 20px;
    margin-left: 20px;
    margin-right: 20px;
}

.card-header {
    background: #97bf0d;
    color: white;
}

#delete {
    height: 70px;
    width: 45px;
}

.popup {
    background: #f5f5f5;
    width: 350px;
    height: 200px;

    border-radius: 10px;
    border: 2px solid #97bf0d;
    box-sizing: border-box;
    z-index: 1000;
    text-align: center;
    opacity: 0;
    top: -200%;
}

.active {
    opacity: 1;
    top: 50%;
    left: 59%;
    transform: translate(-80%, -60%) scale(1);
    transition: transform 100ms cubic-bezier(1.01, 0.89, 0.43, 0.19);
}

.center {
    position: absolute;
}

.popup .cancelButton {
    margin-top: 50px;
}

.popup .cancelButton button {
    padding: 10px 20px;

    font-size: 16px;
    font-weight: 600;
    outline: none;
    border-radius: 10px;
    transition: all 300ms ease-in-out;
    cursor: pointer;
    margin-left: 10px;
}

.map {
    display: table;
    margin-left: auto;
    margin-right: auto;
}

#machineButton {
    margin: 1%;
}

@media (max-width: 575.98px) {
    .card {
        height: auto;
        width: auto;
        position: absolute;
        margin-left: 10px;
        margin-right: 10px;
        font-size: small;
    }

    #machineButton {
        margin-top: 10px;
    }

    .table {
        height: auto;
        font-size: x-small;
    }

    .popup {
        margin-left: 70px;
        height: auto;
        width: 250px;
    }
    button.page-link {
    font-size: 10px;
    color: #97bf0d;
    font-weight: 200;
}
}

@media only screen and (min-width: 600px) {

    .card {
        width: auto;
        margin-left: 10px;
        margin-right: 10px;
    }
}

button.page-link {
    display: inline-block;
}

button.page-link {
    font-size: 20px;
    color: #97bf0d;
    font-weight: 500;
}
</style>