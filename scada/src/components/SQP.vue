<template>
    <v-layout align-start>
       <v-flex>
        <v-data-table
            :headers="headers"
            :items="sqps"
            :search="search"
            sort-by="codigoSQP"
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
            <v-toolbar-title>SQP</v-toolbar-title>
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
                            @click="copiartabla(sqps)"
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
                                cols="6"
                                sm="6"
                                md="6"
                                >
                                <v-text-field
                                    placeholder="########"
                                    type="number"
                                    v-model="codigoSQP"
                                    label="Código SQP"
                                ></v-text-field>
                                </v-col>
                                <v-col
                                cols="6"
                                sm="6"
                                md="6"
                                >
                                <v-select
                                    v-model="codigoColor"
                                    :items="colores"
                                    label="Color"
                                ></v-select>
                                </v-col>
                                <v-col
                                cols="12"
                                sm="12"
                                md="12"
                                >
                                <v-select
                                    v-model="idposicionmodelo"
                                    :items="posicionmodelos"
                                    label="Posicion Modelo"
                                ></v-select>
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
                                cols="12"
                                sm="12"
                                md="12"
                                >
                                <v-container fluid>
                                <v-textarea
                                    v-model="multiples"
                                    name="input-7-1"
                                    filled
                                    label="Información separada por Tab"
                                    auto-grow
                                    value=""
                                ></v-textarea>
                                </v-container>
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
                            <v-btn v-if="solo1==false && editedIndex == -1"
                            color="blue darken-1"
                            text
                            @click="validarvarios"
                            >
                            Validar
                            </v-btn>
                            <v-spacer></v-spacer>
                            <v-btn
                            color="blue darken-1"
                            text
                            @click="close"
                            >
                            Cancelar
                            </v-btn>
                            <v-btn v-if="solo1==false && editedIndex == -1"
                            color="blue darken-1"
                            text
                            @click="guardarvarios"
                            >
                            Importar
                            </v-btn>
                            <v-btn v-else
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
                        <v-card-title class="text-h5">¿Estas seguro de borrar <br> el código SQP?</v-card-title>
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
            <template v-slot:item.color="{ item }">
                    <v-chip
                    :color="getColor(item.rgbHex)"
                    :text-color="getTextColor(item.rgbHex)"
                    >
                    {{ item.color }}
                    </v-chip>
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
                    sqps:[],
                    dialog: false,
                    dialogDelete: false,
                    headers: [
                        { text: 'Opciones', value: 'actions', sortable: false },
                        //{ text: 'ID', value: 'idSQP', sortable: false },
                        { text: 'Código SQP', value: 'codigoSQP' },
                        { text: 'Código Color', value: 'codigoColor' },
                        { text: 'Nombre', value: 'color' },
                        { text: 'Modelo', value: 'modelo' },
                        { text: 'Posición', value: 'posicion'},
                        { text: 'Estado', value: 'estatus', sortable: false },
                    ],
                    search: '',

                    id: '',
                    codigoSQP:'',
                    codigoColor:'',
                    colores:[],
                    idposicionmodelo: '',
                    posicionmodelos:[],

                    editedIndex: -1,
                    
                    nombre:'',
                    rgbHex:'#1976D2',

                    mask: '!#XXXXXX',
                    menu: false,

                    solo1: true,
                    vbn:0,

                    adModal: 0,
                    adAccion: 0,
                    adNombre: '',
                    adId: '',

                    elNombre:'',

                    valida: 0,
                    validaMensaje:[],

                    multiples:'',
                    SQPCrearArray:[]
                    }
                },
        computed: {
            formTitle () {
            return this.editedIndex === -1 ? 'Nuevo Código SQP' : 'Editar Código SQP'
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
            this.selectc();
            this.selectp();
        },
        methods: {
            listar(){
                let me=this;
                let header={"Authorization" : "Bearer " +this.$store.state.token};
                let configuracion= {headers : header};
                axios.get('api/SQPs/Listar',configuracion).then(function(response){
                    //console.log(response)
                    me.sqps=response.data;
                }).catch(function(error){
                    console.log(error);
                    errTraceguardarAxios("SQP - Listar", error); 
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
            selectp(){
                let me=this;
                let header={"Authorization" : "Bearer " +this.$store.state.token};
                let configuracion= {headers : header};
                var posicionmodeloArray=[];
                axios.get('api/PosicionModelos/Select',configuracion).then(function(response){
                    posicionmodeloArray=response.data;
                    posicionmodeloArray.map(function(x){
                        me.posicionmodelos.push({text: x.posicion + ' ' + x.modelo , value: x.idPosicionModelo})
                    });
                }).catch(function(error){
                    console.log(error);
                    errTraceguardarAxios("PosicionModelo - Select", error); 
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
            getColor (rgbHex) {
                return '#'+rgbHex
            },
            getTextColor (rgbHex) {
                if ( parseInt(rgbHex, 16) > 14000000) return 'black'
                return 'white'
            },
            editItem (item) {
                this.solo1=true;
                this.id=item.idSQP;
                this.codigoSQP=item.codigoSQP;
                this.codigoColor=item.codigoColor;
                this.idposicionmodelo=item.idPosicionModelo;
                this.editedIndex=1;
                this.dialog = true
            },
            deleteItem (item) {
                this.editedIndex = item.idSQP;
                this.elNombre=item.codigoSQP;
                this.editedItem = Object.assign({}, item)
                this.dialogDelete = true
            },
            deleteItemConfirm () {
                this.sqps.splice(this.editedIndex, 1)
                let me=this;
                let header={"Authorization" : "Bearer " +this.$store.state.token};
                let configuracion= {headers : header};
                axios.delete('api/SQPs/Eliminar/'+this.editedIndex,configuracion,{}).then(function(response){
                    logTraceguardar("SQP","Eliminó " + me.editedIndex + " "+ me.elNombre);
                    me.elNombre="";
                    me.listar();
                    me.close();
                    me.limpiar();    
                }).catch(function(error){
                    console.log(error);
                    errTraceguardarAxios("SQP - Eliminar", error); 
                })
                this.closeDelete()
            },
            activarDesactivarMostrar(accion,item){
                this.adModal = 1;
                this.adNombre=item.codigoSQP;
                this.adId=item.idSQP;
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
                axios.put('api/SQPs/Activar/'+this.adId,{},configuracion).then(function(response){
                    logTraceguardar("SQP","Activó " + me.adId + " "+ me.adNombre);
                    me.adModal=0;
                    me.adAccion=0;
                    me.adNombre='';
                    me.adId='';
                    me.listar();
                }).catch(function(error){
                    console.log(error);
                    errTraceguardarAxios("SQP - Activar", error); 
                })
            },
            desactivar(){
                let me=this;
                let header={"Authorization" : "Bearer " +this.$store.state.token};
                let configuracion= {headers : header};
                axios.put('api/SQPs/Desactivar/'+this.adId,{},configuracion).then(function(response){
                    logTraceguardar("SQP","Desactivó " + me.adId + " "+ me.adNombre);
                    me.adModal=0;
                    me.adAccion=0;
                    me.adNombre='';
                    me.adId='';
                    me.listar();
                }).catch(function(error){
                    console.log(error);
                    errTraceguardarAxios("SQP - Desactivar", error); 
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
                this.codigoSQP="";
                this.codigoColor="";
                this.idposicionmodelo="";
                this.editedIndex=-1;
                this.solo1=true;
                this.vbn=0;
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
                    axios.put('api/SQPs/Actualizar',{
                        'idSQP': me.id,
                        'CodigoSQP': parseInt(me.codigoSQP),
                        'CodigoColor': me.codigoColor,
                        'idPosicionModelo': me.idposicionmodelo
                    },configuracion).then(function(response){
                        logTraceguardar("SQP","Actualizó " + me.id + " "+ me.codigoSQP);
                        me.listar();
                        me.close();
                        me.limpiar();    
                    }).catch(function(error){
                        console.log(error);
                        errTraceguardarAxios("SQP - Actualizar", error); 
                    })
                } else {
                    //Código para guardar
                    let me=this;
                    axios.post('api/SQPs/Crear',{
                        'CodigoSQP': parseInt(me.codigoSQP),
                        'CodigoColor': me.codigoColor,
                        'idPosicionModelo': me.idposicionmodelo
                    },configuracion).then(function(response){
                        logTraceguardar("SQP","Creó " + me.codigoSQP + " " + x.codigoColor + " "+ x.idposicionmodelo);
                        me.listar();
                        me.close();
                        me.limpiar();    
                    }).catch(function(error){
                        console.log(error);
                        errTraceguardarAxios("SQP - Crear", error); 
                        me.validaryaexiste(error);
                    })
                }
            },
            guardarvarios(){
                if (this.validarvarios()){
                    return;
                }
                let header={"Authorization" : "Bearer " +this.$store.state.token};
                let configuracion= {headers : header};
                let me=this;
                //console.log(JSON.stringify(me.SQPCrearArray));
                if (this.editedIndex == -1 && me.solo1==false) {
                    
                    //let obj = JSON.stringify(fasciasCrearArray);
                    //console.log(JSON.stringify(me.SQPCrearArray));
                    axios.post('api/SQPs/Crears',
                        me.SQPCrearArray
                    ,configuracion).then(function(response){
                        me.SQPCrearArray.forEach(x => {
                            logTraceguardar("SQP","Importó " + x.CodigoSQP + " " + x.CodigoColor + " "+ x.idPosicionModelo);
                        });
                        me.listar();
                        me.close();
                        me.limpiar();    
                    }).catch(function(error){
                        console.log(error);
                        errTraceguardarAxios("SQP - Crears", error);
                        me.validaryaexiste(error);
                    })
                }
            },
            validarvarios(){
                let me=this;
                this.valida=0;
                this.validaMensaje=[];
                if (me.multiples.length > 0) {
                    let importtext=[["CodigoSQP","CodigoColor","idPosicionModelo"]];
                    const rows = me.multiples.split("\n");
                    //console.log(rows);
                    
                    rows.forEach(element => {
                        //console.log(element.split("\t"));
                        importtext.push(element.split("\t"));
                    });
                    let filtered = importtext.filter(function (el) {
                    return el != '';
                    });
                    //console.log(filtered);
                    me.SQPCrearArray=[];
                    try {
                        me.SQPCrearArray = me.convertToArrayOfObjects(filtered);
                    } catch (error) {
                        this.validaMensaje.push("No se puede convertir en la estructura :" + error +"." );
                    }
                    //console.log(SQPCrearArray);
                    me.SQPCrearArray.forEach((element,i) => {
                        let index = me.posicionmodelos.map(function(e) {return e.text;}).indexOf(element.idPosicionModelo);
                        try {
                            element.idPosicionModelo = this.posicionmodelos[index].value;
                        } catch (error) {
                            this.validaMensaje.push("No se encuentra referencia de posición modelo de "
                                + element.idPosicionModelo + " en línea " + (i+1)+".");
                        }
                        let index2 = me.colores.map(function(e) {return e.text;}).indexOf(element.CodigoColor);
                        try {
                            element.CodigoColor = this.colores[index2].value;
                        } catch (error) {
                            this.validaMensaje.push("No se encuentra referencia color de " + element.CodigoColor
                                + " en línea " + (i+1) +".");
                        }
                        if (String(element.CodigoSQP).length !== 8 ){
                            this.validaMensaje.push("El Código de SQP " + element.CodigoSQP  +" no tiene  8 caracteres, en la línea : " + (i+1));
                        }else if (isNaN(String(element.CodigoSQP))) {
                            this.validaMensaje.push("El Código de SQP " + element.CodigoSQP
                                + " en línea " + (i+1) +" no es un número.");
                            
                        }else{
                            element.CodigoSQP = parseInt(element.CodigoSQP);
                        }
                        
                    });
                    //console.log(me.SQPCrearArray);
                }else{
                    this.validaMensaje.push("No hay datos que guardar.");
                }
                if(this.validaMensaje.length){
                    this.valida=1;
                }
                return this.valida;
                
            },
            convertToArrayOfObjects: function(data) {
                var keys = data.shift(),
                i = 0, k = 0,
                obj = null,
                output = [];

                for (i = 0; i < data.length; i++) {
                obj = {};

                for (k = 0; k < keys.length; k++) {
                    obj[keys[k]] = data[i][k];
                }

                output.push(obj);
                }

                return output;
            },

            validar (){
                this.valida=0;
                this.validaMensaje=[];
                if (this.codigoSQP.length < 8  || this.codigoSQP.length > 8  ){
                    this.validaMensaje.push("El Código de SQP debe tener 8 caracteres.");
                }
                if(!this.codigoColor){
                    this.validaMensaje.push("Seleccione un color.");
                }
                if(!this.idposicionmodelo){
                    this.validaMensaje.push("Seleccione una posición modelo.");
                }
                if(this.validaMensaje.length){
                    this.valida=1;
                }
                return this.valida;
            },

            validaryaexiste(obj){
                this.valida=0;
                this.validaMensaje=[];
                //console.log(obj.response.data);
                if (obj.response.data = "SQP already exists." ){
                    this.validaMensaje.push("La combinación de Código de SQP, código de color y posición modelo ya existe.");
                }
                if(this.validaMensaje.length){
                    this.valida=1;
                }
                return this.valida
            }
    },
}

</script>