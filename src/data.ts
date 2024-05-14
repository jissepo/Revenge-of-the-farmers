import { GameData } from './types/worker/gameData';
import { PlantAttributes, PlantType } from './types/enums';

const data: GameData = {
  plants: [
    {
      name: 'Beetroot',
      description: 'The beet is a plant whose root, leaves, and stems are all edible. It is a member of the Amaranthaceae family.',
      icon: 'plant-icons/beetroot.png',
      cellImagesFolder: 'plants/beetroot',
      stats: {
        attack: 1,
        speed: 1750,
        growthTime: 5,
        harvestValue: 7,
        cost: 5,
      },
      type: PlantType.VEGETABLE,
      attributes: [
        PlantAttributes.CULINARY,
        PlantAttributes.EDIBLE,
      ],
    },
    {
      name: 'Carrot',
      description: 'The carrot is a root vegetable, usually orange in color, though purple, black, red, white, and yellow cultivars exist.',
      icon: 'plant-icons/carrot.png',
      cellImagesFolder: 'plants/carrot',
      stats: {
        attack: 3,
        speed: 2000,
        // growthTime: 120,
        growthTime: 1,
        harvestValue: 20,
        cost: 17,
      },
      type: PlantType.VEGETABLE,
      attributes: [
        PlantAttributes.CULINARY,
        PlantAttributes.EDIBLE,
      ],
    },
    {
      name: 'Cotton',
      description: 'Cotton is a soft, fluffy staple fiber that grows in a boll, or protective case, around the seeds of the cotton plants of the genus Gossypium in the mallow family Malvaceae.',
      icon: 'plant-icons/cotton.png',
      cellImagesFolder: 'plants/cotton',
      stats: {
        attack: 1,
        speed: 2000,
        // growthTime: 75,
        growthTime: 1,
        harvestValue: 25,
        cost: 10,
      },
      type: PlantType.CROP,
      attributes: [
        PlantAttributes.TEXTILE,
        PlantAttributes.FIBER,
      ],
    },
    {
      name: 'Tomato',
      description: 'The tomato is the edible berry of the plant Solanum lycopersicum, commonly known as a tomato plant.',
      icon: 'plant-icons/tomato.png',
      cellImagesFolder: 'plants/tomato',
      stats: {
        attack: 6,
        speed: 4500,
        // growthTime: 180,
        growthTime: 1,
        harvestValue: 15,
        cost: 30,
      },
      type: PlantType.FRUIT,
      attributes: [
        PlantAttributes.CULINARY,
        PlantAttributes.EDIBLE,
      ],
    },
  ],
};

export default data;
