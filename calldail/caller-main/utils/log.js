export const log = (req, note) => {
    console.log(req.ip, req.route, Date.now().toLocaleString(), req.body, note);
}