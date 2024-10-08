const Course = require('../models/courseModel');

exports.preparePayment = async ({ click_trans_id, merchant_trans_id, amount }) => {
    try {
        const course = await Course.findOne({ _id: merchant_trans_id });

        if (!course) {
            return { error: -2, error_note: 'Course not found' };
        } else if(course.price !== amount) {
            return { error: -2, error_note: 'Invalid amount' };
        }

        return {
            click_trans_id,
            merchant_trans_id,
            merchant_prepare_id: course._id,
            error: 0,
            error_note: 'Success'
        };
    } catch (error) {
        console.error('Error in preparePayment service:', error);
        return { error: -3, error_note: 'Server error' };
    }
};