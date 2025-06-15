import moment from 'moment';
import 'moment/locale/es';  // Importar el locale español

// Configurar moment para usar español
moment.locale('es');

// Utilidades de fecha para formatear meses
export const dateUtils = {
    formatMes: (date) => {
        return moment(date).format('YYYY-MM');
    },

    formatMesLargo: (date) => {
        return moment(date).format('MMMM YYYY');
    },

    formatMesCapitalizado: (date) => {
        const mes = moment(date).format('MMMM');
        return mes.charAt(0).toUpperCase() + mes.slice(1);
    },
};