<template>
    <v-layout align-start>
        <v-flex>
            <v-data-table
                :headers="headers"
                :items="estaciones"
                :search="search"
                sort-by="Linea"
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
                <v-toolbar-title>Estaciones</v-toolbar-title>
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
                            @click="copiartabla(estaciones)"
                            >
                            <v-icon>content_copy</v-icon>
                            Copiar
                            </v-btn>
                            </template>
                            <v-card>
                            <v-form ref="form" v-model="rule" lazy-validation>
                            <v-card-title>
                                <span class="text-h5">{{ formTitle }}</span>
                            </v-card-title>
                
                            <v-card-text>
                                <v-container>
                                <v-row>
                                    <v-col
                                    cols="6"
                                    sm="6"
                                    md="6"
                                    >
                                    <v-text-field
                                        v-model="idestacion"
                                        label="Código Estación"
                                        :disabled="editedIndex !== -1"
                                    ></v-text-field>
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
                                        v-on:change="getsecuenciaRule(idlinea)"
                                    ></v-select>
                                    </v-col>
                                    <v-col
                                    cols="12"
                                    sm="12"
                                    md="12"
                                    >
                                    <v-text-field
                                        v-model="nombre"
                                        label="Nombre de Estación"
                                    ></v-text-field>
                                    </v-col>
                                    <v-col
                                    cols="6"
                                    sm="6"
                                    md="6"
                                    >
                                    <template v-if="idlinea!==''">
                                    <v-text-field  
                                        v-model="secuenciapos"
                                        label="Secuencia Posición"
                                        :rules= "secuenciaRule"
                                    ></v-text-field>
                                    </template>
                                    </v-col>
                                    <v-col
                                    cols="6"
                                    sm="6"
                                    md="6"
                                    >
                                    <v-text-field
                                        v-model="tiempociclo"
                                        label="Tiempo Ciclo medio [ms]"
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
                                :disabled="!rule"
                                color="blue darken-1"
                                text
                                @click="guardar"
                                >
                                Guardar
                                </v-btn>
                            </v-card-actions>
                            </v-form>
                            </v-card>
                        </v-dialog>
                        <v-dialog v-model="dialogDelete" max-width="400px">
                            <v-card>
                            <v-card-title class="text-h5">¿Estas seguro de borrar <br> La Estación?</v-card-title>
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
                    estaciones:[],
                    dialog: false,
                    dialogDelete: false,
                    headers: [
                        { text: 'Opciones', value: 'actions', sortable: false },
                        //{ text: 'ID', value: 'idSQP', sortable: false },
                        { text: 'Línea', value: 'linea' },
                        { text: 'Código Estación', value: 'idEstacion' },
                        { text: 'Nombre', value: 'nombre' },
                        { text: 'Posición', value: 'secuenciaPos' },
                        { text: 'Tiempo Ciclo', value: 'tiempoCicloMedio_ms'},
                        { text: 'Estado', value: 'estatus'}
                    ],
                    search: '',

                    id: '',
                    idestacion:'',
                    idlinea:'',
                    linea:'',
                    nombre:'',
                    lineas:[],
                    tiempociclo: '',
                    secuenciapos:'',
                    estatus:'',

                    editedIndex: -1,
                
                    menu: false,

                    rule: false,
                    /*secuenciaRule: v => /^(0)*(1|0)(0)*$/.test(v)
                        || "El flujo solo acepta un 1 y los demás 0" ,*/

                    valida: 0,
                    validaMensaje:[],

                    adModal: 0,
                    adAccion: 0,
                    adNombre: '',
                    adId: '',

                    elNombre:'',

                    size:0,

                    linea:'',
                    //index:'',
                    secuenciaRule:[],

                    }
                },
        computed: {
                    formTitle () {
                    return this.editedIndex === -1 ? 'Nueva Estación' : 'Editar Estación'
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
            this.selectl();
        },
        methods: {
            listar(){
                let me=this;
                let header={"Authorization" : "Bearer " +this.$store.state.token};
                let configuracion= {headers : header};
                axios.get('api/Estaciones/Listar',configuracion).then(function(response){
                    //console.log(response)
                    me.estaciones=response.data;
                }).catch(function(error){
                    errTraceguardarAxios("Estacion - Listar", error);
                    console.log(error)
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
                        me.lineas.push({text: x.nombre, value: x.idLinea, size: x.noPosiciones})
                    });
                }).catch(function(error){
                    errTraceguardarAxios("Linea - Select", error);
                    console.log(error)
                });
            },
            getsecuenciaRule(linea){
                let me=this;
                let index;
                let size;
                me.secuenciapos='';
                index = me.lineas.map(function(e) { return e.value; }).indexOf(linea);
                //console.log(me.lineas[index].size);
                size = me.lineas[index].size;
                me.secuenciaRule =  [
                    (v) => !!v || "Flujo es requerido",
                    (v) => /^(0)*(1|0)(0)*$/.test(v)
                                    || "El flujo solo acepta un 1 y los demás 0",
                    (v) => v && v.length == size || 'Flujo debe tener de largo ' + size,
                    ];
                return me.secuenciaRule
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
                this.getsecuenciaRule(item.idLinea);
                this.idestacion=item.idEstacion;
                this.idlinea=item.idLinea;
                this.nombre=item.nombre;
                this.secuenciapos=item.secuenciaPos;
                this.tiempociclo=item.tiempoCicloMedio_ms;
                this.estatus=item.estatusMaquina;
                this.editedIndex=1;
                this.dialog = true;
            },
            deleteItem (item) {
                this.editedIndex=item.idEstacion;
                this.elNombre=item.nombre;
                this.editedItem = Object.assign({}, item)
                this.dialogDelete = true
            },
            deleteItemConfirm () {
                this.estaciones.splice(this.editedIndex, 1)
                let me=this;
                let header={"Authorization" : "Bearer " +this.$store.state.token};
                let configuracion= {headers : header};
                axios.delete('api/Estaciones/Eliminar/'+this.editedIndex,configuracion,{}).then(function(response){
                    logTraceguardar("Estacion","Eliminó " + me.editedIndex + " "+ me.elNombre);
                    me.listar();
                    me.close();
                    me.limpiar();
                    me.elNombre='';   
                }).catch(function(error){
                    errTraceguardarAxios("Estacion - Eliminar", error);
                    console.log(error);
                })
                this.closeDelete()
            },          
            activarDesactivarMostrar(accion,item){
                this.adModal = 1;
                this.adNombre=item.nombre;
                this.adId=item.idEstacion;
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
                axios.put('api/Estaciones/Activar/'+this.adId,{},configuracion).then(function(response){
                    logTraceguardar("Estacion","Activó " + me.adId + " "+ me.adNombre);
                    me.adModal=0;
                    me.adAccion=0;
                    me.adNombre='';
                    me.adId='';
                    me.listar();
                }).catch(function(error){
                    errTraceguardarAxios("Estacion - Activar", error);
                    console.log(error);
                })
            },
            desactivar(){
                let me=this;
                let header={"Authorization" : "Bearer " +this.$store.state.token};
                let configuracion= {headers : header};
                axios.put('api/Estaciones/Desactivar/'+this.adId,{},configuracion).then(function(response){
                    logTraceguardar("Estacion","Desactivo " + me.adId + " "+ me.adNombre);
                    me.adModal=0;
                    me.adAccion=0;
                    me.adNombre='';
                    me.adId='';
                    me.listar();
                }).catch(function(error){
                    errTraceguardarAxios("Estacion - Desactivar", error);
                    console.log(error);
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
                this.idestacion="";
                this.nombre="";
                this.secuenciapos="";
                this.tiempociclo="";
                this.estatus="";
                this.editedIndex=-1;
                this.size="";
                this.linea="";
                this.index="";
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
                    axios.put('api/Estaciones/Actualizar',{
                        'idEstacion': me.idestacion,
                        'idLinea': me.idlinea,
                        'Nombre': me.nombre,
                        'SecuenciaPos': me.secuenciapos,
                        'TiempoCicloMedio_ms': parseInt(me.tiempociclo),
                    },configuracion).then(function(response){
                        logTraceguardar("Estacion","Actualizó " + me.idestacion + " "+ me.idlinea + " " +me.nombre + " " +  me.secuenciapos + " " + me.tiempociclo);
                        me.listar();
                        me.close();
                        me.limpiar();    
                    }).catch(function(error){
                        errTraceguardarAxios("Estacion - Actualizar", error);
                        console.log(error);
                    })
                } else {
                    //Código para guardar
                    let me=this;
                    axios.post('api/Estaciones/Crear',{
                        'idEstacion': me.idestacion,
                        'idLinea': me.idlinea,
                        'Nombre': me.nombre,
                        'SecuenciaPos': me.secuenciapos,
                        'TiempoCicloMedio_ms': parseInt(me.tiempociclo),
                    },configuracion).then(function(response){
                        logTraceguardar("Estacion","Creó " + me.idestacion + " "+ me.idlinea + " " +me.nombre + " " +  me.secuenciapos + " " + me.tiempociclo);
                        me.listar();
                        me.close();
                        me.limpiar();    
                    }).catch(function(error){
                        errTraceguardarAxios("Estacion - Crear", error);
                        console.log(error);
                    })
                }
            },
            validar (){
                this.valida=0;
                this.rule=false;
                this.validaMensaje=[];
                if (this.idestacion.length < 3  || this.idestacion.length > 16  ){
                    this.validaMensaje.push("El ID de estación debe ser entre 4 a 15 caracteres.");
                }
                if(!this.idlinea){
                    this.validaMensaje.push("Seleccione una Línea.");
                }
                if(this.nombre.length < 2  || this.nombre.length > 51  ){
                    this.validaMensaje.push("El Nombre de la estación debe ser entre 3 a 50 caracteres.");
                }
                if(this.tiempociclo < 0  || this.tiempociclo > 2147483647  ){
                    this.validaMensaje.push("El tiempo ciclo debe ser mayor a 0.");
                }
                if(this.validaMensaje.length){
                    this.valida=1;
                }
                return this.valida;
            },
    },
}

</script>