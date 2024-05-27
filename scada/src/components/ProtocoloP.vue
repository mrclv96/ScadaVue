<template>
    <v-layout align-start>
        <v-flex>
            <v-data-table
                :headers="headers"
                :items="protocolos"
                :search="search"
                :single-expand="singleExpand"
                :expanded.sync="expanded"
                @item-expanded="expandprotocol"
                item-key="idProtocolo"
                sort-by="FechaIn"
                show-expand
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
                <template v-slot:item.dateAndTimeIn="{ item }">
                    <span>{{ new Date(item.dateAndTimeIn).toLocaleString() }}</span>
                </template>
                <template v-slot:item.dateAndTimeFbk="{ item }">
                    <span>{{ new Date(item.dateAndTimeFbk).toLocaleString() }}</span>
                </template>
                <template v-slot:item.estatusMaquina="{ item }">
                    <span :class="getEstatusMaquinaColor(item.estatusMaquina)">{{ getEstatusMaquinaText(item.estatusMaquina) }}</span>
                </template>
                <template v-slot:item.estatusCalidad="{ item }">
                    <span :class="getEstatusCalidadColor(item.estatusCalidad)">{{ getEstatusCalidadText(item.estatusCalidad) }}</span>
                </template>
                <template v-slot:item.version="{ item }">
                    <v-chip
                    :color="getColor(item.rgbHex)"
                    :text-color="getTextColor(item.rgbHex)"
                    >
                    {{ item.version }}
                    </v-chip>
                </template>
                <template #item.data-table-expand="{ item, expand, isExpanded }">
                    <td v-if="stations.some(el => item.estacion.includes(el))" class="text-start">
                    <v-btn icon 
                            @click="expand(!isExpanded)" 
                            class="v-data-table__expand-icon"
                            :class="{'v-data-table__expand-icon--active' : isExpanded}">
                        <v-icon>expand_more</v-icon>
                    </v-btn>
                    </td>
                </template>
                <template v-slot:expanded-item="{ headers, item}">
                    <td :colspan="headers.length">
                        <v-row no-gutters>
                            <v-chip
                                v-for="(item, idx) in chipdata"
                                :key="idx"
                                class="ma-2"
                                :color="item.color"
                                label
                                text-color="white"
                            >
                                <v-icon left>
                                {{ item.icon }}
                                </v-icon>
                                    <template v-if="item.color == 'blue'">
                                        {{ item.text }} : {{ item.value }}
                                    </template>
                                    <template v-else>
                                        {{ item.text }}
                                    </template>
                            </v-chip>
                        </v-row>
                        <v-row justify="space-around"
                        no-gutters>
                        <v-col>
                            <div v-if="(punchstations.some(el => item.estacion.includes(el)) && punchData.length  > 0)" >
                                <v-card-title>
                                    Punch Data
                                </v-card-title>
                                <v-data-table
                                    :headers="hpuchdata"
                                    :items="punchData"
                                    hide-default-footer
                                    class="elevation-1"
                                >
                                </v-data-table>
                            </div>
                        </v-col>
                        <v-col>
                            <div v-if="(punchstations.some(el => item.estacion.includes(el)) && weldData.length  > 0)" >
                                <v-card-title>
                                    Weld Data
                                </v-card-title>
                                <v-data-table
                                    :headers="hwelddata"
                                    :items="weldData"
                                    hide-default-footer
                                    class="elevation-1"
                                >
                                </v-data-table>
                            </div>
                        </v-col>
                        </v-row>
                        <v-row justify="space-around"
                        no-gutters>
                        <v-col>
                            <div v-if="(conveyorstations.some(el => item.estacion.includes(el)) && scanData.length  > 0)" >
                                <v-card-title>
                                    Scan Data
                                </v-card-title>
                                <v-data-table
                                    :headers="hscandata"
                                    :items="scanData"
                                    hide-default-footer
                                    class="elevation-1"
                                >
                                <template v-slot:item.idSTA="{ item }">
                                    <span :class="getStaname(item.idSTA)">{{ getStaname(item.idSTA) }}</span>
                                </template>
                                </v-data-table>
                            </div>
                        </v-col>
                        <v-col>
                            <div v-if="(conveyorstations.some(el => item.estacion.includes(el)) && torqueData.length  > 0)" >
                                <v-card-title>
                                    Torque Data
                                </v-card-title>
                                <v-data-table
                                    :headers="htorquedata"
                                    :items="torqueData"
                                    hide-default-footer
                                    class="elevation-1"
                                >
                                <template v-slot:item.idSTA="{ item }">
                                    <span :class="getStaname(item.idSTA)">{{ getStaname(item.idSTA) }}</span>
                                </template>
                                </v-data-table>
                            </div>
                        </v-col>   
                        </v-row>
                    </td>
                </template>
                <template v-slot:top>
                    <v-toolbar
                    flat
                    >
                <v-toolbar-title>Protocolos de producción</v-toolbar-title>
                        <v-divider
                            class="mx-4"
                            inset
                            vertical
                        ></v-divider>
                        <v-spacer></v-spacer>
                        <v-text-field class="text-xs-center" v-model="search" append-icon="search" label="Búsqueda" single-line hide-details></v-text-field>
                        <v-spacer></v-spacer>
                        <v-select
                            class="text-xs-center"
                            :items="lineas"
                            v-model="lineasFilterValue"
                            label="Líneas"
                            single-line hide-details
                        ></v-select>
                        <v-spacer></v-spacer>
                        <v-dialog
                            v-model="dialog"
                            max-width="1600px"
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
                            @click="copiartabla(protocolos)"
                            >
                            <v-icon>content_copy</v-icon>
                            Copiar
                            </v-btn>
                            </template>
                            <v-card>
                            <v-card-title>
                                <span class="text-h5">Buscar en protocolos</span>
                            </v-card-title>
                            <v-bottom-navigation
                                    color="primary"
                                    v-model="vbn"
                                    shift
                                    >
                                    <v-btn @click="solo1=1">
                                        <span>Por palabra</span>
                                        <v-icon>manage_search</v-icon>
                                    </v-btn>
                                    <v-btn @click="solo1=2">
                                        <span>Por Fecha</span>
                                        <v-icon>event</v-icon>
                                    </v-btn>
                                    <v-btn @click="solo1=3">
                                        <span>PKN & JitSec</span>
                                        <v-icon>barcode_reader</v-icon>
                                    </v-btn>
                            </v-bottom-navigation>
                            <v-card-text>
                                <v-container fluid>
                                    <v-row justify="space-between">
                                        <v-col v-if="solo1==1"
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
                                        <v-col v-if="solo1==2"
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
                                            min="2021-10-26"
                                            @change="$refs.menud1.save(date1)"
                                            ></v-date-picker>
                                        </v-menu>
                                        </v-col>
                                        <template v-if="solo1==3">
                                            <v-col
                                            cols="4"
                                            sm="4"
                                            md="4"
                                            >
                                            <v-text-field
                                                v-model="bPKN"
                                                label="PKN"
                                                hint="Debe ser igual a 10 caracteres"
                                                type="number"
                                            ></v-text-field>
                                            </v-col>
                                            <v-col
                                            cols="4"
                                            sm="4"
                                            md="4"
                                            >
                                            <v-text-field
                                                v-model="bJitSec"
                                                label="JitSec"
                                                hint="Máximo 4 caracteres"
                                                type="number"
                                            ></v-text-field>
                                            </v-col>
                                        </template>
                                        <v-col v-if="solo1==2"
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
                                        <v-col v-if="solo1==2"
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
                                            min="2021-10-26"
                                            @change="$refs.menud2.save(date2)"
                                            ></v-date-picker>
                                        </v-menu>
                                        </v-col>
                                        <v-col v-if="solo1==2"
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
                                        <v-btn v-if="solo1==1"
                                        color="blue darken-1"
                                        text
                                        @click="selectbuscar"
                                        :disabled="palabraClave.length < 3 "
                                        >
                                        <v-icon>search</v-icon>
                                        Buscar
                                        </v-btn>
                                        <v-btn v-if="solo1==2"
                                        color="blue darken-1"
                                        text
                                        @click="selectbuscarfecha"
                                        :disabled="(datevalidation || date1==null || date2==null || time1==null || time2==null )"
                                        >
                                        <v-icon>search</v-icon>
                                        Buscar
                                        </v-btn>
                                        <v-btn v-if="solo1==3"
                                        color="blue darken-1"
                                        text
                                        @click="selectbuscarPKNJitSec"
                                        :disabled="( bPKN.length !== 10 || bJitSec.length < 0 || bPKN =='' || bJitSec == '' )"
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
                                        :single-expand="rsingleExpand"
                                        :expanded.sync="rexpanded"
                                        @item-expanded="expandprotocolB"
                                        item-key="idProtocolo"
                                        sort-by="FechaIn"
                                        show-expand
                                        class="elevation-1"
                                        :loading="cargandoB"
                                        loading-text="Cargando... Favor esperar"
                                        >
                                        <template v-slot:item.dateAndTimeIn="{ item }">
                                            <span>{{ new Date(item.dateAndTimeIn).toLocaleString() }}</span>
                                        </template>
                                        <template v-slot:item.dateAndTimeFbk="{ item }">
                                            <span>{{ new Date(item.dateAndTimeFbk).toLocaleString() }}</span>
                                        </template>
                                        <template v-slot:item.estatusMaquina="{ item }">
                                            <span :class="getEstatusMaquinaColor(item.estatusMaquina)">{{ getEstatusMaquinaText(item.estatusMaquina) }}</span>
                                        </template>
                                        <template v-slot:item.estatusCalidad="{ item }">
                                            <span :class="getEstatusCalidadColor(item.estatusCalidad)">{{ getEstatusCalidadText(item.estatusCalidad) }}</span>
                                        </template>
                                        <template v-slot:item.version="{ item }">
                                            <v-chip
                                            :color="getColor(item.rgbHex)"
                                            :text-color="getTextColor(item.rgbHex)"
                                            >
                                            {{ item.version }}
                                            </v-chip>
                                        </template>
                                        <template #item.data-table-expand="{ item, expand, isExpanded }">
                                            <td v-if="stations.some(el => item.estacion.includes(el))" class="text-start">
                                            <v-btn icon 
                                                    @click="expand(!isExpanded)" 
                                                    class="v-data-table__expand-icon"
                                                    :class="{'v-data-table__expand-icon--active' : isExpanded}">
                                                <v-icon>expand_more</v-icon>
                                            </v-btn>
                                            </td>
                                        </template>
                                        <template v-slot:expanded-item="{ headers, item}">
                                            <td :colspan="headers.length">
                                                <v-row no-gutters>
                                                    <v-chip
                                                        v-for="(item, idx) in chipdata"
                                                        :key="idx"
                                                        class="ma-2"
                                                        :color="item.color"
                                                        label
                                                        text-color="white"
                                                    >
                                                        <v-icon left>
                                                        {{ item.icon }}
                                                        </v-icon>
                                                            <template v-if="item.color == 'blue'">
                                                                {{ item.text }} : {{ item.value }}
                                                            </template>
                                                            <template v-else>
                                                                {{ item.text }}
                                                            </template>
                                                    </v-chip>
                                                </v-row>
                                                <v-row justify="space-around"
                                                no-gutters>
                                                <v-col>
                                                    <div v-if="(punchstations.some(el => item.estacion.includes(el)) && punchData.length  > 0)" >
                                                        <v-card-title>
                                                            Punch Data
                                                        </v-card-title>
                                                        <v-data-table
                                                            :headers="hpuchdata"
                                                            :items="punchData"
                                                            hide-default-footer
                                                            class="elevation-1"
                                                        >
                                                        </v-data-table>
                                                    </div>
                                                </v-col>
                                                <v-col>
                                                    <div v-if="(punchstations.some(el => item.estacion.includes(el)) && weldData.length  > 0)" >
                                                        <v-card-title>
                                                            Weld Data
                                                        </v-card-title>
                                                        <v-data-table
                                                            :headers="hwelddata"
                                                            :items="weldData"
                                                            hide-default-footer
                                                            class="elevation-1"
                                                        >
                                                        </v-data-table>
                                                    </div>
                                                </v-col>
                                                </v-row>
                                                <v-row justify="space-around"
                                                no-gutters>
                                                <v-col>
                                                    <div v-if="(conveyorstations.some(el => item.estacion.includes(el)) && scanData.length  > 0)" >
                                                        <v-card-title>
                                                            Scan Data
                                                        </v-card-title>
                                                        <v-data-table
                                                            :headers="hscandata"
                                                            :items="scanData"
                                                            hide-default-footer
                                                            class="elevation-1"
                                                        >
                                                        <template v-slot:item.idSTA="{ item }">
                                                            <span :class="getStaname(item.idSTA)">{{ getStaname(item.idSTA) }}</span>
                                                        </template>
                                                        </v-data-table>
                                                    </div>
                                                </v-col>
                                                <v-col>
                                                    <div v-if="(conveyorstations.some(el => item.estacion.includes(el)) && torqueData.length  > 0)" >
                                                        <v-card-title>
                                                            Torque Data
                                                        </v-card-title>
                                                        <v-data-table
                                                            :headers="htorquedata"
                                                            :items="torqueData"
                                                            hide-default-footer
                                                            class="elevation-1"
                                                        >
                                                        <template v-slot:item.idSTA="{ item }">
                                                            <span :class="getStaname(item.idSTA)">{{ getStaname(item.idSTA) }}</span>
                                                        </template>
                                                        </v-data-table>
                                                    </div>
                                                </v-col>   
                                                </v-row>
                                            </td>
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
                    protocolos:[],
                    dialog: false,
                    singleExpand: true,
                    rsingleExpand: true,

                    search: '',

                    palabraClave:'',
                    resultBusqueda:[],
                    
                    hpuchdata:[
                        //{ text: 'idProtocolo', value: 'idProtocolo'},
                        //{ text: 'idEstacion', value: 'idEstacion'},
                        { text: 'Punzón', value: 'name'},
                        { text: 'PunchSpeed', value: 'p_PunchSpeed'},
                        { text: 'PunchDepth', value: 'p_PunchDepth'},
                        { text: 'RadiusSpeed', value: 'p_RadiusSpeed'},
                        { text: 'RadiusDepth', value: 'p_RadiusDepth'},
                        { text: 'RadiusHoldTime', value: 'p_RadiusHoldTime'},
                        { text: 'WeldTime', value: 'p_WeldTime'},
                        { text: 'Energy', value: 'p_Energy'},
                        { text: 'Amplitude', value: 'p_Amplitude'},
                        { text: 'Frequency', value: 'p_Frequency'},
                    ],
                    hwelddata:[
                        { text: 'Sonotrodo', value: 'name'},
                        { text: 'Setpoint', value: 'p_Setpoint'},
                        { text: 'Reached', value: 'p_Reached'},
                        { text: 'Pressure', value: 'p_Pressure'},
                        { text: 'CoolingTime', value: 'p_CoolingTime'},
                        { text: 'AfterCoolTime', value: 'p_AfterCoolTime'},
                        { text: 'WeldTime', value: 'p_WeldTime'},
                        { text: 'Energy', value: 'p_Energy'},
                        { text: 'Amplitude', value: 'p_Amplitude'},
                        { text: 'Frequency', value: 'p_Frequency'},
                        { text: 'MaxPower', value: 'p_MaxPower'},
                    ],
                    hscandata:[
                        { text: 'Station', value: 'idSTA'},
                        //{ text: 'name', value: 'name'},
                        { text: 'StringScan', value: 'stringScan'},
                        { text: 'StringStep', value: 'stringStep'},
                    ],
                    htorquedata:[
                        { text: 'Station', value: 'idSTA'},
                        { text: 'NumTrq', value: 'numTrq'},
                        { text: 'NumTrqOK', value: 'numTrqOK'},
                        //{ text: 'name', value: 'name'},
                    ],
                    estatusmaquina:[
                        { text: 'Producción', value: 1, color: 'green'},
                        { text: 'Falla', value: 2, color: 'red'},
                        { text: 'Configuración', value: 3, color: 'blue'}
                    ],
                    estatuscalidad:[
                        { text: 'OK', value: 16, color: 'green'},
                        { text: 'En Proceso', value: 8, color: 'teal'},
                        { text: 'En Espera', value: 4, color: 'yellow'},
                        { text: 'Scrap', value: 2, color: 'red'},
                        { text: 'Retrabajo', value: 1, color: 'orange'},
                    ],
                    sta:[
                        { text: 'Load/Up Elevador', value: 0},
                        { text: 'Station 1A', value: 1},
                        { text: 'Station 2A', value: 2},
                        { text: 'Station 3A', value: 3},
                        { text: 'Station 4A', value: 4},
                        //{ text: 'Reserve', value: 5},
                        { text: 'Unload/Down Elevador', value: 6},
                        { text: 'Reserve', value: 7},
                        { text: 'Station 1B', value: 8},
                        { text: 'Station 2B', value: 9},
                        { text: 'Station 3B', value: 10},
                        { text: 'Station 4B', value: 11},
                        //{ text: 'Reserve', value: 12},
                        { text: 'Pick Station', value: 13},
                    ],
                    //chipdata:[ { text: 'OK', icon: 'flag', color: 'grey'},],
                    chipdata:[],

                    stationprotocol:[],
                    expanded: [],
                    rexpanded: [],
                    lineas:[],
                    lineasFilterValue:null,
                    solo1:1,
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

                    rgbHex:'#1976D2',
                    bPKN:'',
                    bJitSec:'',
                    adId: '',
                    cargando:true,
                    cargandoB:false,
                    stations:['S10920M','S10921M','S10922M','S10923M','S10924M','X10376','2019101','2019103','2019149','4160273'],
                    punchstations:['2019101','2019103'],
                    conveyorstations:['4160273'],
                    punchData:[],
                    weldData:[],
                    scanData:[],
                    torqueData:[],
                    }
                },
        computed: {
            datevalidation() {
                return this.date1>this.date2;
            },
            headers() {
                return[
                    //{ text: 'ID', value: 'idProtocolo'},
                    //{ text: 'Código Estación', value: 'idEstacion'},
                    { text: 'Línea', value: 'linea', filter: this.lineasFilter},
                    { text: 'Estación', value: 'estacion'},
                    { text: 'Fecha Inicio', value: 'dateAndTimeIn', dataType: "Date"},
                    { text: 'Fecha Termino', value: 'dateAndTimeFbk', dataType: "Date"},
                    { text: 'Flujo Actual', value: 'flujoActual'},
                    { text: 'PKN', value: 'pkn'},
                    { text: 'JitSec', value: 'jitSec'},
                    //{ text: 'Modelo', value: 'modelo'},
                    { text: 'Versión', value: 'version'},
                    //{ text: 'Código Color', value: 'codigoColor'},
                    { text: 'Variante', value: 'variante'},
                    { text: 'Tiempo Ciclo', value: 'tiempoCiclo'},
                    { text: 'Estatus de Máquina', value: 'estatusMaquina'},
                    { text: 'Estatus de Calidad', value: 'estatusCalidad' },
                    { text: 'Comentario', value: 'comentario' },
                ]
            },
            headers2(){
                return[
                        { text: 'Línea', value: 'linea', filter: this.lineasFilter},
                        { text: 'Estación', value: 'estacion'},
                        { text: 'Fecha Inicio', value: 'dateAndTimeIn', dataType: "Date"},
                        { text: 'Fecha Termino', value: 'dateAndTimeFbk', dataType: "Date"},
                        { text: 'Flujo Actual', value: 'flujoActual'},
                        { text: 'PKN', value: 'pkn'},
                        { text: 'JitSec', value: 'jitSec'},
                        { text: 'Versión', value: 'version'},
                        { text: 'Variante', value: 'variante'},
                        { text: 'Tiempo Ciclo', value: 'tiempoCiclo'},
                        { text: 'Estatus de Máquina', value: 'estatusMaquina'},
                        { text: 'Estatus de Calidad', value: 'estatusCalidad' },
                        { text: 'Comentario', value: 'comentario' },
                    ]
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
            this.selectl();
        },
        methods: {
            listar(){
                let me=this;
                let header={"Authorization" : "Bearer " +this.$store.state.token};
                let configuracion= {headers : header};
                axios.get('api/Protocolos/Listar',configuracion).then(function(response){
                    //console.log(response)
                    me.protocolos=response.data;
                    me.cargando=false;
                }).catch(function(error){
                    console.log(error);
                    errTraceguardarAxios("Protocolo - Listar", error); 
                });        
            },
            selectl(){
                let me=this;
                let header={"Authorization" : "Bearer " +this.$store.state.token};
                let configuracion= {headers : header};
                var lineasArray=[];
                me.lineas.push({text: 'Todas las líneas', value: null})
                axios.get('api/Lineas/Select',configuracion).then(function(response){
                    lineasArray=response.data;
                    lineasArray.map(function(x){
                        me.lineas.push({text: x.nombre, value: x.nombre})
                    });
                }).catch(function(error){
                    errTraceguardarAxios("Linea - Select", error);
                    console.log(error)
                });
            },
            selectbuscar(){
                let me=this;
                me.cargandoB=true;
                let header={"Authorization" : "Bearer " +this.$store.state.token};
                let configuracion= {headers : header};
                me.resultBusqueda=[];
                //console.log(this.palabraClave);
                axios.get('api/Protocolos/ListarFiltro/'+this.palabraClave,configuracion).then(function(response){
                        me.resultBusqueda=response.data;
                        me.cargandoB=false;
                    }).catch(function(error){
                    console.log(error);
                    errTraceguardarAxios("Protocolo - ListarFiltro", error); 
                });
            },
            selectbuscarfecha(){
                let me=this;
                me.cargandoB=true;
                me.resultBusqueda=[];
                let header={"Authorization" : "Bearer " +this.$store.state.token};
                let configuracion= {headers : header};
                //console.log(this.getdatetime(me.date1 + " " + me.time1));
                axios.post('api/Protocolos/ListarFiltroFecha',{
                        'StartTime': this.getdatetime(me.date1 + " " + me.time1),
                        'EndTime': this.getdatetime(me.date2 + " " + me.time2)
                    },configuracion).then(function(response){
                        me.resultBusqueda=response.data;
                        me.cargandoB=false;
                    }).catch(function(error){
                    console.log(error);
                    errTraceguardarAxios("Protocolo - ListarFiltroFecha", error); 
                });
            },
            selectbuscarPKNJitSec(){
                let me=this;
                me.cargandoB=true;
                me.resultBusqueda=[];
                let header={"Authorization" : "Bearer " +this.$store.state.token};
                let configuracion= {headers : header};
                //console.log(this.getdatetime(me.date1 + " " + me.time1));
                axios.post('api/Protocolos/ListarFiltroPKNJitSec',{
                        'PKN': me.bPKN,
                        'JitSec': parseInt(me.bJitSec),
                    },configuracion).then(function(response){
                        me.resultBusqueda=response.data;
                        me.cargandoB=false;
                    }).catch(function(error){
                    console.log(error);
                    errTraceguardarAxios("Protocolo - ListarFiltroPKNJitSec", error); 
                });
            },
            expandprotocol({item}){
                //console.log(item.estacion);
                this.selectTPL(item);
                if(this.punchstations.some(el => item.estacion.includes(el)))
                {
                    this.selectPunchData(item);
                    this.selectWeldData(item);
                }
                if(this.conveyorstations.some(el => item.estacion.includes(el)))
                {
                    this.selectScanData(item);
                    this.selectTorqueData(item);
                }
            },
            expandprotocolB({item}){
                //console.log(item.estacion);
                this.selectTPL(item);
                if(this.punchstations.some(el => item.estacion.includes(el)))
                {
                    this.selectPunchData(item);
                    this.selectWeldData(item);
                }
                if(this.conveyorstations.some(el => item.estacion.includes(el)))
                {
                    this.selectScanData(item);
                    this.selectTorqueData(item);
                }
            },
            selectTPL(item){
                let me=this;
                let header={"Authorization" : "Bearer " +this.$store.state.token};
                let configuracion= {headers : header};
                let st='';
                //console.log(item.estacion);
                let position = item.estacion.search(" ");
                let result = item.estacion.substring(0, position);
                if (result.match(/^\d/))
                {
                    st = 'S'+result;
                }else
                    st = result;
                //console.log(st);
                me.chipdata = [];
                this.adId=item.idProtocolo;
                axios.get('api/'+st+'/Select/'+this.adId,configuracion).then(function(response){
                    me.stationprotocol=response.data;
                    me.getChipFlag(me.stationprotocol);
                }).catch(function(error){
                    console.log(error);
                    errTraceguardarAxios("TPL_"+st+"- Select", error); 
                });        
            },
            selectPunchData(item){
                let me=this;
                let header={"Authorization" : "Bearer " +this.$store.state.token};
                let configuracion= {headers : header};
                //console.log(item.estacion);
                let position = item.estacion.search(" ");
                let result = item.estacion.substring(0, position);
                this.adId=item.idProtocolo;
                axios.post('api/PunchDatas/Select/',{
                    'idProtocolo': parseInt(this.adId),
                    'idEstacion': result,
                    },configuracion).then(function(response){
                    me.punchData=response.data;
                    //console.log(me.punchData.length);
                }).catch(function(error){
                    console.log(error);
                    errTraceguardarAxios("TPL_PunchData - Select", error); 
                });        
            },
            selectWeldData(item){
                let me=this;
                let header={"Authorization" : "Bearer " +this.$store.state.token};
                let configuracion= {headers : header};
                //console.log(item.estacion);
                let position = item.estacion.search(" ");
                let result = item.estacion.substring(0, position);
                this.adId=item.idProtocolo;
                axios.post('api/WeldDatas/Select/',{
                    'idProtocolo': parseInt(this.adId),
                    'idEstacion': result,
                    },configuracion).then(function(response){
                    me.weldData=response.data;
                }).catch(function(error){
                    console.log(error);
                    errTraceguardarAxios("TPL_WeldData - Select", error); 
                });        
            },
            selectScanData(item){
                let me=this;
                let header={"Authorization" : "Bearer " +this.$store.state.token};
                let configuracion= {headers : header};
                //console.log(item.estacion);
                let position = item.estacion.search(" ");
                let result = item.estacion.substring(0, position);
                this.adId=item.idProtocolo;
                axios.post('api/ScanDatas/Select/',{
                    'idProtocolo': parseInt(this.adId),
                    'idEstacion': result,
                    },configuracion).then(function(response){
                    me.scanData=response.data;
                }).catch(function(error){
                    console.log(error);
                    errTraceguardarAxios("TPL_ScanData - Select", error); 
                });        
            },
            selectTorqueData(item){
                let me=this;
                let header={"Authorization" : "Bearer " +this.$store.state.token};
                let configuracion= {headers : header};
                //console.log(item.estacion);
                let position = item.estacion.search(" ");
                let result = item.estacion.substring(0, position);
                this.adId=item.idProtocolo;
                axios.post('api/TorqueDatas/Select/',{
                    'idProtocolo': parseInt(this.adId),
                    'idEstacion': result,
                    },configuracion).then(function(response){
                    me.torqueData=response.data;
                }).catch(function(error){
                    console.log(error);
                    errTraceguardarAxios("TPL_TorqueData - Select", error); 
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
            getColor (rgbHex) {
                return '#'+rgbHex
            },
            getTextColor (rgbHex) {
                if ( parseInt(rgbHex, 16) > 14000000) return 'black'
                return 'white'
            },
            getEstatusText (code){
                let me=this;
                return me.estatus[me.estatus.map(function(e) {return e.value;}).indexOf(code)].text;
            },
            getEstatusColor (code){
                let me=this;
                return me.estatus[me.estatus.map(function(e) {return e.value;}).indexOf(code)].color + "--text";
            },
            getEstatusMaquinaText (code){
                let me=this;
                return me.estatusmaquina[me.estatusmaquina.map(function(e) {return e.value;}).indexOf(code)].text;
            },
            getEstatusMaquinaColor (code){
                let me=this;
                return me.estatusmaquina[me.estatusmaquina.map(function(e) {return e.value;}).indexOf(code)].color + "--text";
            },
            getEstatusCalidadText (code){
                let me=this;
                return me.estatuscalidad[me.estatuscalidad.map(function(e) {return e.value;}).indexOf(code)].text;
            },
            getEstatusCalidadColor (code){
                let me=this;
                return me.estatuscalidad[me.estatuscalidad.map(function(e) {return e.value;}).indexOf(code)].color + "--text";
            },
            getStaname(code){
                let me=this;
                return me.sta[me.sta.map(function(e) {return e.value;}).indexOf(code)].text;
            },
            getChipFlag(item){
                let me=this;

                Object.keys(item[0]).forEach(key => {
                    let chipdatatemp={};
                    if (key.startsWith("f_"))
                    {
                        chipdatatemp.icon="flag";
                        let labeltext = key.slice(2, key.length);
                        let fktxt = "fk_"+labeltext;
                        chipdatatemp.text = labeltext;
                        if(item[0][key] == false)
                            {
                                chipdatatemp.color="grey";
                            }
                            else if (item[0][key] == item[0][fktxt])
                            {
                                chipdatatemp.color="green";
                            }
                            else
                            {  
                                chipdatatemp.color="red";
                            }
                                me.chipdata.push(chipdatatemp);
                    }
                    else if(key.startsWith("p_"))
                    {
                        chipdatatemp.icon="notes";
                        let labeltext = key.slice(2, key.length);
                        chipdatatemp.text = labeltext;
                        chipdatatemp.color="blue";
                        chipdatatemp.value=item[0][key];
                        me.chipdata.push(chipdatatemp);
                    }
                    else if(!(key.startsWith("fk_") || key.startsWith("idProtocolo"))){
                        let labeltext = key;
                        chipdatatemp.text = labeltext;
                        if(item[0][key] == true){
                            chipdatatemp.color="red";
                            chipdatatemp.icon="flag";
                        }
                        else if(item[0][key] == false){
                            chipdatatemp.color="grey";
                            chipdatatemp.icon="flag";
                        }
                        else{
                            chipdatatemp.color="blue";
                            chipdatatemp.value=item[0][key];
                            chipdatatemp.icon="notes";
                        }
                        me.chipdata.push(chipdatatemp);
                    }
                });
            },
            lineasFilter(value) {
                if (!this.lineasFilterValue) {
                return true;
                }
                return value === this.lineasFilterValue;
            },
            close () {
                this.dialog = false
                this.limpiar();
            },
            limpiar(){
                this.palabraClave='';
                this.resultBusqueda=[];
                this.chipdata=[];
                this.solo1=1;
                this.vbn=0;
                this.date1=null;
                this.date2=null;
                this.time1=null;
                this.time2=null;
            },
    },
}

</script>