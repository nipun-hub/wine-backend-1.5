import MembershipPlan from '../model/MembershipPlan.js';

export const membershipPlanService = {
    getAll: async () => {
        try {
            const membershipPlans = await MembershipPlan.find();
            return membershipPlans;
        } catch (error) {
            throw new Error(`Error fetching Membership Plans: ${error.message}`);
        }
    },

    save: async (data) => {
        try {
            const newPlan = new MembershipPlan(data);
            const savedPlan = await newPlan.save();
            return {success: true, data: savedPlan};
        } catch (error) {
            console.error('Error saving membership plan:', error.message);
            throw new Error('Failed to save membership plan.');
        }
    },
    update: async (id, data) => {
        try {
            const updatedPlan = await MembershipPlan.findByIdAndUpdate(
                id,
                {$set: data},
                {new: true, runValidators: true} // Returns the updated document and ensures validation
            );
            if (!updatedPlan) {
                throw new Error('Membership plan not found.');
            }
            return {success: true, data: updatedPlan};
        } catch (error) {
            console.error('Error updating membership plan:', error.message);
            throw new Error('Failed to update membership plan.');
        }
    },
};
