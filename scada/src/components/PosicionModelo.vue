<template>
    <v-layout align-start>
       <v-flex>
        <v-data-table
            :headers="headers"
            :items="posicionmodelos"
            :search="search"
            sort-by="posicion"
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
            <v-toolbar-title>Posición Modelo</v-toolbar-title>
                    <v-divider
                        class="mx-4"
                        inset
                        vertical
                    ></v-divider>
                    <v-spacer></v-spacer>
                    <v-text-field class="text-xs-center" v-model="search" append-icon="search" label="Búsqueda" single-line hide-details></v-text-field>
                    <v-spacer></v-spacer>
                    <v-dialog
                        v-model="dialog"
                        max-width="500px"
                    >
                        <template v-slot:activator="{ on, attrs }">
                        <v-btn
                            color="primary"
                            dark
                            class="mx-2"
                            v-bind="attrs"
                            v-on="on"
                        >
                        <v-icon>add</v-icon>
                            Nuevo
                        </v-btn>
                        <v-btn
                            color="primary"
                            dark
                            class="mx-2"
                            @click="copiartabla(posicionmodelos)"
                        >
                        <v-icon>content_copy</v-icon>
                            Copiar
                        </v-btn>
                        </template>
                        <v-card>
                        <v-card-title>
                            <span class="text-h5">{{ formTitle }}</span>
                        </v-card-title>
            
                        <v-card-text>
                            <v-container>
                            <v-row>
                                <v-col
                                cols="12"
                                sm="12"
                                md="12"
                                >
                                <v-select
                                    v-model="posicion"
                                    :items="posiciones"
                                    label="Posición"
                                ></v-select>
                                </v-col>
                                <v-col
                                cols="12"
                                sm="12"
                                md="12"
                                >
                                <v-text-field
                                    v-model="modelo"
                                    label="Modelo"
                                ></v-text-field>
                                </v-col>
                                <v-col
                                cols="6"
                                sm="6"
                                md="6"
                                >
                                <v-text-field
                                    v-model="cliente"
                                    label="Cliente"
                                ></v-text-field>
                                </v-col>
                                <v-col
                                cols="12"
                                sm="12"
                                md="12"
                                v-show="valida"
                                >
                                <div class="red--text" v-for="v in validaMensaje" :key="v" v-text="v"></div>
                                </v-col>
                            </v-row>
                            </v-container>
                        </v-card-text>
            
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn
                            color="blue darken-1"
                            text
                            @click="close"
                            >
                            Cancelar
                            </v-btn>
                            <v-btn
                            color="blue darken-1"
                            text
                            @click="guardar"
                            >
                            Guardar
                            </v-btn>
                        </v-card-actions>
                        </v-card>
                    </v-dialog>
                    <v-dialog v-model="dialogDelete" max-width="400px">
                        <v-card>
                        <v-card-title class="text-h5">¿Estas seguro de borrar <br> la Posición Modelo?</v-card-title>
                        <v-card-text>
                                Estás a punto de Eliminar {{ elNombre }}
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="blue darken-1" text @click="closeDelete">Cancelar</v-btn>
                            <v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
                            <v-spacer></v-spacer>
                        </v-card-actions>
                        </v-card>
                    </v-dialog>
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
                    <v-icon
                    small
                    class="mr-2"
                    @click="editItem(item)"
                    >
                    mode_edit
                    </v-icon>
                    <v-icon v-if="$store.state.usuario.Rol =='Admin'"
                    small
                    @click="deleteItem(item)"
                    >
                    delete
                    </v-icon>
                    <template v-if="item.estatus">
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
    import { logTraceguardar, errTraceguardarAxios } from '@/Trace';
    export default {
        data() {
            return  {
                    posicionmodelos:[],
                    dialog: false,
                    dialogDelete: false,
                    headers: [
                        { text: 'Actions', value: 'actions', sortable: false },
                        //{ text: 'ID', value: 'idSQP', sortable: false },
                        { text: 'Posición', value: 'posicion' },
                        { text: 'Modelo', value: 'modelo' },
                        { text: 'Cliente', value: 'cliente' },
                        { text: 'Estado', value: 'estatus', sortable: false },
                    ],

                    posiciones: [
                        { text: 'Delantera', value: 'Delantera' },
                        { text: 'Trasera', value: 'Trasera' },
                        { text: 'Spoiler Trasero', value: 'Spoiler Trasero' }
                    ],

                    search: '',

                    id: '',
                    posicion:'',
                    modelo:'',
                    cliente:'',
                    
                    editedIndex: -1,
                    
                    nombre:'',

                    adModal: 0,
                    adAccion: 0,
                    adNombre: '',
                    adId: '',

                    elNombre:'',

                    menu: false,

                    valida: 0,
                    validaMensaje:[]
                    }
                },
        computed: {
                    formTitle () {
                    return this.editedIndex === -1 ? 'Nuevo Posición Modelo' : 'Editar Posición Modelo'
                    },

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
                axios.get('api/PosicionModelos/Listar',configuracion).then(function(response){
                    //console.log(response)
                    me.posicionmodelos=response.data;
                }).catch(function(error){
                    console.log(error);
                    errTraceguardarAxios("PosicionModelo - Listar", error); 
                });
            },
            copiartabla(array){
                let text = "";
                let head=[];
                //get headers from object
                for (const [key] of Object.entries(array[0])) {
                    text += `${key}` + "\t";
                    head.push(`${key}`);
                }
                //get values from the data table
                text += ("\n")
                array.forEach(element => {
                    for (let index = 0; index < head.length; index++) {
                        
                        text += element[head[index]];
                        text += ("\t");
                        
                    }
                    text += ("\n")
                });
                //console.log(text);
                navigator.clipboard.writeText(text);
            },
            editItem (item) {
                this.id=item.idPosicionModelo;
                this.posicion=item.posicion;
                this.modelo=item.modelo;
                this.cliente=item.cliente;
                this.editedIndex=1;
                this.dialog = true
            },

            deleteItem (item) {
                this.editedIndex = item.idPosicionModelo;
                this.elNombre=item.posicion + " " + item.modelo;
                this.editedItem = Object.assign({}, item)
                this.dialogDelete = true
            },

            deleteItemConfirm () {
                this.posicionmodelos.splice(this.editedIndex, 1)
                let me=this;
                let header={"Authorization" : "Bearer " +this.$store.state.token};
                let configuracion= {headers : header};
                axios.delete('api/PosicionModelos/Eliminar/'+this.editedIndex,configuracion,{}).then(function(response){
                    logTraceguardar("PosicionModelo","Eliminó " + me.editedIndex + " "+ me.elNombre);
                    me.elNombre="";
                    me.listar();
                    me.close();
                    me.limpiar();    
                }).catch(function(error){
                    console.log(error);
                    errTraceguardarAxios("PosicionModelo - Eliminar", error); 
                })
                this.closeDelete()
            },
            activarDesactivarMostrar(accion,item){
                this.adModal = 1;
                this.adNombre=item.posicion + " " + item.modelo;
                this.adId=item.idPosicionModelo;
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
                axios.put('api/PosicionModelos/Activar/'+this.adId,{},configuracion).then(function(response){
                    logTraceguardar("PosicionModelo","Activó " + me.adId + " "+ me.adNombre);
                    me.adModal=0;
                    me.adAccion=0;
                    me.adNombre='';
                    me.adId='';
                    me.listar();
                }).catch(function(error){
                    console.log(error);
                    errTraceguardarAxios("PosicionModelo - Activar", error); 
                })
            },

            desactivar(){
                let me=this;
                let header={"Authorization" : "Bearer " +this.$store.state.token};
                let configuracion= {headers : header};
                axios.put('api/PosicionModelos/Desactivar/'+this.adId,{},configuracion).then(function(response){
                    logTraceguardar("PosicionModelo","Desactivó " + me.adId + " "+ me.adNombre);
                    me.adModal=0;
                    me.adAccion=0;
                    me.adNombre='';
                    me.adId='';
                    me.listar();
                }).catch(function(error){
                    console.log(error);
                    errTraceguardarAxios("PosicionModelo - Desactivar", error); 
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
                this.posicion="";
                this.modelo="";
                this.cliente="";
                this.editedIndex=-1;
            },

            guardar () {
                if (this.validar()){
                    return;
                }
                let header={"Authorization" : "Bearer " +this.$store.state.token};
                let configuracion= {headers : header};
                if (this.editedIndex > -1) {
                    //Código para editar
                    let me=this;
                    axios.put('api/PosicionModelos/Actualizar',{
                        'idPosicionModelo': me.id,
                        'Posicion': me.posicion,
                        'Modelo': me.modelo,
                        'Cliente': me.cliente
                    },configuracion).then(function(response){
                        logTraceguardar("PosicionModelo","Actualizó " + me.id + " "+ me.posicion + " " + me.modelo );
                        me.listar();
                        me.close();
                        me.limpiar();    
                    }).catch(function(error){
                        console.log(error);
                        errTraceguardarAxios("PosicionModelo - Desactivar", error); 
                    })
                } else {
                    //Código para guardar
                    let me=this;
                    axios.post('api/PosicionModelos/Crear',{
                        'Posicion': me.posicion,
                        'Modelo': me.modelo,
                        'Cliente': me.cliente
                    },configuracion).then(function(response){
                        logTraceguardar("PosicionModelo","Creó " + me.posicion + " " + me.modelo );
                        me.listar();
                        me.close();
                        me.limpiar();    
                    }).catch(function(error){
                        console.log(error);
                        errTraceguardarAxios("PosicionModelo - Crear", error); 
                    })
                }
            },
            validar (){
                this.valida=0;
                this.validaMensaje=[];
                if (this.posicion.length < 2  || this.posicion.length > 21  ){
                    this.validaMensaje.push("El Posicion debe tener entre 2 a 20 caracteres.");
                }
                if(this.modelo.length < 2  || this.modelo.length > 51  ){
                    this.validaMensaje.push("El Modelo debe tener entre 2 a 20 caracteres.");
                }
                if(this.cliente.length < 2  || this.cliente.length > 21 ){
                    this.validaMensaje.push("El Cliente debe tener entre 2 a 20 caracteres.");
                }
                if(this.validaMensaje.length){
                    this.valida=1;
                }
                return this.valida;
            },
    },
}

</script>