<template >
    <v-layout >
        <v-flex>
        <v-toolbar
        flat
        >
        <v-progress-linear
        :active="cargando"
        :indeterminate="cargando"
        absolute
        top
        ></v-progress-linear>
        <v-row align="center" justify="center">
            <v-toolbar-title class="text-h6 text-md-h5 text-lg-h4">One Piece Flow - Kits</v-toolbar-title>
            <v-spacer></v-spacer>
                <v-select
                    class="text-xs-center"
                    :items="tipoorden"
                    v-model="ordenkitFiltervalue"
                    label="Tipo de Orden"
                    single-line hide-details
                    v-on:change="buscar"
                ></v-select>
            <v-spacer></v-spacer>
            <v-tooltip bottom>
                <template  v-slot:activator="{ on, attrs }">
                <div class="text-center">
                <v-progress-circular v-if="autorefresh"
                    v-bind="attrs"
                    v-on="on"
                    :value="Math.ceil(currentval/150 *100)"
                    color="primary"
                    :size="50"
                >{{ Math.ceil(currentval/150 *100) }}</v-progress-circular>
                </div>
                </template>
                <span>Tiempo para Actualizar</span>
            </v-tooltip>
            <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                <v-btn
                :color="!autorefresh ? 'primary' : '#339A65'"
                v-bind="attrs"
                v-on="on"
                class="mx-2"
                fab
                @click="autorefresh = !autorefresh"
                :depressed="autorefresh"
                >
                    <v-icon color="white">
                        autorenew
                    </v-icon>
                </v-btn>
                </template>
                <span>{{autorefresh_text}}</span>
            </v-tooltip>
            <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                    <v-btn
                    color="primary"
                    v-bind="attrs"
                    v-on="on"
                    class="mx-2"
                    fab
                    
                    @click="buscar"
                    :disabled="cargando"
                    >
                    <v-icon >
                        refresh
                    </v-icon>
                </v-btn>
                </template>
                <span>Actualizar ordenes</span>
            </v-tooltip>
        </v-row>
        </v-toolbar>
        <v-flex>
            <v-row no-gutters >
            <v-col
            v-for="(fifo, index) in filteredfifos.slice(0, 32)"
            :key="fifo.id" >
            <v-card
            :color="getColorCard(fifo)" 
            class="mx-auto" max-width="120" variant="outlined"
            :disabled="fifo.estatus!==2"
            >
            <v-list-item three-line>
                <v-list-item-content>
                    <v-list-item-title class="text-h5 mb-1">
                    {{fifo.subtitle2}}
                        <v-icon
                    small
                    :color="fifo.color"
                    >
                        directions_car
                    </v-icon>
                    </v-list-item-title>
                    <v-list-item-subtitle>
                        {{fifo.subtitle1}}
                    </v-list-item-subtitle>
                </v-list-item-content>             
                </v-list-item>
            </v-card>
            </v-col>
            </v-row>
        </v-flex>
        <v-flex ref="scroll" class="main-container" id="scrolling-techniques">
            <v-row >
                <v-col v-if=" cards!== null && filteredcards.length == 0 && cargando==false">
                    <h1>
                        Vacio
                    </h1>
                </v-col>
                <v-col
                v-for="card in filteredcards.slice(0, 42)"
                :key="card.id"
                cols="12"
                v-if="card.estatus == 2">
                <v-hover v-slot="{ hover }">
                    <v-card
                    width="450"
                    class="mx-auto"
                    :elevation="hover ? 12 : 2"
                    :class="{ 'on-hover': hover }"
                    >
                    <v-img
                    height="130px"
                    src="https://w0.peakpx.com/wallpaper/185/769/HD-wallpaper-2021-volkswagen-tiguan-r-line-uk-spec-front-car.jpg"
                    lazy-src="https://w0.peakpx.com/wallpaper/185/769/HD-wallpaper-2021-volkswagen-tiguan-r-line-uk-spec-front-car-thumbnail.jpg"
                    :gradient=card.gradient
                    >
                    <v-card-title class="white--text">
                        {{card.title}}
                        <br/>
                        {{card.colorname}}
                        </v-card-title>
                    <v-card-subtitle class="white--text">
                        {{card.subtitle1}}
                        <br/>
                        {{card.subtitle2}}
                        </v-card-subtitle>
                    </v-img>
                    <v-card-text
                    class="pt-6"
                    style="position: relative;">
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                        <v-btn
                            v-bind="attrs"
                            v-on="on"
                            absolute
                            class="white--text"
                            fab
                            large
                            right
                            top
                            color="success"
                            @click="removecard(1,card)"
                            :disabled="cargando"
                        >
                        <v-icon>done</v-icon>
                        </v-btn>
                        </template>
                        <span>Finalizar</span>
                    </v-tooltip>
                    <div class="font-weight-bold ml-8 mb-2">
                        {{card.pos0}}
                    </div>
                    <v-timeline
                        align-top
                        dense
                    >
                        <v-timeline-item
                        v-for="item in card.items"
                        :key="item.position"
                        :color="card.color"
                        small
                        >
                        <div>
                            <div class="font-weight-normal">
                            <strong v-if="item.color"> {{ item.custompn }} {{ card.colorcode }}</strong>
                            <strong v-else> {{ item.custompn }}</strong> 
                            </div>
                            <div v-if="item.color"> {{ item.nombre }} {{ card.colorname }}</div>
                            <div v-else>{{ item.nombre }} </div>
                            </div>
                            </v-timeline-item>
                        </v-timeline>
                    </v-card-text>
                        <v-card-actions>
                        <div class="text-center">
                        <v-btn
                        color="info"
                        text                       
                        >
                        INFO
                        <v-icon
                        right
                        dark
                        >
                        info
                        </v-icon>
                        </v-btn>
                        </div>
                        </v-card-actions>
                    </v-card>
                </v-hover>
                </v-col>
            </v-row>
        </v-flex>
    </v-flex>
    </v-layout>
