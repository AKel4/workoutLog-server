const router = require('express').Router();
let validateJWT = require('../middleware/validate-jwt');
const { LogModel } = require('../models');

router.get('/practice', validateJWT, (req, res) => {
    res.send('Practice route')
});

//! CREATE LOG:
router.post('/create', validateJWT, async (req, res) => {
    const { description, definition, result } = req.body.log;
    const { id } = req.user;

    const logEntry = {
        description,
        definition,
        result,
        owner: id
    }
    try {
        const newLog = await LogModel.create(logEntry);
        res.status(200).json(newLog)
    } catch (err) {
        res.status(500).json({ error: err });
    }
})

//! GET LOG BY USER:
router.get('/log', validateJWT, async (req, res) => {
    let { id } = req.user;
    try {
        const userLogs = await LogModel.findAll({
            where: {
                owner: id
            }
        });
        res.status(200).json(userLogs);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});


//! GET LOG BY ID:
router.get('/:entryId', async (req, res) => {
    const  entryId  = req.log.id;
    try {
        const results = await LogModel.findAll({
            where: { id: entryId }
        });
        res.status(200).json(results);
    }  catch (err) {
        res.status(500).json({ error: err });
    }
});








//! UPDATE LOG BY ID:
router.put('/update/:entryId', async (req, res) => {
    const { description, definition, result } = req.body.log;
    const logId = req.params.entryId;
    const userId = req.user.id;

    const query = {
        where: {
            id: logId,
            owner: userId
        }
    };

    const updatedLog = {
        description: description,
        definition: definition,
        result: result
    };

    try {
        const update = await LogModel.update(updatedLog, query);
        res.status(200).json(update);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});












//! DELETE LOG BY ID:
router.delete('/delete/:entryId', validateJWT, async (req, res) => {
    const ownerId = req.user.id;
    const logId = req.params.id;

    try {
        const query = {
            where: {
                id: logId,
                owner: ownerId
            }
        };

        await LogModel.destroy(query);
        res.status(200).json({ message: 'Log Entry Removed' });
    } catch (err) {
        res.status(500).json({ error: err });
    }
});




module.exports = router;