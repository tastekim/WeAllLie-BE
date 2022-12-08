module.exports = (fn) => {
    try {
        return fn;
    } catch (err) {
        return err.message;
    }
};
