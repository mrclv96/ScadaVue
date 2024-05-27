<template>
    <v-layout align-start>
        <v-flex>
            <v-data-table
                :headers="headers"
                :items="lineas"
                :search="search"
                sort-by="nombre"
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
                <v-toolbar-title>Líneas</v-toolbar-title>
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
                            @click="copiartabla(lineas)"
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
                                    <v-text-field
                                        v-model="nombre"
                                        label="Nombre de línea"
                                    ></v-text-field>
                                    </v-col>
                                    <v-col
                                    cols="6"
                                    sm="6"
                                    md="6"
                                    >
                                    <v-text-field
                                        v-model="noposiciones"
                                        label="Número de Posiciones"
                                        type="number"
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
                            <v-card-title class="text-h5">¿Estas seguro de borrar <br> la Línea?</v-card-title>
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
    import axios from 'axios';
    import { logTraceguardar, errTraceguardarAxios } from '@/Trace';
    export default {
        data() {
            return  {
                    lineas:[],
                    dialog: false,
                    dialogDelete: false,
                    headers: [
                        { text: 'Actions', value: 'actions', sortable: false },
                        //{ text: 'ID', value: 'idSQP', sortable: false },
                        { text: 'Línea', value: 'nombre' },
                        { text: 'Número de Posiciones', value: 'noPosiciones' },
                        { text: 'Estado', value: 'estatus', sortable: false },
                    ],
                    search: '',

                    id: '',
                    nombre:'',
                    noposiciones:'',
                    
                    editedIndex: -1,
                    
                    menu: false,

                    valida: 0,
                    validaMensaje:[],

                    adModal: 0,
                    adAccion: 0,
                    adNombre: '',
                    adId: '',

                    elNombre:'',
                    }
                },
        computed: {
            formTitle () {
            return this.editedIndex === -1 ? 'Nuevo Línea' : 'Editar Línea'
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
                axios.get('api/Lineas/Listar',configuracion).then(function(response){
                    //console.log(response)
                    me.lineas=response.data;
                }).catch(function(error){
                    console.log(error);
                    errTraceguardarAxios("Linea - Listar", error); 
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
                this.id=item.idLinea;
                this.nombre=item.nombre;
                this.noposiciones=item.noPosiciones;
                this.editedIndex=1;
                this.dialog = true
            },
            deleteItem (item) {
                this.editedIndex = item.idLinea;
                this.elNombre=item.nombre;
                this.editedItem = Object.assign({}, item)
                this.dialogDelete = true
            },
            deleteItemConfirm () {
                this.lineas.splice(this.editedIndex, 1)
                let me=this;
                let header={"Authorization" : "Bearer " +this.$store.state.token};
                let configuracion= {headers : header};
                axios.delete('api/Lineas/Eliminar/'+this.editedIndex,configuracion,{}).then(function(response){
                    logTraceguardar("Linea","Eliminó " + me.editedIndex + " "+ me.elNombre);
                    me.listar();
                    me.close();
                    me.limpiar();
                    me.elNombre='';    
                }).catch(function(error){
                    console.log(error);
                    errTraceguardarAxios("Linea - Eliminar", error); 
                })
                this.closeDelete()
            },
            activarDesactivarMostrar(accion,item){
                this.adModal = 1;
                this.adNombre=item.nombre;
                this.adId=item.idLinea;
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
                axios.put('api/Lineas/Activar/'+this.adId,{},configuracion).then(function(response){
                    logTraceguardar("Linea","Activó " + me.adId + " "+ me.adNombre);
                    me.adModal=0;
                    me.adAccion=0;
                    me.adNombre='';
                    me.adId='';
                    me.listar();
                }).catch(function(error){
                    console.log(error);
                    errTraceguardarAxios("Linea - Activar", error); 
                })
            },
            desactivar(){
                let me=this;
                let header={"Authorization" : "Bearer " +this.$store.state.token};
                let configuracion= {headers : header};
                axios.put('api/Lineas/Desactivar/'+this.adId,{},configuracion).then(function(response){
                    logTraceguardar("Linea","Desactivó " + me.adId + " "+ me.adNombre);
                    me.adModal=0;
                    me.adAccion=0;
                    me.adNombre='';
                    me.adId='';
                    me.listar();
                }).catch(function(error){
                    console.log(error);
                    errTraceguardarAxios("Linea - Desactivar", error); 
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
                this.noposiciones="";
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
                    axios.put('api/Lineas/Actualizar',{
                        'idLinea': me.id,
                        'Nombre': me.nombre,
                        'noPosiciones': parseInt(me.noposiciones)
                    },configuracion).then(function(response){
                        logTraceguardar("Linea","Actualizó " + me.id + " "+ me.nombre + " " + me.noposiciones);
                        me.listar();
                        me.close();
                        me.limpiar();    
                    }).catch(function(error){
                        console.log(error);
                        errTraceguardarAxios("Linea - Actualizar", error); 
                    })
                } else {
                    //Código para guardar
                    let me=this;
                    axios.post('api/Lineas/Crear',{
                        'Nombre': me.nombre,
                        'NoPosiciones': parseInt(me.noposiciones)
                    },configuracion).then(function(response){
                        logTraceguardar("Linea","Creó " + me.nombre + " " + me.noposiciones);
                        me.listar();
                        me.close();
                        me.limpiar();    
                    }).catch(function(error){
                        console.log(error);
                        errTraceguardarAxios("Linea - Crear", error); 
                    })
                }    
            },
            validar (){
                this.valida=0;
                this.validaMensaje=[];
                if (this.nombre.length < 2  || this.nombre.length > 51  ){
                    this.validaMensaje.push("El Nombre de la línea debe tener entre 2 a 20 caracteres.");
                }
                if (this.noposiciones <= 0  || this.noposiciones >= 10  ){
                    this.validaMensaje.push("El valor de Número de posiciones debe ser entre 0 y 10.");
                }
                if(this.validaMensaje.length){
                    this.valida=1;
                }
                return this.valida;

            },
    },
}

</script>