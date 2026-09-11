const validateStore = (
    req,
    res,
    next
) => {

    const { user_name, id } = req.body;

    if (!user_name) {
        return res.status(400).json({
            error: "User name is required"
        });
    }

    if (typeof user_name !== "string") {
        return res.status(400).json({
            error: "User name must be a string"
        });
    }

    if (user_name.trim().length < 3) {
        return res.status(400).json({
            error:
            "Minimum 3 characters required"
        });
    }
    // if(!id){
    //     return res.status(400).json({
    //         error: "ID should be present in every case"
    //     })
    // }

    next();
};

module.exports = validateStore;