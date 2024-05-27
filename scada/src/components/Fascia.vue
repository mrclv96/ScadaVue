<template>
    <v-layout align-start>
        <v-flex>
            <v-data-table
                :headers="headers"
                :items="fascias"
                :search="search"
                sort-by="modelom100pos0"
                class="elevation-1"
                :loading="cargando"
                loading-text="Cargando... Favor esperar"
                :footer-props="{
                    showFirstLastPage: true,
                    firstIcon: 'first_page',
                    prevIcon: 'chevron_left',
                    nextIcon: 'chevron_right',
                    lastIcon: 'last_page'
                }"
                >
                <template v-slot:item.fechaYHora="{ item }">
                    <span>{{ new Date(item.fechaYHora).toLocaleString() }}</span>
                </template>
                <template v-slot:top>
                    <v-toolbar
                    flat
                    >
                <v-toolbar-title>Fascias</v-toolbar-title>
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
                            max-width="800px"
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
                            @click="copiartabla(fascias)"
                            >
                            <v-icon>content_copy</v-icon>
                            Copiar
                            </v-btn>
                            </template>
                            <v-card>
                            <v-card-title>
                                <span class="text-h5">{{ formTitle }}</span>
                            </v-card-title>
                            <v-bottom-navigation v-if="editedIndex == -1"
                                    color="primary"
                                    v-model="vbn"
                                    shift
                                    >
                                    <v-btn @click="solo1=true">
                                        <span>Solo uno</span>
                                        <v-icon>add_box</v-icon>
                                    </v-btn>
                                    <v-btn @click="solo1=false">
                                        <span>Multiples</span>
                                        <v-icon>library_add</v-icon>
                                    </v-btn>
                            </v-bottom-navigation>
                            <v-card-text v-if="solo1==true">
                                <v-container>
                                <v-row>
                                    <v-col
                                    cols="8"
                                    sm="8"
                                    md="8"
                                    >
                                    <v-text-field
                                        v-model="modelo"
                                        label="Modelo Posición 0 M100"
                                    ></v-text-field>
                                    </v-col>
                                    <v-col
                                    cols="4"
                                    sm="4"
                                    md="4"
                                    >
                                    <v-text-field
                                        v-model="version"
                                        label="Versión Posición 0 M100"
                                    ></v-text-field>
                                    </v-col>
                                    <v-col
                                    cols="12"
                                    sm="12"
                                    md="12"
                                    >
                                    <v-text-field
                                        v-model="nombre"
                                        label="Nombre de Modelo Versión"
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
                            <v-card-text v-else-if="solo1==false && editedIndex == -1">
                                <v-container>
                                <v-row>
                                    <v-col
                                    cols="6"
                                    sm="6"
                                    md="6"
                                    >
                                    <v-text-field
                                        v-model="palabraClave"
                                        label="Palabra clave"
                                        hint="Debe ser mayor a 2 caracteres"
                                    ></v-text-field>
                                    </v-col>
                                    <v-col
                                    cols="3"
                                    sm="3"
                                    md="3"
                                    >
                                    <v-select
                                        v-model="codigoColor"
                                        :items="colores"
                                        label="Color"
                                    ></v-select>
                                    </v-col>
                                    <v-col
                                    cols="2"
                                    sm="2"
                                    md="2"
                                    >
                                    <v-btn
                                    color="blue darken-1"
                                    text
                                    @click="selectbucarenBOOM"
                                    :disabled="(codigoColor =='' || palabraClave.length < 3 )"
                                    >
                                    <v-icon>search</v-icon>
                                    Buscar
                                    </v-btn>
                                    </v-col>
                                    <v-col                                
                                    cols="12"
                                    sm="12"
                                    md="12"
                                    >
                                    <v-data-table
                                    v-model="selected"
                                    :headers="headers2"
                                    :items="resultfromBOOM"
                                    :single-select="singleSelect"
                                    item-key="descripcion"
                                    show-select
                                    class="elevation-1"
                                    >
                                    </v-data-table>
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
                                <template v-if="solo1==true">
                                <v-btn
                                color="blue darken-1"
                                text
                                @click="guardar"
                                >
                                Guardar
                                </v-btn>
                                </template>
                                <template v-else-if="solo1==false">
                                <v-btn
                                color="blue darken-1"
                                text
                                @click="guardarvarios"
                                :disabled="(selected.length == 0)"
                                >
                                Importar
                                </v-btn>
                                </template>
                            </v-card-actions>
                            </v-card>
                        </v-dialog>
                        <v-dialog v-model="dialogDelete" max-width="400px">
                            <v-card>
                            <v-card-title class="text-h5">¿Estas seguro de borrar <br> la Fascia?</v-card-title>
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
                    fascias:[],
                    dialog: false,
                    dialogDelete: false,
                    headers: [
                        { text: 'Actions', value: 'actions', sortable: false },
                        //{ text: 'ID', value: 'idSQP', sortable: false },
                        { text: 'Posición 0 M100', value: 'modeloM100Pos0' },
                        { text: 'Versión M100', value: 'versionM100Pos0' },
                        { text: 'Nombre de versión', value: 'nombreVersion' },
                        { text: 'Fecha de creación', value: 'fechaYHora', dataType: "Date" },
                        { text: 'Estado', value: 'estatus', sortable: false },
                    ],
                    search: '',

                    id: '',
                    modelo:'',
                    version:'',
                    nombre:'',
                    
                    editedIndex: -1,
                    
                    menu: false,

                    valida: 0,
                    validaMensaje:[],
                    cargando:true,
                    fechaYHora:'',

                    adModal: 0,
                    adAccion: 0,
                    adNombre: '',
                    adId: '',

                    elNombre:'',

                    solo1:true,
                    vbn:0,

                    colores:[],
                    codigoColor:'',
                    palabraClave:'',
                    resultfromBOOM:[],

                    headers2: [
                        { text: 'Posición 0 M100', value: 'posicion' },
                        { text: 'Versión M100', value: 'modelo' },
                        { text: 'Nombre de versión', align: 'start', value: 'descripcion' }
                    ],
                    selected: [],
                    singleSelect: false,
                    }
                },
        computed: {
                    formTitle () {
                    return this.editedIndex === -1 ? 'Nuevo Fascia' : 'Editar Fascia'
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
            this.selectc();
        },
        methods: {
            listar(){
                let me=this;
                let header={"Authorization" : "Bearer " +this.$store.state.token};
                let configuracion= {headers : header};
                axios.get('api/Fascias/Listar',configuracion).then(function(response){
                    //console.log(response)
                    me.fascias=response.data;
                    me.cargando=false;
                }).catch(function(error){
                    console.log(error);
                    errTraceguardarAxios("Fascia - Listar", error);
                });
            },
            selectc(){
                let me=this;
                let header={"Authorization" : "Bearer " +this.$store.state.token};
                let configuracion= {headers : header};
                var coloresArray=[];
                axios.get('api/Colors/Select',configuracion).then(function(response){
                    coloresArray=response.data;
                    coloresArray.map(function(x){
                        me.colores.push({text: x.nombre, value: x.codigoColor})
                    });
                }).catch(function(error){
                    console.log(error);
                    errTraceguardarAxios("Color - Select", error);
            });
            },
            selectbucarenBOOM(){
                let me=this;
                let header={"Authorization" : "Bearer " +this.$store.state.token};
                let configuracion= {headers : header};
                var resultfromBOOMArray=[];
                me.resultfromBOOM=[];
                axios.post('api/Fascias/BuscarenBOOM',{
                        'codigocolor': me.codigoColor,
                        'valor': me.palabraClave                      
                    },configuracion).then(function(response){
                        resultfromBOOMArray=response.data;
                        resultfromBOOMArray.map(function(x){
                        me.resultfromBOOM.push({posicion: x.posicion, modelo: x.modelo, descripcion: x.descripcion})
                    });
                    }).catch(function(error){
                    console.log(error);
                    errTraceguardarAxios("Fascia - BuscarenBOOM", error);
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
                this.solo1=true;
                this.id=item.idFascia;
                this.modelo=item.modeloM100Pos0;
                this.version=item.versionM100Pos0;
                this.nombre=item.nombreVersion;
                this.editedIndex=1;
                this.dialog = true
            },
            deleteItem (item) {
                this.editedIndex = item.idFascia;
                this.elNombre= item.nombreVersion;
                this.editedItem = Object.assign({}, item)
                this.dialogDelete = true
            },
            deleteItemConfirm () {
                this.fascias.splice(this.editedIndex, 1)
                let me=this;
                let header={"Authorization" : "Bearer " +this.$store.state.token};
                let configuracion= {headers : header};
                axios.delete('api/Fascias/Eliminar/'+this.editedIndex,configuracion,{}).then(function(response){
                    logTraceguardar("Fascia","Eliminó " + me.editedIndex + " "+ me.elNombre);
                    me.listar();
                    me.close();
                    me.limpiar();    
                    me.elNombre="";
                }).catch(function(error){
                    console.log(error);
                    errTraceguardarAxios("Fascia - Eliminar", error);
                })
                this.closeDelete()
            },
            activarDesactivarMostrar(accion,item){
                this.adModal = 1;
                this.adNombre=item.nombreVersion;
                this.adId=item.idFascia;
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
                axios.put('api/Fascias/Activar/'+this.adId,{},configuracion).then(function(response){
                    logTraceguardar("Fascia","Activó " + me.adId + " "+ me.adNombre);
                    me.adModal=0;
                    me.adAccion=0;
                    me.adNombre='';
                    me.adId='';
                    me.listar();
                }).catch(function(error){
                    console.log(error);
                    errTraceguardarAxios("Fascia - Activar", error);
                })
            },
            desactivar(){
                let me=this;
                let header={"Authorization" : "Bearer " +this.$store.state.token};
                let configuracion= {headers : header};
                axios.put('api/Fascias/Desactivar/'+this.adId,{},configuracion).then(function(response){
                    logTraceguardar("Fascia","Desactivó " + me.adId + " "+ me.adNombre);
                    me.adModal=0;
                    me.adAccion=0;
                    me.adNombre='';
                    me.adId='';
                    me.listar();
                }).catch(function(error){
                    console.log(error);
                    errTraceguardarAxios("Fascia - Desactivar", error);
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
                this.version="";
                this.nombre="";
                this.editedIndex=-1;
                this.solo1=true;
                this.vbn=0;
                this.validaMensaje="";
                this.selected=[];
                this.codigoColor='';
                this.palabraClave='';
                this.resultfromBOOM=[];
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
                    axios.put('api/Fascias/Actualizar',{
                        'idFascia': me.id,
                        'ModeloM100Pos0': me.modelo,
                        'VersionM100Pos0': me.version,
                        'NombreVersion': me.nombre
                    }, configuracion).then(function(response){
                        logTraceguardar("Fascia","Actualizó " + me.id + " "+ me.modelo + " " + me.version + " "+ me.nombre);
                        me.listar();
                        me.close();
                        me.limpiar();    
                    }).catch(function(error){
                        console.log(error);
                        errTraceguardarAxios("Fascia - Actualizar", error);
                    })
                } else {
                    //Código para guardar
                    let me=this;
                    axios.post('api/Fascias/Crear',{
                        'ModeloM100Pos0': me.modelo,
                        'VersionM100Pos0': me.version,
                        'NombreVersion': me.nombre,                        
                    },configuracion).then(function(response){
                        logTraceguardar("Fascia","Creó " + me.modelo + " " + me.version + " "+ me.nombre);
                        me.listar();
                        me.close();
                        me.limpiar();    
                    }).catch(function(error){
                        console.log(error);
                        errTraceguardarAxios("Fascia - Crear", error);
                    })
                }
            },
            guardarvarios(){
                let header={"Authorization" : "Bearer " +this.$store.state.token};
                let configuracion= {headers : header};
                let me=this;
                const fasciasCrearArray=[];
                if (this.editedIndex == -1 && me.solo1==false && me.selected.length !== 0) {
                    me.selected.map(function(x){
                        fasciasCrearArray.push({ModeloM100Pos0: x.posicion, VersionM100Pos0: x.modelo, NombreVersion: x.descripcion})
                    });
                    //let obj = JSON.stringify(fasciasCrearArray);
                    //console.log(fasciasCrearArray);
                    axios.post('api/Fascias/Crears',
                        fasciasCrearArray
                    ,configuracion).then(function(response){
                        fasciasCrearArray.forEach( x => {
                            logTraceguardar("Fascia","Importó " + x.ModeloM100Pos0 + " " + x.VersionM100Pos0 + " "+ x.NombreVersion);
                        });
                        me.listar();
                        me.close();
                        me.limpiar();    
                    }).catch(function(error){
                        console.log(error);
                        errTraceguardarAxios("Fascia - Crears", error);
                    })
                }
            },
            validar (){
                this.valida=0;
                this.validaMensaje=[];
                if (this.modelo.length < 10  || this.modelo.length > 12  ){
                    this.validaMensaje.push("El Modelo M100 debe tener entre 11 caracteres.");
                }
                if(this.version.length < 0  || this.version.length > 3  ){
                    this.validaMensaje.push("El Versión M100 debe temer 2 caracteres.");
                }
                if(this.nombre.length < 2  || this.nombre.length > 51 ){
                    this.validaMensaje.push("El Nombre de versión debe tener entre 2 a 50 caracteres.");
                }
                if(this.validaMensaje.length){
                    this.valida=1;
                }
                return this.valida;

            },
    },
}

</script>