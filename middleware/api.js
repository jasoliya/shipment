export function apiEndPoints(app) {
    app.get('/', async (req, res) => {
        res.status(200).send({success: true});
    });
}