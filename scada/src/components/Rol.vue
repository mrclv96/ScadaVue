<template>
    <v-layout align-start>
        <v-flex>
            <v-data-table
                :headers="headers"
                :items="roles"
                :search="search"
                sort-by="Nombre"
                class="elevation-1"
                :footer-props="{
                    showFirstLastPage: true,
                    firstIcon: 'first_page',
                    prevIcon: 'chevron_left',
                    nextIcon: 'chevron_right',
                    lastIcon: 'last_page'
                }"
                >
                <template v-slot:top>
                    <v-toolbar
                    flat
                    >
                <v-toolbar-title>Roles</v-toolbar-title>
                        <v-divider
                            class="mx-4"
                            inset
                            vertical
                        ></v-divider>
                        <v-spacer></v-spacer>
                        <v-text-field class="text-xs-center" v-model="search" append-icon="search" label="Búsqueda" single-line hide-details></v-text-field>
                        <v-spacer></v-spacer>
                        </v-toolbar>
                </template>
                <template v-slot:no-data>
                        <v-btn
                        color="primary"
                        @click="listar"
                        >
                        Reset
                        </v-btn>
                </template>
                <template v-slot:item.estatus="{ item }">
                    <div v-if="item.estatus">
                        <span class="blue--text">Activo</span>
                    </div>
                    <div v-else>
                        <span class="red--text">Inactivo</span>
                    </div>
                </template> 
            </v-data-table>
        </v-flex> 
    </v-layout>
</template>

<script>
    import axios from 'axios'
    import { errTraceguardarAxios } from '@/Trace';
    export default {
        data() {
            return  {
                    roles:[],
                    dialog: false,
                    dialogDelete: false,
                    headers: [
                        { text: 'Nombre', value: 'nombre' },
                        { text: 'Descripción', value: 'descripcion' },
                        { text: 'Estado', value: 'estatus' }
                    ],
                    search: '',

                    }
                },
        computed: {

        },

        watch: {

        },

        created () {
            this.listar();

        },
        methods: {
            listar(){
                let me=this;
                let header={"Authorization" : "Bearer " +this.$store.state.token};
                let configuracion= {headers : header};
                axios.get('api/Roles/Listar',configuracion).then(function(response){
                    //console.log(response)
                    me.roles=response.data;
                }).catch(function(error){
                    console.log(error);
                    errTraceguardarAxios("Rol - Listar", error); 
                });        
            },
    },
}

</script>