function NotFound(req, res, next) {
    res.send({
        status: 404,
        message: 'NotFound Page !'
    })
}

function ErrHandling(err, req, res, next) {
    const status = err?.status ?? err?.statuscode?? 500;
    res.send({
        statuscode: status,
        message: err?.message ?? 'Internal Server Error'
    })
}

module.exports = {
    NotFound,
    ErrHandling
}