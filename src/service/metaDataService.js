import Collectable from '../model/Collectable.js';
import Size from '../model/Size.js';
import Type from '../model/Type.js';
import Dryness from '../model/Dryness.js';
import WineCategory from '../model/WineCategory.js';
import SubCategory from '../model/SubCategory.js';
import Country from '../model/Country.js';
import WineRegion from '../model/WineRegion.js';
import SubRegion from '../model/SubRegion.js';
import Vintage from '../model/Vintage.js';
import MembershipPlan from '../model/MembershipPlan.js';

export const metaDataService = {
  fetchAllMetaData: async () => {
    try {
      // Fetch all data from the different collections
      const size = await Size.find();
      const type = await Type.find();
      const drynessLevels = await Dryness.find();

      // Populate subCategories for each WineCategory
      const wineCategories = await WineCategory.find().populate({
        path: 'subCategories',
        model: SubCategory, // Ensure this matches your SubCategory model name
        select: 'name _id', // Only fetch necessary fields
      });

      // country
      const country = await Country.find().populate({
        path: 'regions',
        model: WineRegion, // Ensure this matches your WineRegion model name
        select: "region _id",
        populate: {
          path: 'subRegions',
          model: SubRegion,
          select: 'name _id',
        },
      });

      // Populate subRegions for each WineRegion
      const wineRegions = await WineRegion.find().populate({
        path: 'subRegions',
        model: SubRegion, // Ensure this matches your SubRegion model name
        select: 'name _id', // Only fetch necessary fields
      });

      const vintages = await Vintage.find();
      const membershipPlans = await MembershipPlan.find();

      // Combine the data into a single metadata object
      const metaData = {
        size,
        type,
        drynessLevels,
        wineCategories,
        country,
        wineRegions,
        vintages,
        membershipPlans,
      };

      return metaData;
    } catch (error) {
      throw new Error(`Error fetching metadata: ${error.message}`);
    }
  },
};
