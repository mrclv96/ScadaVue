<template>
    <v-layout align-start>
        <v-flex>
            <v-data-table
            :headers="headers"
            :items="productos"
            :search="search"
            sort-by="Modelo"
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
            <v-toolbar-title>Productos</v-toolbar-title>
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
                        @click="copiartabla(productos)"
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
                                    v-model="idfascia"
                                    :items="fascias"
                                    label="Fascias"
                                ></v-select>
                                </v-col>
                                <v-col
                                cols="6"
                                sm="6"
                                md="6"
                                >
                                <v-select
                                    v-model="idlinea"
                                    :items="lineas"
                                    label="Línea"
                                    v-on:change="getsecuencias(idlinea),getvariantes(idlinea)"
                                ></v-select>
                                </v-col>
                                <v-col
                                cols="6"
                                sm="6"
                                md="6"
                                >
                                <template v-if="idlinea!==''">
                                <v-select
                                    v-model="idsecuencia"
                                    :items="secuencias"
                                    label="Flujo"
                                ></v-select>
                                </template>
                                </v-col>
                                <v-col
                                cols="6"
                                sm="6"
                                md="6"
                                >
                                <template v-if="idlinea!==''">
                                <v-select
                                    v-model="variante"
                                    :items="variantes"
                                    label="Variante"
                                ></v-select>
                                </template>
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
                        <v-card-title class="text-h5">¿Estas seguro de borrar <br> el Producto?</v-card-title>
                            <v-card-text>
                                Estás a punto de Eliminar {{ elNombre }}
                            </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="green darken-1" text @click="closeDelete">Cancelar</v-btn>
                            <v-btn color="red darken-4" text @click="deleteItemConfirm">OK</v-btn>
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
                    productos:[],
                    dialog: false,
                    dialogDelete: false,
                    headers: [
                        { text: 'Opciones', value: 'actions', sortable: false },
                        //{ text: 'ID', value: 'idSQP', sortable: false },
                        { text: 'Línea', value: 'linea'},
                        { text: 'Nombre', value: 'nombre' },
                        { text: 'Modelo', value: 'posicion0' },
                        { text: 'Version', value: 'version' },
                        { text: 'Variante', value: 'variante' },
                        { text: 'Secuencia', value: 'secuencia'},
                        { text: 'Estado', value: 'estatus', sortable: false}
                    ],

                    variantes: [],

                    search: '',

                    id: '',
                    nombre:'',
                    posicion0:'',
                    version:'',
                    idfascia:'',
                    idsecuencia:'',
                    idproducto:'',
                    idlinea:'',
                    variante:'',
                    fascias:[],
                    secuencias:[],
                    lineas:[],

                    editedIndex: -1,
                    
                    menu: false,

                    valida: 0,
                    validaMensaje:[],
                    
                    adModal: 0,
                    adAccion: 0,
                    adNombre: '',
                    adId: '',

                    elNombre:'',

                    linea:'',

                    }
                },
        computed: {
                    formTitle () {
                    return this.editedIndex === -1 ? 'Nuevo Producto' : 'Editar Producto'
                    },
                    swatchStyle() {
                    const { rgbHex, menu } = this
                        return {
                            backgroundColor: rgbHex,
                            cursor: 'pointer',
                            height: '30px',
                            width: '30px',
                            borderRadius: menu ? '50%' : '4px',
                            transition: 'border-radius 200ms ease-in-out'
                        }
                    }
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
            this.selectf();
            //this.selects();
            this.selectl();
        },
        methods: {
            listar(){
                let me=this;
                let header={"Authorization" : "Bearer " +this.$store.state.token};
                let configuracion= {headers : header};
                axios.get('api/Productos/Listar',configuracion).then(function(response){
                    //console.log(response)
                    me.productos=response.data;
                }).catch(function(error){
                    console.log(error);
                    errTraceguardarAxios("Producto - Listar", error); 
                });
            },
            selectf(){
                let me=this;
                let header={"Authorization" : "Bearer " +this.$store.state.token};
                let configuracion= {headers : header};
                var fasciasArray=[];
                axios.get('api/Fascias/Select',configuracion).then(function(response){
                    fasciasArray=response.data;
                    fasciasArray.map(function(x){
                        me.fascias.push({text: x.modeloM100Pos0 + ' '+ x.versionM100Pos0 + ' - ' +x.nombreVersion , value: x.idFascia})
                    });
                }).catch(function(error){
                    console.log(error);
                    errTraceguardarAxios("Fascia - Select", error); 
                });
            },
            getidLinea(idsecuencia){
                let me=this;
                //me.linea="";
                let header={"Authorization" : "Bearer " +this.$store.state.token};
                let configuracion= {headers : header};
                var secueciaArray=[];
                axios.get('api/Secuencias/SelectLinea/'+idsecuencia,configuracion).then(function(response){
                    secueciaArray.push(response.data);
                    me.linea = secueciaArray[0].idLinea;
                    //console.log(me.linea);
                }).catch(function(error){
                    console.log(error);
                    errTraceguardarAxios("Secuencia - SelectLinea", error); 
            });
            },
            getvariantes(idlinea){
                let me=this;
                me.variantes=[];
                let header={"Authorization" : "Bearer " +this.$store.state.token};
                let configuracion= {headers : header};
                var lineaVarianteArray=[];
                axios.get('api/LineaVariantes/Select/'+idlinea,configuracion).then(function(response){
                    lineaVarianteArray=response.data;
                    lineaVarianteArray.map(function(x){
                        me.variantes.push({text: x.nombre, value: x.variante})
                    });
                }).catch(function(error){
                    console.log(error);
                    errTraceguardarAxios("LineaVariante - Select", error); 
            });
            },
            getsecuencias(idlinea){
                let me=this;
                //console.log(idlinea)
                this.secuencias=[];
                let header={"Authorization" : "Bearer " +this.$store.state.token};
                let configuracion= {headers : header};
                var secuenciasArray=[];
                axios.get('api/Secuencias/Select/'+idlinea,configuracion).then(function(response){
                    secuenciasArray=response.data;
                    secuenciasArray.map(function(x){
                        me.secuencias.push({text: x.flujo , value: x.idSecuencia})
                    });
                }).catch(function(error){
                    console.log(error);
                    errTraceguardarAxios("Secuencia - Select", error); 
                });
            },
            selectl(){
                let me=this;
                let header={"Authorization" : "Bearer " +this.$store.state.token};
                let configuracion= {headers : header};
                var lineasArray=[];
                axios.get('api/Lineas/Select',configuracion).then(function(response){
                    lineasArray=response.data;
                    lineasArray.map(function(x){
                        me.lineas.push({text: x.nombre, value: x.idLinea})
                    });
                }).catch(function(error){
                    console.log(error);
                    errTraceguardarAxios("Linea - Select", error); 
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
                let me=this;
                var index = me.lineas.map(function(e) {return e.text;}).indexOf(item.linea);
                this.id=item.idProducto;
                this.idlinea=me.lineas[index].value;
                this.getsecuencias(me.lineas[index].value);
                this.getvariantes(me.lineas[index].value);
                this.idfascia=item.idFascia;
                this.idsecuencia=item.idSecuencia;
                this.variante=item.variante;
                this.editedIndex=1;
                this.dialog = true
            },
            deleteItem (item) {
                this.editedIndex = item.idProducto;
                this.elNombre=item.nombre;
                this.editedItem = Object.assign({}, item)
                this.dialogDelete = true
            },
            deleteItemConfirm () {
                this.productos.splice(this.editedIndex, 1)
                let me=this;
                let header={"Authorization" : "Bearer " +this.$store.state.token};
                let configuracion= {headers : header};
                axios.delete('api/Productos/Eliminar/'+this.editedIndex,configuracion,{}).then(function(response){
                    logTraceguardar("Producto","Eliminó " + me.editedIndex + " "+ me.elNombre);
                    me.listar();
                    me.close();
                    me.limpiar();    
                    me.elNombre='';
                }).catch(function(error){
                    console.log(error);
                    errTraceguardarAxios("Producto - Eliminar", error); 
                })
                this.closeDelete()
            },
            activarDesactivarMostrar(accion,item){
                this.adModal = 1;
                this.adNombre=item.nombre;
                this.adId=item.idProducto;
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
                axios.put('api/Productos/Activar/'+this.adId,{},configuracion).then(function(response){
                    logTraceguardar("Producto","Activó " + me.adId + " "+ me.adNombre);
                    me.adModal=0;
                    me.adAccion=0;
                    me.adNombre='';
                    me.adId='';
                    me.listar();
                }).catch(function(error){
                    console.log(error);
                    errTraceguardarAxios("Producto - Activar", error); 
                })
            },

            desactivar(){
                let me=this;
                let header={"Authorization" : "Bearer " +this.$store.state.token};
                let configuracion= {headers : header};
                axios.put('api/Productos/Desactivar/'+this.adId,{},configuracion).then(function(response){
                    logTraceguardar("Producto","Desactivó " + me.adId + " "+ me.adNombre);
                    me.adModal=0;
                    me.adAccion=0;
                    me.adNombre='';
                    me.adId='';
                    me.listar();
                }).catch(function(error){
                    console.log(error);
                    errTraceguardarAxios("Producto - Desactivar", error); 
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
                this.idlinea="";
                this.linea="";
                this.idproducto="";
                this.idsecuencia="";
                this.variante="";
                this.editedIndex=-1;
                this.elNombre='';
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
                    axios.put('api/Productos/Actualizar',{
                        'idProducto': me.id,
                        'idFascia': me.idfascia,
                        'idSecuencia': me.idsecuencia,
                        'Variante': me.variante
                    },configuracion).then(function(response){
                        logTraceguardar("Producto","Actualizó " + me.id + " "+ me.idfascia + " " + me.idsecuencia + " "+ me.variante);
                        me.listar();
                        me.close();
                        me.limpiar();    
                    }).catch(function(error){
                        console.log(error);
                        errTraceguardarAxios("Producto - Actualizar", error); 
                    })
                } else {
                    //Código para guardar
                    let me=this;
                    axios.post('api/Productos/Crear',{
                        'idFascia': me.idfascia,
                        'idSecuencia': me.idsecuencia,
                        'Variante': me.variante
                    },configuracion).then(function(response){
                        logTraceguardar("Producto","Creó " +  me.idfascia + " " + me.idsecuencia + " "+ me.variante);
                        me.listar();
                        me.close();
                        me.limpiar();    
                    }).catch(function(error){
                        console.log(error);
                        errTraceguardarAxios("Producto - Crear", error); 
                    })
                }
            },
            validar (){
                this.valida=0;
                this.validaMensaje=[];
                if (!this.idfascia ){
                    this.validaMensaje.push("Seleccione un modelo de Fascia.");
                }
                if(!this.idsecuencia){
                    this.validaMensaje.push("Seleccione un flujo.");
                }
                /*if(!this.variante){
                    this.validaMensaje.push("Seleccione una variante.");
                }*/
                if(this.validaMensaje.length){
                    this.valida=1;
                }
                return this.valida;
            },
    },
}

</script>