import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

export default new Vuetify({
  theme: { 
      dark: false,
      options: {
        customProperties: true,
      },
      
    themes: {
      light: {
        primary: '#0055A1',
        secondary: '#424242',
        accent: '#82B1FF',
        error: '#FF5252',
        info: '#2196F3',
        success: '#4CAF50',
        warning: '#FFC107',
        clear: '#FFFFFF',
        noinfo: '#a3a3a3',
        ready: '#00C850',
        fault:'#FF0000',
        norequired: '#C0C0C0',
        bypass: 'rgba(108,87,147,1)',
        nobypass: 'rgba(108,87,147,.5)'
      },
      dark: {
        clear: '#FFFFFF',
        noinfo: '#a3a3a3',
        ready: '#00C850',
        fault:'#FF0000',
        norequired: '#C0C0C0',
        bypass: 'rgba(108,87,147,1)',
        nobypass: 'rgba(108,87,147,.5)'
      },

    },
  },
  icons: {
    iconfont: 'md',
  },
});
