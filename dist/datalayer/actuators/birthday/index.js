import BirthdayModel from '../../models/Birthday';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import { getCurrentTime, MONTHS_LABEL } from '../../../utils';
dayjs.extend(utc);
export const getAllBirthdays = async () => {
    try {
        const day = dayjs();
        const allBirthdays = await BirthdayModel.find().sort({ month: 1, day: 1 }).lean();
        return allBirthdays.map(el => {
            return {
                user: el.user,
                years: day.get('year') - el.year,
                formatedDate: ' ' + el.day + ' de ' + MONTHS_LABEL[el.month],
                month: el.month,
                day: el.day
            };
        });
    }
    catch (error) {
        console.log(`[${getCurrentTime()}] Error getAllBirthdays:`, error);
        return [];
    }
};
export const notifyBirthday = async () => {
    try {
        const birthdays = await getTodayBirthdays();
    }
    catch (error) {
        console.log(`[${getCurrentTime()}] Error notifyBirthday:`, error);
    }
};
export const getTodayBirthdays = async () => {
    try {
        const day = dayjs();
        const todayBirthdays = await BirthdayModel.find({
            month: day.get('month') + 1,
            day: day.get('date')
        }).lean();
        return todayBirthdays.map(el => {
            return {
                user: el.user,
                years: day.get('year') - el.year
            };
        });
    }
    catch (error) {
        console.log(`[${getCurrentTime()}] Error getTodayBirthdays:`, error);
        return [];
    }
};
export const addBirthday = async (message, author) => {
    try {
        // const {user, year, month, day} = parseBirhdayMessage(message)
        const msgBirthday = parseBirhdayMessage(message);
        if (!msgBirthday) {
            return "Error al parsear el mensaje, revisa el formato monse !";
        }
        const birthday = {
            user: msgBirthday.user,
            year: msgBirthday.year,
            month: msgBirthday.month,
            day: msgBirthday.day,
            addedBy: author
        };
        const newBirthday = await BirthdayModel.create(birthday);
        return "Cumple de " + newBirthday.user + " agregado !";
    }
    catch (error) {
        console.log(`[${getCurrentTime()}] Error addBirthday:`, error);
        return "Error agregando cumpleaños, prueba denuevo monse !";
    }
};
export const parseBirhdayMessage = (message) => {
    try {
        const user_idx = message.indexOf("user");
        const message_user = message.substring(user_idx).split("'")[1];
        const date_idx = message.indexOf("fecha");
        const message_fecha = message.substring(date_idx).split("'")[1];
        const [year, month, day] = message_fecha.split("-");
        return {
            user: message_user,
            year: parseInt(year),
            month: parseInt(month),
            day: parseInt(day)
        };
    }
    catch (error) {
        console.log(`[${getCurrentTime()}] Error parseBirhdayMessage:`, error);
    }
};
export const formatAllBirthdays = (birhtdayMessages) => {
    try {
        const day = dayjs();
        const current_day = day.get('date');
        const current_month = day.get('month') + 1;
        const finalMessage = 'Lista de cumpleaños: \n' + birhtdayMessages.map((elem) => {
            if (elem.month > current_month || (elem.month == current_month && elem.day > current_day)) {
                return '    ' + elem.user + ' cumplira ' + elem.years + ' años el ' + elem.formatedDate;
            }
            else {
                return '    ' + elem.user + ' cumplio ' + elem.years + ' años el ' + elem.formatedDate;
            }
        }).join('\n');
        return finalMessage;
    }
    catch (error) {
        console.log(`[${getCurrentTime()}] Error formatAllBirthdays:`, error);
    }
};
