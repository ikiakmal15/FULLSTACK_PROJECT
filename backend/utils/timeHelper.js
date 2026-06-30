exports.formatJamMenitDetik = (jam) => {
    if (!jam) return null;
    return jam.includes(':00') ? jam : `${jam}:00`;
};