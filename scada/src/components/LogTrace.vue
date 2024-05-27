<template>
    <v-layout align-start>
        <v-flex>
            <v-data-table
                :headers="headers"
                :items="logtraces"
                :search="search"
                sort-by="Fecha"
                class="elevation-1"
                :footer-props="{
                    showFirstLastPage: true,
                    firstIcon: 'first_page',
                    prevIcon: 'chevron_left',
                    nextIcon: 'chevron_right',
                    lastIcon: 'last_page'
                }"
                >
                <template v-slot:item.dateAndTime="{ item }">
                    <span>{{ new Date(item.dateAndTime).toLocaleString() }}</span>
                </template>
                <template v-slot:top>
                    <v-toolbar
                    flat
                    >
                <v-toolbar-title>Registro de cambios</v-toolbar-title>
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
                            max-width="900px"
                        >
                            <template v-slot:activator="{ on, attrs }">
                            <v-btn
                                color="primary"
                                dark
                                class="mx-2"
                                v-bind="attrs"
                                v-on="on"
                            >
                            <v-icon>query_stats</v-icon>
                            Buscar
                            </v-btn>
                            <v-btn
                            color="primary"
                            dark
                            class="mx-2"
                            @click="copiartabla(logtraces)"
                            >
                            <v-icon>content_copy</v-icon>
                            Copiar
                            </v-btn>
                            </template>
                            <v-card>
                            <v-card-title>
                                <span class="text-h5">Buscar en registros</span>
                            </v-card-title>
                            <v-bottom-navigation
                                    color="primary"
                                    v-model="vbn"
                                    shift
                                    >
                                    <v-btn @click="solo1=true">
                                        <span>Por palabra</span>
                                        <v-icon>manage_search</v-icon>
                                    </v-btn>
                                    <v-btn @click="solo1=false">
                                        <span>Por Fecha</span>
                                        <v-icon>event</v-icon>
                                    </v-btn>
                            </v-bottom-navigation>
                            <v-card-text>
                                <v-container>
                                    <v-row justify="space-between">
                                        <v-col v-if="solo1==true"
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
                                        <v-col v-if="solo1==false"
                                        cols="2"
                                        sm="2"
                                        md="2"
                                        >
                                        <v-menu
                                            ref="menud1"
                                            v-model="menud1"
                                            :close-on-content-click="false"
                                            transition="scale-transition"
                                            offset-y
                                            min-width="auto"
                                        >
                                            <template v-slot:activator="{ on, attrs }">
                                            <v-text-field
                                                v-model="date1"
                                                label="De Fecha"
                                                prepend-icon="event"
                                                readonly
                                                v-bind="attrs"
                                                v-on="on"
                                            ></v-text-field>
                                            </template>
                                            <v-date-picker
                                            v-model="date1"
                                            :active-picker.sync="activePicker1"
                                            :max="(new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10)"
                                            min="1950-01-01"
                                            @change="$refs.menud1.save(date1)"
                                            ></v-date-picker>
                                        </v-menu>
                                        </v-col>
                                        <v-col v-if="solo1==false"
                                        cols="2"
                                        sm="2"
                                        md="2"
                                        >
                                        <v-menu
                                            ref="menut1"
                                            v-model="menut1"
                                            :close-on-content-click="false"
                                            :nudge-right="40"
                                            :return-value.sync="time1"
                                            transition="scale-transition"
                                            offset-y
                                            max-width="290px"
                                            min-width="290px"
                                            >
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-text-field
                                                v-model="time1"
                                                label="De Hora"
                                                prepend-icon="schedule"
                                                readonly
                                                v-bind="attrs"
                                                v-on="on"
                                                ></v-text-field>
                                            </template>
                                            <v-time-picker
                                                v-if="menut1"
                                                v-model="time1"
                                                full-width
                                                @click:minute="$refs.menut1.save(time1)"
                                            ></v-time-picker>
                                        </v-menu>
                                        </v-col>
                                        <v-col v-if="solo1==false"
                                        cols="2"
                                        sm="2"
                                        md="2"
                                        >
                                        <v-menu
                                            ref="menud2"
                                            v-model="menud2"
                                            :close-on-content-click="false"
                                            transition="scale-transition"
                                            offset-y
                                            min-width="auto"
                                        >
                                            <template v-slot:activator="{ on, attrs }">
                                            <v-text-field
                                                v-model="date2"
                                                label="A Fecha"
                                                prepend-icon="event"
                                                readonly
                                                v-bind="attrs"
                                                v-on="on"
                                            ></v-text-field>
                                            </template>
                                            <v-date-picker
                                            v-model="date2"
                                            :active-picker.sync="activePicker2"
                                            :max="(new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10)"
                                            min="1950-01-01"
                                            @change="$refs.menud2.save(date2)"
                                            ></v-date-picker>
                                        </v-menu>
                                        </v-col>
                                        <v-col v-if="solo1==false"
                                        cols="2"
                                        sm="2"
                                        md="2"
                                        >
                                        <v-menu
                                            ref="menut2"
                                            v-model="menut2"
                                            :close-on-content-click="false"
                                            :nudge-right="40"
                                            :return-value.sync="time2"
                                            transition="scale-transition"
                                            offset-y
                                            max-width="290px"
                                            min-width="290px"
                                            >
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-text-field
                                                v-model="time2"
                                                label="A Hora"
                                                prepend-icon="schedule"
                                                readonly
                                                v-bind="attrs"
                                                v-on="on"
                                                ></v-text-field>
                                            </template>
                                            <v-time-picker
                                                v-if="menut2"
                                                v-model="time2"
                                                full-width
                                                @click:minute="$refs.menut2.save(time2)"
                                            ></v-time-picker>
                                        </v-menu>
                                        </v-col>
                                        <v-col
                                        cols="3"
                                        sm="3"
                                        md="3"
                                        >
                                        <v-btn v-if="solo1==true"
                                        color="blue darken-1"
                                        text
                                        @click="selectbuscar"
                                        :disabled="palabraClave.length < 3 "
                                        >
                                        <v-icon>search</v-icon>
                                        Buscar
                                        </v-btn>
                                        <v-btn v-if="solo1==false"
                                        color="blue darken-1"
                                        text
                                        @click="selectbuscarfecha"
                                        :disabled="(datevalidation || date1==null || date2==null || time1==null || time2==null )"
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
                                        :headers="headers2"
                                        :items="resultBusqueda"
                                        sort-by="Fecha"
                                        class="elevation-1"
                                        >
                                        <template v-slot:item.dateAndTime="{ item }">
                                            <span>{{ new Date(item.dateAndTime).toLocaleString() }}</span>
                                        </template>
                                        </v-data-table>
                                        </v-col>
                                    </v-row>
                                </v-container>
                            </v-card-text>
                                <v-card-actions>
                                    <v-btn
                                    color="blue darken-1"
                                    text
                                    :disabled="resultBusqueda.length==0"
                                    @click="copiartabla(resultBusqueda)"
                                    >
                                    <v-icon>content_copy</v-icon>
                                    Copiar
                                    </v-btn>
                                    <v-spacer></v-spacer>
                                    <v-btn
                                    color="blue darken-1"
                                    text
                                    @click="close"
                                    >
                                    Cerrar
                                    </v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-dialog>
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
                    logtraces:[],
                    dialog: false,
                    headers: [
                        { text: 'Fecha', value: 'dateAndTime', dataType: "Date" },
                        { text: 'Usuario', value: 'usuario' },
                        { text: 'Tabla', value: 'table' },
                        { text: 'Descripción', value: 'description' }
                    ],
                    search: '',

                    palabraClave:'',
                    resultBusqueda:[],
                    headers2: [
                        { text: 'Fecha', value: 'dateAndTime', dataType: "Date" },
                        { text: 'Usuario', value: 'usuario' },
                        { text: 'Tabla', value: 'table' },
                        { text: 'Descripción', value: 'description' }
                    ],
                    
                    solo1:true,
                    vbn:0,

                    activePicker1: null,
                    date1: null,
                    menud1: false,

                    time1: null,
                    menut1: false,

                    activePicker2: null,
                    date2: null,
                    menud2: false,

                    time2: null,
                    menut2: false,

                    datetime1: null,
                    datetime2: null,
                    }
                },
        computed: {
            datevalidation() {
                return this.date1>this.date2;
            }
        },
        watch: {
            dialog (val) {
                val || this.close()
            },
            menud1 (val) {
                val && setTimeout(() => (this.activePicker1 = 'YEAR'))
            },
            menud2 (val) {
                val && setTimeout(() => (this.activePicker2 = 'YEAR'))
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
                axios.get('api/LogTraces/Listar',configuracion).then(function(response){
                    //console.log(response)
                    me.logtraces=response.data;
                }).catch(function(error){
                    console.log(error);
                    errTraceguardarAxios("LogTraces - Listar", error); 
                });        
            },
            selectbuscar(){
                let me=this;
                let header={"Authorization" : "Bearer " +this.$store.state.token};
                let configuracion= {headers : header};
                var resultBusquedaArray=[];
                me.resultBusqueda=[];
                axios.get('api/LogTraces/ListarFiltro/'+this.palabraClave,configuracion).then(function(response){
                        resultBusquedaArray=response.data;
                        resultBusquedaArray.map(function(x){
                        me.resultBusqueda.push({dateAndTime: x.dateAndTime, usuario: x.usuario, table: x.table, description: x.description})
                    });
                    }).catch(function(error){
                    console.log(error);
                    errTraceguardarAxios("LogTraces - ListarFiltro", error); 
                });
            },
            selectbuscarfecha(){
                let me=this;
                let header={"Authorization" : "Bearer " +this.$store.state.token};
                let configuracion= {headers : header};
                var resultBusquedaArray=[];
                me.resultBusqueda=[];
                //console.log(this.getdatetime(me.date1 + " " + me.time1));
                axios.post('api/LogTraces/ListarFiltroFecha',{
                        'StartTime': this.getdatetime(me.date1 + " " + me.time1),
                        'EndTime': this.getdatetime(me.date2 + " " + me.time2)
                    },configuracion).then(function(response){
                        resultBusquedaArray=response.data;
                        resultBusquedaArray.map(function(x){
                        me.resultBusqueda.push({dateAndTime: x.dateAndTime, usuario: x.usuario, table: x.table, description: x.description})
                    });
                    }).catch(function(error){
                    console.log(error);
                    errTraceguardarAxios("LogTraces - ListarFiltroFecha", error); 
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
            getdatetime(val){
                //console.log(val);
                const [dateValues, timeValues] = val.split(' ');
                const [year, month, day] = dateValues.split('-');
                const [hours, minutes] = timeValues.split(':');
                return new Date(Date.UTC(+year, +month - 1, +day, +hours, +minutes,0,0));
            },
            close () {
                this.dialog = false
                this.limpiar();
            },
            limpiar(){
                this.palabraClave='';
                this.resultBusqueda=[];
                this.solo1=true;
                this.vbn=0;
                this.date1=null;
                this.date2=null;
                this.time1=null;
                this.time2=null;
            },
    },
}

</script>