<template>
    <div id="app" class="v-main__wrap">
        <v-app>
            <nav>
        <template>
            <g-gantt-chart
            :chart-start="myChartStart"
            :chart-end="myChartEnd"
            :grid="grid"
            :highlighted-hours="highlightedHours"
            precision="hour"
            push-on-overlap
            :theme="themes"
            @dblclick-bar="onMouseupBar($event.bar)"
            >
            <g-gantt-row 
                v-for="row in rows"
                :key="row.title"
                :label="row.label"
                :bars="row.bars"
                :highlight-on-hover="highlightOnHover"
                bar-start="myStart"
                bar-end="myEnd"
            >
                <template #bar-label="{bar}">
                <img
                    v-if="bar.image"
                    :src="require(`@/assets/${bar.image}`)"
                    height="20"
                    width="20"
                    class="mr-1"
                >
                <span>{{bar.label}}</span>
                </template>
            </g-gantt-row>
            </g-gantt-chart>
        </template>
        <v-spacer></v-spacer>
        <v-dialog
        v-model="dialog"
        max-width="500px"
        >
        <template v-slot:activator="{ on, attrs }">
            <v-btn
                    color="primary"
                    dark
                    class="mb-2"
                    v-bind="attrs"
                    v-on="on"
                    >
            New Item
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
                        sm="6"
                        md="4"
                        >
                    <v-text-field
                                v-model="editedItem.label"
                                label="Event name"
                                ></v-text-field>
                </v-col>
                <v-col
                        cols="12"
                        sm="6"
                        md="4"
                        >
                    <v-text-field
                                v-model="editedItem.category"
                                label="Category"
                                ></v-text-field>
                </v-col>
                <v-col
                        cols="12"
                        sm="6"
                        md="4"
                        >
                </v-col>
                <v-col
                        cols="12"
                        sm="6"
                        md="4"
                        >
                </v-col>
                <v-col
                        cols="12"
                        sm="6"
                        md="4"
                        >
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
                Cancel
            </v-btn>
            <v-btn
                    color="blue darken-1"
                    text
                    @click="save"
                    >
                Save
            </v-btn>
            </v-card-actions>
        </v-card>
        </v-dialog>
            </nav>
        </v-app>
    </div>
</template>


<script>

    import {GGanttChart, GGanttRow} from "vue-ganttastic";
    import moment from "moment";

    export default {
        components:{
            GGanttChart,
            GGanttRow
        },
        data() {
            return  {
                darkmode:false,
                themes:'vue',
                dialog: false,
                dialogDelete: false,
                editedItem: {
                    label: '',
                    category: '',
                },
                //today: new Date(Date.now()),
                
                myChartStart: "2023-07-25 06:00",
                myChartEnd: "2023-07-26 06:00",

                highlightedHours: ["14","22"],
                rows: [
                    {
                    label: "Availability/Performance",
                    bars: [
                        {
                        myStart: "2023-07-25 12:10",
                        myEnd: "2023-07-25 16:35",
                        label: "Stop button",
                        ganttBarConfig: {
                            background: "Orange",
                            opacity: 0.8,
                            borderRadius: "3px",
                            handles: true
                            }
                        },
                        {
                        myStart: "2023-07-25 19:00",
                        myEnd: "2023-07-25 22:00",
                        label: "Conveyor",
                        category: "Avalability",
                        ganttBarConfig: {
                            background: "Red",
                            opacity: 0.8,
                            borderRadius: "3px",
                            handles: true
                            }
                        },
                        {
                        myStart: "2023-07-25 07:00",
                        myEnd: "2023-07-25 08:30",
                        label: "Microstop",
                        ganttBarConfig: {
                            background: "Blue",
                            opacity: 0.8,
                            borderRadius: "3px",
                            immobile: true
                            }
                        }
                    ]
                    },
                ]
                
            }
        },
        computed: {
            yesterday(){
                let date = (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000));
                //# => Fri Apr 01 2011 11:14:50 GMT+0200 (CEST)
                date.setDate(date.getDate() - 1);
                console.log("yesterday: " + date);
                //console.log(GGanttChart);
                return date;
            },
            tomorrow(){
                let date = (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000));
                //# => Fri Apr 01 2011 11:14:50 GMT+0200 (CEST)
                date.setDate(date.getDate() + 1 );
                date.toISOString().split('T')[0];

                console.log("tomorrow: " + date);
                return date;
            },
            formTitle () {
            return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
            },
        },
        watch: {
            dialog (val) {
            val || this.close()
            },
            dialogDelete (val) {
            val || this.closeDelete()
            },
            '$vuetify.theme.dark'(){
                this.darkmode = this.$vuetify.theme.dark;
                //console.log(this.darkmode);
                this.ChartsDarkMode(this.darkmode);
            }
        },
        created(){
            this.darkmode = this.$vuetify.theme.dark;
        },
        methods: {
            onMouseupBar(e){
                //e.event.preventDefault(),
                this.editedItem.label = e.label;
                this.editedItem.category = e.category;
                this.dialog = true;
                //alert("Bar "+ e.label + " " + e.category);
            },
            close () {
            this.dialog = false
            this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem)
                this.editedIndex = -1
            })
            },
            save () {
                if (this.editedIndex > -1) {
                    Object.assign(this.desserts[this.editedIndex],                this.editedItem)
                } else {
                    this.desserts.push(this.editedItem)
                }
                this.close()
            },
            ChartsDarkMode: function(val){
                let me = this;
                //console.log(val);
                                
                if (val == true)
                    me.themes = 'dark';
                if (val == false)
                    me.themes = 'vue';
            },
        },
    }
</script>