</template>

<script>
    import axios from 'axios'
    import { logTraceguardar, errTraceguardarAxios } from '@/Trace';
    import {mapGetters, mapActions} from 'vuex';
    export default {
        data() {
            return  {
                interval: null,
                cargando: true,
                autorefresh:null,
                ordenkitFiltervalue:null,

                today:null,

                kitsComponentes:[],
                ordenkits:[],
                ordenkitslist:[],
                tipoorden:[],
                cards:[],
                card: {id:'', title:'', subtitle1:'', subtitle2:'', color:'', colorname:'', gradient:'', pos0:'', items:[], estatus:''},
                fifos:[],
                fifo: {id:'', title:'', subtitle1:'', color:'', estatus:''},
                currentval:0,
                currentvalp:0,
            }
        },
        created () {
            //this.cargando = true;
            this.crear();
            this.interval = setInterval(this.refreshData, 1000)
            this.autorefresh = true;
            //this.cargando = false;
        },
        methods: {
            ...mapActions(['setSnackbar']),
            refreshData () {
                let me =  this;
                me.today = (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString();
                //console.log(dateToISOLikeButLocal(new Date(Date.now())));

                if(me.autorefresh==false){
                    me.interval = null;
                    this.currentval= 0;
                    this.currentvalp = 0;
                }

                if(me.currentval < 150){
                    me.currentval++;
                    me.currentvalp=parseInt(me.currentval/150 *100);
                    //console.log("Timer  " + me.currentval/144 *100);
                }        
                if(me.currentval == 150 ){
                    if(me.cargando == false){
                        //console.log("reload");
                        //me.limpiar();
                        me.buscar(); 
                    }
                else if(me.$store.state.usuario==null){
                    me.interval = null;
                    return;
                }
                else
                    return;
                }

            },
            async crear(){
                let me =  this;

                me.selectKitComponentes();
                //    .then(()=> 
                me.buscar();
                
            },
            async buscar(){
                let me =  this;
                me.cargando = true;
                me.limpiar()
                    .then(() => me.datos()
                    .then(() => me.createcards()
                    .then(() => me.createfifos()
                    .then(() => me.cargando = false))));

            },
            async limpiar(){
                //this.kitsComponentes=[];
                this.currentval= 0;
                this.currentvalp = 0;
                this.ordenkits=[];
                this.ordenkitslist=[];
                this.cards=[];
                this.card=[];
                this.fifo=[];
                this.fifos=[];
            },
            getColor (rgbHex) {
                return '#'+rgbHex
            },
            getColorCard (item) {
                let color ='#FF'
                let date = new Date(item.datetime);
                date.setMinutes(date.getMinutes() + 20);
                //console.log(this.today + '<' + date.toISOString());
                if(this.today < date.toISOString())
                    color = color + 'BC00'
                else
                    color = color + '5252'

                if(item.estatus !==2)
                    color = color + '66'
                
                return color;
            },
            dateToISOLikeButLocal: function(date) {
                const offsetMs = date.getTimezoneOffset() * 60 * 1000;
                const msLocal =  date.getTime() - offsetMs;
                const dateLocal = new Date(msLocal);
                const iso = dateLocal.toISOString();
                //const isoLocal = iso.slice(0, 19);
                return iso;
            },
            getgradient(rgbHex){
                let R, G, B;
                let Rf, Gf, Bf;
                const gra = 1.572;
                let newRGB;
                R= rgbHex.substring(0,2);
                G= rgbHex.substring(2,4);
                B= rgbHex.substring(4,6);
                if ( parseInt(rgbHex, 16) > 4400000){
                    Rf= parseFloat(parseInt(R, 16))/gra;
                    Gf= parseFloat(parseInt(G, 16))/gra;
                    Bf= parseFloat(parseInt(B, 16))/gra;
                }else{
                    Rf= parseFloat(parseInt(R, 16))+100;
                    Gf= parseFloat(parseInt(G, 16))+100;
                    Bf= parseFloat(parseInt(B, 16))+100;
                }
                newRGB = '#'+ parseInt(Rf).toString(16) + parseInt(Gf).toString(16) + parseInt(Bf).toString(16);
                //console.log(newRGB);
                return newRGB;
            },
            getTextColor (rgbHex) {
                if ( parseInt(rgbHex, 16) > 14000000) return 'black'
                return 'white'
            },

            async datos(){
            let me=this;
            let header={"Authorization" : "Bearer " +this.$store.state.token};
            let configuracion= {headers : header};
            
            const a = me.MostrarOrdenKits(configuracion);
            a.then(function(result){
                    me.ordenkits=result;
            }).catch(function(error){
                errTraceguardarAxios("OrdenKits - Mostrar", error);
            });
            const b = me.FiltrarOrdenKits(this.ordenkitFiltervalue,configuracion);
            b.then(function(result){
                    me.ordenkitslist=result;
            }).catch(function(error){
                errTraceguardarAxios("OrdenKits - Listar", error);
            });

            const pdatos = await Promise.all([a,b])
            return pdatos;
            },
            MostrarOrdenKits: function(configuracion){
                const url = 'api/OrdenKits/Mostrar';
                // create a promise for the axios request
                const promise = axios.get(url,configuracion);   
                // using .then, create a new promise which extracts the data
                const dataPromise = promise.then((response) => response.data)
                // return it
                return dataPromise
            },
            ListarOrdenKits: function(configuracion){
                const url = 'api/OrdenKits/Listar';
                // create a promise for the axios request
                const promise = axios.get(url,configuracion);   
                // using .then, create a new promise which extracts the data
                const dataPromise = promise.then((response) => response.data)
                // return it
                return dataPromise
            },
            FiltrarOrdenKits: function(filtro,configuracion){
                let url;
                if(!filtro)
                    url = 'api/OrdenKits/Listar';
                else
                    url = 'api/OrdenKits/ListarFiltro/'+filtro;
                // create a promise for the axios request
                const promise = axios.get(url,configuracion);   
                // using .then, create a new promise which extracts the data
                const dataPromise = promise.then((response) => response.data)
                // return it
                return dataPromise
            },
            selectKitComponentes(){
                let me=this;
                let header={"Authorization" : "Bearer " +this.$store.state.token};
                let configuracion= {headers : header};
                axios.get('api/KitComponentes/Select',configuracion).then(function(response){
                    me.kitsComponentes=response.data;
                    //console.log(response.data);
                }).catch(function(error){
                    errTraceguardarAxios("KitComponentes - Select", error);
                    console.log(error)
                });
            },
            /*listarOrdenKits(){
                let me=this;
                let header={"Authorization" : "Bearer " +this.$store.state.token};
                let configuracion= {headers : header};
                axios.get('api/OrdenKits/Mostrar',configuracion).then(function(response){  //Checar listar y mostrar
                    me.ordenkits=response.data;
                    me.createcards();
                    //console.log(response.data);
                }).catch(function(error){
                    errTraceguardarAxios("OrdenKits - Mostrar", error);
                    console.log(error)
                });
            },*/
            CerrarOrdenKits(item){
                let me=this;
                let header={"Authorization" : "Bearer " +this.$store.state.token};
                let configuracion= {headers : header};
                axios.put('api/OrdenKits/Actualizar',{
                    'idOrdenKit': parseInt(item.id),
                    'Estatus': 4,
                },configuracion).then(function(response){
                    logTraceguardar("Orden Kits","Actualizó " + item.id + ": " + item.subtitle1 + " " + item.subtitle2 +" Estatus: Finalizado");
                    me.buscar();
                }).catch(function(error){
                    console.log(error);
                    errTraceguardarAxios("OrdenKits - Actualizar", error); 
                })
            },

            createcards: async function(){
                let me=this;
                let tempidkit;
                let tempkit=[];
                let comentariotmp=[];
                //console.log(me.ordenkits);

                me.ordenkits.forEach(function(item, index){
                    if(item.estatus == 2){
                            tempidkit = item.idKit;
                            tempkit=[];
                            me.kitsComponentes.forEach(function(item, index){
                            if (tempidkit ==  item.idKit)
                                tempkit.push(item)
                        });
                        //console.log(tempkit);
                        me.card = { id: item.idOrdenKit,
                                    title: item.nombreVersion + ' ' + item.variante + ' ',
                                    subtitle1: 'PKN: ' + item.pkn.toString(),
                                    subtitle2: 'JITSec: ' + item.jitSec.toString(),
                                    pos0: item.modelo + ' '+ item.version + ' ' + item.codigoColor ,
                                    datetime: ((new Date(item.fechaYHoraCreacion)).toISOString() - (new Date()).getTimezoneOffset() * 60000),
                                   // (new Date(item.fechaYHoraCreacion - (new Date()).getTimezoneOffset() * 60000)).toISOString(),
                                    //(new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString();
                                    color:  '#'+item.rgbHex,
                                    colorname: item.color,
                                    colorcode: item.codigoColor,
                                    gradient: "to top right, #" +item.rgbHex + "CC," + me.getgradient(item.rgbHex) + "66",
                                    items: tempkit,
                                    estatus: item.estatus,
                                    comentario: item.comentario}
                        me.cards.push(me.card);
                        comentariotmp.push(item.comentario)
                        me.card= {};
                    }
                });
                me.tipoorden = comentariotmp.filter((value, index, array) => array.indexOf(value) === index);
                me.tipoorden.push({text: 'Todas las ordenes', value: null})
                me.tipoorden = me.tipoorden.reverse();
            },
            removecard(seconds,item) {
                setTimeout(()=> item.estatus = 4, seconds * 1000);
                this.CerrarOrdenKits(item);
            },
            createfifos: async function(){
                let me=this;
                
                me.ordenkitslist.forEach(function(item, index){
                    me.fifo = { id: item.idOrdenKit,
                                    title: item.nombreVersion + ' ' + item.variante + ' ',
                                    subtitle1: item.pkn.toString(),
                                    subtitle2: item.jitSec.toString(),
                                    pos0: item.modelo + ' '+ item.version + ' ' + item.codigoColor ,
                                    //datetime: ((new Date(item.fechaYHoraCreacion)) - (new Date()).getTimezoneOffset() * 60000).toISOString(),
                                    datetime: me.dateToISOLikeButLocal(new Date(item.fechaYHoraCreacion)),
                                    //datetime: new Date(item.fechaYHoraCreacion).toISOString(),
                                    color:  '#'+item.rgbHex,
                                    colorname: item.color,
                                    estatus: item.estatus,
                                    comentario: item.comentario}
                    me.fifos.push(me.fifo);
                    me.fifo= {};
                });
                
                //console.log(me.tipoorden);

            },
            ordenkitFilter(value) {
                if (!this.ordenkitFiltervalue) {
                return true;
                }
                return value === this.ordenkitFiltervalue;
            },
            distinct: async function(value, index, array) {
                return array.indexOf(value) === index;
            }
        },
        computed: {
            ...mapGetters(['getDashmode']),
            autorefresh_text(){
                let me =this;
                let text;
                if(me.autorefresh)
                    text = 'Desactivar Auto Actualizar Ordenes';
                else
                    text = 'Activar Auto Actualizar Ordenes';
                return text;
            },
            filteredfifos() {
                if (!this.ordenkitFiltervalue)
                    return this.fifos;
                else
                    return this.fifos.filter((item, index) => item.comentario === this.ordenkitFiltervalue);
            },
            filteredcards() {
                if (!this.ordenkitFiltervalue)
                    return this.cards;
                else
                    return this.cards.filter((item, index) => item.comentario === this.ordenkitFiltervalue);
            },
        }
    }
</script>
<style scoped>
.main-container {
    max-height: calc(100vh - 330px);  /*385 sin dashmode*/
    height:auto;
    overflow-y: auto;
    overflow-x: hidden;
}
</style>