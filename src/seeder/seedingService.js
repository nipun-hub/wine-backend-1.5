import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Import your seeding data
import {
    // collectablesData,
    sizeData,
    typeData,
    drynessData,
    wineCategoriesData,
    wineRegionsData,
    vintagesData,
    membershipPlansData,
} from './seeding-data.js';

// Import your models
// import Collectable from '../model/Collectable.js';
import Size from '../model/Size.js';
import Type from '../model/Type.js';
import Dryness from '../model/Dryness.js';
import WineCategory from '../model/WineCategory.js';
import SubCategory from '../model/SubCategory.js';
import WineRegion from '../model/WineRegion.js';
import Country from '../model/Country.js';
import SubRegion from '../model/SubRegion.js';
import Vintage from '../model/Vintage.js';
import MembershipPlan from '../model/MembershipPlan.js';

dotenv.config();

/**
 * Seed data if the collection is empty.
 */
async function seedIfEmpty(model, dataList) {
    const count = await model.countDocuments();
    if (count === 0) {
        console.log(`Seeding ${model.modelName}...`);
        await model.insertMany(dataList);
        // console.log(`${model.modelName} data seeded successfully.`);
    } else {
        // console.log(`${model.modelName} already has data. Skipping seeding.`);
    }
}

/**
 * Seed nested documents with parent reference.
 */
async function seedNestedDocumentsWithReference(parentModel, nestedModel, parentDataList, parentField, nestedField) {
    for (const item of parentDataList) {
        // Dynamically detect whether to use `region` or `name` field based on the parent model
        const uniqueField = parentModel.modelName === 'WineRegion' ? 'region' : 'name';

        const existingParent = await parentModel.findOne({ [uniqueField]: item[uniqueField] });
        if (!existingParent) {
            // console.log(`Seeding ${parentModel.modelName}: ${item[uniqueField]}...`);

            // Create the parent document with the correct unique field
            const parentDoc = await parentModel.create({ [uniqueField]: item[uniqueField] });

            const nestedDocs = item[nestedField].map(subItem => ({
                ...subItem,
                [parentField]: parentDoc._id,
            }));

            const insertedNestedDocs = await nestedModel.insertMany(nestedDocs);

            parentDoc[nestedField] = insertedNestedDocs.map(doc => doc._id);
            await parentDoc.save();

            // console.log(`Nested documents for ${parentModel.modelName} seeded successfully.`);
        } else {
            // console.log(`${parentModel.modelName} ${item[uniqueField]} already exists. Skipping nested seeding.`);
        }
    }
}

async function seedCountryWineRegionSubRegion() {
    for (const countryData of wineRegionsData) {
        try {
            // Check if the country already exists
            let country = await Country.findOne({ name: countryData.country });
            if (!country) {
                // If the country doesn't exist, create a new one
                country = await Country.create({ name: countryData.country });
                console.log(`Created country: ${country.name}`);
            }

            // Check if the region already exists
            let region = await WineRegion.findOne({ region: countryData.regions[0].region });
            if (!region) {
                // If the region doesn't exist, create a new one
                region = await WineRegion.create({ region: countryData.regions[0].region });
                console.log(`Created region: ${region.region}`);
            }

            // Update the country's region field
            country.regions.push(region._id);
            await country.save();


            // Check if the sub-region already exists
            let subRegion = await SubRegion.findOne({ name: countryData.regions[0].subRegions[0].name });
            if (!subRegion) {
                // If the sub-region doesn't exist, create a new one
                subRegion = await SubRegion.create({ name: countryData.regions[0].subRegions[0].name });
                console.log(`Created sub-region: ${subRegion.name}`);
            }

            // Update the region's subRegion field
            region.subRegions.push(subRegion._id);
            await region.save();
        } catch (error) {
            console.error('Error seeding data for country:', countryData.country, error);
        }
    }
}



/**
 * Main function to seed initial data.
 */
async function seedInitialData() {
    try {
        console.log('Checking and seeding missing data...');

        // Seed collections without nested documents
        // await seedIfEmpty(Collectable, collectablesData);
        await seedIfEmpty(Size, sizeData);
        await seedIfEmpty(Type, typeData);
        await seedIfEmpty(Dryness, drynessData);
        await seedIfEmpty(Vintage, vintagesData);
        // await seedIfEmpty(MembershipPlan, membershipPlansData);

        // Seed collections with nested documents
        await seedNestedDocumentsWithReference(WineCategory, SubCategory, wineCategoriesData, 'mainCategoryId', 'subCategories');
        await seedCountryWineRegionSubRegion();

        console.log('Seeding process completed successfully.');
    } catch (error) {
        console.error('Error during seeding:', error);
    }
}

export default seedInitialData;
