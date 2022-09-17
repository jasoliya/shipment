export function apiEndPoints(app) {
    app.post('/bundle/add', async (req, res) => {
        res.status(200).send({success: req.body});
    });
}