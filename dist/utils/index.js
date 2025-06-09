export const MONTHS_LABEL = {
    1: 'Enero',
    2: 'Febrero',
    3: 'Marzo',
    4: 'Abril',
    5: 'Mayo',
    6: 'Junio',
    7: 'Julio',
    8: 'Agosto',
    9: 'Setiembre',
    10: 'Octubre',
    11: 'Noviembre',
    12: 'Diciembre'
};
export const validate_dimelo = (text) => {
    const dimelo_validator = Boolean(text.toLowerCase() === 'dimelo' || text.toLowerCase() === 'dímelo' || text.toLowerCase().includes('dimelo') || text.toLowerCase().includes('dímelo'));
    const expresamelo_validator = Boolean(text.toLowerCase() === 'explayate' || text.toLowerCase().includes('explayate'));
    return dimelo_validator || expresamelo_validator;
};
export const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleString();
};
