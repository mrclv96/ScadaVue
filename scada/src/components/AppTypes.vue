<template>
    <v-layout align-start>
        <v-flex>
            <v-data-table
                :headers="headers"
                :items="apptypes"
                :search="search"
                sort-by="TypeID"
                class="elevation-1"
                >
                <template v-slot:top>
                    <v-toolbar
                    flat
                    >
                <v-toolbar-title>Application Types</v-toolbar-title>
                        <v-divider
                            class="mx-4"
                            inset
                            vertical
                        ></v-divider>
                        <v-spacer></v-spacer>
                        <v-text-field class="text-xs-center" v-model="search" append-icon="search" label="Búsqueda" single-line hide-details></v-text-field>
                        <v-spacer></v-spacer>
                        <v-btn
                            color="primary"
                            dark
                            class="mx-2"
                            @click="copiartabla(apptypes)"
                        >
                        <v-icon>content_copy</v-icon>
                            Copiar
                        </v-btn>
                        <v-dialog v-model="adModal" max-width="290">
                            <v-card>
                                <v-card-title class="headline" v-if="adAccion==1"> ¿Activar Item?</v-card-title>
                                <v-card-title class="headline" v-if="adAccion==2"> ¿Desactivar Item?</v-card-title>
                                <v-card-text>
                                    Estás a punto de
                                    <span v-if="adAccion==1"> Activar </span>
                                    <span v-if="adAccion==2"> Desactivar </span>
                                    el ítem {{ adNombre }}
                                </v-card-text>
                                <v-card-actions>
                                <v-spacer></v-spacer>
                                    <v-btn color="green darken-1" text @click="activarDesactivarCerrar">Cancelar</v-btn>
                                    <v-btn v-if="adAccion==1" color="orange darken-4" text @click="activar">Activar</v-btn>
                                    <v-btn v-if="adAccion==2" color="orange darken-4" text @click="desactivar">Desactivar</v-btn>
                                <v-spacer></v-spacer>
                            </v-card-actions>
                            </v-card>
                        </v-dialog>
                        </v-toolbar>
                </template>
                <template v-slot:item.actions="{ item }">
                        <template v-if="item.typeStatus">
                            <v-icon
                            small
                            @click="activarDesactivarMostrar(2,item)"
                            >
                            block
                            </v-icon>
                        </template>
                        <template v-else>
                            <v-icon
                            small
                            @click="activarDesactivarMostrar(1,item)"
                            >
                            check
                            </v-icon>
                        </template>
                </template>
                <template v-slot:no-data>
                        <v-btn
                        color="primary"
                        @click="listar"
                        >
                        Reset
                        </v-btn>
                </template>
                <template v-slot:item.typeStatus="{ item }">
                    <div v-if="item.typeStatus">
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
    import { logTraceguardar, errTraceguardarAxios } from '@/Trace';
    export default {
        data() {
            return  {
                    apptypes:[],
                    dialog: false,
                    dialogDelete: false,
                    headers: [
                        { text: 'Opciones', value: 'actions', sortable: false },
                        //{ text: 'ID', value: 'idSQP', sortable: false },
                        { text: 'Code', value: 'typeCode' },
                        { text: 'Lab', value: 'typeLab' },
                        { text: 'Part Nb1', value: 'typePartNb1'},
                        { text: 'Part Nb2', value: 'typePartNb2'},
                        { text: 'Author', value: 'typeAuthor'},
                        { text: 'Estado', value: 'typeStatus'}
                    ],
                    search: '',
                    id: '',

                    editedIndex: -1,

                    menu: false,

                    adModal: 0,
                    adAccion: 0,
                    adNombre: '',
                    adId: '',

                    valida: 0,
                    validaMensaje:[],

                    
                }
        },
        computed: {
        },
        watch: {
            dialog (val) {
            val || this.close()
            },
            dialogDelete (val) {
            val || this.closeDelete()
            },
        },
        created () {
            this.listar();
        },
        methods: {
            listar(){
                let me=this;
                let header={"Authorization" : "Bearer " +this.$store.state.token};
                let configuracion= {headers : header};
                axios.get('api/App_Types/Listar',configuracion).then(function(response){
                    //console.log(response.data);
                    me.apptypes=response.data;
                }).catch(function(error){
                    console.log(error);
                    errTraceguardarAxios("App Types - Listar", error); 
                });
            },
            activarDesactivarMostrar(accion,item){
                this.adModal = 1;
                this.adNombre=item.typeLab;
                this.adId=item.typeID;
                if(accion==1){
                    this.adAccion=1;
                }
                else if (accion == 2){
                    this.adAccion=2;
                }
                else{
                    this.AdModal=0;
                }
            },
            activarDesactivarCerrar(){
                this.adModal=0;
            },
            activar(){
                let me=this;
                let header={"Authorization" : "Bearer " +this.$store.state.token};
                let configuracion= {headers : header};
                axios.put('api/App_Types/Activar/'+this.adId,{},configuracion).then(function(response){
                    logTraceguardar("App Types","Activó " + me.adId + " "+ me.adNombre);
                    me.adModal=0;
                    me.adAccion=0;
                    me.adNombre='';
                    me.adId='';
                    me.listar();
                }).catch(function(error){
                    console.log(error);
                    errTraceguardarAxios("App Types - Activar", error); 
                })
            },
            desactivar(){
                let me=this;
                let header={"Authorization" : "Bearer " +this.$store.state.token};
                let configuracion= {headers : header};
                axios.put('api/App_Types/Desactivar/'+this.adId,{},configuracion).then(function(response){
                    logTraceguardar("App Types","Desactivó " + me.adId + " "+ me.adNombre);
                    me.adModal=0;
                    me.adAccion=0;
                    me.adNombre='';
                    me.adId='';
                    me.listar();
                }).catch(function(error){
                    console.log(error);
                    errTraceguardarAxios("App Types - Desactivar", error); 
                })
            },
            close () {
                this.dialog = false
                this.limpiar();
            },
            closeDelete () {
                this.dialogDelete = false
                this.$nextTick(() => {
                    this.editedItem = Object.assign({}, this.defaultItem)
                    this.editedIndex = -1
                })
            },
            limpiar(){
                this.id="";
                this.nombre="";
                this.editedIndex=-1;
            },
            copiartabla(array){
                let text = "";
                let head=[];
                for (const [key] of Object.entries(array[0])) {
                    text += `${key}` + "\t";
                    head.push(`${key}`);
                }
                text += ("\n")
                array.forEach(element => {
                    for (let index = 0; index < head.length; index++) {
                        
                        text += element[head[index]];
                        text += ("\t");
                        
                    }
                    text += ("\n")
                });
                navigator.clipboard.writeText(text);
                //console.log(array);
                this.$store.dispatch('setSnackbar', {color: 'success', text: 'La tabla se copió.', icon: 'info'});
            },
    },
}

</script>