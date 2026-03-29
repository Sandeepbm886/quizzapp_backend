export const requireRole = (role) => (req, res, next) => {
    const userRole = req.headers.userrole;

    if (!userRole) {
        return res.status(401).json({
            message: "userrole header is required"
        });
    }

    if (userRole !== role) {
        return res.status(403).json({
            message: `Only ${role}s can access this route`
        });
    }

    next();
};

export const requireTeacher = requireRole("teacher");
export const requireStudent = requireRole("student");
