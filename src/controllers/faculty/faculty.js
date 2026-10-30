import {
    getFacultyBySlug,
    getSortedFaculty
} from '../../models/faculty/faculty.js';

const facultyListPage = async (req, res, next) => {
    try {
        const sortBy = req.query.sort || 'name';
        const faculty = await getSortedFaculty(sortBy);

        res.render('faculty/list', {
            title: 'Faculty Directory',
            faculty,
            currentSort: sortBy
        });
    } catch (error) {
        next(error);
    }
};

const facultyDetailPage = async (req, res, next) => {
    try {
        const faculty = await getFacultyBySlug(req.params.facultyId);

        if (!faculty) {
            const error = new Error('Faculty member not found');
            error.status = 404;
            return next(error);
        }

        res.render('faculty/detail', {
            title: faculty.name,
            faculty
        });
    } catch (error) {
        next(error);
    }
};

export {
    facultyListPage,
    facultyDetailPage
};