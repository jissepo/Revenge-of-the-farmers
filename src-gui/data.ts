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
        speed: 750,
        growthTime: 15,
        harvestValue: 12,
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
        speed: 3000,
        growthTime: 35,
        harvestValue: 30,
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
        speed: 2200,
        growthTime: 75,
        harvestValue: 40,
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
        attack: 8,
        speed: 4500,
        growthTime: 120,
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
