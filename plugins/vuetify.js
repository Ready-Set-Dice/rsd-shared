import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    themes: {
      light: {
        list: '#EAEAEA',
        details: '#fff',
        main: '#440606',
        primary: '#064444',
        secondary: '#064444',
        accent: '#f5daab',
        list_even: '#f5f5f5',
        list_odd: '#eee',
        list_hover: '#fff',
        list_drag: '#ddd',
        dead: '#cfd8dc',
        common: '#440606',
        uncommon: '#98513d',
        unique: '#54166e',
        rare: '#002664',
        inverse: "#ffffff",
        navblend: "#ffffff",
        icon_color: "#757575",
      },
      dark: {
        list: '#212121',
        details: '#000',
        main: '#272727',
        primary: '#f5daab',
        secondary: '#064444',
        accent: '#f5daab',
        list_even: '#232323',
        list_odd: '#282828',
        list_hover: '#181818',
        list_drag: '#333',
        dead: '#263238',
        common: '#440606',
        uncommon: '#98513d',
        unique: '#54166e',
        rare: '#002664',
        inverse: "#000000",
        navblend: "#363636",
        icon_color: "#ffffff",
      },
    },
  },
});
